<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<section>
	<h1>Contacts</h1>
	<p>Manage recipients for your WhatsApp campaigns.</p>
	{#if form?.error}
		<p class="feedback error">{form.error}</p>
	{:else if form?.success}
		<p class="feedback ok">Contact added successfully.</p>
	{/if}

	<form method="POST" action="?/create" class="panel">
		<input name="name" placeholder="Business name" required />
		<input name="phone" placeholder="Phone (+62...)" required />
		<input name="tag" placeholder="Tag (Retail, VIP, etc.)" />
		<button class="primary" type="submit">Add contact</button>
	</form>

	<ul class="panel list">
		{#each data.contacts as contact (contact.id)}
			<li>
				<strong>{contact.name}</strong>
				<span>{contact.phone}</span>
				<em>{contact.tag || 'No tag'}</em>
			</li>
		{/each}
	</ul>
</section>
