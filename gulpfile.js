var gulp = require('gulp');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var riot = require('gulp-riot');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var base64 = require('gulp-base64');
var concat = require('gulp-concat');
var px2rem = require('gulp-px2rem');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

browserSync.init({
	open: false,
	notify: false,
	proxy: "http://localhost:8080/"
	// server: {
		// baseDir: "./"
	// }
});

gulp.task('css', function() {
	gulp.src('public/css/style.scss')
		.pipe(sass())
		.pipe(csso())
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))	
        .pipe(base64({
            baseDir: './public/images',
            extensions: ['svg', 'png', 'jpg'],
            maxImageSize: 16*1024, // bytes 
            debug: false
        }))
		//.pipe(px2rem())
		.pipe(rename("style.css"))
		.pipe(gulp.dest('./public/css'))
		.pipe(browserSync.stream());
});

gulp.task('js', function() {
	gulp.src(['public/js/modules/*.html',
		'public/js/modules/**/*.html'])
		.pipe(riot())
		.pipe(concat('modules.js'))
		.pipe(gulp.dest('./public/js'));
		//.pipe(browserSync.stream());
		
	gulp.src('public/js/components/*.js')
		.pipe(concat('components.js'))
		.pipe(gulp.dest('./public/js'));		
		
	setTimeout(function(){	
		gulp.src(['public/js/libs/zepto.min.js',
			'public/js/libs/vendors/riot/riot.update.js',
			'public/js/libs/vendors/tempusjs/min/tempusjs.min.js',
			'public/js/libs/vendors/circliful/js/circliful.js',
			'public/js/libs/vendors/peity/jquery.peity.js',
			'public/js/libs/vendors/skycons-html5/skycons.js',
			'public/js/libs/vendors/baobab/build/baobab.js',
			'public/js/libs/vendors/underscore/underscore-min.js',
			'public/js/libs/iscroll-lite.full.js',
			'public/js/libs/modernizr.custom.js',
			'public/js/components.js',
			'public/js/libs/http.js',
			'public/js/modules.js',			
			'public/js/init.js'])
			.pipe(concat('app.js'))
		    .pipe(uglify())
		    .pipe(gulp.dest('./public/js'));	
	}, 50);
});

gulp.task('watch', function() {	
	gulp.watch(['public/css/style.scss',
				'public/css/**/*.scss'], ['css']);		
				
    gulp.watch([
		"index.html",
		"public/js/init.js",
		"public/js/components/*.js",
		"public/js/stores/*.js",
		"public/js/modules/*.html",
		"public/js/modules/**/*.html"]).on("change", reload);				
});

gulp.task('default', ['css', 'js', 'watch']);