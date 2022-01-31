const redacaoPerUser = (id: any) => `query{
    redacaos(where:{ user:{id:"${id}"}}){
      id
      in_review
      nota_final
      status_correcao
      redacao{
        url
      }
      correcaos {
        competencias {
          nota
        }
        corretor {
          id
        }
        discrepante
      }
      msg_rejeicao
      tema {
        titulo
      }
      createdAt
    } 
}`

const redacaoPerUserSortDate = (id: any) => `query{
    redacaos(where:{ user:{id:"${id}"}}, sort: "createdAt:desc"){
      id
      in_review
      nota_final
      status_correcao
      redacao{
        url
      }
      correcaos {
        competencias {
          nota
        }
        corretor {
          id
        }
        discrepante
      }
      tema {
        titulo
      }
      createdAt
    } 
  }`

const sobreQuery = `query sobreQuery{
    sobre {
      titulo
      conteudo
    }
}`

const queryCaed = `query faqQuery{
    aloCaeds{
     titulo
     conteudo
   }
 }`


const mediaCorrigeAi = `query mediaCorrigeAi{
  redacaosConnection(where : { status_correcao: "finalizada"}, limit: 100){
    aggregate{
      count
      avg {
      	nota_final
      }
    }
  }
}`

const planosQuery = `query queryPlano{
  planos(where:{ plano_ativo: true }){
    id
    name
    totalTexto
    juros
    parcelamentoTexto
    precoPagarme
    parcela_number
    plano_type
    total_envios
    dias
    infos
  }
}`

const planoById = (id: String) => `query queryPlano{
  plano(id: "${id}"){
    id
    name
    totalTexto
    juros
    pagarme_plano_id
    parcelamentoTexto
    precoPagarme
    parcela_number
    plano_type
    total_envios
    dias
    infos
  }
}` 

const planoByValor = (valor: number) => `query queryPlano{
  planos(where: {precoPagarme: ${valor}}){
    id
    name
    totalTexto
    juros
    pagarme_plano_id
    parcelamentoTexto
    precoPagarme
    parcela_number
    plano_type
    total_envios
    dias
    infos
  }
}`

const redacaoById = (id: string) => `query RedacoesPerId {
  redacao(id: "${id}"){
    id
    in_review
    nota_final
    status_correcao
    redacao {
      url
    }
    correcaos(where: { discrepante: false }){
      id
      discrepante
      competencias {
        nota
        title
        obs
        obs_enem
      }
      corretor {
        id
      }
      marcacoes 
      discrepante
    }
    tema {
      titulo
    }
    createdAt
  }
}`

const correcaoById = (id: string, idCorrecao: string) => `query correcaoById {
    redacao(id: "${id}"){
      id
      in_review
      nota_final
      status_correcao
      redacao {
        url
      }
      correcaos(where: { id: "${idCorrecao}", discrepante: false }){
        id
        discrepante
        competencias {
          nota
          title
          obs
          obs_enem
        }
        corretor {
          id
        }
        marcacoes 
        discrepante
      }
      tema {
        titulo
      }
      createdAt
    }
}`

const queryTemas = (categoria: string) => `query Temas {
    temas(where: { visivel: true, categoria: "${categoria}"}) {
      id
      titulo
      categoria
      content
    }
  }`


const redacaoParaCorrigirDiscrepancia = (turma: string) => `query RedacoesCorrecao {
  redacaos(where: { status_correcao: "${turma}"}, sort: "createdAt:asc", limit: 20){
    id
    in_review
    nota_final
    status_correcao
    redacao{
      url
    }
    correcaos {
      competencias {
        nota
        title
        obs
        obs_enem
      }
      corretor {
        id
      }
      marcacoes 
      discrepante
    }
    user {
      email
    }
    tema {
      titulo
    }
    createdAt
  }
}
 `

const redacaoParaCorrigir = (turma: string) => `query RedacoesCorrecao {
  redacaos(where: { status_correcao: "${turma}"}, sort: "createdAt:asc", limit: 20){
    id
    in_review
    nota_final
    status_correcao
    redacao{
      url
    }
    correcaos {
      competencias {
        nota
        title
        obs
        obs_enem
      }
      corretor {
        id
      }
      marcacoes 
      discrepante
    }
    user {
      email
    }
    tema {
      titulo
    }
    createdAt
  }
}
 `


 const redacaoParaCorrigirNovoMetodo = `query RedacoesCorrecao {
  redacaos(where: { status_correcao: ["correcao_um", "correcao_dois", "rejeitada"]}, sort: "createdAt:asc"){
    id
    in_review
    nota_final
    status_correcao
    redacao{
      url
    }
    correcaos {
      competencias {
        nota
        title
        obs
        obs_enem
      }
      corretor {
        id
      }
      marcacoes 
      discrepante
    }
    user {
      email
    }
    tema {
      titulo
    }
    createdAt
  }
}`

 const minhasRedacoes = (id: any) => `query RedacoesPerId {
  redacaos( where:{correcaos:{corretor:{id:"${id}"}}}, sort: "createdAt:desc", limit: 15){
    id
    in_review
    nota_final
    redacao{
      url
    }
    correcaos{
      competencias {
        nota
        title
        obs
        obs_enem
      }
      corretor {
        id
      }
      marcacoes 
      discrepante
    }
    user {
      email
    }
    tema {
      titulo
    }
    createdAt
  }
}`

const queryTransacoes = (id: string) => `query queryTransacoes{
  subscription(id: "${id}"){
    id
    transacaos (limit: 3){
      data
      status
      metodo
      updatedAt
      createdAt
    }
  }
}`

export {
  queryCaed,
  sobreQuery,
  mediaCorrigeAi,
  planosQuery,
  redacaoParaCorrigirNovoMetodo,
  planoById,
  minhasRedacoes,
  redacaoById,
  correcaoById,
  redacaoParaCorrigir,
  queryTemas,
  redacaoPerUser,
  redacaoPerUserSortDate,
  redacaoParaCorrigirDiscrepancia,
  queryTransacoes,
  planoByValor,
}