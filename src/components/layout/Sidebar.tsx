import React from 'react'
import Image from 'next/image'
import { Logo, IcPainelAluno, IcDesempenho, IcTemas, IcCaed, IcSobre, IcPlanejamento } from '../icons'
import Link from 'next/link'

interface SidebarProps {
    menuType?: number; 
}


interface MenuProps {
    href: string;
    icon: StaticImageData;
    name: string;
}

function Sidebar({ menuType = 1 } : SidebarProps) {

        const ItemMenu = ( { href, icon, name } : MenuProps) => {

            return (
                <li>
                    <Link href={href} passHref>
                        <a>
                            <span className="img">
                                <Image src={icon} className="img-responsive" alt="" />
                            </span>
                            <span className="name">
                                {name}
                            </span>
                        </a>
                    </Link>
                </li>
            )
        }

        return (
            <div className="sidebar">
                <Link href="/painel" passHref>
                    <span className="logo">
                        <Image src={Logo} className="img-responsive" alt="" />
                    </span>
                </Link>
                <hr />

                <span className="menu">
                    <ul>
                        <ItemMenu href="/painel/aluno" icon={IcPainelAluno} name="Painel do Aluno" />
                        <ItemMenu href="/painel/aluno/desempenho" icon={IcDesempenho} name="Desempenho" />
                        <ItemMenu href="/painel/aluno/temas" icon={IcTemas} name="Temas" />
                        <ItemMenu href="/painel/aluno/caed" icon={IcCaed} name="Alô, CAED!" />
                        <ItemMenu href="/painel/aluno/sobre" icon={IcSobre} name="Sobre" />
                        <ItemMenu href="/painel/aluno/planejamento" icon={IcPlanejamento} name="Planejamento" />
                    </ul>
                </span>
            </div>)
}
export default Sidebar
