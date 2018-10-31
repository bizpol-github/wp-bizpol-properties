/* global bpCities, _this */
/*global $ */
/*global ajaxurl */
/*global bpDataTableId */
/*global feedDataTable */
/*global bpRpcActionName */
function bpCities() {

    'use strict';
    //var _this = this;

    this.initialized = false;

    this.input = {};

    console.log('bpCities-start');

    /**
     * set @var initialize only once
     */
    this.initialize = function (element) {

        if (this.initialized === false) {
            this.initialized = true;
            this.input = element;
        }       


        element.autocomplete({
            source: ['archh', 'arvvvv', 'arch']
        });
    };
    
}