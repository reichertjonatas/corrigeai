import { ObjectId } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { ICorrecoes, IRedacoes } from '../../../../models/User'
import { notaTotalRedacao } from '../../../../utils/helpers'
import { ERROR_NOT_LOGGED } from '../../constants'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req })
    const { actions } = req.query;



    console.log('actions', actions)
    if (session) {
        switch (actions) {
            case 'getAll':
                if (req.method === 'POST') {
                    try {
                        // const response = await User.findOne({ email: session.user!.email });
                        // if (!response) throw new Error("Nenhuma página encontrada!");
                        // return res.status(200).send({ error: false, data: response.redacoes });
                        return res.status(500).send({ error: true, data: '' });
                    } catch (error) {
                        return res.status(500).send({ error: true, errorMessage: error.message });
                    }
                }
                break;
            case 'getAllSeusEnvios':
                if (req.method === 'POST') {
                    try {
                        //const response = await User.findOne({ email: session.user!.email }, { redacoes: { $slice:[0, 12]} }).sort({ 'redacoes.createdAt' : -1 });
                        
                        
                        // const response = await User.aggregate([
                        //     { $match: { email: session.user!.email } },
                        //     { $unwind: { path: "$redacoes" } },
                        //     { $sort: { 'redacoes.createdAt': -1 } },
                        //     { $group: { _id: "$_id", arrayRedacao: { $push: "$redacoes" } } },
                        // ]);

                        // console.log("====> aggregate ", response)
                        // if (response.length === 0)
                        //     return res.status(200).send({ error: false,  data: [] });

                        // return res.status(200).send({ error: false, data: response[0].arrayRedacao });
                    } catch (error) {
                        return res.status(500).send({ error: true, errorMessage: error.message });
                    }
                }
                break;
            case 'getAllCorretor':
                if (req.method === 'POST') {
                    const { page, revisaoType } = req.body;
                    const limitPerPage = 10;
                    const skip = page == 1 ? 0 : page * limitPerPage;
                    
                    try {
                    //     const aggregate = await User.aggregate([
                    //         { $match: { 'redacoes': { $exists: true, $not: { $size: 0 } } } },
                    //         {
                    //             $project: {
                    //                 email: 1,
                    //                 redacoes: {
                    //                     $filter: {
                    //                         input: "$redacoes",
                    //                         as: "redacao",
                    //                         cond: {
                    //                             $eq: [{ $size: "$$redacao.correcoes" }, revisaoType]
                    //                         }
                    //                     }
                    //                 }
                    //             }
                    //         },
                    //     ]);

                    //     if (!aggregate) throw new Error("Nenhuma redação corrigida!");

                        return res.status(500).send({ error: true, data: '' });
                    } catch (error) {
                        return res.status(500).send({ error: true, errorMessage: error.message });
                    }
                }
                break;
            case 'getMinhasCorrecoes':
                if (req.method === 'POST') {
                    const { page } = req.body;
                    const limitPerPage = 10;
                    const skip = page == 1 ? 0 : page * limitPerPage;
                    
                    try {
                        // const user = await User.findOne({ email: session.user!.email });

                        // const aggregate = await User.aggregate([
                        //     { $match: { 'redacoes': { $exists: true, $not: { $size: 0 } } } },
                        //     { $limit: 15 },
                        //     { $unwind: { path: "$redacoes" } },
                        //     { $sort: { 'redacoes.createdAt': -1 } },
                        //     { $group: { 
                        //         _id: "$_id",
                        //         email: { $first : "$email" },
                        //         redacoes: { $push: "$redacoes" } } 
                        //     },
                        //     {
                        //         $project: {
                        //             email: 1,
                        //             redacoes: {
                        //                 $map: {
                        //                     input: "$redacoes",
                        //                     as: "redacao",
                        //                     in: {
                        //                         tema_redacao: '$$redacao.tema_redacao',
                        //                         nota_final: '$$redacao.nota_final',
                        //                         createdAt: '$$redacao.createdAt',
                        //                         correcoes: {
                        //                             $filter: {
                        //                                 input: "$$redacao.correcoes",
                        //                                 as: "correcao",
                        //                                 cond: {
                        //                                     $eq: ["$$correcao.corretor",  user._id ]
                        //                                 }
                        //                             }
                        //                         }
                        //                     }
                        //                 }
                        //             }
                        //         }
                        //     },
                        // ]);
                        // if (!aggregate) throw new Error("Nenhuma redação corrigida!");
                        // return res.status(200).send({ error: false, data: aggregate });

                        return res.status(500).send({ error: true, data: '' });
                    } catch (error) {
                        return res.status(500).send({ error: true, errorMessage: error.message });
                    }
                }
                break;
            case 'readCorretor':
                if (req.method === 'POST') {
                    const { _id } = req.body;
                    try {
                        
                        // const user = await User.findOne({ email: session.user!.email }).select({
                        //     _id: 1
                        // });

                        // const response = await User.findOne({ 'redacoes._id': _id }).select({
                        //     'redacoes.$': 1, email: 1
                        // });

                        // if (!response) throw new Error("Redação não encontrada!");

                        // return res.status(200).send({ error: false, corretorId: user._id, data: response.redacoes[0] });

                        return res.status(500).send({ error: true, data: '' });
                    } catch (error) {
                        return res.status(500).send({ error: true, errorMessage: error.message });
                    }
                }
                break;

            case 'read':
                if (req.method === 'POST') {
                    const { _id } = req.body;
                    try {
                        // const response = await User.findOne({ email: session.user!.email, 'redacoes._id': _id });
                        // if (!response) throw new Error("Redação não encontrada!");
                        // return res.status(200).send({ error: false, data: response.redacoes });
                        return res.status(500).send({ error: true, data: '' });
                    } catch (error) {
                        return res.status(500).send({ error: true, errorMessage: error.message });
                    }
                }
                break;

            case 'create':
                if (req.method === 'POST') {
                    const { redacao, tema: { title } }: IRedacoes = req.body;
                    try {

                        // const me = await User.findOne({ email: session.user!.email });

                        // if (!redacao)
                        //     throw new Error("Necessário enviar a redacao.");

                        // if (!title)
                        //     throw new Error("Necessário escolher o tema.");

                        // if (!me)
                        //     throw new Error("utilizador não autenticado!");

                        // if (me.subscription.envios == 0)
                        //     throw new Error("Você não possui envios disponíveis!");


                        // await User.updateOne({ email: session.user!.email }, {
                        //     $push: {
                        //         redacoes: {
                        //             $each: [{ redacao, title }],
                        //         }
                        //     }
                        // });

                        // await User.updateOne({ email: session.user!.email }, {
                        //     $set: { 'subscription.envios': me.subscription.envios >= 0 ? me.subscription.envios - 1 : 0 }
                        // });

                        return res.status(500).send({ error: true, data: '' });
                    } catch (error) {
                        return res.status(500).send({ error: true, errorMessage: error.message });
                    }
                }
                break;


            case 'updateCorretor':
                if (req.method === 'POST') {
                    const { _id, correcao }: { correcao: ICorrecoes, _id: string } = req.body;
                    try {
                        // const user = await User.findOne({ 'redacoes._id': _id });

                        // var ultimaNotaCalc = 0;
                        // var correcoesExistents = 0;

                        // user.redacoes.map((redacao: any) => {
                        //     if (redacao._id == _id) {
                        //         console.log(" ==> ", redacao.correcoes.length)
                        //         correcoesExistents = correcoesExistents + redacao.correcoes.length;
                        //     }
                        // })


                        // if (correcoesExistents > 0) {
                        //     console.log(" if ===> ")
                        //     var notasDB: number[] = [];

                        //     const redacoes = user.redacoes as IRedacoes[];
                        //     console.log("==========> ", redacoes)

                        //     redacoes.map((redacao: IRedacoes) => {
                        //         if (redacao._id == _id) {
                        //             const notaTotal = notaTotalRedacao(redacao);
                        //             console.log("==========> ", notaTotal)
                        //             notasDB.push(notaTotal)
                        //         }
                        //     })

                        //     var ultimasMedias = 0;
                        //     notasDB.map(item => {
                        //         ultimasMedias = ultimasMedias + item;
                        //     })

                        //     ultimaNotaCalc = Math.round(ultimasMedias / notasDB.length);
                        //     console.log(" ==>==>==>==> ", ultimaNotaCalc);

                        //     var atualNota = 0;
                        //     correcao.competencias.map(item => {
                        //         atualNota = atualNota + item.nota;
                        //         return item;
                        //     })
                            
                        // //     ultimaNotaCalc = Math.round((atualNota + ultimaNotaCalc) / 2)
                        // } else {
                        //     console.log(" else ===> ")
                        //     correcao.competencias.map(item => {
                        //         ultimaNotaCalc = ultimaNotaCalc + item.nota;
                        //         return item;
                        //     })
                        // }

                        // await User.updateOne({ 'redacoes._id': _id }, {
                        //     $set: { 'redacoes.$.nota_final': ultimaNotaCalc }
                        // });

                        // await User.updateOne({ 'redacoes._id': _id }, {
                        //     $push: { 'redacoes.$.correcoes': { ...correcao, corretor: user.id } }
                        // });

                        return res.status(200).send({ error: false, data: { message: 'Salvo com sucesso!' } });
                    } catch (error) {
                        return res.status(500).send({ error: true, errorMessage: error.message });
                    }
                }
                break;

            case 'update':
                if (req.method === 'POST') {
                    const { id, title, contentHtml } = req.body;
                    try {
                        // await Pagina.updateOne({ _id: id }, { title, contentHtml });
                        return res.status(200).send({ error: false, data: { message: 'Salvo com sucesso!' } });
                    } catch (error) {
                        return res.status(500).send({ error: true, errorMessage: error.message });
                    }
                }
                break;
            case 'delete':
                if (req.method === 'POST') {
                    try {
                        const { id } = req.body;
                        // await Pagina.deleteOne({ _id: id });
                        return res.status(200).send({ error: false, data: { message: 'Deletado com sucesso!' } });
                    } catch (error) {
                        return res.status(500).send({ error: true, errorMessage: error.message });
                    }
                } else {
                    return res.send({ error: true, errorMessage: ERROR_NOT_LOGGED })
                }
                break;
            default:
                return res.status(404).send({})

        }
    } else {
        return res.send({ error: true, errorMessage: ERROR_NOT_LOGGED })
    }
}

export default handler;