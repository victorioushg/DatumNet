class AddressForm {

    constructor(args) {
        this.id = args.id;
        this._id = "#" + args.id;
    }

    render() {
        var templateElement = document.getElementById("address-template");
        var clonedTemplate = templateElement.content.cloneNode(true);
        document.getElementById(this.id).appendChild(clonedTemplate);

        this.ddlLocationTypes = new ej.dropdowns.DropDownList({

            fields: {
                text: 'addressType', value: 'addressType'
            },
            width: "100%",
            placeholder: "tipo de asociacion",
            change: "onChangeLocationType",
        });
        api("/api/application/address/types", null,
            addressTypes => {
                this.ddlLocationTypes.dataSource = addressTypes;
            });
        this.ddlLocationTypes.appendTo(this._id + ' .address-type');

        // add listener to postal code field to fetch city data from api
        //$(this._id + ' .address-postal-code').change(args => {
        //    api("/api/address/postalcode/" + args.target.value, null, response => {
        //        if (response > '' && response.result !== '') {
        //            $(this._id + ' .address-city').val(response.city);
        //            $(this._id + ' .address-county').val(response.county);
        //            $(this._id + ' .address-state').val(response.state);
        //            $(this._id + ' .address-country').val('USA'); // we currently only have US postal code
        //        }
        //    }, null, true);
        //});

        return this;
    }

    // set the values of the fields if editing existing address
    set(args) {

        //this.ddlLocationTypes.setItemByValue(args.addressTypeId);
        $(this._id + ' .address-1').val(args.address1);
        $(this._id + ' .address-2').val(args.address2);
        $(this._id + ' .address-3').val(args.address3);
        $(this._id + ' .address-city').val(args.city);
        $(this._id + ' .address-county').val(args.county);
        $(this._id + ' .address-state').val(args.state);
        $(this._id + ' .address-country').val(args.country);
        $(this._id + ' .address-postal-code').val(args.postalCode);

        return this;
    }

    // read the address from the fields
    read() {

        var typeId = this.ddlLocationTypes.value;

        return {
            addressTypeId: typeId,
            address1: $(this._id + ' .address-1').val(),
            address2: $(this._id + ' .address-2').val(),
            address3: $(this._id + ' .address-3').val(),
            city: $(this._id + ' .address-city').val(),
            county: $(this._id + ' .address-county').val(),
            state: $(this._id + ' .address-state').val(),
            country: $(this._id + ' .address-country').val(),
            postalCode: $(this._id + ' .address-postal-code').val(),
        };
    }

    validate() {
        return validateRequiredFields(this._id);
        /*var address = this.read();
        if (!address.address1) {
            $(this._id + ' .address-1').addClass('invalid');
            return false;
        }

        if (!address.postalCode) {
            $(this._id + ' .address-postal-code').addClass('invalid');
            return false;
        }

        $(this._id + ' .edit-field').removeClass('invalid');
        return true;*/
    }
}

class AddressGrid {

    constructor(args) {
        this.id = args.id;
        this._id = "#" + args.id;
        this.addresses = args.addresses; // has to have a field 'completeAddress' 

    }

    render() {

        //Addresses Grid
        ui.addressesGrid = new ej.grids.Grid({
            width: '100%',
            toolbar: [
                { template: '<label class="edit-label" style="width: 300px">direcciones</label>' },
                { template: '<button class="e-btn" id="address-add-btn"></button>', tooltipText: 'agregar direccion' },
                { template: '<button class="e-btn" id="address-edit-btn"></button>', tooltipText: 'editar direccion' },
                { template: '<button class="e-btn" id="address-delete-btn"></button>', tooltipText: 'eliminar direccion' },
                { template: '<button class="e-btn" id="address-update-btn"></button>', tooltipText: 'guardar' },
                { template: '<button class="e-btn" id="address-cancel-btn"></button>', tooltipText: 'cancelar' },
            ],
            columns: [
                { width: 60, commands: [{ type: 'google maps', buttonOption: { cssClass: 'e-flat', iconCss: 'fa fa-map-marker-alt', click: onAddressClick } }] },
                { field: 'completeAddress' },
            ],
            //Events
        });
        ui.addressesGrid.appendTo(this._id);
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
    }

    onAddressClick(args) {
        var addressSelected = ui.addressesGrid.getRowObjectFromUID(args.target.closest('.e-row').getAttribute('data-uid')).data;
        window.open("http://maps.google.com/?q=" + addressSelected.completeAddress);
    }

}