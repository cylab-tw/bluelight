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



//紀錄滑鼠座標
var windowMouseX = 0,
  windowMouseY = 0;
var windowMouseX2 = 0,
  windowMouseY2 = 0;
var MousePointX = 0,
  MousePointY = 0;
var originalPoint_X = 0,
  originalPoint_Y = 0;
var originalPoint_X2 = 0,
  originalPoint_Y2 = 0;

//紀錄滑鼠座標差
var windowMouseDiffX = 0,
  windowMouseDiffY = 0;

//紀錄雙指距離
var windowTouchDistX = 0,
  windowTouchDistY = 0;

//代表目前開放使用滾輪切換影像，無論處於什麼操作模式
var openWheel = false;

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

let BlueLightMousedownList = [];
let BlueLightMousedown = function (e) {
  if (e.which == 1) MouseDownCheck = true;
  else if (e.which == 3) rightMouseDown = true;
  windowMouseDiffX = windowMouseDiffY = 0;

  MouseDownPointByWindow.setPoint(GetmouseXY(e));
  MouseDownPointByCanvas.setPoint(rotateCalculation(e));
  [windowMouseX, windowMouseY] = GetmouseXY(e);
  [originalPoint_X, originalPoint_Y] = getCurrPoint(e);
  for (var i = 0; i < BlueLightMousedownList.length; i++) {
    if (BlueLightMousedownList[i].constructor.name == "Function")
      BlueLightMousedownList[i](e);
  }
  //console.log(GetmouseXY(e), getCurrPoint(e), rotateCalculation(e));
}

let BlueLightTouchstartList = [];
let BlueLightTouchstart = function (E) {
  var e = null, e2 = null;
  if (E.touches[1]) e = E.touches[0], e2 = E.touches[1]
  else e = E.touches[0];

  if (!e2) TouchDownCheck = true;
  else rightTouchDown = true;

  [windowMouseX, windowMouseY] = GetmouseXY(e);
  [originalPoint_X, originalPoint_Y] = getCurrPoint(e);

  if (rightTouchDown == true && e2) {
    [windowMouseX2, windowMouseY2] = GetmouseXY(e2);
    [originalPoint_X2, originalPoint_Y2] = getCurrPoint(e2);
  }

  for (var i = 0; i < BlueLightTouchstartList.length; i++) {
    if (BlueLightTouchstartList[i].constructor.name == "Function")
      BlueLightTouchstartList[i](e, e2);
  }
}


let BlueLightMousemoveList = [];
let BlueLightMousemove = function (e) {
  //if (e.which == 1) MouseDownCheck = true;
  //else if (e.which == 3) rightMouseDown = true;
  let angle2point = rotateCalculation(e);
  var [MouseX, MouseY] = GetmouseXY(e);
  windowMouseDiffX = MouseX - windowMouseX;
  windowMouseDiffY = MouseY - windowMouseY;
  [windowMouseX, windowMouseY] = GetmouseXY(e);

  //[originalPoint_X, originalPoint_Y] = getCurrPoint(e);
  for (var i = 0; i < BlueLightMousemoveList.length; i++) {
    if (BlueLightMousemoveList[i].constructor.name == "Function")
      BlueLightMousemoveList[i](e);
  }

  getClass('labelXY')[viewportNumber].innerText = "X: " + parseInt(angle2point[0]) + " Y: " + parseInt(angle2point[1]);
  if (openLink == true) {
    for (var i = 0; i < Viewport_Total; i++) {
      GetViewport(i).translate.x = GetViewport().translate.x;
      GetViewport(i).translate.y = GetViewport().translate.y;
    }
  }
  putLabel();
  displayAllRuler();
}


