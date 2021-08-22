import Strapi from 'strapi-sdk-js'

const strapi = (token: string | undefined | unknown) => {
    return new Strapi({
        url: process.env.NEXT_PUBLIC_URL_API,
        axiosOptions: {
            headers: token ? { Authorization: `Bearer ${token}`} : {}
        },
    })
}

export { strapi }