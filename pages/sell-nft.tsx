import type { NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"

const SellNft: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>NFT Marketplace</title>
        <meta name="description" content="NFT Marketplace use with Moralis" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      Sell Page
    </div>
  )
}

export default SellNft
