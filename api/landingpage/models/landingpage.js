'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const slugify = require('slugify');

/**
 * Get a unique slug.
 */
const getUniqueSlug = async (title, id = false, increment = 0) => {
  let slug;

  slug = slugify(title, {
    strict: true,
    trim: true,
    lower: true
  });

  if (increment !== 0) {
      slug = slugify(`${title} - ${increment}`, {
        strict: true,
        trim: true,
        lower: true
      });
  }

  const entries = await strapi.query('landingpage').find({ slug });

  if (id) {
    entries = entries.filter(e => e.id !== id)
  }

  if (entries.length === 0) {
    return slug
  }

  increment++
  return await getUniqueSlug(title, id, increment);
}

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      if (data.title) {
        data.slug = await getUniqueSlug(data.title);
      }
    },
    beforeUpdate: async (params, data) => {
      if (data.title) {
        const slug = await getUniqueSlug(data.title, params.id);
        data.slug = slug;
      }
    },
  },
};
