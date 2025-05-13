function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return ("false");
}

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(LoacationSercher);
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
function showToast(message) {
  // Create toast element if it doesn't exist  
  let toast = getByid("errorToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "errorToast";
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.backgroundColor = "#f44336";
    toast.style.color = "white";
    toast.style.padding = "15px";
    toast.style.borderRadius = "4px";
    toast.style.zIndex = "1000";
    toast.style.minWidth = "300px";
    toast.style.maxWidth = "500px";
    toast.style.boxShadow = "0 2px 5px rgba(0,0,0,0.3)";
    toast.style.fontWeight = "bold";
    toast.style.fontFamily = "Arial, sans-serif";
    document.body.appendChild(toast);
  }

  // Set message and show toast  
  toast.innerHTML = message;
  toast.style.display = "block";

  // Add close button  
  let closeBtn = document.createElement("span");
  closeBtn.innerHTML = "×";
  closeBtn.style.float = "right";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.marginLeft = "10px";
  closeBtn.onclick = function () {
    toast.style.display = "none";
  };
  toast.prepend(closeBtn);

  // Hide toast after 10 seconds  
  setTimeout(function () {
    toast.style.display = "none";
  }, 3000);
}


// Function to get user-friendly error messages  
function getErrorMessage(statusCode) {
  switch (statusCode) {
    case 204:
      return "No Content";
    case 400:
      return "Bad Request";
    case 401:
      return "Unauthorized";
    case 403:
      return "Forbidden";
    case 404:
      return "Not Found";
    case 500:
      return "Internal Server Error";
    case 502:
      return "PACS Server Not Available";
    case 503:
      return "Service Unavailable";
    case 504:
      return "Gateway Timeout";
    default:
      return "Unknown Error";
  }
}

function readAllJson() {
  /*var queryString = LoacationSercher;
  var callURL = "";
  if (queryString.length > 0) {
    var formInput = ["StudyDate", "StudyTime", "AccessionNumber", "ModalitiesInStudy", "ReferringPhysicianName",
      "PatientName", "PatientID", "StudyID", "StudyInstanceUID"
    ];
    var tempNum = 1;
    var tempX = -1;
    for (var z = 0; z < tempNum; z++) {
      for (var x = 0; x < formInput.length; x++) {
        var n = getParameterByName(formInput[x]).length;
        if (n > 1 && tempNum == 1 && tempX != x) {
          tempNum = n;
          if (tempX != x) tempX = x;
          else {
            tempNum = 1;
            break;
          }
          var inputValue = "";
          if (tempX == x)
            inputValue = getParameterByName(formInput[x])[z];
          callURL += formInput[x] + "=" + inputValue + "&";
        } else if (n > 1 && tempNum != 1 && tempX == x) {
          var inputValue = "";
          inputValue = getParameterByName(formInput[x])[z];
          callURL += formInput[x] + "=" + inputValue + "&";
          if (z == tempNum - 1) tempNum = 1;
        } else if (n > 1 && tempNum != 1 && tempX != x) {
          var inputValue = "";
          inputValue = getParameterByName(formInput[x])[0];
          callURL += formInput[x] + "=" + inputValue + "&";
        } else {
          inputValue = getParameterByName(formInput[x])[0];
          callURL += formInput[x] + "=" + inputValue + "&";
        }
      }*/
  var callURL = LoacationSercher;
  callURL = callURL.replace('StudyDate=&', '');
  callURL = callURL.replace('StudyTime=&', '');
  callURL = callURL.replace('AccessionNumber=&', '');
  callURL = callURL.replace('ModalitiesInStudy=&', '');
  callURL = callURL.replace('ReferringPhysicianName=&', '');
  callURL = callURL.replace('PatientName=&', '');
  callURL = callURL.replace('PatientID=&', '');
  callURL = callURL.replace('StudyID=&', '');
  callURL = callURL.replace('StudyInstanceUID=&', '');
  //callURL = callURL.replace('??', '?');
  /*callURL = callURL.replace('&', '');*/
  if (callURL == '') return
  if (callURL != "StudyDate=&StudyTime=&AccessionNumber=&ModalitiesInStudy=&ReferringPhysicianName=&PatientName=&PatientID=&StudyID=&StudyInstanceUID=&") {
    var url = ConfigLog.WADO.https + "://" + ConfigLog.QIDO.hostname + ":" + ConfigLog.QIDO.PORT + "/" + ConfigLog.QIDO.service + "/studies" + "?" + callURL + "";
    url = fitUrl(url);
    console.log(url);
    readJson(url);
  }
}
//}
//}

