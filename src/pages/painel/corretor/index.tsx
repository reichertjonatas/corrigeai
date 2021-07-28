import Link from 'next/link'
import React from 'react'
import MainLayout from '../../../components/layout/MainLayout'
import styles from './Corretor.module.css'
function DashboardCorretor() {
    return (
        <MainLayout menuType={2}>
            <div className={styles["redacoes-box"]}>
                <div className={styles["content"]}>
                    <div className={styles["head"]}>
                    <div className={styles["data"]}>Data</div>
                    <div className={styles["tema"]}>Tema</div>
                    <div className={styles["estudante"]}>Estudante</div>
                    <div className={styles["circle"]}>Segunda Correção</div>
                    </div>

                    <div className={styles["list-item"]}>
                        <Link href="/painel/corretor/correcao/id" passHref>
                            <div className={styles["item"]} style={{cursor: 'pointer'}}>
                                <div className={styles["data"]}>05/05</div>
                                <div className={styles["tema"]}>Democratização do acesso ao cinema no Brasil</div>
                                <div className={styles["estudante"]}>aluno@gmail.com</div>

                                <div className={styles["circle"]}>
                                    <span className={styles["ic"]} style={{"background": "#72b01e"}}>&nbsp;</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default DashboardCorretor
