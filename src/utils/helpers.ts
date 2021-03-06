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

        redacoes.filter(item => notaTotalRedacao(item) != 0).map(item => {
            ultimasNotas.push(notaTotalRedacao(item));
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
                meses: "1 m??s",
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
    //console.log("chegou aqui ==>")

    if (redacao) {
        var ultimasNotas: number[][] = [];
        //console.log("chegou aqui ==>")

        //console.log("redacao ======> ", redacao)
        redacao.correcaos.filter((correcao:any) => correcao.discrepante == false ).map((correcoes: any, index: number) => {
            var ultimaNotaCalc = 0;
            //console.log("correcoes ==> ", correcoes);
            correcoes?.competencias?.map((competencia: any) => {
                ultimaNotaCalc = ultimaNotaCalc + competencia.nota;
            });
            ultimasNotas.push([ultimaNotaCalc]);
        })


        //console.log("chegou aqui redacao.correcaos.map ==>")


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
    var correcoes = redacao.correcaos ?? []
    var discrepante = false;
    var notaTotalPorCorrecao: any[] = [];
    var notaPorCompetencia: number[][] = [];

    // check Discrepancia Nota por competencia 
    if (correcoes.length > 0) {

        // map correcoes para pegar cada correcao e fazer um map.
        // tamb??m tem um filtro para separar correcoes j?? discrepantes
        /** entrada: 
         * @correcao any
         * @indexCorrecao type number
         * 
         * ir?? popular notaPorCompetencia | notaTotalPorCorrecao
         */

        //console.log("init ==> ", correcoes);
        var initCount = 0
        correcoes.filter((correcao: any) => correcao.discrepancia != true).map((correcao: any, indexCorrecao: number) => {

            initCount++;
            notaPorCompetencia.push([]);

            //console.log("competenciasBug => ", correcao.competencias);

            correcao.competencias?.map((competencia: any) => {

                notaPorCompetencia[indexCorrecao].push(competencia.nota)
                notasPorCompetencia = notasPorCompetencia + competencia.nota;
                return correcao;
            });

            notaTotalPorCorrecao.push(notasPorCompetencia)
            notasPorCompetencia = 0;
            return correcao;
        })

        //console.log(" fim count ===> ", initCount, " notaTotalPorCorrecao ====> ", notaTotalPorCorrecao, " =====> ", notaPorCompetencia)

    }

    // CHeck discrepancia nas notas por competencia com valores para calc
    if (notaPorCompetencia.length > 0 && (notaPorCompetencia.length % 2) == 0) {
        notaPorCompetencia.filter(notas => notas.length == 5).forEach((notas: any, indexNotas: number) => {
            // checa se o n??mero ?? par antes de calcular, lembrando que apenas numeros pares ser??o calculados
            if ((indexNotas % 2) == 0){
                notas.forEach((nota: number, indexNota: number) => {
                    let calculoDiscrepancia
                    calculoDiscrepancia = nota - notaPorCompetencia[indexNotas + 1][indexNota];
                    if(discrepante == false)
                        discrepante = Math.abs(calculoDiscrepancia) > notaParaDiscrepancia
                })
            }
        })
    } else??{
        //console.log("calculo deu merda, entrou no else notaPorCompetencia")
    }


    //console.log("notaPorCompetencia ?? discrepante? ", discrepante)

    // CHeck discrepancia na nota total com valores para calc
    if (notaTotalPorCorrecao.length > 0 && (notaPorCompetencia.length % 2) == 0) {
        notaTotalPorCorrecao.map((nota,index) => {??

            let calculoDiscrepancia
            calculoDiscrepancia = nota - notaTotalPorCorrecao[ index + 1];
            if(discrepante == false)
                discrepante = Math.abs(calculoDiscrepancia) > notaParaDiscrepancia
        })
    }else{
        //console.log("calculo deu merda, entrou no else notaTotalPorCorrecao")
    }


    //console.log("notaTotal ?? discrepante? ", discrepante)
    return discrepante;
}

export const mediaRedacoeNotaFinal = (redacao: any) => {
    var correcoesExistents = redacao.correcoes.length

    if (correcoesExistents > 0) {
        //console.log(" if ===> ")

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
        title: 'Compet??ncia I',
        nota: -1,
        obs: '',
        obs_enem: null,
    },
    {
        title: 'Compet??ncia II',
        nota: -1,
        obs: '',
        obs_enem: null,
    },
    {
        title: 'Compet??ncia III',
        nota: -1,
        obs: '',
        obs_enem: null,
    },
    {
        title: 'Compet??ncia IV',
        nota: -1,
        obs: '',
        obs_enem: null,
    },
    {
        title: 'Compet??ncia V',
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
                    text: 'Estrutura sint??tica inexistente (independentemente da quantidade de desvios)',
                }
            ]
        },
        {
            nota: 40,
            color: 'ciano',
            items: [
                {
                    section: '1',
                    text: 'Estrutura sint??tica com muitos desvios',
                }
            ]
        },
        {
            nota: 80,
            color: 'ciano',
            items: [
                {
                    section: '2',
                    text: 'Estrutura sint??tica deficit??ria OU muitos desvios',
                }
            ]
        },
        {
            nota: 120,
            color: 'ciano',
            items: [
                {
                    section: '3',
                    text: 'Estrutura sint??tica regular E alguns desvios',
                }
            ]
        },
        {
            nota: 160,
            color: 'ciano',
            items: [
                {
                    section: '4',
                    text: 'Estrutura sint??tica boa E poucos desvios',
                }
            ]
        },
        {
            nota: 200,
            color: 'ciano',
            items: [
                {
                    section: '5',
                    text: 'Estrutura sint??tica excelente (no m??ximo, uma falha) E, no m??ximo, dois desvios',
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
                    text: 'Tang??ncia ao tema',
                },
                {
                    section: 'OU',
                    text: '*Tra??o composto por aglomerado de palavras OU *Tra??os constantes de outros tipos textuais',
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
                    text: '* 3 partes do texto (2 delas embrion??rias) OU * Conclus??o finalizada por frase incompleta',
                },
                {
                    text: 'Textos que apreentam muitos trechos de c??pias dos textos motivadores n??o devem ultrapassar esse n??vel'
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
                    text: '* 3 partes do texto (1 dela pode ser embrion??ria)',
                },
                {
                    section: 'E',
                    text: '*Repert??rio baseado nos textos motivadores E/OU * Repert??rio n??o legitimado E/OU * Repert??rio legitimado, MAS n??o pertinente ao tema',
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
                    text: '* 3 partes do texto (nenhuma delas embrion??ria)',
                },
                {
                    section: 'E',
                    text: '*Repert??rio legitimado E pertinente ao tema, SEM uso produtivo',
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
                    text: '3 partes do texto (nenhuma delas embrion??ria)',
                },
                {
                    section: 'E',
                    text: '*Repert??rio legitimado E pertinente ao tema, COM uso produtivo',
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
                    text: 'Tangente ao tema e sem dire????o',
                }
            ]
        },
        {
            nota: 40,
            color: 'blue',
            items: [
                {
                    section: '1',
                    text: 'Tang??ncia ao tema',
                },
                {
                    section: 'OU',
                    text: 'Abordagem completa do tema e sem dire????o',
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
                    text: 'Sem desenvolvimento ou com desenvolvimento de apenas uma informa????o, fato ou opini??o',
                },
                {
                    text: 'Textos que apresentam contradi????o grave n??o devem ultrapassar este n??vel',
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
                    text: 'Desenvolvimento de algumas informa????es, fatos e opini??es',
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
                    text: 'Desenvolvimento da maior partes das informa????es, fatos e opini??es',
                }
            ]
        },
        {
            nota: 200,
            color: 'blue',
            items: [
                {
                    section: '5',
                    text: 'Projeto de texto estrat??gico',
                },
                {
                    section: 'E',
                    text: 'Desenvolvimento das informa????es, fatos e opini??es em todo o texto',
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
                    text: 'Palavras e per??odos justapostos e desconexos ao longo de todo o texto, o que demonstra aus??ncia de articula????o.',
                }
            ]
        },
        {
            nota: 40,
            color: 'orange',
            items: [
                {
                    section: '1',
                    text: 'Presen??a rara de elementos coesivos inter e/ou intrapar??grafos E/OU excessivas repeti????es E/OU excessivas inadequa????es.',
                }
            ]
        },
        {
            nota: 80,
            color: 'orange',
            items: [
                {
                    section: '2',
                    text: 'Presen??a pontual de elementos coesivos inter e/ou intrapar??grafos E/OU muitas repeti????es E/OU muitas inadequa????es.',
                },
                {
                    text: 'Textos em forma de monobloco n??o devem ultrapassar este n??vel.'
                }
            ]
        },
        {
            nota: 120,
            color: 'orange',
            items: [
                {
                    section: '3',
                    text: 'Presen??a regular de elementos coesivos inter E/OU intrapar??grafos E/OU algumas repeti????es E/OU algumas inadequa????es.',
                }
            ]
        },
        {
            nota: 160,
            color: 'orange',
            items: [
                {
                    section: '4',
                    text: 'Presen??a constante de elementos coesivos inter* e intrapar??grafos E/OU poucas repeti????es E/OU poucas inadequa????es. \n*Havendo elemento coesivo de tipo "operador argumentativo" entre par??grafos em, pelo menos, 01 momento do texto.',
                }
            ]
        },
        {
            nota: 200,
            color: 'orange',
            items: [
                {
                    section: '5',
                    text: 'Presen??a constante de elementos coesivos inter* e intrapar??grafos E raras repeti????es ou ausentes repeti????es E sem inadequa????o. \n*Havendo elemento coesivo de tipo "operador argumentativo" entre par??grafos em, pelo menos, 02 momento do texto e, pelo menos, 01 elemento coesivo de qualquer tipo dentro de todos os par??grafos.',
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
                    text: '*Aus??ncia de proposta ou c??pia integral de proposta OU \n*Proposta de interven????o que desrespeita os direitos humanos OU \n*Proposta de interven????o n??o relacionada sequer ao assunto.',
                }
            ]
        },
        {
            nota: 40,
            color: 'green',
            items: [
                {
                    section: '1',
                    text: '*Tangenciamento do tema OU \n*Apenas elemento(s) nulo(s) OU \n*1 elemento v??lido',
                }
            ]
        },
        {
            nota: 80,
            color: 'green',
            items: [
                {
                    section: '2',
                    text: '2 elemenos v??lidos',
                },
                {
                    text: 'Estruturas condicionais com 2 ou mais elemntos v??lidos n??o devem ultrapassar este n??vel',
                }
            ]
        },
        {
            nota: 120,
            color: 'green',
            items: [
                {
                    section: '3',
                    text: '3 elementos v??lidos',
                }
            ]
        },
        {
            nota: 160,
            color: 'green',
            items: [
                {
                    section: '4',
                    text: '4 elementos v??lidos',
                }
            ]
        },
        {
            nota: 200,
            color: 'green',
            items: [
                {
                    section: '5',
                    text: '5 elementos v??lidos',
                }
            ]
        },
    ],
]