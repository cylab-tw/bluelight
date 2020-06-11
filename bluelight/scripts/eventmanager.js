var degerrX = 0;
var degerrY = 0;
var degerrX_2 = 0;
var degerrY_2 = 90;
var degerrX_2 = 90;
var degerrY_2 = 0;
//var o3dDirection = 1;
var Direction_VR = 1;
var rotateStep = 3;
var rotateSpeed = 10;
var zoomRatio3D = 1;
var contextmenuF = function (e) {
    e.preventDefault();
};
var mousedownF = function (e) {
    Mousedown(e)
};
var mousemoveF = function (e) {
    Mousemove(e)
};
var mouseoutF = function (e) {
    Mouseout(e)
};
var wheelF = function (e) {
    Wheel(e)
};
var mouseupF = function (e) {
    Mouseup(e)
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

var mousemove3D = function (e) {
    if (openCave == true) return;
    if (openVR == true || openMPR == true) {
        if (MouseDownCheck == true) {
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

            for (var ll = 0; ll < o3d_3degree; ll++) {
                var canvas2 = getByid("3DDiv2_" + ll).canvas();
                var div2 = getByid("3DDiv2_" + ll);
                canvas2.style.cssText += '-webkit-transform: translate3d(' + 0 + ', ' + 0 + ', 0);';
                div2.style.cssText += '-webkit-transform: translate3d(' + 1 + ', ' + 1 + ', 0);';
                div2.style.cssText += '-webkit-transform-origin: ' + 'center' + ' ' + 'center' + ' ' + 'center' + 'px;';
                canvas2.style.cssText += '-webkit-transform-origin: ' + 'center' + ' ' + 'center' + ' ' + 'center' + ';';
            }

            for (var ll = 0; ll < o3d_3degree; ll++) {
                var canvas3 = getByid("3DDiv3_" + ll).canvas();
                var div3 = getByid("3DDiv3_" + ll);
                canvas3.style.cssText += '-webkit-transform: translate3d(' + 0 + ', ' + 0 + ', 0);';
                div3.style.cssText += '-webkit-transform: translate3d(' + 1 + ', ' + 1 + ', 0);';
                div3.style.cssText += '-webkit-transform-origin: ' + 'center' + ' ' + 'center' + ' ' + 'center' + 'px;';
                canvas3.style.cssText += '-webkit-transform-origin: ' + 'center' + ' ' + 'center' + ' ' + 'center' + ';';
            }
            for (var ll = 0; ll < o3DListLength; ll++) {
                var VrDistance = get3dDistance();

                var canvas1 = getByid("3DDiv" + ll).canvas();
                var div1 = getByid("3DDiv" + ll);
                canvas1.style.cssText += '-webkit-transform: translate3d(' + 0 + ', ' + 0 + ', 0);';
                div1.style.cssText += '-webkit-transform: translate3d(' + 1 + ', ' + 1 + ', 0);';
                div1.style.cssText += '-webkit-transform-origin: center center ' + 'center' + 'px;';
                canvas1.style.cssText += '-webkit-transform-origin: ' + 'center' + ' ' + 'center' + ' ' + 'center' + ';';
            }
        }
        if (MouseDownCheck || rightMouseDown) {
            var currX = get3dCurrPoint(e)[0];
            var currY = get3dCurrPoint(e)[1];
        }
        VrDistance2 = (parseFloat(parseFloat(1) * (parseFloat(getByid("3DDiv" + parseInt(o3DListLength / 2)).canvas().style.height) /
            parseFloat(GetViewport().imageHeight))) * (getByid("3DDiv" + parseInt(o3DListLength / 2)).thickness));

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
                    canvas1.style = "position: absolute;top: 50%;left:50%; margin: -" + (parseInt(canvas1.style.height) / 2) +
                        "px 0 0 -" + (parseInt(canvas1.style.width) / 2) + "px;width:" + canvas1.style.width + ";height:" + canvas1.style.height + ";";
                }
                for (var ll = 0; ll < o3d_3degree; ll++) {
                    var canvas2 = getByid("3DDiv2_" + ll).canvas();
                    canvas2.style.width = (parseFloat(canvas2.originWidth) * zoomRatio3D) + "px";
                    canvas2.style.height = (parseFloat(canvas2.originHeight) * zoomRatio3D) + "px";
                    canvas2.style = "position: absolute;top: 50%;left:50%;" +
                        "margin:" + "" + ((getByid("3DDiv2_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().imageHeight)))) +
                        "px 0 0 -" + (parseInt(canvas2.style.width) / 2) + "px;" +
                        "width:" + canvas2.style.width + ";height:" + canvas2.style.height + ";";
                }
                for (var ll = 0; ll < o3d_3degree; ll++) {
                    var canvas3 = getByid("3DDiv3_" + ll).canvas();
                    canvas3.style.width = (parseFloat(canvas3.originWidth) * zoomRatio3D) + "px";
                    canvas3.style.height = (parseFloat(canvas3.originHeight) * zoomRatio3D) + "px";
                    canvas3.style = "position: absolute;top: 50%;left:50%;" +
                        "margin:" + "-" + (parseInt(canvas3.style.height) / 2) +
                        "px 0 0 " + ((getByid("3DDiv3_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().imageHeight)))) + "px;" +
                        "height:" + canvas3.style.height + ";width:" + canvas3.style.width +
                        ";";
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
                    ////console.log(canvas1.style.height);

                    canvas1.style = "position: absolute;top: 50%;left:50%; margin: -" + (parseInt(canvas1.style.height) / 2) +
                        "px 0 0 -" + (parseInt(canvas1.style.width) / 2) + "px;width:" + canvas1.style.width + ";height:" + canvas1.style.height + ";";
                }
                for (var ll = 0; ll < o3d_3degree; ll++) {
                    var canvas2 = getByid("3DDiv2_" + ll).canvas();
                    canvas2.style.width = (parseFloat(canvas2.originWidth) * zoomRatio3D) + "px";
                    canvas2.style.height = (parseFloat(canvas2.originHeight) * zoomRatio3D) + "px";
                    canvas2.style = "position: absolute;top: 50%;left:50%;" +
                        "margin:" + "" + ((getByid("3DDiv2_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().imageHeight)))) +
                        "px 0 0 -" + (parseInt(canvas2.style.width) / 2) + "px;" +
                        "width:" + canvas2.style.width + ";height:" + canvas2.style.height + ";";
                }
                for (var ll = 0; ll < o3d_3degree; ll++) {
                    var canvas3 = getByid("3DDiv3_" + ll).canvas();
                    canvas3.style.width = (parseFloat(canvas3.originWidth) * zoomRatio3D) + "px";
                    canvas3.style.height = (parseFloat(canvas3.originHeight) * zoomRatio3D) + "px";
                    canvas3.style = "position: absolute;top: 50%;left:50%;" +
                        "margin:" + "-" + (parseInt(canvas3.style.height) / 2) +
                        "px 0 0 " + ((getByid("3DDiv3_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().imageHeight)))) + "px;" +
                        "height:" + canvas3.style.height + ";width:" + canvas3.style.width + ";";
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
                // canvas1.style.cssText += '-webkit-transform: translate3d(' + 0 + ', ' + 0 + ', 0);';
                // div1.style.cssText += '-webkit-transform: translate3d(' + 1 + ', ' + 1 + ', 0);';
            }

            for (var ll = 0; ll < o3d_3degree; ll++) {
                var canvas2 = getByid("3DDiv2_" + ll).canvas();
                var div2 = getByid("3DDiv2_" + ll);
                canvas2.style.transformStyle = "preserve-3d";
                canvas2.style.transform = "translate3d(0,0,0) rotateX(" + (-90) + "deg)";
                if (getByid("o3DMip").selected == true && openVR) {
                    div2.style.mixBlendMode = "lighten";
                }
                //canvas2.style.cssText += '-webkit-transform: translate3d(' + 0 + ', ' + 0 + ', 0);';
                //div2.style.cssText += '-webkit-transform: translate3d(' + 1 + ', ' + 1 + ', 0);';
            }
            for (var ll = 0; ll < o3d_3degree; ll++) {
                var canvas3 = getByid("3DDiv3_" + ll).canvas();
                var div3 = getByid("3DDiv3_" + ll);
                canvas3.style.transformStyle = "preserve-3d";
                canvas3.style.transform = "translate3d(0,0,0) rotateY(" + (90 + 0) + "deg)";
                if (getByid("o3DMip").selected == true && openVR) {
                    div3.style.mixBlendMode = "lighten";
                }
                //canvas3.style.cssText += '-webkit-transform: translate3d(' + 0 + ', ' + 0 + ', 0);';
                //div3.style.cssText += '-webkit-transform: translate3d(' + 1 + ', ' + 1 + ', 0);';
            }
            GetViewport().originalPointX = currX;
            GetViewport().originalPointY = currY;
        }
    }
};

var mousedown3D = function (e) {
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
    if (getByid("3dLight").checked == true) {
        for (var ll = 0; ll < o3DListLength; ll++) {
            var canvas1 = getByid("3DDiv" + ll).canvas();
            canvas1.style.background = "linear-gradient(rgba(0,0,0,.02), rgba(0,0,0,.02))";
        }
        for (var ll = 0; ll < o3d_3degree; ll++) {
            var canvas1 = getByid("3DDiv2_" + ll).canvas();
            canvas1.style.background = "linear-gradient(rgba(0,0,0,.02), rgba(0,0,0,.02))";
        }
        for (var ll = 0; ll < o3d_3degree; ll++) {
            var canvas1 = getByid("3DDiv3_" + ll).canvas();
            canvas1.style.background = "linear-gradient(rgba(0,0,0,.02), rgba(0,0,0,.02))";
        }
    }
    /* for (var ll = 0; ll < o3DListLength; ll++) {
         var canvasC = getByid("3DDiv" + ll).canvas();
         var canvas1 = getByid("3DDiv" + ll);
         canvasC.style.cssText += '-webkit-transform: translate3d(' + 0 + ', ' + 0 + ', 0);';
         canvas1.style.cssText += '-webkit-transform: translate3d(' + 1 + ', ' + 1 + ', 0);';
     }*/
};
var touchstart3D = function (e) {
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
    if (getByid("3dLight").checked == true) {
        for (var ll = 0; ll < o3DListLength; ll++) {
            var canvas1 = getByid("3DDiv" + ll).canvas();
            canvas1.style.background = "linear-gradient(rgba(0,0,0,.02), rgba(0,0,0,.02))";
        }
        for (var ll = 0; ll < o3d_3degree; ll++) {
            var canvas1 = getByid("3DDiv2_" + ll).canvas();
            canvas1.style.background = "linear-gradient(rgba(0,0,0,.02), rgba(0,0,0,.02))";
        }
        for (var ll = 0; ll < o3d_3degree; ll++) {
            var canvas1 = getByid("3DDiv3_" + ll).canvas();
            canvas1.style.background = "linear-gradient(rgba(0,0,0,.02), rgba(0,0,0,.02))";
        }
    }
};

var Touchmove3D = function (e, e2) {
    if (openCave == true) return;
    if (openVR == true || openMPR == true) {
        for (var ll = 0; ll < o3DListLength; ll++) {
            var canvas1 = getByid("3DDiv" + ll).canvas();
            if (!parseInt(canvas1.style.width) >= 1) {
                canvas1.style.width = canvas.style.width;
                canvas1.style.height = canvas.style.height;
            }
            canvas1.style = "position: absolute;top: 50%;left:50%; margin: -" + (parseInt(canvas1.style.height) / 2) +
                "px 0 0 -" + (parseInt(canvas1.style.width) / 2) + "px;width:" + canvas1.style.width + ";height:" + canvas1.style.height + ";";
        }

        var currX = getCurrPoint(e)[0];
        var currY = getCurrPoint(e)[1];
        if (TouchDownCheck == true &&!rightTouchDown) {
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

            for (var ll = 0; ll < o3d_3degree; ll++) {
                var canvas2 = getByid("3DDiv2_" + ll).canvas();
                var div2 = getByid("3DDiv2_" + ll);
                canvas2.style.cssText += '-webkit-transform: translate3d(' + 0 + ', ' + 0 + ', 0);';
                div2.style.cssText += '-webkit-transform: translate3d(' + 1 + ', ' + 1 + ', 0);';
                div2.style.cssText += '-webkit-transform-origin: ' + 'center' + ' ' + 'center' + ' ' + 'center' + 'px;';
                canvas2.style.cssText += '-webkit-transform-origin: ' + 'center' + ' ' + 'center' + ' ' + 'center' + ';';
            }

            for (var ll = 0; ll < o3d_3degree; ll++) {
                var canvas3 = getByid("3DDiv3_" + ll).canvas();
                var div3 = getByid("3DDiv3_" + ll);
                canvas3.style.cssText += '-webkit-transform: translate3d(' + 0 + ', ' + 0 + ', 0);';
                div3.style.cssText += '-webkit-transform: translate3d(' + 1 + ', ' + 1 + ', 0);';
                div3.style.cssText += '-webkit-transform-origin: ' + 'center' + ' ' + 'center' + ' ' + 'center' + 'px;';
                canvas3.style.cssText += '-webkit-transform-origin: ' + 'center' + ' ' + 'center' + ' ' + 'center' + ';';
            }
            for (var ll = 0; ll < o3DListLength; ll++) {
                var canvas1 = getByid("3DDiv" + ll).canvas();
                var div1 = getByid("3DDiv" + ll);
                canvas1.style.cssText += '-webkit-transform: translate3d(' + 0 + ', ' + 0 + ', 0);';
                div1.style.cssText += '-webkit-transform: translate3d(' + 1 + ', ' + 1 + ', 0);';
                div1.style.cssText += '-webkit-transform-origin: center center ' + 'center' + 'px;';
                canvas1.style.cssText += '-webkit-transform-origin: ' + 'center' + ' ' + 'center' + ' ' + 'center' + ';';
            }
        }
        var currX = get3dCurrPoint(e)[0];
        var currY = get3dCurrPoint(e)[1];
        var VrDistance = get3dDistance();

        VrDistance2 = (parseFloat(parseFloat(1) * (parseFloat(getByid("3DDiv" + parseInt(o3DListLength / 2)).canvas().style.height) /
            parseFloat(GetViewport().imageHeight))) * (getByid("3DDiv" + parseInt(o3DListLength / 2)).thickness /*+ Thickness * 2*/));

        if (TouchDownCheck == true &&!rightTouchDown) {
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
                    canvas1.style = "position: absolute;top: 50%;left:50%; margin: -" + (parseInt(canvas1.style.height) / 2) +
                        "px 0 0 -" + (parseInt(canvas1.style.width) / 2) + "px;width:" + canvas1.style.width + ";height:" + canvas1.style.height + ";";
                }
                for (var ll = 0; ll < o3d_3degree; ll++) {
                    var canvas2 = getByid("3DDiv2_" + ll).canvas();
                    canvas2.style.width = (parseFloat(canvas2.originWidth) * zoomRatio3D) + "px";
                    canvas2.style.height = (parseFloat(canvas2.originHeight) * zoomRatio3D) + "px";
                    canvas2.style = "position: absolute;top: 50%;left:50%;" +
                        "margin:" + "" + ((getByid("3DDiv2_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().imageHeight)))) +
                        "px 0 0 -" + (parseInt(canvas2.style.width) / 2) + "px;" +
                        "width:" + canvas2.style.width + ";height:" + canvas2.style.height + ";";
                }
                for (var ll = 0; ll < o3d_3degree; ll++) {
                    var canvas3 = getByid("3DDiv3_" + ll).canvas();
                    canvas3.style.width = (parseFloat(canvas3.originWidth) * zoomRatio3D) + "px";
                    canvas3.style.height = (parseFloat(canvas3.originHeight) * zoomRatio3D) + "px";
                    canvas3.style = "position: absolute;top: 50%;left:50%;" +
                        "margin:" + "-" + (parseInt(canvas3.style.height) / 2) +
                        "px 0 0 " + ((getByid("3DDiv3_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().imageHeight)))) + "px;" +
                        "height:" + canvas3.style.height + ";width:" + canvas3.style.width +
                        ";";
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
                    canvas1.style = "position: absolute;top: 50%;left:50%; margin: -" + (parseInt(canvas1.style.height) / 2) +
                        "px 0 0 -" + (parseInt(canvas1.style.width) / 2) + "px;width:" + canvas1.style.width + ";height:" + canvas1.style.height + ";";
                }
                for (var ll = 0; ll < o3d_3degree; ll++) {
                    var canvas2 = getByid("3DDiv2_" + ll).canvas();
                    canvas2.style.width = (parseFloat(canvas2.originWidth) * zoomRatio3D) + "px";
                    canvas2.style.height = (parseFloat(canvas2.originHeight) * zoomRatio3D) + "px";
                    canvas2.style = "position: absolute;top: 50%;left:50%;" +
                        "margin:" + "" + ((getByid("3DDiv2_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().imageHeight)))) +
                        "px 0 0 -" + (parseInt(canvas2.style.width) / 2) + "px;" +
                        "width:" + canvas2.style.width + ";height:" + canvas2.style.height + ";";
                }
                for (var ll = 0; ll < o3d_3degree; ll++) {
                    var canvas3 = getByid("3DDiv3_" + ll).canvas();
                    canvas3.style.width = (parseFloat(canvas3.originWidth) * zoomRatio3D) + "px";
                    canvas3.style.height = (parseFloat(canvas3.originHeight) * zoomRatio3D) + "px";
                    canvas3.style = "position: absolute;top: 50%;left:50%;" +
                        "margin:" + "-" + (parseInt(canvas3.style.height) / 2) +
                        "px 0 0 " + ((getByid("3DDiv3_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().imageHeight)))) + "px;" +
                        "height:" + canvas3.style.height + ";width:" + canvas3.style.width + ";";
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
                // canvas1.style.cssText += '-webkit-transform: translate3d(' + 0 + ', ' + 0 + ', 0);';
                // div1.style.cssText += '-webkit-transform: translate3d(' + 1 + ', ' + 1 + ', 0);';
            }

            for (var ll = 0; ll < o3d_3degree; ll++) {
                var canvas2 = getByid("3DDiv2_" + ll).canvas();
                var div2 = getByid("3DDiv2_" + ll);
                canvas2.style.transformStyle = "preserve-3d";
                canvas2.style.transform = "rotateX(" + (-90) + "deg)";
                if (getByid("o3DMip").selected == true && openVR) {
                    div2.style.mixBlendMode = "lighten";
                }
                //canvas2.style.cssText += '-webkit-transform: translate3d(' + 0 + ', ' + 0 + ', 0);';
                //div2.style.cssText += '-webkit-transform: translate3d(' + 1 + ', ' + 1 + ', 0);';
            }
            for (var ll = 0; ll < o3d_3degree; ll++) {
                var canvas3 = getByid("3DDiv3_" + ll).canvas();
                var div3 = getByid("3DDiv3_" + ll);
                canvas3.style.transformStyle = "preserve-3d";
                canvas3.style.transform = "rotateY(" + (90 + 0) + "deg)";
                if (getByid("o3DMip").selected == true && openVR) {
                    div3.style.mixBlendMode = "lighten";
                }
                //canvas3.style.cssText += '-webkit-transform: translate3d(' + 0 + ', ' + 0 + ', 0);';
                //div3.style.cssText += '-webkit-transform: translate3d(' + 1 + ', ' + 1 + ', 0);';
            }
            GetViewport().originalPointX = currX;
            GetViewport().originalPointY = currY;
        }
    }
}

window.addEventListener('load', function() {
    var isWindowTop = false;
    var lastTouchY = 0;
    var touchStartHandler = function(e) {
        if (e.touches.length !== 1) return;
        lastTouchY = e.touches[0].clientY;
        isWindowTop = (window.pageYOffset === 0);
    };

    var touchMoveHandler = function(e) {
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