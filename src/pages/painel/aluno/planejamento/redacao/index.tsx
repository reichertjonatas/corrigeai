import { getSession } from 'next-auth/client';
import React from 'react'
import MainLayout from '../../../../../components/layout/MainLayout'
import Seo from '../../../../../components/layout/Seo'

export async function getServerSideProps(ctx: any) {
    const session = await getSession(ctx);

    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: '/painel/entrar',
            }
        }
    }

    return {
        props: {
            session,
        }
    }
}

function RedacaoIndexPlanejamento({ session }: any) {
    return (
        <MainLayout>
            <Seo title="Planejamento da redação" />
            <div className="gridPlanejamento">
                <div className="content">
                    <div className="box">
                        <h1>Planeje sua redação</h1>
                        <span className="desc">
                            <form action="#">
                                <label htmlFor="">Tema:</label>
                                <input type="text" />
                                <label htmlFor="">Qual sua opinião sobre o tema (tese):</label>
                                <textarea></textarea>
                                <span className="grid">
                                    <span>
                                        <label htmlFor="">Argumento 1:</label>
                                        <textarea></textarea>
                                    </span>
                                    <span>
                                        <label htmlFor="">Argumento 2:</label>
                                        <textarea></textarea>
                                    </span>
                                    <span>
                                        <label htmlFor="">Repertório 1:</label>
                                        <textarea></textarea>
                                    </span>
                                    <span>
                                        <label htmlFor="">Repertório 2:</label>
                                        <textarea></textarea>
                                    </span>
                                    <span className="coluna">
                                        <label htmlFor="">Agente:</label>
                                        <input type="text" />
                                        <label htmlFor="">Ação:</label>
                                        <input type="text" />
                                        <label htmlFor="">Modo:</label>
                                        <input type="text" />
                                    </span>
                                    <span className="coluna">
                                        <label htmlFor="">Finalidade:</label>
                                        <input type="text" />
                                        <label htmlFor="">Detalhamento: </label>
                                        <textarea></textarea>
                                    </span>
                                </span>

                            </form>
                        </span>
                    </div>
                    <span className="botao">
                        <a style={{ cursor: "pointer" }} onClick={() => {
                            if (typeof window != undefined) {
                                window.print()
                            }
                        }}>Imprimir planejamento</a>
                    </span>
                </div>
            </div>
            <style global jsx>
                {
                    `
                    @media print{
                        .welcomeOla { display: none; }
                        .sidebar{
                            display: none;
                        }
                        .content-global .head{
                            grid-template-columns: 1fr;
                        }
                        .content-global .head h1{
                            display: none;
                        }
                        .content-global .head .user{
                            text-align: center;
                        }
                    
                        .gridPlanejamento .content .botao a{
                            display: none;
                        }

                    }`
                }
            </style>
            <style jsx>
                {
                    `
                    .gridPlanejamento {
                        display: grid;
                        grid-template-columns: 1fr;
                    }
                    
                    .gridPlanejamento .content {
                        display: block;
                        width: 100%;
                    }
                    
                    .gridPlanejamento .content .box {
                        display: block;
                        width: 100%;
                        border-radius: 0.75rem;
                        background: var(--gray20);
                        padding: 2.8125rem 1.5rem;
                        position: relative;
                        box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.15);
                    }
                    
                    .gridPlanejamento .content .box h1 {
                        display: block;
                        width: 100%;
                        text-align: center;
                        font-weight: 500;
                        font-size: 1.6875rem;
                        margin: 0 0 1.5rem
                    }
                    
                    .gridPlanejamento .content .box .desc {
                        display: block;
                        width: 100%;
                        text-align: left;
                        font-weight: 400;
                        font-size: 1.175rem;
                        color: #72b01e
                    }
                    
                    .gridPlanejamento .content .botao a {
                        display: block;
                        width: 100%;
                        max-width: 400px;
                        margin: 2rem auto;
                        text-align: center;
                        color: var(--gray20);
                        font-family: 'Poppins', sans-serif;
                        font-weight: 500;
                        border-radius: 0.75rem;
                        font-size: 1.2em;
                        background: var(--dark);
                        padding: 0.5125rem;
                        box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.15);
                    }
                    
                    .gridPlanejamento .content .botao a:hover {
                        transform: scale(0.9);
                    }
                    
                    .gridPlanejamento .content .box .desc form {
                        display: block;
                        width: 100%;
                    }
                    
                    .gridPlanejamento .content .box .desc form input {
                        display: block;
                        border-radius: 0.8rem;
                        font-family: 'Poppins', sans-serif !important;
                        margin: 0 0 0.5rem;
                        width: 100%;
                        background: var(--gray30);
                        padding: 0.8rem 0.8rem;
                        border: none;
                        font-size: 1.2rem;
                        color: #000
                    }
                    
                    .gridPlanejamento .content .box .desc form input::placeholder {
                        color: #000
                    }
                    
                    .gridPlanejamento .content .box .desc form textarea {
                        display: block;
                        border-radius: 0.8rem;
                        font-family: 'Poppins', sans-serif !important;
                        min-height: 7.75rem;
                        margin: 0 0 1rem;
                        width: 100%;
                        background: var(--gray30);
                        padding: 0.8rem 0.8rem;
                        border: none;
                        font-size: 1.2rem;
                        color: #000
                    }
                    
                    .gridPlanejamento .content .box .desc form textarea::placeholder {
                        color: #000
                    }
                    
                    .gridPlanejamento .content .box .desc form .grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 1rem;
                    }
                    
                    .gridPlanejamento .content .box .desc form .grid textarea {
                        display: block;
                        border-radius: 0.8rem;
                        min-height: 19.93rem;
                        margin: 0 0 0.5rem;
                        width: 100%;
                        background: var(--gray30);
                        padding: 0.8rem 0.8rem;
                        border: none;
                        font-size: 1.2rem;
                        color: #000
                    }
                    
                    .gridPlanejamento .content .box .desc form .coluna textarea {
                        display: block;
                        border-radius: 0.8rem;
                        min-height: 7.35rem;
                        margin: 0 0 0.5rem;
                        width: 100%;
                        background: var(--gray30);
                        padding: 0.8rem 0.8rem;
                        border: none;
                        font-size: 1.2rem;
                        color: #000
                    }
                    
                    .gridPlanejamento .content .box .desc form .grid textarea::placeholder {
                        text-align: center;
                    }
                    
                    .gridPlanejamento .content .box .desc form .coluna textarea::placeholder {
                        text-align: left;
                    }
                    
                    @media (max-width: 640px) {
                        .gridPlanejamento .content .box .desc form .grid {
                            grid-template-columns: 1fr
                        }
                    }
                    
                    @media (max-width: 500px) {
                        .gridPlanejamento {
                            grid-template-columns: 1fr
                        }
                    }
                    .gridPlanejamento .content .box .desc form label {display: block;width: 100%;color: #000;font-weight: 700;margin: 0.7rem 0.3rem 0;}
.gridPlanejamento .content .box .desc form input{display: block; border-radius: 0.8rem; font-family: 'Poppins', sans-serif !important; margin: 0 0 1rem; width: 100%; background: var(--gray30); padding: 0.8rem 0.8rem; border: none; font-size: 1.2rem; color: #000}
.gridPlanejamento .content .box .desc form .coluna textarea{display: block; border-radius: 0.8rem; min-height: 9.7rem; margin: 0 0 0.5rem; width: 100%; background: var(--gray30); padding: 0.8rem 0.8rem; border: none; font-size: 1.2rem; color: #000}
                    
                    `
                }
            </style>
        </MainLayout>
    )
}

export default RedacaoIndexPlanejamento

