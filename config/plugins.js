module.exports = {
  upload: {
    breakpoints: {
      xlarge: 1920,
      large: 1000,
      medium: 750,
      small: 500,
      xsmall: 64
    }
  },
  'config-sync': {
    destination: "extensions/config-sync/files/",
    minify: false,
    importOnBootstrap: false,
    include: [
      "core-store",
      "role-permissions"
    ],
    exclude: [
      "core-store.plugin_users-permissions_grant",
      "core-store.type_setup_initHasRun"
    ]
  },
}
