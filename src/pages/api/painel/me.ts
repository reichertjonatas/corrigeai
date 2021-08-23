import { NextApiRequest , NextApiResponse} from 'next'
import { getSession } from 'next-auth/client'
import dbConnect from '../../../services/mongodb'
import { ERROR_NOT_LOGGED } from '../constants'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  
  const session = await getSession({ req })

  if (session) {
    try {
        // const me = null//await User.findOne({ email: session.user!.email });

        // if(me){
        //     return res.status(200).send({error: false, data: {
        //         name: me.name,
        //         image: me.image,
        //         email: me.email,
        //         corretorType: me.corretorType,
        //         subscription: {
        //           plano_id: me.subscription.plano_id,
        //           envios: me.subscription.envios,
        //           subscriptionName: me.subscription.subscriptionName,
        //           subscriptionType: me.subscription.subscriptionType,
        //           subscriptionDate: me.subscription.subscriptionDate,
        //           subscriptionExpr: me.subscription.subscriptionExpr,
        //         },
        //         redacoes: me.redacoes,
        //         recompensas: me.recompensas,
        //         userType: me.userType,
        //         createdAt: me.createdAt,
        //     }})
        // }else
        //     throw new Error("Usuário não encontrado!");

    } catch (error) {
        if (res) {
          res.writeHead(302, { // or 301
            Location: '/painel/sair',
          });
          res.end();
        }

        return res.status(500).send({error: true, errorMessage: error.message});
    }
  } else {
    res.send({ error: true, errorMessage: ERROR_NOT_LOGGED })
  }
}

export default handler;