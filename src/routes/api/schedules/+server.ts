import { createSchedule, getCampaignById, listSchedules } from '$lib/server/mock-store';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	return json({ schedules: listSchedules() });
};

export const POST: RequestHandler = async ({ request }) => {
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
};
