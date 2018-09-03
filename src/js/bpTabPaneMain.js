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

        if (def === true) {
            this.defContent = content;
        } else {
            this.dataTabs[id] = content;
            this.dataTabs[id].name = name;
            this.dataTabs[id].present = false;

            if (this.active === '') {
                this.setActiveTab(id);
            }
        }

        console.log('dataTabs:');
        console.log(this.dataTabs);
    };

    this.load = function () {
        if (this.initialized === false) {
            this.initialize();
            this.initialized = true;
        }

        var first = true;

        $.each(this.dataTabs, function (key, content) {

            if (content.present === false) {

                var li = $('<li></li>');
                var tabPane = content;

                var removeButton = $('<span class="dashicons dashicons-no-alt"></span>');
                var a = $('<a>').attr('href', '#' + key).text('#' + content.name);
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

                if (first === false) {
                    removeButton.appendTo(a);
                }

                a.appendTo(li);
                li.appendTo(_this.ulTabs);
                tabPane.append(content);
                tabPane.appendTo(_this.divContent);
                content.present = true;

                console.log('content:');
                console.log(content);
            }
            first = false;
        });
    };

    this.initialize = function () {
        this.ulTabs.appendTo(this.mainDiv);
        this.divContent.appendTo(this.mainDiv);
    };

    this.setActiveTab = function (id) {
        this.ulTabs.children().removeClass('active');
        this.divContent.children().removeClass('active');

        this.ulTabs.find('a[href="#' + id + '"]').parent().addClass('active');
        this.divContent.find('#' + id).addClass('active');

        this.active = id;
    };

    this.newTab = function (id, idx, name, description) {
        var dataId = id + '-' + idx;

        if (!this.dataTabs[dataId]) {
            var def = this.defContent.clone();
            var title = def.find('.tab-pane-title');

            title.text(Object.values(description));
            var newT = def.find('.bp-data-table');
            var bpNewDT = new bpDt(id, newT);
            bpNewDT.clearParam();
            bpNewDT.setParam('property_id', idx);
            //bpNewDT.setTableId(tableId);
            bpNewDT.load();
            bpNewDT.addDialogHiddenFields('property_id', idx);
            this.addData(dataId, name, def);
            this.setActiveTab(dataId);
            this.load();
        } else {
            this.setActiveTab(dataId);
        }
    };

    this.refresh = function () {
        this.load();
    };
}
