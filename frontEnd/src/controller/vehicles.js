carProject.controllers = carProject.controllers || {};
carProject.controllers.vehicles = function(parent, callBack, model) {
	this.parent = parent;
	this._model = model;
	this.container = undefined;
	this.template = undefined;
	this._makeSelect = undefined;
	this._modelSelect = undefined;
	this._vehicleData = undefined;
	this._selectedMake = undefined;
	this._selectedModel = undefined;
	this._dataTable = undefined;
	
	this._updateTable = function(data) {
		//Format the data into something the DataTable can understand
		var formattedData = {
			data: data,
			columns: [
				{title: "Make"},
				{title: "Model"}
			]
		};
		//if the table has not been initialized
		if (!this._dataTable) {
			//Get the table from the partial and construct the DataTable
			this._dataTable = $("#vehiclesTable").DataTable({
				paging: false,
				searching: false,
				data: formattedData.data,
				columns: formattedData.columns
			});
		}
		//if the table has been initialized, we only need to purge the existing rows and then add the data
		else {
			this._dataTable.clear();
			this._dataTable.rows.add(formattedData.data);
			this._dataTable.draw();
		}
	};
	
	
	//callback for when a vehicle has been added
	this._vehicleAdded = function(message) {
		if (message.success) {
			this._updateTable(message.data);
		}
	};
	

	//callback for getCustVehicles
	this._receivedCustVehicles = function(message) {
		var data = message.data;
		this._updateTable(message.data);
	};
	
	//set the list for the model drop down based on the selected make
	this._setModelSelection = function(make) {
		var that = this;
		var data = this._vehicleData;
		if (data[make]) {
			//remove the previous entries
			this._modelSelect.empty();
			for (var k = 0; k < data[make].length; k++) {
				$("<option>" + data[make][k] + "</option>").appendTo(this._modelSelect);
				if (k ===0) {
					that._selectedModel = data[make][k];
				}
			}
			this._modelSelect.selectmenu("refresh");
		}
	};
	
	this._setInitialSelectState = function() {
		var data = this._vehicleData;
		var counter = 0;
		var initialSelect = "";
		var that = this;
		//Add make options to the first drop down
		for (var k in data) {
			$("<option>" + k + "</option>").appendTo(this._makeSelect);
			if (counter === 0) {
				initialSelect = k;
				this._selectedMake = k;
				counter++;
			}
		}
		//Add a blank option to the model select to keep things from breaking
		$("<option>---</option>").appendTo(this._modelSelect);
		
		//Make the memus jQuery ui menus and add any event handlers
		this._makeSelect.selectmenu({
			select: function(event, ui) {
				that._selectedMake = ui.item.value;
				that._setModelSelection(ui.item.value);
			}
		});
		
		this._modelSelect.selectmenu({
			select: function(event, ui) {
				that._selectedModel = ui.item.value;
			}
		});
		this._setModelSelection(initialSelect);
	};
	//Callback for getVehicles
	this._receivedVehiclesList = function(message) {
		console.log(message.data);
		this._vehicleData = message.data;
		this._makeSelect = $("#vehiclesMake");
		this._modelSelect = $("#vehiclesModel");
		this._setInitialSelectState();
		var that = this;
		//Add event handler to the submit button
		$("#vehiclesSubmit").on("click", function() {
			that._model.addVehicle({
				make: that._selectedMake,
				model: that._selectedModel
			},that._vehicleAdded, that);
		});
	};
	
	this._create = function() {
		this.template = _.template($("#vehiclesTemplate").html());
		var data = {};
		this._model.getCustVehicles(this._receivedCustVehicles, this);
		this._model.getVehicles(this._receivedVehiclesList, this);
		this.parent.append(this.template(data));
		//get the container of this entire page
		this.container = $("#vehicleTemplateContainer");
	};
	
	this.init = function() {
		this._create();
	}.call(this);
};
