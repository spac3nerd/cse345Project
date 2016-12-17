carProject.controllers = carProject.controllers || {};
carProject.controllers.mainPage = function(parent, callBack, model) {
	this.parent = parent;
	this._model = model;
	this.template = undefined;
	this.container = undefined;
	
	//Welcome message based on login state
	this._getHeaderContent = function() {
		var s = localStorage;
		if (s.isLoggedIn) {
			return "Welcome " + s.firstName + " " + s.lastName + "!";
		}
		else {
			return "Sign up or log in to see all options";
		}
	};
	
	this._create = function() {
		this.template = _.template($("#homeTemplate").html());
		
		var data = {
			title: this._getHeaderContent(),
			imageSource: "dist/css/readable/images/car.jpg"
		};
		
		//Compile the partial using the data and append it to the parent
		this.parent.append(this.template(data));
		this.container = $("#homeTemplateContainer");
	};
	
	this.init = function() {
		this._create();
	}.call(this);
};
