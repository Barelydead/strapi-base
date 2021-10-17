const { expect } = require('@jest/globals');
const request = require('supertest');

it('Check valid reponse and data from /landingpages/1', async (done) => {
  // Sends GET Request to /landingpages/1 endpoint
  const res = await request(strapi.server).get('/landingpages/1');

  expect(res.statusCode).toBe(200);
  expect(res.body.title).toBe('Touch down!');

  done();
});

it('Generates unique slug', async () => {
  const landing1 = await strapi.query('landingpage').create({
    title: "Some title!",
    metadata: {}
  });

  expect(landing1.slug).toBe('some-title');

  const landing2 = await strapi.query('landingpage').create({
    title: "Some title!",
    metadata: {}
  });

  expect(landing2.slug).toBe('some-title-1');
});
