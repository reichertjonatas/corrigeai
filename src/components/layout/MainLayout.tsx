import { getSession, signOut, useSession } from 'next-auth/client'
import { useRouter } from 'next/dist/client/router'
import Image from 'next/image'
import React from 'react'
import { IcPainelAlunoGlobal, IcPhoto } from '../icons'
import LayoutCarregando from './LayoutCarregando'
import Sidebar from './Sidebar'
import Popup from 'reactjs-popup'
import Link from 'next/link'


interface MainLayoutProps {
    children: React.ReactNode
    menuType?: number
}

function MainLayout({ children, menuType = 1}: MainLayoutProps) {
    const [ session, loading ] = useSession()
    const router = useRouter()
    
    if(loading) 
        return <LayoutCarregando />

    if(!session && !loading){
        router.push('/painel/entrar');
        return <></>
    }

    return (
        <>
            <div className="bg-green"></div>
            <div className="container-full">

                <Sidebar menuType={menuType}/>

                <div className="content-global">
                    <div className="head">
                        <h1>
                            <Image src={IcPainelAlunoGlobal} className="img-responsive" alt="" />
                            
                            <span className="titleH1">
                                Painel do { menuType == 1 && 'aluno'} { menuType == 2 && 'corretor'} { menuType == 3 && 'admin'}
                            </span>
                        </h1>
                        <span className="user">
                            <ul>
                            <li>
                                <span className="message"><span className="welcomeOla">Olá, </span>{session!.user?.name}!</span>
                            </li>
                            <Popup
                                    trigger={open => (
                                <li>
                                    <span className="photo">
                                            <Image src={IcPhoto} className="img-responsive" alt=""/>
                                    </span>
                                </li>
                            )}
                            position="left top"
                            on={['hover', 'focus']}
                            closeOnDocumentClick
                        >
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Link href="/painel/aluno/meu-perfil" passHref> 
                                    <span style={{ cursor: 'pointer' }}>Meu Perfil</span> 
                                </Link>
                                <hr style={{ opacity: 0.3}}/>
                                <span onClick={() => signOut()} style={{ cursor: 'pointer' }}> Sair </span>
                            </div>
                        </Popup>
                            </ul>
                        </span>
                    </div>


                    { children }

                    <div className="copyright">2021 © Corrige Aí: todos os direitos reservados</div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(ctx: any) {
    const session = await getSession(ctx);
    
    if(!session){
        ctx.res.writeHead(302, { Location: '/painel/entrar' })
        ctx.res.end()

        return {
            props: {},
        }
    }

    console.log('session: ', session);

    return {
        props: {
            session: session,
        },
    }
}

export default MainLayout
