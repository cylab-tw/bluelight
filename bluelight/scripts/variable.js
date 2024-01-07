//Viewport的總數量
const Viewport_Total = 16;
//Viewport的及時數量
let Viewport_row = 1;
let Viewport_col = 1;

//當前選擇的Viewport的canvas
//var canvas;
//var ctx;

//表示按住了滑鼠左鍵
var MouseDownCheck = false;
//表示按住了滑鼠右鍵
var rightMouseDown = false;
//表示按住了觸控
var TouchDownCheck = false;
//表示按住了滑鼠左鍵
var rightTouchDown = false;

//表示現在為開放用拖曳切換影像
var openChangeFile = false;
//表示按下WindowLevel調整
var openWindow = false;
//表示現在開啟放大鏡功能
var openZoom = false;
//表示Viewport為連接狀態
var openLink = false;
//表示左側的影像可以點擊
var openLeftImgClick = true;

//暫時移除的功能
var openPenDraw = false;
//表示目前正在使用量角器工具
var openAngle = 0;
//表示目前icon圖示的RWD收合功能為開啟狀態
var openRWD = true;

//紀錄滑鼠座標
var windowMouseX = 0,
  windowMouseY = 0;
var windowMouseX2 = 0,
  windowMouseY2 = 0;
var MousePointX = 0,
  MousePointY = 0;

//放大鏡預設長寬
var magnifierWidth0 = 200;
var magnifierHeight0 = 200;
//放大鏡設定長寬
var magnifierWidth = 200;
var magnifierHeight = 200;
//代表目前處於基本操作狀態
var openMouseTool = false;
//代表目前開放使用滾輪切換影像，無論處於什麼操作模式
var openWheel = false;
//代表病患資訊顯示狀態
var openAnnotation = true;
//代表正在使用測量工具
var openMeasure = false;
//代表正在使用旋轉工具
var openRotate = false;

//代表目前從左側面板拖曳中的影像的Series UID
var dragseries = "";
//代表原始影像，通常被用於放大鏡的參考
var originalCanvas;
var originalCtx;
//代表左側有幾個Study --*
var leftCanvasStudy = [];
//目前選取的Viewport是第幾個Viewport
var viewportNumber = 0;
//播放動畫用的計時器
var PlayTimer1 = [];

var openDisplayMarkup = false;
//數著這個Series有幾張影像
var SeriesCount = 0;

//邊框寬度
var bordersize = 5;
//label距離邊緣多遠
var labelPadding = 3;
var leftLabelPadding = labelPadding;
var rightLabelPadding = labelPadding;
var topLabelPadding = labelPadding;
var bottomLabelPadding = labelPadding;
//代表目前載入了多少次DICOM --*
var dicomImageCount = 0;

//代表現在視窗大小受到改變，須執行RWD
//var NowResize = false;
//裝DICOM階層樣式表等資訊的物件
//var Patient = {};
//
var getPatientbyImageID = {};
//裝標記的物件
var PatientMark = [];
//裝DICOM Tags設定檔的物件
var DicomTags = {};
//裝伺服器設定檔的物件
var ConfigLog = {};
//代表config檔已經載入完畢 --*
var configOnload = false;
//decode function
let decodeImageFrame;
//代表按下ctrl
let KeyCode_ctrl = false;
let BL_mode = 'MouseTool';

