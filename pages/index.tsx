import type { NextPage } from "next"
import Image from "next/image"
import { useMoralisQuery, useMoralis } from "react-moralis"
import styles from "../styles/Home.module.css"
import NftBox from "../components/NftBox"
import { ContractAddress, activeItemsQuery } from "../constants"
import { useQuery } from "@apollo/client"

interface NftMarketplace {
  price: string
  nftAddress: string
  tokenId: string
  buyer: string
  seller: string
}

interface NetworkConfigItem {
  [key: string]: string[]
}

interface NetworkConfigMap {
  [chainId: string]: NetworkConfigItem
}

const Home: NextPage = () => {
  const { isWeb3Enabled, chainId } = useMoralis()

  const chainString = chainId ? parseInt(chainId).toString() : "31337"
  const contractAddress: NetworkConfigMap = ContractAddress
  console.log("chainString", chainString)
  console.log("contractAddress", contractAddress)

  const marketplaceAddress = contractAddress[chainString]["NftMarketplace"][0]
  console.log("mkp address when load", marketplaceAddress)

  const { loading, error, data: listedNfts } = useQuery(activeItemsQuery)
  console.log("listedNfts", listedNfts)

  return (
    <div className="container mx-auto">
      <h1 className="px-4 py-4 font-bold text-2xl">Recently Added</h1>
      <div>
        {isWeb3Enabled ? (
          loading || !listedNfts ? (
            <div>Loading Nft...</div>
          ) : (
            <div className="flex flex-wrap">
              {listedNfts.activeItems.map((nft: NftMarketplace) => {
                const { nftAddress, price, tokenId, seller } = nft
                console.log("nftAddress from query", nftAddress)

                return (
                  <div className="p-4" key={`${nftAddress}${tokenId}`}>
                    <NftBox
                      nftAddress={nftAddress}
                      marketplaceAddress={marketplaceAddress}
                      price={price}
                      tokenId={tokenId}
                      seller={seller}
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
