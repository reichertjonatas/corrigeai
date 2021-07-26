import React from 'react'
import Seo from '../../../components/layout/Seo'
import Link from 'next/link'
import { useForm } from "react-hook-form";
import { getCsrfToken, signIn } from 'next-auth/client'
import styles from './Registrar.module.css'
import Image from 'next/image'
import { LogoLogin } from '../../../components/icons'
import { useRouter } from 'next/dist/client/router';
import { API } from '../../../services/api';


interface DataProps {
    name: string;
    email: string;
    password: string;
}

function Registro({ csrfToken } : any) {
    const { register, handleSubmit } = useForm();
    const router = useRouter();

    const onSubmit = async (data : DataProps) => {
        
        const formEmail = data.email;
        const formPassword = data.password;

        console.log('formEmail', formEmail, 'formPassword', formPassword);

        if(data.name && formEmail && formPassword){
            await API
            .post('/auth/registro', data)
            .then(async ({ data, status }) => {
                if(status == 200 ){
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
        <div style={{background : "#72b01d", minHeight: "100vh", minWidth: "100vw",display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
            <Seo />

            <div className={styles["login"]}>
                <div className={styles["box"]}>
                    <div className={styles["logo"]}>
                        <Link href="/" passHref>
                            <Image src={LogoLogin} className={styles["img-responsive"]} alt="" />
                        </Link>
                    </div>

                    <span className={styles["titulo"]}>CADASTRE-SE</span>
    
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* <input name='csrfToken' type='hidden' defaultValue={csrfToken}/> */}
                        <span className={styles["name"]}>Nome</span>
                        <input {...register("name")} type="text" />
                        <span className={styles["name"]}>E-mail</span>
                        <input {...register("email")} type="text" />
                        <span className={styles["name"]}>Senha</span>
                        <input {...register("password")} type="password" />
                        <button type="submit">Registrar</button>
                    </form>
                    <span className={styles["esqueceu"]}>
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

export default Registro
