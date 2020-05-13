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
                        api("/api/application/phonetypes", null,
                            data => {
                                dta.phoneTypes = data.map(p => ({
                                    phoneType: p.value,
                                    value: p.value
                                }));
                                defineComponents();
                            });
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
            text: 'typeDescription', value: 'assosiationType'
        },
        width: "100%",
        placeholder: "tipo de asociacion"
    });
    ui.associationTypeDdl.appendTo(' .association-type');

    //Addresses Grid
    ui.addressesGrid = new ej.grids.Grid({
        width: '100%',
        toolbar: [
            { template: '<label class="edit-label" style="width: 300px">direcciones</label>' },
            { template: '<button class="e-btn" id="address-add-btn"></button>', tooltipText : 'agregar direccion' }, 
            { template: '<button class="e-btn" id="address-edit-btn"></button>', tooltipText : 'editar direccion' }, 
            { template: '<button class="e-btn" id="address-delete-btn"></button>', tooltipText : 'eliminar direccion' }, 
            { template: '<button class="e-btn" id="address-update-btn"></button>', tooltipText : 'guardar' }, 
            { template: '<button class="e-btn" id="address-cancel-btn"></button>', tooltipText : 'cancelar' }, 
        ],
        columns: [
            { width: 60, commands: [  { type: 'google maps',  buttonOption: { cssClass: 'e-flat', iconCss:'fa fa-map-marker-alt', click: onAddressClick } }] },
            { field: 'completeAddress' },
        ], 
        //Events
    });
    ui.addressesGrid.appendTo('#addressesGrid');
    ui.addressAddBtn = new ej.buttons.Button({ cssClass: `edit-label`, iconCss: 'fas fa-plus' });
    ui.addressEditBtn = new ej.buttons.Button({ cssClass: `edit-label`, iconCss: 'fas fa-pencil-alt' });
    ui.addressDeleteBtn = new ej.buttons.Button({ cssClass: `edit-label`, iconCss: 'fas fa-trash-alt' });
    ui.addressSaveBtn = new ej.buttons.Button({ cssClass: `edit-label`, iconCss: 'fas fa-check' });
    ui.addressCancelBtn = new ej.buttons.Button({ cssClass: `edit-label`, iconCss: 'fas fa-times' });
    ui.addressAddBtn.appendTo('#address-add-btn');
    ui.addressEditBtn.appendTo('#address-edit-btn');
    ui.addressDeleteBtn.appendTo('#address-delete-btn');
    ui.addressSaveBtn.appendTo('#address-update-btn');
    ui.addressCancelBtn.appendTo('#address-cancel-btn');


    //Emails Grid
    ui.emailsGrid = new ej.grids.Grid({
        width: '100%',
        toolbar: [
            { template: '<label class="edit-label" style="width: 300px">emails</label>' },
            { template: '<button class="e-btn" id="email-add-btn"></button>', tooltipText: 'agregar email' },
            { template: '<button class="e-btn" id="email-edit-btn"></button>', tooltipText: 'editar email' },
            { template: '<button class="e-btn" id="email-delete-btn"></button>', tooltipText: 'eliminar email' },
            { template: '<button class="e-btn" id="email-update-btn"></button>', tooltipText: 'guardar' },
            { template: '<button class="e-btn" id="email-cancel-btn"></button>', tooltipText: 'cancelar' },
        ],
        columns: [
            { field: 'EmailAddress' },
        ], 
    });
    ui.emailsGrid.appendTo('#emailsGrid');
    ui.emailAddBtn = new ej.buttons.Button({ cssClass: `edit-label`, iconCss: 'fas fa-plus' });
    ui.emailEditBtn = new ej.buttons.Button({ cssClass: `edit-label`, iconCss: 'fas fa-pencil-alt' });
    ui.emailDeleteBtn = new ej.buttons.Button({ cssClass: `edit-label`, iconCss: 'fas fa-trash-alt' });
    ui.emailSaveBtn = new ej.buttons.Button({ cssClass: `edit-label`, iconCss: 'fas fa-check' });
    ui.emailCancelBtn = new ej.buttons.Button({ cssClass: `edit-label`, iconCss: 'fas fa-times' });
    ui.emailAddBtn.appendTo('#email-add-btn');
    ui.emailEditBtn.appendTo('#email-edit-btn');
    ui.emailDeleteBtn.appendTo('#email-delete-btn');
    ui.emailSaveBtn.appendTo('#email-update-btn');
    ui.emailCancelBtn.appendTo('#email-cancel-btn');


    //Phones Grid
    ui.phonesGrid = new ej.grids.Grid({
        width: '100%',
        toolbar: [
            { template: '<label class="edit-label" style="width: 300px">telefonos</label>' },
            { template: '<button class="e-btn" id="phone-add-btn"></button>', tooltipText: 'agregar' },
            { template: '<button class="e-btn" id="phone-edit-btn"></button>', tooltipText: 'editar' },
            { template: '<button class="e-btn" id="phone-delete-btn"></button>', tooltipText: 'eliminar' },
            { template: '<button class="e-btn" id="phone-update-btn"></button>', tooltipText: 'guardar' },
            { template: '<button class="e-btn" id="phone-cancel-btn"></button>', tooltipText: 'cancelar' },
        ],
        columns: [
            { field: 'PhoneType', width : '30%' },
            { field: 'PhoneNumber', width : '70%' },
        ], 
    });
    ui.phonesGrid.appendTo('#phonesGrid');
    ui.phoneAddBtn = new ej.buttons.Button({ cssClass: `edit-label`, iconCss: 'fas fa-plus' });
    ui.phoneEditBtn = new ej.buttons.Button({ cssClass: `edit-label`, iconCss: 'fas fa-pencil-alt' });
    ui.phoneDeleteBtn = new ej.buttons.Button({ cssClass: `edit-label`, iconCss: 'fas fa-trash-alt' });
    ui.phoneSaveBtn = new ej.buttons.Button({ cssClass: `edit-label`, iconCss: 'fas fa-check' });
    ui.phoneCancelBtn = new ej.buttons.Button({ cssClass: `edit-label`, iconCss: 'fas fa-times' });
    ui.phoneAddBtn.appendTo('#phone-add-btn');
    ui.phoneEditBtn.appendTo('#phone-edit-btn');
    ui.phoneDeleteBtn.appendTo('#phone-delete-btn');
    ui.phoneSaveBtn.appendTo('#phone-update-btn');
    ui.phoneCancelBtn.appendTo('#phone-cancel-btn');

    // Organization Users Grid
    ui.organizationUsersGrid = new ej.grids.Grid({
        width: '100%',
        toolbar: [
            { template: '<label class="edit-label" style="width: 300px">usuarios</label>' },
            { template: '<button class="e-btn" id="orguser-add-btn"></button>', tooltipText: 'agregar' },
            { template: '<button class="e-btn" id="orguser-edit-btn"></button>', tooltipText: 'editar' },
            { template: '<button class="e-btn" id="orguser-delete-btn"></button>', tooltipText: 'eliminar' },
            { template: '<button class="e-btn" id="orguser-update-btn"></button>', tooltipText: 'guardar' },
            { template: '<button class="e-btn" id="orguser-cancel-btn"></button>', tooltipText: 'cancelar' },
        ],
        columns: [
            { field: 'UserName' },
        ], 
    });
    ui.organizationUsersGrid.appendTo('#organizationUsersGrid');
    ui.orguserAddBtn = new ej.buttons.Button({ cssClass: `edit-label`, iconCss: 'fas fa-plus' });
    ui.orguserEditBtn = new ej.buttons.Button({ cssClass: `edit-label`, iconCss: 'fas fa-pencil-alt' });
    ui.orguserDeleteBtn = new ej.buttons.Button({ cssClass: `edit-label`, iconCss: 'fas fa-trash-alt' });
    ui.orguserSaveBtn = new ej.buttons.Button({ cssClass: `edit-label`, iconCss: 'fas fa-check' });
    ui.orguserCancelBtn = new ej.buttons.Button({ cssClass: `edit-label`, iconCss: 'fas fa-times' });
    ui.orguserAddBtn.appendTo('#orguser-add-btn');
    ui.orguserEditBtn.appendTo('#orguser-edit-btn');
    ui.orguserDeleteBtn.appendTo('#orguser-delete-btn');
    ui.orguserSaveBtn.appendTo('#orguser-update-btn');
    ui.orguserCancelBtn.appendTo('#orguser-cancel-btn');


    ui.ddlPhonesTypes = new ej.dropdowns.DropDownList({
        dataSource: dta.phoneTypes,
        fields: { text: 'phoneType', value: 'phoneType' },
        width: '100%',
    });

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

    ui.logoAddBtn = new ej.buttons.Button({
        cssClass: `edit-label`,
        iconCss: 'fas fa-plus'
    });
    ui.logoAddBtn.appendTo('#logo-add-btn');

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

    api("/api/application/" + args.data.id + "/addresses", null, res => {
        dta.addresses = res;
        ui.addressesGrid.dataSource = dta.addresses;
    });

    $('.form-org .name-org').val(args.data.name);
    $('.form-org .activity').val(args.data.activity);
    $('.form-org .fiscal-id').val(args.data.fiscalID);
    ui.organizationTypeDdl.value = args.data.organizationType;
    ui.associationTypeDdl.value = args.data.assosiationType;

    ui.admission.value = args.data.addedOn;
    ui.fiscalPeriodFrom.value = args.data.fiscalPeriodFrom;
    ui.fiscalPeriodTo.value = args.data.fiscalPeriodTo;
}

function onAddressClick(args) {
    ui.addressSelected = ui.addressesGrid.getRowObjectFromUID(args.target.closest('.e-row').getAttribute('data-uid')).data;
    window.open("http://maps.google.com/?q=" + ui.addressSelected.completeAddress );
}
