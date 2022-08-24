import type { NextPage } from "next"
import Image from "next/image"
import { useMoralisQuery } from "react-moralis"
import styles from "../styles/Home.module.css"

const Home: NextPage = () => {
  // const { data: listedNfts, isFetching: fetchingListedNfts } = useMoralisQuery(
  //   "ActiveItem",
  //   (query) => query.limit(10).descending("tokenId")
  // )

  // console.log(listedNfts)

  return <div className={styles.container}>Hi</div>
}

export default Home
