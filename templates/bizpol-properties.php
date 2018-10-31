<div class="wrap">
	<h1>Bizpol Properties - Add/Edit Property</h1>
	<?php 
		settings_errors();
	?>

	<!-- Full properties data feeded into the table and properties dialog from jQuery -->

	<div id="general" class="tab-pane">
		<button class="button button-primary" style="margin-bottom: 10px;">Add property</button>
		<table id="propertiesTable" class="bp-data-table">
			<thead>
    			<tr>
    				<th name="id">ID</th><th name="property_name">Name</th>
    				<th class="text-center" name="prefix">Prefix</th>
    				<th class="text-center" name="address">Address</th>
    				<th class="text-center" name="city">City</th>
    				<th class="text-center" name="construction_year">Builded</th>
    				<th class="text-center" name="land_register">Land Register</th>
    				<th class="text-center" name="status">Status</th>
    				<th class="text-center" name="actions">Actions</th>
    				<th align="center" width="20" name="batchFlag"><input type="checkbox" name="batchFlag" /></th>
    			</tr>
    		</thead>
    		<tbody></tbody>
    		<tfoot></tfoot>
    	</table>

		<div id="propertiesDialog">
			<form class="bp-dialog-form" method="post" action="" autocomplete="on">
	        <?php
	            settings_fields('bp_property_settings');
	            do_settings_sections('bizpol_property');
	        ?>
				<div class="bp-tab-pane"></div>
	        <?php
	            submit_button();
	        ?>
			</form>
		</div>
	</div>

	<!-- Full property data by id feeded into the table and properties dialog from jQuery -->


	<div id="single" class="tab-pane">
		<div class="form-group">
		    <label>Filter</label>
		    <select class="incexp_posting_month"></select><select class="incexp_posting_year"></select><select class="incexp_type"></select>
		  </div>
		<div class="tab-pane-header"></div>
		<button class="button button-primary" style="margin-bottom: 10px;" prop_id="">Add new</button>
		<table class="bp-data-table">
			<thead>
				<tr>
					<th name="id">ID</th><th name="incexp_name">Income/Expense Name</th>
					<th name="quantity">Quantity</th><th name="value">Amount</th><th name="incexp_posting_month">Month</th><th name="incexp_posting_year">Year</th>
					<th class="text-center" name="actions">Actions</th>
					<th align="center" width="20" name="batchFlag"><input type="checkbox" name="batchFlag" /></th>
				</tr>
			</thead>
			<tbody></tbody>
			<tfoot></tfoot>
		</table>
		<div id="incexp2propDialog" class="bp-data-dialog">
			<form class="bp-dialog-form" method="post" action="" autocomplete="on">
	        <?php
	            settings_fields('bp_inc2prop_settings');
	            do_settings_sections('bizpol_inc2prop');
            ?>
				<div class="bp-tab-pane"></div>
	        <?php
	            submit_button();
	        ?>
    		</form>
		</div>
	</div>

	<div id="bpTPM" class="propertiesTabs"></div>

</div>

