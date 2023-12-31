
function rotate() {
    if (BL_mode == 'rotate') {
        DeleteMouseEvent();
        //cancelTools();
        openRotate = true;
        openChangeFile = true;
        set_BL_model.onchange1 = function () {
            openRotate = false;
            openChangeFile = false;
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
                let angle2point = rotateCalculation(e);
                labelXY[viewportNumber].innerText = "X: " + parseInt(angle2point[0]) + " Y: " + parseInt(angle2point[1]);
            }
            if (rightMouseDown == true) {
                if (Math.abs(currY - GetViewport().originalPointY) > Math.abs(currX - GetViewport().originalPointX)) {
                    if (currY < GetViewport().originalPointY - 3)
                        GetViewport().rotateValue += 2;
                    else if (currY > GetViewport().originalPointY + 3)
                        GetViewport().rotateValue -= 2;
                }
                setTransform();
                if (openLink == true) {
                    for (var z = 0; z < 4; z++) {
                        GetViewport(z).rotateValue = GetViewport().rotateValue;
                        setTransform(z);
                    }
                }
            }
            if (openLink == true) {
                for (var i = 0; i < Viewport_Total; i++) {
                    GetViewport(i).newMousePointX = GetViewport().newMousePointX;
                    GetViewport(i).newMousePointY = GetViewport().newMousePointY;
                }
            }
            putLabel();
            for (var i = 0; i < Viewport_Total; i++)
                displayRuler(i);

            if (MouseDownCheck) {
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
                            GetViewportMark(i).style.width = GetViewport(i).canvas().style.width = GetNewViewport().canvas.style.width;
                            GetViewportMark(i).style.height = GetViewport(i).canvas().style.height = GetNewViewport().canvas.style.height;
                            setTransform(i);
                            GetViewport(i).newMousePointX = GetViewport().newMousePointX;
                            GetViewport(i).newMousePointX = GetViewport().newMousePointX;
                        } catch (ex) { }
                    }
                }
                putLabel();
                for (var i = 0; i < Viewport_Total; i++)
                    displayRuler(i);
            }
            GetViewport().originalPointX = currX;
            GetViewport().originalPointY = currY;
        }
        Mouseup = function (e) {
            var currX = getCurrPoint(e)[0];
            var currY = getCurrPoint(e)[1];
            if (openMouseTool == true && rightMouseDown == true)
                displayMark();
            MouseDownCheck = false;
            rightMouseDown = false;
            magnifierDiv.hide();
            
            if (openLink) {
                for (var i = 0; i < Viewport_Total; i++)
                    displayRuler(i);
            }
        }
        Touchstart = function (e, e2) {

            if (!e2) TouchDownCheck = true;
            else rightTouchDown = true;
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
            var viewport = GetViewport(), canvas = viewport.canvas();
            if (openDisplayMarkup && (getByid("DICOMTagsSelect").selected || getByid("AIMSelect").selected)) return;

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
                                GetViewport(i).canvas().style.width = GetNewViewport().canvas.style.width;
                                GetViewport(i).canvas().style.height = GetNewViewport().canvas.style.height;
                                setTransform(i);


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

                    } else if (Math.abs(GetmouseY(e2) - GetmouseY(e)) + 2 < Math.abs(windowMouseY - windowMouseY2) - 2 ||
                        Math.abs(GetmouseX(e2) - GetmouseX(e)) + 2 < Math.abs(windowMouseX - windowMouseX2) - 2) {
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
                    windowMouseX2 = GetmouseX(e2);
                    windowMouseY2 = GetmouseY(e2);
                    GetViewport().NowCanvasSizeWidth = parseFloat(canvas.style.width);
                    GetViewport().NowCanvasSizeHeight = parseFloat(canvas.style.height);
                    if (openLink == true) {
                        for (var i = 0; i < Viewport_Total; i++) {
                            if (i == viewportNumber) continue;
                            GetViewportMark(i).style.width = GetViewport(i).canvas().style.width = GetNewViewport().canvas.style.width;
                            GetViewportMark(i).style.height = GetViewport(i).canvas().style.height = GetNewViewport().canvas.style.height;
                            setTransform(i);


                            GetViewport(i).NowCanvasSizeWidth = parseFloat(canvas.style.width);
                            GetViewport(i).NowCanvasSizeHeight = parseFloat(canvas.style.height);
                        }
                    }
                }

                if (openRotate == true) {
                    if (Math.abs(currY - GetViewport().originalPointY) > Math.abs(currX - GetViewport().originalPointX) &&
                        Math.abs(currY2 - GetViewport().originalPointY2) > Math.abs(currX2 - GetViewport().originalPointX2)
                    ) {
                        if (currY < GetViewport().originalPointY - 3)
                            GetViewport().rotateValue += 2;
                        else if (currY > GetViewport().originalPointY + 3)
                            GetViewport().rotateValue -= 2;
                    }
                    setTransform();



                    if (openLink == true) {
                        for (var z = 0; z < Viewport_Total; z++) {
                            rotateValue[z] = GetViewport().rotateValue;
                            setTransform(z);


                        }
                    }
                }
            }
            if (/*(openMouseTool == true || openRotate == true) && */rightTouchDown == false && openChangeFile == false) {
                var MouseX = GetmouseX(e);
                var MouseY = GetmouseY(e);
                GetViewport().newMousePointX += MouseX - windowMouseX;
                GetViewport().newMousePointY += MouseY - windowMouseY;
                setTransform();
                windowMouseX = GetmouseX(e);
                windowMouseY = GetmouseY(e);

                if (openLink == true) {
                    for (var i = 0; i < Viewport_Total; i++) {
                        GetViewportMark(i).style.width = GetViewport(i).canvas().style.width = GetNewViewport().canvas.style.width;
                        GetViewportMark(i).style.height = GetViewport(i).canvas().style.height = GetNewViewport().canvas.style.height;
                        setTransform(i);


                        newMousePointX[i] = GetViewport().newMousePointX;
                        newMousePointX[i] = GetViewport().newMousePointX;
                    }
                }
                /* for (var i = 0; i < 4; i++)
                   displayMark(i);*/
                putLabel();
                for (var i = 0; i < Viewport_Total; i++)
                    displayRuler(i);
            }
        }
        Touchend = function (e, e2) {
            if (TouchDownCheck == true) {
                if (openAngle == 1) openAngle = 2;
                else if (openAngle == 2) openAngle = 3;
            }
            TouchDownCheck = false;
            rightTouchDown = false;

            magnifierDiv.hide();
            
        }
        AddMouseEvent();
    }
}