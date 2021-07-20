import Image from 'next/image'
import React from 'react'
import { IcPainelAlunoGlobal, IcPhoto } from '../icons'
import Sidebar from './Sidebar'

interface MainLayoutProps {
    children: React.ReactNode
}

function MainLayout({ children } : MainLayoutProps) {
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
                                <span className="message">Olá, Ana Paula!</span>
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
