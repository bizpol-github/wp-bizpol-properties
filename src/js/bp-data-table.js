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

    this.bpEmptyRowExtraFields = [];

    this.bpParams = [];
    this.bpTableFilter = [];
    this.funcName = id + 'DT';

    /**
     * set @var initialize only once
     */
    this.initialize = function () {
        //set new dialog
        this.bpDialog = new bpD(this, 'properties');
        this.setHeaderCheckbox();
        this.addFooter();

        //this.bpDataTable = $(this.bpDataTableId);


        this.initialized = true;
    };

    this.setTableId = function (id) {
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

    this.setEmptyRowExtraFields = function (id, value) {
        this.bpEmptyRowExtraFields.push({[id]: value});
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
     * Getting the parameters.
     *
     * @return     {string}  The parameters.
     */
    this.getParam = function (name) {
        var ret = undefined;
        $.each(this.bpParams, function (ignore, param) {
            if (param[name]) {
                ret = param[name];
            }
        });
        return ret;
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
     * Getting the column names from controller.
     *
     * @return     {object}  The table headers.
     */
    this.getColumnNames = function () {
        return this.bpRPCData['columns'];
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
     * Gets the row data.
     *
     * @param      {string}  id      The identifier
     * @return     {object}  The row data.
     */
    this.getAllData = function () {
        return this.bpRPCData;
    };

    this.getFuncName = function () {
        return this.funcName;
    };

    this.setFuncName = function (name) {
        this.funcName = name;
    };

    this.setHeaderCheckbox = function () {
        var bpTable = this.bpDataTable[0];
        var header = bpTable.tHead.rows[0];
        var colNum = bpTable.rows[0].cells.length;
        var checkbox = header.cells.item(colNum-1);
        var cbxChild = checkbox.children.item(0);
        cbxChild.onclick = function () {
            _this.flagCheckboxes(this);
        }
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

    this.addFooter = function () {
        var bpTable = this.bpDataTable[0];
        var colNum = bpTable.rows[0].cells.length;
        var funcName = this.getFuncName();
        var nRow = bpTable.createTFoot().insertRow(0);
        var cell = nRow.insertCell(0);
        cell.innerHTML = 'Legend:<span class="dashicons dashicons-trash delete"></span>Delete<span class="dashicons dashicons-edit edit"></span>Edit<span class="dashicons dashicons-visibility edit"></span>Switch status';
        cell.colSpan = colNum-2;
        cell.classList.add('bp-data-table-legend');
        var cell = nRow.insertCell(1);
        cell.innerHTML = '<button name="edit" class="button-link-edit edit small" onclick="' + funcName + '.editBatch();"><span class="dashicons dashicons-edit"></span></button><button name="delete" class="button-link-delete delete small" onclick="' + funcName + '.deleteBatch();"><span class="dashicons dashicons-trash"></span></button>';
        cell.align = 'center';
        var cell = nRow.insertCell(2);
        cell.innerHTML = '<input type="checkbox" name="batchFlag" onclick="' + funcName + '.flagCheckboxes(this);" />';
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
                if (this.name != 'batchFlag'){
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
        var checkboxes = this.bpDataTable.find("input[name='batch[]']");
        var counter = 0;

        if (element.checked){
            this.bpFlag[element.id] = element.value;
        } else {
            delete this.bpFlag[element.id];
        }

        $.each(this.bpFlag, function () {
            counter += 1;
        });

        var batchFlag = this.bpDataTable.find("input[name='batchFlag']");

        if (checkboxes.length === counter) {
            batchFlag.each(function () {
                this.checked = true;
            });
        } else {
             batchFlag.each(function () {
                if (this.checked) {
                    this.checked = false;
                }
            });
        }


        //console.log(checkboxes.length);
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
                    console.log('RESPOMSE:');
                    console.log(response);

                }
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

    this.addFilter = function (column) {
        this.bpTableFilter.push(column);
    };

    this.createFilter = function () {
        //Check filters
        var filters = this.bpTableFilter;
        var count = filters.length;
        var rowData = this.getAllData();
        var data = {};
        var entries = [];
        if (count > 0) {
            $.each(filters, function (ignore, column) {

                $.each(column, function (key, name) {
                    var select = $('.' + key);
                    var options = {};
                    select.addClass(key);

                    $.each(rowData.entries, function (ignore, entry) {
                        if (!options[entry[key]]) {
                            options[entry[key]] = entry[name];
                        }
                    });

                    const ordered = {};
                    Object.keys(options).sort().forEach(function(k) {
                        ordered[k] = options[k];
                    });

                    $.each(options, function (opt, value) {
                        select.append(
                            $('<option>').val(opt).html(value)
                        );
                    });
                    console.log(ordered);
                    select.on('change', function () {
                        _this.applyFilter(key, this.value);
                    });
                });
            });

            //data.entries = entries;
        }
    };

    this.applyFilter = function (key, value) {
        var rowData = this.getAllData();
        var filtered = {};
        var entries = [];
        $.each(rowData.entries, function (idx, entry) {
            if (entry[key] === value) {
                entries.push(entries[idx]);
            }
        });
        filtered.entries = entries;
        window[_this.bpDataTableFeedName](filtered, _this);
    };
}