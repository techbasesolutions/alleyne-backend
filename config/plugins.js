module.exports = ({ env }) => ({
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        // jsonTransport: no network calls, no SMTP server required.
        // Emails are silently swallowed (logged as JSON internally).
        // Replace with a real SMTP/Resend config when the domain is live.
        jsonTransport: true,
      },
      settings: {
        defaultFrom: "noreply@realtlist.com",
        defaultReplyTo: "noreply@realtlist.com",
      },
    },
  },
  "strapi-plugin-populate-deep": {
    config: {
      defaultDepth: 5,
    },
  },
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
  graphql: {
    config: {
      endpoint: "/graphql",
      shadowCRUD: true,
      playgroundAlways: false,
      depthLimit: 15,
      amountLimit: 100,
      apolloServer: {
        tracing: false,
      },
    },
  },
});
