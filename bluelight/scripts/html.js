function html_onload() {
  document.documentElement.onmousemove = DivDraw;
  document.documentElement.ontouchmove = DivDraw;
  document.body.style.overscrollBehavior = "none";
  getByid("openFile").onclick = function () {
    if (imgInvalid(this)) return;
    getByid('myfile').click();
  }

  window.addEventListener("keydown", KeyDown, true);
  window.addEventListener("keyup", KeyUp, true);
  function KeyUp(KeyboardKeys) {
    KeyCode_ctrl = false;
  }
  function KeyDown(KeyboardKeys) {
    var key = KeyboardKeys.which
    if ((openWriteGSPS || openWriteGraphic) && Graphic_now_choose && (key === 46 || key === 110)) {
      PatientMark.splice(PatientMark.indexOf(Graphic_now_choose.reference), 1);
      displayMark(NowResize, null, null, null, viewportNumber);
      Graphic_now_choose = null;
      refreshMarkFromSop(GetNowUid().sop);
    } else if ((openWriteXML) && xml_now_choose && (key === 46 || key === 110)) {
      PatientMark.splice(PatientMark.indexOf(xml_now_choose.reference), 1);
      displayMark(NowResize, null, null, null, viewportNumber);
      xml_now_choose = null;
      refreshMarkFromSop(GetNowUid().sop);
    } else if (openWriteRTSS == true && (key === 46 || key === 110)) {
      var reference;
      for (var m = 0; m < PatientMark.length; m++) {
        if (PatientMark[m].showName == getByid('textROIName').value) {
          reference = PatientMark[m];
          break;
        }
      }
      PatientMark.splice(PatientMark.indexOf(reference), 1);
      displayMark(NowResize, null, null, null, viewportNumber);
      xml_now_choose = null;
      refreshMarkFromSop(GetNowUid().sop);
    } else if (key === 33) {
      jump2UpOrEnd(getNowInstance() - parseInt(getAllSop().length / 10) + 1, undefined);
    } else if (key === 34) {
      jump2UpOrEnd(getNowInstance() + parseInt(getAllSop().length / 10) + 1, undefined);
    } else if (key === 36) {
      jump2UpOrEnd(0, 'up');
    } else if (key === 35) {
      jump2UpOrEnd(0, 'end');
    } else if (key === 17) {
      KeyCode_ctrl = true;
    }
  }

  document.getElementsByTagName("BODY")[0].ondragover = function (e) {
    e.preventDefault();
  }

  document.getElementsByTagName("BODY")[0].ondrop = function (e) {
    e.stopPropagation();
    e.preventDefault();

    function addDirectory(item) {
      if (item.isDirectory) {
        var directoryReader = item.createReader();

        var fnReadEntries = function (entries) {
          entries.forEach(function (entry) {
            addDirectory(entry);
          });
          if (entries.length > 0) {
            directoryReader.readEntries(fnReadEntries);
          }
        };
        directoryReader.readEntries(fnReadEntries)
      } else {
        item.file(function (file) {
          var url = URL.createObjectURL(file);

          function basename(path) {
            return path.split('.').reverse()[0];
          }
          if (basename(file.name) == "mht") wadorsLoader(url);
          else loadAndViewImage('wadouri:' + url);

          function load(time) {
            return new Promise((resolve) => setTimeout(resolve, time));
          }
          load(100).then(() => {
            readXML(url);
            readDicom(url, PatientMark, true);
          });
          //}
        });
      }
    }
    if (e.dataTransfer && e.dataTransfer.items) {
      var items = e.dataTransfer.items;
      for (var i = 0; i < items.length; i++) {

        var item = items[i].webkitGetAsEntry();
        if (item) {
          addDirectory(item);
        }
      }
    }
    //var files = /*e.target.files ||*/ e.dataTransfer.files;
    /*for (var k = 0; k < files.length; k++) {
      let reader = new FileReader();
      reader.readAsDataURL(files[k]);
      reader.onloadend = function () {
        //virtualLoadImage('wadouri:' + reader.result, -1);
        loadAndViewImage('wadouri:' + reader.result);
  
        function load(time) {
          return new Promise((resolve) => setTimeout(resolve, time));
        }
        load(100).then(() => {
          readXML(reader.result);
          readDicom(reader.result, PatientMark, true);
        });
      }
    }*/
  }

  getByid("overlay2seg").onclick = function () {
    getByid("overlay2seg").style.display = "none";
    var alt = GetViewport().alt;
    //if (o3DElement) alt = o3DElement.alt;
    let index = SearchUid2Index(alt);
    if (!index) return;
    let i = index[0],
      j = index[1],
      k = index[2];
    for (var n = 0; n < PatientMark.length; n++) {
      if (PatientMark[n].series == Patient.Study[i].Series[j].SeriesUID) {
        for (var l = 0; l < Patient.Study[i].Series[j].SopAmount; l++) {
          for (var m = 0; m < PatientMark[n].mark.length; m++) {
            if (PatientMark[n].mark[m].type == "Overlay" && PatientMark[n].sop == Patient.Study[i].Series[j].Sop[l].SopUID) {
              let Uid = GetNowUid();
              var dcm = {};
              dcm.study = Uid.study;
              dcm.series = Uid.sreies;

              dcm.ImagePositionPatient = GetViewport().ImagePositionPatient;
              dcm.mark = [];
              dcm.showName = "SEG"; //"" + getByid("xmlMarkNameText").value;
              dcm.hideName = dcm.showName;
              dcm.mark.push({});
              dcm.sop = Patient.Study[i].Series[j].Sop[l].SopUID;
              var DcmMarkLength = dcm.mark.length - 1;
              dcm.mark[DcmMarkLength].type = "SEG";
              function jsonDeepClone(obj) {
                return JSON.parse(JSON.stringify(obj));
              }
              dcm.mark[DcmMarkLength].pixelData = new Uint8Array(PatientMark[n].mark[m].pixelData.length)
              for (var p = 0; p < dcm.mark[DcmMarkLength].pixelData.length; p++)
                dcm.mark[DcmMarkLength].pixelData[p] = PatientMark[n].mark[m].pixelData[p];
              //dcm.mark[DcmMarkLength].pixelData = PatientMark[n].mark[m].pixelData.concat(cm.mark[DcmMarkLength].pixelData);//)jsonDeepClone(PatientMark[n].mark[m].pixelData);// new Uint8Array(GetViewport().imageWidth * GetViewport().imageHeight);
              //PatientMark[n].mark[m].type = "null";
              PatientMark.push(dcm);
              refreshMark(dcm);
              SEG_now_choose = dcm.mark[DcmMarkLength];

              // PatientMark.splice(PatientMark.indexOf(temp_overlay), 1);
            }
          }
        }
      }
    }
    refreshMarkFromSop(GetNowUid().sop);
  }

  getByid("ExportButton2").onclick = function () {
    var Export2dcm = function () {
      var link = document.createElement('a');
      link.download = GetViewport().imageId.replace("wadouri:", "").replace("wadors:", "").replace(/^.*(\\|\/|\:)/, '');
      //console.log(link.download);
      if (link.download.includes(".dcm") == false) link.download = link.download + ".dcm";
      link.href = GetViewport().imageId.replace("wadouri:", "").replace("wadors:", "");
      link.click();
    }
    Export2dcm();
  }

  getByid("ExportButton").onclick = function () {
    var Export2png = function () {
      var link = document.createElement('a');
      link.download = 'dicom.png';

      function BuildCanvas(oldCanvas) {
        var newCanvas = document.createElement('canvas');
        newCanvas.width = oldCanvas.width;
        newCanvas.height = oldCanvas.height;
        return newCanvas;
      }
      var newCanvas = BuildCanvas(GetViewport().canvas());
      var context = newCanvas.getContext('2d');
      context.drawImage(GetViewport().canvas(), 0, 0);
      context.drawImage(GetViewportMark(), 0, 0);
      link.href = newCanvas.toDataURL()
      link.click();
    }
    Export2png();
  }

  getByid("MouseOperation").onclick = function () {

    if (imgInvalid(this)) return;
    //BL_mode = 'MouseTool';
    set_BL_model('MouseTool');
    mouseTool();
    //cancelTools();
    //openMouseTool = true;
    drawBorder(this);
  }

  getByid("b_Scroll").onclick = function () {
    if (imgInvalid(this)) return;
    //BL_mode = 'scroll';
    set_BL_model('scroll');
    scroll();
    drawBorder(this);
  }

  getByid("annotation1").onclick = function () {
    if (imgInvalid(this)) return;
    if (getByid("SplitViewportDiv").style.display == "none")
      getByid("SplitViewportDiv").style.display = "";
    else
      getByid("SplitViewportDiv").style.display = "none";
  }

  getByid("MouseRotate").onclick = function () {
    if (imgInvalid(this)) return;
    //BL_mode = 'rotate';
    set_BL_model('rotate');
    rotate();
    drawBorder(this);
  }

  getByid("WindowRevision").onclick = function () {
    if (imgInvalid(this)) return;
    //BL_mode = 'windowlevel';
    set_BL_model('windowlevel');
    windowlevel();
    drawBorder(this);
    //cancelTools();
    //textWC.style.display = '';
    //textWW.style.display = '';
    // getByid('WindowLevelDiv').style.display = '';
    //openWindow = true;
    //drawBorder(this);
    //SetTable();
  }

  getByid("zoom").onclick = function () {
    if (imgInvalid(this)) return;
    //BL_mode = 'zoom';
    set_BL_model('zoom')
    zoom();
    drawBorder(this);
  }

  getByid("horizontal_flip").onclick = function () {
    if (imgInvalid(this)) return;
    GetViewport().openHorizontalFlip = !GetViewport().openHorizontalFlip;
    SetWindowWL(true);
    displayMark(NowResize, null, null, null, viewportNumber);
  }

  getByid("vertical_flip").onclick = function () {
    if (imgInvalid(this)) return;
    GetViewport().openVerticalFlip = !GetViewport().openVerticalFlip;
    SetWindowWL(true);
    displayMark(NowResize, null, null, null, viewportNumber);
  }
  getByid("color_invert").onclick = function () {
    if (imgInvalid(this)) return;
    GetViewport().openInvert = !GetViewport().openInvert;
    SetWindowWL(true);
  }

  getByid("unlink").onclick = function () {
    if (imgInvalid(this)) return;
    openLink = !openLink;
    changeLinkImg();
  }

  getByid("MeasureRular").onclick = function () {
    if (imgInvalid(this)) return;
    set_BL_model('measure');
    measure();

    drawBorder(this);
  }

  getByid("AngleRular").onclick = function () {
    if (imgInvalid(this)) return;
    //cancelTools();
    set_BL_model('angle');
    angle();
    drawBorder(this);
  }

  getByid("playvideo").onclick = function () {
    if (imgInvalid(this)) return;
    openAngle = 0;
    drawBorder(this);
    GetViewport().openPlay = !GetViewport().openPlay;
    if (GetViewport().openPlay) {
      getByid('labelPlay').style.display = '';
      getByid('textPlay').style.display = '';
    }
    else {
      getByid('labelPlay').style.display = 'none';
      getByid('textPlay').style.display = 'none';
    }
    PlayTimer();
  }

  getByid("MarkButton").onclick = function () {
    GetViewport().openMark = !GetViewport().openMark;
    for (var i = 0; i < Viewport_Total; i++) GetViewportMark(i).getContext("2d").clearRect(0, 0, GetViewport(i).imageWidth, GetViewport(i).imageHeight);
    for (var i = 0; i < Viewport_Total; i++) displayMark(NowResize, null, null, null, i);
    changeMarkImg();
  }

  getByid("annotation").onclick = function () {
    if (imgInvalid(this)) return;
    openAnnotation = !openAnnotation;
    displayAnnotation();
  }

  getByid("MarkupImg").onclick = function () {
    if (imgInvalid(this)) return;
    openDisplayMarkup = !openDisplayMarkup;
    var TableSelectOnChange = function () {
      GetViewport().style.overflowY = "hidden";
      GetViewport().style.overflowX = "hidden";
      if (getByid("DICOMTagsSelect").selected == true)
        displayDicomTagsList();
      else if (getByid("AIMSelect").selected == true)
        displayAIM();
      else {
        for (var i = 0; i < Viewport_Total; i++)
          dropTable(i);
      }
    }
    if (getByid('MarkStyleDiv').style.display == 'none') {
      getByid('MarkStyleDiv').style.display = '';
    } else {
      getByid('MarkStyleDiv').style.display = 'none';
    }
    getByid("TableSelect").onchange = TableSelectOnChange;
    TableSelectOnChange();
  }

  getByid("ImgMPR").onclick = function (catchError) {
    if (imgInvalid(this)) return;
    openMPR = !openMPR;
    if (catchError == "error") openMPR = false;
    img2darkByClass("MPR", !openMPR);
    initMPR();
  }

  getByid("ImgVR").onclick = function (catchError) {
    if (imgInvalid(this)) return;
    openVR = !openVR;
    if (catchError == "error") openVR = false;
    img2darkByClass("VR", !openVR);
    initVR();
    getByid("MouseOperation").onclick();
  }

  getByid("3dDisplay").onclick = function () {
    o3dWindowLevel();
  }

  getByid("3dCave").onclick = function () {
    openCave = !openCave;
    if (openCave == true) this.src = '../image/icon/black/b_Cross-hair_ON.png';
    else this.src = '../image/icon/black/b_Cross-hair_OFF.png';
  }

  getByid("openPenfile").onclick = function () {
    createSeg();
  }

  getByid("rwdImgTag").onclick = function () {
    openRWD = !openRWD;
    EnterRWD();
  }

  getByid("3dZipText").onchange = getByid("3dZipCheckbox").onclick = function () {
    if (getByid("3dZipCheckbox").checked == false) {
      for (var ll = 0; ll < o3DListLength; ll++) {
        var canvas1 = getByid("3DDiv" + ll).canvas();
        canvas1.style.display = "";
      }
    } else {
      for (var ll = 0; ll < o3DListLength; ll++) {
        var canvas1 = getByid("3DDiv" + ll).canvas();
        canvas1.style.display = "";
        if (getByid("3dZipCheckbox").checked == true && parseInt(getByid("3dZipText").value) < o3DListLength) {
          if (ll % parseInt(o3DListLength / parseFloat(getByid("3dZipText").value)) != 0)
            canvas1.style.display = "none";
        }
      }
    }
  }

  getByid("markFillCheck").onclick = function () {
    for (var i = 0; i < Viewport_Total; i++) displayMark(NowResize, null, null, null, i);
  }

  getByid("MarkcolorSelect").onchange = function () {
    for (var i = 0; i < Viewport_Total; i++) displayMark(NowResize, null, null, null, i);
  }

  getByid("WindowLevelSelect").onchange = function () {
    if (getByid("WindowDefault").selected == true) {
      getByid("textWC").value = GetViewport().windowCenterList = GetViewport().windowCenter;
      getByid("textWW").value = GetViewport().windowWidthList = GetViewport().windowWidth;
      if (openVR) return;
      SetWindowWL();
      WindowOpen = true;
      return;
    }
    for (var i = 0; i < getClass("WindowSelect").length; i++) {
      if (getClass("WindowSelect")[i].selected == true) {
        GetViewport().windowCenterList = getByid("textWC").value = parseInt(getClass("WindowSelect")[i].getAttribute('wc'));
        GetViewport().windowWidthList = getByid("textWW").value = parseInt(getClass("WindowSelect")[i].getAttribute('ww'));
        if (openVR) return;
        SetWindowWL();
        WindowOpen = true;
        break;
      }
    }
  }

  getByid("textWC").onchange = function () {
    GetViewport().windowCenterList = parseInt(textWC.value);
    getByid("WindowCustom").selected = true;
    if (openVR) return;
    SetWindowWL();
    WindowOpen = true;
  }

  getByid("textWW").onchange = function () {
    GetViewport().windowWidthList = parseInt(textWW.value);
    getByid("WindowCustom").selected = true;
    if (openVR) return;
    SetWindowWL();
    WindowOpen = true;
  }

  getByid("textPlay").onchange = function () {
    if ((parseInt(getByid('textPlay').value) <= 1)) getByid('textPlay').value = 1;
    else if (parseInt(getByid('textPlay').value) >= 60) getByid('textPlay').value = 60;
    else if (!(parseInt(getByid('textPlay').value) >= 1)) getByid('textPlay').value = 10;
    PlayTimer();
  }

  getByid("labelZoom").onchange = function () {
    if ((zoom <= 25)) getByid('textZoom').value = zoom = 25;
    if (zoom >= 400) getByid('textZoom').value = zoom = 400;
    SetWindowWL();
  }

  getByid("o3dAlphaValueText").onchange = function () {
    if ((parseInt(getByid('o3dAlphaValueText').value) <= 1)) getByid('o3dAlphaValueText').value = 1;
    else if (parseInt(getByid('o3dAlphaValueText').value) >= 100) getByid('o3dAlphaValueText').value = 100;
    o3DAlphaValue = parseInt(getByid('o3dAlphaValueText').value);
  }

  getByid("xmlMarkNameText").onchange = function () {
    if (xml_now_choose) {
      xml_now_choose.reference.showName = '' + this.value;
      xml_now_choose.reference.hideName = xml_now_choose.reference.showName;
      refreshMark(xml_now_choose.reference);
      xml_now_choose = null;
      //this.value = '';
      for (var i = 0; i < Viewport_Total; i++)
        displayMark(NowResize, null, null, null, i);
    }
  }

  getByid("markAlphaText").onchange = function () {
    if ((parseInt(getByid('markAlphaText').value) <= 1)) getByid('markAlphaText').value = 1;
    else if ((parseInt(getByid('markAlphaText').value) >= 100)) getByid('markAlphaText').value = 100;
    else if ((parseInt(getByid('markAlphaText').value) < 100));
    else getByid('markAlphaText').value = 100;
    for (var i = 0; i < Viewport_Total; i++) displayMark(NowResize, null, null, null, i);
  }

  getByid("markSizeText").onchange = function () {
    if ((parseFloat(getByid('markSizeText').value) <= 0.1)) getByid('markSizeText').value = 0.1;
    else if ((parseInt(getByid('markSizeText').value) >= 10)) getByid('markSizeText').value = 10;
    else if ((parseInt(getByid('markSizeText').value) < 10));
    else getByid('markSizeText').value = 1;
    for (var i = 0; i < Viewport_Total; i++) displayMark(NowResize, null, null, null, i);
  }

  getByid("3dInsertText").onchange = function () {
    if ((parseFloat(getByid('3dInsertText').value) <= 0)) getByid('3dInsertText').value = 0;
    else if ((parseInt(getByid('3dInsertText').value) >= 5)) getByid('3dInsertText').value = 5;
    else if ((parseInt(getByid('3dInsertText').value) < 5));
    else getByid('3dInsertText').value = 1;
    // for (var i = 0; i < Viewport_Total; i++)displayMark(NowResize, null, null, null, i);
  }

  getByid("3DskinText").onchange = function () {
    if ((parseFloat(getByid('3DskinText').value) <= 0)) getByid('3DskinText').value = 0;
    else if ((parseInt(getByid('3DskinText').value) >= 100)) getByid('3DskinText').value = 100;
    else if ((parseInt(getByid('3DskinText').value) < 100));
    else getByid('3DskinText').value = 0;
    // for (var i = 0; i < Viewport_Total; i++)displayMark(NowResize, null, null, null, i);
  }
  getByid("3dShadow").onchange = function () {
    setVrLight();
  }

  getByid("3dStrengthen").onchange = function () {
    if (getByid("3dStrengthenAuto").selected == true || getByid("3dStrengthenAlways").selected) {
      if (getByid("OutSide3dDiv")) getByid("OutSide3dDiv").style.transformStyle = "preserve-3d";
      // document.body.style.transformStyle = "preserve-3d";
    } else {
      // document.body.style.transformStyle = ""
      if (getByid("OutSide3dDiv")) getByid("OutSide3dDiv").style.transformStyle = "";
    };
  }

  getByid("3dPerspective").onchange = function () {
    if ((parseFloat(getByid('3dPerspective').value) <= -10000)) getByid('3dPerspective').value = -10000;
    else if ((parseInt(getByid('3dPerspective').value) >= 10000)) getByid('3dPerspective').value = 10000;
    else if ((parseInt(getByid('3dPerspective').value) < 10000));
    else getByid('3dPerspective').value = 0;
    document.body.style.perspective = getByid('3dPerspective').value + "px";
  }

  getByid("myfile").onchange = function () {
    for (var k = 0; k < this.files.length; k++) {
      let reader = new FileReader();
      reader.readAsDataURL(this.files[k]);
      reader.onloadend = function () {
        //virtualLoadImage('wadouri:' + reader.result, -1);
        loadAndViewImage('wadouri:' + reader.result);
        /*
        var baseUrl = window.URL || window.webkitURL;
                var blob = new Blob(reader.result);
               // return baseUrl.createObjectURL(blob);
               var url=baseUrl.createObjectURL(blob);
                loadAndViewImage('wadouri:' + url);
                console.log(url);
        */
        function load(time) {
          return new Promise((resolve) => setTimeout(resolve, time));
        }
        load(100).then(() => {
          readXML(reader.result);
          readDicom(reader.result, PatientMark, true);
        });
      }
    }
  }

  addEvent2SplitViewport();
  getByid("MouseOperation").onclick();
}

