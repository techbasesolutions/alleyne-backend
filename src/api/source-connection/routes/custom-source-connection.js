'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/source-connections/:id/verify',
      handler: 'source-connection.verify',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'POST',
      path: '/source-connections/:id/trigger-sync',
      handler: 'source-connection.triggerSync',
      config: { policies: [], middlewares: [] },
    },
  ],
};
