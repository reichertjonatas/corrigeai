import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import User from '../../../../models/user'
import connectDB from '../../../../services/mongodb'
import { ERROR_NOT_LOGGED } from '../../constants'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  const { actions } = req.query;
  console.log('actions', actions)
  if (session) {
    switch (actions) {
      case 'addEvent':
        if (req.method === 'POST') {
          const { evento } = req.body;
          try {
            const user = await User.updateOne({ email: session.user!.email! }, {
              $push: {
                eventos: {
                  $each: [evento],
                }
              }
            });
            if (!user) throw new Error("usuário não encontrado!");

            return res.status(204).send({});
          } catch (error) {
            return res.status(500).send({ error: true, errorMessage: error.message });
          }
        }
      case 'removeEvent':
        if (req.method === 'POST') {
          const { evento } = req.body;
          try {
            const user = await User.updateOne({ email: session.user!.email! }, {
              $push: {
                eventos: {
                  $each: [evento],
                }
              }
            });
            if (!user) throw new Error("usuário não encontrado!");

            return res.status(204).send({});
          } catch (error) {
            return res.status(500).send({ error: true, errorMessage: error.message });
          }
        } else {
          return res.send({ error: true, errorMessage: ERROR_NOT_LOGGED })
        }
      case 'updateEvent':
        if (req.method === 'POST') {
          const { id, color } = req.body;
          
          try {
            const user = await User.updateOne({ email: session.user!.email!, 'eventos.id': id as number }, {
              $set: { 'eventos.$.eventProps.color' : color }
            });
            if (!user) throw new Error("usuário não encontrado!");

            return res.status(204).send(user);
          } catch (error) {
            return res.status(500).send({ error: true, errorMessage: error.message });
          }
        } else {
          return res.send({ error: true, errorMessage: ERROR_NOT_LOGGED })
        }
      case 'getEvents':
          if (req.method === 'GET') {
            try {
              const user = await User.findOne({ email: session.user!.email! });
              if (!user) throw new Error("usuário não encontrado!");
  
              return res.status(200).send({
                error: false, data: user.eventos
              });
            } catch (error) {
              return res.status(500).send({ error: true, errorMessage: error.message });
            }
          } else {
            return res.send({ error: true, errorMessage: ERROR_NOT_LOGGED })
          }
      default:
        return res.status(404).send({})
    }

  } else {
    return res.send({ error: true, errorMessage: ERROR_NOT_LOGGED })
  }
}

export default connectDB(handler);