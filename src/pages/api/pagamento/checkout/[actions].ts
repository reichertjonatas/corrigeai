import { NextApiRequest, NextApiResponse } from "next";
import { ERROR_NOT_LOGGED } from "../../constants";
import { capturarPagamento, startAssinatura, tokenAsBackend } from "./_PagamentoController";
import Strapi from 'strapi-sdk-js'
import { strapi } from "../../../../services/strapi";
import { planoById } from "../../../../graphql/query";
import Cors from 'cors'
import initMiddleware from "../../../../lib/middleware";

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    origin: 'https://api.corrigeai.com',
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'OPTIONS'],
  })
)


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { actions } = req.query;
  // await cors(req, res)
  console.log(" ===> ", actions);

  switch (actions) {
    case 'capturarPagamento':
      if (req.method === 'POST') {
        try {
          const { modoAssinatura , token, payment_method, customer, card_hash, amount, planoIdDb } = req.body;

          const strapiLocal = new Strapi({
            url: `${process.env.NEXT_PUBLIC_URL_API}`
        })

          console.log("planoId", planoIdDb);
          
          const recoverPlanoDado: any = await strapiLocal.graphql({ query: planoById(planoIdDb) })

          console.log("recoverPlanoDado", recoverPlanoDado)
          
          const tokenAth = await tokenAsBackend();
          if (!amount && modoAssinatura) throw new Error("Transação inválida!");
          
          const transacao: any = await strapi(tokenAth).create('transacaos', {
            metodo: payment_method,
            plano_id: recoverPlanoDado.pagarme_plano_id,
            status: 'waiting_payment',
            data: req.body
          });
          
          let assinatura:any

          if(modoAssinatura){
            assinatura = await startAssinatura(
              recoverPlanoDado.pagarme_plano_id,
              card_hash == undefined ? null : card_hash,
              payment_method,
              amount,
              customer,
              planoIdDb,
              transacao.id
            )

            console.log("assinatura", assinatura)
            if (!assinatura) throw new Error("Assinatura não efetuada!");
          } else {
            console.log("else modoAssinatura");
            console.log("capturarPagamento ", planoIdDb, amount, transacao.id)
            assinatura = await capturarPagamento(token, amount, planoIdDb, transacao.id);
            console.log(" ====> ", assinatura)

            await strapi(tokenAth).update('transacaos', transacao.id, {
              status: assinatura?.status === 'authorized' ? 'paid' : 'waiting_payment',
            });
            console.log(" ====> update assinatura")

            switch (assinatura?.status) {
              case 'authorized':
                console.log(" ====> update authorized")
                  return res.status(200).send({
                    error: false,
                    data: {
                      status: "paid",
                      payment_method,
                    }
                  });
                  
              case 'paid':
                console.log(" ====> update paid")
                  return res.status(200).send({
                    error: false,
                    data: {
                      status: "paid",
                      payment_method,
                    }
                  });
              case 'waiting_payment':
                console.log(" ====> update waiting_payment")
                return res.status(200).send({
                  error: false,
                  data: {
                    status: "waiting_payment",
                    boleto_url: payment_method === 'boleto' ? assinatura.boleto_url : '',
                    payment_method
                  }
                });
                case 'processing':
                  console.log(" ====> update processing")
                  return res.status(200).send({
                    error: false,
                    data: {
                      status: "waiting_payment",
                      boleto_url: payment_method === 'boleto' ? assinatura.boleto_url : '',
                      payment_method
                    }
                  });
              default:
                console.log(" ====> update default")
                return res.status(200).send({
                  error: true,
                  data: {
                    message: 'Transação não efetuada.',
                    status: "nao_autorizada",
                  }
                });
            }
          }

          await strapi(tokenAth).update('transacaos', transacao.id, {
            status: assinatura.current_transaction.status,
          });

          switch (assinatura.current_transaction.status) {
            case 'paid':
              return res.status(200).send({
                error: false,
                data: {
                  status: "paid",
                  payment_method,
                  email: customer.email
                }
              });
            case 'waiting_payment':
              return res.status(200).send({
                error: false,
                data: {
                  status: "waiting_payment",
                  payment_method
                }
              });
            default:
              return res.status(200).send({
                error: true,
                data: {
                  message: 'Transação não efetuada.',
                  status: "nao_autorizada",
                }
              });
          }

        } catch (error) {
          return res.status(200).send({
            error: true,
            data: {
              message: 'Transação não efetuada.',
              status: "error",
            }
          });
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





                // await signIn('email', { redirect: false, email: capture.customer.email });
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
