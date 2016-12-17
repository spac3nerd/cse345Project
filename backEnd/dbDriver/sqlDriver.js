sqlDriver = function(dbSettings, sessionMgr) {
	var sqlD = require("mariasql");
	var bcrypt = require("bcrypt");
	var salt = "$2a$10$2pue8UkToY/dqotJLO3ivO";
	var client;
	
	function connectToDb() {
		console.log("connecting to DB.....");
		client = new sqlD({
			host: dbSettings.address,
			user: dbSettings.user,
			password: dbSettings.password,
			db: dbSettings.database,
			port: dbSettings.port
		});
	};
	connectToDb();
	
	//check if email is alredy taken
	function checkDuplicateEmail(email, callback) {
		client.query("SELECT * FROM Customer WHERE CustEmail = '" + email + "'", callback);
	};
	
	//get the CustomerID of user with email
	function getCustID(email, callback) {
		client.query("SELECT * FROM Customer WHERE CustEmail = '" + email + "'", function(error, rows) {
			if (error) {
				throw error
			}
			else {
				callback(rows[0].CustID);
			}
		});
	};
	
	//Passes true or false to the callback if the vehicle make and model exists
	function checkVehicleExists(make, model, callback) {
		client.query("SELECT * FROM Vehicles WHERE VehicleMake = '" + make + "' AND VehicleModel = '" + model + "'", function(error, rows) {
			if (error) {
				callback(false);
			}
			else {
				if (rows.length >= 1) {
					callback(true);
				}
				else {
					callback(false);
				}
			}
		});
	};
	
	//passes true or false based on whether or not the time slot is available for the given technician
	function checkTimeslotAvailable(technician, date, time, callback) {
		var query = "SELECT " + date + " FROM Technician WHERE TechID = "+technician+";";
		var aliases = {
			date: date,
			tech: technician
		};
		client.query(query, aliases, function(error, rows) {
			if (error) {
				callback(false);
			}
			else {
				var availableSlots = (rows[0][date]).split("");
				
				if (availableSlots[time] == 0) {
					//timeslot is still available
					callback(true);
				}
				else {
					//is not available
					callback(false);
				}
			}
		});
	};
	//isOccupied - T/F - T sets the time slot as occupied, F sets it to available
	function updateTechTime(technician, date, time, isOccupied) {
		var query = "SELECT " + date + " FROM Technician WHERE TechID = " + technician + ";";
		client.query(query, function(error, rows) {
			if (error) {
				console.log(error);
			}
			else {
				var timeslots = rows[0][date].split("");
				var day = date.split("")[1];
				if (isOccupied) {
					timeslots[time] = "1";
				}
				else {
					timeslots[time] = "0";
				}
				timeslots = timeslots.join("");
				
				var query2 = "UPDATE Technician SET " + date + " = '" + timeslots + "' WHERE TechID = " + technician + ";";
				client.query(query2, function(error, rows) {
					if (error) {
						console.log(error);
					}
					else {
						console.log("time slot updated");
					}
				});
			}
		});
	};
	
	return {
		insertCustomer: function(firstName, lastName, password, email, callback) {
			
			var queryCallback = function(error, rows) {
				if (rows.length >= 1) {
					callback({
						success: false,
						message: "Email already exists."
					});
				}
				else {
					var hashedPassword = bcrypt.hashSync(password, salt);
					client.query("INSERT INTO Customer (CustFirstName, CustLastName, CustEmail, CustPassword) VALUES ('" + firstName + "','" + lastName + "','" + email + "','" + hashedPassword + "')", function(error, rows) {
						if (error) {
							throw error;
						}
						else {
							callback({
								success: true
							});
						}
					});
				}
			}
			checkDuplicateEmail(email, queryCallback);
		},
		loginCustomer: function(email, password, callback) {
			var queryCallback = function(error, rows) {
				//When a user with that email exists
				if (rows.length >= 1) {

					//We must check the password given by the user with the one in the DB
					if (bcrypt.hashSync(password, salt) === rows[0].CustPassword) {
						//Generate a session ID
						var sessionId = sessionMgr.addSession(email);
						callback({
							success: true,
							sessionId: sessionId,
							firstName: rows[0].CustFirstName,
							lastName: rows[0].CustLastName
						});
					}
					else {
						callback({
							success: false,
							message: "Incorrect password."
						});
					}
				}
				//If no user with that email has not been found
				else { 
					callback({
						success: false,
						message: "No such user exists."
					});
				}
			}
			checkDuplicateEmail(email, queryCallback);
		},
		getCustVehicles: function(email, callback) {
			var queryCallback = function(custID) {
				client.query("SELECT * FROM Vehicles WHERE VehicleID IN (SELECT VehicleID FROM CustomerVehicles WHERE CustID ='" + custID +"')", function(error, rows) {
					/* data will be formatted in the following manner:
					* [
					* 	["Make1", "Model1"],
					* 	["Make2", "Model2"]
					* ]
					*/
					var data = [];
					
					if (rows.length >= 1) {
						for (var k = 0; k < rows.length; k++) {
							//Append a new object to the array
							data.push([
								rows[k].VehicleMake,
								rows[k].VehicleModel
							]);
						}
					}
					callback({
						success: true,
						data: data
					});
				});
			};
			getCustID(email, queryCallback);
		},
		//Return a packet containing all Vehicles
		getVehicleList: function(callback) {
			client.query("SELECT * FROM Vehicles", function(error, rows) {
				/* data will be formatted in the following manner:
				 * {
				 * 	make1: ["model1", "model2"],
				 * 	make2: ["model3", "model4"]
				 * }
				 */
				var data = {};
				
				if (rows.length >= 1) {
					for (var k = 0; k < rows.length; k++) {
						if (data[rows[k].VehicleMake]) {
							data[rows[k].VehicleMake].push(rows[k].VehicleModel);
						}
						else {
							data[rows[k].VehicleMake] = [rows[k].VehicleModel];
						}
					}
				}
				callback({
					success: true,
					data: data
				});
			});
		},
		//Add a new customer vehicle
		addCustVehicle: function(email, make, model, callback) {
			var that = this;
			var queryCallback = function(vehicleExists) {
				//if the vehicle exists
				if (vehicleExists) {
					//Write the query as a var since it's a bit large
					//This query writes a new entry in the CustomerVehicles table
					var query = "INSERT IGNORE CustomerVehicles (CustID, VehicleID) VALUES ((SELECT CustID FROM Customer WHERE CustEmail = :email),(SELECT VehicleID from Vehicles WHERE VehicleMake = :make AND VehicleModel = :model));";
					
					var aliases = {
						email: email,
						make: make,
						model: model
					};
					client.query(query, aliases, function(error, rows) {
						if (error) {
							callback({
								success: false,
								message: "Something went wrong"
							});
						}
						else {
							//call this query to return the new list of vehicles
							that.getCustVehicles(email, callback);
						}
					});
				}
				else {
					callback({
						success: false,
						message: "Vehicle make or model does not exist"
					});
				}
			}
			
			//first we have to make sure that the 
			checkVehicleExists(make, model, queryCallback);
		},
		//return the list of services for a specific make and model
		getServices: function(make, model, callback) {
			var data = [];
			var query = "SELECT Service FROM Services WHERE ServiceID IN (SELECT ServiceID FROM ServiceRecommendation WHERE VehicleID = (SELECT VehicleID FROM Vehicles WHERE VehicleMake = :make AND VehicleModel = :model));"
			var aliases = {
				make: make,
				model: model
			};
			
			client.query(query, aliases, function(error, rows) {
				if (error) {
					callback({
						success: false,
						message: "Something went wrong"
					});
				}
				else {
					if (rows.length >= 1) {
						for (var k = 0; k < rows.length; k++) {
							data.push(rows[k].Service);
						}
					}
					callback({
						success: true,
						data: data
					});
				}
			});
		},
		getTechnicians: function(callback) {
			var data = [];
			var query = "SELECT * FROM Technician";
			
			client.query(query, function(error, rows) {
				if (error) {
					callback({
						success: false,
						message: "Something went wrong"
					});
				}
				else {
					if (rows.length >= 1) {
						for (var k = 0; k < rows.length; k++) {
							data.push({});
							for (var n in rows[k]) {
								data[k][n] = rows[k][n];
							}
						}
					}
					callback({
						success: true,
						data: data
					});
				}
			});
		},
		addAppointment: function(email, technician, date, time, vehicle, callback) {
			var that = this;
			
			var queryCallback = function(isAvailable) {
				//if it is available, then make the appointment
				if (isAvailable) {
					debugger;
					//we have to format the time into a string representation, let's use the JS date object to help us out
					var formattedTime = new Date();
					formattedTime.setDate(formattedTime.getDate() + Number(date.split("")[1]) - 1);
					var dateString = formattedTime.getFullYear() + "/" + (formattedTime.getMonth() + 1) + "/" + formattedTime.getDate();
					
					
					var query = "INSERT INTO Appointment (CustVehicleID, TechID, ApptDate, ApptTime) VALUES ( (SELECT CustVehicleID FROM CustomerVehicles WHERE VehicleID IN (SELECT VehicleID FROM Vehicles WHERE VehicleMake = :make AND VehicleModel = :model) AND CustID IN (SELECT CustID FROM Customer WHERE CustEmail = :email)), :tech, :date, :time );";
					var aliases = {
						make: vehicle.make,
						model: vehicle.model,
						email: email,
						tech: technician,
						date: dateString,
						time: time + 9
					}
					
					client.query(query, aliases, function(error, rows) {
						if (error) {
							console.log(error);
							callback({
								success: false,
								message: "Something went wrong"
							});
						}
						else {
							updateTechTime(technician, date, time, true);
							callback({
								success: true,
								date: dateString,
								vehicle: vehicle,
								time: time
							});
						}
					});
				}
				else {
					callback({
						success: false,
						message: "The time slot is no longer available."
					});
				}
			};
			
			checkTimeslotAvailable(technician, date, time, queryCallback);
		},
		getAppointments: function(email, callback) {
			var query = "SELECT * FROM Vehicles JOIN (SELECT *,VehicleID as temp2 FROM CustomerVehicles JOIN (SELECT CustVehicleID as temp, TechID, ApptID, ApptDate, ApptTime FROM Appointment WHERE CustVehicleID IN (SELECT CustVehicleID FROM CustomerVehicles WHERE CustID = (SELECT CustID FROM Customer WHERE CustEmail = :email))) as t1 ON CustomerVehicles.CustVehicleID = t1.temp) AS t2 ON Vehicles.VehicleID = t2.temp2";
			var data = [];
			aliases = {
				email: email
			}
			
			
			//To avoid a mess with callbacks or making a big single statement even bigger, I will populate an object ahead of time that will associate a TechID with the respective name
			//ID: name
			var techName = {};
			var query2 = "SELECT * FROM Technician";
			client.query(query2, function(error, rows) {
				if (error) {
					callback({
						success: false,
						message: "Something went wrong"
					});
				}
				else {
					if (rows.length >= 1) {
						for (var k = 0; k < rows.length; k++) {
							techName[rows[k].TechID] = rows[k].TechFirstName + " " + rows[k].TechLastName;
						}
					}
					client.query(query, aliases, function(error, rows) {
						if (error) {
							callback({
								success: false,
								message: "Something went wrong"
							});
						}
						else {
							if (rows.length >= 1) {
								for (var k = 0; k < rows.length; k++) {
									data.push({
										date: rows[k].ApptDate,
										time: rows[k].ApptTime,
										technician: techName[rows[k].TechID], //reference the tech name from our previously created data structure,
										techID: rows[k].TechID, //give the cliend the ID to make removal easier
										vehicle: rows[k].VehicleMake + " " + rows[k].VehicleModel,
										apptID: rows[k].ApptID
									});
								}
							}
							callback({
								success: true,
								data: data
							});
						}
					});
					
				}
			});
			
		},
		removeAppointment: function(apptID, time, date, technician, callback) {
			var query = "DELETE FROM Appointment WHERE ApptID = " + apptID + ";";
			client.query(query, function(error, rows) {
				if (error) {
					callback({
						success: false,
						message: "Something went wrong"
					});
				}
				else {
					//Give the technician his time slot back - the time need to 
					var x = new Date(date);
					var y = new Date();
					y.setHours(0, 0, 0, 0);
					var delta = (x.getUTCDate() - y.getUTCDate()) + 1;
					if (delta >= 1){
						updateTechTime(technician, "D" + delta, time - 9, false);
					}
					callback({
						success: true
					});
				}
			});
		}
		
	};
};

module.exports = sqlDriver;