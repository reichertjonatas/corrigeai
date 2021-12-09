import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { CloseIcon, PencilIcon, RedacaoPreview } from '../../../../components/icons';
import MainLayout from '../../../../components/layout/MainLayout'
import { checkDiscrepancia, numeroRomano, withAuthSession } from '../../../../utils/helpers';
import shallow from 'zustand/shallow'

// @ts-ignore
import { PointSelector, RectangleSelector } from 'react-image-annotation/lib/selectors'

// @ts-ignore
import Annotation from 'react-image-annotation'
import { useCorretorStore } from '../../../../hooks/corretorStore';
import { useRouter } from 'next/router';
import { debugPrint } from '../../../../utils/debugPrint';
import { toast } from 'react-toastify';
import { RenderOverlay } from '../../../../components/editor/RenderOverley';
import { getColorActivite } from '../../../../components/editor/helpers';
import { RenderHighlight } from '../../../../components/editor/RenderHighlight';
import { RenderSelector } from '../../../../components/editor/RenderSelector';
import { RenderEditor } from '../../../../components/editor/RenderEditor';
import { getSession } from 'next-auth/client';
import { strapi } from '../../../../services/strapi';
import { redacaoById } from '../../../../graphql/query';
import PreLoader from '../../../../components/PreLoader';
import Popup from 'reactjs-popup';
import RowObsEnem from '../../../../components/editor/RowObsEnem';
import Seo from '../../../../components/layout/Seo';


export async function getServerSideProps(ctx: any) {
    const session = await getSession(ctx);
    const { id } = ctx.query;

    if (!session)
        return {
            redirect: {
                permanent: false,
                destination: '/painel/entrar'
            }
        }

    const redacao = await strapi(session.jwt).graphql({ query: redacaoById(id) })

    return {
        props: {
            session,
            redacaoProps: redacao,
        }
    }
}

