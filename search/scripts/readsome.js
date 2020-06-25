function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) { return pair[1]; }
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
function readAllJson() {
  var queryString = LoacationSercher;
  var callURL = "";
  if (queryString.length > 0) {
    var formInput = ["StudyDate", "StudyTime", "AccessionNumber", "ModalitiesInStudy", "ReferringPhysicianName",
      "PatientName", "PatientID", "StudyID", "StudyInstanceUID"];
    var tempNum = 1;
    var tempX = -1;
    for (var z = 0; z < tempNum; z++) {
      for (var x = 0; x < formInput.length; x++) {
        var n = getParameterByName(formInput[x]).length;
        if (n > 1 && tempNum == 1 && tempX != x) {
          tempNum = n;
          if (tempX != x) tempX = x;
          else { tempNum = 1; break; }
          var inputValue = "";
          if (tempX == x)
            inputValue = getParameterByName(formInput[x])[z];
          callURL += formInput[x] + "=" + inputValue + "&";
        }
        else if (n > 1 && tempNum != 1 && tempX == x) {
          var inputValue = "";
          inputValue = getParameterByName(formInput[x])[z];
          callURL += formInput[x] + "=" + inputValue + "&";
          if (z == tempNum - 1) tempNum = 1;
        }
        else if (n > 1 && tempNum != 1 && tempX != x) {
          var inputValue = "";
          inputValue = getParameterByName(formInput[x])[0];
          callURL += formInput[x] + "=" + inputValue + "&";
        }
        else {
          inputValue = getParameterByName(formInput[x])[0];
          callURL += formInput[x] + "=" + inputValue + "&";
        }
      }
      if (callURL != "StudyDate=&StudyTime=&AccessionNumber=&ModalitiesInStudy=&ReferringPhysicianName=&PatientName=&PatientID=&StudyID=&StudyInstanceUID=&") {
        var url = ConfigLog.WADO.https + "://" + ConfigLog.WADO.hostname + ":" + ConfigLog.WADO.PORT + "/dicom-web/instances/?" + callURL + "";
        readJson4(url);
      }
    }
  }
}
function readConfigJson(url) {
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

    config.WADO = {};
    tempConfig = config.WADO;
    tempDicomResponse = DicomResponse["DICOMWebServersConfig"][0];
    tempConfig.hostname = tempDicomResponse["hostname"];
    tempConfig.https = tempDicomResponse["enableHTTPS"] == true ? "https" : "http";
    tempConfig.PORT = tempDicomResponse["PORT"];
    tempConfig.service = tempDicomResponse["WADO"];
    tempConfig.contentType = tempDicomResponse["contentType"];
    tempConfig.timeout = tempDicomResponse["timeout"];

    config.STOW = {};
    tempConfig = config.STOW;
    tempDicomResponse = DicomResponse["DICOMWebServersConfig"][0];
    tempConfig.hostname = tempDicomResponse["hostname"];
    tempConfig.https = tempDicomResponse["enableHTTPS"] == true ? "https" : "http";
    tempConfig.PORT = tempDicomResponse["PORT"];
    tempConfig.service = tempDicomResponse["STOW"];
    tempConfig.contentType = tempDicomResponse["contentType"];
    tempConfig.timeout = tempDicomResponse["timeout"];

    ConfigLog = config;
    configOnload = true;

    readAllJson();
  }
}

function readJson4(url) {
  readJson(url.replace("http:", "https:") + "/instances");
}

