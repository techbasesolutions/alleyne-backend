'use strict';

module.exports = {
  routes: [
    { method: 'GET',    path: '/sync-runs',     handler: 'sync-run.find',    config: {} },
    { method: 'GET',    path: '/sync-runs/:id', handler: 'sync-run.findOne', config: {} },
    { method: 'POST',   path: '/sync-runs',     handler: 'sync-run.create',  config: {} },
    { method: 'PUT',    path: '/sync-runs/:id', handler: 'sync-run.update',  config: {} },
    { method: 'DELETE', path: '/sync-runs/:id', handler: 'sync-run.delete',  config: {} },
  ],
};
