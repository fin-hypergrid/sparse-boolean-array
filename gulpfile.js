'use strict';

var gulp = require('gulp'),
    $$   = require('gulp-load-plugins')();

var runSequence = require('run-sequence'),
    exec        = require('child_process').exec,
    path        = require('path');

var srcDir  = './src/',
    testDir = './test/',
    jsDir   = srcDir + 'js/',
    jsFiles = '**/*.js',
    destDir = './';

var js = {
    dir   : jsDir,
    files : jsDir + jsFiles
};

//  //  //  //  //  //  //  //  //  //  //  //

gulp.task('lint', lint);
gulp.task('test', test);
gulp.task('doc', doc);

gulp.task('rootify', function () {
    gulp.src(js.dir + 'RangeSelectionModel.js')
        .pipe($$.rename('index.js'))
        .pipe(gulp.dest(destDir));
});

gulp.task('build', function(callback) {
    clearBashScreen();
    runSequence('lint', 'test', 'doc', 'rootify',
        callback);
});

gulp.task('watch', function () {
    gulp.watch([srcDir + '**', testDir + '**'], ['build']);
});

gulp.task('default', ['watch', 'build']);

//  //  //  //  //  //  //  //  //  //  //  //

function lint() {
    return gulp.src(js.files)
        .pipe($$.excludeGitignore())
        .pipe($$.eslint())
        .pipe($$.eslint.format())
        .pipe($$.eslint.failAfterError());
}

function test(cb) {
    return gulp.src(testDir + 'index.js')
        .pipe($$.mocha({reporter: 'spec'}));
}

function doc(cb) {
    exec(path.resolve('jsdoc.sh'), function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
}

function clearBashScreen() {
    var ESC = '\x1B';
    console.log(ESC + 'c'); // (VT-100 escape sequence)
}

