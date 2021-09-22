const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync= require('browser-sync').create();

function scssTask() {
    return src('src/styles/style.scss', { sourcemaps: true })
        .pipe(sass())
            .pipe(postcss([cssnano]))
                .pipe(dest('src/dist', { sourcemaps: '.' }));
}

function javascriptTask() {
    return src('src/js/main.js', { sourcemaps: true })
        .pipe(terser())
            .pipe(dest('src/dist', { sourcemaps: '.' }));
}

function browsersyncServer(cb) {
    browsersync.init({
        server: {
            baseDir: 'src/',
            index: 'index.html'            
        }
    });
    cb();
}

function browserReload(cb) {
    browsersync.reload();
    cb();
}

function watchTask(){
    watch('src/index.html', browserReload);
    watch(['src/styles/**/**.scss', 'src/js/**/**.js'], series(scssTask, javascriptTask, browserReload));
}

exports.default = series(
    scssTask,
    javascriptTask,
    browsersyncServer,
    browserReload,
    watchTask
);