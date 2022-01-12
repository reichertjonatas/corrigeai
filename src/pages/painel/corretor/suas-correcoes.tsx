import React from "react";
import MainLayout from "../../../components/layout/MainLayout";
import Seo from "../../../components/layout/Seo";
import { useCorretorStore } from "../../../hooks/corretorStore";
import shallow from "zustand/shallow";
import Link from "next/link";
import Moment from "moment";
import { getSession } from "next-auth/client";
import { strapi } from "../../../services/strapi";
import { minhasRedacoes } from "../../../graphql/query";
import { corretor_type } from "../../../utils/helpers";
import { useRouter } from "next/router";

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx);

  if (!session)
    return {
      redirect: {
        permanent: false,
        destination: "/painel/entrar",
      },
    };

  const redacoes = await strapi(session.jwt).graphql({
    query: minhasRedacoes(session.id),
  });

  return {
    props: {
      session: session,
      minhasCorrecoes: redacoes,
    },
  };
}

function SuasCorretocoes({ session, minhasCorrecoes }: any) {
  const router = useRouter();
  const getUrl = (redacao: any) => {
    router.push(`/painel/corretor/corrigida/${redacao.id}`);
  };

  return (
    <MainLayout menuType={2} role="corretor">
      <Seo title="Suas correções" />

      <div className="redacoes-box">
        <div className="content">
          <h1>Suas Correções</h1>
          <div className="head">
            <div className="data">Data</div>
            <div className="tema">Tema</div>
            <div className="estudante">Estudante</div>
          </div>

          <div className="list-item">
            {minhasCorrecoes != null &&
              minhasCorrecoes?.length > 0 &&
              minhasCorrecoes.map((redacao: any, index: number) => {
                const date = Moment(redacao.createdAt);
                return (
                  <a style={{
                    cursor: "pointer"
                  }} onClick={() => getUrl(redacao)} key={index}>
                    <div className="item">
                      <div className="data">{`${date.format("DD/MM")}`}</div>
                      <div className="tema">{redacao.tema.titulo}</div>
                      <div className="estudante">{redacao.user.email}</div>
                    </div>
                  </a>
                );
              })}
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .redacoes-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 12.3125rem;
            width: 100%;
            border-radius: 0.75rem;
            background: var(--gray20);
            padding: 0.8125rem;
            position: relative;
            box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.15);
          }
          .redacoes-box .content {
            display: block;
            width: 100%;
          }

          .redacoes-box h1 {
            color: var(--dark);
            font-size: 1.5rem;
            width: 100%;
            border-bottom: 1px solid var(--dark);
            text-align: center;
            padding: 0.5rem 0;
            margin: 0 0 2rem;
          }

          .redacoes-box .content .head {
            display: flex;
            width: 100%;
            font-size: 1.125rem;
            gap: 1rem;
            font-weight: 500;
            color: var(--dark);
            margin: 0 0 1rem;
          }
          .redacoes-box .content .head .data {
            display: flex;
            justify-content: center;
            flex: 1;
          }
          .redacoes-box .content .head .tema {
            display: flex;
            justify-content: center;
            flex: 7;
          }
          .redacoes-box .content .head .estudante {
            display: flex;
            justify-content: center;
            flex: 2;
          }
          .redacoes-box .content .head .circle {
            display: flex;
            justify-content: center;
            flex: 1;
            text-align: center;
          }

          .redacoes-box .content .list-item .item {
            display: flex;
            width: 100%;
            gap: 1rem;
            margin: 0 0 1rem;
          }
          .redacoes-box .content .list-item .item .data {
            display: flex;
            justify-content: center;
            align-items: center; /* flex: 1; */
            font-size: 1.125rem;
            font-weight: 500;
            color: var(--dark);
            background: var(--gray50);
            min-height: 2.4375rem;
            border-radius: 0.9rem;
            width: 15%;
          }
          .redacoes-box .content .list-item .item .tema {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.125rem;
            font-weight: 500;
            color: var(--dark);
            background: var(--gray50);
            min-height: 2.4375rem;
            border-radius: 0.9rem;
            width: 100%;
            padding: 0.5rem;
          }
          .redacoes-box .content .list-item .item .estudante {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 1.125rem;
            font-weight: 500;
            color: var(--dark);
            background: var(--gray50);
            min-height: 2.4375rem;
            border-radius: 0.9rem;
            width: 345px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding: 0.5rem;
          }
          .redacoes-box .content .list-item .item .circle {
            display: flex;
            flex: 1;
            justify-content: center;
            align-items: center;
          }
          .redacoes-box .content .list-item .item .circle .ic {
            display: block;
            width: 1.375rem;
            height: 1.375rem;
            border-radius: 50%;
            border: none;
          }

          @media (max-width: 400px) {
            .redacoes-box .content .head .data {
              font-size: 1rem;
            }
            .redacoes-box .content .head .tema {
              font-size: 1rem;
            }
            .redacoes-box .content .head .estudante {
              font-size: 1rem;
            }
            .redacoes-box .content .head .circle {
              font-size: 1rem;
            }
            .redacoes-box .content .list-item .item .data {
              font-size: 1rem;
            }
            .redacoes-box .content .list-item .item .tema {
              font-size: 1rem;
            }
            .redacoes-box .content .list-item .item .estudante {
              font-size: 1rem;
            }
            .redacoes-box .content .list-item .item .circle {
              font-size: 1rem;
            }
          }
        `}
      </style>
    </MainLayout>
  );
}

export default SuasCorretocoes;
