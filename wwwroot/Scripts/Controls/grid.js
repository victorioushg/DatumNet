/*
 * Wrapper for ejGrid
 */
class Grid {
    constructor(args) {

        this.id = args.id;

        this.dataSource = args.dataSource;
        this.columns = args.columns;
        this.actionBegin = args.actionBegin;

        // set from params or defaults
        this.isResponsive = args.isResponsive !== undefined ? args.isResponsive : true;
        this.editButtonVisible = args.editButtonVisible !== undefined ? args.editButtonVisible : true;

        this.enableResponsiveRow = args.enableResponsiveRow !== undefined ? args.enableResponsiveRow : true;
        this.allowSearching = args.allowSearching !== undefined ? args.allowSearching : true;
        this.allowSorting = args.allowSorting !== undefined ? args.allowSorting : true;
        this.gridLines = args.gridLines !== undefined ? args.gridLines : ej.Grid.GridLines.Both;
        this.allowFiltering = args.allowFiltering !== undefined ? args.allowFiltering : true;
        this.filterSettings = { filterType: "menu" };
        this.query = args.query !== undefined ? args.query : null;
        this.showColumnChooser = args.showColumnChooser !== undefined ? args.showColumnChooser : true;
        this.allowResizeToFit = args.allowResizeToFit !== undefined ? args.allowResizeToFit : true;
        this.allowReordering = args.allowReordering !== undefined ? args.allowReordering : true;
        // todo this is set to false due to a bug with updates not showing since browser persists old state
        this.enablePersistence = args.enablePersistence !== undefined ? args.enablePersistence : false;
        this.exportToExcelAction = args.exportToExcelAction !== undefined ? args.exportToExcelAction : null;
        this.minWidth = args.minWidth !== undefined ? args.minWidth : 990;
        this.enableTouch = args.enableTouch !== undefined ? args.enableTouch : false;
        this.allowScrolling = args.allowScrolling !== undefined ? args.allowScrolling : true;

        this.queryCellInfo = args.queryCellInfo !== undefined ? args.queryCellInfo : null;
        this.allowTextWrap = args.allowTextWrap !== undefined ? args.allowTextWrap : true;
        this.textWrapSettings = args.textWrapSettings !== undefined ? args.textWrapSettings : { wrapMode: "both" };

        // Events
        this.toolbarClick = args.toolbarClick !== undefined ? args.toolbarClick : 'onToolBarClick';
        this.rowDataBound = args.rowDataBound !== undefined ? args.rowDataBound : null;
        this.rowSelected = args.rowSelected !== undefined ? args.rowSelected : null;


        this.isResponsive = true;

        this.accessType = args.accessType !== undefined ? args.accessType : 'ReadOnly';

        // set the edit settings and toolbar buttons visibility
        var canAdd = false, canEdit = false, canDelete = false;
        var hasEditPermission = this.accessType === "Admin" || this.accessType === "Edit";

        // can add/edit/delete by default if an actionBegin is defined
        if (args.actionBegin) {
            canAdd = args.canAdd !== undefined ? args.canAdd : hasEditPermission;
            canEdit = args.canEdit !== undefined ? args.canEdit : hasEditPermission;
            canDelete = args.canDelete !== undefined ? args.canDelete : hasEditPermission;
        }

        this.editSettings = {
            allowEditing: canEdit,
            allowAdding: canAdd,
            allowDeleting: canDelete,
            showDeleteConfirmDialog: true,
            editMode: "ExternalFormTemplate",
        };

        // grouping does not work properly if using virtual scroll
        this.allowGrouping = args.allowGrouping !== undefined ? args.allowGrouping : true;
        this.allowVirtualScrolling = args.allowVirtualScrolling !== undefined
            ? args.allowVirtualScrolling
            : !this.allowGrouping;

        this.allowPaging = args.allowPaging !== undefined
            ? args.allowPaging
            : this.allowVirtualScrolling;

        //this.pageSettings = { pageSize: 10 };$(window).height() - 500,
        this.pageSettings = this.allowPaging
            ? { pageSize: 100 } //this.dataSource.length }
            : {}

        var h = $(window).height() - (350 + (this.allowPaging ? 80 : 0));

        this.scrollSettings = {
            width: "100%",
            height: h,
            allowVirtualScrolling: this.allowVirtualScrolling
            //virtualScrollMode: ej.Grid.VirtualScrollMode.Normal
        };

        var toolbarItems = [];
        if (canAdd) {
            toolbarItems.push("add");
        }
        if (canEdit && this.editButtonVisible) {
            toolbarItems.push("edit");
        }
        if (canDelete) {
            toolbarItems.push("delete");
        }
        if (this.exportToExcelAction != null) {
            toolbarItems.push(ej.Grid.ToolBarItems.ExcelExport);
        }
        if (this.allowSearching) {
            toolbarItems.push(ej.Grid.ToolBarItems.Search);
        }

        var customToolbarItems = [];
        if (this.allowGrouping) {
            customToolbarItems = ["Expand", "Collapse"];
        }
        customToolbarItems.push({ templateID: "#Refresh" });

        if (args.customToolbarItems) {
            for (var i = 0; i < args.customToolbarItems.length; i++) {
                customToolbarItems.push(args.customToolbarItems[i]);
            }
        }

        this.toolbarSettings = {
            showToolbar: true,
            toolbarItems: toolbarItems,
            customToolbarItems: customToolbarItems
        };
    }

