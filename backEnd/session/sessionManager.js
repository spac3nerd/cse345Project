sessionManager = function() {
	//key-value pair of sessionID-email
	var sessions = {};
	var crypto = require("crypto");
	
	function generateId() {
		return crypto.randomBytes(64).toString("hex");
	};
	
	return {
		addSession: function(email) {
			var id = generateId();
			sessions[id] = email;
			
			return id;
		},
		endSession: function(id) {
			delete sessions.id;
		},
		getUser: function(id) {
			return sessions[id];
		},
		//One argument checks to see if the ID exists
		//Two arguments checks to see if the ID matches the given account
		verifyId: function(id, email) {
			if (arguments.length === 1) {
				if (sessions[id]) {
					return true;
				}
				else {
					return false;
				}
			}
			else if (arguments.length === 2) {
				if (sessions[id] === email) {
					return true;
				}
				else {
					return false;
				}
			}
		},
		//Only for debugging 
		showSessions: function() {
			return sessions;
		}
	};
};

module.exports = sessionManager;