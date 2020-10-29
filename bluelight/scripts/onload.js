window.onload = function () {
  //執行RWD
  EnterRWD();
  //初始化參數
  loadLdcmview();
  //初始化HTML元素事件
  html_onload();
}

function loadLdcmview() {
  //左側面板樣式初始化
  getByid("LeftPicture").style = "display: flex;flex-direction: column;position: absolute;z-index: 9";
  if (parseInt(getByid("LeftPicture").offsetHeight) + 10 >= window.innerHeight - document.getElementsByClassName("container")[0].offsetTop - (bordersize * 2)) { //getByid("LeftPicture").style.height=""+(window.innerHeight- document.getElementsByClassName("container")[0].offsetTop- (bordersize * 2))+"px";
    getByid("LeftPicture").style = "overflow-y: scroll;display: flex;flex-direction: column;position: absolute;z-index: 9;height:" + (window.innerHeight - document.getElementsByClassName("container")[0].offsetTop - (bordersize * 2)) + "px;"
  }

  //隱藏一開始不需要的元素
  getByid("WindowLevelDiv").style.display = "none";
  getByid("labelZoom").style.display = "none";
  getByid("labelPlay").style.display = "none";
  getByid("textPlay").style.display = "none";
  getByid("textZoom").style.display = "none";
  getByid("3dDisplay").style.display = "none";
  getByid("VR_setup").style.display = "none";
  getByid("SplitViewportDiv").style.display = "none";
  getByid('MarkStyleDiv').style.display = 'none';
  getByid("3dCave").style.display = "none";
  getByid("mprLightLabel").style.display = "none";
  getByid("xmlMarkName").style.display = "none";
  getByid("GraphicStyleDiv").style.display = "none";
  getByid("GspsStyleDiv").style.display = "none";
  getByid("SegStyleDiv").style.display = "none";
  labelPadding = 5;

  //設定放大鏡長寬
  getByid("magnifierDiv").style.width = magnifierWidth + "px";
  getByid("magnifierDiv").style.height = magnifierHeight + "px";
  getByid("magnifierCanvas").style.width = magnifierWidth + "px";
  getByid("magnifierCanvas").style.height = magnifierHeight + "px";
  getByid("magnifierDiv").width = magnifierWidth;
  getByid("magnifierDiv").height = magnifierHeight;
  getByid("magnifierCanvas").width = magnifierWidth;
  getByid("magnifierCanvas").height = magnifierHeight;

  //設定裝DICOM階層資訊的物件
  Patient.patientName = '';
  Patient.StudyAmount = 0;
  Patient.Study = [];

  //初始化每一個Viewport的參數
  for (var i = 0; i < Viewport_Total; i++) {
    var NewDiv = document.createElement("DIV");
    var NewCanvas = document.createElement("CANVAS");
    NewDiv.id = "MyDicomDiv" + i;
    NewDiv.viewportNum = i - 0;
    NewDiv.className = "MyDicomDiv";

    NewDiv.setAttribute("data-role", "drag-drop-container");
    magnifierDiv = document.getElementById("magnifierDiv");
    document.getElementsByClassName("container")[0].appendChild(NewDiv);

    NewDiv.imageOrientationX = 0;
    NewDiv.imageOrientationY = 0;
    NewDiv.imageOrientationZ = 0;

    NewDiv.imageOrientationX2 = 0;
    NewDiv.imageOrientationY2 = 0;
    NewDiv.imageOrientationZ2 = 0;

    NewDiv.windowCenterList = 0;
    NewDiv.windowWidthList = 0;
    NewDiv.PixelSpacingX = 1;
    NewDiv.PixelSpacingY = 1;
    NewDiv.imagePositionX = 0;
    NewDiv.imagePositionY = 0;
    NewDiv.imagePositionZ = 0;
    NewDiv.windowCenter = 0;
    NewDiv.windowWidth = 0;
    NewDiv.imageWidth = 0;
    NewDiv.imageHeight = 0;
    NewDiv.originalPointX = 0;
    NewDiv.originalPointY = 0;
    NewDiv.originalPointX2 = 0;
    NewDiv.originalPointY2 = 0;
    NewDiv.newMousePointX = 0;
    NewDiv.newMousePointY = 0;
    NewDiv.rotateValue = 0;
    NewDiv.StudyDate = 0;
    NewDiv.StudyTime = 0;
    NewDiv.PatientID = "12345";
    NewDiv.PatientName = "name";
    NewDiv.openInvert = false;
    NewDiv.AccessionNumber = "";
    NewDiv.StudyDescription = "";
    NewDiv.StudyID = "";
    NewDiv.SliceLocation = 1;

    NewDiv.ModalitiesInStudy = "";
    NewDiv.Manufacturer = "";
    NewDiv.InstitutionName = "";
    NewDiv.InstitutionAddress = "";
    NewDiv.ReferringPhysicianName = "";
    NewDiv.StationName = "";
    NewDiv.SeriesDescription = "";
    NewDiv.SeriesNumber = "";
    NewDiv.RequestingPhysician = "";

    NewDiv.ImagePositionPatient = "";
    NewDiv.SpacingBetweenSlices = "";
    NewDiv.SliceThickness = "";
    NewDiv.ImageType = "";
    NewDiv.PatientBirthDate = "";
    NewDiv.PatientSex = "";
    NewDiv.PatientAge = "";
    NewDiv.FrameOfReferenceUID = "";
    NewDiv.PhotometricInterpretation = "";
    NewDiv.Rows = "";
    NewDiv.Columns = "";
    NewDiv.BitsAllocated = "";
    NewDiv.BitsStored = "";
    NewDiv.HighBit = "";
    NewDiv.PixelRepresentation = "";
    NewDiv.LossyImageCompression = "";
    NewDiv.PixelSpacing = "";

    NewDiv.NowCanvasSizeWidth = null;
    NewDiv.NowCanvasSizeHeight = null;
    NewDiv.openHorizontalFlip = false;
    NewDiv.openVerticalFlip = false;
    NewDiv.openMark = true;
    NewDiv.openPlay = false;
    //NewDiv.openDisplayMarkup = false;
    NewDiv.DicomTagsList = [];

    //只要取得canvas()就能快速取得該Viewport的影像
    NewDiv.canvas = function () {
      if (this.getElementsByClassName("cornerstone-canvas")[0])
        return this.getElementsByClassName("cornerstone-canvas")[0];
      else
        return null;
    }
    NewDiv.ctx = function () {
      if (this.getElementsByClassName("cornerstone-canvas")[0])
        return this.getElementsByClassName("cornerstone-canvas")[0].getContext("2d");
      else
        return null;
    }
    NewCanvas.id = "MarkCanvas" + i;
    NewDiv.appendChild(NewCanvas);
  }
  var count = 0;
  //增加尺規及label至適當數量
  while (getClass("leftRule").length < Viewport_Total) {
    var leftRule = document.createElement("CANVAS");
    leftRule.className = "leftRule";
    leftRule.style = "z-index:30;position:absolute;left:110px;";
    leftRule.height = 500;
    leftRule.width = 10;
    GetViewport(getClass("leftRule").length).appendChild(leftRule);
  }
  count = 0;
  while (getClass("downRule").length < Viewport_Total) {
    var downRule = document.createElement("CANVAS");
    downRule.className = "downRule";
    downRule.style = "z-index:30;position:absolute;bottom:15px;left:100px;";
    downRule.height = 10;
    GetViewport(getClass("downRule").length).appendChild(downRule);
  }
  count = 0;
  while (getClass("labelWC").length < Viewport_Total) {
    count++;
    var labelWC1 = document.createElement("LABEL");
    labelWC1.className = "labelWC";
    labelWC1.style = "position:absolute;left:115px;bottom:30px;color: red;z-index: 10;-webkit-user-select: none; ";
    GetViewport(count - 1).appendChild(labelWC1);
  }
  count = 0;
  while (getClass("labelLT").length < Viewport_Total) {
    count++;
    var labelLT1 = document.createElement("LABEL");
    labelLT1.className = "labelLT";
    labelLT1.style = "position:absolute;left:115px;top:10px;color: red;z-index: 10;-webkit-user-select: none; ";
    GetViewport(count - 1).appendChild(labelLT1);
  }
  count = 0;
  while (getClass("labelRT").length < Viewport_Total) {
    count++;
    var labelRT1 = document.createElement("LABEL");
    labelRT1.className = "labelRT";
    labelRT1.style = "position:absolute;right:20px;top:10px;color: red;z-index: 10;-webkit-user-select: none;text-align:right;";
    GetViewport(count - 1).appendChild(labelRT1);
  }
  count = 0;
  while (getClass("labelRB").length < Viewport_Total) {
    count++;
    var labelRB1 = document.createElement("LABEL");
    labelRB1.className = "labelRB";
    labelRB1.style = "position:absolute;right:20px;bottom:20px;color: red;z-index: 10;-webkit-user-select: none;text-align:right;";
    GetViewport(count - 1).appendChild(labelRB1);
  }
  count = 0;
  while (getClass("labelXY").length < Viewport_Total) {
    count++;
    var labelXY1 = document.createElement("LABEL");
    labelXY1.className = "labelXY";
    labelXY1.style = "position:absolute;left:115px;bottom:10px;color: red;z-index: 10;-webkit-user-select: none; ";
    labelXY1.innerText = "X: " + 0 + " Y: " + 0;
    GetViewport(count - 1).appendChild(labelXY1);
  }
  getByid("origindicomImage").canvas = function () {
    if (this.getElementsByClassName("cornerstone-canvas")[0])
      return this.getElementsByClassName("cornerstone-canvas")[0];
    else
      return null;
  }
  getByid("origindicomImage").ctx = function () {
    if (this.getElementsByClassName("cornerstone-canvas")[0])
      return this.getElementsByClassName("cornerstone-canvas")[0].getContext("2d");
    else
      return null;
  }

  labelWC = getClass("labelWC");
  labelLT = getClass("labelLT");
  labelRT = getClass("labelRT");
  labelRB = getClass("labelRB");

  getByid("textWC").style.display = "none";
  getByid("textWW").style.display = "none";

  //載入config檔的設定
  readDicomTags("../data/dicomTags.json");
  readConfigJson("../data/config.json", readAllJson, readJson);

  //設定icon邊框
  drawBorder(getByid("MouseOperation"));
  magnifierDiv.style.display = "none";
  //顯示label
  displayAnnotation();
}


