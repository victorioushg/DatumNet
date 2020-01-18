/*
 * Wrapper for ejUploadbox
 * Currently only used for Excel uploads
 */
class Uploader {

    constructor(args) {

        this.id = args.id;
        this.uploadUrl = args.uploadUrl; // todo do we need this both urls?
        this.saveUrl = args.saveUrl;     // can we just upload, or otherwise save as dto?
        this.grid = args.grid;
        this.excelgrid = args.excelgrid;
        this.downloadFilePath = args.downloadFilePath;
        this.file = null;

        this.extensionsAllow = args.extensionsAllow !== undefined ? args.extensionsAllow : ".xls, .xlsx";
        this.multipleFilesSelection = args.multipleFilesSelection !== undefined ? args.multipleFilesSelection : false;
        this.dialogText = args.dialogText !== undefined ? args.dialogText : {
            title: "Upload File",
            name: "File Name",
            size: "File Size",
            status: "File Status"
        };
        this.buttonText = args.buttonText !== undefined ? args.buttonText : {
            browse: "to Add Select Excel file",
            upload: "Upload and Review",
            cancel: "Cancel Excel Upload"
        };
        ////this.complete = args.complete !== undefined ? args.complete : null;

        this.downloadButton = args.downloadButton !== undefined ? args.downloadButton : "#btnExcelTemplate";
        ////this.uploadButton = args.uploadButton !== undefined ? args.uploadButton : "#btnExcelUpload";
        this.cancelButton = args.cancelButton !== undefined ? args.cancelButton : "#btnExcelCancel";
        this.saveButton = args.saveButton !== undefined ? args.saveButton : "#btnExcelSave";

        this.hideUploadGrid();

        this.enabled = args.enabled !== undefined ? args.enabled : true;

        if (args.onUpload)
            this.onUpload = args.onUpload;

        if (args.afterSave)
            this.afterSave = args.afterSave;

        if (args.beforeSend)
            this.beforeSend = args.beforeSend;

        if (args.cancel)
            this.cancel = args.cancel;

        if (args.cssClass)
            this.cssClass = args.cssClass;


        //// hide buttons until they are rendered
        //// todo handle generate buttons render() method instead of aspx
        $(this.downloadButton).hide();
        $(this.cancelButton).hide();
        $(this.saveButton).hide();
        //$(this.upload...).hide();
    }

    render() {

        if (!this.enabled) {
            return; // todo verify rendering
        }

        // todo render
        //var element = document.createElement('div');
        //element.innerHTML = '<div>Hello!<div id="ul_ctrl"></div></div>';
        //$(this.id).append(element);
        $(this.downloadButton).show();
       
        $(this.id).ejUploadbox({
            saveUrl: this.uploadUrl, // with the ejUploadBox, we only upload. Saving is done later
            extensionsAllow: this.extensionsAllow,
            multipleFilesSelection: this.multipleFilesSelection,
            dialogText: this.dialogText,
            buttonText: this.buttonText,
            complete: (args) => {
                if (args.responseText != null && args.xhr.status == "200") { // todo refactor
                    this.file = JSON.parse(args.responseText);
                    //$("#ExcelTitle").show();
                    this.showUploadGrid();
                    if (this.onUpload) {
                        this.onUpload(this.file);
                    }
                    tostMessage(1, 'Excel file uploaded successfully')
                }
                else {
                    tostMessage(0, args.responseText);
                }
            },
            beforeSend: this.beforeSend,
            cancel: this.cancel,
            ccClass: this.cssClass, 
            //height: "0px",
            //width: "0px"
        });

        $(this.downloadButton).ejButton({
            size: "small",
            text: "Download Template", // todo customize
            width: "100%",
            //cssClass: this.cssClass,
            click: () => window.location.href = this.downloadFilePath
        });

        $(this.cancelButton).ejButton({
            size: "normal",
            text: "Cancel Excel Import",
            width: "100%",
            //cssClass: this.cssClass,
            click: () => {
                tostMessage(3, 'Cancel Excel Import');
                this.hideUploadGrid();
            }
        });
        $(this.saveButton).ejButton({
            size: "normal",
            text: "Save Excel Import",
            width: "100%",
            //cssClass: this.cssClass,
            click: () => this.upload()
        });
    }

    upload() {
        if (this.file != null) {
            var converJson = JSON.stringify(this.file);
            $.ajax({
                context: this,
                async: false,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: this.saveUrl,
                data: JSON.stringify(
                    {
                        "ExcelAllRecords": converJson,
                    }),
                dataType: "json",
                success: this.succeed,
                error: function (xhr, status, err) {
                    // tostMessage(0, '');
                    tostMessage(0, xhr.responseJSON.d);
                }
            });
        }
        else {
            tostMessage(0, 'Please First Select Excel File And Upload');
        }
    }

    // todo flesh out logic
    succeed(args) {
        var result = JSON.parse(args.d);

        // make sure the result actually succeeded
        if (result.StatusCode && result.StatusCode == 200) {
            this.file = null;
            this.hideUploadGrid();
            tostMessage(1, '');

            // refresh the data after successful save
            if (this.afterSave) {
                this.afterSave();
            }
        }
        else if (result.StatusCode && result.StatusCode !== 200) {
            tostMessage(0, result.Message);
        }
        else {
            tostMessage(0);
        }
    }

    showUploadGrid() {
        $(this.excelgrid).show();
        $(this.grid).hide();
        $(this.saveButton).show();
        $(this.cancelButton).show();
        $(this.downloadButton).hide();
        $(this.id + " .e-selectpart").hide();
    }

    hideUploadGrid() {
        $(this.excelgrid).hide();
        $(this.grid).show();
        $(this.saveButton).hide();
        $(this.cancelButton).hide();
        $(this.downloadButton).show();
        $(this.id + " .e-selectpart").show();

        $("#Excelmsg").hide();
    }
}
