var gulp         = require('gulp'),
    rigger       = require('gulp-rigger'),
    htmlmin      = require('gulp-htmlmin'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    mmq          = require('gulp-merge-media-queries'),
    cssnano      = require('gulp-cssnano'),
    rename       = require('gulp-rename'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    cache        = require('gulp-cache'),
    del          = require('del'),
    browserSync  = require('browser-sync').create(),
    flatten      = require('gulp-flatten'),
    babel        = require('gulp-babel'),
    uglify       = require('gulp-uglifyjs');

gulp.task('html', function() {
    return gulp.src('src/html/*.html')
        .pipe(rigger())
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({stream: true}))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('css', function() {
    return gulp.src('src/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 15 versions', '> 1%', 'ie 9', 'ie 8', 'ie 7'],
            cascade: true
        }))
        .pipe(mmq({
            log: false
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({stream: true}))
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('sass', function() {
    return gulp.src(['src/sass/*.scss', 'src/sass/bootstrap/*.scss'])
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 15 versions', '> 1%', 'ie 9', 'ie 8', 'ie 7'],
            cascade: true
        }))
        .pipe(mmq({
            log: false
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({stream: true}))
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(flatten())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function() {
    return gulp.src('src/js/*.js')
    .pipe(rigger())
    .pipe(
        babel({
            "presets": [
                ["env", {
                    "targets": {
                        "browsers": ["last 2 versions", "safari >= 7"]
                    }
                }]
            ]
})
    )
    .pipe(uglify('scripts.min.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('lib', function() {
    return gulp.src('src/lib/*.js')
    .pipe(rigger())
    .pipe(gulp.dest('dist/lib'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('img', function() {
    return gulp.src('src/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 5,
            svgoPlugins: [{removeViewBox: true}],
            use: [pngquant()]
        })))
        .pipe(flatten())
        .pipe(gulp.dest('dist/img'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('fonts', function() {
    return gulp.src('src/fonts/*')
        .pipe(gulp.dest('dist/fonts'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', function() {
    gulp.watch('src/html/**/*.html', ['html'], browserSync.reload);
    gulp.watch('src/css/**/*.css', ['css'], browserSync.reload);
    gulp.watch('src/sass/**/*.scss', ['sass'], browserSync.reload);
    gulp.watch('src/js/**/*.js', ['js'], browserSync.reload);
    gulp.watch('src/js/**/*.js', ['lib'], browserSync.reload);
    gulp.watch('src/img/**/*', ['img'], browserSync.reload);
    gulp.watch('src/fonts/**/*', ['fonts'], browserSync.reload);
});

gulp.task('del', function() {
	return del.sync('dist/*');
});

gulp.task('server', function () {
    browserSync.init({
        server: {
            baseDir: 'dist'
        },
        notify: false
    });
});

gulp.task('clear', function (callback) {
	return cache.clearAll();
})

gulp.task('build', ['html', 'css', 'sass', 'js', 'lib', 'img', 'fonts']);

gulp.task('start', [ 'del', 'build', 'server', 'watch']);
