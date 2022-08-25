import type { NextPage } from "next"
import { Form, useNotification } from "web3uikit"
import { ethers } from "ethers"
import { BasicNftAbi, ContractAddress, NftMarketplaceAbi } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"

interface NetworkConfigItem {
  NftMarketplace: string[]
}

interface NetworkConfigMap {
  [chainId: string]: NetworkConfigItem
}

const SellNft: NextPage = () => {
  const dispatch = useNotification()
  const { chainId } = useMoralis()
  // hex format for chainId
  const chainIdString = chainId ? parseInt(chainId).toString() : "31337"
  const marketplaceAddress = (ContractAddress as NetworkConfigMap)[
    chainIdString
  ]["NftMarketplace"][0]

  // @ts-ignore
  const { runContractFunction } = useWeb3Contract()

  async function approvedAndList(data: any) {
    console.log("Approving...")
    const nftAddress = data.data[0].inputResult
    const tokenId = data.data[1].inputResult
    const price = ethers.utils.parseEther(data.data[2].inputResult).toString()
    console.log("price", price)

    const approveOptions = {
      abi: BasicNftAbi,
      contractAddress: nftAddress,
      functionName: "approve",
      params: {
        to: marketplaceAddress,
        tokenId,
      },
    }

    console.log(approveOptions)

    await runContractFunction({
      params: approveOptions,
      onSuccess: (tx) => handleApproveSuccess(tx, nftAddress, tokenId, price),
      onError: (error) => {
        console.log(error)
      },
    })
  }

  async function handleApproveSuccess(
    tx: any,
    nftAddress: string,
    tokenId: string,
    price: string
  ) {
    const receipt = await tx.wait(1)
    console.log("receipt", receipt)

    const listOptions = {
      abi: NftMarketplaceAbi,
      contractAddress: marketplaceAddress,
      functionName: "listItem",
      params: {
        nftAddress,
        tokenId,
        price,
      },
    }

    console.log("listOptions", listOptions)

    await runContractFunction({
      params: listOptions,
      onError: (error) => {
        console.log(error)
      },
      onSuccess: handleListSuccess,
    })
  }

  async function handleListSuccess(tx: any) {
    const receipt = await tx.wait()

    dispatch({
      type: "success",
      title: "List Success",
      message: `List success for tx ${receipt.transactionHash}`,
      position: "topR",
    })
  }

  return (
    <div>
      <Form
        data={[
          {
            name: "NFT address",
            type: "text",
            inputWidth: "50%",
            value: "",
            key: "nftAddress",
          },
          {
            name: "Token ID",
            type: "number",
            value: "",
            key: "tokenId",
          },
          {
            name: "Price (ETH)",
            type: "number",
            value: "",
            key: "price",
          },
        ]}
        title="Sell your NFT!"
        id="Main Form"
        onSubmit={approvedAndList}
      />
    </div>
  )
}

export default SellNft
