import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../../../services/mongodb';

const options = {
  site: process.env.NEXTAUTH_URL,
  providers: [
    Providers.Credentials({
      id: 'credentials',
      name: 'E-mail e senha.',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // credentials: {
      //     email: { label: "E-mail", type: "text", placeholder: "Insira seu e-mail" },
      //     password: { label: "Senha", type: "password", placeholder: "Insira sua senha" },
      // },
      credentials: {
        email: { label: "E-mail", type: "text", placeholder: "exemplo@gmail.com" },
        password: { label: "Senha", type: "password" }
      },
      // async authorize(credentials, req) {
      //     try {
      //         // buscar na api ou na db
      //         const { db } = await connectToDatabase();
      //         const userDb = await db.collection('users').findOne({ email: credentials.email })

      //         if (!userDb)
      //             return null;

      //         if (userDb) {
      //             // não seria necessário o bcrypt para uma api já pronta...
      //             const match = await bcrypt.compare(credentials.senha, userDb.senha);
      //             if (userDb && match) {
      //                 const user = { id: 1, name: userDb.name, email: userDb.email };

      //                 return user
      //             } else {
      //                 return null;
      //             }
      //         }
      //     } catch (error) {
      //         return null;
      //     }
      // }
      async authorize(credentials, req){
        // try {
          // buscar na api ou na db
          const { db } = await connectToDatabase();
          const userDb = await db.collection('users').findOne({ email: credentials.email })

          if (!userDb)
            return null;

          if (userDb) {
            // não seria necessário o bcrypt para uma api já pronta...
            const match = await bcrypt.compare(credentials.password, userDb.senha);
            if (userDb && match) {
              const user = { id: 1, name: userDb.name, email: userDb.email, image: userDb.image };

              return user
            }
          }
          return null;
      }
    }),

    Providers.Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    
  ],
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60,
  },
  database: process.env.MONGODB_URI,
  callbacks: {
    redirect: async (url: string, _: any) => {
      if (url === '/api/auth/signin') {
        return Promise.resolve('/painel')
      }
      return Promise.resolve(`/api/auth/signin`)
    },
  },
}

export default NextAuth(options)