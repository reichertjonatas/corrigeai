import React from 'react'
import Seo from '../../../components/layout/Seo'
import Link from 'next/link'
import { useForm } from "react-hook-form";
import { getCsrfToken, signIn } from 'next-auth/client'
import Image from 'next/image'
import { LogoLogin } from '../../../components/icons'
import { useRouter } from 'next/dist/client/router';
import { API } from '../../../services/api';


interface DataProps {
    name: string;
    email: string;
    password: string;
}

function Registro({ csrfToken }: any) {
    const { register, handleSubmit } = useForm();
    const router = useRouter();

    const onSubmit = async (data: DataProps) => {

        const formEmail = data.email;
        const formPassword = data.password;

        //console.log('formEmail', formEmail, 'formPassword', formPassword);

        if (data.name && formEmail && formPassword) {
            await API
                .post('/auth/registro', data)
                .then(async ({ data, status }) => {
                    if (status == 200) {
                        signIn('credentials', {
                            email: formEmail,
                            password: formPassword,
                            callbackUrl: `${process.env.NEXT_PUBLIC_URL_REDIRECT_POS_LOGIN}`
                        });
                    }
                })
        }
    };

    return (
        <div style={{ background: "#72b01d", minHeight: "100vh", minWidth: "100vw", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <Seo />

            <div className="login">
                <div className="box">
                    <div className="logo">
                        <Link href="/" passHref>
                            <Image src={LogoLogin} className="img-responsive" alt="" />
                        </Link>
                    </div>

                    <span className="titulo">CADASTRE-SE</span>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* <input name='csrfToken' type='hidden' defaultValue={csrfToken}/> */}
                        <span className="name">Nome</span>
                        <input {...register("name")} type="text" />
                        <span className="name">E-mail</span>
                        <input {...register("email")} type="text" />
                        <span className="name">Senha</span>
                        <input {...register("password")} type="password" />
                        <button type="submit">Registrar</button>
                    </form>
                    <span className="esqueceu">
                        <Link href="/painel/registrar">Esqueci minha senha</Link>
                    </span>
                </div>
            </div>
            <style jsx>
                {
                    `
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

                `
                }
            </style>
        </div>
    )
}


export async function getServerSideProps(context: any) {
    return {
        props: {
            csrfToken: await getCsrfToken(context)
        }
    }
}

export default Registro
