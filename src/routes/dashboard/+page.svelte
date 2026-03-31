<script lang="ts">
	import { onMount } from 'svelte';
	import type { DeliveryStatus } from '$lib/types';

	type Summary = Record<DeliveryStatus, number>;

	let summary = $state<Summary>({
		queued: 0,
		sent: 0,
		delivered: 0,
		read: 0,
		failed: 0
	});

	async function loadStatus() {
		const response = await fetch('/api/status');
		const data = await response.json();
		summary = data.summary;
	}

	async function simulate() {
		await fetch('/api/webhooks/simulate', { method: 'POST' });
		await loadStatus();
	}

	onMount(loadStatus);
</script>

<section>
	<h1>Automation Overview</h1>
	<p>Simulate webhook events and monitor message lifecycle metrics.</p>

	<div class="kpi-grid">
		{#each Object.entries(summary) as [label, value] (label)}
			<article class="kpi-card">
				<h3>{label}</h3>
				<p>{value}</p>
			</article>
		{/each}
	</div>

	<button class="primary" onclick={simulate}>Simulate status event</button>
</section>
