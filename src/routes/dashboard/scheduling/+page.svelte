<script lang="ts">
	import { onMount } from 'svelte';
	import type { Campaign, ScheduledMessage } from '$lib/types';

	let campaigns = $state<Campaign[]>([]);
	let schedules = $state<ScheduledMessage[]>([]);
	let campaignId = $state('');
	let sendAt = $state('');

	async function loadData() {
		const [campaignRes, scheduleRes] = await Promise.all([
			fetch('/api/campaigns'),
			fetch('/api/schedules')
		]);
		campaigns = (await campaignRes.json()).campaigns;
		schedules = (await scheduleRes.json()).schedules;
		if (!campaignId && campaigns.length > 0) {
			campaignId = campaigns[0].id;
		}
	}

	async function schedule() {
		await fetch('/api/schedules', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ campaignId, sendAt })
		});
		sendAt = '';
		await loadData();
	}

	onMount(loadData);
</script>

<section>
	<h1>Message Scheduling</h1>
	<p>Queue campaign deliveries for future send times.</p>

	<div class="panel">
		<select bind:value={campaignId}>
			{#each campaigns as campaign (campaign.id)}
				<option value={campaign.id}>{campaign.title}</option>
			{/each}
		</select>
		<input type="datetime-local" bind:value={sendAt} />
		<button class="primary" onclick={schedule}>Schedule message</button>
	</div>

	<ul class="panel list">
		{#each schedules as item (item.id)}
			<li>
				<strong>{item.campaignId}</strong>
				<span>{item.sendAt}</span>
				<em>{item.status}</em>
			</li>
		{/each}
	</ul>
</section>
