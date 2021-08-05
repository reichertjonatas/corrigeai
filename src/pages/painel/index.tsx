import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/client'
import { useRouter } from 'next/dist/client/router'
import React from 'react'
import LayoutCarregando from '../../components/layout/LayoutCarregando'
import { authRequired } from '../../utils/helpers'

function Painel() {
    return <LayoutCarregando />
}

export async function getServerSideProps(ctx: any) {
    const session = await authRequired(ctx, true);

    if('redirect' in session){
        return session;
    }
    
    console.log('getServerSideProps called index.tsx', session.user)

    return {
        props: {
            user: session.user,
        },
    }
}
export default Painel
