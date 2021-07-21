import React from 'react'
import { TemaCorrigeAi, TemaEnem } from '../../../../components/icons'
import MainLayout from '../../../../components/layout/MainLayout'
import styles from './Temas.module.css'
import Image from 'next/image'
import Link from 'next/link'

function Temas() {
    return (
        <MainLayout>
            <div className={styles["grid-temas"]}>
                <div className={styles["content"]}>
                    <div className={styles["head-box"]}>
                    <a href="javascript://" className={styles["box"]}>
                        <span className={styles["icon"]}>
                        <Image src={TemaEnem} className={styles["img-responsive"]} alt="" />
                        </span>
                        <span className={styles["texto"]}>
                        Temas ENEM
                        </span>
                    </a>
                    <a href="javascript://" className={styles["box"]}>
                        <span className={styles["icon"]}>
                        <Image src={TemaCorrigeAi} className={styles["img-responsive"]} alt="" />
                        </span>
                        <span className={styles["texto"]}>
                        Temas Corrige Aí
                        </span>
                    </a>
                    </div>

                    <div className={styles["box-tema"]}>
                        <h1>Democratização do acesso ao cinema no Brasil</h1>
                        <div className={styles["conteudo"]}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sollicitudin id lacus quis tristique. Morbi condimentum in libero ut rhoncus. Sed egestas tellus sit amet venenatis posuere. Cras vel mauris erat. Pellentesque sit amet augue pellentesque, malesuada neque rutrum, laoreet ligula. Aenean iaculis, ante eget faucibus efficitur, sem turpis eleifend orci, at convallis nisi arcu quis lacus. Praesent non dolor urna. Pellentesque rutrum augue turpis, et dictum elit varius ac. Sed turpis turpis, ultrices non leo eget, varius sagittis tellus. Mauris tincidunt dignissim tincidunt. Praesent faucibus a erat sed sodales. Etiam quis tincidunt nisl, in commodo lorem.<br /><br />

                            Pellentesque vitae felis dolor. Mauris vitae est a est posuere suscipit. Fusce vel bibendum ante. Sed id risus tempus, porttitor nibh non, sagittis lacus. Morbi imperdiet sodales finibus. Vestibulum sed semper velit. Maecenas sodales a ligula in maximus.
                        </div>
                    </div>

                    <span className={styles["botao"]}>
                        <Link href="/painel/aluno" passHref>
                            <a> Escolher esse tema</a>
                        </Link>
                    </span>
                </div>


                <div className={styles["lista-temas"]}>
                    <ul>
                        <li>
                            <Link href="/painel/aluno" passHref>
                                <a>Democratização do acesso ao cinema no Brasil</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/painel/aluno" passHref>
                                <a>Democratização do acesso ao cinema no Brasil</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/painel/aluno" passHref>
                                <a>Democratização do acesso ao cinema no Brasil</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/painel/aluno" passHref>
                                <a>Democratização do acesso ao cinema no Brasil</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/painel/aluno" passHref>
                                <a>Democratização do acesso ao cinema no Brasil</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/painel/aluno" passHref>
                                <a>Democratização do acesso ao cinema no Brasil</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/painel/aluno" passHref>
                                <a>Democratização do acesso ao cinema no Brasil</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/painel/aluno" passHref>
                                <a>Democratização do acesso ao cinema no Brasil</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/painel/aluno" passHref>
                                <a>Democratização do acesso ao cinema no Brasil</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/painel/aluno" passHref>
                                <a>Democratização do acesso ao cinema no Brasil</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/painel/aluno" passHref>
                                <a>Democratização do acesso ao cinema no Brasil</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/painel/aluno" passHref>
                                <a>Democratização do acesso ao cinema no Brasil</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/painel/aluno" passHref>
                                <a>Democratização do acesso ao cinema no Brasil</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/painel/aluno" passHref>
                                <a>Democratização do acesso ao cinema no Brasil</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/painel/aluno" passHref>
                                <a>Democratização do acesso ao cinema no Brasil</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/painel/aluno" passHref>
                                <a>Democratização do acesso ao cinema no Brasil</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/painel/aluno" passHref>
                                <a>Democratização do acesso ao cinema no Brasil</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/painel/aluno" passHref>
                                <a>Democratização do acesso ao cinema no Brasil</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/painel/aluno" passHref>
                                <a>Democratização do acesso ao cinema no Brasil</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/painel/aluno" passHref>
                                <a>Democratização do acesso ao cinema no Brasil</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/painel/aluno" passHref>
                                <a>Democratização do acesso ao cinema no Brasil</a>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </MainLayout>
    )
}

export default Temas
