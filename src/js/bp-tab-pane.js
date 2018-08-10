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
            this.bpTabInitializedialize();
            this.bpTabInitialized = true;
        }
        this.updateForm(rows, disabled);
    };
    /**
     * Adding ul and div to tab
     */
    this.bpTabInitializedialize = function () {
        this.bpFormTable.remove();
        this.bpTabUl.appendTo(this.bpTabPane);
        this.bpTabUlDiv.appendTo(this.bpTabPane);
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

        var tabId = row.id + '-' + (this.bpTabCounter + 1);
        var li = $('<li></li>');
        var tabPane = $('<div id="' + tabId + '" class="tab-pane"></div>');
        var newTab = false;

        var formNewTable = this.bpFormTableNew;

        var formTable = formNewTable.clone();

        this.bpTabUl.append(function () {
            var newTabLi = $(this).find('li.insertTab');

            $('<a>').attr('href', '#' + tabId).text('#' + tabId).appendTo(li);

            if (newTabLi.length > 0) {
                var span = $('<span class="dashicons dashicons-no-alt"></span>');
                span.click(function () {
                    li.remove();
                    tabPane.remove();
                    _this.setActiveTab(_this.bpTabCounter - 1);
                    _this.bpTabCounter -= 1;
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

        if (row.id === 'new') {
            newTab = true;
        }

        this.updateFormTable(formTable, row, disabled, newTab);
        this.bpTabCounter += 1;

        console.log(this.bpTabCounter);
    };

    this.setActiveTab = function (counter) {
        var lis = this.bpTabUl.find('li');
        lis.removeClass('active');
        lis.each(function (index) {
            if (index === counter - 2) {
                $(this).addClass('active');
                _this.bpTabActiveId = index;
            }
        });
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
                        console.log('value 1: ' + value);

                        input.prop('checked', 'checked');
                        input.val(value);

                    } else {
                        console.log('value 0: ' + 0);
                        input.val(0);
                    }
                } else {

                    input.val(value);

                }

                if (disabled === true) {
                    input.prop('disabled', true);
                } else if (!insert) {
                    _this.setStatus(input);
                }
            }

            select = table.find('select[name="' + key + '"]');

            if (select.length > 0) {

                select.attr('name', name);

                $.each(select.children(), function (ignore, option) {
                    if (option.value === value) {
                        option.selected = true;
                    }
                    if (disabled === true) {
                        select.disabled = true;
                    }
                });
            }
        });
    };

    this.setStatus = function (input) {
        var min = input.attr('min');
        var type = input.attr('type');
        var status = input.next();
        var text = input.val();

        if (type === 'text') {
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

    this.addExtraTab = function () {
        this.bpTabUl.append(function () {
            var li = $('<li class="insertTab"></li>');
            $('<a class="insertTab"></a>').html('<span class="dashicons dashicons-plus"></span>').appendTo(li);
            $(this).append(li);
        });

        this.bpTabUl.on('click', 'a.insertTab', function (evnt) {
            evnt.preventDefault();
            _this.addNewTab(_this.bpEmptyRow, false);
            _this.setActiveTab(_this.bpTabCounter);

        });
    };

    /**
     * Editing property function
     *
     * @param      {string}  id      The identifier
     */
    // this.insertNewTab = function (row, disabled) {
    //     var tabId = 'Tab-' + row.id;
    //     var newTab = false;
    //     var liCount = this.bpTabCounter + 1;


    //     if (row.id === 'new') {
    //         console.log('Nowy:');
    //         console.log('li:' + liCount);
    //         tabId = liCount + '-Tab-' + row.id;
    //         newTab = true;
    //         row.id = liCount + '-' + row.id;
    //     }

    //     var formNewTable = this.bpFormTable;

    //     var formTable = formNewTable.clone();
    //     this.bpFormTable.remove();

    //     var li = '';
    //     var tabPane = '';

    //     this.bpTabUl.append(function () {
    //         li = $('<li></li>');
    //         var newTabLi = $(this).find('li.insertTab');

    //         $('<a>').attr('href', '#' + tabId).text('#' + tabId).appendTo(li);

    //         if (newTabLi.length > 0) {
    //             var span = $('<span class="dashicons dashicons-no-alt"></span>');
    //             span.click(function () {
    //                 li.remove();
    //                 tabPane.remove();
    //             });
    //             span.appendTo(li);
    //             newTabLi.before(li);
    //         } else {
    //             $(this).append(li);
    //         }
    //     });

    //     this.bpTabUlDiv.append(function () {
    //         tabPane = $('<div id="' + tabId + '" class="tab-pane"></div>');

    //         formTable.appendTo(tabPane);
    //         $(this).append(tabPane);
    //     });

    //     if (this.bpTabCounter === 0) {
    //         li.addClass('active');
    //         tabPane.addClass('active');
    //     }

    //     this.updateFormTable(formTable, row, disabled, newTab);

    // };
}