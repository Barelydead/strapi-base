const { expect } = require('@jest/globals');
const request = require('supertest');

it('Check valid reponse and data from /landingpages/1', async (done) => {
  // Sends GET Request to /landingpages/1 endpoint
  const res = await request(strapi.server).get('/landingpages/1')

  expect(res.statusCode).toBe(200)
  expect(res.body.title).toBe('Touch down!')

  done()
});

