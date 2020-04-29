var dta = {}; // data namespace
var ui = {}; // ui components namespace

var addressOpen = false; 
$(function () {

    //$.extend(ej, Syncfusion); // extends to use Syncfusion Javascript JS1
    ej.grids.Grid.Inject(ej.grids.DetailRow);
    ej.grids.Grid.Inject(ej.grids.Toolbar);
    ej.base.enableRipple(false);

    api("/api/application/organization", null, res => {
        dta.orgs = res;
        api("/api/application/organization/types", null, res => {
            dta.orgsTypes = res;
            api("/api/application/assosiations", null, res => {
                dta.assocTypes = res;
                api("/api/application/users", null, res => {
                    dta.users = res;
                    api("/api/application/roles", null, res => {
                        dta.roles = res;
                        defineComponents();
                    });
                });
            });
        });
    });

});

function defineComponents() {

    ui.tabObj = new ej.navigations.Tab(
        {
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

    // ORGANIZATIONS
    ui.orgsGrid = new ej.grids.Grid({
        allowResizing: false,
        allowGrouping: false,
        allowFiltering: true,
        dataSource: dta.orgs,
        filterSettings: { type: 'Excel' },
        width: "100%",
        toolbar: ["Add", "Print", "Search"],
        editSettings: { showConfirmDialog: true, showDeleteConfirmDialog: true, allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
        columns: [
            { field: 'id', headerText: 'Organization ID', type: 'number', visible: false },
            { headerText: "<h4>empresas<h4>", disableHtmlEncode: false, template: "#orgTemplate", allowFiltering: false, customAttributes: { class: 'customgrid' } }, //
        ],
        gridLines: "None",
        height: window.innerHeight - 250,

        // Events
        toolbarClick: function (args) {
            args.cancel = true;
        },
        queryCellInfo: function (args) {
            if (args.column.headerText === "<h4>empresas<h4>") {
                args.cell.firstElementChild.classList.add('colorforestgreen');
            }
        },
        rowSelected: setOrg,
        dataBound: function (args) {
        },
    });
    ui.orgsGrid.appendTo("#orgsGrid");

    ui.organizationTypeDdl = new ej.dropdowns.DropDownList({
        dataSource: dta.orgsTypes,
        fields: { text: 'organizationType', value: 'organizationType' },
        width: "100%",
        placeholder: "tipo de empresa"
    });
    ui.organizationTypeDdl.appendTo(' .organization-type');

    ui.associationTypeDdl = new ej.dropdowns.DropDownList({
        dataSource: dta.assocTypes,
        fields: {
            text: 'typeDescription', value: 'assosiationType' },
        width: "100%",
        placeholder: "tipo de asociacion"
    });
    ui.associationTypeDdl.appendTo(' .association-type');

    ui.fiscalPeriodFrom = new ej.calendars.DatePicker({
        enabled: false, 
        format: 'dd-MM-yyyy',
        placeholder: "periodo fiscal desde"
    });
    ui.fiscalPeriodFrom.appendTo(' .period-from')

    ui.fiscalPeriodTo = new ej.calendars.DatePicker({
        enabled: false, 
        format: 'dd-MM-yyyy',
        placeholder: "periodo fiscal hasta"
    });
    ui.fiscalPeriodTo.appendTo(' .period-end')

    ui.admission = new ej.calendars.DatePicker({
        width: "100%",
        format: 'dd-MM-yyyy',
        placeholder: "fecha de ingreso"
    });
    ui.admission.appendTo(' .admission')

    // USERS
    ui.usersGrid = new ej.grids.Grid({
        allowResizing: false,
        allowGrouping: false,
        allowFiltering: true,
        dataSource: dta.users,
        filterSettings: { type: 'Excel' },
        width: "100%",
        toolbar: ["Add", "Print", "Search"],
        editSettings: { showConfirmDialog: true, showDeleteConfirmDialog: true, allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
        columns: [
            { field: 'id', headerText: 'User ID', type: 'number', visible: false },
            { headerText: "<h4>usuarios<h4>", disableHtmlEncode: false, template: "#userTemplate", allowFiltering: false, customAttributes: { class: 'customgrid' } }, //
        ],
        gridLines: "None",
        height: window.innerHeight - 250,

        // Events
        toolbarClick: function (args) {
            args.cancel = true
        },
        queryCellInfo: function (args) {
            if (args.column.headerText === "<h4>usuarios<h4>") {
                args.cell.firstElementChild.classList.add('colordarkviolet');
            }
        },
        rowSelected: setUser,
        dataBound: function (args) {
        },
    });
    ui.usersGrid.appendTo("#usersGrid");

    // USER ROLES grid
    ui.userRolesGrid = new ej.grids.Grid({
        allowResizing: false,
        allowGrouping: false,
        allowFiltering: true,
        filterSettings: { type: 'Excel' },
        width: "100%",
        toolbar: [{ text: "roles de usuario", cssClass: 'e-txt-casing' }, 'Add', 'Update', 'Cancel'],
        editSettings: { showConfirmDialog: true, showDeleteConfirmDialog: true, allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
        columns: [
            { field: 'id', headerText: 'Role ID', type: 'number', visible: false, isPrimaryKey: true },
            {
                field: 'name', headerText: "<h5>roles</h5>", disableHtmlEncode: false, allowFiltering: false,
                foreignKeyfield: 'id', foreignKeyValue: 'name', editType: "dropdownedit", dataSource: dta.roles,
            },
        ],
        gridLines: "None",

        // Events
        load: function (args) {
        },
        toolbarClick: function (args) {
        },
        queryCellInfo: function (args) {

        },
        rowSelected: function (args) {

        },
        dataBound: function (args) {
        },
    });
    ui.userRolesGrid.appendTo("#userRolesGrid");


    // USER ORGANIZATIONS grid
    ui.userOrgsGrid = new ej.grids.Grid({
        allowResizing: false,
        allowGrouping: false,
        allowFiltering: true,

        filterSettings: { type: 'Excel' },
        width: "100%",
        toolbar: [{ text: "empresas", cssClass: 'e-txt-casing' }, 'Add', 'Update', 'Cancel'],
        editSettings: { showConfirmDialog: true, showDeleteConfirmDialog: true, allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
        columns: [
            { field: 'id', headerText: 'Organization ID', type: 'number', visible: false, isPrimaryKey: true },
            {
                field: 'name', headerText: "<h5>empresas</h5>", disableHtmlEncode: false, allowFiltering: false,
                foreignKeyfield: 'id', foreignKeyValue: 'name', editType: "dropdownedit", dataSource: dta.orgs,
            },
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

function setUser(args) {
    ui.selectedUser = args.data;
    ui.userRolesGrid.dataSource = args.data.userRoles;
    ui.userOrgsGrid.dataSource = args.data.userOrgs;

    $('.form-user .first-name').val(args.data.firstName);
    $('.form-user .last-name').val(args.data.lastName);
    $('.form-user .birthDay').val(args.data.birthDay);
    $('.form-user .user-name').val(args.data.userName);
    $('.form-user .email').val(args.data.email);
    $('.form-user .phone-number').val(args.data.phoneNumber);

}

function setOrg(args) {
    ui.selectedOrg = args.data;

    $('.form-org .name-org').val(args.data.name);
    $('.form-org .activity').val(args.data.activity);
    $('.form-org .fiscal-id').val(args.data.fiscalID);
    ui.organizationTypeDdl.value = args.data.organizationType;
    ui.associationTypeDdl.value = args.data.assosiationType;
    ui.admission.value = args.data.addedOn;
    ui.fiscalPeriodFrom.value = args.data.fiscalPeriodFrom; 
    ui.fiscalPeriodTo.value = args.data.fiscalPeriodTo;
}

//--> Address
function EditAddress(id) {

    if (!addressOpen) {

        if (id == 0) {
            var addressForm = new MultiAddressForm({
                id: 'addAddress',
                addresses: [{
                    addressTypeId: 1,
                    address1: '',
                    address2: '',
                    address3: '',
                    city: '',
                    county: '',
                    state: '',
                    country: '',
                    postalCode: '',
                }],
                onsave: (id, a) => {
                    // Insert Id
                    api("/api/application/" + ui.selectedOrg.id + "/address", a, result => {
                        toast(" Location added successfully ", msgType.Success);
                        $('#addAddress').html("");
                        //$('#addAddressType').hide();
                        // CustomerInfoDetail(ui.popupCustomerInfo.customerId);
                    }, 'POST');
                }
            }).addAddress();
        }

        addressOpen = true;
    } else {
        //$('#addAddressType').hide();
        $('#addAddress').html("");
        addressOpen = false;
    }
}