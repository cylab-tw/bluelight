function setTransform(viewportnum) {
    if (!viewportnum) {
        GetViewportMark(num).style.transform = "translate(" + Fpx(GetViewport(num).newMousePointX) + "," + Fpx(GetViewport(num).newMousePointY) + ")rotate(" + GetViewport(num).rotateValue + "deg)";
        GetViewport(num).canvas().style.transform = "translate(" + Fpx(GetViewport(num).newMousePointX) + "," + Fpx(GetViewport(num).newMousePointY) + ")rotate(" + GetViewport(num).rotateValue + "deg)";
    } else {
        var num = viewportnum;
        GetViewportMark(num).style.transform = "translate(" + Fpx(GetViewport(num).newMousePointX) + "," + Fpx(GetViewport(num).newMousePointY) + ")rotate(" + GetViewport(num).rotateValue + "deg)";
        GetViewport(num).canvas().style.transform = "translate(" + Fpx(GetViewport(num).newMousePointX) + "," + Fpx(GetViewport(num).newMousePointY) + ")rotate(" + GetViewport(num).rotateValue + "deg)";
    }
}

function scale_size(e, currX, currY) {
    if (openLink == true && openMPR == false) {
        for (var i = 0; i < Viewport_Total; i++) {
            if (i == viewportNumber) continue;
            try {
                GetViewport(i).canvas().style.width = GetViewport().canvas().style.width;
                GetViewport(i).canvas().style.height = GetViewport().canvas().style.height;
                setTransform(i);
                GetViewport(i).NowCanvasSizeWidth = parseFloat(canvas.style.width);
                GetViewport(i).NowCanvasSizeHeight = parseFloat(canvas.style.height);
            } catch (ex) { }
        }
    }
    if (GetmouseY(e) < windowMouseY - 2) {
        var tempWidth = parseFloat(canvas.style.width);
        var tempHeight = parseFloat(canvas.style.height)
        var canvasW = GetViewportMark().style.width = canvas.style.width = tempWidth * 1.05 + "px";
        var cnavsH = GetViewportMark().style.height = canvas.style.height = tempHeight * 1.05 + "px";
        if (currX > parseFloat(canvasW) / 2)
            GetViewport().newMousePointX -= Math.abs(tempWidth - (parseFloat(canvasW))) / 2;
        else
            GetViewport().newMousePointX -= Math.abs(tempWidth - (parseFloat(canvasW))) / 2;
        if (currY > parseFloat(cnavsH) / 2)
            GetViewport().newMousePointY -= Math.abs(tempHeight - (parseFloat(cnavsH))) / 2;
        else
            GetViewport().newMousePointY -= Math.abs(tempHeight - (parseFloat(cnavsH))) / 2;
        setTransform();
    } else if (GetmouseY(e) > windowMouseY + 2) {
        var tempWidth = parseFloat(canvas.style.width);
        var tempHeight = parseFloat(canvas.style.height)
        var canvasW = GetViewportMark().style.width = canvas.style.width = tempWidth / 1.05 + "px";
        var cnavsH = GetViewportMark().style.height = canvas.style.height = tempHeight / 1.05 + "px";
        if (currX > parseFloat(canvasW) / 2)
            GetViewport().newMousePointX += Math.abs(tempWidth - (parseFloat(canvasW))) / 2;
        else
            GetViewport().newMousePointX += Math.abs(tempWidth - (parseFloat(canvasW))) / 2;
        if (currY > parseFloat(cnavsH) / 2)
            GetViewport().newMousePointY += Math.abs(tempHeight - (parseFloat(cnavsH))) / 2;
        else
            GetViewport().newMousePointY += Math.abs(tempHeight - (parseFloat(cnavsH))) / 2;
        setTransform();
    }
    windowMouseX = GetmouseX(e);
    windowMouseY = GetmouseY(e);
    GetViewport().NowCanvasSizeWidth = parseFloat(canvas.style.width);
    GetViewport().NowCanvasSizeHeight = parseFloat(canvas.style.height);
    if (openLink == true) {
        for (var i = 0; i < Viewport_Total; i++) {
            if (i == viewportNumber) continue;
            GetViewportMark((i)).style.width = GetViewport(i).canvas().style.width = GetViewport().canvas().style.width;
            GetViewportMark((i)).style.height = GetViewport(i).canvas().style.height = GetViewport().canvas().style.height;
            setTransform(i);
            GetViewport(i).NowCanvasSizeWidth = parseFloat(canvas.style.width);
            GetViewport(i).NowCanvasSizeHeight = parseFloat(canvas.style.height);
        }
    }
}

