
class ToolEvt {
    static enable = true;
    onMouseDown(event, context) { }
    onMouseMove(event, context) { }
    onMouseUp(event, context) { }
    onTouchStart(event, context) { }
    onTouchMove(event, context) { }
    onTouchEnd(event, context) { }
    onWheel(event, context) { }
    onMouseOut() { }
    onMouseEnter() { }
    onKeyDown(KeyboardKeys) { }
    onSwitch() { }
}
let toolEvt = new ToolEvt();

//表示按住了滑鼠左鍵
var MouseDownCheck = false;
//表示按住了滑鼠右鍵
var rightMouseDown = false;
//表示按住了觸控
var TouchDownCheck = false;
//表示按住了滑鼠左鍵
var rightTouchDown = false;

//紀錄滑鼠座標
var windowMouseX = 0, windowMouseY = 0;
var windowMouseX2 = 0, windowMouseY2 = 0;
var MousePointX = 0, MousePointY = 0;
var originalPoint_X = 0, originalPoint_Y = 0;
var originalPoint_X2 = 0, originalPoint_Y2 = 0;

//紀錄滑鼠座標差
var windowMouseDiffX = 0, windowMouseDiffY = 0;
//紀錄雙指距離
var windowTouchDistX = 0, windowTouchDistY = 0;

//代表按下ctrl
let KeyCode_ctrl = false;

var contextmenuF = function (e) {
    e.preventDefault();
};

var stopPropagation = function (e) {
    e.stopPropagation();
}

var DoubleClickF = function (e) {
    if (BlueLightViewPort.only1Viewport == -1) BlueLightViewPort.only1Viewport = e.currentTarget.viewportNum;
    else BlueLightViewPort.only1Viewport = -1;
    SetTable();
    window.onresize();
};

function initNewCanvas2() {
    //添加事件
    try {
        for (var i = 0; i < Viewport_Total; i++) {
            GetViewport(i).div.addEventListener("touchstart", SwitchViewport, false);
            GetViewport(i).div.addEventListener("mousedown", SwitchViewport, false);
            GetViewport(i).div.addEventListener("wheel", SwitchViewport, false);
            GetViewport(i).div.addEventListener("contextmenu", contextmenuF, false);
            GetViewport(i).div.addEventListener("mousemove", BlueLightMousemove, false);
            GetViewport(i).div.addEventListener("mousedown", BlueLightMousedown, false);
            GetViewport(i).div.addEventListener("mouseup", BlueLightMouseup, false);
            GetViewport(i).div.addEventListener("mouseout", BlueLightMouseout, false);
            GetViewport(i).div.addEventListener("mouseenter", BlueLightMouseenter, false);
            GetViewport(i).div.addEventListener("touchstart", BlueLightTouchstart, false);
            GetViewport(i).div.addEventListener("touchmove", BlueLightTouchmove, false);
            GetViewport(i).div.addEventListener("touchend", BlueLightTouchend, false);
            GetViewport(i).div.addEventListener("wheel", BlueLightWheel, false);
        }
        window.addEventListener("keydown", BlueLightKeyDown, false);
    } catch (ex) { console.log(ex); }
}

var SwitchViewport = function () {
    getByid("WindowDefault").selected = true;

    var viewportNum = viewportNumber;

    viewportNumber = isNaN(this.viewportNum) ? viewportNumber : this.viewportNum;
    if (GetViewport().Sop) leftLayout.setAccent(GetViewport().Sop.parent.SeriesInstanceUID);

    if (GetViewport().cine) getByid('playvideo').src = '../image/icon/lite/b_CinePause.png';
    else getByid('playvideo').src = '../image/icon/lite/b_CinePlay.png';

    changeMarkImg();
    if (GetViewport().Sop) GetViewport().reload();
    else {
        try {
            GetViewport().loadImgBySop(GetViewport(viewportNum).Sop);
        } catch (ex) { }
    }
    for (var z = 0; z < Viewport_Total; z++) {
        GetViewport(z).setLabel("PixelValue", "");
        GetViewport(z).refleshLabel();
    }
    refleshGUI();
}

window.addEventListener("beforeunload", () => {
    localStorage.clear();  // 清除 localStorage
    sessionStorage.clear(); // 清除 sessionStorage
});

