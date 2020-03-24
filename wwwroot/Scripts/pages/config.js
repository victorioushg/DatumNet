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
    //await api("/api/application/roles", null, res => {
    //    dta.roles = res;
    //});

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
                    header: { 'text': 'empresas' },
                    content: "#tabOrganization",
                },
                {
                    header: { 'text': 'usuarios' },
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
        toolbar: [
            { id: "add", prefixIcon: "e-add", tooltipText: "agregar registro" },
            { id: "edit", prefixIcon: "e-edit", tooltipText: "editar registro" },
            { id: "delete", prefixIcon: "e-delete", tooltipText: "eliminar registro" },
            { id: "print", prefixIcon: "e-print", tooltipText: "imprimir" },
            'Search'],
        editSettings: { showConfirmDialog: true, showDeleteConfirmDialog: true, allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
        columns: [
            { field: 'id', headerText: 'Organization ID', type: 'number', visible: false },
            { headerText: "<h4>empresas<h4>", disableHtmlEncode: false, template: "#orgTemplate", allowFiltering: false, customAttributes: { class: 'customgrid' } }, //
        ],
        gridLines: "None",
        height: window.innerHeight - 250,

        // Events
        queryCellInfo: function (args) {
            if (args.column.headerText === "<h4>empresas<h4>") {
                args.cell.firstElementChild.classList.add('colorforestgreen');
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
        toolbar: [
            { id: "add", prefixIcon: "e-add", tooltipText: "agregar registro" },
            { id: "edit", prefixIcon: "e-edit", tooltipText: "editar registro" },
            { id: "delete", prefixIcon: "e-delete", tooltipText: "eliminar registro" },
            { id: "print", prefixIcon: "e-print", tooltipText: "imprimir" },
            'Search'],
        editSettings: { showConfirmDialog: true, showDeleteConfirmDialog: true, allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
        columns: [
            { field: 'id', headerText: 'User ID', type: 'number', visible: false },
            { headerText: "<h4>usuarios<h4>", disableHtmlEncode: false, template: "#userTemplate", allowFiltering: false, customAttributes: { class: 'customgrid' } }, //
        ],
        gridLines: "None",
        height: window.innerHeight - 250,

        // Events
        queryCellInfo: function (args) {
            if (args.column.headerText === "<h4>usuarios<h4>") {
                args.cell.firstElementChild.classList.add('colordarkviolet');
            }
        },
        rowSelected: getUser,
        dataBound: function (args) {
        },
    });
    ui.usersGrid.appendTo("#usersGrid");

    // user roles grid
    ui.userRolesGrid = new ej.grids.Grid({
        allowResizing: false,
        allowGrouping: false,
        allowFiltering: true,

        filterSettings: { type: 'Excel' },
        width: "100%",
        toolbar: [
            { id: "add", prefixIcon: "e-add", tooltipText: "agregar registro" },
            { id: "update", prefixIcon: "e-update", tooltipText: "guardar" },
            { id: "cancel", prefixIcon: "e-cancel", tooltipText: "cancelar" },
            { id: "delete", prefixIcon: "e-delete", tooltipText: "eliminar registro" },
        ],
        editSettings: { showConfirmDialog: true, showDeleteConfirmDialog: true, allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
        columns: [
            { field: 'id', headerText: 'Role ID', type: 'number', visible: false },
            { field: 'name', headerText: "roles", allowFiltering: false }, //
        ],
        gridLines: "None",
        
        // Events
        queryCellInfo: function (args) {
        
        },
        rowSelected: function (args) {

        },
        dataBound: function (args) {
        },
    });
    ui.userRolesGrid.appendTo("#userRolesGrid");

    // user roles grid
    ui.userOrgsGrid = new ej.grids.Grid({
        allowResizing: false,
        allowGrouping: false,
        allowFiltering: true,

        filterSettings: { type: 'Excel' },
        width: "100%",
        toolbar: [
            { id: "add", prefixIcon: "e-add", tooltipText: "agregar registro" },
            { id: "update", prefixIcon: "e-update", tooltipText: "guardar" },
            { id: "cancel", prefixIcon: "e-cancel", tooltipText: "cancelar" },
            { id: "delete", prefixIcon: "e-delete", tooltipText: "eliminar registro" },
        ],
        editSettings: { showConfirmDialog: true, showDeleteConfirmDialog: true, allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
        columns: [
            { field: 'id', headerText: 'Role ID', type: 'number', visible: false },
            { field: 'Name', headerText: "empresas", allowFiltering: false }, //
        ],
        gridLines: "None",

        // Events
        queryCellInfo: function (args) {

        },
        rowSelected: function (args) {

        },
        dataBound: function (args) {
        },
    });
    ui.userOrgsGrid.appendTo("#userOrgsGrid");

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

function getUser(args) {
    ui.selectedUser = args.data;
    ui.userRolesGrid.dataSource = args.data.userRoles;
} 