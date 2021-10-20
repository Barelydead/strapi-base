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
 * Create default locales and set default.
 */
const setDefaultLocale = async () => {
  const locales = [
    {code: 'sv', name: 'Swedish (sv)'}
  ]

  const locale = await strapi.plugins.i18n.services.locales.create({
    code: 'sv',
    name: 'Swedish (sv)'
  });

  await strapi.plugins.i18n.services.locales.setDefaultLocale({code: 'sv'});

  strapi.log.info('Swedish (sv) set as default locale');
};

/**
 * Set default permissions on all collection types.
 */
const setDefaultPermissions = async () => {
  const role = await strapi
    .query("role", "users-permissions")
    .findOne({ type: "public" });

  const permissions = await strapi
    .query("permission", "users-permissions")
    .find({ type: "application", role: role.id, action_in: ['find', 'findone', 'count'] });

  await Promise.all(
    permissions.map(p =>
      strapi
        .query("permission", "users-permissions")
        .update({ id: p.id }, { enabled: true })
    )
  );

  strapi.log.info('Default permissions was enabled');
  strapi.log.info('Find, findOne and Count is available for all collection types.');
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
    metadata: {
      title: 'Touch down!',
      description: 'A base landingpage',
      image: image,
    },
    layout: [
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
      {
        __component: 'components.media-with-text',
        label: 'Media with text',
        heading: 'Förvaltning',
        preamble: 'Vi har dedikerad personal som är experter på att förvalta webblösningar.',
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

/**
 * Import all configuration.
 */
const importAllConfig = async () => {
  try {
    await strapi.plugins['config-sync'].services.main.importAllConfig();
    strapi.log.info('Imported all site configuration.')
  } catch(e) {
    strapi.log.error('Something went wrong during config import.')
  }
}

module.exports = async () => {
  const shouldSeed = await isFirstRun();

  if (shouldSeed) {
    await createAdmin();
    await setDefaultLocale();

    if (process.env.NODE_ENV !== 'test') {
      await createPlaceholderImage();
      await createLandingpages();
    }
    await importAllConfig();
  }
};
