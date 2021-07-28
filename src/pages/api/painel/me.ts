import { NextApiRequest , NextApiResponse} from 'next'
import { getSession } from 'next-auth/client'
import User from '../../../models/user'
import dbConnect from '../../../services/mongodb'
import { ERROR_NOT_LOGGED } from '../constants'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  
  const session = await getSession({ req })

  if (session) {
    try {
        const me = await User.findOne({ email: session.user!.email });

        if(me){
            return res.status(200).send({error: false, data: {
                name: me.name,
                image: me.image,
                email: me.email,
                subscription: me.subscription,
                userType: me.userType,
            }})
        }else
            throw new Error("Usuário não encontrado!");

    } catch (error) {
        return res.status(500).send({error: true, errorMessage: error.message});
    }
  } else {
    res.send({ error: true, errorMessage: ERROR_NOT_LOGGED })
  }
}

export default handler;