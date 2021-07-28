import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import connectDB from '../../../services/mongodb'
import { ERROR_NOT_LOGGED } from '../constants'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req })
    const { actions } = req.query;
    
    console.log('actions', actions)
    if (session) {
        switch (actions) {

            case 'addEvent':
                if (req.method === 'POST') {
                    try {
                        // create logic
                        // if (!user) throw new Error("usuário não encontrado!");

                        return res.status(204).send({});
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
    } else {
        return res.send({ error: true, errorMessage: ERROR_NOT_LOGGED })
    }
}

export default connectDB(handler);