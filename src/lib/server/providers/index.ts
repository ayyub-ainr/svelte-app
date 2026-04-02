import { createMetaWhatsAppProvider } from './meta-provider';
import { createMockWhatsAppProvider } from './mock-provider';
import type { WhatsAppProvider } from './types';

export function getWhatsAppProvider(): WhatsAppProvider {
	const hasMetaConfig = Boolean(
		process.env.WHATSAPP_API_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID
	);
	if (hasMetaConfig) {
		return createMetaWhatsAppProvider();
	}
	return createMockWhatsAppProvider();
}
