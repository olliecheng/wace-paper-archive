<script lang="ts">
	import { download, BASE_URL } from '../file';
	import type { FileObject } from '../file';
	import FileSelector from './FileSelector.svelte';

	import { browser } from '$app/env';

	let files = {} as Map<string, number>;
	let fileSize: number;
	let fileCount: number;

	let IS_SAFARI = false;
	if (browser) {
		IS_SAFARI = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
	}

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

		let fileStructure: FileObject[] = Object.entries(files).map(([path, size]) => {
			return {
				path: path,
				url: BASE_URL + '/' + encodeURI(path),
				size: size
			};
		});

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
			Selected file size: {fileSize}<span style="font-size: 16px">&nbsp;MB</span>
		</div>
		<div class="download-btn" on:click={downloadFiles} class:disabled={!fileCount}>
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
				? `Download ${fileCount} ` + (fileCount === 1 ? 'file' : 'files')
				: 'No files selected'}
		</div>
	</div>

	<div class="desc">
		Hi everybody, Ollie here. Given recent copyright shenanegans, I have made the difficult decision to
		take down the public-facing papers archive webpage. I will do my best to enable the distribution of
		valuable resources to students, but unfortunately I've decided that I don't have the energy or time
		to fight copyright issues.

		<br /><br />

		Keep an eye on the "WACE Dungeon" Discord, where you may be able to find useful resources. Also, check
		out the code for this webpage!

		<br /><br />

		As usual, best of luck with exams everybody. The fact that you're even here is a testament to your dedication
		to excellence and you should be proud of yourself, no matter how the numbers end up.
		
		<s>
		{#if IS_SAFARI}
			Bulk downloading can be a little weird on Safari due to browser constraints. If it doesn't
			work, try Chrome instead.

			<br /><br />
		{/if}

		Credit to
		<a href="https://github.com/peter-tanner" target="blank">Peter Tanner</a>
		for his work in compiling the original
		<a href="https://atar-wace-archive.github.io" target="blank">WACE ATAR archive</a>. This site is
		intended to make the papers he found easier to access and download.

		<br /><br />

		Not enough questions?
		<a href="https://olliecheng.me/wace-resources-guide" target="blank"
			>I discuss my preferred resources for studying here.</a
		><br /><br />
		Good luck to all students! You got this 💕

		<br /><br />

		<strong>Warning:</strong> papers prior to 2016 follow a different syllabus. It is recommended to
		approach these papers with caution. Stage 3 papers reflect a difficulty similar to current WACE.
		</s>
	</div>

	<!-- <FileSelector bind:files /> -->

	<div class="desc" style="margin-top: 30px;">
		Source code for this website: <a
			href="https://github.com/denosawr/wace-paper-archive"
			target="blank">GitHub</a
		><br />
		Source code for Peter's WACE Exam Archive:
		<a href="https://github.com/atar-wace-archive/atar-wace-archive.github.io" target="blank"
			>GitHub</a
		>
	</div>
</div>

<style lang="scss">
	@import '../vars.scss';

	.container {
		@include xs {
			padding: 30px 34px;
		}

		@include sm {
			padding: 30px 50px;
		}
		font-size: 20px;
	}

	.top-bar {
		width: 100%;

		display: flex;
		@include xs {
			flex-direction: column-reverse;
		}
		@include sm {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}

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

			width: fit-content;

			@include sm {
				position: fixed;
				right: 60px;
			}

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
