import type { Campaign, Contact, DeliveryStatus, MessageEvent, ScheduledMessage } from '$lib/types';

// Service abstraction used by route handlers; swap this module when introducing a real provider or database.
const contacts: Contact[] = [
	{
		id: crypto.randomUUID(),
		name: 'Aulia Grocery',
		phone: '+6281234567001',
		tag: 'Retail',
		createdAt: new Date().toISOString()
	},
	{
		id: crypto.randomUUID(),
		name: 'Nusantara Laundry',
		phone: '+6281234567002',
		tag: 'Service',
		createdAt: new Date().toISOString()
	}
];

const campaigns: Campaign[] = [];
const schedules: ScheduledMessage[] = [];
const events: MessageEvent[] = [];

export function listContacts() {
	return contacts;
}

export function createContact(payload: Pick<Contact, 'name' | 'phone' | 'tag'>) {
	const contact: Contact = {
		id: crypto.randomUUID(),
		name: payload.name,
		phone: payload.phone,
		tag: payload.tag,
		createdAt: new Date().toISOString()
	};
	contacts.unshift(contact);
	return contact;
}

export function listCampaigns() {
	return campaigns;
}

export function getCampaignById(campaignId: string) {
	return campaigns.find((campaign) => campaign.id === campaignId);
}

export function createCampaign(payload: Pick<Campaign, 'title' | 'message' | 'contactIds'>) {
	const campaign: Campaign = {
		id: crypto.randomUUID(),
		title: payload.title,
		message: payload.message,
		contactIds: payload.contactIds,
		createdAt: new Date().toISOString()
	};
	campaigns.unshift(campaign);
	return campaign;
}

export function listSchedules() {
	return schedules;
}

export function createSchedule(payload: Pick<ScheduledMessage, 'campaignId' | 'sendAt'>) {
	const schedule: ScheduledMessage = {
		id: crypto.randomUUID(),
		campaignId: payload.campaignId,
		sendAt: payload.sendAt,
		status: 'queued',
		createdAt: new Date().toISOString()
	};
	schedules.unshift(schedule);
	return schedule;
}

export function sendCampaignNow(campaignId: string) {
	const campaign = getCampaignById(campaignId);
	if (!campaign) {
		return null;
	}

	const recipients = contacts.filter((contact) => campaign.contactIds.includes(contact.id));
	const sentEvents = recipients.map((contact) =>
		pushEvent({
			campaignId: campaign.id,
			contactId: contact.id,
			status: 'sent'
		})
	);

	return {
		campaign,
		sentEvents
	};
}

export function listEvents() {
	return events;
}

export function pushEvent(payload: Pick<MessageEvent, 'campaignId' | 'contactId' | 'status'>) {
	const event: MessageEvent = {
		id: crypto.randomUUID(),
		campaignId: payload.campaignId,
		contactId: payload.contactId,
		status: payload.status,
		timestamp: new Date().toISOString()
	};
	events.unshift(event);
	return event;
}

export function summarizeStatuses() {
	const totals: Record<DeliveryStatus, number> = {
		queued: 0,
		sent: 0,
		delivered: 0,
		read: 0,
		failed: 0
	};

	for (const event of events) {
		totals[event.status] += 1;
	}

	totals.queued += schedules.filter((schedule) => schedule.status === 'queued').length;

	return totals;
}

export function simulateEvent(status?: DeliveryStatus) {
	const seededCampaign = campaigns.find((campaign) => campaign.contactIds.length > 0);
	if (!seededCampaign) {
		return null;
	}

	const seededContactId = seededCampaign.contactIds[0];
	if (!seededContactId) {
		return null;
	}

	if (status) {
		return pushEvent({
			campaignId: seededCampaign.id,
			contactId: seededContactId,
			status
		});
	}

	const candidate = events.find((event) => event.status === 'sent' || event.status === 'delivered');
	if (candidate) {
		const nextStatus: DeliveryStatus = candidate.status === 'sent' ? 'delivered' : 'read';
		return pushEvent({
			campaignId: candidate.campaignId,
			contactId: candidate.contactId,
			status: nextStatus
		});
	}

	return pushEvent({
		campaignId: seededCampaign.id,
		contactId: seededContactId,
		status: 'sent'
	});
}
