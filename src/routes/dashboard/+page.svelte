<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { DeliveryStatus } from '$lib/types';
	import { onMount } from 'svelte';
	import type { ActionData, PageData } from './$types';
	let { data, form }: { data: PageData; form: ActionData | null } = $props();
	const statuses: DeliveryStatus[] = ['queued', 'sent', 'delivered', 'read', 'failed'];

	onMount(() => {
		const intervalId = setInterval(() => {
			void invalidateAll();
		}, 5000);

		return () => clearInterval(intervalId);
	});
</script>

<section>
	<h1>Automation Overview</h1>
	<p>
		Simulate webhook events and monitor message lifecycle metrics. Data auto-refreshes every 5
		seconds.
	</p>
	{#if form?.error}
		<p class="feedback error">{form.error}</p>
	{:else if form?.success}
		<p class="feedback ok">Simulation event added.</p>
	{/if}

	<div class="kpi-grid">
		{#each statuses as label (label)}
			<article class="kpi-card">
				<h3>{label}</h3>
				<p>{data.summary[label]}</p>
			</article>
		{/each}
	</div>

	<form method="POST" action="?/simulate" class="panel inline-form">
		<select name="status">
			<option value="">Random status</option>
			<option value="sent">sent</option>
			<option value="delivered">delivered</option>
			<option value="read">read</option>
			<option value="failed">failed</option>
		</select>
		<button class="primary" type="submit">Simulate status event</button>
	</form>

	{#if data.events.length === 0}
		<p class="empty-state">
			No events yet. Use send-now or run simulation to populate live delivery data.
		</p>
	{:else}
		<ul class="panel list">
			{#each data.events as event (event.id)}
				<li>
					<strong>{event.status}</strong>
					<span>Campaign: {event.campaignId}</span>
					<em>{event.timestamp}</em>
				</li>
			{/each}
		</ul>
	{/if}

	<aside class="learn-note">
		<h3>Learning Note</h3>
		<p>
			This page demonstrates a timed revalidation pattern using `invalidateAll()` for near-real-time
			dashboard views without adding WebSocket complexity.
		</p>
	</aside>
</section>
