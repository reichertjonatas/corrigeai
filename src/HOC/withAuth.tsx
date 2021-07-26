import { getSession, useSession } from 'next-auth/client';
import { useRouter } from 'next/dist/client/router';
import React from 'react'
import LayoutCarregando from '../components/layout/LayoutCarregando';

// export const withAuth = (Component : any) => {
//     const CheckLogin = (props : any) => {
//         const [ session, loading ] = useSession()
//         const router = useRouter()

//         if (typeof window !== "undefined") {
            
//             return <Component {...props} />
//         }

//         return <></>;
//     }
//     return CheckLogin;
// }