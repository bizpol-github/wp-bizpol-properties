<div class="wrap">
	<h1>Bizpol Properties - Add/Edit Property</h1>
	<?php 
		settings_errors();
	?>

	<ul class="nav-tabs">
        <li class="active"><a href="#tab-1">Properties</a></li>
        <li class="active"><a href="#tab-2">Property Incomes</a></li>
    </ul>

    <div class="tab-content">
    	<div id="tab-1" class="tab-pane active">

<script>
	var wp_adminId = '<?php echo wp_get_current_user()->id ?>';
	var wp_adminFullName = '<?php echo wp_get_current_user()->display_name ?>';
	var dialog = '';
	var bpDialogName = 'bpDialog';
	var bpDataTableName = 'propertiesTable';
	var bpDataTable = new bpDataTable();
	var bpDialog = new bpDialog();
	var bpRpcAction = 'bp_get_all_properties_rpc';
	var bpUpdateAction = 'bp_update_properties_rpc';
	var bpDialogActionTitle = 'properties';

	$(document).ready(function ($) {
		//bpDialog.autoOpen(true);
		bpDialog.load();	
		
	});

	bpDataTable.load();

	function feedDataTable(data){
		var rowCounter = 0;

	    for ( var r in data.entries ) {
	      var record = data.entries[r];

	      var newRow = $('#' + bpDataTableName)[0].tBodies[0].insertRow(rowCounter);
	      newRow.id = 'row' + parseInt(record.id);

	      // $('#row' + parseInt(record[0])).mouseover( function() { rowOverEffect(this); }).mouseout( function() { rowOutEffect(this); }).click(function(event) {
	      //   if (event.target.type !== 'checkbox') {
	      //     $(':checkbox', this).trigger('click');
	      //   }
	      // }).css('cursor', 'pointer');
	      

	      var newCell = newRow.insertCell(0);
	      newCell.innerHTML = record.id;

	      newCell = newRow.insertCell(1);
	      newCell.innerHTML = '<a href="admin.php?page=bizpol_property#tab-2&id=' + record.id + '">' + record.property_name + '</a>';

	      newCell = newRow.insertCell(2);
	      newCell.innerHTML = record.prefix;

	      newCell = newRow.insertCell(3);
	      newCell.innerHTML = record.address;

	      newCell = newRow.insertCell(4);
	      newCell.innerHTML = record.construction_year.substr(0,10);

	      newCell = newRow.insertCell(5);
	      newCell.innerHTML = record.land_register;

	      newCell = newRow.insertCell(6);
	      newCell.innerHTML = '<button name="edit" class="edit small" onclick="bpDialog.edit(' + record.id + ')">Edit</button><button name="delete" class="delete small" onclick="bpDialog.delete(' + record.id + ')">Delete</button>';
	      newCell.align = 'center';

	      rowCounter++;
		}
	}

</script>

<button id="bpAddButton" class="btn btn-primary" style="margin-bottom: 10px;">Add property</button>


					<?php
					echo '<table id="propertiesTable" class="bp-data-table"><thead><tr><th name="id">ID</th><th name="property_name">Name</th><th name="prefix">Prefix</th><th name="address">Address</th><th class="text-center" name="construction_year">Builded</th><th class="text-center" name="land_register">Land Register</th><th class="text-center" name="actions">Actions</th></tr>';
					
					echo '</thead><tbody></tbody></table>';
				?>
			<script>
			$(document).ready(function(){
				

				$("#bpAddButton").click(function(){
					bpDialog.open();
				});

				$(".bp-data-table").on('click', 'a', function(event){
					event.preventDefault();
					//alert('Link works!');
					document.querySelector("ul.nav-tabs li.active").classList.remove("active");
        			document.querySelector(".tab-pane.active").classList.remove("active");
        
        
        			var clickedTab = event.currentTarget;
        			console.log(clickedTab);
        			var anchor = event.target;
        			var activePaneID = anchor.getAttribute("href");
        
        			console.log(activePaneID);
        
        			clickedTab.classList.add("active");
        			document.querySelector(activePaneID).classList.add("active");
				});

			});
			</script>

		</div>
		<div id="tab-2" class="tab-pane">
			<?php
					echo '<table id="incExpToPropTable" class="bp-data-table"><thead><tr><th name="id">ID</th><th name="incexp_name">Name</th><th name="incexp_type">Type</th><th name="incexp_value">Amount</th><th class="text-center" name="actions">Actions</th></tr>';
					
					echo '</thead><tbody></tbody></table>';
				?>
		</div>
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
	
</div>
