//代表MPR模式為開啟狀態
var openMPR2 = false;
var o3dPixelData = [];
var o3dPixelData2 = [];
var o3dImage = [];
var o3dRotateSpeed = 5;

var o3dMaxLen;
var o3dCenter;

var thicknessList_MPR = [];
var Thickness_MPR = 0;

var globalTemVector3 = undefined;
var origin_openAnnotation;

function loadMPR2() {
    var span = document.createElement("SPAN");
    span.id = "ImgMPR2_span";
    span.innerHTML = `<img class="img MPR2 MPR_icon" alt="New MPR" id="ImgMPR2" onmouseover = "onElementOver(this);" onmouseleave = "onElementLeave();" src="../image/icon/black/b_LocalizerLines.png" width="50" height="50">`;
    getByid("icon-list").appendChild(span);

    /*var span = document.createElement("SPAN");
    span.innerHTML = `<label style="color: #ffffff;" id="mprLightLabel">position<input type="checkbox" checked="true" name="mprLight"
    id="mprLight"></label>`
    getByid("page-header").appendChild(span);
    getByid("mprLightLabel").style.display = "none";*/
}
loadMPR2();

function loadMPR2_UI() {
    if (!getByid("MouseOperation_MPR2")) {
        var img = document.createElement("IMG");
        img.src = getByid("MouseOperation").src;
        img.id = "MouseOperation_MPR2";
        img.className = "MPR_icon";
        img.width = img.height = "50";
        img.style.filter = "sepia(100%)"
        getByid("MouseOperation_span").appendChild(img);
    }
    if (!getByid("WindowRevision_MPR")) {
        var img = document.createElement("IMG");
        img.src = getByid("WindowRevision").src;
        img.id = "WindowRevision_MPR";
        img.className = "img MPR_icon_hide";
        img.width = img.height = "50";
        img.style.filter = "sepia(100%)"
        getByid("WindowRevision_span").appendChild(img);
    }
    if (!getByid("b_Scroll_MPR")) {
        var img = document.createElement("IMG");
        img.src = getByid("b_Scroll").src;
        img.id = "b_Scroll_MPR";
        img.className = "img MPR_icon_hide";
        img.width = img.height = "50";
        img.style.filter = "sepia(100%)"
        getByid("b_Scroll_span").appendChild(img);
    }
    if (!getByid("MouseRotate_MPR")) {
        var img = document.createElement("IMG");
        img.src = getByid("MouseRotate").src;
        img.id = "MouseRotate_MPR";
        img.className = "img MPR_icon_hide";
        img.width = img.height = "50";
        img.style.filter = "sepia(100%)"
        getByid("MouseRotate_span").appendChild(img);
    }
    if (!getByid("ImgMPR2_MPR")) {
        var img = document.createElement("IMG");
        img.src = getByid("ImgMPR2").src;
        img.id = "ImgMPR2_MPR";
        img.className = "MPR_icon";
        img.width = img.height = "50";
        img.style.filter = "sepia(100%)"
        getByid("ImgMPR2_span").appendChild(img);
    }
}
loadMPR2_UI();
getByid("MouseOperation_MPR2").style.display = "none";
getByid("WindowRevision_MPR").style.display = "none";
getByid("b_Scroll_MPR").style.display = "none";
getByid("MouseRotate_MPR").style.display = "none";
getByid("ImgMPR2_MPR").style.display = "none";
//getByid("WindowLevelDiv_MPR").style.display = "none";

function enterMPR_UI2() {
    getByid("MouseOperation_MPR2").style.display = "";
    getByid("WindowRevision_MPR").style.display = "";
    getByid("b_Scroll_MPR").style.display = "";
    getByid("MouseRotate_MPR").style.display = "";
    getByid("ImgMPR2_MPR").style.display = "";
    //getByid("WindowLevelDiv_MPR").style.display = "";
    getByid("MouseOperation").style.display = "none";
    getByid("WindowRevision").style.display = "none";
    getByid("WindowLevelDiv").style.display = "none";
    getByid("b_Scroll").style.display = "none";
    getByid("MouseRotate").style.display = "none";
    getByid("ImgMPR2").style.display = "none";
    openLeftImgClick = false;
}

function exitMPR2_UI() {
    getByid("MouseOperation_MPR2").style.display = "none";
    getByid("WindowRevision_MPR").style.display = "none";
    getByid("b_Scroll_MPR").style.display = "none";
    getByid("MouseRotate_MPR").style.display = "none";
    getByid("ImgMPR2_MPR").style.display = "none";
    //getByid("WindowLevelDiv_MPR").style.display = "none";
    getByid("MouseOperation").style.display = "";
    getByid("WindowRevision").style.display = "";
    getByid("WindowLevelDiv").style.display = "";
    getByid("b_Scroll").style.display = "";
    getByid("MouseRotate").style.display = "";
    getByid("ImgMPR2").style.display = "";
    openLeftImgClick = true;
}

function drawBorderMPR(element) {
    var MPR_icon = getClass("MPR_icon");
    for (var i = 0; i < MPR_icon.length; i++) MPR_icon[i].style['border'] = "";
    element.style['border'] = 3 + "px #FFFFFF solid";
    element.style['borderRadius'] = "3px 3px 3px 3px";
}

var MPRWheel = function (e) { }

getByid("MouseOperation_MPR2").onclick = function () {
    if (this.enable == false) return;
    //BL_mode = 'mouseTool_MPR2';
    if (BL_mode == 'mouseTool_MPR2') return;
    set_BL_model('mouseTool_MPR2');
    for (var c = 0; c < 3; c++) {
        GetViewport(c).div.removeEventListener("mousemove", BlueLightMousemove, false);
        GetViewport(c).div.removeEventListener("mousedown", BlueLightMousedown, false);
        GetViewport(c).div.removeEventListener("mouseup", BlueLightMouseup, false);
        GetViewport(c).div.removeEventListener("touchstart", BlueLightTouchstart, false);
        GetViewport(c).div.removeEventListener("touchmove", BlueLightTouchmove, false);
        GetViewport(c).div.removeEventListener("touchend", BlueLightTouchend, false);
        GetViewport(c).div.removeEventListener("wheel", Wheel, false);
    }
    //GetViewport(2).div.addEventListener("mousemove", BlueLightMousemove, false);
    //GetViewport(2).div.addEventListener("mousedown", Mousedown, false);
    //GetViewport(2).div.addEventListener("mouseup", BlueLightMouseup, false);
    //GetViewport(2).div.addEventListener("touchstart", BlueLightTouchstart, false);
    ///GetViewport(2).div.addEventListener("touchmove", BlueLightTouchmove, false);
    //GetViewport(2).div.addEventListener("touchend", BlueLightTouchend, false);
    for (var c = 0; c < 3; c++)  GetViewport(c).div.addEventListener("wheel", MPRWheel, false);
    drawBorderMPR(this);
}

