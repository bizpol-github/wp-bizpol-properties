/*global bpDialog, bpDataTable, bpDataTableName, bpFormTitle,
  bpFormDesc, bpUpdateAction, wp_adminFullName, wp_adminId */
/*global $, ajaxurl, alert */
function bpDialog() {
    'use strict';
    var autoOpen = false;
    var bpForm = '';
    var bpNewForm = '';
    var bpFormTitle = '';
    var bpFormDesc = '';
    var bpDialogName = '';
    var bpUpdateAction = '';
    var bpActionTitle = '';
    
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

    this.setID = function (id) {
        this.bpDialogName = id;
    };

    this.setAction = function (action) {
        this.bpUpdateAction = action;
    };

    this.setActionTitle = function (title) {
        this.bpActionTitle = title;
    };

    this.initialized = false;
    this.newDialog = '';
    this.initialize = function () {
        this.newDialog = $('#' + this.bpDialogName).dialog({
            autoOpen: autoOpen,
            width: "50%",
            modal: true,
            show: "blind",
            hide: "blind"
        });
        this.newDialog.on("dialogclose", function () {
            _this.resetBpForm();
        });
        this.copyForm();

        $('#' + this.bpDialogName).on('submit', '#bp-dialog-form-copy', function (evnt) {
            evnt.preventDefault();
            var status = _this.checkStatus();
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
                            bpDataTable.load();
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
        this.bpNewForm.remove();
        this.copyForm();
        //$('#' + this.bpDialogName).append(bpForm);
    };

    this.copyForm = function () {
        this.bpForm = this.newDialog.find('form');
        this.bpForm.clone()
            .attr('id', 'bp-dialog-form-copy')
            .appendTo('#' + this.bpDialogName);
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

            console.log(patern);

            var regex = new RegExp(patern);

            var test = regex.test(text);
            console.log(test);

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
        console.log(this.bpHiddenFields);
    };

    this.close = function () {
        this.newDialog.dialog('close');
    };

    this.inputKeyUp = function () {
        $("#bpDialog").on('keyup paste select', 'input', function () {
            setStatus($(this));
        });

    };

    this.updateForm = function (id, tableId, disabled) {
        var header = $("#" + tableId + ' thead tr th');
        var row = $("#" + tableId + ' tr#row' + id + ' td');
        var cols = {};
        var i = 0;
        var idx = 0;
        var val = '';
        for (i = 0; i < header.length - 1; i += 1) {
            idx = header[i].getAttribute('name');
            val = row[i].textContent;
            cols[idx] = val;
        }

        var inputs = this.bpNewForm.find('input');
        $.each(cols, function (key, value) {
            $.each(inputs, function (ignore, content) {
                if (content.getAttribute('name') === key) {
                    content.value = value;
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
                    console.dir(select.children);
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

    this.edit = function (id, tableName) {
        this.updateForm(id, tableName, false);
        this.addHiddenField('user_id', wp_adminId);
        this.addHiddenField('id', id);
        this.open();
        this.setTitle('Edit', 'Edit ' + this.bpActionTitle + ' #' + id + ' by ' + wp_adminFullName);
    };

    this.delete = function (id, tableName) {
        this.updateForm(id, tableName, true);
        this.bpNewForm.find("input[name='action']").val('delete');
        //bpNewForm.find('table.form-table').remove();

        this.setTitle('Delete', 'Delete ' + this.bpActionTitle + ' #' + id);
        this.bpFormDesc.after('<input type="hidden" name="id" value="' + id + '"/>');
        this.open();
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