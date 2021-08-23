import axios from "axios";

export const API = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_URL_PUBLICA}/api`,
})

// export const postGraphqla = async (query: string, token?: string | null | undefined | unknown ) => { 
//     const response = await axios.post(`${process.env.NEXT_PUBLIC_URL_API}/graphql`, {
//         headers: token ? { 'Authorization': `bearer ${token}`} : {},
//         query: `${query}`
//     })
//     if(response.status === 200 || response.status === 204) {
//         return response.data;
//     } else 
//         return { error: true, data: "error desconhecido!"}; 
// }
