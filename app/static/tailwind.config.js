module.exports = {
  content: [
    "../templates/**/*.html",
    "../main/templates/**/*.html",
    "../users/templates/**/*.html",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: "Inter",
      },
    },
  },
  plugins: [
    require("flowbite/plugin")({
      charts: true,
    }),
  ],
};
