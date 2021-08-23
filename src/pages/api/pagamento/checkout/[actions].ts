import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import dbConnect from "../../../../services/mongodb";
import { ERROR_NOT_LOGGED } from "../../constants";
import User from "../../../../models/userTeste";
import { startAssinatura } from "./_PagamentoController";
import moment from "moment";
import { PLANOS } from "../../../../utils/helpers";
import Strapi from 'strapi-sdk-js'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { actions } = req.query;

  await dbConnect();

  console.log(" ===> ", actions);

  switch (actions) {
    case 'capturarPagamento':
      if (req.method === 'POST') {
        try {
          const { payment_method, amount, customer, card_hash } = req.body;

          const strapi = new Strapi()

          const plano_id = 1395688;

          console.log("above ", req.body)

          if (!amount) throw new Error("Transação inválida!");

          console.log(" above  ===> ")

          // const assinatura = await startAssinatura(
          //   plano_id,
          //   card_hash == undefined ? null : card_hash,
          //   payment_method,
          //   amount,
          //   customer
          // )

          // console.log("date: =>", moment(new Date().setDate(new Date().getDate() + 30)).format('YYYY-MM-DD HH:mm:ss'), " == ", assinatura);

          // if (!assinatura) throw new Error("Assinatura não efetuada!");

          

          if (true) {//assinatura?.current_transaction.status == "paid") {
            console.log(" ==> <== ")
            const user: any = await strapi.find('users', { email: customer.email });
            console.log(" ===> user ", user)
            if (!user[0]) {

              const novoUser = await strapi.register({ username: 'kellvem', email: 'kellvem222@gmail.com', password:'123456' })
              console.log(" ===> ", novoUser);

              //   // await signIn('email', { redirect: false, email: capture.customer.email });
              // const novoUser = new User({
              //   email: assinatura.customer.email.toLowerCase(),
              //   name: assinatura.customer.name ?? '',
              //   userType: 1,
              //   informacoes: {
              //     endereco: customer.address,
              //     telefone: assinatura.phone != undefined ? assinatura.phone : null,
              //     cpf: customer.document_number,
              //     nascimento: customer.birthday,
              //   },
              //   nivel: PLANOS(plano_id)!.plano_type,
              //   subscription: {
              //     card_hash: card_hash != undefined ? card_hash : null,
              //     data: assinatura,
              //     plano_id: plano_id,
              //     subscriptionName: PLANOS(plano_id)!.plano,
              //     envios: PLANOS(plano_id)!.total_envios,
              //     subscriptionDate: new Date(),
              //     subscriptionExpr: moment(new Date().setDate(new Date().getDate() + PLANOS(plano_id)!.days)).format('YYYY-MM-DD HH:mm:ss'),
              //   }
              // });
              // novoUser.save(novoUser);
            } else {
              console.log("else")
              // await User.updateOne({ email: assinatura.customer.email }, {
              //   $set: {
              //     name: assinatura.customer.name ?? '',
              //     informacoes: {
              //       endereco: assinatura.customer.address.toLowerCase(),
              //       telefone: assinatura.phone != undefined ? assinatura.phone : null,
              //       cpf: assinatura.customer.document_number,
              //       nascimento: assinatura.customer.birthday,
              //     },
              //     nivel: PLANOS(plano_id)!.plano_type,
              //     subscription: {
              //       card_hash: card_hash != undefined ? card_hash : null,
              //       data: assinatura,
              //       plano_id: plano_id,
              //       subscriptionName: PLANOS(plano_id)!.plano,
              //       envios: PLANOS(plano_id)!.total_envios,
              //       subscriptionDate: new Date(),
              //       subscriptionExpr: moment(new Date().setDate(new Date().getDate() + PLANOS(plano_id)!.days)).format('YYYY-MM-DD HH:mm:ss'),
              //     }
              //   }
              // });
            }

            return res.status(200).send({
              error: false,
              data: {
                status: "paid", payment_method, email: customer.email
              }
            });
          }

          // console.log("capturarPagamento", capture);
          return res.status(200).send({
            error: false,
            data: {
              status: "waiting_payment",
              payment_method
            }
          });
        } catch (error) {
          return res.status(500).send({ error: true, errorMessage: error.message });
        }
      }
      break;
    case 'removeEvent':
      if (req.method === 'POST') {
        try {
          //remove update

          return res.status(204).send({});
        } catch (error) {
          return res.status(500).send({ error: true, errorMessage: error.message });
        }
      } else {
        return res.send({ error: true, errorMessage: ERROR_NOT_LOGGED })
      }
      break;
    default:
      return res.status(404).send({})

  }
  // } else {
  //     return res.send({ error: true, errorMessage: ERROR_NOT_LOGGED })
  // }
}

export default handler;