function fitUrl(url) {
  url = url.replace('?&', '?');
  url = url.replace('??', '?');
  url = url.replace("http://http://", "http://");
  url = url.replace("https://http://", "https://");
  url = url.replace("http://https://", "http://");
  url = url.replace("https://https://", "https://");
  url = url.replace("series/series/", "series/");
  url = url.replace("instance/instance/", "instance/");
  url = url.replace("series/series", "series/");
  url = url.replace("instance/instance", "instance/");
  return url;
}

function readConfigJson(url, onLosdSerch) {
  var config = {};
  var requestURL = url;
  var request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'json';
  request.send();
  request.onload = function () {
    var DicomResponse = request.response;
    config.QIDO = {};

    tempDicomResponse = DicomResponse["DICOMWebServersConfig"][0];
    tempConfig = config.QIDO
    tempConfig.hostname = tempDicomResponse["hostname"];
    tempConfig.https = tempDicomResponse["enableHTTPS"] == true ? "https" : "http";
    tempConfig.PORT = tempDicomResponse["PORT"];
    tempConfig.service = tempDicomResponse["QIDO"];
    tempConfig.contentType = tempDicomResponse["contentType"];
    tempConfig.timeout = tempDicomResponse["timeout"];
    tempConfig.charset = tempDicomResponse["charset"];
    tempConfig.includefield = tempDicomResponse["includefield"];
    tempConfig.target = tempDicomResponse["target"];
    tempConfig.targetSM = tempDicomResponse["target-SM"];
    tempConfig.serverSM = tempDicomResponse["server-SM"];
    tempConfig.enableRetrieveURI = tempDicomResponse["enableRetrieveURI"];
    tempConfig.token = tempDicomResponse["token"];

    config.WADO = {};
    tempConfig = config.WADO;
    tempDicomResponse = DicomResponse["DICOMWebServersConfig"][0];
    tempConfig.hostname = tempDicomResponse["hostname"];
    tempConfig.https = tempDicomResponse["enableHTTPS"] == true ? "https" : "http";
    tempConfig.PORT = tempDicomResponse["PORT"];
    tempConfig.service = tempDicomResponse["WADO"];
    tempConfig.contentType = tempDicomResponse["contentType"];
    tempConfig.timeout = tempDicomResponse["timeout"];
    tempConfig.includefield = tempDicomResponse["includefield"];
    tempConfig.target = tempDicomResponse["target"];
    tempConfig.targetSM = tempDicomResponse["target-SM"];
    tempConfig.serverSM = tempDicomResponse["server-SM"];
    tempConfig.enableRetrieveURI = tempDicomResponse["enableRetrieveURI"];
    tempConfig.token = tempDicomResponse["token"];

    config.STOW = {};
    tempConfig = config.STOW;
    tempDicomResponse = DicomResponse["DICOMWebServersConfig"][0];
    tempConfig.hostname = tempDicomResponse["hostname"];
    tempConfig.https = tempDicomResponse["enableHTTPS"] == true ? "https" : "http";
    tempConfig.PORT = tempDicomResponse["PORT"];
    tempConfig.service = tempDicomResponse["STOW"];
    tempConfig.contentType = tempDicomResponse["contentType"];
    tempConfig.timeout = tempDicomResponse["timeout"];
    tempConfig.includefield = tempDicomResponse["includefield"];
    tempConfig.target = tempDicomResponse["target"];
    tempConfig.targetSM = tempDicomResponse["target-SM"];
    tempConfig.serverSM = tempDicomResponse["server-SM"];
    tempConfig.enableRetrieveURI = tempDicomResponse["enableRetrieveURI"];
    tempConfig.token = tempDicomResponse["token"];

    ConfigLog = config;
    configOnload = true;
    onLosdSerch();
    //readAllJson();
  }
}

