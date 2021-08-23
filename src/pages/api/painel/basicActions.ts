import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
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

export default handler;






// import { NextApiRequest, NextApiResponse } from 'next'
// import { getSession } from 'next-auth/client'
// import { ERROR_NOT_LOGGED } from '../../../constants'

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//     const session = await getSession({ req })
//     const { actions } = req.query;


//     await dbConnect();
    
//     console.log('actions', actions)
//     if (session) {
//         switch (actions) {

//             case 'getAll':
//                 if (req.method === 'POST') {
//                     const { isFaq} = req.body;

//                     try {
                        

//                         return res.status(200).send({});
//                     } catch (error) {
//                         return res.status(500).send({ error: true, errorMessage: error.message });
//                     }
//                 }
//                 break;
            
//             case 'read':
//                 if (req.method === 'POST') {
//                     try {
//                         // create logic
//                         // if (!user) throw new Error("usuário não encontrado!");

//                         return res.status(200).send({});
//                     } catch (error) {
//                         return res.status(500).send({ error: true, errorMessage: error.message });
//                     }
//                 }
//                 break;

//             case 'create':
//                 if (req.method === 'POST') {
//                     try {
//                         // create logic
//                         // if (!user) throw new Error("usuário não encontrado!");

//                         return res.status(200).send({});
//                     } catch (error) {
//                         return res.status(500).send({ error: true, errorMessage: error.message });
//                     }
//                 }
//                 break;
            
//             case 'update':
//                 if (req.method === 'POST') {
//                     try {
//                         // create logic
//                         // if (!user) throw new Error("usuário não encontrado!");

//                         return res.status(200).send({});
//                     } catch (error) {
//                         return res.status(500).send({ error: true, errorMessage: error.message });
//                     }
//                 }
//                 break;

//             case 'delete':
//                 if (req.method === 'POST') {
//                     try {
//                         //remove update

//                         return res.status(200).send({});
//                     } catch (error) {
//                         return res.status(500).send({ error: true, errorMessage: error.message });
//                     }
//                 } else {
//                     return res.send({ error: true, errorMessage: ERROR_NOT_LOGGED })
//                 }
//                 break;
//             default:
//                 return res.status(404).send({})

//         }
//     } else {
//         return res.send({ error: true, errorMessage: ERROR_NOT_LOGGED })
//     }
// }

// export default handler;