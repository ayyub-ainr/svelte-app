import { createSchedule, getCampaignById, listSchedules } from '$lib/server/mock-store';
import { json } from '@sveltejs/kit';

export function GET() {
	return json({ schedules: listSchedules() });
}

export async function POST({ request }) {
	const body = await request.json();
	if (!body?.campaignId || !body?.sendAt) {
		return json({ error: 'campaignId and sendAt are required' }, { status: 400 });
	}

	if (!getCampaignById(body.campaignId)) {
		return json({ error: 'campaign not found' }, { status: 404 });
	}

	const schedule = createSchedule({
		campaignId: body.campaignId,
		sendAt: body.sendAt
	});
	return json({ schedule }, { status: 201 });
}
