import {
	getCampaignById,
	linkProviderMessage,
	listContacts,
	pushEvent
} from '$lib/server/mock-store';
import { getWhatsAppProvider } from '$lib/server/providers';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Route handler delegates business rules to the service layer and only handles HTTP concerns.
export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json().catch(() => ({}));

	if (!body?.campaignId) {
		return json({ error: 'campaignId is required' }, { status: 400 });
	}

	const campaign = getCampaignById(body.campaignId);
	if (!campaign) {
		return json({ error: 'campaign not found' }, { status: 404 });
	}

	const recipients = listContacts().filter((contact) => campaign.contactIds.includes(contact.id));
	if (recipients.length === 0) {
		return json({ error: 'campaign has no recipients' }, { status: 400 });
	}

	const provider = getWhatsAppProvider();
	const sentEvents = [];
	let failedCount = 0;

	for (const recipient of recipients) {
		const sendResult = await provider.sendMessage({
			to: recipient.phone,
			body: campaign.message
		});

		if (sendResult.ok) {
			const event = pushEvent({
				campaignId: campaign.id,
				contactId: recipient.id,
				status: 'sent'
			});
			sentEvents.push(event);
			if (sendResult.providerMessageId) {
				linkProviderMessage(sendResult.providerMessageId, campaign.id, recipient.id);
			}
		} else {
			failedCount += 1;
			pushEvent({
				campaignId: campaign.id,
				contactId: recipient.id,
				status: 'failed'
			});
		}
	}

	if (sentEvents.length === 0) {
		return json({ error: 'provider failed to send all messages' }, { status: 502 });
	}

	return json(
		{
			campaign,
			provider: provider.name,
			eventsCreated: sentEvents.length,
			failedCount,
			events: sentEvents
		},
		{ status: 201 }
	);
};
