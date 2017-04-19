/*
 此文件由@TG-CLI自动生成
 文档地址：https://github.com/allanguys/tg-cli
 */
var gulp = require('gulp');
var livereload = require('gulp-livereload');
var imagemin = require('gulp-imagemin');
var replace = require('gulp-replace');
var iconv = require('gulp-iconv');
var fs = require('fs');
var clean = require('gulp-clean');

var config = {};
var deps = [];
var deps_dev = [];
var sepPath = [];
var picPath = [];
var has = false;
//分离路径
	sepPath = [
		['**','css/**/*','js/**/*','inc/**/*', 'ossweb-img/**/*'],
		['','css/','js/','inc/','ossweb-img/']
	];
	picPath = ['ossweb-img/**/*'];
//初始化参数
try {
	config = fs.readFileSync('tg_config.json').toString();
	config = JSON.parse(config);
	dirName = config.appName;
	sepUrl = config.author == "cp" ? '//game.gtimg.cn/images/' + config.gameName + '/cp/' + dirName + '/' : '//game.gtimg.cn/images/' + config.gameName + '/' + dirName + '/';

} catch(err) {
	return console.log('读取config_tg.json出错,请检查或咨询allanglwang');
}

gulp.task('watch', function() {
	livereload.listen();
	gulp.watch('**/*.*', function(file) {
		livereload.changed(file.path);
	});
});

for(var i = 0; i < sepPath[0].length; i++) {

	(function(i) {
		deps.push('sep' + i);
		//分离
		gulp.task('sep' + i, function() {

			return gulp.src([sepPath[0][i] + '*.js','js/' + dirName + '*/', sepPath[0][i] + '*.css', sepPath[0][i] + '*.htm', sepPath[0][i] + '*.inc', sepPath[0][i] + '*.html', sepPath[0][i] + '*.shtml',sepPath[0][i] + '*.shtml','!gulpfile.js', '!package.json','!tg_config.json'])
				.pipe(iconv({
					decoding: 'gbk',
					encoding: 'utf-8'
				}))
				//路径分离
				.pipe(replace(/(ossweb-img\/)|(..\/ossweb-img\/)/g, sepUrl))
				//适配https协议
				.pipe(replace(/http:\/\//g, '\/\/'))
				.pipe(iconv({
					decoding: 'utf-8',
					encoding: 'gbk'
				}))
				.pipe(
					gulp.dest(dirName + '_分离/' + sepPath[1][i])
				);
		});
	})(i);
	(function(i) {
		deps_dev.push('sep' + i + '_dev')
		//分离DEV
		gulp.task('sep' + i + '_dev', function() {
			return gulp.src([sepPath[0][i] + '*.js', sepPath[0][i] + '*.json', sepPath[0][i] + '*.css', sepPath[0][i] + '*.htm', sepPath[0][i] + '*.inc', sepPath[0][i] + '*.html', sepPath[0][i] + '*.shtml',])
				.pipe(iconv({
					decoding: 'gbk',
					encoding: 'utf-8'
				}))
				//路径分离
				.pipe(replace(/(ossweb-img\/)|(..\/ossweb-img\/)/g, sepUrl))
				//适配https协议
				.pipe(replace(/http:\/\//g, '\/\/'))
				.pipe(iconv({
					decoding: 'utf-8',
					encoding: 'gbk'
				}))
				.pipe(
					gulp.dest(dirName + '_dev/' + sepPath[1][i])
				);
		});
	})(i);
};
//图片压缩
for(var i = 0; i < picPath.length; i++) {
	(function(i) {
		deps.push('imagemin');
		gulp.task('imagemin', function() {
			return gulp.src([picPath[i] + '*.jpg', picPath[i] + '*.gif', picPath[i] + '*.png', picPath[i] + '*.svg'])
				.pipe(imagemin({
					optimizationLevel: 5,
					progressive: true,
					interlaced: true,
					multipass: true
				}))
				.pipe(gulp.dest(dirName + '_分离/ossweb-img'));
		});
	})(i);;
	(function(i) {
		var m = 'imagemin_dev';
		deps_dev.push(m);
		gulp.task(m, function() {
			return gulp.src([picPath[i] + '*.jpg', picPath[i] + '*.gif', picPath[i] + '*.png', picPath[i] + '*.svg'])
				.pipe(imagemin({
					optimizationLevel: 5,
					progressive: true,
					interlaced: true,
					multipass: true
				}))
				.pipe(gulp.dest(dirName + '_开发版/ossweb-img'));
		});
	})(i);
};
gulp.task('default', deps_dev, function() {
    console.log('专题分离完成：）')
});
gulp.task('dev', deps, function() {
    console.log('专题分离完成：）')
});