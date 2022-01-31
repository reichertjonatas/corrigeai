/* eslint-disable @next/next/no-img-element */
import { getSession, useSession } from "next-auth/client";
import {
  IcAlert,
  IcLike,
  IcUltimosEnvios,
  IcRocket,
} from "../../../components/icons";
import MainLayout from "../../../components/layout/MainLayout";
import Image from "next/image";
import { useRouter } from "next/dist/client/router";
import React, { useEffect } from "react";
import {
  mediaGeral,
  notaTotalCorrecao,
  notaTotalRedacao,
} from "../../../utils/helpers";
import Link from "next/link";
import Seo from "../../../components/layout/Seo";
import Popup from "reactjs-popup";
import { toast } from "react-toastify";
import { PointSymbolProps, ResponsiveLine } from "@nivo/line";
import PreLoader from "../../../components/PreLoader";
import Select from "react-select";
import NoSSRWrapper from "../../../components/layout/NoSSRWrapper";
import { useMeStore } from "../../../hooks/meStore";
import {
  ISubscription,
  useSubscriptionStore,
} from "../../../hooks/subscriptionStore";
import { strapi } from "../../../services/strapi";
import { useRedacaoStore } from "../../../hooks/redacaoStore";
import { mediaCorrigeAi, redacaoPerUser } from "../../../graphql/query";
import EnviarRedacao from "../../../components/EnviarRedacao";
import Cookies from "universal-cookie";
import Whatsapp from "../../../components/layout/Whatsapp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox } from "@fortawesome/free-solid-svg-icons";

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx);

  if (!session)
    return {
      redirect: {
        permanent: false,
        destination: "/painel/entrar",
      },
    };

  const temas = await strapi(session.jwt).graphql({
    query: `query{
      temas {
        id
        titulo
      }
    }`,
  });

  const mediaCorrige = await strapi(session.jwt).graphql({
    query: mediaCorrigeAi,
  });

  const redacoes = await strapi(session.jwt).graphql({
    query: redacaoPerUser(session.id),
  });

  return {
    props: {
      session: session,
      temasProps: temas,
      redacoesProps: redacoes,
      mediaCorrigeAi: (mediaCorrige as any)?.aggregate?.avg?.nota_final ?? 0,
    },
  };
}

const cookies = new Cookies();

