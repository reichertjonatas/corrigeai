import Link from 'next/link';
import React from 'react'
import MainLayout from '../../../../components/layout/MainLayout'
import Seo from '../../../../components/layout/Seo';
import { withAuthSession } from '../../../../utils/helpers';

function Planejamento() {
    return (
        <MainLayout>
            <Seo title="PLANEJAMENTO" />
            <div className="gridPlanejamento">
                <div className="content">
                    <div className="box">
                        <h1>PLANEJAMENTO</h1>
                        <span className="desc">
                            Cara pálida, sabemos que <strong>planejamento é algo muito importante na
                                sua redação</strong>, pois é avaliado na Competência III, sendo fundamental para
                            a construção de um bom texto. Todavia, sabemos que planejamento é
                            importante também na vida, não é mesmo?<br /><br />

                            Por isso,<strong> separamos um espaço da nossa Corrige Aí para você planejar!</strong>
                        </span>
                    </div>
                </div>

                <div className="side">
                    <div className="box">
                        <Link href="/painel/aluno/planejamento/calendario">Planeje sua semana</Link>
                    </div>
                    <div className="box">
                        <Link href="/painel/aluno/planejamento/redacao">Planeje sua redação</Link>
                    </div>
                </div>
            </div>
            <style global jsx>
                {`
                .gridPlanejamento{display: grid; grid-template-columns: 2.5fr 1fr; gap: 2rem}
                .gridPlanejamento .content{display: block; width: 100%;}
                .box{display: block; width: 100%;border-radius: 0.75rem; background: var(--gray20); padding: 2.8125rem 1.5rem; position: relative; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
                .box h1{display: block; width: 100%; text-align: center; font-weight: 500; font-size: 1.6875rem; margin: 0 0 1.5rem}
                .box .desc{display: block; width: 100%; text-align: left; font-weight: 400; font-size: 1.175rem; color: #72b01e}
                .box {margin: 0 0 1rem; display: block; width: 100%;border-radius: 0.75rem; background: var(--gray20); padding: 1.8125rem 1rem; position: relative; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
                .box a{display: block; width: 100%; text-align: center; color: var(--gray20); font-family: 'Poppins', sans-serif; font-weight: 500; border-radius: 0.75rem; font-size: 1.2em; background: var(--dark); padding: 0.5125rem; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
                .box a:hover{transform: scale(0.9);}
                
                @media(max-width: 500px){
                  .gridPlanejamento{grid-template-columns: 1fr}
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

export default Planejamento
