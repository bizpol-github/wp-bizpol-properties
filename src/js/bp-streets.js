/* global bpStreets, _this */
/*global $ */
/*global ajaxurl */
/*global bpDataTableId */
/*global feedDataTable */
/*global bpRpcActionName */
function bpStreets() {

    'use strict';
    var _this = this;

    this.initialized = false;

    this.bpRPCData = {};

    this.bpRpcActionName = 'bp_rpc_get_streets';

    console.log('bpStreets-start');

    /**
     * set @var initialize only once
     */
    this.initialize = function (element) {



        if (this.initialized === false) {
            this.initialized = true;



            $.post(
                ajaxurl,
                {
                    action: _this.bpRpcActionName
                },
                function (response) {
                    console.log('seba');
                    
                   // if (response.error === false) {

                        _this.bpRPCData = response.entries;
                        

                        _this.load($(element));

                    }
               // }
            );
        }
    };

    this.load = function (element) {
                    console.log('RPC:');
                    console.log(_this.bpRPCData);
        element.autocomplete({
            source: _this.bpRPCData
        });
    };
}