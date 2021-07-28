import { NextApiRequest , NextApiResponse} from 'next'
import { getSession } from 'next-auth/client'
import Redacao from '../../../../models/redacao'
import dbConnect from '../../../../services/mongodb'
import { ERROR_NOT_LOGGED } from '../../constants'

const handler =  async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  await dbConnect();
  if (session) {
    try {
        console.log('id', session.user!.id);
        const redacoes = await Redacao.find({ _id: session.user!.id });

        if(redacoes){
            return res.status(200).send({error: false, data: redacoes })
        } else
            throw new Error("Usuário não encontrado!");
    } catch (error) {
        return res.status(500).send({error: true, errorMessage: error.message});
    }
  } else {
    res.send({ error: true, errorMessage: ERROR_NOT_LOGGED })
  }
}

export default handler;