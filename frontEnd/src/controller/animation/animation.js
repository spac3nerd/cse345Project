//I just quickly put this together to manage css animation between pages
//It's using the animation collection (see animations.css) made by some guys on tympanus.net
carProject.controllers = carProject.controllers || {};
carProject.controllers.animation = function() {
	this.currentPage = undefined;
	this.nextPage = undefined;
	this.prevPage = undefined;
	this.transitionType = 1;
	this.outTransition = "pt-page-rotatePushLeft";
	this.inTransition = "pt-page-rotatePullRight pt-page-delay300";
	//reference to the classes that will apply different z depth to each container
	this.outZIndex = "outZIndex";
	this.inZIndex = "inZIndex";
	this.animationInProgress = false;
	
	this.setCurrentPage = function(page) {
		this.currentPage = page;
	};
	
	this.setNextPage = function(page) {
		this.nextPage = page;
	};
	
	//based on what the current page does, not what the next page will be doing
	this.setTransitionType = function(type) {
		switch (type) {
			case "flipRight":
				break;
			case "flipLeft":
				break;
		}
	};
	
	//This name is a bit incorrect, it just sets up the variables that keep track of the pages to be ready for a new animation.
	//It also removes the in transition from the now current page
	this.reset = function() {
		this.currentPage.detach();
		this.prevPage = this.currentPage;
		this.currentPage = this.nextPage;
		this.nextPage = undefined;
		this.currentPage.removeClass(this.inTransition);
		this.currentPage.removeClass(this.inZIndex);
		this.animationInProgress = false;
	};
	
	
	this.animate = function(callback) {
		if (this.animationInProgress) {
			return;
		}
		
		if (this.currentPage && this.nextPage) {
			this.animationInProgress = true;
			var that = this, endCurrentPage = false, endNextPage = false;
			
			this.currentPage.addClass(this.outZIndex);
			this.currentPage.addClass(this.outTransition).on("animationend", function() {
				endCurrentPage = true;
				that.currentPage.off("animationend");
				if (endNextPage) {
					that.reset();
					callback();
				}
				
				animEnd = true;
			});
			
			this.nextPage.addClass(this.inZIndex);
			this.nextPage.addClass(this.inTransition).on("animationend", function() {
				endNextPage = true;
				that.nextPage.off("animationend");
				if (endCurrentPage) {
					that.reset();
					callback();
				}
			});
		}
	};
	
	this._create = function() {
		
	};
	
	this.init = function() {
		this._create();
	}.call(this);
};