getByid("ImgMPR2_MPR").onclick = function (catchError) {
    //if (this.enable == false) return;
    openMPR2 = false;
    if (catchError == "error") openMPR2 = false;
    img2darkByClass("MPR2", !openMPR2);
    if (openMPR2 == false) {
        exitMPR2();
    }
}

getByid("ImgMPR2").onclick = function (catchError) {
    if (this.enable == false) return;
    openMPR2 = true;
    if (catchError == "error") openMPR2 = false;
    img2darkByClass("MPR2", !openMPR2);
    if (openMPR2 == true) {
        initMPR2();
        if (openMPR2 != false)//在initMPR2()中出錯時，openMPR2會變成false
            for (var c = 0; c < 3; c++) GetViewport(c).canvas.style.display = GetViewportMark(c).style.display = "none";
    }
}

function exitMPR2() {
    if (openMPR2 == true) return;
    exitMPR2_UI();
    VIEWPORT.fixRow = VIEWPORT.fixCol = null;

    ViewPortList[0].lockRender = ViewPortList[1].lockRender = ViewPortList[3].lockRender = false;
    window.removeEventListener("resize", resizeVR, false);
    GetViewport(0).div.removeEventListener("wheel", MPRWheel, false);
    GetViewport(1).div.removeEventListener("wheel", MPRWheel, false);
    GetViewport(2).div.removeEventListener("wheel", MPRWheel, false);
    if (getByid("canvas0_MPR")) GetViewport(2).div.removeChild(getByid("canvas0_MPR"));
    if (getByid("canvas1_MPR")) GetViewport(1).div.removeChild(getByid("canvas1_MPR"));
    if (getByid("canvas2_MPR")) GetViewport(0).div.removeChild(getByid("canvas2_MPR"));
    cancelTools();
    openMouseTool = true;
    drawBorder(getByid("MouseOperation"));
    getByid("ImgMPR2").src = "../image/icon/black/b_LocalizerLines.png";
    //getByid("3dDisplay").style.display = "none";
    //getByid("mprLightLabel").style.display = "none";

    for (var i = 0; i < Viewport_Total; i++) {
        GetViewport(i).div.removeEventListener("contextmenu", contextmenuF, false);
        GetViewport(i).div.removeEventListener("mousemove", BlueLightMousemove, false);
        GetViewport(i).div.removeEventListener("mousedown", BlueLightMousedown, false);
        GetViewport(i).div.removeEventListener("mouseup", BlueLightMouseup, false);
        GetViewport(i).div.removeEventListener("mouseout", Mouseout, false);
        GetViewport(i).div.removeEventListener("wheel", Wheel, false);
        GetViewport(i).div.removeEventListener("mousedown", SwitchViewport, false);
        GetViewport(i).div.removeEventListener("touchstart", BlueLightTouchstart, false);
        GetViewport(i).div.removeEventListener("touchend", BlueLightTouchend, false);
        GetViewport(i).div.addEventListener("touchstart", SwitchViewport, false);
        GetViewport(i).div.addEventListener("mousedown", SwitchViewport, false);
    }
    viewportNumber = 0;
    window.onresize();
    //SetTable();

    if (GetViewport(0).sop) setSopToViewport(GetViewport(0).sop, 0);//loadAndViewImage(Patient.findSop(GetViewport(0).sop).imageId, 0);

    o3dPixelData = [];
    o3dPixelData2 = [];
    o3dImage = [];
    thicknessList_MPR = [];
    if (origin_openAnnotation == true || origin_openAnnotation == false) openAnnotation = origin_openAnnotation;
    displayAnnotation();
    for (var c = 0; c < Viewport_Total; c++) GetViewport(c).canvas.style.display = GetViewportMark(c).style.display = "";
    getByid("MouseOperation").click();
}
function initMPR2() {
    if (openMPR2 == false) return;
    getByid("MouseOperation_MPR2").click();
    enterMPR_UI2();

    VIEWPORT.fixRow = 1; VIEWPORT.fixCol = 3;
    openLink = false;
    changeLinkImg();
    origin_openAnnotation = openAnnotation;
    openAnnotation = false;
    displayAnnotation();
    //getByid("3dDisplay").style.display = "";
    //getByid("mprLightLabel").style.display = "";
    getByid("SplitViewportDiv").style.display = "none";
    cancelTools();
    getByid("ImgMPR2").src = "../image/icon/black/b_LocalizerLines.png";
    var sop = GetViewport().sop;
    SetTable(1, 3);//如果MPR2模式正在開啟，固定1x3
    GetViewport().scale = null;
    for (var c = 0; c < 3; c++)
        GetViewport(c).canvas.style.display = GetViewportMark(c).style.display = "none";
    viewportNumber = 0;
    setSopToViewport(GetViewport().sop, 0);//loadAndViewImage(Patient.findSop(GetViewport().sop).imageId);
    ViewPortList[0].lockRender = ViewPortList[1].lockRender = ViewPortList[3].lockRender = true;
    window.addEventListener("resize", resizeVR, false);
    for (var i1 = 0; i1 < Viewport_Total; i1++) {
        GetViewport(i1).div.removeEventListener("contextmenu", contextmenuF, false);
        GetViewport(i1).div.removeEventListener("mousemove", BlueLightMousemove, false);
        GetViewport(i1).div.removeEventListener("mousedown", BlueLightMousedown, false);
        GetViewport(i1).div.removeEventListener("mouseup", BlueLightMouseup, false);
        GetViewport(i1).div.removeEventListener("mouseout", Mouseout, false);
        GetViewport(i1).div.removeEventListener("wheel", Wheel, false);
        GetViewport(i1).div.removeEventListener("mousedown", SwitchViewport, false);
        GetViewport(i1).div.removeEventListener("touchstart", BlueLightTouchstart, false);
        GetViewport(i1).div.removeEventListener("touchend", BlueLightTouchend, false);
        GetViewport(i1).div.removeEventListener("touchstart", SwitchViewport, false);
    }
    GetViewport().div.addEventListener("contextmenu", contextmenuF, false);
    GetViewport().div.addEventListener("mouseout", Mouseout, false);
    GetViewport(3).div.addEventListener("mousemove", mousemove3D, false);
    GetViewport(3).div.addEventListener("mousedown", mousedown3D, false);
    GetViewport(3).div.addEventListener("mouseup", mouseup3D, false);
    GetViewport(3).div.addEventListener("contextmenu", contextmenuF, false);

    var list = sortInstance(sop);

    Thickness_MPR = 0;
    var big = 100000000000000000000000000000;

    openRendering = true;
    img2darkByClass("Rendering", !openRendering);

    thicknessList_MPR = [];
    function loadImageDataForMPR(image, pixelData, pixelData2) {

        var windowWidth = image.windowWidth;
        var windowCenter = image.windowCenter;
        if (getByid("o3DAngio").selected == true) {
            windowWidth = 332;
            windowCenter = 287;
        } else if (getByid("o3DAirways").selected == true) {
            //如果是肺氣管模型，使用對應的Window Level
            windowWidth = 409;
            windowCenter = -538;
        }
        var high = windowCenter + (windowWidth / 2);
        var low = windowCenter - (windowWidth / 2);
        var intercept = image.intercept;
        if (CheckNull(intercept)) intercept = 0;
        var slope = image.slope;
        if (CheckNull(slope)) slope = 1;

        var multiplication = 255 / ((high - low)) * slope;
        var addition = (- low + intercept) / (high - low) * 255;
        var j = 0;
        for (var h = 0; h < pixelData2.length; h++) {
            for (var w = 0, w4 = 0; w < pixelData2[h].length / 4; w++, w4 += 4, j++) {
                pixelData2[h][w4 + 0] = pixelData2[h][w4 + 1] = pixelData2[h][w4 + 2] = pixelData[j] * multiplication + addition;
                pixelData2[h][w4 + 3] = 255;
            }
        }
        return pixelData2;
    }

    o3dPixelData = [];
    o3dPixelData2 = [];
    Thickness_MPR = -Thickness_MPR + big;
    for (var l = 0; l < list.length; l++) {
        const l2 = l;
        const image = getPatientbyImageID[list[l2].imageId].image;
        const pixelData = getPatientbyImageID[list[l2].imageId].pixelData;
        o3dPixelData.push(pixelData);
        o3dImage.push(image);

        var Arr_ = new Array(image.height);
        for (var h = 0; h < image.height; h++) {
            Arr_[h] = new Uint8ClampedArray(image.width * 4);
        }

        Arr_ = loadImageDataForMPR(o3dImage[o3dImage.length - 1], o3dPixelData[o3dPixelData.length - 1], Arr_);
        o3dPixelData2.push(Arr_);
        try {
            var thickness = parseFloat(image.data.string('x00200032').split("\\")[2]) * GetViewport().transform.PixelSpacingX;
            thicknessList_MPR.push(thickness);
            if (thickness < Thickness_MPR) Thickness_MPR = thickness;
            if (thickness < big) big = thickness;
            o3Dcount = list.length;
        } catch (ex) {
            catchError = true;
            if (openMPR2 == true) {
                openMPR2 = false;
                alert("Error, this image may not support 3D.");
            };
            openRendering = false;
            getByid("ImgMPR2_MPR").onclick('error');
            return;
        };
    }

    display3dImage2Canvas();
    return;
}

