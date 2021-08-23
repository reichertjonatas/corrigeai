import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { ICalenderEvents } from '../../../../models/User'
import { ERROR_NOT_LOGGED } from '../../constants'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  const { actions } = req.query;


  if (session) {
        res.status(404).send({})
  } else {
    return res.send({ error: true, errorMessage: ERROR_NOT_LOGGED })
  }
}

export default handler;