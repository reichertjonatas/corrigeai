import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { IPagina } from '../../../../data/paginaStore'
import Pagina from '../../../../models/pagina'
import Tema, { ITemas } from '../../../../models/tema'
import User, { IRedacoes } from '../../../../models/user'
import dbConnect from '../../../../services/mongodb'
import { ERROR_NOT_LOGGED } from '../../constants'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req })
    const { actions } = req.query;


    await dbConnect();

    console.log('actions', actions)
    if (session) {
        switch (actions) {

            case 'getAll':
                if (req.method === 'POST') {
                    try {
                        const response = await Tema.find({ visible: true });
                        if (!response) throw new Error("Nenhuma tema encontrado!");
                        return res.status(200).send({ error: false, data: response });
                    } catch (error) {
                        return res.status(500).send({ error: true, errorMessage: error.message });
                    }
                }
                break;
            case 'read':
                if (req.method === 'POST') {
                    const { id } = req.body;
                    try {
                        const response = await User.findOne({ email: session.user!.email, 'redacoes.id': id as number });
                        if (!response) throw new Error("Página não encontrada!");
                        return res.status(200).send({ error: false, data: response.redacoes });
                    } catch (error) {
                        return res.status(500).send({ error: true, errorMessage: error.message });
                    }
                }
                break;

            case 'create':
                if (req.method === 'POST') {
                    const { tema, content, category, visible }: ITemas = req.body;
                    try {
                        if (!tema)
                            throw new Error("Necessário enviar a redacao.");

                        await Tema.create({
                            tema,
                            content,
                        });

                        return res.status(200).send({ error: false, data: { message: 'Tema criado com sucesso! ' } });
                    } catch (error) {
                        return res.status(500).send({ error: true, errorMessage: error.message });
                    }
                }
                break;

            case 'update':
                if (req.method === 'POST') {
                    const { id, title, contentHtml } = req.body;
                    try {
                        await Pagina.updateOne({ _id: id }, { title, contentHtml });
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
                        await Pagina.deleteOne({ _id: id });
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