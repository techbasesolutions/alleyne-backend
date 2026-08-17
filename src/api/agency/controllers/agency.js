'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::agency.agency', ({ strapi }) => ({
  /**
   * D5: Override create to auto-attach the creating user as agency owner.
   * When called with a user JWT: auto-creates AgencyMembership(owner).
   * When called with a master API token: skips auto-create (caller handles it).
   */
  async create(ctx) {
    const user = ctx.state.user;
    // Allow if authenticated via user JWT or full-access API token
    const isApiToken = !!(ctx.state.auth && ctx.state.auth.strategy && ctx.state.auth.strategy.name === 'api-token');
    if (!user && !isApiToken) {
      return ctx.unauthorized('You must be signed in to create an agency.');
    }

    const response = await super.create(ctx);

    // Auto-create AgencyMembership only when we have a real user context
    if (user) {
      const agencyId = response.data?.id;
      if (agencyId) {
        await strapi.entityService.create('api::agency-membership.agency-membership', {
          data: {
            agency: agencyId,
            user: user.id,
            role: 'owner',
            status: 'active',
          },
        });
      }
    }

    return response;
  },

  /**
   * E2: POST /agencies/:id/verify-domain
   * Generates a verification token and checks DNS TXT record.
   */
  async verifyDomain(ctx) {
    const { id } = ctx.params;
    const crypto = require('crypto');
    const dns = require('dns').promises;

    const agency = await strapi.entityService.findOne('api::agency.agency', id);
    if (!agency) return ctx.notFound();

    // Generate token if not present
    let token = agency.verificationToken;
    if (!token) {
      token = crypto.randomBytes(16).toString('hex');
      await strapi.entityService.update('api::agency.agency', id, {
        data: { verificationToken: token },
      });
    }

    const domain = agency.verificationDomain || agency.website;
    if (!domain) {
      return ctx.badRequest('No domain set on this agency. Add a website URL first.');
    }

    // Strip protocol
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const expectedRecord = `realtlist-verification=${token}`;
    let verified = false;

    try {
      const records = await dns.resolveTxt(`_realtlist-verification.${cleanDomain}`);
      verified = records.flat().some(r => r === expectedRecord);
    } catch {
      // DNS lookup failed — domain not found or no TXT record
    }

    if (verified) {
      await strapi.entityService.update('api::agency.agency', id, {
        data: { isVerified: true },
      });
      return { verified: true, token, message: 'Domain verified successfully.' };
    }

    return {
      verified: false,
      token,
      domain: cleanDomain,
      record: `_realtlist-verification.${cleanDomain}`,
      value: expectedRecord,
      message: 'TXT record not found yet.',
    };
  },
}));
