function getQueryVariable_mtss(variable, str) {
    var query = str;
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            var pair1 = pair[1].split(",");
            var pairList = [];
            for (var j = 0; j < pair1.length; j++) {
                pairList.push(pair1[j]);
                console.log(pair1[j]);
            }
            return pairList;
        }
    }
    return [""];
}

function getParameterByName2(name, str) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec("?" + str);
    if (results == null) {
        results = "";
    } else {
        results = decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    var pair1 = ("" + results).split(",");
    var pairList = [];
    for (var j = 0; j < pair1.length; j++) {
        pairList.push(pair1[j]);
    }
    return pairList;
}

function mtssConnect(str) {
    if (configOnload != true) {
        var timer = setInterval(function () {
            if (configOnload == true) {
                var queryString = str;
                var callURL = "";
                if (queryString.length > 0) {
                    var formInput = ["StudyDate", "StudyTime", "AccessionNumber", "ModalitiesInStudy", "ReferringPhysicianName",
                        "PatientName", "PatientID", "StudyID", "StudyInstanceUID"
                    ];
                    var tempNum = 1;
                    var tempX = -1;
                    for (var z = 0; z < tempNum; z++) {
                        for (var x = 0; x < formInput.length; x++) {
                            var n = getParameterByName2(formInput[x], str).length;
                            if (n > 1 && tempNum == 1 && tempX != x) {
                                tempNum = n;
                                if (tempX != x) tempX = x;
                                else {
                                    tempNum = 1;
                                    break;
                                }
                                var inputValue = "";
                                if (tempX == x)
                                    inputValue = getParameterByName2(formInput[x], str)[z];
                                callURL += formInput[x] + "=" + inputValue + "&";
                            } else if (n > 1 && tempNum != 1 && tempX == x) {
                                var inputValue = "";
                                inputValue = getParameterByName2(formInput[x], str)[z];
                                callURL += formInput[x] + "=" + inputValue + "&";
                                if (z == tempNum - 1) tempNum = 1;
                            } else if (n > 1 && tempNum != 1 && tempX != x) {
                                var inputValue = "";
                                inputValue = getParameterByName2(formInput[x], str)[0];
                                callURL += formInput[x] + "=" + inputValue + "&";
                            } else {
                                inputValue = getParameterByName2(formInput[x], str)[0];
                                callURL += formInput[x] + "=" + inputValue + "&";
                            }
                        }
                        if (callURL != "StudyDate=&StudyTime=&AccessionNumber=&ModalitiesInStudy=&ReferringPhysicianName=&PatientName=&PatientID=&StudyID=&StudyInstanceUID=&") {
                            var url = ConfigLog.WADO.https + "://" + ConfigLog.WADO.hostname + ":" + ConfigLog.WADO.PORT + "/dicom-web/instances/?" + callURL + "";
                            console.log(url);
                            readJson(url);
                        }
                    }
                }
                clearInterval(timer);
            }
        }, 100);
    } else {
        var StudyDate = "StudyDate=" + (getQueryVariable_mtss('StudyDate', str)) + "&";
        var StudyTime = "StudyTime=" + (getQueryVariable_mtss('StudyTime', str)) + "&";
        var AccessionNumber = "AccessionNumber=" + (getQueryVariable_mtss('AccessionNumber', str)) + "&";
        var ModalitiesInStudy = "ModalitiesInStudy=" + (getQueryVariable_mtss('ModalitiesInStudy', str)) + "&";
        var ReferringPhysicianName = "ReferringPhysicianName=" + (getQueryVariable_mtss('ReferringPhysicianName', str)) + "&";
        var PatientName = "PatientName=" + (getQueryVariable_mtss('PatientName', str)) + "&";
        var PatientID = "PatientID=" + (getQueryVariable_mtss('PatientID', str)) + "&";
        var StudyID = "StudyID=" + (getQueryVariable_mtss('StudyID', str)) + "&";
        var StudyInstanceUID = "StudyInstanceUID=" + (getQueryVariable_mtss('StudyInstanceUID', str)) + "&";
        fromUrl = StudyDate + StudyTime + AccessionNumber + ModalitiesInStudy + ReferringPhysicianName + PatientName + PatientID + StudyID + StudyInstanceUID;
        if (fromUrl != "StudyDate=&StudyTime=&AccessionNumber=&ModalitiesInStudy=&ReferringPhysicianName=&PatientName=&PatientID=&StudyID=&StudyInstanceUID=&") {
            var url = ConfigLog.WADO.https + "://" + ConfigLog.WADO.hostname + ":" + ConfigLog.WADO.PORT + "/dicom-web/studies/?" + fromUrl + "";
            console.log(url);
            readJson(url);
        }
    }
}