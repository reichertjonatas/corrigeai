import React from 'react'
import Head from 'next/head'

interface SeoProps {
    title?: string;
    description?: string;

}

export default function Seo({ title, description } : SeoProps ) {
    return (
        <Head>
            <title>
                { title  ?? 'Corrige Ai - Slogan aqui...'}
            </title>
            <meta name="description" content={ description ?? "Corrige Ai description"} />
            <meta name="author" content="InoveWeb.pt | Kellvem Barbosa & Pedro Mamare" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    )
}
