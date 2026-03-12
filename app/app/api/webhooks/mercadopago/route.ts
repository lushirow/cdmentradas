import { NextRequest, NextResponse } from 'next/server';
import { query, getOne } from '@/lib/db';

// MP Webhook logic
export async function POST(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const topic = searchParams.get('topic') || searchParams.get('type');
        const id = searchParams.get('id') || searchParams.get('data.id');

        if (topic !== 'payment') {
            return NextResponse.json({ status: 'ignored' });
        }

        if (!id) {
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
        }

        // Fetch payment details from MP API
        // Note: We use fetch directly here or could use payment.get() method if available in SDK config
        const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
            headers: {
                'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
            }
        });

        if (!paymentResponse.ok) {
            console.error('Error fetching payment:', await paymentResponse.text());
            return NextResponse.json({ error: 'Payment fetch failed' }, { status: 500 });
        }

        const payment = await paymentResponse.json();

        // Check status
        if (payment.status === 'approved') {
            const metadata = payment.metadata;
            const amount = Math.round(payment.transaction_amount * 100); // Convert back to cents

            if (!metadata || !metadata.event_id || !metadata.user_email) {
                console.error('Missing metadata in payment:', payment);
                return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
            }

            // Check if purchase already recorded to avoid duplicates
            const existing = await getOne(
                'SELECT id FROM purchases WHERE mercadopago_payment_id = $1',
                [payment.id.toString()]
            );

            if (!existing) {
                // Record purchase
                await query(
                    `INSERT INTO purchases (email, event_id, mercadopago_payment_id, mercadopago_preference_id, status, amount)
           VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        metadata.user_email,
                        metadata.event_id,
                        payment.id.toString(),
                        payment.order?.id || null, // Preference ID or Order ID
                        'approved',
                        amount
                    ]
                );
                console.log(`Purchase recorded for user ${metadata.user_email} event ${metadata.event_id}`);
            }
        }

        return NextResponse.json({ status: 'ok' });

    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