class Point2D {
  constructor(x, y) { this.x = x, this.y = y; }
  get 0() { return this.x }; set 0(v) { this.x = v };
  get 1() { return this.y }; set 1(v) { this.y = v };
  set(x, y) { this.x = x, this.y = y; };
  get() { return [this.x, this.y] };
  point() { return [this.x, this.y] };
  setPoint(arr) { this.x = arr[0], this.y = arr[1]; };
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

let BlueLightMousedownList = [];
let BlueLightMousedown = function (e) {
  if (e.which == 1) MouseDownCheck = true;
  else if (e.which == 3) rightMouseDown = true;

  MouseDownPointByWindow.setPoint(GetmouseXY(e));
  MouseDownPointByCanvas.setPoint(rotateCalculation(e));
  [windowMouseX, windowMouseY] = GetmouseXY(e);
  [GetViewport().originalPointX, GetViewport().originalPointY] = getCurrPoint(e);
  for (var i = 0; i < BlueLightMousedownList.length; i++) {
    if (BlueLightMousedownList[i].constructor.name == "Function")
      BlueLightMousedownList[i](e);
  }
  //console.log(GetmouseXY(e), getCurrPoint(e), rotateCalculation(e));
}


let BlueLightTouchstartList = [];
let BlueLightTouchstart = function (E) {
  var e = null, e2 = null, viewport = GetViewport();
  if (E.touches[1]) e = E.touches[0], e2 = E.touches[1]
  else e = E.touches[0];

  if (!e2) TouchDownCheck = true;
  else rightTouchDown = true;

  [windowMouseX, windowMouseY] = GetmouseXY(e);
  [viewport.originalPointX, viewport.originalPointY] = getCurrPoint(e);

  if (rightTouchDown == true && e2) {
    [windowMouseX2, windowMouseY2] = GetmouseXY(e2);
    [viewport.originalPointX2, viewport.originalPointY2] = getCurrPoint(e2);
  }

  for (var i = 0; i < BlueLightTouchstartList.length; i++) {
    if (BlueLightTouchstartList[i].constructor.name == "Function")
      BlueLightTouchstartList[i](e, e2);
  }
}


let BlueLightMousemoveList = [];
let BlueLightMousemove = function (e) {
  if (e.which == 1) MouseDownCheck = true;
  else if (e.which == 3) rightMouseDown = true;
  [windowMouseX, windowMouseY] = GetmouseXY(e);

  [GetViewport().originalPointX, GetViewport().originalPointY] = getCurrPoint(e);
  for (var i = 0; i < BlueLightMousedownList.length; i++) {
    if (BlueLightMousedownList[i].constructor.name == "Function")
      BlueLightMousedownList[i](e);
  }

  getClass('labelXY')[viewportNumber].innerText = "X: " + parseInt(angle2point[0]) + " Y: " + parseInt(angle2point[1]);
  if (openLink == true) {
    for (var i = 0; i < Viewport_Total; i++) {
      GetViewport(i).newMousePointX = GetViewport().newMousePointX;
      GetViewport(i).newMousePointY = GetViewport().newMousePointY;
    }
  }
  putLabel();
  displayAllRuler();
}


let AddMouseEvent = function () {
  try {
    GetNewViewport().div.removeEventListener("touchstart", thisF, false);
    GetNewViewport().div.removeEventListener("mousedown", thisF, false);
    GetNewViewport().div.addEventListener("contextmenu", contextmenuF, false);
    GetNewViewport().div.addEventListener("mousemove", Mousemove, false);
    GetNewViewport().div.addEventListener("mousedown", BlueLightMousedown, false);
    GetNewViewport().div.addEventListener("mouseup", Mouseup, false);
    GetNewViewport().div.addEventListener("mouseout", Mouseout, false);
    GetNewViewport().div.addEventListener("touchstart", BlueLightTouchstart, false);
    GetNewViewport().div.addEventListener("touchmove", touchmoveF, false);
    GetNewViewport().div.addEventListener("touchend", touchendF, false);
    GetNewViewport().div.addEventListener("wheel", Wheel, false);
  } catch (ex) { console.log(ex); }
}
let DeleteMouseEvent = function () {
  try {
    for (var i = 0; i < Viewport_Total; i++) {
      GetNewViewport(i).div.removeEventListener("contextmenu", contextmenuF, false);
      GetNewViewport(i).div.removeEventListener("mousemove", Mousemove, false);
      GetNewViewport(i).div.removeEventListener("mousedown", BlueLightMousedown, false);
      GetNewViewport(i).div.removeEventListener("mouseup", Mouseup, false);
      GetNewViewport(i).div.removeEventListener("mouseout", Mouseout, false);
      GetNewViewport(i).div.removeEventListener("wheel", Wheel, false);
      GetNewViewport(i).div.removeEventListener("mousedown", thisF, false);
      GetNewViewport(i).div.removeEventListener("touchstart", BlueLightTouchstart, false);
      GetNewViewport(i).div.removeEventListener("touchend", touchendF, false);
      GetNewViewport(i).div.removeEventListener("wheel", Wheel, false);
      GetNewViewport(i).div.addEventListener("touchstart", thisF, false);
      GetNewViewport(i).div.addEventListener("mousedown", thisF, false);
      GetNewViewport(i).div.addEventListener("wheel", Wheel, false);
    }
  } catch (ex) { }
}

let set_BL_model = function (string) {
  BL_mode = string;

  if (!this.init) {
    set_BL_model.onchange1 = function () {
      return 0;
    }
    this.init = true;
  }
  set_BL_model.onchange1();
}

let ViewPortList = [];