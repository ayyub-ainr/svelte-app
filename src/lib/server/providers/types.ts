import type { DeliveryStatus } from '$lib/types';

export interface OutboundMessageInput {
	to: string;
	body: string;
}

export interface SendMessageResult {
	ok: boolean;
	providerMessageId?: string;
	error?: string;
}

export interface ParsedStatusEvent {
	providerMessageId?: string;
	recipientPhone?: string;
	status: DeliveryStatus;
	occurredAt: string;
}

export interface WebhookVerificationInput {
	rawBody: string;
	signatureHeader: string | null;
}

export interface WhatsAppProvider {
	name: 'mock' | 'meta';
	sendMessage(input: OutboundMessageInput): Promise<SendMessageResult>;
	verifyWebhookSignature(input: WebhookVerificationInput): boolean;
	parseStatusEvents(payload: unknown): ParsedStatusEvent[];
}
