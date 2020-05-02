// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
window.addEventListener("load", function (event) {
    //dta = dta || {};
    //ui = ui || {};
});
$(function () {

    //var brand = new Button({
    //    id: "#brand",
    //    text: "datumnet",
    //    cssClass: "e-primary"
    //}).render();
});
async function api(url, data, callback, settings, suppressError) {

    var httpmethod = 'GET';

    // caller can just pass in http method instead of full settings
    if (settings == 'POST' || settings == 'GET' || settings == 'PUT' || settings == 'DELETE' || settings == 'PATCH') {
        httpmethod = settings;
        settings = null;
    }

    // default settings if none passed in
    if (!settings) {
        settings = {
            method: httpmethod,
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json; charset=utf-8'
            },
            dataType: 'json',
            credentials: 'include',
        };
    }

    // add the data to the body, only valid for a POST or PUT
    if (data) {
        settings.body = JSON.stringify(data);
    }

    const response = await fetch(url, settings);

    // we want a status code of 2xx
    if (response.status && (response.status >= 300 || response.status < 200)) {
        // if user has been logged out, redirect to log in page
        if (response.status === 401) {
            //window.location.replace("Account/Login?ReturnUrl=" +
            //    encodeURIComponent(window.location.pathname));
            if (window.location.pathname === "/Account/Login")
                return; // we don't need to show unauthorized message if they are on login screen
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || contentType.indexOf("application/json") === -1) {
            if (!suppressError) {
                fail(response.statusText || defaultMesageForStatusCode(response.status));
            }
            return;
        }
    }
    //else {
    var payload = await response.json();
    if (payload.d) {
        payload = JSON.parse(payload.d);
    }

    // todo debug - for some reason the message is not coming through when setting status 
    // code on the http response itself
    if (!suppressError && payload.statusCode && (payload.statusCode >= 300 || payload.statusCode < 200)) {
        fail(payload.message);
    }
    else if (callback) {
        callback(payload.result || payload);
    }
    //} //todo try catch?
}

function fail(args) {
    toast(args);
}

const messageType = {
    Error : 0,
    Success : 1,
    Warning : 3,
    Info : 4
}
function toast(msg, messageType, msghideAfter) {

    ///// Messages
    var forType = [
        { "msgIfEmpty": "Some Problem Ocurred", "heading": "Error", "icon": "error" },
        { "msgIfEmpty": "Data Saved Successfully", "heading": "Success", "icon": "success" },
        { "msgIfEmpty": "Data Deleted Successfully", "heading": "Success", "icon": "success" },
        { "msgIfEmpty": "Some Warning Arrived", "heading": "Warning", "icon": "warning" },
        { "msgIfEmpty": "Some Information Arrived", "heading": "Information", "icon": "info" }
    ];
    if (msghideAfter == null) {
        msghideAfter = 5000;
    }

    if (messageType > 4 || messageType == undefined) { messageType = 0; }
    if (msg == null || msg == '') {
        msg = forType[messageType].msgIfEmpty;
    }
    $.toast({
        heading: forType[messageType].heading,
        text: msg,
        showHideTransition: 'slide',
        icon: forType[messageType].icon,
        hideAfter: msghideAfter,
        position: 'bottom-right'
    });
}



/// Formater phone Number
function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
        return match[1] + '-' + match[2] + '-' + match[3]
    }
    return null;
}

function isValidEmail(email) {
    var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email) ? true : false;
}

/// Convert string into Camel Case Mode
function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
        if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
        return index == 0 ? match.toLowerCase() : match.toUpperCase();
    });
}

/// Array to Json

// Toggle Hide/Show Element
function hide(element, hide) { // todo replace calls to this method with hide()/show()

    var x = document.getElementById(element);
    if (!hide) {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function validateRequiredFields(id) {
    var isValid = true;
    var fields = $(id + ' input.edit-field.required');

    fields.each((i, el) => {
        if (!el.value) {
            $(el).addClass('invalid');
            isValid = false;
        }
        else {
            // if fields is valid, remove existing invalid class
            $(el).removeClass('invalid');
        }
    });

    return isValid;
}

function createAddressLink(address, includeFullAddress, notShowAddress) {
    if (address.address1 === null) { // && address.city === null && address.state === null & address.postalCode === null) {
        return "";
    }
    else {
        var fullAddress = "";

        if (address.address1) {
            fullAddress = address.address1 + ', ' + address.city + ', ' + address.state + ', ' + address.postalCode;
        } else {
            fullAddress = address.split(',')[0] + '<br>' + address.substring(address.indexOf(', ') + 1).trim();
            includeFullAddress = true;
        }

        var link = "'http://maps.google.com/?q=" + fullAddress + "'"
        return (notShowAddress ? "" : "<a href=" + link + " onclick='openLink(this.href); return false;'>"
            + (includeFullAddress ? fullAddress : address.address1) + "   </a>")
            + "<a href=" + link + " onclick='addPin(this.href); return false;'><span class='fa fa-map-marker-alt fa-lg ml-3' >  </span ></a ><br />";
    }
}