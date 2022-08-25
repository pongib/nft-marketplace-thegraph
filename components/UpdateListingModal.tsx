import { ChangeEvent, useState } from "react"
import { useWeb3Contract } from "react-moralis"
import { Modal, Input, useNotification } from "web3uikit"
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
  const dispatch = useNotification()

  async function handleUpdateListingSuccess(tx: any) {
    const result = await tx.wait(1)
    dispatch({
      type: "success",
      message: `Listing updated on tx ${result.transactionHash}`,
      title: "Listing updated - please refresh and move some blocks",
      position: "topR",
    })
    // reset
    onClose()
    setNewPrice("0")
  }

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
          onSuccess: handleUpdateListingSuccess,
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