<script>
	$(document).ready(function(){
		// var GetURLParameter = function(url, sParam)
		// {
		// 	var sPageURL = url;
		// 	var sURLVariables = sPageURL.split('&');
		// 	for (var i = 0; i < sURLVariables.length; i++) 
		// 	{
		// 	    var sParameterName = sURLVariables[i].split('=');
		// 	    if (sParameterName[0] == sParam) 
		// 	    {
		// 	        return sParameterName[1];
		// 	    }
		// 	}
		// };

		$("#incexp2propDialog").on('click', '#incexp-add-button', function(event){
			event.preventDefault();
			alert(12345);

			console.log($(this).parent());

			$(this).parents('tr').next().toggle(400);
			$(this).parents('tr').next().next().toggle(400);

			$(this).find('span').toggleClass('dashicons-plus');
			$(this).find('span').toggleClass('dashicons-minus');
		});				

		// $("#bpAddIncExp2PropButton").click(function(){
		// 	var value = this.getAttribute('prop_id');
		// 	incexp2propD.addHiddenField('property_id', value);
		// 	incexp2propD.open();
		// 	//console.log(value);
		// });

		// $(".bp-data-table").on('click', 'a', function(event){
		// 	event.preventDefault();
		// 	//alert('Link works!');
		// 	document.querySelector("ul.nav-tabs li.active").classList.remove("active");
		// 	document.querySelector(".tab-pane.active").classList.remove("active");

		// 	var anchor = event.target;
		// 	var href = anchor.getAttribute("href");
		// 	var tab = GetURLParameter(href, 'tab');
		// 	var row_id = GetURLParameter(href, 'rowId');
		// 	var bpPropertiesDataTableName = 'propertiesTable';
		// 	var bpIncExpDataTableName = 'incExp2PropTable';
		// 	// get row data
		// 	var row = propertiesDT.getRowData(row_id);
		// 	var addButton = $("#bpAddIncExp2PropButton");

		// 	$('#' + tab).addClass("active");
		// 	$('#' + tab + '-tab').addClass("active");

		// 	var rId = 0;
		// 	var displayText = '';

		// 	$.each(row, function (key, value) {

		// 		if (key === 'id') {
		// 			rId = value;
		// 		}
		// 		else {
		// 			displayText +=  value.replace(/<[^>]*>/g, '') + '  ';
		// 		}
	            
	 //        });
	 //        bpDialogInc2PropDT.clearParam();
	 //        bpDialogInc2PropDT.setParam('property_id', rId);
	 //        bpDialogInc2PropDT.load();
		// 	$('.prop_inc_title h2').text('Record #' + rId);
		// 	$('.prop_inc_title h4').text(displayText);
		// 	addButton.attr('prop_id', rId);
		// });
		
	});
</script>

