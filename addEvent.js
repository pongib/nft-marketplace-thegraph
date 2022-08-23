const Moralis = require("moralis-v1/node")
require("dotenv/config")
const contractAddresses = require("./constants/networkMapping.json")
const chainId = process.env.CHAIN_ID || 31337
// moralis use local chainId is 1337
const moralistChainId = chainId == 31337 ? "1337" : chainId
const contractAddress = contractAddresses[chainId]["NftMarketplace"][0]

/* Moralis init code */
const serverUrl = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL
const appId = process.env.NEXT_PUBLIC_MORALIS_APP_ID
const masterKey = process.env.MORALIS_MASTERKEY

async function main() {
  await Moralis.start({ serverUrl, appId, masterKey })
  console.log(`Working on address ${contractAddress}`)
  const itemListedOptions = {
    chainId: moralistChainId,
    address: contractAddress,
    topic: "ItemListed(address,address,uint256,uint256)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "seller",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
      ],
      name: "ItemListed",
      type: "event",
    },
    tableName: "ItemListed",
    sync_historical: true,
  }
  const itemCanceledOptions = {
    chainId: moralistChainId,
    address: contractAddress,
    topic: "ItemCanceled(address,address,uint256)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "seller",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ItemCanceled",
      type: "event",
    },
    tableName: "ItemCanceled",
    sync_historical: true,
  }
  const itemBoughtOptions = {
    chainId: moralistChainId,
    address: contractAddress,
    topic: "ItemBought(address,address,uint256,uint256)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "buyer",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
      ],
      name: "ItemBought",
      type: "event",
    },
    tableName: "ItemBought",
    sync_historical: true,
  }

  const listedResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    itemListedOptions,
    {
      useMasterKey: true,
    }
  )
  const boughtResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    itemBoughtOptions,
    {
      useMasterKey: true,
    }
  )
  const canceledResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    itemCanceledOptions,
    {
      useMasterKey: true,
    }
  )

  if (
    listedResponse.success &&
    boughtResponse.success &&
    canceledResponse.success
  ) {
    console.log("Moralis watch contract event success!")
  } else {
    console.log("Something error happend.")
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
