/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import Link from 'next/link'
import {
  check,
  LogoCorrige,
  passo1_img,
  passo2_img,
  passo3_discrepancia,
  passo3_match,
  TheKingHenrique
} from '../components/icons'
import Strapi from 'strapi-sdk-js'
import { planosQuery } from '../graphql/query';
import React, { useState, useEffect, Component } from "react";
import Seo from '../components/layout/Seo';
import List from './List';

export async function getServerSideProps(ctx: any) {
  const strapi = new Strapi({
            url: `${process.env.NEXT_PUBLIC_URL_API}`
        });
  const planos = await strapi.graphql({ query: planosQuery });
  return {
    props: {
      planos
    }
  }
}

function Home({ planos }: any) {
  const [menuOpened, setMenuOpened] = useState(false)

  const ListLoading = (List);
  const [appState, setAppState] = useState({
    planos: null,
  });

  useEffect(() => {
    setAppState({planos:null});
    const apiUrl = `https://api.corrigeai.com/planos`;
    fetch(apiUrl)
      .then((res) => res.json())
      .then((planos) => {
        setAppState({planos: planos });
      });
  }, [setAppState]);

  return (
    <>
      <Seo />
      <header className="desktop">
        <div className="container">
          <a onClick={() => setMenuOpened(!menuOpened)} className="toogle" style={{cursor: 'pointer'}}>Menu</a>
          <div className="menu" style={{ display: menuOpened ? 'none' : 'block' }}>
            <ul>
              <li><a href="#">Como funciona</a></li>
              <li><a href="#passos">Corrige Aí</a></li>
              <li><a href="#precos">Planos e preços</a></li>
              <li><Link href="/painel" passHref><a id="login">Área do aluno</a></Link></li>
            </ul>
          </div>
        </div>
      </header>
      <header className="mob">
        <div className="container">
          <a onClick={() => setMenuOpened(!menuOpened)} className="toogle" style={{cursor: 'pointer'}}>Menu</a>
          <div className="menu" style={{ display: menuOpened ? 'block' : 'none' }}>
            <ul>
              <li><a href="#">Como funciona</a></li>
              <li><a href="#passos">Corrige Aí</a></li>
              <li><a href="#precos">Planos e preços</a></li>
              <li><Link href="/painel" passHref><a id="login">Área do aluno</a></Link></li>
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
              <div className="subtitle">Chegou a <strong>plataforma que te escuta.</strong></div>
              <div className="logo">
                <Image src={LogoCorrige} className="img-responsive" alt="" />
              </div>
              <div className="desc">
                A única plataforma que corrige<br />
                EXATAMENTE como o ENEM, com<br />
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
                <span className="desc">Você escolhe um tema de nossa plataforma e envia para correção. Você também tem um espaço para dúvidas, pois queremos lhe ouvir.</span>
              </div>
            </div>

            <div className="passo2">
              <span className="img">
                <Image src={passo2_img} className="img-responsive" alt="" />
              </span>
              <div className="box">
                <span className="tit">Passo 2</span>
                <span className="desc">
                  Sua correção chega na caixa de dois corretores<br />
                  diferentes, que a avaliam de forma independente <br />
                  a partir dos critérios de correção do ENEM, <br />
                  exibidos para você.<br /><br />

                  Na Corrige Aí, todos os corretores possuem<br />
                  formação em Letras – e as correções não<br />
                  pelos gostos do corretor, mas pelas exigências<br />
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
                <Image src={passo3_discrepancia} className="img-responsive" alt="" />
              </span>
              <span className="desc">
                Assim como no ENEM, as discrepâncias são<br />
                previstas. Elas acontecem quando a nota entre<br />
                os dois corretores varia em mais de 100 pontos.<br />
                Nesses casos, entra uma terceira correção, feita<br />
                por um de nossos coordenadores - corretores<br />
                oficiais do ENEM -, que decide quem estava certo.
              </span>
            </div>
            <div className="coluna match">
              <span className="subtitle right">Match</span>
              <span className="img">
                <Image src={passo3_match} className="img-responsive" alt="" />
              </span>
              <span className="desc">
                Se não houver discrepância, você já recebe<br />
                sua redação com as duas correções. Tanto a<br />
                sua nota final quanto a sua nota de cada<br />
                competência serão sempre as médias simples das duas correções, <strong>exatamente<br />como no ENEM.</strong>
              </span>
            </div>
          </div>
          <div className="row1">
            <div className="passo3">
              &nbsp;
            </div>
            <div className="passo4">
              <span className="tit">Passo 4</span>

              <div className="box">
                <span className="img">
                  <Image src={passo1_img} className="img-responsive" alt="" />
                </span>
                <span className="desc">
                  Você consegue acompanhar suas notas finais e<br />
                  de cada competência no seu desempenho e na<br />
                  sua evolução, com muitos gráficos e análises,<br />
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
            A mente por trás dessa plataforma é do Prof. Henrique Araujo, professor conhecido no mercado como um dos que mais possui estudantes 900+ no ENEM.
          </div>

          <div className="circle" id="two">
            É a única no mercado que corrige EXATAMENTE como o ENEM, com duas correções para cada redação.
          </div>

          <div className="circle" id="three">
            Sua aprovação é nossa meta.
          </div>

          <div className="circle" id="four">
            Somos novos no mercado e somos pequenos.<br />E isso é uma qualidade!
          </div>

          <div className="circle" id="five">
            A Corrige Aí surgiu para combater esse mercado massificado das plataformas de ensino, que corrigem redação de forma apressada e sem critério, com alta rotatividade de corretores desqualificados e sem formação.
          </div>

          <div className="circle" id="six">
            Entendemos que o estudante precisa CONFIAR na correção que recebe – e jamais ter dúvidas se ela está certa. Por isso, queremos escutar você, e por isso seguimos à risca a grade do ENEM.
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

      <style global jsx>
        {
          `
          body{background: #F2F2F2 !important;}

          .container-full{ display: block !important;}

          .container{display: block; width: 100%; max-width: 80%; margin: 0 auto;}
          ul{padding: 0; margin: 0}
          .gridtwo{display: grid; width: 100%; max-width: 90%; margin: 0 auto 0 0; grid-template-columns: 1fr 1fr; gap: 1rem}
          .row1{display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;}
          .row2{display: grid; grid-template-columns: 1fr; gap: 1rem;}
          
          header.mob{display: none}
          header.desktop{display: inline-block; position: fixed; width: 100%; top: 0; left: 0; padding: 3rem 0; text-align: center; z-index: 999;background: rgb(114,176,29); background: linear-gradient(90deg, rgba(114,176,29,1) 0%, rgba(114,176,29,1) 0%, rgba(132,204,34,1) 100%);}
          .toogle{display: none}
          .menu li{display: inline; margin: 0 3rem;}
          .menu li a{font-size: 1.375rem; color: var(--gray20)}
          .menu li a:hover{color: var(--dark);}
          .menu li a#login{font-size: 1.375rem; color: var(--dark); background: var(--gray20); padding: 0.8rem 1.5rem; border-radius: 1rem;}
          .menu li a#login:hover{color: var(--gray20); background: var(--dark)}
          
          
          
          .banner{display: block; width: 100%; background: rgb(114,176,29); background: linear-gradient(90deg, rgba(114,176,29,1) 0%, rgba(114,176,29,1) 0%, rgba(132,204,34,1) 100%);padding: 10rem 0 0;}
          .banner .foto{display: block; width: 100%; flex: 1}
          .banner .texto{display: flex; width: 100%; flex-direction: column; align-items: center; justify-content: center}
          .banner .texto .subtitle{display: block; width: 100%; font-weight: 400; color: var(--dark); font-size: 1.875rem; text-align: center;}
          .banner .texto .logo{display: block; width: 100%; margin: 0 0 5rem;}
          .banner .texto .desc{display: block; width: 100%; font-size: 2.5rem; color: var(--gray20); text-align: center; margin: 0 0 1.5rem}
          .banner hr{display: block; width: 100%; max-width: 9.8125rem; height: 0.8125rem; background: var(--gray20); border-radius: 1rem; border: none}
          
          #passos{display: block; width: 100%; padding: 11rem 0; position: relative;}
          #passos .container-full{max-width: 80%;}
          .passo{display: block; width: 100%; position: relative;}
          .passo .img{float: left; width: 35%}
          .passo .box{float: left; width: 60%;}
          .passo .tit{background: #002400;color: #fff;border-radius: 1.5rem;padding: 0.5rem 1rem;width: 100%;display: block;max-width: 6.25rem;text-align: center;}
          .passo .desc{display: block; width: 100%; max-width: 25rem; text-align: center; position: absolute; top: 35%; font-size: 1.2rem;}
          
          
          .passo2{display: block; width: 100%; position: relative;}
          .passo2 .img{display: block; width: 100%; max-width: 60%; margin: 0 auto;}
          .passo2 .box{float: left; width: 100%;}
          .passo2 .tit{background: #002400;color: #fff;border-radius: 1.5rem;padding: 0.5rem 1rem;width: 100%;display: block;max-width: 6.25rem;text-align: center; position: absolute; top: 0; left: 50%; margin-left: -3.125rem;}
          .passo2 .desc{display: block; width: 100%; max-width: 30rem; margin: 2rem auto; text-align: center;  font-size: 1.2rem;}
          
          .passo3{display: block; width: 100%; position: relative; margin: 3rem 0 0}
          .passo3 .tit{background: #002400;color: #fff;border-radius: 1.5rem;padding: 0.5rem 1rem;width: 100%;display: block;max-width: 6.25rem;text-align: center; position: absolute; top: 0; left: 50%; margin-left: -3.125rem; z-index: 9;}
          .passo3 .borda{z-index: 8; top: 1rem; position: absolute;left: 50%;width: 100%;border-radius: 6.25rem 6.25rem 0 0;border-top: 5px solid #84ca22;border-left: 5px solid #84ca22;border-right: 5px solid #84ca22;height: 12.5rem; max-width: 80%; margin-left: -40%}
          .borda2_mob{display: none; z-index: 8; top: 1rem; position: absolute;left: 50%;width: 100%;border-radius: 6.25rem 6.25rem 0 0;border-top: 5px solid #84ca22;border-left: 5px solid #84ca22;border-right: 5px solid #84ca22;height: 12.5rem; max-width: 80%; margin-left: -40%}
          .passo3 .podem{display: block; width: 100%; text-align: center; font-size: 1.7rem; max-width: 24rem; margin: 3.5rem auto 0;}
          
          .coluna{display: block; width: 100%; position: relative; z-index: 8; margin: 3rem 0 0;}
          .coluna .subtitle{background: var(--green); left: 3.7rem; color: #fff;border-radius: 1.5rem;padding: 0.5rem 1rem;width: 100%;display: block;max-width: 12rem;text-align: center; position: absolute; top: 0;}
          .coluna .right{background: var(--green);  color: #fff;border-radius: 1.5rem;padding: 0.5rem 1rem;width: 100%;display: block;max-width: 12rem;text-align: center; position: absolute; top: 0; right: 3.7rem; left: inherit;}
          .coluna .img{display: block; width: 100%; margin: 4rem 0 0}
          .coluna .img img{width: auto !important; height: auto !important}
          .coluna .desc{display: block; width: 100%;  margin: 2rem 0 0; font-size: 1.3rem; text-align: center; max-width: 35rem; background: #fff; padding: 1rem; border-radius: 1rem; box-shadow: 0px 0px 15px 0px rgb(0 0 0 / 7%)}
          
          .match .img{text-align: right; right: -7rem; position: relative;}
          .match .img img{width: 35%}
          .match .desc{margin: 0; position: absolute; top: 12rem;}
          
          .passo4 .tit{background: #002400;color: #fff;border-radius: 1.5rem; margin: 0 auto;  padding: 0.5rem 1rem;width: 100%;display: block;max-width: 6.25rem;text-align: center;}
          .passo4 .box{display: flex; flex-direction: row; align-items: end;}
          .passo4 .desc{display: block; width: 100%; height: min-content; margin: 2rem 0 0; font-size: 1.3rem; text-align: center; background: #fff; padding: 1rem; border-radius: 1rem; box-shadow: 0px 0px 15px 0px rgb(0 0 0 / 7%)}
          
          
          #corrigeai{display: block; width: 100%; background: var(--green); padding: 4rem 0; height: 100rem;}
          #corrigeai .container{position: relative;}
          
          .circle{display: flex; align-items: center; background: #fff; border-radius: 50%; font-size: 1.4rem; color: var(--dark); text-align: center; padding: 4rem;}
          
          #one{position: absolute; top: 1rem; left: -10rem; width: 30rem; height: 30rem;}
          #two{position: absolute; top: 4rem; right: -5rem; width: 25rem; height: 25rem;}
          #three{position: absolute;top: 29rem; left: 50%;width: 20rem;height: 20rem;margin-left: -10rem;}
          #four{position: absolute;top: 33rem;right: -12rem;width: 22rem;height: 22rem;}
          #five{position: absolute;top: 50rem;left: -15rem;width: 40rem;height: 40rem;}
          #six{position: absolute;top: 61rem;right: -10rem;width: 32rem;height: 32rem;}
          
          
          
          #precos{display: block; width: 100%; background: var(--green); padding: 4rem 0;}
          #precos .container{max-width: 85%}
          #precos .columns{display: grid; grid-template-columns: repeat(3, 1fr); gap: 3rem;}
          .column{background: #f2f2f2; border-radius: 2rem; padding: 2rem;}
          .column .periodo{display: block; width: 100%; font-size: 1.4rem; color: var(--dark); text-align: center; margin: 0 0 1rem;}
          .column .boxPreco{display: block; width: 100%; background: var(--gray30); padding: 1rem; color: var(--dark); text-align: center; border-radius: 1rem; margin: 0 0 1.5rem}
          .column .boxPreco .parcelas{font-size: 1.2rem;}
          .column .boxPreco .preco{font-size: 3rem; font-weight: 700}
          .column .lista{font-size: 1.3rem; font-weight: 500; color: #9a9a9a}
          .column .lista ul li{margin: 0 0 0.5rem; list-style: none}
          .column .lista ul li .icon{position: relative;top: 0.5rem;margin: 0 1rem 0 0;}
          .column .botao{display: block; width: 100%; text-align: center; margin: 3rem 0 0}
          .column .botao a{background: var(--dark); color: var(--white); padding: 1rem 1.3rem; border-radius: 1.5rem;}
          
          
          .copyright{display: block; width: 100%;background: var(--green); margin: 0; padding: 1rem 0 3rem; color: #fff;}
          .copyright .container{max-width: 85%}
          
          
          
          @media(max-width: 1650px){
            .container{max-width: 80%}
          }
          
          @media(max-width: 1440px){
            html{font-size: 13px}
            #one{left: 0}
            #two{right: 0}
            #four{right: 0}
            #five{left: 0}
            #six{right: 0}
          }
          
          @media(max-width: 1240px){
            html{font-size: 12px}
          }
          
          @media(max-width: 991px){
            #precos .columns{grid-template-columns: 1fr;}
            #four{width: 20rem; height: 20rem;}
            #five{width: 30rem; height: 30rem;}
            .gridtwo{grid-template-columns: 1fr; margin: 0 auto; max-width: 60%}
            .banner .texto .desc{font-size: 2rem;}
            .banner hr{margin: 0 0 3rem}
            .toogle{display: inline-block; position: absolute; right: 3rem;}
            .menu {display: none; padding: 1rem 0;}
            header.mob{display: inline-block}
            header.desktop{display: none}
          }
          
          @media(max-width: 800px){
            .row1{grid-template-columns: 1fr;}
            .passo3 .borda{border-radius: 6.25rem 0rem 0 0; border-right: none; max-width: 45%}
            .borda2_mob{display: inline-block; border-radius: 6.25rem 0rem 0 0; border-right: none; max-width: 45%}
            .coluna .subtitle{left: 0;}
            .menu li{width: 100%; float: left; margin: 0;}
            .circle{padding: 1rem;}
            #one{width: 25rem; height: 25rem;}
            #three{width: 15rem; height: 15rem;}
            #five{width: 25rem; height: 25rem;}
            #six{width: 27rem; height: 27rem;}
            .gridtwo{max-width: 80%}
          }
          
          @media(max-width: 480px){
            #precos .columns { flex-direction: column; }
            .passo .img{width: 100%; text-align: center;}
            .passo .img img{width: 50%}
            .passo .tit{position: absolute; top: 0;}
            .passo .box{width: 100%;}
            .passo .desc{position: inherit;}
            .match .img{right: 0;}
            .passo3 .borda{display: none}
            .passo .box{margin: 0 0 5rem;}
            .passo2 .tit{top: -3rem;}
            #passos .container-full{max-width: 90%}
            .coluna .desc{font-size: 1.2rem}
            .match .img{text-align: center;}
            .match .desc{top: inherit;}
            .passo4 .box{flex-direction: column; margin: 10rem  0 0;}
            .passo4 .box .img{text-align: center;}
            .passo4 .box .img img{width: 50%; object-fit: contain !important}
            #one{position: inherit;}
            #two{position: inherit;}
            #three{position: inherit; width: 25rem; height: 25rem; top: 5rem; margin: 0; left: inherit;}
            #four{position: inherit;width: 25rem; height: 25rem; top: 5rem; margin: 0; left: inherit;}
            #five{position: inherit; top: 7rem;}
            #six{position: inherit;width: 25rem; height: 25rem; top: 9rem; margin: 0; left: inherit;}
            #corrigeai{height: auto;}
            #precos{padding: 10rem 0;}
          }
          
          .match .img img {max-width: 100% !important; height: auto !important; width: auto;}
#one{width: 26rem; height: 26rem;}
#five{left: -6rem; width: 33rem; height: 33rem;}

#precos .columns{display: flex; align-items: center; justify-content: center;}
.passo4 .desc{font-size: 1rem}
          `
        }
      </style>
    </>
  )
}

export default Home