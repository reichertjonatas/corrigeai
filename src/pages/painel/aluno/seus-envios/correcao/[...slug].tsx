import { useRouter } from 'next/router';
import React from 'react'
import Seo from '../../../../../components/layout/Seo'
import { useCorretorStore } from '../../../../../hooks/corretorStore';
import shallow from 'zustand/shallow'
import Image from 'next/image'
import MainLayout from '../../../../../components/layout/MainLayout';
// @ts-ignore
import { PointSelector, RectangleSelector } from 'react-image-annotation/lib/selectors'

// @ts-ignore
import Annotation from 'react-image-annotation'
import { RenderEditor } from '../../../../../components/editor/RenderEditor';
import { RenderHighlight } from '../../../../../components/editor/RenderHighlight';
import { RenderOverlay } from '../../../../../components/editor/RenderOverley';
import { RenderSelector } from '../../../../../components/editor/RenderSelector';
import { debugPrint } from '../../../../../utils/debugPrint';
import { strapi } from '../../../../../services/strapi';
import { correcaoById, redacaoById } from '../../../../../graphql/query';
import { getSession } from 'next-auth/client';
import RowObsEnem from '../../../../../components/editor/RowObsEnem';
import { numeroRomano } from '../../../../../utils/helpers';

export async function getServerSideProps(ctx: any) {
    const session = await getSession(ctx);
    const { slug } = await ctx.query;

    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: '/painel/entrar',
            }
        }
    }

    console.log(" slug ", slug)

    if (!slug[0] || !slug[1]) {
        return {
            redirect: {
                permanent: false,
                destination: '/painel/aluno/seus-envios',
            }
        }
    }


    const redacaoProps: any = await strapi(session.jwt).graphql({
        query: correcaoById(slug[0], slug[1])
    })

    if (redacaoProps == null || redacaoProps.correcaos.length == 0) {
        return {
            redirect: {
                permanent: false,
                destination: '/painel/aluno/seus-envios',
            }
        }
    }

    if (redacaoProps?.status_correcao != 'finalizada' || redacaoProps == null) {
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
            redacaoProps,
        }
    }
}

function Correcao({ session, redacaoProps }: any) {
    const [
        setRedacao,
        setCorrecao,
        redacao,
        correcao,
        annotations, setAnnotations,
        annotation, setAnnotation,
        type, setType,
        editorType, setEditorType,
        competencia, setCompetencia,
        competenciasOffline,
        setNota,
        setObs,
        salvarCorrecao,
        setCorrecaoNull
    ] = useCorretorStore(state => ([
        state.setRedacao,
        state.setCorrecao,
        state.redacao,
        state.correcao,
        state.annotations, state.setAnnotations,
        state.annotation, state.setAnnotation,
        state.type, state.setType,
        state.editorType, state.setEditorType,
        state.competencia, state.setCompetencia,
        state.competenciasOffline,
        state.setNota,
        state.setObs,
        state.salvarCorrecao,
        state.setCorrecaoNull
    ]), shallow);


    React.useEffect(() => {
        console.log(" ==> ")
        setRedacao(redacaoProps)
        setCorrecao(redacaoProps.correcaos[0])

        setAnnotations(redacaoProps.correcaos[0]['marcacoes'] ?? [])
        return () => setCorrecaoNull()
        // eslint-disable-next-line
    }, [])

    // if (!(annotations.length > 0)) return (<h1></h1>);

    function renderPopUp({ annotation }: any) {

        const { geometry } = annotation

        var cor = 'black';
        var nomeCompetencia = '';

        switch (annotation.data.competencia) {
            case 2:
                cor = '#fb5400';
                break;
            case 3:
                cor = '#b5179e';
                break;
            case 4:
                cor = '#fcbe21';
                break;
            case 5:
                cor = '#8ac925';
                break;
            default:
                cor = '#3f37c9';
                break;
        }

        switch (annotation.data.competencia) {
            case 2:
                nomeCompetencia = 'Competência II';
                break;
            case 3:
                nomeCompetencia = 'Competência III';
                break;
            case 4:
                nomeCompetencia = 'Competência IV';
                break;
            case 5:
                nomeCompetencia = 'Competência V';
                break;
            default:
                nomeCompetencia = 'Competência I';
                break;
        }

        return (
            <div
                key={annotation.data.id}
                style={{
                    marginTop: '0.1rem',
                    borderRadius: '0.5rem',
                    background: cor,
                    color: 'white',
                    padding: 10,
                    position: 'absolute',
                    fontSize: 12,
                    left: `${geometry.x}%`,
                    top: `${geometry.y + geometry.height}%`
                }}
            >
                <div style={{ marginBottom: '0.25rem', fontSize: '0.8rem', fontWeight: 'bold' }}>{nomeCompetencia}</div>
                {annotation.data && annotation.data.text}
                <div style={{ textAlign: 'center', marginTop: '0.4rem' }}>

                </div>
            </div>
        )
    }

    debugPrint(correcao)

    return (
        <MainLayout>
            <Seo title="Redacao" />

            <div className="gridTemas">
                <div className="content">

                    <div className="boxTema">
                        <div className="competencia">
                            <h1>Correção completa</h1>
                        </div>

                        <div className="redacao">
                            <Annotation
                                src={`${process.env.NEXT_PUBLIC_URL_API}${redacao?.redacao.url}`}
                                alt=''
                                annotations={annotations}
                                renderOverlay={RenderOverlay}
                                renderContent={renderPopUp}
                                renderHighlight={RenderHighlight}
                                renderSelector={RenderSelector}
                                renderEditor={RenderEditor}

                                type={type}
                                value={annotation}
                                onChange={() => { }}
                                onSubmit={() => { }}
                                className="img-responsive"
                            />
                        </div>
                    </div>
                </div>


                <div className="notas">
                    <h1>Notas das competências</h1>
                    <span className="criterios">
                        {correcao != null && correcao.competencias?.length > 0 && correcao.competencias.map((competencia: any, index: number) => {
                            console.log(" ===> competencia obs eneme ", competencia.obs_enem)
                            return (
                                <div key={index}>
                                    <span className="titulo">Competência {numeroRomano(index + 1)}</span>
                                    {competencia.obs.length > 0 && <span className="criterio" >
                                        <span className="title">Observação do corretor:</span>
                                        <span className="nota">{competencia.obs.length > 0 && `${competencia.obs}`}</span>
                                    </span>}
                                    {competencia.obs_enem != null && <div className={`popCompetencia ${competencia.obs_enem!.color}`} style={{ marginTop: '12px' }}>
                                        {competencia.obs_enem != null && competencia.obs_enem.items.map((item: any, index: number) => <RowObsEnem key={index} item={item} />
                                        )}
                                    </div>}
                                </div>
                            )
                        })}
                    </span>
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
                      .gridTemas .notas .criterios .criterio{display: flex; flex-direction: column; gap: 1rem; margin: 0 0 1rem; background: var(--gray30); align-items: center; justify-content: center; padding: 0.5rem 1rem; border-radius: 0.5rem}
                      .gridTemas .notas .criterios .criterio .title{font-size: 1.1rem; flex: 1; font-weight: 500; color: var(--dark); border-right: 1px solid var(--dark)}
                      .gridTemas .notas .criterios .criterio .nota{font-size:1rem; flex: 3; font-weight: 500; color: var(--dark)}
                      
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

export default Correcao
