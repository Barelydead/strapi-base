module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'mysql',
        host: 'localhost',
        port: 3306,
        database: 'strapi',
        username: 'root',
        password: ''
      },
      options: {
        useNullAsDefault: true,
      },
    },
  },
});
