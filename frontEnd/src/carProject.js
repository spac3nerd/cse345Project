carProject = function(header, content) {
	this.header = $(header);
	this.content = $(content);
	this.model = undefined;
	this.currentActiveController = undefined; //TODO: this doesn't have a purpose anymore
	this.currentPage = "";
	//hold a reference to all of the controllers
	this.controllers = {
		headerController: undefined,
		mainPageController: undefined,
		loginController: undefined,
		signupController: undefined,
		vehiclesController: undefined,
		servicesController: undefined,
		accountController: undefined
	};
	this.animation = undefined;
	var that = this;
	
	//detach only the exiting page
	this._clearContainer = function() {
		delete this.controllers[this.currentActiveController];
	};
	
	//Called when the server says that the session is expired
	this._expiredSession = function(message) {
		alert("Your session has expired, please log in again!");
		localStorage.clear(); //Purge the saved user data to prevent further requests to the server using the expired session id
		that.controllers.headerController.update();
		that.setContentType("home");
	};
	
	//TODO: We can add some pretty cool animated transitions from page to page!!!
	//callback function
	this.setContentType = function(type) {
		
		if ( (type == that.currentPage) || (that.animation.animationInProgress)) {
			return;
		}
		
		//called once an animation has been completed
		var clearContainer = function() {
			that._clearContainer();
		};
		
		//set the next page to be animated and start the animation
		var setNextAnimation = function(nextPage) {
			that.animation.setNextPage(nextPage);
			that.animation.animate(clearContainer);
		};
		
		//*********
		//Switch on the new page type
		//*********
		if (type === "login") {
			console.log("switch to login");
			that.controllers.loginController = new carProject.controllers.login(that.content, that.setContentType, that.model);
			that.currentActiveController = that.controllers.loginController;
			
			setNextAnimation(that.controllers.loginController.container);
		}
		
		if (type === "signup") {
			console.log("switch to signup");
			that.controllers.signupController = new carProject.controllers.signup(that.content, that.setContentType, that.model);
			that.currentActiveController = that.controllers.signupController;
			
			setNextAnimation(that.controllers.signupController.container);
		}
		
		if (type == "vehicles") {
			console.log("switch to vehicles");
			that.controllers.vehiclesController = new carProject.controllers.vehicles(that.content, that.setContentType, that.model);
			
			setNextAnimation(that.controllers.vehiclesController.container);
		}
		if (type == "services") {
			console.log("switch to services");
			that.controllers.servicesController = new carProject.controllers.services(that.content, that.setContentType, that.model);
			
			setNextAnimation(that.controllers.servicesController.container);
		}
		if (type == "account") {
			console.log("switch to account");
			that.controllers.accountController = new carProject.controllers.account(that.content, that.setContentType, that.model);
			
			setNextAnimation(that.controllers.accountController.container);
		}
		
		if (type === "logout") {
			console.log("logout");
			//called when a response is given to the logout request
			var callback = function(message) {
				if (message.success) {
					localStorage.clear(); // Purge the user's data
					that.controllers.headerController.update();
					that.setContentType("home");
				}
			};
			
			that.model.logout(callback, that);
			return;
		}
		
		if (type === "home") {
			console.log("switch to home");
			that.controllers.mainPageController = new carProject.controllers.mainPage(that.content, that.setContentType, that.model);
			that.currentActiveController = that.controllers.mainPageController;
			setNextAnimation(that.controllers.mainPageController.container);
		}
		
		if (type === "initialHome") {
			type = "home";
			console.log("switch to initialHome");
			that.controllers.mainPageController = new carProject.controllers.mainPage(that.content, that.setContentType, that.model);
			that.currentActiveController = that.controllers.mainPageController;
			//setNextAnimation(that.controllers.mainPageController.container);
		}
		
		if (type === "loginSuccessful") {
			that.controllers.headerController.update();
			that.setContentType("home");
			type = "home";
		}
		
		that.currentPage = type;
	};
	
	//self-invoking
	this.init = function() {
		//IMPORTANT - We have to change the wrappers that underscore.js uses to evaluate things in the templates from "<%" and "%>"
		//	to "{{" and "}}" so that there is no interference with the replacement task that parses said templates!
		_.templateSettings = {
			interpolate: /\{\{(.+?)\}\}/g
		};
		//Setting the top-tier object in the templates to the commonly used "rc"
		_.templateSettings.variable = "rc";
		
		
		this.controllers.headerController = new carProject.controllers.header(this.header, this.setContentType);
		this.model = new carProject.model(this._expiredSession);
		this.animation = new carProject.controllers.animation();
		
		//Set the initial state to the home page
		this.setContentType("initialHome");
		this.animation.setCurrentPage(this.controllers.mainPageController.container);
	}.call(this);
};