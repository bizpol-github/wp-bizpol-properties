/*global bpTabPaneMain, _this, $ */
function bpTabPaneMain(id) {
    'use strict';

    //constructor
    this.mainDiv = $('div#' + id);
    this.dataTabs = {};
    this.ulTabs = $('<ul class="nav-tabs"></ul>');
    this.divContent = $('<div class="tab-content"></div>');
    this.active = '';
    this.defContent = {};
    this.initialized = false;

    var _this = this;

    this.addData = function (id, content, def) {

        if (def === true) {
            this.defContent = content;
        } else {
            def = false;
            this.dataTabs[id] = content;
            this.dataTabs[id].default = def;

            if (this.active === '') {
                this.setActiveTab(id);
            }
        }
    };

    this.load = function () {
        if (this.initialized === false) {
            this.initialize();
            this.initialized = true;
        }

        if (this.ulTabs.children.length > 0) {
            this.ulTabs.empty();
            this.divContent.empty();
        }

        $.each(this.dataTabs, function (key, content) {

            if (content.default === false) {

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

            }

            console.log('content:');
            console.log(content);
        });
    };

    this.initialize = function () {
        this.ulTabs.appendTo(this.mainDiv);
        this.divContent.appendTo(this.mainDiv);
    };

    this.setActiveTab = function (id) {
        this.active = id;
    };

    this.newTab = function (id) {
        this.addData(id, this.defContent);
    };

    this.refresh = function () {
        this.load();
    };

    console.dir(_this);
}
