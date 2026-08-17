const path = require("path");

/**
 * Local/dev database — SQLite (zero-setup). Production uses Postgres via
 * config/env/production/database.js (Render, injected from the managed DB).
 * Override locally with DATABASE_CLIENT=postgres + DATABASE_* if desired.
 */
module.exports = ({ env }) => {
  const client = env("DATABASE_CLIENT", "sqlite");

  if (client === "postgres") {
    return {
      connection: {
        client: "postgres",
        connection: {
          host: env("DATABASE_HOST", "127.0.0.1"),
          port: env.int("DATABASE_PORT", 5432),
          database: env("DATABASE_NAME", "alleyne"),
          user: env("DATABASE_USERNAME", "alleyne"),
          password: env("DATABASE_PASSWORD", ""),
          schema: env("DATABASE_SCHEMA", "public"),
          ssl: env.bool("DATABASE_SSL", false) ? { rejectUnauthorized: false } : false,
        },
        debug: false,
      },
    };
  }

  return {
    connection: {
      client: "sqlite",
      connection: {
        filename: path.join(__dirname, "..", env("DATABASE_FILENAME", ".tmp/data.db")),
      },
      useNullAsDefault: true,
      debug: false,
    },
  };
};
