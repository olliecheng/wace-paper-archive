<div class="sidebar">
  <div class="internal-container">
    <h2>
      <a href="https://olliecheng.me/" target="_blank">olliecheng.me/papers</a>
    </h2>
    <h1><strong>WACE</strong> Exam<br />Archive</h1>
    <p>
      A collection of many old official WACE examination papers, from 2007
      onwards. Many of these have been removed from the official website.
    </p>

    <ul class="nav">
      <li><a href="//" target="blank">ATAR & Scaling Calculator</a></li>
      <li><a href="//" target="blank">How Scaling Works</a></li>
      <br />
      <li><a href="//" target="blank">About Me</a></li>
      <li><a href="//" target="blank">UCAT tips</a></li>
      <li><a href="//" target="blank">WACE Resources Guide</a></li>
    </ul>
  </div>
</div>

<style lang="scss">
  @import "../vars.scss";

  .sidebar {
    height: 100%;

    // adjust width:
    @include xs {
    }

    @include sm {
      width: $sidebar-width-small;
    }

    @include lg {
      width: $sidebar-width-large;
    }

    position: fixed;
    left: 0;
    top: 0;
    background-color: $sidebar-color;

    font-family: $sans-serif;
    color: black;

    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    box-sizing: border-box;

    a:visited {
      color: black;
    }

    a {
      color: black;
    }

    .internal-container {
      overflow-y: scroll;
      overflow-x: hidden;
      padding: 34px;
    }

    h1 {
      font-size: 45px;
      font-weight: 400;
      line-height: 111%;

      margin: 0 0 31px 0;
    }

    h2 {
      font-weight: 400;
      margin: 0 0 10px 0;
      text-decoration: none;
    }

    p {
      font-family: $serif;
      font-size: 22px;
      line-height: 118%;
      color: $sidebar-para-color;

      margin: 0 0 31px 0;
    }

    ul {
      list-style-type: none;
      margin: 0;
      padding: 0;

      li {
        font-size: 20px;
        text-decoration: underline;
      }
    }
  }
</style>
