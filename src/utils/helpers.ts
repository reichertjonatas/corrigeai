import { getSession } from "next-auth/client"
import { ICalenderEvents, IObsEnem } from "../models/user"

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

export const uniqueFileName = () => Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));

export const msToTime = (ms: any) => ({
    hours: Math.trunc(ms / 3600000),
    minutes: Math.trunc((ms / 3600000 - Math.trunc(ms / 3600000)) * 60) + ((ms / 3600000 - Math.trunc(ms / 3600000)) * 60 % 1 != 0 ? 1 : 0)
})


const start = new Date(new Date().setHours(new Date().getHours()));
const end = new Date(new Date().setHours(new Date().getHours() + 1));

export const initialEvent: ICalenderEvents = {
    _id: "1",
    title: 'Hoje',
    start,
    end,
    eventProps: {
        color: '#72b01d'
    }
}

export const initialCompetencias = [
    {
        title: 'Competências I',
        nota: -1,
        obs: '',
        obs_enem: null,
    },
    {
        title: 'Competências II',
        nota: -1,
        obs: '',
        obs_enem: null,
    },
    {
        title: 'Competências III',
        nota: -1,
        obs: '',
        obs_enem: null,
    },
    {
        title: 'Competências IV',
        nota: -1,
        obs: '',
        obs_enem: null,
    },
    {
        title: 'Competências V',
        nota: -1,
        obs: '',
        obs_enem: null,
    }
]

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

export type IObsEnemFilter = IObsEnem;

export const obs_enem: IObsEnemFilter[][] = [
    [
        {
            nota: 0,
            color: 'ciano',
            items: [
                {
                    section: '0',
                    text: 'Estrutura sintática inexistente (independentemente da quantidade de desvios)',
                }
            ]
        },
        {
            nota: 40,
            color: 'ciano',
            items: [
                {
                    section: '1',
                    text: 'Estrutura sintática com muitos desvios',
                }
            ]
        },
        {
            nota: 80,
            color: 'ciano',
            items: [
                {
                    section: '2',
                    text: 'Estrutura sintática deficitária OU muitos desvios',
                }
            ]
        },
        {
            nota: 120,
            color: 'ciano',
            items: [
                {
                    section: '3',
                    text: 'Estrutura sintática regular E alguns desvios',
                }
            ]
        },
        {
            nota: 160,
            color: 'ciano',
            items: [
                {
                    section: '4',
                    text: 'Estrutura sintática boa E poucos desvios',
                }
            ]
        },
    ],
    [
        {
            nota: 0,
            color: 'pink',
            items: [
                {
                    section: '1',
                    text: 'Tangência ao tema',
                },
                {
                    section: 'OU',
                    text: '*Traço composto por aglomerado de palavras OU *Traços constantes de outros tipos textuais',
                }
            ]
        },
        {
            nota: 40,
            color: 'pink',
            items: [
                {
                    section: '2',
                    text: 'Abordagem completa do tema',
                },
                {
                    section: 'E',
                    text: '* 3 partes do texto (2 delas embrionárias) OU * Conclusão finalizada por frase incompleta',
                },
                {
                    text: 'Textos que apreentam muitos trechos de cópias dos textos motivadores não devem ultrapassar esse nível'
                }
            ]
        },
        {
            nota: 80,
            color: 'pink',
            items: [
                {
                    section: '1',
                    text: 'Abordagem completa do tema',
                },
                {
                    section: 'E',
                    text: '* 3 partes do texto (1 dela pode ser embrionária)',
                },
                {
                    section: 'E',
                    text: '*Repertório baseado nos textos motivadores E/OU * Repertório não legitimado E/OU * Repertório legitimado, MAS não pertinente ao tema',
                }
            ]
        },
        {
            nota: 120,
            color: 'pink',
            items: [
                {
                    section: 'E',
                    text: 'Abordagem completa do tema',
                },
                {
                    section: 'E',
                    text: '3 partes do texto (nenhuma delas embrionária)',
                },
                {
                    section: 'E',
                    text: '*Repertório legitimado E pertinente ao tema, COM uso produtivo',
                }
            ]
        },
        {
            nota: 160,
            color: 'pink',
            items: [
                {
                    section: '1',
                    text: 'Competencia 2',
                }
            ]
        },
    ],
    [
        {
            nota: 0,
            color: 'blue',
            items: [
                {
                    section: '0',
                    text: 'Tangente ao tema e sem direção',
                }
            ]
        },
        {
            nota: 40,
            color: 'blue',
            items: [
                {
                    section: '1',
                    text: 'Tangência ao tema',
                },
                {
                    section: 'OU',
                    text: 'Abordagem completa do tema e sem direção',
                }
            ]
        },
        {
            nota: 80,
            color: 'blue',
            items: [
                {
                    section: '2',
                    text: 'Projeto de texto com muitas falhas',
                },
                {
                    section: 'E',
                    text: 'Sem desenvolvimento ou com desenvolvimento de apenas uma informação, fato ou opinião',
                },
                {
                    text: 'Textos que apresentam contradição grave não devem ultrapassar este nível',
                }
            ]
        },
        {
            nota: 120,
            color: 'blue',
            items: [
                {
                    section: '3',
                    text: 'Projeto de texto com algumas falhas',
                },
                {
                    section: 'E',
                    text: 'Desenvolvimento de algumas informações, fatos e opiniões',
                }
            ]
        },
        {
            nota: 160,
            color: 'blue',
            items: [
                {
                    section: '4',
                    text: 'Projeto de texto com poucas falhas',
                },
                {
                    section: 'E',
                    text: 'Desenvolvimento da maior partes das informações, fatos e opiniões',
                }
            ]
        },
        {
            nota: 160,
            color: 'blue',
            items: [
                {
                    section: '5',
                    text: 'Projeto de texto estratégico',
                },
                {
                    section: 'E',
                    text: 'Desenvolvimento das informações, fatos e opiniões em todo o texto',
                },
                {
                    text: 'Aqui se admitem deslizes pontuais, sejam de projeto e/ou de desenvolvimento',
                }
            ]
        },
    ],
    [
        {
            nota: 0,
            color: 'green',
            items: [
                {
                    section: '1',
                    text: 'Projeto de texto com poucas falhas',
                }
            ]
        },
        {
            nota: 40,
            color: 'green',
            items: [
                {
                    section: '1',
                    text: 'Competencia 1',
                }
            ]
        },
        {
            nota: 80,
            color: 'green',
            items: [
                {
                    section: '1',
                    text: 'Competencia 1',
                }
            ]
        },
        {
            nota: 120,
            color: 'green',
            items: [
                {
                    section: '1',
                    text: 'Competencia 1',
                }
            ]
        },
        {
            nota: 160,
            color: 'green',
            items: [
                {
                    section: '1',
                    text: 'Competencia 1',
                }
            ]
        },
    ],
    [
        {
            nota: 0,
            color: 'green',
            items: [
                {
                    section: '1',
                    text: 'Competencia 1',
                }
            ]
        },
        {
            nota: 40,
            color: 'green',
            items: [
                {
                    section: '1',
                    text: 'Competencia 1',
                }
            ]
        },
        {
            nota: 80,
            color: 'green',
            items: [
                {
                    section: '1',
                    text: 'Competencia 1',
                }
            ]
        },
        {
            nota: 120,
            color: 'green',
            items: [
                {
                    section: '1',
                    text: 'Competencia 1',
                }
            ]
        },
        {
            nota: 160,
            color: 'green',
            items: [
                {
                    section: '1',
                    text: 'Competencia 1',
                }
            ]
        },
    ],
]