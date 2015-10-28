module.exports = function(grunt) {

	var
		path = require("path"),
		wwwFolder = path.join("app", "www"),

		libsFolder = path.join(wwwFolder, "libs"),
		jsFolder = path.join(wwwFolder, "js"),

		jsFiles = {},
		jsMinifyFiles = {},
		jsCompressFiles = {};

	jsFiles[path.join(jsFolder, "site.js")]	= [
			path.join(libsFolder, "jquery", "dist", "jquery.js"),
			path.join(libsFolder, "angular", "angular.js"),
			path.join(jsFolder, "app_init.js"),
			path.join(jsFolder, "controllers", "*.js"),
			path.join(jsFolder, "app.js")
	];

	jsMinifyFiles[path.join(jsFolder, "site.min.js")]	=
		path.join(jsFolder, "site.js");

	jsCompressFiles[path.join(jsFolder, "site.min.gz.js")]	=
		path.join(jsFolder, "site.min.js");


	grunt.initConfig({
		webServer: {
			port: 8080,
			rootFolder: "app/www"
		},
		uglify: {
			combine: {
        options: {
          compress: false,
          beautify: {
            beautify: true,
            indent_level: 2,
            comments: true
          },
          mangle: false,
        },
				files: jsFiles
			},
      minify: {
        options: {
          compress: {
            drop_debugger: true,
            unsafe: true,
            drop_console: false
          },
          beautify: false,
          mangle: {},
          screwIE8: true
        },
        files: jsMinifyFiles
      }
		},
    compress: {
      js: {
        options: {
          mode: 'gzip'
        },
        files: jsCompressFiles
      }
    },
		watch: {
			js: {
				files: [
					path.join(jsFolder, "**", "*.js"),
					"!" + path.join(jsFolder, "*.min.js")],
				tasks: ["uglify:combine","compress:js"]
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-compress");
	grunt.loadNpmTasks("grunt-contrib-watch");

	grunt.registerTask("web-server", "web server", function() {

		var
			http = require("http"),
			express = require("express"),
			bodyParser = require("body-parser"),
			app = express(),
			webServerConfig = grunt.config("webServer"),
			widgets = [
				{ id: 1, name: "Widget 1", qty: 10 },
				{ id: 2, name: "Widget 2", qty: 13 },
				{ id: 3, name: "Widget 3", qty: 12 },
				{ id: 4, name: "Widget 4", qty: 8 }
			];

		app.use("/api", bodyParser.json());

		app.get("/api/widgets", function(req, res) {

			res.json(widgets);

		});

		app.get("/api/widgets/:widgetId", function(req, res) {

			res.json(widgets.filter(function(widget) {
					return widget.id === req.params.widgetId;
			})[0]);

		});

		app.post("/api/widgets", function(req, res) {

			// res.json(widgets.filter(function(widget) {
			// 		return widget.id === req.params.widgetId;
			// })[0]);
			res.end();

		});

		app.use("/js", express.static(jsFolder, {
			setHeaders: function(res, filePath) {
				res.setHeader("Content-Type", "text/javascript");
				if (/.gz.js$/.test(filePath)) {
					res.setHeader("Content-Encoding", "gzip");
				}
			}
		}));

		app.use(express.static(webServerConfig.rootFolder));

		//this.async();

		http.createServer(app)
			.listen(webServerConfig.port, function() {

				console.log("web server started on port: " +
					webServerConfig.port);

			});

	});

	grunt.registerTask("default", "standard dev task",
		["uglify:combine", "uglify:minify", "compress:js", "web-server", "watch"])

};
