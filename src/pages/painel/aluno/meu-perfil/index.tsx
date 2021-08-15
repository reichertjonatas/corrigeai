import Image from 'next/image'
import React from 'react'
import { IcPhoto } from '../../../../components/icons'
import MainLayout from '../../../../components/layout/MainLayout'
import Seo from '../../../../components/layout/Seo'

function MeuPerfil() {
    return (
        <MainLayout>
            <Seo title="Editar perfil" />
            <div className="gridPlanejamento">
                <div className="content">
                    <div className="box">
                        <div className="botaoDelete">
                            <Image src={IcPhoto} className="img-responsive" alt="" />
                        </div>
                        <h1>Pedro Santos Mamare</h1>
                        <p>E-mail: mamarepedro@gmail.com</p>
                        <p>Data de Registro: 27/07/2021</p>
                        <p>ID: #7983</p>
                        <span className="desc">
                            <span className="dadosUser">
                                <span className="coluna">
                                    <h2>Dados do Usuário</h2>
                                    <span className="tabela">
                                        <span className="row">
                                            <span className="funcao">Senha:</span>
                                            <span className="tipo">
                                                <input type="password" />
                                            </span>
                                        </span>

                                        <span className="row">
                                            <span className="funcao">&nbsp;</span>
                                            <span className="tipo">
                                                <a href="#">Atualizar senha</a>
                                            </span>
                                        </span>
                                    </span>
                                </span>

                                <span className="coluna">
                                    <h2>Plano de Assinatura</h2>
                                    <span className="tabela">
                                        <span className="row">
                                            <span className="funcao">Plano Atual:</span>
                                            <span className="tipo">
                                                Plano trimestral - 10 envios
                                            </span>
                                        </span>
                                        <span className="row">
                                            <span className="funcao">Alterar Plano:</span>
                                            <span className="tipo">
                                                <select className="" name="">
                                                    <option value="">Selecione um plano</option>
                                                    <option value="">Plano Mensal 10 Envios</option>
                                                    <option value="">Plano Trimestral 10 Envios</option>
                                                    <option value="">Plano Semestral 10 Envios</option>
                                                    <option value="">Plano Anual 10 Envios</option>
                                                </select>
                                            </span>
                                        </span>
                                        <span className="row">
                                            <span className="funcao">Qtd. de Envios:</span>
                                            <span className="tipo">
                                                6 Envios
                                            </span>
                                        </span>
                                    </span>
                                </span>
                            </span>
                            <span className="botaoSave">
                                <a href="#">Salvar</a>
                            </span>
                        </span>
                    </div>
                </div>
            </div>

            <style jsx>
                {
                    `
                .gridPlanejamento{display: grid; grid-template-columns: 1fr;}
.gridPlanejamento .content{display: block; width: 100%;}
.gridPlanejamento .content .box{display: block; width: 100%;border-radius: 0.75rem; background: var(--gray20); padding: 2.8125rem 1.5rem; position: relative; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
.gridPlanejamento .content .box h1{display: block; width: 100%; text-align: left; font-weight: 500; font-size: 1.6875rem; margin: 0}
.gridPlanejamento .content .box h2{display: block; width: 100%; text-align: left; font-weight: 500; font-size: 1.2875rem; margin: 0 0 1rem}
.gridPlanejamento .content .box p{display: block; width: 100%; text-align: left; font-weight: 300; font-size: 1rem; color: var(--gray40); margin: 0 0 0.3rem}
.gridPlanejamento .content .box .desc{display: block; width: 100%; text-align: left; font-weight: 400; font-size: 1rem; color: #000; margin: 5rem 0 0}
.gridPlanejamento .content .box .desc .dadosUser{display: grid; grid-template-columns: 1fr 1fr; gap: 2rem}
.gridPlanejamento .content .box .desc .dadosUser .tabela{display: flex; flex-direction: column; border: 1px solid #d6d6d6;padding: 1rem; border-radius: 1rem;}
.gridPlanejamento .content .box .desc .dadosUser .tabela .row{display: flex; flex-direction: row; align-items: center; margin: 0 0 1rem; height: 30px}
.gridPlanejamento .content .box .desc .dadosUser .tabela .row:last-child{margin: 0}
.gridPlanejamento .content .box .desc .dadosUser .tabela .row .funcao{display: flex; flex: 1;}
.gridPlanejamento .content .box .desc .dadosUser .tabela .row .tipo{display: flex; flex: 2;}
.gridPlanejamento .content .box .desc .dadosUser .tabela .row .tipo select{display: block; width: 100%; border: none; border-radius: 0.6rem; padding: 0.5rem; font-size: 0.9rem}
.gridPlanejamento .content .box .desc .dadosUser .tabela .row .tipo input{display: block; width: 100%; border: none; border-radius: 0.6rem; padding: 0.5rem; font-size: 0.9rem}
.gridPlanejamento .content .box .desc .dadosUser .tabela .row .tipo a{display: block; max-width: 500px; margin: 0;  background: var(--green);padding: 0.5rem 1rem;color: var(--white);text-decoration: none;border-radius: 0.5rem;}
.gridPlanejamento .content .box .desc .dadosUser .tabela .row .tipo a:hover{background: var(--dark)}



.gridPlanejamento .content .box .botaoDelete{position: absolute; right: 4rem; top: 3rem;}
.gridPlanejamento .content .box .botaoDelete img{width: 10rem; height: 10rem; object-fit: cover; border-radius: 50%}

.gridPlanejamento .content .box .botaoSave{display: block; width: 100%; text-align: center; margin: 2rem 0 0}
.gridPlanejamento .content .box .botaoSave a{display: block; max-width: 100px; margin: 0 auto;  background: var(--green);padding: 0.5rem 1rem;color: var(--white);text-decoration: none;border-radius: 0.5rem;}
.gridPlanejamento .content .box .botaoSave a:hover{background: var(--dark)}

@media(max-width: 1200px){
  .gridPlanejamento .content .box .desc .dadosUser{grid-template-columns: 1fr}
}


@media(max-width: 500px){
  .gridPlanejamento{grid-template-columns: 1fr}
  .gridPlanejamento .content .box .botaoDelete img{width: 6rem; height: 6rem;}
  .gridPlanejamento .content .box .botaoDelete{right: 1rem;}
}
                `
                }
            </style>

        </MainLayout>
    )
}

export default MeuPerfil
