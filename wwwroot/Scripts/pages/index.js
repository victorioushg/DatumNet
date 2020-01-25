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
                    header: { 'text': 'Cuentas Contables' },
                    content: "#accountsGrid",
                },
                {
                    header: { 'text': 'Movimientos' },
                    content: 'Facebook is an online social networking service headquartered in Menlo Park, California. Its website was ' +
                        'launched on February 4, 2004, by Mark Zuckerberg with his Harvard College roommates and fellow students Eduardo ' +
                        'Saverin, Andrew McCollum, Dustin Moskovitz and Chris Hughes.The founders had initially limited the website\'\s ' +
                        'membership to Harvard students, but later expanded it to colleges in the Boston area, the Ivy League, and Stanford ' +
                        'University. It gradually added support for students at various other universities and later to high-school students.'
                },
                {
                    header: { 'text': 'WhatsApp' },
                    content: 'WhatsApp Messenger is a proprietary cross-platform instant messaging client for smartphones that operates ' +
                        'under a subscription business model. It uses the Internet to send text messages, images, video, user location and ' +
                        'audio media messages to other users using standard cellular mobile numbers. As of February 2016, WhatsApp had a user ' +
                        'base of up to one billion,[10] making it the most globally popular messaging application. WhatsApp Inc., based in ' +
                        'Mountain View, California, was acquired by Facebook Inc. on February 19, 2014, for approximately US$19.3 billion.'
                }
            ]
        });
    tabObj.appendTo('#accountsTab');
    tabObj.select(0); 

    api("/api/accounting", null, res => {
        dta.accounts = res;
        ui.accountsGrid = new Grid({
            id: "#accountsGrid",
            allowFiltering: false,
            showColumnChooser: false,
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

            }
        }).render();


    });
})

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

function populateGrid(data) {

    var encabLine = data[$(" .pre-headers").val() - 1 || 0];
    var cols = Object.keys(encabLine);
    ui.uploadedGrid = new Grid({
        id: '#uploadedGrid',
        columns: cols,
        dataSource: data,
        canEdit: true,
        canDelete: true,
        canAdd: true,
        editButtonVisible: true,
        actionBegin: function (args) {

        }
    }).render();
}
