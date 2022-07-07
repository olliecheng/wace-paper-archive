<script lang="ts">
  import * as fileManager from "../file";
  import utils from "../utils";

  export let files = {};

  interface fileObject {
    name: string;
    path: string;
    fileType: "folder" | "file";
  }

  enum FolderState {
    None = 0,
    Partial,
    All,
  }

  function getRootObjects(
    dirs: Map<string, number>,
    baseDir: string
  ): fileObject[] {
    let pathLevel = (baseDir.match(/\//g) || []).length;

    return Array.from(
      new Set(
        Object.keys(dirs).map((x) => {
          return x.split("/")[pathLevel];
        })
      )
    ).map((x) => {
      return {
        name: x,
        path: baseDir + x,
        fileType: x.indexOf(".") == -1 ? "folder" : "file",
      };
    });
  }

  function checkPartial(path): boolean {
    let nestedCount = Object.entries(checkedValues).filter(([key, value]) => {
      return value && key.startsWith(path);
    }).length;

    return nestedCount >= 1 && folders[path] > nestedCount;
  }

  function createFolderHierarchy(directory): Map<string, number> {
    let folderList = {} as Map<string, number>;

    for (let [key, _] of Object.entries(directory)) {
      let path = key.split("/");
      for (let i = 1; i < path.length; i++) {
        let subpath = path.slice(0, i).join("/");

        if (subpath in folderList) {
          folderList[subpath] += 1;
        } else {
          folderList[subpath] = 1;
        }
      }
    }

    return folderList;
  }

  async function main() {
    dirs = (await fileManager.fetchDirectoryTree()) as Map<string, number>;
    dirEntries = Object.entries(dirs);

    current_dirs = getRootObjects(dirs, "");

    folders = createFolderHierarchy(dirs);
  }

  function navigatePath(path) {
    if (!dirs) {
      // directories not loaded yet..

      setTimeout(() => {
        navigatePath(path);
      }, 500);

      return;
    }

    let navigatedDirs = Object.fromEntries(
      dirEntries.filter(([loc, size]) => {
        return loc.startsWith(path);
      })
    ) as Map<string, number>;

    current_dirs = getRootObjects(navigatedDirs, path ? path + "/" : "");

    // update navbar
    if (path) {
      navs = path.split("/");
    } else {
      navs = [];
    }
  }

  let current_dirs: fileObject[] = fileManager
    .placeholderDirectoryTree()
    .map((x) => {
      return {
        name: x,
        path: x,
        fileType: "folder",
      };
    });

  let dirs;
  let checkedValues = {};
  let folderValues = {};
  let partialValues = {};

  // Map<folder_path, child_items>
  let folders = {} as Map<string, number>;

  let dirEntries;
  let navs = [];

  function updatePartialState(path) {
    let nestedCount = Object.entries(checkedValues).filter(([key, value]) => {
      return value && key.startsWith(path);
    }).length;

    return nestedCount >= 1 && folders[path] > nestedCount;
  }

  function updateFolderState(path) {
    let currentFileHierarchy = createFolderHierarchy(
      Object.fromEntries(
        Object.entries(checkedValues).filter(([_, value]) => {
          return value;
        })
      )
    );

    let folderStatus = utils.objectMap(currentFileHierarchy, (path, size) => {
      if (size === folders[path]) {
        return [path, FolderState.All];
      } else if (size === 0) {
        return [path, FolderState.None];
      }

      return [path, FolderState.Partial];
    });

    partialValues = utils.objectMap(folderStatus, (path, state) => {
      if (state === FolderState.Partial) {
        return [path, 1];
      }
      return;
    });

    folderValues = utils.objectMap(folderStatus, (path, state) => {
      if (state === FolderState.All) {
        return [path, 1];
      }
      return [path, 0];
    });

    files = utils.objectMap(checkedValues, (path, selected) => {
      if (selected) {
        return [path, dirs[path]];
      }
      return;
    });

    // files = Object.entries(checkedValues).reduce((arr, [path, selected]) => {
    //   if (selected) {
    //     return [...arr, path];
    //   }
    //   return arr;
    // }, []);
  }

  function updateFileState(path) {
    // affects if the files inside the folder are selected or unselected
    let selectFiles = folderValues[path];

    let changedValues = Object.fromEntries(
      dirEntries.reduce((ret, [filepath, value]) => {
        if (filepath.startsWith(path)) {
          let subfile = [filepath, selectFiles];

          return [...ret, subfile];
        }
        return ret;
      }, [])
    );

    checkedValues = Object.assign({}, checkedValues, changedValues);

    updateFolderState(path);
  }

  main();
</script>

<div class="path">
  <i
    class="bi bi-caret-left-fill nav-back-button"
    on:click={() => {
      navigatePath(navs.slice(0, -1).join("/"));
    }}
    class:hidden={!navs.length}
  />
  <span class="nav-obj" on:click={() => navigatePath("")}>All Papers</span>
  <span class="nav-separator">&nbsp;/&nbsp;</span>

  {#each navs as nav, i}
    <span
      class="nav-obj"
      on:click={() => {
        navigatePath(navs.splice(0, i + 1).join("/"));
      }}
    >
      {utils.internalToDisplayName(nav)}
    </span>
    <span class="nav-separator">&nbsp;/&nbsp;</span>
  {/each}
</div>
<table class="selector">
  <tr class="header-row">
    <th class="obj-checkbox obj-header" />
    <th class="obj-cell">Name</th>
  </tr>

  {#each current_dirs as dir}
    <tr class="obj-row">
      <td
        class="obj-checkbox"
        class:partially-selected={partialValues[dir.path]}
      >
        {#if dir.fileType === "file"}
          <input
            type="checkbox"
            bind:checked={checkedValues[dir.path]}
            on:change={(e) => {
              updateFolderState(dir.path);
            }}
          />
        {:else}
          <input
            type="checkbox"
            bind:checked={folderValues[dir.path]}
            on:change={() => {
              updateFileState(dir.path);
            }}
          />
        {/if}
      </td>
      <td class="obj-cell">
        {#if dir.fileType === "file"}
          <i class="bi bi-file-earmark-richtext" />
        {:else}
          <i class="bi bi-folder2" />
        {/if}

        {#if dir.fileType === "file"}
          <div class="obj">
            <a href={fileManager.BASE_URL + "/" + dir.path} target="blank">
              {utils.internalToDisplayName(dir.name)}
            </a>
          </div>
        {:else}
          <div class="obj" on:click={() => navigatePath(dir.path)}>
            {utils.internalToDisplayName(dir.name)}
          </div>
        {/if}
      </td>
    </tr>
  {/each}
  <!-- <div class="header">Header</div> -->
</table>

<style lang="scss">
  @import "../vars.scss";

  .path {
    margin-bottom: 10px;
    margin-top: 30px;

    font-size: 18px;

    // remove space between spans
    display: flex;
    flex-wrap: wrap;

    .nav-obj {
      cursor: pointer;
      color: $accent-color;

      &:hover {
        text-decoration: underline;
      }
    }

    .nav-back-button {
      cursor: pointer;
      margin-right: 5px;
      transition: opacity 0.3s;
      opacity: 1;

      &.hidden {
        opacity: 0;
      }
    }
  }

  .selector {
    font-size: 18px;

    border-radius: 10px 10px 0 0;
    border: 2px solid $accent-color;

    border-spacing: 0;

    background-color: $sidebar-color;
    // padding: 10px 20px;
    width: 100%;

    .obj-row {
      background-color: white;
    }

    .obj-checkbox {
      padding: 2px 6px 2px 10px;

      width: 16px;

      &.partially-selected {
        input {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' %3E%3Cg %3E%3Cg fill='%231263d4' %3E%3Cpath d='M0,0 L16,0 L16,16 L0,16 L0,0 Z M3,6 L3,9 L13,9 L13,6 L3,6 Z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          background-position: -1px 0px;
        }
      }

      input {
        border-color: rgb(49, 49, 49);
        border-radius: 5px;
        border-width: 1px;

        -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
        -moz-box-sizing: border-box; /* Firefox, other Gecko */
        box-sizing: border-box;

        height: 16px;
        width: 16px;

        cursor: pointer;

        transition: background-color 0.2s ease 0s, border-color 0.1s ease 0s;

        // enables checkboxes to be styled by CSS
        appearance: none;
        margin: 0;

        &:hover {
          border-color: rgb(1, 45, 106);
          background-color: rgb(232, 241, 253);
          // border-width: 2px;
        }

        &:checked {
          border-color: rgb(1, 45, 106);
          // background-color: #1263d4;

          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' %3E%3Cg %3E%3Cg fill='%231263d4' %3E%3Cpath d='M0,0 L16,0 L16,16 L0,16 L0,0 Z M14,4.57911065 L12.4208893,3 L6.26344364,9.1582213 L3.57911065,6.47388831 L2,8.05222337 L6.26344364,12.315667 L14,4.57911065 Z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          background-position: -1px 0px;
        }
      }
    }

    .obj-cell {
      padding: 2px 20px 2px 8px;
      display: flex;

      flex-direction: row;
      justify-content: flex-start;
      border-radius: 10px;

      .obj {
        &:hover {
          text-decoration: underline;
          cursor: pointer;
        }
      }

      i {
        padding-right: 5px;
      }
    }

    th {
      font-weight: 500;
      text-align: left;

      line-height: 1.8em;

      &.obj-cell {
        padding-top: 0.5px;
        padding-bottom: 3.5px;
      }
    }
  }
</style>
