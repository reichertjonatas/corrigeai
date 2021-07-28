import { NextApiRequest, NextApiResponse } from "next";
import User from "../../../models/user";
import dbConnect from "../../../services/mongodb";
import bcrypt from 'bcryptjs';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
      const { name, email, password } = req.body;

      await dbConnect();
      
      if (name && email && password) {
          try {
            var passwordhash = await bcrypt.hash(password, parseInt(process.env.BYCRYPT_SALTROUNDS!));
            var user = new User({
              name,
              email,
              password: passwordhash,
            });
            // Create new user
            var usercreated = await user.save();
            return res.status(200).send(usercreated);
          } catch (error) {
            return res.status(500).send(error.message);
          }
        } else {
          res.status(422).send('data_incomplete');
        }
    } else {
      res.status(422).send('req_method_not_supported');
    }
  };
  
  export default handler;