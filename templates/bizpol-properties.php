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

<script>
	var wp_adminId = '<?php echo wp_get_current_user()->id ?>';
	var wp_adminFullName = '<?php echo wp_get_current_user()->display_name ?>';
	var dialog = '';
	var bpDataTableName = 'propertiesTable';
	var bpDataTable = new bpDataTable();
	var bpDialog = new bpDialog();
	bpDialog.setID('bpDialog');
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
	      newCell.innerHTML = '<a href="admin.php?page=bizpol_property&tab=single&id=' + record.id + '">' + record.property_name + '</a>';

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
					bpDialog.open();
				});

				$(".bp-data-table").on('click', 'a', function(event){
					event.preventDefault();
					//alert('Link works!');
					document.querySelector("ul.nav-tabs li.active").classList.remove("active");
        			document.querySelector(".tab-pane.active").classList.remove("active");

        			var anchor = event.target;
        			var href = anchor.getAttribute("href");
        			var tab = GetURLParameter(href, 'tab');
        			var prop_id = GetURLParameter(href, 'id');
        			var bpPropertiesDataTableName = 'propertiesTable';
        			var bpIncExpDataTableName = 'incExpTable';
					//var bpDataTable = new bpDataTable();
        			console.log(bpIncExpDataTableName);
        
        			$('#' + tab).addClass("active");
        			$('#' + tab + '-tab').addClass("active");
        			$('.prop_inc_title').append('<h2>Nieruchomość #' + prop_id + '</h2>');
				});

			});
			</script>

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
			<div class="prop_inc_title"></div>
			<h4></h4>
			<button id="bpAddButton" class="btn btn-primary" style="margin-bottom: 10px;">Add new</button>
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
