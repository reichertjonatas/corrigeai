import { getSession } from "next-auth/client"

export async function authRequired(ctx: any, isIndex?: boolean) {
    const session = await getSession(ctx)

    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: '/painel/entrar',
            }
        }
    }

    if (isIndex) {
        switch (session.user!.userType) {
            case 2:
                return {
                    redirect: {
                        permanent: false,
                        destination: '/painel/corretor',
                    }
                }
            case 3:
                return {
                    redirect: {
                        permanent: false,
                        destination: '/painel/admin',
                    }
                }
            default:
                return {
                    redirect: {
                        permanent: false,
                        destination: '/painel/aluno',
                    }
                }
        }
    }
    
    return session;
}

export async function withAuthSession(ctx: any) {
    const session = await getSession(ctx)

    if (!session) {
        return { 
            redirect: {
                permanent: false,
                destination: '/painel/entrar'
            }
        }
    }

    return session;
}

export function notLogged() {
    
}