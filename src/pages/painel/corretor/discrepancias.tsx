import moment from 'moment';
import { getSession } from 'next-auth/client';
import Link from 'next/link';
import React from 'react'
import { toast } from 'react-toastify';
import MainLayout from '../../../components/layout/MainLayout'
import { redacaoParaCorrigir, redacaoParaCorrigirDiscrepancia } from '../../../graphql/query';
import { useCorretorStore } from '../../../hooks/corretorStore';
import { strapi } from '../../../services/strapi';

export async function getServerSideProps(ctx: any) {
    const session = await getSession(ctx);

    if (!session)
        return {
            redirect: {
                permanent: false,
                destination: '/painel/entrar'
            }
        }

    const redacoes = await strapi(session.jwt).graphql({ query: redacaoParaCorrigirDiscrepancia("discrepancia") })

    return {
        props: {
            session: session,
            redacoesProps: redacoes,
        }
    }
}

function Descrepancias({ redacoesProps }: any) {
    const redacoes = useCorretorStore(state => state.redacoes);
    const setRedacoes = useCorretorStore(state => state.setRedacoes);
    const setNullRedacoes = useCorretorStore(state => state.setNullRedacoes);

    React.useEffect(() => {
        setRedacoes(redacoesProps);
        return () => setNullRedacoes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MainLayout menuType={2} role="corretor">
            <div className="redacoes-box">
                <div className="content">
                    <div className="head">
                        <div className="data">Data</div>
                        <div className="tema">Tema</div>
                        <div className="estudante">Estudante</div>
                        {/* <div className="circle">Segunda Correção</div> */}
                    </div>

                    <div className="list-item">
                        {redacoes && redacoes?.length <= 0 && <h1 className="msg_nada_encontrado">Nenhuma redação para corrigir.</h1>}
                        {redacoes?.length > 0 && redacoes.map((redacao: any, index: number) => {
                            //console.log("redacao => ", redacao )
                            // //console.log('redacaosPerUser.redacoes', redacaosPerUser.redacoes);
                            // return redacaosPerUser.redacoes.map((redacao: any, index: number) => {
                                const date = moment(redacao.createdAt);
                                return (
                                    <Link href={`/painel/corretor/correcao/${redacao.id}`} key={index} passHref>
                                        <div className="item" style={{ cursor: 'pointer' }}>
                                            <div className="data">{`${date.format("DD/MM")}`}</div>
                                            <div className="tema">{redacao.tema.titulo}</div>
                                            <div className="estudante">{redacao.user.email}</div>

                                            {/* <div className="circle">
                                                <span className="ic" style={{"background": "#72b01e"}}>&nbsp;</span>
                                            </div> */}
                                        </div>
                                    </Link>)
                            // });
                        })}
                    </div>
                </div>
            </div>
            <style jsx>
                {
                    `.redacoes-box{display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 12.3125rem; width: 100%; border-radius: 0.75rem; background: var(--gray20); padding: 0.8125rem; position: relative; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
                .redacoes-box .content{display: block; width: 100%;}

                .redacoes-box .content .head{display: flex; width: 100%; font-size: 1.125rem; gap: 1rem; font-weight: 500; color: var(--dark); margin: 0 0 1rem}
                .redacoes-box .content .head .data{display: flex; justify-content: center; flex: 1}
                .redacoes-box .content .head .tema{display: flex; justify-content: center; flex: 7}
                .redacoes-box .content .head .estudante{display: flex; justify-content: center; flex: 2}
                .redacoes-box .content .head .circle{display: flex; justify-content: center; flex: 1; text-align: center;}

                .redacoes-box .content .list-item .item{display: flex; width: 100%; gap: 1rem; margin: 0 0 1rem}
                .redacoes-box .content .list-item .item .data{display: flex; justify-content: center; align-items: center; flex: 1;font-size: 1.125rem; font-weight: 500; color: var(--dark); background: var(--gray50); min-height: 2.4375rem;border-radius: 0.9rem;}
                .redacoes-box .content .list-item .item .tema{display: flex; justify-content: center; align-items: center; flex: 7;font-size: 1.125rem; font-weight: 500; color: var(--dark); background: var(--gray50); min-height: 2.4375rem;border-radius: 0.9rem;}
                .redacoes-box .content .list-item .item .estudante{display: flex; justify-content: center; align-items: center; flex: 2;font-size: 1.125rem; font-weight: 500; color: var(--dark); background: var(--gray50); min-height: 2.4375rem;border-radius: 0.9rem;}
                .redacoes-box .content .list-item .item .circle{display: flex; flex: 1; justify-content: center; align-items: center;}
                .redacoes-box .content .list-item .item .circle .ic{display: block; width: 1.375rem; height: 1.375rem; border-radius: 50%; border: none}


                @media(max-width: 400px){
                .redacoes-box .content .head .data{font-size: 1rem}
                .redacoes-box .content .head .tema{font-size: 1rem}
                .redacoes-box .content .head .estudante{font-size: 1rem}
                .redacoes-box .content .head .circle{font-size: 1rem}
                .redacoes-box .content .list-item .item .data{font-size: 1rem}
                .redacoes-box .content .list-item .item .tema{font-size: 1rem}
                .redacoes-box .content .list-item .item .estudante{font-size: 1rem}
                .redacoes-box .content .list-item .item .circle{font-size: 1rem}
                }`
                }
            </style>
        </MainLayout>
    )
}

export default Descrepancias
