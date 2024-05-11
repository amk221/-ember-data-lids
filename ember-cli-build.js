'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    emberData: {
      compatWith: '5.3.3',
      includeDataAdapterInProduction: false,
      deprecations: {
        DEPRECATE_RELATIONSHIP_REMOTE_UPDATE_CLEARING_LOCAL_STATE: false, // set to false to strip the deprecated code (thereby opting into the new behavior)
      },
      debug: {
        LOG_PAYLOADS: true,
      },
    },
  });

  return app.toTree();
};
