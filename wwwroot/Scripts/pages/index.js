var dta = {}; // data namespace
var ui = {}; // ui components namespace

$(function () {

    //$.extend(ej, Syncfusion);
    ej.base.enableRipple(false);

    defineComponents();

    //Promise.all([
    api("/api/accounting/accounts", null, res => {
        dta.accounts = res;
    });
    //]);

    renderComponents();

});

function renderComponents() {
 ui.accountsGrid.dataSource = dta.accounts;
}

function defineComponents() {

    ui.tabObj = new ej.navigations.Tab(
        {
            heightAdjustMode: 'None',
            height: 390,
            showCloseButton: false,
            selecting: selectTab,
            items: [
                {
                    header: { 'text': 'cuentas contables' },
                    content: "#accounts",
                },
                {
                    header: { 'text': 'movimientos' },
                    content: "#accountMovements"
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
    ui.movementsGrid = new ej.grids.Grid({
        allowResizing: false,
        allowGrouping: true,
        //allowFiltering: false,
        //showColumnChooser: false,
        toolbar: ['Add', 'Edit', 'Delete', 'Print'],
        width: "100%",
        height: window.innerHeight - 350,
        columns: [
            { field: "policyId", visible: false },
            { field: 'policyCode', headerText: 'Asiento Contable', width: '15%' },
            { field: "policyDate", headerText: "Fecha Asiento", width: '15%', type: 'date', format: 'MM/dd/yyyy' },
            { field: "reference", headerText: "Referencia", width: '15%' },
            { field: "description", headerText: "Concepto", width: '40%' },
            { field: "amount", headerText: "Importe", width: '15%', type: 'number', format: 'N2', textAlign: 'Right' },
        ],
        //gridLines: ej.Grid.GridLines.None,
        //editButtonVisible: true,
    });
    ui.movementsGrid.appendTo("#movementsGrid")

} // Accounts
    ui.accountsGrid = new ej.grids.Grid({
        allowResizing: false,
        allowGrouping: false,
        //showColumnChooser: false,
        //width: "100%",
        toolbar: ['Add', 'Edit', 'Delete', 'Print'],
        width: "100%",
        columns: [
            { field: 'id', headerText: 'Account ID', type: 'number', visible: false },
            { field: 'accountCode', width: '20%', headerText: 'Account Code' },
            { field: 'description', headerText: 'Account Name', width: '40%' },
            { heatherText: "" }
        ],
        //gridLines: ej.Grid.GridLines.None,
        height: window.innerHeight - 250,
        //editButtonVisible: true,
        //actionBegin: function (args) {

        //},
        //queryCellInfo: function (args) {
        //    if (args.column.field == "description") {
        //        //args.cell.style.color = "red";
        //        args.cell.style.paddingLeft = ((args.rowData.level - 1) * 10).toString() + "px";
        //    };
        //},
        rowSelected: function (args) {
            //$("#accountLabel").text(args.data.accountCode + "   " + args.data.description);
            //var x = document.getElementById('accountLabel').rows[0].cells;
            ui.accountCodeSelected = args.data.accountCode;
            //x[0].innerHTML = args.data.accountCode;
            //x[1].innerHTML = args.data.description;
        },
    });
    ui.accountsGrid.appendTo("#accountsGrid");

function clearSelectedAccount() {
    //ui.movementsGrid.render({
    //    dataSource: []
    //});
    var x = document.getElementById('accountLabel').rows[0].cells;
    x[0].innerHTML = "";
    x[1].innerHTML = "";
}

function selectTab(e) {
    if (e.isSwiped) {
        e.cancel = true;
    }
}

function queryCellInfo(args) {

    if (args.column.field == "accountCode" && args.data.outcomeAccount == 1) {
        args.cell.style.fontWeight = "Bold"; /*custom css group cell */
    }
    if (args.column.field == "description") {
        var cellText = ' '.repeat(args.data.level * 2).concat(args.cell.textContent);
        args.cell.offsetLeft = args.data.level * 2;
        if (args.data.outcomeAccount == 1) args.cell.style.fontWeight = "Bold";
    }
}

function onTabSelected(args) {

    if (ui.startEndDatePicker) ui.startEndDatePicker.allowEdit = false;

    if (args.selectedIndex == 1) { // 1 == Codes
    } else if (args.selectedIndex == 2) {// 2 == Movements
        if (!ui.startEndDatePicker) {
            ui.startEndDatePicker = new ej.calendars.DateRangePicker({
                placeholder: 'Select a range',
                //sets the start date in the range
                startDate: new Date(new Date().setDate(1)), // todo first month date
                //sets the end date in the range
                endDate: new Date(new Date(new Date().setMonth(new Date().getMonth() + 1)).setDate(0)), // todo last month date 
            });
            ui.startEndDatePicker.appendTo('#startEndDates');
        } else {
            ui.startEndDatePicker.allowEdit = true;
        }

        var obj = [{
            accountId: ui.accountCodeSelected,
            startDate: ui.startEndDatePicker.startDate,
            endDate: ui.startEndDatePicker.endDate
        }];

        api("/api/accounting/movements/" + ui.accountCodeSelected, null, res => {
            dta.movements = res;
            ui.movementsGrid.dataSource = dta.movements;
        });

    }
    else { // 3 == Statistics

    }
}

function renderMovementsGrid() {

}