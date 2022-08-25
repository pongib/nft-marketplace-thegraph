import "../styles/globals.css"
import Head from "next/head"
import type { AppProps } from "next/app"
import { MoralisProvider } from "react-moralis"
import Header from "../components/Header"
import { NotificationProvider } from "web3uikit"

const appIdMoralis = process.env.NEXT_PUBLIC_MORALIS_APP_ID!
const serverUrlMoralis = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL!

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <title>NFT Marketplace</title>
        <meta name="description" content="NFT Marketplace use with Moralis" />
        <link rel="icon" href="/vercel.svg" />
      </Head>
      <MoralisProvider serverUrl={serverUrlMoralis} appId={appIdMoralis}>
        <NotificationProvider>
          <Header />
          <Component {...pageProps} />
        </NotificationProvider>
      </MoralisProvider>
    </div>
  )
}

export default MyApp
