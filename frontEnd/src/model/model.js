carProject.model = function(expiredSession) {
	
	this._url = window.location.href;
	this._sendRequests = function(data, callback, context) {
		$.ajax({
			url: this._url,
			type: "POST",
			contentType: 'application/json',
			dataType: "json",
			data: JSON.stringify(data)
		}).done(function(response){
			if (callback) {
				console.log(response);
				if (response.sessionExpired) {
					expiredSession(response);
				}
				else {
					//We must preserve the context on the callback
					callback.apply(context, arguments);
				}
			}
		});
	};
	
	
	//******************
	//This section contains the functions which formulate the message that will be 
	//sent to the server. It creates the data packet needed based on the event type.
	//******************
	
	//start a session for an existing user
	this.login = function(credentials, callback, context) {
		var request = {
			type: "login",
			email: credentials.email,
			password: credentials.password
		};
		this._sendRequests(request, callback, context);
	};
	
	//add a new user
	this.signUp = function(credentials, callback, context) {
		var request = {
			type: "signup",
			firstName: credentials.firstName,
			lastName: credentials.lastName,
			password: credentials.password,
			email: credentials.email
		};
		this._sendRequests(request, callback, context);
	};
	
	//end the current session
	this.logout = function(callback, context) {
		var request = {
			type: "logout",
			sessionId: localStorage.sessionId
		};
		this._sendRequests(request, callback, context);
	};
	
	//get the vehicles that the customer has registered
	this.getCustVehicles = function(callback, context) {
		var request = {
			type: "getCustVehicles",
			sessionId: localStorage.sessionId
		};
		this._sendRequests(request, callback, context);
	};
	
	//get the entire list of vehicles
	this.getVehicles = function(callback, context) {
		var request = {
			type: "getVehicles",
			sessionId: localStorage.sessionId
		};
		this._sendRequests(request, callback, context);
	};
	
	//register a new vehicle for the current user
	this.addVehicle = function(data, callback, context) {
		var request = {
			type: "addVehicle",
			sessionId: localStorage.sessionId,
			make: data.make,
			model: data.model
		};
		this._sendRequests(request, callback, context);
	};
	
	//get the service list for a vehicle
	this.getServices = function(data, callback, context) {
		var request = {
			type: "getServices",
			sessionId: localStorage.sessionId,
			make: data.make,
			model: data.model
		};
		this._sendRequests(request, callback, context);
	};
	//get the list of technicians
	this.getTechnicians = function(callback, context) {
		var request = {
			type: "getTechnicians",
			sessionId: localStorage.sessionId
		};
		this._sendRequests(request, callback, context);
	};
	
	this.addAppointment = function(data, callback, context) {
		var request = {
			type: "addAppointment",
			sessionId: localStorage.sessionId,
			technician: data.technician,
			date: data.date,
			time: data.time,
			vehicle: data.vehicle
		};
		this._sendRequests(request, callback, context);
	};
	
	this.getEmail = function(callback, context) {
		var request = {
			type: "getEmail",
			sessionId: localStorage.sessionId
		};
		this._sendRequests(request, callback, context);
	};
	
	this.getAppointments = function(callback, context) {
		var request = {
			type: "getAppointments",
			sessionId: localStorage.sessionId
		};
		this._sendRequests(request, callback, context);
	};
	
	this.removeAppointment = function(data, callback, context) {
		var request = {
			type: "removeAppointment",
			apptID: data.apptID,
			time: data.time,
			date: data.date,
			techID: data.techID,
			sessionId: localStorage.sessionId
		};
		this._sendRequests(request, callback, context);
	};
	
};