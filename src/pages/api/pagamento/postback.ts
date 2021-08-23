import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { ERROR_NOT_LOGGED } from "../constants";

const handler =  async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req })
  
  
    if (session) {
      try {
          if(req.method === 'POST') {
            console.log(" ===> POST ", req.body);
          } else {
            console.log(" ===> GET ", req.query);
          }
      } catch (error) {
          return res.status(500).send({error: true, errorMessage: error.message});
      }
    } else {
      res.send({ error: true, errorMessage: ERROR_NOT_LOGGED })
    }
  }
  
  export default handler;