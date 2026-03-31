<script lang="ts">
	import { resolve } from '$app/paths';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="app-bg">
	<header class="topbar">
		<a href={resolve('/')} class="brand">WA Automate Lab</a>
		<a href={resolve('/dashboard')} class="top-link">Open dashboard</a>
	</header>
	{@render children()}
</div>
