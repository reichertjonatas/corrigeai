import React from 'react'
import MainLayout from '../../../../../components/layout/MainLayout'
import Seo from '../../../../../components/layout/Seo'
import 'react-quill/dist/quill.snow.css'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { IPagina, usePaginaStore } from '../../../../../hooks/paginaStore'
import { useRouter } from 'next/dist/client/router'

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
    ssr: false,
})

function EditarFaq() {
    const router = useRouter()
    const { id } = router.query;

    React.useEffect(() => {
        if (router.asPath !== router.route) {
            // router.query.lang is defined
            read(id as string);
        }
        return () => setPageNull()
        // eslint-disable-next-line
    }, [router])

    console.log(id, 'id');
    const [editor, setEditor] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [isFaq, setIsFaq] = React.useState(false);
    const read = usePaginaStore((state) => state.read);
    const setPageNull = usePaginaStore((state) => state.setPageNull);
    const update = usePaginaStore((state) => state.update);
    const pagina = usePaginaStore((state) => state.pagina);

    const handlerSave = (e: any) => {
        e.preventDefault();
        const nPagina = { _id: pagina!._id, title: title, contentHtml: editor, isFaq: pagina!.isFaq } as IPagina;
        update(nPagina);
        router.push(`/painel/admin/comuns/${isFaq ? 'faq' : 'pagina'}`);
    }

    React.useEffect(() => {
        setEditor(pagina?.contentHtml ?? '');
        setTitle(pagina?.title ?? '');
        setIsFaq(pagina?.isFaq ?? false)
    }, [pagina])

    return (
        <MainLayout menuType={3}>
            <Seo title="Editar FAQ" />
            <div className="gridPlanejamento">
                <div className="content">
                    <div className="box">
                        <h1>Nome da Página</h1>
                        <span className="desc">
                            <form action="#">
                                <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
                                <span className="textarea">
                                    <QuillNoSSRWrapper value={editor} onChange={setEditor} theme="snow" />
                                </span>
                                <div className="botoes">
                                    <Link href={`/painel/admin/comuns/${isFaq ? 'faq' : 'pagina'}`} passHref>
                                        <a>
                                            <button className="delete">Voltar</button>
                                        </a>
                                    </Link>
                                    <button onClick={(e) => handlerSave(e)}>Salvar</button>
                                </div>
                            </form>
                        </span>
                    </div>
                </div>
            </div>
            <style jsx>
                {
                    `
                        .gridPlanejamento{display: grid; grid-template-columns: 1fr;}
                        .gridPlanejamento .content{display: block; width: 100%;}
                        .gridPlanejamento .content .box{display: block; width: 100%;border-radius: 0.75rem; background: var(--gray20); padding: 2.8125rem 1.5rem; position: relative; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
                        .gridPlanejamento .content .box h1{display: block; width: 100%; text-align: center; font-weight: 500; font-size: 1.6875rem; margin: 0 0 1.5rem}
                        .gridPlanejamento .content .box .desc{display: block; width: 100%; text-align: left; font-weight: 400; font-size: 1rem; color: #000}
                        .gridPlanejamento .content .box .desc p{margin: 0 0 1rem; font-weight: 400; font-size: 1rem; color: #000}
                        .gridPlanejamento .content .box .desc strong{font-weight: 500;}
                        .gridPlanejamento .content .box .desc img{max-width: 60%; margin: 0 auto;}
                        .gridPlanejamento .content .botao a{cursor: pointer; display: block; width: 100%; max-width: 400px; margin: 2rem auto; text-align: center; color: var(--gray20); font-family: 'Poppins', sans-serif; font-weight: 500; border-radius: 0.75rem; font-size: 1.2em; background: var(--dark); padding: 0.5125rem; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
                        .gridPlanejamento .content .botao a:hover{transform: scale(0.9);}

                        .gridPlanejamento .content .box .desc form{display: block; width: 100%;}
                        .gridPlanejamento .content .box .desc form input{display: block; width: 100%; padding: 1rem;font-family: 'Poppins', sans-serif; font-size: 1.2rem; border: 1px solid var(--gray30)}
                        .gridPlanejamento .content .box .desc form .textarea{display: block; width: 100%; margin: 1rem 0}
                        .gridPlanejamento .content .box .desc form .textarea textarea{display: block; width: 100%; padding: 1rem;font-family: 'Poppins', sans-serif; font-size: 1.1rem;border: 1px solid var(--gray30)}
                        .gridPlanejamento .content .box .desc form .botoes{display: flex; flex-direction: row; justify-content: flex-end; gap: 1rem;}
                        .gridPlanejamento .content .box .desc form .botoes button{cursor: pointer; transition: all 0.5s ease; display: block; padding: 1rem 1.5rem; cursor: pointer; background: var(--green); color: var(--white); font-size: 1rem; border: none; border-radius: 1rem;}
                        .gridPlanejamento .content .box .desc form .botoes button:hover{cursor: pointer; transform: scale(0.9);}
                        .gridPlanejamento .content .box .desc form .botoes button.delete{background: var(--gray40)}

                        @media(max-width: 500px){
                            .gridPlanejamento{grid-template-columns: 1fr}
                        }
                    `
                }
            </style>
        </MainLayout>
    )
}

export default EditarFaq
