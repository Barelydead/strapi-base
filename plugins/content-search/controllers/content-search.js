'use strict';

/**
 * content-search.js controller
 *
 * @description: A set of functions called "actions" of the `content-search` plugin.
 */

module.exports = {

  /**
   * Default action.
   *
   * @return {Object}
   */

  index: async (ctx) => {
    // Add your own logic here.
   
    if (ctx.query._q) {
      const searchResult = await strapi.plugins['content-search'].services.main.searchAllCollectionTypes(ctx.query)
      return searchResult;
    }

    return {};
  }
};
