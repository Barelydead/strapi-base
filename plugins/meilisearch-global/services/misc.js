const getIndexableCollectionTypes = async () => {
  const models = strapi.models;

  return Object.keys(models).filter((modelName) => {
    if (models[modelName].options.indexGlobal) {
      return modelName
    }
  });
}

module.exports = {
  getIndexableCollectionTypes,
}