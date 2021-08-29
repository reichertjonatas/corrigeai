/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router';
import React from 'react'
import Seo from '../../../../../components/layout/Seo'
import { useCorretorStore } from '../../../../../hooks/corretorStore';
import shallow from 'zustand/shallow'
import Image from 'next/image'
import MainLayout from '../../../../../components/layout/MainLayout';
import { mediaRedacaoPorCompetencia, notaTotalRedacao } from '../../../../../utils/helpers';
import { getSession } from 'next-auth/client';
import { strapi } from '../../../../../services/strapi';
import { redacaoById } from '../../../../../graphql/query';
import Link from 'next/link';


export async function getServerSideProps(ctx : any) {
    const session = await getSession(ctx);
    const { id }  = await ctx.query;

    if(!session) {
        return {
            redirect: {
                permanent: false,
                destination: '/painel/entrar',
            }
        }
    }

    if(!id){
        return {
            redirect: {
                permanent: false,
                destination: '/painel/aluno/seus-envios',
            }
        }
    }

    const redacaoProps:any = await strapi(session.jwt).graphql({
        query: redacaoById(id)
    })

    if(redacaoProps?.status_correcao != 'finalizada' || redacaoProps == null ){
        return {
            redirect: {
                permanent: false,
                destination: '/painel/aluno/seus-envios',
            }
        }
    }

    return {
        props: {
          session: session,
          redacaoProps
        }
    }
}


