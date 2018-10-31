/*global bpD, bpDataTable, bpDataTableName, bpFormTitle,
  bpFormDesc, bpUpdateAction, wp_adminFullName, wp_adminId */
/*global $, ajaxurl, alert */


/**
 * Dialog content management, includes form submit
 *
 * @param      {object}   table   The table genarated by bpDt class
 * @param      {string}   title   The title presented in header description of dialog
 * @return     {boolean}  return some values with called functions
 */
function bpD(table, title) {
    'use strict';
    //table object with rpc data
    this.bpDialogTable = table;

    this.bpDialogName = table.getName();
    this.bpDialogId = this.bpDialogName + 'Dialog';
    this.bpUpdateAction = 'bp_rpc_update_' + this.bpDialogName;
    this.bpActionTitle = title;

    this.autoOpen = false;
    this.bpForm = {};
    this.bpNewForm = {};
    this.bpFormTitle = '';
    this.bpFormDesc = '';
    this.bpFormTab = {};
    this.bpTabUl = $('<ul class="nav-tabs"></ul>');
    this.bpTabUlDiv = $('<div class="tab-content"></div>');

    this.bpHiddenFields = {};
    this.bpConstantFields = {};
    this.initialized = false;
    this.newDialog = {};

    var _this = this;

    /**
     * Serialize form object
     *
     * @param      {object}  form            The form
     * @param      {string}  wp_action_name  The wp action name
     * @return     {object}  Form formated data
     */
    var serializeObject = function (form, wp_action_name) {
        var o = {};
        o.wp_action = wp_action_name;

        //var pattern = "^[a-z_-]+";
        //// (\[[^[]]+)
        /// ^[a-z_-]+

        var name_regex = "^[a-z_-]+";
        var key_regex = /[\w_\-]+(?=\])/g;
        var id_regex = /[\d]+/g;
        //var key_regex = '/[\\w_-]+(?=\\])/g';

       // console.log(pattern);

        var n_regex = new RegExp(name_regex);
           // console.log(test);

      //  var id_regex = new RegExp('(?<=[)[^]]+(?=])');
        var disabled = form.find(':input:disabled');
        if (disabled.length > 0) {
            disabled.removeAttr('disabled');
        }
        var a = form.serializeArray();
        var name = '';
        var entry = {};
        o.entries = {};
        //console.log(a);
        $.each(a, function () {

            name = this.name;

            var test = n_regex.test(name);

            if (test) {
                //console.log(name);

                //console.log('regex test string: ' + test);

                if (o[this.name]) {

                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }

                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';

                }
            } else {
                //console.log(name);

                var id = name.match(id_regex);
                var key = name.match(key_regex);

                if (o.entries[id] === undefined) {

                    o.entries[id] = {};
                    entry = {};

                }

                o.entries[id] = entry;

                entry[key] = this.value;
            }


        });
        console.log('form:');
        //console.log(form);
        console.log(o);
        return o;
    };

    /**
     * Sets dialog parameters and content, submit event and sets intialize to true
     */
    this.initialize = function () {
        this.newDialog = $('#' + this.bpDialogId);
        this.bpForm = this.newDialog.find('form.bp-dialog-form');
        this.bpForm.remove();

        this.newDialog.dialog({
            autoOpen: _this.autoOpen,
            minWidth: '50%',
            width: '60%',
            modal: true,
            //resizable: false,
            show: {
                effect: 'fadeIn',
                duration: 500
            },
            hide: {
                effect: 'fadeOut',
                duration: 500
            }
        });

        this.newDialog.on("dialogclose", function () {
            _this.resetBpForm();
        });

        //this.copyForm();

        //input checkbox event to set proper value
        this.newDialog.on('change', 'input[type="checkbox"]', function () {
            if (this.value === '1') {
                this.value = 0;
            } else {
                this.value = 1;
            }
        });

        //submit form
        this.newDialog.on('submit', 'form.bp-dialog-form', function (evnt) {
            evnt.preventDefault();
            //alert('seba');
            var status = _this.checkStatus();

            console.log(status);
            if (status) {
                $.post(
                    ajaxurl,
                    {
                        action: _this.bpUpdateAction,
                        type: 'post',
                        data: serializeObject(_this.bpNewForm, _this.bpUpdateAction),
                        dataType: 'json',
                        contentType: 'application/json'
                    },
                    function (response) {
                        if (response.ok === true) {
                            _this.bpDialogTable.load();
                            _this.close();
                        }
                        console.log('Response:');
                        console.log(response);
                    }
                );
            } else {
                alert('form error');
            }
        });
        this.initialized = true;
    };

    /**
     * Removes created form and restores default settings
     */
    this.resetBpForm = function () {
        this.bpHiddenFields = {};
        this.bpNewForm.remove();
        this.bpNewForm = {};
        this.bpTabUl.empty();
        this.bpTabUlDiv.empty();
    };

    /**
     * Creates copy of default form and creates clone to work with
     */
    this.copyForm = function () {
        this.bpNewForm = this.bpForm.clone();
        this.bpNewForm.appendTo(this.newDialog);
        // set title and description of form
        this.bpFormTitle = this.bpNewForm.find('h2');
        this.bpFormDesc = this.bpNewForm.find('h4');
        // set tab pane
        this.bpFormTab = new bpTabPane(this.bpNewForm);
    };

    /**
     * Set @var autoOpen
     *
     * @param      {boolean}  arg     The argument
     */
    this.autoOpen = function (arg) {
        this.autoOpen = arg;
    };

    /**
     * Setting dialog title and description
     *
     * @param      {string}  t       Title
     * @param      {string}  d       Description
     */
    this.setTitle = function (t, d) {
        this.bpFormTitle.html(t);
        this.bpFormDesc.text(d);
    };

    /**
     * Status checking
     *
     * @return     {boolean}  Returns false or true
     */
    this.checkStatus = function () {
        if (this.bpNewForm.find(".status[status='false']").length > 0) {
            return false;
        } else {
            return true;
        }
    };

    /**
     * Set @var load
     */
    this.load = function () {

        if (this.initialized === false) {
            this.initialize();
        }

        this.copyForm();
    };

    /**
    * Set @var open
    */
    this.open = function () {
        this.setHiddenFields();
        this.newDialog.dialog('open');
    };

    /**
     * Set @var close
     */
    this.close = function () {
        this.newDialog.dialog('close');
    };

    this.getNewEmptyRow = function () {

        var headers = this.bpDialogTable.getColumnNames();

        var row = {};

        $.each(headers, function (ignore, column) {
            if (column === 'id') {
                row[column] = 'new';
            } else {
                row[column] = undefined;
            }
        });

        return row;

    };

    this.getFormData = function (id) {
        var headersExtra = this.bpDialogTable.bpEmptyRowExtraFields;
        var row = {};
        if (id === undefined) {
            row = this.getNewEmptyRow();
        } else {
            row = this.bpDialogTable.getRowData(id);
        }

        if (headersExtra.length > 0) {
            $.each(headersExtra, function (ignore, extra) {
                $.each(extra, function (name, value) {
                    row[name] = value;
                });
            });
        }

        return row;
    };

    /**
     * Editing property function
     *
     * @param      {string}  id      The identifier
     */
    this.insertNew = function () {
        this.load();
        var rows = [];
        //var row = this.getNewEmptyRow();
        var row = this.getFormData();
        console.log(row);
        rows.push(row);
        this.bpFormTab.setEmptyRow(row);
        this.bpFormTab.load(rows);
        this.bpFormTab.addPlusTab();
        this.addHiddenField('user_id', wp_adminId);
        this.setAction('insert');
        this.setTitle('Insert', 'New entry by ' + wp_adminFullName);
        this.open();
    };

    /**
     * Editing property function
     *
     * @param      {string}  id      The identifier
     */
    this.edit = function (id) {
        this.load();
        var rows = [];
        var row = this.getFormData(id);
        rows.push(row);
        this.bpFormTab.load(rows);
        this.addHiddenField('user_id', wp_adminId);
        this.setTitle('Edit', 'Edit ' + this.bpActionTitle + ' entry #' + row.id + ' by ' + wp_adminFullName);
        this.open();
    };

    /**
     * Set @var editBatch
     */
    this.editBatch = function () {
        this.load();
        var ids = this.bpDialogTable.getBatch();
        var rows = [];
        var dbIds = [];

        $.each(ids, function (ignore, value) {
            var row = _this.getFormData(value);
            rows.push(row);
            dbIds[value] = row.id;
        });

        this.bpFormTab.load(rows);
        this.addHiddenField('user_id', wp_adminId);
        this.setTitle('Edit Batch', 'Edit ' + this.bpActionTitle + ' entries # (' + Object.values(dbIds) + ') by ' + wp_adminFullName);
        this.open();
    };

    this.delete = function (id) {
        this.load();
        var rows = [];
        var row = this.getFormData(id);
        rows.push(row);
        this.bpFormTab.load(rows, true);
        this.addHiddenField('user_id', wp_adminId);
        this.setAction('delete');
        this.setTitle('Delete', 'Delete ' + this.bpActionTitle + ' #' + row.id);
        this.open();
    };

    /**
     * Set @var deleteBatch
     */
    this.deleteBatch = function () {
        this.load();
        var ids = this.bpDialogTable.getBatch();
        var rows = [];
        var dbIds = [];

        $.each(ids, function (ignore, value) {
            var row = _this.bpDialogTable.getRowData(value);
            rows.push(row);
            dbIds[value] = row.id;
        });
        this.bpFormTab.load(rows, true);
        this.addHiddenField('user_id', wp_adminId);
        this.setAction('delete');
        this.setTitle('Delete Batch', 'Delete ' + this.bpActionTitle + ' # (' + Object.values(dbIds) + ') by ' + wp_adminFullName);
        this.open();
    };

    /**
     * Switches property status
     *
     * @param      {string}  id      The identifier
     */
    this.switchStatus = function (id) {
        this.load();
        var rows = [];
        var row = this.bpDialogTable.getRowData(id);
        rows.push(row);
        this.bpFormTab.load(rows);
        this.addHiddenField('user_id', wp_adminId);
        this.addHiddenField('id', row.id);
        this.addHiddenField('status', row.status);
        this.setAction('status');
        this.setTitle('Status', 'Change status ' + this.bpActionTitle + ' #' + row.id);
        this.open();
    };

    /**
     * Sets the action.
     *
     * @param      {<type>}  action  The action
     */
    this.setAction = function (action) {

        this.bpNewForm.find("input[name='action']").val(action);

    };

    /**
     * Adds a hidden field to dialog.
     *
     * @param      {object}  name    The name
     * @param      {object}  value   The value
     */
    this.addHiddenField = function (name, value) {
        this.bpHiddenFields[name] = value;
    };

    /**
     * Adds a constants to hidden field of dialog.
     *
     * @param      {object}  name    The name
     * @param      {object}  value   The value
     */
    this.addConstantField = function (name, value) {
        this.bpConstantFields[name] = value;
    };

    /**
     * Sets the hidden fields.
     */
    this.setHiddenFields = function () {
        $.each(this.bpHiddenFields, function (name, value) {
            _this.bpFormDesc.after('<input type="hidden" name="' + name + '" value="' + value + '"/>');
        });
        $.each(this.bpConstantFields, function (name, value) {
            _this.bpFormDesc.after('<input type="hidden" name="' + name + '" value="' + value + '"/>');
        });
    };
}