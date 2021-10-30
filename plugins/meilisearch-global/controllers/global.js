
/**
 * meilisearch.js controller
 *
 * @description: A set of functions called "actions" of the `meilisearch` plugin.
 */
const { flatten } = require('lodash');

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
  const contentTypes = await strapi.plugins['meilisearch-global'].services.misc.getIndexableContentTypes();

  const data = await Promise.all(contentTypes.map(async (type) => {
    return await strapi.services[type].find();
  })).then(flatten);

  await strapi.plugins['meilisearch-global'].services.client.addDocuments({ indexUid: 'global', data: data });

  return 'added all articles to index';
}

module.exports = {
  getIndexes,
  clearDocuments,
  addDocuments
}