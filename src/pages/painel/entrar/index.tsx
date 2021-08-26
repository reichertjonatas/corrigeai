import React, { useEffect } from 'react'
import Seo from '../../../components/layout/Seo'
import Link from 'next/link'
import { useForm } from "react-hook-form";
import { signIn } from 'next-auth/client'
import Image from 'next/image'
import { LogoLogin } from '../../../components/icons'
import PreLoader from '../../../components/PreLoader';
import Strapi from 'strapi-sdk-js';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';


interface DataProps {
    email: string;
    password: string;
}


function Entrar() {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const [isEmail, setIsEmail] = React.useState(false);
    const [recoverPass, setRecoverPass] = React.useState(false);
    
    const [isLoading, setIsLoading] = React.useState(false)
    const router = useRouter();
    const { error } = router.query;

    const onSubmit = async (data : DataProps) => {
        setIsLoading(true);
        if(isEmail){
            const strapi = new Strapi();
            await strapi.forgotPassword({
                email: data.email
            }).then((res:any) => {
                toast.info('E-mail de recuperação enviado!');
            }).catch((err:any) => {
                toast.warning('E-mail não encontrado.');
            });
            router.push('/painel/verificar-email');
        }else{
            await signIn('credentials', { 
                email: data.email, 
                password: data.password, 
                callbackUrl: `${process.env.NEXT_PUBLIC_URL_REDIRECT_POS_LOGIN}` 
            });
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if(error) toast.error(' Combinação inválida!');
    }, [error])

    return (
        <div style={{background : "#72b01d", minHeight: "100vh", minWidth: "100vw",display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
            <Seo />

            <div className="login">
                <div className="box">
                    <div className="logo">
                        <a>
                            <Image src={LogoLogin} className="img-responsive" alt="" />
                        </a>
                    </div>
    
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {isLoading && <><PreLoader /><br /><br /></> }
                        
                        { !isLoading && <>
                            <span className="name">E-mail</span>
                            <input {...register("email", { required: true })} type="text" className={`${(errors.email) ? 'errorInput' : ''}`} />
                            { errors.email && <p style={{ marginTop: -12, marginBottom: 12, color: "red" }}>E-mail necessário!</p> }

                            {!isEmail && <><span className="name">Senha</span>
                            <input {...register("password", { required: !isEmail })} type="password" className={`${( !isEmail && errors.password) ? 'errorInput' : ''}`} /></>}
                        </>}
                        
                        {!isEmail && <button type="submit" disabled={isLoading}>Entrar</button>}
                        {isEmail && <button type="submit" disabled={isLoading}>Recuperar senha</button>}
                    </form>
                    {!isEmail &&<span className="esqueceu">
                        <a style={{cursor: "pointer"}} onClick={() => {
                            setIsEmail(!isEmail)
                        }}>Esqueceu a senha?</a> 
                        <br />
                    </span>}
                    {isEmail && <span className="esqueceu">
                        <a style={{cursor: "pointer"}} onClick={() => {
                            setIsEmail(!isEmail)
                        }}>Entrar com e-mail e senha</a> 
                        <br />
                    </span>}
                </div>
            </div>
            <style jsx>
                { `
.login{display: flex; width: 100%; min-height: 100vh; align-items: center; justify-content: center; }
.login .box{display: block;width: 100%; max-width: 25.75rem; border-radius: 2rem; background: #e5e6e6; padding: 3rem; position: relative; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
.login .box .logo{display: block; width: 100%; text-align: center; margin: 0 0 3rem}
.login .box form{display: block; width: 100%; margin: 0 0 2.5rem;}
.login .box form span{display: block; width: 100%; font-weight: 400; font-size: 0.9375rem; color: var(--dark);}
.login .box form input{display: block; width: 100%; padding: 0 1rem;  outline: none; font-weight: 400; font-size: 0.9375rem; color: var(--dark); background: var(--white); border-radius: 0.7rem; border: none; min-height: 2rem; margin: 0 0 1.5rem}
.login .box form button{transition: all 0.5s ease; display: block; width: 100%; margin: 0 auto; max-width: 7.187rem; background: var(--dark); color: var(--gray20); border: none; height: 1.76rem; border-radius: 1.5rem; cursor: pointer; font-size: 0.75rem;}
.login .box form button:hover{background: var(--gray20); color: var(--dark); border: 1px solid var(--dark)}
.login .box .esqueceu{display: block; width: 100%; text-align: center;}
.login .box .esqueceu a{color: #808080; font-size: 0.8125rem;}

                `}
            </style>
        </div>
    )
}

export default Entrar
