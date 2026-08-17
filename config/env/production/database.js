/**
 * Production database config — Railway PostgreSQL.
 * Set DATABASE_HOST/PORT/NAME/USERNAME/PASSWORD from the Railway Postgres service vars.
 * Set DATABASE_SSL=true to enable SSL with self-signed cert support.
 */
module.exports = ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      host: env("DATABASE_HOST", "127.0.0.1"),
      port: env.int("DATABASE_PORT", 5432),
      database: env("DATABASE_NAME", "strapi"),
      user: env("DATABASE_USERNAME", "strapi"),
      password: env("DATABASE_PASSWORD", ""),
      schema: env("DATABASE_SCHEMA", "public"),
      ssl: env.bool("DATABASE_SSL", false)
        ? { rejectUnauthorized: false }
        : false,
    },
    debug: false,
  },
});
