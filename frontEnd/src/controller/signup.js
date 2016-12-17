carProject.controllers = carProject.controllers || {};
carProject.controllers.signup = function(parent, callBack, model) {
	this.parent = parent;
	this._model = model;
	this.template = undefined;
	this.container = undefined;
	
	//Will be called when response is given by the server
	this._callBack = function(message) {
		if (message.success === false) {
			alert(message.message);
		}
		else if (message.success === true) {
			alert("Welcome, please log in");
			callBack("login");
		}
	};
	
	this._didClickSignUp = function(e) {
		var fName = $("#signupFirstName").val();
		var lName = $("#signupLastName").val();
		var password1 = $("#signupPass1").val();
		var password2 = $("#signupPass2").val();
		var email1 = $("#signupEmail1").val();
		var email2 = $("#signupEmail2").val();
		
		//Ensure that no field is left empty. We may include more vigorous checks for each entry type, but this is fine for now.
		if ( (fName === "") || (lName === "") || (password1 === "") || (password2 === "")|| (email1 === "") || (email2 === "") ) {
			alert("Please Complete All Fields");
			return;
		}
		
		//check that two password fields match
		if (password1 !== password2) {
			alert("Passwords Do Not Match!");
			return;
		}
		//check that two email fields match
		if (email1 !== email2) {
			alert("Email Does Not Match!");
			return;
		}
		
		this._model.signUp({
			firstName: fName, 
			lastName: lName,
			password: password1,
			email: email1
		}, this._callBack, this);
		
	};
	
	
	this._create = function() {
		this.template = _.template($("#signupTemplate").html());
		
		var data = {};
		
		//Compile the partial using the data and append it to the parent
		this.parent.append(this.template(data));
		this.container = $("#signupTemplateContainer");
		
		$("#signupSubmit").on("click", $.proxy(this._didClickSignUp, this));
	};
	
	
	this.init = function() {
		this._create();
	}.call(this);
}; 
