
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

        BlueLightMousedownList = [];

        Mousemove = function (e) {
            var currX = getCurrPoint(e)[0];
            var currY = getCurrPoint(e)[1];

            if (rightMouseDown == true) {
                if (Math.abs(currY - GetViewport().originalPointY) > Math.abs(currX - GetViewport().originalPointX)) {
                    if (currY < GetViewport().originalPointY - 3)
                        GetNewViewport().rotate += 2;
                    else if (currY > GetViewport().originalPointY + 3)
                        GetNewViewport().rotate -= 2;
                }
                setTransform();
                if (openLink == true) {
                    for (var z = 0; z < Viewport_Total; z++) {
                        GetNewViewport(z).rotate = GetNewViewport().rotate;
                        setTransform(z);
                    }
                }
            }

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
                        } catch (ex) { }
                    }
                }
            }
            GetViewport().originalPointX = currX;
            GetViewport().originalPointY = currY;
        }
        Mouseup = function (e) {
            if (openMouseTool == true && rightMouseDown == true) displayMark();
            MouseDownCheck = rightMouseDown = false;
            magnifierDiv.hide();

            if (openLink) displayAllRuler();
        }

        BlueLightTouchstartList = [];

        Touchmove = function (e, e2) {
            var viewport = GetViewport(), canvas = viewport.canvas();
            if (openDisplayMarkup && (getByid("DICOMTagsSelect").selected || getByid("AIMSelect").selected)) return;

            var currX = getCurrPoint(e)[0];
            var currY = getCurrPoint(e)[1];
            if (e2) var [currX2, currY2] = getCurrPoint(e2);

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
                            GetNewViewport().rotate += 2;
                        else if (currY > GetViewport().originalPointY + 3)
                            GetNewViewport().rotate -= 2;
                    }
                    setTransform();



                    if (openLink == true) {
                        for (var z = 0; z < Viewport_Total; z++) {
                            GetNewViewport(z).rotate = GetNewViewport().rotate;
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
                        newMousePointY[i] = GetViewport().newMousePointY;
                    }
                }
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