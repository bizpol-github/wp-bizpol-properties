/*global bpDialog, bpDataTable, bpDataTableName, bpFormTitle,
  bpFormDesc, bpUpdateAction, wp_adminFullName, wp_adminId */
/*global $, ajaxurl, alert */
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
    var serializeObject = function (form, wp_action_name) {
        var o = {};
        o.wp_action = wp_action_name;

        //var pattern = "^[a-z_-]+";
        //// (\[[^[]]+)
        /// ^[a-z_-]+

        var pattern = "(\[[^[]]+)";

        console.log(pattern);

         var regex = new RegExp(patern);

            var test = regex.test(text);

      //  var id_regex = new RegExp('(?<=[)[^]]+(?=])');
        var a = form.serializeArray();

        //console.log(a);
        $.each(a, function () {

            var name = this.name;
            console.log(name);

            console.log('regex: ' + test);

            var aaa = name.match(key_regex);

            console.log('match: ' + aaa);




            if (o[this.name]) {

                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }

                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';

            }
        });
        return o;
    };

    this.bpHiddenFields = {};

    this.initialized = false;
    this.newDialog = '';
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
                alert('error');
            }
        });
        this.initialized = true;
    };

    this.resetBpForm = function () {
        this.bpHiddenFields = {};
        this.bpNewForm.remove();
        this.copyForm();
        //$('#' + this.bpDialogId).append(bpForm);
    };

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

    this.autoOpen = function (arg) {
        this.autoOpen = arg;
    };

    this.setTitle = function (t, d) {
        this.bpFormTitle.html(t);
        this.bpFormDesc.html(d);
    };

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

    this.checkStatus = function () {
        if (_this.bpNewForm.find(".status[status='false']").length > 0) {
            return false;
        } else {
            return true;
        }
    };

    this.load = function () {
        if (this.initialized === false) {
            this.initialize();
        }
    };

    this.open = function () {
        this.bpFormDesc.text(this.bpActionTitle);
        this.setHiddenFields();
        this.newDialog.dialog('open');
        this.inputKeyUp();
        //console.log(this.bpHiddenFields);
    };

    this.close = function () {
        this.resetBpForm();
        this.newDialog.dialog('close');
    };

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
                input.val(value);

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
        this.addHiddenField('batch', 'true');
        this.open();
        this.setTitle('Edit Batch', 'Edit ' + this.bpActionTitle + ' # (' + Object.values(dbIds) + ') by ' + wp_adminFullName);
    };

    this.delete = function (id) {
        var row = this.bpDialogTable.getRowData(id);
        this.updateForm(row, true);
        this.addHiddenField('user_id', wp_adminId);
        this.addHiddenField('id', row.id);
        this.bpNewForm.find("input[name='action']").val('delete');
        this.open();
        this.setTitle('Delete', 'Delete ' + this.bpActionTitle + ' #' + row.id);
    };

    this.switchStatus = function (id) {
        var row = this.bpDialogTable.getRowData(id);
        this.updateForm(row, true);
        this.addHiddenField('user_id', wp_adminId);
        this.addHiddenField('id', row.id);
        this.addHiddenField('status', row.status);
        this.bpNewForm.find("input[name='action']").val('status');
        this.open();
        this.setTitle('Status', 'Change status ' + this.bpActionTitle + ' #' + row.id);


    };

    this.addHiddenField = function (name, value) {
        this.bpHiddenFields[name] = value;
    };

    this.setHiddenFields = function () {
        $.each(this.bpHiddenFields, function (name, value) {
            _this.bpFormDesc.after('<input type="hidden" name="' + name + '" value="' + value + '"/>');
        });
    };
}