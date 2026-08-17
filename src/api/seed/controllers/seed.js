'use strict';

const bcrypt = require('bcryptjs');

/**
 * Seed controller — requires a full-access Strapi API token.
 * Bypasses the users-permissions auth routes (which return 500 in this env)
 * to create users directly via entity service.
 * Gate with NODE_ENV check or remove before go-live.
 */

function isFullAccessToken(ctx) {
  const auth = ctx.state?.auth;
  return (
    auth?.strategy?.name === 'api-token' &&
    auth?.credentials?.type === 'full-access'
  );
}

module.exports = {
  async createUser(ctx) {
    if (!isFullAccessToken(ctx)) {
      return ctx.unauthorized('Requires a full-access API token');
    }

    const { username, email, password, roleType = 'authenticated' } = ctx.request.body;
    if (!username || !email || !password) {
      return ctx.badRequest('username, email, and password are required');
    }

    const role = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: roleType } });

    if (!role) {
      return ctx.badRequest(`Role '${roleType}' not found`);
    }

    const existing = await strapi
      .query('plugin::users-permissions.user')
      .findOne({ where: { $or: [{ email }, { username }] } });

    if (existing) {
      return ctx.badRequest(`User '${email}' already exists (id: ${existing.id})`);
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (e) {
      return ctx.internalServerError(`hashPassword failed: ${e.message}`);
    }

    const knex = strapi.db.connection;
    const now = new Date();
    let user;
    try {
      [user] = await knex('up_users')
        .insert({
          username,
          email,
          password: hashedPassword,
          provider: 'local',
          confirmed: true,
          blocked: false,
          created_at: now,
          updated_at: now,
        })
        .returning(['id', 'username', 'email']);
    } catch (e) {
      return ctx.internalServerError(`knex insert failed: ${e.message}`);
    }

    try {
      await knex('up_users_role_links').insert({ user_id: user.id, role_id: role.id });
    } catch (e) {
      return ctx.internalServerError(`role link failed: ${e.message}`);
    }

    ctx.body = { data: { id: user.id, username: user.username, email: user.email } };
  },

  async listUsers(ctx) {
    if (!isFullAccessToken(ctx)) {
      return ctx.unauthorized('Requires a full-access API token');
    }

    const users = await strapi.query('plugin::users-permissions.user').findMany({
      select: ['id', 'username', 'email', 'confirmed'],
      limit: 50,
    });

    ctx.body = { data: users };
  },

  async clearUsers(ctx) {
    if (!isFullAccessToken(ctx)) {
      return ctx.unauthorized('Requires a full-access API token');
    }
    const knex = strapi.db.connection;
    await knex.raw('DELETE FROM up_users_role_links');
    await knex.raw('DELETE FROM up_users');
    ctx.body = { data: { message: 'All users cleared' } };
  },

  async dbCheck(ctx) {
    if (!isFullAccessToken(ctx)) {
      return ctx.unauthorized('Requires a full-access API token');
    }

    const knex = strapi.db.connection;

    // List all tables with 'up_' prefix
    const tables = await knex.raw(
      "SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename LIKE 'up\\_%' ORDER BY tablename"
    );

    // Check columns in up_users if it exists
    let upUsersColumns = [];
    const hasUpUsers = tables.rows.some(r => r.tablename === 'up_users');
    if (hasUpUsers) {
      const cols = await knex.raw(
        "SELECT column_name, data_type FROM information_schema.columns WHERE table_name='up_users' AND table_schema='public' ORDER BY ordinal_position"
      );
      upUsersColumns = cols.rows;
    }

    // Count rows in each up_ table
    const counts = {};
    for (const { tablename } of tables.rows) {
      const r = await knex.raw(`SELECT COUNT(*) FROM "${tablename}"`);
      counts[tablename] = parseInt(r.rows[0].count, 10);
    }

    // Raw user rows (limited for diagnostics)
    const rawUsers = await knex.raw('SELECT id, username, email, confirmed, blocked, provider, password IS NOT NULL as has_password FROM up_users LIMIT 5');

    ctx.body = {
      upTables: tables.rows.map(r => r.tablename),
      upUsersColumns,
      counts,
      rawUsers: rawUsers.rows,
    };
  },
};
