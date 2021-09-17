/* eslint-disable @next/next/no-img-element */
import { getSession, useSession } from 'next-auth/client'
import { IcAlert, IcLike, IcUltimosEnvios, IcRocket } from '../../../components/icons'
import MainLayout from '../../../components/layout/MainLayout'
import Image from 'next/image'
import { useRouter } from 'next/dist/client/router'
import React, { useEffect } from 'react'
import { mediaGeral, notaTotalCorrecao, notaTotalRedacao } from '../../../utils/helpers'
import Link from 'next/link'
import Seo from '../../../components/layout/Seo'
import Popup from 'reactjs-popup'
import { toast } from 'react-toastify'
import { PointSymbolProps, ResponsiveLine } from "@nivo/line";
import PreLoader from '../../../components/PreLoader'
import Select from 'react-select'
import NoSSRWrapper from '../../../components/layout/NoSSRWrapper'
import { useMeStore } from '../../../hooks/meStore'
import { ISubscription, useSubscriptionStore } from '../../../hooks/subscriptionStore'
import { strapi } from '../../../services/strapi'
import { useRedacaoStore } from '../../../hooks/redacaoStore'
import { mediaCorrigeAi, redacaoPerUser } from '../../../graphql/query'
import EnviarRedacao from '../../../components/EnviarRedacao'


export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx);

  if (!session)
    return {
      redirect: {
        permanent: false,
        destination: '/painel/entrar'
      }
    }

  const temas = await strapi(session.jwt).graphql({
    query: `query{
      temas {
        id
        titulo
      }
    }`
  })

  const mediaCorrige = await strapi(session.jwt).graphql({
    query: mediaCorrigeAi
  })

  const redacoes = await strapi(session.jwt).graphql({
    query: redacaoPerUser(session.id)
  })

  return {
    props: {
      session: session,
      temasProps: temas,
      redacoesProps: redacoes,
      mediaCorrigeAi: (mediaCorrige as any)?.aggregate?.avg?.nota_final ?? 0
    }
  }
}


