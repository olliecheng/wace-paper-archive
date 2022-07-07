<script lang="ts">
  import App from "../App.svelte";
  import { download, BASE_URL, FileObject } from "../file";
  import FileSelector from "./FileSelector.svelte";
  import Sidebar from "./Sidebar.svelte";

  let files = {} as Map<string, number>;
  let fileSize: number;
  let fileCount: number;

  const IS_SAFARI = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  let downloading: boolean = false;
  let downloadPercent = 0;

  $: fileSize = Math.round(
    Object.values(files)
      // sum and convert to MB
      .reduce((a, b) => a + b, 0) / 1048576
  );

  $: fileCount = Object.keys(files).length;

  function downloadFiles() {
    if (!fileCount || downloading) {
      return;
    }

    downloading = true;

    let fileStructure: FileObject[] = Object.entries(files).map(
      ([path, size]) => {
        return {
          path: path,
          url: BASE_URL + "/" + encodeURI(path),
          size: size,
        };
      }
    );

    download(
      fileStructure,
      () => {
        downloading = false;
      },
      (percent) => {
        downloadPercent = percent;
      }
    );
  }
</script>

<div class="container">
  <div class="top-bar">
    <div class="size">
      Selected file size: {fileSize}<span style="font-size: 16px">&nbsp;MB</span
      >
    </div>
    <div
      class="download-btn"
      on:click={downloadFiles}
      class:disabled={!fileCount}
    >
      <!--
        downloading: true -> "Downloading..."
        fileCount != 0 ->
          fileCount == 1: Download 1 file
          fileCount != 1: Download ${fileCount} files
        fileCount == 0 -> No files selected
      -->

      {downloading
        ? `Downloading: ${downloadPercent}%`
        : fileCount
        ? `Download ${fileCount} ` + (fileCount === 1 ? "file" : "files")
        : "No files selected"}
    </div>
  </div>

  <div class="desc">
    {#if IS_SAFARI}
      <strong>
        Bulk downloading is a little weird on Safari due to browser constraints.
        If it doesn't work, try Chrome instead.
      </strong>

      <br /><br />
    {/if}

    Credit to
    <a href="https://github.com/peter-tanner" target="blank">Peter Tanner</a>
    for his work in compiling the original
    <a href="https://atar-wace-archive.github.io" target="blank"
      >WACE ATAR archive</a
    >. This site is intended to make the papers he found easier to access and
    download.

    <br /><br />

    Not enough questions?
    <a href="https://olliecheng.me/wace-resources-guide" target="blank"
      >I discuss my preferred resources for studying here.</a
    ><br /><br />
    Good luck to all students! You got this 💕

    <br /><br />

    <strong>Warning:</strong> papers prior to 2016 follow a different syllabus. It
    is recommended to approach these papers with caution. Stage 3 papers reflect
    a difficulty similar to current WACE.
  </div>

  <FileSelector bind:files />
</div>

<style lang="scss">
  @import "../vars.scss";

  .container {
    padding: 30px 50px;
    font-size: 20px;
  }

  .top-bar {
    display: flex;

    width: 100%;

    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    margin-bottom: 30px;

    .size {
      font-weight: 600;
    }

    .download-btn {
      color: white;
      background-color: $accent-color;

      padding: 5px 15px;

      border-radius: 5px;

      border: solid 3px $accent-color;

      position: fixed;
      right: 60px;

      // prevents border from changing size of div
      -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
      -moz-box-sizing: border-box; /* Firefox, other Gecko */
      box-sizing: border-box; /* Opera/IE 8+ */

      box-shadow: 5px 5px 10px rgba(1, 1, 1, 0.2);

      transition: 0.2s;

      &:hover:not(.disabled) {
        cursor: pointer;
        color: $accent-color;
        background-color: $accent-color-faded;
      }

      &.disabled {
        cursor: not-allowed;
      }
    }
  }

  .desc {
    line-height: 1.3em;
    font-size: 18px;

    margin-bottom: 20px;
  }
</style>
