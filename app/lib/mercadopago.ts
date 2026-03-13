import MercadoPagoConfig, { Preference } from 'mercadopago';

// Initialize SDK
export const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || ''
});

export const preference = new Preference(client);

// Helper to create preference for event ticket
export async function createTicketPreference(
    ticket: {
        title: string;
        unit_price: number;
        quantity: number;
    },
    payer: {
        email: string;
        name: string;
    },
    metadata: {
        event_id: number;
        user_email: string;
    },
    baseUrl: string
) {
    try {
        const preferenceData = {
            items: [
                {
                    id: metadata.event_id.toString(),
                    title: ticket.title,
                    quantity: ticket.quantity,
                    unit_price: ticket.unit_price,
                    currency_id: 'ARS',
                }
            ],
            payer: {
                email: payer.email,
                name: payer.name,
            },
            back_urls: {
                success: `${baseUrl}/success`,
                failure: `${baseUrl}/failure`,
                pending: `${baseUrl}/pending`,
            },
            auto_return: 'approved', // Auto-redirect to success page after payment
            external_reference: payer.email,
            metadata: {
                event_id: metadata.event_id,
                user_email: metadata.user_email
            },
            notification_url: `${baseUrl}/api/webhooks/mercadopago`
        };

        console.log('MP Preference Payload:', JSON.stringify(preferenceData, null, 2));

        const result = await preference.create({
            body: preferenceData
        });

        return result;
    } catch (error) {
        console.error('Error creating preference:', error);
        throw error;
    }
}