function Aluno({ redacoesProps, temasProps, mediaCorrigeAi } : any) {
  const [session, loading] = useSession()

  // const [tema, setTema] = React.useState<string | null>(null)
  // const [temas, setTemas] = React.useState<{ value: string, label: string }[]>([])
  // const [alunoObs, setAlunoObs ] = React.useState('');

  // const [suggestions, setSuggestions] = React.useState<ITemas[]>([])
  const [timer, setTimer] = React.useState<null | any>(null);

  const [open, setOpen] = React.useState(false);
  const closeModal = () => setOpen(false);

  const user = useMeStore(state => state.user)
  const subscription = useSubscriptionStore(state => state.subscription)
  const setSubscription = useSubscriptionStore(state => state.setSubscription)
  const updateSubscription = useSubscriptionStore(state => state.updateSubscription)

  const createRedacao = useRedacaoStore((state) => state.createRedacao);
  const updateRedacoes = useRedacaoStore((state) => state.updateRedacoes);
  const redacoes = useRedacaoStore(state => state.redacoes);
  const setRedacoes = useRedacaoStore(state => state.setRedacoes);


  const [open2, setOpen2] = React.useState(false);
  useEffect(() => {
    setOpen2(true)
  }, [])

  /// upload
  // const [file, setFile] = React.useState<any | null>(null);
  // const [createObjectURL, setCreateObjectURL] = React.useState<any | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter()

  useEffect(() => {
    if (session?.jwt && !loading) {
      console.log("me => ", session.jwt)
      if (session?.subscription)
        setSubscription(session.subscription as ISubscription, session.jwt)

      setRedacoes(redacoesProps?.length >= 0 ? redacoesProps : []);
    }
  }, [session])

  // useEffect(() => {
  //   console.log(temasProps, "temasProps")
  //   const options: { value: string, label: string }[] = temasProps?.map((item: any) => ({ value: item.id, label: item.titulo }));
  //   setTemas(options);
  // }, [])

  if(loading)
    return <PreLoader />

  if (!session && !loading) {
    router.push('/painel/entrar');
    return <PreLoader />;
  }

  // const uploadFileClient = (e: any) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const i: any = e.target.files[0];
  //     setFile(i);
  //     setCreateObjectURL(URL.createObjectURL(i));
  //   }
  // }

  // const onFileSubmit = async (e: any) => {
  //   setIsLoading(true);
  //   e.preventDefault()

  //   const body = new FormData();
  //   body.append("files.redacao", file);

  //   const data:any = {};
  //   data['user'] = session?.id as string ?? '';
  //   data['tema'] = tema ?? '';
  //   data['msg_aluno'] = alunoObs ?? '';
  //   data['status_correcao'] = subscription?.plano.plano_type === "enem" ? "correcao_um" :  "redacao_simples";
  //   body.append("data", JSON.stringify(data))

  //   if (session) {
  //     const success = await createRedacao(body, subscription!, session!.id as string, session!.jwt);
  //     if (!success.error) {
  //       updateSubscription(subscription?.id ?? '', session.jwt);
  //       toast.success(success.data.message);
  //     } else {
  //       toast.error(success.data.message);
  //     }
  //   } else {
  //     toast.error('Precisa efetuar o login para enviar a redação!');
  //   }

  //   closeModal();
  //   remove();
  //   setIsLoading(false);
  // }

  // const remove = () => {
  //   setFile(null);
  //   setCreateObjectURL(null);
  //   setTema(null);
  // }

  // const onChange = (event: any, { newValue }: any) => {
  //   setTema(newValue);
  // };

  // const inputProps = {
  //   placeholder: 'Escolha o tema',
  //   value: tema,
  //   onChange
  // };

  const CustomSymbol = ({ size, borderColor, datum }: PointSymbolProps) => {

    return (
      <g style={{
        overflowWrap: 'break-word',
        wordWrap: 'break-word',
        width: 120,
      }}>

        <circle
          r={size}
          stroke={borderColor}
          fill={borderColor} />

        <text textAnchor="middle" y="6" style={{
          fontFamily: "Poppins",
          fontSize: "16px",
          fill: "#fff",
          fontWeight: 500,
        }}>

          {datum.y as number}
        </text>
        <switch>
          <foreignObject x="-60" y="36" width="120" height="100">
            <text textAnchor="middle" y={46} style={{
              fontFamily: "Poppins",
              fontSize: "12px",
              fill: "#000",
              fontWeight: 500,
              textAlign: "center",
              display: "inline-block",
            }}>
              {datum.tema.slice(0, 64) + '...'}
            </text>
          </foreignObject>
        </switch>
      </g>
    )
  }


  const ultimaNota = () => {
    if (redacoes?.length > 0) {
      const redacoesLocal = redacoes.filter((item: any) => item.status_correcao === 'finalizada');
      console.log("redacoes", redacoesLocal.length)
      if (redacoesLocal.length <= 0) return '---'
      console.log("===> redação", redacoesLocal[redacoesLocal.length - 1])
      return notaTotalRedacao(redacoesLocal[redacoesLocal.length - 1]) == 0 ? '---' : notaTotalRedacao(redacoesLocal[redacoesLocal.length - 1]) ;
    }

    return "---";
  }

  const dataEnvios = () => {
    console.log("dataEnvios")
    var data: { x: string, y: number, tema: string }[] = [];

    if (redacoes?.length > 0) {
      const redacoesLocal = redacoes.filter((item: any) => item.status_correcao == 'finalizada');

      console.log("redacoesLocal ====> ", redacoesLocal)
      console.log("redacoes", redacoesLocal.length)
      if (redacoesLocal.length <= 0) return [];

      let numeroAExibir;
      if(redacoesLocal.length > 3){
        numeroAExibir = 4
      }else {
        numeroAExibir = redacoesLocal.length
      }
      redacoesLocal.slice((redacoesLocal.length - numeroAExibir), redacoesLocal.length).map((item: any) => {
        data.push({ x: item.createdAt, y: notaTotalRedacao(item), tema: item.tema.titulo ?? '' });
        return item;
      });
    }

    return data
  }

  const closeModal2 = () => setOpen2(false);


  return (
    <MainLayout>
      <Seo title="Painel do Aluno" />

      <Popup open={open2} closeOnDocumentClick onClose={closeModal2}>
        <div className="modal modalPromo">
          <a className="close" onClick={closeModal2}>
            &times;
          </a>
          <a href="https://profhenriquearaujo.com.br/combos-promo/" rel="noreferrer" target="_blank" >
            <img src="https://api.corrigeai.com/uploads/popup_plataforma_e23182db59.png" className="imagePopup" alt=""/>
          </a>
        </div>
      </Popup>
      <div className="grid-painelaluno">
        <div className="content">
          <div className="head-box">
            <div className="box">
              <span className="icon">
                <Image src={IcLike} className="img-responsive" alt="" />
              </span>
              <span className="texto">
                {redacoes?.length > 0 ? `Você já enviou ${redacoes.length} ${redacoes.length == 1 ? 'redação' : 'redações'}.` : 'Você ainda não enviou redações!'}
              </span>
              <span className="hr" style={{ "background": "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(114,176,30,1) 0%, rgba(201,203,200,1) 100%)" }}>&nbsp;</span>
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
              <span className="hr" style={{ "background": "linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(237,28,36,1) 0%, rgba(201,203,200,1) 100%)" }}>&nbsp;</span>
            </div>
          </div>
          <div className="box-content">
            <span className="head-content">
              <span className="icon">
                <Image src={IcUltimosEnvios} className="img-responsive" alt="" />
              </span>
              <span className="title">Seus últimos envios</span>
            </span>
            <div className="graphic">
              {redacoes?.length > 0 && dataEnvios().length ? (
                <div style={{ height: 230, width: '100%' }}>
                  <ResponsiveLine
                    data={[
                      {
                        id: "envios",
                        data: false ?
                          [
                            { x: "2019-05-01", y: 500, tema: `Democratização do acesso ao cinema no Brasil` },
                            { x: "2019-06-01", y: 600, tema: `Democratização do acesso ao cinema no Brasil` },
                          ]
                          :
                          dataEnvios()
                      }
                    ]}
                    margin={{ top: 50, right: 120, bottom: 100, left: 120 }}
                    yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
                    curve="cardinal"
                    pointSymbol={CustomSymbol}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={null}
                    axisLeft={null}
                    enableGridX={false}
                    enableGridY={false}
                    colors={['#72b01d']}
                    lineWidth={4}
                    pointSize={30}
                    pointColor={{ from: 'color', modifiers: [] }}
                    pointBorderColor={{ from: 'color', modifiers: [] }}
                    enablePointLabel={false}
                    pointLabelYOffset={42}
                    isInteractive={false}
                    useMesh
                    legends={[]}
                  />
                </div>
              ) : (
                <div style={{ padding: 50, textAlign: 'center' }}>{redacoes?.length == 0 ? 'Envie a primeira redação para gerar estatísticas!' : 'O gráfico será exibido quando a redação receber uma correção.'}</div>
              )}
            </div>
          </div>
        </div>

        <div className="sidebar-panel">
          <div className="grades">
            <ul>
              <li>Sua última nota: {ultimaNota()}</li>
              <li>Sua média geral: {mediaGeral(redacoes.filter(redacao => redacao.status_correcao === 'finalizada')) == 0 ? '---' : mediaGeral(redacoes.filter(redacao => redacao.status_correcao === 'finalizada'))} </li>
              <li>Média Corrige Aí: { Math.round(mediaCorrigeAi) === 0 ? '---' : Math.round(mediaCorrigeAi)}</li>
              <li className="desempenho">
                <Link href="/painel/aluno/desempenho">VER DESEMPENHO COMPLETO</Link>
              </li>
            </ul>
          </div>


          <div className="submit-essay">
            <span className="name">
              <a style={{ cursor: "pointer" }} onClick={() => (
                subscription != null ?
                  subscription.envios > 0 ?
                    setOpen(true)
                    :
                    toast.error('Você não possui envios disponíveis!')
                  : toast.error('Você não possui envios disponíveis!')
              )}>
                <span className="icon">
                  <Image src={IcRocket} className="img-responsive" alt="" />
                </span>
                Enviar redação</a>
            </span>

            <Popup
              open={open}
              onClose={closeModal}
              modal
              nested
              closeOnDocumentClick={false}
            >
              <EnviarRedacao session={session} temasProps={temasProps} closeModal={closeModal}/>
            </Popup>
          </div>

          <div className="themes">
            <ul>
              <li><Link href="/painel/aluno/temas">Ver todos os temas</Link></li>
              <li><a target="_blank" href="/images/folha_redação_1.pdf">Baixar folha de redação</a></li>
            </ul>
          </div>
        </div>
      </div>
      <style global jsx>{`

          .grid-painelaluno{display: grid; grid-template-columns: 2.5fr 1fr; gap: 2rem}
          .grid-painelaluno .content{display: block; width: 100%;}
          .grid-painelaluno .content .head-box{display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; margin: 0 0 3.5rem}
          .grid-painelaluno .content .head-box .box{display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 12.3125rem; width: 100%; border-radius: 0.75rem; background: var(--gray20); padding: 0.8125rem; position: relative; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
          .grid-painelaluno .content .head-box .box .icon{position: absolute; right: 0.8125rem; top: 0.8125rem}
          .grid-painelaluno .content .head-box .box .texto{display: block; width: 100%; font-family: 'Poppins', sans-serif; font-weight: 500; font-size: 2.0625em; text-align: center; line-height: 2.476875rem; max-width: 265px; margin: 0 0 0.5rem}
          .grid-painelaluno .content .head-box .box:nth-child(2) .texto{max-width: 14.06rem}
          .grid-painelaluno .content .head-box .box .hr{position: absolute; width: 100%;height: 3px;bottom: 1rem;max-width: calc(100% - 2rem);border-radius: 5px;}
          .grid-painelaluno .content .head-box .box .button{display: block; width: 100%; text-align: center;}
          .grid-painelaluno .content .head-box .box .button a{display: flex; margin: 0 auto; box-shadow: 0px 0px 9px 0px #c68989; align-items: center; justify-content: center;background: #c70500; min-height: 2.8rem; font-weight: 500; width: 11.0625rem; border-radius: 5.53125rem; color: var(--white); font-size: 1.0575em}
          .grid-painelaluno .content .head-box .box .button a:hover{transform: scale(0.9);}
          .grid-painelaluno .content .box-content{display: block; width: 100%; border-radius: 0.75rem; background: var(--gray20); padding: 1.875rem 1.5625rem; position: relative; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
          .grid-painelaluno .content .box-content .head-content{display: flex;width: 100%;flex-direction: row;align-items: center;gap: 1rem; padding: 0 1.5625rem}
          .grid-painelaluno .content .box-content .head-content .icon{position: relative; top: 4px}
          .grid-painelaluno .content .box-content .head-content .title{display: block; width: 100%; font-family: 'Poppins', sans-serif; font-weight: 500; font-size: 2.0625em; color: var(--dark);}
          .grid-painelaluno .content .box-content .graphic{display: block; width: 100%;}


          .grid-painelaluno .sidebar-panel{display: block; width: 100%;}
          .grid-painelaluno .sidebar-panel .grades{display: block; width: 100%; margin: 0 0 1rem;}
          .grid-painelaluno .sidebar-panel .grades ul{padding: 0; margin: 0;}
          .grid-painelaluno .sidebar-panel .grades ul li{display: inline-block; width: 100%; margin: 0 0 1rem; text-align: center; color: var(--dark); font-family: 'Poppins', sans-serif; font-weight: 500; border-radius: 0.75rem; font-size: 1.366875em; background: var(--gray20); padding: 0.5125rem; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
          .grid-painelaluno .sidebar-panel .grades ul li.desempenho{margin: 0; transition: all 0.5s ease; display: inline-block; width: 100%; margin: 0 0 1rem; text-align: center; color: var(--gray20); font-family: 'Poppins', sans-serif; font-weight: 500; border-radius: 0.75rem; font-size: 1.2em; background: var(--dark); padding: 0.5125rem; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
          .grid-painelaluno .sidebar-panel .grades ul li.desempenho:hover{transform: scale(0.9);}
          .grid-painelaluno .sidebar-panel .grades ul li.desempenho a{display: block; color: var(--gray20);}
          .grid-painelaluno .sidebar-panel .submit-essay{display: block; width: 100%; margin: 0 0 1.8125rem;}
          .grid-painelaluno .sidebar-panel .submit-essay a{display: flex; flex-direction: row; gap: 0.7rem; margin: 0 auto; box-shadow: 0px 0px 9px 0px #407610; align-items: center; justify-content: center;background: var(--dark); min-height: 4.2rem; font-weight: 500; border-radius: 1.2rem; color: var(--gray20); font-size: 1.275em}
          .grid-painelaluno .sidebar-panel .submit-essay .icon{position: relative; top: 4px}
          .grid-painelaluno .sidebar-panel .submit-essay a:hover{transform: scale(0.9);}

          .grid-painelaluno .sidebar-panel .themes{display: block; width: 100%; background: var(--gray20); border-radius: 0.75rem; padding: 1.5625rem 2.1875rem;box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
          .grid-painelaluno .sidebar-panel .themes ul{padding: 0; margin: 0}
          .grid-painelaluno .sidebar-panel .themes ul li{display: inline-block; width: 100%; margin: 0 0 1rem}
          .grid-painelaluno .sidebar-panel .themes ul li:last-child{margin: 0}
          .grid-painelaluno .sidebar-panel .themes ul li a{display: block; background: var(--gray50); padding: 0.7rem; border-radius: 0.9rem; text-align: center; color: var(--dark); font-size: 1.1em; line-height: 1.1em}


          @media(max-width: 1200px){
            .grid-painelaluno{grid-template-columns: 1fr}
          }

          @media(max-width: 640px){
            .grid-painelaluno .content .head-box{grid-template-columns: 1fr}
          }
          .react-select-container { flex: 1 } 

          .chart {
            height:50vh;
            width:60vw;
            background: white;
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
            transition: 0.3s;
          }

          .chart:hover {
            box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
          }


          .popup-content{ border-radius: 0.5rem !important;}
          .popup-overlay {
              background: rgb(0 0 0 / 60%)!important;
          }

          .react-autosuggest__container {
            width: 100%;
          }

          ul.react-autosuggest__suggestions-list {
            list-style: none;
        }
        
        ul.react-autosuggest__suggestions-list li {
            cursor: pointer;
            background: var(--gray20);
            padding: 0.5rem 1rem;
            margin: 0 0 0.5rem;
            border-radius: 0.5rem;
            transition: all 0.5s ease;
        }
        
        ul.react-autosuggest__suggestions-list li:hover{
          background: var(--dark);
          color: var(--white);
        }
        .uploadRemove{
          border: none;
          background: none;
          border-bottom: 2px solid var(--dark);
          font-size: 1rem;
          font-weight: 400;
          margin: 1rem 0 0;
          font-family: 'Poppins',sans-serif;
        }

        .inputUploadRedacao:disabled ~ label {
            background: #9c9c9c !important;
        }

        .popRedacao textarea{
          width: 100%;
          margin: 1rem 0 0;
          height: 6rem;
          border: 1px solid var(--gray50);
          border-radius: 0.5rem;
        }
        
        .popRedacao img{
          object-fit: cover !important;
        }

        #popup-2{height: 550px; overflow: scroll}
          `
      } </style>
      
    </MainLayout>
  )
}


export default Aluno
