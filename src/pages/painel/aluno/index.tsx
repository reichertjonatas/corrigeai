import { getSession, session, useSession } from 'next-auth/client'
import { IcAlert, IcLike, IcGraphic, IcUltimosEnvios, IcRocket } from '../../../components/icons'
import MainLayout from '../../../components/layout/MainLayout'
import Image from 'next/image'
import styles from './Aluno.module.css'
import router, { useRouter } from 'next/dist/client/router'
import React, { useEffect } from 'react'
import LayoutCarregando from '../../../components/layout/LayoutCarregando'
import { withAuthSession } from '../../../utils/helpers'
import { IUser } from '../../../models/user'
import { API } from '../../../services/api'
import Link from 'next/link'
import Seo from '../../../components/layout/Seo'

function Aluno() {
  const [loadingProfile, setLoadingProfile] = React.useState(true);
  const [user, setUser] = React.useState<IUser>({} as IUser)
  const [session, loading] = useSession()
  const router = useRouter()

  useEffect(() => {
    initData();
  }, [])

  if (loading || loadingProfile)
    return <LayoutCarregando isDashboard/>

  if (!session && !loading && !user) {
    router.push('/painel/entrar');
    return <></>
  }

  async function initData() {
    API.get('/painel/me').then(({ status, data }) => {
      if(status == 200 && !data?.error){
        setUser(data.data);
      }
      setLoadingProfile(false);
    }).catch((error) => {
      setLoadingProfile(false);
    })
  }
  
  return (
    <MainLayout>
      <Seo title="Painel do Aluno" />
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
              <span className={styles["hr"]} style={{ "background": "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(114,176,30,1) 0%, rgba(201,203,200,1) 100%)" }}>&nbsp;</span>
            </div>
            <div className={styles["box"]}>
              <span className={styles["icon"]}>
                <Image src={IcAlert} className={styles["img-responsive"]} alt="" />
              </span>
              <span className={styles["texto"]}>
                Você possui {user.subscription.envios} envios.
              </span>
              {user.subscription.envios <= 0 && <span className={styles["button"]}>
                <Link href="/planos">Comprar agora</Link>
              </span>}
              <span className={styles["hr"]} style={{ "background": "linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(237,28,36,1) 0%, rgba(201,203,200,1) 100%)" }}>&nbsp;</span>
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
                <Link href="/painel/aluno/desempenho">VER DESEMPENHO COMPLETO</Link>
              </li>
            </ul>
          </div>

          
            <div className={styles["submit-essay"]}>
                <span className={styles["icon"]}>
                  <Image src={IcRocket} className={styles["img-responsive"]} alt="" />
                </span>
                
                <span className={styles["name"]}>
                  <Link href="/painel/aluno/seus-envios">Enviar redação</Link>
                </span>
          </div>

          <div className={styles["themes"]}>
            <ul>
              <li><Link href="/painel/aluno/temas">Ver todos os temas</Link></li>
              <li><Link href="/duvidas">Como enviar a sua redação</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export async function getServerSideProps(ctx: any) {
  const session = await withAuthSession(ctx);
  if('redirect' in session) {
    return session;
  }

  return { props: {session: session} }
}


export default Aluno