function trueMousedownClick(e) {
    if (e.which == 1) this.MouseLeftClick = true;
    else if (e.which == 2) this.MouseMiddleClick = true;
    else if (e.which == 3) this.MouseRightClick = true;
}
function falseMousedownClick(e) {
    this.MouseLeftClick = false;
    this.MouseMiddleClick = false;
    this.MouseRightClick = false;
}

function getVrDistance() {
    var VrDistance = 0;
    VrDistance += thicknessList_MPR[thicknessList_MPR.length - 1] - Thickness_MPR - (thicknessList_MPR[0] - Thickness_MPR);
    VrDistance /= o3dPixelData2.length;
    if (VrDistance == 0) VrDistance = 1;
    if (VrDistance < 0) VrDistance *= -1;
    return VrDistance;
}

function normalizeAngle(angle) { return angle % 360 < 0 ? (angle % 360) + 360 : angle % 360; }


function rotatePoint_MPR2(x, y, cx, cy, angle) {
    // 將角度轉換為弧度
    var radian = angle * Math.PI / 180;
    // 計算相對於中心點的偏移量
    var offsetX = x - cx;
    var offsetY = y - cy;
    // 進行旋轉計算
    var rotatedX = offsetX * Math.cos(radian) - offsetY * Math.sin(radian);
    var rotatedY = offsetX * Math.sin(radian) + offsetY * Math.cos(radian);
    // 將旋轉後的座標加回中心點的位置
    var newX = rotatedX + cx;
    var newY = rotatedY + cy;
    // 返回旋轉後的座標
    return [newX, newY];//{ x: newX, y: newY };
}

