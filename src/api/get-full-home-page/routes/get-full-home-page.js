module.exports = {
  routes: [
    {
      method: "GET",
      path: "/get-full-home-page",
      handler: "get-full-home-page.find",
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
