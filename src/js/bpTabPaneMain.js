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

    this.addData = function (id, name, content, def) {

        console.log(id);

        if (def === true) {
            this.defContent = content;
        } else {
            def = false;
            this.dataTabs[id] = content;
            this.dataTabs[id].default = def;
            this.dataTabs[id].name = name;

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

        var first = true;

        $.each(this.dataTabs, function (key, content) {

            if (content.default === false) {

                var li = $('<li></li>');
                var tabPane = content;

                var removeButton = $('<span class="dashicons dashicons-no-alt"></span>');
                var a = $('<a>').attr('href', '#' + key).text('#' + content.name);

                var bpTable = tabPane.find('.bp-data-table');
                var bpTableId = bpTable.attr('id');
                bpTableId = content;
                console.log(bpTableId);

                tabPane.attr('id', key);


                if (_this.active === key) {
                    li.addClass('active');
                    tabPane.addClass('active');
                }

                removeButton.click(function (evnt) {
                    evnt.preventDefault();

                    var isActive = li.hasClass('active');

                    li.remove();
                    tabPane.remove();
                    delete _this.dataTabs[key];

                    if (isActive) {
                        _this.ulTabs.children().last().addClass('active');
                        _this.divContent.children().last().addClass('active');
                    }
                });

                if (first === true) {
                    first = false;
                } else {
                    removeButton.appendTo(a);
                }

                a.appendTo(li);

                li.appendTo(_this.ulTabs);
                tabPane.append(content);
                tabPane.appendTo(_this.divContent);
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
        this.ulTabs.children().removeClass('active');
        this.divContent.children().removeClass('active');
        this.active = id;
    };

    this.newTab = function (id, name) {
        var newT = this.defContent.clone();
        this.addData(id, name, newT);
        this.setActiveTab(id);
        this.load();
    };

    this.refresh = function () {
        this.load();
    };

    console.dir(_this);
}
