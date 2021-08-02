import '../styles/globals.css'
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from 'next/app'
import { Provider } from 'next-auth/client'
import NextNprogress from 'nextjs-progressbar';
import React from 'react';
import { ToastContainer } from 'react-toastify'

function CorrigeAiApp({ Component, pageProps }: AppProps) {
  return (
    <Provider session={pageProps.session}>
        <NextNprogress
            color="#002400"
            startPosition={0.4}
            stopDelayMs={200}
            height={3}
            showOnShallow={true}
          />
        <Component {...pageProps} />
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick={true}
          pauseOnHover={true}
          draggable={true}
        />
    </Provider>
  )
}
export default CorrigeAiApp
