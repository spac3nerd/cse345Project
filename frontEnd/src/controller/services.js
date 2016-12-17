carProject.controllers = carProject.controllers || {};
carProject.controllers.services = function(parent, callback, model) {
	this.parent = parent;
	this.callback = callback;
	this._model = model;
	this.container = undefined;
	this._custVehicles = undefined;
	this._vehicleSelect = undefined;
	this._dataTable = undefined;
	this._technicianList = undefined;
	this._currenlyExpandedRow = undefined; //keep track of expansions so that only one row may be expanded at any time
	this._appointmentController = undefined;
	this._selectedVehicle = undefined;
	
	/*
	 * format data from a single array to an array of objects that the table can use
	 * [
	 * 	{row1},
	 * 	{row2}
	 * ]
	 */
	this._formatServiceData = function(data) {
		var formattedData = [];
		for (var k = 0; k < data.length; k++) {
			formattedData.push({
				service: data[k]
			});
		}
		return formattedData;
	};
	
	this._updateTable = function(message) {
		var data = message.data, that = this;
		//Format the data into something the DataTable can understand
		var formattedData = {
			data: this._formatServiceData(data),
			columns: [
				{
					className: "details-control",
					orderable: false,
					data: null,
					defaultContent: ""
				},
				{data: "service"}
			]
		};
		
		//check to see if the table has not been initialized
		if (!this._dataTable) {
			//Get the table from the partial and construct the DataTable
			this._dataTable = $("#servicesTable").DataTable({
				paging: false,
				searching: false,
				data: formattedData.data,
				columns: formattedData.columns,
				order: [[1, "asc"]] //force a sort on the service column
			});
			
			//add event listener for the expand/collapse buttons
			$("#servicesTable tbody").on("click", "td.details-control", function () {
				var tr = $(this).closest("tr");
				var row = that._dataTable.row( tr );
				
				if (row.child.isShown()) {
					//This row is already open - close it
					row.child.hide();
					tr.removeClass("shown");
					that._currenlyExpandedRow = undefined; // ensure that when a user collapses a row, it is no longer tracked
				}
				else {
					//if a row has been expanded
					if (that._currenlyExpandedRow) {
						//check to see if the element is still attached to the DOM - it will not be attached if the user expands a row and then selects a different vehicle
						if (!jQuery.contains(document, that._currenlyExpandedRow.row)) {
							that._currenlyExpandedRow.row.child.hide();
							that._currenlyExpandedRow.tr.removeClass("shown");
						}
					}
					
					//Keep track of the current expansion
					that._currenlyExpandedRow = {};
					that._currenlyExpandedRow.row = row;
					that._currenlyExpandedRow.tr = tr;
					
					//Instantiate a new appointment controller
					that._appointmentController = new carProject.controllers.appointment(row.data(), that._technicianList, that._model, that._selectedVehicle);
					
					//expand the row and insert the content
					row.child(that._appointmentController.getCompiledSource()).show();
					tr.addClass("shown");
					
					//initialize the controls needed for making an appointment
					that._appointmentController.initControls();
				}
			});
		}
		//if it has been initialized
		else {
			this._dataTable.clear();
			this._dataTable.rows.add(formattedData.data);
			this._dataTable.draw();
		}
	};
	
	this._setVehicleSelection = function(index) {
		var vehicleData = this._custVehicles[index];
		//If the user has registered vehicles
		if (vehicleData) {
			this._model.getServices({
					make: vehicleData[0],
					model: vehicleData[1]
				},
			this._updateTable, this);
			this._selectedVehicle = {
				make: vehicleData[0],
				model: vehicleData[1]
			};
		}
		//laziest approach ever
		else {
			var container = $("#servicesTemplateContainer");
			container.empty();
			container[0].innerText = "It seems that you have not yet registered a vehicle with us. Please go to the \"My Vehicles\" page to do so.";
		}
	};
	
	this._setInitialSelectState = function() {
		var data = this._custVehicles;
		var counter = 0;
		var initialSelect = "";
		var that = this;
		var concatenaedString = "";
		//Add make options to the first drop down
		for (var k = 0; k < data.length; k++) {
			concatenatedString = data[k][0] + " " + data[k][1]; //we must concatenate the make and model into one option
			console.log(concatenatedString);
			$("<option>" + concatenatedString + "</option>").appendTo(this._vehicleSelect);
			if (counter === 0) {
				this._selectedVehicle = {
					make: data[k][0],
					model: data[k][1]
				};
				initialSelect = concatenatedString;
				counter++;
			}
		}
		
		//Make the memus jQuery ui menus and add any event handlers
		this._vehicleSelect.selectmenu({
			select: function(event, ui) {
				that._setVehicleSelection(ui.item.index); //pass in the index so that the selection can be referenced back to the data packet
			}
		});
		
		this._setVehicleSelection(0); //set the default selection to the first vehicle in the list
	};
	
	this._receivedCustVehicles = function(message) {
		this._custVehicles = message.data;
		this._vehicleSelect = $("#vehicleSelect");
		this._setInitialSelectState();
	};
	
	this._receivedTechnicians = function(message) {
		if (message.success) {
			this._technicianList = message.data;
		}
		else {
			alert(message.message);
		}
	};
	
	
	this._create = function() {
		this.template = _.template($("#servicesTemplate").html());
		var data = {};
		this._model.getCustVehicles(this._receivedCustVehicles, this); //get the list of customer vehicles 
		this._model.getTechnicians(this._receivedTechnicians, this); //get the list of technicians
		this.parent.append(this.template(data));
		this.container = $("#servicesTemplateContainer");
	};
	
	this.init = function() {
		this._create();
	}.call(this);
};