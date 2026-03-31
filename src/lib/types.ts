export type DeliveryStatus = 'queued' | 'sent' | 'delivered' | 'read' | 'failed';

export interface Contact {
	id: string;
	name: string;
	phone: string;
	tag?: string;
	createdAt: string;
}

export interface Campaign {
	id: string;
	title: string;
	message: string;
	contactIds: string[];
	createdAt: string;
}

export interface ScheduledMessage {
	id: string;
	campaignId: string;
	sendAt: string;
	status: DeliveryStatus;
	createdAt: string;
}

export interface MessageEvent {
	id: string;
	campaignId: string;
	contactId: string;
	status: DeliveryStatus;
	timestamp: string;
}
