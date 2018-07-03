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
    var _this = this;
    var serializeObject = function (form, wp_action_name) {
        var o = {};
        o.wp_action = wp_action_name;
        var a = form.serializeArray();
        $.each(a, function () {
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

    this.updateForm = function (row, disabled) {
        var cols = row;

        var inputs = this.bpNewForm.find('input');
        $.each(cols, function (key, value) {
            $.each(inputs, function (ignore, content) {
                if (content.getAttribute('name') === key) {
                    content.value = value.replace(/<[^>]*>/g, '');
                    if (disabled === true) {
                        content.disabled = true;
                    } else {
                        setStatus($(this));
                    }
                }
            });
        });
        var selects = this.bpNewForm.find('select');
        $.each(cols, function (key, value) {
            $.each(selects, function (ignore, select) {
                if (select.getAttribute('name') === key) {
                    //console.dir(select.children);
                    $.each(select.children, function (ignore, option) {
                        if (option.value === value) {
                            option.selected = true;
                        }
                        if (disabled === true) {
                            select.disabled = true;
                        }
                    });
                }
            });
        });


    };

    this.edit = function (id) {
        var row = this.bpDialogTable.getRowData(id);

        this.updateForm(row, false);
        this.addHiddenField('user_id', wp_adminId);
        this.addHiddenField('id', row.id);
        this.open();
        this.setTitle('Edit', 'Edit ' + this.bpActionTitle + ' #' + row.id + ' by ' + wp_adminFullName);
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