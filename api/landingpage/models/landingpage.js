'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      if (data.title) {
        data.slug = await strapi.services.landingpage.getUniqueSlug(data.title);
      }
    },
    beforeUpdate: async (params, data) => {
      if (data.title) {
        const slug = await strapi.services.landingpage.getUniqueSlug(data.title, params.id);
        data.slug = slug;
      }
    },
  },
};
