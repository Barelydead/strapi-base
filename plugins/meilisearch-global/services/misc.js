const getIndexableContentTypes = async () => {
  const models = strapi.models;

/*   return await Promise.all(Object.keys(models).map((modelName) => {
    return model[modelName].options.indexGlobal;
  })); */
  return Object.keys(models).filter((modelName) => {
    if (models[modelName].options.indexGlobal) {
      return modelName
    }
  });
}

module.exports = {
  getIndexableContentTypes,
}