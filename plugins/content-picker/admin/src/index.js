// ./plugins/colorpicker/admin/src/index.js

import pluginPkg from '../../package.json';
import ContentPicker from './components/contentPicker/index';
import pluginId from './pluginId';

export default (strapi) => {
  // const pluginDescription = pluginPkg.strapi.description || pluginPkg.description;
  const pluginDescription = 'Pick content from any collectiontype';

  const plugin = {
    blockerComponent: null,
    blockerComponentProps: {},
    description: pluginDescription,
    icon: pluginPkg.strapi.icon,
    id: pluginId,
    initializer: () => null,
    injectedComponents: [],
    isReady: true,
    leftMenuLinks: [],
    leftMenuSections: [],
    mainComponent: null,
    name: pluginPkg.strapi.name,
    preventComponentRendering: false,
    trads: {},
  };

  strapi.registerField({ type: 'contentpicker', Component: ContentPicker });

  return strapi.registerPlugin(plugin);
};