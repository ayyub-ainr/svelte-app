<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let isCreating = $state(false);
	let sendingCampaignId = $state('');

	const enhanceCreate = () => {
		isCreating = true;
		return async ({ update }: { update: () => Promise<void> }) => {
			await update();
			isCreating = false;
		};
	};

	const enhanceSendNow = ({ formElement }: { formElement: HTMLFormElement }) => {
		sendingCampaignId = String(new FormData(formElement).get('campaignId') ?? '');
		return async ({ update }: { update: () => Promise<void> }) => {
			await update();
			sendingCampaignId = '';
		};
	};
</script>

<section>
	<h1>Campaign Composer</h1>
	<p>Create outbound campaign drafts and choose audience contacts.</p>
	{#if form?.error}
		<p class="feedback error">{form.error}</p>
	{:else if form?.success}
		<p class="feedback ok">Campaign action completed.</p>
	{/if}

	<form method="POST" action="?/create" class="panel" use:enhance={enhanceCreate}>
		<input name="title" placeholder="Campaign title" required />
		<textarea name="message" placeholder="Message template" required></textarea>
		<div class="selector-grid">
			{#each data.contacts as contact (contact.id)}
				<label class="chip">
					<input type="checkbox" name="contactIds" value={contact.id} />
					<span>{contact.name}</span>
				</label>
			{/each}
		</div>
		<button class="primary" type="submit" disabled={isCreating || data.contacts.length === 0}>
			{isCreating ? 'Saving campaign...' : 'Save campaign'}
		</button>
	</form>
	{#if data.contacts.length === 0}
		<p class="empty-state">No contacts available. Add contacts first before composing campaigns.</p>
	{/if}

	{#if data.campaigns.length === 0}
		<p class="empty-state">
			No campaigns yet. Create one above to test send-now and status tracking.
		</p>
	{:else}
		<ul class="panel list">
			{#each data.campaigns as campaign (campaign.id)}
				<li>
					<div class="item-head">
						<strong>{campaign.title}</strong>
						<em>{campaign.contactIds.length} recipients</em>
					</div>
					<span>{campaign.message}</span>
					<form method="POST" action="?/sendNow" use:enhance={enhanceSendNow}>
						<input type="hidden" name="campaignId" value={campaign.id} />
						<button class="ghost" type="submit" disabled={sendingCampaignId === campaign.id}>
							{sendingCampaignId === campaign.id ? 'Sending...' : 'Send now'}
						</button>
					</form>
				</li>
			{/each}
		</ul>
	{/if}

	<aside class="learn-note">
		<h3>Learning Note</h3>
		<p>
			`sendNow` and `create` are separate actions, showing how one page can model multiple backend
			operations while keeping type-safe form handling.
		</p>
	</aside>
</section>
