'use strict';

module.exports = {
  routes: [
    // Default CRUD routes
    { method: 'GET',    path: '/agencies',     handler: 'agency.find',    config: {} },
    { method: 'GET',    path: '/agencies/:id', handler: 'agency.findOne', config: {} },
    { method: 'POST',   path: '/agencies',     handler: 'agency.create',  config: {} },
    { method: 'PUT',    path: '/agencies/:id', handler: 'agency.update',  config: {} },
    { method: 'DELETE', path: '/agencies/:id', handler: 'agency.delete',  config: {} },
    // Custom: domain verification
    {
      method: 'POST',
      path: '/agencies/:id/verify-domain',
      handler: 'agency.verifyDomain',
      config: { policies: [], middlewares: [] },
    },
  ],
};
