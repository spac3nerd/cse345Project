function carProjectServer(settings, appHandler) {

	var http = require("http");
	var dispatcher = require("httpdispatcher");
	dispatcher.setStatic("../../frontEnd");
	var htmlRoot = settings.root;

	var fs = require("fs");
	var url = require("url");


	var port = settings.port;
	var server = undefined;

	function requestHandler(request, response) {
		dispatcher.dispatch(request, response);
	};
	
	//TODO: Clean this mess up a bit
	
	//On the GET request for the first(and only) page
	dispatcher.onGet("/", function(request, response) {
		var path = url.parse(request.url).path;
		
		fs.readFile(htmlRoot + "/dist/html/index.html", function(error, content) {
			response.writeHead(200, {"Content-Type": "text/html"});
			response.end(content, "utf-8"); 
		});
	})

	//On any GET request
	dispatcher.onGet(/\//, function(request, response) {
		var path = url.parse(request.url).path;
		//The type of file being requested
		var token = path.split(".")[path.split(".").length - 1];
		var contentType;
		//console.log(token);
		fs.readFile(htmlRoot + path, function(error, content) {
			
			if (error) {
				
			} 
			else {
				switch (token) {
					case "js":
						contentType = "text/js";
						break;
					case "css":
						contentType = "text/css";
						break;
					case "html":
						contentType = "text/html";
						break;
				}
				response.writeHead(200, {"Content-Type": contentType});
				response.end(content, "utf-8"); 
			}
		});
	});
	
	//On any POST request
	dispatcher.onPost(/\//, function(request, response) {
		var callback = function(appResponse) {
			console.log("App Response:");
			console.log(appResponse);
			response.writeHead(200, {"Content-Type": "text/plain"});
			response.end(JSON.stringify(appResponse), "utf-8"); 
		}
		appHandler(request.body, callback); //give the request to our application's handler
	});

	function startServer() {
		//console.log("starting server...");
		server = http.createServer(requestHandler);
		server.listen(port, function() {
			console.log("Server is listening on port: " + port + "\n");
		});
	};

	startServer();
}

module.exports = carProjectServer;