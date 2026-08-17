"use strict";

/**
 * get-full-home-page controller
 * Aggregates home-page single type with its related page-content.
 * hero-section and footer-section do not exist as content types —
 * those are managed as sections within page-content's dynamiczone.
 */

module.exports = {
  find: async (ctx) => {
    try {
      const homePageData = await strapi
        .service("api::home-page.home-page")
        .find({ populate: { homePageMain: { populate: { sections: true } } } });

      const fullPageData = {
        homePage: homePageData,
      };

      ctx.send(fullPageData);
    } catch (error) {
      ctx.send({ error: `An error occurred: ${error.message}` });
    }
  },
};