function Redacao({ redacaoProps, session } : any) {

    const router = useRouter()

    const [
        redacao,
        annotations, setAnnotations,
        setRedacao,
        // annotation, setAnnotation,
        // type, setType,
        // editorType, setEditorType,
        // competencia, setCompetencia,
        competenciasOffline,
        setCompetenciaOffline,
        setNota,
        setObs,
        salvarCorrecao,
        setCorrecaoNull,
        setCorrecaoFrontEnd, 
        setNullCorrecoes
    ] = useCorretorStore(state => ([
        state.redacao,
        state.annotations, state.setAnnotations,
        state.setRedacao,
        // state.annotation, state.setAnnotation,
        // state.type, state.setType,
        // state.editorType, state.setEditorType,
        // state.competencia, state.setCompetencia,
        state.competenciasOffline,
        state.setCompetenciaOffline,
        state.setNota,
        state.setObs,
        state.salvarCorrecao,
        state.setCorrecaoNull, state.setCorrecaoFrontEnd, state.setNullCorrecoes
    ]), shallow);


    React.useEffect(() => {
        setRedacao(redacaoProps)

        return () => {
            setCorrecaoNull()
            setNullCorrecoes()
        }
    }, [])


    if (!redacao) return (<h1></h1>);

    const urlRedacao = ({ src, width, quality }: any) => {
        return `${process.env.NEXT_PUBLIC_URL_API}${redacao?.redacao.url}?w=${width}&q=${quality || 75}`
    }

    return (
        <MainLayout>
            <Seo title="Visualizando redação" />

            <div className="gridTemas">
                <div className="content">

                    <div className="boxTema">

                        <div className="competencia">
                            <h1>Correção 1</h1>
                        </div>

                        <div className="redacao">
                            <img src={`${process.env.NEXT_PUBLIC_URL_API}${redacao?.redacao.url}`} className="img-responsive" alt="" />
                        </div>

                    </div>
                </div>


                <div className="notas">
                    <h1>Notas das Competências</h1>
                    <span className="criterios">
                        <span className="criterio">
                            <span className="title">Critério I:</span>
                            <span className="nota"> { mediaRedacaoPorCompetencia(redacao, 0) } </span>
                        </span>
                        <span className="criterio">
                            <span className="title">Critério II:</span>
                            <span className="nota"> { mediaRedacaoPorCompetencia(redacao, 1) } </span>
                        </span>
                        <span className="criterio">
                            <span className="title">Critério II:</span>
                            <span className="nota"> { mediaRedacaoPorCompetencia(redacao, 2) } </span>
                        </span>
                        <span className="criterio">
                            <span className="title">Critério IV:</span>
                            <span className="nota"> { mediaRedacaoPorCompetencia(redacao, 3) } </span>
                        </span>
                        <span className="criterio">
                            <span className="title">Critério V:</span>
                            <span className="nota">{ mediaRedacaoPorCompetencia(redacao, 4) }</span>
                        </span>

                        <span className="criterio notaFinal">
                            <span className="title">Nota Final:</span>
                            <span className="nota">{ notaTotalRedacao(redacao) }</span>
                        </span>
                    </span>


                    <h1>Correções completas</h1>

                    <div className="novasCorrecoes">
                        { redacao.correcaos.length > 0 && redacao.correcaos.map( (correcao:any, index:number) => {
                            return (<Link key={ index } href={`/painel/aluno/seus-envios/correcao/${redacao.id}/${correcao.id}`} passHref><a>Ver correção {index+1} completa </a></Link>);
                        })}
                    </div>
                </div>
            </div>
            <style jsx>
                {
                    `
                    .content-global{
                        max-width: 95%;
                        margin: 0 auto;
                      }
                      
                      .sidebar{
                        display: none;
                      }
                      
                      .gridTemas{display: grid; grid-template-columns: 2fr 1fr; gap: 2rem}
                      .gridTemas .content{display: block; width: 100%;}
                      .gridTemas .content .boxTema{display: block; width: 100%; border-radius: 0.75rem; background: var(--gray20); padding: 1.875rem 1.5625rem; position: relative; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
                      .gridTemas .content .boxTema .competencia{display: block;width: 100%;margin: 0 0 1.5rem}
                      .gridTemas .content .boxTema .competencia h1{display: block;width: 100%; font-size: 2rem; text-align: center;}
                      .gridTemas .content .boxTema .redacao{display: block;width: 100%;height: 60rem;overflow: scroll;}
                      .gridTemas .content .boxTema .redacao img{width: 100%;}
                      
                      .gridTemas .notas{display: block; width: 100%; height: max-content; border-radius: 0.75rem; background: var(--gray20); padding: 1.875rem 1.5625rem; position: relative; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
                      .gridTemas .notas h1{display: block; width: 100%; text-align: center; font-size: 1.5625rem; margin: 0 0 2rem}
                      .gridTemas .notas .criterios{display: block; width: 100%; margin: 0 0 2rem}
                      .gridTemas .notas .criterios .criterio{display: flex; flex-direction: row; gap: 2rem; margin: 0 0 1rem; background: var(--gray30); align-items: center; justify-content: center; padding: 0.5rem 0; border-radius: 0.5rem}
                      .gridTemas .notas .criterios .notaFinal{display: flex; flex-direction: column; gap: 1rem; margin: 0 0 1rem; background: var(--dark); align-items: center; justify-content: center; padding: 0.5rem 0; border-radius: 0.5rem}
                      .gridTemas .notas .criterios .criterio .title{font-size: 1.2rem; font-weight: 500; color: var(--dark)}
                      .gridTemas .notas .criterios .notaFinal .title{font-size: 1.2rem; font-weight: 500; color: var(--white)}
                      .gridTemas .notas .criterios .criterio .nota{font-size:1.4rem; font-weight: 500; color: var(--dark)}
                      .gridTemas .notas .criterios .notaFinal .nota{font-size:2.5rem; font-weight: 500; color: var(--white)}
                      
                      .novasCorrecoes{display: flex; flex-direction: row; gap: 1rem; width: 100%; }
                      .novasCorrecoes a{display: block; width: 100%; border-radius: 0.5rem; background: var(--green); color: var(--white); font-size: 1.4rem; margin: 0 0 1rem; padding: 1rem 0; text-align: center;}
                      .novasCorrecoes a:hover{background: var(--dark); color: var(--white);}
                      
                      
                      @media(max-width: 1700px){
                        .content-global{max-width: 90%; margin: 0 auto;}
                      }
                      
                      @media(max-width: 1630px){
                        html{font-size: 14px}
                      }
                      
                      @media(max-width: 1440px){
                        .content-global{max-width: 70%}
                        .gridTemas .content .boxTema .competencia{grid-template-columns: repeat(3, 1fr)}
                        .gridTemas .content .boxTema .tasks{grid-template-columns: repeat(3, 1fr)}
                      }
                      
                      
                      @media(max-width: 1240px){
                        .content-global{max-width: 70%; margin: 0 0 0 25rem}
                      }
                      
                      @media(max-width: 1100px){
                        .sidebar{display: none}
                        .content-global{max-width: 90%; margin: 0 auto}
                      }
                      
                      @media(max-width: 640px){
                        .gridTemas .content .boxTema .competencia{grid-template-columns: repeat(3, 1fr)}
                        .gridTemas .content .boxTema .tasks{grid-template-columns: repeat(3, 1fr)}
                        .gridTemas{grid-template-columns: 1fr}
                      }
                      
                      @media(max-width: 480px){
                        .gridTemas .content .boxTema .competencia{grid-template-columns: repeat(2, 1fr)}
                        .gridTemas .content .boxTema .tasks{grid-template-columns: repeat(2, 1fr)}
                        .gridTemas .notas .criterios .criterio .notasCriterios{grid-template-columns: repeat(3, 1fr)}
                      }
                      
                      
                    `
                }
            </style>
        </MainLayout>
    )
}

export default Redacao
