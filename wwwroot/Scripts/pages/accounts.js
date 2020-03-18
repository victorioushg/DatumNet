var dta = {}; // data namespace
var ui = {}; // ui components namespace

$(function() {

    ej.grids.Grid.Inject(ej.grids.DetailRow);
    ej.grids.Grid.Inject(ej.grids.Toolbar);
    ej.base.enableRipple(false);

    ui.initialDate = new Date(2019, 6, 1); // Zero based month 6 = July
    ui.startDate = new Date(ui.initialDate.setDate(1));
    ui.initialDate.setMonth(ui.initialDate.getMonth() + 1);
    ui.endDate = new Date((new Date(ui.initialDate)).setDate(0));

    // Accounts
    ui.accountsGrid = new ej.grids.Grid({

        // Properties
        allowResizing: false,
        allowGrouping: false,
        allowFiltering: true,
        allowTextWrap: true,

        filterSettings: { type: 'Excel' },
        width: "100%",
        toolbar: [
            { id: "add", prefixIcon: "e-add", tooltipText : "Agregar Registro" },
            { id: "edit", prefixIcon: "e-edit", tooltipText: "Editar Registro" },
            { id: "delete", prefixIcon: "e-delete", tooltipText : "Eliminar Registro" },
            { id: "print", prefixIcon: "e-print", tooltipText : "Imprimir" },
            'Search'],
        editSettings: { showConfirmDialog: true, showDeleteConfirmDialog: true, allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
        selectionSettings: { type: 'Single' },
        width: "100%",
        columns: [
            { field: 'id', headerText: 'Account ID', type: 'number', visible: false,  },
            { headerText: "<h4>Cuentas<h4>", disableHtmlEncode: false, template: "#cellTemplate", allowFiltering: false, customAttributes: { class: 'customgrid' } }, //
        ],
        gridLines: "None",
        height: window.innerHeight - 250,
       
        // Events
        rowSelected: function (args) {
            ui.accountCodeSelected = args.data.accountCode;
            ui.rowIndexSelected = args.rowIndex;
            ui.accountIdSelected = args.data.id;

            getAccountsMovements();

        },
        queryCellInfo: function (args) {
            if (args.column.headerText === "<h4>Cuentas<h4>") {
                switch (args.data['accountCode'].substr(0, 1)) {
                    case '1':
                        args.cell.firstElementChild.classList.add('assets')
                        break;
                    case '2':
                        args.cell.firstElementChild.classList.add('liabilities');
                        break;
                    case '3':
                        args.cell.firstElementChild.classList.add('capital');
                        break;
                    case '4':
                        args.cell.firstElementChild.classList.add('incomes');
                        break;
                    case '5':
                        args.cell.firstElementChild.classList.add('outcomes');
                        break;
                    case '6':
                        args.cell.firstElementChild.classList.add('expenses');
                        break;
                    default:
                        args.cell.firstElementChild.classList.add('others');
                }
            }
        },
    });
    ui.accountsGrid.appendTo("#accountsGrid");

    // Tabs
    ui.tabObj = new ej.navigations.Tab(
        {
            //height: 390,
            showCloseButton: false,
            selecting: selectTab,
            items: [
                {
                    header: { 'text': 'Movimientos' },
                    content: "#accountsWork",
                },
                {
                    header: { 'text': 'estadisticas' },
                    content: 'WhatsApp Messenger is a proprietary cross-platform instant messaging client for smartphones that operates ' +
                        'under a subscription business model. It uses the Internet to send text messages, images, video, user location and ' +
                        'audio media messages to other users using standard cellular mobile numbers. As of February 2016, WhatsApp had a user ' +
                        'base of up to one billion,[10] making it the most globally popular messaging application. WhatsApp Inc., based in ' +
                        'Mountain View, California, was acquired by Facebook Inc. on February 19, 2014, for approximately US$19.3 billion.'
                }
            ],

            selected: onTabSelected,
        });
    ui.tabObj.appendTo('#accountsTab');


    // Movements
    ui.accountsWorkGrid = new ej.grids.Grid({

        // Properties
        allowResizing: false,
        allowGrouping: false,
        allowFiltering: true,

        filterSettings: { type: 'Excel' },
        width: "100%",
        toolbar: ['Print', { type: "Separator" }, { template: '#toolbarTemplate' }],
        editSettings: { showConfirmDialog: true, showDeleteConfirmDialog: true, allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
        //selectionSettings: { cellSelectionMode: 'BoxWithBorder', mode: 'Cell' },
        width: "100%",
        columns: [
            { field: "policyId", visible: false },
            { field: 'policyCode', headerText: '<h5>Asiento Contable</h5>', disableHtmlEncode: false, width: '15%' },
            { field: "policyDate", headerText: "<h5>Fecha Asiento</h5>", disableHtmlEncode: false, width: '15%', type: 'date', format: 'MM/dd/yyyy' },
            { field: "reference", headerText: "<h5>Referencia</h5>", disableHtmlEncode: false, width: '15%' },
            { field: "description", headerText: "<h5>Concepto</h5>", disableHtmlEncode: false, width: '39%' },
            { field: "amount", headerText: "<h5>Importe</h5>", disableHtmlEncode: false, width: '15%', type: 'number', format: 'N2', textAlign: 'Right' },
        ],
        gridLines: "None",
        height: window.innerHeight - 290,

        // Events
        rowSelected: function (args) {
        },
        dataBound: function (args) {
        },
        aggregates: [{
            columns: [{
                type: 'Sum',
                field: 'amount',
                format: 'N2',
                footerTemplate: '<h5>Total: ${Sum}</h5>', //footerTemplate: 'Suma Total: ${Sum}'
                disableHtmlEncode: false, 
            }]
        }],
    });
    ui.accountsWorkGrid.appendTo("#accountWorkGrid");

    ui.startEndDatePicker = new ej.calendars.DateRangePicker({
        placeholder: 'Select a range',
        //sets the start date in the range
        startDate: ui.startDate, // todo first month date function
        //sets the end date in the range
        endDate: ui.endDate, // todo last month date function ,
        width: 300,

        //Events
        change: function (args) {
            getAccountsMovements();
        }
    });
    ui.startEndDatePicker.appendTo('#dtpStartEndDates');

    Promise.all([
        api("/api/accounting/accounts", null, res => {
            dta.accounts = res;
            ui.accountsGrid.dataSource = dta.accounts;
        }),
    ]).then();
});

function getAccountsMovements() {
    // Get WorkGrid data dinamically when account selected 
    var start = ui.startEndDatePicker.startDate.toISOString();
    var end = ui.startEndDatePicker.endDate.toISOString();
    if (ui.accountCodeSelected) {
        api("/api/accounting/movements/" + ui.accountCodeSelected + "/" + start + "/" + end, null, res => {
            dta.accountMovements = res;
            ui.accountsWorkGrid.dataSource = dta.accountMovements;
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

