
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
    return { message: 'ok!' };
  } catch (e) {
    console.log(e);
    return { message: 'Something went wrong' };
  }
}

async function addDocuments() {
  const collectionTypes = await strapi.plugins['meilisearch-global'].services.misc.getIndexableCollectionTypes();

  collectionTypes.map(async (collectionType) => {
    const documents = await strapi.services[collectionType].find({ _limit: -1 });
    await strapi.plugins['meilisearch-global'].services.client.addDocuments({ indexUid: 'global', collectionType, data: documents });
  });

  return { message: 'ok!' };
}

async function getStats() {
  const stats = await strapi.plugins['meilisearch-global'].services.client.getStats({ indexUid: 'global' });

  return stats;
}

module.exports = {
  getIndexes,
  clearDocuments,
  addDocuments,
  getStats
}