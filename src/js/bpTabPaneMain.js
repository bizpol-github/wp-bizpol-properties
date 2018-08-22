/*global bpTabPaneMain, _this, $ */
function bpTabPaneMain(id) {
    'use strict';

    //constructor
    this.mainDiv = $('div#' + id);
    this.dataTabs = {};
    this.ulTabs = $('<ul class="nav-tabs"></ul>');
    this.divContent = $('<div class="tab-content"></div>');
    this.active = '';

    var _this = this;
    this.initialized = false;

    this.addData = function (id, content) {
        if (this.active === '') {
            this.active = id;
        }
        this.dataTabs[id] = content;
    };

    this.load = function () {
        if (this.initialized === false) {
            this.initialize();
            this.initialized = true;
        }

        $.each(this.dataTabs, function (key, content) {
            var li = $('<li></li>');
            var tabPane = $('<div id="' + key + '" class="tab-pane"></div>');


            if (_this.active === key) {
                li.addClass('active');
                tabPane.addClass('active');
            }

            li.appendTo(_this.ulTabs);
            tabPane.append(content);
            tabPane.appendTo(_this.divContent);
            $('<a>').attr('href', '#' + key).text('#' + key).appendTo(li);
            console.dir(content);
        });
    };

    this.initialize = function () {
        this.ulTabs.appendTo(this.mainDiv);
        this.divContent.appendTo(this.mainDiv);
    };

    console.dir(_this);
}
