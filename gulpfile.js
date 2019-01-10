'use strict';

const gulp        = require('gulp');
const del         = require('del');
const util        = require('gulp-util');
const sass        = require('gulp-sass');
const prefixer    = require('gulp-autoprefixer');
const uglify      = require('gulp-uglify');
const concat      = require('gulp-concat');
const rename      = require('gulp-rename');
const handlebars  = require('gulp-compile-handlebars');
const browserSync = require('browser-sync');
const ghPages     = require('gulp-gh-pages');
const sassGlob    = require('gulp-sass-bulk-import');
const watch       = require('gulp-watch');
const babel       = require('gulp-babel');
const uncss       = require('gulp-uncss');


var paths = {
  src: { root: 'src' },
  dist: { root: 'dist' },
  init: function() {
    this.src.sass        = this.src.root + '/scss/main.scss';
    this.src.templates   = this.src.root + '/**/*.hbs';
    this.src.javascript  = [this.src.root + '/js/**/*.js', '!' + this.src.root + '/js/libs/*.js'];
    this.src.libs        = this.src.root + '/js/libs/*.js';
    this.src.images      = this.src.root + '/images/**/*.{jpg,jpeg,svg,png,gif}';
    this.src.files       = this.src.root + '/*.{html,txt}';
    this.src.fonts       = this.src.root + '/scss/fonts/*';


    this.dist.css        = this.dist.root + '/css';
    this.dist.images     = this.dist.root + '/images';
    this.dist.javascript = this.dist.root + '/js';
    this.dist.libs       = this.dist.root + '/js/libs';
    this.dist.fonts      = this.dist.root + '/css/fonts';


    return this;
  },
}.init();

gulp.task('serve', () => {
  browserSync.init({
    server: paths.dist.root,
    open: true,
    notify: false,

    // Whether to listen on external
    online: true,
  });
});

gulp.task('uncss', function() {
  console.log('--- RUNNING UNCSS ---');
  return gulp.src([
      paths.dist.css + '/main.css',
      'css/style.css'
    ])
    .pipe(uncss({
      html: [
        paths.dist.root + '/index.html',
      ]
    }))
    .pipe(gulp.dest(paths.dist.css));
});

gulp.task('styles', () => {
  gulp.src([paths.src.sass])
    .pipe(sassGlob())
    .on('error', util.log)
    .pipe(sass({
      includePaths: ['src/scss'],
      outputStyle: 'compressed'
    }))
    .on('error', util.log)
    .pipe(prefixer('last 2 versions'))
    .on('error', util.log)
    // .pipe(concat('main.css'))
    // .pipe(uncss({
    //   html: [
    //     paths.dist.root + '/index.html',
    //   ]
    // }))
    .pipe(gulp.dest(paths.dist.css))
    .pipe(browserSync.reload({stream: true}));
});

/*
* Compile handlebars/partials into html
*/
gulp.task('templates', () => {
  var opts = {
    ignorePartials: true,
    batch: ['src/partials'],
    helpers : {
        times : function(n, block){
          var accum = '';
          for(var i = 0; i < n; ++i)
              accum += block.fn(i);
          return accum;
        },
        ifCond : function (conditional, options){
          if (options.hash.value === conditional)
            return options.fn(this)
          else
            return options.inverse(this);

        }
    }
  };
  gulp.src([paths.src.root + '/*.hbs'])
    .pipe(handlebars(null, opts))
    .on('error', util.log)
    .pipe(rename({
      extname: '.html',
    }))
    .on('error', util.log)
    .pipe(gulp.dest(paths.dist.root))
    .pipe(browserSync.reload({stream: true}));
});

/*
* Bundle all javascript files
*/
gulp.task('scripts', () => {
  gulp.src(paths.src.javascript)
    .pipe(babel({
      presets: ['es2015'],
    }))
    .pipe(concat('bundle.js'))
    .on('error', util.log)
    .pipe(uglify())
    .on('error', util.log)
    .pipe(gulp.dest(paths.dist.javascript))
    .pipe(browserSync.reload({stream: true}));

  /*
  * Uglify JS libs and move to dist folder
  */
  gulp.src([paths.src.libs])
    .pipe(uglify())
    .on('error', util.log)
    .pipe(gulp.dest(paths.dist.libs))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('images', () => {
  gulp.src([paths.src.images])
    .pipe(gulp.dest(paths.dist.images));
});

gulp.task('fonts', () => {
  gulp.src([paths.src.fonts])
    .pipe(gulp.dest(paths.dist.fonts));
});

gulp.task('files', () => {
  gulp.src([paths.src.files])
    .pipe(gulp.dest(paths.dist.root));
});

watch(paths.src.images, () => {
  gulp.start('images');
});

watch(paths.src.fonts, () => {
  gulp.start('fonts');
});

watch(paths.src.files, () => {
  gulp.start('files');
});

gulp.task('watch', () => {
  gulp.watch('src/scss/**/*.scss', ['styles']);
  gulp.watch(paths.src.javascript, ['scripts']);
  gulp.watch(paths.src.templates, ['templates']);
});

gulp.task('deploy', () => {
  return gulp.src([paths.dist.root + '/**/*'])
    .pipe(ghPages());
});

gulp.task('default', ['watch', 'serve', 'images', 'fonts', 'files', 'styles', 'scripts', 'templates']);
