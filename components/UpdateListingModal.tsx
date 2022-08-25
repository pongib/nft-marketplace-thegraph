import { ChangeEvent, useState } from "react"
import { useWeb3Contract } from "react-moralis"
import { Modal, Input } from "web3uikit"
import { NftMarketplaceAbi } from "../constants"
import { ethers } from "ethers"
interface UpdateList {
  nftAddress: string
  tokenId: string
  marketplaceAddress: string
  isVisible: boolean
  onClose: () => void
}

const UpdateLisingModal = ({
  nftAddress,
  tokenId,
  marketplaceAddress,
  isVisible,
  onClose,
}: UpdateList) => {
  console.log("nftMarketplaceAddress", marketplaceAddress)

  const [newPrice, setNewPrice] = useState("0")
  const { runContractFunction: updateListing } = useWeb3Contract({
    contractAddress: marketplaceAddress,
    abi: NftMarketplaceAbi,
    functionName: "updateListing",
    params: {
      nftAddress,
      tokenId,
      newPrice: ethers.utils.parseEther(newPrice),
    },
  })

  return (
    <Modal
      isVisible={isVisible}
      onCancel={onClose}
      onCloseButtonPressed={onClose}
      title="NFT Details"
      okText="Save New Listing Price"
      cancelText="Leave it"
      onOk={() => {
        updateListing({
          onError: (error) => {
            console.log(error)
          },
        })
      }}
    >
      <Input
        label="Update listing price in ETH"
        name="New listing price"
        type="number"
        onChange={(event) => setNewPrice(event.target.value)}
      />
    </Modal>
  )
}

export default UpdateLisingModal
