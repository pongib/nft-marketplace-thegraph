import type { NextPage } from "next"
import Image from "next/image"
import { useMoralisQuery, useMoralis } from "react-moralis"
import styles from "../styles/Home.module.css"
import NftBox from "../components/NftBox"
const Home: NextPage = () => {
  const { isWeb3Enabled } = useMoralis()
  const { data: listedNfts, isFetching: isfetchingListedNfts } =
    useMoralisQuery("ActiveItem", (query) =>
      query.limit(10).descending("tokenId")
    )

  return (
    <div className="container mx-auto">
      <h1 className="px-4 py-4 font-bold text-2xl">Recently Added</h1>
      <div className="flex flex-wrap">
        {isWeb3Enabled ? (
          isfetchingListedNfts ? (
            <div>Loading Nft...</div>
          ) : (
            <div>
              {listedNfts.map((nft) => {
                const {
                  marketplaceAddress,
                  nftAddress,
                  price,
                  tokenId,
                  seller,
                } = nft.attributes
                console.log("nftAddress from query", nftAddress)

                return (
                  <div className="p-4">
                    <NftBox
                      marketplaceAddress={marketplaceAddress}
                      nftAddress={nftAddress}
                      price={price}
                      tokenId={tokenId}
                      seller={seller}
                      key={`${nftAddress}${tokenId}`}
                    />
                  </div>
                )
              })}
            </div>
          )
        ) : (
          <div className="text-center font-bold text-3xl">
            Please connect to Wallet
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
