import React from 'react'
import MainLayout from '../../../../components/layout/MainLayout'
import { withAuthSession } from '../../../../utils/helpers';
import styles from './Planejamento.module.css'

function Planejamento() {
    return (
        <MainLayout>
            <div className={styles.gridPlanejamento}>
            <div className={styles.content}>
                <div className={styles.box}>
                <h1>PLANEJAMENTO</h1>
                <span className={styles.desc}>
                    Cara pálida, sabemos que <strong>planejamento é algo muito importante na
                    sua redação</strong>, pois é avaliado na Competência III, sendo fundamental para
                    a construção de um bom texto. Todavia, sabemos que planejamento é
                    importante também na vida, não é mesmo?<br /><br />

                    Por isso, <strong>separamos um espaço da nossa Corrige Aí para você planejar!</strong>
                </span>
                </div>
            </div>
            <div className={styles.side}>
                <div className={styles.box}>
                <a href="javascript://">Planeje sua semana</a>
                </div>
                <div className={styles.box}>
                <a href="javascript://">Planeje sua redação</a>
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
  
export default Planejamento