let BlueLightTouchmoveList = [];
let BlueLightTouchmove = function (E) {
  var e = null, e2 = null;
  if (E.touches[1]) e = E.touches[0], e2 = E.touches[1]
  else e = E.touches[0];

  var [MouseX, MouseY] = GetmouseXY(e);
  windowMouseDiffX = MouseX - windowMouseX;
  windowMouseDiffY = MouseY - windowMouseY;

  if (rightTouchDown == true && e2) {
    //紀錄雙指距變化
    windowTouchDistDiffX = Math.abs(GetmouseX(e2) - GetmouseX(e)) - Math.abs(windowMouseX - windowMouseXF2);
    windowTouchDistDiffY = Math.abs(GetmouseY(e2) - GetmouseY(e)) - Math.abs(windowMouseY - windowMouseY2);
  }

  [windowMouseX, windowMouseY] = GetmouseXY(e);


  //originalPoint_X,originalPoint_Y] = getCurrPoint(e);

  if (rightTouchDown == true && e2) {
    [windowMouseX2, windowMouseY2] = GetmouseXY(e2);
    [originalPoint_X2, originalPoint_Y2] = getCurrPoint(e2);
  }

  for (var i = 0; i < BlueLightTouchmoveList.length; i++) {
    if (BlueLightTouchmoveList[i].constructor.name == "Function")
      BlueLightTouchmoveList[i](e, e2);
  }
}

let BlueLightMouseupList = [];
let BlueLightMouseup = function (e) {

  for (var i = 0; i < BlueLightMouseupList.length; i++) {
    if (BlueLightMouseupList[i].constructor.name == "Function")
      BlueLightMouseupList[i](e);
  }
  [windowMouseX, windowMouseY] = [0, 0];
  windowMouseDiffX = windowMouseDiffY = 0;
  MouseDownCheck = rightMouseDown = false;
}

let BlueLightTouchendList = [];
let BlueLightTouchend = function (E) {
  var e = null, e2 = null;
  if (E.touches[1]) e = E.touches[0], e2 = E.touches[1]
  else e = E.touches[0];

  for (var i = 0; i < BlueLightTouchendList.length; i++) {
    if (BlueLightTouchendList[i].constructor.name == "Function")
      BlueLightTouchendList[i](e, e2);
  }
  TouchDownCheck = rightTouchDown = false;
}


let AddMouseEvent = function () {
  try {
    GetViewport().div.removeEventListener("touchstart", thisF, false);
    GetViewport().div.removeEventListener("mousedown", thisF, false);
    GetViewport().div.addEventListener("contextmenu", contextmenuF, false);
    GetViewport().div.addEventListener("mousemove", BlueLightMousemove, false);
    GetViewport().div.addEventListener("mousedown", BlueLightMousedown, false);
    GetViewport().div.addEventListener("mouseup", BlueLightMouseup, false);
    GetViewport().div.addEventListener("mouseout", Mouseout, false);
    GetViewport().div.addEventListener("touchstart", BlueLightTouchstart, false);
    GetViewport().div.addEventListener("touchmove", BlueLightTouchmove, false);
    GetViewport().div.addEventListener("touchend", BlueLightTouchend, false);
    GetViewport().div.addEventListener("wheel", Wheel, false);
  } catch (ex) { console.log(ex); }
}
let DeleteMouseEvent = function () {
  try {
    for (var i = 0; i < Viewport_Total; i++) {
      GetViewport(i).div.removeEventListener("contextmenu", contextmenuF, false);
      GetViewport(i).div.removeEventListener("mousemove", BlueLightMousemove, false);
      GetViewport(i).div.removeEventListener("mousedown", BlueLightMousedown, false);
      GetViewport(i).div.removeEventListener("mouseup", BlueLightMouseup, false);
      GetViewport(i).div.removeEventListener("mouseout", Mouseout, false);
      GetViewport(i).div.removeEventListener("wheel", Wheel, false);
      GetViewport(i).div.removeEventListener("mousedown", thisF, false);
      GetViewport(i).div.removeEventListener("touchstart", BlueLightTouchstart, false);
      GetViewport(i).div.removeEventListener("touchend", BlueLightTouchend, false);
      GetViewport(i).div.removeEventListener("wheel", Wheel, false);
      GetViewport(i).div.addEventListener("touchstart", thisF, false);
      GetViewport(i).div.addEventListener("mousedown", thisF, false);
      GetViewport(i).div.addEventListener("wheel", Wheel, false);
    }
  } catch (ex) { }
}

let set_BL_model = function (string) {
  BL_mode = string;

  if (!this.init) {
    set_BL_model.onchange = function () {
      return 0;
    }
    this.init = true;
  }
  set_BL_model.onchange();
}

let ViewPortList = [];