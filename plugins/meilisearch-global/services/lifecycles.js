'use strict'
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

async function afterCreate(result, collectionType, client) {
  try {
    await client.addDocuments({
      indexUid: 'global',
      collectionType,
      data: [result],
    })
  } catch (e) {
    console.error(e)
  }
}

async function afterDelete(result, collectionType, client) {
  try {
    // works with both delete methods
    const documentIds = Array.isArray(result)
      ? result.map(doc => doc.id)
      : [result.id]
    await client.deleteDocuments({
      indexUid: 'global',
      collectionType,
      documentIds,
    })
  } catch (e) {
    console.error(e)
  }
}

async function afterUpdate(result, collectionType, client) {
  try {
    await client.addDocuments({
      indexUid: 'global',
      collectionType,
      data: [result],
    })
  } catch (e) {
    console.error(e)
  }
}

module.exports = {
  afterCreate,
  afterDelete,
  afterUpdate
}