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



<button id="bpAddButton" class="button button-primary" style="margin-bottom: 10px;">Add property</button>


					<?php
					echo '<table id="propertiesTable" class="bp-data-table"><thead><tr><th name="id">ID</th><th name="property_name">Name</th><th name="prefix">Prefix</th><th name="address">Address</th><th class="text-center" name="construction_year">Builded</th><th class="text-center" name="land_register">Land Register</th><th class="text-center" name="actions">Actions</th></tr>';
					
					echo '</thead><tbody></tbody></table>';
				?>
			

			<div id="propertiesDialog">
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
			
			<button id="bpAddIncExp2PropButton" class="button button-primary" style="margin-bottom: 10px;" prop_id="">Add new</button>
			<?php
					echo '<table id="incexp2propTable" class="bp-data-table"><thead><tr><th name="id">ID</th><th name="incexp_id">Income/Expense Name</th><th name="quantity">Quantity</th><th name="value">Amount</th><th class="text-center" name="actions">Actions</th></tr>';
					
					echo '</thead><tbody></tbody></table>';
				?>
			<button id="bpBackButton" class="button button-primary" style="margin-top: 10px;">Go Back</button>
			<div id="incexp2propDialog">
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
	var bpDialogDT = new bpDt('properties');
	//new object bpDialog(Object bpDt, title)
	var bpDAddProp = new bpDialog(bpDialogDT, 'properties');

	var bpDialogInc2PropDT = new bpDt('incexp2prop');
	var bpDAddIncExp = new bpDialog(bpDialogInc2PropDT, 'income/expense');

	$(document).ready(function ($) {
		//bpDialog.autoOpen(true);
		bpDAddProp.load();
		bpDAddIncExp.load();
	});

	bpDialogDT.load();
	//bpDialogInc2PropDT.load();

	function propertiesTableFeed(data){
		var rowCounter = 0;

	    for ( var r in data.entries ) {
	      var record = data.entries[r];

	      var newRow = bpDialogDT.addRow(rowCounter);    

	      bpDialogDT.addCell(0, newRow, (rowCounter + 1) + ' - (#' + record.id + ')');
	      bpDialogDT.addCell(1, newRow, '<a href="admin.php?page=bizpol_property&tab=single&rowId=' + rowCounter + '">' + record.property_name + '</a>');
	      bpDialogDT.addCell(2, newRow, record.prefix);
	      bpDialogDT.addCell(3, newRow, record.address);
	      bpDialogDT.addCell(4, newRow, record.construction_year.substr(0,10));
	      bpDialogDT.addCell(5, newRow, record.land_register);
	      bpDialogDT.addCell(6, newRow, '<button name="edit" class="edit small" onclick="bpDAddProp.edit(' + rowCounter + ')">Edit</button><button name="delete" class="delete small" onclick="bpDAddProp.delete(' + rowCounter + ')">Delete</button>', 'center');

	      rowCounter++;
		}
	}

	function incexp2propTableFeed(data){
		var rowCounter = 0;

	    for ( var r in data.entries ) {
	      var record = data.entries[r];

	      var newRow = bpDialogInc2PropDT.addRow(rowCounter);    

	      bpDialogInc2PropDT.addCell(0, newRow, (rowCounter + 1) + ' - (#' + record.id + ')');
	      bpDialogInc2PropDT.addCell(1, newRow, record.incexp_name + ' (' + record.incexp_type + ')');
	      bpDialogInc2PropDT.addCell(2, newRow, record.quantity);
	      bpDialogInc2PropDT.addCell(3, newRow, record.value);
	      bpDialogInc2PropDT.addCell(4, newRow, '<button name="edit" class="edit small" onclick="bpDAddIncExp.edit(' + rowCounter + ')">Edit</button><button name="delete" class="delete small" onclick="bpDAddIncExp.delete(' + rowCounter + ')">Delete</button>', 'center');

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
				

				$("#bpAddButton").click(function(){
					bpDAddProp.open();
				});

				$("#bpAddIncExp2PropButton").click(function(){
					var value = this.getAttribute('prop_id');
					bpDAddIncExp.addHiddenField('property_id', value);
					bpDAddIncExp.open();
					//console.log(value);
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
        			var bpIncExpDataTableName = 'incExp2PropTable';
        			// get row data
        			var row = bpDialogDT.getRowData(row_id);
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