function display3dImage2Canvas() {
    var VrDistance = getVrDistance();
    o3dMaxLen = new Vector3(parseInt(o3dPixelData2[0][0].length / 4), o3dPixelData2[0].length, o3dPixelData2.length * VrDistance);
    o3dCenter = new Vector3(parseInt(o3dMaxLen.x / 2), parseInt(o3dMaxLen.y / 2), parseInt(o3dMaxLen.z / 2));
    globalTemVector3 = new Vector3(o3dCenter.x, o3dCenter.y, o3dCenter.z);
    var canvas0 = document.createElement("CANVAS");
    canvas0.id = "canvas0_MPR";
    canvas0.width = o3dMaxLen.x;
    canvas0.height = o3dMaxLen.y;

    GetViewport(2).div.appendChild(canvas0);

    canvas0.MouseLeftClick = false;
    canvas0.MouseRightClick = false;
    canvas0.rotate = 0;
    canvas0.addEventListener("mousedown", trueMousedownClick, false);
    canvas0.addEventListener("mousemove", mpr2Canvas0, false);
    canvas0.addEventListener("mouseup", falseMousedownClick, false);
    canvas0.oncontextmenu = function (e) { e.preventDefault(); };

    var canvas1 = document.createElement("CANVAS");
    canvas1.id = "canvas1_MPR";
    canvas1.width = o3dMaxLen.x
    canvas1.height = VrDistance * o3dPixelData2.length;//GetViewport().height;

    GetViewport(1).div.appendChild(canvas1);

    canvas1.MouseLeftClick = false;
    canvas1.MouseRightClick = false;
    canvas1.rotate = 0;
    canvas1.addEventListener("mousedown", trueMousedownClick, false);
    canvas1.addEventListener("mousemove", mpr2Canvas1, false);
    canvas1.addEventListener("mouseup", falseMousedownClick, false);
    canvas1.oncontextmenu = function (e) { e.preventDefault(); };


    var canvas2 = document.createElement("CANVAS");
    canvas2.id = "canvas2_MPR";
    canvas2.width = o3dMaxLen.y;//o3dPixelData2.length;
    canvas2.height = VrDistance * o3dPixelData2.length;// GetViewport().height;

    GetViewport(0).div.appendChild(canvas2);

    canvas2.MouseLeftClick = false;
    canvas2.MouseRightClick = false;
    canvas2.rotate = 0;
    canvas2.addEventListener("mousedown", trueMousedownClick, false);
    canvas2.addEventListener("mousemove", mpr2Canvas2, false);
    canvas2.addEventListener("mouseup", falseMousedownClick, false);
    canvas2.oncontextmenu = function (e) { e.preventDefault(); };

    for (var c of getClass("DicomCanvas")) c.style.display = "none";


    canvas0.drawLine = function () {
        var [canvas0, canvas1, canvas2] = getMprCanvas();
        var ctx = this.getContext("2d");

        ctx.lineWidth = 3;
        ctx.strokeStyle = "pink";
        ctx.beginPath();
        var p0 = rotatePoint_MPR2(-this.width, canvas1.camera.center.y, canvas2.camera.center.x, canvas1.camera.center.y, canvas1.camera.angle.z);
        var p1 = rotatePoint_MPR2(this.width * 2, canvas1.camera.center.y, canvas2.camera.center.x, canvas1.camera.center.y, canvas1.camera.angle.z);
        ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]);
        ctx.stroke();

        ctx.strokeStyle = "blue";
        ctx.beginPath();
        var p0 = rotatePoint_MPR2(canvas2.camera.center.x, -this.height, canvas2.camera.center.x, canvas1.camera.center.y, canvas2.camera.angle.z);
        var p1 = rotatePoint_MPR2(canvas2.camera.center.x, this.height * 2, canvas2.camera.center.x, canvas1.camera.center.y, canvas2.camera.angle.z);
        ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]);
        ctx.stroke();
    }

    canvas1.drawLine = function () {
        var [canvas0, canvas1, canvas2] = getMprCanvas();
        var ctx = canvas1.getContext("2d");

        ctx.lineWidth = 3;
        ctx.strokeStyle = "yellow";
        ctx.beginPath();
        var p0 = rotatePoint_MPR2(-this.width, canvas0.camera.center.z / (o3dMaxLen.z / canvas1.height), canvas2.camera.center.x / (o3dMaxLen.x / canvas1.width), canvas0.camera.center.z / (o3dMaxLen.z / canvas1.height), -canvas0.camera.angle.y);
        var p1 = rotatePoint_MPR2(this.width * 2, canvas0.camera.center.z / (o3dMaxLen.z / canvas1.height), canvas2.camera.center.x / (o3dMaxLen.x / canvas1.width), canvas0.camera.center.z / (o3dMaxLen.z / canvas1.height), -canvas0.camera.angle.y);

        ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]);
        ctx.stroke();

        ctx.strokeStyle = "blue";
        ctx.beginPath();
        var p0 = rotatePoint_MPR2(canvas2.camera.center.x / (o3dMaxLen.x / canvas1.width), -this.height, canvas2.camera.center.x / (o3dMaxLen.x / canvas1.width), canvas0.camera.center.z * (canvas1.height / o3dMaxLen.z), -canvas2.camera.angle.y);
        var p1 = rotatePoint_MPR2(canvas2.camera.center.x / (o3dMaxLen.x / canvas1.width), this.height * 2, canvas2.camera.center.x / (o3dMaxLen.x / canvas1.width), canvas0.camera.center.z * (canvas1.height / o3dMaxLen.z), -canvas2.camera.angle.y);
        ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]);
        ctx.stroke();
    }
    canvas2.drawLine = function () {
        var [canvas0, canvas1, canvas2] = getMprCanvas();
        var ctx = canvas2.getContext("2d");

        ctx.lineWidth = 3;
        ctx.strokeStyle = "yellow";
        ctx.beginPath();
        var p0 = rotatePoint_MPR2(-this.width, canvas0.camera.center.z / (o3dMaxLen.z / canvas2.height), canvas1.camera.center.y / (o3dMaxLen.y / canvas2.width), canvas0.camera.center.z / (o3dMaxLen.z / canvas2.height), canvas0.camera.angle.x);
        var p1 = rotatePoint_MPR2(this.width * 2, canvas0.camera.center.z / (o3dMaxLen.z / canvas2.height), canvas1.camera.center.y / (o3dMaxLen.y / canvas2.width), canvas0.camera.center.z / (o3dMaxLen.z / canvas2.height), canvas0.camera.angle.x);
        ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]);
        ctx.stroke();

        ctx.strokeStyle = "pink";
        ctx.beginPath();
        var p0 = rotatePoint_MPR2(canvas1.camera.center.y / (o3dMaxLen.y / canvas2.width), -this.height, canvas1.camera.center.y / (o3dMaxLen.y / canvas2.width), canvas0.camera.center.z * (canvas2.height / o3dMaxLen.z), canvas1.camera.angle.x);
        var p1 = rotatePoint_MPR2(canvas1.camera.center.y / (o3dMaxLen.y / canvas2.width), this.height * 2, canvas1.camera.center.y / (o3dMaxLen.y / canvas2.width), canvas0.camera.center.z * (canvas2.height / o3dMaxLen.z), canvas1.camera.angle.x);
        ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]);
        //ctx.moveTo(canvas1.camera.center.y, 0); ctx.lineTo(canvas1.camera.center.y, this.height);
        ctx.stroke();
    }

    class MPRCamera {
        constructor(point, center, id) {
            this.center = new Vector3(center.x, center.y, center.z);
            this.point = new Vector3(point.x, point.y, point.z);
            this.originPoint = new Vector3(point.x, point.y, point.z);
            this.angle = new Vector3(0, 0, 0);
            this.offset = new Vector3(0, 0, 0);
            this.id = id;
        }
        getReduceCenter() {//256-(218-256)
            return new Vector3(o3dCenter[0] + (this.center[0] - o3dCenter[0]), o3dCenter[1] + (this.center[1] - o3dCenter[1]), o3dCenter[2] + (this.center[2] - o3dCenter[2]));
        }
        getVector(origin = true) {
            var center = o3dCenter;
            var point = this.point;
            if (origin) point = this.originPoint
            //[canvas1.camera.point[0]-o3dCenter[0],canvas1.camera.point[1]-o3dCenter[1],canvas1.camera.point[2]-o3dCenter[2]]
            // [canvas1.camera.point[0]-canvas1.camera.center[0],canvas1.camera.point[1]-canvas1.camera.center[1],canvas1.camera.point[2]-canvas1.camera.center[2]]
            return new Vector3((center.x - point.x).toFixed(3), (center.y - point.y).toFixed(3), (center.z - point.z).toFixed(3));
            var relativeX = this.center.x - this.point.x;
            var relativeY = this.center.y - this.point.y;
            var relativeZ = this.center.z - this.point.z;
            if (relativeX == 0 && relativeY == 0) this.setRotateX(1);
            else if (relativeX == 0 && relativeZ == 0) this.setRotateZ(1);
            else if (relativeY == 0 && relativeZ == 0) this.setRotateY(1);
            else return new Vector3(relativeX, relativeY, relativeZ);
            return new Vector3(this.center.x - this.point.x, this.center.y - this.point.y, this.center.z - this.point.z);
        }
        getCenter() { return this.center; new Vector3(this.center.x + this.offset.x, this.center.y + this.offset.y, this.center.z + this.offset.z); }
        setRotateX(angle) {
            this.angle.x = normalizeAngle(this.angle.x + angle);
            var point = rotateX(this.point, o3dCenter, angle);
            [this.point.x, this.point.y, this.point.z] = [this.point.x, point[1], point[2]];
        }
        setRotateY(angle) {
            this.angle.y = normalizeAngle(this.angle.y + angle);
            if (this.id == 0) angle = -angle;
            var point = rotateY(this.point, o3dCenter, angle);
            [this.point.x, this.point.y, this.point.z] = [point[0], this.point.y, point[2]];
        }
        setRotateZ(angle) {
            this.angle.z = normalizeAngle(this.angle.z + angle);
            var point = rotateZ(this.point, o3dCenter, angle);
            [this.point.x, this.point.y, this.point.z] = [point[0], point[1], this.point.z];
        }
    }

    canvas0.camera = new MPRCamera(new Vector3(o3dCenter.x, o3dCenter.y, distanceOfVector3(o3dMaxLen) + 1), o3dCenter, 0);
    canvas1.camera = new MPRCamera(new Vector3(o3dCenter.x, -distanceOfVector3(o3dMaxLen) - 1, o3dCenter.z), o3dCenter, 1);
    canvas2.camera = new MPRCamera(new Vector3(-distanceOfVector3(o3dMaxLen) - 1, o3dCenter.y, o3dCenter.z), o3dCenter, 2);

    canvas0.SetStyle = function () {
        this.style.height = this.height + "px";
        this.style.width = this.width + "px";
        this.style.position = "absolute";
        this.style.top = "50%"; this.style.left = "50%";
        this.style.margin = "-" + (parseInt(this.style.height) / 2) + "px 0 0 -" + (parseInt(this.style.width) / 2) + "px";
    }
    canvas1.SetStyle = function () {
        this.style.height = this.height + "px";
        this.style.width = this.width + "px";
        this.style.position = "absolute";
        this.style.top = "50%"; this.style.left = "50%";
        this.style.margin = "-" + (parseInt(this.style.height) / 2) + "px 0 0 -" + (parseInt(this.style.width) / 2) + "px";
    }
    canvas2.SetStyle = function () {
        this.style.height = this.height + "px";
        this.style.width = this.width + "px";
        this.style.position = "absolute";
        this.style.top = "50%"; this.style.left = "50%";
        this.style.margin = "-" + (parseInt(this.style.height) / 2) + "px 0 0 -" + (parseInt(this.style.width) / 2) + "px";
    }

    canvas0.reflesh = function () {
        var abs = function (val) { return Math.abs(val); }
        this.getContext('2d').clearRect(0, 0, this.width, this.height);
        var VrDistance = getVrDistance();
        var vector1 = new Vector3(1, 0, 0);
        var vector2 = new Vector3(0, 1, 0);

        var zeroPoint = new Vector3(0, 0, 0);
        vector1 = rotateX(vector1, zeroPoint, this.camera.angle.x, true);
        vector2 = rotateX(vector2, zeroPoint, this.camera.angle.x, true);

        vector1 = rotateY(vector1, zeroPoint, this.camera.angle.y, true);
        vector2 = rotateY(vector2, zeroPoint, this.camera.angle.y, true);

        vector1 = rotateZ(vector1, zeroPoint, this.camera.angle.z, true);
        vector2 = rotateZ(vector2, zeroPoint, this.camera.angle.z, true);

        vector1.x *= o3dMaxLen[0]; vector1.y *= o3dMaxLen[1]; vector1.z *= o3dMaxLen[2];
        vector2.x *= o3dMaxLen[0]; vector2.y *= o3dMaxLen[1]; vector2.z *= o3dMaxLen[2];

        var [len1, len2] = [distanceOfVector3(vector1), distanceOfVector3(vector2)];
        [this.width, this.height] = [len1, len2];
        var pixelData0 = this.getContext("2d").getImageData(0, 0, this.width, this.height);
        pixelData0.data.fill(0);

        var y = 0, x = 0, z = 0, h = 0, w = 0, h4 = 0, w4 = 0, center = this.camera.center;
        var [offsetX, invertX] = getOffsetX(vector1, vector2, center, len1, len2);
        var [offsetY, invertY] = getOffsetY(vector1, vector2, center, len1, len2);
        var [offsetZ, invertZ] = getOffsetZ(vector1, vector2, center, len1, len2);

        var MaxZ = o3dMaxLen.z / VrDistance - 1;

        var tableX1 = new Array(this.height).fill(0).map((o, h) => (getPointFromCube3(vector2, center, len2, h).x - center.x));
        var tableY1 = new Array(this.height).fill(0).map((o, h) => (getPointFromCube3(vector2, center, len2, h).y - center.y));
        var tableZ1 = new Array(this.height).fill(0).map((o, h) => (getPointFromCube3(vector2, center, len2, h).z - center.z));
        var tableX2 = new Array(this.width).fill(0).map((o, w) => (getPointFromCube3(vector1, center, len1, w).x - center.x));
        var tableY2 = new Array(this.width).fill(0).map((o, w) => (getPointFromCube3(vector1, center, len1, w).y - center.y));
        var tableZ2 = new Array(this.width).fill(0).map((o, w) => (getPointFromCube3(vector1, center, len1, w).z - center.z));

        for (h = 0; h < this.height; h++) {
            for (w = 0, w4 = 0; w < this.width; w++, w4 += 4) {
                x = parseInt((center.x + offsetX) * invertX + (tableX1[h] + tableX2[w]));
                y = parseInt((center.y + offsetY) * invertY + (tableY1[h] + tableY2[w]));
                z = parseInt(((center.z + offsetZ) * invertZ + (tableZ1[h] + tableZ2[w])) / VrDistance);
                if (x < 0 || y < 0 || z < 0 || x >= o3dMaxLen.x || y >= o3dMaxLen.y || z >= MaxZ) continue;
                pixelData0.data[h * (this.width * 4) + w4] = o3dPixelData2[z][y][x * 4 + 0];
                pixelData0.data[h * (this.width * 4) + w4 + 1] = o3dPixelData2[z][y][x * 4 + 1];
                pixelData0.data[h * (this.width * 4) + w4 + 2] = o3dPixelData2[z][y][x * 4 + 2];
                pixelData0.data[h * (this.width * 4) + w4 + 3] = o3dPixelData2[z][y][x * 4 + 3];
            }
        }
        this.getContext("2d").putImageData(pixelData0, 0, 0);
        this.drawLine(); this.SetStyle();
    }

    canvas1.reflesh = function () {
        this.getContext('2d').clearRect(0, 0, this.width, this.height);
        var VrDistance = getVrDistance();
        var vector1 = new Vector3(1, 0, 0);
        var vector2 = new Vector3(0, 0, 1);
        var zeroPoint = new Vector3(0, 0, 0);
        vector1 = rotateX(vector1, zeroPoint, this.camera.angle.x, true);
        vector2 = rotateX(vector2, zeroPoint, this.camera.angle.x, true);

        vector1 = rotateY(vector1, zeroPoint, this.camera.angle.y, true);
        vector2 = rotateY(vector2, zeroPoint, this.camera.angle.y, true);

        vector1 = rotateZ(vector1, zeroPoint, this.camera.angle.z, true);
        vector2 = rotateZ(vector2, zeroPoint, this.camera.angle.z, true);

        vector1.x *= o3dMaxLen[0]; vector1.y *= o3dMaxLen[1]; vector1.z *= o3dMaxLen[2];
        vector2.x *= o3dMaxLen[0]; vector2.y *= o3dMaxLen[1]; vector2.z *= o3dMaxLen[2];

        var [len1, len2] = [distanceOfVector3(vector1), distanceOfVector3(vector2)];
        [this.width, this.height] = [len1, len2];

        var pixelData0 = this.getContext("2d").getImageData(0, 0, this.width, this.height);
        pixelData0.data.fill(0);

        var y = 0, x = 0, z = 0, h = 0, w = 0, h4 = 0, w4 = 0, center = this.camera.center;
        var [offsetX, invertX] = getOffsetX(vector1, vector2, center, len1, len2);
        var [offsetY, invertY] = getOffsetY(vector1, vector2, center, len1, len2);
        var [offsetZ, invertZ] = getOffsetZ(vector1, vector2, center, len1, len2);

        var MaxZ = o3dMaxLen.z / VrDistance - 1;
        var tableX1 = new Array(this.height).fill(0).map((o, h) => (getPointFromCube3(vector2, center, len2, h).x - center.x));
        var tableY1 = new Array(this.height).fill(0).map((o, h) => (getPointFromCube3(vector2, center, len2, h).y - center.y));
        var tableZ1 = new Array(this.height).fill(0).map((o, h) => (getPointFromCube3(vector2, center, len2, h).z - center.z));
        var tableX2 = new Array(this.width).fill(0).map((o, w) => (getPointFromCube3(vector1, center, len1, w).x - center.x));
        var tableY2 = new Array(this.width).fill(0).map((o, w) => (getPointFromCube3(vector1, center, len1, w).y - center.y));
        var tableZ2 = new Array(this.width).fill(0).map((o, w) => (getPointFromCube3(vector1, center, len1, w).z - center.z));
        //invertX=invertY=invertZ=1;offsetX=offsetY=offsetZ=0;
        for (h = 0; h < this.height; h++) {
            for (w = 0, w4 = 0; w < this.width; w++, w4 += 4) {
                x = parseInt((center.x + offsetX) * invertX + (tableX1[h] + tableX2[w]));
                y = parseInt((center.y + offsetY) * invertY + (tableY1[h] + tableY2[w]));
                z = parseInt(((center.z + offsetZ) * invertZ + (tableZ1[h] + tableZ2[w])) / VrDistance);
                if (x < 0 || y < 0 || z < 0 || x >= o3dMaxLen.x || y >= o3dMaxLen.y || z >= MaxZ) continue;
                pixelData0.data[h * (this.width * 4) + w4] = o3dPixelData2[z][y][x * 4 + 0];
                pixelData0.data[h * (this.width * 4) + w4 + 1] = o3dPixelData2[z][y][x * 4 + 1];
                pixelData0.data[h * (this.width * 4) + w4 + 2] = o3dPixelData2[z][y][x * 4 + 2];
                pixelData0.data[h * (this.width * 4) + w4 + 3] = o3dPixelData2[z][y][x * 4 + 3];
            }
        }
        this.getContext("2d").putImageData(pixelData0, 0, 0);
        this.drawLine(); this.SetStyle();
    }

    canvas2.reflesh = function () {
        this.getContext('2d').clearRect(0, 0, this.width, this.height);
        var VrDistance = getVrDistance();
        var vector1 = new Vector3(0, 1, 0);
        var vector2 = new Vector3(0, 0, 1);

        var zeroPoint = new Vector3(0, 0, 0);
        vector1 = rotateX(vector1, zeroPoint, this.camera.angle.x, true);
        vector2 = rotateX(vector2, zeroPoint, this.camera.angle.x, true);

        vector1 = rotateY(vector1, zeroPoint, this.camera.angle.y, true);
        vector2 = rotateY(vector2, zeroPoint, this.camera.angle.y, true);


        vector1 = rotateZ(vector1, zeroPoint, this.camera.angle.z, true);
        vector2 = rotateZ(vector2, zeroPoint, this.camera.angle.z, true);

        vector1.x *= o3dMaxLen[0]; vector1.y *= o3dMaxLen[1]; vector1.z *= o3dMaxLen[2];
        vector2.x *= o3dMaxLen[0]; vector2.y *= o3dMaxLen[1]; vector2.z *= o3dMaxLen[2];

        var [len1, len2] = [distanceOfVector3(vector1), distanceOfVector3(vector2)];
        [this.width, this.height] = [len1, len2];
        var pixelData0 = this.getContext("2d").getImageData(0, 0, this.width, this.height);
        pixelData0.data.fill(0);

        var y = 0, x = 0, z = 0, h = 0, w = 0, h4 = 0, w4 = 0, center = this.camera.center;
        var [offsetX, invertX] = getOffsetX(vector1, vector2, center, len1, len2);
        var [offsetY, invertY] = getOffsetY(vector1, vector2, center, len1, len2);
        var [offsetZ, invertZ] = getOffsetZ(vector1, vector2, center, len1, len2);
        var MaxZ = o3dMaxLen.z / VrDistance - 1;
        var tableX1 = new Array(this.height).fill(0).map((o, h) => (getPointFromCube3(vector2, center, len2, h).x - center.x));
        var tableY1 = new Array(this.height).fill(0).map((o, h) => (getPointFromCube3(vector2, center, len2, h).y - center.y));
        var tableZ1 = new Array(this.height).fill(0).map((o, h) => (getPointFromCube3(vector2, center, len2, h).z - center.z));
        var tableX2 = new Array(this.width).fill(0).map((o, w) => (getPointFromCube3(vector1, center, len1, w).x - center.x));
        var tableY2 = new Array(this.width).fill(0).map((o, w) => (getPointFromCube3(vector1, center, len1, w).y - center.y));
        var tableZ2 = new Array(this.width).fill(0).map((o, w) => (getPointFromCube3(vector1, center, len1, w).z - center.z));

        for (h = 0; h < this.height; h++) {
            for (w = 0, w4 = 0; w < this.width; w++, w4 += 4) {
                x = parseInt((center.x + offsetX) * invertX + (tableX1[h] + tableX2[w]));
                y = parseInt((center.y + offsetY) * invertY + (tableY1[h] + tableY2[w]));
                z = parseInt(((center.z + offsetZ) * invertZ + (tableZ1[h] + tableZ2[w])) / VrDistance);
                if (x < 0 || y < 0 || z < 0 || x >= o3dMaxLen.x || y >= o3dMaxLen.y || z >= MaxZ) continue;
                pixelData0.data[h * (this.width * 4) + w4] = o3dPixelData2[z][y][x * 4 + 0];
                pixelData0.data[h * (this.width * 4) + w4 + 1] = o3dPixelData2[z][y][x * 4 + 1];
                pixelData0.data[h * (this.width * 4) + w4 + 2] = o3dPixelData2[z][y][x * 4 + 2];
                pixelData0.data[h * (this.width * 4) + w4 + 3] = o3dPixelData2[z][y][x * 4 + 3];
            }
        }
        this.getContext("2d").putImageData(pixelData0, 0, 0);
        this.drawLine(); this.SetStyle();
    }
    canvas0.reflesh();
    canvas1.reflesh();
    canvas2.reflesh();
}

