import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import bcrypt from 'bcryptjs';
import User from '../../../models/user';

const options = {
  site: process.env.NEXTAUTH_URL,
  pages: {
    signIn: '/painel/entrar',
    signOut: '/painel/sair',
    error: '/painel/entrar',
    newUser: '/painel/novo-usuario'
  },
  providers: [
    Providers.Credentials({
      id: 'credentials',
      name: 'E-mail e senha.',
      credentials: {
        email: { label: "E-mail", type: "text", placeholder: "exemplo@gmail.com" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        // try {
        // buscar na api ou na db
        console.log("credentials ===>", credentials, ' ====> ', credentials.email );
        const userDb = await User.findOne({ email: credentials.email })
        console.log('userDb ===>', userDb)

        if (!userDb)
          return null;

        if (userDb) {
          //const match = credentials.password == userDb.password;
          const match = await bcrypt.compare(credentials.password, userDb.password);
          console.log( 'match ', match );

          if (userDb && match) {
            const user = { id: userDb._id, name: userDb.name, email: userDb.email, image: userDb.image ?? null, userType: userDb.userType, subscription: userDb.subscription};
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
}

export default NextAuth(options)