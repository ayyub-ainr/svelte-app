<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let isScheduling = $state(false);

	const enhanceCreate = () => {
		isScheduling = true;
		return async ({ update }: { update: () => Promise<void> }) => {
			await update();
			isScheduling = false;
		};
	};
</script>

<section>
	<h1>Message Scheduling</h1>
	<p>Queue campaign deliveries for future send times.</p>
	{#if form?.error}
		<p class="feedback error">{form.error}</p>
	{:else if form?.success}
		<p class="feedback ok">Schedule created successfully.</p>
	{/if}

	<form method="POST" action="?/create" class="panel" use:enhance={enhanceCreate}>
		<select name="campaignId" required>
			{#each data.campaigns as campaign (campaign.id)}
				<option value={campaign.id}>{campaign.title}</option>
			{/each}
		</select>
		<input type="datetime-local" name="sendAt" required />
		<button class="primary" type="submit" disabled={isScheduling || data.campaigns.length === 0}>
			{isScheduling ? 'Scheduling...' : 'Schedule message'}
		</button>
	</form>
	{#if data.campaigns.length === 0}
		<p class="empty-state">No campaigns available. Create a campaign before scheduling delivery.</p>
	{/if}

	{#if data.schedules.length === 0}
		<p class="empty-state">No scheduled jobs yet. Add one to test queued delivery analytics.</p>
	{:else}
		<ul class="panel list">
			{#each data.schedules as item (item.id)}
				<li>
					<strong>{item.campaignTitle}</strong>
					<span>{item.sendAt}</span>
					<em>{item.status}</em>
				</li>
			{/each}
		</ul>
	{/if}

	<aside class="learn-note">
		<h3>Learning Note</h3>
		<p>
			Schedule data is enriched in server `load` with campaign titles, which keeps view components
			simple and only presentation-focused.
		</p>
	</aside>
</section>
