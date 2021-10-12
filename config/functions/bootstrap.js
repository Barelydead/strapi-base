'use strict';

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#bootstrap
 */

const path = require('path');
const fs = require('fs');
const mime = require('mime-types');

/**
 * Check if app is on first run.
 */
const isFirstRun = async () => {
  const pluginStore = strapi.store({
    environment: strapi.config.environment,
    type: 'type',
    name: 'setup',
  });

  const initHasRun = await pluginStore.get({ key: 'initHasRun' });

  await pluginStore.set({ key: 'initHasRun', value: true });

  return !initHasRun;
};

/**
 * Create a super admin.
 */
const createAdmin = async () => {
  const params = {
    username: process.env.DEV_USER || 'admin',
    password: process.env.DEV_PASS || 'admin',
    firstname: process.env.DEV_USER || 'Admin',
    lastname: process.env.DEV_USER || 'Admin',
    email: process.env.DEV_EMAIL || 'admin@test.test',
    blocked: false,
    isActive: true,
  };

  //Check if any account exists.
  const admins = await strapi.query('user', 'admin').find();

  if (admins.length === 0) {
    try {
      let tempPass = params.password;
      let verifyRole = await strapi.query('role', 'admin').findOne({ code: 'strapi-super-admin' });

      params.roles = verifyRole;
      params.password = await strapi.admin.services.auth.hashPassword(
        params.password
      );

      await strapi.query('user', 'admin').create({
        ...params,
      });

      strapi.log.info('Admin account was successfully created.');
      strapi.log.info(`Email: ${params.email}`);
      strapi.log.info(`Password: ${tempPass}`);
    } catch (error) {
      strapi.log.error(
        `Couldn't create Admin account during bootstrap: `,
        error
      );
    }
  }
};

const getPlaceHolderImage = async () =>
  await strapi.plugins.upload.services.upload.fetch({ id: 1 });

/**
 * Create landingpages
 */
const createLandingpages = async () => {
  const image = await getPlaceHolderImage();

  strapi.services.landingpage.create({
    title: 'Touch down!',
    Layout: [
      {
        __component: 'components.hero',
        label: 'Strapi',
        heading: 'Så skapar vi värde',
        preamble:
          'För att skapa en webbplats eller en digital tjänst som faktiskt ger resultat krävs både rätt kompetens och rätt process. Och det har vi.',
        link: {
          text: 'Läs mer',
          url: 'http://kodamera.se',
        },
        image: image,
      },
    ],
  });
};

/**
 * Create placeholder image using the upload plugin.
 */
const createPlaceholderImage = async () => {
  const imgPath = __dirname + '/../../public/seed/placeholder.png';
  const name = path.basename(imgPath);

  const buffer = fs.statSync(imgPath);

  await strapi.plugins.upload.services.upload.upload({
    data: {}, //mandatory declare the data(can be empty), otherwise it will give you an undefined error.
    files: {
      path: imgPath,
      name: name,
      type: mime.lookup(imgPath),
      size: buffer.size,
    },
  });
};

module.exports = async () => {
  const shouldSeed = await isFirstRun();

  if (shouldSeed) {
    await createAdmin();
    await createPlaceholderImage();
    await createLandingpages();
  }
};
