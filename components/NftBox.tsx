import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { BasicNftAbi, NftMarketplaceAbi, ContractAddress } from "../constants"
import { Card, useNotification } from "web3uikit"
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
  const dispatch = useNotification()

  const isOwnByYou = seller == account || seller == undefined
  const displayTextOwner = isOwnByYou ? "you" : truncateStr(seller || "", 15)
  const { runContractFunction: getTokenURI } = useWeb3Contract({
    abi: BasicNftAbi,
    contractAddress: nftAddress,
    functionName: "tokenURI",
    params: {
      tokenId,
    },
  })

  const { runContractFunction: buyItem } = useWeb3Contract({
    abi: NftMarketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "buyItem",
    params: {
      nftAddress,
      tokenId,
    },
    msgValue: price,
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

  async function handleBuyItemSuccess(tx: any) {
    const result = await tx.wait(1)
    dispatch({
      type: "success",
      message: `Buy nft success on tx ${result.transactionHash}`,
      title: "Buy NFT",
      position: "topR",
    })
  }
  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI()
    }
  }, [isWeb3Enabled])

  function handleShowModal() {
    isOwnByYou
      ? setShowModal(true)
      : buyItem({
          onError: (error) => {
            console.log(error)
          },
          onSuccess: handleBuyItemSuccess,
        })
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
