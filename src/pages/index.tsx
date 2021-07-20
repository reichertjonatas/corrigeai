import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Seo from '../components/layout/Seo'
import Link from 'next/link'

export default function Home() {
  return (
    <div className={styles.container}>
      <Seo />
      <h1> Aguardando landing PAGE do pedro!</h1>
      <Link href="/painel">Acessar painel</Link>
      <footer>
      </footer>
    </div>
  )
}
