'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

const slugify = require('slugify');

module.exports = {
  /**
   * Find a unique slug.
   */
  getUniqueSlug: async (title, id = false, increment = 0) => {
    const slugOptions = {
      strict: true,
      trim: true,
      lower: true
    }

    let slug;

    slug = slugify(title, slugOptions);

    if (increment !== 0) {
      slug = slugify(`${title} - ${increment}`, slugOptions);
    }

    const entries = await strapi.query('landingpage').find({ slug });

    if (id) {
      entries = entries.filter(e => e.id !== id)
    }

    if (entries.length === 0) {
      return slug
    }

    increment++
    // Call funciton again with increment.
    return await strapi.services.landingpage.getUniqueSlug(title, id, increment);
  },
};
