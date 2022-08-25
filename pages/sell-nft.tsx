import type { NextPage } from "next"
import { Form, useNotification, Button } from "web3uikit"
import { ethers, BigNumber } from "ethers"
import { BasicNftAbi, ContractAddress, NftMarketplaceAbi } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"

interface NetworkConfigItem {
  NftMarketplace: string[]
}

interface NetworkConfigMap {
  [chainId: string]: NetworkConfigItem
}

const SellNft: NextPage = () => {
  const dispatch = useNotification()
  const { chainId, account, isWeb3Enabled } = useMoralis()
  const [isHaveFund, setIsHaveFund] = useState(false)
  const [sellerFund, setSellerFund] = useState("0")

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

  async function getSellerFund() {
    const getSellerOptions = {
      abi: NftMarketplaceAbi,
      contractAddress: marketplaceAddress,
      functionName: "getSellerFund",
      params: {
        seller: account,
      },
    }

    const fund = (await runContractFunction({
      params: getSellerOptions,
      onError: (error) => {
        console.log(error)
      },
    })) as BigNumber

    if (fund) {
      setIsHaveFund(fund.gt(0))
      setSellerFund(ethers.utils.formatEther(fund))
    }
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      getSellerFund()
    }
  }, [isHaveFund, isWeb3Enabled, account, chainId])

  async function handleWithdrawSuccess(tx: any) {
    const receipt = await tx.wait()
    dispatch({
      type: "success",
      title: "Withdraw success",
      message: `Withdraw success with tx ${receipt.transactionHash}`,
      position: "topL",
    })
    // setIsHaveFund(false)
  }

  async function handleWithdraw() {
    const options = {
      abi: NftMarketplaceAbi,
      contractAddress: marketplaceAddress,
      functionName: "withdrawSellerFund",
    }

    await runContractFunction({
      params: options,
      onError: (error) => {
        console.log(error)
      },
      onSuccess: handleWithdrawSuccess,
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
      <div className="py-4">
        <div className="flex flex-col gap-2 justify-items-center w-fit">
          <h1 className="text-2xl">Withdraw sale fund: {sellerFund} ETH</h1>
          {isHaveFund ? (
            <div>
              <Button
                id="withdraw-proceeds"
                onClick={handleWithdraw}
                text="Withdraw"
                theme="primary"
                type="button"
              />
            </div>
          ) : (
            <div>No withdraw detect</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SellNft
