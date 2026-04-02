import { createHmac, timingSafeEqual } from 'node:crypto';
import type {
	OutboundMessageInput,
	ParsedStatusEvent,
	SendMessageResult,
	WebhookVerificationInput,
	WhatsAppProvider
} from './types';

function mapMetaStatus(status: string) {
	switch (status) {
		case 'sent':
		case 'delivered':
		case 'read':
			return status;
		default:
			return 'failed';
	}
}

export function createMetaWhatsAppProvider(): WhatsAppProvider {
	const token = process.env.WHATSAPP_API_TOKEN;
	const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
	const appSecret = process.env.WHATSAPP_APP_SECRET;

	return {
		name: 'meta',
		async sendMessage(input: OutboundMessageInput): Promise<SendMessageResult> {
			if (!token || !phoneNumberId) {
				return { ok: false, error: 'Meta provider is not configured.' };
			}

			const response = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					messaging_product: 'whatsapp',
					to: input.to,
					type: 'text',
					text: { body: input.body }
				})
			});

			if (!response.ok) {
				const payload = await response.json().catch(() => ({}));
				return {
					ok: false,
					error: payload?.error?.message ?? `Meta API error: ${response.status}`
				};
			}

			const payload = await response.json();
			const providerMessageId = payload?.messages?.[0]?.id;
			return {
				ok: true,
				providerMessageId
			};
		},
		verifyWebhookSignature(input: WebhookVerificationInput) {
			if (!appSecret) {
				return false;
			}

			if (!input.signatureHeader?.startsWith('sha256=')) {
				return false;
			}

			const expected = `sha256=${createHmac('sha256', appSecret).update(input.rawBody).digest('hex')}`;
			const actualBuffer = Buffer.from(input.signatureHeader);
			const expectedBuffer = Buffer.from(expected);

			if (actualBuffer.length !== expectedBuffer.length) {
				return false;
			}

			return timingSafeEqual(actualBuffer, expectedBuffer);
		},
		parseStatusEvents(payload: unknown): ParsedStatusEvent[] {
			const events: ParsedStatusEvent[] = [];
			const root = payload as {
				entry?: Array<{
					changes?: Array<{
						value?: {
							statuses?: Array<{
								id?: string;
								status?: string;
								recipient_id?: string;
								timestamp?: string;
							}>;
						};
					}>;
				}>;
			};

			for (const entry of root.entry ?? []) {
				for (const change of entry.changes ?? []) {
					for (const statusItem of change.value?.statuses ?? []) {
						if (!statusItem.status) {
							continue;
						}
						const unixTs = Number(statusItem.timestamp ?? '0');
						const parsedItem: ParsedStatusEvent = {
							status: mapMetaStatus(statusItem.status),
							occurredAt:
								Number.isFinite(unixTs) && unixTs > 0
									? new Date(unixTs * 1000).toISOString()
									: new Date().toISOString()
						};

						if (statusItem.id !== undefined) {
							parsedItem.providerMessageId = statusItem.id;
						}

						if (statusItem.recipient_id !== undefined) {
							parsedItem.recipientPhone = statusItem.recipient_id;
						}

						events.push(parsedItem);
					}
				}
			}

			return events;
		}
	};
}
