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
import 'reactjs-popup/dist/index.css';
import { useUserStore } from '../../../data/userStore'
import { toast, ToastContainer } from 'react-toastify'
import { ITemas } from '../../../models/tema'
import Autosuggest from 'react-autosuggest';

function Aluno() {
  const [loadingProfile, setLoadingProfile] = React.useState(true);
  const user = useUserStore((state) => state.user)
  const [session, loading] = useSession()
  const [tema, setTema] = React.useState('')
  const [temas, setTemas] = React.useState<ITemas[]>([])
  const [suggestions, setSuggestions] = React.useState<ITemas[]>([])
  const createRedacao = useUserStore((state) => state.createRedacao);
  const me = useUserStore((state) => state.me);
  const [timer, setTimer] = React.useState<null | any>(null);

  const [open, setOpen] = React.useState(false);
  const closeModal = () => setOpen(false);


  /// upload

  const [file, setFile] = React.useState<string>();
  const [imagePreview, setImagePreview] = React.useState<any>("");
  const [base64, setBase64] = React.useState<string>();
  const [name, setName] = React.useState<string>('');
  const [size, setSize] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const router = useRouter()

  useEffect(() => {
    async function initData() {
      await me();
      setLoadingProfile(false);
    }
    initData();
    console.log('useEffect - index aluno');
  }, [me])

  useEffect(() => {
    async function initData() {
      API.post('/painel/tema/getAll').then((response) => {
        if(response.status === 200){
          if(!response.data.error) setTemas(response.data.data);
          console.log('temas', response.data.data);
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

  const onChangeUpload = (e: any) => {

    if(e.target.files != null){
      console.log("file", e.target.files[0]);

      let file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = _handleReaderLoaded
        reader.readAsBinaryString(file)
      }
    }
  }

  const _handleReaderLoaded = (readerEvt: any) => {
    let binaryString = readerEvt.target.result;
    setBase64(btoa(binaryString))
  }

  const onFileSubmit = async (e: any) => {
    setIsLoading(true);
    e.preventDefault()
    const success = await createRedacao({ redacao: base64, tema_redacao: tema } as IRedacoes);
    if (!success.error) {
      toast.success('Redação enviada com sucesso!');
    } else {
      toast.error(success.data.message);
    }
    closeModal();
    remove();
    setIsLoading(false);
  }

  const photoUpload = (e: any) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];

    if (reader !== undefined && file !== undefined) {
      reader.onloadend = () => {
        setFile(file)
        setSize(file.size);
        setName(file.name)
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file);
    }
  }

  const remove = () => {
    setFile("")
    setImagePreview("")
    setBase64("")
    setName("")
    setSize("")
  }

  const getSuggestions = (value: any)  => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0 ? [] : temas.filter((tema : ITemas) =>{
      return tema.tema.toLowerCase().includes(inputValue);
    });
  };


  const getSuggestionValue = (tema: ITemas) => tema.tema;

  const renderSuggestion = (tema: ITemas) => (
    <div>
      {tema.tema}
    </div>
  );

  const onChange = (event : any, { newValue } : any) => {
    setTema(newValue);
  };

  const inputProps = {
    placeholder: 'Escolha o tema',
    value: tema,
    onChange
  };


  const onSuggestionsFetchRequested = ({ value } : any) => {
    if (timer) {
      clearTimeout(timer!);
      setTimer(null);
    }

    setTimer(() => { 
      setTimeout(() => { 
        var i = 0;
        const firtResults = getSuggestions(value).filter((item: ITemas) => { i++; 
          return i <= 3; 
        })
        if(value.trim().length > 3) setSuggestions(firtResults);
      }, 1000)
    })
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

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
                <Image src={IcGraphic} className={styles["img-responsive"]} alt="" />
              ) : (
                <div style={{ padding: 50, textAlign: 'center' }}>Envie a primeira redação para gerar estátisticas!</div>
              )}
            </div>
          </div>
        </div>

        <div className={styles["sidebar-panel"]}>
          <div className={styles["grades"]}>
            <ul>
              <li>Sua última nota: ---</li>
              <li>Sua média geral: ---</li>
              <li>Média Corrige Aí: ---</li>
              <li className={styles["desempenho"]}>
                <Link href="/painel/aluno/desempenho">VER DESEMPENHO COMPLETO</Link>
              </li>
            </ul>
          </div>


          <div className={styles["submit-essay"]}>
            <span className={styles["icon"]}>
              <Image src={IcRocket} className={styles["img-responsive"]} alt="" />
            </span>

            <span className={styles["name"]}>
              <a style={{ cursor: "pointer" }} onClick={() => user.subscription.envios > 0 ? setOpen(true) : toast.error('Você não possui envios disponíveis!')}>Enviar redação</a>
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

                <form onSubmit={(e) => onFileSubmit(e)} onChange={(e) => onChangeUpload(e)}>


                  {!isLoading ? (
                    <span className="formulario">
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
                        {imagePreview != '' ?
                          <Image src={imagePreview} width="80px" height="80px" alt="Icone adicionar" />
                          :(<>
                              <Autosuggest
                                  suggestions={suggestions}
                                  onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                                  onSuggestionsClearRequested={onSuggestionsClearRequested}
                                  getSuggestionValue={getSuggestionValue}
                                  renderSuggestion={renderSuggestion}
                                  inputProps={inputProps}
                              />
                          </>)
                        }
                      </div>

                      <span className="upload">
                        <label className="custom-file-upload">
                          <input type="file"className="inputUploadRedacao" accept=".jpef, .png, .jpg" onChange={photoUpload} disabled={!(tema.length > 3)}/>
                          ESCOLHER ARQUIVO
                        </label>
                      </span>
                      <br />
                      {imagePreview !== "" &&
                        <>
                          <button className="uploadRemove" type="button" onClick={remove} >Tentar novamente</button>
                        </>
                      }
                    </span>
                  ) : (
                    <div className="popLoading">
                      <span>Carregando</span>
                    </div>
                  )}

                  {!isLoading && <span className="botoes">
                    <a className="enviar cancelar" style={{ cursor: "pointer" }} onClick={() => { remove(); closeModal(); }}>CANCELAR</a>
                    <button type="submit" className="enviar" disabled={size!.length <= 0 ?? true}>ENVIAR</button>
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
          .popup-content{ border-radius: 0.5rem !important;}
          .popup-overlay {
              background: rgb(0 0 0 / 98%)!important;
          }

          form input[type="text"] {
            display: block;
            width: 100%;
            margin: 0 0 1rem;
            padding: 0.8rem 0.5rem;
            border: 1px solid #cccccc;
            border-radius: 0.5rem;
            font-family: 'Poppins', sans-serif;
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

        .upload input[type="file"]:disabled+label {
          background: #ccc !important;
        }
          `
      } </style>
      <style jsx>
        {`
          .popRedacao{display: block; width: 100%; padding: 1rem 0;}
          .popRedacao h1{display: block; width: 100%; text-align: center; color: #002400; font-weight: 700; font-size: 1.4rem; font-family: 'Poppins', sans-serif; margin-bottom: 1rem}
          .popRedacao .formulario{display: block;width: 100%;max-width: 480px;margin: 0 auto;padding: 2rem 1rem 1.5rem;border: 2px dashed #cccccc;text-align: center; border-radius: 0.5rem}
          .popRedacao .formulario form{display: block; width: 100%}
          .formulario input[type="text"]{display: block; width: 100%; margin: 0 0 1rem; padding: 0.8rem 0.5rem; border: 1px solid #cccccc; border-radius: 0.5rem; font-family: 'Poppins', sans-serif}
          .upload .custom-file-upload{border-radius: 0.5rem; margin: 0; color: #fff; background: #72b01d; transition: all 0.5s ease; font-family: 'Poppins', sans-serif; border: 1px solid #ccc;display: inline-block;padding: 6px 12px;cursor: pointer;}
          .upload .custom-file-upload:hover{background: #002400; }
          .popRedacao .botoes{display: flex; width: 100%; flex-direction: row; justify-content: center; margin: 2rem 0 0; gap: 1rem}
          
          .enviar {cursor: pointer; display: block; transition: all 0.5s ease;padding: 0.5rem 1rem; background: #002400; color: #fff; text-decoration: none; border-radius: 0.5rem; font-family: 'Poppins', sans-serif}
          .enviar :hover{background: #72b01d;}

          .popRedacao .botoes a.cancelar{background: transparent; color: #002400}
          .popRedacao .botoes a.cancelar:hover{color: #002400; background: transparent}

          input[type="file"] {
              display: none;
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
