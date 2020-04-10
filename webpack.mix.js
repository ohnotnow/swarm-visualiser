let mix = require("laravel-mix");
require("laravel-mix-purgecss");
const glob = require("glob-all");

mix.js("src/app.js", "public/")
  .postCss("src/app.css", "public/", [require("tailwindcss")]).purgeCss({
  paths: () => glob.sync([path.join(__dirname, "public/*.html")]),
});
