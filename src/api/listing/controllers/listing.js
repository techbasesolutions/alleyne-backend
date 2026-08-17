const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::listing.listing', ({ strapi }) => ({
    async create(ctx) {
        const user = ctx.state.user;
        if (!user) {
            return ctx.unauthorized("You must be logged in to create a listing.");
        }

        // Ensure state.user is linked as owner
        ctx.request.body.data.owner = user.id;

        const response = await super.create(ctx);
        return response;
    },

    async update(ctx) {
        const { id } = ctx.params;
        const user = ctx.state.user;

        // Check ownership
        const [listing] = await strapi.entityService.findMany('api::listing.listing', {
            filters: { id, owner: { id: user.id } },
        });

        if (!listing && user.role.name !== 'Admin') {
            return ctx.unauthorized("You can only update your own listings.");
        }

        const response = await super.update(ctx);
        return response;
    },

    async delete(ctx) {
        const { id } = ctx.params;
        const user = ctx.state.user;

        // Check ownership
        const [listing] = await strapi.entityService.findMany('api::listing.listing', {
            filters: { id, owner: { id: user.id } },
        });

        if (!listing && user.role.name !== 'Admin') {
            return ctx.unauthorized("You can only delete your own listings.");
        }

        const response = await super.delete(ctx);
        return response;
    }
}));
