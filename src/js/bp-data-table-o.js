/*global bpDataTable, bpRpcAction */
/*global $ */
/*global ajaxurl */
/*global bpDataTableName */
/*global feedDataTable */
var bpDataTable = function () {
    'use strict';
    var initialized = false;
    var bpDataTableName = '';
    var bpRpcAction = '';
    

    return {
        initialize: function () {

            initialized = true;

        },

        setIdAction: function (id, action) {
            this.bpDataTableName = id;
            this.bpRpcAction = action;
        },

        getId: function () {
            return this.bpDataTableName;
        },

    // reset: function() {
    // },

        load: function () {
            if (initialized === false) {
                this.initialize();
            }


      //$('#batchTotalPages').html(batchIconProgress + batchIconProgressText);
            $.post(
                ajaxurl,
                {
                    action: bpRpcAction
                },
                function (response) {
                    if (response.error === false) {
                        $('#' + bpDataTableName + ' tbody tr').remove();
                        feedDataTable(response);
                    }
                    //console.log(response);
                }
            );
        }
    };
};