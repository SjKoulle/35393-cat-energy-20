const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const csso  = require ("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify');
const pipeline = require('readable-stream').pipeline;

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// Styles Opt

const stylesOpt = () => {
  return pipeline(
    gulp.src('build/css/style.css'),
    csso(),
    rename({
      suffix: ".min",
      extname: ".css"
    }),
    gulp.dest('build/css')
  );
}

exports.stylesOpt = stylesOpt;

// Optimise Images

const images = () => {
  return gulp.src("build/img/**/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img/"))
}

exports.images = images;

// webP images

const createWebp = () => {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("source/img"))
}

exports.createWebp = createWebp;

// Svg-sprite

const sprite = () => {
  return gulp.src("source/img/**/icon-*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"))
}

exports.sprite = sprite;

// Html min

const htmlOpt  = () => {
    return gulp.src("source/*.html")
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest("build"));
  }


exports.htmlOpt = htmlOpt;

//Js min

const jsOpt = () => {
  return pipeline(
    gulp.src('source/js/*.js'),
    uglify(),
    rename({
      suffix: ".min",
      extname: ".js"
    }),
    gulp.dest('build/js')
  );
}

exports.jsOpt = jsOpt;

// Build

const copy = () => {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/js/**",
    "source/*.ico"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
}

exports.copy = copy;

const html = () => {
  return gulp.src([
    "source/*.html"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
}

exports.html = html;

const clean = () => {
  return del("build");
}

exports.clean = clean;

const build = () => gulp.series(
  clean,
  copy,
  images,
  styles,
  stylesOpt,
  sprite,
  htmlOpt,
  jsOpt
);

exports.build = build();

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles", "stylesOpt"));
  gulp.watch("source/*.html", gulp.series("htmlOpt"));
  gulp.watch("source/*.html").on("change", sync.reload);
}

exports.default = gulp.series(
  build(), server, watcher
);
