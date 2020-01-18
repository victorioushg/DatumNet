var dta = {}; // data namespace
var ui = {}; // ui components namespace


$(function () {


    $("#Ribbon").ejRibbon({
        width: "100%",
        // application tab item defined here
        applicationTab: {
            type: ej.Ribbon.applicationTabType.Backstage,
            menuItemID: "ribbon"
        },
        buttonDefaults: {
            width: 100,
            height: 100,
            showRoundedCorner: true
        },
        // tab item defined here
        tabs: [{
            id: "contabilidad",
            text: "Contabilidad",
            // group with content & button settings
            groups: [{
                //text: "Archivos",
                content: [{
                    groups: [],
                    groups: [{
                        id: "accounts",
                        text: "Cuentas Contables",
                        buttonSettings: {
                            contentType: ej.ContentType.TextAndImage,
                            imagePosition: ej.ImagePosition.ImageTop,
                            prefixIcon: "e-icon e-ribbon e-account",
                        }
                    },
                    {
                        id: "actual",
                        text: "Asientos Actuales",
                        buttonSettings: {
                            contentType: ej.ContentType.TextAndImage,
                            imagePosition: ej.ImagePosition.ImageTop,
                            prefixIcon: "e-icon e-ribbon e-actual",
                        }
                    },
                    {
                        id: "difered",
                        text: "Asientos Diferidos",
                        buttonSettings: {
                            contentType: ej.ContentType.TextAndImage,
                            imagePosition: ej.ImagePosition.ImageTop,
                            prefixIcon: "e-icon e-ribbon e-difered",
                        }
                    }],
                }]

            }]
        }]
    });


});

function onButtonUploadClick(args) {
    ui.popup.open();
}

function populateGrid(data) {

    var encabLine = data[$(" .pre-headers").val() - 1 || 0];
    var cols = Object.keys(encabLine);
    ui.uploadedGrid = new Grid({
        id: '#uploadedGrid',
        columns: cols,
        dataSource: data,
        canEdit: true,
        canDelete: true,
        canAdd: true,
        editButtonVisible: true,
        actionBegin: function (args) {

        }
    }).render();
}
