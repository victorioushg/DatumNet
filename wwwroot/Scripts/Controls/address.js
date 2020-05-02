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

class MultiAddressForm {

    constructor(args) {
        this.id = args.id;
        this._id = "#" + args.id;
        this.addresses = args.addresses;

        this.onsave = args.onsave; // onsave(addressid, address)
        //this.addressForm = {};
        this.templateElement = document.getElementById("addresses-template");
    }

    render() {
        $(this._id).empty(); // in case this gets rendered again

        this.addresses.result.forEach(a => {

            //this.addAddress(a); // todo replace below with this call
            var divid = "address-" + a.addressId;
            var clonedTemplate = this.templateElement.content.cloneNode(true);
            clonedTemplate.querySelector(".address-container").id = divid;
            clonedTemplate.querySelector(".address-wrapper").id = divid + "-wrapper";

            // address links
            clonedTemplate.querySelector(".address-link").innerHTML = createAddressLink(a, true);
            clonedTemplate.querySelector(".address-open").addEventListener("click", () => {
                $(this._id + ' .address-wrapper:not(#' + divid + '-wrapper)').hide();
                $("#" + divid + "-wrapper").toggle();
            }, false);
            clonedTemplate.querySelector(".address-cancel").addEventListener("click", () => {
                $("#" + divid + "-wrapper").hide();
            }, false);

            document.getElementById(this.id).appendChild(clonedTemplate);

            //this.addressForm[a.addressId]
            var editForm = new AddressForm({ id: divid }).render().set(a);

            if (this.onsave) {
                $("#" + divid + "-wrapper button.address-save").click(() => {
                    if (editForm.validate()) {
                        this.onsave(a.addressId, editForm.read());
                        $("#" + divid + "-wrapper").hide();
                    }
                });
            }
        });
    }

    addAddress() {

        var address = this.addresses[0];

        var divid = "address-" + address.addressId;
        var clonedTemplate = this.templateElement.content.cloneNode(true);
        clonedTemplate.querySelector(".address-container").id = divid;
        clonedTemplate.querySelector(".address-wrapper").id = divid + "-wrapper";

        clonedTemplate.querySelector(".address-open").addEventListener("click", () => {
            $(this._id + ' .address-wrapper:not(#' + divid + '-wrapper)').hide();
            $("#" + divid + "-wrapper").toggle();
        }, false);
        clonedTemplate.querySelector(".address-cancel").addEventListener("click", () => {
            $("#" + divid + "-wrapper").hide();
        }, false);

        document.getElementById(this.id).appendChild(clonedTemplate);

        var editForm = new AddressForm({ id: divid }).render().set(address);

        $("#" + divid + "-wrapper").show();
        //$(".address-wrapper").style.display = "block";
        $(this._id).find('.address-open').hide();

        if (this.onsave) {
            $("#" + divid + "-wrapper button.address-save").click(() => {
                if (editForm.validate()) {
                    this.onsave(address.addressId, editForm.read());
                    $("#" + divid + "-wrapper").hide();
                }
            });
        }
    }
}