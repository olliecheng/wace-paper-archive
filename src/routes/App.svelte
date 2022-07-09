<script lang="ts">
	export const name = 'WACE Papers';

	export const prerender = true;

	import Sidebar from './_components/Sidebar.svelte';
	import Main from './_components/Main.svelte';
</script>

<svelte:head>
	<link rel="stylesheet" href="https://use.typekit.net/qly8eqv.css" />
	<style>
		body {
			padding: 0;
		}
	</style>
	<base href="/papers" />
	<title>WACE Archive</title>

	<meta name="theme-color" content="#400d67" />
	<meta name="author" content="Oliver Cheng" />
	<meta name="description" content="A collection of past official WACE examination papers." />
	<meta name="keywords" content="WACE, SCSA, exam, past papers" />

	<script
		data-goatcounter="https://olliecheng.goatcounter.com/count"
		async
		src="//gc.zgo.at/count.js"></script>
</svelte:head>

<Sidebar />
<main>
	<Main />
</main>

<style lang="scss">
	@import './vars.scss';

	main {
		font-family: $sans-serif;

		margin: 0;

		@include sm {
			margin-left: $sidebar-width-transition;
		}

		@include lg {
			margin-left: $sidebar-width-large;
		}

		box-sizing: border-box;
		height: 100%;
	}
</style>