function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
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

function readDicomTags(url) {
  //讀取DICOM Tags設定檔
  var request = new XMLHttpRequest();
  request.open('GET', url);
  request.responseType = 'json';
  request.send();
  var dicomtags = {};
  //LT代表left  top
  //RT代表right top
  //LB代表left  bottom
  //RB代表right bottom
  request.onload = function () {
    var DicomResponse = request.response["default"];
    dicomtags.LT = {};
    dicomtags.LT.name = [];
    dicomtags.LT.tag = [];
    for (var i = 0; i < DicomResponse["LT"].length; i++) {
      dicomtags.LT.name.push(DicomResponse["LT"][i].name)
      dicomtags.LT.tag.push(DicomResponse["LT"][i].tag)
    }
    dicomtags.RT = {};
    dicomtags.RT.name = [];
    dicomtags.RT.tag = [];
    for (var i = 0; i < DicomResponse["RT"].length; i++) {
      dicomtags.RT.name.push(DicomResponse["RT"][i].name)
      dicomtags.RT.tag.push(DicomResponse["RT"][i].tag)
    }
    dicomtags.LB = {};
    dicomtags.LB.name = [];
    dicomtags.LB.tag = [];
    for (var i = 0; i < DicomResponse["LB"].length; i++) {
      dicomtags.LB.name.push(DicomResponse["LB"][i].name)
      dicomtags.LB.tag.push(DicomResponse["LB"][i].tag)
    }
    dicomtags.RB = {};
    dicomtags.RB.name = [];
    dicomtags.RB.tag = [];
    for (var i = 0; i < DicomResponse["RB"].length; i++) {
      dicomtags.RB.name.push(DicomResponse["RB"][i].name)
      dicomtags.RB.tag.push(DicomResponse["RB"][i].tag)
    }
    //指派至全域變數
    Object.assign(DicomTags, dicomtags);
  }
}

