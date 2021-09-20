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
import { emailBoleto } from "../../../services/emails";

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

      if(body){
        const { current_status, id } = body;
        if(id && current_status && current_status === 'refused' || current_status === 'refunded'){
          console.log(`========> ID: ${id} || E-mail: ${ body.transaction.customer.email } Postback com status da transação: ${current_status} <==========`)
          return res.status(200).send({});
        }
      }
      
      console.log( " payload ==> ", body )


      const tokenAth = await tokenAsBackend();

      const { transaction, old_status } = body;

      let metadata:any


      const strapiLocal = new Strapi({
        url: `${process.env.NEXT_PUBLIC_URL_API}`
      })

      if(transaction && transaction.status === 'waiting_payment' && transaction.boleto_url){

        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
          to: transaction.customer.email,
          from: process.env.SENDGRID_EMAIL, // Use the email address or domain you verified above
          subject: 'Boleto gerado',
          text: 'Boleto gerado - Para imprimir o boleto clique no botão abaixo:',
          html: emailBoleto(transaction.boleto_url),
        };
        //ES6
        sgMail
          .send(msg)
          .then(() => {}, (error:any) => {
            console.error(error);
            if (error.response) {
              console.error(error.response.body)
            }
          });
        //ES8
        (async () => {
          try {
            await sgMail.send(msg);
          } catch (error:any) {
            console.error(error);

            if (error.response) {
              console.error(error.response.body)
            }
            return res.status(500).send({});
          }
        })();

        return res.status(200).send({});
      }

      if(!body?.transaction?.metadata?.idPlanoDb){
        console.log("metadata, indefinido! transação inválida, transação elimitada!")

        if(transaction && transaction.status === 'paid'){
          
          console.log("========> atendeu as condições")

          console.log("========> strapiLocal", strapiLocal)
          const recoverPlanoDadoAlternativa: any = await strapiLocal.graphql({ query: planoById('61250caa6da7f91684ae5df5') })
          console.log("========> recoverPlanoDadoAlternativa", recoverPlanoDadoAlternativa)

          const transacao: any = await strapi(tokenAth).create('transacaos', {
            metodo: transaction.payment_method,
            plano_id: recoverPlanoDadoAlternativa.pagarme_plano_id,
            status: 'paid',
            data: {...body, amount: transaction.amount},
          });

          console.log("========> transacao", transacao)

          metadata = {
            transacaoId: transacao.id,
            idPlanoDb: recoverPlanoDadoAlternativa.id
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