"use strict";
const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::canonical-listing.canonical-listing", {
  config: {
    update: {
      policies: ["api::canonical-listing.is-listing-owner-or-member"],
    },
    delete: {
      policies: ["api::canonical-listing.is-listing-owner-or-member"],
    },
  },
});
