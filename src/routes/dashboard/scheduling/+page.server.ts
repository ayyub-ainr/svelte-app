import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const [campaignResponse, scheduleResponse] = await Promise.all([
		fetch('/api/campaigns'),
		fetch('/api/schedules')
	]);
	const campaigns = await campaignResponse.json();
	const schedules = await scheduleResponse.json();
	const titleById = new Map(
		campaigns.campaigns.map((campaign: { id: string; title: string }) => [
			campaign.id,
			campaign.title
		])
	);
	const scheduleItems = schedules.schedules.map(
		(schedule: { id: string; campaignId: string; sendAt: string; status: string }) => ({
			...schedule,
			campaignTitle: titleById.get(schedule.campaignId) ?? 'Unknown campaign'
		})
	);

	return {
		campaigns: campaigns.campaigns,
		schedules: scheduleItems
	};
};

export const actions: Actions = {
	create: async ({ request, fetch }) => {
		const formData = await request.formData();
		const campaignId = String(formData.get('campaignId') ?? '').trim();
		const sendAt = String(formData.get('sendAt') ?? '').trim();

		if (!campaignId || !sendAt) {
			return fail(400, { error: 'Campaign and send date are required.' });
		}

		const response = await fetch('/api/schedules', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ campaignId, sendAt })
		});

		if (!response.ok) {
			const payload = await response.json().catch(() => ({ error: 'Unable to schedule message.' }));
			return fail(response.status, { error: payload.error ?? 'Unable to schedule message.' });
		}

		return { success: true };
	}
};