function mouseTool() {
    if (BL_mode == 'MouseTool') {
        DeleteMouseEvent();
        openMouseTool = true;
        set_BL_model.onchange1 = function () {
            openMouseTool = false;
            set_BL_model.onchange1 = function () { return 0; };
        }

        Mousedown = function (e) {
            if (e.which == 1) MouseDownCheck = true;
            else if (e.which == 3) rightMouseDown = true;
            windowMouseX = GetmouseX(e);
            windowMouseY = GetmouseY(e);
            GetViewport().originalPointX = getCurrPoint(e)[0];
            GetViewport().originalPointY = getCurrPoint(e)[1];
        };

        Mousemove = function (e) {
            var currX = getCurrPoint(e)[0];
            var currY = getCurrPoint(e)[1];
            var labelXY = getClass('labelXY'); {
                let angel2point = rotateCalculation(e);
                labelXY[viewportNumber].innerText = "X: " + parseInt(angel2point[0]) + " Y: " + parseInt(angel2point[1]);
            }
            if (rightMouseDown == true) {
                scale_size(e, currX, currY)
            }
            if (openLink == true) {
                for (var i = 0; i < Viewport_Total; i++) {
                    GetViewport(i).newMousePointX = GetViewport().newMousePointX;
                    GetViewport(i).newMousePointY = GetViewport().newMousePointY;
                }
            }
            putLabel();
            for (var i = 0; i < Viewport_Total; i++)
                displayRular(i);
            if (MouseDownCheck && openMPR != true) {
                var MouseX = GetmouseX(e);
                var MouseY = GetmouseY(e);
                GetViewport().newMousePointX += MouseX - windowMouseX;
                GetViewport().newMousePointY += MouseY - windowMouseY;
                setTransform();
                windowMouseX = GetmouseX(e);
                windowMouseY = GetmouseY(e);

                if (openLink == true) {
                    for (var i = 0; i < Viewport_Total; i++) {
                        try {
                            GetViewportMark((i)).style.width = GetViewport(i).canvas().style.width = GetViewport().canvas().style.width;
                            GetViewportMark((i)).style.height = GetViewport(i).canvas().style.height = GetViewport().canvas().style.height;
                            setTransform(i);
                            GetViewport(i).newMousePointX = GetViewport().newMousePointX;
                            GetViewport(i).newMousePointX = GetViewport().newMousePointX;
                        } catch (ex) { }
                    }
                }
                putLabel();
                for (var i = 0; i < Viewport_Total; i++)
                    displayRular(i);
            }
        }
        Mouseup = function (e) {
            var currX = getCurrPoint(e)[0];
            var currY = getCurrPoint(e)[1];
            if (openMouseTool == true && rightMouseDown == true)
                displayMark(NowResize, null, null, null, viewportNumber);
            MouseDownCheck = false;
            rightMouseDown = false;
            magnifierDiv.style.display = "none";
            displayMeasureRular();
            if (openLink) {
                for (var i = 0; i < Viewport_Total; i++)
                    displayRular(i);
            }
        }
        Touchstart = function (e, e2) {
            if (openVR == true) return;
            if (!e2) TouchDownCheck = true;
            else rightTouchDown = true;
            if (openMPR == true) {
                windowMouseX = GetmouseX(e);
                windowMouseY = GetmouseY(e);
                GetViewport().originalPointX = getCurrPoint(e)[0];
                GetViewport().originalPointY = getCurrPoint(e)[1];
                return;
            };
            windowMouseX = GetmouseX(e);
            windowMouseY = GetmouseY(e);
            if (rightTouchDown == true && e2) {
                windowMouseX2 = GetmouseX(e2);
                windowMouseY2 = GetmouseY(e2);
            }
            GetViewport().originalPointX = getCurrPoint(e)[0];
            GetViewport().originalPointY = getCurrPoint(e)[1];
            if (rightTouchDown == true && e2) {
                GetViewport().originalPointX2 = getCurrPoint(e2)[0];
                GetViewport().originalPointY2 = getCurrPoint(e2)[1];
            }
        }
        Touchmove = function (e, e2) {
            if (openDisplayMarkup && (getByid("DICOMTagsSelect").selected || getByid("AIMSelect").selected)) return;
            if (openVR == true) return;
            if (openMPR == true) {
                if (TouchDownCheck == true) {
                    viewportNumber = 2;
                    let angel2point = rotateCalculation(e);
                    currX11M = angel2point[0];
                    currY11M = angel2point[1];
                    o3DPointX = currX11M;
                    o3DPointY = currY11M;
                    AngelXY0 = [currX11M, 0];
                    AngelXY1 = [currX11M, GetViewport().imageHeight];
                    if (openMPR == true) {
                        Anatomical_Section();
                        Anatomical_Section2();
                    }
                    display3DLine(currX11M, 0, currX11M, GetViewport().imageHeight, "rgb(38,140,191)");
                    display3DLine(0, currY11M, GetViewport().imageWidth, currY11M, "rgb(221,53,119)");
                }
            }
            var currX = getCurrPoint(e)[0];
            var currY = getCurrPoint(e)[1];
            if (e2) {
                var currX2 = getCurrPoint(e2)[0];
                var currY2 = getCurrPoint(e2)[1];
            }
            var labelXY = getClass('labelXY');
            labelXY[viewportNumber].innerText = "X: " + Math.floor(currX) + " Y: " + Math.floor(currY);
            if (rightTouchDown == true && e2) {
                //if (openRotate == false && (openMouseTool == true || openWindow == true || openZoom == true || openMeasure == true)) 
                {
                    if (openLink == true) {
                        for (var i = 0; i < Viewport_Total; i++) {
                            if (i == viewportNumber) continue;
                            try {
                                GetViewport(i).canvas().style.width = GetViewport().canvas().style.width;
                                GetViewport(i).canvas().style.height = GetViewport().canvas().style.height;
                                GetViewportMark(i).style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
                                GetViewport(i).canvas().style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
                                GetViewport(i).NowCanvasSizeWidth = parseFloat(canvas.style.width);
                                GetViewport(i).NowCanvasSizeHeight = parseFloat(canvas.style.height);
                            } catch (ex) { }
                        }
                    }
                    if (Math.abs(GetmouseY(e2) - GetmouseY(e)) - 2 > Math.abs(windowMouseY - windowMouseY2) + 2 ||
                        Math.abs(GetmouseX(e2) - GetmouseX(e)) - 2 > Math.abs(windowMouseX - windowMouseX2) + 2
                    ) {
                        var tempWidth = parseFloat(canvas.style.width);
                        var tempHeight = parseFloat(canvas.style.height)
                        var canvasW = GetViewportMark(viewportNumber).style.width = canvas.style.width = tempWidth * 1.05 + "px";
                        var cnavsH = GetViewportMark(viewportNumber).style.height = canvas.style.height = tempHeight * 1.05 + "px";
                        if (currX > parseFloat(canvasW) / 2)
                            GetViewport().newMousePointX -= Math.abs(tempWidth - (parseFloat(canvasW))) / 2;
                        else
                            GetViewport().newMousePointX -= Math.abs(tempWidth - (parseFloat(canvasW))) / 2;
                        if (currY > parseFloat(cnavsH) / 2)
                            GetViewport().newMousePointY -= Math.abs(tempHeight - (parseFloat(cnavsH))) / 2;
                        else
                            GetViewport().newMousePointY -= Math.abs(tempHeight - (parseFloat(cnavsH))) / 2;
                        GetViewportMark(viewportNumber).style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
                        canvas.style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
                    } else if (Math.abs(GetmouseY(e2) - GetmouseY(e)) + 2 < Math.abs(windowMouseY - windowMouseY2) - 2 ||
                        Math.abs(GetmouseX(e2) - GetmouseX(e)) + 2 < Math.abs(windowMouseX - windowMouseX2) - 2) {
                        var tempWidth = parseFloat(canvas.style.width);
                        var tempHeight = parseFloat(canvas.style.height)
                        var canvasW = GetViewportMark(viewportNumber).style.width = canvas.style.width = tempWidth / 1.05 + "px";
                        var cnavsH = GetViewportMark(viewportNumber).style.height = canvas.style.height = tempHeight / 1.05 + "px";
                        if (currX > parseFloat(canvasW) / 2)
                            GetViewport().newMousePointX += Math.abs(tempWidth - (parseFloat(canvasW))) / 2;
                        else
                            GetViewport().newMousePointX += Math.abs(tempWidth - (parseFloat(canvasW))) / 2;
                        if (currY > parseFloat(cnavsH) / 2)
                            GetViewport().newMousePointY += Math.abs(tempHeight - (parseFloat(cnavsH))) / 2;
                        else
                            GetViewport().newMousePointY += Math.abs(tempHeight - (parseFloat(cnavsH))) / 2;
                        GetViewportMark(viewportNumber).style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
                        canvas.style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
                    }
                    windowMouseX = GetmouseX(e);
                    windowMouseY = GetmouseY(e);
                    windowMouseX2 = GetmouseX(e2);
                    windowMouseY2 = GetmouseY(e2);
                    GetViewport().NowCanvasSizeWidth = parseFloat(canvas.style.width);
                    GetViewport().NowCanvasSizeHeight = parseFloat(canvas.style.height);
                    if (openLink == true) {
                        for (var i = 0; i < Viewport_Total; i++) {
                            if (i == viewportNumber) continue;
                            GetViewportMark(i).style.width = GetViewport(i).canvas().style.width = GetViewport().canvas().style.width;
                            GetViewportMark(i).style.height = GetViewport(i).canvas().style.height = GetViewport().canvas().style.height;
                            GetViewportMark(i).style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
                            GetViewport(i).canvas().style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
                            GetViewport(i).NowCanvasSizeWidth = parseFloat(canvas.style.width);
                            GetViewport(i).NowCanvasSizeHeight = parseFloat(canvas.style.height);
                        }
                    }
                }
            }
            if (TouchDownCheck == true && rightTouchDown == false) {
                // if ((openMouseTool == true || openRotate == true) && rightTouchDown == false && openChangeFile == false && openMPR == false) {
                if (openMPR == false) {
                    var MouseX = GetmouseX(e);
                    var MouseY = GetmouseY(e);
                    GetViewport().newMousePointX += MouseX - windowMouseX;
                    GetViewport().newMousePointY += MouseY - windowMouseY;
                    canvas.style.transform = "translate(" + ToPx(GetViewport().newMousePointX) + "," + ToPx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
                    GetViewportMark(viewportNumber).style.transform = "translate(" + ToPx(GetViewport().newMousePointX) + "," + ToPx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
                    windowMouseX = GetmouseX(e);
                    windowMouseY = GetmouseY(e);

                    if (openLink == true) {
                        for (var i = 0; i < Viewport_Total; i++) {
                            GetViewportMark(i).style.width = GetViewport(i).canvas().style.width = GetViewport().canvas().style.width;
                            GetViewportMark(i).style.height = GetViewport(i).canvas().style.height = GetViewport().canvas().style.height;
                            GetViewportMark(i).style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
                            GetViewport(i).canvas().style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
                            newMousePointX[i] = GetViewport().newMousePointX;
                            newMousePointX[i] = GetViewport().newMousePointX;
                        }
                    }
                    /* for (var i = 0; i < 4; i++)
                       displayMark(NowResize, null, null, null, i);*/
                    putLabel();
                    for (var i = 0; i < Viewport_Total; i++)
                        displayRular(i);
                }
            }
            putLabel();
            for (var i = 0; i < Viewport_Total; i++)
                displayRular(i);
        }
        Touchend = function (e, e2) {
            if (TouchDownCheck == true) {
                if (openAngel == 1) openAngel = 2;
                else if (openAngel == 2) openAngel = 3;
            }
            TouchDownCheck = false;
            rightTouchDown = false;
            if (openVR == true) return;
            magnifierDiv.style.display = "none";
            displayMeasureRular();
        }
        AddMouseEvent();
    }
}