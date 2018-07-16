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
    var _this = this;

    this.initialized = false;
    this.bpDataTableName = id;
    this.bpDataTableId = id + 'Table';
    this.bpRpcAction = 'bp_rpc_get_all_' + id;
    this.bpDataTable = {};
    this.bpParams = [];
    this.bpRPCData = {};
    this.bpFlag = {};
    this.bpD ={};

    /**
     * set @var initialize only once
     */
    this.initialize = function () {
        //set new dialog
        this.bpD = new bpDialog(this, 'properties');
        this.initialized = true;
    };

    /**
     * Sets the parameter.
     *
     * @param      {object}  name    The name
     * @param      {object}  value   The value
     */
    this.setParam = function (name, value) {
        this.bpParams.push({[name]: value});
    };

    /**
     * Set @var clearParam
     */
    this.clearParam = function () {
        this.bpParams = [];
    };

    /**
     * Getting the parameters.
     *
     * @return     {string}  The parameters.
     */
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

    /**
     * Getting the identifier.
     *
     * @return     {string}  The identifier.
     */
    this.getId = function () {
        return this.bpDataTableId;
    };

    /**
     * Getting the name.
     *
     * @return     {string}  The name.
     */
    this.getName = function () {
        return this.bpDataTableName;
    };

    /**
     * Getting the table.
     *
     * @return     {object}  The table.
     */
    this.getTable = function () {
        return this.bpDataTable;
    };

    /**
     * Getting the table headers.
     *
     * @return     {object}  The table headers.
     */
    this.getTableHeaders = function () {
        var header = $("#" + this.bpDataTableId + ' thead tr th');
        var cols = {};
        var idx = 0;
        var name = '';
        $.each(header, function (ignore, value) {
            name = value.getAttribute('name');
            if (name !== 'actions' && name !== 'batchFlag') {
                cols[idx] = name;
            }
            idx++;
        });
        //console.log(cols);
        //console.log("#" + this.bpDataTableId)
        return cols;
    };

    /**
     * Gets the batch.
     *
     * @return     {object}  The batch.
     */
    this.getBatch = function () {
        return this.bpFlag;
    };

    /**
     * Gets the row data.
     *
     * @param      {string}  id      The identifier
     * @return     {object}  The row data.
     */
    this.getRowData = function (id) {
        return this.bpRPCData.entries[id];
    };

    /**
     * Adds a row.
     *
     * @param      {string}  id      The identifier
     * @return     {<type>}  { description_of_the_return_value }
     */
    this.addRow = function (id) {
        var nRow = this.bpDataTable[0].tBodies[0].insertRow(id);
        nRow.id = 'row' + parseInt(id);
        return nRow;
    };

    /**
     * Adds a cell.
     *
     * @param      {object}  id      The identifier
     * @param      {object}  row     The row
     * @param      {object}  data    The data
     * @param      {<type>}  align   The align
     */
    this.addCell = function (id, row, data, align) {
        var nCell = row.insertCell(id);
        nCell.innerHTML = data;
        if (align !== undefined) {
            nCell.align = align;
        }
        //return nCell;
    };

    /**
     * Set @var setAddButtonEvent
     */
    this.setAddButtonEvent = function () {

        var button = this.bpDataTable.prev();

        button.click(function(){
                    _this.bpD.insert();
                });
    };

    this.flagCheckboxes = function (element) {

        var checkboxes = this.bpDataTable.find("input[name='batch[]'], input[name='batchFlag']");

        checkboxes.each(function () {
            if (this != element){
                this.checked = !this.checked;
                if (this.id != 'batchFlag'){
                    if (this.checked){
                        _this.bpFlag[this.id] = this.value;
                    } else {
                        delete _this.bpFlag[this.id];
                    }
                }
            }
        });
    };

    this.flagCheckbox = function (element) {
        if (element.checked){
            this.bpFlag[element.id] = element.value;
        } else {
            delete this.bpFlag[element.id];
        }
        //console.log(this.bpFlag);
    };

    this.load = function (tableId) {
        if (this.initialized === false) {
            this.initialize();
        }

        if (tableId === undefined) {
            tableId = this.bpDataTableId;
        }
        //set table
        this.bpDataTable = $('#' + tableId);

        this.setAddButtonEvent();

        console.log('Table id: ' + tableId);

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
                    window[_this.getId() + 'Feed'](response, _this);
                }
               // console.log(ajaxurl + _this.getParams());
                console.log(_this.bpRPCData);
            }
        );
    };

    /**
     * Adds a new tab.
     *
     * @param      {string}  row     The row
     * @param      {string}  name    The name
     */
    this.addNewTab = function (row, name) {

        var rowData = this.getRowData(row);

        var tabDiv = $('.' + this.bpDataTableName + 'Tabs');
        var tabs = tabDiv.find('.nav-tabs');
        var contents = tabDiv.find('.tab-content');

        if (tabs.find('#single-tab-' + row).length === 0) {

            var newTab = tabs.find('#single-tab').clone();
            newTab.attr('id', 'single-tab-' + row);
            var aTab = newTab.find('a');
            aTab.prop('href', '#single-' + row).text(rowData[name] + ' #' + rowData.id);

            var newCont = contents.find('#single').clone();
            newCont.attr('id', 'single-' + row);

            var title = newCont.find('.tab-pane-title');

            title.text(Object.values(rowData));

            tabs.append(newTab);
            contents.append(newCont);

            var removeButton = $('<span class="ui-button-icon-primary ui-icon ui-icon-closethick" style="position: absolute; top:3px; right: 5px;"></span>');

            removeButton.click(function (evnt) {
                evnt.preventDefault();

                var isActive = newTab.hasClass('active');

                newTab.remove();
                newCont.remove();

                if (isActive) {
                    tabs.children().last().addClass('active');
                    contents.children().last().addClass('active');
                }
            });

            removeButton.insertAfter(aTab);

            var table = newCont.find('.bp-data-table');
            var tableId = table.attr('id');
            table.attr('id', tableId + '-' + row);

            var dialog = newCont.find('.bp-data-dialog');
            var dialogId = dialog.attr('id');

            var bpNewDT = new bpDt('incexp2prop');
            var incexp2propD = new bpDialog(bpNewDT, 'income/expense');

            incexp2propD.load();

            bpNewDT.clearParam();
            bpNewDT.setParam('property_id', rowData.id);

            bpNewDT.load(tableId + '-' + row);

            console.log(dialogId);

        }

        //active class settings
        tabs.children().removeClass('active');
        contents.children().removeClass('active');
        tabs.find('#single-tab-' + row).addClass('active');
        contents.find('#single-' + row).addClass('active');

        // var bpNewDT = new bpDt('incexp2prop');
        // var incexp2propD = new bpDialog(bpNewDT, 'income/expense');



    };

    this.removeTab = function (tab) {

        //
        //
    };

    /**
     * Edit function
     *
     * @param      {object}  row     The row
     */
    this.edit = function (row) {

        this.bpD.edit(row);
        //
    };

    this.editBatch = function () {

        this.bpD.editBatch();
        //
    };

    this.delete = function (row) {

        this.bpD.delete(row);
        //
    };

    this.deleteBatch = function () {

        this.bpD.deleteBatch();
        //
    };
}