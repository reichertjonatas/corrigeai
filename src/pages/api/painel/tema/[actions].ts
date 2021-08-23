import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { IPagina } from '../../../../hooks/paginaStore'
import { ERROR_NOT_LOGGED } from '../../constants'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req })
    const { actions } = req.query;


    console.log('actions', actions)
    if (session) {
        return res.send({ error: true, errorMessage: ERROR_NOT_LOGGED })
    } else {
        return res.send({ error: true, errorMessage: ERROR_NOT_LOGGED })
    }
}

export default handler;