function getMprCanvas() {
    return [getByid("canvas0_MPR"), getByid("canvas1_MPR"), getByid("canvas2_MPR")]
}

function refleshAndDrawMpr() {
    var [canvas0, canvas1, canvas2] = getMprCanvas();
    canvas0.reflesh(); canvas1.reflesh(); canvas2.reflesh();
}

function mpr2Canvas0(event) {
    var [canvas0, canvas1, canvas2] = getMprCanvas();
    if (canvas0.MouseRightClick == true) {
        canvas1.camera.setRotateZ(o3dRotateSpeed); canvas2.camera.setRotateZ(o3dRotateSpeed);
        refleshAndDrawMpr();
        return;
    } else if (canvas0.MouseLeftClick == true) {
        var currX11 = (event.offsetX != null) ? event.offsetX : event.originalEvent.layerX;
        var currY11 = (event.offsetY != null) ? event.offsetY : event.originalEvent.layerY;
        canvas1.camera.center.y = currY11;

        canvas1.camera.center.x = currX11;
        canvas2.camera.center.y = currY11;
        canvas2.camera.center.x = currX11;
        refleshAndDrawMpr();
    }
}

function mpr2Canvas1(event) {
    var [canvas0, canvas1, canvas2] = getMprCanvas();
    if (canvas1.MouseRightClick == true) {
        canvas0.camera.setRotateY(-o3dRotateSpeed); canvas2.camera.setRotateY(-o3dRotateSpeed);
        refleshAndDrawMpr();
        return;
    }
    else if (canvas1.MouseLeftClick == true) {
        var currX11 = (event.offsetX != null) ? event.offsetX : event.originalEvent.layerX;
        var currY11 = (event.offsetY != null) ? event.offsetY : event.originalEvent.layerY;

        var v = new Vector3(currX11 / o3dMaxLen.x, 0, currY11 / o3dMaxLen.z);
        var cx = rotateX(v, new Vector3(0.5, 0.5, 0.5), canvas0.camera.angle[0]);
        [v.x, v.y, v.z] = cx;

        var cz = rotateZ(v, new Vector3(0.5, 0.5, 0.5), canvas0.camera.angle[2]);
        [v.x, v.y, v.z] = cz;
        [v.x, v.y, v.z] = [parseFloat(v.x) + 0.5, parseFloat(v.y) + 0.5, parseFloat(v.z) + 0.5]
        v.x *= o3dMaxLen.x; v.y *= o3dMaxLen.y; v.z *= o3dMaxLen.z;

        canvas0.camera.center.x = parseFloat(v[0]);
        canvas0.camera.center.y = parseFloat(v[1]);
        canvas0.camera.center.z = parseFloat(v[2]);

        var v = new Vector3(currX11 / o3dMaxLen.x, 0, currY11 / o3dMaxLen.z);
        var cx = rotateX(v, new Vector3(0.5, 0.5, 0.5), canvas2.camera.angle[0]);
        [v.x, v.y, v.z] = cx;

        var cz = rotateZ(v, new Vector3(0.5, 0.5, 0.5), canvas2.camera.angle[2]);
        [v.x, v.y, v.z] = cz;
        [v.x, v.y, v.z] = [parseFloat(v.x) + 0.5, parseFloat(v.y) + 0.5, parseFloat(v.z) + 0.5]
        v.x *= o3dMaxLen.x; v.y *= o3dMaxLen.y; v.z *= o3dMaxLen.z;
        canvas2.camera.center.x = parseFloat(v[0]);
        canvas2.camera.center.y = parseFloat(v[1]);
        canvas2.camera.center.z = parseFloat(v[2]);
        refleshAndDrawMpr();
    }
}

