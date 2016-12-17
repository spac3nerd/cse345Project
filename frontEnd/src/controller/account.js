carProject.controllers = carProject.controllers || {};
carProject.controllers.account = function(parent, callback, model) {
	this.container = undefined;
	this.parent = parent;
	this._model = model;
	this._dataTable = undefined;
	this._currenlyExpandedRow = undefined;
	
	this.elements = {};
	
	//callback from server request
	this._setAccountInfo = function(message) {
		this.elements.email[0].innerText += " " + message.email;
		this.elements.name[0].innerText += " " + localStorage.firstName + " " + localStorage.lastName;
	};
	
	this._formatApptData = function(data) {
		var formattedData = [], time;
		for (var k = 0; k < data.length; k++) {
			time = new Date(); //this time object will only be used to format the time in the form of am/pm. I could write the functionality into the Date object, but this is simpler and non-intrusive
			time.setHours(0,0,0,0);
			time.setHours(data[k].time);
			formattedData.push({
				date: data[k].date,
				time: time.toLocaleTimeString().replace(/:\d+ /, ' '),
				technician: data[k].technician,
				vehicle: data[k].vehicle,
				apptID: data[k].apptID, //these values are hidden from the user and they are used only to be sent back to the server once a removal has been confirmed
				techID: data[k].techID,
				originalTime: data[k].time
			});
		}
		console.log(formattedData);
		return formattedData;
	};
	
	this._setAccountTable = function(message) {
		var data = message.data, that = this;
		var formattedData = {
			data: this._formatApptData(data),
			columns: [
				{
					data: "date",
					title: "Date"
				},
				{
					data: "time",
					title: "Time"
				},
				{
					data: "technician",
					title: "Technician"
				},
				{
					data: "vehicle",
					title: "Vehicle"
				},
				//This last column isn't associated with anything in the data packet
				{
					className: "remove-appt",
					orderable: false,
					data: null,
					defaultContent: "",
					title: "Remove"
				},
			]
		};
		
		if (!this._dataTable) {
			//Get the table from the partial and construct the DataTable
			this._dataTable = $("#accountTable").DataTable({
				paging: false,
				searching: false,
				data: formattedData.data,
				columns: formattedData.columns
			});
			//Handle a click on the remove appointment row
			$("#accountTable tbody").on("click", "td.remove-appt", function () {
				var tr = $(this).closest("tr");
				var row = that._dataTable.row(tr);
				
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
					
					//This could be a partial just as in services, but this is just quick
					row.child("<div>Are you sure you wish to cancel this appointment?</div><br><input id=\"confirmDel\" type=\"button\" value=\"Yes\"/><input id=\"cancelDel\"type=\"button\" value=\"No\"/>").show();
					tr.addClass("shown");
					
					
					var removalCallback = function(message) {
						//we need to get the new data set, the table refresh will be handled by this function
						this._model.getAppointments(this._setAccountTable, this);
					};
					
					$("#confirmDel").on("click", function(e) {
						var selectedRow = formattedData.data[row.index()];
						that._model.removeAppointment({
							apptID: selectedRow.apptID,
							date: selectedRow.date,
							time: selectedRow.originalTime,
							techID: selectedRow.techID
						}, removalCallback, that);
					});
					$("#cancelDel").on("click", function(e) {
						//simple but clever, just simulate a click on the remove appointment button!
						tr.find(".remove-appt").click();
					});
				}
			});
		}
		//If the table has already been initialized
		else {
			this._dataTable.clear();
			this._dataTable.rows.add(formattedData.data);
			this._dataTable.draw();
		}
		
	};
	
	this._create = function() {
		this.template = _.template($("#accountTemplate").html());
		
		var data = {};
		
		//Compile the partial using the data and append it to the parent
		this.parent.append(this.template(data));
		this.container = $("#accountTemplateContainer");
		
		this.elements.name = $("#accountName");
		this.elements.email = $("#accountEmail");
		this.elements.table = $("#accountTable");
		
		this._model.getEmail(this._setAccountInfo, this);
		this._model.getAppointments(this._setAccountTable, this);
	};
	
	this.init = function() {
		this._create();
	}.call(this);
};
