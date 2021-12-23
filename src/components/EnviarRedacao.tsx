import { getSession } from "next-auth/client";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useRedacaoStore } from "../hooks/redacaoStore";
import { useSubscriptionStore } from "../hooks/subscriptionStore";
import NoSSRWrapper from "./layout/NoSSRWrapper";
import PreLoader from "./PreLoader";
import Image from "next/image";
import Select from "react-select";

function EnviarRedacao({ session, selected, temasProps, closeModal }: any) {
  const [tema, setTema] = React.useState<string | null>(null);
  const [temas, setTemas] = React.useState<{ value: string; label: string }[]>(
    []
  );
  const [alunoObs, setAlunoObs] = React.useState("");

  const subscription = useSubscriptionStore((state) => state.subscription);
  const setSubscription = useSubscriptionStore(
    (state) => state.setSubscription
  );
  const updateSubscription = useSubscriptionStore(
    (state) => state.updateSubscription
  );

  const createRedacao = useRedacaoStore((state) => state.createRedacao);
  const updateRedacoes = useRedacaoStore((state) => state.updateRedacoes);

  /// upload
  const [file, setFile] = React.useState<any | null>(null);
  const [createObjectURL, setCreateObjectURL] = React.useState<any | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  useEffect(() => {
    const options: { value: string; label: string }[] = temasProps?.map(
      (item: any) => ({ value: item.id, label: item.titulo })
    );
    setTemas(options);
  }, []);

  useEffect(() => {
    //console.log("tema ====>", tema , ' === > ', selected)
    if (selected) {
      setTema(selected.value);
      //console.log("tema after ====>", tema)
    }
  }, [selected]);

  const uploadFileClient = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const i: any = e.target.files[0];
      setFile(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  const onFileSubmit = async (e: any) => {
    setIsLoading(true);
    e.preventDefault();

    const body = new FormData();
    body.append("files.redacao", file);

    const data: any = {};
    data["user"] = (session?.id as string) ?? "";
    data["tema"] = tema ?? "";
    data["msg_aluno"] = alunoObs ?? "";
    data["status_correcao"] =
      subscription?.plano.plano_type === "enem"
        ? "correcao_um"
        : "redacao_simples";
    body.append("data", JSON.stringify(data));

    if (session) {
      const success = await createRedacao(
        body,
        subscription!,
        session!.id as string,
        session!.jwt
      );
      if (!success.error) {
        updateSubscription(subscription?.id ?? "", session.jwt);
        toast.success(success.data.message);
      } else {
        toast.error(success.data.message);
      }
    } else {
      toast.error("Precisa efetuar o login para enviar a redação!");
    }

    console.log(body)

    // modal
    closeModal();
    remove();
    setIsLoading(false);
  };

  const remove = () => {
    setFile(null);
    setCreateObjectURL(null);
    setTema(null);
  };

  const onChange = (event: any, { newValue }: any) => {
    setTema(newValue);
  };

  return (
    <div className="popRedacao">
      <h1>ENVIAR REDAÇÃO</h1>

      <form
        onSubmit={(e) => onFileSubmit(e)}
        style={{
          width: "100%",
        }}
      >
        {!isLoading ? (
          <span className="formulario">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              {createObjectURL != null ? (
                <Image
                  src={createObjectURL}
                  loader={() => createObjectURL}
                  width="240px"
                  height="240px"
                  alt="Icone adicionar"
                />
              ) : (
                <>
                  <NoSSRWrapper>
                    <Select
                      value={selected}
                      placeholder="Escolha o tema"
                      onChange={(selecionado: any) =>
                        selecionado ? setTema(selecionado.value) : setTema(null)
                      }
                      noOptionsMessage={() => "Tema não encontrado!"}
                      className="react-select-container"
                      options={temas}
                      isSearchable
                      isClearable
                    />
                  </NoSSRWrapper>
                </>
              )}
            </div>

            {!createObjectURL && (
              <span className="upload">
                <span>
                  * Tipos de arquivos aceitos:{" "}
                  <strong>.jpeg, .png, .jpg</strong>
                  <br />{" "}
                </span>
                <input
                  type="file"
                  className="inputUploadRedacao"
                  accept=".jpeg, .png, .jpg"
                  onChange={uploadFileClient}
                  disabled={tema == null}
                />
                <label className="custom-file-upload">ESCOLHER ARQUIVO</label>
              </span>
            )}
            <br />
            {tema == null && <span>*Selecione primeiro o tema!</span>}
            {createObjectURL !== null && (
              <>
                <span>
                  * ATENÇÃO, CARA PÁLIDA: SE VOCÊ ESTÁ VISUALIZANDO UMA
                  MINIATURA DA SUA REDAÇÃO, É SINAL DE QUE ESTÁ TUDO CERTO. NÃO
                  SE PREOCUPE CASO A IMAGEM ESTEJA UM POUCO DISTORCIDA, É
                  NORMAL! PARA O CORRETOR, ELA APARECERÁ PERFEITAMENTE. <br />
                </span>
                <br />
                <span>
                  <h3>
                    {" "}
                    A Corrige Aí te escuta, deixe uma mensagem para o corretor:{" "}
                  </h3>
                  <textarea
                    onChange={(e) => setAlunoObs(e.target.value)}
                    placeholder="Digite Aqui!"
                  />
                </span>
                <br />
                <button className="uploadRemove" type="button" onClick={remove}>
                  Trocar redação
                </button>
              </>
            )}
          </span>
        ) : (
          <div className="popLoading">
            <PreLoader />
          </div>
        )}

        {!isLoading && (
          <span className="botoes">
            <a
              className="enviar cancelar"
              style={{ cursor: "pointer" }}
              onClick={() => {
                remove();
                closeModal();
              }}
            >
              CANCELAR
            </a>
            <button
              type="submit"
              className="enviar"
              disabled={file?.size > 0 ? false : true}
            >
              {" "}
              ENVIAR
            </button>
          </span>
        )}
      </form>
    </div>
  );
}
export default EnviarRedacao;
