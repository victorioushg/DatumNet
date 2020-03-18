var dta = {}; // data namespace
var ui = {}; // ui components namespace

$(function () {

    //$.extend(ej, Syncfusion); // extends to use Syncfusion Javascript JS1
    ej.grids.Grid.Inject(ej.grids.DetailRow);
    ej.grids.Grid.Inject(ej.grids.Toolbar);
    ej.base.enableRipple(false);

    defineComponents();

    getData();

});

async function getData() {

    await api("/api/application/organization", null, res => {
        dta.orgs = res;
        ui.orgsGrid.dataSource = dta.orgs;
    });
    await api("/api/application/users", null, res => {
        dta.users = res;
        ui.usersGrid.dataSource = dta.users;
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
                    header: { 'text': 'Empresas' },
                    content: "#tabOrganization",
                },
                {
                    header: { 'text': 'Usuarios' },
                    content: '#tabUsers'
                }
            ],
            selected: onTabSelected,
        });
    ui.tabObj.appendTo('#configTab');

    // Organizations
    ui.orgsGrid = new ej.grids.Grid({
        allowResizing: false,
        allowGrouping: false,
        allowFiltering: true,

        filterSettings: { type: 'Excel' },
        width: "100%",
        toolbar: ['Add', 'Edit', 'Delete', 'Print'],
        editSettings: { showConfirmDialog: true, showDeleteConfirmDialog: true, allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
        columns: [
            { field: 'id', headerText: 'Organization ID', type: 'number', visible: false },
            { headerText: "<h4>Empresas<h4>", disableHtmlEncode: false, template: "#orgTemplate", allowFiltering: false, customAttributes: { class: 'customgrid' } }, //
        ],
        gridLines: "None",
        height: window.innerHeight - 250,

        // Events
        queryCellInfo: function (args) {
            if (args.column.headerText === "<h4>Empresas<h4>") {
                args.cell.firstElementChild.classList.add('others');
            }
        },
        rowSelected: function (args) {
        },
        dataBound: function (args) {
        },
    });
    ui.orgsGrid.appendTo("#orgsGrid");

    // Users
    ui.usersGrid = new ej.grids.Grid({
        allowResizing: false,
        allowGrouping: false,
        allowFiltering: true,

        filterSettings: { type: 'Excel' },
        width: "100%",
        toolbar: ['Add', 'Edit', 'Delete', 'Print'],
        editSettings: { showConfirmDialog: true, showDeleteConfirmDialog: true, allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
        columns: [
            { field: 'id', headerText: 'User ID', type: 'number', visible: false },
            { headerText: "<h4>Usuarios<h4>", disableHtmlEncode: false, template: "#userTemplate", allowFiltering: false, customAttributes: { class: 'customgrid' } }, //
        ],
        gridLines: "None",
        height: window.innerHeight - 250,

        // Parent Events
        queryCellInfo: function (args) {
            if (args.column.headerText === "<h4>Usuarios<h4>") {
                args.cell.firstElementChild.classList.add('capital');
            }
        },
        rowSelected: function (args) {

        },
        dataBound: function (args) {
        },
    });
    ui.usersGrid.appendTo("#usersGrid");

}

function selectTab(e) {
    if (e.isSwiped) {
        e.cancel = true;
    }
}
function onTabSelected(args) {
    if (args.selectedIndex == 0) { // 1 == Codes
        //alert('TAB 1');
    } else if (args.selectedIndex == 1) {// 2 == Movements
        //alert('TAB 2');
    }
    else {
    }
}

