import React from "react";
import Image from "next/image";
import {
   Logo,
   IcPainelAluno,
   IcDesempenho,
   IcTemas,
   IcCaed,
   IcSobre,
   IcPlanejamento,
   IcEnvios,
   LogoLampada,
   suas_correcoes,
   RedacaoPreview,
   IconRedacoes
} from "../icons";
import Link from "next/link";
import {Cookie, withCookie, useCookie} from "next-cookie";
import {useMenuStore} from "../../hooks/menuStore";
import {useSession} from "next-auth/client";
import {useState} from 'react'

interface SidebarProps {
   menuType?: number;
}

interface MenuProps {
   href: string;
   icon: StaticImageData;
   name: string;
}

function Sidebar(props : any) {
   const [session, loading] = useSession();
   const {menuType} = props;
   const menuOpen = useMenuStore((state) => state.menuOpen);
   const setMenuOpen = useMenuStore((state) => state.setMenuOpen);

   const ItemMenu = ({href, icon, name} : MenuProps) => {
      return (
         <li>
            <Link href={href}
               passHref>
               <a>
                  <span className="img">
                     <Image src={icon}
                        className="img-responsive"
                        alt=""/>
                  </span>
                  <span className="name">
                     {name}</span>
               </a>
            </Link>
         </li>
      );
   };

   // Prepara toda parte da sidebar.

   return (
      <div className={
         menuOpen ? `sidebar fechado` : `sidebar`
      }>
         <a>
            <span className="logo">
               <Image src={Logo}
                  className="img-responsive"
                  alt=""/>
            </span>
            <span className="logoFechada">
               <Image src={LogoLampada}
                  className="img-responsive"
                  alt=""/>
            </span>
         </a>
         <hr/>

         <span className="menu">
            {
            menuType == 1 && (
               <ul>
                  <ItemMenu href="/painel/aluno"
                     icon={IcPainelAluno}
                     name="Painel do Aluno"/>
                  <ItemMenu href="/painel/aluno/desempenho"
                     icon={IcDesempenho}
                     name="Desempenho"/>
                  <ItemMenu href="/painel/aluno/seus-envios"
                     icon={IcEnvios}
                     name="Envios"/>
                  <ItemMenu href="/painel/aluno/temas"
                     icon={IcTemas}
                     name="Temas"/>
                  <ItemMenu href="/painel/aluno/caed"
                     icon={IcCaed}
                     name="Alô, CAED!"/>
                  <ItemMenu href="/painel/aluno/sobre"
                     icon={IcSobre}
                     name="Sobre"/>
                  <ItemMenu href="/painel/aluno/planejamento"
                     icon={IcPlanejamento}
                     name="Planejamento"/>
                  <hr/>
                  <li className="itemFechado">
                     <a onClick={
                        () => {
                           setMenuOpen();
                        }
                     }>
                        <span className="img">
                           <Image src={IcEnvios}
                              className="img-responsive"
                              alt=""/>
                        </span>
                        <span className="name">Fechar</span>
                     </a>
                  </li>
               </ul>
            )
         }
            {
            menuType == 2 && (
               <ul>
                  <ItemMenu href="/painel/corretor"
                     icon={IcPainelAluno}
                     name="Correções duplas"/>
                  <ItemMenu href="/painel/corretor/redacoes-simples"
                     icon={IconRedacoes}
                     name="Correções simples"/>
                  <ItemMenu href="/painel/corretor/suas-correcoes"
                     icon={suas_correcoes}
                     name="Suas correções"/> {
                  // @ts-ignore
                  session ?. discrepancia && (
                     <ItemMenu href="/painel/corretor/discrepancias"
                        icon={suas_correcoes}
                        name="Discrepâncias"/>
                  )
               }
                  <hr/>
                  <li className="itemFechado">
                     <a onClick={
                        () => {
                           setMenuOpen();
                        }
                     }>
                        <span className="img">
                           <Image src={IcEnvios}
                              className="img-responsive"
                              alt=""/>
                        </span>
                        <span className="name">Fechar</span>
                     </a>
                  </li>
               </ul>
            )
         }
            {
            menuType == 3 && (
               <ul>
                  <ItemMenu href="/painel/admin/comuns/paginas"
                     icon={IcPainelAluno}
                     name="Páginas"/>
                  <ItemMenu href="/painel/admin/comuns/faq"
                     icon={IcPainelAluno}
                     name="FAQ"/>
                  <hr/>
                  <li className="itemFechado">
                     <a onClick={
                        () => {
                           setMenuOpen();
                        }
                     }>
                        <span className="img">
                           <Image src={IcEnvios}
                              className="img-responsive"
                              alt=""/>
                        </span>
                        <span className="name">Fechar</span>
                     </a>
                  </li>
               </ul>
            )
         } </span>
      </div>
   );
}

export default Sidebar;
