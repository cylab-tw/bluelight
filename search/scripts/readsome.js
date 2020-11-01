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

function readAllJson() {
  var queryString = LoacationSercher;
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
      }
      callURL = callURL.replace('StudyDate=&', '');
      callURL = callURL.replace('StudyTime=&', '');
      callURL = callURL.replace('AccessionNumber=&', '');
      callURL = callURL.replace('ModalitiesInStudy=&', '');
      callURL = callURL.replace('ReferringPhysicianName=&', '');
      callURL = callURL.replace('PatientName=&', '');
      callURL = callURL.replace('PatientID=&', '');
      callURL = callURL.replace('StudyID=&', '');
      callURL = callURL.replace('StudyInstanceUID=&', '');
      callURL = callURL.replace('&', '');
      if (callURL == '') return
      if (callURL != "StudyDate=&StudyTime=&AccessionNumber=&ModalitiesInStudy=&ReferringPhysicianName=&PatientName=&PatientID=&StudyID=&StudyInstanceUID=&") {
        var url = ConfigLog.WADO.https + "://" + ConfigLog.QIDO.hostname + ":" + ConfigLog.QIDO.PORT + "/" + ConfigLog.QIDO.service + "/studies" + "?" + callURL + "";
        url=fitUrl(url);
        readJson(url);
      }
    }
  }
}

function fitUrl(url) {
  url = url.replace('?&', '?');
  url = url.replace("http://http://", "http://");
  url = url.replace("https://http://", "https://");
  url = url.replace("http://https://", "http://");
  url = url.replace("https://https://", "https://");
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
    tempConfig.enableRetrieveURI = tempDicomResponse["enableRetrieveURI"];

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
    tempConfig.enableRetrieveURI = tempDicomResponse["enableRetrieveURI"];

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
    tempConfig.enableRetrieveURI = tempDicomResponse["enableRetrieveURI"];

    ConfigLog = config;
    configOnload = true;
    onLosdSerch();
    //readAllJson();
  }
}

