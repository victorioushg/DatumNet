var dta = {}; // data namespace
var ui = {}; // ui components namespace

$(function () {

    ej.grids.Grid.Inject(ej.grids.DetailRow);
    ej.grids.Grid.Inject(ej.grids.Toolbar);
    ej.base.enableRipple(false);

    ui.initialDate = new Date(2019, 6, 1); // Zero based month 6 = July   Change  by now
    ui.startDate = new Date(ui.initialDate.setDate(1));
    ui.initialDate.setMonth(ui.initialDate.getMonth() + 1);
    ui.endDate = new Date((new Date(ui.initialDate)).setDate(0));

    // Policies
    ui.policiesGrid = new ej.grids.Grid({

        // Parent Properties
        allowResizing: false,
        allowGrouping: false,
        allowFiltering: true,
        allowTextWrap: true,

        filterSettings: { type: 'Excel' },
        width: "100%",
        toolbar: [
            { id: "add", prefixIcon: "e-add", tooltipText: "Agregar Registro" },
            { id: "edit", prefixIcon: "e-edit", tooltipText: "Editar Registro" },
            { id: "delete", prefixIcon: "e-delete", tooltipText: "Eliminar Registro" },
            { id: "print", prefixIcon: "e-print", tooltipText: "Imprimir" }, { type: "Separator" }, { template: '#toolbarTemplate' }],
        editSettings: { showConfirmDialog: true, showDeleteConfirmDialog: true, allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
        selectionSettings: { type: 'Single' },
        width: "100%",
        columns: [
            { field: "id", visible: false },
            { headerText: "<h4>Asientos Contables<h4>", disableHtmlEncode: false, template: "#cellTemplate", allowFiltering: false, customAttributes: { class: 'policygrid' }}, //
            //{ field: 'policyCode', headerText: 'Asiento Contable', width: '15%' },
            //{ field: "policyDate", headerText: "Fecha Asiento", width: '15%', type: 'date', format: 'MM/dd/yyyy' },
            //{ field: "description", headerText: "Descripcion", },
            //{ field: "debits", headerText: "Debitos", width: '15%', type: 'number', format: 'N2', textAlign: 'Right' },
            //{ field: "credits", headerText: "Creditos", width: '15%', type: 'number', format: 'N2', textAlign: 'Right' },
            //{ field: "due", headerText: "Saldo", width: '15%', type: 'number', format: 'N2', textAlign: 'Right' },
        ],
        gridLines: "None",
        height: window.innerHeight - 250,

        //// Parent Events
        rowSelected: function (args) {
            ui.policyIdSelected = args.data.id;
            ui.policyCodeSelected = args.data.policyCode;

            getPolicyLines();

        },
        queryCellInfo: function (args) {
            if (args.column.headerText === "<h4>Asientos Contables<h4>") {
                args.data['conciliated'] ? args.cell.firstElementChild.classList.add('conciliated')
                    :args.cell.firstElementChild.classList.add('notconciliated')
            }
        },
    });
    ui.policiesGrid.appendTo("#encabGrid");

    // Tabs
    ui.tabObj = new ej.navigations.Tab(
        {
            //height: 390,
            showCloseButton: false,
            selecting: selectTab,
            items: [
                {
                    header: { 'text': 'Detalle Asiento Contable' },
                    content: "#lines",
                },
            ],

            selected: onTabSelected,
        });
    ui.tabObj.appendTo('#linesTab');

    ui.linesGrid = new ej.grids.Grid({

        // Properties
        allowResizing: false,
        allowGrouping: false,
        allowFiltering: true,

        filterSettings: { type: 'Excel' },
        width: "100%",
        toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Print'],
        editSettings: { showConfirmDialog: true, showDeleteConfirmDialog: true, allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
        //selectionSettings: { cellSelectionMode: 'BoxWithBorder', mode: 'Cell' },
        width: "100%",
        columns: [
            { field: "policyId", visible: false },
            { field: 'rowOrder', headerText: 'Row #', width: '5%' },
            { field: "accountCode", headerText: "Codigo Cuenta", width: '15%', },
            { field: "reference", headerText: "Reference", width: '15%', },
            { field: "description", headerText: "Descripcion", width: '35%' },
            { field: "debit", headerText: "Debitos", width: '15%', type: 'number', format: 'N2', textAlign: 'Right' },
            { field: "credit", headerText: "Creditos", width: '15%', type: 'number', format: 'N2', textAlign: 'Right' },
        ],
        aggregates: [{
            columns: [
                { type: 'Sum', field: 'debit', format: 'N2', footerTemplate: 'Debitos: ${Sum}' },
                { type: 'Sum', field: 'credit', format: 'N2', footerTemplate: 'Creditos: ${Sum}' },
            ]
        }],
        gridLines: "None",
        height: window.innerHeight - 290,

        // Events
        rowSelected: function (args) {
        },
        dataBound: function (args) {
        },

    });
    ui.linesGrid.appendTo("#linesGrid");

    ui.startEndDatePicker = new ej.calendars.DateRangePicker({
        placeholder: 'Select a range',
        //sets the start date in the range
        startDate: ui.startDate, // todo first month date function
        //sets the end date in the range
        endDate: ui.endDate, // todo last month date function ,
        width: 200,

        //Events
        change: function (args) {
            ui.linesGrid.dataSource = [];
        }
    });
    ui.startEndDatePicker.appendTo('#dtpStartEndDates');

    Promise.all([
        api("/api/accounting/policies/" + ui.startEndDatePicker.startDate.toISOString() + "/" + ui.startEndDatePicker.endDate.toISOString(),
            null, res => {
                dta.policies = res;
                ui.policiesGrid.dataSource = dta.policies;
            }),
    ]).then();
});

function getPolicyLines() {
    // Get lines data dinamically when policy selected 
    if (ui.policyIdSelected) {
        api("/api/accounting/policy/" + ui.policyIdSelected + "/lines", null, res => {
            dta.policyLines = res;
            ui.linesGrid.dataSource = dta.policyLines;
        });
    }
}

function selectTab(e) {
    if (e.isSwiped) {
        e.cancel = true;
    }
}

function onTabSelected(args) {
    if (args.selectedIndex == 0) { // 1 == Codes
        alert('TAB 1');
    } else if (args.selectedIndex == 1) {// 2 == Movements
        alert('TAB 2');
    }
    else {
    }
}
