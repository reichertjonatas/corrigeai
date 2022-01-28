import React from 'react'
import Head from 'next/head'
import TagManager from 'react-gtm-module'
const tagManagerArgs = {
  gtmId: 'GTM-T7GCH9D'
}
if (process.browser) {
TagManager.initialize(tagManagerArgs)
}

interface SeoProps {
    title?: string;
    description?: string;

}

export default function Seo({ title, description } : SeoProps ) {
    return (
        <Head>
            <title>
                { title  ?? 'Corrige Aí | Correção de Redação para o ENEM'}
            </title>
            <meta name="description" content={ description ?? "A única plataforma de correção de redação para o ENEM que possui dois corretores para cada envio e uma terceira correção em casos de discrepância!"} />
            <meta name="author" content="Desenvolvido por Cupcode | Marketing e Desenvolvimento" />
            <link rel="icon" href="/favicon.ico" />

    


        </Head>
    )
}
