/*global bpDialog, bpDialogName, bpDataTable, bpDataTableName */
/*global $, ajaxurl, alert */
function bpDialog() {
    'use strict';
    var initialized = false;
    var autoOpen = false;
    var newDialog = '';
    var orgForm = '';
    var newForm = '';
    var oldForm = $('#bp-dialog-form');
    var title = '';
    var desc = '';

    return {
        initialize: function () {
            newDialog = $('#' + bpDialogName).dialog({
                autoOpen: autoOpen,
                width: "50%",
                modal: true,
                show: "blind",
                hide: "blind"
            });
            newDialog.on("dialogclose", function () {
                bpDialog.resetHiddenId();
            });
            orgForm = $('#bp-dialog-form');
            newForm = orgForm;
            newForm.attr('id', 'bp-dialog-form-new');
            //orgForm.remove();

            $('#' + bpDialogName).append(oldForm);
            $('#' + bpDialogName).append(newForm);

            newForm.submit(function (evnt) {
                evnt.preventDefault();
                $.post(
                    ajaxurl,
                    {
                        action: 'bp_dialog_rpc',
                        type: 'post',
                        data: bpDialog.serializeObject(newForm, 'bp_dialog_rpc'),
                        dataType: 'json',
                        contentType: 'application/json'
                    },
                    function (response) {
                        if (response.status === true) {
                            bpDataTable.load();
                            alert('loaded');
                            bpDialog.resetHiddenId();
                            bpDialog.close();
                        }
                //console.log(response);
                    }
                );
            });
            title = newForm.find('h2');
            desc = newForm.find('h4');
            initialized = true;
        },
        resetHiddenId: function () {
            newForm.find("input[name='id']").remove();
        },
        autoOpen: function (arg) {
            autoOpen = arg;
        },
        setTitle: function (t, d) {
            title.html(t);
            desc.html(d);
        },
        serializeObject: function (form, wp_action_name) {
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
        },
        reset: function () {
            newForm.remove();
            $('#' + bpDialogName).append(orgForm);
        },
        load: function () {
            if (initialized === false) {
                this.initialize();
            }
        },
        open: function () {
            newDialog.dialog('open');
        },
        close: function () {
            newDialog.dialog('close');
        },
        edit: function (id) {
            var header = $("#" + bpDataTableName + ' thead tr th');
            var row = $("#" + bpDataTableName + ' tr#row' + id + ' td');
            var cols = {};
            var i = 0;
            var idx = 0;
            var val = '';
            for (i = 0; i < header.length - 1; i++) {
                idx = header[i].getAttribute('name');
                val = row[i].textContent;
                cols[idx] = val;
            }

            var inputs = newForm.find('input');
            $.each(cols, function (key, value) {
                $.each(inputs, function (ignore, content) {
                    if (content.getAttribute('name') === key) {
                        content.value = value;
                    }
                });
            });
            bpDialog.setTitle('Edit', 'Edit property #' + id);
            desc.after('<input type="hidden" name="id" value="' + id + '"/>');
            this.open();
        },
        delete: function (id) {
            newForm.find("input[name='action']").val('delete');
            newForm.find('table.form-table').remove();

            bpDialog.setTitle('Delete', 'Delete property #' + id);
            desc.after('<input type="hidden" name="id" value="' + id + '"/>');
            this.open();
        }
    };
}