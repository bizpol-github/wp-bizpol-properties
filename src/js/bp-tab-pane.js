/*global bpTabPane, bpDataTable, bpDataTableName, bpFormTitle,
  bpFormDesc, bpUpdateAction, wp_adminFullName, wp_adminId */
/*global $, ajaxurl, alert */
function bpTabPane(element) {
    'use strict';
    this.bpTabPane = element;
	this.bpTabUl = $('<ul class="nav-tabs"></ul>');
    this.bpTabUlDiv = $('<div class="tab-content"></div>');
    this.bpTabCounter = 0;
    this.bpTabActiveId = 0;

    this.bpTabInit = false;

    this.load = function () {
    	if (this.bpTabInit === false) {
    		this.bpTabInitialize();
    		this.bpTabInit = true;
    	}
    };

    this.bpTabInitialize = function () {
    	this.bpTabUl.appendTo(this.bpTabPane);
    	this.bpTabUlDiv.appendTo(this.bpTabPane);
    };

    this.addTab = function (li, content, active) {
    	this.bpTabUl.append(li);
    	this.bpTabUlDiv.append(content);
    	this.bpTabCounter++;
    };
}