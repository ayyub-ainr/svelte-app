<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<section>
	<h1>Campaign Composer</h1>
	<p>Create outbound campaign drafts and choose audience contacts.</p>
	{#if form?.error}
		<p class="feedback error">{form.error}</p>
	{:else if form?.success}
		<p class="feedback ok">Campaign action completed.</p>
	{/if}

	<form method="POST" action="?/create" class="panel">
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
		<button class="primary" type="submit">Save campaign</button>
	</form>

	<ul class="panel list">
		{#each data.campaigns as campaign (campaign.id)}
			<li>
				<div class="item-head">
					<strong>{campaign.title}</strong>
					<em>{campaign.contactIds.length} recipients</em>
				</div>
				<span>{campaign.message}</span>
				<form method="POST" action="?/sendNow">
					<input type="hidden" name="campaignId" value={campaign.id} />
					<button class="ghost" type="submit">Send now</button>
				</form>
			</li>
		{/each}
	</ul>
</section>
