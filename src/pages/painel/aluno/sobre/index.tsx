import { getSession } from 'next-auth/client';
import React from 'react'
import MainLayout from '../../../../components/layout/MainLayout'
import Seo from '../../../../components/layout/Seo';
import { sobreQuery } from '../../../../graphql/query';
import { strapi } from '../../../../services/strapi';
import Markdown from 'markdown-to-jsx';

export async function getServerSideProps(ctx : any) {
  const session = await getSession(ctx);

  if(!session) {
      return {
          redirect: {
              permanent: false,
              destination: '/painel/entrar',
          }
      }
  }

  const sobre = await strapi(session.jwt).graphql({
      query: sobreQuery
  })

  return {
      props: {
        session: session,
        sobre
      }
  }
}

function Sobre({ sobre } : any) {
    return (
        <MainLayout>
            <Seo title="Sobre" />
              <div className="gridPlanejamento">
                <div className="content">
                  <div className="box">
                    <h1>{ sobre?.titulo }</h1>
                    <span className="desc" dangerouslySetInnerHTML={{ __html: `${sobre?.conteudo as string}` }}>
                    </span>
                  </div>
                </div>
              </div>
            <style jsx>
              {
                `
                .gridPlanejamento{display: grid; grid-template-columns: 1fr;}
                .gridPlanejamento .content{display: block; width: 100%;}
                .gridPlanejamento .content .box{display: block; width: 100%;border-radius: 0.75rem; background: var(--gray20); padding: 2.8125rem 1.5rem; position: relative; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
                .gridPlanejamento .content .box h1{display: block; width: 100%; text-align: center; font-weight: 500; font-size: 1.6875rem; margin: 0 0 1.5rem}
                .gridPlanejamento .content .box .desc{display: block; width: 100%; text-align: left; font-weight: 400; font-size: 1rem; color: #000}
                .gridPlanejamento .content .box .desc p{margin: 0 0 1rem; font-weight: 400; font-size: 1rem; color: #000}
                .gridPlanejamento .content .box .desc strong{font-weight: 500;}
                .gridPlanejamento .content .box .desc img{max-width: 60%; margin: 0 auto;}
                .gridPlanejamento .content .botao a{display: block; width: 100%; max-width: 400px; margin: 2rem auto; text-align: center; color: var(--gray20); font-family: 'Poppins', sans-serif; font-weight: 500; border-radius: 0.75rem; font-size: 1.2em; background: var(--dark); padding: 0.5125rem; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
                .gridPlanejamento .content .botao a:hover{transform: scale(0.9);}




                @media(max-width: 500px){
                  .gridPlanejamento{grid-template-columns: 1fr}
                }

                `
              }
            </style>
        </MainLayout>
    )
}

export default Sobre
