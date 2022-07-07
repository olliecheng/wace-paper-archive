<script lang="ts">
  export const name = "WACE Papers";
  import Sidebar from "./components/Sidebar.svelte";
  import Main from "./components/Main.svelte";
</script>

<svelte:head>
  <link rel="stylesheet" href="https://use.typekit.net/qly8eqv.css" />
  <style>
    body {
      padding: 0;
    }
  </style>
</svelte:head>

<Sidebar />
<main>
  <Main />
</main>

<style lang="scss">
  @import "./vars.scss";

  main {
    font-family: $sans-serif;

    max-width: 240px;
    margin: 0 0 0 $sidebar-width;

    box-sizing: border-box;
    height: 100%;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
