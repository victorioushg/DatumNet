/*
 * Wrapper for ejButton
 */
class Button{
    constructor(args) {
        this.id = args.id;
        this.contentType = args.contentType !== undefined ? args.contentType : ej.ContentType.TextAndImage;
        this.width = args.width !== undefined ? args.width : 100;
        this.prefixIcon = args.prefixIcon !== undefined ? args.prefixIcon : "";
        this.text = args.text !== undefined ? args.text : "";
        this.click = args.click !== undefined ? args.click : null;
        this.imagePosition = args.imagePosition !== undefined ? args.imagePosition : ej.ImagePosition.ImageLeft;
        this.cssClass = args.cssClass !== undefined ? args.cssClass : "";
        this.showRoundedCorner = args.showRoundedCorner != undefined ? args.showRoundedCorner : false;
        this.size = args.size !== undefined ? args.size : "Normal"; 
        this.enable !== args.enable != undefined ? args.enable : true;
    }
    render() {
        $(this.id).ejButton({
            contentType: this.contentType,
            width: this.width,
            prefixIcon: this.prefixIcon,
            text: this.text,
            click: this.click,
            imagePosition: this.imagePosition,
            cssClass: this.cssClass, 
            showRoundedCorner: this.showRoundedCorner,
            size: this.size,
            enabled: this.enabled, 

        });
    }
    enable(val) {
        $(this.id).ejButton({ enabled: val });
    }
}


/*
 * Wrapper for ejToggleButton
 */
class ToggleButton {
    constructor(args) {
        this.id = args.id;
        this.contentType = args.contentType !== undefined ? args.contentType : ej.ContentType.TextAndImage;
        this.size = args.size !== undefined ? args.size : ej.ButtonSize.Large;
        this.defaultText = args.defaultText !== undefined ? args.defaultText : null;
        this.activeText = args.activeText !== undefined ? args.activeText : null;
        this.defaultPrefixIcon = args.defaultPrefixIcon !== undefined ? args.defaultPrefixIcon : "e-icon e-down-arrow";
        this.activePrefixIcon = args.activePrefixIcon !== undefined ? args.activePrefixIcon : "e-icon e-up-arrow";
        this.imagePosition = args.imagePosition !== undefined ? args.imagePosition : ej.ImagePosition.ImageRight;
        this.width = args.width !== undefined ? args.width : 100;
        this.click = args.click !== undefined ? args.click : null;
        this.toggleState = args.toggleState !== undefined ? args.toggleState : false;
    }

    render() {
        // Advanced Button
        $(this.id).ejToggleButton({
            contentType: this.contentType,
            size: this.size,
            defaultText: this.defaultText,
            activeText: this.defaultText,
            defaultPrefixIcon: this.defaultPrefixIcon,
            activePrefixIcon: this.activePrefixIcon,
            imagePosition: this.imagePosition,
            width: this.width,
            click: this.click,
            toggleState: this.toggleState,
        });   

    }
}