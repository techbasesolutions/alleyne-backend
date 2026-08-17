'use strict';

/**
 * Policy: is-agency-owner
 * Allows access only if the authenticated user has the 'owner' role
 * in the target agency. Resolves agencyId from:
 *   - route param :agencyId
 *   - request body data.agency
 */
module.exports = async (policyContext, _config, { strapi }) => {
  const user = policyContext.state.user;
  if (!user) return false;

  // Admin bypass
  if (user.role?.type === 'super_admin' || user.role?.name === 'Admin') return true;

  const agencyId =
    policyContext.params.agencyId ||
    policyContext.request.body?.data?.agency;

  if (!agencyId) return false;

  const memberships = await strapi.entityService.findMany(
    'api::agency-membership.agency-membership',
    {
      filters: {
        agency: agencyId,
        user: user.id,
        role: 'owner',
        status: 'active',
      },
      limit: 1,
    }
  );

  return memberships.length > 0;
};