function mpr2Canvas2(event) {
    var [canvas0, canvas1, canvas2] = getMprCanvas();
    if (canvas2.MouseRightClick == true) {
        canvas0.camera.setRotateX(o3dRotateSpeed); canvas1.camera.setRotateX(o3dRotateSpeed);
        refleshAndDrawMpr();
        return;
    } else if (canvas2.MouseLeftClick == true) {
        var currX11 = (event.offsetX != null) ? event.offsetX : event.originalEvent.layerX;
        var currY11 = (event.offsetY != null) ? event.offsetY : event.originalEvent.layerY;
        canvas0.camera.center.y = currX11;
        canvas0.camera.center.z = currY11;
        canvas1.camera.center.y = currX11;
        canvas1.camera.center.z = currY11;
        refleshAndDrawMpr();
    }
}

class Vector3 {
    constructor(num1 = 0, num2 = 0, num3 = 0) {
        this.type = "Vector3";
        this.x_ = num1; this.y_ = num2; this.z_ = num3;
    }
    get x() { return this.x_ };
    get y() { return this.y_ };
    get z() { return this.z_ };
    set x(val) { this.x_ = val };
    set y(val) { this.y_ = val };
    set z(val) { this.z_ = val };
    get 0() { return this.x_ };
    get 1() { return this.y_ };
    get 2() { return this.z_ };
    set 0(val) { this.x_ = val };
    set 1(val) { this.y_ = val };
    set 2(val) { this.z_ = val };
    get p() { return [this.x, this.y, this.z] }
    get point() { return [this.x, this.y, this.z] }
    getInvert() {
        return [-this.x, -this.y, -this.z]
    }
}

