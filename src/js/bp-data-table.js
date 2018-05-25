/*global bpDataTable */
/*global $ */
/*global ajaxurl */
/*global dataTableName */
/*global feedDataTable */
function bpDataTable() {
    'use strict';
    var initialized = false;

    return {
        initialize: function () {

            initialized = true;

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
                    action: 'bp_get_all_properties'
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
}