import concurrent.futures
import re
import string
import sys
from dataclasses import dataclass
from io import BytesIO
from threading import Lock
from time import perf_counter, sleep
from typing import Optional

import boto3
import requests
from dotenv import load_dotenv

load_dotenv()


@dataclass
class ArchivedFile:
    name: str
    path: str
    url: str


@dataclass
class StoredFile:
    name: str
    size: Optional[int]


def recursivelyIterate(dirs, path=""):
    for dir in dirs:
        newPath = path + "/" + dir["text"]
        if "children" in dir:
            yield from recursivelyIterate(dir["children"], newPath)
        elif "type" in dir:
            # newPath[6:] to remove "/ROOT/"
            if dir["text"] == "no_file_in_source":
                yield from []  # empty
            else:
                url = re.sub(
                    r"web.archive.org/(\d+)/", r"web.archive.org/web/\1id_/", dir["url"]
                )
                yield ArchivedFile(name=dir["text"], path=newPath[6:], url=dir["url"])


def downloadAndUpload(url: str, path: str, index: int, lock: Lock) -> None:
    import traceback

    try:
        req = requests.get(url)

        bucket.upload_fileobj(BytesIO(req.content), path)

        size = req.headers.get("x-archive-orig-content-length")
        with lock:
            newFileDir[index].size = size

        # print(f"Downloaded and uploaded file {path} with size {size}")
    except requests.exceptions.ConnectionError:
        print(f"Could not download file {path} at location {url}")
    except Exception as e:
        traceback.print_exc()
        print(url, path, index, lock)
        raise e


print("Getting `root.json`...")
root = requests.get(
    "https://raw.githubusercontent.com/atar-wace-archive/atar-wace-archive.github.io/master/root.json"
).json()

print("Setting up R2/S3...")

s3 = boto3.resource(
    "s3",
    endpoint_url="https://db6514a0bc8a51ba46387cc1b3fd6e7c.r2.cloudflarestorage.com",
)


bucket = s3.Bucket("wace-papers")
current_files = [
    StoredFile(name=item.key, size=item.size) for item in bucket.objects.all()
]

print("Current number of objects:", len(current_files))
print("Size of existing bucket:", sum(x.size or 0 for x in current_files))


newFileDir = []
lock = Lock()
futures = []

with concurrent.futures.ThreadPoolExecutor(max_workers=10) as Executor:
    for index, file in enumerate(recursivelyIterate(root)):
        existingFile = next(filter(lambda x: x.name == file.path, current_files), None)

        if existingFile:
            print("Skipping existing file", file.path)
            with lock:
                newFileDir.append(existingFile)
            continue
        else:
            # add file, leaving size empty to be filled in later
            with lock:
                newFileDir.append(StoredFile(name=file.path, size=None))

            f = Executor.submit(downloadAndUpload, file.url, file.path, index, lock)
            futures.append(f)

    try:
        done, not_done = concurrent.futures.wait(
            futures, return_when=concurrent.futures.FIRST_EXCEPTION
        )
        # check if not all tasks are done
        if len(done) > 0 and len(done) != len(futures):
            # check if an exception was raised
            future = done.pop()
            if future.exception() != None:
                print(f"One task failed with: {future.exception()}, shutting down")
                # cancel any scheduled tasks
                for future in futures:
                    future.cancel()
    except KeyboardInterrupt:
        print("Exiting...")
        for future in futures:
            future.cancel()
        print("Quit.")
    sys.exit()
