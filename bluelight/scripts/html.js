var BorderList_Icon = ["MouseOperation", "WindowRevision", "MeasureRuler", "MouseRotate", "playvideo", "zoom", "b_Scroll", "AngleRuler", "openMeasureImg"];

function html_onload() {
  document.body.style.overscrollBehavior = "none";
  getByid("openFile").onclick = function () {
    if (this.enable == false) return;
    getByid('myfile').click();
  }

  //點到其他地方時，關閉抽屜
  getClass("container")[0].addEventListener("mousedown", hideAllDrawer, false);

  window.addEventListener("keydown", KeyDown, true);
  window.addEventListener("keyup", KeyUp, true);
  function KeyUp(KeyboardKeys) {
    KeyCode_ctrl = false;
  }

  function KeyDown(KeyboardKeys) {
    var key = KeyboardKeys.which
    //修復key===33和34時，GetViewport().tags.InstanceNumber為字串之問題
    if (key === 33) {
      jump2UpOrEnd(parseInt(GetViewport().tags.InstanceNumber) - parseInt(Patient.findSeries(GetViewport().series).Sop.length / 10) + 0, undefined);
    } else if (key === 34) {
      jump2UpOrEnd(parseInt(GetViewport().tags.InstanceNumber) + parseInt(Patient.findSeries(GetViewport().series).Sop.length / 10) + 0, undefined);
    } else if (key === 36) {
      jump2UpOrEnd(0, 'up');
    } else if (key === 35) {
      jump2UpOrEnd(0, 'end');
    } else if (key === 17) {
      KeyCode_ctrl = true;
    } else if (KeyboardKeys.key == '-') {
      var viewport = GetViewport(), canvas = GetViewport().canvas;
      if (viewport.scale > 0.1) viewport.scale -= viewport.scale * 0.05;
      setTransform();
      if (openLink == true) {
        for (var i = 0; i < Viewport_Total; i++) {
          if (i == viewportNumber) continue;
          GetViewport(i).scale = GetViewport().scale;
          GetViewport(i).translate.x = viewport.translate.x;
          GetViewport(i).translate.y = viewport.translate.y;
          setTransform(i);
        }
      }
      displayAllRuler();
    } else if (KeyboardKeys.key == '+') {
      var viewport = GetViewport(), canvas = GetViewport().canvas;
      if (viewport.scale < 10) viewport.scale += viewport.scale * 0.05;
      setTransform();
      if (openLink == true) {
        for (var i = 0; i < Viewport_Total; i++) {
          if (i == viewportNumber) continue;
          GetViewport(i).scale = GetViewport().scale;
          setTransform(i);
        }
      }
      displayAllRuler();
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

  getByid("downloadDcm").onclick = function () {
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

  getByid("downloadImg").onclick = function () {
    var Export2png = function () {
      var link = document.createElement('a');
      link.download = 'dicom.png';

      function BuildCanvas(oldCanvas) {
        var newCanvas = document.createElement('canvas');
        newCanvas.width = oldCanvas.width;
        newCanvas.height = oldCanvas.height;
        return newCanvas;
      }
      var newCanvas = BuildCanvas(GetViewport().canvas);
      var context = newCanvas.getContext('2d');
      context.translate(newCanvas.width / 2, newCanvas.height / 2);
      context.rotate((GetViewport().rotate * Math.PI) / 180);
      context.drawImage(GetViewport().canvas, -newCanvas.width / 2, -newCanvas.height / 2);
      context.drawImage(GetViewportMark(), -newCanvas.width / 2, -newCanvas.height / 2);
      link.href = newCanvas.toDataURL()
      link.click();
    }
    Export2png();
  }

  getByid("MouseOperation").onclick = function () {
    if (this.enable == false) return;
    hideAllDrawer();
    set_BL_model('MouseTool');
    mouseTool();
    drawBorder(this);
  }

  /*getByid("SplitWindow").onclick = function () {
    if (this.enable == false) return;
    hideAllDrawer();
    if (getByid("SplitViewportDiv").style.display == "none")
      getByid("SplitViewportDiv").style.display = "";
    else
      getByid("SplitViewportDiv").style.display = "none";
  }*/

  getByid("MouseRotate").onclick = function () {
    if (this.enable == false) return;
    set_BL_model('rotate');
    rotate();
    drawBorder(this);
  }

  getByid("Rotate_90").onclick = function () {
    GetViewport().rotate += 90;
    GetViewport().rotate = (GetViewport().rotate % 360 + 360) % 360;//有考慮負值
    setTransform();
    if (openLink == true) {
      for (var z = 0; z < Viewport_Total; z++) {
        GetViewport(z).rotate = GetViewport().rotate;
        setTransform(z);
      }
    }
  }

  getByid("Rotate_i90").onclick = function () {
    GetViewport().rotate -= 90;
    GetViewport().rotate = (GetViewport().rotate % 360 + 360) % 360;//有考慮負值
    setTransform();
    if (openLink == true) {
      for (var z = 0; z < Viewport_Total; z++) {
        GetViewport(z).rotate = GetViewport().rotate;
        setTransform(z);
      }
    }
  }

  getByid("Rotate_0").onclick = function () {
    GetViewport().rotate = 0;
    setTransform();
    if (openLink == true) {
      for (var z = 0; z < Viewport_Total; z++) {
        GetViewport(z).rotate = GetViewport().rotate;
        setTransform(z);
      }
    }
  }
  /*getByid("Rotate_180").onclick = function () {
    GetViewport().rotate = 180;
    setTransform();
    if (openLink == true) {
      for (var z = 0; z < Viewport_Total; z++) {
        GetViewport(z).rotate = GetViewport().rotate;
        setTransform(z);
      }
    }
  }

  getByid("Rotate_270").onclick = function () {
    GetViewport().rotate = 270;
    setTransform();
    if (openLink == true) {
      for (var z = 0; z < Viewport_Total; z++) {
        GetViewport(z).rotate = GetViewport().rotate;
        setTransform(z);
      }
    }
  }*/

  getByid("WindowRevision").onclick = function () {
    if (this.enable == false) return;
    hideAllDrawer("windowlevel");
    set_BL_model('windowlevel');
    windowlevel();
    drawBorder(this);
    getByid("textWC").value = GetViewport().windowCenter;
    getByid("textWW").value = GetViewport().windowWidth;
  }

  getByid("clearviewportImg").onclick = function () {
    hideAllDrawer();
    GetViewport().clear();
    displayMark();
    displayRuler();
    putLabel();
    displayAIM();
    displayAnnotation();
    VIEWPORT.loadViewport(GetViewport(), null, viewportNumber);
    DisplaySeriesCount();
    getClass("labelLT")[viewportNumber].innerText = "";
    getClass("labelWC")[viewportNumber].innerText = "";
    getClass("labelRT")[viewportNumber].innerText = "";
    getClass("labelRB")[viewportNumber].innerText = "";
    PatientMark = [];
    Patient = new BlueLightPatient();
    getPatientbyImageID = {};
    getByid("LeftPicture").innerHTML = ""; //leftLayout = new LeftLayout();
    leftLayout.reflesh();
    getByid("myfile").value = null;
  }
  getByid("OtherImg").onclick = function () {
    if (this.enable == false) return;
    hideAllDrawer("othereDIv");
    invertDisplayById('othereDIv');
    if (getByid("othereDIv").style.display == "none") getByid("OtherImgParent").style.position = "";
    else {
      getByid("OtherImgParent").style.position = "relative";
      //onElementLeave();
    }
  }

  getByid("openMeasureImg").onclick = function () {
    if (this.enable == false) return;
    hideAllDrawer("openMeasureDIv");
    invertDisplayById('openMeasureDIv');
    if (getByid("openMeasureDIv").style.display == "none") getByid("MeasureImgParent").style.position = "";
    else {
      getByid("MeasureImgParent").style.position = "relative";
      onElementLeave();
    }
  }

  getByid("openTransformationsImg").onclick = function () {
    if (this.enable == false) return;
    hideAllDrawer("openTransformationsDiv");
    invertDisplayById('openTransformationsDiv');
    if (getByid("openTransformationsDiv").style.display == "none") getByid("TransformationsImgParent").style.position = "";
    else {
      getByid("TransformationsImgParent").style.position = "relative";
      onElementLeave();
    }
  }

  getByid("WindowRevisionOption").onclick = function () {
    if (this.enable == false) return;
    hideAllDrawer("openWindowRevisionDiv");
    invertDisplayById('openWindowRevisionDiv');
    if (getByid("openWindowRevisionDiv").style.display == "none") getByid("WindowRevisionParent").style.position = "";
    else {
      getByid("WindowRevisionParent").style.position = "relative";
      onElementLeave();
    }

    function setWindowSelectStyle() {
      for (var obj of getClass("WindowSelect")) {
        obj.classList.remove("activeImg");
      }
      if (!GetViewport() || isNaN(GetViewport().windowCenter) | isNaN(GetViewport().windowWidth)) return;
      if (!GetViewport().content.image || isNaN(GetViewport().content.image.windowCenter) | isNaN(GetViewport().content.image.windowWidth)) return;

      var active = false;

      for (var obj of getClass("WindowSelect")) {
        if (obj.getAttribute("wc") == GetViewport().windowCenter && obj.getAttribute("ww") == GetViewport().windowWidth) {
          obj.classList.add("activeImg");
          active = true;
        }
      }
      if (active) return;
      if (GetViewport().windowCenter == GetViewport().content.image.windowCenter && GetViewport().windowWidth == GetViewport().content.image.windowWidth) {
        getByid("WindowDefault").classList.add("activeImg");
      } else {
        getByid("WindowCustom").classList.add("activeImg");
      }
    }
    setWindowSelectStyle();
  }

  getByid("SplitWindow").onclick = function () {
    if (this.enable == false) return;
    function createSplitWindow() {
      var outerDiv = getByid("openSplitWindowDiv");
      outerDiv.innerHTML = "";
      outerDiv.selectObj = null;
      outerDiv.style.backgroundColor = "rgb(55,55,55)"
      outerDiv.style.width = (4 * 30 + 4 * 5 + 4) + "px";
      outerDiv.style.height = (4 * 30 + 4 * 5 + 4) + "px";
      outerDiv.onclick = function () {
        if (this.selectObj) {
          this.selectObj.onclick();
          this.selectObj = null;
        }
      }

      for (var r = 0; r < 4; r++) {
        for (var c = 0; c < 4; c++) {
          var div = document.createElement("DIV");
          div.className = "SplitWindowCell";
          div.style.position = "absolute";
          div.style.width = div.style.height = 30 + "px";
          div.style.left = 5 + (5 + 30) * c + "px";
          div.style.top = 5 + (5 + 30) * r + "px";
          div.row = r;
          div.col = c;
          div.style.backgroundColor = "rgb(105,105,105)"
          outerDiv.appendChild(div);
          div.onclick = function () {
            hideAllDrawer();
            Viewport_row = this.row + 1;
            Viewport_col = this.col + 1;
            getByid("MouseOperation").click();
            SetTable();
            window.onresize();
          }
          div.onmouseenter = function () {
            for (var obj of getClass("SplitWindowCell")) {
              if (obj.row <= this.row && obj.col <= this.col) obj.style.backgroundColor = "rgb(170,160,160)"
              else obj.style.backgroundColor = "rgb(105,105,105)"
            }
            getByid("openSplitWindowDiv").selectObj = this;
          }
        }
      }
    }
    hideAllDrawer("openSplitWindowDiv");
    invertDisplayById('openSplitWindowDiv');
    if (getByid("openSplitWindowDiv").style.display == "none") getByid("SplitParent").style.position = "";
    else {
      getByid("SplitParent").style.position = "relative";
      onElementLeave();
      createSplitWindow();
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
    for (var i = 0; i < Viewport_Total; i++)
      if (GetViewport(i).series) leftLayout.refleshMarkWithSeries(GetViewport(i).series);

    getByid("openMeasureImg").click();

    Angle_now_choose = null;
    Angle_previous_choose = null;
    angle.angle_ = "stop";
  }

  for (var element of getClass("img")) {
    if (element && element.alt) {
      element.onmouseover = onElementOver;
      element.onmouseleave = onElementLeave;
    }
  }

  getByid("horizontal_flip").onclick = function () {
    if (this.enable == false) return;
    GetViewport().HorizontalFlip = !GetViewport().HorizontalFlip;
    if (openLink) SetAllViewport("HorizontalFlip", GetViewport().HorizontalFlip);
    refleshViewport();
  }

  getByid("vertical_flip").onclick = function () {
    if (this.enable == false) return;
    GetViewport().VerticalFlip = !GetViewport().VerticalFlip;
    if (openLink) SetAllViewport("VerticalFlip", GetViewport().VerticalFlip);
    refleshViewport();
  }
  getByid("color_invert").onclick = function () {
    if (this.enable == false) return;
    GetViewport().invert = !GetViewport().invert;
    if (openLink) SetAllViewport("invert", GetViewport().invert);
    refleshViewport();
  }

  getByid("unlink").onclick = function () {
    if (this.enable == false) return;
    openLink = !openLink;
    changeLinkImg();
  }

  getByid("resetImg").onclick = function () {
    if (this.enable == false) return;
    resetAndLoadImg();
    hideAllDrawer();
  }

  getByid("eraseRuler").onclick = function () {
    if (this.enable == false) return;
    //cancelTools();
    set_BL_model('erase');
    erase();
    drawBorder(getByid("openMeasureImg"));
    hideAllDrawer();
  }

  getByid("MarkButton").onclick = function () {
    GetViewport().drawMark = !GetViewport().drawMark;
    for (var i = 0; i < Viewport_Total; i++) GetViewportMark(i).getContext("2d").clearRect(0, 0, GetViewport(i).width, GetViewport(i).height);
    displayAllMark()
    changeMarkImg();
  }

  getByid("annotation").onclick = function () {
    if (this.enable == false) return;
    openAnnotation = !openAnnotation;
    displayAnnotation();
  }

  getByid("MarkupImg").onclick = function () {
    if (this.enable == false) return;
    hideAllDrawer();
    openDisplayMarkup = !openDisplayMarkup;
    var TableSelectOnChange = function () {
      GetViewport().div.style.overflowY = "hidden";
      GetViewport().div.style.overflowX = "hidden";
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
    displayAllMark()
  }

  getByid("MarkcolorSelect").onchange = function () {
    displayAllMark()
  }

  for (var obj of getClass("WindowSelect")) {
    obj.onclick = function () {
      if (this.id == "WindowDefault") {
        getByid("textWC").value = GetViewport().windowCenter = GetViewport().content.image.windowCenter;
        getByid("textWW").value = GetViewport().windowWidth = GetViewport().content.image.windowWidth;
        if (openLink) SetAllViewport("windowCenter", GetViewport().windowCenter);
        if (openLink) SetAllViewport("windowWidth", GetViewport().windowWidth);
      }
      else if (this.id == "WindowCustom") {
        getByid("WindowRevision").click()
        return;
      }
      else {
        GetViewport().windowCenter = getByid("textWC").value = parseInt(this.getAttribute('wc'));
        GetViewport().windowWidth = getByid("textWW").value = parseInt(this.getAttribute('ww'));
        if (openLink) SetAllViewport("windowCenter", GetViewport().windowCenter);
        if (openLink) SetAllViewport("windowWidth", GetViewport().windowWidth);
      }
      refleshViewport();
      WindowOpen = true;
      hideAllDrawer();
    }
  }

  /*getByid("WindowLevelSelect").onchange = function () {
    if (getByid("WindowDefault").selected == true) {
      getByid("textWC").value = GetViewport().windowCenter = GetViewport().content.image.windowCenter;
      getByid("textWW").value = GetViewport().windowWidth = GetViewport().content.image.windowWidth;
      if (openLink) SetAllViewport("windowCenter", GetViewport().windowCenter);
      if (openLink) SetAllViewport("windowWidth", GetViewport().windowWidth);
      refleshViewport();
      WindowOpen = true;
      return;
    }
    for (var i = 0; i < getClass("WindowSelect").length; i++) {
      if (getClass("WindowSelect")[i].selected == true) {
        GetViewport().windowCenter = getByid("textWC").value = parseInt(getClass("WindowSelect")[i].getAttribute('wc'));
        GetViewport().windowWidth = getByid("textWW").value = parseInt(getClass("WindowSelect")[i].getAttribute('ww'));
        if (openLink) SetAllViewport("windowCenter", GetViewport().windowCenter);
        if (openLink) SetAllViewport("windowWidth", GetViewport().windowWidth);
        refleshViewport();
        WindowOpen = true;
        break;
      }
    }
  }*/

  getByid("textWC").onchange = function () {
    GetViewport().windowCenter = parseInt(getByid("textWC").value);
    getByid("WindowCustom").selected = true;
    if (openLink) SetAllViewport("windowCenter", GetViewport().windowCenter);
    refleshViewport();
    WindowOpen = true;
  }

  getByid("textWW").onchange = function () {
    GetViewport().windowWidth = parseInt(getByid("textWW").value);
    getByid("WindowCustom").selected = true;
    if (openLink) SetAllViewport("windowWidth", GetViewport().windowWidth);
    refleshViewport();
    WindowOpen = true;
  }

  getByid("labelZoom").onchange = function () {
    if ((zoom <= 25)) getByid('textZoom').value = zoom = 25;
    if (zoom >= 400) getByid('textZoom').value = zoom = 400;
    refleshViewport();
  }

  getByid("markAlphaText").onchange = function () {
    if ((parseInt(getByid('markAlphaText').value) <= 1)) getByid('markAlphaText').value = 1;
    else if ((parseInt(getByid('markAlphaText').value) >= 100)) getByid('markAlphaText').value = 100;
    else if ((parseInt(getByid('markAlphaText').value) < 100));
    else getByid('markAlphaText').value = 100;
    displayAllMark()
  }

  getByid("markSizeText").onchange = function () {
    if ((parseFloat(getByid('markSizeText').value) <= 0.1)) getByid('markSizeText').value = 0.1;
    else if ((parseInt(getByid('markSizeText').value) >= 10)) getByid('markSizeText').value = 10;
    else if ((parseInt(getByid('markSizeText').value) < 10));
    else getByid('markSizeText').value = 1;
    displayAllMark()
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
      getByid("SplitViewportDiv").style.display = "none";
      getByid("MouseOperation").click();
      SetTable();
      window.onresize();
    }
  }
}

function changeMarkImg() {
  if (GetViewport().drawMark == true) getByid("MarkButton").src = "../image/icon/black/fist0.png";
  else getByid("MarkButton").src = "../image/icon/black/fist1.png";
}

function changeLinkImg() {
  if (openLink == true) getByid("unlink").src = "../image/icon/black/b_Link.png";
  else getByid("unlink").src = "../image/icon/black/b_unlink translation synchronization.png";
}

function drawBorder(element) {
  if (element != getByid("b_Scroll")) openChangeFile = false;

  var list = BorderList_Icon;
  for (elemID of list) getByid(elemID).style['border'] = "";

  element.style["border"] = 3 + "px #FFFFFF solid"
  element.style["borderRadius"] = "3px 3px 3px 3px"
}

function img2darkByClass(classname, dark) {
  for(var className of ["img","cropimg"]){
    let icon = getClass(className);
    for (let i = 0; i < icon.length; i++) {
      if (!icon[i].classList.contains(classname)) {
        if (dark) {
          icon[i].style.opacity = 1;
          icon[i].enable = true;
        } else {
          icon[i].style.opacity = 0.25;
          icon[i].enable = false;
        }
      } else {
        icon[i].style.opacity = 1;
        icon[i].enable = true;
      }
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
function hideAllDrawer(id) {
  for (var obj of getClass("drawer")) {
    if (id && obj.id == id) {

    } else {
      obj.style.display = "none";
    }
  }
}