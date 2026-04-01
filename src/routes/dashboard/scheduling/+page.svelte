<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<section>
	<h1>Message Scheduling</h1>
	<p>Queue campaign deliveries for future send times.</p>
	{#if form?.error}
		<p class="feedback error">{form.error}</p>
	{:else if form?.success}
		<p class="feedback ok">Schedule created successfully.</p>
	{/if}

	<form method="POST" action="?/create" class="panel">
		<select name="campaignId" required>
			{#each data.campaigns as campaign (campaign.id)}
				<option value={campaign.id}>{campaign.title}</option>
			{/each}
		</select>
		<input type="datetime-local" name="sendAt" required />
		<button class="primary" type="submit">Schedule message</button>
	</form>

	<ul class="panel list">
		{#each data.schedules as item (item.id)}
			<li>
				<strong>{item.campaignTitle}</strong>
				<span>{item.sendAt}</span>
				<em>{item.status}</em>
			</li>
		{/each}
	</ul>
</section>
