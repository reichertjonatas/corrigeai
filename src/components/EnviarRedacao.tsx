import { getSession } from 'next-auth/client';
import React, { useEffect } from 'react'
import { toast } from 'react-toastify';
import { useRedacaoStore } from '../hooks/redacaoStore';
import { useSubscriptionStore } from '../hooks/subscriptionStore';
import NoSSRWrapper from './layout/NoSSRWrapper';
import PreLoader from './PreLoader';
import Image from 'next/image'
import Select from 'react-select'


function EnviarRedacao({session, selected, temasProps, closeModal } : any) {

    const [tema, setTema] = React.useState<string | null>(null)
    const [temas, setTemas] = React.useState<{ value: string, label: string }[]>([])
    const [alunoObs, setAlunoObs ] = React.useState('');
    
    const subscription = useSubscriptionStore(state => state.subscription)
    const setSubscription = useSubscriptionStore(state => state.setSubscription)
    const updateSubscription = useSubscriptionStore(state => state.updateSubscription)

    const createRedacao = useRedacaoStore((state) => state.createRedacao);
    const updateRedacoes = useRedacaoStore((state) => state.updateRedacoes);


    /// upload
    const [file, setFile] = React.useState<any | null>(null);
    const [createObjectURL, setCreateObjectURL] = React.useState<any | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);


    useEffect(() => {
        const options: { value: string, label: string }[] = temasProps?.map((item: any) => ({ value: item.id, label: item.titulo }));
        setTemas(options);
    }, [])

    useEffect(() => {
        //console.log("tema ====>", tema , ' === > ', selected)
        if(selected){
            setTema(selected.value)
            //console.log("tema after ====>", tema)
        }
    }, [selected])

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
        body.append("files.redacao", file);
    
        const data:any = {};
        data['user'] = session?.id as string ?? '';
        data['tema'] = tema ?? '';
        data['msg_aluno'] = alunoObs ?? '';
        data['status_correcao'] = subscription?.plano.plano_type === "enem" ? "correcao_um" :  "redacao_simples";
        body.append("data", JSON.stringify(data))
    
        if (session) {
          const success = await createRedacao(body, subscription!, session!.id as string, session!.jwt);
          if (!success.error) {
            updateSubscription(subscription?.id ?? '', session.jwt);
            toast.success(success.data.message);
          } else {
            toast.error(success.data.message);
          }
        } else {
          toast.error('Precisa efetuar o login para enviar a redação!');
        }
        
        // modal
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

    return (
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
                              <Select value={selected} placeholder="Escolha o tema" onChange={(selecionado : any) => selecionado ? setTema(selecionado.value) : setTema(null)} noOptionsMessage={() => "Tema não encontrado!"} className='react-select-container' options={temas} isSearchable isClearable />
                            </NoSSRWrapper>
                          </>)
                        }
                      </div>

                      {!createObjectURL && <span className="upload">
                      <span>* Tipos de arquivos aceitos: <strong>.jpeg, .png, .jpg</strong><br/> </span>
                        <input type="file" className="inputUploadRedacao" accept=".jpeg, .png, .jpg" onChange={uploadFileClient} disabled={tema == null} />
                        <label className="custom-file-upload">
                          ESCOLHER ARQUIVO
                        </label>
                      </span>}
                      <br />
                      {tema == null && <span>*Selecione primeiro o tema!</span>}
                      {createObjectURL !== null &&
                        <>
                        <span>
                          * ATENÇÃO, CARA PÁLIDA: SE VOCÊ ESTÁ VISUALIZANDO UMA MINIATURA DA SUA REDAÇÃO, É SINAL DE QUE ESTÁ TUDO CERTO. NÃO SE PREOCUPE CASO A IMAGEM ESTEJA UM POUCO DISTORCIDA, É NORMAL! PARA O CORRETOR, ELA APARECERÁ PERFEITAMENTE. <br />
                         </span>
                         <br />
                         <span>
                           <h3> A Corrige Aí te escuta, deixe uma mensagem para o corretor: </h3>
                           <textarea onChange={(e) => setAlunoObs(e.target.value)} placeholder="" />
                         </span>
                        <br />
                          <button className="uploadRemove" type="button" onClick={remove} >Trocar redação</button>
                        </>
                      }
                    </span>
                  ) : (
                    <div className="popLoading">
                      <PreLoader />
                    </div>
                  )}

                  {!isLoading && <span className="botoes">
                    <a className="enviar cancelar" style={{ cursor: "pointer" }} onClick={() => { remove(); closeModal();}}>CANCELAR</a>
                    <button type="submit" className="enviar" disabled={file?.size > 0 ? false : true }> ENVIAR</button>
                  </span>
                  }
                </form>
                <style jsx>{
                    `.popup-content{ border-radius: 0.5rem !important;}
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
          
                  #popup-2{height: 550px; overflow: scroll}`
                }</style>
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
              </div>
    )
}


// EnviarRedacao.getInitialProps = async (ctx: any) => {
//     const session = await getSession(ctx);
  
//     if (!session)
//       return {
//         redirect: {
//           permanent: false,
//           destination: '/painel/entrar'
//         }
//       }
  
//     const temas = await strapi(session.jwt).graphql({
//       query: `query{
//         temas {
//           id
//           titulo
//         }
//       }`
//     })

//     //console.log("getInitialProps ==> ")
  
//     return {
//         session: session,
//         temasProps: temas
//     }
//   }

export default EnviarRedacao
