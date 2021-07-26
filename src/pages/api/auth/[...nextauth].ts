import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import User from '../../../models/user';
import connectDB from '../../../services/mongodb';
import bcrypt from 'bcryptjs';

const options = {
  site: process.env.NEXTAUTH_URL,
  pages: {
    signIn: '/painel/entrar',
    signOut: '/painel/sair',
    //error: '/auth/error', // Error code passed in query string as ?error=
    //verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: '/painel/novo-usuario' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
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
      async authorize(credentials) {
        // try {
        // buscar na api ou na db
        // console.log(credentials);
        const userDb = await User.findOne({ email: credentials.email })

        if (!userDb)
          return null;

        if (userDb) {
          //const match = credentials.password == userDb.password;
          const match = await bcrypt.compare(credentials.password, userDb.password);
          console.log( 'match ', match );

          if (userDb && match) {
            const user = { id: userDb._id, name: userDb.name, email: userDb.email, image: userDb.image ?? null, userType: userDb.userType };
            // console.log(user);
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
  },
  database: process.env.MONGODB_URI,
  // callbacks: {
  //   redirect: async (url: string, _: any) => {
  //     if (url === '/api/auth/signin') {
  //       return Promise.resolve('/painel')
  //     }
  //     return Promise.resolve(`/api/auth/signin`)
  //   },
  // },
}

export default connectDB(NextAuth(options))