    /* call this before any other methods to create the ejGrid */
    render(args) {
        if (args && args.dataSource) {
            this.dataSource = args.dataSource;
        }
        $(this.id).ejGrid({
            dataSource: this.dataSource,
            isResponsive: this.isResponsive,
            enableResponsiveRow: this.enableResponsiveRow,
            allowSearching: this.allowSearching,
            allowPaging: this.allowPaging,
            allowGrouping: this.allowGrouping,
            allowSorting: this.allowSorting,
            exportToExcelAction: this.exportToExcelAction,
            allowFiltering: this.allowFiltering,
            filterSettings: this.filterSettings,
            //query: this.query, todo
            toolbarSettings: this.toolbarSettings,
            toolbarClick: this.toolbarClick,
            showColumnChooser: this.showColumnChooser,
            allowResizeToFit: this.allowResizeToFit,
            allowReordering: this.allowReordering,
            enablePersistence: this.enablePersistence,
            editSettings: this.editSettings,
            minWidth: this.minWidth,
            enableTouch: this.enableTouch,
            allowScrolling: this.allowScrolling,
            scrollSettings: this.scrollSettings,
            columns: this.columns,
            actionBegin: this.actionBegin, // todo instance of popup
            rowDataBound: this.rowDataBound,
            pageSettings: this.pageSettings,
            queryCellInfo: this.queryCellInfo,
            gridLines: this.gridLines,
            rowSelected: this.rowSelected
        });
    }

    bindFilter(args) {
        var filterSelector = args.id;
        var gridField = args.field;
        var noneFilter = args.none;
        var operator = args.operator !== undefined ? args.operator : "equal";

        // default filter is text match on a column (args.field)
        var filterAction = function (g, val) {
            g.filterColumn([{
                field: gridField,
                operator: operator,
                value: val,
                matchcase: false
            }]);
        };

        // With/Without filters show either 'None' or everything else (args.none = dropdown option)
        if (noneFilter) {
            filterAction = function (g, val) {
                if (val === noneFilter) {
                    g.filterColumn([{
                        field: gridField,
                        operator: "equal",
                        value: "None",
                        matchcase: false
                    }]);
                }
                else {
                    g.filterColumn([{
                        field: gridField,
                        operator: "notequal",
                        value: "None",
                        matchcase: false
                    }]);
                }
            }
        }
        // Active/Inactive filters (where args.field == 'Deactivated')
        else if (gridField == "Deactivated") {
            filterAction = function (g, val) {
                if (val === "Active") {
                    g.filterColumn([{
                        field: "Deactivated",
                        operator: "equal",
                        value: false
                    }]);
                }
                else {
                    g.filterColumn([{
                        field: "Deactivated",
                        operator: "equal",
                        value: true
                    }]);
                }
            }
        }

        $(filterSelector).change(() => {
            var val = $(filterSelector).val();

            var g = $(this.id).ejGrid("instance");
            if (val === "All") {
                g.clearFiltering();
            }
            else {
                filterAction(g, val);
            }
        });

        if (args.initial) {
            // set the filter ddl and then trigger change event on that filter
            $(filterSelector).val(args.initial).change();
        }
    }

    refresh(args) {
        if (args && args.dataSource) {
            this.dataSource = args.dataSource;
        }
        $(this.id).data("ejGrid").refreshContent();
    }
}

