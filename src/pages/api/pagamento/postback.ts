import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { ERROR_NOT_LOGGED } from "../constants";
import { capturarPagamento, tokenAsBackend } from "./checkout/_PagamentoController";
import moment from "moment";
import { PLANOS } from "../../../utils/helpers";
import Strapi from 'strapi-sdk-js'
import { strapi } from "../../../services/strapi";
import { planoById, planoByValor } from "../../../graphql/query";
import qs from 'qs'
import queryString from 'query-string';
// @ts-ignore
import pagarme from 'pagarme'

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// }


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(" ===> started ")
  try {
    if (req.method === 'POST') {
      const apiKey = process.env.PAGARME_KEY
      const verifyBody = qs.stringify(req.body)
      //@ts-ignore
      const signature = req.headers['x-hub-signature']!.replace('sha1=', '')
      
      // @ts-ignore
      if (!pagarme.postback.verifySignature(apiKey, verifyBody, signature)) {
        console.log("postBack invalido! transação elimida")
        return res.status(500).json({error: 'Invalid Postback'})
      }
      

      console.log( " postBack valido!" )

      const body:any = qs.parse(req.body);
      
      console.log( " payload ==> ", body )


      const tokenAth = await tokenAsBackend();

      const { transaction, old_status } = body;

      let metadata:any


      const strapiLocal = new Strapi({
        url: `${process.env.NEXT_PUBLIC_URL_API}`
      })

      if(!body?.transaction?.metadata?.idPlanoDb){
        console.log("metadata, indefinido! transação inválida, transação elimitada!")

        if(transaction && old_status && old_status === 'authorized' && transaction.payment_method === 'credit_card' && transaction.status === 'paid'){
          
          console.log("========> atendeu as condições")

          console.log("========> strapiLocal", strapiLocal)
          const recoverPlanoDadoAlternativa: any = (await strapiLocal.graphql({ query: planoByValor(transaction.amount)}) as any).planos
          console.log("========> strapiLocal", recoverPlanoDadoAlternativa)
          if(recoverPlanoDadoAlternativa.length === 0){
            return res.status(500).send({});
          }

          const transacao: any = await strapi(tokenAth).create('transacaos', {
            metodo: transaction.payment_method,
            plano_id: recoverPlanoDadoAlternativa[0].pagarme_plano_id,
            status: 'paid',
            data: {...body, amount: transaction.amount},
          });

          console.log("========> transacao", transacao)

          metadata = {
            transacaoId: transacao.id,
            idPlanoDb: recoverPlanoDadoAlternativa[0].id
          }
          console.log("========> metadata", metadata)

        } else
          return res.status(500).send({});
      }

      const { address, customer, phone, card, payment_method, status } : any = transaction;

      if(transaction.metadata){
        metadata = transaction.metadata;
      }

      const recoverPlanoDado:any = await strapiLocal.graphql({query: planoById(metadata.idPlanoDb)})

      console.log("recoverPlanoDado ==> ", recoverPlanoDado.id)

      console.log("tokenAth ==> ", tokenAth)

      console.log("token => ", tokenAth)

      const user: any = await strapi(tokenAth).find('users', { 
        email: customer.email.toLowerCase() 
      });

      console.log("user ==> ", user)
      console.log(" ===> if transacao", metadata.transacaoId, "   ===   ", metadata.idPlanoDb)
      console.log(" ==> switch ", status)

      await strapi(tokenAth).update('transacaos', metadata.transacaoId, {
        status,
        data: body,
      }).then((response:any) => {
        console.log("ok ====> transacaos ", response.id)
      }).catch( error => { console.log('catch transacaos error', error) });

      console.log(" ==> switch ", status)
      switch (status) {
        case 'paid':
          console.log("paid ==> paid", status)

          if (!user[0]) {
            const novoUser: any = await strapiLocal.register({ username: customer.email.toLowerCase(), email: customer.email.toLowerCase(), password: `${Date.now()}` })
            console.log(" ===> if", novoUser.user.email, novoUser.user.id);

            await strapi(tokenAth).create('subscriptions', {
              card_hash: card.id,
              enviosAvulsos: 0,
              envios: recoverPlanoDado.total_envios,
              subscriptionDate: new Date(),
              subscriptionExpr: moment(new Date().setDate(new Date().getDate() + recoverPlanoDado.dias)).format('YYYY-MM-DD HH:mm:ss'),
              transacaos: [metadata.transacaoId],
              plano: recoverPlanoDado.id,
            }).then(async (response:any) => {
              console.log("ok ====> subs ", response.id)
              console.log('subs - updates user', novoUser.user.id )

              await strapi(tokenAth).update('users', novoUser.user.id, {
                name: customer.name ?? '-----',
                subscription: response.id
              }).then( async response => {
                console.log("ok ====> update users ", response)
                await strapiLocal.forgotPassword({ email: customer.email.toLowerCase() })
              }).catch( error => { console.log('catch update users error', error) });
            }).catch( error => { console.log('catch subs error', error) })

          } else {
            console.log("else")

            if (user[0]?.subscription) {
              const novaTransacao = user[0].subscription.transacaos;
              novaTransacao.push(metadata.transacaoId)

              await strapi(tokenAth).update('subscriptions', user[0].subscription.id, {
                plano: recoverPlanoDado.id,
                card_hash: card.id != undefined ? card.id : '',
                enviosAvulsos: 0,
                subscriptionDate: new Date(),
                subscriptionExpr: moment(new Date().setDate(new Date().getDate() + recoverPlanoDado.dias)).format('YYYY-MM-DD HH:mm:ss'),
                transacaos: novaTransacao,
              }).catch((err) => {
                console.log(" ===> ", err);
              })

            } else {
              console.log("else")
              await strapi(tokenAth).create('subscriptions', {
                plano: recoverPlanoDado.id,
                card_hash: card.id != undefined ? card.id : '',
                enviosAvulsos: 0,
                subscriptionDate: new Date(),
                subscriptionExpr: moment(new Date().setDate(new Date().getDate() + recoverPlanoDado.dais)).format('YYYY-MM-DD HH:mm:ss'),
                transacaos: [metadata.transacaoId],
                
              }).then(async (response:any) => {
                await strapi(tokenAth).update('users', user[0].id, {
                  subscription: response.id
                });
              }).catch( error => { console.log('catch subs error', error) })

              
            }
          }

          return res.status(200).send({});

        case 'waiting_payment':
          // console.log("capturarPagamento", capture);
          console.log("waiting_payment ==> paid", status)
          if (!user[0]) {

            return res.status(200).send({});
          } else {
            return res.status(200).send({});
          }

        default:
          console.log("current_transaction.status ==> paid", status)
          return res.status(200).send({});
      }
    } else {
      console.log(" ===> GET back", req.query);
    }
    return res.status(200).send({ 
      error: true, 
      data: {
        message: 'aadd'
      } 
    });
  } catch (error) {
    return res.status(500).send({ error: true, errorMessage: error.message });
  }
}


export default handler;