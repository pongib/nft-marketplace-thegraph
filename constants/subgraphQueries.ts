import { gql } from "@apollo/client"
import { ethers } from "ethers"

const activeItemsQuery = gql`
  {
    activeItems(
      first: 5
      where: { buyer: "0x0000000000000000000000000000000000000000" }
    ) {
      id
      buyer
      seller
      nftAddress
      tokenId
      price
    }
  }
`
// console.log("activeItemsQuery", activeItemsQuery)

export default activeItemsQuery
