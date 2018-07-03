/*global bpDataTable */
/*global $ */
/*global ajaxurl */
/*global bpDataTableId */
/*global feedDataTable */
/*global bpRpcAction */

//class constructor Data Table
//
function bpDt(id) {
    'use strict';
    this.initialized = false;
    this.bpDataTableName = id;
    this.bpDataTableId = id + 'Table';
    this.bpRpcAction = 'bp_rpc_get_all_' + id;
    this.bpDataTable = $('#' + this.bpDataTableId);
    this.bpParams = [];
    this.bpRPCData = {};

    this.initialize = function () {

        this.initialized = true;
    };

    this.setParam = function (name, value) {
        this.bpParams.push({[name]: value});
    };

    this.clearParam = function () {
        this.bpParams = [];
    };

    this.getParams = function () {
        if (this.bpParams.length > 0) {
            var params = {};
            $.each(this.bpParams, function (ignore, param) {
                $.each(param, function (key, value) {
                    params[key] = value;
                });
            });
            return '?' + $.param(params);
        } else {
            return '';
        }
    };

    this.getId = function () {
        return this.bpDataTableId;
    };

    this.getName = function () {
        return this.bpDataTableName;
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
        // var headName = this.getTableHeaders();
        // var rowData = this.bpDataTable[0].tBodies[0].rows[id].cells;
        // var data = {};

        // $.each(headName, function (key, value) {
        //     data[value] = rowData[key].innerHTML;
        // });

        return this.bpRPCData.entries[id];
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
            ajaxurl + _this.getParams(),
            {
                action: _this.bpRpcAction
            },
            function (response) {
                if (response.error === false) {

                    _this.bpRPCData = response;
                    $('#' + _this.bpDataTableId + ' tbody tr').remove();
                    //console.log(_this.getId());
                    window[_this.getId() + 'Feed'](response);
                    

                }
               // console.log(ajaxurl + _this.getParams());
                console.log(_this.bpRPCData);
            }
        );
    };
}