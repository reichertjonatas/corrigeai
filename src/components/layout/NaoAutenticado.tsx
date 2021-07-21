import React from 'react'
import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/dist/client/router'

function NaoAutenticado() {
    const [ session, loading ] = useSession()
    const router = useRouter()
    if(!session) {
        router.push('/painel/entrar');
        return <></>;
    }
    return (
        <div style={{"background" : "var(--green) !important", minHeight: "100vh", minWidth: "100vw",display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
            {/* <div style={{ minHeight: '100vh', minWidth: '100vw',display: 'flex', flex: 1, flexDirection: 'column' , justifyContent: 'center', alignItems: 'center' }}> */}
                <p>Você precisa Efetuar o Login</p>
                <button onClick={ () => signIn()}>Entrar agora</button>
            {/* </div> */}
        </div>
    )
}

export default NaoAutenticado
