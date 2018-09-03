/*global bpDataTable */
/*global $ */
/*global ajaxurl */
/*global bpDataTableId */
/*global feedDataTable */
/*global bpRpcActionName */

//class constructor Data Table
//
function bpDt(id, table) {
    'use strict';
    var _this = this;

    this.initialized = false;
    this.bpDataTableName = id;
    this.bpDataTableFeedName =  id + 'TableFeed';
    this.bpDataTableId = '#' + id + 'Table';
    this.bpRpcActionName = 'bp_rpc_get_all_' + id;
    this.bpDataTable = table;
    this.bpRPCData = {};
    this.bpFlag = {};
    this.bpDialog = {};

    this.bpParams = [];

    /**
     * set @var initialize only once
     */
    this.initialize = function () {
        //set new dialog
        this.bpDialog = new bpD(this, 'properties');

        //this.bpDataTable = $(this.bpDataTableId);


        this.initialized = true;
    };

    this.setTableId = function (id) {
        console.log(id);
        this.bpDataTableId =   '#' + id;
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
        var header = this.bpDataTable.find('thead tr th');
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
            _this.insertNew();
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

    this.load = function () {

        if (this.initialized === false) {
            this.initialize();
            this.setAddButtonEvent();
        }

        $.post(
            ajaxurl + _this.getParams(),
            {
                action: _this.bpRpcActionName
            },
            function (response) {
                if (response.error === false) {

                    _this.bpRPCData = response;
                    _this.bpDataTable.find('tbody').empty();
                    window[_this.bpDataTableFeedName](response, _this);

                }
                console.log('RPC Data');
                console.log(response);
                console.log(_this.bpDataTable);
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

            var removeButton = $('<span class="dashicons dashicons-no-alt"></span>');

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
            tableId = tableId + '-' + row;
            console.log(tableId);
            table.attr('id', tableId);

            var dialog = newCont.find('.bp-data-dialog');
            var dialogId = dialog.attr('id');

            var bpNewDT = new bpDt('incexp2prop');
            bpNewDT.clearParam();
            bpNewDT.setParam('property_id', rowData.id);
            bpNewDT.setTableId(tableId);
            bpNewDT.load();

            //var incexp2propD = new bpDialog(bpNewDT, 'income/expense');
            bpNewDT.bpDialog.addConstantField('property_id', rowData.id);

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

    this.insertNew = function () {

        this.bpDialog.insertNew();
        //
    };

    /**
     * Edit function
     *
     * @param      {object}  row     The row
     */
    this.edit = function (row) {

        this.bpDialog.edit(row);
        //
    };

    this.editBatch = function () {

        this.bpDialog.editBatch();
        //
    };

    this.delete = function (row) {

        this.bpDialog.delete(row);
        //
    };

    this.deleteBatch = function () {

        this.bpDialog.deleteBatch();
        //
    };

    this.switchStatus = function (row) {

        this.bpDialog.switchStatus(row);
        //
    };

    this.addDialogHiddenFields = function (name, value) {

        this.bpDialog.addConstantField(name, value);
    };
}