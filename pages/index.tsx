import type { NextPage } from "next"
import Image from "next/image"
import { useMoralisQuery } from "react-moralis"
import styles from "../styles/Home.module.css"

const Home: NextPage = () => {
  const { data: listedNfts, isFetching: isfetchingListedNfts } =
    useMoralisQuery("ActiveItem", (query) =>
      query.limit(10).descending("tokenId")
    )

  console.log(listedNfts)

  return (
    <div className={styles.container}>
      {isfetchingListedNfts ? (
        <div>Loading Nft...</div>
      ) : (
        <div>
          {listedNfts.map((nft) => {
            const { marketplaceAddress, nftAddress, price, tokenId, seller } =
              nft.attributes
            return (
              <div className="p-4">
                <p className="text-xl">{`MarketPlace address: ${marketplaceAddress}`}</p>
                <p className="text-xl">{`nft Address: ${nftAddress}`}</p>
                <p className="text-xl">{`price: ${price}`}</p>
                <p className="text-xl">{`tokenId: ${tokenId}`}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Home
