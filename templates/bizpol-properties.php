<div class="wrap">
	<h1>Bizpol Properties - Add/Edit Property</h1>
	<?php 
		settings_errors();
	?>
	<div class="propertiesTabs">

	    <div class="tab-content">
	    	<div id="general" class="tab-pane">
	    		<button class="button button-primary" style="margin-bottom: 10px;">Add property</button>
	    		<table id="propertiesTable" class="bp-data-table">
	    			<thead>
		    			<tr>
		    				<th name="id">ID</th><th name="property_name">Name</th>
		    				<th class="text-center" name="prefix">Prefix</th>
		    				<th name="address">Address</th>
		    				<th class="text-center" name="construction_year">Builded</th>
		    				<th class="text-center" name="land_register">Land Register</th>
		    				<th class="text-center" name="status">Status</th>
		    				<th class="text-center" name="actions">Actions</th>
		    				<th align="center" width="20" name="batchFlag"><input type="checkbox" name="batchFlag" id="batchFlag" onclick="propertiesDT.flagCheckboxes(this);" /></th>
		    			</tr>
		    		</thead>
		    		<tbody>		
		    		</tbody>
		    		<tfoot>
		    			<tr>
		    				<td colspan="7" class="bp-data-table-legend">Legend:<span class="dashicons dashicons-trash delete"></span>Delete<span class="dashicons dashicons-edit edit"></span>Edit<span class="dashicons dashicons-visibility edit"></span>Switch status</td>
		    				<td align="center"><button name="edit" class="button-link-edit edit small" onclick="propertiesDT.editBatch()"><span class="dashicons dashicons-edit"></span></button><button name="delete" class="button-link-delete delete small" onclick="propertiesDT.deleteBatch()"><span class="dashicons dashicons-trash"></span></button></td>
		    				<td align="center" width="20"><input type="checkbox" name="batchFlag" id="batchFlag" onclick="propertiesDT.flagCheckboxes(this);" /></td>   					
		    			</tr>
		    		</tfoot>
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
			<div id="single" class="tab-pane">
				<div class="tab-pane-title"></div>			
				<button class="button button-primary" style="margin-bottom: 10px;" prop_id="">Add new</button>
				<table class="bp-data-table">
					<thead>
						<tr>
							<th name="id">ID</th><th name="incexp_id">Income/Expense Name</th>
							<th name="quantity">Quantity</th><th name="value">Amount</th>
							<th class="text-center" name="actions">Actions</th>
						</tr>
					</thead>
					<tbody></tbody>
				</table>
				<button id="bpBackButton" class="button button-primary" style="margin-top: 10px;">Go Back</button>
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
	    </div>
	</div>

	<div id="bpTPM" class="propertiesTabs"></div>

</div>

