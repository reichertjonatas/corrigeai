import { getSession } from "next-auth/client"
import { competencia } from "../components/icons";
import { ICalenderEvents, IObsEnem, IRedacoes } from "../models/User"
import { API } from "../services/api";
import { debugPrint } from "./debugPrint";

export const corretor_type = (corretor_turma: string) => {
    return corretor_turma == 'turma_um' ? 'correcao_um' : 'correcao_dois';
}


export function datecomp(d1: any, d2: any) {
    var a1 = d1.split("/");
    var a2 = d2.split("/");
    a1 = a1[2] + a1[0] + a1[1];
    a2 = a2[2] + a2[0] + a2[1];
    return (parseInt(a1) - parseInt(a2));
}

export const mediaGeral = (redacoes: any[]) => {
    if (redacoes.length > 0) {
        var ultimasNotas: number[] = [];

        redacoes.filter(item => item.nota_final != 0).map(item => {
            ultimasNotas.push(item.nota_final);
            return item;
        })

        debugPrint(" ===> ", ultimasNotas.length)

        if (ultimasNotas.length > 0) {
            var mediaGeralCalc = 0;
            ultimasNotas.map(item => {
                mediaGeralCalc = mediaGeralCalc + item
                return item;
            });
            return Math.round(mediaGeralCalc / ultimasNotas.length) == 0 ? '---' : Math.round(mediaGeralCalc / ultimasNotas.length);
        } else {
            return 0;
        }
    }
}

export const capitalizeTxt = (txt: any) => {
    return txt[0].toUpperCase() + txt.slice(1);// txt.charAt(0).toUpperCase() + txt.slice(1); //or if you want lowercase the rest txt.slice(1).toLowerCase();
}

export interface ICheckoutPlano {
    loaded: boolean, data: null | IPlano;
}

export interface IPlano {
    plano_type: number;
    parcela_number: number;
    total_envios: number,
    days: number,
    plano: string;
    meses: string;
    total: string;
    parcelamento: string;
    infos: string[]

}


export const PLANOS = (plano_id: number) => {
    switch (plano_id) {
        case 1395688:
            return <IPlano>{

                plano_type: 1,
                parcela_number: 1,
                total_envios: 8,
                days: 30,

                plano: "Acesso Mensal",
                meses: "1 mês",
                total: "R$ 80,00",
                parcelamento: "1x",
                infos: ["", "", ""]

            }
        default:
            return null
    }
}
export const numeroRomano = (numero: number) => {
    switch (numero) {
        case 2:
            return 'II'
        case 3:
            return 'III'
        case 4:
            return 'IV'
        case 5:
            return 'V'
        default:
            return 'I'
    }
}
export const notaTotalRedacao = (redacao: any) => {
    console.log("chegou aqui ==>")
    if (redacao) {
        var ultimasNotas: number[][] = [];
        console.log("chegou aqui ==>")

        redacao.correcaos.map((correcoes: any, index: number) => {
            var ultimaNotaCalc = 0;
            console.log("correcoes ==> ", correcoes);
            correcoes.competencias.map((competencia: any) => {
                ultimaNotaCalc = ultimaNotaCalc + competencia.nota;
            })
            ultimasNotas.push([ultimaNotaCalc]);
        })
        console.log("chegou aqui redacao.correcaos.map ==>")


        if (ultimasNotas.length > 0) {
            var mediasNotas: number[] = [];
            ultimasNotas.map(ultimaNota => {
                var mediaGeralCalc = 0;
                ultimaNota.map(item => {
                    mediaGeralCalc = mediaGeralCalc + item
                    return item;
                });
                mediasNotas.push(Math.round(mediaGeralCalc / ultimaNota.length));
            })
            if (mediasNotas.length > 0) {
                var mediaFinal = 0;
                mediasNotas.map(item => {
                    mediaFinal = mediaFinal + item
                    return item;
                })
                return Math.round(mediaFinal / mediasNotas.length);
            }
            return 0;
        } else {
            return 0;
        }
    }
    return 0;
}


/** Discrepancia calc */
export const notaTotalCorrecao = (correcao: any) => {
    var notaTotalCorrecao: number = 0;

    correcao.competencias.map((item: any) => {
        notaTotalCorrecao = notaTotalCorrecao + item.nota;
        return item;
    })

    return notaTotalCorrecao;
}

