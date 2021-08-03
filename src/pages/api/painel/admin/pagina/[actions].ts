import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { IPagina } from '../../../../../hooks/paginaStore'
import Pagina from '../../../../../models/pagina'
import dbConnect from '../../../../../services/mongodb'
import { ERROR_NOT_LOGGED } from '../../../constants'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req })
    const { actions } = req.query;


    await dbConnect();
    
    console.log('actions', actions)
    if (session) {
        switch (actions) {

            case 'getAll':
                if (req.method === 'POST') {
                    const { isFaq, page } = req.body;
                    const limitPerPage = 10; 
                    const skip = page == 1 ? 0 : page * limitPerPage;
                    console.log('isFaq', isFaq);

                    try {
                        const paginas = await Pagina.find({ isFaq: isFaq }).limit(limitPerPage).skip(skip).sort({createdAt: 'desc'});

                        if(!paginas) throw new Error("Nenhuma página encontrada!");
                        
                        return res.status(200).send({ error: false, data: paginas });
                    } catch (error) {
                        return res.status(500).send({ error: true, errorMessage: error.message });
                    }
                }
                break;
            
            case 'read':
                if (req.method === 'POST') {
                    const { id } = req.body;
                    try {
                        const pagina = await Pagina.findOne({_id: id});

                        if(!pagina) throw new Error("Página não encontrada!");
                        
                        return res.status(200).send({error: false, data: pagina });
                    } catch (error) {
                        return res.status(500).send({ error: true, errorMessage: error.message });
                    }
                }
                break;

            case 'create':
                if (req.method === 'POST') {
                    const { title, contentHtml, isFaq  } : IPagina = req.body;
                    try {
                        if(!title && !contentHtml) throw new Error("Necessário titulo e preencher o conteúdo da página.");
                        await Pagina.create({
                            title,
                            contentHtml,
                            isFaq
                        })

                        return res.status(200).send({ error: false, data: { message: 'criada com sucesso! '}});
                    } catch (error) {
                        return res.status(500).send({ error: true, errorMessage: error.message });
                    }
                }
                break;
            
            case 'update':
                if (req.method === 'POST') {
                    const { id, title, contentHtml } = req.body;
                    try {
                        await Pagina.updateOne({_id: id }, {title, contentHtml});
                        return res.status(200).send({error: false, data: {message: 'Salvo com sucesso!' }});
                    } catch (error) {
                        return res.status(500).send({ error: true, errorMessage: error.message });
                    }
                }
                break;

            case 'delete':
                if (req.method === 'POST') {
                    try {
                        const { id } = req.body;
                        await Pagina.deleteOne({_id: id});
                        return res.status(200).send({ error: false, data: { message: 'Deletado com sucesso!'}});
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