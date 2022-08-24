const { default: Moralis } = require("moralis")

Moralis.Cloud.afterSave("ItemListed", async (request) => {
  const confirmed = request.object.get("confirmed")
  const logger = Moralis.Cloud.getLogger()
  logger.info("Looking for confirmed Tx.")
  if (confirmed) {
    logger.info("Confirmed and found Item.")

    const ActiveItem = Moralis.Object.extend("ActiveItem")
    const activeItem = new ActiveItem()
    // get event data from request object
    activeItem.set("marketPlaceAddress", request.object.get("address"))
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
  logger.info(`Marketplace | Object: ${request.object}`)
  if (confirmed) {
    const ActiveItem = Moralis.Cloud.extend("ActiveItem")
    const query = new Moralis.Query(ActiveItem)
    query.equalTo("marketplaceAddress", request.object.get("address"))
    query.equalTo("nftAddress", request.object.get("nftAddress"))
    query.equalTo("tokenId", request.object.get("tokenId"))
    logger.info(`Marketplace | Query: ${query}`)
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
