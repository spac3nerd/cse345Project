carProject.controllers = carProject.controllers || {};
carProject.controllers.appointment = function(service, technicianList, model, selectedVehicle) {
	this._service = service;
	this._technicianList = technicianList;
	this._model = model;
	this._selectedVehicle = selectedVehicle;
	this.template = undefined;
	this._compiledSource = undefined;
	this._selectTech = undefined;
	this._selectDate = undefined;
	this._selectTime = undefined;
	this._submitBtn = undefined;
	//holds selected values
	this._selectedTech = undefined;
	this._selectedDate = undefined;
	this._selectedTime = undefined;
	
	//return the source of the appointment widget
	this.getCompiledSource = function() {
		return this._compiledSource;
	};
	
	this._appointmentCallback = function(message) {
		//if the appointment has been scheduled
		if (message.success) {
			var container = $("#appointmentTemplateContainer");
			container.empty();
			container[0].innerHTML = "Thank you! Your appointment has been scheduled!";
		}
		else {
			alert(message.message);
		}
	};
	
	this.initControls = function() {
		
		var that = this;
		//The technician drop down
		this._selectTech = $("#selectTechnician");
		
		var concatenatedString = "", t = this._technicianList, initialSelect = "", counter = 0;
		for (var k = 0; k < t.length; k++) {
			concatenatedString = t[k].TechFirstName + " " + t[k].TechLastName; //we must concatenate the make and model into one option
			//A custom attribute is added to keep make TechID part of the selection even if it is hidden from the user
			$("<option customVal = " + t[k].TechID + ">" + concatenatedString + "</option>").appendTo(this._selectTech);
			if (counter === 0) {
				counter++;
				this._selectedTech = t[k].TechID;
				initialSelect = concatenatedString;
			}
		}
		//Init the drop down and add the event handler
		this._selectTech.selectmenu({
			select: function(event, ui) {
				//read the techID from the custom property we added
				that._selectedTech = ui.item.element[0].attributes[0].value;
			}
		});
		
		//create the data picker and add the needed restrictions 
		this._selectDate = $("#appointmentDatePicker").datepicker({
			onSelect: function(event, ui) {
				var selectedDate = (Number(ui.selectedMonth) + 1) + "/" + ui.selectedDay + "/" + ui.selectedYear;
				that._selectedDate = selectedDate;
				that._updateTimeSelection(selectedDate);
			},
			minDate: 0,
			maxDate: "+6D"
		});
		
		//add event listener to the submit button
		this._submitBtn = $("#submitAppointment").on("click", function(e) {
			if ( (that._selectedDate) && (that._selectedTime !== undefined) && (that._selectedTech) ) {
				//normalize date
				var date = "D" + ((new Date(that._selectedDate).getDate() - new Date().getDate()) + 1);
				that._model.addAppointment({
					technician: that._selectedTech,
					date: date,
					time: that._selectedTime,
					vehicle: {
						make: that._selectedVehicle.make,
						model: that._selectedVehicle.model
					}
				}, that._appointmentCallback, that);
			}
			else {
				alert("Please fill in all of the needed data");
			}
		});
		
		
		
		//The time select menu
		this._selectTime = $("#selectTime").timepicker({
			minTime: "9am",
			maxTime: "4pm",
			step: 60,
			timeFormat: "g:ia",//"h:mm p",
			scrollbar: true,
			dropdown: false,
			disableTextInput: true
		});
		
		//add the event handler to the timepicker
		this._selectTime.on("changeTime", function(e) {
			var value = $(this).val();
			//we must convert the time back into a time slot
			var time = Number(value.split(":")[0]);
			var ampm = value.split(":")[1].split("00")[1];
			
			if ( (ampm === "pm") && (time !== 12)) {
				time += 12;
			}
			that._selectedTime = time - 9;
			console.log(that._selectedTime);
			
		});
	};
	
	this._updateTimeSelection = function(date) {
		if (this._selectedTech) {
			$("#selectTime").timepicker("option", "dropdown", true);
			for (var k = 0; k < this._technicianList.length; k++) {
				if (this._technicianList[k].TechID == this._selectedTech) {
					var selectedDate = new Date(date);
					var delta = (selectedDate.getDate() - new Date().getDate()) + 1;
					var availableTimes = this._technicianList[k]["D" + delta];
					var disabledRanges = [];
					
					for (var n = 0; n < availableTimes.length; n++) {
						//find any time slots that are taken
						if (availableTimes[n] == 1) {
							disabledRanges.push([(n + 9).toString() + ":00", (n + 10).toString() + ":00"]);
						}
					}
					//add the disabled range list to the control
					$("#selectTime").timepicker("option", "disableTimeRanges", disabledRanges);
				}
			}
		}
		
	};
	
	this._create = function() {
		this.template = _.template($("#appointmentTemplate").html());
		var data = {
			service: this._service.service
		};
		
		this._compiledSource = this.template(data);
	};
	
	this.init = function() {
		this._create();
	}.call(this);
};
