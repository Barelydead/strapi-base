
/**
 * meilisearch.js controller
 *
 * @description: A set of functions called "actions" of the `meilisearch` plugin.
 */

async function getIndexes() {
  return await strapi.plugins['meilisearch-global'].services.client.getIndexes();
}

async function clearDocuments() {
  try {
    await strapi.plugins['meilisearch-global'].services.client.deleteAllDocuments({ indexUid: 'global'});
    return 'index cleared';
  } catch (e) {
    console.log(e);
    return 'Somethings went wrong when clearing index.';
  }
}

async function addDocuments() {
  const collectionTypes = await strapi.plugins['meilisearch-global'].services.misc.getIndexableCollectionTypes();

  collectionTypes.map(async (collectionType) => {
    const documents = await strapi.services[collectionType].find();
    await strapi.plugins['meilisearch-global'].services.client.addDocuments({ indexUid: 'global', collectionType, data: documents });
  });

  return 'added all articles to index';
}

module.exports = {
  getIndexes,
  clearDocuments,
  addDocuments
}