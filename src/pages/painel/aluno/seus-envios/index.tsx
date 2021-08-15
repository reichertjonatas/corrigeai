import Link from 'next/link'
import React from 'react'
import MainLayout from '../../../../components/layout/MainLayout'
import Seo from '../../../../components/layout/Seo'
import Image from 'next/image'
import { calendar, set_ballon_right, set_ballon } from '../../../../components/icons'

function SeusEnvios() {
    return (
        <MainLayout>
            <Seo title="Seus envios" />

            <div className="container-envios">
                <h1>
                    <Image src={calendar} className="img-responsive" alt="" />
                    Seus envios
                </h1>

                <div className="lista">
                    <div className="head">
                        <div className="data">Data</div>
                        <div className="tema">Tema</div>
                        <div className="nota">Nota</div>
                    </div>

                    <div className="content">
                        <div className="list-item">
                            <div className="item">
                                <div className="data">05/05</div>
                                <div className="tema">Democratização do acesso ao cinema no Brasil</div>
                                <div className="nota">780</div>
                            </div>
                        </div>

                        <div className="list-item">

                            <div className="ballon-left">
                                <div className="conteudo-ballon">
                                    <span className="text">1 mês depois</span>
                                    <span className="icon">
                                        <Image src={set_ballon} className="img-responsive" alt="" />
                                        </span>
                                </div>
                            </div>

                            <div className="item">
                                <div className="data">05/05</div>
                                <div className="tema">Democratização do acesso ao cinema no Brasil</div>
                                <div className="nota">780</div>
                            </div>

                            <div className="ballon-right">
                                <div className="conteudo-ballon">
                                    <span className="text">Sua nota está igual.</span>
                                    <span className="icon">
                                        <Image src={set_ballon_right} className="img-responsive" alt="" />
                                    </span>
                                </div>
                            </div>

                        </div>

                        <div className="list-item">
                            <div className="item">
                                <div className="data">05/05</div>
                                <div className="tema">Democratização do acesso ao cinema no Brasil</div>
                                <div className="nota">780</div>
                            </div>
                        </div>

                        <div className="list-item">
                            <div className="item">
                                <div className="data">05/05</div>
                                <div className="tema">Democratização do acesso ao cinema no Brasil</div>
                                <div className="nota">780</div>
                            </div>
                        </div>

                        <div className="list-item">
                            <div className="item">
                                <div className="data">05/05</div>
                                <div className="tema">Democratização do acesso ao cinema no Brasil</div>
                                <div className="nota">780</div>
                            </div>
                        </div>

                        <div className="list-item">

                            <div className="ballon-left">
                                <div className="conteudo-ballon">
                                    <span className="text">1 mês depois</span>
                                    <span className="icon">
                                        <Image src={set_ballon} className="img-responsive" alt="" />
                                    </span>
                                </div>
                            </div>

                            <div className="item">
                                <div className="data">05/05</div>
                                <div className="tema">Democratização do acesso ao cinema no Brasil</div>
                                <div className="nota">780</div>
                            </div>

                            <div className="ballon-right">
                                <div className="conteudo-ballon">
                                    <span className="text">Atenção! Sua nota caiu.</span>
                                    <span className="icon">
                                        <Image src={set_ballon_right} className="img-responsive" alt="" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <div className="graphics-envios">
                <div className="box">
                    <span className="title">Sua última nota</span>
                    <span className="columns">
                        <span className="column">
                            <span className="height">
                                <span className="rate" style={{ minHeight: "30%" }}>&nbsp;</span>
                            </span>
                            <span className="number">500</span>
                        </span>
                        <span className="column">
                            <span className="height">
                                <span className="rate" style={{ minHeight: "80%" }}>&nbsp;</span>
                            </span>
                            <span className="number">800</span>
                        </span>
                        <span className="column">
                            <span className="height">
                                <span className="rate" style={{ minHeight: "65%" }}>&nbsp;</span>
                            </span>
                            <span className="number">650</span>
                        </span>
                        <span className="column">
                            <span className="height">
                                <span className="rate" style={{ minHeight: "10%" }}>&nbsp;</span>
                            </span>
                            <span className="number">280</span>
                        </span>
                        <span className="column">
                            <span className="height">
                                <span className="rate" style={{ minHeight: "80%" }}>&nbsp;</span>
                            </span>
                            <span className="number">820</span>
                        </span>
                        <span className="column">
                            <span className="height">
                                <span className="rate active" style={{ minHeight: "100%" }}>&nbsp;</span>
                            </span>
                            <span className="number active">1000</span>
                        </span>
                    </span>
                </div>

                <div className="box">
                    <span className="title">Sua média geral</span>
                    <span className="columns">
                        <span className="column">
                            <span className="height">
                                <span className="rate" style={{ minHeight: "50%" }}>&nbsp;</span>
                            </span>
                            <span className="number">500</span>
                        </span>
                        <span className="column">
                            <span className="height">
                                <span className="rate" style={{ minHeight: "80%" }}>&nbsp;</span>
                            </span>
                            <span className="number">800</span>
                        </span>
                        <span className="column">
                            <span className="height">
                                <span className="rate" style={{ minHeight: "65%" }}>&nbsp;</span>
                            </span>
                            <span className="number">650</span>
                        </span>
                        <span className="column">
                            <span className="height">
                                <span className="rate" style={{ minHeight: "28%" }}>&nbsp;</span>
                            </span>
                            <span className="number">280</span>
                        </span>
                        <span className="column">
                            <span className="height">
                                <span className="rate" style={{ minHeight: "82%" }}>&nbsp;</span>
                            </span>
                            <span className="number">820</span>
                        </span>
                        <span className="column">
                            <span className="height">
                                <span className="rate active" style={{ minHeight: "100%" }}>&nbsp;</span>
                            </span>
                            <span className="number active">1000</span>
                        </span>
                    </span>
                </div>

                <div className="box">
                    <span className="title">Média Corrige Aí</span>
                    <span className="columns">
                        <span className="column">
                            <span className="height">
                                <span className="rate" style={{ minHeight: "50%" }}>&nbsp;</span>
                            </span>
                            <span className="number">500</span>
                        </span>
                        <span className="column">
                            <span className="height">
                                <span className="rate" style={{ minHeight: "80%" }}>&nbsp;</span>
                            </span>
                            <span className="number">800</span>
                        </span>
                        <span className="column">
                            <span className="height">
                                <span className="rate" style={{ minHeight: "65%" }}>&nbsp;</span>
                            </span>
                            <span className="number">650</span>
                        </span>
                        <span className="column">
                            <span className="height">
                                <span className="rate" style={{ minHeight: "28%" }}>&nbsp;</span>
                            </span>
                            <span className="number">280</span>
                        </span>
                        <span className="column">
                            <span className="height">
                                <span className="rate" style={{ minHeight: "82%" }}>&nbsp;</span>
                            </span>
                            <span className="number">820</span>
                        </span>
                        <span className="column">
                            <span className="height">
                                <span className="rate active" style={{ minHeight: "100%" }}>&nbsp;</span>
                            </span>
                            <span className="number active">1000</span>
                        </span>
                    </span>
                </div>

                <div className="botao">
                    <Link href="/painel/aluno/desempenho" passHref><a>VEJA O SEU DESEMPENHO COMPLETO</a></Link>
                </div>
            </div>
            <style jsx>
                {
                    `
                    .container-envios{display: block; width: 100%; max-width: 50rem; margin: 0 auto}
.container-envios h1{display: flex; align-items: center;text-align: center; margin: 0 0 1.43rem; border-radius: 0.75rem;justify-content: center;width: 100%; font-family: 'Poppins', sans-serif; font-weight: 500; min-height: 4.875rem; font-size: 2.06em; background: var(--gray20); color: var(--dark);box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
.container-envios h1 img{position: relative;  margin: 0 0.5rem 0 0 }
.container-envios .lista{display: block; border-radius: 0.75rem; width: 100%; font-family: 'Poppins', sans-serif; padding: 1rem 1.43rem; background: var(--gray20); color: var(--dark);box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
.container-envios .lista .head{display: flex; width: 100%; font-size: 1.125rem; font-weight: 500; color: var(--dark); margin: 0 0 1rem}
.container-envios .lista .head .data{display: flex; justify-content: center; flex: 1}
.container-envios .lista .head .tema{display: flex; justify-content: center; flex: 7}
.container-envios .lista .head .nota{display: flex; justify-content: center; flex: 1}
.container-envios .lista .content{display: block; width: 100%;}
.container-envios .lista .content .list-item{display: block; width: 100%; position: relative;}
.container-envios .lista .content .list-item .ballon-left{position: absolute; left: -10.5rem; border-radius: 1rem;background: #f15924; color: var(--gray20); font-size: 0.9375rem; min-height: 2.625rem; display: flex; align-items: center; padding: 0 1.25rem;}
.container-envios .lista .content .list-item .ballon-left .conteudo-ballon{position: relative;width: 100%; text-align: center;}
.container-envios .lista .content .list-item .ballon-left .conteudo-ballon .text{position: relative; z-index: 2; background: #f15924}
.container-envios .lista .content .list-item .ballon-left .conteudo-ballon .icon{position: absolute; right: -3.4rem;}
.container-envios .lista .content .list-item .ballon-right{position: absolute; min-width: 13.5rem; right: -15.5rem; top: 0; border-radius: 1rem;background: #f15924; color: var(--gray20); font-size: 0.9375rem; min-height: 2.625rem; display: flex; align-items: center; padding: 0 1.25rem;}
.container-envios .lista .content .list-item .ballon-right .conteudo-ballon{position: relative;width: 100%; text-align: center;}
.container-envios .lista .content .list-item .ballon-right .conteudo-ballon .text{position: relative; z-index: 2; background: #f15924}
.container-envios .lista .content .list-item .ballon-right .conteudo-ballon .icon{position: absolute; left: -3.4rem;}
.container-envios .lista .content .list-item .item{display: flex; width: 100%; gap: 1rem; margin: 0 0 1rem}
.container-envios .lista .content .list-item .item .data{display: flex; justify-content: center; align-items: center; flex: 1;font-size: 1.125rem; font-weight: 500; color: var(--dark); background: var(--gray50); min-height: 2.4375rem;border-radius: 0.9rem;}
.container-envios .lista .content .list-item .item .tema{display: flex; justify-content: center; align-items: center; flex: 7;font-size: 1.125rem; font-weight: 500; color: var(--dark); background: var(--gray50); min-height: 2.4375rem;border-radius: 0.9rem;}
.container-envios .lista .content .list-item .item .nota{display: flex; justify-content: center; align-items: center; flex: 1;font-size: 1.125rem; font-weight: 500; color: var(--dark); background: var(--gray50); min-height: 2.4375rem;border-radius: 0.9rem;}


.graphics-envios{display: grid; grid-template-columns: repeat(4, 1fr); margin: 2.8rem 0 0; gap: 2rem}
.graphics-envios .box{display: block; min-height: 10.6874rem; width: 100%; border-radius: 0.75rem; background: var(--gray20); padding: 0.8125rem; position: relative; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
.graphics-envios .box .title{display: block; width: 100%; text-align: center; font-weight: 500; font-size: 1rem;}
.graphics-envios .box .columns{display: grid; grid-template-columns: repeat(6, 1fr); min-height: 7.5rem; overflow: hidden;}
.graphics-envios .box .column{display: block; width: 100%; text-align: center;}
.graphics-envios .box .column .height{display: block; width: 100%; height: 6.6875rem; overflow: hidden; margin: 0 0 0.3125rem; position: relative;}
.graphics-envios .box .column .height .rate{transition: all 0.5s ease; width: 1rem; background: var(--gray50); border-radius: 0.5rem; margin: 0 auto; position: absolute; bottom: 0; left: 50%; margin-left: -0.5rem;}
.graphics-envios .box .column:hover .height .rate{background: var(--green);}
.graphics-envios .box .column .height .active{background: var(--green); color: var(--green)}
.graphics-envios .box .column .number{transition: all 0.5s ease; display: block; width: 100%; font-weight: 500; font-size: 0.5475rem; color: #cbcccc}
.graphics-envios .box .column:hover .number{font-size: 0.6556rem; color: var(--green)}
.graphics-envios .box .column .active{font-size: 0.6556rem; color: var(--green)}
.graphics-envios .botao{display: flex; width: 100%; align-items: center;}
.graphics-envios .botao a{display: block; width: 100%; max-width: 19.125rem; font-size: 0.875rem; padding: 0.5rem 2rem; background: var(--green); border-radius: 2rem; color: var(--gray20); text-align: center;}
.graphics-envios .botao a:hover{background: #f15924}


@media(max-width: 1240px){
  .container-envios{max-width: 100%;}
  .container-envios .lista .content .list-item .ballon-left{display: none}
  .container-envios .lista .content .list-item .ballon-right{display: none}
}

@media(max-width: 1024px){
  .content-global{max-width: 650px}
}

@media(max-width: 991px){
  .content-global{max-width: 480px}
  .graphics-envios{grid-template-columns: repeat(2, 1fr)}
}

@media(max-width: 480px){
  .content-global{max-width: 100%; padding: 0 1rem}
}

                    `
                }
            </style>
        </MainLayout>
    )
}

export default SeusEnvios
