/*global bpTabPane, bpTabUl, bpTabUlDiv, bpTabCounter, bpTabActiveId */
/*global $, ajaxurl, alert */
function bpTabPane(element) {
    'use strict';
    this.bpForm = element;
    this.bpFormTable = this.bpForm.find('table.form-table');
    this.bpFormTableNew = this.bpFormTable.clone();
    this.bpEmptyRow = {};

    this.bpTabPane = this.bpForm.find('div.bp-tab-pane');
    this.bpTabUl = $('<ul class="nav-tabs"></ul>');
    this.bpTabUlDiv = $('<div class="tab-content"></div>');
    this.bpTabSpan = $('<span class="dashicons dashicons-no-alt"></span>');
    this.bpTabCounter = 0;
    this.bpTabActiveId = 0;

    this.bpTabInitialized = false;

    var _this = this;

    this.load = function (rows, disabled) {
        if (this.bpTabInitialized === false) {
            this.bpTabInitialize();
            this.bpTabInitialized = true;
        }
        this.updateForm(rows, disabled);
    };
    /**
     * Adding ul and div to tab
     */
    this.bpTabInitialize = function () {
        this.bpFormTable.remove();
        this.bpTabUl.appendTo(this.bpTabPane);
        this.bpTabUlDiv.appendTo(this.bpTabPane);
        this.inputKeyUp();
    };

    // this.addCloseTabButton = function (li, content) {
    //     //adds close button to tab
    //     if (li.length > 0) {
    //         this.bpTabSpan.click(function () {
    //             _this.bpClosedTabsId.push()
    //             li.remove();
    //             content.remove();
    //         });

    //     }
    // };

    /**
     * Form update
     *
     * @param      {object}  data      The data
     * @param      {<type>}  disabled  The disabled
     */
    this.updateForm = function (data, disabled) {

        $.each(data, function (ignore, row) {
            _this.addNewTab(row, disabled);
        });
    };

    this.setEmptyRow = function (row) {
        this.bpEmptyRow = row;
    };

    this.addNewTab = function (row, disabled) {

        var tabId = row.id;
        var newTab = false;

        if (row.id === 'new') {
            newTab = true;
            tabId = row.id + '-' + (this.bpTabCounter + 1);
        }

        var li = $('<li></li>');
        var tabPane = $('<div id="' + tabId + '" class="tab-pane"></div>');

        var formNewTable = this.bpFormTableNew;

        var formTable = formNewTable.clone();

        this.bpTabUl.append(function () {
            var newTabLi = $(this).find('li.insertTab');

            $('<a>').attr('href', '#' + tabId).text('#' + tabId).appendTo(li);

            if (newTabLi.length > 0) {
                var span = $('<span class="dashicons dashicons-no-alt"></span>');
                span.click(function () {
                    _this.setActiveTab(li, tabPane, 'close');
                    li.remove();
                    tabPane.remove();
                });
                span.appendTo(li);
                newTabLi.before(li);
            } else {
                $(this).append(li);
            }
        });

        this.bpTabUlDiv.append(function () {
            formTable.appendTo(tabPane);
            $(this).append(tabPane);
        });

        if (this.bpTabCounter === 0) {
            li.addClass('active');
            tabPane.addClass('active');
        }


        this.updateFormTable(formTable, row, disabled, newTab);
        this.bpTabCounter += 1;
        this.setActiveTab(li, tabPane);
    };

    this.setActiveTab = function (li, tabPane, action) {
        var lis = this.bpTabUl.find('li');
        lis.removeClass('active');

        var divs = this.bpTabUlDiv.find('div.tab-pane');
        divs.removeClass('active');

        li.addClass('active');
        tabPane.addClass('active');

        var last = li.next().hasClass('insertTab');

        if (action === 'close') {
            if (last === true) {
                // prev li
                li.prev().addClass("active");
                tabPane.prev().addClass("active");

            } else {
                //next li
                li.next().addClass("active");
                tabPane.next().addClass("active");
            }

        }
    };

    /**
     * Updating tables
     *
     * @param      {object}   table     The table
     * @param      {object}   row       The row
     * @param      {boolean}  disabled  The disabled
     */
    this.updateFormTable = function (table, row, disabled, insert) {
        var input = {};
        var select = {};
        var name = '';
        var nameId = row.id;

        if (insert) {
            nameId = this.bpTabCounter + '-' + row.id;
        }

        $.each(row, function (key, value) {

            name = nameId + '[' + key + ']';
            input = table.find('input[name="' + key + '"]');

            if (input.length > 0) {

                input.attr('name', name);

                if (input.attr('type') === 'checkbox') {

                    if (value === '1') {

                        input.prop('checked', 'checked');
                        input.val(value);

                    } else {
                        input.val(0);
                    }
                } else {

                    input.val(value);

                }

                if (disabled === true) {
                    input.prop('disabled', true);
                } else if (!insert) {
                    _this.setStatusInput(input);
                    
                }
            }

            select = table.find('select[name="' + key + '"]');



            if (select.length > 0) {
                console.log('select');
                console.log(select.length);

                select.attr('name', name);

                $.each(select.children(), function (ignore, option) {
                    if (option.value === value) {
                        option.selected = true;
                    }

                    if (disabled === true) {
                        select.prop('disabled', true);
                    }
                });

                if (!insert) {
                    _this.setStatusSelect(select);
                }
            }
        });
    };

    this.setStatusInput = function (input) {
        var min = input.attr('min');
        var type = input.attr('type');
        var status = input.next();
        var text = input.val();

        if (type === 'text' || type === 'date') {
            var patern = input.attr('patern');

            if (patern === undefined) {
                patern = '([A-Za-z0-9-])\\w{' + (min - 1) + ',}';
            }
            var regex = new RegExp(patern);
            var test = regex.test(text);

            // icon checking
            if (test) {
                status.removeClass('dashicons-no').addClass('dashicons-yes').css('color', 'green');
                status.attr('status', true);
            } else {
                status.removeClass('dashicons-yes').addClass('dashicons-no').css('color', 'red');
                status.attr('status', false);
            }
        }
    };

    this.setStatusSelect = function (select) {
        var status = select.next();
        var value = select.val();

        var patern = select.attr('patern');

        var regex = new RegExp(patern);
        var test = regex.test(value);

        //console.log(status);

        if (test) {
            status.removeClass('dashicons-no').addClass('dashicons-yes').css('color', 'green');
            status.attr('status', true);
        } else {
            status.removeClass('dashicons-yes').addClass('dashicons-no').css('color', 'red');
            status.attr('status', false);
        }

    };

    /**
     * Set @var inputKeyUp
     */
    this.inputKeyUp = function () {
        this.bpForm.on('keyup paste select change', 'input', function () {
            _this.setStatusInput($(this));
            console.log(this);
        });
        this.bpForm.on('select change', 'select', function () {
            _this.setStatusSelect($(this));
            console.log(this);
        });

    };

    this.addPlusTab = function () {
        this.bpTabUl.append(function () {
            var li = $('<li class="insertTab"></li>');
            $('<a class="insertTab"></a>').html('<span class="dashicons dashicons-plus"></span>').appendTo(li);
            $(this).append(li);
        });

        this.bpTabUl.on('click', 'a.insertTab', function (evnt) {
            evnt.preventDefault();
            _this.addNewTab(_this.bpEmptyRow, false);
        });
    };
}