<script>
	var bpCityRPC = new bpCities();

	var wp_adminId = '<?php echo wp_get_current_user()->id ?>';
	var wp_adminFullName = '<?php echo wp_get_current_user()->display_name ?>';
	var bpTPM = new bpTabPaneMain('bpTPM');
	var generalTab = $('div#general');
	var singleTab = $('div#single');
	generalTab.remove();
	singleTab.remove();


	bpTPM.addData('properties', 'Properties', generalTab);
	bpTPM.addData('property', 'property', singleTab, true);
	bpTPM.load();

	var propertiesDT = new bpDt('properties', $('#propertiesTable'));
	var propertiesHeader = {
		id: 'ID',
		property_name: 'Name',
		prefix: 'Prefix',
		address: 'Address',
		city: 'City',
		construction_year: 'Builded',
		land_register: 'Land Register',
		status: 'Status',
		actions: 'Actions',
		batchFlag: '<input type="checkbox" name="batchFlag" onclick="" />'
	};

	propertiesDT.load();

	function propertiesTableFeed(data, table){
		var rowCounter = 0;

	    for ( var r in data.entries ) {
	      var record = data.entries[r];
	      var status = '';

	      if (record.status === '1') {
	      	status = '<span class="dashicons dashicons-visibility" onclick="' + table.getName() + 'DT.switchStatus(' + rowCounter + ')"></span>';
	      } else {
	      	status = '<span class="dashicons dashicons-hidden" onclick="' + table.getName() + 'DT.switchStatus(' + rowCounter + ')"></span>';
	      }

	      var newRow = table.addRow(rowCounter);

	      table.addCell(0, newRow, (rowCounter + 1) + ' - (#' + record.id + ')');
	      // propertiesDT.addCell(1, newRow, '<a href="admin.php?page=bizpol_property&tab=single&rowId=' + rowCounter + '">' + record.property_name + '</a>');
	      table.addCell(1, newRow, '<div class="property-link" onclick="bpTPM.newTab(\'incexp2prop\', ' + record.id + ', \'' + record.property_name + '\', propertiesDT.getRowData(' +  rowCounter +'))">' + record.property_name + '</div>');
	      table.addCell(2, newRow, record.prefix, 'center');
	      table.addCell(3, newRow, record.address, 'center');
	      table.addCell(4, newRow, record.city, 'center');
	      table.addCell(5, newRow, record.construction_year.substr(0,10), 'center');
	      table.addCell(6, newRow, record.land_register, 'center');
	      table.addCell(7, newRow, status, 'center');
	      table.addCell(8, newRow, '<button name="edit" class="button-link-edit edit small" onclick="' + table.getName() + 'DT.edit(' + rowCounter + ')"><span class="dashicons dashicons-edit"></span></button><button name="delete" class="button-link-delete delete small" onclick="' + table.getName() + 'DT.delete(' + rowCounter + ')"><span class="dashicons dashicons-trash"></span></button>', 'center');
	      table.addCell(9, newRow, '<input type="checkbox" name="batch[]" value="' + parseInt(rowCounter) + '" id="batch' + parseInt(rowCounter) + '" onclick="' + table.getName() + 'DT.flagCheckbox(this);"/>', 'center');

	      rowCounter++;
		}
	}

	function incexp2propTableFeed(data, table){
		var rowCounter = 0;
		var funcName =  table.getFuncName();
		var summary = {};
		summary.income = 0;
		summary.expense = 0;
		summary.total = 0;

		//console.log(table.bpDataTable[0].tBodies[0].rows);

		$(table.bpDataTable).find('tBody > tr').remove();

	    for ( var r in data.entries ) {
	      var record = data.entries[r];

	      var newRow = table.addRow(rowCounter);
	      var sum = record.value * record.quantity;    

	      table.addCell(0, newRow, (rowCounter + 1) + ' - (#' + record.id + ')');
	      table.addCell(1, newRow, record.incexp_name + ' (' + record.incexp_type + ')');
	      table.addCell(2, newRow, record.quantity, 'center');
	      table.addCell(3, newRow, record.value, 'center');
	      table.addCell(4, newRow, record.incexp_posting_month_n, 'center');
	      table.addCell(5, newRow, record.incexp_posting_year, 'center');
	      table.addCell(6, newRow, '<button name="edit" class="button-link-edit edit small" onclick="' + funcName + '.edit(' + rowCounter + ');"><span class="dashicons dashicons-edit"></span></button><button name="delete" class="button-link-delete delete small" onclick="' + funcName + '.delete(' + rowCounter + ');"><span class="dashicons dashicons-trash"></span></button>', 'center');
	      table.addCell(7, newRow, '<input type="checkbox" name="batch[]" value="' + parseInt(rowCounter) + '" id="batch' + parseInt(rowCounter) + '" onclick="' + funcName + '.flagCheckbox(this);"/>', 'center');

	      rowCounter++;

	      if (record.incexp_type === 'income') {
	      	summary.income += sum;
	      } else {
	      	summary.expense += sum;
	      }
	      
		}

		summary.total = summary.income - summary.expense;
		//add extra input value fields to form in dialog

		table.setEmptyRowExtraFields('incexp_button', '+ Add manualy');


		

		var divSummary = table.getTable().prev().prev().find('.header-summary');
		divSummary.empty();

		$.each(summary, function (key, value) {
			var div = $('<div>');
	        div.addClass('summary-' + key);
	        div.html(value);
	        div.appendTo(divSummary);
		});

		// var sort = table.getTable().find('tbody tr td');

		// console.log('sort');
		// console.log(sort);

		// var divIncome = $('<div>');
  //       //div.addClass('summary-' + key);
  //       divIncome.text(data.income);

  //       var divExpense = $('<div>');
  //       //div.addClass('summary-' + key);
  //       divExpense.text(data.expense);

  //       var divIncExpDiff = $('<div>');
  //       //div.addClass('summary-' + key);
  //       divIncExpDiff.text(data.summary);

		// divIncome.appendTo(summary);
		// divExpense.appendTo(summary);
		// divIncExpDiff.appendTo(summary);
		
	}



	function incexp2propAdd(element){

		var buttonVal = $(element).val();
		var buttonName = element.name;
		var hiddenName = buttonName.replace('button', 'new');

		if (buttonVal === "+ Add manualy") {
			$(element).val('- Back');

			$('<input>').attr({
			    type: 'hidden',
			    name: hiddenName,
			    value: true
			}).insertAfter(element);

		} else {
			$(element).val('+ Add manualy');
			$('input[name="' + hiddenName + '"]').remove();
		}
		console.log(element.name);
		var first = $(element).parents('tr').next();
		var second = first.next();
		var third = second.next();

		first.toggle(100);
		second.toggle(200);
		third.toggle(300);

		$(element).find('span').toggleClass('dashicons-plus');
		$(element).find('span').toggleClass('dashicons-minus');
	};
</script>

