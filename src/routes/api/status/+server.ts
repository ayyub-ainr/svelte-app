import { listEvents, summarizeStatuses } from '$lib/server/mock-store';
import { json } from '@sveltejs/kit';

export function GET() {
	return json({
		events: listEvents(),
		summary: summarizeStatuses()
	});
}