function readJson(url) {
  const SerchState1 = SerchState;
  var requestURL = url;
  var request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'json';
  request.send();

  request.onload = function () {
    var DicomResponse = request.response;
    var min = 1000000000;
    for (var i = 0; i < DicomResponse.length; i++) {
      try {
        if (DicomResponse[i]["00200013"].Value[0] < min) min = DicomResponse[i]["00200013"].Value[0];
      }
      catch (ex) { };
    }
    for (var i = 0; i < DicomResponse.length; i++) {

      var url = ConfigLog.WADO.https + "://" + ConfigLog.WADO.hostname + ":" + ConfigLog.WADO.PORT + "/" + ConfigLog.WADO.service + "/?requestType=WADO&" +
        "studyUID=" + DicomResponse[i]["0020000D"].Value[0] +
        "&seriesUID=" + DicomResponse[i]["0020000E"].Value[0] +
        "&objectUID=" + DicomResponse[i]["00080018"].Value[0] +
        "&contentType=" + "application/dicom";
      var uri = url;
      try {
        url = "wadouri:" + url;
        if (DicomResponse[i]["00200013"].Value[0] == min) {
          loadUID(DicomResponse[i]["0020000D"].Value[0], DicomResponse[i]["0020000E"].Value[0], DicomResponse[i]["00080018"].Value[0], DicomResponse[i]["00200013"].Value[0], url,
            DicomResponse[i]["00100020"].Value[0], DicomResponse[i]["00080020"].Value[0], DicomResponse[i]["00080060"].Value[0], DicomResponse[i]["00100010"].Value[0]["Alphabetic"]
          );
        }
      }
      catch (ex) {
      }
    }

    for (var i = 0; i < DicomResponse.length; i++) {
      var url = ConfigLog.WADO.https + "://" + ConfigLog.WADO.hostname + ":" + ConfigLog.WADO.PORT + "/" + ConfigLog.WADO.service + "/?requestType=WADO&" +
        "studyUID=" + DicomResponse[i]["0020000D"].Value[0] +
        "&seriesUID=" + DicomResponse[i]["0020000E"].Value[0] +
        "&objectUID=" + DicomResponse[i]["00080018"].Value[0] +
        "&contentType=" + "application/dicom";
      try {
        url = "wadouri:" + url;
        ifStudy = loadUID(DicomResponse[i]["0020000D"].Value[0], DicomResponse[i]["0020000E"].Value[0], DicomResponse[i]["00080018"].Value[0], DicomResponse[i]["00200013"].Value[0], url,
          DicomResponse[i]["00100020"].Value[0], DicomResponse[i]["00080020"].Value[0], DicomResponse[i]["00080060"].Value[0], DicomResponse[i]["00100010"].Value[0]["Alphabetic"]
        );
      } catch (ex) { }
    }
  }
}
function loadUID(study, series, sop, instance, imageId, PatientID, StudyDate, ModalitiesInStudy, PatientName) {
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
    var Series = {};
    Series.SeriesUID = series;
    Series.SopAmount = 1;
    Series.Sop = [];
    var Sop = {};
    Sop.InstanceNumber = instance;
    Sop.SopUID = sop;
    Sop.imageId = imageId;
    Sop.PatientID = PatientID;
    Sop.StudyDate = StudyDate;
    Sop.PatientName = PatientName;
    Sop.ModalitiesInStudy = ModalitiesInStudy;
    Series.Sop.push(Sop);
    Study.Series.push(Series);
    Patient.Study.push(Study);
    Patient.StudyAmount += 1;
  }
  else {
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
      var Sop = {};
      Sop.InstanceNumber = instance;
      Sop.SopUID = sop;
      Sop.imageId = imageId;
      Sop.PatientID = PatientID;
      Sop.StudyDate = StudyDate;
      Sop.PatientName = PatientName;
      Sop.ModalitiesInStudy = ModalitiesInStudy;
      Series.Sop.push(Sop);
      Patient.Study[isStudy].Series.push(Series);
      Patient.Study[isStudy].SeriesAmount += 1;
    }
    else {
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
        Patient.Study[isStudy].Series[isSeries].Sop.push(Sop);
        Patient.Study[isStudy].Series[isSeries].SopAmount += 1;
      }
      else {
        ifSeries = -1;
      }
    }
  }
  UidListCount++;
  return ifSeries;
}