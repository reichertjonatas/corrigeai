// @ts-ignore
import pagarme from 'pagarme'
const PAGARME = pagarme.client.connect({ api_key: process.env.PAGARME_KEY });
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
        return error;
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
            console.log("===> ", err.errors);
        });
        return response;
    } catch (error) {
        return error;
    }
}

const createTransaction = async (
    amount:number,
    card_hash: string | null,
    payment_method: string,
    customer: any,
    billing: any,
    items: any,
    installments: string,
    metadata: {
        transacaoId: string,
        idPlanoDb: string,
    }) => {
    try {
        console.log("createTransaction card_hash: ", card_hash);

        const client = await PAGARME;
        const objetoTransacao = payment_method === "credit_card" ? {
            amount,
            card_hash: card_hash ?? '',
            payment_method,
            customer,
            billing,
            installments,
            items,
            postback_url: `${process.env.NEXT_PUBLIC_URL}/api/pagamento/postback`,
            metadata
        } : {
            amount,
            card_hash: card_hash ?? '',
            payment_method,
            customer: customer,
            installments,
            billing,
            items,
            postback_url: `${process.env.NEXT_PUBLIC_URL}/api/pagamento/postback`,
            metadata
        }
        const response = await client.transactions.create(objetoTransacao).catch((err:any) => {
            console.log("error createTransaction ==> ", customer, err.response.errors)
        });
        return response;
    } catch (error) {
        return error;
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