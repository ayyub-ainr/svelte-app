<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	type DashboardRoute =
		| '/dashboard'
		| '/dashboard/contacts'
		| '/dashboard/campaigns'
		| '/dashboard/scheduling'
		| '/dashboard/analytics';

	const navItems = [
		{ href: '/dashboard', label: 'Overview' },
		{ href: '/dashboard/contacts', label: 'Contacts' },
		{ href: '/dashboard/campaigns', label: 'Campaigns' },
		{ href: '/dashboard/scheduling', label: 'Scheduling' },
		{ href: '/dashboard/analytics', label: 'Analytics' }
	] satisfies Array<{ href: DashboardRoute; label: string }>;

	let { children } = $props();
</script>

<section class="dash-shell">
	<aside class="dash-aside">
		<h2>WA Dashboard</h2>
		<p>Small business automation lab</p>
		<nav>
			{#each navItems as item (item.href)}
				<a class:active={$page.url.pathname === item.href} href={resolve(item.href)}>{item.label}</a
				>
			{/each}
		</nav>
	</aside>
	<main class="dash-main">{@render children()}</main>
</section>
