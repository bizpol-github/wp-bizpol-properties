/*global bpTabPane, bpTabUl, bpTabUlDiv, bpTabCounter, bpTabActiveId */
/*global $, ajaxurl, alert */
function bpTabPane(element) {
    'use strict';
    this.bpTabPane = element;
    this.bpTabUl = $('<ul class="nav-tabs"></ul>');
    this.bpTabUlDiv = $('<div class="tab-content"></div>');
    this.bpTabSpan = $('<span class="dashicons dashicons-no-alt"></span>');
    this.bpTabTable = {};
    this.bpTabCounter = 0;
    this.bpTabActiveId = 0;

    this.bpTabInit = false;

    var _this = this;

    this.load = function (table) {
        this.bpTabTable = table;
        if (this.bpTabInit === false) {
            this.bpTabInitialize();
            this.bpTabInit = true;
        }
    };
    /**
     * Adding ul and div to tab
     */
    this.bpTabInitialize = function () {
        this.bpTabUl.appendTo(this.bpTabPane);
        this.bpTabUlDiv.appendTo(this.bpTabPane);
        this.addTabNew();
    };

    this.addTab = function (li, content, active) {
        this.bpTabUl.append(li);
        this.bpTabUlDiv.append(content);

        if (this.bpTabCounter === 0) {
            this.bpTabCounter += 1;
        }
        //this.bpTabCounter++;
    };

    this.addTabNew = function () {
        this.bpTabUl.append(function () {
            var li = $('<li class="insertTab"></li>');
            $('<a class="insertTab"></a>').html('<span class="dashicons dashicons-plus"></span>').appendTo(li);
            li.appendTo($(this));
        });

        this.bpTabUl.on('click', 'a.insertTab', function (evnt) {
            evnt.preventDefault();

            console.log('klikniety nowy tab');
            //_this.addTab();

        });
    };

    this.addCloseTabButton = function (li, content) {
        //adds close button to tab
        if (li.length > 0) {
            this.bpTabSpan.click(function () {
                li.remove();
                content.remove();
            });

        }
    };
}