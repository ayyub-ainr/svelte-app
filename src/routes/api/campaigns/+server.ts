import { createCampaign, listCampaigns } from '$lib/server/mock-store';
import { json } from '@sveltejs/kit';

export function GET() {
	return json({ campaigns: listCampaigns() });
}

export async function POST({ request }) {
	const body = await request.json();
	if (!body?.title || !body?.message) {
		return json({ error: 'title and message are required' }, { status: 400 });
	}

	const campaign = createCampaign({
		title: body.title,
		message: body.message,
		contactIds: Array.isArray(body.contactIds) ? body.contactIds : []
	});
	return json({ campaign }, { status: 201 });
}
