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
  var originWADOUrl = ConfigLog.WADO.https + "://" + ConfigLog.WADO.hostname + ":" + ConfigLog.WADO.PORT + "/" + ConfigLog.QIDO.service + "/studies/";
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
      SeriesUrl = fitUrl(SeriesUrl);
      //SeriesUrl.replace("https", "");
      //SeriesUrl.replace("http", "");
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
          //InstanceUrl.replace("https", "");
          //InstanceUrl.replace("http", "");
          InstanceUrl = fitUrl(InstanceUrl);
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
            function checkValue(obj) {
              if (obj == undefined) return undefined;
              else if (obj.Value == undefined) return undefined;
              else if (obj.Value[0] == undefined) return undefined;
              else return obj.Value[0];
            }
            for (var i = 0; i < DicomResponse.length; i++) {
              var url = ConfigLog.WADO.https + "://" + ConfigLog.WADO.hostname + ":" + ConfigLog.WADO.PORT + "/" + ConfigLog.WADO.service + "/?requestType=WADO&" +
                "studyUID=" + DicomStudyResponse[series]["0020000D"].Value[0] +
                "&seriesUID=" + DicomSeriesResponse[instance]["0020000E"].Value[0] +
                "&objectUID=" + DicomResponse[i]["00080018"].Value[0] +
                "&contentType=" + "application/dicom";
              url = fitUrl(url);
              var uri = url;
              try {
                url = "wadouri:" + url;
                if (checkValue(DicomResponse[i]["00200013"]) == min) {
                  var DICOM_obj = {
                    study: checkValue(DicomStudyResponse[series]["0020000D"]),
                    series: checkValue(DicomSeriesResponse[instance]["0020000E"]),
                    sop: checkValue(DicomResponse[i]["00080018"]),
                    instance: checkValue(DicomResponse[i]["00200013"]),
                    imageId: url,
                    patientId: checkValue(DicomStudyResponse[series]["00100020"]),
                    StudyDate: checkValue(DicomStudyResponse[series]["00080020"]),
                    Modality: checkValue(DicomSeriesResponse[instance]["00080060"]),
                    PatientName: checkValue(DicomStudyResponse[series]["00100010"]) == undefined ? undefined : checkValue(DicomStudyResponse[series]["00100010"])["Alphabetic"],
                    AccessionNumber: checkValue(DicomStudyResponse[series]["00080050"]),
                    Sex:checkValue(DicomResponse[i]["00100040"]),
                    BirthDate:checkValue(DicomResponse[i]["00100030"]),
                    StudyTime:checkValue(DicomResponse[i]["00080030"]),
                    StudyDescription:checkValue(DicomResponse[i]["00081030"])
                  };
                  loadUID(DICOM_obj);

                }
              } catch (ex) { }
            }

            for (var i = 0; i < DicomResponse.length; i++) {
              var url = ConfigLog.WADO.https + "://" + ConfigLog.WADO.hostname + ":" + ConfigLog.WADO.PORT + "/" + ConfigLog.WADO.service + "/?requestType=WADO&" +
                "studyUID=" + DicomStudyResponse[series]["0020000D"].Value[0] +
                "&seriesUID=" + DicomSeriesResponse[instance]["0020000E"].Value[0] +
                "&objectUID=" + DicomResponse[i]["00080018"].Value[0] +
                "&contentType=" + "application/dicom";
              url = fitUrl(url);
              try {
                url = "wadouri:" + url;
                var DICOM_obj = {
                  study: checkValue(DicomStudyResponse[series]["0020000D"]),
                  series: checkValue(DicomSeriesResponse[instance]["0020000E"]),
                  sop: checkValue(DicomResponse[i]["00080018"]),
                  instance: checkValue(DicomResponse[i]["00200013"]),
                  imageId: url,
                  patientId: checkValue(DicomStudyResponse[series]["00100020"]),
                  StudyDate: checkValue(DicomStudyResponse[series]["00080020"]),
                  Modality: checkValue(DicomSeriesResponse[instance]["00080060"]),
                  PatientName: checkValue(DicomStudyResponse[series]["00100010"]) == undefined ? undefined : checkValue(DicomStudyResponse[series]["00100010"])["Alphabetic"],
                  AccessionNumber: checkValue(DicomStudyResponse[series]["00080050"]),
                  Sex:checkValue(DicomResponse[i]["00100040"]),
                  BirthDate:checkValue(DicomResponse[i]["00100030"]),
                  StudyTime:checkValue(DicomResponse[i]["00080030"]),
                  StudyDescription:checkValue(DicomResponse[i]["00081030"])
                };
                ifStudy =  loadUID(DICOM_obj);
              } catch (ex) { }
            }
          }
        }
      }
    }
  }
}

function loadUID(DICOM_obj) {
  var study = DICOM_obj.study, series = DICOM_obj.series, sop = DICOM_obj.sop;
  var instance = DICOM_obj.instance, imageId = DICOM_obj.imageId, PatientID = DICOM_obj.patientId;
  var StudyDate=DICOM_obj.StudyDate,Sex=DICOM_obj.Sex,BirthDate=DICOM_obj.BirthDate,StudyTime=DICOM_obj.StudyTime,StudyDescription=DICOM_obj.StudyDescription;
  var AccessionNumber=DICOM_obj.AccessionNumber,PatientName=DICOM_obj.PatientName,ModalitiesInStudy=DICOM_obj.Modality;
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
    Sop.AccessionNumber = AccessionNumber;
    Sop.StudyDescription=StudyDescription;
    Sop.StudyTime=StudyTime;
    Sop.BirthDate=BirthDate;
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
      Sop.AccessionNumber = AccessionNumber;
      Sop.StudyDescription=StudyDescription;
      Sop.StudyTime=StudyTime;
      Sop.BirthDate=BirthDate;
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
        Sop.StudyDescription=StudyDescription;
        Sop.StudyTime=StudyTime;
        Sop.BirthDate=BirthDate;
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