import { simulateEvent } from '$lib/server/mock-store';
import { json } from '@sveltejs/kit';
import type { DeliveryStatus } from '$lib/types';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json().catch(() => ({}));
	const event = simulateEvent(body?.status as DeliveryStatus | undefined);

	if (!event) {
		return json(
			{ error: 'create at least one campaign and contact before simulation' },
			{ status: 400 }
		);
	}

	return json({ event }, { status: 201 });
};
