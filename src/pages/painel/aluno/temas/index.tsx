import React, {useEffect} from "react";
import {TemaCorrigeAi, TemaEnem} from "../../../../components/icons";
import MainLayout from "../../../../components/layout/MainLayout";
import Image from "next/image";
import Link from "next/link";
import Seo from "../../../../components/layout/Seo";
import {useTemaStore} from "../../../../hooks/temaStore";
import Viewer, {Worker} from "@phuocng/react-pdf-viewer";
import "@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css";
import shallow from "zustand/shallow";
import {getSession} from "next-auth/client";
import PreLoader from "../../../../components/PreLoader";
import Markdown, {compiler} from "markdown-to-jsx";
import {strapi} from "../../../../services/strapi";
import EnviarRedacao from "../../../../components/EnviarRedacao";
import Popup from "reactjs-popup";
import {useSubscriptionStore} from "../../../../hooks/subscriptionStore";

export async function getServerSideProps(ctx : any) {
   const session = await getSession(ctx);

   if (! session) {
      return {
         redirect: {
            permanent: false,
            destination: "/painel/entrar"
         }
      };
   }

   const temas = await strapi(session.jwt).graphql({query: `query{
      temas {
        id
        titulo
      }
    }`});

   return {
      props: {
         session: session,
         temasProps: temas
      }
   };
}

function Temas({session, temasProps} : any) {
   const [temas, currentTema, categoria, isLoading, getAllTemas, setCurrentTema, setCategoria,] = useTemaStore((state) => [
      state.temas,
      state.currentTema,
      state.categoria,
      state.isLoading,
      state.getAllTemas,
      state.setCurrentTema,
      state.setCategoria,
   ], shallow);

   useEffect(() => {
      getAllTemas(session.jwt);
   }, [getAllTemas]);

   const [open, setOpen] = React.useState(false);
   const closeModal = () => setOpen(false);

   const subscription = useSubscriptionStore((state) => state.subscription);
   const setSubscription = useSubscriptionStore((state) => state.setSubscription);

   useEffect(() => {
      if (session ?. subscription) 
         setSubscription(session.subscription, session.jwt);
      
   }, []);

   return (
      <MainLayout>
         <Seo title="Temas"/>
         <div className={"grid-temas"}>
            <div className="content">
               <div className="head-box">
                  <a className={
                        currentTema != null ? categoria == "enem" ? "box active" : "box" : "box"
                     }
                     onClick={
                        () => setCategoria("enem", session.jwt)
                  }>
                     <span className="icon">
                        <Image src={TemaEnem}
                           className="img-responsive"
                           alt=""/>
                     </span>
                     <span className="texto">TEMAS ENEM</span>
                     <span className="subtexto">Propostas oficiais da prova</span>
                  </a>

                  <a className={
                        currentTema != null ? categoria == "corrigeai" ? "box active" : "box" : "box"
                     }
                     onClick={
                        () => setCategoria("corrigeai", session.jwt)
                  }>
                     <span className="icon">
                        <Image src={TemaCorrigeAi}
                           className="img-responsive"
                           alt=""/>
                     </span>
                     <span className="texto">TEMAS CORRIGE AÍ</span>
                     <span className="subtexto">
                        Propostas exclusivas da plataforma
                     </span>
                  </a>
               </div>

               <div className="box-tema">
                  {
                  currentTema != null && <h1>{
                     currentTema.titulo
                  }</h1>
               }
                  {
                  currentTema != null && (
                     <div className="conteudo"
                        dangerouslySetInnerHTML={
                           {__html: currentTema.content}
                     }></div>
                  )
               } </div>

               <span className="botao">
                  <a onClick={
                        () => setOpen(true)
                     }
                     style={
                        {cursor: "pointer"}
                  }>
                     Escolher esse tema
                  </a>
               </span>
            </div>

            <div className="lista-temas">
               {
               isLoading ? (
                  <PreLoader/>) : (
                  <ul> {
                     temas != null && temas.length > 0 && temas.map((temaRow : any, index : number) => {
                        return (
                           <li style={
                                 {cursor: "pointer"}
                              }
                              key={index}>
                              <a className={
                                    currentTema != null ? temaRow.id == currentTema.id ? "activeTema" : "" : ""
                                 }
                                 onClick={
                                    () => setCurrentTema(temaRow)
                              }>
                                 {
                                 temaRow.titulo
                              } </a>
                           </li>
                        );
                     })
                  } </ul>
               )
            } </div>

            <Popup open={open}
               onClose={closeModal}
               modal
               nested
               closeOnDocumentClick={false}>
               <EnviarRedacao selected={
                     currentTema != null ? {
                        value: currentTema.id,
                        label: currentTema.titulo
                     } : null
                  }
                  session={session}
                  temasProps={temasProps}
                  closeModal={closeModal}/>
            </Popup>
         </div>
      </MainLayout>
   );
}

export default Temas;
