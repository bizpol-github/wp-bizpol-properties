/* global bpZones, _this */
/*global $ */
/*global ajaxurl */
/*global bpDataTableId */
/*global feedDataTable */
/*global bpRpcActionName */
function bpZones() {

    'use strict';
    var _this = this;

    this.initialized = false;

    this.bpRPCData = {};

    this.bpParams = [];

    this.bpRpcActionName = 'bp_rpc_get_zones';

    console.log('bpZones-start');

    /**
     * set @var initialize only once
     */
    this.initialize = function () {


        if (this.initialized === false) {
            this.initialized = true;
        }
    };

    /**
     * Sets the parameter.
     *
     * @param      {object}  name    The name
     * @param      {object}  value   The value
     */
    this.setParam = function (name, value) {
        this.bpParams.push({[name]: value});
    };

    this.getParams = function () {
        if (this.bpParams.length > 0) {
            var params = {};
            $.each(this.bpParams, function (ignore, param) {
                $.each(param, function (key, value) {
                    params[key] = value;
                });
            });
            return '?' + $.param(params);
        } else {
            return '';
        }
    };

    this.load = function (element) {
        console.log(element.value);
        this.setParam('country_id', element.value);
        $.post(
            ajaxurl + _this.getParams(),
            {
                action: _this.bpRpcActionName
            },
            function (response) {
                
               // if (response.error === false) {

                    _this.bpRPCData = response.entries;
                    

                    //_this.updateSelect();
                    console.log('RPC:');
                    console.log(response);

                }
           // }
        );
    };
}