'use strict';

/**
 * Policy: is-listing-owner-or-member
 * Allows access if the authenticated user is:
 *   - the direct owner_user of the listing, OR
 *   - an active member of the listing's owner_agency
 *   - an Admin role (bypass)
 */
module.exports = async (policyContext, _config, { strapi }) => {
  const user = policyContext.state.user;
  // Full-access API token requests have no user context — allow through
  if (!user) return policyContext.state.auth?.strategy?.name === 'api-token';

  // Admin bypass
  if (user.role?.type === 'super_admin' || user.role?.name === 'Admin') return true;

  const id = policyContext.params.id;
  if (!id) return false;

  const listing = await strapi.entityService.findOne(
    'api::canonical-listing.canonical-listing',
    id,
    { populate: ['ownerUser', 'ownerAgency'] }
  );
  if (!listing) return false;

  // Direct owner
  if (listing.ownerUser?.id === user.id) return true;

  // Agency member
  const agencyId = listing.ownerAgency?.id;
  if (agencyId) {
    const memberships = await strapi.entityService.findMany(
      'api::agency-membership.agency-membership',
      {
        filters: { agency: agencyId, user: user.id, status: 'active' },
        limit: 1,
      }
    );
    if (memberships.length > 0) return true;
  }

  return false;
};
