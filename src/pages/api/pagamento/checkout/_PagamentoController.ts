// @ts-ignore
import pagarme from 'pagarme'
const PAGARME = pagarme.client.connect({ api_key: 'ak_live_QB9S4KuRNeSoHnS5Ba8s7X2rKM8J8b' });
import Strapi from 'strapi-sdk-js'

const contaBackend = {
    email: 'naoapagar@naoapagar.com',
    password: 'Nn140885'
}

const startAssinatura = async (
    plano_id: number,
    card_hash: string | null,
    payment_method: string,
    amount: number,
    customer: any,
    idPlanoDb: string,
    transacaoId: string,
) => {
    try {
        const client = await PAGARME;
        // @ts-ignore
        const response = await client.subscriptions.create({
            plano_id: plano_id,
            metadata: {
                transacaoId : transacaoId,
                idPlanoDb : idPlanoDb,
            },
            payment_method,
            card_hash: payment_method == 'boleto' ? '' : card_hash,
            amount,
            customer,
            postback_url: `${process.env.NEXT_PUBLIC_URL}/api/pagamento/postback`
        });
        return response;
    } catch (error) {
        return error.message;
    }
}


const capturarPagamento = async (
    transacao_pagarme_id: string,
    amount: number,
    idPlanoDb: string,
    transacaoId: string,
) => {
    try {
        const client = await PAGARME;
        const response = await client.transactions.capture({
            id: transacao_pagarme_id,
            amount,
            // @ts-ignore
            metadata: {
                transacaoId : transacaoId,
                idPlanoDb : idPlanoDb,
            },
        }).catch((err:any) => {
            console.log("===> ", err);
        });
        return response;
    } catch (error) {
        return error.message;
    }
}

const createTransaction = async ( data:any ) => {
    try {
        const client = await PAGARME;
        const response = await client.transactions.create(data);
        return response;
    } catch (error) {
        return error.message;
    }
}


const tokenAsBackend = async () => { 
    const strapi = new Strapi({
        url: `${process.env.NEXT_PUBLIC_URL_API}`
    }); 
    const login:any = await strapi.graphql({ query : `mutation {
        login(input: { identifier: "${contaBackend.email}", password: "${contaBackend.password}" }) {
          jwt
        }
      }`});

      return login.jwt as string;
}

export {
    createTransaction,
    capturarPagamento,
    startAssinatura,
    tokenAsBackend,
    contaBackend
}