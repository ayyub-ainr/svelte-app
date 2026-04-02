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

	onMount(() => {
		void loadStatus();
		const intervalId = setInterval(() => {
			void loadStatus();
		}, 5000);

		return () => clearInterval(intervalId);
	});
</script>

<section>
	<h1>Analytics</h1>
	<p>Track campaign outcomes from simulated WhatsApp delivery events.</p>
	{#if total === 0}
		<p class="empty-state">
			No analytics yet. Generate events from Overview or Campaigns to see rates.
		</p>
	{/if}

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

	<aside class="learn-note">
		<h3>Learning Note</h3>
		<p>
			The analytics cards use `$derived` values from a shared status summary model, making metrics
			deterministic and easy to migrate to a real provider later.
		</p>
	</aside>
</section>
