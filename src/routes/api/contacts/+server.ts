import { createContact, listContacts } from '$lib/server/mock-store';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	return json({ contacts: listContacts() });
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	if (!body?.name || !body?.phone) {
		return json({ error: 'name and phone are required' }, { status: 400 });
	}

	const contact = createContact({
		name: body.name,
		phone: body.phone,
		tag: body.tag
	});
	return json({ contact }, { status: 201 });
};
