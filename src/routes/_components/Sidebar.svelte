<div class="sidebar">
	<div class="internal-container">
		<h2>
			<a href="https://olliecheng.me/" target="_blank">olliecheng.me/papers</a>
		</h2>
		<h1><strong>WACE</strong> Exam<br />Archive</h1>
		<p>
			A collection of many old official WACE examination papers, from 2007 onwards. Many of these
			have been removed from the official website.
		</p>

		<p>
			Interested in tutoring from 99.9+ ATAR tutors? I write all the teaching resources I use, to ensure
			my students get the best possible lesson. We do small group classes - check us out at
			<a href="https://checkpointeducation.com.au" target="blank">https://checkpointeducation.com.au</a>.
		</p>

		<ul class="nav">
			<!-- <li><a href="//" target="blank">ATAR & Scaling Calculator</a></li>
			<li><a href="//" target="blank">How Scaling Works</a></li>
			<br /> -->
			<li><a href="https://olliecheng.me" target="blank">About Me</a></li>
			<li><a href="https://olliecheng.me/ucat-tips" target="blank">UCAT tips</a></li>
			<li>
				<a href="https://olliecheng.me/wace-resources-guide" target="blank">WACE Resources Guide</a>
			</li>
		</ul>
	</div>
</div>

<style lang="scss">
	@import '../vars.scss';

	.sidebar {
		// adjust width:
		@include xs {
			min-height: 80%;
		}

		.internal-container {
			// Blink, Safari
			&::-webkit-scrollbar {
				display: none;
			}

			-ms-overflow-style: none; /* IE and Edge */
			scrollbar-width: none; /* Firefox */
		}

		@include sm {
			// width: $sidebar-width-small;
			width: $sidebar-width-transition;

			height: 100%;

			position: fixed;
			left: 0;
			top: 0;

			.internal-container {
				overflow-y: scroll;
				overflow-x: hidden;
			}
		}

		@include lg {
			width: $sidebar-width-large;
		}

		background-color: $sidebar-color;

		font-family: $sans-serif;
		color: black;

		display: flex;
		flex-direction: column;
		justify-content: flex-end;

		box-sizing: border-box;

		a {
			color: black;

			&:visited {
				color: black;
			}
		}

		.internal-container {
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
