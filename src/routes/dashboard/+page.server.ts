import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch('/api/status');
	const payload = await response.json();
	return {
		summary: payload.summary,
		events: payload.events.slice(0, 10)
	};
};

export const actions: Actions = {
	simulate: async ({ request, fetch }) => {
		const formData = await request.formData();
		const status = String(formData.get('status') ?? '').trim();
		const body = status ? { status } : {};

		const response = await fetch('/api/webhooks/simulate', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body)
		});

		if (!response.ok) {
			const payload = await response.json().catch(() => ({ error: 'Unable to simulate event.' }));
			return fail(response.status, { error: payload.error ?? 'Unable to simulate event.' });
		}

		return { success: true };
	}
};
