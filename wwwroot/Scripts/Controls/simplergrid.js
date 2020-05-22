class simplegrid {

    constructor(args) {

        // 
        this.id = args.id;
        this.dataSource = args.dataSource;
        this.width = args.width === undefined ? "100%" : args.width;
        this.columns = args.columns;
        this.buttons = args.buttons; // [{ idAdd : } , {idEdit : }, {idDelete : }, {idSave : }, {idCancel :  }]
        this.actionComplete = args.actionComplete == undefined ? null : args.actionComplete; 

        // Controls
        this.simpleGridAddBtn = new ej.buttons.Button({ cssClass: `edit-label`, iconCss: 'fas fa-plus' });
        this.simpleGridEditBtn = new ej.buttons.Button({ cssClass: `edit-label`, iconCss: 'fas fa-pencil-alt' });
        this.simpleGridDeleteBtn = new ej.buttons.Button({ cssClass: `edit-label`, iconCss: 'fas fa-trash-alt' });
        this.simpleGridSaveBtn = new ej.buttons.Button({ cssClass: `edit-label`, iconCss: 'fas fa-check' });
        this.simpleGridCancelBtn = new ej.buttons.Button({ cssClass: `edit-label`, iconCss: 'fas fa-times' });

        //Edit Settings
        if (args.editSettings === undefined) {
            this.allowEditing = args.allowEditing === undefined ? true : args.allowEditing;
            this.allowAdding = args.allowAdding === undefined ? true : args.allowAdding;
            this.allowDeleting = args.allowDeleting === undefined ? true : args.allowDeleting;
            this.mode = args.mode == undefined ? "Dialog" : args.mode;
            this.template = args.template
        }

        this.simpleGrid = new ej.grids.Grid({
            width: this.width,
            editSettings: {
                showDeleteConfirmDialog: false,
                showConfirmDialog: false,
                allowEditing: this.allowEditing,
                allowAdding: this.allowAdding,
                allowDeleting: this.allowDeleting,
                mode: this.mode,
                template: this.template
            },
            toolbar: [
                { template: '<label class="edit-label" style="width: 300px">direcciones</label>' },
                { template: '<button class="e-btn" id="' + this.buttons[0].id + '"></button>', tooltipText: 'agregar' },
                { template: '<button class="e-btn" id="' + this.buttons[1].id + '"></button>', tooltipText: 'editar' },
                { template: '<button class="e-btn" id="' + this.buttons[2].id + '"></button>', tooltipText: 'eliminar' },
                { template: '<button class="e-btn" id="' + this.buttons[3].id + '"></button>', tooltipText: 'guardar' },
                { template: '<button class="e-btn" id="' + this.buttons[4].id + '"></button>', tooltipText: 'cancelar' },
            ],

            columns: this.columns,
            //Events
            actionComplete: this.actionComplete, 
        });
    }

    render(args) {

        this.simpleGrid.appendTo(this.id);

        this.simpleGridAddBtn.appendTo('#' + this.buttons[0].id);
        this.simpleGridEditBtn.appendTo('#' + this.buttons[1].id);
        this.simpleGridDeleteBtn.appendTo('#' + this.buttons[2].id);
        this.simpleGridSaveBtn.appendTo('#' + this.buttons[3].id);
        this.simpleGridCancelBtn.appendTo('#' + this.buttons[4].id);

        this.disable({ add: false, edit: false, delete: false, save: true, cancel: true });

        //Add
        this.simpleGridAddBtn.element.onclick = () => {
            this.disable({ add: true, edit: true, delete: true, save: false, cancel: false });
            this.simpleGrid.addRecord();
        };

        //Edit
        this.simpleGridEditBtn.element.onclick = () => {
            this.disable({ add: true, edit: true, delete: true, save: false, cancel: false });
            this.simpleGrid.startEdit();
        };

        //Delete
        this.simpleGridDeleteBtn.element.onclick = () => {
            this.disable({ add: true, edit: true, delete: true, save: false, cancel: false });
            this.simpleGrid.deleteRecord();
        };

        //Save
        this.simpleGridSaveBtn.element.onclick = () => {
            // Validate And Save
            this.disable({ add: false, edit: false, delete: false, save: true, cancel: true });
            this.simpleGrid.endEdit();
        };

        //Cancel
        this.simpleGridCancelBtn.element.onclick = () => {
            this.disable({ add: false, edit: false, delete: false, save: true, cancel: true });
            this.simpleGrid.closeEdit();
        };



    }

    // Todo Save Must Validate thge Form and save it into DB
    // Validation must be pass as args so as Add/Edit/Delete Methods
    validate(args) {

    }

    save(args) {
        // id args.mode = 'ADD' ....
    }

    delete(args) {

    }

    disable(args) {
        this.simpleGridAddBtn.disabled = args.add;
        this.simpleGridEditBtn.disabled = args.edit;
        this.simpleGridDeleteBtn.disabled = args.delete;
        this.simpleGridSaveBtn.disabled = args.save;
        this.simpleGridCancelBtn.disabled = args.cancel;
    }

}