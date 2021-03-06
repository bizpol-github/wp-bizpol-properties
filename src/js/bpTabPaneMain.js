/*global bpTabPaneMain, _this, $, window */
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
                var a = $('<a>').attr('href', '#' + key).html('<span>' + content.name + '</span>');
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
                //tabPane.append(content);
                tabPane.appendTo(_this.divContent);
                content.present = true;

                li.click(function (e) {
                    e.preventDefault();
                    _this.ulTabs.find("li.active").removeClass("active");
                    _this.divContent.find(".tab-pane.active").removeClass("active");

                    li.addClass('active');
                    tabPane.addClass('active');
                });
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
        var dataId = id + '_' + idx;
        var bpNewDT = {};
        var title = {};

        if (!this.dataTabs[dataId]) {

            var def = this.defContent.clone();
            //set title

            var header = def.find('.tab-pane-header');
            console.log(header);
            title = new bpTabPaneMainTitle(def.find('.tab-pane-header'), description);
            title.setGroup('title', ['id', 'property_name'], 100);
            title.setGroup('address', ['prefix', 'address'], 50);
            title.setGroup('summary', [], 50);
            title.load();

            var newT = def.find('.bp-data-table');
            bpNewDT = new bpDt(id, newT);
            bpNewDT.clearParam();
            bpNewDT.setParam('property_id', idx);
            bpNewDT.setFuncName(dataId);
            //bpNewDT.setTableId(tableId);
            bpNewDT.load();
            bpNewDT.addDialogHiddenFields('property_id', idx);
            window[dataId] = bpNewDT;

            this.addData(dataId, name, def);
            this.setActiveTab(dataId);
            this.load();
        } else {
            this.setActiveTab(dataId);
        }
    };

    this.getDataTable = function (id) {
        return this.dataTabs[id].table;
    };
}

function bpTabPaneMainTitle(element, row) {
    'use strict';

    //constructor
    this.mainDiv = element;
    this.titleData = row;
    this.groups = {};
    this.initialized = false;

    var _this = this;

    this.load = function () {
        var title = '';

        $.each(this.groups, function (key, content) {
            var div = $('<div style="float:left">');
            div.addClass('header-' + key);

            var groupValue = [];

            $.each(content.group, function (ignore, name) {

                groupValue.push(_this.titleData[name]);

            });
            div.css('width', content.size + '%');

            div.text(groupValue);

            _this.mainDiv.append(div);

            title += key;
            title += content;

        });

       // this.mainDiv.text(title);


    };

    this.setGroup = function (name, group, size) {
        this.groups[name] = {
            group: group,
            size: size
        };

    };
}
