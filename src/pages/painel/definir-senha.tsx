import React, { useRef } from 'react'
import Image from 'next/image'
import { LogoLogin } from '../../components/icons'
import { useForm } from 'react-hook-form';
import Strapi from 'strapi-sdk-js'
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

function DefinirSenha() {
    const { control, register, handleSubmit, watch, formState: { errors } } = useForm();
    const senha = useRef({});
    const router = useRouter();
    const { code } = router.query;

    senha.current = watch("senha", "");

    const onSubmit = async (data: any) => {
        console.log(code)
        const strapi = new Strapi({
            url: `${process.env.NEXT_PUBLIC_URL_API}`
        });
        const novoPassword = await strapi.resetPassword({
            code: code as string,
            password: data.senha, 
            passwordConfirmation: data.confirmSenha
        }).then((response) => {
            router.replace('/painel/entrar')
            toast.success('Senha definida com sucesso!');
        }).catch((err) => {
            toast.error('Código inválido! Alteração não efetuada!');
        })

        //console.log(" ====> " , novoPassword)
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw' }}>

            <div className="checkout">
                <div className="box">
                    <span className="logo">
                        <Image src={LogoLogin} className="img-responsive" alt="CorrigeAi" />
                    </span>
                    <h1>Definir senha</h1>
                    <div className="caixa" style={{ textAlign: 'center' }}>
                        <p>Para definir uma nova senha, continue </p><br /><br />

                        <span className="form">
                            <span className="grid" style={{ margin:"0  auto", display:"flex", flexDirection: "column", maxWidth: '70%', justifyContent: 'center', alignContent: 'center'}}>
                                
                                <span className="input">
                                    <label htmlFor="nome" className={`${(errors.senha) ? 'errorLabel' : ''}`}>Digite a nova senha:</label>
                                    <input type="password" {...register("senha", { required: true, minLength: {value: 8, message: 'A senha deve possuir no minínmo 8 caracteres.'},  })}  className={`${(errors.senha) ? 'errorInput' : ''}`} />
                                    {errors.senha && <span className="errorLabel" style={{ fontSize: '10px', fontWeight: 300 }}>{errors.senha.message}</span>}
                                </span>

                                <span className="input">
                                    <label htmlFor="sobrenome" className={`${(errors.confirmSenha) ? 'errorLabel' : ''}`}>Confirme sua nova senha:</label>
                                    <input type="password" {...register("confirmSenha", {  validate: value  => value === senha.current || "Senhas não são iguais." })}  className={`${(errors.confirmSenha) ? 'errorInput' : ''}`} />

                                    {errors.confirmSenha && <span className="errorLabel" style={{ fontSize: '10px', fontWeight: 300 }}>{errors.confirmSenha.message}</span>}
                                </span>
                            </span>
                        </span>
                        <br />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        <span className="botaofinalizar" style={{ maxWidth: '60%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }} >
                            <button type="submit" onClick={handleSubmit(onSubmit)} style={{ padding: 12 }}>Atualizar senha</button>
                        </span>
                    </div>

                </div>
            </div>
            <style jsx>
                {
                    `
                    body{background: #edeeee !important;}

                    .checkout{display: block; width: 100%; min-height: 100vh; align-items: center; justify-content: center; }
                    .checkout .box{display: block; width: 100%; max-width: 600px; margin: 0 auto;}
                    .checkout .box h1{display: block; width: 100%; font-size: 1.53rem; text-align: center; margin: 2rem 0; color: var(--dark)}
                    .checkout .box .logo{display: block; width: 100%; text-align: center; margin: 2rem 0}
                    .checkout .box .caixa{display: block; width: 100%; background: #fff; padding: 2rem; border-radius: 1rem; box-shadow: 0px 0px 15px 0px rgb(0 0 0 / 15%); margin: 0 0 2rem}
                    .checkout .box .caixa h2:first-child{display: block; width: 100%; font-size: 1.3rem; margin: 0 0 1.5rem}
                    .checkout .box .caixa h2{display: block; width: 100%; font-size: 1.3rem; margin: 1.5rem 0; color: var(--dark)}
                    .checkout .box .caixa .head{display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem}
                    .checkout .box .caixa .head .box_list{display: flex; flex-direction: column}
                    .checkout .box .caixa .head .box_list .bold{display: block; width: 100%; font-weight: 500; color: var(--dark); font-size: 1.2rem; margin: 0 0 0.5rem}
                    .checkout .box .caixa .head .box_list .regular{display: block; width: 100%; font-weight: 400; color: #929292; font-size: 0.9rem}
                    .checkout .box .caixa .form{display: block; width: 100%;}
                    .checkout .box .caixa .form .grid{display: grid; grid-template-columns: 1fr; gap: 1rem}
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
                    background: var(--green);
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
                    border-color: var(--green);
                    background: var(--green);
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

export default DefinirSenha
