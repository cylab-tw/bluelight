function html_onload() {
  document.documentElement.onmousemove = DivDraw;
  document.documentElement.ontouchmove = DivDraw;
  document.body.style.overscrollBehavior = "none";
  getByid("openFile").onclick = function () {
    if (this.enable == false) return;
    getByid('myfile').click();
  }

  window.addEventListener("keydown", KeyDown, true);
  window.addEventListener("keyup", KeyUp, true);
  function KeyUp(KeyboardKeys) {
    KeyCode_ctrl = false;
  }

  function KeyDown(KeyboardKeys) {
    var key = KeyboardKeys.which
    if (key === 33) {
      jump2UpOrEnd(getNowInstance() - parseInt(getAllSop().length / 10) + 1, undefined);
    } else if (key === 34) {
      jump2UpOrEnd(getNowInstance() + parseInt(getAllSop().length / 10) + 1, undefined);
    } else if (key === 36) {
      jump2UpOrEnd(0, 'up');
    } else if (key === 35) {
      jump2UpOrEnd(0, 'end');
    } else if (key === 17) {
      KeyCode_ctrl = true;
    } else if (KeyboardKeys.key == '-') {
      var viewport = GetViewport(), canvas = viewport.canvas();
      var tempWidth = parseFloat(canvas.style.width);
      var tempHeight = parseFloat(canvas.style.height)
      var canvasW = GetViewportMark().style.width = canvas.style.width = tempWidth / 1.05 + "px";
      var cnavsH = GetViewportMark().style.height = canvas.style.height = tempHeight / 1.05 + "px";
      viewport.newMousePointX += Math.abs(tempWidth - (parseFloat(canvasW))) / 2;
      viewport.newMousePointY += Math.abs(tempHeight - (parseFloat(cnavsH))) / 2;
      viewport.NowCanvasSizeWidth = parseFloat(canvas.style.width);
      viewport.NowCanvasSizeHeight = parseFloat(canvas.style.height);
      setTransform();
      if (openLink == true) {
        for (var i = 0; i < Viewport_Total; i++) {
          if (i == viewportNumber) continue;
          GetViewportMark(i).style.width = GetViewport(i).canvas().style.width = canvas.style.width;
          GetViewportMark(i).style.height = GetViewport(i).canvas().style.height = canvas.style.height;
          GetViewport(i).NowCanvasSizeWidth = parseFloat(canvas.style.width);
          GetViewport(i).NowCanvasSizeHeight = parseFloat(canvas.style.height);
          GetViewport(i).newMousePointX = viewport.newMousePointX;
          GetViewport(i).newMousePointY = viewport.newMousePointY;
          setTransform(i);
        }
      }
      for (var i = 0; i < Viewport_Total; i++)  displayRuler(i);
    } else if (KeyboardKeys.key == '+') {
      var viewport = GetViewport(), canvas = viewport.canvas();
      var tempWidth = parseFloat(canvas.style.width);
      var tempHeight = parseFloat(canvas.style.height)
      var canvasW = GetViewportMark().style.width = canvas.style.width = tempWidth * 1.05 + "px";
      var cnavsH = GetViewportMark().style.height = canvas.style.height = tempHeight * 1.05 + "px";
      viewport.newMousePointX -= Math.abs(tempWidth - (parseFloat(canvasW))) / 2;
      viewport.newMousePointY -= Math.abs(tempHeight - (parseFloat(cnavsH))) / 2;
      viewport.NowCanvasSizeWidth = parseFloat(canvas.style.width);
      viewport.NowCanvasSizeHeight = parseFloat(canvas.style.height);
      setTransform();
      if (openLink == true) {
        for (var i = 0; i < Viewport_Total; i++) {
          if (i == viewportNumber) continue;
          GetViewportMark(i).style.width = GetViewport(i).canvas().style.width = canvas.style.width;
          GetViewportMark(i).style.height = GetViewport(i).canvas().style.height = canvas.style.height;
          GetViewport(i).NowCanvasSizeWidth = parseFloat(canvas.style.width);
          GetViewport(i).NowCanvasSizeHeight = parseFloat(canvas.style.height);
          GetViewport(i).newMousePointX = viewport.newMousePointX;
          GetViewport(i).newMousePointY = viewport.newMousePointY;
          setTransform(i);
        }
      }
      for (var i = 0; i < Viewport_Total; i++)  displayRuler(i);
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
          resetViewport();
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

  /*getByid("ClearMarkupButton").onclick = function () {
    PatientMark = [];
    for (var i = 0; i < Viewport_Total; i++) {
      var sop = GetViewport(i).sop;
      loadAndViewImage(getImgaeIdFromSop(sop), i);
    }
  }*/

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

    if (this.enable == false) return;
    //BL_mode = 'MouseTool';
    set_BL_model('MouseTool');
    mouseTool();
    //cancelTools();
    //openMouseTool = true;
    drawBorder(this);
  }

  getByid("b_Scroll").onclick = function () {
    if (this.enable == false) return;
    //BL_mode = 'scroll';
    set_BL_model('scroll');
    scroll();
    drawBorder(this);
  }

  getByid("annotation1").onclick = function () {
    if (this.enable == false) return;
    if (getByid("SplitViewportDiv").style.display == "none")
      getByid("SplitViewportDiv").style.display = "";
    else
      getByid("SplitViewportDiv").style.display = "none";
  }

  getByid("MouseRotate").onclick = function () {
    if (this.enable == false) return;
    //BL_mode = 'rotate';
    set_BL_model('rotate');
    rotate();
    drawBorder(this);
  }

  getByid("Rotate_90").onclick = function () {
    GetViewport().rotateValue = 90;
    setTransform();
    if (openLink == true) {
      for (var z = 0; z < Viewport_Total; z++) {
        GetViewport(z).rotateValue = GetViewport().rotateValue;
        setTransform(z);
      }
    }
  }

  getByid("Rotate_180").onclick = function () {
    GetViewport().rotateValue = 180;
    setTransform();
    if (openLink == true) {
      for (var z = 0; z < Viewport_Total; z++) {
        GetViewport(z).rotateValue = GetViewport().rotateValue;
        setTransform(z);
      }
    }
  }

  getByid("Rotate_270").onclick = function () {
    GetViewport().rotateValue = 270;
    setTransform();
    if (openLink == true) {
      for (var z = 0; z < Viewport_Total; z++) {
        GetViewport(z).rotateValue = GetViewport().rotateValue;
        setTransform(z);
      }
    }
  }


  getByid("WindowRevision").onclick = function () {
    if (this.enable == false) return;
    //BL_mode = 'windowlevel';
    set_BL_model('windowlevel');
    windowlevel();
    drawBorder(this);
    //cancelTools();
    //getByid("textWC").style.display = '';
    //getByid("textWW").style.display = '';
    // getByid('WindowLevelDiv').style.display = '';
    //openWindow = true;
    //drawBorder(this);
    //SetTable();
  }

  getByid("openMeasureImg").onclick = function () {
    hideAllImgListDiv("openMeasureDIv");
    invertDisplayById('openMeasureDIv');
    if (getByid("openMeasureDIv").style.display == "none") getByid("MeasureImgParent").style.position = "";
    else {
      getByid("MeasureImgParent").style.position = "relative";
      onElementLeave();
    }
  }

  getByid("openTransformationsImg").onclick = function () {
    hideAllImgListDiv("openTransformationsDiv");
    invertDisplayById('openTransformationsDiv');
    if (getByid("openTransformationsDiv").style.display == "none") getByid("TransformationsImgParent").style.position = "";
    else {
      getByid("TransformationsImgParent").style.position = "relative";
      onElementLeave();
    }
  }

  getByid("removeRuler").onclick = function () {
    var sopList = [];
    for (var n in PatientMark) {
      var M = PatientMark[n];
      if (M.hideName == "ruler") {
        for (var M2 = 0; M2 < M.mark.length; M2++) {
          M.mark[M2].type = "delete";
        }
        M.type = "delete";
        sopList.push(M.sop);
        refreshMark(M);
      }
    }
    PatientMark = PatientMark.filter(m => m.type != "delete");
    for (var n in PatientMark) { refreshMark(PatientMark[n]); }
    //for (var s = 0; s < sopList.length; s++)
    //   refreshMarkFromSop(sopList[s]);
  }

  for (var element of getClass("img")) {
    if (element && element.alt) {
      element.onmouseover = onElementOver;
      element.onmouseleave = onElementLeave;
    }
  }

  getByid("zoom").onclick = function () {
    if (this.enable == false) return;
    //BL_mode = 'zoom';
    set_BL_model('zoom')
    zoom();
    drawBorder(this);
  }

  getByid("horizontal_flip").onclick = function () {
    if (this.enable == false) return;
    GetViewport().openHorizontalFlip = !GetViewport().openHorizontalFlip;
    SetWindowWL(true);
    displayMark();
  }

  getByid("vertical_flip").onclick = function () {
    if (this.enable == false) return;
    GetViewport().openVerticalFlip = !GetViewport().openVerticalFlip;
    SetWindowWL(true);
    displayMark();
  }
  getByid("color_invert").onclick = function () {
    if (this.enable == false) return;
    GetViewport().openInvert = !GetViewport().openInvert;
    SetWindowWL(true);
  }

  getByid("unlink").onclick = function () {
    if (this.enable == false) return;
    openLink = !openLink;
    changeLinkImg();
  }

  getByid("resetImg").onclick = function () {
    if (this.enable == false) return;
    resetAndLoadImg();
  }

  getByid("MeasureRuler").onclick = function () {
    if (this.enable == false) return;
    set_BL_model('measure');
    measure();

    drawBorder(this);
  }

  getByid("AngleRuler").onclick = function () {
    if (this.enable == false) return;
    //cancelTools();
    set_BL_model('angle');
    angle();
    drawBorder(this);
  }

  getByid("playvideo").onclick = function () {
    if (this.enable == false) return;
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
    for (var i = 0; i < Viewport_Total; i++) displayMark(i);
    changeMarkImg();
  }

  getByid("annotation").onclick = function () {
    if (this.enable == false) return;
    openAnnotation = !openAnnotation;
    displayAnnotation();
  }

  getByid("MarkupImg").onclick = function () {
    if (this.enable == false) return;
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

  /*getByid("openPenfile").onclick = function () {
    createSeg();
  }*/

  getByid("rwdImgTag").onclick = function () {
    openRWD = !openRWD;
    EnterRWD();
  }

  getByid("markFillCheck").onclick = function () {
    for (var i = 0; i < Viewport_Total; i++) displayMark(i);
  }

  getByid("MarkcolorSelect").onchange = function () {
    for (var i = 0; i < Viewport_Total; i++) displayMark(i);
  }

  getByid("WindowLevelSelect").onchange = function () {
    if (getByid("WindowDefault").selected == true) {
      getByid("textWC").value = GetViewport().windowCenterList = GetViewport().windowCenter;
      getByid("textWW").value = GetViewport().windowWidthList = GetViewport().windowWidth;
      SetWindowWL();
      WindowOpen = true;
      return;
    }
    for (var i = 0; i < getClass("WindowSelect").length; i++) {
      if (getClass("WindowSelect")[i].selected == true) {
        GetViewport().windowCenterList = getByid("textWC").value = parseInt(getClass("WindowSelect")[i].getAttribute('wc'));
        GetViewport().windowWidthList = getByid("textWW").value = parseInt(getClass("WindowSelect")[i].getAttribute('ww'));
        SetWindowWL();
        WindowOpen = true;
        break;
      }
    }
  }

  getByid("textWC").onchange = function () {
    GetViewport().windowCenterList = parseInt(getByid("textWC").value);
    getByid("WindowCustom").selected = true;
    SetWindowWL();
    WindowOpen = true;
  }

  getByid("textWW").onchange = function () {
    GetViewport().windowWidthList = parseInt(getByid("textWW").value);
    getByid("WindowCustom").selected = true;
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

  getByid("markAlphaText").onchange = function () {
    if ((parseInt(getByid('markAlphaText').value) <= 1)) getByid('markAlphaText').value = 1;
    else if ((parseInt(getByid('markAlphaText').value) >= 100)) getByid('markAlphaText').value = 100;
    else if ((parseInt(getByid('markAlphaText').value) < 100));
    else getByid('markAlphaText').value = 100;
    for (var i = 0; i < Viewport_Total; i++) displayMark(i);
  }

  getByid("markSizeText").onchange = function () {
    if ((parseFloat(getByid('markSizeText').value) <= 0.1)) getByid('markSizeText').value = 0.1;
    else if ((parseInt(getByid('markSizeText').value) >= 10)) getByid('markSizeText').value = 10;
    else if ((parseInt(getByid('markSizeText').value) < 10));
    else getByid('markSizeText').value = 1;
    for (var i = 0; i < Viewport_Total; i++) displayMark(i);
  }

  getByid("myfile").onchange = function () {
    for (var k = 0; k < this.files.length; k++) {
      let reader = new FileReader();
      reader.readAsDataURL(this.files[k]);
      reader.onloadend = function () {
        resetViewport();
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
  getByid("MouseOperation").click();
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
      getByid("MouseOperation").click();
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
  Css(getByid("MeasureRuler"), 'border', "");
  Css(getByid("MouseRotate"), 'border', "");
  Css(getByid("playvideo"), 'border', "");
  Css(getByid("zoom"), 'border', "");
  Css(getByid("b_Scroll"), 'border', "");
  Css(getByid("AngleRuler"), 'border', "");
  Css(element, 'border', 3 + "px #FFFFFF solid");
  Css(element, 'borderRadius', "3px 3px 3px 3px");
}

function img2darkByClass(classname, dark) {
  let class1 = getClass("img");
  for (let i = 0; i < class1.length; i++) {
    if (!class1[i].classList.contains(classname)) {
      if (dark) {
        class1[i].style.opacity = 1;
        class1[i].enable = true;
      } else {
        class1[i].style.opacity = 0.25;
        class1[i].enable = false;
      }
    } else {
      class1[i].style.opacity = 1;
      class1[i].enable = true;
    }
  }
}

function onElementOver(OriginElem) {
  if (!OriginElem) OriginElem = this;
  if (OriginElem.constructor.name == 'MouseEvent') OriginElem = OriginElem.toElement;
  // 建立 label 元素
  var label = document.createElement("label");

  if (OriginElem.getAttribute("alt")) label.innerHTML = OriginElem.getAttribute("alt");


  var userLanguage = navigator.language || navigator.userLanguage;

  if (userLanguage && userLanguage.toLowerCase() == "zh-tw") {
    if (OriginElem.getAttribute("altzhtw")) label.innerHTML = OriginElem.getAttribute("altzhtw");
  }

  label.style.color = "white";
  label.style.position = "absolute";

  label.id = "tooltiptext_img";
  // 將 label 元素添加到按鈕的父元素中
  OriginElem.parentNode.appendChild(label);
  label.style.top = "" + (OriginElem.height + 15) + "px";
  label.style.left = "" + (OriginElem.getBoundingClientRect().x + (OriginElem.offsetWidth / 2) - (label.offsetWidth / 2)) + "px";
}

function onElementLeave() {
  var elem = getByid("tooltiptext_img");
  if (elem) elem.remove();
}
function hideAllImgListDiv(id) {
  for (var obj of getClass("imgListDiv")) {
    if (id && obj.id == id) {
     
    }else{
      obj.style.display = "none";
    }
  }
}