export const checkDiscrepancia = (redacao: any, notaParaDiscrepancia: any) => {
    var notasPorCompetencia = 0;
    var correcoes = redacao.correcaos
    var discrepante = false;
    var notaTotalPorCorrecao: any[] = [];
    var notaPorCompetencia: number[][] = [];

    // check Discrepancia Nota por competencia 
    if (correcoes.length > 0) {

        // map correcoes para pegar cada correcao e fazer um map.
        // também tem um filtro para separar correcoes já discrepantes
        /** entrada: 
         * @correcao any
         * @indexCorrecao type number
         * 
         * irá popular notaPorCompetencia | notaTotalPorCorrecao
         */

        console.log("init ==> ", correcoes);
        var initCount = 0
        correcoes.filter((correcao: any) => correcao.discrepancia != true).map((correcao: any, indexCorrecao: number) => {

            initCount++;
            notaPorCompetencia.push([]);

            correcao.competencias.map((competencia: any) => {

                notaPorCompetencia[indexCorrecao].push(competencia.nota)
                notasPorCompetencia = notasPorCompetencia + competencia.nota;
                return correcao;
            });

            notaTotalPorCorrecao.push(notasPorCompetencia)
            notasPorCompetencia = 0;
            return correcao;
        })

        console.log(" fim count ===> ", initCount, " notaTotalPorCorrecao ====> ", notaTotalPorCorrecao, " =====> ", notaPorCompetencia)

    }

    // CHeck discrepancia nas notas por competencia com valores para calc
    if (notaPorCompetencia.length > 0 && (notaPorCompetencia.length % 2) == 0) {
        notaPorCompetencia.filter(notas => notas.length == 5).forEach((notas: any, indexNotas: number) => {
            // checa se o número é par antes de calcular, lembrando que apenas numeros pares serão calculados
            if ((indexNotas % 2) == 0){
                notas.forEach((nota: number, indexNota: number) => {
                    let calculoDiscrepancia
                    calculoDiscrepancia = nota - notaPorCompetencia[indexNotas + 1][indexNota];
                    if(discrepante == false)
                        discrepante = Math.abs(calculoDiscrepancia) > notaParaDiscrepancia
                })
            }
        })
    } else {
        console.log("calculo deu merda, entrou no else notaPorCompetencia")
    }


    console.log("notaPorCompetencia é discrepante? ", discrepante)

    // CHeck discrepancia na nota total com valores para calc
    if (notaTotalPorCorrecao.length > 0 && (notaPorCompetencia.length % 2) == 0) {
        notaTotalPorCorrecao.map((nota,index) => { 

            let calculoDiscrepancia
            calculoDiscrepancia = nota - notaTotalPorCorrecao[ index + 1];
            if(discrepante == false)
                discrepante = Math.abs(calculoDiscrepancia) > notaParaDiscrepancia
        })
    }else{
        console.log("calculo deu merda, entrou no else notaTotalPorCorrecao")
    }


    console.log("notaTotal é discrepante? ", discrepante)
    return discrepante;
}

export const mediaRedacoeNotaFinal = (redacao: any) => {
    var correcoesExistents = redacao.correcoes.length

    if (correcoesExistents > 0) {
        console.log(" if ===> ")

    }
}
/** calc competencia */


export const mediaRedacaoPorCompetencia = (redacao: any, competencia: number) => {
    if (redacao) {
        var ultimasNotas: number[][] = [];
        debugPrint(" ===> ", redacao.correcaos.length)

        redacao.correcaos.map((correcoes: any, index: number) => {
            ultimasNotas.push([correcoes.competencias[competencia].nota]);
        })


        if (ultimasNotas.length > 0) {
            var mediasNotas: number[] = [];
            ultimasNotas.map(ultimaNota => {
                var mediaGeralCalc = 0;
                ultimaNota.map(item => {
                    mediaGeralCalc = mediaGeralCalc + item
                    return item;
                });
                mediasNotas.push(Math.round(mediaGeralCalc / ultimaNota.length));
            })
            if (mediasNotas.length > 0) {
                var mediaFinal = 0;
                mediasNotas.map(item => {
                    mediaFinal = mediaFinal + item
                    return item;
                })
                return Math.round(mediaFinal / mediasNotas.length);
            }
            return 0;
        } else {
            return 0;
        }
    }
    return 0;
}

