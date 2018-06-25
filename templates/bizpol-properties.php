<div class="wrap">
	<h1>Bizpol Properties - Add/Edit Property</h1>
	<?php 
		settings_errors();
	?>

	<ul class="nav-tabs">
        <li id="general-tab" class="active"><a href="#general">Properties</a></li>
        <li id="single-tab"><a href="#single">Property Incomes</a></li>
    </ul>

    <div class="tab-content">
    	<div id="general" class="tab-pane active">



<button id="bpAddButton" class="btn btn-primary" style="margin-bottom: 10px;">Add property</button>


					<?php
					echo '<table id="propertiesTable" class="bp-data-table"><thead><tr><th name="id">ID</th><th name="property_name">Name</th><th name="prefix">Prefix</th><th name="address">Address</th><th class="text-center" name="construction_year">Builded</th><th class="text-center" name="land_register">Land Register</th><th class="text-center" name="actions">Actions</th></tr>';
					
					echo '</thead><tbody></tbody></table>';
				?>
			

			<div id="bpDialog">
				<form id="bp-dialog-form" method="post" action="" autocomplete="on">
		        <?php
		            settings_fields('bp_property_settings');
		            do_settings_sections('bizpol_property');
		            submit_button();
		        ?>
    			</form>
			</div>

		</div>
		<div id="single" class="tab-pane">
			<div class="prop_inc_title">
				<h2></h2>
				<h4></h4>
			</div>
			
			<button id="bpAddIncExp2PropButton" class="btn btn-primary" style="margin-bottom: 10px;" prop_id="">Add new</button>
			<?php
					echo '<table id="incExpToPropTable" class="bp-data-table"><thead><tr><th name="incexp_name">Income/Expense Name</th><th name="quantity">Quantity</th><th name="incexp_value">Amount</th><th class="text-center" name="actions">Actions</th></tr>';
					
					echo '</thead><tbody></tbody></table>';
				?>
			<button id="bpBackButton" class="btn btn-primary" style="margin-top: 10px;">Go Back</button>
			<div id="bpDialogInc2Prop">
				<form id="bp-dialog" method="post" action="" autocomplete="on">
		        <?php
		            settings_fields('bp_inc2prop_settings');
		            do_settings_sections('bizpol_inc2prop');
		            submit_button();
		        ?>
	    		</form>
			</div>
		</div>
    </div>
	
</div>

<script>
	var wp_adminId = '<?php echo wp_get_current_user()->id ?>';
	var wp_adminFullName = '<?php echo wp_get_current_user()->display_name ?>';
	var dialog = '';
	//var bpDataTableName = 'propertiesTable';

	//getting properties table
	var bpDtProp = new bpDt('propertiesTable', 'bp_get_all_properties_rpc');

	var bpDAddProp = new bpDialog();
	bpDAddProp.setID('bpDialog');
	bpDAddProp.setAction('bp_update_properties_rpc');
	bpDAddProp.setActionTitle('properties'); 

	var bpDAddIncExp = new bpDialog();
	bpDAddIncExp.setID('bpDialogInc2Prop');
	bpDAddIncExp.setAction('bp_update_incexp2prop_rpc');
	bpDAddIncExp.setActionTitle('income/expense');

	$(document).ready(function ($) {
		//bpDialog.autoOpen(true);
		bpDAddProp.load();
		bpDAddIncExp.load();
	});

	bpDtProp.load();

	function feedDataTable(data, tableId){
		var rowCounter = 0;

	    for ( var r in data.entries ) {
	      var record = data.entries[r];

	      var newRow = bpDtProp.addRow(rowCounter);	      

	      bpDtProp.addCell(0, newRow, record.id);
	      bpDtProp.addCell(1, newRow, '<a href="admin.php?page=bizpol_property&tab=single&rowId=' + rowCounter + '">' + record.property_name + '</a>');
	      bpDtProp.addCell(2, newRow, record.prefix);
	      bpDtProp.addCell(3, newRow, record.address);
	      bpDtProp.addCell(4, newRow, record.construction_year.substr(0,10));
	      bpDtProp.addCell(5, newRow, record.land_register);
	      bpDtProp.addCell(6, newRow, '<button name="edit" class="edit small" onclick="bpDAddProp.edit(' + record.id + ', \'' + tableId + '\')">Edit</button><button name="delete" class="delete small" onclick="bpDAddProp.delete(' + record.id + ')">Delete</button>', 'center');

	      rowCounter++;
		}
	}

	console.log(bpDtProp.getTable());

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
				

				$("#bpAddButton").click(function(){
					bpDAddProp.open();
				});

				$("#bpAddIncExp2PropButton").click(function(){
					var value = this.getAttribute('prop_id');
					bpDAddIncExp.addHiddenField('properties_id', value);
					bpDAddIncExp.open();
					console.log(value);
				});

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
        			var bpIncExpDataTableName = 'incExpTable';
        			// get row data
        			var row = bpDtProp.getRowData(row_id);
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
        			$('.prop_inc_title h2').text('Record #' + rId);
        			$('.prop_inc_title h4').text(displayText);
        			addButton.attr('prop_id', rId);
				});

			});
			</script>
