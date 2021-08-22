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
      }
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

const redacaoById = (id: string) => `query RedacoesPerId {
  redacao(id: "${id}"){
    id
    in_review
    nota_final
    redacao{
      url
    }
    correcaos {
      id
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

export {
  queryCaed,
  sobreQuery,
  mediaCorrigeAi,
  minhasRedacoes,
  redacaoById,
  redacaoParaCorrigir,
  queryTemas,
  redacaoPerUser,
  redacaoPerUserSortDate
}