export interface User {
    user?: {
        id?: string | null
        name?: string | null
        email?: string | null
        image?: string | null
        userType?: number | null
    }
    expires?: string
}