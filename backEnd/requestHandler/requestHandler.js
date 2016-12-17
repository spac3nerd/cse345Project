requestHandler = function(dbDriver, sessionMgr, mailer) {
	
	//this needs to be cleaned up
	function processRequest(request, callback) {
		
		request = JSON.parse(request); //parse the JSON to make the object usable
		var response = {};
		
		//This can all be moved to a lookup table
		if (request.type === "login") {
			console.log("login");
			console.log(request);
			dbDriver.loginCustomer(request.email, request.password, callback);
		}
		if (request.type === "loginNP") {
			
		}
		if (request.type === "signup") {
			console.log("signup");
			console.log(request);
			dbDriver.insertCustomer(request.firstName, request.lastName, request.password, request.email, callback);
		}
		if (request.type === "logout") {
			if (sessionMgr.verifyId(request.sessionId)) {
				sessionMgr.endSession(request.sessionId);
				callback({
					success: true
				});
			}
			else {
				callback({
					success: false,
					sessionExpired: true
				});
			}
		}
		if (request.type === "getEmail") {
			console.log("getEmail");
			//check if session is valid
			if (sessionMgr.verifyId(request.sessionId)) {
				var email = sessionMgr.getUser(request.sessionId);
				//we can just send a response back immediately
				callback({
					success: true,
					email: email
				});
			}
			else {
				callback({
					success: false,
					sessionExpired: true
				});
			}
		}
		if (request.type === "getCustVehicles") {
			//check if session is valid
			if (sessionMgr.verifyId(request.sessionId)) {
				//get the email that corresponds to the sessionID
				var email = sessionMgr.getUser(request.sessionId);
				
				//get the data set
				dbDriver.getCustVehicles(email, callback);
			}
			else {
				callback({
					success: false,
					sessionExpired: true
				});
			}
		}
		if (request.type === "getVehicles") {
			//check if session is valid
			if (sessionMgr.verifyId(request.sessionId)) {
				//get the data set
				dbDriver.getVehicleList(callback);
			}
			else {
				callback({
					success: false,
					sessionExpired: true
				});
			}
		}
		if (request.type === "addVehicle") {
			console.log("addvehicle");
			//check if session is valid
			if (sessionMgr.verifyId(request.sessionId)) {
				//get the email that corresponds to the sessionID
				var email = sessionMgr.getUser(request.sessionId);
				
				dbDriver.addCustVehicle(email, request.make, request.model, callback);
			}
			else {
				callback({
					success: false,
					sessionExpired: true
				});
			}
		}
		if (request.type === "getServices") {
			console.log("getServices");
			//check if session is valid
			if (sessionMgr.verifyId(request.sessionId)) {
				dbDriver.getServices(request.make, request.model, callback);
			}
			else {
				callback({
					success: false,
					sessionExpired: true
				});
			}
		}
		if (request.type === "getTechnicians") {
			console.log("getTechnicians");
			//check if session is valid
			if (sessionMgr.verifyId(request.sessionId)) {
				dbDriver.getTechnicians(callback);
			}
			else {
				callback({
					success: false,
					sessionExpired: true
				});
			}
		}
		if (request.type === "addAppointment") {
			console.log("addAppointment");
			//check if session is valid
			if (sessionMgr.verifyId(request.sessionId)) {
				var email = sessionMgr.getUser(request.sessionId);
				
				var confirmationCallback = function(data) {
					if (data.success === true) {
						var t = new Date();
						t.setHours(0, 0, 0, 0);
						t.setHours(9 + data.time);
						t = t.toLocaleTimeString().replace(/:\d+ /, ' ');
						mailer.sendConfirmationEmail(data.date, email, t, data.vehicle);
					}
					callback(data);
				};
				
				dbDriver.addAppointment(email, request.technician, request.date, request.time, request.vehicle,  confirmationCallback);
			}
			else {
				callback({
					success: false,
					sessionExpired: true
				});
			}
		}
		if (request.type === "getAppointments") {
			console.log("getAppointments");
			//check if session is valid
			if (sessionMgr.verifyId(request.sessionId)) {
				var email = sessionMgr.getUser(request.sessionId);
				
				dbDriver.getAppointments(email, callback);
			}
			else {
				callback({
					success: false,
					sessionExpired: true
				});
			}
		}
		if (request.type === "removeAppointment") {
			console.log("removeAppointment");
			//check if session is valid
			if (sessionMgr.verifyId(request.sessionId)) {
				dbDriver.removeAppointment(request.apptID, request.time, request.date, request.techID, callback);
			}
			else {
				callback({
					success: false,
					sessionExpired: true
				});
			}
		}
	
	};
	
	return {
		newRequest: function(request, callback) {
			var response = processRequest(request, callback);
			return response;
		}
	};
};

module.exports = requestHandler;