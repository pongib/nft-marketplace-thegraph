import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { BasicNftAbi, NftMarketplaceAbi, ContractAddress } from "../constants"
import { Card } from "web3uikit"
import Image from "next/image"
import { ethers } from "ethers"
import UpdateLisingModal from "./UpdateListingModal"

interface ContractNftMarketplace {
  price: string
  nftAddress: string
  tokenId: string
  marketplaceAddress: string
  seller: string
}

const truncateStr = (fullStr: string, strLen: number) => {
  if (fullStr.length <= strLen) return fullStr

  const separator = "..."
  const seperatorLength = separator.length
  const charsToShow = strLen - seperatorLength
  const frontChars = Math.ceil(charsToShow / 2)
  const backChars = Math.floor(charsToShow / 2)
  return (
    fullStr.substring(0, frontChars) +
    separator +
    fullStr.substring(fullStr.length - backChars)
  )
}

const NftBox = ({
  price,
  nftAddress,
  tokenId,
  marketplaceAddress,
  seller,
}: ContractNftMarketplace) => {
  const { isWeb3Enabled, account } = useMoralis()
  const [imageURL, setImageURL] = useState("")
  const [nftName, setNftName] = useState("")
  const [nftDescription, setNftDescription] = useState("")
  const [showModal, setShowModal] = useState(false)

  const isOwnByYou = seller == account || seller == undefined
  const displayTextOwner = isOwnByYou ? "you" : truncateStr(seller || "", 15)
  const { runContractFunction: getTokenURI } = useWeb3Contract({
    abi: BasicNftAbi,
    contractAddress: nftAddress,
    functionName: "tokenURI",
    params: {
      tokenId: tokenId,
    },
  })

  async function updateUI() {
    console.log("update UI")
    const tokenURI = (await getTokenURI()) as string
    console.log("tokenURI", tokenURI)
    if (tokenURI) {
      // convert IPFS to normal HTTPS
      const requestURL = tokenURI.replace(
        "ipfs://",
        "https://gateway.pinata.cloud/ipfs/"
      )

      const response = await fetch(requestURL)
      const tokenURIResponse = await response.json()
      const imageURI = tokenURIResponse.image
      const imageRequestURL = imageURI.replace(
        "ipfs://",
        "https://ipfs.io/ipfs/"
      )
      setImageURL(imageRequestURL)
      setNftName(tokenURIResponse.name)
      setNftDescription(tokenURIResponse.description)
    }
  }

  useEffect(() => {
    console.log("isWeb3Enabled", isWeb3Enabled)
    if (isWeb3Enabled) {
      updateUI()
    }
  }, [isWeb3Enabled])

  function handleShowModal() {
    isOwnByYou ? setShowModal(true) : console.log("Go to buy")
  }

  function handleCloseModal() {
    setShowModal(false)
  }

  return (
    <div>
      {imageURL ? (
        <div>
          <UpdateLisingModal
            nftAddress={nftAddress}
            tokenId={tokenId}
            marketplaceAddress={marketplaceAddress}
            isVisible={showModal}
            onClose={handleCloseModal}
          ></UpdateLisingModal>
          <Card
            title={nftName}
            description={nftDescription}
            onClick={handleShowModal}
          >
            <div className="p-2">
              <div className="flex flex-col items-end gap-2">
                <div>#{tokenId}</div>
                <div className="italic text-sm">
                  Owned by {displayTextOwner}
                </div>
                <Image
                  loader={() => imageURL}
                  src={imageURL}
                  height="200"
                  width="200"
                ></Image>
                <div className="font-bold">
                  {ethers.utils.formatEther(price)} ETH
                </div>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )
}

export default NftBox
