import json

import boto3

print("Setting up R2/S3...")

s3 = boto3.resource(
    "s3",
    endpoint_url="https://db6514a0bc8a51ba46387cc1b3fd6e7c.r2.cloudflarestorage.com",
)


bucket = s3.Bucket("wace-papers")

current_files = {item.key: item.size for item in bucket.objects.all()}


print("Current number of objects:", len(current_files))
print("Size of existing bucket:", sum(current_files.values()))
# print("Size of existing bucket:", sum(x[1] for x in current_files))

filedir = json.dumps(current_files)

bucket.put_object(Body=filedir, Key="root.json")