function addEvent2SplitViewport() {
  let radio = getClass("split_radio");
  for (var i = 0; i < radio.length; i++) {
    radio[i].onchange = function () {
      if (getByid("radio_1x1").checked == true) {
        Viewport_row = 1;
        Viewport_col = 1;
      } else if (getByid("radio_1x2").checked == true) {
        Viewport_row = 1;
        Viewport_col = 2;
      } else if (getByid("radio_2x1").checked == true) {
        Viewport_row = 2;
        Viewport_col = 1;
      } else if (getByid("radio_2x2").checked == true) {
        Viewport_row = 2;
        Viewport_col = 2;
      } else if (getByid("radio_3x3").checked == true) {
        Viewport_row = 3;
        Viewport_col = 3;
      } else if (getByid("radio_4x4").checked == true) {
        Viewport_row = 4;
        Viewport_col = 4;
      } else {
        Viewport_row = 1;
        Viewport_col = 1;
      }
      getByid("MouseOperation").onclick();
      SetTable();
      window.onresize();
    }
  }
}

function changeMarkImg() {
  getByid("MeasureLabel").style.display = "none";
  getByid("AngleLabel").style.display = "none";
  if (GetViewport().openMark == true) getByid("MarkButton").src = "../image/icon/black/fist0.png";
  else getByid("MarkButton").src = "../image/icon/black/fist1.png";
}