function getStudyObj(DicomStudyResponse, SeriesUrl, row) {
  function checkValue(obj) {
    if (obj == undefined) return undefined;
    else if (obj.Value == undefined) return undefined;
    else if (obj.Value[0] == undefined) return undefined;
    else {
      if (obj.Value.length == 1) {
        return obj.Value[0];
      }
      else {
        var str = "";
        for (l = 0; l < obj.Value.length; l++) {
          str += obj.Value[l];
          if (l != obj.Value.length - 1) str += ",";
        }
        return str;
      };
    }
  }
  const SerchState1 = SerchState;
  let SeriesRequest = new XMLHttpRequest();
  SeriesRequest.open('GET', SeriesUrl);
  var wadoToken = ConfigLog.WADO.token;
  for (var to = 0; to < Object.keys(wadoToken).length; to++) {
    if (wadoToken[Object.keys(wadoToken)[to]] != "") {
      SeriesRequest.setRequestHeader("" + Object.keys(wadoToken)[to], "" + wadoToken[Object.keys(wadoToken)[to]]);
    }
  }
  SeriesRequest.responseType = 'json';
  //發送以Series為單位的請求
  SeriesRequest.send();
  onloadList = [];
  onloadList.push(0);
  SeriesRequest.onload = function () {
    onloadList.pop();
    let DicomSeriesResponse = SeriesRequest.response;
    for (let instance = 0; instance < DicomSeriesResponse.length; instance++) {
      let InstanceUrl = ""
      if (ConfigLog.WADO.enableRetrieveURI == true) {
        InstanceUrl = SeriesUrl + DicomSeriesResponse[instance]["0020000E"].Value[0] + "/instances/";
      } else {
        InstanceUrl = DicomSeriesResponse[instance]["00081190"].Value[0] + "/instances";
      }
      var DICOM_obj = {
        study: checkValue(DicomStudyResponse["0020000D"]),
        series: checkValue(DicomSeriesResponse[instance]["0020000E"]),
        //sop: checkValue(DicomResponse[i]["00080018"]),
        //instance: checkValue(DicomResponse[i]["00200013"]),
        //imageId: url,
        patientId: checkValue(DicomStudyResponse["00100020"]),
        StudyDate: checkValue(DicomStudyResponse["00080020"]),
        Modality: checkValue(DicomSeriesResponse[instance]["00080060"]),
        PatientName: checkValue(DicomStudyResponse["00100010"]) == undefined ? undefined : checkValue(DicomStudyResponse["00100010"])["Alphabetic"],
        AccessionNumber: checkValue(DicomStudyResponse["00080050"]),
        Sex: checkValue(DicomSeriesResponse[instance]["00100040"]),
        BirthDate: checkValue(DicomSeriesResponse[instance]["00100030"]),
        StudyTime: checkValue(DicomSeriesResponse[instance]["00080030"]),
        StudyDescription: checkValue(DicomSeriesResponse[instance]["00081030"]),
        SeriesDescription: checkValue(DicomSeriesResponse[instance]["0008103E"]),
        SeriesNumber: checkValue(DicomSeriesResponse[instance]["00200011"]),
        SeriesI: checkValue(DicomSeriesResponse[instance]["00201209"])
      };
      ifStudy = loadUID(DICOM_obj);
      row.click();
    }
  }
}

