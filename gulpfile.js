var gulp    = require('gulp'),
    //scss    = require('gulp-scss'),
    sass    = require('gulp-sass'),
    connect = require('gulp-connect'),
    pug     = require('gulp-pug'),
    plumber = require('gulp-plumber'),
    rename  = require('gulp-rename'),
    uglify  = require('gulp-uglify'),
    // uglify 將 css 醜化，讓人無法讀；將 classname 改為亂數，如：fb, ig
    autoprefixer = require('gulp-autoprefixer');

function reload(done) {
  connect.server({
    livereload: true,
    port: 8080
  });
  done();
}

// function styles() {
//   return (
//     gulp.src('src/scss/styles.scss')
//     .pipe(plumber())
//     .pipe(scss())
//     .pipe(autoprefixer({
//       overrideBrowserslist: ['last 3 versions'],
//       cascade: false
//     }))
//     .pipe(scss({outputStyle: 'expanded'}))
//     .pipe(gulp.dest('assets/css'))
//     .pipe(scss({outputStyle: 'compressed'}))
//     .pipe(rename('styles.min.css'))
//     .pipe(gulp.dest('assets/css'))
//     .pipe(connect.reload())
//   );
// }

function styles() {
  return (
    gulp.src('src/sass/styles.sass')
    .pipe(plumber()) // restart
    .pipe(sass())
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 3 versions'], // 支援兼容瀏覽器版本，ex: IE 11, IE 10, IE 9
      cascade: false //階層
    }))
    .pipe(sass({outputStyle: 'expanded'})) //導出沒有壓縮的 css
    .pipe(gulp.dest('assets/css'))
    .pipe(sass({outputStyle: 'compressed'})) //導出有壓縮的 css
    .pipe(rename('styles.min.css'))
    .pipe(gulp.dest('assets/css'))
    .pipe(connect.reload()) //做完一個元件，再重新跑一次
  );
}


function myStyle() {
  return(
    gulp.src('src/sass/*.sass')
    .pipe(plumber())
    .pipe(sass())
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(gulp.dest('assets/css'))
    .pipe(sass({outputStyle: 'compressed'})) //導出有壓縮的 css
    .pipe(rename(function(path) {
      path.basename += ".min";
    }))
    .pipe(gulp.dest('assets/css'))
    .pipe(connect.reload())
  )
}

function scripts() {
  return (
    gulp.src('src/js/scripts.js')
    .pipe(plumber())
    .pipe(gulp.dest('assets/js'))
    .pipe(uglify())
    .pipe(rename('scripts.min.js'))
    .pipe(gulp.dest('assets/js'))
    .pipe(connect.reload())
  );
}

function html() {
  return (
    //gulp.src('./assets/*.html')
    gulp.src('*.html')
    .pipe(plumber())
    .pipe(connect.reload())
  );
}

function views() {
  return (
    gulp.src('src/pug/pages/*.pug')
    .pipe(plumber())
    .pipe(pug({
        pretty: true
    }))
    //.pipe(gulp.dest('./assets/'))
    .pipe(gulp.dest('./'))
    .pipe(connect.reload())
  )
}

// 即時監聽
function watchTask(done) {
  gulp.watch('*.html', html);
  gulp.watch('src/sass/*.sass', myStyle);
  // gulp.watch('src/scss/**/*.scss', styles);
  gulp.watch('src/sass/**/*.sass', styles);
  gulp.watch('src/js/scripts.js', scripts);
  gulp.watch('src/pug/**/*.pug', views);
  done();
}

const watch = gulp.parallel(watchTask, reload);
const build = gulp.series(gulp.parallel(myStyle, styles, scripts, html, views));

// 元件化的模組，可在其他檔案引入
exports.myStyle = myStyle;
exports.reload = reload;
exports.styles = styles;
exports.scripts = scripts;
exports.html = html;
exports.views = views;
exports.watch = watch;
exports.build = build;
exports.default = watch;