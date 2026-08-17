'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/seed/create-user',
      handler: 'seed.createUser',
      config: {
        // No auth: false — let Strapi parse the Authorization header so
        // ctx.state.auth is populated. The controller checks for full-access token.
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/seed/list-users',
      handler: 'seed.listUsers',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/seed/clear-users',
      handler: 'seed.clearUsers',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'GET',
      path: '/seed/db-check',
      handler: 'seed.dbCheck',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
