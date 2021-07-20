import { useSession } from 'next-auth/client'
import React from 'react'
import MainLayout from '../../components/layout/MainLayout'

function Painel() {
    const [ session, loading ] = useSession()


    if (!session) { return  <h1>Acesso negado!</h1> }

    return (
    <MainLayout>
      <h1>Painel de controle</h1>
      <p>
          <strong>Acesso liberado! <br/> {"\u00a0"} </strong>
      </p>
    </MainLayout>
  )
}

export default Painel
