function html_onload() {
  document.documentElement.onmousemove = DivDraw;
  document.documentElement.ontouchmove = DivDraw;
  document.body.style.overscrollBehavior = "none";
  getByid("openFile").onclick = function () {
    if (imgInvalid(this)) return;
    getByid('myfile').click();
  }

  window.addEventListener("keydown", KeyDown, true);

  function KeyDown(KeyboardKeys) {
    var key = KeyboardKeys.which
    if (Graphic_now_choose && (key === 46 || key === 110)) {
      PatientMark.splice(PatientMark.indexOf(Graphic_now_choose.reference), 1);
      displayMark(NowResize, null, null, null, viewportNumber);
      Graphic_now_choose = null;
      refreshMarkFromSop(GetNowUid().sop);
    } else if (xml_now_choose && (key === 46 || key === 110)) {
      PatientMark.splice(PatientMark.indexOf(xml_now_choose.reference), 1);
      displayMark(NowResize, null, null, null, viewportNumber);
      xml_now_choose = null;
      refreshMarkFromSop(GetNowUid().sop);
    }
  }

  document.getElementsByTagName("BODY")[0].ondragover = function (e) {
    e.preventDefault();
  }

  document.getElementsByTagName("BODY")[0].ondrop = function (e) {
    e.preventDefault();
    var files = e.dataTransfer.files;
    for (var k = 0; k < files.length; k++) {
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
    }
  }

  getByid("MouseOperation").onclick = function () {
    if (imgInvalid(this)) return;
    cancelTools();
    openMouseTool = true;
    drawBorder(this);
  }

  getByid("b_Scroll").onclick = function () {
    if (imgInvalid(this)) return;
    cancelTools();
    openChangeFile = true;
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
    cancelTools();
    openRotate = true;
    openChangeFile = true;
    drawBorder(this);
  }

  getByid("WindowRevision").onclick = function () {
    if (imgInvalid(this)) return;
    cancelTools();
    textWC.style.display = '';
    textWW.style.display = '';
    getByid('WindowLevelDiv').style.display = '';
    //  getByid('myWW').style.display = '';
    openWindow = true;
    drawBorder(this);
    SetTable();
  }

  getByid("zoom").onclick = function () {
    if (imgInvalid(this)) return;
    cancelTools();
    drawBorder(this);
    openZoom = true;
    SetWindowWL(true);
    getByid('labelZoom').style.display = '';
    getByid('textZoom').style.display = '';
    SetTable();
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
    cancelTools();
    openMeasure = true;
    drawBorder(this);
  }

  getByid("AngelRular").onclick = function () {
    if (imgInvalid(this)) return;
    cancelTools();
    openAngel = 1;
    drawBorder(this);
  }

  getByid("playvideo").onclick = function () {
    if (imgInvalid(this)) return;
    openAngel = 0;
    drawBorder(this);
    GetViewport().openPlay = !GetViewport().openPlay;
    getByid('labelPlay').style.display = '';
    getByid('textPlay').style.display = '';
    PlayTimer();
  }

  getByid("MarkButton").onclick = function () {
    GetViewport().openMark = !GetViewport().openMark;
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

  getByid("ImgMPR").onclick = function () {
    if (imgInvalid(this)) return;
    openMPR = !openMPR;
    img2darkByClass("MPR", !openMPR);
    initMPR();
  }

  getByid("ImgVR").onclick = function () {
    if (imgInvalid(this)) return;
    openVR = !openVR;
    img2darkByClass("VR", !openVR);
    initVR();
  }

  getByid("3dDisplay").onclick = function () {
    o3dWindowLevel();
  }

  getByid("3dCave").onclick = function () {
    openCave = !openCave;
    if (openCave == true) this.src = '../image/icon/black/b_Cross-hair_ON.png';
    else this.src = '../image/icon/black/b_Cross-hair_OFF.png';
  }

  getByid("writeRTSS").onclick = function () {
    if (imgInvalid(this)) return;
    cancelTools();
    openWriteRTSS = !openWriteRTSS;
    img2darkByClass("RTSS", !openWriteRTSS);
    this.src = openWriteRTSS == true ? '../image/icon/black/rtssdraw_ON.png' : '../image/icon/black/rtssdraw_OFF.png';
    if (openWriteRTSS == true) getByid('RtssDiv').style.display = '';
    else getByid('RtssDiv').style.display = 'none';
    displayMark(NowResize, null, null, null, viewportNumber);
    if (openWriteRTSS == true) return;
    // else Graphic_now_choose = null;

    function download(text, name, type) {
      let a = document.createElement('a');
      let file = new Blob([text], {
        type: type
      });
      a.href = window.URL.createObjectURL(file);
      //a.style.display = '';
      a.download = name;
      a.click();
    }
    set_RTSS_context();
    download(String(get_RTSS_context()), 'filename_RTSS.xml', 'text/plain');
    getByid('MouseOperation').click();
  }

  getByid("writeGraphic").onclick = function () {
    if (imgInvalid(this)) return;
    cancelTools();
    openWriteGraphic = !openWriteGraphic;
    img2darkByClass("GRA", !openWriteGraphic);
    this.src = openWriteGraphic == true ? '../image/icon/black/GraphicDraw_ON.png' : '../image/icon/black/GraphicDraw_OFF.png';
    if (openWriteGraphic == true) getByid('GraphicStyleDiv').style.display = '';
    else getByid('GraphicStyleDiv').style.display = 'none';
    displayMark(NowResize, null, null, null, viewportNumber);
    if (openWriteGraphic == true) return;
    else Graphic_now_choose = null;

    function download(text, name, type) {
      let a = document.createElement('a');
      let file = new Blob([text], {
        type: type
      });
      a.href = window.URL.createObjectURL(file);
      //a.style.display = '';
      a.download = name;
      a.click();
    }

    set_Graphic_context();
    download(String(get_Graphic_context()), 'filename_Graphic.xml', 'text/plain');
    /*if (getByid("GraphicMarkSelect").selected == true) {
      set_Graphic_context();
      download(String(get_Graphic_context()), 'filename_Graphic.xml', 'text/plain');
    } else if (getByid("RTSSMarkSelect").selected == true) {
      set_RTSS_context();
      download(String(get_RTSS_context()), 'filename_Graphic.xml', 'text/plain');
    }*/

    getByid('MouseOperation').click();
  }

  getByid("writeXML").onclick = function () {
    if (imgInvalid(this)) return;
    cancelTools();
    openWriteXML = !openWriteXML;
    img2darkByClass("XML", !openWriteXML);
    this.src = openWriteXML == true ? '../image/icon/black/xml_on.png' : '../image/icon/black/xml_off.png';
    if (openWriteXML == true) getByid('xmlMarkName').style.display = '';
    else getByid('xmlMarkName').style.display = 'none';
    displayMark(NowResize, null, null, null, viewportNumber);
    if (openWriteXML == true) return;
    else xml_now_choose = null;

    function download(text, name, type) {
      let a = document.createElement('a');
      let file = new Blob([text], {
        type: type
      });
      a.href = window.URL.createObjectURL(file);
      //a.style.display = '';
      a.download = name;
      a.click();
    }
    setXml_context();
    download(String(getXml_context()), 'filename.xml', 'text/plain');
    getByid('MouseOperation').click();
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
  getByid("AngelLabel").style.display = "none";
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
  Css(getByid("AngelRular"), 'border', "");
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