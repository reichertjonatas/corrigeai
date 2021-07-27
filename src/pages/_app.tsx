import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from 'next-auth/client'
import NextNprogress from 'nextjs-progressbar';
import React from 'react';

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
    </Provider>
  )
}
export default CorrigeAiApp