function changeLinkImg() {
  if (openLink == true) getByid("unlink").src = "../image/icon/black/b_Link.png";
  else getByid("unlink").src = "../image/icon/black/b_unlink translation synchronization.png";
}

function drawBorder(element) {
  if (element != getByid("b_Scroll")) openChangeFile = false;
  Css(getByid("MouseOperation"), 'border', "");
  Css(getByid("WindowRevision"), 'border', "");
  Css(getByid("MeasureRular"), 'border', "");
  Css(getByid("MouseRotate"), 'border', "");
  Css(getByid("playvideo"), 'border', "");
  Css(getByid("zoom"), 'border', "");
  Css(getByid("b_Scroll"), 'border', "");
  Css(getByid("AngleRular"), 'border', "");
  Css(element, 'border', 3 + "px #FFFFFF solid");
  Css(element, 'borderRadius', "3px 3px 3px 3px");
}

function imgInvalid(element) {
  if (openRendering) {
    return true;
  } else if (openVR) {
    if (element.classList.contains("VR")) return false;
    else return true;
  } else if (openMPR) {
    if (element.classList.contains("MPR")) return false;
    else return true;
  } else if (openWriteXML) {
    if (element.classList.contains("XML")) return false;
    else return true;
  } else if (openWriteGraphic) {
    if (element.classList.contains("GRA")) return false;
    else return true;
  } else if (openWriteSEG) {
    if (element.classList.contains("SEG")) return false;
    else return true;
  } else if (openWriteRTSS) {
    if (element.classList.contains("RTSS")) return false;
    else return true;
  }
  /*else if (openPenDraw) {//暫時移除的功能
     if (element.classList.contains("PEN")) return false;
     else return true;
   }*/
}

function img2darkByClass(classname, dark) {
  let class1 = getClass("img");
  for (let i = 0; i < class1.length; i++) {
    if (!class1[i].classList.contains(classname)) {
      if (dark) {
        class1[i].style.opacity = 1;
      } else {
        class1[i].style.opacity = 0.25;
      }
    } else {
      class1[i].style.opacity = 1;
    }
  }
}