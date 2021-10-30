'use strict'

const client = require('../../services/client.js');
const lifecycles = require('../../services/lifecycles.js');
const misc = require('../../services/misc.js');

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/concepts/configurations.html#bootstrap
 */

async function addLifecycles() {
  // Add lifecyles
  const collectionTypes = await misc.getIndexableCollectionTypes();

  collectionTypes.map((type) => {
    const model = strapi.models[type]
    const lifeCycleMethods = Object.keys(lifecycles);
    model.lifecycles = model.lifecycles || {}

    lifeCycleMethods.map(methodName => {
      // Get previously definied methods or set to empty function.
      const fn = model.lifecycles[methodName] || (() => {})

      // First run previously definied function and append our method.
      model.lifecycles[methodName] = data => {
        fn(data)
        lifecycles[methodName](data, type, client)
      }
    })
  })
}

async function createGlobalIndex() {
  client.createIndex({indexUid: 'global'})
}

module.exports = async () => {
  addLifecycles();
  createGlobalIndex();
}
