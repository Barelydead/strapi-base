'use strict'
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

async function afterCreate(result, collection, client) {
  result.id = `${collection}-${result.id}`;
  result.collectionType = collection;
  try {
    await client.addDocuments({
      indexUid: 'global',
      data: [result],
    })
  } catch (e) {
    console.error(e)
  }
}

async function afterDelete(result, collection, client) {
  result.id = `${collection}-${result.id}`;
  result.collectionType = collection;
  try {
    // works with both delete methods
    const documentIds = Array.isArray(result)
      ? result.map(doc => doc.id)
      : [result.id]
    await client.deleteDocuments({
      indexUid: 'global',
      documentIds,
    })
  } catch (e) {
    console.error(e)
  }
}

async function afterUpdate(result, collection, client) {
  result.id = `${collection}-${result.id}`;
  result.collectionType = collection;
  try {
    await client.addDocuments({
      indexUid: 'global',
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