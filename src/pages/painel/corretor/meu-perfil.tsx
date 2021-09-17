/* eslint-disable @next/next/no-img-element */
import moment from 'moment'
import { getSession } from 'next-auth/client'
import Image from 'next/image'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Popup from 'reactjs-popup'
import { IcPhoto } from '../../../components/icons'
import MainLayout from '../../../components/layout/MainLayout'
import Seo from '../../../components/layout/Seo'
import PreLoader from '../../../components/PreLoader'
import { useMeStore } from '../../../hooks/meStore'
import { capitalizeTxt } from '../../../utils/helpers'
import Strapi from 'strapi-sdk-js'

export async function getServerSideProps(ctx: any) {
    const session = await getSession(ctx);

    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: '/painel/entrar',
            }
        }
    }

    return {
        props: {
            session: session,
        }
    }
}


function MeuPerfil({ session }: any) {
    const user = useMeStore(state => state.user);
    const setMe = useMeStore(state => state.setMe);
    const [isLoading, setIsLoading] = useState(true)

    React.useEffect(() => {
        //console.log("useEffect ==>", isLoading)
        const initLoad = async () => {
            await setMe(session.jwt);
            setIsLoading(false);
            //console.log("useEffect ==> initLoad", isLoading)
        }
        initLoad();
    }, [setMe])

    if (isLoading || user === null)
        return <PreLoader />

    return (
        <MainLayout menuType={2} role="corretor">
            <Seo title="Editar perfil" />
            <div className="gridPlanejamento">
                <div className="content">
                    <div className="box">
                        <div className="botaoDelete">
                            <img src={user?.image ? `${process.env.NEXT_PUBLIC_URL_API}${user?.image}` : "/upload/perfil/no-foto.png"}  className="img-responsive" alt="" />
                        </div>
                        <h1>{capitalizeTxt(user!.name)}</h1>
                        <p>E-mail: {user!.email}</p>
                        <p>Data de Registro: {moment(user!.createdAt).format('DD/MM/YYYY')}</p>
                        <span className="desc">
                            <span className="dadosUser">
                                <span className="coluna">
                                    <h2>Dados do Usuário</h2>
                                    <span className="tabela">
                                        {/* <span className="row">
                                            <span className="funcao">Senha:</span>
                                            <span className="tipo">
                                                <input type="password" />
                                            </span>
                                        </span> */}

                                        <span className="row">
                                            <span className="funcao">&nbsp;</span>

                                            <Popup
                                                trigger={
                                                    <span className="tipo">
                                                        <a href="#">Alterar senha</a>
                                                    </span>}
                                                modal
                                                nested
                                            >
                                                {(close: any) => (
                                                    <div className="popPerfil popRedacao ">
                                                        <button className="close" onClick={close}>
                                                            &times;
                                                        </button>

                                                        <div className="header"> Alteração da senha </div>
                                                        <div className="content">
                                                            <p>
                                                                Ao clicar em continuar será enviado um e-mail com as instruções para alterar a senha!
                                                            </p>

                                                            <div className="buttons">

                                                                <button
                                                                    className="button continuar"
                                                                    onClick={async () => {
                                                                        const strapi = new Strapi({
                                                                            url: `${process.env.NEXT_PUBLIC_URL_API}`
                                                                        })
                                                                        await strapi.forgotPassword({ email: session.user.email })
                                                                            .then((response : any) => {
                                                                                //console.log("======> reset pass ", response)
                                                                                
                                                                                toast.dismiss()
                                                                                toast.info("E-mail enviado!")

                                                                                close()
                                                                            }).catch((error:any) => {
                                                                                //console.log(" =======> reset pass error", error)

                                                                                toast.dismiss()
                                                                                toast.error(error?.status === 400 ? 'Requisição mal formatada!' : 'Erro desconhecido!')

                                                                                close()
                                                                            })
                                                                    }}> CONTINUAR </button>

                                                                <button
                                                                    className="button cancelar"
                                                                    onClick={() => {
                                                                        close()
                                                                        toast.dismiss();
                                                                        toast.warning("Operação cancelada!")
                                                                    }}> CANCELAR </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Popup>
                                        </span>
                                    </span>
                                </span>

                                <span className="coluna">
                                    <h2>Informações do seu perfil</h2>
                                    <span className="tabela">
                                        <span className="row">
                                            <span className="funcao">Estado atual:</span>
                                            <span className="tipo">
                                                Corretor  - Turma {user!.corretor_type == "turma_um" ? 1 : 2}
                                            </span>
                                        </span>
                                    </span>
                                </span>
                            </span>
                            {/* <span className="botaoSave">
                                <a href="#">Salvar</a>
                            </span> */}
                        </span>
                    </div>
                </div>
            </div>

            <style jsx>
                {`


.popPerfil{
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 0!important;
}

.popup-content{
  padding: 0;
  border: none;
}

.popPerfil .close{
  position: absolute;
  right: -1.5rem;
  top: -1.5rem;
  border: none;
  background: #ffffff;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  font-size: 1.8rem;
  color: #000;
  text-align: center;
  line-height: 2.5rem;
  border: 1px solid #cccccc29;
  cursor: pointer;
}

.popPerfil .header{
  display: flex;
  width: 100%;
  justify-content: center;
  min-height: 4rem;
  background: var(--green);
  align-items: center;
  color: #fff;
  font-size: 1.5rem;
}

.popPerfil .content{
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  color: var(--gray40);
  font-size: 1.2rem;
  font-weight: 300;
  max-width: 600px;
  text-align: center;
  padding: 2rem 0;
}

.popPerfil .buttons{
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin: 2rem 0 0;
}

.popPerfil .buttons button{
  border: none;
  background: var(--gray30);
  font-size: 1rem;
  padding: 0.6rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.5s ease;
}

.popPerfil .buttons button:hover{
  transform: scale(0.9);
}

.continuar{
  background-color: var(--green)!important;
  color: #fff!important;
}

          .popRedacao{display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; padding: 1rem 0;}
          .popRedacao h1{display: block; width: 100%; text-align: center; color: #002400; font-weight: 700; font-size: 1.4rem; font-family: 'Poppins', sans-serif; margin-bottom: 1rem}
          .popRedacao .formulario{display: block;width: 100%;max-width: 480px;margin: 0 auto;padding: 2rem 1rem 1.5rem;border: 2px dashed #cccccc;text-align: center; border-radius: 0.5rem}
          .popRedacao .formulario form{display: block; width: 100%}
          .formulario input[type="text"]{display: block; width: 100%; margin: 0 0 1rem; padding: 0.8rem 0.5rem; border: 1px solid #cccccc; border-radius: 0.5rem; font-family: 'Poppins', sans-serif}
          .upload .custom-file-upload{border-radius: 0.5rem; margin: 0; color: #fff; background: #72b01d; transition: all 0.5s ease; font-family: 'Poppins', sans-serif; border: 1px solid #ccc;display: inline-block;padding: 6px 12px;cursor: pointer;}
          .upload .custom-file-upload:hover{background: #002400; }
          .popRedacao .botoes{display: flex; width: 100%; flex-direction: row; justify-content: center; margin: 2rem 0 0; gap: 1rem}
          
          .enviar {cursor: pointer; border:none; display: block; transition: all 0.5s ease;padding: 0.5rem 1rem; background: #002400; color: #fff; text-decoration: none; border-radius: 0.5rem; font-family: 'Poppins', sans-serif}
          .enviar :hover{background: #72b01d;}

          .popRedacao .botoes a.cancelar{background: transparent; color: #002400}
          .popRedacao .botoes a.cancelar:hover{color: #002400; background: transparent}

          input[type="file"] {
            position: absolute;
            opacity: 0;
            cursor: pointer;
          }
                    `}
            </style>
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
