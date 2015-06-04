
var gulp   = require('gulp'),
    config = {
        paths: {
            scripts: ['src/*.js'],
            assets: ['src/*.tpl'],
            tests: ['test/*.spec.js'],
            dest: 'dist'
        }
    };

gulp.task('assets:copy', function() {
    return gulp.src(config.paths.assets)
        .pipe(gulp.dest(config.paths.dest));
});

gulp.task('scripts:transpile', function() {
    var babel = require('gulp-babel');
    return gulp.src(config.paths.scripts)
        .pipe(babel())
        .pipe(gulp.dest(config.paths.dest));
});

gulp.task('tests:unit', ['scripts:transpile', 'assets:copy'], function() {
    var mocha = require('gulp-mocha');
    return gulp.src(config.paths.tests, {read: false})
        .pipe(mocha({
            ui: 'tdd',
            reporter: 'spec'
        }));
});

gulp.task('tests:unit:watch', function() {
    gulp.watch(config.paths.tests.concat(config.paths.scripts), ['tests:unit']);
});

gulp.task('watch', ['default'], function() {
    gulp.watch(config.paths.scripts, ['scripts:transpile']);
    gulp.watch(config.paths.assets, ['assets:copy']);
});

gulp.task('default', ['scripts:transpile', 'assets:copy']);
