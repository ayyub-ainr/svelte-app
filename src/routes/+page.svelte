<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<section class="hero">
	<p class="eyebrow">Learn-by-building project</p>
	<h1>WhatsApp Automation Dashboard for Small Businesses</h1>
	<p>
		Build campaigns, schedule messages, and track webhook delivery states with a mock-first
		SvelteKit architecture.
	</p>
	<div class="hero-actions">
		<a class="primary" href={resolve('/dashboard')}>Start implementation flow</a>
		<a class="ghost" href={resolve('/dashboard/contacts')}>Go to contacts</a>
	</div>
</section>

<section class="milestones">
	<article class="panel">
		<h2>Milestone 1</h2>
		<p>Contacts, campaigns, and scheduling with in-memory mock APIs.</p>
	</article>
	<article class="panel">
		<h2>Milestone 2</h2>
		<p>Webhook simulation and analytics dashboard for message lifecycle visibility.</p>
	</article>
	<article class="panel">
		<h2>Milestone 3</h2>
		<p>Provider interface to bridge from mock mode to Meta Cloud API integration.</p>
	</article>
</section>
