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

function CheckoutPage() {
    const { control, register, handleSubmit, watch, formState: { errors } } = useForm();

    const [onPayment, setOnPayment] = React.useState(false);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

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

        const dataFake = {
            object: 'subscription',
            plan: null,
            id: 749132,
            amount: 8000,
            current_transaction: {
                object: 'transaction',
                status: 'paid',
                refuse_reason: null,
                status_reason: 'acquirer',
                acquirer_response_code: '0000',
                acquirer_name: 'pagarme',
                acquirer_id: '610986d550e10d0011dd70a0',
                authorization_code: '16394',
                soft_descriptor: null,
                tid: 13807365,
                nsu: 13807365,
                date_created: '2021-08-23T11:53:38.621Z',
                date_updated: '2021-08-23T11:53:39.017Z',
                amount: 8000,
                authorized_amount: 8000,
                paid_amount: 8000,
                refunded_amount: 0,
                installments: 1,
                id: 13807365,
                cost: 114,
                card_holder_name: 'kellvem barbosa',
                card_last_digits: '6490',
                card_first_digits: '538333',
                card_brand: 'mastercard',
                card_pin_mode: null,
                card_magstripe_fallback: false,
                cvm_pin: false,
                postback_url: null,
                payment_method: 'credit_card',
                capture_method: 'ecommerce',
                antifraud_score: null,
                boleto_url: null,
                boleto_barcode: null,
                boleto_expiration_date: null,
                referer: 'api_key',
                ip: '82.155.64.84',
                subscription_id: 749132,
                metadata: {},
                antifraud_metadata: {},
                reference_key: null,
                device: null,
                local_transaction_id: null,
                local_time: null,
                fraud_covered: false,
                fraud_reimbursed: null,
                order_id: null,
                risk_level: 'very_low',
                receipt_url: null,
                payment: null,
                addition: null,
                discount: null,
                private_label: null,
                pix_qr_code: null,
                pix_expiration_date: null
            },
            postback_url: null,
            payment_method: 'credit_card',
            card_brand: 'mastercard',
            card_last_digits: '6490',
            current_period_start: '2021-08-23T11:53:38.580Z',
            current_period_end: null,
            charges: 0,
            soft_descriptor: null,
            status: 'paid',
            date_created: '2021-08-23T11:53:39.008Z',
            date_updated: '2021-08-23T11:53:39.008Z',
            phone: {
                object: 'phone',
                ddi: '55',
                ddd: '62',
                number: '983114142',
                id: 1256631
            },
            address: {
                object: 'address',
                street: 'Rua Georgina George Borges de Melo',
                complementary: '',
                street_number: '12',
                neighborhood: 'Conjunto Habitacional Madre Germana II',
                city: 'Goiânia',
                state: 'GO',
                zipcode: '74354806',
                country: 'Brasil',
                id: 5619737
            },
            customer: {
                object: 'customer',
                id: 6717628,
                external_id: null,
                type: null,
                country: null,
                document_number: '03288449188',
                document_type: 'cpf',
                name: 'Kellvem',
                email: 'kellvembarbosa@icloud.com',
                phone_numbers: null,
                born_at: null,
                birthday: null,
                gender: null,
                date_created: '2021-08-23T11:53:38.544Z',
                documents: []
            },
            card: {
                object: 'card',
                id: 'card_cksokzdpv0ags0o9tiqwzodx4',
                date_created: '2021-08-23T11:53:38.611Z',
                date_updated: '2021-08-23T11:53:39.000Z',
                brand: 'mastercard',
                holder_name: 'kellvem barbosa',
                first_digits: '538333',
                last_digits: '6490',
                country: 'UNITED STATES',
                fingerprint: 'cksokzd8w99z40j82z3jlutah',
                valid: true,
                expiration_date: '0224'
            },
            metadata: null,
            fine: {},
            interest: {},
            settled_charges: null,
            manage_token: 'test_subscription_9xWQR9EG6qPhztAxSvjuYxPU2IjLFT',
            manage_url: 'https://pagar.me/customers/#/subscriptions/749132?token=test_subscription_9xWQR9EG6qPhztAxSvjuYxPU2IjLFT'
        };

        const response = await API.post('/pagamento/checkout/capturarPagamento', dataFake);

        try {

            if (response.status === 200) {
                // debugPrint(' =====> ', response.data.data)
                if (response.data.data.status == "paid" && response.data.data.payment_method == 'credit_card') {
                    // signIn('email', { 
                    //     email: response.data.data.email, 
                    //     callbackUrl: `${process.env.NEXT_PUBLIC_URL_REDIRECT_POS_LOGIN}`  
                    // })
                    toast.success("Pagamento recebido com sucesso!")
                    setOnPayment(false);
                } else {
                    setIsLoaded(true)
                    setIsLoading(false)
                }
            }

        } catch (error) {
            setIsLoaded(true)
            setIsLoading(false)
            setOnPayment(false);
        }
        return;

        // @ts-ignore
        let checkout = new PagarMeCheckout.Checkout({
            encryption_key: "ek_test_t8JoT1B5Sc43OG8ztftTpf4P0QfJOX",
            success: async (data: any) => {
                if (data) {
                    const response = await API.post('/pagamento/checkout/capturarPagamento', data);
                    if (response.status === 200) {
                        debugPrint(' =====> ', response.data.data)
                        if (response.data.data.status == "paid" && response.data.data.payment_method == 'credit_card') {
                            // signIn('email', { 
                            //     email: response.data.data.email, 
                            //     callbackUrl: `${process.env.NEXT_PUBLIC_URL_REDIRECT_POS_LOGIN}`  
                            // })
                            toast.success("Pagamento recebido com sucesso!")
                        } else {
                            setIsLoaded(true)
                            setIsLoading(false)
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
            amount: 8000,
            createToken: 'false',
            customerData: 'true',
            maxInstallments: planoAtual!.parcela_number,
            uiColor: "#72b01d",
            payment_methods: "credit_card, boleto",
            items: [
                {
                    id: '1',
                    title: 'Bola de futebol',
                    unit_price: 12000,
                    quantity: 1,
                    tangible: true
                },
                {
                    id: 'a123',
                    title: 'Caderno do Goku',
                    unit_price: 3200,
                    quantity: 3,
                    tangible: true
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
            <div className="checkout">
                <div className="box">
                    <h1>Checkout</h1>
                    <span className="logo">
                        <Image src={LogoLogin} className="img-responsive" alt="" />
                    </span>
                    {isLoading && <PreLoader />}
                    {isLoaded && <>
                        Aguardando pagamento do boleto!
                    </>}


                    <form onSubmit={handleSubmit(onSubmit)}>
                        {!onPayment && <div className="caixa">
                            <h2>Resumo da compra</h2>
                            <div className="head">
                                <div className="box_list">
                                    <span className="bold">{planoAtual!.plano}</span>
                                    <span className="regular">{planoAtual!.meses} de acesso à Plataforma Corrige Aí</span>
                                </div>
                                <div className="box_list">
                                    <span className="bold">Total {planoAtual!.total}</span>
                                    <span className="regular">Em até {planoAtual!.parcelamento} no cartão de crédito</span>
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
                                <label htmlFor="customCheck1" className={`custom-control-label ${(errors.termos) ? 'errorTerms' : ''}`}> Li e concordo com os Termos de Uso. </label>
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
