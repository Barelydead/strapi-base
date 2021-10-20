'use strict';

const { flatten } = require('lodash');
const { sanitizeEntity } = require('strapi-utils');

/**
 * content-search.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */
const getCollectionTypes = () => {
  return Object.keys(strapi.api)
}

const searchCollectionType = async (type, params) => {
  const result = await strapi.services[type].search({ ...params });

  return result.map((entry) => {
    entry.__collectionType = type
    return sanitizeEntity(entry, {model: strapi.models[type]});
  });
}

const searchAllCollectionTypes = (params) => {
  const collectionTypes = strapi.plugins['content-search'].services.main.getCollectionTypes();

  return Promise.all(
    collectionTypes.map((type) => {
      return strapi.plugins['content-search'].services.main.searchCollectionType(type, params);
    }),
  ).then((values) => flatten(values));
}

module.exports = {
  getCollectionTypes,
  searchCollectionType,
  searchAllCollectionTypes
};
