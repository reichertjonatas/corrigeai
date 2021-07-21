import { getSession } from "next-auth/client"

export async function authRequired(ctx: any, isIndex?: boolean) {
    const session = await getSession(ctx)

    if (!session) {
        ctx.res.writeHead(302, { Location: '/painel/entrar' })
        ctx.res.end()
        return null
    }

    if (isIndex) {
        switch (session.user!.userType) {
            case 2:
                ctx.res.writeHead(302, { Location: '/painel/corretor' })
                ctx.res.end()
                break;
            case 3:
                ctx.res.writeHead(302, { Location: '/painel/admin' })
                ctx.res.end()
                break;
            
            default:
                ctx.res.writeHead(302, { Location: '/painel/aluno' })
                ctx.res.end()
                break;
        }
        return {
            props: {
                user: session.user,
            },
        }
    }

    return session;
}

export function notLogged() {
    
}