const { expect } = require('@jest/globals');
const request = require('supertest');

describe('content search is set up', () => {
  beforeAll(async () => {
    await strapi.query('landingpage').create({
      title: 'article landingpage',
      metadata: {}
    })

    await strapi.query('article').create({
      title: 'first article'
    })
  })

  test('Content search endpoint exists and is accessible', async (done) => {
    const res = await request(strapi.server).get('/content-search?_q=art');

    expect(res.statusCode).toBe(200);
    done();
  });

  test('Service fetches correct content types', async (done) => {
    const contentTypes = strapi.plugins['content-search'].services.main.getCollectionTypes();

    expect(contentTypes).toContain('landingpage');
    expect(contentTypes).toContain('article');

    done();
  });

  test('Search function finds expected content', async (done) => {
    const content = await strapi.plugins['content-search'].services.main.searchCollectionType('article', {_q: 'art', _limit: 1});

    expect(content).toHaveLength(1);
    expect(content[0].title).toBe('first article');
    expect(content[0]).toHaveProperty('__collectionType');
    done();
  });

  test('Content search endpoint returns entries of multiple collection types.', async (done) => {
    const content = await strapi.plugins['content-search'].services.main.searchAllCollectionTypes({_q: 'article'});

    expect(content).toHaveLength(2);
    expect(content[0].__collectionType).toBe('article');
    expect(content[1].__collectionType).toBe('landingpage');
    done();
  });
})