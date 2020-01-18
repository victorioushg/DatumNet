/*
 * Wrapper for ejDropDownist
 */
class DropDownList {
    constructor(args) {

        this.id = args.id;
        this.dataSource = args.dataSource;
        this.fields = args.fields !== undefined ? args.fields : { text: "text", value: "value" }; 
        this.watermarkText = args.watermarkText !== undefined ? args.watermarkText : "Select items";
        this.width = args.width !== undefined ? args.width : 300;
        this.popupHeight = args.popupHeight !== undefined ? args.popupHeight : 300;
        this.popupWidth = args.popupWidth !== undefined ? args.popupWidth : 300;
        this.multiSelectMode = args.multiSelectMode !== undefined ? args.multiSelectMode : ej.MultiSelectMode.VisualMode; //ej.MultiSelectMode.Delimiter  ej.MultiSelectMode.VisualMode ej.MultiSelectMode.None 
        this.htmlAttributes = args.htmlAttributes !== undefined ? args.htmlAttributes : {};
        this.enable = args.enable !== undefined ? args.enable : true;
        this.showRoundedCorner = args.showRoundedCorner !== undefined ? args.showRoundedCorner : false;
        this.cssClass = args.cssClass !== undefined ? args.cssClass : undefined;
        this.change = args.change || (() => { });
        this.create = args.create || (() => { });
        this.actionComplete = args.actionComplete || (() => { });
        //this.select = args.change || (() => { });
    }
    render() {
        $(this.id).ejDropDownList({
            dataSource: this.dataSource,
            fields: this.fields,
            enabled: this.enable, 
            popupHeight: this.popupHeight,
            popupWidth: this.popupWidth,
            width: this.width,
            watermarkText: this.watermarkText,
            enable: this.enable,
            multiSelectMode: this.multiSelectMode,
            htmlAttributes: this.htmlAttributes,
            change: this.change,
            //select: this.select,
            create: this.create,
            showRoundedCorner: this.showRoundedCorner, 
            cssClass: this.cssClass, 
        });

        // set the ddl to the first field
        if (this.dataSource.length > 0) {
            $(this.id).ejDropDownList("selectItemsByIndices", 0);
        }
    }
    // returns the text of the selected value
    getValue() {
        return $(this.id).data("ejDropDownList").getValue();
    }

    getSelectedValue() {
        return $(this.id).data("ejDropDownList").getSelectedValue();
    }

    getSelectedItem() {
        return $(this.id).data("ejDropDownList").getSelectedItem();
    }

    setByText(val) {
        $(this.id).data("ejDropDownList").selectItemByText(val);
    }
    
    setByValue(val) {
        $(this.id).data("ejDropDownList").selectItemByValue(val);
    }

    //enable() {
    //    $(this.id).ejDropDownList("enable");
    //}
    disable() {
        $(this.id).ejDropDownList("disable");
    }
    enabled() {
        $(this.id).ejDropDownList("enable");
    }

}

class YesNoDropDownList {
    constructor(args) {
        this.dropdownlist = new DropDownList({
            id: args.id,
            dataSource: [
                { id: 0, text: "No", value: 0 },
                { id: 1, text: "Yes", value: 1 }
            ],
            watermarkText: "",
            multiSelectMode: ej.MultiSelectMode.None, 
            width: 60,
            popupWidth: 60,
            change: args.change, 
        });
    }
    render() {
        this.dropdownlist.render();
    }
    getValue() {
        return this.dropdownlist.getValue();
    }

    getSelectedValue() {
        return this.dropdownlist.getSelectedValue();
    }

    getSelectedBool() {
        return ( this.dropdownlist.getSelectedValue() == 0 ? false : true ) ;
    }

    getSelectedItem() {
        return this.dropdownlist.getSelectedItem();
    }
    setByText(val) {
        this.dropdownlist.setByText(val);
    }
    setByValue(val) {
        this.dropdownlist.setByValue(val);
    }
    enable() {
        this.dropdownlist.enable();
    }
    disable() {
        this.dropdownlist.disable();
    }
}


