function getQueryVariable_xnat(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return false;
}

function readXNATRequest() {
    var experiments = (getQueryVariable_xnat('experiments'));
    var scans = (getQueryVariable_xnat('scans'));
    var format = (getQueryVariable_xnat('format'));
    if (experiments != false && scans != false) {
        if (format == false) format = "json";
        var url = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/data/experiments/"
            + experiments + "/scans/" + scans + "/files/" + "?format=" + format;
        readJson_xnat(url);
    }
}

function readJson_xnat(url) {
    var requestURL = url;
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function () {
        var response = request.response;
        for (var i = 0; i < response["ResultSet"]["Result"].length; i++) {

            let supportedImages = ["DICOM", "DCM", "secondary"];
            if (supportedImages.includes(response["ResultSet"]["Result"][i]["collection"])) {
                var uri = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + response["ResultSet"]["Result"][i]["URI"];
                loadDICOMFromUrl(uri);
                //url = "wadouri:" + uri;
                //series = loadAndViewImage(url);
            } else {
                console.error("Not supported collection type");
            }
        }
    }
}

readXNATRequest();