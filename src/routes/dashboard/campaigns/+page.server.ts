import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const [campaignResponse, contactResponse] = await Promise.all([
		fetch('/api/campaigns'),
		fetch('/api/contacts')
	]);
	const campaigns = await campaignResponse.json();
	const contacts = await contactResponse.json();

	return {
		campaigns: campaigns.campaigns,
		contacts: contacts.contacts
	};
};

export const actions: Actions = {
	create: async ({ request, fetch }) => {
		const formData = await request.formData();
		const title = String(formData.get('title') ?? '').trim();
		const message = String(formData.get('message') ?? '').trim();
		const contactIds = formData.getAll('contactIds').map((id) => String(id));

		if (!title || !message) {
			return fail(400, { error: 'Title and message are required.' });
		}

		if (contactIds.length === 0) {
			return fail(400, { error: 'Select at least one recipient contact.' });
		}

		const response = await fetch('/api/campaigns', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ title, message, contactIds })
		});

		if (!response.ok) {
			const payload = await response.json().catch(() => ({ error: 'Unable to save campaign.' }));
			return fail(response.status, { error: payload.error ?? 'Unable to save campaign.' });
		}

		return { success: true };
	},
	sendNow: async ({ request, fetch }) => {
		const formData = await request.formData();
		const campaignId = String(formData.get('campaignId') ?? '').trim();

		if (!campaignId) {
			return fail(400, { error: 'Campaign id is required.' });
		}

		const response = await fetch('/api/messages/send', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ campaignId })
		});

		if (!response.ok) {
			const payload = await response.json().catch(() => ({ error: 'Unable to send campaign.' }));
			return fail(response.status, { error: payload.error ?? 'Unable to send campaign.' });
		}

		return { success: true };
	}
};