export async function authRequired(ctx: any, userType?: number | null, isIndex?: boolean) {
    const session = await getSession(ctx)

    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: '/painel/entrar',
            }
        }
    }

    // if (isIndex) {
    //     switch (session!.user!.userType) {
    //         case 2:
    //             return {
    //                 redirect: {
    //                     permanent: false,
    //                     destination: '/painel/corretor',
    //                 }
    //             }
    //         case 3:
    //             return {
    //                 redirect: {
    //                     permanent: false,
    //                     destination: '/painel/admin',
    //                 }
    //             }
    //         default:
    //             return {
    //                 redirect: {
    //                     permanent: false,
    //                     destination: '/painel/aluno',
    //                 }
    //             }
    //     }
    // }

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
        title: 'Competência I',
        nota: -1,
        obs: '',
        obs_enem: null,
    },
    {
        title: 'Competência II',
        nota: -1,
        obs: '',
        obs_enem: null,
    },
    {
        title: 'Competência III',
        nota: -1,
        obs: '',
        obs_enem: null,
    },
    {
        title: 'Competência IV',
        nota: -1,
        obs: '',
        obs_enem: null,
    },
    {
        title: 'Competência V',
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
        {
            nota: 200,
            color: 'ciano',
            items: [
                {
                    section: '5',
                    text: 'Estrutura sintática excelente (no máximo, uma falha) E, no máximo, dois desvios',
                }
            ]
        },
    ],
    [
        {
            nota: 40,
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
            nota: 80,
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
            nota: 120,
            color: 'pink',
            items: [
                {
                    section: '3',
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
            nota: 160,
            color: 'pink',
            items: [
                {
                    section: '4',
                    text: 'Abordagem completa do tema',
                },
                {
                    section: 'E',
                    text: '* 3 partes do texto (nenhuma delas embrionária)',
                },
                {
                    section: 'E',
                    text: '*Repertório legitimado E pertinente ao tema, COM uso produtivo',
                }
            ]
        },
        {
            nota: 200,
            color: 'pink',
            items: [
                {
                    section: '5',
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
            nota: 200,
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
            color: 'orange',
            items: [
                {
                    section: '0',
                    text: 'Palavras e períodos justapostos e desconexos ao longo de todo o texto, o que demonstra ausência de articulação.',
                }
            ]
        },
        {
            nota: 40,
            color: 'orange',
            items: [
                {
                    section: '1',
                    text: 'Presença rara de elementos coesivos inter e/ou intraparágrafos E/OU excessivas repetições E/OU excessivas inadequações.',
                }
            ]
        },
        {
            nota: 80,
            color: 'orange',
            items: [
                {
                    section: '2',
                    text: 'Presença pontual de elementos coesivos inter e/ou intraparágrafos E/OU muitas repetições E/OU muitas inadequações.',
                },
                {
                    text: 'Textos em forma de monobloco não devem ultrapassar este nível.'
                }
            ]
        },
        {
            nota: 120,
            color: 'orange',
            items: [
                {
                    section: '3',
                    text: 'Presença regular de elementos coesivos inter E/OU intraparágrafos E/OU algumas repetições E/OU algumas inadequações.',
                }
            ]
        },
        {
            nota: 160,
            color: 'orange',
            items: [
                {
                    section: '4',
                    text: 'Presença constante de elementos coesivos inter* e intraparágrafos E/OU poucas repetições E/OU poucas inadequações. \n*Havendo elemento coesivo de tipo "operador argumentativo" entre parágrafos em, pelo menos, 01 momento do texto.',
                }
            ]
        },
        {
            nota: 200,
            color: 'orange',
            items: [
                {
                    section: '5',
                    text: 'Presença constante de elementos coesivos inter* e intraparágrafos E raras repetições ou ausentes repetições E sem inadequação. \n*Havendo elemento coesivo de tipo "operador argumentativo" entre parágrafos em, pelo menos, 02 momento do texto e, pelo menos, 01 elemento coesivo de qualquer tipo dentro de todos os parágrafos.',
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
                    section: '0',
                    text: '*Ausência de proposta ou cópia integral de proposta OU \n*Proposta de intervenção que desrespeita os direitos humanos OU \n*Proposta de intervenção não relacionada sequer ao assunto.',
                }
            ]
        },
        {
            nota: 40,
            color: 'green',
            items: [
                {
                    section: '1',
                    text: '*Tangenciamento do tema OU \n*Apenas elemento(s) nulo(s) OU \n*1 elemento válido',
                }
            ]
        },
        {
            nota: 80,
            color: 'green',
            items: [
                {
                    section: '2',
                    text: '2 elemenos válidos',
                },
                {
                    text: 'Estruturas condicionais com 2 ou mais elemntos válidos não devem ultrapassar este nível',
                }
            ]
        },
        {
            nota: 120,
            color: 'green',
            items: [
                {
                    section: '3',
                    text: '3 elementos válidos',
                }
            ]
        },
        {
            nota: 160,
            color: 'green',
            items: [
                {
                    section: '4',
                    text: '4 elementos válidos',
                }
            ]
        },
        {
            nota: 200,
            color: 'green',
            items: [
                {
                    section: '5',
                    text: '5 elementos válidos',
                }
            ]
        },
    ],
]