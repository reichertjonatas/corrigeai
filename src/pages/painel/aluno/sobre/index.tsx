import React from 'react'
import MainLayout from '../../../../components/layout/MainLayout'
import { withAuthSession } from '../../../../utils/helpers';

function Sobre() {
    return (
        <MainLayout>
            <h1>Sobre</h1>
        </MainLayout>
    )
}


export async function getServerSideProps(ctx: any) {
    const session = await withAuthSession(ctx);
    if('redirect' in session) {
        return session;
      }
      
    return { props: {session: session} }
  }

export default Sobre
