module.exports = function(grunt) {
	
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		concat: {
			dist: {
				src: ['jquery.browser.js',
				      'jquery.alba.move.js',
				      'jquery.alba.eclipse.js',
				      'jquery.alba.placeholder.js'
					],
				dest: 'dist/jquery.alba.js'
			}
		},
		
		min: {
			dist: {
				src: 'dist/jquery.alba.js',
				dest: 'dist/jquery.alba.min.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-yui-compressor');

	grunt.registerTask("default",['concat','min']);

};
