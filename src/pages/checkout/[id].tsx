import React from 'react'
import Image from 'next/image'
import { LogoLogin } from '../../components/icons'
import { Controller, useForm } from 'react-hook-form';
import { debugPrint } from '../../utils/debugPrint';
import InputMask from 'react-input-mask'
import { criarPlano } from '../../services/pagarme';
import moment from 'moment';
import { useEffect } from "react"
import { toast } from 'react-toastify';
import { API } from '../../services/api';
import { signIn } from 'next-auth/client';
import PreLoader from '../../components/PreLoader';
import { ICheckoutPlano, PLANOS } from '../../utils/helpers';
import { useRouter } from 'next/router';
import Strapi from 'strapi-sdk-js'
import { planoById } from '../../graphql/query';
import Seo from '../../components/layout/Seo';

const modoAssinatura = false;

const useScript = (url: any) => {
    useEffect(() => {
        const script = document.createElement("script")

        script.src = url
        script.async = true

        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)
        }
    }, [url])
}

export async function getServerSideProps(ctx: any) {
    const { id } = ctx.query;

    if(!id){
        return { 
            redirect: {
                permanent: false,
                destination: '/'
            }
        }
    }

    const strapiLocal = new Strapi({
        url: `${process.env.NEXT_PUBLIC_URL_API}`
    })
    const plano = await strapiLocal.graphql({ query: planoById(id) })

    return {
        props: {
            planoDados: plano
        }
    }
}