class MultiDropDownList {
    constructor(args) {
        this.id = args.id;
        this.dataSource = args.dataSource;
        this.fields = args.fields !== undefined ? args.fields : { text: "text", value: "value" };
        this.watermarkText = args.watermarkText !== undefined ? args.watermarkText : "Select items";
        this.width = args.width !== undefined ? args.width : "150px";
        this.popupHeight = args.popupHeight !== undefined ? args.popupHeight : 300;
        this.popupWidth = args.popupWidth !== undefined ? args.popupWidth : 300;
        this.multiSelectMode = ej.MultiSelectMode.VisualMode;
        this.htmlAttributes = args.htmlAttributes !== undefined ? args.htmlAttributes : {};
        this.enable = args.enable !== undefined ? args.enable : true;
        this.mode = "Box",
        this.change = args.change || (() => { });
        this.create = args.create || (() => { });
        this.Removed = args.Removed || (() => { });
        this.showRoundedCorner = true;
        this.searching = true;
        this.select = args.select || (() => { });
        this.showCheckbox = args.showCheckbox === undefined ? false : args.showCheckbox;
        this.enableFilterSearch = true;
        this.multiSelectMode = ej.MultiSelectMode.VisualMode;
        this.selectedIndices = args.selectedIndices;
        //this.select = args.change || (() => { });

    }
    render() {
        
        $(this.id).ejDropDownList({
            dataSource: this.dataSource,
            fields: this.fields,
            enabled: this.enable,
            popupHeight: this.popupHeight,
            popupWidth: this.popupWidth,
            watermarkText: this.watermarkText,
            multiSelectMode: this.multiSelectMode,
            htmlAttributes: this.htmlAttributes,
            change: this.change,
            mode:this.mode,
            //select: this.select,
            create: this.create,
            allowCustomValue: this.allowCustomValue,
            showRoundedCorner: this.showRoundedCorner,
            width: this.width,
            removing: "onRemoving",
            select: this.select,
            showCheckbox: this.showCheckbox,
            enableFilterSearch: false,
            value: this.selectedIndices
        });
        
        
        // set the ddl to the first field
        //if (this.dataSource.length > 0) {
        //    $(this.id).ejDropDownList("selectItemsByIndices", 0);
        //}
    }
    // returns the text of the selected value
    getValue() {
        return $(this.id).data("ejDropDownList").getValue();
    }

    getSelectedValue() {
        return $(this.id).data("ejDropDownList").getSelectedValue();
    }

    getSelectedItem() {
        return $(this.id).data("ejDropDownList").getSelectedItem();
    }

    setSelectedValue(val) {
        $(this.id).data("ejDropDownList").selectItemByText(val);
    }
    setTags(val) {
        this.selectedIndices = val;
        this.render();

    }
    setValue(val) {
        $(this.id).ejDropDownList("selectItemByValue", val.toString());
    }
   

    //disable(flag) {
    //    $(this.id).ejDropDownList(
    //    {
    //        enabled: !flag
    //    });
    //}
}
/*
 * Wrapper for ejListBox TODO
 */

/*
 * Wrapper for ejListView 
 */
class ListView {
    constructor(args) {
        this.id = args.id;
        this.dataSource = args.dataSource;
        this.showHeader = args.headerTitle !== undefined ? true : false;
        this.headerTitle = args.headerTitle !== undefined ? args.headerTitle : "";
        this.renderTemplate = args.renderTemplate !== undefined ? args.renderTemplate : false;
        this.width = args.width !== undefined ? args.width : 350;
    }
    render() {
        $(this.id).ejListView({
            dataSource: this.dataSource,
            showHeader: this.showHeader,
            headerTitle: this.headerTitle,
            width: this.width, 
        });
    }
    refresh() {
        $(this.id).data("ejListView").refreshContent();
    }
} 