function Correcao({ redacaoProps, session }: any) {
    const router = useRouter()
    const { id } = router.query;
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingDiscrepancia, setIsloadingDiscrepancia] = useState(false)
    const [isLoadingSending, setIsloadingSending] = useState(false)

    const [currentDiscrepancia, setCurrentDiscrepancia] = useState('')

    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);

    const [
        redacao,
        annotations, setAnnotations,
        annotation, setAnnotation,
        type, setType,
        editorType, setEditorType,
        competencia, setCompetencia,
        competenciasOffline,
        setNota,
        setObs,
        salvarCorrecao,
        setCorrecaoNull,
        setNullCorrecoes,
        setRedacao,
    ] = useCorretorStore(state => ([
        state.redacao,
        state.annotations, state.setAnnotations,
        state.annotation, state.setAnnotation,
        state.type, state.setType,
        state.editorType, state.setEditorType,
        state.competencia, state.setCompetencia,
        state.competenciasOffline,
        state.setNota,
        state.setObs,
        state.salvarCorrecao,
        state.setCorrecaoNull,
        state.setNullCorrecoes,
        state.setRedacao,
    ]), shallow);

    React.useEffect(() => {
        setRedacao(redacaoProps)

        return () => {
            setCorrecaoNull()
            setNullCorrecoes()
        }
    }, [])

    React.useEffect(() => {

        if (redacao?.correcaos?.length > 0) {
            redacao?.correcaos.map(async (correcao: any) => {
                //console.log("useEffect ==> map", correcao._id)
                const correcaoDB: any = await strapi(session.jwt).findOne('correcaos', correcao.id);

                // //console.log("useEffect ==> db ", correcaoDB)
                //console.log(" ==> ", redacao.status_correcao)

                if (correcaoDB.corretor.id === session.id && redacao.status_correcao != 'discrepancia') {
                    router.replace('/painel/corretor')
                } else {
                    setIsLoading(false)
                }
            })
        } else
            setIsLoading(false)
    }, [redacao])

    const handlerCompetencia = (nCompetencia: number) => {
        setCompetencia(nCompetencia);
        setAnnotation({})
    }

    const handlerEditorType = (nEditorType: number) => {
        setEditorType(nEditorType);
        setAnnotation({})
    }

    const onChange = (nAnnotation: any) => {
        setAnnotation({
            data: {
                competencia: competencia,
                editorType: editorType,
            },
            ...nAnnotation,
        })
    }

    const onSubmit = (annotation: any) => {
        const { geometry, data } = annotation
        setAnnotation({})
        setAnnotations(annotations.concat({
            // @ts-ignore
            geometry,
            data: {
                ...data,
                id: Math.random(),
                competencia: competencia,
                editorType: editorType,
            }
        }))
    }


    useEffect(() => {
        switch (editorType) {
            case 2:
                setType(RectangleSelector.TYPE)
                break;
            case 3:
                setType(RectangleSelector.TYPE)
                break;
            default:
                setType(PointSelector.TYPE)
                break;
        }
    }, [editorType])

    if (!redacao) return (<h1></h1>);

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

                    <button style={{
                        padding: 2,
                        minWidth: '50%',
                        borderRadius: '0.5rem',
                        backgroundColor: `white`,
                        border: '1px solid white',
                        color: cor,
                        //textTransform: 'uppercase',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        'fontFamily': "Poppins, sans-serif"

                    }} onClick={() => {
                        annotations.splice(
                            // @ts-ignore
                            annotations.indexOf(annotation), 1
                        );
                        setAnnotation({});
                        setAnnotations(annotations);
                    }}>Excluir</button>
                </div>
            </div>
        )
    }


    const handlerEnviarCorrecao = async () => {
        debugPrint('handlerEnviarCorrecao', 'preenchidos ===> ', competenciasOffline.length, ' ===> ',);

        if (redacao.status_correcao === 'discrepancia') {
            setOpen(!checkErrorValidations())
        } else {
            if (!checkErrorValidations())
                nextEnvio()
        }
    }


    const checkErrorValidations = () => {
        var errorMessage: string[] = [];


        competenciasOffline.map((itemCompentencia: any, index: number) => {
            if (itemCompentencia.nota < 0) {
                errorMessage.push(`${itemCompentencia.title} - Selecione a nota`)
            } else if (itemCompentencia.nota != 200) {
                debugPrint(itemCompentencia.obs.length, ' <======= ')
                if (itemCompentencia.obs.length <= 3) {
                    errorMessage.push(`${itemCompentencia.title} - Preencher observação da competência`)
                }
            }
        })

        if (errorMessage.length > 0)
            errorMessage.map(message => message.includes("nota") ? toast.error(message) : toast.warning(message))

        return errorMessage?.length > 0;
    }

    const nextEnvio = async () => {
        setIsloadingSending(true)
        const response = await salvarCorrecao(id as string, session);
        debugPrint('salvar response', response)
        //console.log(" ==> nota simples: ", redacao);

        if (response.error) {
            setIsloadingSending(false)
            toast.error(response.message)
        } else {
            toast.success(response.message)
            router.replace('/painel/corretor')
        }
    }

    if (isLoading)
        return <PreLoader />

    return (
        <MainLayout menuType={2} role="corretor">
            <style global jsx>{`
                
                .gridTemas .content .boxTema .redacao{
                    display: block;
                    width: 100%;
                    height: 60rem;
                    overflow: scroll;
                }
                
                .gridTemas .content .boxTema .redacao img{
                    width: 100%!important;
                }

                .competenciaModal{
                    padding: 1.3rem;
                    text-align: center;
                  }
                  
                  .competenciaModal h1{
                    text-align: center;
                    font-size: 1.3rem;
                    margin: 0 0 2rem;
                    text-transform: uppercase;
                  }
                  
                  .competenciaModal .btnContinuar{
                    display: inline-block;
                    margin: 3rem 0 0;
                  }
                  
                  .competenciaBox span{
                    font-size: 1.2rem;
                    font-weight: 600;
                    margin: 0 0 1rem;
                  }
                  
                  ul li .competenciaNome{
                    font-weight: 400;
                    margin: 0 1rem 0 0;
                    font-size: 1rem;
                  }
                  
                  .competenciaNota{
                    color: var(--black);
                  }
                  
                  .notaBox{
                    margin: 1rem 0 0;
                  }
                  
                  .notaLabel{
                    font-size: 1.1rem;
                    font-weight: 600;
                  }
                  
                  .notaFinal{
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--green);
                  }
                  
            `}</style>
            <div className="gridTemas">

                <Seo title="Correção" />
                <div className="content">
                    <div className="boxTema">
                        {isLoadingSending && <PreLoader />}
                        {!isLoadingSending &&
                            <>
                                <div className="competencia">
                                    <span onClick={() => handlerCompetencia(1)} className={competencia == 1 ? 'active' : ''} style={{ "background": "#3f37c9" }}>Competência I</span>
                                    <span onClick={() => handlerCompetencia(2)} className={competencia == 2 ? 'active' : ''} style={{ "background": "#fb5400" }}>Competência II</span>
                                    <span onClick={() => handlerCompetencia(3)} className={competencia == 3 ? 'active' : ''} style={{ "background": "#b5179e" }}>Competência III</span>
                                    <span onClick={() => handlerCompetencia(4)} className={competencia == 4 ? 'active' : ''} style={{ "background": "#fcbe21" }}>Competência IV</span>
                                    <span onClick={() => handlerCompetencia(5)} className={competencia == 5 ? 'active' : ''} style={{ "background": "#8ac925" }}>Competência V</span>
                                </div>

                                <div className="tasks">

                                    <span onClick={() => handlerEditorType(1)} className={editorType == 1 ? `task` : 'task'} style={{ border: editorType == 1 ? `2px solid ${getColorActivite(competencia)}` : 'none' }}>
                                        <span className="img">
                                            <Image src={CloseIcon} className="img-responsive" alt="" />
                                        </span>
                                        <span className="text">Adicionar &quot;x&quot;</span>
                                    </span>

                                    <span onClick={() => handlerEditorType(2)} className={editorType == 2 ? `task` : 'task'} style={{ border: editorType == 2 ? `2px solid ${getColorActivite(competencia)}` : 'none' }} >
                                        <span className="img">
                                            <Image src={PencilIcon} className="img-responsive" alt="" />
                                        </span>
                                        <span className="text">Traçado de lápis</span>
                                    </span>
                                    <span onClick={() => handlerEditorType(3)} className={editorType == 3 ? `task` : 'task'} style={{ border: editorType == 3 ? `2px solid ${getColorActivite(competencia)}` : 'none' }}>
                                        <span className="img">
                                            <Image src={PencilIcon} className="img-responsive" alt="" />
                                        </span>
                                        <span className="text">Destacar texto</span>
                                    </span>
                                    
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
                                        onChange={onChange}
                                        onSubmit={onSubmit}
                                        className="img-responsive"
                                    />
                                    {/* <Image src={RedacaoPreview}  alt="" /> */}
                                </div>
                            </>
                        }
                    </div>
                </div>


                <div className="notas">
                    {isLoadingSending && <PreLoader />}
                    {!isLoadingSending && (<><h1>Notas</h1>
                        <span className="criterios">

                            {competenciasOffline.map((competenciaItem: any, index: number) => (
                                <span className="criterio" key={index}>
                                    <span className="title">{competenciaItem.title}</span>
                                    <span className="subtitle">Selecione uma nota.</span>

                                    <span className="notasCriterios" onChange={(e: any) => {
                                        debugPrint('competencia: ', index, ' - ', parseInt(e.target.value));
                                        setNota(parseInt(e.target.value), index);
                                    }}>
                                        <span className="nota">
                                            <input type="radio" id={`${index}0`} name={`${index}`} value="0" />
                                            <label htmlFor={`${index}0`}>0</label>
                                        </span>

                                        <span className="nota">
                                            <input type="radio" id={`${index}40`} name={`${index}`} value="40" />
                                            <label htmlFor={`${index}40`}>40</label>
                                        </span>

                                        <span className="nota">
                                            <input type="radio" id={`${index}80`} name={`${index}`} value="80" />
                                            <label htmlFor={`${index}80`}>80</label>
                                        </span>

                                        <span className="nota">
                                            <input type="radio" id={`${index}120`} name={`${index}`} value="120" />
                                            <label htmlFor={`${index}120`}>120</label>
                                        </span>

                                        <span className="nota">
                                            <input type="radio" id={`${index}160`} name={`${index}`} value="160" />
                                            <label htmlFor={`${index}160`}>160</label>
                                        </span>

                                        <span className="nota">
                                            <input type="radio" id={`${index}200`} name={`${index}`} value="200" />
                                            <label htmlFor={`${index}200`}>200</label>
                                        </span>
                                    </span>
                                    {(competenciaItem.nota >= 0 && competenciaItem.nota < 200) && (
                                        <textarea onChange={(e) => {
                                            debugPrint("teste =====> ", e.target.value[0])
                                            setObs(e.target.value as string, index);
                                        }} rows={5} style={{
                                            width: '100%',
                                            marginTop: '12px',
                                            borderRadius: '0.5rem',
                                        }}>

                                        </textarea>
                                    )}
                                    {competenciaItem.obs_enem != null && <div className={`popCompetencia ${competenciaItem.obs_enem!.color}`} style={{ marginTop: '12px' }}>
                                        {competenciaItem.obs_enem != null && competenciaItem.obs_enem.items.map((item: any, index: number) => <RowObsEnem key={index} item={item} />
                                        )}
                                    </div>}

                                </span>))}

                            <span className="botao">
                                <button onClick={handlerEnviarCorrecao}>Enviar correção</button>
                            </span>
                        </span></>)}
                </div>
            </div>

            {redacao.status_correcao == 'discrepancia' && <Popup open={open} closeOnDocumentClick={false} onClose={closeModal}>
                <div className="competenciaModal">
                    {isLoadingDiscrepancia && <PreLoader />}

                    {!isLoadingDiscrepancia && <div className="contentPop">
                        <h1>Selecione correção discrepante</h1>
                        <div className="competencias">

                            {redacao?.correcaos?.length > 0 && redacao.correcaos.filter((correcao: any) => correcao.discrepante == false)?.map((correcao: any, indexCorrecao: number) => {
                                var valorTotal = 0;

                                return (<div onClick={() => {
                                    setCurrentDiscrepancia(currentDiscrepancia == correcao.id ? '' : correcao.id);
                                }} key={indexCorrecao} className={`competenciaBox ${currentDiscrepancia === correcao.id ? 'activeDiscrepancia' : ''}`}>
                                    <span>Correção {indexCorrecao + 1}</span>
                                    <ul>
                                        {correcao?.competencias != undefined && correcao?.competencias?.length > 0 && correcao?.competencias?.map((competencia: any, indexCompetencia: number) => {

                                            valorTotal = valorTotal + competencia.nota;

                                            return (<li key={indexCompetencia}>
                                                <span className="competenciaNome">Competência {numeroRomano(indexCompetencia)}</span>
                                                <span className="competenciaNota">{competencia.nota}</span>
                                            </li>)
                                        })}

                                    </ul>
                                    <div className="notaBox">
                                        <span className="notaLabel">Total</span>
                                        <span className="notaFinal">{valorTotal}</span>
                                    </div>
                                </div>)
                            })}

                        </div>
                        <span className="btnContinuar" onClick={async () => {
                            if (currentDiscrepancia) {
                                setIsloadingDiscrepancia(true)
                                await strapi(session.jwt).update('correcaos', currentDiscrepancia, { discrepante: true }).then(async (response: any) => {
                                    await strapi(session.jwt).update('redacaos', redacao.id, { status_correcao: 'finalizada' });
                                    nextEnvio()
                                }).catch((error: any) => {
                                    toast.warning('Atualize a página e tente novamente, code error: ' + error.message);
                                    setIsloadingDiscrepancia(false)
                                });
                            } else {
                                toast.error('É necessário selecionar uma correção discrepante!')
                            }
                        }}>ENCERRAR DISCREPÂNCIA</span>
                    </div>}
                </div>
            </Popup>}
            <style jsx>
                {
                    `
                    .competenciasModal{
                        padding: 0 1.5em;
                    }
                    .competencias { 
                        display: flex; 
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                    }
                    
                    .competencias ul li {
                        list-style: none;
                    }

                    .competenciaBox { 
                        flex: 1;
                        cursor: pointer;
                        display:flex;
                        align-items: center;
                        justify-content: center;
                        flex-direction: column;
                    }

                    .notaBox { 
                        display:flex;
                        flex-direction: column;
                    }

                    .btnContinuar { 
                        border-radius: 0.5em;
                        color: var(--white);
                        padding: 0.5em 1.5em;
                        background-color: var(--dark);
                        cursor: pointer;
                    }

                    .activeDiscrepancia{
                        background-color: #ccc;
                        color: var(--white);
                    }

                    .gridTemas{display: grid; grid-template-columns: 2fr 1fr; gap: 2rem}
.gridTemas .content{display: block; width: 100%;}
.gridTemas .content .boxTema{display: block; width: 100%; border-radius: 0.75rem; background: var(--gray20); padding: 1.875rem 1.5625rem; position: relative; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
.gridTemas .content .boxTema .competencia{display: grid; grid-template-columns: repeat(5, 1fr); gap: 1rem; margin: 0 0 1.5rem}
.gridTemas .content .boxTema .competencia span{transition: all 0.5s ease; display: flex; cursor: pointer; align-items: center; justify-content: center; width: 100%; color: var(--gray20);background: #3f37c9; height: 2.4375rem; border-radius: 0.75rem;font-family: 'Poppins', sans-serif; font-weight: 500; font-size: 0.91125em;}
.gridTemas .content .boxTema .competencia span.active{border: 2px solid var(--green)}
.gridTemas .content .boxTema .competencia span:hover{transform: scale(0.9);}
.gridTemas .content .boxTema .tasks{display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin: 0 0 2rem}
.gridTemas .content .boxTema .tasks .task{display: flex; transition: all 0.5s ease; cursor: pointer; flex-direction: row; gap: 0.3rem;  align-items: center; justify-content: center; background: var(--white);height: 2.4375rem; border-radius: 0.75rem;font-family: 'Poppins', sans-serif; font-weight: 500; font-size: 0.91125em;}
.gridTemas .content .boxTema .tasks .task.active{border: 2px solid var(--green)}
.gridTemas .content .boxTema .tasks .task:hover{transform: scale(0.9);}
.gridTemas .content .boxTema .tasks .task .img{position: relative; top: 2px}
.gridTemas .content .boxTema .redacao{display: block; width: 100%; height: 25rem; overflow: scroll;}

.gridTemas .notas{display: block; width: 100%; height: max-content; border-radius: 0.75rem; background: var(--gray20); padding: 1.875rem 1.5625rem; position: relative; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
.gridTemas .notas h1{display: block; width: 100%; text-align: center; font-size: 1.5625rem}
.gridTemas .notas .criterios{display: block; width: 100%;}
.gridTemas .notas .criterios .criterio{display: block; width: 100%; margin: 0 0 1rem}
.gridTemas .notas .criterios .criterio .title{display: block; width: 100%; font-size: 0.926874rem; font-weight: 500; color: var(--dark)}
.gridTemas .notas .criterios .criterio .subtitle{display: block; width: 100%; font-size: 0.736875rem; font-weight: 300; color: var(--gray40)}
.gridTemas .notas .criterios .criterio .notasCriterios{display: grid; width: 100%; grid-template-columns: repeat(6, 1fr); gap: 0.5rem; margin: 0.5rem 0 0}
.gridTemas .notas .criterios .criterio .notasCriterios .nota{display: flex; align-items: center; flex-direction: row; gap: 0.4rem; width: 100%; background: var(--white); border-radius: 0.71875rem; font-size: 0.7rem; color: var(--gray40); padding: 0.3875rem 0.6875rem}
.gridTemas .notas .criterios .criterio .notasCriterios .nota input{width: 0.5625rem; height: 0.5625rem}

.gridTemas .notas .criterios .botao{display: block; width: 100%; margin: 2rem 0 0}
.gridTemas .notas .criterios .botao button{margin: 0; border: none;  cursor: pointer; transition: all 0.5s ease; display: inline-block; width: 100%; margin: 0 0 1rem; text-align: center; color: var(--gray20); font-family: 'Poppins', sans-serif; font-weight: 500; border-radius: 0.75rem; font-size: 1.2em; background: var(--dark); padding: 0.5125rem; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
.gridTemas .notas .criterios .botao button:hover{transform: scale(0.9);}

.content-global{
  max-width: 95%!important;
  margin: 0 auto;
}

.gridTemas .content .boxTema .redacao{
    display: block;
    width: 100%;
    height: 60rem;
    overflow: scroll;
}

.gridTemas .content .boxTema .redacao img{
    width: 100%;
}


@media(max-width: 1920px){
  /* .content-global{max-width: 1200px; margin: 0 0 0 27.75rem} */
  .content-global{ max-width: 95%!important; margin: 0 auto!important;}
}

@media(max-width: 1700px){
  /* .content-global{max-width: 1200px; margin: 0 0 0 27.75rem} */
  .content-global{ max-width: 95%!important; margin: 0 auto!important;}
}

@media(max-width: 1630px){
  /* .content-global{max-width: 1150px; margin: 0 0 0 26.75rem} */
  /* html {font-size: 14px} */
  .content-global{ max-width: 95%!important; margin: 0 auto!important;}
}

@media(max-width: 1440px){
  /* .content-global{max-width: 70%} */
  .content-global{ max-width: 95%!important; margin: 0 auto!important;}
  .gridTemas .content .boxTema .competencia{grid-template-columns: repeat(3, 1fr)}
  .gridTemas .content .boxTema .tasks{grid-template-columns: repeat(3, 1fr)}
}


@media(max-width: 1240px){
  /* .content-global{max-width: 70%; margin: 0 0 0 25rem} */
  .content-global{ max-width: 95%!important; margin: 0 auto!important;}
}

@media(max-width: 1100px){
  .content-global{ max-width: 95%!important; margin: 0 auto!important;}
  
  /* .content-global{max-width: 90%; margin: 0 auto} */
}

@media(max-width: 640px){
  .content-global{ max-width: 95%!important; margin: 0 auto!important;}

  .gridTemas .content .boxTema .competencia{grid-template-columns: repeat(3, 1fr)}
  .gridTemas .content .boxTema .tasks{grid-template-columns: repeat(3, 1fr)}
  .gridTemas{grid-template-columns: 1fr}
}

@media(max-width: 480px){
  .content-global{ max-width: 95%!important; margin: 0 auto!important;}

  .gridTemas .content .boxTema .competencia{grid-template-columns: repeat(2, 1fr)}
  .gridTemas .content .boxTema .tasks{grid-template-columns: repeat(2, 1fr)}
  .gridTemas .notas .criterios .criterio .notasCriterios{grid-template-columns: repeat(3, 1fr)}
}
                    `
                }
            </style>
            <style global jsx>
                {`
                    .popCompetencia {
                        display: flex;
                        flex-direction: row;
                        background: #c3ddea;
                        align-items: center;
                        margin: 1rem 0;
                        min-height: 80px;
                    }

                    .popCompetencia span {
                        align-self: stretch;
                        display: flex;
                        align-items: center;
                    }
                    
                    .popCompetencia .number{
                      display: flex;
                      flex: 1;
                      font-weight: 700;
                      font-size: 1.2rem;
                      padding: 1rem 0.5rem;
                      justify-content: center;
                    }
                    
                    .popCompetencia .text{
                      display: flex;
                      flex: 5;
                      font-weight: 300;
                      font-size: 0.8rem;
                      padding: 1rem 0.5rem;
                      border-right: 2px solid #fff;
                      border-left: 2px solid #fff;
                    }
                    
                    .popCompetencia .divisor{
                      display: flex;
                      flex: 1;
                      font-weight: 700;
                      font-size: 1.2rem;
                      padding: 1rem 0.5rem;
                      justify-content: center;
                    }
                    
                    .popCompetencia .text:last-child{
                      border-right: none;
                    }
                    
                    .ciano{background: #dfbad6;}
                    .blue{background: #dfeef5;}
                    .green{background: #cde1d4;}
                    .orange{background: #f8d2c5;}
                    .pink{background: #f9e2e8;}
                    `}
            </style>
        </MainLayout>
    )
}

export default Correcao