function CheckoutPage({ planoDados }: any) {
    const { control, register, handleSubmit, watch, formState: { errors } } = useForm();

    const [onPayment, setOnPayment] = React.useState(false);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isErrorPayment, setisErrorPayment] = React.useState(false);
    const router = useRouter();



    const onSubmit = (data: any) => {
        setTimeout(function () {
            setOnPayment(true);
        }, 800)
        openCheckout(data)
    }

    useScript("https://assets.pagar.me/checkout/1.1.0/checkout.js")

    const openCheckout = async (data: any) => {
        setTimeout(() => {
            setIsLoading(true);
        }, 800)

        // @ts-ignore
        let checkout = new PagarMeCheckout.Checkout({
            encryption_key: process.env.NEXT_PUBLIC_PAGARME_ENCRYPT_KEY,
            success: async (data: any) => {
                if (data) {
                    console.log("data ==> ", data)
                    if(modoAssinatura){
                        const response = await API.post('/pagamento/checkout/capturarPagamento', { modoAssinatura, planoIdDb: planoDados.id, ...data });
                        if (response.status === 200) {
                            if (response.data.data.status == "paid" && response.data.data.payment_method == 'credit_card') {
                                toast.success("Pagamento recebido com sucesso!")
                                router.replace('/painel/verificar-email')
                            } else if(response.data.data.status == 'waiting_payment') {
                                toast.info("Aguardando pagamento!")
                                router.replace(`/checkout/aguardando`)
                            } else if(response.data.data.status == 'nao_autorizada') {
                                toast.error("Pagamento rejeitado!")
                                router.replace(`/checkout/rejeitado`)
                            } else if(response.data.data.status == 'waiting_payment') {
                                toast.info("Aguardando pagamento!")
                                router.replace(`/checkout/aguardando`)
                            }
                        }
                    } else {
                        const response = await API.post('/pagamento/checkout/capturarPagamento', { 
                            modoAssinatura, 
                            planoIdDb: planoDados.id,
                            amount: planoDados.precoPagarme, 
                            ...data 
                        });
                        if (response.status == 200) {
                            //console.log(" ===> ", response.data.data)
                            if (response.data.data.status == "paid" || response.data.data.status == 'authorized') {
                                toast.success("Pagamento recebido com sucesso!")
                                router.replace('/painel/verificar-email')
                            } else if(response.data.data.status == 'processing') {
                                toast.info("Processando pagamento!")
                                router.replace(`/checkout/processando`)
                            } else if(response.data.data.status == 'waiting_payment') {
                                toast.info("Aguardando pagamento!")
                                router.replace(`/checkout/aguardando?boletoUrl=${encodeURI(response.data.data.boleto_url)}`)
                            } else if(response.data.data.status == 'nao_autorizada') {

                                toast.error("Pagamento rejeitado!")
                                router.replace(`/checkout/rejeitado`)
                            } else if(response.data.data.status == 'waiting_payment') {

                                toast.info("Aguardando pagamento!")
                                router.replace(`/checkout/aguardando`)
                            }
                        }
                    }
                } else {
                    setOnPayment(false);
                    setIsLoading(false)
                }
            },
            error: (err: any) => {
                alert(JSON.stringify(err));
                setOnPayment(false);
                setIsLoading(false)
            },
            close: () => {
                toast.error("Pagamento cancelado!");
                setOnPayment(false);
                setIsLoading(false)
            }
        });

        checkout.open({
            buttonText: "Checkout",
            amount: planoDados.precoPagarme,
            createToken: `false`,
            customerData: 'true',
            freeInstallments: 1,
            maxInstallments: planoDados.parcela_number,
            uiColor: "#72b01d",
            payment_methods: "credit_card, boleto",
            postbackUrl: `${process.env.NEXT_PUBLIC_URL}/api/pagamento/postback`,
            items: [
                {
                    id: planoDados.id,
                    title: planoDados.name,
                    unit_price: planoDados.precoPagarme,
                    quantity: 1,
                    tangible: false
                }
            ]
        });
    }

    const [plano, setPlano] = React.useState<ICheckoutPlano>({ loaded: false, data: null })

    React.useEffect(() => {
        setPlano({
            loaded: true, data: PLANOS(1395688)!
        });
        return () => {
            setPlano({ loaded: false, data: null })
        }
    }, [])

    if (!plano.loaded) return <h1></h1>
    const { data: planoAtual } = plano

    return (
        <div>
            <Seo title="Checkout" />
            <div className="checkout">
                <div className="box">
                    <span className="logo">
                        <Image src={LogoLogin} className="img-responsive" alt="" />
                    </span>
                    <h1>Checkout</h1>
                    {isLoading && <PreLoader />}
                    {isLoaded && <>
                        Aguardando pagamento do boleto!
                    </>}


                    <form onSubmit={handleSubmit(onSubmit)}>
                        {!onPayment && <div className="caixa">
                            <h2>Resumo da compra</h2>
                            <div className="head">
                                <div className="box_list">
                                    <span className="bold">{planoDados.name}</span>
                                    <span className="regular">{planoDados.textoMes} de acesso à Plataforma Corrige Aí</span>
                                </div>
                                <div className="box_list">
                                    <span className="bold">Total {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(planoDados.precoPagarme / 100)}</span>
                                    <span className="regular">Em até {planoDados.parcelamentoTexto} no cartão de crédito</span>
                                </div>
                            </div>
                            {/* <h2>Dados do Aluno</h2>
                        <span className="form">

                                <span className="grid">
                                    <span className="input">
                                        <label htmlFor="nome" className={`${(errors.nome) ? 'errorLabel' : ''}`}>Nome</label>
                                        <input type="text" {...register("nome", { required: true, maxLength: 255 })} className={`${(errors.nome) ? 'errorInput' : ''}`} />
                                    </span>
                                    <span className="input">
                                        <label htmlFor="sobrenome" className={`${(errors.sobrenome) ? 'errorLabel' : ''}`}>Sobrenome</label>
                                        <input type="text" {...register("sobrenome", { required: true, maxLength: 255 })} className={`${(errors.sobrenome) ? 'errorInput' : ''}`} />
                                    </span>
                                </span>

                                <br />

                                <label htmlFor="email" className={`${(errors.email) ? 'errorLabel' : ''}`}>E-mail</label>
                                <input type="email" {...register("email", { required: true, maxLength: 255, pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })} className={`${(errors.email) ? 'errorInput' : ''}`} /> */}

                            {/* <label htmlFor="cpf" className={`${(errors.cpf) ? 'errorLabel' : ''}`}>CPF</label>
                                <Controller
                                    name="cpf"
                                    control={control}
                                    defaultValue={false}
                                    rules={{ required: true, pattern: /^(\d{3}\.){2}\d{3}\-\d{2}$/ }}
                                    render={({ field: { onChange, value } }) => {
                                        return (
                                            <InputMask mask="999.999.999-99" value={value} onChange={onChange}>
                                                {(inputProps: any) => (
                                                    <input {...inputProps}

                                                        className={`${(errors.cpf) ? 'errorInput' : ''}`} />
                                                )}
                                            </InputMask>
                                        )
                                    }}
                                /> */}
                            {/* <span className="grid">
                                    <span className="input">
                                        <label htmlFor="telefone" className={`${(errors.telefone) ? 'errorLabel' : ''}`}>Telefone</label>
                                        <Controller
                                            name="telefone"
                                            control={control}
                                            defaultValue={false}
                                            rules={{ required: true }}
                                            render={({ field: { onChange, value } }) => {
                                                return (
                                                    <InputMask mask="\(\099\) 99999-9999" value={value} onChange={onChange}>
                                                        {(inputProps: any) => (
                                                            <input {...inputProps}

                                                                className={`${(errors.telefone) ? 'errorInput' : ''}`} />
                                                        )}
                                                    </InputMask>
                                                )
                                            }}
                                        />
                                        {/* <input type="tel" {...register("telefone", { required: true })} className={`${(errors.telefone) ? 'errorInput' : ''}`} /> *
                                    </span>
                                    <span className="input">
                                        <label htmlFor="nascimento" className={`${(errors.nascimento) ? 'errorLabel' : ''}`}>Data de Nascimento</label>
                                        <Controller
                                            name="nascimento"
                                            control={control}
                                            defaultValue={false}
                                            rules={{ required: true, pattern: /^(\d{2}\/){2}\d{4}$/ }}
                                            render={({ field: { onChange, value } }) => {
                                                return (
                                                    <InputMask mask="99/99/9999" value={value} onChange={onChange}>
                                                        {(inputProps: any) => (
                                                            <input {...inputProps}

                                                                className={`${(errors.nascimento) ? 'errorInput' : ''}`} />
                                                        )}
                                                    </InputMask>
                                                )
                                            }}
                                        />
                                        {/* <input type="text" {...register("nascimento", { required: true })} className={`${(errors.nascimento) ? 'errorInput' : ''}`} /> 
                                    </span>
                                </span> */}
                            {/* 
                        </span> */}
                        </div>}


                        {!onPayment && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                            <span className="check" style={{ maxWidth: '60%' }}>
                                <input type="checkbox" className="custom-control-input" {...register("termos", { required: true })} id="customCheck1" />
                                <label htmlFor="customCheck1" className={`custom-control-label ${(errors.termos) ? 'errorTerms' : ''}`}> Li e concordo com os <a rel="noreferrer" href="https://api.corrigeai.com/uploads/TERMOS_DE_USO_b85a523cbe.pdf" target="_blank">Termos de Uso</a> e <a rel="noreferrer" href="https://api.corrigeai.com/uploads/POLITICA_DE_PRIVACIDADE_7ff66367ba.pdf" target="_blank">Política de Privacidade</a>. </label>
                            </span>
                            <span className="botaofinalizar" style={{ maxWidth: '60%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }} >
                                <button type="submit" onClick={handleSubmit(onSubmit)} style={{ padding: 12 }}>Finalizar pagamento</button>
                            </span>
                        </div>}

                    </form>

                    {/* <div className="caixa">
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
                    </div> */}


                    {/* <div className="boleto hide_payment">
                        <span className="text">O boleto bancário poderá ser pago em qualquer banco, lotéricas ou conveniadas, até a data do seu vencimento.</span>
                        <div className="box_boleto">
                            Ao clicar em Realizar Pagamento você poderá baixar o PDF do boleto ou fazer sua impressão. O banco pode levar até 3 dias úteis para confirmar pagamentos realizados por boleto. Assim que o pagamento for confirmado, você receberá um e-mail e poderá acessar a Plataforma.
                        </div>
                    </div> */}
                </div>
            </div>
            <style jsx>
                {
                    `
                    body{background: #edeeee !important;}

                    .checkout{display: block; width: 100%; min-height: 100vh; align-items: center; justify-content: center; }
                    .checkout .box{display: block; width: 100%; max-width: 600px; margin: 0 auto;}
                    .checkout .box h1{display: block; width: 100%; font-size: 1.53rem; text-align: center; margin: 2rem 0; color: var(--dark)}
                    .checkout .box .logo{display: block; width: 100%; text-align: center; margin: 2rem 0;}
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
                    .botaofinalizar button{cursor: pointer; border:none;  display: flex;border-radius: 0.5rem; max-width: 200px; align-items: center; justify-content: center; height: 40px; background: var(--green); color: var(--white);}
                    .botaofinalizar button:hover{cursor: pointer; border:none; background: var(--dark)}

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
