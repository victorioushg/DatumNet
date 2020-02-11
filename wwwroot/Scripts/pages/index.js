var dta = {}; // data namespace
var ui = {}; // ui components namespace


$(function () {

    $.extend(ej, Syncfusion);
    ej.base.enableRipple(true);

    var tabObj = new ej.navigations.Tab(
        {
            //selecting: select,
            items: [
                {
                    header: { 'text': 'cuentas contables' },
                    content: "#accountsGrid",
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

            selected: onTabSelected

        });
    tabObj.appendTo('#accountsTab');
    tabObj.select(0);

    api("/api/accounting", null, res => {
        dta.accounts = res;
        ui.accountsGrid = new Grid({
            id: "#accountsGrid",
            allowFiltering: false,
            //allowGrouping: false,
            showColumnChooser: false,
            width: "90%",
            columns: [
                { field: "id", visible: false },
                { field: "accountCode", headerText: "Codigo Contable", width: 200 },
                { field: "description", headerText: "Descripcion" },
                { headerText: "", width: 600 },
            ],
            queryCellInfo: "queryCellInfo",
            gridLines: ej.Grid.GridLines.None,
            dataSource: dta.accounts,
            canEdit: true,
            canDelete: true,
            canAdd: true,
            editButtonVisible: true,
            actionBegin: function (args) {

            },
            queryCellInfo: function (args) {
                if (args.column.field == "description") {
                    //args.cell.style.color = "red";
                    args.cell.style.paddingLeft = ((args.rowData.level - 1) * 10).toString() + "px";
                };
            },
            rowSelected: function (args) {
                //$("#accountLabel").text(args.data.accountCode + "   " + args.data.description);
                var x = document.getElementById('accountLabel').rows[0].cells;
                ui.accountCodeSelected = args.data.accountCode;
                x[0].innerHTML = args.data.accountCode;
                x[1].innerHTML = args.data.description;
            },
        }).render();
    });

   

});

function clearSelectedAccount() {
    var x = document.getElementById('accountLabel').rows[0].cells;
    x[0].innerHTML = "";
    x[1].innerHTML = "";
}

function select(e) {
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
                endDate: new Date(new Date(new Date().setMonth( new Date().getMonth() + 1)).setDate(0)), // todo last month date 
            });
            ui.startEndDatePicker.appendTo('#startEndDates');
        } else {
            ui.startEndDatePicker.allowEdit = true;
        }

    }
    else { // 3 == Statistics
        
    }
}