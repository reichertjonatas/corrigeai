// @ts-ignore
import pagarme from 'pagarme'
const PAGARME = pagarme.client.connect({ api_key: 'ak_test_TvYJGkp9WwKqe4jlMwMzaVZva1iu9D' });

const startAssinatura = async (
    plano_id: number,
    card_hash: string | null,
    payment_method: string,
    amount: number,
    customer: any,
    // installments: string,
) => {
    try {
        const client = await PAGARME;
        const response = await client.subscriptions.create({
            plano_id: plano_id,
            payment_method,
            card_hash: payment_method == 'boleto' ? '' : card_hash,
            amount,
            customer,
            postbackUrl: ""
        });

        return response;
    } catch (error) {
        return error.message;
    }
}

export {
    startAssinatura
}