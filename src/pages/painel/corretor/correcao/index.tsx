import Image from 'next/image';
import React, { useState } from 'react'
import { CloseIcon, PencilIcon, RedacaoPreview } from '../../../../components/icons';
import MainLayout from '../../../../components/layout/MainLayout'
import { withAuthSession } from '../../../../utils/helpers';
import styles from './Correcao.module.css';

// @ts-ignore
import Annotation from 'react-image-annotation'
import {
    PointSelector,
    RectangleSelector,
    OvalSelector

    // @ts-ignore
} from 'react-image-annotation/lib/selectors'
import { useEffect } from 'react';

const img = "/images/redacao.jpeg"

const Box = ({ children, geometry, style }: any) => (
    <div
        style={{
            ...style,
            position: 'absolute',
            left: `${geometry.x}%`,
            top: `${geometry.y}%`,
            height: `${geometry.height}%`,
            width: `${geometry.width}%`,
        }}
    >
        {children}
    </div>
)

function Correcao() {
    const [competencia, setCompetencia] = useState(1);
    const [editorType, setEditorType] = useState(1);
    const [type, setType] = useState(RectangleSelector.TYPE);

    const [annotations, setAnnotations] = useState([])
    const [annotation, setAnnotation] = useState({})


    function renderHighlight({ annotation, active }: any) {
        const { geometry } = annotation
        if (!geometry) return null

        var boxStyle : any = {
            border: 'solid 1px black',
            boxShadow: active
                && '0 0 20px 20px rgba(255, 255, 255, 0.3) inset'
        }

        var cor = 'red';

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

        switch (annotation.data.editorType) {
            case 2:
                boxStyle = {
                    // borderRadius: '1rem',
                    borderBottom: `solid 2px ${cor}`,
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: cor,
                    boxShadow: active && `0 0 12px 12px ${cor}90 inset`,
                }
                break;
            case 3:
                boxStyle = {
                    borderRadius: '1rem',
                    border: `solid 1px ${cor}`,
                    backgroundColor: `${cor}90`,
                    padding: '1rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: cor,
                    boxShadow: active && `0 0 12px 12px ${cor}90 inset`,
                }
                break;
        
            default:
                boxStyle = {
                    borderRadius: '1rem',
                    // border: `solid 1px ${cor}`,
                    backgroundColor: `${cor}90`,
                    // padding: '1rem',
                    display: 'flex',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.8rem',
                    alignItems: 'center',
                    color: cor,
                    boxShadow: active && `0 0 12px 12px ${cor}90 inset`,
                    '-webkit-text-stroke': '1.5px white'
                }
                break;
        }

        return (
            <Box
                key={annotation.data.id}
                geometry={geometry}
                style={boxStyle}
            >
                {annotation.data.editorType == 1 && 'X'}
            </Box>
        )
    }


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
                    marginTop: '0.25rem',
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
            </div>
        )
    }

    const handlerCompetencia = (nCompetencia: number) => {
        setCompetencia(nCompetencia);
    }

    const handlerEditorType = (nEditorType: number) => {
        setEditorType(nEditorType);
        setAnnotation({})
    }

    const onChange = (annotation: any) => {
        setAnnotation(annotation)
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
                setType(OvalSelector.TYPE)
                break;
            default:
                setType(PointSelector.TYPE)
                break;
        }
    }, [editorType])

    return (
        <MainLayout menuType={2}>

            <div className={styles.gridTemas}>

                <div className={styles.content}>
                    <div className={styles.boxTema}>

                        <div className={styles.competencia}>
                            <span onClick={() => handlerCompetencia(1)} className={competencia == 1 ? styles.active : ''} style={{ "background": "#3f37c9" }}>Competência I</span>
                            <span onClick={() => handlerCompetencia(2)} className={competencia == 2 ? styles.active : ''} style={{ "background": "#fb5400" }}>Competência II</span>
                            <span onClick={() => handlerCompetencia(3)} className={competencia == 3 ? styles.active : ''} style={{ "background": "#b5179e" }}>Competência III</span>
                            <span onClick={() => handlerCompetencia(4)} className={competencia == 4 ? styles.active : ''} style={{ "background": "#fcbe21" }}>Competência IV</span>
                            <span onClick={() => handlerCompetencia(5)} className={competencia == 5 ? styles.active : ''} style={{ "background": "#8ac925" }}>Competência V</span>
                        </div>

                        <div className={styles.tasks}>

                            <span onClick={() => handlerEditorType(1)} className={editorType == 1 ? `${styles.task} ${styles.active}` : styles.task}>
                                <span className={styles.img}>
                                    <Image src={CloseIcon} className={styles["img-responsive"]} alt="" />
                                </span>
                                <span className={styles.text}>Adicionar &quot;x&quot;</span>
                            </span>

                            <span onClick={() => handlerEditorType(2)} className={editorType == 2 ? `${styles.task} ${styles.active}` : styles.task}>
                                <span className={styles.img}>
                                    <Image src={PencilIcon} className={styles["img-responsive"]} alt="" />
                                </span>
                                <span className={styles.text}>Traçado de lápis</span>
                            </span>
                            <span onClick={() => handlerEditorType(3)} className={editorType == 3 ? `${styles.task} ${styles.active}` : styles.task}>
                                <span className={styles.img}>
                                    <Image src={PencilIcon} className={styles["img-responsive"]} alt="" />
                                </span>
                                <span className={styles.text}>Destacar texto</span>
                            </span>
                        </div>

                        <div className={styles.redacao}>
                            <Annotation
                                src={img}
                                alt=''

                                annotations={annotations}
                                renderContent={renderPopUp}
                                renderHighlight={renderHighlight}

                                type={type}
                                value={annotation}
                                onChange={onChange}
                                onSubmit={onSubmit}
                                className={styles["img-responsive"]}
                            />
                            {/* <Image src={RedacaoPreview}  alt="" /> */}
                        </div>
                    </div>
                </div>


                <div className={styles.notas}>
                    <h1>Notas</h1>
                    <span className={styles.criterios}>
                        <span className={styles.criterio}>
                            <span className={styles.title}>Critério I</span>
                            <span className={styles.subtitle}>Selecione uma nota.</span>

                            <span className={styles.notasCriterios}>
                                <span className={styles.nota}>
                                    <input type="radio" id="00" name="fav_language" value="0" />
                                    <label htmlFor="00">0</label>
                                </span>

                                <span className={styles.nota}>
                                    <input type="radio" id="040" name="fav_language" value="40" />
                                    <label htmlFor="040">40</label>
                                </span>

                                <span className={styles.nota}>
                                    <input type="radio" id="080" name="fav_language" value="80" />
                                    <label htmlFor="080">80</label>
                                </span>

                                <span className={styles.nota}>
                                    <input type="radio" id="0120" name="fav_language" value="120" />
                                    <label htmlFor="0120">120</label>
                                </span>

                                <span className={styles.nota}>
                                    <input type="radio" id="0160" name="fav_language" value="160" />
                                    <label htmlFor="0160">160</label>
                                </span>

                                <span className={styles.nota}>
                                    <input type="radio" id="0200" name="fav_language" value="200" />
                                    <label htmlFor="0200">200</label>
                                </span>
                            </span>
                        </span>

                        <span className={styles.botao}>
                            <button>Enviar correção</button>
                        </span>
                    </span>
                </div>
            </div>
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

export default Correcao
