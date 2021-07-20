import React from 'react'
import Image from 'next/image'
import { Logo, IcPainelAluno, IcDesempenho, IcTemas, IcCaed, IcSobre, IcPlanejamento } from '../icons'

interface SidebarProps {

}

function Sidebar() {
        return (
            <div className="sidebar">
                <span className="logo">
                    <Image src={Logo} className="img-responsive" alt="" />
                </span>
                <hr />

                <span className="menu">
                    <ul>
                        <li>
                            <a href="javascript://">
                                <span className="img">
                                    <Image src={IcPainelAluno} className="img-responsive" alt="" />
                                </span>
                                <span className="name">
                                    Painel do aluno
                                </span>
                            </a>
                        </li>

                        <li>
                            <a href="javascript://">
                                <span className="img">
                                    <Image src={IcDesempenho} className="img-responsive" alt="" />
                                </span>
                                <span className="name">
                                    Desempenho
                                </span>
                            </a>
                        </li>

                        <li>
                            <a href="javascript://">
                                <span className="img">
                                    <Image src={IcTemas} className="img-responsive" alt="" />
                                </span>
                                <span className="name">
                                    Temas
                                </span>
                            </a>
                        </li>

                        <li>
                            <a href="javascript://">
                                <span className="img">
                                    <Image src={IcCaed} className="img-responsive" alt="" />
                                </span>
                                <span className="name">
                                    Alô, CAED!
                                </span>
                            </a>
                        </li>

                        <li>
                            <a href="javascript://">
                                <span className="img">
                                    <Image src={IcSobre} className="img-responsive" alt="" />
                                </span>
                                <span className="name">
                                    Sobre
                                </span>
                            </a>
                        </li>

                        <li>
                            <a href="javascript://">
                                <span className="img">
                                    <Image src={IcPlanejamento} className="img-responsive" alt="" />
                                </span>
                                <span className="name">
                                    Planejamento
                                </span>
                            </a>
                        </li>
                    </ul>
                </span>
            </div>)
}
export default Sidebar
