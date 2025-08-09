//代表VR模式為開啟狀態
var openVR = false, openMPR = false;
//代表VR影像正在渲染中
var openRendering = false;
//VR橫切片與縱切片數量
var o3Dcount = 0;
//3D VR的貼皮數量
var o3d_3degree = -1;
//3D VR的切片數量
var o3DListLength = 0;

//3D VR模型的透明度百分比
var o3DAlphaValue = 100;
//代表3D挖掘模式為開啟狀態
var openCave = false;
//代表切片厚度
var Thickness = 1;

var degerrX = 0;
var degerrY = 0;
var degerrX_2 = 0;
var degerrY_2 = 90;
var degerrX_2 = 90;
var degerrY_2 = 0;
//var o3dDirection = 1;
var Direction_VR = 1;
var rotateStep = 3;
var rotateSpeed = 12;
var zoomRatio3D = 1;
var origin_openAnnotation;

function load3DPlugin() {
    if (getByid("3DImgParent")) return;
    var span = document.createElement("SPAN");
    span.id = "3DImgParent";
    span.innerHTML = `
     <img class="img" loading="lazy" altzhtw="3D" alt="3D" id="3dDrawerImg" src="../image/icon/lite/3D.png"
          width="50" height="50">
    <div id="3DImgeDIv" class="drawer" style="position:absolute;left: 0;white-space:nowrap;z-index: 100;
    width: 500; display: none;background-color: black;">`;
    addIconSpan(span);
    getByid("3dDrawerImg").onclick = function () {
        if (this.enable == false) return;
        hideAllDrawer("3DImgeDIv");
        invertDisplayById('3DImgeDIv');
        if (getByid("3DImgeDIv").style.display == "none") getByid("3DImgParent").style.position = "";
        else {
            getByid("3DImgParent").style.position = "relative";
            //onElementLeave();
        }
    }
}

function loadVR() {
    load3DPlugin();
    var span = document.createElement("SPAN");
    span.innerHTML =
        ` <img class="img VR" alt="exitVR" id="exitVR" onmouseover="onElementOver(this);" onmouseleave="onElementLeave();" src="../image/icon/lite/exit.png" width="50" height="50" style="display:none;" >
        <img class="img VR MPR" alt="Render" id="3dDisplay" onmouseover = "onElementOver(this);" onmouseleave = "onElementLeave();" src="../image/icon/lite/b_DisplayReset.png"
    style="display:none;" width="50" height="50">
    <img class="img VR" alt="Scalpel" id="3dCave" onmouseover = "onElementOver(this);" onmouseleave = "onElementLeave();" src="../image/icon/lite/b_Cross-hair_OFF.png" style="display:none;"
    width="50" height="50">`;
    addIconSpan(span);

    var span = document.createElement("SPAN");
    span.innerHTML = `<img class="innerimg VR" alt="VR" id="ImgVR" onmouseover = "onElementOver(this);" onmouseleave = "onElementLeave();" src="../image/icon/lite/b_3D_off.png" width="50" height="50">`;
    if (getByid("3DImgeDIv").childNodes.length > 0) getByid("3DImgeDIv").appendChild(document.createElement("BR"));
    getByid("3DImgeDIv").appendChild(span); //addIconSpan(span); 

    var span = document.createElement("SPAN");
    span.innerHTML =
        `<div id="VR_setup" style="background-color:#84420044;">
      <label style="color: #ffffff;" id="o3dPresetLabel">Preset：</label>
      <select id="o3DStyle">
        <option selected="selected">Auto</option>
        <option id="o3DAngio">Angio</option>
        <option id="o3DAirways">Airways</option>
        <option id="o3DcomCombine">Combine</option>
        <option id="o3DcomCombine2">Combine2</option>
        <option id="o3DMip">MIP</option>
        <option id="o3DMinIP">MinIP</option>
      </select>
      <font color="white" id="o3dAlphaValueLabel">Alpha：</font><input type="text" id="o3dAlphaValueText" size="3"
        value="100" />
      <label style="color: #ffffff;" id="smoothLabel">Smooth<input type="checkbox" name="3dSmooth"
          id="3dSmooth"></label>
      <label style="color: #ffffff;" id="yellowColorLabel">Color<input type="checkbox" name="3dYellow"
          id="3dYellow"></label>
      <label style="color: #ffffff;" id="3dShadowLabel">shadow
        <!--<input type="checkbox" name="3dShadow" id="3dShadow">-->
        <select name="3dShadow" id="3dShadow">
          <option id="3dShadow_0">None</option>
          <option id="3dShadow_05">0.005</option>
          <option id="3dShadow_1">0.01</option>
          <option id="3dShadow_2">0.02</option>
          <option id="3dShadow_3" selected="selected">0.03</option>
          <option id="3dShadow_4">0.04</option>
          <option id="3dShadow_5">0.05</option>
          <option id="3dShadow_6">0.06</option>
          <option id="3dShadow_7">0.07</option>
          <option id="3dShadow_8">0.08</option>
          <option id="3dShadow_12">0.12</option>
        </select>
      </label>
      <label style="color: #ffffff;display:none" id="3dInsertLabel">Insert(hide)：<input type="text" id="3dInsertText"
          size="1" value="0" /></label>
      <label style="color: #ffffff;" id="3Dskin">Skin：<input type="text" id="3DskinText" size="3" value="25" /></label>
      <label style="color: #ffffff;" id="3dStrengthenLabel">3D Strengthen：
        <select id="3dStrengthen">
          <option selected="selected" id="3dStrengthenAuto">Auto</option>
          <option id="3dStrengthenAlways">Always</option>
          <option id="3dStrengthenNone">None</option>
        </select>
      </label>
      <label style="color: #ffffff;" id="3dZipLabel">3D Zip：<input type="checkbox" checked="true"
          id="3dZipCheckbox"><input type="text" id="3dZipText" size="3" value="50" /></label>
      <label style="color: #ffffff;display:none" id="3dPerspectiveLabel">perspective：<input type="text"
          id="3dPerspective" value="10000" /></label>
      <img width="25" height="25" src="../image/icon/lite/download.png" onclick="VRscreenshot();">
    </div>`
    getByid("page-header").appendChild(span);

    var span = document.createElement("SPAN");
    span.innerHTML =
        `<div id="WindowLevelDiv_VR" class="VR_div" style="background-color:#33666644;">
    <font color="white" id="myWC_VR">WC：</font><input type="text" id="textWC_VR" value="520" />
    <font color="white" id="myWW_VR">WW：</font><input type="text" id="textWW_VR" value="50" />
    <select id="WindowLevelSelect_VR">
      <option id="WindowDefault_VR" selected="selected">Default</option>
      <option id="WindowCustom_VR">Custom</option>
      <option class="WindowSelect_VR" id="WindowAbdomen_VR" wc="60" ww="400">Abdomen(60,400)</option>
      <option class="WindowSelect_VR" id="WindowAngio_VR" wc="300" ww="600">Angio(300,600)</option>
      <option class="WindowSelect_VR" id="WindowBone_VR" wc="300" ww="1500">Bone(300,1500)</option>
      <option class="WindowSelect_VR" id="WindowBrain_VR" wc="40" ww="80">Brain(40,80)</option>
      <option class="WindowSelect_VR" id="WindowChest_VR" wc="40" ww="400">Chest(40,400)</option>
      <option class="WindowSelect_VR" id="WindowLungs_VR" wc="-400" ww="1500">Lungs(-400,1500)</option>
    </select>
  </div>`
    getByid("page-header").appendChild(span);

    getByid("WindowLevelDiv_VR").style.display = "none";
    getByid("VR_setup").style.display = "none";
    getByid("3dDisplay").style.display = "none";
    getByid("exitVR").style.display = "none";
    getByid("3dCave").style.display = "none";
}
loadVR();

function loadVR_UI() {
    if (!getByid("MouseOperation_VR")) {
        var img = document.createElement("IMG");
        img.src = getByid("MouseOperation").src;
        img.id = "MouseOperation_VR";
        img.className = "VR_icon";
        img.width = img.height = "50";
        img.style.filter = "sepia(100%)"
        getByid("MouseOperation_span").appendChild(img);
    }
    if (!getByid("WindowRevision_VR")) {
        var img = document.createElement("IMG");
        img.src = getByid("WindowRevision").src;
        img.id = "WindowRevision_VR";
        img.className = "VR_icon";
        img.width = "38";
        img.height = "50";
        img.style.filter = "sepia(100%)"
        getByid("WindowRevision_span").appendChild(img);
    }
}
loadVR_UI();
getByid("MouseOperation_VR").style.display = "none";
getByid("WindowRevision_VR").style.display = "none";
getByid("WindowLevelDiv_VR").style.display = "none";

function enterVR_UI() {
    getByid("MouseOperation_VR").style.display = "";
    getByid("WindowRevision_VR").style.display = "";
    //getByid("WindowLevelDiv_VR").style.display = "";
    getByid("MouseOperation").style.display = "none";
    getByid("WindowRevision").style.display = "none";
    getByid("WindowLevelDiv").style.display = "none";
    openLeftImgClick = false;
}

function exitVR_UI() {
    getByid("MouseOperation_VR").style.display = "none";
    getByid("WindowRevision_VR").style.display = "none";
    getByid("WindowLevelDiv_VR").style.display = "none";
    getByid("MouseOperation").style.display = "";
    getByid("WindowRevision").style.display = "";
    getByid("WindowLevelDiv").style.display = "";
    openLeftImgClick = true;
}

function drawBorderVR(element) {
    var VR_icon = getClass("VR_icon");
    for (var i = 0; i < VR_icon.length; i++) VR_icon[i].style['border'] = "";
    element.style['border'] = 3 + "px #FFFFFF solid";
    element.style['borderRadius'] = "3px 3px 3px 3px";
}

getByid("WindowRevision_VR").onclick = function () {
    var VR_div = getClass("VR_div");
    for (var i = 0; i < VR_div.length; i++) VR_div[i].style['border'] = "";
    getByid('WindowLevelDiv_VR').style.display = '';
    drawBorderVR(this);
}

getByid("MouseOperation_VR").onclick = function () {
    if (this.enable == false) return;
    var VR_div = getClass("VR_div");
    for (var i = 0; i < VR_div.length; i++) VR_div[i].style.display = "none";
    //mouseTool_VR();
    //cancelTools();
    drawBorderVR(this);
}

getByid("textWC_VR").onchange = function () {
    GetViewport().windowCenter = parseInt(textWC_VR.value);
    getByid("WindowCustom_VR").selected = true;
}

getByid("textWW_VR").onchange = function () {
    GetViewport().windowWidth = parseInt(textWW_VR.value);
    getByid("WindowCustom_VR").selected = true;
}

getByid("WindowLevelSelect_VR").onchange = function () {
    if (getByid("WindowDefault").selected == true) {
        getByid("textWC_VR").value = GetViewport().windowCenter = GetViewport().windowCenter;
        getByid("textWW_VR").value = GetViewport().windowWidth = GetViewport().windowWidth;
    }
    for (var i = 0; i < getClass("WindowSelect_VR").length; i++) {
        if (getClass("WindowSelect_VR")[i].selected == true) {
            GetViewport().windowCenter = getByid("textWC_VR").value = parseInt(getClass("WindowSelect_VR")[i].getAttribute('wc'));
            GetViewport().windowWidth = getByid("textWW_VR").value = parseInt(getClass("WindowSelect_VR")[i].getAttribute('ww'));
        }
    }
}

