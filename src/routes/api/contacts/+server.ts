import { createContact, listContacts } from '$lib/server/mock-store';
import { json } from '@sveltejs/kit';

export function GET() {
	return json({ contacts: listContacts() });
}

export async function POST({ request }) {
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
}
