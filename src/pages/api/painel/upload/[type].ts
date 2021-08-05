import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import dbConnect from '../../../../services/mongodb'
import { ERROR_NOT_LOGGED } from '../../constants'
import formidable from "formidable";
import fs from "fs";
import { uniqueFileName } from '../../../../utils/helpers';
import multer from 'multer';
import nextConnect from 'next-connect';


// let fileName: string;

// const upload = () => {
//     return multer({
//         storage: multer.diskStorage({
//             destination: `./public/upload/protected/redacoes/`,
//             filename: (req, file, cb) => { 
//                 const fileName = `kb_redacao_${uniqueFileName()}_${file.originalname}`;
//                 return cb(null, fileName);
//             },
//         }),
//     })
// };


// const apiRoute = nextConnect({
//     onError(error, req: NextApiRequest, res: NextApiResponse) {
//         res.status(501).json({ error: true, data: { message: `Sorry something Happened! ${error.message}` } });
//     },
//     onNoMatch(req, res) {
//         res.status(405).json({ error: true, data: { message: `Method '${req.method}' Not Allowed` } });
//     },
// });


// apiRoute.use(upload().array('file'));

// apiRoute.post((req, res) => {
//     res.status(200).json({ error: false, data: { fileName: fileName } });
// });

// export default apiRoute;

// export const config = {
//     api: {
//         bodyParser: false
//     }
// };


const saveFile = async (file: any, type: string) => {
    let pathArquivo;

    switch (type) {
        case 'perfil':
            pathArquivo = 'upload/perfil';
        case 'tema':
            pathArquivo = 'upload/temas';
        default:
            pathArquivo = 'upload/protected/redacoes';
            break;
    }
    const data = fs.readFileSync(file.path);
    const fileName = `kb_redacao_${uniqueFileName()}_${file.name}`;
    fs.writeFileSync(`./public/${pathArquivo}/${fileName}`, data);
    fs.unlinkSync(file.path);
    return fileName;
};


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req })
    const { type } = req.query;

    await dbConnect();

    if (session) {
        switch (type) {
            case 'redacao':
                try {
                    if (req.method === 'POST') {
                        const form = new formidable.IncomingForm();
                        form.parse(req, async function (err, fields, files) {
                            const fileName = await saveFile(files.file, type);
                            return res.status(200).send({
                                error: false, data: {
                                    fileName,
                                }
                            });
                        });

                    } else
                        throw new Error("Requisição invalida!");
                } catch (error) {
                    return res.status(500).send({ error: true, errorMessage: error.message });
                }
                break;

            default:
                res.send({ error: true, errorMessage: 'Requisição invalida!' });
                break;
        }
    } else {
        res.send({ error: true, errorMessage: ERROR_NOT_LOGGED })
    }
}

export default handler;