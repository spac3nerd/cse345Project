
module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		
		jshint: {
			options:{
				laxcomma: true,
				smarttabs: true,
				debug: true,
				expr: true,
				loopfunc: true
			},
			all: [
				"src/**/*.js"
			]
		},
		//JSHint for minification
		minjshint: {
			options:{
				laxcomma: true,
				smarttabs: true
			},
			all: [
				"src/*.js"
			]
		},
		//minification
		uglify: {
			compress: {
				hoist_funs: false,
				join_vars: false,
				loops: false,
				unused: false
			},
			beautify: {
				ascii_only: true
			},
			min: {
				files: {
					"dist/js/min/carProject.min.js": ["dist/js/readable/carProject.js"]
				}
			}
		},
		//Default concat job
		concat: {
			options: {
				separator: "\n;"
			},
			dist: {
				src: [
					"lib/jquery.js",
					"lib/jquery-ui.js",
					"lib/jquery.dataTables.js",
					"lib/dataTables.jqueryui.js",
					"lib/underscore.js",
					"lib/jquery.timepicker.js",
					"src/carProject.js",
					"src/controller/header.js",
					"src/controller/login.js",
					"src/controller/signup.js",
					"src/controller/mainPage.js",
					"src/controller/vehicles.js",
					"src/controller/services.js",
					"src/controller/appointment.js",
					"src/controller/account.js",
					"src/controller/animation/animation.js",
					"src/model/model.js"
				],
				dest: "dist/js/readable/carProject.js"
			}
		},
		concatcss: {
			options: {
				separator: "\n;"
			},
			dist: {
				src: [
					"css/*.css"
				],
				dest: "dist/css/readable/style.css"
			}
		},
		/* This task has two purposes. The first being that it replaces the "@CP_templateName" string in index.html with the content of the file that contains the partial.
		 * Next, it will move the resulting index.html into /dist/html, which is the version the server will serve
		 */
		replace: {
			dist: {
				options: {
					patterns: [
						{
							match: "CP_homeTemplate",
							replacement: "<%= grunt.file.read('src/templates/homeTemplate.html') %>"
						},
						{
							match: "CP_loginTemplate",
							replacement: "<%= grunt.file.read('src/templates/loginTemplate.html') %>"
						},
						{
							match: "CP_signupTemplate",
							replacement: "<%= grunt.file.read('src/templates/signupTemplate.html') %>"
						},
						{
							match: "CP_vehiclesTemplate",
							replacement: "<%= grunt.file.read('src/templates/vehiclesTemplate.html') %>"
						},
						{
							match: "CP_servicesTemplate",
							replacement: "<%= grunt.file.read('src/templates/servicesTemplate.html') %>"
						},
						{
							match: "CP_appointmentTemplate",
							replacement: "<%= grunt.file.read('src/templates/appointmentTemplate.html') %>"
						},
						{
							match: "CP_accountTemplate",
							replacement: "<%= grunt.file.read('src/templates/accountTemplate.html') %>"
						}
					]
				},
				files: [
					{
						expand: true,
						flatten: true,
						src: ["html/index.html"],
						dest: "dist/html"
					}
				]
			}
		},
		//copy images from css to dist
		copy: {
			main: {
				files: [
					{
						expand: true,
						flatten: true,
						src: ["css/images/**.*"],
						dest: "dist/css/readable/images"
					}
				]
			}
		}
		
		
	});
	
	//Load taks from plugins
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-replace");
	
	//Load the default task
	grunt.registerTask("default", ["debug"]);
	grunt.registerTask("build", ["concat", "concatcss", "copy", "minjshint", "uglify"]); //"debugger" statements are not allowed
	grunt.registerTask("debug", ["concat", "concatcss", "replace", "copy", "jshint"]); //"debugger" statements are allowed in the development build
	
	
	//This task just changes the arguments for the concat task and then runs it.
	grunt.registerTask("concatcss", function() {
		var task = grunt.config("concatcss");
		var src = task.dist.src;
		var dist = task.dist;
		var options = task.options;
		grunt.config.set("concat", {
			options: options,
			dist: dist
		})
		grunt.task.run("concat");
	});
	
	//JSHint needs different options for the minified build
	grunt.registerTask("minjshint", function() {
		var task = grunt.config("minjshint");
		var all = task.all;
		var options = task.options;
		grunt.config.set("jshint", {
			options: options,
			all: all
		})
		grunt.task.run("jshint");
	});
	
};