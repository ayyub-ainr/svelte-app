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

	const total = $derived(Object.values(summary).reduce((acc, value) => acc + value, 0));
	const readRate = $derived(total > 0 ? Math.round((summary.read / total) * 100) : 0);
	const deliveryRate = $derived(total > 0 ? Math.round((summary.delivered / total) * 100) : 0);

	async function loadStatus() {
		const response = await fetch('/api/status');
		const data = await response.json();
		summary = data.summary;
	}

	onMount(loadStatus);
</script>

<section>
	<h1>Analytics</h1>
	<p>Track campaign outcomes from simulated WhatsApp delivery events.</p>

	<div class="kpi-grid">
		<article class="kpi-card">
			<h3>Total events</h3>
			<p>{total}</p>
		</article>
		<article class="kpi-card">
			<h3>Read rate</h3>
			<p>{readRate}%</p>
		</article>
		<article class="kpi-card">
			<h3>Delivery rate</h3>
			<p>{deliveryRate}%</p>
		</article>
	</div>

	<button class="primary" onclick={loadStatus}>Refresh analytics</button>
</section>