function readJson(url) {
  let onloadList = [];
  const SerchState1 = SerchState;
  var requestURL = url;
  var originWADOUrl = ConfigLog.WADO.https + "://" + ConfigLog.WADO.hostname + ":" + ConfigLog.WADO.PORT + "/" + ConfigLog.QIDO.service + "/studies/";
  originWADOUrl = originWADOUrl.replace("?", "");
  var request = new XMLHttpRequest();
  request.open('GET', requestURL);
  var wadoToken = ConfigLog.WADO.token;
  for (var to = 0; to < Object.keys(wadoToken).length; to++) {
    if (wadoToken[Object.keys(wadoToken)[to]] != "") {
      request.setRequestHeader("" + Object.keys(wadoToken)[to], "" + wadoToken[Object.keys(wadoToken)[to]]);
    }
  }
  request.responseType = 'json';
  request.send();
  onloadList.push(0);

  // Add error handler for network errors  
  request.onerror = function () {
    showToast("Connection Error: Unable to connect to PACS server - Server may be offline or unreachable");
    getByid("loadingSpan").style.display = "none";
  };

  request.onload = function () {
    onloadList.pop();
    var DicomStudyResponse = request.response;

    // Check for error status codes  
    if (request.status === 204 || request.status === 404 || request.status === 502 ||
      request.status >= 400) {
      // Get user-friendly error message  
      let errorMessage = getErrorMessage(request.status);
      // Show toast notification  
      showToast(`PACS Server Error: ${request.status} - ${errorMessage}`);
      getByid("loadingSpan").style.display = "none";
      return;
    }

    if (DicomStudyResponse && DicomStudyResponse.length == 0)
      getByid("loadingSpan").style.display = "none";
    for (let series = 0; series < DicomStudyResponse.length; series++) {
      let SeriesUrl = "";
      if (ConfigLog.WADO.enableRetrieveURI == true) {
        SeriesUrl = originWADOUrl + DicomStudyResponse[series]["0020000D"].Value[0] + "/series/";
      } else {
        SeriesUrl = DicomStudyResponse[series]["00081190"].Value[0] + "/series";
      }
      if (ConfigLog.WADO.https == "https") SeriesUrl = SeriesUrl.replace("http:", "https:");
      SeriesUrl = fitUrl(SeriesUrl);

      function checkValue(obj) {
        if (obj == undefined) return undefined;
        else if (obj.Value == undefined) return undefined;
        else if (obj.Value[0] == undefined) return undefined;
        else {
          if (obj.Value.length == 1) {
            return obj.Value[0];
          }
          else {
            var str = "";
            for (l = 0; l < obj.Value.length; l++) {
              str += obj.Value[l];
              if (l != obj.Value.length - 1) str += ",";
            }
            return str;
          };
        }
      }

      var DICOM_obj = {
        study: checkValue(DicomStudyResponse[series]["0020000D"]),
        //series: checkValue(DicomSeriesResponse[instance]["0020000E"]),
        // sop: checkValue(DicomResponse[i]["00080018"]),
        // instance: checkValue(DicomResponse[i]["00200013"]),
        // imageId: url,
        patientId: checkValue(DicomStudyResponse[series]["00100020"]),
        StudyDate: checkValue(DicomStudyResponse[series]["00080020"]),
        Modality: checkValue(DicomStudyResponse[series]["00080061"]),
        PatientName: checkValue(DicomStudyResponse[series]["00100010"]) == undefined ? undefined : checkValue(DicomStudyResponse[series]["00100010"])["Alphabetic"],
        AccessionNumber: checkValue(DicomStudyResponse[series]["00080050"]),
        Sex: checkValue(DicomStudyResponse[series]["00100040"]),
        BirthDate: checkValue(DicomStudyResponse[series]["00100030"]),
        StudyTime: checkValue(DicomStudyResponse[series]["00080030"]),
        StudyDescription: checkValue(DicomStudyResponse[series]["00081030"]),
        SeriesUrl: SeriesUrl,//.replace("https", "").replace("http", "")
        DicomStudyResponse: DicomStudyResponse[series],
        S: checkValue(DicomStudyResponse[series]["00201206"]),
        I: checkValue(DicomStudyResponse[series]["00201208"])
        // SeriesDescription: checkValue(DicomSeriesResponse[instance]["0008103E"]),
        // SeriesNumber: checkValue(DicomSeriesResponse[instance]["00200011"])
      };
      loadUID(DICOM_obj);
      if (onloadList.length == 0) createTable();
    }
    // Add error handler for network errors  
    request.onerror = function () {
      showToast("PACS Server Connection Error - Server may be offline or unreachable");
      getByid("loadingSpan").style.display = "none";
    };
  }
}