window.addEventListener('load', function () {
    var isWindowTop = false;
    var lastTouchY = 0;
    var touchStartHandler = function (e) {
        if (e.touches.length !== 1) return;
        lastTouchY = e.touches[0].clientY;
        isWindowTop = (window.pageYOffset === 0);
    };

    var touchMoveHandler = function (e) {
        var touchY = e.touches[0].clientY;
        var touchYmove = touchY - lastTouchY;
        lastTouchY = touchY;
        if (isWindowTop) {
            isWindowTop = false;
            // 阻擋移動事件
            if (touchYmove > 0) {
                e.preventDefault();
                return;
            }
        }

    };

    document.addEventListener('touchstart', touchStartHandler, false);
    document.addEventListener('touchmove', touchMoveHandler, false);
});

let dragged = null;
onloadFunction.push2Last(function () {
    for (var elem of getClass("DicomViewport")) {
        elem.addEventListener("drop", (event) => {
            event.preventDefault();
            if (!openLeftImgClick || !dragged) return;
            viewportNumber = parseInt(event.currentTarget.viewportNum);
            PictureOnclick(dragged.QRLevel);
            dragged = null;
            refleshGUI();
        });
    }
});

class Point2D {
    constructor(x, y) { this.x = x, this.y = y; }
    get 0() { return this.x }; set 0(v) { this.x = v };
    get 1() { return this.y }; set 1(v) { this.y = v };
    set(x, y) { this.x = x, this.y = y; };
    get() { return [this.x, this.y] };
    point() { return [this.x, this.y] };
    setPoint(arr) { this.x = arr[0], this.y = arr[1]; };
}

class Size2D {
    constructor(w, h) { this.w = w, this.h = h; }
    get 0() { return this.w }; set 0(v) { this.w = v };
    get 1() { return this.h }; set 1(v) { this.h = v };
    set(w, h) { this.w = w, this.h = h; };
    get() { return [this.w, this.h] };
    setSize(arr) { this.w = arr[0], this.h = arr[1]; };
}

class Point3D {
    constructor(x, y, z) { this.x = x, this.y = y, this.z = z; }
    get 0() { return this.x }; set 0(v) { this.x = v };
    get 1() { return this.y }; set 1(v) { this.y = v };
    get 2() { return this.z }; set 2(v) { this.z = v };
    set(x, y, z) { this.x = x, this.y = y, this.z = z; };
    get() { return [this.x, this.y, , this.z] };
    point() { return [this.x, this.y, this.z] };
    setPoint(arr) { this.x = arr[0], this.y = arr[1], this.z = arr[2]; };
}

let MouseDownPointByWindow = new Point2D(0, 0);
let MouseMovePointByWindow = new Point2D(0, 0);
let MouseUpPointByWindow = new Point2D(0, 0);
let MouseDownPointByCanvas = new Point2D(0, 0);
let MouseMovePointByCanvas = new Point2D(0, 0);
let MouseUpPointByCanvas = new Point2D(0, 0);

let BlueLightKeyDown = function (e) {
    if (!ToolEvt.enable) return;
    const target = e.target;
    const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

    //如果正在輸入文字
    if (isTyping) return;

    //////////////////////////////////
    if (e.key.toLowerCase() === 'm') getByid("openMeasureImg").onclick();
    if (getByid("openMeasureDIv").style.display != "none") {
        if (e.key.toLowerCase() === 'l') getByid("MeasureRuler").onclick();
        else if (e.key.toLowerCase() === 'a') getByid("AngleRuler").onclick();
        else if (e.key.toLowerCase() === 't') getByid("TextAnnotation").onclick();
    }
    //////////////////////////////////
    var nextInstanceNumber = 0;
    if (e.keyCode == '38') nextInstanceNumber = -1;
    else if (e.keyCode == '40') nextInstanceNumber = 1;
    else if (e.keyCode == '37') nextInstanceNumber = -1;
    else if (e.keyCode == '39') nextInstanceNumber = 1;

    if (GetViewport() && nextInstanceNumber == -1) GetViewport().nextFrame(true);
    else if (GetViewport() && nextInstanceNumber == 1) GetViewport().nextFrame(false);
    /////////////////////////////////

    //esc
    if (e.key.toLowerCase() === 'escape') getByid("MouseOperation").onclick();

    toolEvt.onKeyDown(e);
}

let BlueLightMouseout = function () {
    if (!ToolEvt.enable) return;
    for (var z = 0; z < Viewport_Total; z++) {
        GetViewport(z).setLabel("PixelValue", "");
        GetViewport(z).refleshLabel();
    }
    toolEvt.onMouseOut();
}

let BlueLightMouseenter = function () {
    if (!ToolEvt.enable) return;
    toolEvt.onMouseEnter(this.viewportNum);
}