<script>
	var bpTPM = new bpTabPaneMain('bpTPM');
	var generalTab = $('div#general');
	var singleTab = $('div#single')
	generalTab.remove();
	singleTab.remove();
	bpTPM.addData('properties', 'Properties', generalTab);
	bpTPM.addData('property', 'property', singleTab, true);
	bpTPM.load();
	//bpTPM.newTab('archii');

	var wp_adminId = '<?php echo wp_get_current_user()->id ?>';
	var wp_adminFullName = '<?php echo wp_get_current_user()->display_name ?>';

	//getting properties table
	var propertiesDT = new bpDt('properties', $('#propertiesTable'));

	propertiesDT.load();
	//bpDialogInc2PropDT.load();

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
	      table.addCell(1, newRow, '<div onclick="bpTPM.newTab(\'incexp2prop\', ' + record.id + ', \'' + record.property_name + '\', propertiesDT.getRowData(' +  rowCounter +'))">' + record.property_name + '</div>');
	      table.addCell(2, newRow, record.prefix, 'center');
	      table.addCell(3, newRow, record.address);
	      table.addCell(4, newRow, record.construction_year.substr(0,10), 'center');
	      table.addCell(5, newRow, record.land_register);
	      table.addCell(6, newRow, status, 'center');
	      table.addCell(7, newRow, '<button name="edit" class="button-link-edit edit small" onclick="' + table.getName() + 'DT.edit(' + rowCounter + ')"><span class="dashicons dashicons-edit"></span></button><button name="delete" class="button-link-delete delete small" onclick="' + table.getName() + 'DT.delete(' + rowCounter + ')"><span class="dashicons dashicons-trash"></span></button>', 'center');
	      table.addCell(8, newRow, '<input type="checkbox" name="batch[]" value="' + parseInt(rowCounter) + '" id="batch' + parseInt(rowCounter) + '" onclick="' + table.getName() + 'DT.flagCheckbox(this);"/>', 'center');

	      rowCounter++;
		}
	}

	function incexp2propTableFeed(data, table){
		var rowCounter = 0;
		var newTabObject = table;

	    for ( var r in data.entries ) {
	      var record = data.entries[r];

	      var newRow = table.addRow(rowCounter);    

	      table.addCell(0, newRow, (rowCounter + 1) + ' - (#' + record.id + ')');
	      table.addCell(1, newRow, record.incexp_name + ' (' + record.incexp_type + ')');
	      table.addCell(2, newRow, record.quantity);
	      table.addCell(3, newRow, record.value);
	      table.addCell(4, newRow, '<button name="edit" class="button-link-edit edit small" onclick="' + newTabObject.edit(rowCounter) + '"><span class="dashicons dashicons-edit"></span></button><button name="delete" class="button-link-delete delete small" onclick="' + table.getName() + 'DT.delete(' + rowCounter + ')"><span class="dashicons dashicons-trash"></span></button>', 'center');
	      //table.addCell(4, newRow, '<button name="edit" class="button button-primary edit small" onclick="incexp2propD.edit(' + rowCounter + ')">Edit</button><button name="delete" class="button button-danger delete small" onclick="incexp2propD.delete(' + rowCounter + ')">Delete</button>', 'center');

	      rowCounter++;
		}
	}

	


</script>

<script>
	$(document).ready(function(){
		var GetURLParameter = function(url, sParam)
		{
			var sPageURL = url;
			var sURLVariables = sPageURL.split('&');
			for (var i = 0; i < sURLVariables.length; i++) 
			{
			    var sParameterName = sURLVariables[i].split('=');
			    if (sParameterName[0] == sParam) 
			    {
			        return sParameterName[1];
			    }
			}
		};

		$("#incexp2propDialog").on('click', '#incexp-add-button', function(event){

			$(this).parents('tr').next().toggle(400);
			$(this).parents('tr').next().next().toggle(400);

			$(this).find('span').toggleClass('dashicons-plus');
			$(this).find('span').toggleClass('dashicons-minus');
			//console.log($(this).parent());
		});				

		// $("#bpAddIncExp2PropButton").click(function(){
		// 	var value = this.getAttribute('prop_id');
		// 	incexp2propD.addHiddenField('property_id', value);
		// 	incexp2propD.open();
		// 	//console.log(value);
		// });

		$(".bp-data-table").on('click', 'a', function(event){
			event.preventDefault();
			//alert('Link works!');
			document.querySelector("ul.nav-tabs li.active").classList.remove("active");
			document.querySelector(".tab-pane.active").classList.remove("active");

			var anchor = event.target;
			var href = anchor.getAttribute("href");
			var tab = GetURLParameter(href, 'tab');
			var row_id = GetURLParameter(href, 'rowId');
			var bpPropertiesDataTableName = 'propertiesTable';
			var bpIncExpDataTableName = 'incExp2PropTable';
			// get row data
			var row = propertiesDT.getRowData(row_id);
			var addButton = $("#bpAddIncExp2PropButton");

			$('#' + tab).addClass("active");
			$('#' + tab + '-tab').addClass("active");

			var rId = 0;
			var displayText = '';

			$.each(row, function (key, value) {

				if (key === 'id') {
					rId = value;
				}
				else {
					displayText +=  value.replace(/<[^>]*>/g, '') + '  ';
				}
	            
	        });
	        bpDialogInc2PropDT.clearParam();
	        bpDialogInc2PropDT.setParam('property_id', rId);
	        bpDialogInc2PropDT.load();
			$('.prop_inc_title h2').text('Record #' + rId);
			$('.prop_inc_title h4').text(displayText);
			addButton.attr('prop_id', rId);
		});
		
	});
</script>