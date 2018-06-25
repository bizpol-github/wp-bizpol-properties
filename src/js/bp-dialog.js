/*global bpDialog, bpDataTable, bpDataTableName, bpFormTitle,
  bpFormDesc, bpUpdateAction, bpDialogActionTitle, wp_adminFullName, wp_adminId */
/*global $, ajaxurl, alert */
function bpDialog() {
    'use strict';
    var autoOpen = false;
    var bpForm = '';
    var bpNewForm = '';
    var bpFormTitle = '';
    var bpFormDesc = '';
    var bpDialogName = '';
    var _this = this;


    var resetForm = function () {
        bpNewForm.remove();
        _this.copyForm();
        //$('#' + this.bpDialogName).append(bpForm);
    };
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

    this.setID = function (id) {
        this.bpDialogName = id;
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
            resetForm();
        });
        this.copyForm();

        $('#' + this.bpDialogName).on('submit', '#bp-dialog-form-copy', function (evnt) {
            evnt.preventDefault();
            var status = _this.checkStatus();
            if (status) {
                $.post(
                    ajaxurl,
                    {
                        action: bpUpdateAction,
                        type: 'post',
                        data: serializeObject(bpNewForm, bpUpdateAction),
                        dataType: 'json',
                        contentType: 'application/json'
                    },
                    function (response) {
                        if (response.status === true) {
                            bpDataTable.load();
                            _this.close();
                            resetForm();
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
    this.copyForm = function () {
        bpForm = $('#bp-dialog-form');
        bpForm.clone()
            .attr('id', 'bp-dialog-form-copy')
            .appendTo('#' + this.bpDialogName);
        bpNewForm = $('#bp-dialog-form-copy');
        bpNewForm.show();
        bpForm.hide();
    };
    this.autoOpen = function (arg) {
        autoOpen = arg;
    };
    this.setTitle = function (t, d) {
        bpFormTitle = bpNewForm.find('h2');
        bpFormDesc = bpNewForm.find('h4');
        bpFormTitle.html(t);
        bpFormDesc.html(d);
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
        if (bpNewForm.find(".status[status='false']").length > 0) {
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
        this.newDialog.dialog('open');
        this.inputKeyUp();
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

        var inputs = bpNewForm.find('input');
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
        var selects = bpNewForm.find('select');
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
        this.setTitle('Edit', 'Edit ' + bpDialogActionTitle + ' #' + id + ' by ' + wp_adminFullName);
        bpFormDesc.after('<input type="hidden" name="user_id" value="' + wp_adminId + '"/>');
        bpFormDesc.after('<input type="hidden" name="id" value="' + id + '"/>');
        this.open();
    };
    this.delete = function (id, tableName) {
        this.updateForm(id, tableName, true);
        bpNewForm.find("input[name='action']").val('delete');
        //bpNewForm.find('table.form-table').remove();

        this.setTitle('Delete', 'Delete ' + bpDialogActionTitle + ' #' + id);
        bpFormDesc.after('<input type="hidden" name="id" value="' + id + '"/>');
        this.open();
    };
}