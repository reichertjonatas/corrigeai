import { useSession } from 'next-auth/client'
import { useRouter } from 'next/dist/client/router'
import Image from 'next/image'
import React from 'react'
import { IcPainelAlunoGlobal, IcPhoto } from '../icons'
import LayoutCarregando from './LayoutCarregando'
import NaoAutenticado from './NaoAutenticado'
import Sidebar from './Sidebar'

interface MainLayoutProps {
    children: React.ReactNode
}

function MainLayout({ children } : MainLayoutProps) {

    const [ session, loading ] = useSession()
    const route = useRouter()
    
    if (loading) 
        return  <LayoutCarregando />;

    if(!session) {
        route.push('/painel/entrar');
        return <></>;
    }
    
    return (
        <>
            <div className="bg-green"></div>
            <div className="container-full">

                <Sidebar />

                <div className="content-global">
                    <div className="head">
                        <h1>
                            <Image src={IcPainelAlunoGlobal} className="img-responsive" alt="" />
                            Painel do aluno
                        </h1>
                        <span className="user">
                            <ul>
                            <li>
                                <span className="message">Olá, {session!.user?.name}!</span>
                            </li>
                            <li>
                                <span className="photo">
                                    <Image src={IcPhoto} className="img-responsive" alt=""/>
                                </span>
                            </li>
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

export default MainLayout