// 旋轉矩陣計算函數
function rotateX(coord3D, center, angle, vector3 = false) {
    const rad = angle * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const [cx, cy, cz] = [center.x, center.y, center.z];
    const [x, y, z] = [coord3D.x, coord3D.y, coord3D.z];

    const translatedX = x - cx;
    const translatedY = y - cy;
    const translatedZ = z - cz;

    const rotatedY = translatedY * cos - translatedZ * sin;
    const rotatedZ = translatedY * sin + translatedZ * cos;

    const newX = translatedX;
    const newY = rotatedY + cy;
    const newZ = rotatedZ + cz;
    if (vector3 == true) return new Vector3(newX.toFixed(5), newY.toFixed(5), newZ.toFixed(5));
    return [newX.toFixed(5), newY.toFixed(5), newZ.toFixed(5)];
}

function rotateY(coord3D, center, angle, vector3 = false) {
    const rad = angle * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const [cx, cy, cz] = [center.x, center.y, center.z];
    const [x, y, z] = [coord3D.x, coord3D.y, coord3D.z];

    const translatedX = x - cx;
    const translatedY = y - cy;
    const translatedZ = z - cz;

    const rotatedX = translatedX * cos + translatedZ * sin;
    const rotatedZ = -translatedX * sin + translatedZ * cos;

    const newX = rotatedX + cx;
    const newY = translatedY;
    const newZ = rotatedZ + cz;
    if (vector3 == true) return new Vector3(newX.toFixed(5), newY.toFixed(5), newZ.toFixed(5));
    return [newX.toFixed(5), newY.toFixed(5), newZ.toFixed(5)];
}

