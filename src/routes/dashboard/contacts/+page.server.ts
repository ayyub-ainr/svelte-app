import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch('/api/contacts');
	const payload = await response.json();
	return { contacts: payload.contacts };
};

export const actions: Actions = {
	create: async ({ request, fetch }) => {
		const formData = await request.formData();
		const name = String(formData.get('name') ?? '').trim();
		const phone = String(formData.get('phone') ?? '').trim();
		const tag = String(formData.get('tag') ?? '').trim();

		if (!name || !phone) {
			return fail(400, {
				error: 'Name and phone are required.'
			});
		}

		const response = await fetch('/api/contacts', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ name, phone, tag })
		});

		if (!response.ok) {
			const payload = await response.json().catch(() => ({ error: 'Unable to create contact.' }));
			return fail(response.status, { error: payload.error ?? 'Unable to create contact.' });
		}

		return { success: true };
	}
};
