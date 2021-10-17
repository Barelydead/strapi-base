module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'sqlite',
        database: '/tmp/database.sqlite', // Database can be found in .tmp/data.db
      },
      options: {
        useNullAsDefault: true,
      },
    },
  },
});
