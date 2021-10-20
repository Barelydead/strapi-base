const { expect } = require('@jest/globals');
const request = require('supertest');

describe('Landingpage collection type is set up correctly', () => {
  // Applies only to tests in this describe block
  beforeAll(() => {
    strapi.query('landingpage').create({
      'title': 'Some landingpage',
      'metadata': {}
    })

    strapi.query('landingpage').create({
      'title': 'Some other landingpage',
      'metadata': {}
    })
  });

  afterAll(async () => {
    const pages = await strapi.query('landinpage').find()

    pages.map((p) => strapi.query('landingpage').delete({ id: p.id }))
  });

  test('findOne endpoint is available and returns correct response', async (done) => {
    const res = await request(strapi.server).get('/landingpages/1');

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Some landingpage');

    expect(res.body.slug).toBe('some-landingpage');
    done();
  });

  test('newly created landingpage to get unique slug', async () => {
    const page = await strapi.query('landingpage').create({
      'title': 'Some landingpage',
      'metadata': {}
    })

    expect(page.slug).toBe('some-landingpage-1');
  });
});