import { getSession, session, useSession } from 'next-auth/client'
import { IcAlert, IcLike, IcGraphic, IcUltimosEnvios, IcRocket } from '../../../components/icons'
import MainLayout from '../../../components/layout/MainLayout'
import Image from 'next/image'
import styles from './Aluno.module.css'
import router, { useRouter } from 'next/dist/client/router'
import React, { useEffect } from 'react'
import LayoutCarregando from '../../../components/layout/LayoutCarregando'
import { withAuthSession } from '../../../utils/helpers'
import { IRedacoes, IUser } from '../../../models/user'
import { API } from '../../../services/api'
import Link from 'next/link'
import Seo from '../../../components/layout/Seo'
import Popup from 'reactjs-popup'
import { useUserStore } from '../../../hooks/userStore'
import { toast, ToastContainer } from 'react-toastify'
import { ITemas } from '../../../models/tema'
import { PointSymbolProps, PointTooltipProps, ResponsiveLine } from "@nivo/line";
import PreLoader from '../../../components/PreLoader'
import Select from 'react-select'
import NoSSRWrapper from '../../../components/layout/NoSSRWrapper'
import { debugPrint } from '../../../utils/debugPrint'

function Aluno() {
  const [loadingProfile, setLoadingProfile] = React.useState(true);
  const user = useUserStore((state) => state.user)
  const [session, loading] = useSession()
  const [tema, setTema] = React.useState<string | null>(null)
  const [temas, setTemas] = React.useState<{ value: string, label: string }[]>([])
  // const [suggestions, setSuggestions] = React.useState<ITemas[]>([])
  const createRedacao = useUserStore((state) => state.createRedacao);
  const me = useUserStore((state) => state.me);
  const [timer, setTimer] = React.useState<null | any>(null);

  const [open, setOpen] = React.useState(false);
  const closeModal = () => setOpen(false);


  /// upload

  const [file, setFile] = React.useState<any | null>(null);
  const [createObjectURL, setCreateObjectURL] = React.useState<any | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter()

  useEffect(() => {
    async function initData() {
      await me();
      setLoadingProfile(false);
    }
    initData();
  }, [me])

  useEffect(() => {
    async function initData() {
      API.post('/painel/tema/getAll').then((response) => {
        if (response.status === 200) {
          if (!response.data.error) {

            const options: { value: string, label: string }[] = response.data.data.map((item: ITemas) => ({ value: item.tema, label: item.tema }));
            setTemas(options);
          }
        }
      })
    }
    initData();
  }, [])

  if (loading || loadingProfile)
    return <LayoutCarregando isDashboard />

  if (!session && !loading && !user) {
    router.push('/painel/entrar');
    return <></>
  }

  const uploadFileClient = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const i: any = e.target.files[0];
      setFile(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  }

  const onFileSubmit = async (e: any) => {
    setIsLoading(true);
    e.preventDefault()


    const body = new FormData();
    body.append("file", file);
    const responseUpload = await API.post("/painel/upload/redacao", body);

    if (responseUpload.status === 200) {
      const success = await createRedacao({ redacao: responseUpload.data.data.fileName, tema_redacao: tema ?? '' } as IRedacoes);
      if (!success.error) {
        toast.success('Redação enviada com sucesso!');
      } else {
        toast.error(success.data.message);
      }
    } else {
      toast.error(responseUpload.data.message);
    }

    closeModal();
    remove();
    setIsLoading(false);
  }

  const remove = () => {
    setFile(null);
    setCreateObjectURL(null);
    setTema(null);
  }

  const onChange = (event: any, { newValue }: any) => {
    setTema(newValue);
  };

  const inputProps = {
    placeholder: 'Escolha o tema',
    value: tema,
    onChange
  };

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
    if (user.redacoes.length > 0) {
      const redacoes = user.redacoes.filter(item => item.nota_final != 0);
      console.log("redacoes", redacoes.length)
      if(redacoes.length <= 0) return '---' 
      return redacoes[redacoes.length - 1].nota_final == 0 ? '---' : redacoes[redacoes.length - 1].nota_final;
    }

    return "---";
  }

  const mediaGeral = () => {
    if (user.redacoes.length > 0) {
        var ultimasNotas:number[] = [];

        user.redacoes.filter(item => item.nota_final != 0).map(item => {
          ultimasNotas.push(item.nota_final);
          return item;
        })

        if(ultimasNotas.length > 0) {
          var mediaGeralCalc = 0;
          ultimasNotas.map(item => {
            mediaGeralCalc = mediaGeralCalc + item
            return item;
          });
          return Math.round(mediaGeralCalc / ultimasNotas.length) == 0 ? '---' : Math.round(mediaGeralCalc / ultimasNotas.length);
        } else {
          return "---";
        }
    }
  }

  const dataEnvios = () => {
    var data:{ x: string, y: number, tema: string }[] = [];

    if (user.redacoes.length > 0) {
      const redacoes = user.redacoes.filter(item => item.nota_final != 0);
      console.log("redacoes", redacoes.length)
      if(redacoes.length <= 0) return [];
      redacoes.slice((redacoes.length - 4), redacoes.length).map(item => {
        data.push({ x: item.createdAt, y: item.nota_final, tema: item.tema_redacao });
        return item;
      });
    }
    
    return data
  }


  return (
    <MainLayout>
      <Seo title="Painel do Aluno" />
      <div className={styles["grid-painelaluno"]}>
        <div className={styles["content"]}>
          <div className={styles["head-box"]}>
            <div className={styles["box"]}>
              <span className={styles["icon"]}>
                <Image src={IcLike} className={styles["img-responsive"]} alt="" />
              </span>
              <span className={styles["texto"]}>
                {user.redacoes.length > 0 ? `Você já enviou ${user.redacoes.length} ${user.redacoes.length == 1 ? 'redação' : 'redações'}.` : 'Você ainda não enviou redações!'}
              </span>
              <span className={styles["hr"]} style={{ "background": "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(114,176,30,1) 0%, rgba(201,203,200,1) 100%)" }}>&nbsp;</span>
            </div>
            <div className={styles["box"]}>
              <span className={styles["icon"]}>
                <Image src={IcAlert} className={styles["img-responsive"]} alt="" />
              </span>
              <span className={styles["texto"]}>
                Você possui {user.subscription.envios} envios.
              </span>
              {user.subscription.envios <= 0 && <span className={styles["button"]}>
                <Link href="/planos">Comprar agora</Link>
              </span>}
              <span className={styles["hr"]} style={{ "background": "linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(237,28,36,1) 0%, rgba(201,203,200,1) 100%)" }}>&nbsp;</span>
            </div>
          </div>
          <div className={styles["box-content"]}>
            <span className={styles["head-content"]}>
              <span className={styles["icon"]}>
                <Image src={IcUltimosEnvios} className={styles["img-responsive"]} alt="" />
              </span>
              <span className={styles["title"]}>Seus últimos envios</span>
            </span>
            <div className={styles["graphic"]}>
              {user.redacoes.length > 0 ? (
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
                <div style={{ padding: 50, textAlign: 'center' }}>Envie a primeira redação para gerar estatísticas!</div>
              )}
            </div>
          </div>
        </div>

        <div className={styles["sidebar-panel"]}>
          <div className={styles["grades"]}>
            <ul>
              <li>Sua última nota: { ultimaNota() }</li>
              <li>Sua média geral: { mediaGeral() } </li>
              <li>Média Corrige Aí: ---</li>
              <li className={styles["desempenho"]}>
                <Link href="/painel/aluno/desempenho">VER DESEMPENHO COMPLETO</Link>
              </li>
            </ul>
          </div>


          <div className={styles["submit-essay"]}>
            <span className={styles["name"]}>
              <a style={{ cursor: "pointer" }} onClick={() => user.subscription.envios > 0 ? setOpen(true) : toast.error('Você não possui envios disponíveis!')}>
                <span className={styles["icon"]}>
                  <Image src={IcRocket} className={styles["img-responsive"]} alt="" />
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
              <div className="popRedacao">
                <h1>ENVIAR REDAÇÃO</h1>

                <form onSubmit={(e) => onFileSubmit(e)} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                  {!isLoading ? (
                    <span className="formulario">
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
                        {createObjectURL != null ?
                          <Image src={createObjectURL} loader={() => createObjectURL} width="320px" height="240px" alt="Icone adicionar" />
                          : (<>
                            <NoSSRWrapper>
                              <Select placeholder="Escolha o tema" onChange={(selecionado) => selecionado ? setTema(selecionado.value) : setTema(null)} noOptionsMessage={() => "Tema não encontrado!"} className='react-select-container' options={temas} isSearchable isClearable />
                            </NoSSRWrapper>
                          </>)
                        }
                      </div>

                      {!createObjectURL && <span className="upload">
                        <input type="file" className="inputUploadRedacao" accept=".jpef, .png, .jpg" onChange={uploadFileClient} disabled={tema == null} />
                        <label className="custom-file-upload">
                          ESCOLHER ARQUIVO
                        </label>
                      </span>}
                      <br />
                      {tema == null && <span>*Selecione primeiro o tema!</span>}
                      {createObjectURL !== null &&
                        <>
                          <button className="uploadRemove" type="button" onClick={remove} >Tentar novamente</button>
                        </>
                      }
                    </span>
                  ) : (
                    <div className="popLoading">
                      <PreLoader />
                    </div>
                  )}

                  {!isLoading && <span className="botoes">
                    <a className="enviar cancelar" style={{ cursor: "pointer" }} onClick={() => { remove(); closeModal(); }}>CANCELAR</a>
                    <button type="submit" className="enviar" disabled={file?.length <= 0 ?? true}>ENVIAR</button>
                  </span>
                  }
                </form>
              </div>
            </Popup>
          </div>

          <div className={styles["themes"]}>
            <ul>
              <li><Link href="/painel/aluno/temas">Ver todos os temas</Link></li>
              <li><Link href="/duvidas">Como enviar a sua redação</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <style global jsx>{`
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
              background: rgb(0 0 0 / 98%)!important;
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
          `
      } </style>
      <style jsx>
        {`
          .popRedacao{display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; padding: 1rem 0;}
          .popRedacao h1{display: block; width: 100%; text-align: center; color: #002400; font-weight: 700; font-size: 1.4rem; font-family: 'Poppins', sans-serif; margin-bottom: 1rem}
          .popRedacao .formulario{display: block;width: 100%;max-width: 480px;margin: 0 auto;padding: 2rem 1rem 1.5rem;border: 2px dashed #cccccc;text-align: center; border-radius: 0.5rem}
          .popRedacao .formulario form{display: block; width: 100%}
          .formulario input[type="text"]{display: block; width: 100%; margin: 0 0 1rem; padding: 0.8rem 0.5rem; border: 1px solid #cccccc; border-radius: 0.5rem; font-family: 'Poppins', sans-serif}
          .upload .custom-file-upload{border-radius: 0.5rem; margin: 0; color: #fff; background: #72b01d; transition: all 0.5s ease; font-family: 'Poppins', sans-serif; border: 1px solid #ccc;display: inline-block;padding: 6px 12px;cursor: pointer;}
          .upload .custom-file-upload:hover{background: #002400; }
          .popRedacao .botoes{display: flex; width: 100%; flex-direction: row; justify-content: center; margin: 2rem 0 0; gap: 1rem}
          
          .enviar {cursor: pointer; border:none; display: block; transition: all 0.5s ease;padding: 0.5rem 1rem; background: #002400; color: #fff; text-decoration: none; border-radius: 0.5rem; font-family: 'Poppins', sans-serif}
          .enviar :hover{background: #72b01d;}

          .popRedacao .botoes a.cancelar{background: transparent; color: #002400}
          .popRedacao .botoes a.cancelar:hover{color: #002400; background: transparent}

          input[type="file"] {
            position: absolute;
            opacity: 0;
            cursor: pointer;
          }
                    `}
      </style>
    </MainLayout>
  )
}

export async function getServerSideProps(ctx: any) {
  const session = await withAuthSession(ctx);
  if ('redirect' in session) {
    return session;
  }

  return { props: { session: session } }
}


export default Aluno
