import { useSession } from 'next-auth/client'
import { IcAlert, IcLike, IcGraphic, IcUltimosEnvios, IcRocket } from '../../../components/icons'
import MainLayout from '../../../components/layout/MainLayout'
import Image from 'next/image'
import styles from './Aluno.module.css'
import NaoAutenticado from '../../../components/layout/NaoAutenticado'
import { authRequired } from '../../../utils/helpers'
import { useEffect } from 'react'
import { useRouter } from 'next/dist/client/router'

function Aluno() {

    const [ session, loading ] = useSession()
    const router = useRouter()
  
    useEffect(() => {
      if(!session && !loading) {
          router.push('/painel/entrar');
      }
    })

    if(loading) return <></>

    return (
      <MainLayout>
        <div className={styles["grid-painelaluno"]}>
          <div className={styles["content"]}>
            <div className={styles["head-box"]}>
              <div className={styles["box"]}>
                <span className={styles["icon"]}>
                  <Image src={IcLike} className={styles["img-responsive"]} alt="" />
                </span>
                <span className={styles["texto"]}>
                  Você já enviou 6 redações.
                </span>
                <span className={styles["hr"]} style={{"background": "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(114,176,30,1) 0%, rgba(201,203,200,1) 100%)"}}>&nbsp;</span>
              </div>
              <div className={styles["box"]}>
                <span className={styles["icon"]}>
                  <Image src={IcAlert} className={styles["img-responsive"]} alt="" />
                </span>
                <span className={styles["texto"]}>
                  Você possui 0 envios.
                </span>
                <span className={styles["button"]}>
                  <a href="javascript://">Comprar agora</a>
                </span>
                <span className={styles["hr"]} style={{"background": "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(237,28,36,1) 0%, rgba(201,203,200,1) 100%)"}}>&nbsp;</span>
              </div>
            </div>
            <div className={styles["box-content"]}>
              <span className={styles["head-content"]}>
                <span className={styles["icon"]}>
                  <Image src={IcUltimosEnvios} className={styles["img-responsive"]} alt="" />
                  </span>
                <span className={styles["title"]}>Seus últimos envios</span>
              </span>
              <div className={styles["graphic"]}>
                <Image src={IcGraphic} className={styles["img-responsive"]} alt="" />
              </div>
            </div>
          </div>

          <div className={styles["sidebar-panel"]}>
            <div className={styles["grades"]}>
              <ul>
                <li>Sua última nota: 920</li>
                <li>Sua média geral: 780</li>
                <li>Média Corrige Aí: 800</li>
                <li className={styles["desempenho"]}>
                  <a href="">VER DESEMPENHO COMPLETO</a>
                </li>
              </ul>
            </div>

            <div className={styles["submit-essay"]}>
              <a href="javascript://">
                <span className={styles["icon"]}>
                  <Image src={IcRocket} className={styles["img-responsive"]} alt="" />
                </span>
                <span className={styles["name"]}>Enviar redação</span>
              </a>
            </div>

            <div className={styles["themes"]}>
              <ul>
                <li><a href="javascript://">Ver todos os temas</a></li>
                <li><a href="javascript://">Como enviar a sua redação</a></li>
              </ul>
            </div>
          </div>
        </div>
      </MainLayout>
  )
}

export async function getServerSideProps(ctx: any) {
  const session = await authRequired(ctx);
  if(!session) return { props: {} }
  return {
      props: {
          user: session.user,
      },
  }
}

export default Aluno
