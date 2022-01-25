import React from "react";
import Image from "next/image";
import Link from "next/link";
import { check } from "../components/icons";

export default function List(props: any) {
  const { planos } = props;

  return (
    <div>
      <div id="precos">
        <h1>
          Planos e Preços
        </h1>
        <div className="line_header"></div>
        <div className="container">
          <div className="columns">
            {planos &&
              planos.length > 0 &&
              planos.map((plano: any, index: number) => (
                <div className="column" key={index}>
                  <div className="preco_informations">
                    <span className="periodo">{plano.name}</span>
                    <span className="boxPreco">
                      <span className="parcelas">
                        {plano.parcelamentoTexto}
                      </span>
                      <span className="preco">{plano.totalTexto}</span>
                    </span>
                  </div>
                  <div className="lista">
                    <ul>
                      {plano.infos.length > 0 &&
                        plano.infos.map((info: any, index: number) => (
                          <li key={index}>
                            {info}
                          </li>
                        ))}
                    </ul>
                    <span className="botao">
                      <Link href={`/checkout/${plano.id}`}>Comprar agora</Link>
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