function Aluno({ redacoesProps, temasProps, mediaCorrigeAi }: any) {
  const [session, loading] = useSession();

  const [timer, setTimer] = React.useState<null | any>(null);

  const [open, setOpen] = React.useState(false);
  const closeModal = () => setOpen(false);

  const subscription = useSubscriptionStore((state) => state.subscription);
  const setSubscription = useSubscriptionStore(
    (state) => state.setSubscription
  );

  const redacoes = useRedacaoStore((state) => state.redacoes);
  const setRedacoes = useRedacaoStore((state) => state.setRedacoes);

  const [open2, setOpen2] = React.useState(false);

  useEffect(() => {
    const showModal = cookies.get("modalFundador");
    if (!showModal) {
      setOpen2(true);
      cookies.set("modalFundador", "true", { path: "/" });
    }
  }, []);

  /// upload
  // const [file, setFile] = React.useState<any | null>(null);
  // const [createObjectURL, setCreateObjectURL] = React.useState<any | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (session?.jwt && !loading) {
      ////console.log("me => ", session.jwt)
      if (session?.subscription)
        setSubscription(session.subscription as ISubscription, session.jwt);

      setRedacoes(redacoesProps?.length >= 0 ? redacoesProps : []);
    }
  }, [session]);

  if (loading) return <PreLoader />;

  if (!session && !loading) {
    router.push("/painel/entrar");
    return <PreLoader />;
  }

  const CustomSymbol = ({ size, borderColor, datum }: PointSymbolProps) => {
    return (
      <g
        style={{
          overflowWrap: "break-word",
          wordWrap: "break-word",
          width: 120,
        }}
      >
        <circle r={size} stroke={borderColor} fill={borderColor} />

        <text
          textAnchor="middle"
          y="6"
          style={{
            fontFamily: "Poppins",
            fontSize: "16px",
            fill: "#fff",
            fontWeight: 500,
          }}
        >
          {datum.y as number}
        </text>
        <switch>
          <foreignObject x="-60" y="36" width="120" height="100">
            <text
              textAnchor="middle"
              y={46}
              style={{
                fontFamily: "Poppins",
                fontSize: "12px",
                fill: "#000",
                fontWeight: 500,
                textAlign: "center",
                display: "inline-block",
              }}
            >
              {datum.tema.slice(0, 64) + "..."}
            </text>
          </foreignObject>
        </switch>
      </g>
    );
  };

  const ultimaNota = () => {
    if (redacoes?.length > 0) {
      const redacoesLocal = redacoes.filter(
        (item: any) => item.status_correcao === "finalizada"
      );
      ////console.log("redacoes", redacoesLocal.length)
      if (redacoesLocal.length <= 0) return "---";
      ////console.log("===> redação", redacoesLocal[redacoesLocal.length - 1])
      return notaTotalRedacao(redacoesLocal[redacoesLocal.length - 1]) == 0
        ? "---"
        : notaTotalRedacao(redacoesLocal[redacoesLocal.length - 1]);
    }

    return "---";
  };

  const dataEnvios = () => {
    ////console.log("dataEnvios")
    var data: { x: string; y: number; tema: string }[] = [];

    if (redacoes?.length > 0) {
      const redacoesLocal = redacoes.filter(
        (item: any) => item.status_correcao == "finalizada"
      );

      //console.log("redacoesLocal ====> ", redacoesLocal)
      //console.log("redacoes", redacoesLocal.length)
      if (redacoesLocal.length <= 0) return [];

      let numeroAExibir;
      if (redacoesLocal.length > 3) {
        numeroAExibir = 4;
      } else {
        numeroAExibir = redacoesLocal.length;
      }
      redacoesLocal
        .slice(redacoesLocal.length - numeroAExibir, redacoesLocal.length)
        .map((item: any) => {
          data.push({
            x: item.createdAt,
            y: notaTotalRedacao(item),
            tema: item.tema.titulo ?? "",
          });
          return item;
        });
    }

    return data;
  };

  const closeModal2 = () => setOpen2(false);
  return (
    <MainLayout>
      <Seo title="Painel do Aluno" />
      <div className="grid-painelaluno">
        <div className="content">
          <div className="head-box">
            <div className="box">
              <span className="icon">
                <Image src={IcLike} className="img-responsive" alt="" />
              </span>
              <span className="texto">
                {redacoes?.length > 0
                  ? `Você já enviou ${redacoes.length} ${
                      redacoes.length == 1 ? "redação" : "redações"
                    }.`
                  : "Você ainda não enviou redações!"}
              </span>
              <span
                className="hr"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(114,176,30,1) 0%, rgba(201,203,200,1) 100%)",
                }}
              >
                &nbsp;
              </span>
            </div>
            <div className="box">
              <span className="icon">
                <Image src={IcAlert} className="img-responsive" alt="" />
              </span>
              <span className="texto">
                Você possui {subscription?.envios} envios.
              </span>
              {/* {subscription != null && subscription.envios <= 0 && <span className="button">
                <Link href="/planos">Comprar agora</Link>
              </span>} */}
              <span
                className="hr"
                style={{
                  background:
                    "linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(237,28,36,1) 0%, rgba(201,203,200,1) 100%)",
                }}
              >
                &nbsp;
              </span>
            </div>
          </div>
          <div className="box-content">
            <span className="head-content">
              <span className="icon">
                <Image
                  src={IcUltimosEnvios}
                  className="img-responsive"
                  alt=""
                />
              </span>
              <span className="title">Seus últimos envios</span>
            </span>
            <div className="graphic">
              {redacoes?.length > 0 && dataEnvios().length ? (
                <div style={{ height: 230, width: "100%" }}>
                  <ResponsiveLine
                    data={[
                      {
                        id: "envios",
                        data: false
                          ? [
                              {
                                x: "2019-05-01",
                                y: 500,
                                tema: `Democratização do acesso ao cinema no Brasil`,
                              },
                              {
                                x: "2019-06-01",
                                y: 600,
                                tema: `Democratização do acesso ao cinema no Brasil`,
                              },
                            ]
                          : dataEnvios(),
                      },
                    ]}
                    margin={{ top: 50, right: 120, bottom: 100, left: 120 }}
                    yScale={{
                      type: "linear",
                      min: "auto",
                      max: "auto",
                      stacked: true,
                      reverse: false,
                    }}
                    curve="cardinal"
                    pointSymbol={CustomSymbol}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={null}
                    axisLeft={null}
                    enableGridX={false}
                    enableGridY={false}
                    colors={["#72b01d"]}
                    lineWidth={4}
                    pointSize={30}
                    pointColor={{ from: "color", modifiers: [] }}
                    pointBorderColor={{ from: "color", modifiers: [] }}
                    enablePointLabel={false}
                    pointLabelYOffset={42}
                    isInteractive={false}
                    useMesh
                    legends={[]}
                  />
                </div>
              ) : (
                <div style={{ padding: 50, textAlign: "center" }}>
                  {redacoes?.length == 0
                    ? "Envie a primeira redação para gerar estatísticas!"
                    : "O gráfico será exibido quando a redação receber uma correção."}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="sidebar-panel">
          <div className="grades">
            <ul>
              <li>Sua última nota: {ultimaNota()}</li>
              <li>
                Sua média geral:{" "}
                {mediaGeral(
                  redacoes.filter(
                    (redacao) => redacao.status_correcao === "finalizada"
                  )
                ) == 0 ||
                mediaGeral(
                  redacoes.filter(
                    (redacao) => redacao.status_correcao === "finalizada"
                  )
                ) == undefined
                  ? "---"
                  : mediaGeral(
                      redacoes.filter(
                        (redacao) => redacao.status_correcao === "finalizada"
                      )
                    )}{" "}
              </li>
              <li>
                Média Corrige Aí:{" "}
                {Math.round(mediaCorrigeAi) === 0
                  ? "---"
                  : Math.round(mediaCorrigeAi)}
              </li>
            </ul>
          </div>

          <div className="submit-essay">
            <span className="name">
              <a
                style={{ cursor: "pointer" }}
                onClick={() =>
                  subscription != null
                    ? subscription.envios > 0
                      ? setOpen(true)
                      : toast.error("Você não possui envios disponíveis!")
                    : toast.error("Você não possui envios disponíveis!")
                }
              >
                <span className="icon">
                  <Image src={IcRocket} className="img-responsive" alt="" />
                </span>
                Enviar redação
              </a>
            </span>

            <Popup
              open={open}
              onClose={closeModal}
              modal
              nested
              closeOnDocumentClick={false}
              className="popup-envio"
            >
              <EnviarRedacao
                session={session}
                temasProps={temasProps}
                closeModal={closeModal}
              />
            </Popup>
          </div>
          <div className="themes">
            <ul>
              <li>
                <Link href="/painel/aluno/temas">Ver todos os temas</Link>
              </li>
              <li>
                <a target="_blank" href="/images/folha_redação_1.pdf">
                  Baixar folha de redação
                </a>
              </li>
            </ul>
          </div>
        </div>
        <Whatsapp></Whatsapp>
      </div>
    </MainLayout>
  );
}

export default Aluno;
