import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/client'
import { useRouter } from 'next/dist/client/router'
import React from 'react'
import LayoutCarregando from '../../components/layout/LayoutCarregando'
import Whatsapp from '../../components/layout/Whatsapp'
import PreLoader from '../../components/PreLoader'
import { API } from '../../services/api'
import { authRequired } from '../../utils/helpers'

function Painel() {
    const router = useRouter();
    const [session, loading] = useSession()

    const initData = async () => {
        // @ts-ignore
        switch (session?.role?.type) {
            case "corretor":
                router.replace('/painel/corretor');
                break;
            default:
                router.replace('/painel/aluno');
                break;
        }
    }

    if (!loading) {
        if (session) {
            initData();
        } else {
            router.push('/painel/entrar');
        }
    }


    return <PreLoader />
    

    
}

export default Painel
