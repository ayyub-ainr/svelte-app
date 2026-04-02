import {
	findContactByPhone,
	linkProviderMessage,
	pushEvent,
	resolveCampaignIdForContact,
	resolveProviderMessage
} from '$lib/server/mock-store';
import { getWhatsAppProvider } from '$lib/server/providers';
import { json, text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Meta webhook verification challenge endpoint.
export const GET: RequestHandler = ({ url }) => {
	const mode = url.searchParams.get('hub.mode');
	const token = url.searchParams.get('hub.verify_token');
	const challenge = url.searchParams.get('hub.challenge');
	const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

	if (mode === 'subscribe' && token && verifyToken && token === verifyToken && challenge) {
		return text(challenge);
	}

	return json({ error: 'forbidden' }, { status: 403 });
};

export const POST: RequestHandler = async ({ request }) => {
	const provider = getWhatsAppProvider();
	const rawBody = await request.text();
	const signatureHeader = request.headers.get('x-hub-signature-256');

	if (provider.name === 'meta' && !provider.verifyWebhookSignature({ rawBody, signatureHeader })) {
		return json({ error: 'invalid webhook signature' }, { status: 401 });
	}

	let payload: unknown;
	try {
		payload = JSON.parse(rawBody);
	} catch {
		return json({ error: 'invalid JSON payload' }, { status: 400 });
	}
	const parsedEvents = provider.parseStatusEvents(payload);
	let eventsCreated = 0;

	for (const item of parsedEvents) {
		const linked = item.providerMessageId ? resolveProviderMessage(item.providerMessageId) : null;
		let campaignId = linked?.campaignId;
		let contactId = linked?.contactId;

		if (!contactId && item.recipientPhone) {
			contactId = findContactByPhone(item.recipientPhone)?.id;
		}

		if (!campaignId && contactId) {
			campaignId = resolveCampaignIdForContact(contactId);
		}

		if (!campaignId || !contactId) {
			continue;
		}

		pushEvent({
			campaignId,
			contactId,
			status: item.status
		});
		eventsCreated += 1;

		if (item.providerMessageId) {
			linkProviderMessage(item.providerMessageId, campaignId, contactId);
		}
	}

	return json({ received: true, provider: provider.name, eventsCreated });
};