function readJson(url) {
  const SerchState1 = SerchState;
  var requestURL = url;
  var originWADOUrl = ConfigLog.WADO.https + "://" + ConfigLog.WADO.hostname + ":" + ConfigLog.WADO.PORT  + "/" + ConfigLog.QIDO.service +"/studies/";
  originWADOUrl = originWADOUrl.replace("?", "");
  var request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'json';
  request.send();

  request.onload = function () {
    var DicomStudyResponse = request.response;
    for (let series = 0; series < DicomStudyResponse.length; series++) {
      let SeriesUrl = "";
      if (ConfigLog.WADO.enableRetrieveURI == true) {
        SeriesUrl = originWADOUrl + DicomStudyResponse[series]["0020000D"].Value[0] + "/series/";
      } else {
        SeriesUrl = DicomStudyResponse[series]["00081190"].Value[0] + "/series";
      }
      if (ConfigLog.WADO.https == "https") SeriesUrl = SeriesUrl.replace("http:", "https:");
      SeriesUrl=fitUrl(SeriesUrl);
      SeriesUrl.replace("https", "");
      SeriesUrl.replace("http", "");
      let SeriesRequest = new XMLHttpRequest();
      SeriesRequest.open('GET', SeriesUrl);
      SeriesRequest.responseType = 'json';
      //發送以Series為單位的請求
      SeriesRequest.send();
      SeriesRequest.onload = function () {
        let DicomSeriesResponse = SeriesRequest.response;
        for (let instance = 0; instance < DicomSeriesResponse.length; instance++) {
          let InstanceUrl = ""
          if (ConfigLog.WADO.enableRetrieveURI == true) {
            InstanceUrl = SeriesUrl + DicomSeriesResponse[instance]["0020000E"].Value[0] + "/instances/";
          } else {
            InstanceUrl = DicomSeriesResponse[instance]["00081190"].Value[0] + "/instances";
          }
          if (ConfigLog.WADO.includefield == true) InstanceUrl += "?includefield=all";
          if (ConfigLog.WADO.https == "https") InstanceUrl = InstanceUrl.replace("http:", "https:");
          InstanceUrl.replace("https", "");
          InstanceUrl.replace("http", "");
          InstanceUrl=fitUrl(InstanceUrl);
          let InstanceRequest = new XMLHttpRequest();
          InstanceRequest.open('GET', InstanceUrl);
          InstanceRequest.responseType = 'json';
          //發送以Instance為單位的請求
          InstanceRequest.send();
          InstanceRequest.onload = function () {
            if (SerchState1 != SerchState) return;
            var DicomResponse = InstanceRequest.response;
            var min = 1000000000;
            for (var i = 0; i < DicomResponse.length; i++) {
              try {
                if (DicomResponse[i]["00200013"].Value[0] < min) min = DicomResponse[i]["00200013"].Value[0];
              } catch (ex) { };
            }

            for (var i = 0; i < DicomResponse.length; i++) {

              var url = ConfigLog.WADO.https + "://" + ConfigLog.WADO.hostname + ":" + ConfigLog.WADO.PORT + "/" + ConfigLog.WADO.service + "/?requestType=WADO&" +
                "studyUID=" + DicomStudyResponse[series]["0020000D"].Value[0] +
                "&seriesUID=" + DicomSeriesResponse[instance]["0020000E"].Value[0] +
                "&objectUID=" + DicomResponse[i]["00080018"].Value[0] +
                "&contentType=" + "application/dicom";
                url=fitUrl(url);
              var uri = url;
              try {
                url = "wadouri:" + url;
                if (DicomResponse[i]["00200013"].Value[0] == min) {
                  loadUID(DicomStudyResponse[series]["0020000D"].Value[0], DicomSeriesResponse[instance]["0020000E"].Value[0], DicomResponse[i]["00080018"].Value[0], DicomResponse[i]["00200013"].Value[0], url,
                    DicomResponse[i]["00100020"].Value[0], DicomResponse[i]["00080020"].Value[0], DicomResponse[i]["00080060"].Value[0], DicomResponse[i]["00100010"].Value[0]["Alphabetic"],DicomResponse[i]["00080050"].Value[0]
                  );
                }
              } catch (ex) { }
            }

            for (var i = 0; i < DicomResponse.length; i++) {
              var url = ConfigLog.WADO.https + "://" + ConfigLog.WADO.hostname + ":" + ConfigLog.WADO.PORT + "/" + ConfigLog.WADO.service + "/?requestType=WADO&" +
                "studyUID=" + DicomStudyResponse[series]["0020000D"].Value[0] +
                "&seriesUID=" + DicomSeriesResponse[instance]["0020000E"].Value[0] +
                "&objectUID=" + DicomResponse[i]["00080018"].Value[0] +
                "&contentType=" + "application/dicom";
                url=fitUrl(url);
              try {
                url = "wadouri:" + url;
                ifStudy = loadUID(DicomStudyResponse[series]["0020000D"].Value[0], DicomSeriesResponse[instance]["0020000E"].Value[0], DicomResponse[i]["00080018"].Value[0], DicomResponse[i]["00200013"].Value[0], url,
                  DicomResponse[i]["00100020"].Value[0], DicomResponse[i]["00080020"].Value[0], DicomResponse[i]["00080060"].Value[0], DicomResponse[i]["00100010"].Value[0]["Alphabetic"],DicomResponse[i]["00080050"].Value[0]
                );
              } catch (ex) { }
            }
          }
        }
      }
    }
  }
}

function loadUID(study, series, sop, instance, imageId, PatientID, StudyDate, ModalitiesInStudy, PatientName,AccessionNumber) {
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
    Sop.AccessionNumber=AccessionNumber;
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
      var Sop = {};
      Sop.InstanceNumber = instance;
      Sop.SopUID = sop;
      Sop.imageId = imageId;
      Sop.PatientID = PatientID;
      Sop.StudyDate = StudyDate;
      Sop.PatientName = PatientName;
      Sop.ModalitiesInStudy = ModalitiesInStudy;
      Sop.AccessionNumber=AccessionNumber;
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
        Sop.AccessionNumber=AccessionNumber;
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