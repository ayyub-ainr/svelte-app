import { sendCampaignNow } from '$lib/server/mock-store';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const body = await request.json().catch(() => ({}));

	if (!body?.campaignId) {
		return json({ error: 'campaignId is required' }, { status: 400 });
	}

	const result = sendCampaignNow(body.campaignId);
	if (!result) {
		return json({ error: 'campaign not found' }, { status: 404 });
	}

	if (result.sentEvents.length === 0) {
		return json({ error: 'campaign has no recipients' }, { status: 400 });
	}

	return json(
		{
			campaign: result.campaign,
			eventsCreated: result.sentEvents.length,
			events: result.sentEvents
		},
		{ status: 201 }
	);
}
