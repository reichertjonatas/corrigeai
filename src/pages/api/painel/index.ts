// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { ERROR_NOT_LOGGED } from '../constants'

type Data = {
  error: boolean,
  errorMessage?: string,
  data?: {
    name: string
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await getSession({ req })
  if(session)
    res.status(200).json({ 
      error: false, data: {
        name: 'John Doe',
      },
    })
  else 
    res.send({ error: true, errorMessage: ERROR_NOT_LOGGED })
}
