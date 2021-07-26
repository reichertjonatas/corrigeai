import { NextApiRequest , NextApiResponse} from 'next'
import { getSession } from 'next-auth/client'
import Redacao from '../../../../models/redacoes'
import connectDB from '../../../../services/mongodb'
import { ERROR_NOT_LOGGED } from '../../constants'

const handler =  async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })

  if (session) {
    try {
        console.log('id', session.user!.id);
        const redacao = new Redacao({ 
            redacao: "",
            competicoes: [],
            correcoes: [],
            user_onwer: session.user!.id
        });

        if(redacao){
            return res.status(200).send({error: false, data: redacao })
        } else
            throw new Error("Usuário não encontrado!");
    } catch (error) {
        return res.status(500).send({error: true, errorMessage: error.message});
    }
  } else {
    res.send({ error: true, errorMessage: ERROR_NOT_LOGGED })
  }
}

export default connectDB(handler);