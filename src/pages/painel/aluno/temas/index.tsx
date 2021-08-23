import React, { useEffect } from 'react'
import { TemaCorrigeAi, TemaEnem } from '../../../../components/icons'
import MainLayout from '../../../../components/layout/MainLayout'
import Image from 'next/image'
import Link from 'next/link'
import Seo from '../../../../components/layout/Seo'
import { useTemaStore } from '../../../../hooks/temaStore'
import Viewer, { Worker } from '@phuocng/react-pdf-viewer'
import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css'
import shallow from 'zustand/shallow'
import { getSession } from 'next-auth/client'
import PreLoader from '../../../../components/PreLoader'
import Markdown, { compiler } from 'markdown-to-jsx';

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
  
    return {
        props: {
          session: session,
        }
    }
  }

function Temas({ session } : any ) {
    const [
        temas, currentTema, categoria, isLoading, getAllTemas, setCurrentTema, setCategoria
    ] = useTemaStore( state => [
        state.temas, state.currentTema, state.categoria, state.isLoading, state.getAllTemas, state.setCurrentTema,
        state.setCategoria
    ], shallow)

    useEffect(() => {
        getAllTemas(session.jwt)
    }, [getAllTemas])


    return (
        <MainLayout>
            <Seo title="Temas" />
            <div className={"grid-temas"}>
                <div className="content">
                    <div className="head-box">

                        <a className="box" onClick={ () => setCategoria("enem", session.jwt)}>
                            <span className="icon">
                            <Image src={TemaEnem} className="img-responsive" alt="" />
                            </span>
                            <span className="texto">
                                Temas ENEM
                            </span>
                        </a>

                        <a className="box" onClick={ () => setCategoria("corrigeai", session.jwt)}>
                            <span className="icon">
                                <Image src={TemaCorrigeAi} className="img-responsive" alt="" />
                            </span>
                            <span className="texto">
                                Temas Corrige Aí
                            </span>
                        </a>
                    </div>

                    <div className="box-tema">
                        {currentTema != null && <h1>{currentTema.titulo}</h1>}
                        {currentTema != null && <div className="conteudo" dangerouslySetInnerHTML={{ __html: currentTema.content }}></div>}
                    </div>

                    <span className="botao">
                        <Link href="/painel/aluno" passHref>
                            <a> Escolher esse tema</a>
                        </Link>
                    </span> 
                </div>


                <div className="lista-temas">
                    {isLoading ? 
                        <PreLoader />
                    : <ul>
                        {temas != null && temas.length > 0 && temas.map((temaRow:any, index:number) => {
                            return (
                                <li key={index}>
                                    <a className={currentTema != null ? temaRow.id == currentTema.id ? "activeTema" : "" : ""} onClick={() => setCurrentTema(temaRow) }>
                                       {temaRow.titulo}
                                    </a>
                                </li>
                            )
                        })}
                    </ul>}
                </div>

            </div>
            
            <style jsx>
                {`
                    .navegacao {
                        display: flex;
                        justify-content: space-between;
                        margin-top: 12px;
                    }
                    .btnNavegacao {
                        background: var(--dark);
                        color: white;
                        padding: 12px;
                        border-radius: 12px;
                        cursor: pointer;
                    }
                    .btnNavegacao:hover { background: var(--green)}


                    .paginas {
                        background: white;
                        padding: 12px;
                        border-radius: 12px;
                    }

                    .react-pdf__Page__canvas { width: 100% }
                    .grid-temas{display: grid; grid-template-columns: 2.5fr 1fr; gap: 2rem}
                    .grid-temas .content{display: block; width: 100%;}
                    .grid-temas .content .head-box{display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; margin: 0 0 3.5rem}
                    .grid-temas .content .head-box .box{color: var(--dark); display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 7.5rem; width: 100%; border-radius: 0.75rem; background: var(--gray20); padding: 0.5125rem; position: relative; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
                    .grid-temas .content .head-box .box .icon{position: absolute; right: 0.8125rem; top: 0.8125rem}
                    .grid-temas .content .head-box .box .texto{display: block; width: 100%; font-family: 'Poppins', sans-serif; font-weight: 500; font-size: 2.0625em; text-align: center; line-height: 2.476875rem; max-width: 18.75rem;}
                    .grid-temas .content .head-box .box .hr{position: absolute; width: 100%;height: 3px;bottom: 1rem;max-width: calc(100% - 2rem);border-radius: 5px;}
                    .grid-temas .content .head-box .box .button{display: block; width: 100%; text-align: center;}
                    .grid-temas .content .head-box .box .button a{display: flex; margin: 0 auto; box-shadow: 0px 0px 9px 0px #c68989; align-items: center; justify-content: center;background: #c70500; min-height: 2.8rem; font-weight: 500; width: 11.0625rem; border-radius: 5.53125rem; color: var(--white); font-size: 1.0575em}
                    .grid-temas .content .head-box .box .button a:hover{transform: scale(0.9);}
                    .grid-temas .content .box-tema{display: block; width: 100%; border-radius: 0.75rem; background: var(--gray20); padding: 1.875rem 1.5625rem; position: relative; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
                    .grid-temas .content .box-tema h1{display: block; width: 100%; max-width: 70%; margin: 0 auto; font-size: 1.2rem; font-weight: 500; color: var(--dark); padding: 0.4rem 0; text-align: center; background: var(--gray30); border-radius: 1rem}
                    .grid-temas .content .box-tema .conteudo{display: block;width: 100%;margin: 2rem 0 0;background: var(--gray30);padding: 1rem;border-radius: 1rem;}
                    .grid-temas .content .botao{display: block; width: 100%; margin: 2rem 0 0; text-align: center;}
                    .grid-temas .content .botao a{display: flex; margin: 0 auto; box-shadow: 0px 0px 9px 0px #407610; align-items: center; justify-content: center;background: var(--dark); min-height: 3.5rem; font-weight: 500; width: 26rem; border-radius: 5.53125rem; color: var(--gray20); font-size: 1.5375em}
                    .grid-temas .content .botao a:hover{transform: scale(0.9);}
                    .grid-temas .lista-temas{color: var(--dark); display: block; width: 100%; border-radius: 0.75rem; background: var(--gray20); padding: 0.9125rem; position: relative; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
                    .grid-temas .lista-temas ul{padding: 0; margin: 0;}
                    .grid-temas .lista-temas ul li{display: inline-block; width: 100%;}
                    .grid-temas .lista-temas ul li a{display: block; width: 100%; border-radius: 1rem; font-weight: 500; padding: 0.5rem 2rem; font-size: 0.9331rem; text-align: center; color: var(--dark); background: #cbcccc; margin: 0 0 1rem}
                    .grid-temas .lista-temas ul li a:hover{background: var(--dark); color: var(--gray20)}
                    .grid-temas .lista-temas ul li .activeTema {background: var(--dark); color: var(--gray20)}
                    
                    @media(max-width: 1200px){
                      .grid-temas{grid-template-columns: 1fr}
                    }
                    
                    @media(max-width: 640px){
                      .grid-temas .content .head-box{grid-template-columns: 1fr}
                    }                    
                    
                `}
            </style>
        </MainLayout>
    )
}

export default Temas
