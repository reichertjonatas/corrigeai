import React from 'react'
import Seo from '../../../components/layout/Seo'
import Link from 'next/link'
import { useForm } from "react-hook-form";
import { getCsrfToken, signIn } from 'next-auth/client'
import styles from './Entrar.module.css'
import Image from 'next/image'
import { LogoLogin } from '../../../components/icons'


interface DataProps {
    email: string;
    password: string;
}


function Entrar({ csrfToken} : any) {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data : DataProps) => {
        signIn('credentials', { 
            email: data.email, 
            password: data.password, 
            callbackUrl: `${process.env.NEXT_PUBLIC_URL_REDIRECT_POS_LOGIN}` 
        });
    };

    return (
        <div style={{background : "#72b01d", minHeight: "100vh", minWidth: "100vw",display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
            <Seo />

            <div className={styles["login"]}>
                <div className={styles["box"]}>
                    <div className={styles["logo"]}>
                        <a>
                            <Image src={LogoLogin} className={styles["img-responsive"]} alt="" />
                        </a>
                    </div>
    
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input name='csrfToken' type='hidden' defaultValue={csrfToken}/>
                        <span className={styles["name"]}>E-mail</span>
                        <input {...register("email")} type="text" />
                        <span className={styles["name"]}>Senha</span>
                        <input {...register("password")} type="password" />
                        <button type="submit">Entrar</button>
                    </form>
                    <span className={styles["esqueceu"]}>
                        <Link href="/painel/registrar">Registrar</Link> 
                        <br />
                        <Link href="/painel/registrar">Esqueci minha senha</Link>
                    </span>
                </div>
            </div>
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


export default Entrar