function readAllJson(callBack) {
  //整合QIDO-RS的URL並發送至伺服器
  var queryString = ("" + location.search).replace("?", "");
  var callURL = queryString;
  if (queryString.length > 0) {
    var url = ConfigLog.QIDO.https + "://" + ConfigLog.QIDO.hostname + ":" + ConfigLog.QIDO.PORT + "/" + ConfigLog.QIDO.service + "/studies" + "?" + callURL + "";
    url = fitUrl(url);
    callBack(url);
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

function readConfigJson(url, callBack, callBack2) {
  //載入config檔的設定，包含伺服器、請求協定、類型...等等
  var config = {};
  var request = new XMLHttpRequest();
  request.open('GET', url);
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

    Object.assign(ConfigLog, config);
    configOnload = true;

    callBack(callBack2);
  }
}

function readJson(url) {
  //向伺服器請求資料
  if (ConfigLog.WADO.https == "https") url = url.replace("http:", "https:");
  let request = new XMLHttpRequest();
  request.open('GET', url);
  request.responseType = 'json';
  //發送以Study為單位的請求
  request.send();

  request.onload = function () {
    var DicomStudyResponse = request.response;
    for (let series = 0; series < DicomStudyResponse.length; series++) {
      let SeriesUrl = DicomStudyResponse[series]["00081190"].Value[0] + "/series";
      if (ConfigLog.WADO.https == "https") SeriesUrl = SeriesUrl.replace("http:", "https:");
      let SeriesRequest = new XMLHttpRequest();
      SeriesRequest.open('GET', SeriesUrl);
      SeriesRequest.responseType = 'json';
      //發送以Series為單位的請求
      SeriesRequest.send();
      SeriesRequest.onload = function () {
        let DicomSeriesResponse = SeriesRequest.response;
        for (let instance = 0; instance < DicomSeriesResponse.length; instance++) {
          let InstanceUrl = DicomSeriesResponse[instance]["00081190"].Value[0] + "/instances";
          if (ConfigLog.WADO.includefield == true) InstanceUrl += "?includefield=all";
          if (ConfigLog.WADO.https == "https") InstanceUrl = InstanceUrl.replace("http:", "https:");
          let InstanceRequest = new XMLHttpRequest();
          InstanceRequest.open('GET', InstanceUrl);
          InstanceRequest.responseType = 'json';
          //發送以Instance為單位的請求
          InstanceRequest.send();
          InstanceRequest.onload = function () {
            let DicomResponse = InstanceRequest.response;
            var min = 1000000000;
            //取得最小的Instance Number
            for (var i = 0; i < DicomResponse.length; i++) {
              try {
                if (DicomResponse[i]["00200013"].Value[0] < min) min = DicomResponse[i]["00200013"].Value[0];
              } catch (ex) { };
            }
            //StudyUID:0020000d,Series UID:0020000e,SOP UID:00080018,
            //Instance Number:00200013,影像檔編碼資料:imageId,PatientId:00100020

            //載入標記以及首張影像
            for (var i = 0; i < DicomResponse.length; i++) {
              //取得WADO的路徑
              var url = ConfigLog.WADO.https + "://" + ConfigLog.WADO.hostname + ":" + ConfigLog.WADO.PORT + "/" + ConfigLog.WADO.service + "?requestType=WADO&" +
                "studyUID=" + DicomResponse[i]["0020000D"].Value[0] +
                "&seriesUID=" + DicomResponse[i]["0020000E"].Value[0] +
                "&objectUID=" + DicomResponse[i]["00080018"].Value[0] +
                "&contentType=" + "application/dicom";
              url = fitUrl(url);
              var uri = url;
              //如果包含標記，則載入標記
              if (DicomResponse[i]["00080016"] && DicomResponse[i]["00080016"].Value[0] == '1.2.840.10008.5.1.4.1.1.481.3') {
                readDicom(uri, PatientMark);
              }
              try {
                //cornerstone的WADO請求需要加"wadouri"
                url = "wadouri:" + url;
                if (DicomResponse[i]["00200013"].Value[0] == min) {
                  //載入DICOM的階層資料至物件清單
                  loadUID(DicomResponse[i]["0020000D"].Value[0], DicomResponse[i]["0020000E"].Value[0], DicomResponse[i]["00080018"].Value[0], DicomResponse[i]["00200013"].Value[0], url, DicomResponse[i]["00100020"].Value[0]);
                  //預載入DICOM至Viewport
                  virtualLoadImage(url, 1);
                }
              } catch (ex) { }
            }
            //StudyUID:0020000d,Series UID:0020000e,SOP UID:00080018,
            //Instance Number:00200013,影像檔編碼資料:imageId,PatientId:00100020

            //載入其餘所有影像
            for (var i = 0; i < DicomResponse.length; i++) {
              var url = ConfigLog.WADO.https + "://" + ConfigLog.WADO.hostname + ":" + ConfigLog.WADO.PORT + "/" + ConfigLog.WADO.service + "?requestType=WADO&" +
                "studyUID=" + DicomResponse[i]["0020000D"].Value[0] +
                "&seriesUID=" + DicomResponse[i]["0020000E"].Value[0] +
                "&objectUID=" + DicomResponse[i]["00080018"].Value[0] +
                "&contentType=" + "application/dicom";
              url = fitUrl(url);
              try {
                url = "wadouri:" + url;
                //載入DICOM的階層資料至物件清單
                var Hierarchy = loadUID(DicomResponse[i]["0020000D"].Value[0], DicomResponse[i]["0020000E"].Value[0], DicomResponse[i]["00080018"].Value[0], DicomResponse[i]["00200013"].Value[0], url, DicomResponse[i]["00100020"].Value[0]);
                //預載入DICOM至Viewport
                if (Hierarchy == 0)
                  virtualLoadImage(url, 1);
                else
                  virtualLoadImage(url, 0);
              } catch (ex) { }
            }

          }
        }
      }
    }
  }
}