const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('Browser-sync');

// *** Command to convert .scss to .css file *** //
// To add all .scss file: src/scss/*.scss
// .src(['node_modules/bootstrap/scss/bootstrap', 'src/scss/style.scss'])
gulp.task('sass', () => {
    return gulp 
            .src('src/scss/*.scss')
            .pipe(sass())
            .pipe(gulp.dest('src/css'))
            .pipe(browserSync.stream());
});

// *** Command to copy bootstrap, jquery, popper.js to "src/js" folder *** //
gulp.task('js', () => {
    return gulp
    .src(['node_modules/bootstrap/dist/js/bootstrap.js','node_modules/jquery/dist/jquery.js','node_modules/popper.js/dist/popper.js'])
    .pipe(gulp.dest('src/js/'))
    .pipe(browserSync.stream())
});

// *** Command to watch for any change happens in .scss or .html file ****//
gulp.task('serve', ['sass'], () => {
    browserSync.init
    ({
        server:'./src',
        port: 8080
    });
    gulp.watch(['src/scss/*.scss'], ['sass']);
    gulp.watch('src/*.html', 
    browserSync.reload()
    );
});

gulp.task('default', ['serve', 'js']);