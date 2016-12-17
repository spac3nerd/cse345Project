//TODO: Based on whether or not the user is logged in, the navbar elements should change

carProject.controllers = carProject.controllers || {};
carProject.controllers.header = function(parent, callBack) {
	this.parent = parent; 
	this.test = "test";
	this.callBack = callBack;
	this.navBarElements = undefined;
	//Contains all of the elements on screen
	this.elements = {
		loginBtn: undefined,
		signUpBtn: undefined,
		homeTab: undefined,
		navbar: undefined
	};
	//elements that are displayed when a user is logged in
	this.userElements = [
		{
			text: "Home", //The text visible on the tabs
			event: "home", //String that is passed to handler,
			position: "left",
			classes: []
		},
		{
			text: "My Vehicles",
			event: "vehicles",
			position: "left",
			classes: []
		},
		{
			text: "Services",
			event: "services",
			position: "left",
			classes: []
		},
		{
			text: "Log Out",
			event: "logout",
			position: "right",
			classes: ["signup"]
		},
		{
			text: "My Account",
			event: "account",
			position: "right",
			classes: []
		},
	];
	this.visitorElements = [
		{
			text: "Home", //The text visible on the tabs
			event: "home", //String that is passed to handler,
			position: "left",
			classes: []
		},
		{
			text: "Log In",
			event: "login",
			position: "right",
			classes: ["signup"]
		},
		{
			text: "Sign Up",
			event: "signup",
			position: "right",
			classes: ["signup"]
		}
	];
	
	
	
	//called upon login/logout
	this.update = function() {
		this.elements.navbar.empty();
		this._create();
	};
	
	this._setNavBarElem = function() {
		if (localStorage.isLoggedIn) {
			this.navBarElements = this.userElements;
		}
		else {
			this.navBarElements = this.visitorElements;
		}
	};
	
	this._create = function() {
		//Just to make the code prettier
		var t = this.elements;
		this._setNavBarElem();
		
		
		t.navbar = $("<ul>",{
		}).css({
			top: "0px",
			width: "100%",
			position: "relative"
		}).addClass("headerUl");
		
		var li, a, that = this;
		for (var k = 0; k < this.navBarElements.length; k++) {
			li = $("<li>").css({
				float: this.navBarElements[k].position
			}).addClass("headerList");
			a = $("<a>").text(this.navBarElements[k].text).on("click", function() {
				that.callBack(this.attributes["data-event"].nodeValue);
			}).addClass("headerListSelect");
			
			//Add the event as an attribute so that it can be retrieved on the event
			a.attr("data-event", this.navBarElements[k].event);
			
			//Add any classes that may be defined
			for (var n = 0; n < this.navBarElements[k].classes.length; n++) {
				li.addClass(this.navBarElements[k].classes[n]);
			}
			
			li.append(a);
			t.navbar.append(li);
		}
		
		this.parent.append(t.navbar);
	};
	
	this.init = function() {
		this._create();
	}.call(this);
};