import React from 'react'
import Image from 'next/image'
import { LogoLogin } from '../../components/icons'


function CheckoutPage() {
    return (
        <div>
            <div className="checkout">
                <div className="box">
                    <h1>Checkout</h1>
                    <span className="logo">
                        <Image src={LogoLogin} className="img-responsive" alt="" />
                    </span>
                    <div className="caixa">
                        <h2>Resumo da compra</h2>
                        <div className="head">
                            <div className="box_list">
                                <span className="bold">Acesso Semestral</span>
                                <span className="regular">6 meses de acesso à Plataforma Corrige Aí</span>
                            </div>
                            <div className="box_list">
                                <span className="bold">Total R$ 227,40</span>
                                <span className="regular">Em até 6x no cartão de crédito</span>
                            </div>
                        </div>
                        <h2>Dados do Aluno</h2>
                        <span className="form">
                            <form action="#">
                                <span className="grid">
                                    <span className="input">
                                        <label htmlFor={"nome"}>Nome</label>
                                        <input type="text" />
                                    </span>
                                    <span className="input">
                                        <label htmlFor="sobrenome">Sobrenome</label>
                                        <input type="text" />
                                    </span>
                                </span>
                                <label htmlFor="email">E-mail</label>
                                <input type="email" />

                                <label htmlFor="password">Senha</label>
                                <input type="password" />

                                <label htmlFor="cpf">CPF</label>
                                <input type="text" />

                                <span className="grid">
                                    <span className="input">
                                        <label htmlFor="telefone">Telefone</label>
                                        <input type="tel" />
                                    </span>
                                    <span className="input">
                                        <label htmlFor="nascimento">Data de Nascimento</label>
                                        <input type="text" />
                                    </span>
                                </span>
                            </form>
                        </span>
                    </div>

                    <div className="caixa">
                        <h2>Forma de Pagamento</h2>

                        <div className="wrapper">
                            <input type="radio" name="select" id="option-1" />
                            <input type="radio" name="select" id="option-2" />
                            <label htmlFor="option-1" className="option option-1">
                                <div className="dot"></div>
                                <span>Cartão de Crédito</span>
                            </label>
                            <label htmlFor="option-2" className="option option-2">
                                <div className="dot"></div>
                                <span>Boleto Bancário</span>
                            </label>
                        </div>
                        <span className="cartao">
                            <span className="form">
                                <form action="#">
                                    <label htmlFor="cartao">Número do Cartão</label>
                                    <input type="text" />
                                    <span className="grid">
                                        <span className="input">
                                            <label htmlFor="vencimento">Vencimento</label>
                                            <input type="text" />
                                        </span>
                                        <span className="input">
                                            <label htmlFor="seguranca">Código de Segurança</label>
                                            <input type="text" />
                                        </span>
                                    </span>
                                    <span className="input">
                                        <label htmlFor="parcelamento">Parcelamento</label>
                                        <select name="" id="">
                                            <option value="">Selecione</option>
                                            <option value="">1x de R$ 227,40</option>
                                            <option value="">2x de R$ 113,70</option>
                                            <option value="">3x de R$ 75,80</option>
                                            <option value="">4x de R$ 56,85</option>
                                            <option value="">6x de R$ 37,90</option>
                                        </select>
                                    </span>

                                </form>
                            </span>

                            <h2>Dados do Titular</h2>
                            <span className="form">
                                <span className="input">
                                    <label htmlFor="nome">Nome Completo</label>
                                    <input type="text" />
                                </span>
                                <span className="input">
                                    <label htmlFor="cpf">CPF</label>
                                    <input type="text" />
                                </span>
                                <span className="grid">
                                    <span className="input">
                                        <label htmlFor="telefone">Telefone</label>
                                        <input type="tel" />
                                    </span>
                                    <span className="input">
                                        <label htmlFor="nascimento">Data de Nascimento</label>
                                        <input type="text" />
                                    </span>
                                </span>
                            </span>

                            <h2>Endereço de Cobrança</h2>
                            <span className="form">
                                <span className="grid">
                                    <span className="input">
                                        <label htmlFor="cep">CEP</label>
                                        <input type="text" />
                                    </span>

                                </span>
                                <span className="grid">
                                    <span className="input">
                                        <label htmlFor="logradouro">Logradouro</label>
                                        <input type="text" />
                                    </span>
                                    <span className="input">
                                        <label htmlFor="cep">Número</label>
                                        <input type="text" />
                                    </span>
                                    <span className="input">
                                        <label htmlFor="complemento">Complemento</label>
                                        <input type="text" />
                                    </span>
                                    <span className="input">
                                        <label htmlFor="bairro">Bairro</label>
                                        <input type="text" />
                                    </span>
                                    <span className="input">
                                        <label htmlFor="cidade">Cidade</label>
                                        <input type="text" />
                                    </span>
                                    <span className="input">
                                        <label htmlFor="estado">Estado</label>
                                        <select name="" id="">
                                            <option value="">Selecione</option>
                                            <option value="">Acre</option>
                                            <option value="">Alagoas</option>
                                            <option value="">Goiás</option>
                                        </select>
                                    </span>
                                </span>
                            </span>
                        </span>
                    </div>


                    <div className="boleto hide_payment">
                        <span className="text">O boleto bancário poderá ser pago em qualquer banco, lotéricas ou conveniadas, até a data do seu vencimento.</span>
                        <div className="box_boleto">
                            Ao clicar em Realizar Pagamento você poderá baixar o PDF do boleto ou fazer sua impressão. O banco pode levar até 3 dias úteis para confirmar pagamentos realizados por boleto. Assim que o pagamento for confirmado, você receberá um e-mail e poderá acessar a Plataforma.
                        </div>
                    </div>
                </div>


                <span className="check">
                    <input type="checkbox" className="custom-control-input" name="terms" id="customCheck1" />
                    <label className="custom-control-label" htmlFor="customCheck1"> Li e concordo com os Termos de Uso. </label>
                </span>
                <span className="botaofinalizar">
                    <a href="#">Finalizar pagamento</a>
                </span>
            </div>
            <style jsx>
                {
                    `
                    body{background: #edeeee !important;}

                    .checkout{display: flex; width: 100%; min-height: 100vh; align-items: center; justify-content: center; }
                    .checkout .box{display: block; width: 100%; max-width: 600px; margin: 0 auto;}
                    .checkout .box h1{display: block; width: 100%; font-size: 1.53rem; text-align: center; margin: 2rem 0; color: var(--dark)}
                    .checkout .box .logo{display: block; width: 100%; text-align: center; margin: 0 0 2rem}
                    .checkout .box .caixa{display: block; width: 100%; background: #fff; padding: 2rem; border-radius: 1rem; box-shadow: 0px 0px 15px 0px rgb(0 0 0 / 15%); margin: 0 0 2rem}
                    .checkout .box .caixa h2:first-child{display: block; width: 100%; font-size: 1.3rem; margin: 0 0 1.5rem}
                    .checkout .box .caixa h2{display: block; width: 100%; font-size: 1.3rem; margin: 1.5rem 0; color: var(--dark)}
                    .checkout .box .caixa .head{display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem}
                    .checkout .box .caixa .head .box_list{display: flex; flex-direction: column}
                    .checkout .box .caixa .head .box_list .bold{display: block; width: 100%; font-weight: 500; color: var(--dark); font-size: 1.2rem; margin: 0 0 0.5rem}
                    .checkout .box .caixa .head .box_list .regular{display: block; width: 100%; font-weight: 400; color: #929292; font-size: 0.9rem}
                    .checkout .box .caixa .form{display: block; width: 100%;}
                    .checkout .box .caixa .form .grid{display: grid; grid-template-columns: 1fr 1fr; gap: 1rem}
                    .checkout .box .caixa .form .grid .input{display: flex; flex-direction: column; width: 100%}
                    .checkout .box .caixa .form .grid .input input{margin: 0}
                    .checkout .box .caixa .form label{display: block; width: 100%; color: #495057}
                    .checkout .box .caixa .form input{display: block; width: 100%; border: 1px solid #ced4da; padding: .575rem .75rem; border-radius: 0.3rem; font-size: 0.9rem; color: var(--dark); margin: 0 0 1rem}
                    .checkout .box .caixa .form select{display: block; width: 100%; -webkit-appearance:none; border: 1px solid #ced4da; padding: .575rem .75rem; border-radius: 0.3rem; font-size: 0.9rem; color: var(--dark); margin: 0 0 1rem}

                    .hide_payment{display: none}

                    .botaofinalizar{display: block; width: 100%; margin: 0 0 4rem;}
                    .botaofinalizar a{display: flex;border-radius: 0.5rem; max-width: 200px; align-items: center; justify-content: center; height: 40px; background: var(--green); color: var(--white);}
                    .botaofinalizar a:hover{background: var(--dark)}

                    .check{display: block; width: 100%; margin: 1rem 0}

                    .wrapper{
                    display: inline-flex;
                    height: 100px;
                    width: 100%;
                    align-items: center;
                    justify-content: space-evenly;
                    border-radius: 5px;
                    }
                    .wrapper .option{
                    background: #fff;
                    height: 4rem;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-evenly;
                    margin: 0 1rem 0 0;
                    border-radius: 5px;
                    cursor: pointer;
                    padding: 0 10px;
                    border: 2px solid lightgrey;
                    transition: all 0.3s ease;
                    }
                    .wrapper .option:last-child{
                    margin: 0
                    }
                    .wrapper .option .dot{
                    height: 20px;
                    width: 20px;
                    background: #d9d9d9;
                    border-radius: 50%;
                    position: relative;
                    }
                    .wrapper .option .dot::before{
                    position: absolute;
                    content: "";
                    top: 4px;
                    left: 4px;
                    width: 12px;
                    height: 12px;
                    background: var(--green);;
                    border-radius: 50%;
                    opacity: 0;
                    transform: scale(1.5);
                    transition: all 0.3s ease;
                    }
                    input[type="radio"]{
                    display: none;
                    }
                    #option-1:checked:checked ~ .option-1,
                    #option-2:checked:checked ~ .option-2{
                    border-color: var(--green);;
                    background: var(--green);;
                    }
                    #option-1:checked:checked ~ .option-1 .dot,
                    #option-2:checked:checked ~ .option-2 .dot{
                    background: #fff;
                    }
                    #option-1:checked:checked ~ .option-1 .dot::before,
                    #option-2:checked:checked ~ .option-2 .dot::before{
                    opacity: 1;
                    transform: scale(1);
                    }
                    .wrapper .option span{
                    font-size: 1rem;
                    color: #808080;
                    }
                    #option-1:checked:checked ~ .option-1 span,
                    #option-2:checked:checked ~ .option-2 span{
                    color: #fff;
                    }
                    `
                }
            </style>
        </div>
    )
}

export default CheckoutPage
