/* eslint-disable @next/next/no-img-element */
import { getSession, session, signOut, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { IcPainelAlunoGlobal, IcPhoto } from '../icons'
import LayoutCarregando from './LayoutCarregando'
import Sidebar from './Sidebar'
import Popup from 'reactjs-popup'
import Link from 'next/link'
import PreLoader from '../PreLoader'
import App from 'next/app'


interface MainLayoutProps {
    children: React.ReactNode;
    menuType?: number;
    role?: string;
}

// export async function getServerSideProps(ctx : any) {
//     const session = await getSession(ctx); 
//     console.log(session);

//     if(!session){
//         return {
//             redirect: {
//                 permanent: false,
//                 destination: "/painel/entrar",
//             }
//         }
//     }

//     // @ts-ignore
//     const permission: any = session.role;

//     console.log("mainLayout", role, permission.type)

//     if (role && permission.type) {
//         if (permission.type != role) {
//             switch (permission.type) {
//                 case 'corretor':
//                     router.replace('/painel/corretor');
//                     return <PreLoader />;
//                 default:
//                     router.replace('/painel/aluno');
//                     return <PreLoader />;
//             }
//         }
//     }
// }

const MainLayout = ({ children, menuType = 1, role = "authenticated" }: MainLayoutProps) => {
    const router = useRouter();
    const [ session, loading] = useSession()
    const [loadingPerfil, setLoadingPerfil] = React.useState(true)

    React.useEffect(() => {
        const checkRoles = () => { 
            // @ts-ignore
            const permission: any = session.role;

            if (role && permission.type) {
                console.log(permission.type != role, permission.type, role)
                if (permission.type != role) {
                    switch (permission.type) {
                        case 'corretor':
                            router.replace('/painel/corretor');
                            break;
                        default:
                            router.replace('/painel/aluno');
                            break;
                    }
                }else{
                    setLoadingPerfil(false)
                }
                return <PreLoader />
            }else{
                setLoadingPerfil(false)
            }
        }
        checkRoles();
    }, [session])

    // When rendering client side don't display anything until loading is complete
    if (typeof window !== 'undefined' && loading) return null

    if (loading || loadingPerfil)
        return <PreLoader/>

    if (!session && !loading) {
        router.replace('/painel/entrar');
        return <PreLoader />
    }


    return (
        <>
            <div className="bg-green"></div>
            <div className="container-full">

                <Sidebar menuType={menuType} />

                <div className="content-global">
                    <div className="head">
                        <h1>
                            <Image src={IcPainelAlunoGlobal} className="img-responsive" alt="" />

                            <span className="titleH1">
                                Painel do {menuType == 1 && 'aluno'} {menuType == 2 && 'corretor'} {menuType == 3 && 'admin'}
                            </span>
                        </h1>
                        <span className="user">
                            <ul>
                                <li>
                                    <span className="message"><span className="welcomeOla">Olá, </span>{session?.user?.name}!</span>
                                </li>
                                <Popup
                                    trigger={open => (
                                        <li>
                                            <span className="photo">
                                                <img src={session?.user?.image ? `${process.env.NEXT_PUBLIC_URL_API}${session.user.image}` : "/upload/perfil/no-foto.png"} className="img-responsive" alt="" />
                                            </span>
                                        </li>
                                    )}
                                    position="left top"
                                    on={['hover', 'focus']}
                                    closeOnDocumentClick
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Link href={`/painel/${menuType == 2 ? 'corretor' : 'aluno'}/meu-perfil`} passHref>
                                            <span style={{ cursor: 'pointer' }}>Meu Perfil</span>
                                        </Link>
                                        <hr style={{ opacity: 0.3 }} />
                                        <span onClick={() => signOut()} style={{ cursor: 'pointer' }}> Sair </span>
                                    </div>
                                </Popup>
                            </ul>
                        </span>
                    </div>



                    { children }

                    <div className="copyright">2021 © Corrige Aí: todos os direitos reservados</div>
                </div>
            </div>
        </>
    )
}


export default MainLayout