function loadUID(DICOM_obj) {
  var study = DICOM_obj.study, series = DICOM_obj.series, sop = DICOM_obj.sop;
  var instance = DICOM_obj.instance, imageId = DICOM_obj.imageId, PatientID = DICOM_obj.patientId;
  var StudyDate = DICOM_obj.StudyDate, Sex = DICOM_obj.Sex, BirthDate = DICOM_obj.BirthDate, StudyTime = DICOM_obj.StudyTime, StudyDescription = DICOM_obj.StudyDescription;
  var AccessionNumber = DICOM_obj.AccessionNumber, PatientName = DICOM_obj.PatientName, ModalitiesInStudy = DICOM_obj.Modality;
  var SeriesDescription = DICOM_obj.SeriesDescription, SeriesNumber = DICOM_obj.SeriesNumber;
  var SeriesUrl = DICOM_obj.SeriesUrl, DicomStudyResponse = DICOM_obj.DicomStudyResponse;
  var S = DICOM_obj.S, I = DICOM_obj.I, SeriesI = DICOM_obj.SeriesI;
  var ifSeries = 0;
  var isStudy = -1;
  for (var i = 0; i < Patient.StudyAmount; i++) {
    if (Patient.Study[i].StudyUID == study)
      isStudy = i;
  }
  if (isStudy == -1) {
    var Study = {};
    Study.StudyUID = study;
    Study.SeriesAmount = 1;
    Study.Series = [];
    Study.SeriesUrl = SeriesUrl;
    Study.DicomStudyResponse = DicomStudyResponse;
    Study.S = S;
    Study.I = I;
    var Series = {};
    Series.SeriesUID = series;
    Series.SopAmount = 1;
    Series.Sop = [];
    Series.I = SeriesI;
    var Sop = {};
    Sop.InstanceNumber = instance;
    Sop.SopUID = sop;
    Sop.imageId = imageId;
    Sop.PatientID = PatientID;
    Sop.StudyDate = StudyDate;
    Sop.PatientName = PatientName;
    Sop.ModalitiesInStudy = ModalitiesInStudy;
    Sop.AccessionNumber = AccessionNumber;
    Sop.StudyDescription = StudyDescription;
    Sop.SeriesDescription = SeriesDescription;
    Sop.StudyTime = StudyTime;
    Sop.BirthDate = BirthDate;
    Sop.SeriesNumber = SeriesNumber;
    Series.Sop.push(Sop);
    Study.Series.push(Series);
    Patient.Study.push(Study);
    Patient.StudyAmount += 1;
  } else {
    ifSeries = 1;
    var isSeries = -1;
    for (var i = 0; i < Patient.Study[isStudy].SeriesAmount; i++) {
      if (Patient.Study[isStudy].Series[i].SeriesUID == series)
        isSeries = i;
    }
    if (isSeries == -1) {
      var Series = {};
      Series.SeriesUID = series;
      Series.SopAmount = 1;
      Series.Sop = [];
      Series.I = SeriesI;
      var Sop = {};
      Sop.InstanceNumber = instance;
      Sop.SopUID = sop;
      Sop.imageId = imageId;
      Sop.PatientID = PatientID;
      Sop.StudyDate = StudyDate;
      Sop.PatientName = PatientName;
      Sop.ModalitiesInStudy = ModalitiesInStudy;
      Sop.AccessionNumber = AccessionNumber;
      Sop.SeriesDescription = SeriesDescription;
      Sop.StudyDescription = StudyDescription;
      Sop.StudyTime = StudyTime;
      Sop.BirthDate = BirthDate;
      Sop.SeriesNumber = SeriesNumber;
      Series.Sop.push(Sop);
      Patient.Study[isStudy].Series.push(Series);
      Patient.Study[isStudy].SeriesAmount += 1;
    } else {
      ifSeries = 2;
      var isSop = -1;
      for (var i = 0; i < Patient.Study[isStudy].Series[isSeries].SopAmount; i++) {
        if (Patient.Study[isStudy].Series[isSeries].Sop[i].SopUID == sop)
          isSop = i;
      }
      if (isSop == -1) {
        var Sop = {};
        Sop.InstanceNumber = instance;
        Sop.SopUID = sop;
        Sop.imageId = imageId;
        Sop.PatientID = PatientID;
        Sop.StudyDate = StudyDate;
        Sop.PatientName = PatientName;
        Sop.ModalitiesInStudy = ModalitiesInStudy;
        Sop.AccessionNumber = AccessionNumber;
        Sop.StudyDescription = StudyDescription;
        Sop.SeriesDescription = SeriesDescription;
        Sop.StudyTime = StudyTime;
        Sop.BirthDate = BirthDate;
        Sop.SeriesNumber = SeriesNumber;
        Patient.Study[isStudy].Series[isSeries].Sop.push(Sop);
        Patient.Study[isStudy].Series[isSeries].SopAmount += 1;
      } else {
        ifSeries = -1;
      }
    }
  }
  UidListCount++;
  return ifSeries;
}