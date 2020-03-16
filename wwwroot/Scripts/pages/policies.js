var dta = {}; // data namespace
var ui = {}; // ui components namespace

$(function(){

    ej.grids.Grid.Inject(ej.grids.DetailRow);
    ej.grids.Grid.Inject(ej.grids.Toolbar);
    ej.base.enableRipple(false);

    // Policies
    ui.policiesGrid = new ej.grids.Grid({

        // Parent Properties
        allowResizing: false,
        allowGrouping: false,
        allowFiltering: true,

        filterSettings: { type: 'Excel' },
        width: "100%",
        toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Print', { type: "Separator" }, { template: '#toolbarTemplate' }],
        editSettings: { showConfirmDialog: true, showDeleteConfirmDialog: true, allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
        //toolbarTemplate: '#toolbarTemplate',
        width: "100%",
        columns: [
            { field: "id", visible: false },
            { field: 'policyCode', headerText: 'Asiento Contable', width: '15%' },
            { field: "policyDate", headerText: "Fecha Asiento", width: '15%', type: 'date', format: 'MM/dd/yyyy' },
            { field: "description", headerText: "Descripcion", },
            { field: "debits", headerText: "Debitos", width: '15%', type: 'number', format: 'N2', textAlign: 'Right' },
            { field: "credits", headerText: "Creditos", width: '15%', type: 'number', format: 'N2', textAlign: 'Right' },
            { field: "due", headerText: "Saldo", width: '15%', type: 'number', format: 'N2', textAlign: 'Right' },
        ],
        gridLines: "None",
        height: window.innerHeight - 250,

        //// Parent Events
        rowSelected: function (args) {
            ui.accountCodeSelected = args.data.accountCode;
        },
        dataBound: function (args) {
            ui.startEndDatePicker.appendTo('#dtpStartEndDates');
        },

        //// ChildeGrid
        childGrid: {
            allowResizing: false,
            allowGrouping: false,
            queryString: 'policyId',
            width: '100%',
            columns: [
                { field: "policyId", visible: false },
                { field: 'rowOrder', headerText: 'Row #', width: '15%' },
                { field: "accountCode", headerText: "Codigo Cuenta", width: '15%',  },
                { field: "reference", headerText: "Reference", width: '15%',  },
                { field: "description", headerText: "Descripcion", width: '40%' },
                { field: "amount", headerText: "Importe", width: '15%', type: 'number', format: 'N2', textAlign: 'Right' },
            ],
            //aggregates: [{
            //    columns: [{
            //        type: 'Sum',
            //        field: 'amount',
            //        format: 'C2',
            //        footerTemplate: 'Suma Total: ${Sum}'
            //    }]
            //}],

            // Child Events
            load: function (args) {
                this.parentDetails.parentKeyFieldValue = this.parentDetails.parentRowData['id'];
            }
        },

        detailDataBound: function (args) {

            ui.rowSelected = args.detailElement.parentNode.rowIndex;
            ui.policyIdSelected = args.data.id;

            // Get child data dinamicly when parent expand 
            api("/api/accounting/policy/" + ui.policyIdSelected + "/lines", null, res => {
                dta.policyLines = res;
                args.childGrid.dataSource = dta.policyLines;
            });

        },
    });
    ui.policiesGrid.appendTo("#policiesGrid");

    ui.startEndDatePicker = new ej.calendars.DateRangePicker({
        placeholder: 'Select a range',
        //sets the start date in the range
        startDate: new Date(new Date().setDate(1)), // todo first month date
        //sets the end date in the range
        endDate: new Date(new Date(new Date().setMonth(new Date().getMonth() + 1)).setDate(0)), // todo last month date ,
        width: 300
    });

    Promise.all([
        api("/api/accounting/policies/" + ui.startEndDatePicker.startDate.toISOString() + "/" + ui.startEndDatePicker.endDate.toISOString(),
            null, res => {
            dta.policies = res;
            ui.policiesGrid.dataSource = dta.policies;
        }),
    ]).then();
});
