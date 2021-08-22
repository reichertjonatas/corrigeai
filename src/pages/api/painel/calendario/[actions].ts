import { CallbackError } from 'mongoose'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import User, { ICalenderEvents } from '../../../../models/userTeste'
import dbConnect from '../../../../services/mongodb'
import { ERROR_NOT_LOGGED } from '../../constants'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  const { actions } = req.query;

  await dbConnect();

  if (session) {
    switch (actions) {
      case 'addEvent':
        if (req.method === 'POST') {
          const { evento: { title, start, end, eventProps } } = req.body;
          try {
            const response = await User.updateOne({ email: session.user!.email! }, {
              $push: {
                eventos: {
                  $each: [{ title, start, end, eventProps }],
                }
              }
            });

            const user = await User.findOne({ email: session.user!.email });

            res.status(200).send({error: false, data: user.eventos[user.eventos.length - 1] });
          } catch (error) {
            res.status(500).send({ error: true, errorMessage: error.message });
          }
        }
        break;
      case 'removeEvent':
        if (req.method === 'POST') {
          const { _id } = req.body;
          try {
            await User.updateOne({ email: session.user!.email! }, {
              $pull: { 'eventos' : {'_id' : _id } }
            });
            res.status(200).send({ error: false, data: { message: 'Removido com suceso!'}});
          } catch (error) {
            res.status(500).send({ error: true, errorMessage: error.message });
          }
        } else {
          res.send({ error: true, errorMessage: ERROR_NOT_LOGGED })
        }
        break;
      case 'updateEvent':
        if (req.method === 'POST') {
          const { _id, color } = req.body;
          
          try {
            await User.updateOne({ email: session.user!.email!, 'eventos._id': _id }, {
              $set: { 'eventos.$.eventProps.color' : color }
            });

            res.status(200).send({ error: false, data: { message : 'Atualizado com suceso'}});
          } catch (error) {
            res.status(500).send({ error: true, errorMessage: error.message });
          }
        } else {
          res.send({ error: true, errorMessage: ERROR_NOT_LOGGED })
        }
        break;
      case 'updateDragDrop':
          if (req.method === 'POST') {
            const { _id, evento } = req.body;
            
            try {
              await User.updateOne({ email: session.user!.email!, 'eventos._id': _id }, {
                $set: { 'eventos.$' : evento }
              });
  
              res.status(200).send({ error: false, data: { message : 'Atualizado com suceso'}});
            } catch (error) {
              res.status(500).send({ error: true, errorMessage: error.message });
            }
          } else {
            res.send({ error: true, errorMessage: ERROR_NOT_LOGGED })
          }
          break;
      case 'getEvents':
          if (req.method === 'GET') {
            try {
              const user = await User.findOne({ email: session.user!.email! });
              if (!user) throw new Error("usuário não encontrado!");
  
              res.status(200).send({
                error: false, data: user.eventos
              });
            } catch (error) {
              res.status(500).send({ error: true, errorMessage: error.message });
            }
          } else {
            res.send({ error: true, errorMessage: ERROR_NOT_LOGGED })
          }
          break;
      default:
        res.status(404).send({})
        break;
    }

  } else {
    return res.send({ error: true, errorMessage: ERROR_NOT_LOGGED })
  }
}

export default handler;