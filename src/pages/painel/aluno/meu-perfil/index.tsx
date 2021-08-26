/* eslint-disable @next/next/no-img-element */
import moment from 'moment'
import { getSession } from 'next-auth/client'
import Image from 'next/image'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Popup } from 'reactjs-popup'
import Strapi from 'strapi-sdk-js'
import { IcPhoto } from '../../../../components/icons'
import MainLayout from '../../../../components/layout/MainLayout'
import Seo from '../../../../components/layout/Seo'
import PreLoader from '../../../../components/PreLoader'
import { queryTransacoes } from '../../../../graphql/query'
import { useMeStore } from '../../../../hooks/meStore'
import { strapi } from '../../../../services/strapi'
import { capitalizeTxt, PLANOS } from '../../../../utils/helpers'


export async function getServerSideProps(ctx: any) {
    const session: any = await getSession(ctx);

    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: '/painel/entrar',
            }
        }
    }
    console.log(session)
    const plano: any = await strapi(session.jwt).findOne('planos', session?.subscription?.plano);
    const { transacaos } = await strapi(session.jwt).graphql({ query: queryTransacoes(session?.subscription?.id) });
    return {
        props: {
            session: session,
            plano,
            transacaos
        }
    }
}


function MeuPerfil({ session, plano, transacaos }: any) {
    const user = useMeStore(state => state.user);
    const setMe = useMeStore(state => state.setMe);
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingUpload, setIsLoadingUpload] = useState(false)

    React.useEffect(() => {
        console.log("useEffect ==>", isLoading)
        const initLoad = async () => {
            await setMe(session.jwt);
            setIsLoading(false);
            console.log("useEffect ==> initLoad", isLoading)
        }
        initLoad();
    }, [setMe])

    if (isLoading || user === null)
        return <PreLoader />


    const uploadImage = async (e:any) => {
        setIsLoadingUpload(true)
        e.preventDefault();

        if(e.target.files[0] == undefined || e.target.files[0] === null){
            toast.warning('Selecione um arquivo!')
            return;
        }
        
        const formData = new FormData()
        const data:any = {};

        data['ref'] = 'user'
        data['source'] = 'users-permissions'
        data['refId'] = session.id
        data['field'] = 'foto'

        formData.append('data', JSON.stringify(data))
        formData.append('files', e.target.files[0])
        formData.append('ref', 'user')
        formData.append('source', 'users-permissions')
        formData.append('refId', session.id)
        formData.append('field', 'foto')

        try {
            await strapi(session.jwt).create('upload', formData).then(async(res:any) => {
                setMe(session.jwt);
                toast.success('Foto atualizada com sucesso!')
            }).catch((err) => {
                throw new Error("Imagem não pode ser atualizada!");
            })
        } catch (error) {
            toast.warning('Imagem não pode ser atualizada!');
        }
        setTimeout(() => {
            setIsLoadingUpload(false);
        }, 500)
    }

    return (
        <MainLayout>
            <Seo title="Editar perfil" />
            <div className="gridPlanejamento">
                <div className="content">
                    <div className="box">
                        <div className="botaoDelete profile-pic">

                            <label className="-label" htmlFor="file">
                                <span className="glyphicon glyphicon-camera"></span>
                                <span>Atualizar foto</span>
                            </label>
                            {isLoadingUpload && <div style={{position: 'absolute', zIndex: 100, backgroundColor: 'var(--green)', width: '165px', height: '165px', borderRadius: 120,}}>
                                <PreLoader />
                            </div>}
                            <input id="file" type="file" onChange={(e:any ) => {
                                uploadImage(e)
                            }}/>

                            {!isLoadingUpload && <img src={user?.image ? `${process.env.NEXT_PUBLIC_URL_API}${user?.image}` : "/upload/perfil/no-foto.png"} className="imgAvatar" id="output" width="200" alt="" />}
                        </div>
                        <h1>{capitalizeTxt(user.name)}</h1>
                        <p>E-mail: {user.email}</p>
                        <p>Data de Registro: {moment(user.createdAt).format('DD/MM/YYYY')}</p>
                        <span className="desc">
                            <span className="dadosUser">
                                <span className="coluna">
                                    <h2>Dados do Usuário</h2>
                                    <span className="tabela">
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
                                                    <div className="popPerfil popRedacao">
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
                                                                            .then((response: any) => {
                                                                                console.log("======> reset pass ", response)

                                                                                toast.dismiss()
                                                                                toast.info("E-mail enviado!")

                                                                                close()
                                                                            }).catch((error: any) => {
                                                                                console.log(" =======> reset pass error", error)

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
                                    <h2>Plano de acesso</h2>
                                    <span className="tabela">
                                        <span className="row">
                                            <span className="funcao">Plano Atual:</span>
                                            <span className="tipo">
                                                {plano && <>{plano.name} - {plano.total_envios} envios /mês não acumulativo</>}
                                            </span>
                                        </span>
                                        {/* <span className="row">
                                            <span className="funcao">Alterar Plano:</span>
                                            <span className="tipo">
                                                <select className="" name="">
                                                    <option value="">Selecione um plano</option>
                                                    <option value="">Plano Mensal 10 Envios</option>
                                                    <option value="">Plano Trimestral 10 Envios</option>
                                                    <option value="">Plano Semestral 10 Envios</option>
                                                    <option value="">Plano Anual 10 Envios</option>
                                                </select>
                                            </span>
                                        </span> */}
                                        <span className="row">
                                            <span className="funcao">Qtd. de Envios:</span>
                                            <span className="tipo">
                                                {session.subscription.envios} Envios disponíveis | {session.subscription.enviosAvulsos} Envios avulsos
                                            </span>
                                        </span>
                                    </span>
                                </span>
                            </span>
                            <span className="coluna margin30">
                                <h2>Últimas de transações</h2>
                                <span className="tabela">
                                    <span className="row head">
                                        <span>Data</span>
                                        <span>Descrição</span>
                                        <span>Método</span>
                                        <span>Forma de Pagamento</span>
                                        <span>Valor</span>
                                    </span>

                                    {transacaos.length == 0 && <span>Nenhuma transação encontrada.</span>}

                                    {transacaos.length > 0 && transacaos.map((transacao: any, index: number) => {

                                        return (<span className="row" key={index}>
                                            <span>{moment(transacao.updatedAt).format('DD/MM/YYYY')}</span>
                                            <span>{transacao?.data?.transaction?.items.length > 0 ? transacao?.data?.transaction?.items[0].title : ''}</span>
                                            <span>{transacao?.metodo == 'credit_card' ? 'Cartão de crédito' : 'Boleto bancário'}</span>
                                            <span>{
                                                transacao?.metodo == 'credit_card' ?
                                                    `**** **** **** ${transacao?.data?.transaction?.card_last_digits}`
                                                    :
                                                    `***-***-*** ${transacao?.data?.transaction?.boleto_barcode.slice(-4)}`
                                            }</span>
                                            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transacao?.data?.transaction?.amount / 100)}</span>
                                        </span>)
                                    })}

                                </span>
                            </span>
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
.coluna{display: flex; flex-direction: column; border: 1px solid #d6d6d6;padding: 1rem; border-radius: 1rem;}
.gridPlanejamento .content .box .desc .dadosUser .tabela .row{display: flex; flex-direction: row; align-items: center; margin: 0 0 1rem; height: 30px}
.gridPlanejamento .content .box .desc .dadosUser .tabela .row:last-child{margin: 0}
.gridPlanejamento .content .box .desc .dadosUser .tabela .row .funcao{display: flex; flex: 1;}
.gridPlanejamento .content .box .desc .dadosUser .tabela .row .tipo{display: flex; flex: 2;}
.gridPlanejamento .content .box .desc .dadosUser .tabela .row .tipo select{display: block; width: 100%; border: none; border-radius: 0.6rem; padding: 0.5rem; font-size: 0.9rem}
.gridPlanejamento .content .box .desc .dadosUser .tabela .row .tipo input{display: block; width: 100%; border: none; border-radius: 0.6rem; padding: 0.5rem; font-size: 0.9rem}
.gridPlanejamento .content .box .desc .dadosUser .tabela .row .tipo a{display: block; max-width: 500px; margin: 0;  background: var(--green);padding: 0.5rem 1rem;color: var(--white);text-decoration: none;border-radius: 0.5rem;}
.gridPlanejamento .content .box .desc .dadosUser .tabela .row .tipo a:hover{background: var(--dark)}

.margin30{
  margin: 2rem 0 0;
}


.margin30 .head{display: grid; grid-template-columns: 0.5fr 2fr 1.5fr 1fr 0.5fr; margin: 0 0 1rem; padding: 0.5rem 0 1rem;border-bottom: 1px solid #ccc}

.head span{
  font-weight: 700;
}

.margin30 .row{display: grid; grid-template-columns: 0.5fr 2fr 1.5fr 1fr 0.5fr; margin: 0 0 1rem; padding: 0.5rem 0 1rem; border-bottom: 1px solid #ccc}
.margin30 .row:last-child{margin: 0}
.margin30 .row span{display: flex; flex: 1;}
.margin30 .row .tipo{display: flex; flex: 2;}

.gridPlanejamento .content .box .botaoDelete{position: absolute; right: 4rem; top: 3rem;}
.gridPlanejamento .content .box .botaoDelete img{width: 10rem; height: 10rem; object-fit: cover; border-radius: 50%}

.gridPlanejamento .content .box .botaoSave{display: block; width: 100%; text-align: center; margin: 2rem 0 0}
.gridPlanejamento .content .box .botaoSave a{display: block; max-width: 100px; margin: 0 auto;  background: var(--green);padding: 0.5rem 1rem;color: var(--white);text-decoration: none;border-radius: 0.5rem;}
.gridPlanejamento .content .box .botaoSave a:hover{background: var(--dark)}



.profile-pic {
	 color: transparent;
	 transition: all 0.3s ease;
	 display: flex;
	 justify-content: center;
	 align-items: center;
	 position: relative;
	 transition: all 0.3s ease;
}
 .profile-pic input {
	 display: none;
}
 .profile-pic img {
	 position: absolute!important;
	 object-fit: cover!important;
	 width: 165px!important;
	 height: 165px!important;
	 box-shadow: 0 0 10px 0 rgba(255, 255, 255, .35)!important;
	 border-radius: 100px!important;
	 z-index: 0!important;
}
 .profile-pic .-label {
	 cursor: pointer;
	 height: 165px;
	 width: 165px;
}
 .profile-pic:hover .-label {
	 display: flex;
	 justify-content: center;
	 align-items: center;
	 background-color: rgba(0, 0, 0, .8);
	 z-index: 10000;
	 color: #fafafa;
	 transition: background-color 0.2s ease-in-out;
	 border-radius: 100px;
	 margin-bottom: 0;
}
 .profile-pic span {
	 display: inline-flex;
	 padding: 0.2em;
	 height: 2em;
}
 body {
	 height: 100vh;
	 background-color: #191815;
	 display: flex;
	 justify-content: center;
	 align-items: center;
}
 body a:hover {
	 text-decoration: none;
}
 






@media(max-width: 1200px){
  .gridPlanejamento .content .box .desc .dadosUser{grid-template-columns: 1fr}
}

@media(max-width: 767px){
  .margin30 .row{display: flex;}
}

@media(max-width: 640px){
  .margin30 .row{display: block;}
  .margin30 .head{display: none;}
  .margin30 .row span{margin: 0 0 0.5rem;}
  .margin30 .row span:nth-child(1){font-weight: 500; font-size: 1.2rem}
  .margin30 .row span:nth-child(5){font-weight: 500; font-size: 1.2rem}
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
function PLANO(plano_id: number) {
    throw new Error('Function not implemented.')
}