getByid("ImgVR").onclick = function (catchError) {
    if (this.enable == false && catchError != "error") return;
    getByid("3DImgeDIv").style.display = "none";
    openVR = !openVR;
    if (catchError == "error") openVR = false;
    img2darkByClass("VR", !openVR);
    initVR();
    if (openVR) getByid("MouseOperation_VR").click();
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

getByid("o3dAlphaValueText").onchange = function () {
    if ((parseInt(getByid('o3dAlphaValueText').value) <= 1)) getByid('o3dAlphaValueText').value = 1;
    else if (parseInt(getByid('o3dAlphaValueText').value) >= 100) getByid('o3dAlphaValueText').value = 100;
    o3DAlphaValue = parseInt(getByid('o3dAlphaValueText').value);
}

getByid("3dInsertText").onchange = function () {
    if ((parseFloat(getByid('3dInsertText').value) <= 0)) getByid('3dInsertText').value = 0;
    else if ((parseInt(getByid('3dInsertText').value) >= 5)) getByid('3dInsertText').value = 5;
    else if ((parseInt(getByid('3dInsertText').value) < 5));
    else getByid('3dInsertText').value = 1;
    // displayAllMark();
}

getByid("3DskinText").onchange = function () {
    if ((parseFloat(getByid('3DskinText').value) <= 0)) getByid('3DskinText').value = 0;
    else if ((parseInt(getByid('3DskinText').value) >= 100)) getByid('3DskinText').value = 100;
    else if ((parseInt(getByid('3DskinText').value) < 100));
    else getByid('3DskinText').value = 0;
    // displayAllMark();
}
getByid("3dShadow").onchange = function () {
    setVrLight();
}

getByid("3dStrengthen").onchange = function () {
    if (getByid("3dStrengthenAuto").selected == true || getByid("3dStrengthenAlways").selected || getByid("o3DMinIP").selected) {
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

getByid("3dDisplay").onclick = function () {
    o3dWindowLevel();
}

getByid("exitVR").onclick = function () {
    if (this.enable == false) return;
    getByid("3DImgeDIv").style.display = "none";
    openVR = false;
    img2darkByClass("VR", !openVR);
    initVR();
}

getByid("3dCave").onclick = function () {
    openCave = !openCave;
    if (openCave == true) this.src = '../image/icon/lite/b_Cross-hair_ON.png';
    else this.src = '../image/icon/lite/b_Cross-hair_OFF.png';
}

function resizeVR(event) {
    for (var tempSizeNum = 0; tempSizeNum < Viewport_Total; tempSizeNum++) {
        //如果VR及MPR開著，刷新VR的大小(MPR的右下角也有VR)
        if (openVR == true || openMPR == true) {
            for (var ll = 0; ll < o3DListLength; ll++) {
                var div1 = getByid("3DDiv" + ll);
                var WandH = 0;
                if (openVR) WandH = getViewportFixSize(window.innerWidth, window.innerHeight, 1, 1);
                else if (openMPR) WandH = getViewportFixSize(window.innerWidth, window.innerHeight, 2, 2);
                div1.style.width = WandH[0] + "px";
                div1.style.height = WandH[1] + "px";
            }
            for (var ll = 0; ll < o3d_3degree; ll++) {
                var div2 = getByid("3DDiv2_" + ll);
                var WandH = 0;
                if (openVR) WandH = getViewportFixSize(window.innerWidth, window.innerHeight, 1, 1);
                else if (openMPR) WandH = getViewportFixSize(window.innerWidth, window.innerHeight, 2, 2);
                div2.style.width = WandH[0] + "px";
                div2.style.height = WandH[1] + "px";

                var div3 = getByid("3DDiv3_" + ll);
                div3.style.width = WandH[0] + "px";
                div3.style.height = WandH[1] + "px";
            }
            if (tempSizeNum != viewportNumber) continue;
        }
    }
}

function initVR() {
    if (openVR == false) {
        exitVR_UI();
        document.body.style.perspective = "";
        document.body.style.transformStyle = "";
        VIEWPORT.fixRow = VIEWPORT.fixCol = null;
        getByid("3dYellow").checked = false;
        for (var ll = 0; ll < o3DListLength; ll++) {
            try {
                var elem = getByid("3DDiv" + ll);
                elem.canvas().width = 2;
                elem.canvas().height = 2;
                elem.getElementsByClassName("VrCanvas")[0] = null;
                delete elem.canvas();
                elem.parentElement.removeChild(elem);
                delete elem;
            } catch (ex) { }
        }
        for (var ll = 0; ll < o3d_3degree; ll++) {
            try {
                var elem = getByid("3DDiv2_" + ll);
                elem.canvas().width = 2;
                elem.canvas().height = 2;
                elem.getElementsByClassName("VrCanvas")[0] = null;
                elem = getByid("3DDiv3_" + ll);
                elem.canvas().width = 2;
                elem.canvas().height = 2;
                elem.getElementsByClassName("VrCanvas")[0] = null;
            } catch (ex) { }
        }
        // o3DListLength = 0;
        window.removeEventListener("resize", resizeVR, false);
        GetViewport(0).div.removeEventListener("mousemove", mousemove3D, false);
        GetViewport(0).div.removeEventListener("mousedown", mousedown3D, false);
        GetViewport(0).div.removeEventListener("mouseup", mouseup3D, false);
        GetViewport(0).div.removeEventListener("touchstart", touchstart3D, false);
        GetViewport(0).div.removeEventListener("touchmove", touchmove3D, false);
        GetViewport(0).div.removeEventListener("touchend", touchend3D, false);

        cancelTools();
        drawBorder(getByid("MouseOperation"));
        getByid("ImgVR").src = "../image/icon/lite/b_3D_off.png";
        getByid("3dDisplay").style.display = "none";
        getByid("exitVR").style.display = "none";
        getByid("VR_setup").style.display = "none";
        getByid("WindowLevelDiv_VR").style.display = "none";
        getByid("3dCave").style.display = "none";

        if (getByid("OutSide3dDiv")) {
            delete getByid("OutSide3dDiv");
            getByid("OutSide3dDiv").parentElement.removeChild(getByid("OutSide3dDiv"));
        }
        try {
            getByid("MprCanvas1").style.display = "none";
            getByid("MprCanvas2").style.display = "none";
        } catch (ex) { }
        viewportNumber = 0;
        SetTable(); //這個目前需要
        window.onresize();

        GetViewport().loadImgBySop(GetViewport(0).Sop); // setSopToViewport(GetViewport(0).sop, 0);

        o3DListLength = 0;

        if (origin_openAnnotation == true || origin_openAnnotation == false) openAnnotation = origin_openAnnotation;
        displayAnnotation();
        for (var c = 0; c < Viewport_Total; c++) GetViewport(c).canvas.style.display = GetViewportMark(c).style.display = "";
        getByid("MouseOperation").click();
        ToolEvt.enable = true;
        //_initNewCanvas_();
    } else if (openVR == true) {
        ToolEvt.enable = false;
        enterVR_UI();
        getByid("3dYellow").checked = true;
        VIEWPORT.fixRow = VIEWPORT.fixCol = 1;//如果VR模式正在開啟，固定1x1
        openLink = false;
        changeLinkImg();
        origin_openAnnotation = openAnnotation;
        openAnnotation = false;

        getByid("3dDisplay").style.display = "";
        getByid("exitVR").style.display = "";
        getByid("VR_setup").style.display = "";
        getByid("3dCave").style.display = "";
        cancelTools();
        getByid("ImgVR").src = "../image/icon/lite/b_3D_on.png";
        var sop = GetViewport().sop;
        var tmpviewportNumber = viewportNumber;
        SetTable(1, 1);
        viewportNumber = tmpviewportNumber;
        GetViewport().scale = null;

        GetViewport().reload();
        displayAnnotation();

        GetViewport().canvas.style.display = "none";
        GetViewportMark().style.display = "none";
        GetViewport(0).canvas.style.display = "none";
        GetViewportMark(0).style.display = "none";

        window.addEventListener("resize", resizeVR, false);

        GetViewport(0).div.addEventListener("mousemove", mousemove3D, false);
        GetViewport(0).div.addEventListener("mousedown", mousedown3D, false);
        GetViewport(0).div.addEventListener("mouseup", mouseup3D, false);
        GetViewport(0).div.addEventListener("touchstart", touchstart3D, false);
        GetViewport(0).div.addEventListener("touchmove", touchmove3D, false);
        GetViewport(0).div.addEventListener("touchend", touchend3D, false);
        //GetViewport(0).div.addEventListener("contextmenu", contextmenuF, false);
        for (var ll = 0; ll < o3DListLength; ll++) {
            var elem = getByid("3DDiv" + ll);
            GetViewport(0).div.appendChild(elem);
        }
        var list = sortInstance(sop);
        var WandH = getFixSize(window.innerWidth, window.innerHeight, GetViewport(0).div);
        if (o3DListLength != list.length) {
            for (var ll = 0; ll < o3DListLength; ll++) {
                try {
                    var elem = getByid("3DDiv" + ll);
                    elem.canvas().width = 2;
                    elem.canvas().height = 2;
                    elem.getElementsByClassName("VrCanvas")[0] = null;
                    delete elem.canvas();
                    elem.parentElement.removeChild(elem);
                    delete elem;
                } catch (ex) { }
            }
        }
        if (o3d_3degree >= 0) {
            for (var ll = 0; ll < o3d_3degree; ll++) {
                try {
                    var elem = getByid("3DDiv2_" + ll);
                    elem.canvas().width = 2;
                    elem.canvas().height = 2;
                    elem.getElementsByClassName("VrCanvas")[0] = null;
                    delete elem.canvas();
                    elem.parentElement.removeChild(elem);
                    delete elem;
                } catch (ex) { }
                try {
                    var elem = getByid("3DDiv3_" + ll);
                    elem.canvas().width = 2;
                    elem.canvas().height = 2;
                    elem.getElementsByClassName("VrCanvas")[0] = null;
                    delete elem.canvas();
                    elem.parentElement.removeChild(elem);
                    delete elem;
                } catch (ex) { }
            }
        }

        o3DListLength = list.length;
        var OutSide3dDiv = document.createElement("DIV");
        OutSide3dDiv.id = "OutSide3dDiv";
        OutSide3dDiv.addEventListener("contextmenu", contextmenuF, false);

        var checkRender = 0;
        openRendering = true;
        img2darkByClass("Rendering", !openRendering);

        function sleep(time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        }
        var catchError = false;

        function onImageRendered() {
            // checkRender += 1;
            if (catchError == true && openVR == true) {
                openRendering = false;
                img2darkByClass("VR", !openVR);
                getByid("ImgVR").click();
                return;
            }
            sleep(100).then(() => {
                if ((getByid("3DDiv" + (o3DListLength - 1)).thickness - Thickness) - (getByid("3DDiv" + 0).thickness - Thickness) < 0) {
                    var thicknessList = [];
                    for (var ll = 0; ll < o3DListLength; ll++) {
                        var div1 = getByid("3DDiv" + ll);
                        thicknessList.push(div1.thickness);
                    }
                    for (var ll = 0; ll < o3DListLength; ll++) {
                        var div1 = getByid("3DDiv" + ll);
                        div1.thickness = thicknessList[o3DListLength - ll - 1];
                    }
                }
                Alpha3D();
                sleep(100).then(() => {
                    openRendering = false;
                    img2darkByClass("VR", !openVR);
                    setTimeout(getByid("MouseOperation_VR").click(), 100);
                })
            })
            //   }
        }

        GetViewport(0).div.appendChild(OutSide3dDiv);
        getByid("OutSide3dDiv").parentNode.replaceChild(OutSide3dDiv, getByid("OutSide3dDiv"));
        if (getByid("3dStrengthenAuto").selected == true || getByid("3dStrengthenAlways").selected || getByid("o3DMinIP").selected) {
            if (getByid("OutSide3dDiv")) getByid("OutSide3dDiv").style.transformStyle = "preserve-3d";
        } else {
            if (getByid("OutSide3dDiv")) getByid("OutSide3dDiv").style.transformStyle = "";
        }

        Thickness = 0;
        var big = 10000000000000000000;
        Thickness = -Thickness + big;
        for (var l = 0; l < list.length; l++) {
            const l2 = l;
            const image = list[l2].Image;
            if (image.imageDataLoaded == false && image.loadImageData) image.loadImageData();
            const pixelData = list[l2].Image.pixelData;
            try {
                var NewDiv = document.createElement("DIV");
                //NewDiv.addEventListener("contextmenu", contextmenuF, false);
                //NewDiv.addEventListener('cornerstoneimagerendered', onImageRendered);
                NewDiv.id = "3DDiv" + l2;
                NewDiv.className = "o3DDiv";
                NewDiv.sop = image.data.string(Tag.SOPInstanceUID);
                NewDiv.width = image.width;
                NewDiv.height = image.height;
                NewDiv.style.width = image.width + "px";
                NewDiv.style.height = image.height + "px";
                NewDiv.thickness = parseFloat(image.data.string(Tag.ImagePositionPatient).split("\\")[2]) * GetViewport().transform.PixelSpacingX;
                if (NewDiv.thickness < Thickness) Thickness = NewDiv.thickness;
                if (NewDiv.thickness < big) big = NewDiv.thickness;

                o3Dcount = list.length;
                OutSide3dDiv.appendChild(NewDiv);
                getByid("3DDiv" + l2).parentNode.replaceChild(NewDiv, getByid("3DDiv" + l2));
                var NewCanvas = document.createElement("CANVAS");
                NewCanvas.className = "VrCanvas";
                NewDiv.appendChild(NewCanvas);
                displayCanvasFor3D(NewCanvas, image, pixelData);
                //showTheImage(NewDiv, image, '3d', null, null);
                NewDiv.style.transform = "rotate3d(0, 0, 0 , 0deg) translateZ(-" + l2 + "px)";
                NewDiv.style.width = WandH[0] + "px";
                NewDiv.style.height = WandH[1] + "px";

                NewDiv.canvas = function () {
                    if (this.getElementsByClassName("VrCanvas")[0])
                        return this.getElementsByClassName("VrCanvas")[0];
                    else
                        return null;
                }
                NewDiv.ctx = function () {
                    if (this.getElementsByClassName("VrCanvas")[0])
                        return this.getElementsByClassName("VrCanvas")[0].getContext("2d");
                    else
                        return null;
                }
            } catch (ex) {
                console.log(ex);
                catchError = true;
                if (openVR == true) {
                    openVR = false;
                    alert("Error, this image may not support 3D.");
                };
                openRendering = false;
                //img2darkByClass("VR", !openVR);
                getByid("ImgVR").onclick('error');
                return;
            }
        }
        onImageRendered();
        return;
    }
}

function get3dDistance() {
    var VrDistance = 0;
    VrDistance += getByid("3DDiv" + (o3Dcount - 1)).thickness - (getByid("3DDiv" + 0).thickness);
    if (VrDistance < 0) VrDistance *= -1;
    VrDistance *= (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().height));
    return VrDistance;
}

function displayCanvasFor3D(DicomCanvas, image, pixelData) {
    DicomCanvas.width = image.width;
    DicomCanvas.height = image.height
    DicomCanvas.style.width = image.width + "px";
    DicomCanvas.style.height = image.height + "px";
    var ctx2 = DicomCanvas.getContext("2d");
    var imgData2 = ctx2.createImageData(image.width, image.height);
    var windowWidth = GetViewport().windowWidth;
    var windowCenter = GetViewport().windowCenter;
    if (getByid("o3DAngio").selected == true) {
        windowWidth = 332;
        windowCenter = 287;
    } else if (getByid("o3DAirways").selected == true) {
        //如果是肺氣管模型，使用對應的Window Level
        windowWidth = 409;
        windowCenter = -538;
    }
    if (getByid("o3DcomCombine").selected == true || getByid("o3DcomCombine2").selected == true) {
        //如果是肺氣管模型，使用對應的Window Level
        windowWidth = 409;
        windowCenter = -538;
        var high = windowCenter + (windowWidth / 2);
        var low = windowCenter - (windowWidth / 2);
        var intercept = image.intercept;
        if (CheckNull(intercept)) intercept = 0;
        var slope = image.slope;
        if (CheckNull(slope)) slope = 1;
        var _firstNumber = 0;

        var tempcolor = 0;
        var multiplication = 255 / ((high - low)) * slope;
        var addition = (- low + intercept) / (high - low) * 255;
        if (image.color == true) {
            for (var i = 0; i < imgData2.data.length; i += 4) {
                imgData2.data[i + 0] = pixelData[i] * multiplication + addition;
                imgData2.data[i + 1] = pixelData[i + 1] * multiplication + addition;
                imgData2.data[i + 2] = pixelData[i + 2] * multiplication + addition;

                tempcolor = 128 - Math.abs(128 - imgData2.data[i]);
                if (tempcolor > 25) {
                    imgData2.data[i] = 93;
                    imgData2.data[i + 1] = 238;
                    imgData2.data[i + 2] = 238;
                    imgData2.data[i + 3] = 255;
                } else {
                    imgData2.data[i + 3] = 0;
                }
            }
        } else {
            for (var i = 0, j = 0; i < imgData2.data.length; i += 4, j++) {
                imgData2.data[i + 0] = imgData2.data[i + 1] = imgData2.data[i + 2] = pixelData[j] * multiplication + addition;
                tempcolor = 128 - Math.abs(128 - imgData2.data[i]);
                if (tempcolor > 25) {
                    imgData2.data[i] = 93;
                    imgData2.data[i + 1] = 238;
                    imgData2.data[i + 2] = 238;
                    imgData2.data[i + 3] = 255;
                } else {
                    imgData2.data[i + 3] = 0;
                }
            }
        }

        if (getByid("o3DcomCombine2").selected == true) {
            windowWidth = 800;//332;
            windowCenter = 600;//287;
        } else if (getByid("o3DcomCombine").selected == true) {
            windowWidth = 332;
            windowCenter = 287;
        }

        var high = windowCenter + (windowWidth / 2);
        var low = windowCenter - (windowWidth / 2);
        var intercept = image.intercept;
        if (CheckNull(intercept)) intercept = 0;
        var slope = image.slope;
        if (CheckNull(slope)) slope = 1;
        var _firstNumber = 0;

        var tempcolor = 0;
        var multiplication = 255 / ((high - low)) * slope;
        var addition = (- low + intercept) / (high - low) * 255;
        if (image.color == true) {
            for (var i = 0; i < imgData2.data.length; i += 4) {
                if (imgData2.data[i + 3] == 0) {
                    imgData2.data[i + 0] = pixelData[i] * multiplication + addition;
                    imgData2.data[i + 1] = pixelData[i + 1] * multiplication + addition;
                    imgData2.data[i + 2] = pixelData[i + 2] * multiplication + addition;
                    if (imgData2.data[i + 0] > 25) imgData2.data[i + 3] = 255;
                }
            }
        } else {
            for (var i = 0, j = 0; i < imgData2.data.length; i += 4, j++) {
                if (imgData2.data[i + 3] == 0) {
                    imgData2.data[i + 0] = imgData2.data[i + 1] = imgData2.data[i + 2] = pixelData[j] * multiplication + addition;
                    if (imgData2.data[i + 0] > 25) imgData2.data[i + 3] = 255;
                }
            }
        }
    } else {
        var high = windowCenter + (windowWidth / 2);
        var low = windowCenter - (windowWidth / 2);
        var intercept = image.intercept;
        if (CheckNull(intercept)) intercept = 0;
        var slope = image.slope;
        if (CheckNull(slope)) slope = 1;
        var _firstNumber = 0;
        var multiplication = 255 / ((high - low)) * slope;
        var addition = (- low + intercept) / (high - low) * 255;
        if (image.color == true) {
            for (var i = 0; i < imgData2.data.length; i += 4) {
                imgData2.data[i + 0] = pixelData[i] * multiplication + addition;
                imgData2.data[i + 1] = pixelData[i + 1] * multiplication + addition;
                imgData2.data[i + 2] = pixelData[i + 2] * multiplication + addition;
                imgData2.data[i + 3] = 255;
            }
        }
        else if ((image.invert != true && GetViewport().invert == true) || (image.invert == true && GetViewport().invert == false)) {
            for (var i = 0, j = 0; i < imgData2.data.length; i += 4, j++) {
                imgData2.data[i + 0] = imgData2.data[i + 1] = imgData2.data[i + 2] = 255 - pixelData[j] * multiplication + addition;
                imgData2.data[i + 3] = 255;
            }
        }
        else {
            for (var i = 0, j = 0; i < imgData2.data.length; i += 4, j++) {
                imgData2.data[i + 0] = imgData2.data[i + 1] = imgData2.data[i + 2] = pixelData[j] * multiplication + addition;
                imgData2.data[i + 3] = 255;
            }
        }
    }
    ctx2.putImageData(imgData2, 0, 0);
}

var Uint8Canvas = [];

function Alpha3D() {
    if (!openVR && !openMPR) return;
    var canvas = GetViewport().canvas;
    if (getByid("OutSide3dDiv")) {
        getByid("OutSide3dDiv").style.transformStyle = "";
    }
    zoomRatio3D = 1;
    var r0 = parseFloat((100 - 0) / 85);
    var g0 = parseFloat((50 - 0) / 85);
    var b0 = parseFloat((35 - 0) / 85);

    var r1 = parseFloat((255 - 190) / 85);
    var g1 = parseFloat((220 - 120) / 85);
    var b1 = parseFloat((180 - 65) / 85);
    var r2 = parseFloat((190 - 100) / 85);
    var g2 = parseFloat((120 - 50) / 85);
    var b2 = parseFloat((65 - 35) / 85);

    var rList = [];
    var gList = [];
    var bList = [];

    for (var i = 0; i <= 85; i++) {
        rList.push(parseInt(0 + r0 * i));
        gList.push(parseInt(0 + g0 * i));
        bList.push(parseInt(0 + b0 * i));
    }
    for (var i = 0; i <= 85; i++) {
        rList.push(parseInt(100 + r2 * i));
        gList.push(parseInt(50 + g2 * i));
        bList.push(parseInt(35 + b2 * i));
    }
    for (var i = 0; i <= 85; i++) {
        rList.push(parseInt(190 + r1 * i));
        gList.push(parseInt(120 + g1 * i));
        bList.push(parseInt(65 + b1 * i));
    }

    for (var ll = 0; ll < o3DListLength; ll++) {
        if (getByid("o3DMip").selected == true && openVR) break;
        var canvas1 = getByid("3DDiv" + ll).canvas();
        canvas1.addEventListener("mousedown", mousedownFocus3D, false);
        canvas1.addEventListener("mousemove", mousemoveFocus3D, false);
        canvas1.addEventListener("mouseup", mouseupFocus3D, false);
        var ctx1 = canvas1.getContext("2d");
        var imageData = ctx1.getImageData(0, 0, canvas1.width, canvas1.height);
        var imageBuffer = imageData.data;
        if (openCave == true) {
            for (let i = 0; i < imageBuffer.length; i += 4) {
                if (imageBuffer[i] <= 25 && imageBuffer[i + 1] <= 25 && imageBuffer[i + 2] <= 25) {
                    imageBuffer[i + 3] = 0;
                }
            }
        } else if (getByid("o3DAirways").selected == true) {
            var tempcolor = 0;
            for (let i = 0; i < imageBuffer.length; i += 4) {
                tempcolor = 128 - Math.abs(128 - imageBuffer[i]);
                imageBuffer[i] = 93;
                imageBuffer[i + 1] = 238;
                imageBuffer[i + 2] = 238;
                imageBuffer[i + 3] = tempcolor <= 25 ? 0 : tempcolor;

            }
        } else if (getByid("o3DcomCombine2").selected == true) {
            for (let i = 0; i < imageBuffer.length; i += 4) {
                if (imageBuffer[i] <= 25 && imageBuffer[i + 1] <= 25 && imageBuffer[i + 2] <= 25) {
                    imageBuffer[i + 3] = 0;
                } else if (imageBuffer[i] == 93 && imageBuffer[i + 1] == 238) {
                    //pass
                } else {
                    // imageBuffer[i] = rList[imageBuffer[i]];
                    // imageBuffer[i + 1] = gList[imageBuffer[i + 1]];
                    //imageBuffer[i + 2] = bList[imageBuffer[i + 2]];
                    // imageBuffer[i + 3] = (imageBuffer[i + 3] * o3DAlphaValue) / 100;
                }
            }
        }
        else if (getByid("o3DcomCombine").selected == true && getByid("3dYellow").checked == true) {
            for (let i = 0; i < imageBuffer.length; i += 4) {
                if (imageBuffer[i] <= 25 && imageBuffer[i + 1] <= 25 && imageBuffer[i + 2] <= 25) {
                    imageBuffer[i + 3] = 0;
                } else if (imageBuffer[i] == 93 && imageBuffer[i + 1] == 238) {
                    //pass
                } else {
                    imageBuffer[i] = rList[imageBuffer[i]];
                    imageBuffer[i + 1] = gList[imageBuffer[i + 1]];
                    imageBuffer[i + 2] = bList[imageBuffer[i + 2]];
                    imageBuffer[i + 3] = (imageBuffer[i + 3] * o3DAlphaValue) / 100;
                }
            }
        } else if (getByid("3dYellow").checked == true) {
            if (getByid("3dSmooth").checked == true) {
                for (let i = 0; i < imageBuffer.length; i += 4) {
                    if (imageBuffer[i] <= 25 && imageBuffer[i + 1] <= 25 && imageBuffer[i + 2] <= 25) {
                        imageBuffer[i + 3] = 0;
                    } else {
                        imageBuffer[i] = rList[imageBuffer[i]];
                        imageBuffer[i + 1] = gList[imageBuffer[i + 1]];
                        imageBuffer[i + 2] = bList[imageBuffer[i + 2]];
                        imageBuffer[i + 3] = (imageBuffer[i] + imageBuffer[i + 1] + imageBuffer[i + 2]) / 3 * 2;
                        imageBuffer[i + 3] = (imageBuffer[i + 3] * o3DAlphaValue) / 100;
                    }
                }
            } else {
                for (let i = 0; i < imageBuffer.length; i += 4) {
                    if (imageBuffer[i] <= 25 && imageBuffer[i + 1] <= 25 && imageBuffer[i + 2] <= 25) {
                        imageBuffer[i + 3] = 0;
                    } else {
                        imageBuffer[i] = rList[imageBuffer[i]];
                        imageBuffer[i + 1] = gList[imageBuffer[i + 1]];
                        imageBuffer[i + 2] = bList[imageBuffer[i + 2]];
                        imageBuffer[i + 3] = (imageBuffer[i + 3] * o3DAlphaValue) / 100;
                    }
                }
            }
        } else {
            if (getByid("3dSmooth").checked == true) {
                for (let i = 0; i < imageBuffer.length; i += 4) {
                    imageBuffer[i + 3] = imageBuffer[i];
                    imageBuffer[i + 3] = (imageBuffer[i + 3] * o3DAlphaValue) / 100;
                }
            } else {
                for (let i = 0; i < imageBuffer.length; i += 4) {
                    if (imageBuffer[i] <= 25 && imageBuffer[i + 1] <= 25 && imageBuffer[i + 2] <= 25) {
                        imageBuffer[i + 3] = 0;
                    } else {
                        imageBuffer[i + 3] = (imageBuffer[i + 3] * o3DAlphaValue) / 100;
                    }
                }
            }
        }
        ctx1.putImageData(imageData, 0, 0);
    }
    for (var ll = 0; ll < o3DListLength; ll++) {
        var canvas1 = getByid("3DDiv" + ll).canvas();
        var ctx1 = canvas1.getContext("2d");
        var TempCanvas = document.createElement("CANVAS");
        TempCanvas.canvas = function () { return this };
        TempCanvas.sop = getByid("3DDiv" + ll).sop;
        TempCanvas.width = canvas1.width;
        TempCanvas.height = canvas1.height;
        //display3DMark(TempCanvas, TempCanvas.sop);//重構中...
        ctx1.drawImage(TempCanvas, 0, 0);
        delete TempCanvas;
    }

    if (o3Dcount == o3DListLength) {
        for (var k = 0; k < parseInt(getByid('3dInsertText').value); k++) {
            for (var ll = o3DListLength - 1; ll >= 0; ll--) {
                getByid("3DDiv" + ll).id = "3DDiv" + (ll * 2);
            }
            o3DListLength = o3DListLength * 2 - 1;

            var WandH;
            if (openVR) WandH = getViewportFixSize(window.innerWidth, window.innerHeight, 1, 1);
            else if (openMPR) WandH = getViewportFixSize(window.innerWidth, window.innerHeight, 2, 2);

            for (var ll = 0; ll < o3DListLength; ll++) {
                if (ll % 2 != 0) {
                    var NewDiv = document.createElement("DIV");
                    //NewDiv.addEventListener("contextmenu", contextmenuF, false);
                    NewDiv.id = "3DDiv" + ll;
                    NewDiv.className = "o3DDiv";
                    NewDiv.sop = getByid("3DDiv" + (ll - 1)).sop;
                    NewDiv.width = getByid("3DDiv" + (ll - 1)).width;
                    NewDiv.height = getByid("3DDiv" + (ll - 1)).height;
                    NewDiv.style.width = getByid("3DDiv" + (ll - 1)).style.width;
                    NewDiv.style.height = getByid("3DDiv" + (ll - 1)).style.height;
                    NewDiv.thickness = (getByid("3DDiv" + (ll - 1)).thickness + getByid("3DDiv" + (ll + 1)).thickness) / 2;
                    NewDiv.style = "position:absolute;width:" + NewDiv.width + "px;height:" + NewDiv.height + "px;z-index:" + ll + ";";
                    var NewCanvas = document.createElement("CANVAS");
                    NewCanvas.className = "VrCanvas";
                    NewCanvas.width = NewDiv.width;
                    NewCanvas.height = NewDiv.height;
                    NewCanvas.style.width = NewDiv.style.width;
                    NewCanvas.style.height = NewDiv.style.height;
                    NewCanvas.getContext('2d').globalAlpha = 0.5;;
                    var sourceCtx = getByid("3DDiv" + (ll - 1)).canvas();
                    NewCanvas.getContext('2d').drawImage(sourceCtx, 0, 0);
                    sourceCtx = getByid("3DDiv" + (ll + 1)).canvas();
                    NewCanvas.getContext('2d').drawImage(sourceCtx, 0, 0);
                    NewCanvas.getContext('2d').globalAlpha = 1.0;
                    NewDiv.appendChild(NewCanvas);
                    if (openVR == true) getByid('OutSide3dDiv').appendChild(NewDiv);
                    else if (openMPR == true) getByid('OutSide3dDiv').appendChild(NewDiv);
                    getByid("3DDiv" + ll).parentNode.replaceChild(NewDiv, getByid("3DDiv" + ll));
                    NewDiv.style = "transform:rotate3d(0, 0, 0 , 0deg) translateZ(-" + ll + "px);;position:absolute;width:" + WandH[0] + "px;height:" + WandH[1] + "px;";
                    NewDiv.canvas = function () {
                        if (this.getElementsByClassName("VrCanvas")[0])
                            return this.getElementsByClassName("VrCanvas")[0];
                        else
                            return null;
                    }
                    NewDiv.ctx = function () {
                        if (this.getElementsByClassName("VrCanvas")[0])
                            return this.getElementsByClassName("VrCanvas")[0].getContext("2d");
                        else
                            return null;
                    }
                }
            }

        }
    }

    for (var ll = 0; ll < o3DListLength; ll++) {
        var canvas1 = getByid("3DDiv" + ll).canvas();
        if (!parseInt(canvas1.style.width) >= 1) {
            canvas1.style.width = canvas.style.width;
            canvas1.style.height = canvas.style.height;
        }
        canvas1.style.margin = "-" + (parseInt(canvas1.style.height) / 2) +
            "px 0 0 -" + (parseInt(canvas1.style.width) / 2) + "px";
    }
    // if (openMPR == false) return;
    Uint8Canvas = [];
    var o3Dcanvas = getByid("3DDiv" + 0).canvas();
    for (var l = 0; l < o3DListLength; l++) {
        canvasCtx0 = getByid("3DDiv" + l).canvas().getContext("2d");
        canvasCtx = canvasCtx0.getImageData(0, 0, o3Dcanvas.width, o3Dcanvas.height);
        var buffer = new ArrayBuffer(canvasCtx.data.length);
        var binary = new Uint8Array(buffer);
        for (var i = 0; i < binary.length; i++) {
            binary[i] = canvasCtx.data[i];
        }
        Uint8Canvas.push(binary);
    }
    //////////////////////
    o3d_3degree = parseInt(getByid("3DskinText").value);
    //if (o3d_3degree >= o3DListLength) o3d_3degree = o3DListLength - 1;
    var WandH;
    if (openVR) WandH = getViewportFixSize(window.innerWidth, window.innerHeight, 1, 1);
    else if (openMPR) WandH = getViewportFixSize(window.innerWidth, window.innerHeight, 2, 2);

    for (var ll = 0; ll < o3d_3degree; ll++) {

        var VrDistance = get3dDistance();

        var NewDiv = document.createElement("DIV");
        var o3Dcanvas = getByid("3DDiv" + 0).canvas();
        //NewDiv.addEventListener("contextmenu", contextmenuF, false);
        NewDiv.id = "3DDiv2_" + ll;
        NewDiv.className = "o3DDiv";
        NewDiv.width = o3Dcanvas.width;
        NewDiv.height = o3DListLength;
        NewDiv.style.width = getByid("3DDiv" + 0).style.width;
        NewDiv.style.height = getByid("3DDiv" + 0).style.height;
        NewDiv.rotatePosition = ll * (canvas.height / o3DListLength);
        NewDiv.zPosition = ((canvas.height / o3d_3degree) * (o3d_3degree - ll)) - (canvas.height - VrDistance) / 2; //( (canvas.height / 2)-(canvas.height / o3d_3degree) * 0));

        var NewCanvas = document.createElement("CANVAS");
        NewCanvas.className = "VrCanvas";
        NewCanvas.width = o3Dcanvas.width;
        NewCanvas.height = o3DListLength;
        NewCanvas.style.width = o3Dcanvas.width + "px";
        NewCanvas.style.height = (VrDistance) + "px"; //(NewCanvas.height * (parseInt(canvas.style.height) / parseFloat(GetViewport().height)) * o3d_3degree) + "px";
        NewCanvas.originWidth = parseFloat(NewCanvas.style.width);
        NewCanvas.originHeight = parseFloat(NewCanvas.style.height);
        NewCanvas.rotatePosition = ll * (canvas.height / o3DListLength);
        var imgData2 = NewCanvas.getContext("2d").getImageData(0, 0, NewCanvas.width, NewCanvas.height);
        if (getByid("3DDiv" + (o3DListLength - 1)).thickness - Thickness - (getByid("3DDiv" + 0).thickness - Thickness) < 0) {
            var l, pixelPoint1, pixelPoint2, dataW, pointer;
            for (l = 0; l < o3DListLength; l++) {
                pointer = Uint8Canvas[l];
                pixelPoint1 = l * NewCanvas.width * 4;
                pixelPoint2 = (parseInt((ll) * (canvas.height / o3d_3degree))) * o3Dcanvas.width * 4;
                for (dataW = 0; dataW < NewCanvas.width * 4; dataW += 4) {
                    imgData2.data[pixelPoint1 + dataW] = pointer[pixelPoint2 + dataW + 0];
                    imgData2.data[pixelPoint1 + dataW + 1] = pointer[pixelPoint2 + dataW + 1];
                    imgData2.data[pixelPoint1 + dataW + 2] = pointer[pixelPoint2 + dataW + 2];
                    imgData2.data[pixelPoint1 + dataW + 3] = pointer[pixelPoint2 + dataW + 3];
                }
            }
        } else {
            var l, pixelPoint1, pixelPoint2, dataW, pointer;
            for (l = 0; l < o3DListLength; l++) {
                pixelPoint1 = l * NewCanvas.width * 4;
                pointer = Uint8Canvas[o3DListLength - l - 1];
                pixelPoint2 = (parseInt((ll) * (canvas.height / o3d_3degree))) * o3Dcanvas.width * 4;
                for (dataW = 0; dataW < NewCanvas.width * 4; dataW += 4) {
                    imgData2.data[pixelPoint1 + dataW] = pointer[pixelPoint2 + dataW + 0];
                    imgData2.data[pixelPoint1 + dataW + 1] = pointer[pixelPoint2 + dataW + 1];
                    imgData2.data[pixelPoint1 + dataW + 2] = pointer[pixelPoint2 + dataW + 2];
                    imgData2.data[pixelPoint1 + dataW + 3] = pointer[pixelPoint2 + dataW + 3];
                }
            }
        }
        NewDiv.canvas = function () {
            if (this.getElementsByClassName("VrCanvas")[0])
                return this.getElementsByClassName("VrCanvas")[0];
            else
                return null;
        }
        NewDiv.ctx = function () {
            if (this.getElementsByClassName("VrCanvas")[0])
                return this.getElementsByClassName("VrCanvas")[0].getContext("2d");
            else
                return null;
        }
        NewDiv.appendChild(NewCanvas);
        NewCanvas.getContext("2d").putImageData(imgData2, 0, 0);
        if (openVR == true || openMPR == true) getByid("OutSide3dDiv").appendChild(NewDiv);
        getByid("3DDiv2_" + ll).parentNode.replaceChild(NewDiv, getByid("3DDiv2_" + ll));
    }

    for (var ll = 0; ll < o3d_3degree; ll++) {
        var VrDistance = get3dDistance();

        var NewDiv = document.createElement("DIV");
        var o3Dcanvas = getByid("3DDiv" + 0).canvas();
        //NewDiv.addEventListener("contextmenu", contextmenuF, false);
        NewDiv.id = "3DDiv3_" + ll;
        NewDiv.className = "o3DDiv";
        NewDiv.width = o3DListLength;
        NewDiv.height = o3Dcanvas.height;
        NewDiv.style.width = getByid("3DDiv" + 0).style.width;
        NewDiv.style.height = getByid("3DDiv" + 0).style.height;
        NewDiv.rotatePosition = ll * (canvas.height / o3DListLength);
        NewDiv.zPosition = ((canvas.width / o3d_3degree) * (o3d_3degree - ll)) - (canvas.width - VrDistance) / 2;

        var NewCanvas = document.createElement("CANVAS");
        NewCanvas.className = "VrCanvas";
        NewCanvas.width = o3DListLength;
        NewCanvas.height = o3Dcanvas.height;
        NewCanvas.style.width = VrDistance + "px"; //(NewCanvas.width * (parseInt(canvas.style.height) / parseFloat(GetViewport().height)) * o3d_3degree /*VrDistance*/ ) + "px";
        NewCanvas.style.height = o3Dcanvas.height + "px";
        NewCanvas.rotatePosition = ll * (canvas.height / o3DListLength);
        NewCanvas.originWidth = parseFloat(NewCanvas.style.width);
        NewCanvas.originHeight = parseFloat(NewCanvas.style.height);

        var imgData2 = NewCanvas.getContext("2d").getImageData(0, 0, NewCanvas.width, NewCanvas.height);

        if (getByid("3DDiv" + (o3DListLength - 1)).thickness - Thickness - (getByid("3DDiv" + 0).thickness - Thickness) < 0) {
            var dataW, dataH, pixelPoint1, pixelPoint2, pixelPoint_1, pixelPoint_2, pointer;
            for (l = 0; l < o3DListLength; l++) {
                dataW = l * 4;
                pointer = Uint8Canvas[l];
                pixelPoint1 = NewCanvas.width * 4;
                pixelPoint2 = (parseInt((ll) * (canvas.width / o3d_3degree))) * 4;
                for (dataH = 0; dataH < NewCanvas.height; dataH += 1) {
                    pixelPoint_1 = dataH * pixelPoint1 + dataW;
                    pixelPoint_2 = dataH * o3Dcanvas.width * 4 + pixelPoint2;
                    imgData2.data[pixelPoint_1] = pointer[pixelPoint_2];
                    imgData2.data[pixelPoint_1 + 1] = pointer[pixelPoint_2 + 1];
                    imgData2.data[pixelPoint_1 + 2] = pointer[pixelPoint_2 + 2];
                    imgData2.data[pixelPoint_1 + 3] = pointer[pixelPoint_2 + 3];
                }
            }
        } else {
            var dataW, dataH, pixelPoint1, pixelPoint2, pixelPoint_1, pixelPoint_2, pointer;
            for (var l = 0; l < o3DListLength; l++) {
                dataW = l * 4;
                pixelPoint1 = NewCanvas.width * 4;
                pixelPoint2 = (parseInt((ll) * (canvas.width / o3d_3degree))) * 4;
                pointer = Uint8Canvas[o3DListLength - l - 1];
                for (dataH = 0; dataH < NewCanvas.height; dataH += 1) {
                    pixelPoint_1 = dataH * pixelPoint1 + dataW;
                    pixelPoint_2 = (dataH) * o3Dcanvas.width * 4 + pixelPoint2;
                    imgData2.data[pixelPoint_1] = pointer[pixelPoint_2];
                    imgData2.data[pixelPoint_1 + 1] = pointer[pixelPoint_2 + 1];
                    imgData2.data[pixelPoint_1 + 2] = pointer[pixelPoint_2 + 2];
                    imgData2.data[pixelPoint_1 + 3] = pointer[pixelPoint_2 + 3];
                }
            }
        }
        NewDiv.canvas = function () {
            if (this.getElementsByClassName("VrCanvas")[0])
                return this.getElementsByClassName("VrCanvas")[0];
            else
                return null;
        }
        NewDiv.ctx = function () {
            if (this.getElementsByClassName("VrCanvas")[0])
                return this.getElementsByClassName("VrCanvas")[0].getContext("2d");
            else
                return null;
        }
        NewDiv.appendChild(NewCanvas);
        NewCanvas.getContext("2d").putImageData(imgData2, 0, 0);
        if (openVR == true || openMPR == true) getByid("OutSide3dDiv").appendChild(NewDiv);
        getByid("3DDiv3_" + ll).parentNode.replaceChild(NewDiv, getByid("3DDiv3_" + ll));
    }

    for (var ll = 0; ll < o3DListLength; ll++) {
        var canvas1 = getByid("3DDiv" + ll).canvas();
        var div1 = getByid("3DDiv" + ll);
        canvas1.className = "VrCanvas canvas_3d";
        if (getByid("3dZipCheckbox").checked == true && parseInt(getByid("3dZipText").value) < o3DListLength) {
            //if (ll > parseInt(getByid("3dZipText").value) / 2 && ll < o3DListLength - parseInt(getByid("3dZipText").value) / 2)
            if (ll % parseInt(o3DListLength / parseFloat(getByid("3dZipText").value)) != 0)
                canvas1.style.display = "none";
        }
        if (getByid("o3DMip").selected == true && openVR) {
            div1.style.mixBlendMode = "lighten";
        } else if (getByid("o3DMinIP").selected == true && openVR) {
            div1.style.mixBlendMode = "darken";
        }
    }
    //做定位到正確位置的動作
    for (var ll = 0; ll < o3d_3degree; ll++) {
        var canvas2 = getByid("3DDiv2_" + ll).canvas();
        canvas2.className = "VrCanvas canvas_3d";
        canvas2.style = "" +
            "margin:" + "" + ((getByid("3DDiv2_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().height)))) +
            "px 0 0 -" + (parseInt(canvas2.style.width) / 2) + "px;" +
            "width:" + canvas2.style.width + ";height:" +
            canvas2.style.height + ";";
    }
    for (var ll = 0; ll < o3d_3degree; ll++) {
        var canvas3 = getByid("3DDiv3_" + ll).canvas();
        canvas3.className = "VrCanvas canvas_3d";
        canvas3.style = "" +
            "margin:" + "-" + (parseInt(canvas3.style.height) / 2) +
            "px 0 0 " + ((getByid("3DDiv3_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().height)))) + "px;" +
            "height:" + canvas3.style.height + ";width:" +
            canvas3.style.width + ";";
    }
    VrDistance = get3dDistance();
    rotate3dVR(VrDistance);
    for (var ll = 0; ll < o3d_3degree; ll++) {
        var canvas2 = getByid("3DDiv2_" + ll).canvas();
        var div2 = getByid("3DDiv2_" + ll);
        canvas2.style.transform = "rotateY(" + (0 + 0) + "deg) rotateX(" + (-90) + "deg)";
        if (getByid("o3DMip").selected == true && openVR) {
            div2.style.mixBlendMode = "lighten";
        } else if (getByid("o3DMinIP").selected == true && openVR) {
            div2.style.mixBlendMode = "darken";
        }
    }
    for (var ll = 0; ll < o3d_3degree; ll++) {
        var canvas3 = getByid("3DDiv3_" + ll).canvas();
        var div3 = getByid("3DDiv3_" + ll);
        canvas3.style.transform = "rotateY(" + (90 + 0) + "deg) rotateX(" + (0 + 0) + "deg)";
        if (getByid("o3DMip").selected == true && openVR) {
            div3.style.mixBlendMode = "lighten";
        } else if (getByid("o3DMinIP").selected == true && openVR) {
            div3.style.mixBlendMode = "darken";
        }
    }

    for (var ll = 0; ll < o3DListLength; ll++) {
        var canvas1 = getByid("3DDiv" + ll).canvas();
        var div1 = getByid("3DDiv" + ll);
        div1.onselectstart = canvas1.onselectstart = function () { return false; };
        div1.ondragstart = canvas1.ondragstart = function () { return false; };
    }
    for (var ll = 0; ll < o3d_3degree; ll++) {
        var canvas3 = getByid("3DDiv3_" + ll).canvas();
        var div3 = getByid("3DDiv3_" + ll);
        div3.onselectstart = canvas3.onselectstart = function () { return false; };
        div3.ondragstart = canvas3.ondragstart = function () { return false; };
        var canvas2 = getByid("3DDiv2_" + ll).canvas();
        var div2 = getByid("3DDiv2_" + ll);
        div2.onselectstart = canvas2.onselectstart = function () { return false; };
        div2.ondragstart = canvas2.ondragstart = function () { return false; };
    }
    setVrLight();
    setTimeout(function () {
        if (getByid("3dStrengthenAuto").selected == true || getByid("o3DMinIP").selected) {
            if (getByid("OutSide3dDiv") && !openMPR) {
                getByid("OutSide3dDiv").style.transformStyle = "preserve-3d";
            }
        }
    }, 10);
}


var mousedownFocus3D = function (event) {
    if (openCave == false) return;
    MouseDownCheck = true;
    var canvasC = getByid("3DDiv" + 0).canvas();
    var proportion = (parseFloat(canvasC.style.height) / parseFloat(GetViewport().height));
    var currX = (event.offsetX != null) ? event.offsetX : event.originalEvent.layerX;
    var currY = (event.offsetY != null) ? event.offsetY : event.originalEvent.layerY;
    currX /= proportion;
    currY /= proportion;
    for (var ll = 0; ll < o3DListLength; ll++) {
        var canvas1 = getByid("3DDiv" + ll).canvas();
        canvas1.getContext("2d").fillStyle = "rgba(0, 0, 0, 255)";
        canvas1.getContext("2d").strokeStyle = "rgba(0, 0, 0, 255)";
        canvas1.getContext("2d").beginPath();
        canvas1.getContext("2d").lineWidth = "" + ((Math.abs(2)) * 2 * 1);
        canvas1.getContext("2d").moveTo(currX, currY);
    }
};
var mousemoveFocus3D = function (event) {
    if (openCave == false || MouseDownCheck == false) return;
    var canvasC = getByid("3DDiv" + 0).canvas();
    var num = (parseFloat(canvasC.style.height) / parseFloat(GetViewport().height));
    var currX11 = (event.offsetX != null) ? event.offsetX : event.originalEvent.layerX;
    var currY11 = (event.offsetY != null) ? event.offsetY : event.originalEvent.layerY;
    currX11 /= num;
    currY11 /= num;
    for (var ll = 0; ll < o3DListLength; ll++) {
        var canvas1 = getByid("3DDiv" + ll).canvas();
        canvas1.getContext("2d").fillStyle = "rgba(0, 0, 0, 255)";
        canvas1.getContext("2d").strokeStyle = "rgba(0, 0, 0, 255)";
        canvas1.getContext("2d").lineTo(currX11, currY11);
        canvas1.getContext("2d").stroke();
    }
};
var mouseupFocus3D = function (event) {
    if (openCave == false) return;
    MouseDownCheck = false;
    rightMouseDown = false;
    for (var ll = 0; ll < o3DListLength; ll++) {
        var canvas1 = getByid("3DDiv" + ll).canvas();
        canvas1.getContext("2d").fillStyle = "rgba(0, 0, 0, 255)";
        canvas1.getContext("2d").strokeStyle = "rgba(0, 0, 0, 255)";
        canvas1.getContext("2d").fill();
        canvas1.getContext("2d").closePath();
    }
    Alpha3D();
};

var Timeout3d = false;
var mousemove3D = function (e) {
    if (openCave == true) return;
    if (Timeout3d == true) return;
    var canvas = GetViewport().canvas;
    if (openVR == true || openMPR == true) {
        if (MouseDownCheck || rightMouseDown) {
            var currX = get3dCurrPoint(e)[0];
            var currY = get3dCurrPoint(e)[1];
        }
        Timeout3d = true;
        setTimeout(function () {
            Timeout3d = false;
        }, 50);

        if (MouseDownCheck == true) {
            for (var ll = 0; ll < o3DListLength; ll++) {
                var canvas1 = getByid("3DDiv" + ll).canvas();
                if (!parseInt(canvas1.style.width) >= 1) {
                    canvas1.style.width = canvas.style.width;
                    canvas1.style.height = canvas.style.height;
                }
                canvas1.style.margin = "-" + (parseInt(canvas1.style.height) / 2) +
                    "px 0 0 -" + (parseInt(canvas1.style.width) / 2) + "px";
            }
            for (var ll = 0; ll < o3d_3degree; ll++) {
                var canvas2 = getByid("3DDiv2_" + ll).canvas();
                canvas2.style.margin = "" + ((getByid("3DDiv2_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().height)))) +
                    "px 0 0 -" + (parseInt(canvas2.style.width) / 2) + "px";
            }
            for (var ll = 0; ll < o3d_3degree; ll++) {
                var canvas3 = getByid("3DDiv3_" + ll).canvas();
                canvas3.style.margin = "" + "-" + (parseInt(canvas3.style.height) / 2) +
                    "px 0 0 " + ((getByid("3DDiv3_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().height)))) + "px";
            }
            var VrDistance = get3dDistance();
        }

        if (MouseDownCheck == true) {
            if (currX < originalPoint_X - rotateStep) {
                degerrX += (originalPoint_X - currX) > rotateSpeed ? rotateSpeed * -1 : (originalPoint_X - currX) * -1;
                if (degerrX < 0) degerrX += 360;
                if (degerrX > 360) degerrX -= 360;
                if (degerrX == 90 || degerrX == 270) degerrX += 1;
            } else if (currX > originalPoint_X + rotateStep) {
                degerrX -= (currX - originalPoint_X) > rotateSpeed ? rotateSpeed * -1 : (currX - originalPoint_X) * -1;
                if (degerrX < 0) degerrX += 360;
                if (degerrX > 360) degerrX -= 360;
                if (degerrX == 90 || degerrX == 270) degerrX -= 1;
            }
            if (currY > originalPoint_Y + rotateStep) {
                if (degerrX >= 90 && degerrX <= 270) {
                    degerrY -= (originalPoint_Y - currY) < rotateSpeed ? rotateSpeed * -1 : (originalPoint_Y - currY) * -1;
                    if (degerrY < 0) degerrY += 360;
                    if (degerrY > 360) degerrY -= 360;
                    if (degerrY == 90 || degerrY == 270) degerrY -= 1;
                } else {
                    degerrY += (currY - originalPoint_Y) > rotateSpeed ? rotateSpeed * -1 : (currY - originalPoint_Y) * -1;
                    if (degerrY < 0) degerrY += 360;
                    if (degerrY > 360) degerrY -= 360;
                    if (degerrY == 90 || degerrY == 270) degerrY += 1;
                }
            } else if (currY < originalPoint_Y - rotateStep) {
                if (degerrX >= 90 && degerrX <= 270) {
                    degerrY += (originalPoint_Y - currY) > rotateSpeed ? rotateSpeed * -1 : (originalPoint_Y - currY) * -1;
                    if (degerrY < 0) degerrY += 360;
                    if (degerrY > 360) degerrY -= 360;
                    if (degerrY == 90 || degerrY == 270) degerrY += 1;
                } else {
                    degerrY -= (currY - originalPoint_Y) < rotateSpeed ? rotateSpeed * -1 : (currY - originalPoint_Y) * -1;
                    if (degerrY < 0) degerrY += 360;
                    if (degerrY > 360) degerrY -= 360;
                    if (degerrY == 90 || degerrY == 270) degerrY += 1;
                }
            }
            rotate3dVR(VrDistance);
        }

        if (rightMouseDown == true) {
            if (currY > originalPoint_Y + 3) {
                zoomRatio3D /= 1.05;
                for (var ll = 0; ll < o3DListLength; ll++) {
                    var canvas1 = getByid("3DDiv" + ll).canvas();
                    if (!parseInt(canvas1.style.width) >= 1) {
                        canvas1.style.width = canvas.style.width;
                        canvas1.style.height = canvas.style.height;
                    }
                    canvas1.style.width = (parseFloat(canvas1.width) * zoomRatio3D) + "px";
                    canvas1.style.height = (parseFloat(canvas1.height) * zoomRatio3D) + "px";
                    canvas1.style.margin = "-" + (parseInt(canvas1.style.height) / 2) +
                        "px 0 0 -" + (parseInt(canvas1.style.width) / 2) + "px";
                }
                for (var ll = 0; ll < o3d_3degree; ll++) {
                    var canvas2 = getByid("3DDiv2_" + ll).canvas();
                    canvas2.style.width = (parseFloat(canvas2.originWidth) * zoomRatio3D) + "px";
                    canvas2.style.height = (parseFloat(canvas2.originHeight) * zoomRatio3D) + "px";
                    canvas2.style.margin = "" + ((getByid("3DDiv2_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().height)))) +
                        "px 0 0 -" + (parseInt(canvas2.style.width) / 2) + "px";
                }
                for (var ll = 0; ll < o3d_3degree; ll++) {
                    var canvas3 = getByid("3DDiv3_" + ll).canvas();
                    canvas3.style.width = (parseFloat(canvas3.originWidth) * zoomRatio3D) + "px";
                    canvas3.style.height = (parseFloat(canvas3.originHeight) * zoomRatio3D) + "px";
                    canvas3.style.margin = "" + "-" + (parseInt(canvas3.style.height) / 2) +
                        "px 0 0 " + ((getByid("3DDiv3_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().height)))) + "px";
                }

            } else if (currY < originalPoint_Y - 3) {
                zoomRatio3D *= 1.05;
                for (var ll = 0; ll < o3DListLength; ll++) {
                    var canvas1 = getByid("3DDiv" + ll).canvas();
                    if (!parseInt(canvas1.style.width)) {
                        canvas1.style.width = canvas.style.width;
                        canvas1.style.height = canvas.style.height;
                    }
                    canvas1.style.width = (parseFloat(canvas1.width) * zoomRatio3D) + "px";
                    canvas1.style.height = (parseFloat(canvas1.height) * zoomRatio3D) + "px";
                    canvas1.style.margin = "-" + (parseInt(canvas1.style.height) / 2) +
                        "px 0 0 -" + (parseInt(canvas1.style.width) / 2) + "px";
                }
                for (var ll = 0; ll < o3d_3degree; ll++) {
                    var canvas2 = getByid("3DDiv2_" + ll).canvas();
                    canvas2.style.width = (parseFloat(canvas2.originWidth) * zoomRatio3D) + "px";
                    canvas2.style.height = (parseFloat(canvas2.originHeight) * zoomRatio3D) + "px";
                    canvas2.style.margin = "" + ((getByid("3DDiv2_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().height)))) +
                        "px 0 0 -" + (parseInt(canvas2.style.width) / 2) + "px";
                }
                for (var ll = 0; ll < o3d_3degree; ll++) {
                    var canvas3 = getByid("3DDiv3_" + ll).canvas();
                    canvas3.style.width = (parseFloat(canvas3.originWidth) * zoomRatio3D) + "px";
                    canvas3.style.height = (parseFloat(canvas3.originHeight) * zoomRatio3D) + "px";
                    canvas3.style.margin = "" + "-" + (parseInt(canvas3.style.height) / 2) +
                        "px 0 0 " + ((getByid("3DDiv3_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().height)))) + "px";
                }
            }
            var canvas1 = getByid("3DDiv" + 0).canvas();
            var VrDistance = get3dDistance();
            rotate3dVR(VrDistance);
        }
        if (MouseDownCheck || rightMouseDown) {
            for (var ll = 0; ll < o3DListLength; ll++) {
                var canvas1 = getByid("3DDiv" + ll).canvas();
                var div1 = getByid("3DDiv" + ll);
                if (getByid("o3DMip").selected == true && openVR) {
                    div1.style.mixBlendMode = "lighten";
                } else if (getByid("o3DMinIP").selected == true && openVR) {
                    div1.style.mixBlendMode = "darken";
                }
                if (getByid("3dZipCheckbox").checked == true && parseInt(getByid("3dZipText").value) < o3DListLength) {
                    //if (ll > parseInt(getByid("3dZipText").value) / 2 && ll < o3DListLength - parseInt(getByid("3dZipText").value) / 2)
                    if (ll % parseInt(o3DListLength / parseFloat(getByid("3dZipText").value)) != 0)
                        canvas1.style.display = "none";
                }
            }

            for (var ll = 0; ll < o3d_3degree; ll++) {
                var canvas2 = getByid("3DDiv2_" + ll).canvas();
                var div2 = getByid("3DDiv2_" + ll);
                canvas2.style.transform = "translate3d(0,0,0)  rotateX(" + (-90) + "deg)";
                if (getByid("o3DMip").selected == true && openVR) {
                    div2.style.mixBlendMode = "lighten";
                } else if (getByid("o3DMinIP").selected == true && openVR) {
                    div2.style.mixBlendMode = "darken";
                }
            }
            for (var ll = 0; ll < o3d_3degree; ll++) {
                var canvas3 = getByid("3DDiv3_" + ll).canvas();
                var div3 = getByid("3DDiv3_" + ll);
                canvas3.style.transform = "translate3d(0,0,0)  rotateY(" + (90 + 0) + "deg)";
                if (getByid("o3DMip").selected == true && openVR) {
                    div3.style.mixBlendMode = "lighten";
                } else if (getByid("o3DMinIP").selected == true && openVR) {
                    div3.style.mixBlendMode = "darken";
                }
            }
            originalPoint_X = currX;
            originalPoint_Y = currY;
        }
    }
};

var mousedown3D = function (e) {
    if (getByid("3dStrengthenAuto").selected == true && !getByid("o3DMinIP").selected) {
        if (getByid("OutSide3dDiv")) {
            getByid("OutSide3dDiv").style.transformStyle = "";
        }
    }
    /*for (var ll = 0; ll < o3DListLength; ll++) {
        var canvas1 = getByid("3DDiv" + ll).canvas();
        canvas1.style.background = "";
    }
    for (var ll = 0; ll < o3d_3degree; ll++) {
        var canvas1 = getByid("3DDiv2_" + ll).canvas();
        canvas1.style.background = "";
    }
    for (var ll = 0; ll < o3d_3degree; ll++) {
        var canvas1 = getByid("3DDiv3_" + ll).canvas();
        canvas1.style.background = "";
    }*/
    if (openCave == true) return;
    MouseDown3D(e);
};

function MouseDown3D(e) {
    switch (e.which) {
        case 1:
            MouseDownCheck = true;
            break;
        case 2:
            break;
        case 3:
            rightMouseDown = true;
            break;
        default:
            break
    }
    windowMouseX = GetmouseX(e);
    windowMouseY = GetmouseY(e);
    originalPoint_X = get3dCurrPoint(e)[0];
    originalPoint_Y = get3dCurrPoint(e)[1];
}
var mouseup3D = function (e) {
    if (openCave == true) return;
    MouseDownCheck = false;
    rightMouseDown = false;

    if (getByid("3dStrengthenAuto").selected == true || getByid("o3DMinIP").selected) {
        if (getByid("OutSide3dDiv") && !openMPR) {
            getByid("OutSide3dDiv").style.transformStyle = "preserve-3d";
        }
    }
};
var touchstart3D = function (e) {
    if (getByid("3dStrengthenAuto").selected == true && !getByid("o3DMinIP").selected) {
        if (getByid("OutSide3dDiv")) {
            getByid("OutSide3dDiv").style.transformStyle = "";
        }
    }
    /*for (var ll = 0; ll < o3DListLength; ll++) {
        var canvas1 = getByid("3DDiv" + ll).canvas();
        canvas1.style.background = "";
    }
    for (var ll = 0; ll < o3d_3degree; ll++) {
        var canvas1 = getByid("3DDiv2_" + ll).canvas();
        canvas1.style.background = "";
    }
    for (var ll = 0; ll < o3d_3degree; ll++) {
        var canvas1 = getByid("3DDiv3_" + ll).canvas();
        canvas1.style.background = "";
    }*/
    if (e.touches[1]) Touchstart3D(e.touches[0], e.touches[1]);
    else Touchstart3D(e.touches[0]);
}
var touchmove3D = function (e) {
    if (e.touches[1]) Touchmove3D(e.touches[0], e.touches[1]);
    else Touchmove3D(e.touches[0]);
}
var Touchstart3D = function (e, e2) {
    if (!e2) TouchDownCheck = true;
    else rightTouchDown = true;
    windowMouseX = GetmouseX(e);
    windowMouseY = GetmouseY(e);
    originalPoint_X = get3dCurrPoint(e)[0];
    originalPoint_Y = get3dCurrPoint(e)[1];
}
var touchend3D = function (e, e2) {
    TouchDownCheck = false;
    rightTouchDown = false;

    if (getByid("3dStrengthenAuto").selected == true || getByid("o3DMinIP").selected) {
        if (getByid("OutSide3dDiv") && !openMPR) {
            getByid("OutSide3dDiv").style.transformStyle = "preserve-3d";
        }
    }
};

var Touchmove3D = function (e, e2) {
    if (openCave == true) return;
    if (!(openVR == true || openMPR == true)) return;
    var canvas = GetViewport().canvas;
    Timeout3d = true;
    setTimeout(function () {
        Timeout3d = false;
    }, 50);
    for (var ll = 0; ll < o3DListLength; ll++) {
        var canvas1 = getByid("3DDiv" + ll).canvas();
        if (!parseInt(canvas1.style.width) >= 1) {
            canvas1.style.width = canvas.style.width;
            canvas1.style.height = canvas.style.height;
        }
        canvas1.style.margin = "-" + (parseInt(canvas1.style.height) / 2) +
            "px 0 0 -" + (parseInt(canvas1.style.width) / 2) + "px";
    }
    for (var ll = 0; ll < o3d_3degree; ll++) {
        var canvas2 = getByid("3DDiv2_" + ll).canvas();
        canvas2.style.margin = "" + ((getByid("3DDiv2_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().height)))) +
            "px 0 0 -" + (parseInt(canvas2.style.width) / 2) + "px";
    }
    for (var ll = 0; ll < o3d_3degree; ll++) {
        var canvas3 = getByid("3DDiv3_" + ll).canvas();
        canvas3.style.margin = "" + "-" + (parseInt(canvas3.style.height) / 2) +
            "px 0 0 " + ((getByid("3DDiv3_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().height)))) + "px";
    }
    var VrDistance = get3dDistance();

    var currX = getCurrPoint(e)[0];
    var currY = getCurrPoint(e)[1];
    if (TouchDownCheck == true && !rightTouchDown) {
        for (var ll = 0; ll < o3DListLength; ll++) {
            var canvas1 = getByid("3DDiv" + ll).canvas();
            if (!parseInt(canvas1.style.width) >= 1) {
                canvas1.style.width = canvas.style.width;
                canvas1.style.height = canvas.style.height;
            }
            canvas1.style = "position: absolute;top: 50%;left:50%; margin: -" + (parseInt(canvas1.style.height) / 2) +
                "px 0 0 -" + (parseInt(canvas1.style.width) / 2) + "px;width:" + canvas1.style.width + ";height:" + canvas1.style.height + ";";
        }
        for (var ll = 0; ll < o3d_3degree; ll++) {
            var canvas2 = getByid("3DDiv2_" + ll).canvas();
            canvas2.style = "position: absolute;top: 50%;left:50%;" +
                "margin:" + "" + ((getByid("3DDiv2_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().height)))) +
                "px 0 0 -" + (parseInt(canvas2.style.width) / 2) + "px;" +
                "width:" + canvas2.style.width + ";height:" +
                canvas2.style.height + ";";
        }
        for (var ll = 0; ll < o3d_3degree; ll++) {
            var canvas3 = getByid("3DDiv3_" + ll).canvas();
            canvas3.style = "position: absolute;top: 50%;left:50%;" +
                "margin:" + "-" + (parseInt(canvas3.style.height) / 2) +
                "px 0 0 " + ((getByid("3DDiv3_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().height)))) + "px;" +
                "height:" + canvas3.style.height + ";width:" +
                canvas3.style.width +
                ";";
        }
    }
    var currX = get3dCurrPoint(e)[0];
    var currY = get3dCurrPoint(e)[1];
    var VrDistance = get3dDistance();

    if (TouchDownCheck == true && !rightTouchDown) {
        if (currX < originalPoint_X - rotateStep) {
            degerrX += (originalPoint_X - currX) > rotateSpeed ? rotateSpeed * -1 : (originalPoint_X - currX) * -1;
            if (degerrX < 0) degerrX += 360;
            if (degerrX > 360) degerrX -= 360;
            if (degerrX == 90 || degerrX == 270) degerrX += 1;
        } else if (currX > originalPoint_X + rotateStep) {
            degerrX -= (currX - originalPoint_X) > rotateSpeed ? rotateSpeed * -1 : (currX - originalPoint_X) * -1;
            if (degerrX < 0) degerrX += 360;
            if (degerrX > 360) degerrX -= 360;
            if (degerrX == 90 || degerrX == 270) degerrX -= 1;
        }
        if (currY > originalPoint_Y + rotateStep) {
            if (degerrX >= 90 && degerrX <= 270) {
                degerrY -= (originalPoint_Y - currY) < rotateSpeed ? rotateSpeed * -1 : (originalPoint_Y - currY) * -1;
                if (degerrY < 0) degerrY += 360;
                if (degerrY > 360) degerrY -= 360;
                if (degerrY == 90 || degerrY == 270) degerrY -= 1;
            } else {
                degerrY += (currY - originalPoint_Y) < rotateSpeed ? rotateSpeed * -1 : (currY - originalPoint_Y) * -1;
                if (degerrY < 0) degerrY += 360;
                if (degerrY > 360) degerrY -= 360;
                if (degerrY == 90 || degerrY == 270) degerrY += 1;
            }
        } else if (currY < originalPoint_Y - rotateStep) {
            if (degerrX >= 90 && degerrX <= 270) {
                degerrY += (originalPoint_Y - currY) > rotateSpeed ? rotateSpeed * -1 : (originalPoint_Y - currY) * -1;
                if (degerrY < 0) degerrY += 360;
                if (degerrY > 360) degerrY -= 360;
                if (degerrY == 90 || degerrY == 270) degerrY += 1;
            } else {
                degerrY += (currY - originalPoint_Y) > rotateSpeed ? rotateSpeed * -1 : (currY - originalPoint_Y) * -1;
                if (degerrY < 0) degerrY += 360;
                if (degerrY > 360) degerrY -= 360;
                if (degerrY == 90 || degerrY == 270) degerrY += 1;
            }
        }
        rotate3dVR(VrDistance);
    }

    if (rightTouchDown == true) {
        if (currY > originalPoint_Y + 3) {
            zoomRatio3D /= 1.05;
            for (var ll = 0; ll < o3DListLength; ll++) {
                var canvas1 = getByid("3DDiv" + ll).canvas();
                if (!parseInt(canvas1.style.width) >= 1) {
                    canvas1.style.width = canvas.style.width;
                    canvas1.style.height = canvas.style.height;
                }
                canvas1.style.width = (parseFloat(canvas1.width) * zoomRatio3D) + "px";
                canvas1.style.height = (parseFloat(canvas1.height) * zoomRatio3D) + "px";
                canvas1.style.margin = "-" + (parseInt(canvas1.style.height) / 2) +
                    "px 0 0 -" + (parseInt(canvas1.style.width) / 2) + "px";
            }
            for (var ll = 0; ll < o3d_3degree; ll++) {
                var canvas2 = getByid("3DDiv2_" + ll).canvas();
                canvas2.style.width = (parseFloat(canvas2.originWidth) * zoomRatio3D) + "px";
                canvas2.style.height = (parseFloat(canvas2.originHeight) * zoomRatio3D) + "px";
                canvas2.style.margin = "" + ((getByid("3DDiv2_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().height)))) +
                    "px 0 0 -" + (parseInt(canvas2.style.width) / 2) + "px";
            }
            for (var ll = 0; ll < o3d_3degree; ll++) {
                var canvas3 = getByid("3DDiv3_" + ll).canvas();
                canvas3.style.width = (parseFloat(canvas3.originWidth) * zoomRatio3D) + "px";
                canvas3.style.height = (parseFloat(canvas3.originHeight) * zoomRatio3D) + "px";
                canvas3.style.margin = "" + "-" + (parseInt(canvas3.style.height) / 2) +
                    "px 0 0 " + ((getByid("3DDiv3_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().height)))) + "px";
            }

        } else if (currY < originalPoint_Y - 3) {
            zoomRatio3D *= 1.05;
            for (var ll = 0; ll < o3DListLength; ll++) {
                var canvas1 = getByid("3DDiv" + ll).canvas();
                if (!parseInt(canvas1.style.width)) {
                    canvas1.style.width = canvas.style.width;
                    canvas1.style.height = canvas.style.height;
                }
                canvas1.style.width = (parseFloat(canvas1.width) * zoomRatio3D) + "px";
                canvas1.style.height = (parseFloat(canvas1.height) * zoomRatio3D) + "px";
                canvas1.style.margin = "-" + (parseInt(canvas1.style.height) / 2) +
                    "px 0 0 -" + (parseInt(canvas1.style.width) / 2) + "px";
            }
            for (var ll = 0; ll < o3d_3degree; ll++) {
                var canvas2 = getByid("3DDiv2_" + ll).canvas();
                canvas2.style.width = (parseFloat(canvas2.originWidth) * zoomRatio3D) + "px";
                canvas2.style.height = (parseFloat(canvas2.originHeight) * zoomRatio3D) + "px";
                canvas2.style.margin = "" + ((getByid("3DDiv2_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().height)))) +
                    "px 0 0 -" + (parseInt(canvas2.style.width) / 2) + "px";
            }
            for (var ll = 0; ll < o3d_3degree; ll++) {
                var canvas3 = getByid("3DDiv3_" + ll).canvas();
                canvas3.style.width = (parseFloat(canvas3.originWidth) * zoomRatio3D) + "px";
                canvas3.style.height = (parseFloat(canvas3.originHeight) * zoomRatio3D) + "px";
                canvas3.style.margin = "" + "-" + (parseInt(canvas3.style.height) / 2) +
                    "px 0 0 " + ((getByid("3DDiv3_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().height)))) + "px";
            }
        }
        var canvas1 = getByid("3DDiv" + 0).canvas();
        var VrDistance = get3dDistance();
        rotate3dVR(VrDistance);
    }
    if (TouchDownCheck || rightTouchDown) {
        for (var ll = 0; ll < o3DListLength; ll++) {
            var canvas1 = getByid("3DDiv" + ll).canvas();
            var div1 = getByid("3DDiv" + ll);
            if (getByid("o3DMip").selected == true && openVR) {
                div1.style.mixBlendMode = "lighten";
            } else if (getByid("o3DMinIP").selected == true && openVR) {
                div1.style.mixBlendMode = "darken";
            }
            if (getByid("3dZipCheckbox").checked == true && parseInt(getByid("3dZipText").value) < o3DListLength) {
                //if (ll > parseInt(getByid("3dZipText").value) / 2 && ll < o3DListLength - parseInt(getByid("3dZipText").value) / 2)
                if (ll % parseInt(o3DListLength / parseFloat(getByid("3dZipText").value)) != 0)
                    canvas1.style.display = "none";
            }
        }

        for (var ll = 0; ll < o3d_3degree; ll++) {
            var canvas2 = getByid("3DDiv2_" + ll).canvas();
            var div2 = getByid("3DDiv2_" + ll);
            canvas2.style.transform = "rotateX(" + (-90) + "deg)";
            if (getByid("o3DMip").selected == true && openVR) {
                div2.style.mixBlendMode = "lighten";
            } else if (getByid("o3DMinIP").selected == true && openVR) {
                div2.style.mixBlendMode = "darken";
            }
        }
        for (var ll = 0; ll < o3d_3degree; ll++) {
            var canvas3 = getByid("3DDiv3_" + ll).canvas();
            var div3 = getByid("3DDiv3_" + ll);
            canvas3.style.transform = "rotateY(" + (90 + 0) + "deg)";
            if (getByid("o3DMip").selected == true && openVR) {
                div3.style.mixBlendMode = "lighten";
            } else if (getByid("o3DMinIP").selected == true && openVR) {
                div3.style.mixBlendMode = "darken";
            }
        }
        originalPoint_X = currX;
        originalPoint_Y = currY;
    }
}


function rotate3dVR(VrDistance) {
    if ((!(degerrY >= 90 && degerrY <= 270) && (degerrX >= 90 && degerrX <= 270)) ||
        (degerrY >= 90 && degerrY <= 270) && !(degerrX >= 90 && degerrX <= 270)) {
        for (var ll = 0; ll < o3DListLength; ll++) {
            var canvas1 = getByid("3DDiv" + ll).getElementsByClassName("VrCanvas")[0];
            var div1 = getByid("3DDiv" + ll);
            div1.style.zIndex = -ll + o3DListLength + o3d_3degree;
            div1.style.transform = "translate3d(0,0,0) rotateY(" + degerrX + "deg) rotateX(" + degerrY + "deg)  translateZ(" + (parseFloat(parseFloat(1) * (parseFloat(canvas1.style.height) / parseFloat(GetViewport().height))) * (div1.thickness - Thickness) - (VrDistance / 2)) + "px)";
        }
    } else {
        for (var ll = 0; ll < o3DListLength; ll++) {
            var canvas1 = getByid("3DDiv" + ll).getElementsByClassName("VrCanvas")[0];
            var div1 = getByid("3DDiv" + ll);
            div1.style.zIndex = ll + o3d_3degree;
            div1.style.transform = "translate3d(0,0,0) rotateY(" + degerrX + "deg) rotateX(" + degerrY + "deg)  translateZ(" + (parseFloat(parseFloat(1) * (parseFloat(canvas1.style.height) / parseFloat(GetViewport().height))) * (div1.thickness - Thickness) - (VrDistance / 2)) + "px)";
        }
    }
    if ((!(degerrY >= 0 && degerrY <= 180) && (degerrX >= 90 && degerrX <= 270)) ||
        (degerrY >= 0 && degerrY <= 180) && !(degerrX >= 90 && degerrX <= 270)) {
        for (var ll = 0; ll < o3d_3degree; ll++) {
            var div2 = getByid("3DDiv2_" + ll);
            if (Math.abs(90 - degerrY) < 25 || Math.abs(270 - degerrY) < 25)
                div2.style.zIndex = ll + o3DListLength + o3d_3degree;
            else
                div2.style.zIndex = ll;
            div2.style.transform = "translate3d(0,0,0) rotateY(" + (degerrX + 0) + "deg) rotateX(" + (degerrY + 0) + "deg)  translateZ(" + (0) + "px)";
        }
    } else {
        for (var ll = 0; ll < o3d_3degree; ll++) {
            var div2 = getByid("3DDiv2_" + ll);
            if (Math.abs(90 - degerrY) < 25 || Math.abs(270 - degerrY) < 25)
                div2.style.zIndex = -ll + o3DListLength + o3d_3degree + o3d_3degree;
            else
                div2.style.zIndex = -ll + o3d_3degree;
            div2.style.transform = "translate3d(0,0,0) rotateY(" + (degerrX + 0) + "deg) rotateX(" + (degerrY + 0) + "deg)  translateZ(" + (0) + "px)";
        }
    }
    if ((!(degerrY >= 90 && degerrY <= 270) && (degerrX >= 0 && degerrX <= 180)) ||
        (degerrY >= 90 && degerrY <= 270) && !(degerrX >= 0 && degerrX <= 180)) {
        for (var ll = 0; ll < o3d_3degree; ll++) {
            var div3 = getByid("3DDiv3_" + ll);
            if (Math.abs(90 - degerrY) < 25 || Math.abs(270 - degerrY) < 25) {
                if (Math.abs(90 - degerrX) < 25 || Math.abs(270 - degerrX) < 25) {
                    if (degerrX >= 0 && degerrX <= 180) {
                        div3.style.zIndex = -ll + o3DListLength + o3d_3degree + o3d_3degree;
                    } else {
                        div3.style.zIndex = ll + o3DListLength + o3d_3degree;
                    }
                } else {
                    if (degerrX >= 0 && degerrX <= 180) {
                        div3.style.zIndex = -ll + o3d_3degree;
                    } else {
                        div3.style.zIndex = ll;
                    }
                }
            } else {
                if (Math.abs(90 - degerrX) < 25 || Math.abs(270 - degerrX) < 25) {
                    if (degerrX >= 0 && degerrX <= 180) {
                        div3.style.zIndex = -ll + o3d_3degree + o3DListLength + o3d_3degree;
                    } else {
                        div3.style.zIndex = ll + o3DListLength + o3d_3degree;
                    }
                } else {
                    if (degerrX >= 0 && degerrX <= 180) {
                        div3.style.zIndex = -ll + o3d_3degree;
                    } else {
                        div3.style.zIndex = ll;
                    }
                }
            }
            div3.style.transform = "translate3d(0,0,0) rotateY(" + (degerrX + 0) + "deg) rotateX(" + (degerrY + 0) + "deg)  translateZ(" + (0) + "px)";
        }
    } else {
        for (var ll = 0; ll < o3d_3degree; ll++) {
            var div3 = getByid("3DDiv3_" + ll);
            if (Math.abs(90 - degerrY) < 25 || Math.abs(270 - degerrY) < 25) {
                if (Math.abs(90 - degerrX) < 25 || Math.abs(270 - degerrX) < 25) {
                    if (degerrX >= 0 && degerrX <= 180) {
                        div3.style.zIndex = -ll + o3d_3degree + o3DListLength + o3d_3degree;
                    } else {
                        div3.style.zIndex = ll + o3DListLength + o3d_3degree;
                    }
                } else {
                    if (degerrX >= 0 && degerrX <= 180) {
                        div3.style.zIndex = -ll + o3d_3degree;
                    } else {
                        div3.style.zIndex = ll;
                    }
                }
            } else {
                if (Math.abs(90 - degerrX) < 25 || Math.abs(270 - degerrX) < 25) {
                    if (degerrX >= 0 && degerrX <= 180) {
                        div3.style.zIndex = -ll + o3d_3degree + o3DListLength + o3d_3degree;
                    } else {
                        div3.style.zIndex = ll + o3DListLength + o3d_3degree;
                    }
                } else {
                    if (degerrX >= 0 && degerrX <= 180) {
                        div3.style.zIndex = -ll + o3d_3degree;
                    } else {
                        div3.style.zIndex = ll;
                    }
                }
            }
            div3.style.transform = "translate3d(0,0,0) rotateY(" + (degerrX + 0) + "deg) rotateX(" + (degerrY + 0) + "deg)  translateZ(" + (0) + "px)";
        }
    }
}

function setVrLight() {
    var num = 0;
    if (getByid("3dShadow_0").selected == true) num = 0;
    else if (getByid("3dShadow_05").selected == true) num = 0.005;
    else if (getByid("3dShadow_1").selected == true) num = 0.01;
    else if (getByid("3dShadow_2").selected == true) num = 0.02;
    else if (getByid("3dShadow_3").selected == true) num = 0.03;
    else if (getByid("3dShadow_4").selected == true) num = 0.04;
    else if (getByid("3dShadow_5").selected == true) num = 0.05;
    else if (getByid("3dShadow_6").selected == true) num = 0.06;
    else if (getByid("3dShadow_7").selected == true) num = 0.07;
    else if (getByid("3dShadow_8").selected == true) num = 0.08;
    else if (getByid("3dShadow_12").selected == true) num = 0.12;
    if (num == 0) {
        for (var ll = 0; ll < o3DListLength; ll++) {
            var canvas1 = getByid("3DDiv" + ll).canvas();
            canvas1.style.backgroundColor = "";
        }
        for (var ll = 0; ll < o3d_3degree; ll++) {
            var canvas1 = getByid("3DDiv2_" + ll).canvas();
            canvas1.style.backgroundColor = "";
        }
        for (var ll = 0; ll < o3d_3degree; ll++) {
            var canvas1 = getByid("3DDiv3_" + ll).canvas();
            canvas1.style.backgroundColor = "";
        }
    } else {
        for (var ll = 0; ll < o3DListLength; ll++) {
            var canvas1 = getByid("3DDiv" + ll).canvas();
            canvas1.style.backgroundColor = "rgba(0,0,0," + num + ")";
        }
        for (var ll = 0; ll < o3d_3degree; ll++) {
            var canvas1 = getByid("3DDiv2_" + ll).canvas();
            canvas1.style.backgroundColor = "rgba(0,0,0," + num + ")";
        }
        for (var ll = 0; ll < o3d_3degree; ll++) {
            var canvas1 = getByid("3DDiv3_" + ll).canvas();
            canvas1.style.backgroundColor = "rgba(0,0,0," + num + ")";
        }
    }
}

function VRscreenshot() {
    var backgroundColor = GetViewport().div.style.backgroundColor;
    GetViewport().div.style.backgroundColor = "black";
    html2canvas(GetViewport().div).then(function (canvas) {
        //document.body.appendChild(canvas);
        var a = document.createElement('a');
        a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        a.download = 'image.png';
        a.click();
        delete canvas;
    });
    GetViewport().div.style.backgroundColor = backgroundColor;
}

function get3dCurrPoint(e) {
    var currX = parseFloat(e.pageX);
    var currY = parseFloat(e.pageY);
 
    return [currX, currY];
}

//test BlueLight2
/*function Clear3DVRCanvas(){
    for (var ll = 0; ll < o3DListLength; ll++) {
        var canvas1 = getByid("3DDiv" + ll).canvas();
        var ctx = canvas1.getContext("2d");
        var imgData = ctx.createImageData(canvas1.width, canvas1.height);
        new Uint32Array(imgData.data.buffer).fill(0xFF000000);
        ctx.putImageData(imgData, 0, 0);
       
   }
    for (var ll = 0; ll < o3d_3degree; ll++) {
        var canvas2 = getByid("3DDiv2_" + ll).canvas();
        var canvas3 = getByid("3DDiv3_" + ll).canvas();
        
        var ctx = canvas2.getContext("2d");
        var imgData = ctx.createImageData(canvas2.width, canvas2.height);
        new Uint32Array(imgData.data.buffer).fill(0xFF000000);
        ctx.putImageData(imgData, 0, 0);
        
        var ctx = canvas3.getContext("2d");
        var imgData = ctx.createImageData(canvas3.width, canvas3.height);
        new Uint32Array(imgData.data.buffer).fill(0xFF000000);
        ctx.putImageData(imgData, 0, 0);
   }
}*/
