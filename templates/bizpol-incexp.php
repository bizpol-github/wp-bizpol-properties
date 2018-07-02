<div class="wrap">
	<h1>Bizpol Properties - Income/Expense</h1>
	<?php settings_errors(); ?>

	<ul class="nav-tabs">
        <li class="active"><a href="#tab-1">Income/Expense</a></li>
    </ul>

    <div class="tab-content">
    	<div id="tab-1" class="tab-pane active">

<button id="bpAddButton" class="button button-primary" style="margin-bottom: 10px;">Add income/expense</button>


					<?php
					echo '<table id="incexpTable" class="bp-data-table"><thead><tr><th name="id">ID</th><th name="incexp_name">Name</th><th name="incexp_type">Type</th><th class="text-center" name="actions">Actions</th></tr>';
					
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
		<div id="incexpDialog">
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

<script>
	var wp_adminId = '<?php echo wp_get_current_user()->id ?>';
	var wp_adminFullName = '<?php echo wp_get_current_user()->display_name ?>';
	var dialog = '';
	//var bpDialogName = 'bpDialog';

	var bpIncExpDT = new bpDt('incexp');
	var bpDtAddIncExp = new bpDialog(bpIncExpDT, 'incexp');

	$(document).ready(function ($) {
		//bpDialog.autoOpen(true);
		bpDtAddIncExp.load();	
		
	});

	bpIncExpDT.load();

	function incexpTableFeed(data){
		var rowCounter = 0;

	    for ( var r in data.entries ) {
	      var record = data.entries[r];

	      var newRow = bpIncExpDT.addRow(rowCounter);

	      // $('#row' + parseInt(record[0])).mouseover( function() { rowOverEffect(this); }).mouseout( function() { rowOutEffect(this); }).click(function(event) {
	      //   if (event.target.type !== 'checkbox') {
	      //     $(':checkbox', this).trigger('click');
	      //   }
	      // }).css('cursor', 'pointer');
	       
	      bpIncExpDT.addCell(0, newRow, record.id);
	      bpIncExpDT.addCell(1, newRow, record.incexp_name);
	      bpIncExpDT.addCell(2, newRow, record.incexp_type);
	      bpIncExpDT.addCell(3, newRow, '<button name="edit" class="edit small" onclick="bpDtAddIncExp.edit(' + rowCounter + ')">Edit</button><button name="delete" class="delete small" onclick="bpDtAddIncExp.delete(' + rowCounter + ')">Delete</button>', 'center');

	      rowCounter++;
	      

	      // var newCell = newRow.insertCell(0);
	      // newCell.innerHTML = record.id;

	      // newCell = newRow.insertCell(1);
	      // newCell.innerHTML = record.incexp_name;

	      // newCell = newRow.insertCell(2);
	      // newCell.innerHTML = record.incexp_type;

	      // newCell = newRow.insertCell(3);
	      // newCell.innerHTML = '<button name="edit" class="edit small" onclick="bpDialog.edit(' + record.id + ')">Edit</button><button name="delete" class="delete small" onclick="bpDialog.delete(' + record.id + ')">Delete</button>';
	      // newCell.align = 'center';

	      // rowCounter++;
		}
	}

</script>
