Moralis.Cloud.afterSave("ItemListed", async (request) => {
  const confirmed = request.object.get("confirmed")
  const logger = Moralis.Cloud.getLogger()
  logger.info("Looking for confirmed Tx.")
  if (confirmed) {
    logger.info("Confirmed and found Item.")
    logger.info(`request | Object ${JSON.stringify(request.object)}`)
    const ActiveItem = Moralis.Object.extend("ActiveItem")

    // we have been use listing event with update price item.
    // so it need to handle activeItem to new price and delete old one
    // when price is updated.

    // query to see if have any exist active item
    const query = new Moralis.Query(ActiveItem)
    query.equalTo("marketplaceAddress", request.object.get("address"))
    query.equalTo("nftAddress", request.object.get("nftAddress"))
    query.equalTo("tokenId", request.object.get("tokenId"))
    query.equalTo("seller", request.object.get("seller"))

    logger.info(`Marketplace | Query: ${JSON.stringify(query)}`)
    const alreadyListedItem = await query.first()
    logger.info(`alreadyListedItem ${JSON.stringify(alreadyListedItem)}`)

    if (alreadyListedItem) {
      // if already list just delete it.
      logger.info(`Deleting ${alreadyListedItem.id}`)
      await alreadyListedItem.destroy()
      logger.info(
        `Deleted item with tokenId ${request.object.get(
          "tokenId"
        )} at address ${request.object.get(
          "address"
        )} since the listing is being updated. 
        For seller ${request.object.get("seller")}`
      )
    }

    // get event data from request object
    const activeItem = new ActiveItem()
    activeItem.set("marketplaceAddress", request.object.get("address"))
    activeItem.set("nftAddress", request.object.get("nftAddress"))
    activeItem.set("tokenId", request.object.get("tokenId"))
    activeItem.set("price", request.object.get("price"))
    activeItem.set("seller", request.object.get("seller"))

    // write data to db
    logger.info(
      `Adding Address: ${request.object.get(
        "address"
      )} TokenId: ${request.object.get("tokenId")}`
    )
    logger.info("Saving")
    await activeItem.save()
  }
})

Moralis.Cloud.afterSave("ItemCanceled", async (request) => {
  const confirmed = request.object.get("confirmed")
  const logger = Moralis.Cloud.getLogger()
  logger.info(`Marketplace | Object: ${JSON.stringify(request.object)}`)
  if (confirmed) {
    const ActiveItem = Moralis.Object.extend("ActiveItem")
    const query = new Moralis.Query(ActiveItem)
    query.equalTo("marketplaceAddress", request.object.get("address"))
    query.equalTo("nftAddress", request.object.get("nftAddress"))
    query.equalTo("tokenId", request.object.get("tokenId"))
    logger.info(`Marketplace | Query: ${JSON.stringify(query)}`)
    const canceledItem = await query.first()
    logger.info(`Marketplace | CanceledItem: ${canceledItem}`)
    if (canceledItem) {
      logger.info(`Deleting ${request.object.get("objectId")}`)
      await canceledItem.destroy()
      logger.info(
        `Deleted item with tokenId ${request.object.get(
          "tokenId"
        )} at address ${request.object.get("address")} since it was canceled. `
      )
    } else {
      logger.info(
        `No item canceled with address: ${request.object.get(
          "address"
        )} and tokenId: ${request.object.get("tokenId")} found.`
      )
    }
  }
})

Moralis.Cloud.afterSave("ItemBought", async (request) => {
  const confirmed = request.object.get("confirmed")
  logger.info(`Marketplace | Object: ${request.object}`)
  if (confirmed) {
    const logger = Moralis.Cloud.getLogger()
    const ActiveItem = Moralis.Object.extend("ActiveItem")
    const query = new Moralis.Query(ActiveItem)
    query.equalTo("marketplaceAddress", request.object.get("address"))
    query.equalTo("nftAddress", request.object.get("nftAddress"))
    query.equalTo("tokenId", request.object.get("tokenId"))
    logger.info(`Marketplace | Query: ${query}`)
    const boughtItem = await query.first()
    logger.info(`Marketplace | boughtItem: ${JSON.stringify(boughtItem)}`)
    if (boughtItem) {
      logger.info(`Deleting boughtItem ${boughtItem.id}`)
      await boughtItem.destroy()
      logger.info(
        `Deleted item with tokenId ${request.object.get(
          "tokenId"
        )} at address ${request.object.get(
          "address"
        )} from ActiveItem table since it was bought.`
      )
    } else {
      logger.info(
        `No item bought with address: ${request.object.get(
          "address"
        )} and tokenId: ${request.object.get("tokenId")} found`
      )
    }
  }
})
