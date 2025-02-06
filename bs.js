const browserSync = require("browser-sync").create();
const historyApiFallback = require('connect-history-api-fallback');

browserSync.init({
  files: ["public/css/**/*.css", "public/js/**/*.js"],
  port: 4000,
  server: {
    baseDir: "public",
    port: 4000,
    middleware: [ historyApiFallback({
      index: '/index.html',
      rewrites: [
        { from: '/platform', to: '/platform.html'},
      ]
    }) ],

  }
});
