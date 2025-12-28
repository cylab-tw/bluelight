var BorderList_Icon = ["MouseOperation", "WindowRevision", "MeasureRuler", "MouseRotate", "playvideo", "zoom", "b_Scroll", "AngleRuler", "openMeasureImg"];

function html_onload() {
  document.body.style.overscrollBehavior = "none";

  getByid("openFile").onclick = function () {
    if (this.enable == false) return;
    var fileElem = document.createElement("input");
    fileElem.setAttribute("type", "file");
    fileElem.setAttribute("multiple", "multiple");
    fileElem.onchange = function () {
      for (var k = 0; k < this.files.length; k++) {

        function basename(path) { return path.split('.').reverse()[0]; }

        var fileExtension = ("" + basename(this.files[k].name)).toLowerCase();
        if (fileExtension == "mht") wadorsLoader(URL.createObjectURL(this.files[k]));
        else if (fileExtension == "jpg") loadPicture(URL.createObjectURL(this.files[k]));
        else if (fileExtension == "jpeg") loadPicture(URL.createObjectURL(this.files[k]));
        else if (fileExtension == "png") loadPicture(URL.createObjectURL(this.files[k]));
        else if (fileExtension == "webp") loadPicture(URL.createObjectURL(this.files[k]));
        else {
          let reader = new FileReader();
          reader.readAsArrayBuffer(this.files[k]);
          reader.fileExtension = fileExtension;
          reader.url = URL.createObjectURL(this.files[k]);
          ImageManager.NumOfPreLoadSops += 1;
          reader.onloadend = function () {
            var Sop = loadDicomDataSet(reader.result);
            if (Sop) {
              Sop.Image.url = this.url;
              setAllSeriesCount();
              ImageManager.preLoadSops.push({
                dataSet: Sop.dataSet, image: Sop.Image, Sop: Sop, SeriesInstanceUID: Sop.Image.SeriesInstanceUID,
                Index: Sop.Image.NumberOfFrames | Sop.Image.InstanceNumber
              });
            }
            ImageManager.NumOfPreLoadSops -= 1;
            if (ImageManager.NumOfPreLoadSops == 0) ImageManager.loadPreLoadSops();
          }
        }
      }
    }
    fileElem.click();
  }

  //點到其他地方時，關閉抽屜
  getByid("container").addEventListener("mousedown", hideAllDrawer, false);

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
      }
      else {
        addFile(item);
      }
    }
    function addFile(item) {
      item.file(function (file) {
        var url = URL.createObjectURL(file);

        function basename(path) {
          return path.split('.').reverse()[0];
        }
        var fileExtension = ("" + basename(file.name)).toLowerCase();
        if (fileExtension == "mht") wadorsLoader(url);
        else if (fileExtension == "jpg") loadPicture(url);
        else if (fileExtension == "jpeg") loadPicture(url);
        else if (fileExtension == "png") loadPicture(url);
        else if (fileExtension == "webp") loadPicture(url);
        else {
          let reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.fileExtension = fileExtension;

          ImageManager.NumOfPreLoadSops += 1;
          reader.onloadend = function () {
            var Sop = loadDicomDataSet(reader.result, false, url, true);
            if (Sop) {
              Sop.Image.url = url;
              setAllSeriesCount();
              ImageManager.preLoadSops.push({
                dataSet: Sop.dataSet, image: Sop.Image, Sop: Sop, SeriesInstanceUID: Sop.Image.SeriesInstanceUID,
                Index: Sop.Image.NumberOfFrames | Sop.Image.InstanceNumber
              });
            }
            ImageManager.NumOfPreLoadSops -= 1;
            if (ImageManager.NumOfPreLoadSops == 0) ImageManager.loadPreLoadSops();
          }
        }
      });
    }

    if (e.dataTransfer && e.dataTransfer.items) {
      var items = e.dataTransfer.items;
      for (var i = 0; i < items.length; i++) {
        var item = items[i].webkitGetAsEntry();
        if (item) addDirectory(item);
      }
    }
  }

  getByid("MouseOperation").onclick = function () {
    if (this.enable == false) return;
    hideAllDrawer();
    mouseTool();
    drawBorder(this);
  }

  getByid("MouseRotate").onclick = function () {
    if (this.enable == false) return;
    rotate();
    drawBorder(this);
  }

  getByid("zoom").onclick = function () {
    if (this.enable == false) return;
    zoom();

    hideAllDrawer("zoomDiv");
    invertDisplayById('zoomDiv');
    if (getByid("zoomDiv").style.display == "none") getByid("zoomParent").style.position = "";
    else {
      getByid("zoomParent").style.position = "relative";
      onElementLeave();
    }

    drawBorder(this);
  }

  getByid("Rotate_90").onclick = function () {
    GetViewport().rotate += 90;
    GetViewport().rotate = (GetViewport().rotate % 360 + 360) % 360;//有考慮負值
    setTransform();
    if (openLink == true) {
      SetAllViewport("rotate", GetViewport().rotate);
      setTransformAll();
    }
  }

  getByid("Rotate_i90").onclick = function () {
    GetViewport().rotate -= 90;
    GetViewport().rotate = (GetViewport().rotate % 360 + 360) % 360;//有考慮負值
    setTransform();
    if (openLink == true) {
      SetAllViewport("rotate", GetViewport().rotate);
      setTransformAll();
    }
  }

  getByid("Rotate_0").onclick = function () {
    GetViewport().rotate = 0;
    setTransform();
    if (openLink == true) {
      SetAllViewport("rotate", GetViewport().rotate);
      setTransformAll();
    }
  }

  getByid("WindowRevision").onclick = function () {
    if (this.enable == false) return;
    windowlevel();
    //hideAllDrawer("windowlevel");
    hideAllDrawer("WindowLevelDiv");
    invertDisplayById('WindowLevelDiv');
    if (getByid("WindowLevelDiv").style.display == "none") getByid("WindowLevelDiv_span").style.position = "";
    else {
      getByid("WindowLevelDiv_span").style.position = "relative";
      onElementLeave();
    }

    drawBorder(this);
    getByid("textWC").value = GetViewport().windowCenter;
    getByid("textWW").value = GetViewport().windowWidth;
  }

  getByid("TrueSizeImg").onclick = function () {
    ScaleToTrueSize();
  }

  getByid("clearviewportImg").onclick = function () {
    var clearviewportWindow = document.createElement("DIV");
    clearviewportWindow.style.width = "40vw";
    clearviewportWindow.style.height = "40vh";
    clearviewportWindow.style.position = "absolute";

    clearviewportWindow.style.zIndex = "105";
    clearviewportWindow.style.left = "0";
    clearviewportWindow.style.right = "0";
    clearviewportWindow.style.top = "0";
    clearviewportWindow.style.bottom = "0";
    clearviewportWindow.style.margin = "auto";
    clearviewportWindow.style.backgroundColor = "rgba(30,60,90,0.8)";
    clearviewportWindow.style["display"] = "flex";
    clearviewportWindow.style["justify-content"] = "center";
    var label = document.createElement("LABEL");
    label.innerText = "clear and reset all viewport?";
    label.style['color'] = "white";
    label.style['position'] = "absolute";
    label.style['font-size'] = "24px";
    label.style['user-select'] = "none";
    var btn_remove = document.createElement("BUTTON");
    btn_remove.style.cssText = "top: 50%;left: 25%;transform: scale(1.5);position: absolute;"
    btn_remove.innerText = "Remove";
    var btn_cancel = document.createElement("BUTTON");
    btn_cancel.style.cssText = "top: 50%;left: 75%;transform: scale(1.5);position: absolute;"
    btn_cancel.innerText = "Cancel";
    btn_cancel.window = clearviewportWindow;
    btn_remove.window = clearviewportWindow;
    clearviewportWindow.appendChild(label);
    clearviewportWindow.appendChild(btn_remove);
    clearviewportWindow.appendChild(btn_cancel);
    getByid("container").appendChild(clearviewportWindow);

    btn_cancel.onclick = function () { getByid("container").removeChild(this.window); };
    btn_remove.onclick = function () {
      hideAllDrawer();
      GetViewport().clear();
      displayMark();
      displayRuler();
      displayAnnotation();
      VIEWPORT.loadViewport(GetViewport(), null, viewportNumber);
      setSeriesCount();
      getClass("labelLT")[viewportNumber].innerText = "";
      getClass("labelRT")[viewportNumber].innerText = "";
      getClass("labelRB")[viewportNumber].innerText = "";
      PatientMark = [];
      ImageManager = new BlueLightImageManager()
      getByid("LeftPicture").innerHTML = "";

      for (var i = 0; i < Viewport_Total; i++) {
        GetViewport(i).clear();
        VIEWPORT.loadViewport(GetViewport(), null, i);
        getClass("labelLT")[i].innerText = "";
        getClass("labelRT")[i].innerText = "";
        getClass("labelRB")[i].innerText = "";
        displayRuler(i);
      }
      getByid("container").removeChild(this.window);
    }
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
  getByid("KOimg").onclick = function () {
    if (this.enable == false) return;
    hideAllDrawer("KoDrawerDIv");
    invertDisplayById('KoDrawerDIv');
    if (getByid("KoDrawerDIv").style.display == "none") getByid("KOImgParent").style.position = "";
    else {
      getByid("KOImgParent").style.position = "relative";
      //onElementLeave();
    }
  }
  getByid("OnlyShowKOImg").onclick = function () {
    GetViewport().KO = !GetViewport().KO;
    invertDisplayById('KoDrawerDIv');
    if (PatientMark.filter(M => GetViewport().Sop.SOPInstanceUID == M.sop && M.type == "KO").length == 0) {
      GetViewport().nextFrame();
    }
  }
  getByid("LockKOImg").onclick = function () {
    var div = createElem('div', 'KoSelectDrawer', 'drawer');
    getByid("LockKO_span").appendChild(div);
    var SeriesDescriptionList = [];
    for (var M of getMarkFromKoStudy(GetViewport().study)) {
      if (SeriesDescriptionList.includes(M.SeriesDescription)) continue; //防止重複

      var innerDiv = createElem('div', undefined, 'KoSelect');
      innerDiv.innerHTML = innerDiv.SeriesDescription = M.SeriesDescription;
      innerDiv.style.color = "white";
      div.appendChild(innerDiv);
      innerDiv.onclick = function () {
        GetViewport().KO_SeriesDescription = this.SeriesDescription;
        invertDisplayById('KoDrawerDIv');
      }
      SeriesDescriptionList.push(M.SeriesDescription);
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

  getByid("annotationOption").onclick = function () {
    if (this.enable == false) return;
    hideAllDrawer("annotationDiv");
    invertDisplayById('annotationDiv');
    if (getByid("annotationDiv").style.display == "none") getByid("annotationOption_span").style.position = "";
    else {
      getByid("AnnotationParent").style.position = "relative";
      onElementLeave();
    }
  }

  getByid("ShowDicomTag").onclick = function () {
    displayDicomTagsList();
    hideAllDrawer("annotationDiv");
    invertDisplayById('annotationDiv');
    getByid("annotationOption_span").style.position = "";
  }
  getByid("ShowScrollBar").onclick = function () {
    ScrollBar.ShowOrHide = !ScrollBar.ShowOrHide;
    for (var z = 0; z < Viewport_Total; z++) GetViewport(z).ScrollBar.reflesh();
    hideAllDrawer("annotationDiv");
    invertDisplayById('annotationDiv');
    getByid("annotationOption_span").style.position = "";
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
      outerDiv.style.width = (6 * 30 + 6 * 5 + 6) + "px";
      outerDiv.style.height = (4 * 30 + 4 * 5 + 4) + "px";
      outerDiv.onclick = function () {
        if (this.selectObj) {
          this.selectObj.onclick();
          this.selectObj = null;
        }
      }
      var b_col2x1 = document.createElement("img");
      var b_row1x2 = document.createElement("img");
      b_col2x1.className = b_row1x2.className = "img";
      b_col2x1.src = "../image/icon/lite/b_col2x1.png";
      b_row1x2.src = "../image/icon/lite/b_row1x2.png";
      b_col2x1.style["max-width"] = b_row1x2.style["max-width"] = "unset";
      b_col2x1.style.position = b_row1x2.style.position = "absolute";
      b_col2x1.style.width = b_col2x1.style.height = 60 + "px";
      b_row1x2.style.width = b_row1x2.style.height = 60 + "px";
      b_col2x1.style.left = b_row1x2.style.left = b_col2x1.style.top = "6px";
      b_row1x2.style.top = "72px";
      outerDiv.appendChild(b_col2x1);
      outerDiv.appendChild(b_row1x2);
      b_col2x1.onclick = function (e) {
        e.stopPropagation();
        hideAllDrawer();
        Viewport_row = Viewport_col = 2;
        getByid("MouseOperation").click();
        if (viewportNumber >= 2) viewportNumber = 0;
        BlueLightViewPort.only1Viewport = -1;
        GridMode = "fullcol";
        SetTable();
        window.onresize();
      }
      b_row1x2.onclick = function (e) {
        e.stopPropagation();
        hideAllDrawer();
        Viewport_row = Viewport_col = 2;
        getByid("MouseOperation").click();
        if (viewportNumber >= 2) viewportNumber = 0;
        BlueLightViewPort.only1Viewport = -1;
        GridMode = "fullrow";
        SetTable();
        window.onresize();
      }
      for (var r = 0; r < 4; r++) {
        for (var c = 0; c < 4; c++) {
          var div = document.createElement("DIV");
          div.className = "SplitWindowCell";
          div.style.position = "absolute";
          div.style.width = div.style.height = 30 + "px";
          div.style.left = (36 * 2) + 5 + (5 + 30) * c + "px";
          div.style.top = 5 + (5 + 30) * r + "px";
          div.row = r;
          div.col = c;
          div.style.backgroundColor = "rgb(105,105,105)"
          outerDiv.appendChild(div);
          div.onclick = function () {
            GridMode = "default";
            hideAllDrawer();
            Viewport_row = this.row + 1;
            Viewport_col = this.col + 1;
            getByid("MouseOperation").click();
            if (viewportNumber >= Viewport_row * Viewport_col) viewportNumber = 0;
            BlueLightViewPort.only1Viewport = -1;
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
    if (!Mark_previous_choose) return;
    var type = Mark_previous_choose.type || Mark_previous_choose.dcm.type;

    if (type) {
      PatientMark.splice(PatientMark.indexOf(Mark_previous_choose.dcm), 1);
      displayMark();
      Mark_previous_choose = null;
      refreshMarkFromSop(GetViewport().sop);
    }
    Mark_previous_choose = null;
  }

  /*getByid("settingImg").onclick = function () {

  }*/

  getByid("removeAllRuler").onclick = function () {
    var removeRulerWindow = document.createElement("DIV");
    removeRulerWindow.className = "removeRulerWindow";

    var label = document.createElement("LABEL");
    label.innerText = "Remove all measurements?";
    label.style['color'] = "white";
    label.style['position'] = "absolute";
    label.style['font-size'] = "24px";
    label.style['user-select'] = "none";
    var btn_remove = document.createElement("BUTTON");
    btn_remove.style.cssText = "top: 50%;left: 25%;transform: scale(1.5);position: absolute;"
    btn_remove.innerText = "Remove";
    var btn_cancel = document.createElement("BUTTON");
    btn_cancel.style.cssText = "top: 50%;left: 75%;transform: scale(1.5);position: absolute;"
    btn_cancel.innerText = "Cancel";
    btn_cancel.window = removeRulerWindow;
    btn_remove.window = removeRulerWindow;
    removeRulerWindow.appendChild(label);
    removeRulerWindow.appendChild(btn_remove);
    removeRulerWindow.appendChild(btn_cancel);
    getByid("container").appendChild(removeRulerWindow);

    btn_cancel.onclick = function () { getByid("container").removeChild(this.window); };
    btn_remove.onclick = function () {
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
      for (var i = 0; i < Viewport_Total; i++)
        if (GetViewport(i).series) leftLayout.refleshMarkWithSeries(GetViewport(i).series);

      Angle_now_choose = null;
      Angle_previous_choose = null;
      angleState = "stop";
      getByid("container").removeChild(this.window);
    };
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

  getByid("ScrollBarSelect").onchange = function () {
    if (getByid("ScrollBarSelectShow").selected == true) ScrollBar.ShowOrHide = true;
    else if (getByid("ScrollBarSelectHide").selected == true) ScrollBar.ShowOrHide = false;
    for (var z = 0; z < Viewport_Total; z++) GetViewport(z).ScrollBar.reflesh();
  }

  /*getByid("rwdImgTag").onclick = function () {
    EnterRWD();
  }*/

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
      hideAllDrawer();
    }
  }

  getByid("textWC").onchange = function () {
    GetViewport().windowCenter = parseInt(getByid("textWC").value);
    getByid("WindowCustom").selected = true;
    if (openLink) SetAllViewport("windowCenter", GetViewport().windowCenter);
    refleshViewport();
  }

  getByid("textWW").onchange = function () {
    GetViewport().windowWidth = parseInt(getByid("textWW").value);
    getByid("WindowCustom").selected = true;
    if (openLink) SetAllViewport("windowWidth", GetViewport().windowWidth);
    refleshViewport();
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

  getByid("MouseOperation").click();
}

function changeMarkImg() {
  if (GetViewport().drawMark == true) getByid("MarkButton").src = "../image/icon/lite/fist0.png";
  else getByid("MarkButton").src = "../image/icon/lite/fist1.png";
}

function changeLinkImg() {
  if (openLink == true) getByid("unlink").src = "../image/icon/lite/b_Link.png";
  else getByid("unlink").src = "../image/icon/lite/b_unlink translation synchronization.png";
}

function changeCineImg() {
  if (GetViewport().cine) getByid('playvideo').src = '../image/icon/lite/b_CinePause.png';
  else getByid('playvideo').src = '../image/icon/lite/b_CinePlay.png';
}

function drawBorder(element) {

  var list = BorderList_Icon;
  for (var elemID of list) getByid(elemID).style['border'] = "";

  element.style["border"] = 3 + "px #FFFFFF solid"
  element.style["borderRadius"] = "3px 3px 3px 3px"
}

function img2darkByClass(classname, dark) {
  for (var className of ["img", "cropimg"]) {
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
    if (id && obj.id == id);
    else obj.style.display = "none";
  }
  SetTable();
}