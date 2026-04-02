<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let isCreating = $state(false);

	const enhanceCreate = () => {
		isCreating = true;
		return async ({ update }: { update: () => Promise<void> }) => {
			await update();
			isCreating = false;
		};
	};
</script>

<section>
	<h1>Contacts</h1>
	<p>Manage recipients for your WhatsApp campaigns.</p>
	{#if form?.error}
		<p class="feedback error">{form.error}</p>
	{:else if form?.success}
		<p class="feedback ok">Contact added successfully.</p>
	{/if}

	<form method="POST" action="?/create" class="panel" use:enhance={enhanceCreate}>
		<input name="name" placeholder="Business name" required />
		<input name="phone" placeholder="Phone (+62...)" required />
		<input name="tag" placeholder="Tag (Retail, VIP, etc.)" />
		<button class="primary" type="submit" disabled={isCreating}>
			{isCreating ? 'Adding contact...' : 'Add contact'}
		</button>
	</form>

	{#if data.contacts.length === 0}
		<p class="empty-state">
			No contacts yet. Add your first customer to unlock campaign targeting.
		</p>
	{:else}
		<ul class="panel list">
			{#each data.contacts as contact (contact.id)}
				<li>
					<strong>{contact.name}</strong>
					<span>{contact.phone}</span>
					<em>{contact.tag || 'No tag'}</em>
				</li>
			{/each}
		</ul>
	{/if}

	<aside class="learn-note">
		<h3>Learning Note</h3>
		<p>
			This page submits through a SvelteKit action, then re-runs server `load` so UI data stays
			consistent without manual client-side refetch logic.
		</p>
	</aside>
</section>
