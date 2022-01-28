import Link from "next/link";
import React from "react";
import MainLayout from "../../../components/layout/MainLayout";
import { useRedacaoStore } from "../../../hooks/redacaoStore";
import Moment from "moment";
import { useUserStore } from "../../../hooks/userStore";
import { debugPrint } from "../../../utils/debugPrint";
import { useCorretorStore } from "../../../hooks/corretorStore";
import { strapi } from "../../../services/strapi";
import {
  redacaoParaCorrigir,
  redacaoParaCorrigirNovoMetodo,
} from "../../../graphql/query";
import { getSession } from "next-auth/client";
import { corretor_type } from "../../../utils/helpers";
import Seo from "../../../components/layout/Seo";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Whatsapp from "../../../components/layout/Whatsapp";

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
    query: redacaoParaCorrigirNovoMetodo, //redacaoParaCorrigir(corretor_type(session.corretor_type as string))
  });

  return {
    props: {
      session: session,
      redacoesProps: redacoes,
    },
  };
}

function DashboardCorretor({ redacoesProps, session }: any) {
  const redacoes = useCorretorStore((state) => state.redacoes);
  const setRedacoes = useCorretorStore((state) => state.setRedacoes);
  const setNullRedacoes = useCorretorStore((state) => state.setNullRedacoes);
  const router = useRouter();

  const notify = () => toast.error("Você já corrigiu essa redação!");
  const notifyReset = () => toast.error("Redação rejeitada!");
  React.useEffect(() => {
    // console.log("==> ", session);
    setRedacoes(redacoesProps);
    return () => setNullRedacoes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUrl = (redacao: any) => {
    router.push(`/painel/corretor/correcao/${redacao.id}`);
  };

  return (
    <MainLayout menuType={2} role="corretor">
      <Seo title="Correções duplas" />

      <div className="redacoes-box">
        <div className="content">
          <div className="head">
            <div className="data">Data</div>
            <div className="tema">Tema</div>
            <div className="estudante">Estudante</div>
            <div className="circle">Status</div>
          </div>

          <div className="list-item">
            {redacoes && redacoes?.length <= 0 && (
              <h1 className="msg_nada_encontrado">
                Nenhuma redação para corrigir.
              </h1>
            )}
            {redacoes?.length > 0 &&
              redacoes.map((redacao: any, index: number) => {
                const corrigida: any = [];
                let backgroundColor = "";
                const correcaoStatus: string = redacao.status_correcao;
                const corretorRedacaoGetID = redacao.correcaos;
                const idCorretorCorrigida = corretorRedacaoGetID.forEach(
                  (element: any) => {
                    corrigida.push(element.corretor.id);
                  }
                );
                const getOrNotify = (redacao: any) => {
                  if (corrigida == session.id) {
                    notify();
                  } else {
                    notifyReset();
                  }
                };
                const date = Moment(redacao.createdAt);

                switch (correcaoStatus) {
                  case "correcao_dois":
                    backgroundColor = "#72b01e";
                    break;
                  case "rejeitada":
                    backgroundColor = "#ff0000";
                    break;
                  default:
                    backgroundColor = "#DEC90D";
                }

                if (corrigida == session.id) {
                  return (
                    <a onClick={() => getOrNotify(redacao)} key={index}>
                      <div
                        className="item-finished"
                        style={{ cursor: "pointer" }}
                      >
                        <div className="data-finished">{`${date.format(
                          "DD/MM"
                        )}`}</div>
                        <div className="tema-finished">
                          {redacao.tema.titulo}
                        </div>
                        <div className="estudante-finished">
                          {redacao.user.email}
                        </div>

                        <div className="circle">
                          {redacao.status_correcao != "rejeitada" ? (
                            <div className="dual_bals">
                              <span
                                className="ic"
                                style={
                                  redacao.status_correcao == "correcao_dois"
                                  ? { background: "#72b01e" }
                                    : { background: "#DEC90D" }
                                }
                              >
                                &nbsp;
                              </span>
                              <span
                                className="ic"
                                style={
                                  redacao.status_correcao == "finalizada"
                                  ? { background: "#72b01e" }
                                  : { background: "#DEC90D" }
                                }
                              >
                                &nbsp;
                              </span>
                            </div>
                          ) : (
                            <div className="dual_bals">
                              <span
                                className="ic"
                                style={
                                  redacao.status_correcao == "rejeitada"
                                    ? { background: "#ff0000" }
                                    : { background: "#72b01e" }
                                }
                              >
                                &nbsp;
                              </span>
                              <span
                                className="ic"
                                style={
                                  redacao.status_correcao == "rejeitada"
                                    ? { background: "#ff0000" }
                                    : { background: "#72b01e" }
                                }
                              >
                                &nbsp;
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </a>
                  );
                } else if (redacao.status_correcao == "rejeitada") {
                  return (
                    <a onClick={() => getOrNotify(redacao)} key={index}>
                      <div className="item" style={{ cursor: "pointer" }}>
                        <div className="data">{`${date.format("DD/MM")}`}</div>
                        <div className="tema">{redacao.tema.titulo}</div>
                        <div className="estudante">{redacao.user.email}</div>

                        <div className="circle">
                          {redacao.status_correcao != "rejeitada" ? (
                            <div className="dual_bals">
                              <span
                                className="ic"
                                style={
                                  redacao.status_correcao == "correcao_um"
                                    ? { background: "#DEC90D" }
                                    : { background: "#72b01e" }
                                }
                              >
                                &nbsp;
                              </span>
                              <span
                                className="ic"
                                style={
                                  redacao.status_correcao == "correcao_dois"
                                    ? { background: "#DEC90D" }
                                    : { background: "#72b01e" }
                                }
                              >
                                &nbsp;
                              </span>
                            </div>
                          ) : (
                            <div className="dual_bals">
                              <span
                                className="ic"
                                style={
                                  redacao.status_correcao == "rejeitada"
                                    ? { background: "#ff0000" }
                                    : { background: "#72b01e" }
                                }
                              >
                                &nbsp;
                              </span>
                              <span
                                className="ic"
                                style={
                                  redacao.status_correcao == "rejeitada"
                                    ? { background: "#ff0000" }
                                    : { background: "#72b01e" }
                                }
                              >
                                &nbsp;
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </a>
                  );
                } else if (redacao.status_correcao != "rejeitada") {
                  return (
                    <a onClick={() => getUrl(redacao)} key={index}>
                      <div className="item" style={{ cursor: "pointer" }}>
                        <div className="data">{`${date.format("DD/MM")}`}</div>
                        <div className="tema">{redacao.tema.titulo}</div>
                        <div className="estudante">{redacao.user.email}</div>

                        <div className="circle">
                          {redacao.status_correcao != "rejeitada" ? (
                            <div className="dual_bals">
                              <span
                                className="ic"
                                style={
                                  redacao.status_correcao == "correcao_um"
                                    ? { background: "#DEC90D" }
                                    : { background: "#72b01e" }
                                }
                              >
                                &nbsp;
                              </span>
                              <span
                                className="ic"
                                style={
                                  redacao.status_correcao == "correcao_dois" &&
                                  redacao.correcaos.length >= 2
                                    ? { background: "#72b01e" }
                                    : { background: "#DEC90D" }
                                }
                              >
                                &nbsp;
                              </span>
                            </div>
                          ) : (
                            <div className="dual_bals">
                              <span
                                className="ic"
                                style={
                                  redacao.status_correcao == "rejeitada"
                                    ? { background: "#ff0000" }
                                    : { background: "#72b01e" }
                                }
                              >
                                &nbsp;
                              </span>
                              <span
                                className="ic"
                                style={
                                  redacao.status_correcao == "rejeitada"
                                    ? { background: "#ff0000" }
                                    : { background: "#72b01e" }
                                }
                              >
                                &nbsp;
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </a>
                  );
                } else if (redacao.status_correcao == "finalizada") {
                  return (
                    <a onClick={() => getUrl(redacao)} key={index}>
                      <div className="item" style={{ cursor: "pointer" }}>
                        <div className="data">{`${date.format("DD/MM")}`}</div>
                        <div className="tema">{redacao.tema.titulo}</div>
                        <div className="estudante">{redacao.user.email}</div>

                        <div className="circle">
                          {redacao.status_correcao != "rejeitada" && (
                            <div className="dual_bals">
                              <span
                                className="ic"
                                style={{ background: "#72b01e" }}
                              >
                                &nbsp;
                              </span>
                              <span
                                className="ic"
                                style={{ background: "#72b01e" }}
                              >
                                &nbsp;
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </a>
                  );
                }
              })}
          </div>
        </div>
        <div className="caption">
          <span className="ic-yellow">&nbsp;</span>
          <h1>Esperando</h1>
          <span className="ic-green">&nbsp;</span> <h1>Corrigida</h1>
          <span className="ic-red">&nbsp;</span> <h1>Rejeitada</h1>
        </div>
        <Whatsapp></Whatsapp>
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

          .redacoes-box .content .head {
            display: flex;
            width: 100%;
            font-size: 1.125rem;
            gap: 1rem;
            font-weight: 500;
            color: var(--dark);
            margin: 0 0 1rem;
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

export default DashboardCorretor;
