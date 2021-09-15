import React from 'react'
import MainLayout from '../../../../components/layout/MainLayout'

import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';

// Demo styles, see 'Styles' section below for some notes on use.
import 'react-accessible-accordion/dist/fancy-example.css';
import { getSession } from 'next-auth/client';
import { strapi } from '../../../../services/strapi';
import { queryCaed } from '../../../../graphql/query';
import Seo from '../../../../components/layout/Seo';

export async function getServerSideProps(ctx : any) {
    const session = await getSession(ctx);

    if(!session) {
        return {
            redirect: {
                permanent: false,
                destination: '/painel/entrar',
            }
        }
    }

    const aloCaeds = await strapi(session.jwt).graphql({
        query: queryCaed
    })

    return {
        props: {
          session: session,
          aloCaeds
        }
    }
}

function Caed({ aloCaeds } : any) {

    return (
        <MainLayout>
            <Seo title="Alô, CAED!" />
            <div className="gridPlanejamento">
                <div className="content">
                    <div className="box">
                        <h1>Alô, CAED!</h1>
                        <span className="desc">

                            <div className="tabs">
                                <Accordion allowZeroExpanded>
                                    {
                                        aloCaeds?.length > 0 && aloCaeds.map((caed : any, index: number) => {
                                            return (
                                                <AccordionItem key={index}>
                                                <AccordionItemHeading>
                                                    <AccordionItemButton>
                                                        { caed.titulo }
                                                    </AccordionItemButton>
                                                </AccordionItemHeading>
                                                <AccordionItemPanel dangerouslySetInnerHTML={{__html: caed.conteudo  }}>
                                                        
                                                </AccordionItemPanel>
                                            </AccordionItem>
                                            )
                                        }
                                    )}
                                </Accordion>
                            </div>

                        </span>
                    </div>
                </div>
            </div>

            <style jsx>
                {
                    `
                    .gridPlanejamento{display: grid; grid-template-columns: 1fr;}
.gridPlanejamento .content{display: block; width: 100%;}
.gridPlanejamento .content .box{display: block; width: 100%;border-radius: 0.75rem; background: var(--gray20); padding: 2.8125rem 1.5rem; position: relative; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
.gridPlanejamento .content .box h1{display: block; width: 100%; text-align: center; font-weight: 500; font-size: 1.6875rem; margin: 0 0 1.5rem}
.gridPlanejamento .content .box .desc{display: block; width: 100%; text-align: left; font-weight: 400; font-size: 1rem; color: #000}
.gridPlanejamento .content .box .desc p{margin: 0 0 1rem; font-weight: 400; font-size: 1rem; color: #000}
.gridPlanejamento .content .box .desc strong{font-weight: 500;}
.gridPlanejamento .content .box .desc img{max-width: 60%; margin: 0 auto;}
.gridPlanejamento .content .botao a{display: block; width: 100%; max-width: 400px; margin: 2rem auto; text-align: center; color: var(--gray20); font-family: 'Poppins', sans-serif; font-weight: 500; border-radius: 0.75rem; font-size: 1.2em; background: var(--dark); padding: 0.5125rem; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
.gridPlanejamento .content .botao a:hover{transform: scale(0.9);}

.tabs {
	 border-radius: 8px;
	 overflow: hidden;
	 box-shadow: 0 4px 4px -2px rgba(0, 0, 0, 0.5);
}
 .tab {
	 width: 100%;
	 color: white;
	 overflow: hidden;
}
 .tab-label {
	 display: flex;
	 justify-content: space-between;
	 padding: 1em;
	 background: #2c3e50;
	 font-weight: bold;
	 cursor: pointer;
	/* Icon */
}
 .tab-label:hover {
	 background: #1a252f;
}
 .tab-label::after {
	 width: 1em;
	 height: 1em;
	 text-align: center;
	 transition: all 0.35s;
}
 .tab-content {
	 max-height: 0;
	 padding: 0 1em;
	 color: #2c3e50;
	 background: white;
	 transition: all 0.35s;
}
 .tab-close {
	 display: flex;
	 justify-content: flex-end;
	 padding: 1em;
	 font-size: 0.75em;
	 background: #2c3e50;
	 cursor: pointer;
}
 .tab-close:hover {
	 background: #1a252f;
}
 input:checked + .tab-label {
	 background: #1a252f;
}
 input:checked + .tab-label::after {
	 transform: rotate(90deg);
}
 input:checked ~ .tab-content {
	 max-height: 100vh;
	 padding: 1em;
}


@media(max-width: 500px){
  .gridPlanejamento{grid-template-columns: 1fr}
}

                    `
                }
            </style>
        </MainLayout>
    )
}

export default Caed
