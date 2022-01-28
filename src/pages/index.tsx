/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import {
  check,
  LogoCorrige,
  passo1_img,
  passo2_img,
  passo3_discrepancia,
  passo3_match,
  TheKingHenrique,
  ImageTips,
} from "../components/icons";
import Strapi from "strapi-sdk-js";
import { planosQuery } from "../graphql/query";
import React, { useState, useEffect} from "react";
import Seo from "../components/layout/Seo";
import { strapi } from "../services/strapi";
import List from "./List";

export async function getServerSideProps(ctx: any) {
  const strapi = new Strapi({
    url: `${process.env.NEXT_PUBLIC_URL_API}`,
  });
  const planos = await strapi.graphql({ query: planosQuery });

  return {
    props: {
      planos,
    },
  };
}

function Home({ planos }: any) {
  const ListLoading = List;
  const [appState, setAppState] = useState({
    planos: null,
  });

  useEffect(() => {
    setAppState({ planos: null });
    const apiUrl = `https://api.corrigeai.com/planos`;
    fetch(apiUrl)
      .then((res) => res.json())
      .then((planos) => {
        setAppState({ planos: planos });
      });
  }, [setAppState]);

  return (
    <>
      <Seo />
      <div>
        <Panel />
        <div className="main" id="top">
          <div className="banner">
            <div className="information">
              <div className="foto-header">
                <div className="foto">
                  <Image
                    src={TheKingHenrique}
                    className="img-responsive"
                    alt=""
                  />
                </div>
                <div className="text-foto">
                  <h2>A plataforma do Prof. Henrique Araújo</h2>
                </div>
              </div>
              <div className="texto">
                <div className="subtitle">
                  Chegou a <strong>plataforma que te escuta.</strong>
                </div>
                <div className="logo">
                  <Image src={LogoCorrige} className="img-responsive" alt="" />
                </div>
                <div className="banner-description">
                  A única plataforma que corrige
                  <br />
                  EXATAMENTE como o ENEM, com
                  <br />
                  <strong>dois corretores</strong> em cada correção.
                </div>
                <div className="line"></div>
              </div>
            </div>
          </div>
          <div id="tips">
            <div className="tips_header">
              <h1 className="comofunciona_text">Nossa Plataforma</h1>
              <div className="line_header"></div>

              <div className="tips_information5">
                <div className="tips5">
                  A Corrige Aí surgiu para combater esse mercado massificado das
                  plataformas de ensino, que corrigem redação de forma apressada
                  e sem critério, com alta rotatividade de corretores
                  desqualificados e sem formação.
                </div>
              </div>
            </div>
            <div className="tips_box">
              <div className="tips_information1">
                <div className="image_tips1">
                  <Image src={ImageTips} alt="" />
                </div>
                <div className="tips1">
                  A mente por trás dessa plataforma é do{" "}
                  <span>Prof. Henrique Araujo</span>, professor conhecido no
                  mercado como um dos que mais{" "}
                  <span>possui estudantes 900+ no ENEM.</span>
                </div>
                <div className="tips2">
                  É a única no mercado que corrige EXATAMENTE como o ENEM, com{" "}
                  <span>duas correções para cada redação.</span>
                </div>
              </div>
              <div className="tips_information3">
                <div className="line_tips"></div>
                <div className="tips3">Sua aprovação é nossa meta.</div>
                <div className="line_tips"></div>
              </div>
            </div>
          </div>
          <div className="comofunciona" id="comofunciona">
            <h1 className="comofunciona_text">Como funciona?</h1>
            <div className="line_header"></div>
            <div className="passo1">
              <div className="passo1_information">
                <div>
                  <Image src={passo1_img} className="img-responsive" alt="" />
                </div>
                <div className="informations">
                  <h1>Passo 1</h1>
                  <p>
                    Você escolhe um tema de nossa plataforma e envia para
                    correção. Você também tem um espaço para dúvidas, pois
                    queremos lhe ouvir.
                  </p>
                </div>
                <div className="line_continue1"></div>
              </div>
              <div className="line_continue1_mobile"></div>
            </div>
            <div className="passo2">
              <div className="passo2_information">
                <div className="informations">
                  <h1>Passo 2</h1>
                  <p>
                    Sua correção chega na caixa de dois corretores diferentes,
                    que a avaliam de forma independente a partir dos critérios
                    de correção do ENEM, exibidos para você. Na Corrige Aí,
                    todos os corretores possuem formação em Letras – e as
                    correções são pelos gostos do corretor, mas pelas exigências
                    da banca do ENEM.
                  </p>
                </div>
                <div className="line_continue2"></div>
                <div>
                  <Image src={passo2_img} className="img-responsive" alt="" />
                </div>
              </div>
              <div className="line_continue2_mobile"></div>
            </div>
            <div className="passo3">
              <div className="passo3_information">
                <div className="passo3_line_information">
                  <div className="line_continue3"></div>
                  <div className="informations">
                    <h1>Passo 3</h1>
                    <p>Aqui podem acontecer duas coisas</p>
                  </div>
                </div>
                <div className="passo3_photos">
                  <div className="text_passo3">
                    <Image
                      src={passo3_discrepancia}
                      className="img-responsive"
                      alt=""
                    />
                    <div className="text_information_passo3">
                      <h1>
                        Assim como no ENEM, as discrepâncias são previstas. Elas
                        acontecem quando a nota entre os dois corretores varia
                        em mais de 100 pontos. Nesses casos, entra uma terceira
                        correção, feita por um de nossos coordenadores -
                        corretores oficiais do ENEM -, que decide quem estava
                        certo.
                      </h1>
                    </div>
                  </div>
                  <div className="text_passo3">
                    <Image
                      src={passo3_match}
                      className="img-responsive"
                      alt=""
                    />
                    <div className="text_information_passo3">
                      <h1>
                        Se não houver discrepância, você já recebe sua redação
                        com as duas correções. Tanto a sua nota final quanto a
                        sua nota de cada competência serão sempre as médias
                        simples das duas correções, exatamente como no ENEM.
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
              <div className="line_continue3_mobile"></div>
            </div>
            <div className="passo4">
              <div className="passo4_information">
                <div className="informations">
                  <h1>Passo 4</h1>
                  <p>
                    Sua correção chega na caixa de dois corretores diferentes,
                    que a avaliam de forma independente a partir dos critérios
                    de correção do ENEM, exibidos para você. Na Corrige Aí,
                    todos os corretores possuem formação em Letras – e as
                    correções são pelos gostos do corretor, mas pelas exigências
                    da banca do ENEM.
                  </p>
                </div>
                <div className="line_continue4"></div>
                <div>
                  <Image src={passo1_img} className="img-responsive" alt="" />
                </div>
              </div>
            </div>
          </div>
          <ListLoading planos={appState.planos} />
        </div>

        <div className="footer-copyright">
          <div className="footer-description">
            <div>
              &copy; 2021 <strong>CorrigeAí</strong> - Todos os direitos
              reservados
            </div>
            <div>
              Desenvolvido por{" "}
              <a
                href="https://www.cupcode.com.br"
                title="Cupcode - Agência de Marketing Digital e Desenvolvimento"
                className="copy"
                target="_blank"
                rel="noreferrer"
              >
                <strong>Cupcode</strong> - Marketing e Desenvolvimento
              </a>
              .
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
const Panel = () => {
  const [isOpen, setOpen] = React.useState(false);
  return (
    <div>
      <div className="header-logo-mobile">
        <div className="header-logo-nav">
          <Image src={LogoCorrige} alt=""></Image>
          <button
            onClick={() => setOpen(!isOpen)}
            className={`hamburger-button ${isOpen ? "open" : "close"}`}
          />
        </div>
        <div className={`panel ${isOpen ? "open" : "close"}`}>
          <ul>
            <li>
              <a className="uls" href="#top">
                Corrige Aí
              </a>
            </li>
            <li>
              <a href="#tips">Nossa Plataforma</a>
            </li>
            <li>
              <a href="#comofunciona">Como funciona</a>
            </li>
            <li>
              <a href="#precos">Planos e Preços</a>
            </li>
            <li>
              <Link href="/painel" passHref>
                <a id="login" className="aluno-mobile">
                  Área do aluno
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="header-nav">
        <div className="header-logo">
          <Image src={LogoCorrige} alt=""></Image>
        </div>
        <div className="navbar">
          <a href="#top">
            <h2>Corrige Aí</h2>
          </a>
          <a href="#tips">
            <h2>Nossa Plataforma</h2>
          </a>
          <a href="#comofunciona">
            <h2>Como Funciona</h2>
          </a>
          <a href="#precos">
            <h2>Planos e Preços</h2>
          </a>
          <Link href="/painel" passHref>
            <a id="login" className="aluno">
              Área do aluno
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};