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
        toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Print',],
        editSettings: { showConfirmDialog: true, showDeleteConfirmDialog: true, allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
        columns: [
            { field: 'id', headerText: 'Organization ID', type: 'number', visible: false },
            { field: 'name', width: '40%', headerText: 'Nombre / Descripcion', allowFiltering: false, },
            { field: 'fiscalID', headerText: 'Numero Fiscal', width: '20%', allowFiltering: false, },
            { field: 'organizationType', headerText: 'Tipo', width: '20%', allowFiltering: false, },
            { heatherText: "" }
        ],
        gridLines: "None",
        height: window.innerHeight - 250,

        // Parent Events
        rowSelected: function (args) {
            ui.accountCodeSelected = args.data.accountCode;
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
        toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Print',],
        editSettings: { showConfirmDialog: true, showDeleteConfirmDialog: true, allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
        columns: [
            { field: 'id', headerText: 'User ID', type: 'number', visible: false },
            { field: 'userName', width: '40%', headerText: 'Usuario', allowFiltering: false, },
            { field: 'email', headerText: 'e-mail', width: '20%', allowFiltering: false, },
            { heatherText: "" }
        ],
        gridLines: "None",
        height: window.innerHeight - 250,

        // Parent Events
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

