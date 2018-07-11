<div class="wrap">
	<h1>Bizpol Properties - Income/Expense</h1>
	<?php settings_errors(); ?>

	<ul class="nav-tabs">
        <li class="active"><a href="#tab-1">Income/Expense</a></li>
    </ul>

    <div class="tab-content">
    	<div id="tab-1" class="tab-pane active">

<button id="bpAddButton" class="button button-primary" style="margin-bottom: 10px;">Add income/expense</button>

<table id="propertiesTable" class="bp-data-table">
    			<thead>
	    			<tr>
	    				<th name="id">ID</th><th name="incexp_name">Name</th>
	    				<th class="text-center" name="incexp_type">Type</th>
	    				<th class="text-center" name="actions">Status</th>
	    				<th class="text-center" name="actions">Actions</th>
	    				<th align="center" width="20"><input type="checkbox" name="batchFlag" id="batchFlag" onclick="incexpDT.flagCheckboxes(this);" /></th>
    </tr>
	    			</tr>
	    		</thead>
	    		<tbody>		
	    		</tbody>
	    		<tfoot>
	    			<tr>
	    				<td colspan="7" class="bp-data-table-legend">Legend:<span class="dashicons dashicons-trash delete"></span>Delete<span class="dashicons dashicons-edit edit"></span>Edit<span class="dashicons dashicons-visibility edit"></span>Switch status</td>
	    				<td align="center"><button name="edit" class="button-link-edit edit small" onclick="incexpD.editBatch()"><span class="dashicons dashicons-edit"></span></button><button name="delete" class="button-link-delete delete small" onclick="incexpD.deleteBatch()"><span class="dashicons dashicons-trash"></span></button></td>
	    				<td align="center" width="20"><input type="checkbox" name="batchFlag" id="batchFlag" onclick="inexpDT.flagCheckboxes(this);" /></td>
    </tr>   					
	    			</tr>
	    		</tfoot>
	    	</table>

<!-- 
					<?php
					echo '<table id="incexpTable" class="bp-data-table"><thead><tr><th name="id">ID</th><th name="incexp_name">Name</th><th name="incexp_type">Type</th><th class="text-center" name="actions">Actions</th></tr>';
					
					echo '</thead><tbody></tbody></table>';
				?> -->
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

	var incexpDT = new bpDt('incexp');
	var incexpD = new bpDialog(incexpDT, 'incexp');

	$(document).ready(function ($) {
		//bpDialog.autoOpen(true);
		incexpD.load();	
		
	});

	incexpDT.load();

	function incexpTableFeed(data){
		var rowCounter = 0;

	    for ( var r in data.entries ) {
	      var record = data.entries[r];
	      var status = '';

	      if (record.status === '1') {
	      	status = '<span class="dashicons dashicons-visibility" onclick="incexpD.switchStatus(' + rowCounter + ')"></span>';
	      } else {
	      	status = '<span class="dashicons dashicons-hidden" onclick="incexpD.switchStatus(' + rowCounter + ')"></span>';
	      }

	      var newRow = incexpDT.addRow(rowCounter);

	      // $('#row' + parseInt(record[0])).mouseover( function() { rowOverEffect(this); }).mouseout( function() { rowOutEffect(this); }).click(function(event) {
	      //   if (event.target.type !== 'checkbox') {
	      //     $(':checkbox', this).trigger('click');
	      //   }
	      // }).css('cursor', 'pointer');
	       
	      incexpDT.addCell(0, newRow, (rowCounter + 1) + ' - (#' + record.id + ')');
	      incexpDT.addCell(1, newRow, record.incexp_name);
	      incexpDT.addCell(2, newRow, record.incexp_type);
	      incexpDT.addCell(3, newRow, status, 'center');
	      incexpDT.addCell(4, newRow, '<button name="edit" class="edit small" onclick="bpDtAddIncExp.edit(' + rowCounter + ')">Edit</button><button name="delete" class="delete small" onclick="bpDtAddIncExp.delete(' + rowCounter + ')">Delete</button>', 'center');
	      incexpDT.addCell(5, newRow, '<input type="checkbox" name="batch[]" value="' + parseInt(rowCounter) + '" id="batch' + parseInt(rowCounter) + '" onclick="incexpDT.flagCheckbox(this);"/>', 'center');

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
