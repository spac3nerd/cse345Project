var carProjectServer = require("./server/server.js");
var sessionManager = require("./session/sessionManager.js");
var requestHandler = require("./requestHandler/requestHandler.js");
var sqlDriver = require("./dbDriver/sqlDriver.js");
var mailer = require("./mailer/mailer.js");
var server, session, handler, driver, mailer;

var serverOptions = {
	port: 8080,
	root: "../frontEnd"
};

//These should be the default settings, you may change these
var dbSettings = {
	address: "127.0.0.1",
	user: "root",
	password: "",
	database: "carProject",
	port: 3306
};


function init() {
	session = new sessionManager();
	driver = new sqlDriver(dbSettings, session);
	mailer = new mailer();
	handler = new requestHandler(driver, session, mailer);
	server = new carProjectServer(serverOptions, handler.newRequest);
};

init();