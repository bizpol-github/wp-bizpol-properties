/*global bpDataTable */
/*global $ */
/*global ajaxurl */
/*global bpDataTableId */
/*global feedDataTable */
/*global bpRpcAction */

//class constructor Data Table
//
function bpDt(id, action) {
    'use strict';
    this.initialized = false;
    this.bpDataTableId = id;
    this.bpRpcAction = action;
    this.bpDataTable = $('#' + id);

    this.initialize = function () {

        this.initialized = true;
    };

    this.getId = function () {
        return this.bpDataTableId;
    };

    this.getTable = function () {
        return this.bpDataTable;
    };

    this.getTableHeaders = function () {
        var header = $("#" + this.bpDataTableId + ' thead tr th');
        var cols = {};
        var idx = 0;
        var name = '';
        $.each(header, function (ignore, value) {
            name = value.getAttribute('name');
            if (name !== 'actions') {
                cols[idx] = name;
            }
            idx++;
        });
        //console.log(cols);
        //console.log("#" + this.bpDataTableId)
        return cols;
    };

    this.getRowData = function (id) {
        var headName = this.getTableHeaders();
        var rowData = this.bpDataTable[0].tBodies[0].rows[id].cells;
        var data = {};

        $.each(headName, function (key, value) {
            data[value] = rowData[key].innerHTML;
        });

        return data;
    };

    this.addRow = function (id) {
        var nRow = this.bpDataTable[0].tBodies[0].insertRow(id);
        nRow.id = 'row' + parseInt(id);
        return nRow;
    };

    this.addCell = function (id, row, data, align) {
        var nCell = row.insertCell(id);
        nCell.innerHTML = data;
        if (align !== undefined) {
            nCell.align = align;
        }
        //return nCell;
    };

    this.load = function () {
        var _this = this;
        if (this.initialized === false) {
            this.initialize();
        }


  //$('#batchTotalPages').html(batchIconProgress + batchIconProgressText);
        $.post(
            ajaxurl,
            {
                action: _this.bpRpcAction
            },
            function (response) {
                if (response.error === false) {
                    $('#' + _this.bpDataTableId + ' tbody tr').remove();
                    Object.call(_this.getId + 'Feed', response, _this.getId());
                }
                //console.log(response);
            }
        );
    };
}