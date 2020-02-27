var dta = {}; // data namespace
var ui = {}; // ui components namespace

$(function () {

    //$.extend(ej, Syncfusion); // extends to use Syncfusion Javascript JS1
    ej.grids.Grid.Inject(ej.grids.DetailRow);
    ej.grids.Grid.Inject(ej.grids.Toolbar);
    ej.base.enableRipple(false);

    defineComponents();

    getAccounts();

});

async function getAccounts() {

    await api("/api/accounting/accounts", null, res => {
        dta.accounts = res;
        ui.accountsGrid.dataSource = dta.accounts;
    });
}

function defineComponents() {

    ui.tabObj = new ej.navigations.Tab(
        {
            //heightAdjustMode: 'None',
            //height: 390,
            showCloseButton: false,
            selecting: selectTab,
            items: [
                {
                    header: { 'text': 'cuentas contables' },
                    content: "#accounts",
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

    // Accounts
    ui.accountsGrid = new ej.grids.Grid({

        // Parent Properties
        allowResizing: false,
        allowGrouping: false,
        allowFiltering: true,
        filterSettings: { type: 'Excel' },
        width: "100%",
        toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Print', { type: "Separator" }, { template: '#toolbarTemplate' }],
        editSettings: { showConfirmDialog: true, showDeleteConfirmDialog: true,  allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
        //toolbarTemplate: '#toolbarTemplate',
        width: "100%",
        columns: [
            { field: 'id', headerText: 'Account ID', type: 'number', visible: false },
            { field: 'accountCode', width: '20%', headerText: 'Codigo Contable', allowFiltering: false, },
            { field: 'description', headerText: 'Nombre o descripcion', width: '40%', allowFiltering: false, },
            { heatherText: "" }
        ],
        gridLines: "None",
        height: window.innerHeight - 250,

        // Parent Events
        rowSelected: function (args) {
            ui.accountCodeSelected = args.data.accountCode;
        },
        dataBound: function (args) {
            //ui.startEndDatePicker = new ej.calendars.DateRangePicker({
            //    placeholder: 'Select a range',
            //    sets the start date in the range
            //    startDate: new Date(new Date().setDate(1)), // todo first month date
            //    sets the end date in the range
            //    endDate: new Date(new Date(new Date().setMonth(new Date().getMonth() + 1)).setDate(0)), // todo last month date 
            //});
            ui.startEndDatePicker.appendTo('#dtpStartEndDates');
        },
        //// ChildeGrid
        childGrid: {
            allowResizing: true,
            allowGrouping: true,
            queryString: 'accountCode',
            columns: [
                { field: "policyId", visible: false },
                { field: 'policyCode', headerText: 'Asiento Contable', width: '15%' },
                { field: "policyDate", headerText: "Fecha Asiento", width: '15%', type: 'date', format: 'MM/dd/yyyy' },
                { field: "reference", headerText: "Referencia", width: '15%' },
                { field: "description", headerText: "Concepto", width: '40%' },
                { field: "amount", headerText: "Importe", width: '15%', type: 'number', format: 'N2', textAlign: 'Right' },
            ],
            aggregates: [{
                columns: [{
                    type: 'Sum',
                    field: 'amount',
                    format: 'C2',
                    footerTemplate: 'Suma Total: ${Sum}'
                }]
            }],
        },

        detailDataBound: function (args) {

            ui.rowSelected = args.detailElement.parentNode.rowIndex;
            ui.accountIdSelected = args.data.id;

            var grid = document.getElementById('accountsGrid').ej2_instances[0]; 
            grid.filterByColumn("id", "equal", ui.accountIdSelected);

            ui.accountCodeSelected = args.data.accountCode;
            var start = ui.startEndDatePicker.startDate.toISOString();
            var end = ui.startEndDatePicker.endDate.toISOString();
            api("/api/accounting/movements/" + ui.accountCodeSelected + "/" + start + "/" +  end ,null , res => {
                dta.accountMovements = res;
                args.childGrid.dataSource = dta.accountMovements;
            });
        },

        

    });
    ui.accountsGrid.appendTo("#accountsGrid");

    ui.startEndDatePicker = new ej.calendars.DateRangePicker({
        placeholder: 'Select a range',
        //sets the start date in the range
        startDate: new Date(new Date().setDate(1)), // todo first month date
        //sets the end date in the range
        endDate: new Date(new Date(new Date().setMonth(new Date().getMonth() + 1)).setDate(0)), // todo last month date ,
        width: 300
    });


}

function selectTab(e) {
    if (e.isSwiped) {
        e.cancel = true;
    }
}


function onTabSelected(args) {

    //if (ui.startEndDatePicker) ui.startEndDatePicker.allowEdit = false;

    if (args.selectedIndex == 0) { // 1 == Codes
    } else if (args.selectedIndex == 1) {// 2 == Movements
        //if (!ui.startEndDatePicker) {
        //    ui.startEndDatePicker = new ej.calendars.DateRangePicker({
        //        placeholder: 'Select a range',
        //        //sets the start date in the range
        //        startDate: new Date(new Date().setDate(1)), // todo first month date
        //        //sets the end date in the range
        //        endDate: new Date(new Date(new Date().setMonth(new Date().getMonth() + 1)).setDate(0)), // todo last month date 
        //    });
        //    ui.startEndDatePicker.appendTo('#startEndDates');
        //} else {
        //    ui.startEndDatePicker.allowEdit = true;
        //}

        //var obj = [{
        //    accountId: ui.accountCodeSelected,
        //    startDate: ui.startEndDatePicker.startDate,
        //    endDate: ui.startEndDatePicker.endDate
        //}];

        //getAccountMovements(obj);

    }
    else { // 3 == Statistics

    }
}

