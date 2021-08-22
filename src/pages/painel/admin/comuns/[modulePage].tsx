import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import MainLayout from '../../../../components/layout/MainLayout'
import Seo from '../../../../components/layout/Seo'
import { IcPen, IcTrash } from '../../../../components/icons'
import {usePaginaStore} from '../../../../hooks/paginaStore'
import { useRouter } from 'next/router'

function IndexFaq() {
    const getAll = usePaginaStore( (state) => state.getAll );
    const deletePage = usePaginaStore( (state) => state.delete );
    const paginas = usePaginaStore((state) => state.paginas);
    const router = useRouter();
    const [ isFaq, setIsFaq ] = React.useState(false);
    const [ moduleName, setModuleName ] = React.useState('');


    React.useEffect(() => {
        if (router.asPath !== router.route) {
            const { modulePage } = router.query;
            setIsFaq(modulePage!.includes('faq'));
            getAll(modulePage!.includes('faq'));
        }
    }, [router, getAll])

    React.useEffect(() => {
        setModuleName(isFaq ? 'faq' : 'pagina');
    }, [isFaq]);


    const handlerDelete = (id: string, e: any) => {
        e.preventDefault();
        if (confirm('Deseja excluir?')) {
            deletePage(id, isFaq);
        }
    }
    
    return (
        <MainLayout menuType={3} userType={3}>
            <Seo title="FAQ´s" />
            {moduleName.length > 0 && <div className="gridPlanejamento">
                <div className="content">
                    <div className="box">
                        <h1>Páginas</h1>
                        <span className="desc">
                            {paginas.length == 0 ? 
                                (
                                    <div style={{ minHeight: 230, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <h1>Nenhuma página encontrada!</h1>
                                    </div>
                                )
                            : <ul>
                                {paginas.length > 0 && paginas.map(pagina =>(
                                <li key={pagina._id}>
                                    <span className="item">
                                        <span className="nome">{pagina.title}</span>
                                        <span className="links">
                                            <Link href={`/painel/admin/comuns/editar/${pagina._id}`} passHref>
                                                <a>
                                                    <Image src={IcPen} className="imgItem" alt="" />
                                                </a>
                                            </Link>
                                            <span className="spanTrash" style={{ cursor: "pointer" }}>
                                                <Image src={IcTrash} onClick={(e) => handlerDelete(pagina._id, e)} className="imgItem" alt="" />
                                            </span>
                                        </span>
                                    </span>
                                </li>
                                ))}
                            </ul>}
                        </span>
                    </div>
                </div>
            </div>}

            <style jsx> {` 
                
                .gridPlanejamento{display: grid; grid-template-columns: 1fr;}
                .gridPlanejamento .content{display: block; width: 100%;}
                .gridPlanejamento .content .box{display: block; width: 100%;border-radius: 0.75rem; background: var(--gray20); padding: 2.8125rem 1.5rem; position: relative; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
                .gridPlanejamento .content .box h1{display: block; width: 100%; text-align: left; font-weight: 500; font-size: 1.6875rem; margin: 0 0 1.5rem}
                .gridPlanejamento .content .box .desc{display: block; width: 100%; text-align: left; font-weight: 400; font-size: 1rem; color: #000}
                .gridPlanejamento .content .box .desc p{margin: 0 0 1rem; font-weight: 400; font-size: 1rem; color: #000}
                .gridPlanejamento .content .box .desc strong{font-weight: 500;}
                .gridPlanejamento .content .box .desc img{max-width: 60%; margin: 0 auto;}
                .gridPlanejamento .content .botao a{display: block; width: 100%; max-width: 400px; margin: 2rem auto; text-align: center; color: var(--gray20); font-family: 'Poppins', sans-serif; font-weight: 500; border-radius: 0.75rem; font-size: 1.2em; background: var(--dark); padding: 0.5125rem; box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.15);}
                .gridPlanejamento .content .botao a:hover{transform: scale(0.9);}
                
                .gridPlanejamento .content .box .desc ul{padding: 0; margin: 0;}
                .gridPlanejamento .content .box .desc ul li{display: flex; width: 100%; margin: 0 0 1rem;}
                .gridPlanejamento .content .box .desc ul li .item{ display: flex; width: 100%; align-items: center;background: var(--gray30); padding: 1rem 1rem; border-radius: 0.5rem; }
                .gridPlanejamento .content .box .desc ul li .item .nome{ display: flex; flex: 3; font-size: 1.15rem;}
                .gridPlanejamento .content .box .desc ul li .item .links{ display: flex; flex: 1; flex-direction: row; gap: 0.5rem; justify-content: flex-end; }
                .gridPlanejamento .content .box .desc ul li .item .links a { display: flex; background: var(--dark); align-items: center;height: 40px; width: 40px; border-radius: 0.5rem }
                .gridPlanejamento .content .box .desc ul li .item .links a:hover{ background: var(--green) }
                
                .spanTrash { display: flex!important; background: var(--dark)!important; align-items: center; height: 40px; width: 40px; border-radius: 0.5rem }
                li .spanTrash:hover{ background: var(--green)!important }
                
                @media(max-width: 500px){
                    .gridPlanejamento{grid-template-columns: 1fr}
                }
                
            `} </style>
        </MainLayout>
    )
}

export default IndexFaq
