import React from 'react'
import MainLayout from '../../../../components/layout/MainLayout'
import { withAuthSession } from '../../../../utils/helpers';
import Seo from '../../../../components/layout/Seo'
import Image from 'next/image'
import { circle_graf, competencia, graf3_side, grafic2_side, grafico2 } from '../../../../components/icons'

function Desempenho() {
    return (
        <MainLayout>
            <Seo title="Desempenho" />
            <div className="gridPlanejamento emBreveGraficos">
                <div className="content">
                    <div className="box">
                        <h1>Nota por competência</h1>
                        <span className="desc">
                            <Image src={competencia} className="img-responsive" alt="" />
                        </span>
                    </div>

                    <div className="gridDois">
                        <div className="box">
                            <h1 className="subh1">Nota geral</h1>
                            <span className="graf">
                                <Image src={grafico2} className="img-responsive" alt="" />
                            </span>
                        </div>
                        <div className="box">
                            <h1 className="subh1">Nota por competência</h1>
                            <span className="graf">
                                <Image src={grafico2} className="img-responsive" alt="" />
                            </span>
                        </div>
                    </div>
                </div>
                <div className="side">
                    <div className="box">
                        <a href="javascript://">
                            <Image src={circle_graf} className="img-responsive" alt="" />
                            <span className="texto">Gráfico</span>
                        </a>
                    </div>
                    <div className="box">
                        <a href="javascript://">
                            <Image src={grafic2_side} className="img-responsive" alt="" />
                            <span className="texto">Gráfico</span>
                        </a>
                    </div>

                    <div className="box">
                        <a href="javascript://">
                            <Image src={graf3_side} className="img-responsive" alt="" />
                            <span className="texto">Gráfico</span>
                        </a>
                    </div>
                    <span className="botao">
                        <a href="#">Ver médias gerais</a>
                    </span>
                </div>
            </div>
            <style jsx>
                {
                    `
                    .gridPlanejamento{display: grid; grid-template-columns: 3fr 1fr; gap: 2rem}
                    .gridPlanejamento .content{display: block; width: 100%;}
                    .gridPlanejamento .content .box{display: block; width: 100%;border-radius: 0.75rem; background: var(--gray20); padding: 2.8125rem 1.5rem; position: relative; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15); margin: 0 0 1rem}
                    .gridPlanejamento .content .box h1{display: block; width: 100%; text-align: center; font-weight: 500; font-size: 1.6875rem; margin: 0 0 1.5rem}
                    .gridPlanejamento .content .box h1.subh1{display: block; padding: 0.2rem; border-radius: 0.5rem; width: 100%; color: #fff; background: var(--green); max-width: 220px; margin: 0 auto; text-align: center; font-weight: 500; font-size: 1rem;}
                    .gridPlanejamento .content .box .desc{display: block; width: 100%; text-align: left; font-weight: 400; font-size: 1.175rem; color: #fff}
                    .gridPlanejamento .side .box{margin: 0 0 1rem; display: block; width: 100%;border-radius: 0.75rem; background: var(--gray20); padding: 0 1rem 1rem; position: relative; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
                    .gridPlanejamento .side .box a{display: block; width: 100%; text-align: center; color: var(--dark); font-size: 1.2rem; font-weight: 500}
                    .gridPlanejamento .side .box a img{max-width: 70%}
                    .gridPlanejamento .side .box a .texto{display: block; width: 100%; margin: 1rem 0 0}
                    .gridPlanejamento .side .box a:hover{transform: scale(0.9);}
                    .gridDois{display: grid; grid-template-columns: 1fr 1fr; gap: 1rem}
                    .graf{display: block; width: 100%; margin: 1rem 0 0 }
                    .botao{display: block; width: 100%; margin: 2rem 0 0}
                    .botao a{margin: 0; border: none;  cursor: pointer; transition: all 0.5s ease; display: inline-block; width: 100%; margin: 0 0 1rem; text-align: center; color: var(--gray20); font-family: 'Poppins', sans-serif; font-weight: 500; border-radius: 0.75rem; font-size: 1.2em; background: var(--dark); padding: 0.5125rem; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
                    .botao a:hover{transform: scale(0.9);}


                    @media(max-width: 500px){
                        .gridPlanejamento{grid-template-columns: 1fr}
                    }

                    .emBreveGraficos .content .box{background: #a2a2a2;}
.emBreveGraficos .side .box{background: #a2a2a2;}
                    `
                }
            </style>
        </MainLayout>
    )
}

export async function getServerSideProps(ctx: any) {
    const session = await withAuthSession(ctx);

    if('redirect' in session) {
        return session;
    }
      
    return { props: {session: session} }
  }
  
export default Desempenho