function BlueLightWheel(e) {
    if (!ToolEvt.enable) return;
    if (viewportNumber != this.viewportNum) return;
    if (getByid("DICOMTagsSelect").selected) return;

    if (openLink == false) {
        if (e.deltaY < 0) GetViewport().nextFrame(true);
        else GetViewport().nextFrame(false);
    }
    else {
        for (var z = 0; z < Viewport_Total; z++) {
            if (e.deltaY < 0) GetViewport(z).nextFrame(true);
            else GetViewport(z).nextFrame(false);
        }
    }
    toolEvt.onWheel(e);
}

let BlueLightMousedown = function (e) {
    if (!ToolEvt.enable) return;

    if (e.which == 1) MouseDownCheck = true;
    else if (e.which == 3) rightMouseDown = true;

    windowMouseDiffX = windowMouseDiffY = 0;
    MouseDownPointByWindow.setPoint(GetmouseXY(e));
    MouseDownPointByCanvas.setPoint(rotateCalculation(e));

    [windowMouseX, windowMouseY] = GetmouseXY(e);
    [originalPoint_X, originalPoint_Y] = getCurrPoint(e);

    toolEvt.onMouseDown(e);
}

let BlueLightTouchstart = function (E) {
    if (!ToolEvt.enable) return;
    var e = E.touches[0], e2 = E.touches[1] ? E.touches[1] : null;

    if (!e2) TouchDownCheck = true;
    else rightTouchDown = true;

    [windowMouseX, windowMouseY] = GetmouseXY(e);
    [originalPoint_X, originalPoint_Y] = getCurrPoint(e);

    if (rightTouchDown == true && e2) {
        [windowMouseX2, windowMouseY2] = GetmouseXY(e2);
        [originalPoint_X2, originalPoint_Y2] = getCurrPoint(e2);
    }

    toolEvt.onTouchStart(e);
}

let BlueLightMousemove = function (e) {
    if (!ToolEvt.enable) return;
    if (viewportNumber != this.viewportNum) return;
    let angle2point = rotateCalculation(e);
    var [MouseX, MouseY] = GetmouseXY(e);
    windowMouseDiffX = MouseX - windowMouseX;
    windowMouseDiffY = MouseY - windowMouseY;
    [windowMouseX, windowMouseY] = GetmouseXY(e);

    toolEvt.onMouseMove(e);

    if (isNaN(angle2point[0]) || isNaN(angle2point[1])) GetViewport().setLabel("PixelValue", "");
    else GetViewport().setLabel("PixelValue", GetPixel(angle2point) + `  (${parseInt(angle2point[0])},${parseInt(angle2point[1])})`);
    GetViewport().refleshLabel();

    if (openLink == true) {
        for (var i = 0; i < Viewport_Total; i++) {
            GetViewport(i).translate.x = GetViewport().translate.x;
            GetViewport(i).translate.y = GetViewport().translate.y;
        }
    }

    displayAllRuler();
}

let BlueLightTouchmove = function (E) {
    if (!ToolEvt.enable) return;
    var e = E.touches[0], e2 = E.touches[1] ? E.touches[1] : null;

    var [MouseX, MouseY] = GetmouseXY(e);
    [windowMouseDiffX, windowMouseDiffY] = [MouseX - windowMouseX, MouseY - windowMouseY];

    if (rightTouchDown == true && e2) {
        //紀錄雙指距變化
        windowTouchDistDiffX = Math.abs(GetmouseX(e2) - GetmouseX(e)) - Math.abs(windowMouseX - windowMouseXF2);
        windowTouchDistDiffY = Math.abs(GetmouseY(e2) - GetmouseY(e)) - Math.abs(windowMouseY - windowMouseY2);
    }

    [windowMouseX, windowMouseY] = GetmouseXY(e);

    if (rightTouchDown == true && e2) {
        [windowMouseX2, windowMouseY2] = GetmouseXY(e2);
        [originalPoint_X2, originalPoint_Y2] = getCurrPoint(e2);
    }

    toolEvt.onTouchMove(e);
}

let BlueLightMouseup = function (e) {
    if (!ToolEvt.enable) return;
    toolEvt.onMouseUp(e);
    windowMouseX = windowMouseY = windowMouseDiffX = windowMouseDiffY = 0;
    MouseDownCheck = rightMouseDown = false;
}

let BlueLightTouchend = function (E) {
    if (!ToolEvt.enable) return;
    var e = E.touches[0], e2 = E.touches[1] ? E.touches[1] : null;
    toolEvt.onTouchEnd(e);
    TouchDownCheck = rightTouchDown = false;
}