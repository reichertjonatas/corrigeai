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

export const msToTime = (ms : any) => ({
    hours: Math.trunc(ms/3600000),
    minutes: Math.trunc((ms/3600000 - Math.trunc(ms/3600000))*60) + ((ms/3600000 - Math.trunc(ms/3600000))*60 % 1 != 0 ? 1 : 0)
})


const start = new Date(new Date().setHours(new Date().getHours()));
const end = new Date(new Date().setHours(new Date().getHours() + 1));

export const initialEvent = {
    id: 1,
    title: 'Hoje',
    start,
    end,
    eventProps: {
        color: '#72b01d'
    }
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