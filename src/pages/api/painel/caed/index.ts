import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import Pagina from "../../../../models/pagina";
import dbConnect from "../../../../services/mongodb";
import { ERROR_NOT_LOGGED } from "../../constants";

const handler =  async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req })
  
    await dbConnect();
  
    if (session) {
      try {

        const { faq } = req.query; 

        console.log(" ===> ", faq)
        
        var isFaq = faq != undefined;

        const response = await Pagina.find({ isFaq: isFaq });

        console.log(" ===> ", response)

        return res.status(200).send({ error: false, data: response });
          
      } catch (error) {
          return res.status(500).send({error: true, errorMessage: error.message});
      }
    } else {
      res.send({ error: true, errorMessage: ERROR_NOT_LOGGED })
    }
  }
  
  export default handler;