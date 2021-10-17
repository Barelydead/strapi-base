const { expect } = require('@jest/globals');
const fs = require('fs');
const { setupStrapi } = require('./helpers/strapi');

jest.setTimeout(20000)

/** this code is called once before any test is called */
beforeAll(async () => {
  strapi = await setupStrapi(); // singleton so it can be called many times
});

/** this code is called once before all the tested are finished */
afterAll(async () => {
  const dbSettings = strapi.config.get('database.connections.default.settings');

  //close server to release the db-file
  await strapi.destroy();

  //delete test database after all tests
  if (dbSettings && dbSettings.filename) {
    const tmpDbFile = `${__dirname}/../${dbSettings.filename}`;
    if (fs.existsSync(tmpDbFile)) {
      fs.unlinkSync(tmpDbFile);
    }
  }
});

it('strapi is defined', () => {
  expect(strapi).toBeDefined();
});

it('bootstrapping sets sv as default locale', async () => {
  const locale = await strapi.plugins.i18n.services.locales.getDefaultLocale();

  expect(locale).toBe('sv');
});

it('bootstrapping created default content', async () => {
  const landingpages = await strapi.query('landingpage').find();

  expect(landingpages.length).toBe(1);
});

// Test the landinpage collection.
require('./landingpage');
