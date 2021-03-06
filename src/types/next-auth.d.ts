import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
   */
  interface Session {
    user?: {
        id?: string | null
        name?: string | null
        email?: string | null
        image?: string | null
        userType?: number | null
        subscription: any | null
    }
    expires?: string
  }
}