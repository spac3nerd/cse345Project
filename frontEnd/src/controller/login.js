carProject.controllers = carProject.controllers || {};
carProject.controllers.login = function(parent, callBack, model) {
	this.parent = parent;
	this._model = model;
	this.container = undefined;
	
	//called once a response from the server is received
	this._callBack = function(message) {
		//if login was successful
		if (message.success) {
			localStorage.sessionId = message.sessionId;
			localStorage.firstName = message.firstName;
			localStorage.lastName = message.lastName;
			localStorage.isLoggedIn = true;
			callBack("loginSuccessful");
		}
		//if login was not successful
		else {
			alert(message.message);
		}
	};
	
	this._didClickLogIn = function(e) {
		//Get the values from the text areas
		var email = $("#loginEmail").val();
		var password = $("#loginPass").val();
		
		//check to see if the user actually wrote something
		if ( (email === "") || (password === "") ) {
			return;
		}
		//Prepare data packet to be sent to the server
		this._model.login({
			email: email, 
			password: password
		}, this._callBack, this);
	};
	
	
	this._create = function() {
		this.template = _.template($("#loginTemplate").html());
		
		var data = {};
		
		//Compile the partial using the data and append it to the parent
		this.parent.append(this.template(data));
		this.container = $("#loginTemplateContainer");
		
		$("#loginSubmit").on("click", $.proxy(this._didClickLogIn, this));
	};
	
	
	this.init = function() {
		this._create();
	}.call(this);
};