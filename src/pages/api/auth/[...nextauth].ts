import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import nodemailer from "nodemailer"
import axios from 'axios';
import Adapters from 'next-auth/adapters';

const options = {
  site: process.env.NEXTAUTH_URL,
  pages: {
    signIn: '/painel/entrar',
    signOut: '/painel/sair',
    error: '/painel/entrar',
    // newUser: '/painel/novo-usuario',
    verifyRequest: '/painel/verificar-email',
  },
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "test@test.com" },
        password: {  label: "Password", type: "password" }
      },
    async authorize(credentials) {
        try {
          const { data } = await axios.post(`${process.env.NEXT_PUBLIC_URL_API}/auth/local`, {
            identifier: credentials.email,
            password: credentials.password
          });
          if (data) {
            return data;
          }
          else {
            return null;
          }
        } catch (e) {
          // console.log('caught error');
          // const errorMessage = e.response.data.message
          // Redirecting to the login page with error message          in the URL
          // throw new Error(errorMessage + '&email=' + credentials.email)
          return null;
        }
      }
    }),

    Providers.Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: ({
        identifier: email,
        url,
        token,
        baseUrl,
        provider,
      }) => {
        return new Promise((resolve, reject) => {
          const { server, from } = provider
          // Strip protocol from URL and use domain as site name
          const site = baseUrl.replace(/^https?:\/\//, "")

          nodemailer.createTransport(server).sendMail(
            {
              to: email,
              from,
              subject: `Acesso a plataforma ${site}`,
              text: text({ url, site, email }),
              html: html({ url, site, email }),
            },
            (error: any) => {
              if (error) {
                // @ts-ignore
                logger.error("SEND_VERIFICATION_EMAIL_ERROR", email, error)
                // @ts-ignore
                return reject(new Error("SEND_VERIFICATION_EMAIL_ERROR", error))
              }
              // @ts-ignore
              return resolve()
            }
          )
        })
      },
    }),

  ],
  database: process.env.NEXT_PUBLIC_DATABASE_URL,
  session: {
    jwt: true,
  },
  callbacks: {
    jwt: async (token:any, user:any, account:any) => {
      const isSignIn = user ? true : false;
      if (isSignIn) {
        // console.log(" ========> ", user);
        if(account.type === "credentials") {
          token.jwt = user.jwt;
          token.id = user.user.id;
          token.name = user.user.name;
          token.email = user.user.email;
          if(user?.user?.foto?.url) token.image = user?.user?.foto?.url;
          if(user?.user?.subscription) token.subscription = user.user.subscription;
          token.role  = user.user.role;

          if(user?.user?.role?.type == 'corretor') {
            token.corretor_type = user.user.corretor_type;
            token.descrepancia  = user.user.descrepancia;
          }
          console.log(token)
        }
      }
      return Promise.resolve(token);
    },
  
    session: async (session:any, user:any) => {
      session.jwt = user.jwt;
      session.id = user.id;

      if(user?.subscription) session.subscription = { ...user.subscription, transacaos: null, card_hash: null }
      
      // if(user?.subscription) session.subscription = {
      //   id: user.subscription.envios._id,
      //   subscriptionType: user.subscription.subscriptionType,
      //   envios: user.subscription.envios,
      //   enviosAvulsos: user.subscription.enviosAvulsos,
      //   plano_id: user.subscription.plano_id,
      //   subscriptionName: user.subscription.subscriptionName,
      //   subscriptionDate: user.subscription.subscriptionDate,
      //   subscriptionExper: user.subscription.subscriptionExper
      // };

      if(user?.role) session.role = {
        type: user.role.type
      };
      if(user?.image) session.user.image  = user.image;

      if(user?.role?.type == 'corretor') {
        session.corretor_type = user.corretor_type;
        session.descrepancia  = user.descrepancia;
      }

      // console.log("session final ", session);
      return Promise.resolve(session);
    },
  },
  // database: process.env.NEXT_PUBLIC_DATABASE_URL,
}

// Email HTML body
const html = ({ url, site, email }: any) => {
  // Insert invisible space into domains and email address to prevent both the
  // email address and the domain from being turned into a hyperlink by email
  // clients like Outlook and Apple mail, as this is confusing because it seems
  // like they are supposed to click on their email address to sign in.
  const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`
  const escapedSite = `${site.replace(/\./g, "&#8203;.")}`

  // Some simple styling options
  const backgroundColor = "#f9f9f9"
  const textColor = "#444444"
  const mainBackgroundColor = "#ffffff"
  const buttonBackgroundColor = "#72b01d"
  const buttonBorderColor = "#72b01d"
  const buttonTextColor = "#ffffff"

  // Uses tables for layout and inline CSS due to email client limitations
  return `
<body style="background: ${backgroundColor}; padding: 32px;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        <strong>${escapedSite}</strong>
      </td>
    </tr>
  </table>
  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        Entrar como <strong>${escapedEmail}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">Acessar agora</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        Se você não solicitou este e-mail, pode ignorá-lo por segurança.
      </td>
    </tr>
  </table>
</body>
`
}

// Email text body – fallback for email clients that don't render HTML
const text = ({ url, site }: any) => `Acesso a plataforma ${site}\n${url}\n\n`


export default NextAuth(options)