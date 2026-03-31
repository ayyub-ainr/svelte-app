<script lang="ts">
	import { onMount } from 'svelte';
	import type { Campaign, Contact } from '$lib/types';

	let campaigns = $state<Campaign[]>([]);
	let contacts = $state<Contact[]>([]);
	let title = $state('');
	let message = $state('');
	let selectedIds = $state<string[]>([]);

	async function loadData() {
		const [campaignRes, contactRes] = await Promise.all([
			fetch('/api/campaigns'),
			fetch('/api/contacts')
		]);
		campaigns = (await campaignRes.json()).campaigns;
		contacts = (await contactRes.json()).contacts;
	}

	async function createCampaign() {
		await fetch('/api/campaigns', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ title, message, contactIds: selectedIds })
		});
		title = '';
		message = '';
		selectedIds = [];
		await loadData();
	}

	function toggleContact(id: string) {
		selectedIds = selectedIds.includes(id)
			? selectedIds.filter((value) => value !== id)
			: [...selectedIds, id];
	}

	onMount(loadData);
</script>

<section>
	<h1>Campaign Composer</h1>
	<p>Create outbound campaign drafts and choose audience contacts.</p>

	<div class="panel">
		<input bind:value={title} placeholder="Campaign title" />
		<textarea bind:value={message} placeholder="Message template"></textarea>
		<div class="selector-grid">
			{#each contacts as contact (contact.id)}
				<button
					type="button"
					class:selected={selectedIds.includes(contact.id)}
					onclick={() => toggleContact(contact.id)}
				>
					{contact.name}
				</button>
			{/each}
		</div>
		<button class="primary" onclick={createCampaign}>Save campaign</button>
	</div>

	<ul class="panel list">
		{#each campaigns as campaign (campaign.id)}
			<li>
				<strong>{campaign.title}</strong>
				<span>{campaign.message}</span>
				<em>{campaign.contactIds.length} recipients</em>
			</li>
		{/each}
	</ul>
</section>
