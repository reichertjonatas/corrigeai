// @ts-ignore
import pagarme from 'pagarme'
import { debugPrint } from '../utils/debugPrint';

export const PAGARME =  pagarme.client.connect({ api_key: process.env.PAGARME_KEY });

export const criarPlano = async (amount:number, days:number, name:string, trial_days:number, payment_methods:any[]) => {

    /// plano criado 
    /// id 1395688
    const client = await PAGARME;
    const body = {
        "amount": amount,
        "days": days,
        "name": name,
        "trial_days": trial_days,
        "payment_methods": payment_methods
    };

    console.log(body);

    const plans = await client.plans.create({
        amount: 15000,
        days: 30,
        name: 'The Pro Plan - Platinum  - Best Ever',
        payments_methods: ['boleto', 'credit_card']
    });

    debugPrint(" ===> ", plans);
}

export const capturarPagamento = (token_transition: string) => {

}