function rotateZ(coord3D, center, angle, vector3 = false) {
    const rad = angle * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const [cx, cy, cz] = [center.x, center.y, center.z];
    const [x, y, z] = [coord3D.x, coord3D.y, coord3D.z];

    const translatedX = x - cx;
    const translatedY = y - cy;
    const translatedZ = z - cz;

    const rotatedX = translatedX * cos - translatedY * sin;
    const rotatedY = translatedX * sin + translatedY * cos;

    const newX = rotatedX + cx;
    const newY = rotatedY + cy;
    const newZ = translatedZ;
    if (vector3 == true) return new Vector3(newX.toFixed(5), newY.toFixed(5), newZ.toFixed(5));
    return [newX.toFixed(5), newY.toFixed(5), newZ.toFixed(5)];
}


function distanceOfVector3(point3) {
    return Math.sqrt(Math.abs(point3.x * point3.x + point3.y * point3.y + point3.z * point3.z));
}

function findPerpendicularVectors2(point3, scale3 = new Point3(1, 1, 1), invert = 1) {
    const v = { x: point3.x / scale3.x, y: point3.y / scale3.x, z: point3.z / scale3.z };

    const norm = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    const normalizedV = { x: v.x / norm, y: v.y / norm, z: v.z / norm };

    let arbitraryVector;
    if (Math.abs(normalizedV.x) < Math.abs(normalizedV.y)) {
        arbitraryVector = { x: 1 * invert, y: 0, z: 0 };
    } else {
        arbitraryVector = { x: 0, y: 1 * invert, z: 0 };
    }

    const crossProduct1 = new Vector3(
        normalizedV.y * arbitraryVector.z - normalizedV.z * arbitraryVector.y,
        normalizedV.z * arbitraryVector.x - normalizedV.x * arbitraryVector.z,
        normalizedV.x * arbitraryVector.y - normalizedV.y * arbitraryVector.x
    );

    const crossProduct2 = new Vector3(
        normalizedV.y * crossProduct1.z - normalizedV.z * crossProduct1.y,
        normalizedV.z * crossProduct1.x - normalizedV.x * crossProduct1.z,
        normalizedV.x * crossProduct1.y - normalizedV.y * crossProduct1.x
    );

    crossProduct1.z *= scale3.z;
    crossProduct2.z *= scale3.z;
    crossProduct1.y *= scale3.y;
    crossProduct2.y *= scale3.y;
    crossProduct1.x *= scale3.x;
    crossProduct2.x *= scale3.x;

    return [crossProduct1, crossProduct2];
}

function getPointFromCube3(point3, center, distance, index) {
    var point = globalTemVector3;
    if (index > distance / 2) {
        index = Math.abs(index - distance / 2);
        point.x = center.x + (index * (point3.x / distance));
        point.y = center.y + (index * (point3.y / distance));
        point.z = center.z + (index * (point3.z / distance));
    } else {
        index = Math.abs(index - distance / 2);
        point.x = center.x - (index * (point3.x / distance));
        point.y = center.y - (index * (point3.y / distance));
        point.z = center.z - (index * (point3.z / distance));
    }
    return point;
}

var getOffsetX = function (vector1, vector2, center, len1, len2) {
    var offsetX = 0;
    var invertX = 1;
    var x0 = parseInt(center.x + ((getPointFromCube3(vector2, center, len2, 0).x - center.x) + (getPointFromCube3(vector1, center, len1, 0).x - center.x)));
    var x512 = parseInt(center.x + ((getPointFromCube3(vector2, center, len2, len2 - 1).x - center.x) + (getPointFromCube3(vector1, center, len1, len1 - 1).x - center.x)));
    if (x0 >= o3dMaxLen.x) {
        offsetX = -(x0 - o3dMaxLen.x);
    }
    else if (x0 < 0) {
        if (x0 > x512) {
            invertX = -1;
        } else {
            offsetX = -x0;
        }
    }
    else if (x512 >= o3dMaxLen.x) {
        offsetX = -(x512 - o3dMaxLen.x);
    }
    else if (x512 < 0) {
        if (x0 >= 0) offsetX = -x512;
        else if (x0 < 0) invertX = -1;
    };
    return [offsetX, invertX];
}
var getOffsetY = function (vector1, vector2, center, len1, len2) {
    var offsetY = 0;
    var invertY = 1;
    var y0 = parseInt(center.y + ((getPointFromCube3(vector2, center, len2, 0).y - center.y) + (getPointFromCube3(vector1, center, len1, 0).y - center.y)));
    var y512 = parseInt(center.y + ((getPointFromCube3(vector2, center, len2, len2 - 1).y - center.y) + (getPointFromCube3(vector1, center, len1, len1 - 1).y - center.y)));

    if (y0 >= o3dMaxLen.y) {
        offsetY = -(y0 - o3dMaxLen.y);
    }
    else if (y0 < 0) {
        if (y0 > y512) {
            invertY = -1;
        } else {
            offsetY = -y0;
        }
    }
    else if (y512 >= o3dMaxLen.y) {
        offsetY = -(y512 - o3dMaxLen.y);
    }
    else if (y512 < 0) {
        if (y0 >= 0) offsetY = -y512;
        else if (y0 < 0) invertY = -1;
    };
    return [offsetY, invertY];
}
var getOffsetZ = function (vector1, vector2, center, len1, len2) {
    var offsetZ = 0;
    var invertZ = 1;
    var z0 = parseInt(center.z + ((getPointFromCube3(vector2, center, len2, 0).z - center.z) + (getPointFromCube3(vector1, center, len1, 0).z - center.z)));
    var z512 = parseInt(center.z + ((getPointFromCube3(vector2, center, len2, len2 - 1).z - center.z) + (getPointFromCube3(vector1, center, len1, len1 - 1).z - center.z)));

    if (z0 >= o3dMaxLen.z) {
        offsetZ = -(z0 - o3dMaxLen.z);
    }
    else if (z0 < 0) {
        if (z0 > z512) {
            invertZ = -1;
        } else {
            offsetZ = -z0;
        }
    }
    else if (z512 >= o3dMaxLen.z) {
        offsetZ = -(z512 - o3dMaxLen.z);
    }
    else if (z512 < 0) {
        if (z0 >= 0) offsetZ = -z512;
        else if (z0 < 0) invertZ = -1;
    };
    return [offsetZ, invertZ];
}
