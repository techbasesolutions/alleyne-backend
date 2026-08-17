'use strict';

module.exports = {
  routes: [
    { method: 'GET',    path: '/source-listings',              handler: 'source-listing.find',    config: {} },
    { method: 'GET',    path: '/source-listings/:id',          handler: 'source-listing.findOne', config: {} },
    { method: 'POST',   path: '/source-listings',              handler: 'source-listing.create',  config: {} },
    { method: 'PUT',    path: '/source-listings/:id',          handler: 'source-listing.update',  config: {} },
    { method: 'DELETE', path: '/source-listings/:id',          handler: 'source-listing.delete',  config: {} },
    { method: 'POST',   path: '/source-listings/:id/publish',  handler: 'source-listing.publish', config: {} },
    { method: 'POST',   path: '/source-listings/:id/reject',   handler: 'source-listing.reject',  config: {} },
  ],
};
