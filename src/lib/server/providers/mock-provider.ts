import type {
	OutboundMessageInput,
	ParsedStatusEvent,
	SendMessageResult,
	WebhookVerificationInput,
	WhatsAppProvider
} from './types';

export function createMockWhatsAppProvider(): WhatsAppProvider {
	return {
		name: 'mock',
		async sendMessage(_unused: OutboundMessageInput): Promise<SendMessageResult> {
			void _unused;
			return {
				ok: true,
				providerMessageId: `mock-${crypto.randomUUID()}`
			};
		},
		verifyWebhookSignature(_unused: WebhookVerificationInput) {
			void _unused;
			return true;
		},
		parseStatusEvents(_unused: unknown): ParsedStatusEvent[] {
			void _unused;
			return [];
		}
	};
}
