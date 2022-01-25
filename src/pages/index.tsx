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
} from "../components/icons";
import Strapi from "strapi-sdk-js";
import { planosQuery } from "../graphql/query";
import React, { useState, useEffect, Component } from "react";
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
              <div className="foto">
                <Image
                  src={TheKingHenrique}
                  className="img-responsive"
                  alt=""
                />
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
              <a className="uls" href="#top">Corrige Aí</a>
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
/* 
        <header className="desktop">
        <div className="container">
          <a
            onClick={() => setMenuOpened(!menuOpened)}
            className="toogle"
            style={{ cursor: "pointer" }}
          >
            Menu
          </a>
          <div
            className="menu"
            style={{ display: menuOpened ? "none" : "block" }}
          >
            <ul>
              <li>
                <a href="#">Como funciona</a>
              </li>
              <li>
                <a href="#passos">Corrige Aí</a>
              </li>
              <li>
                <a href="#precos">Planos e preços</a>
              </li>
              <li>
                <Link href="/painel" passHref>
                  <a id="login">Área do aluno</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>
      <header className="mob">
        <div className="container">
          <a
            onClick={() => setMenuOpened(!menuOpened)}
            className="toogle"
            style={{ cursor: "pointer" }}
          >
            Menu
          </a>
          <div
            className="menu"
            style={{ display: menuOpened ? "block" : "none" }}
          >
            <ul>
              <li>
                <a href="#">Como funciona</a>
              </li>
              <li>
                <a href="#passos">Corrige Aí</a>
              </li>
              <li>
                <a href="#precos">Planos e preços</a>
              </li>
              <li>
                <Link href="/painel" passHref>
                  <a id="login">Área do aluno</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <div className="banner">
        <div className="container-full">
          <div className="gridtwo">
            <div className="foto">
              <Image src={TheKingHenrique} className="img-responsive" alt="" />
            </div>
            <div className="texto">
              <div className="subtitle">
                Chegou a <strong>plataforma que te escuta.</strong>
              </div>
              <div className="logo">
                <Image src={LogoCorrige} className="img-responsive" alt="" />
              </div>
              <div className="desc">
                A única plataforma que corrige
                <br />
                EXATAMENTE como o ENEM, com
                <br />
                <strong>dois corretores</strong> em cada correção.
              </div>
              <hr />
            </div>
          </div>
        </div>
      </div>

      <div id="passos">
        <div className="container-full">
          <div className="row1">
            <div className="passo">
              <span className="img">
                <Image src={passo1_img} className="img-responsive" alt="" />
              </span>
              <div className="box">
                <span className="tit">Passo 1</span>
                <span className="desc">
                  Você escolhe um tema de nossa plataforma e envia para
                  correção. Você também tem um espaço para dúvidas, pois
                  queremos lhe ouvir.
                </span>
              </div>
            </div>

            <div className="passo2">
              <span className="img">
                <Image src={passo2_img} className="img-responsive" alt="" />
              </span>
              <div className="box">
                <span className="tit">Passo 2</span>
                <span className="desc">
                  Sua correção chega na caixa de dois corretores
                  <br />
                  diferentes, que a avaliam de forma independente <br />
                  a partir dos critérios de correção do ENEM, <br />
                  exibidos para você.
                  <br />
                  <br />
                  Na Corrige Aí, todos os corretores possuem
                  <br />
                  formação em Letras – e as correções são
                  <br />
                  pelos gostos do corretor, mas pelas exigências
                  <br />
                  da banca do ENEM.
                </span>
              </div>
            </div>
          </div>
          <div className="row2">
            <div className="passo3">
              <div className="box">
                <span className="tit">Passo 3</span>
                <span className="borda">&nbsp;</span>
                <span className="podem">Aqui podem acontecer duas coisas</span>
              </div>
            </div>
          </div>
          <div className="row1">
            <div className="coluna">
              <span className="subtitle">Discrepância</span>
              <span className="img">
                <Image
                  src={passo3_discrepancia}
                  className="img-responsive"
                  alt=""
                />
              </span>
              <span className="desc">
                Assim como no ENEM, as discrepâncias são
                <br />
                previstas. Elas acontecem quando a nota entre
                <br />
                os dois corretores varia em mais de 100 pontos.
                <br />
                Nesses casos, entra uma terceira correção, feita
                <br />
                por um de nossos coordenadores - corretores
                <br />
                oficiais do ENEM -, que decide quem estava certo.
              </span>
            </div>
            <div className="coluna match">
              <span className="subtitle right">Match</span>
              <span className="img">
                <Image src={passo3_match} className="img-responsive" alt="" />
              </span>
              <span className="desc">
                Se não houver discrepância, você já recebe
                <br />
                sua redação com as duas correções. Tanto a<br />
                sua nota final quanto a sua nota de cada
                <br />
                competência serão sempre as médias simples das duas correções,{" "}
                <strong>
                  exatamente
                  <br />
                  como no ENEM.
                </strong>
              </span>
            </div>
          </div>
          <div className="row1">
            <div className="passo3">&nbsp;</div>
            <div className="passo4">
              <span className="tit">Passo 4</span>

              <div className="box">
                <span className="img">
                  <Image src={passo1_img} className="img-responsive" alt="" />
                </span>
                <span className="desc">
                  Você consegue acompanhar suas notas finais e<br />
                  de cada competência no seu desempenho e na
                  <br />
                  sua evolução, com muitos gráficos e análises,
                  <br />
                  tudo para você arrasar no ENEM.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="corrigeai">
        <div className="container">
          <div className="circle" id="one">
            A mente por trás dessa plataforma é do Prof. Henrique Araujo,
            professor conhecido no mercado como um dos que mais possui
            estudantes 900+ no ENEM.
          </div>

          <div className="circle" id="two">
            É a única no mercado que corrige EXATAMENTE como o ENEM, com duas
            correções para cada redação.
          </div>

          <div className="circle" id="three">
            Sua aprovação é nossa meta.
          </div>

          <div className="circle" id="four">
            Somos novos no mercado e somos pequenos.
            <br />E isso é uma qualidade!
          </div>

          <div className="circle" id="five">
            A Corrige Aí surgiu para combater esse mercado massificado das
            plataformas de ensino, que corrigem redação de forma apressada e sem
            critério, com alta rotatividade de corretores desqualificados e sem
            formação.
          </div>

          <div className="circle" id="six">
            Entendemos que o estudante precisa CONFIAR na correção que recebe –
            e jamais ter dúvidas se ela está certa. Por isso, queremos escutar
            você, e por isso seguimos à risca a grade do ENEM.
          </div>
        </div>
      </div>

      <ListLoading planos={appState.planos} />

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
              target="_blank" rel="noreferrer"
            >
              <strong>Cupcode</strong> - Marketing e Desenvolvimento
            </a>
            .
          </div>
        </div>
      </div>
*/
