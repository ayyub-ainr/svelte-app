<script lang="ts">
	import { onMount } from 'svelte';
	import type { Contact } from '$lib/types';

	let contacts = $state<Contact[]>([]);
	let name = $state('');
	let phone = $state('');
	let tag = $state('');

	async function loadContacts() {
		const response = await fetch('/api/contacts');
		const data = await response.json();
		contacts = data.contacts;
	}

	async function addContact() {
		await fetch('/api/contacts', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ name, phone, tag })
		});

		name = '';
		phone = '';
		tag = '';
		await loadContacts();
	}

	onMount(loadContacts);
</script>

<section>
	<h1>Contacts</h1>
	<p>Manage recipients for your WhatsApp campaigns.</p>

	<div class="panel">
		<input bind:value={name} placeholder="Business name" />
		<input bind:value={phone} placeholder="Phone (+62...)" />
		<input bind:value={tag} placeholder="Tag (Retail, VIP, etc.)" />
		<button class="primary" onclick={addContact}>Add contact</button>
	</div>

	<ul class="panel list">
		{#each contacts as contact (contact.id)}
			<li>
				<strong>{contact.name}</strong>
				<span>{contact.phone}</span>
				<em>{contact.tag || 'No tag'}</em>
			</li>
		{/each}
	</ul>
</section>
