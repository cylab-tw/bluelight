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
var contextmenuF = function (e) {
    e.preventDefault();
};

var touchstartF = function (e) {
    if (e.touches[1]) Touchstart(e.touches[0], e.touches[1]);
    else Touchstart(e.touches[0]);
};
var touchendF = function (e) {
    if (e.touches[1]) Touchend(e.touches[0], e.touches[1]);
    else Touchend(e.touches[0]);
};
var touchmoveF = function (e) {
    if (e.touches[1]) Touchmove(e.touches[0], e.touches[1]);
    else Touchmove(e.touches[0]);
};
var thisF = function () {
    if (openVR == true || openMPR == true || openWriteXML == true) return;
    getByid("WindowDefault").selected = true;
    for (var i = 0; i < Viewport_Total; i++) {
        if ("MyDicomDiv" + (i) == "" + this.id) {
            var viewportNum = viewportNumber;
            MeasureXY[0] = MeasureXY[1] = MeasureXY2[0] = MeasureXY2[1] = 0;
            viewportNumber = i;
            if (GetViewport().openPlay == false) {
                getByid('playvideo').src = '../image/icon/black/b_CinePlay.png';
            } else {
                getByid('playvideo').src = '../image/icon/black/b_CinePause.png';
            }
            changeMarkImg();
            var alt = GetViewport().alt;
            var uid = SearchUid2Json(alt);
            NowResize = true;
            //NowCanvasSizeWidth = NowCanvasSizeHeight = null;
            if (uid)
                loadAndViewImage(Patient.Study[uid.studyuid].Series[uid.sreiesuid].Sop[uid.sopuid].imageId /*, null, null, viewportNumber*/);
            else {
                alt = GetViewport(viewportNum).alt;
                uid = SearchUid2Json(alt);
                try {
                    loadAndViewImage(Patient.Study[uid.studyuid].Series[uid.sreiesuid].Sop[uid.sopuid].imageId /*, null, null, viewportNumber*/);
                } catch (ex) { }
            }
            break;
        }
    }
}
var mousedownFocus3D = function (event) {
    if (openCave == false) return;
    MouseDownCheck = true;
    var canvasC = getByid("3DDiv" + 0).canvas();
    var proportion = (parseFloat(canvasC.style.height) / parseFloat(GetViewport().imageHeight));
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
    var num = (parseFloat(canvasC.style.height) / parseFloat(GetViewport().imageHeight));
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
                canvas2.style.margin = "" + ((getByid("3DDiv2_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().imageHeight)))) +
                    "px 0 0 -" + (parseInt(canvas2.style.width) / 2) + "px";
            }
            for (var ll = 0; ll < o3d_3degree; ll++) {
                var canvas3 = getByid("3DDiv3_" + ll).canvas();
                canvas3.style.margin = "" + "-" + (parseInt(canvas3.style.height) / 2) +
                    "px 0 0 " + ((getByid("3DDiv3_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().imageHeight)))) + "px";
            }
            var VrDistance = get3dDistance();
        }
        
        if (MouseDownCheck == true) {
            if (currX < GetViewport().originalPointX - rotateStep) {
                degerrX += (GetViewport().originalPointX - currX) > rotateSpeed ? rotateSpeed * -1 : (GetViewport().originalPointX - currX) * -1;
                if (degerrX < 0) degerrX += 360;
                if (degerrX > 360) degerrX -= 360;
                if (degerrX == 90 || degerrX == 270) degerrX += 1;
            } else if (currX > GetViewport().originalPointX + rotateStep) {
                degerrX -= (currX - GetViewport().originalPointX) > rotateSpeed ? rotateSpeed * -1 : (currX - GetViewport().originalPointX) * -1;
                if (degerrX < 0) degerrX += 360;
                if (degerrX > 360) degerrX -= 360;
                if (degerrX == 90 || degerrX == 270) degerrX -= 1;
            }
            if (currY > GetViewport().originalPointY + rotateStep) {
                if (degerrX >= 90 && degerrX <= 270) {
                    degerrY -= (GetViewport().originalPointY - currY) < rotateSpeed ? rotateSpeed * -1 : (GetViewport().originalPointY - currY) * -1;
                    if (degerrY < 0) degerrY += 360;
                    if (degerrY > 360) degerrY -= 360;
                    if (degerrY == 90 || degerrY == 270) degerrY -= 1;
                } else {
                    degerrY += (currY - GetViewport().originalPointY) > rotateSpeed ? rotateSpeed * -1 : (currY - GetViewport().originalPointY) * -1;
                    if (degerrY < 0) degerrY += 360;
                    if (degerrY > 360) degerrY -= 360;
                    if (degerrY == 90 || degerrY == 270) degerrY += 1;
                }
            } else if (currY < GetViewport().originalPointY - rotateStep) {
                if (degerrX >= 90 && degerrX <= 270) {
                    degerrY += (GetViewport().originalPointY - currY) > rotateSpeed ? rotateSpeed * -1 : (GetViewport().originalPointY - currY) * -1;
                    if (degerrY < 0) degerrY += 360;
                    if (degerrY > 360) degerrY -= 360;
                    if (degerrY == 90 || degerrY == 270) degerrY += 1;
                } else {
                    degerrY -= (currY - GetViewport().originalPointY) < rotateSpeed ? rotateSpeed * -1 : (currY - GetViewport().originalPointY) * -1;
                    if (degerrY < 0) degerrY += 360;
                    if (degerrY > 360) degerrY -= 360;
                    if (degerrY == 90 || degerrY == 270) degerrY += 1;
                }
            }
            rotate3dVR(VrDistance);
        }

        if (rightMouseDown == true) {
            if (currY > GetViewport().originalPointY + 3) {
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
                    canvas2.style.margin = "" + ((getByid("3DDiv2_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().imageHeight)))) +
                        "px 0 0 -" + (parseInt(canvas2.style.width) / 2) + "px";
                }
                for (var ll = 0; ll < o3d_3degree; ll++) {
                    var canvas3 = getByid("3DDiv3_" + ll).canvas();
                    canvas3.style.width = (parseFloat(canvas3.originWidth) * zoomRatio3D) + "px";
                    canvas3.style.height = (parseFloat(canvas3.originHeight) * zoomRatio3D) + "px";
                    canvas3.style.margin = "" + "-" + (parseInt(canvas3.style.height) / 2) +
                        "px 0 0 " + ((getByid("3DDiv3_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().imageHeight)))) + "px";
                }

            } else if (currY < GetViewport().originalPointY - 3) {
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
                    canvas2.style.margin = "" + ((getByid("3DDiv2_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().imageHeight)))) +
                        "px 0 0 -" + (parseInt(canvas2.style.width) / 2) + "px";
                }
                for (var ll = 0; ll < o3d_3degree; ll++) {
                    var canvas3 = getByid("3DDiv3_" + ll).canvas();
                    canvas3.style.width = (parseFloat(canvas3.originWidth) * zoomRatio3D) + "px";
                    canvas3.style.height = (parseFloat(canvas3.originHeight) * zoomRatio3D) + "px";
                    canvas3.style.margin = "" + "-" + (parseInt(canvas3.style.height) / 2) +
                        "px 0 0 " + ((getByid("3DDiv3_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().imageHeight)))) + "px";
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
                }
            }
            for (var ll = 0; ll < o3d_3degree; ll++) {
                var canvas3 = getByid("3DDiv3_" + ll).canvas();
                var div3 = getByid("3DDiv3_" + ll);
                canvas3.style.transform = "translate3d(0,0,0)  rotateY(" + (90 + 0) + "deg)";
                if (getByid("o3DMip").selected == true && openVR) {
                    div3.style.mixBlendMode = "lighten";
                }
            }
            GetViewport().originalPointX = currX;
            GetViewport().originalPointY = currY;
        }
    }
};

var mousedown3D = function (e) {
    if (getByid("3dStrengthenAuto").selected == true) {
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
    GetViewport().originalPointX = get3dCurrPoint(e)[0];
    GetViewport().originalPointY = get3dCurrPoint(e)[1];
}
var mouseup3D = function (e) {
    if (openCave == true) return;
    MouseDownCheck = false;
    rightMouseDown = false;

    if (getByid("3dStrengthenAuto").selected == true) {
        if (getByid("OutSide3dDiv") && !openMPR) {
            getByid("OutSide3dDiv").style.transformStyle = "preserve-3d";
        }
    }
};
var touchstart3D = function (e) {
    if (getByid("3dStrengthenAuto").selected == true) {
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
    GetViewport().originalPointX = get3dCurrPoint(e)[0];
    GetViewport().originalPointY = get3dCurrPoint(e)[1];
}
var touchend3D = function (e, e2) {
    TouchDownCheck = false;
    rightTouchDown = false;

    if (getByid("3dStrengthenAuto").selected == true) {
        if (getByid("OutSide3dDiv") && !openMPR) {
            getByid("OutSide3dDiv").style.transformStyle = "preserve-3d";
        }
    }
};

var Touchmove3D = function (e, e2) {
    if (openCave == true) return;
    if (openVR == true || openMPR == true) {
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
            canvas2.style.margin = "" + ((getByid("3DDiv2_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().imageHeight)))) +
                "px 0 0 -" + (parseInt(canvas2.style.width) / 2) + "px";
        }
        for (var ll = 0; ll < o3d_3degree; ll++) {
            var canvas3 = getByid("3DDiv3_" + ll).canvas();
            canvas3.style.margin = "" + "-" + (parseInt(canvas3.style.height) / 2) +
                "px 0 0 " + ((getByid("3DDiv3_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().imageHeight)))) + "px";
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
                    "margin:" + "" + ((getByid("3DDiv2_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().imageHeight)))) +
                    "px 0 0 -" + (parseInt(canvas2.style.width) / 2) + "px;" +
                    "width:" + canvas2.style.width + ";height:" +
                    canvas2.style.height + ";";
            }
            for (var ll = 0; ll < o3d_3degree; ll++) {
                var canvas3 = getByid("3DDiv3_" + ll).canvas();
                canvas3.style = "position: absolute;top: 50%;left:50%;" +
                    "margin:" + "-" + (parseInt(canvas3.style.height) / 2) +
                    "px 0 0 " + ((getByid("3DDiv3_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().imageHeight)))) + "px;" +
                    "height:" + canvas3.style.height + ";width:" +
                    canvas3.style.width +
                    ";";
            }
        }
        var currX = get3dCurrPoint(e)[0];
        var currY = get3dCurrPoint(e)[1];
        var VrDistance = get3dDistance();

        if (TouchDownCheck == true && !rightTouchDown) {
            if (currX < GetViewport().originalPointX - rotateStep) {
                degerrX += (GetViewport().originalPointX - currX) > rotateSpeed ? rotateSpeed * -1 : (GetViewport().originalPointX - currX) * -1;
                if (degerrX < 0) degerrX += 360;
                if (degerrX > 360) degerrX -= 360;
                if (degerrX == 90 || degerrX == 270) degerrX += 1;
            } else if (currX > GetViewport().originalPointX + rotateStep) {
                degerrX -= (currX - GetViewport().originalPointX) > rotateSpeed ? rotateSpeed * -1 : (currX - GetViewport().originalPointX) * -1;
                if (degerrX < 0) degerrX += 360;
                if (degerrX > 360) degerrX -= 360;
                if (degerrX == 90 || degerrX == 270) degerrX -= 1;
            }
            if (currY > GetViewport().originalPointY + rotateStep) {
                if (degerrX >= 90 && degerrX <= 270) {
                    degerrY -= (GetViewport().originalPointY - currY) < rotateSpeed ? rotateSpeed * -1 : (GetViewport().originalPointY - currY) * -1;
                    if (degerrY < 0) degerrY += 360;
                    if (degerrY > 360) degerrY -= 360;
                    if (degerrY == 90 || degerrY == 270) degerrY -= 1;
                } else {
                    degerrY += (currY - GetViewport().originalPointY) < rotateSpeed ? rotateSpeed * -1 : (currY - GetViewport().originalPointY) * -1;
                    if (degerrY < 0) degerrY += 360;
                    if (degerrY > 360) degerrY -= 360;
                    if (degerrY == 90 || degerrY == 270) degerrY += 1;
                }
            } else if (currY < GetViewport().originalPointY - rotateStep) {
                if (degerrX >= 90 && degerrX <= 270) {
                    degerrY += (GetViewport().originalPointY - currY) > rotateSpeed ? rotateSpeed * -1 : (GetViewport().originalPointY - currY) * -1;
                    if (degerrY < 0) degerrY += 360;
                    if (degerrY > 360) degerrY -= 360;
                    if (degerrY == 90 || degerrY == 270) degerrY += 1;
                } else {
                    degerrY += (currY - GetViewport().originalPointY) > rotateSpeed ? rotateSpeed * -1 : (currY - GetViewport().originalPointY) * -1;
                    if (degerrY < 0) degerrY += 360;
                    if (degerrY > 360) degerrY -= 360;
                    if (degerrY == 90 || degerrY == 270) degerrY += 1;
                }
            }
            rotate3dVR(VrDistance);
        }

        if (rightTouchDown == true) {
            if (currY > GetViewport().originalPointY + 3) {
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
                    canvas2.style.margin = "" + ((getByid("3DDiv2_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().imageHeight)))) +
                        "px 0 0 -" + (parseInt(canvas2.style.width) / 2) + "px";
                }
                for (var ll = 0; ll < o3d_3degree; ll++) {
                    var canvas3 = getByid("3DDiv3_" + ll).canvas();
                    canvas3.style.width = (parseFloat(canvas3.originWidth) * zoomRatio3D) + "px";
                    canvas3.style.height = (parseFloat(canvas3.originHeight) * zoomRatio3D) + "px";
                    canvas3.style.margin = "" + "-" + (parseInt(canvas3.style.height) / 2) +
                        "px 0 0 " + ((getByid("3DDiv3_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().imageHeight)))) + "px";
                }

            } else if (currY < GetViewport().originalPointY - 3) {
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
                    canvas2.style.margin = "" + ((getByid("3DDiv2_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().imageHeight)))) +
                        "px 0 0 -" + (parseInt(canvas2.style.width) / 2) + "px";
                }
                for (var ll = 0; ll < o3d_3degree; ll++) {
                    var canvas3 = getByid("3DDiv3_" + ll).canvas();
                    canvas3.style.width = (parseFloat(canvas3.originWidth) * zoomRatio3D) + "px";
                    canvas3.style.height = (parseFloat(canvas3.originHeight) * zoomRatio3D) + "px";
                    canvas3.style.margin = "" + "-" + (parseInt(canvas3.style.height) / 2) +
                        "px 0 0 " + ((getByid("3DDiv3_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().imageHeight)))) + "px";
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
                }
            }
            for (var ll = 0; ll < o3d_3degree; ll++) {
                var canvas3 = getByid("3DDiv3_" + ll).canvas();
                var div3 = getByid("3DDiv3_" + ll);
                canvas3.style.transform = "rotateY(" + (90 + 0) + "deg)";
                if (getByid("o3DMip").selected == true && openVR) {
                    div3.style.mixBlendMode = "lighten";
                }
            }
            GetViewport().originalPointX = currX;
            GetViewport().originalPointY = currY;
        }
    }
}

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

function Wheel(e) {
    if (openDisplayMarkup && (getByid("DICOMTagsSelect").selected || getByid("AIMSelect").selected)) return;
    //if (openPenDraw == true) return;
    var nextInstanceNumber = 0;
    getByid("MeasureLabel").style.display = "none";
    var break1 = false;
    var viewportNum = viewportNumber;
    for (var z = 0; z < Viewport_Total; z++) {
        var break1 = false;
        if (openLink == true)
            viewportNum = z;
        if (openWriteSEG == true || openWriteRTSS == true || openVR == true || openMPR == true || openMouseTool == true || openChangeFile == true || openWindow == true || openZoom == true || openMeasure == true) {
            var currX1 = (e.pageX - canvas.getBoundingClientRect().left - GetViewport().newMousePointX - 100) * (GetViewport().imageWidth / parseInt(canvas.style.width));
            var currY1 = (e.pageY - canvas.getBoundingClientRect().top - GetViewport().newMousePointY - 100) * (GetViewport().imageHeight / parseInt(canvas.style.height));
            var alt = GetViewport(viewportNum).alt;
            let index = SearchUid2Index(alt);
            if (!index) continue;
            let i = index[0],
                j = index[1],
                k = index[2];
            var Onum = parseInt(Patient.Study[i].Series[j].Sop[k].InstanceNumber);
            var list = sortInstance(alt);
            if (e.deltaY < 0) {
                for (var l = 0; l < list.length; l++) {
                    if (break1 == true) break;
                    if (list[l].InstanceNumber == Onum) {
                        if (l - 1 < 0) {
                            loadAndViewImage(list[list.length - 1].imageId, currX1, currY1, viewportNum);
                            nextInstanceNumber = list.length - 1;
                            break1 = true;
                            break;
                        }
                        loadAndViewImage(list[l - 1].imageId, currX1, currY1, viewportNum);
                        nextInstanceNumber = l - 1;
                        break1 = true;
                        break;
                    }
                }
            } else {
                for (var l = 0; l < list.length; l++) {
                    if (break1 == true) break;
                    if (list[l].InstanceNumber == Onum) {
                        if (l + 1 >= list.length) {
                            loadAndViewImage(list[0].imageId, currX1, currY1, viewportNum);
                            nextInstanceNumber = 0;
                            break1 = true;
                            break;
                        }
                        loadAndViewImage(list[l + 1].imageId, currX1, currY1, viewportNum);
                        nextInstanceNumber = l + 1;
                        break1 = true;
                        break;
                    }
                }
            }
        }
        if (openLink == false)
            break;
    }
    if (openMPR == true) {
        Anatomical_Section(nextInstanceNumber);
        Anatomical_Section2(nextInstanceNumber);
    }
}
Anatomical_SectionMouseMouseup0 = function (e) {
    var currX = getCurrPoint(e)[0];
    var currY = getCurrPoint(e)[1];
    MouseDownCheck = false;
    rightMouseDown = false;
}
Anatomical_SectionMouseMove0 = function (e) {
    if (openMPR == true && openWindow != true && openChangeFile != true) {
        if (MouseDownCheck == true) {
            // viewportNumber = 0;
            let angel2point = rotateCalculation(e);
            currX11M = angel2point[1];
            currY11M = angel2point[0];
            o3DPointX = currX11M;
            o3DPointY = currY11M;
            AngelXY1 = [currX11M, 0];
            AngelXY0 = [currX11M, GetViewport(0).imageHeight];
            if (openMPR == true) {
                var alt = GetViewport().alt;
                var index = SearchUid2Index(alt);
                var i = index[0],
                    j = index[1],
                    k = index[2];
                var Onum = parseInt(Patient.Study[i].Series[j].Sop[k].InstanceNumber);
                // Anatomical_Section(1);
                Anatomical_Section2(Onum);
            }
            //console.log(currX11M, currY11M);
            //  display3DLine(currX11M, 0, currX11M, GetViewport(0).imageHeight, "rgb(38,140,191)");
            display3DLine(0, currY11M, GetViewport().imageWidth, currY11M, "rgb(221,53,119)");
        }
    }
}
Anatomical_SectionMouseDown0 = function (e) {
    if (e.which == 1) MouseDownCheck = true;
    else if (e.which == 3) rightMouseDown = true;
    windowMouseX = GetmouseX(e);
    windowMouseY = GetmouseY(e);
    GetViewport().originalPointX = getCurrPoint(e)[0];
    GetViewport().originalPointY = getCurrPoint(e)[1];
};

Anatomical_SectionMouseMouseup = function (e) {
    var currX = getCurrPoint(e)[0];
    var currY = getCurrPoint(e)[1];
    MouseDownCheck = false;
    rightMouseDown = false;
}
Anatomical_SectionMouseMove = function (e) {
    if (openMPR == true && openWindow != true && openChangeFile != true) {
        if (MouseDownCheck == true) {
            // viewportNumber = 0;
            let angel2point = rotateCalculation(e);
            currX11M = angel2point[0];
            currY11M = angel2point[1];
            o3DPointX = currX11M;
            o3DPointY = currY11M;
            AngelXY0 = [currX11M, 0];
            AngelXY1 = [currX11M, GetViewport(1).imageHeight];
            if (openMPR == true) {
                var alt = GetViewport().alt;
                var index = SearchUid2Index(alt);
                var i = index[0],
                    j = index[1],
                    k = index[2];
                var Onum = parseInt(Patient.Study[i].Series[j].Sop[k].InstanceNumber);
                Anatomical_Section(Onum, true);
                // Anatomical_Section2(1);
            }
            //console.log(currX11M, currY11M);
            display3DLine(currX11M, 0, currX11M, GetViewport().imageHeight, "rgb(38,140,191)");
            //  display3DLine(0, currY11M, GetViewport(0).imageWidth, currY11M, "rgb(221,53,119)");
        }
    }
}
Anatomical_SectionMouseDown = function (e) {
    if (e.which == 1) MouseDownCheck = true;
    else if (e.which == 3) rightMouseDown = true;
    windowMouseX = GetmouseX(e);
    windowMouseY = GetmouseY(e);
    GetViewport().originalPointX = getCurrPoint(e)[0];
    GetViewport().originalPointY = getCurrPoint(e)[1];
};

function Mouseout(e) {
    magnifierDiv.style.display = "none";
}

interact('.LeftImg').draggable({
    onmove(event) {
        dragalt = event.target.alt;
    }
})

interact('.MyDicomDiv').dropzone({
    accept: '.LeftImg',
    ondropactivate: function (event) {
        event.target.classList.add('drop-active')
    },
    ondragenter: function (event) {
        var draggableElement = event.relatedTarget
        var dropzoneElement = event.target
        dropzoneElement.classList.add('drop-target')
        draggableElement.classList.add('can-drop')
    },
    ondragleave: function (event) {
        event.target.classList.remove('drop-target')
        event.relatedTarget.classList.remove('can-drop')

    },
    ondrop: function (event) {
        viewportNumber = parseInt(event.target.viewportNum);
        PictureOnclick(dragalt);
    },
    ondropdeactivate: function (event) {
        event.target.classList.remove('drop-active')
        event.target.classList.remove('drop-target')
    }
})