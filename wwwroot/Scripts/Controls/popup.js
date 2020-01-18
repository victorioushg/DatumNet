/*
 * Wrapper for ejDialog 
 * popup from grid which allows for add/edit
 */
class Popup {

    constructor(args) {
        this.id = args.id;
        this.title = args.title || '';

        if (args.cancelbutton)
            this.cancelbutton = args.cancelbutton;

        // For different titles when the popup is used for create or edit
        // If editTitle is set, title field is ignored
        if (args.editTitle)
            this.editTitle = args.editTitle;
        if (args.createTitle)
            this.createTitle = args.createTitle;

        this.afterclose = args.afterclose || null;

        this.showOnInit = args.showOnInit !== undefined ? args.showOnInit : false;
        this.enableResize = args.enableResize !== undefined ? args.enableResize : false;
       
        this.cssClass = args.cssClass !== undefined ? args.cssClass : "dialog-width";
        this.width = args.width !== undefined ? args.width : "auto";
        this.height = args.height !== undefined ? args.height : "120";

        this.enableModal = args.enableModal !== undefined ? args.enableModal  : false;

        this.actionButtons = args.actionButtons !== undefined ? args.actionButtons : ["close", "maximize", "collapsible"];

        // for pages with multiple background - todo: background should be created by popup
        this.background = args.background !== undefined ? args.background : ".full-background";

        //this.position = args.position !== undefined ? args.position : { X: 300, Y: 10 };

    }

    open(args) {
        if (args && args === 'create' && this.createTitle) {
            $(this.id).ejDialog("setTitle", this.createTitle);
        }
        else if (this.editTitle) {
            $(this.id).ejDialog("setTitle", this.editTitle);
        }

        $(this.id).ejDialog("open");
        $(this.background).show();
    }

    close() {
        $(this.id).ejDialog("close"); // calls this.onclose();
    }

    // called after popup is closed
    onclose() {
        $(this.background).hide();

        // hide any error messages
        $(this.id + ' .error-overflow').hide();

        // clear the fields that have class = "popupfield"
        var fields = $(this.id + ' .popupfield');

        fields.each(function () {
            if (this.nodeName === 'SELECT') {
                var ejddl = $('#' + this.id).ejDropDownList().data("ejDropDownList");
                if (ejddl) {
                    ejddl.clearText();
                }
                else {
                    this.selectedIndex = -1; // doesn't work on ejDropDownList
                }
            }
            else if (this.type.toUpperCase() === 'CHECKBOX') {
                this.checked = false;
            }
            else if (this.nodeName === 'INPUT' ||
                     this.nodeName === 'TEXTAREA' ) {
                this.value = '';
            }
        });

        if (this.afterclose) {
            this.afterclose();
        }
    }


    //maximize() {
    //    $(this.id).ejDialog("maximize");
    //}

    //openAdd() {
    //    //alert("adding");
    //}

    //openEdit() {
    //    //alert("editing");
    //}

    render() {
        $(this.id).ejDialog({
            title: this.editTitle || this.title,
            close: this.onclose.bind(this),
            showOnInit: this.showOnInit,
            enableResize: this.enableResize,
            cssClass: this.cssClass,
            width: this.width,
            height: this.height,
            minHeight: this.minHeight,
            maxHeight: this.maxHeight, 
            actionButtons: this.actionButtons,
            position: this.position, 
        });

        if (this.cancelbutton) {
            $(this.cancelbutton).ejButton({
                size: "small",
                width: "100%",
                click: this.close.bind(this)
            });
        }
    }
}
