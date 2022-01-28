import Link from "next/link";
import React from "react";
import MainLayout from "./MainLayout";
import Seo from "./Seo";
import Image from "next/image";
import { calendar } from "../icons";
import { useEnviosStore } from "../../hooks/enviosStore";
import Moment from "moment";
import { mediaGeral, notaTotalRedacao } from "../../utils/helpers";
import shallow from "zustand/shallow";
import { getSession } from "next-auth/client";
import { strapi } from "../../services/strapi";
import { redacaoPerUserSortDate } from "../../graphql/query";
import { toast } from "react-toastify";

export async function getServerSideProps(ctx: any) {
  const session = await getSession(ctx);

  const redacoes = await strapi(session?.jwt).graphql({
    query: redacaoPerUserSortDate(session?.id),
  });

  return {
    props: {
      session: session,
      redacoes,
    },
  };
}

function Notification({ redacoes }: any) {
  const [envios, getLastsRedacoes, setNullRedacoes, setNullCurrentRedacao] =
    useEnviosStore(
      (state) => [
        state.envios,
        state.getLastsRedacoes,
        state.setNullRedacoes,
        state.setNullCurrentRedacao,
      ],
      shallow
    );

  React.useEffect(() => {
    getLastsRedacoes(redacoes?.length ? redacoes : []);
    return () => {
      setNullRedacoes();
      setNullCurrentRedacao();
    };
  }, []);

  return (
    <div className="container-envios">
      <div className="lista">
        <div className="content">
          {envios?.length > 0 &&
            envios.slice(0, 10).map((envio, index) => {
              return (
                <div className="list-item" key={index}>
                  <div className="item" style={{ cursor: "pointer" }}>
                    <div className="data">
                      {Moment(envio.createdAt).format("DD/MM")}
                    </div>
                    <div className="tema">{envio.tema.titulo}</div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Notification;
