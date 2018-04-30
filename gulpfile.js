let gulp = require("gulp");
let sass = require("gulp-sass");
let browserSync = require("browser-sync").create();
let webpack = require("webpack");
let autoPrefixer = require("gulp-autoprefixer");
let sourceMaps = require('gulp-sourcemaps');
let proxyUrl = "http://localhost:8888/testing/";
let plumber = require("gulp-plumber")



let PATHS = {
  inject: "./dist/css/",
  scss: "src/_scss/**/*.scss",
  sitefiles: "**/*.php"
}
gulp.task('server', () => {
  const opts = { files: PATHS.inject, notify: false, proxy: proxyUrl };
  browserSync.init(opts);
});


gulp.task("scss", () => {
  gulp.src(PATHS.scss)
  .pipe(sourceMaps.init())
  .pipe(plumber())
  .pipe(sass())
  .pipe(autoPrefixer({
    browsers: ["last 2 versions"],
    cascade: false
  }))
  .pipe(sourceMaps.write())
  .pipe(gulp.dest(PATHS.inject))
  .pipe(browserSync.stream())
})

gulp.task('webpack', () => {
  const webpackCompiler = webpack(require('./webpack.config.js'));
  webpackCompiler.watch({}, (err, stats) => {
    browserSync.reload();
  });
});

gulp.task("default", ["webpack", "server"], () => {
  gulp.watch(PATHS.scss, ['scss']);
  gulp.watch(PATHS.sitefiles).on('change', browserSync.reload);
});