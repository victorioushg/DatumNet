
class simpleGrid {
    constructor(args) {
        this.id = args.id;
        this.buttonId = args.id + "-button-add";
        this.tableId = args.id + "-table";
        this.trIdPrefix = args.id + "-tr-";
        this.fieldIdPrefix = args.id + "-field-";
        this.buttonText = args.buttonText || "Add";
        this.tableCssClass = args.tableCssClass || "table borderless"

        // only if no template
        this.inputType = args.inputType || "text";
        this.placeholder = args.placeholder || "";

        this.complete = args.complete || (() => { });

        //this.render();
    }

    render() {
        $('#' + this.id).width('100%');

        // add the table and button
        $('#' + this.id).html(`<table class='${this.tableCssClass}'><tbody id='${this.tableId}'></tbody></table>`
            + `<button class='btn btn-primary btn-sm mt-1 mb-4' id='${this.buttonId}'>${this.buttonText}</button>`);

        // events
        $('#' + this.buttonId).click(() => {
            this.addLine('', 'ADD');
        });

        return this;
    }

    addLine(text, oldvalue) {
        let len = 1;
        if ($("#" + this.tableId).children().length > 0) {
            len = parseInt($("#" + this.tableId).find('tr:last').attr('id').match(/[0-9]+/g)) + 1;
        }

        var id = this.fieldIdPrefix + len;
        var deleteId = this.trIdPrefix + len + "-delete";

        // todo allow template of fields, otherwise do this by default - add single field
        var td1 = `<tr id='${this.trIdPrefix + len}'><td><input type='${this.inputType}' 
             class='edit-field' id='${id}' placeholder='${this.placeholder}' oldvalue='${oldvalue}' value='${text}' /></td>`;

        var td2 = "<td><a class='fa fa-trash edit-field pt-2 pointer text-right' title='Delete' "
            + `id='${deleteId}'></i></td>`;
        var td3 = `<td><span id='tag${id}' value=''></span></td></tr>`;

        $('#' + this.tableId).append($(td1 + td2 + td3));
        $('#' + deleteId).click(() => {
            $('#' + this.tableId + " input.edit-field" )[len -1].setAttribute("oldvalue", "DEL");
            $('#' + this.tableId).find("tr#" + this.trIdPrefix + len).hide(); 
        });

        $('#' + id).focus();
    }

    clear() {
        $('#' + this.tableId).children().remove();
    }
}