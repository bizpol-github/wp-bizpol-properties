/*global bpDialog, bpDataTable, bpDataTableName, bpFormTitle,
  bpFormDesc, bpUpdateAction, wp_adminFullName, wp_adminId */
/*global $, ajaxurl, alert */


/**
 * Dialog content management, includes form submit
 *
 * @param      {object}   table   The table genarated by bpDt class
 * @param      {string}   title   The title presented in header description of dialog   
 * @return     {boolean}  return some values with called functions
 */
function bpDialog(table, title) {
    'use strict';
    //table object with rpc data
    this.bpDialogTable = table;

    this.bpDialogName = table.getName();
    this.bpDialogId = this.bpDialogName + 'Dialog';
    this.bpUpdateAction = 'bp_rpc_update_' + this.bpDialogName;
    this.bpActionTitle = title;

    var autoOpen = false;
    var bpForm = '';
    var bpNewForm = '';
    var bpFormTitle = '';
    var bpFormDesc = '';
    var bpFormTable = '';

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
        var a = form.serializeArray();
        var name = '';
        var next = false;

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
        console.log(o);
        return o;
    };

    this.bpHiddenFields = {};

    this.initialized = false;
    this.newDialog = '';

    /**
     * Sets dialog parameters and content, submit event and sets intialize to true
     */
    this.initialize = function () {
        console.log(this.bpDialogId);
        this.newDialog = $('#' + this.bpDialogId).dialog({
            autoOpen: autoOpen,
            width: '50%',
            modal: true,
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
        this.copyForm();

        //add new item button from bp-data-table.js
        this.bpDialogTable.setAddButtonEvent(this);

        //input checkbox event to set proper value
        $('#' + this.bpDialogId).on('change', 'input[type="checkbox"]', function () {
            if (this.value === '1') {
                this.value = 0;
            } else {
                this.value = 1;
            }
        });

        //submit form
        $('#' + this.bpDialogId).on('submit', '#bp-dialog-form-copy', function (evnt) {
            evnt.preventDefault();
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
                        if (response.status === true) {
                            _this.bpDialogTable.load();
                            _this.close();
                            _this.resetBpForm();
                        }
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
        this.copyForm();
        //$('#' + this.bpDialogId).append(bpForm);
    };

    /**
     * Creates copy of default form and creates clone to work with
     */
    this.copyForm = function () {
        this.bpForm = this.newDialog.find('form');
        this.bpForm.clone()
            .attr('id', 'bp-dialog-form-copy')
            .appendTo('#' + this.bpDialogId);
        this.bpNewForm = this.newDialog.find('#bp-dialog-form-copy');
        this.bpNewForm.show();
        this.bpForm.hide();
        // set title and description of form
        this.bpFormTitle = this.bpNewForm.find('h2');
        this.bpFormDesc = this.bpNewForm.find('h4');
        // set table form
        this.bpFormTable = this.bpNewForm.find('table.form-table');
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
        this.bpFormDesc.html(d);
    };


    /**
     * Sets the status.
     *
     * @param      {object}  input   The input
     */
    var setStatus = function (input) {
        var min = input.attr('min');
        var type = input.attr('type');
        var status = input.next();
        var text = input.val();

        if (type === 'text') {
            var patern = input.attr('patern');

            if (patern === undefined) {
                patern = '([A-Za-z0-9-])\\w{' + (min - 1) + ',}';
            }

            //console.log(patern);

            var regex = new RegExp(patern);

            var test = regex.test(text);
            //console.log(test);

            if (test) {
                status.removeClass('dashicons-no').addClass('dashicons-yes').css('color', 'green');
                status.attr('status', true);
            } else {
                status.removeClass('dashicons-yes').addClass('dashicons-no').css('color', 'red');
                status.attr('status', false);
            }
        }
    };

    /**
     * Status checking
     *
     * @return     {boolean}  Returns false or true
     */
    this.checkStatus = function () {
        if (_this.bpNewForm.find(".status[status='false']").length > 0) {
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
    };

    /**
     * Set @var inputKeyUp
     */
    this.inputKeyUp = function () {
        this.bpNewForm.on('keyup paste select', 'input', function () {
            setStatus($(this));
        });

    };

    this.updateForm = function (data, disabled) {
        var rows = data;

        var ul = $('<ul class="nav-tabs"></ul>').insertAfter(this.bpFormDesc);
        var div = $('<div class="tab-content"></div>').insertAfter(ul);
        var active = true;

        var bpFormTableCopy = this.bpFormTable;
        this.bpFormTable.remove();

        $.each(rows, function (ignore, row) {
            var id = 'item-' + row.id;

            ul.append(function () {
                var li = $('<li></li>');

                if (active === true) {
                    li.addClass('active');
                }

                $('<a>').attr('href', '#' + id).text('#' + row.id).appendTo(li);
                $(this).append(li);
            });

            div.append(function () {
                var tab = $('<div id="' + id + '" class="tab-pane"></div>');
                var formTable = bpFormTableCopy.clone();

                if (active === true) {
                    tab.addClass('active');
                }

                _this.updateFormTable(formTable, row, disabled);

                formTable.appendTo(tab);

                $(this).append(tab);

            });

            active = false;
        });
    };

    this.updateFormTable = function (table, row, disabled) {
        var input = {};
        var select = {};
        var name = '';
        $.each(row, function (key, value) {

            name = row.id + '[' + key + ']';
            input = table.find('input[name="' + key + '"]');

            if (input.length > 0) {

                input.attr('name', name);

                if (input.attr('type') === 'checkbox') {

                    if (value === '1') {
                        console.log('value 1: ' + value);

                        input.prop('checked', 'checked');
                        input.val(value);

                    } else {
                        console.log('value 0: ' + value);
                        input.val(value);
                    }
                } else {

                    input.val(value);

                }

                if (disabled === true) {
                    input.prop('disabled', true);
                } else {
                    setStatus(input);
                }
            }

            select = table.find('select[name="' + key + '"]');

            if (select.length > 0) {

                select.attr('name', name);

                $.each(select.children(), function (ignore, option) {
                    if (option.value === value) {
                        option.selected = true;
                    }
                    if (disabled === true) {
                        select.disabled = true;
                    }
                });
            }
        });
    };

    /**
    * Set @var open
    */
    this.open = function () {
        this.bpFormDesc.text(this.bpActionTitle);
        this.setHiddenFields();
        this.newDialog.dialog('open');
        this.inputKeyUp();
        //console.log(this.bpHiddenFields);
    };

    /**
     * Set @var close
     */
    this.close = function () {
        this.resetBpForm();
        this.newDialog.dialog('close');
    };

    /**
     * Editing property function
     *
     * @param      {string}  id      The identifier
     */
    this.edit = function (id) {

        var rows = [];
        var row = this.bpDialogTable.getRowData(id);
        rows.push(row);

        this.updateForm(rows, false);
        this.addHiddenField('user_id', wp_adminId);
        this.addHiddenField('id', row.id);
        this.open();
        this.setTitle('Edit', 'Edit ' + this.bpActionTitle + ' #' + row.id + ' by ' + wp_adminFullName);
    };

    /**
     * Set @var editBatch
     */
    this.editBatch = function () {
        var ids = this.bpDialogTable.getBatch();
        var rows = [];
        var dbIds = [];

        $.each(ids, function (ignore, value) {
            var row = _this.bpDialogTable.getRowData(value);
            rows.push(row);
            dbIds[value] = row.id;
        });

        this.updateForm(rows, false);
        this.addHiddenField('user_id', wp_adminId);
        this.open();
        this.setTitle('Edit Batch', 'Edit ' + this.bpActionTitle + ' # (' + Object.values(dbIds) + ') by ' + wp_adminFullName);
    };

    this.delete = function (id) {
        var rows = [];
        var row = this.bpDialogTable.getRowData(id);
        rows.push(row);
        this.updateForm(rows, true);
        this.addHiddenField('user_id', wp_adminId);
        this.addHiddenField('id', row.id);
        this.setAction('delete');
        this.open();
        this.setTitle('Delete', 'Delete ' + this.bpActionTitle + ' #' + row.id);
    };

    this.deleteBatch = function () {
        var ids = this.bpDialogTable.getBatch();
        var rows = [];
        var dbIds = [];

        $.each(ids, function (ignore, value) {
            var row = _this.bpDialogTable.getRowData(value);
            rows.push(row);
            dbIds[value] = row.id;
        });
        this.updateForm(rows, true);
        this.addHiddenField('user_id', wp_adminId);
        this.setAction('delete');
        this.open();
        this.setTitle('Delete Batch', 'Delete ' + this.bpActionTitle + ' # (' + Object.values(dbIds) + ') by ' + wp_adminFullName);
    };

    /**
     * Switches property status
     *
     * @param      {string}  id      The identifier
     */
    this.switchStatus = function (id) {
        var rows = [];
        var row = this.bpDialogTable.getRowData(id);
        rows.push(row);
        this.updateForm(rows, true);
        this.addHiddenField('user_id', wp_adminId);
        this.addHiddenField('id', row.id);
        this.addHiddenField('status', row.status);
        this.setAction('status');
        this.open();
        this.setTitle('Status', 'Change status ' + this.bpActionTitle + ' #' + row.id);


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
     * Sets the hidden fields.
     */
    this.setHiddenFields = function () {
        $.each(this.bpHiddenFields, function (name, value) {
            _this.bpFormDesc.after('<input type="hidden" name="' + name + '" value="' + value + '"/>');
        });
    };
}