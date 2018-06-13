<div class="wrap">
	<h1>Bizpol Properties - Income/Expense</h1>
	<?php settings_errors(); ?>

	<ul class="nav-tabs">
        <li class="active"><a href="#tab-1">Properties</a></li>
    </ul>

    <div class="tab-content">
    	<div id="tab-1" class="tab-pane active">

<script>
	var wp_adminId = '<?php echo wp_get_current_user()->id ?>';
	var wp_adminFullName = '<?php echo wp_get_current_user()->display_name ?>';
	var dialog = '';
	var bpDialogName = 'bpDialog';
	var bpDataTableName = 'incExpTable';
	var bpDataTable = new bpDataTable();
	var bpDialog = new bpDialog();
	var bpRpcAction = 'bp_get_all_incexp_rpc';
	var bpUpdateAction = 'bp_update_incexp_rpc';
	var bpDialogActionTitle = 'event';

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
	      newCell.innerHTML = record.incexp_name;

	      newCell = newRow.insertCell(2);
	      newCell.innerHTML = record.incexp_type;

	      newCell = newRow.insertCell(3);
	      newCell.innerHTML = '<button name="edit" class="edit small" onclick="bpDialog.edit(' + record.id + ')">Edit</button><button name="delete" class="delete small" onclick="bpDialog.delete(' + record.id + ')">Delete</button>';
	      newCell.align = 'center';

	      rowCounter++;
		}
	}

</script>

<button id="bpAddButton" class="btn btn-primary" style="margin-bottom: 10px;">Add income/expense</button>


					<?php
					echo '<table id="incExpTable" class="bp-data-table"><thead><tr><th name="id">ID</th><th name="incexp_name">Name</th><th name="incexp_type">Type</th><th class="text-center" name="actions">Actions</th></tr>';
					
					echo '</thead><tbody></tbody></table>';
				?>
			<script>
			$(document).ready(function(){
				

				$("#bpAddButton").click(function(){
					bpDialog.open();
				});

			});
			</script>

		</div>
		<div id="bpDialog">
				<form id="bp-dialog-form" method="post" action="" autocomplete="on">
		        <?php
		            settings_fields('bp_incexp_settings');
		            do_settings_sections('bizpol_incexp');
		            submit_button();
		        ?>
    		</form>
		</div>
    </div>

</div>
