function setTransform(viewportnum) {
    var viewport = GetViewport();
    var NewViewport = GetNewViewport();
    if (viewportnum == undefined) {
        GetViewportMark().style.transform = "translate(" + Fpx(viewport.newMousePointX) + "," + Fpx(viewport.newMousePointY) + ")rotate(" + NewViewport.rotate + "deg)";
        viewport.canvas().style.transform = "translate(" + Fpx(viewport.newMousePointX) + "," + Fpx(viewport.newMousePointY) + ")rotate(" + NewViewport.rotate + "deg)";
    } else {
        var num = viewportnum;
        GetViewportMark(num).style.transform = "translate(" + Fpx(GetViewport(num).newMousePointX) + "," + Fpx(GetViewport(num).newMousePointY) + ")rotate(" + GetNewViewport(num).rotate + "deg)";
        GetViewport(num).canvas().style.transform = "translate(" + Fpx(GetViewport(num).newMousePointX) + "," + Fpx(GetViewport(num).newMousePointY) + ")rotate(" + GetNewViewport(num).rotate + "deg)";
    }
}
/*function setTransform(viewportnum) {
    var viewport = GetViewport();
    var NewViewport = GetNewViewport();
    if (viewportnum == undefined) {
        GetViewportMark().style.transform = "translate(" + Fpx(viewport.newMousePointX) + "," + Fpx(viewport.newMousePointY) + ") scaleX(" + NewViewport.HorizontalFlip + ") scaleY(" + NewViewport.VerticalFlip + ") rotate(" + viewport.rotateValue + "deg)";
        viewport.canvas().style.transform = "translate(" + Fpx(viewport.newMousePointX) + "," + Fpx(viewport.newMousePointY) + ") scaleX(" + NewViewport.HorizontalFlip + ") scaleY(" + NewViewport.VerticalFlip + ") rotate(" + viewport.rotateValue + "deg)";
    } else {
        var num = viewportnum;
        GetViewportMark(num).style.transform = "translate(" + Fpx(GetViewport(num).newMousePointX) + "," + Fpx(GetViewport(num).newMousePointY) + ") scaleX(" + GetNewViewport(num).HorizontalFlip + ") scaleY(" + GetNewViewport(num).VerticalFlip + ") rotate(" + GetViewport(num).rotateValue + "deg)";
        GetViewport(num).canvas().style.transform = "translate(" + Fpx(GetViewport(num).newMousePointX) + "," + Fpx(GetViewport(num).newMousePointY) + ") scaleX(" + GetNewViewport(num).HorizontalFlip + ") scaleY(" + GetNewViewport(num).VerticalFlip + ") rotate(" + GetViewport(num).rotateValue + "deg)";
    }
}*/
function scale_size(e, currX, currY) {
    var viewport = GetViewport(), canvas = viewport.canvas();
    if (openLink == true) {
        for (var i = 0; i < Viewport_Total; i++) {
            if (i == viewportNumber) continue;
            try {
                GetViewport(i).canvas().style.width = canvas.style.width;
                GetViewport(i).canvas().style.height = canvas.style.height;
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
            viewport.newMousePointX -= Math.abs(tempWidth - (parseFloat(canvasW))) / 2;
        else
            viewport.newMousePointX -= Math.abs(tempWidth - (parseFloat(canvasW))) / 2;
        if (currY > parseFloat(cnavsH) / 2)
            viewport.newMousePointY -= Math.abs(tempHeight - (parseFloat(cnavsH))) / 2;
        else
            viewport.newMousePointY -= Math.abs(tempHeight - (parseFloat(cnavsH))) / 2;
        setTransform();
    } else if (GetmouseY(e) > windowMouseY + 2) {
        var tempWidth = parseFloat(canvas.style.width);
        var tempHeight = parseFloat(canvas.style.height)
        var canvasW = GetViewportMark().style.width = canvas.style.width = tempWidth / 1.05 + "px";
        var cnavsH = GetViewportMark().style.height = canvas.style.height = tempHeight / 1.05 + "px";
        if (currX > parseFloat(canvasW) / 2)
            viewport.newMousePointX += Math.abs(tempWidth - (parseFloat(canvasW))) / 2;
        else
            viewport.newMousePointX += Math.abs(tempWidth - (parseFloat(canvasW))) / 2;
        if (currY > parseFloat(cnavsH) / 2)
            viewport.newMousePointY += Math.abs(tempHeight - (parseFloat(cnavsH))) / 2;
        else
            viewport.newMousePointY += Math.abs(tempHeight - (parseFloat(cnavsH))) / 2;
        setTransform();
    }
    windowMouseX = GetmouseX(e);
    windowMouseY = GetmouseY(e);
    viewport.NowCanvasSizeWidth = parseFloat(canvas.style.width);
    viewport.NowCanvasSizeHeight = parseFloat(canvas.style.height);
    if (openLink == true) {
        for (var i = 0; i < Viewport_Total; i++) {
            if (i == viewportNumber) continue;
            GetViewportMark(i).style.width = GetViewport(i).canvas().style.width = canvas.style.width;
            GetViewportMark(i).style.height = GetViewport(i).canvas().style.height = canvas.style.height;
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

        BlueLightMousedownList = [];

        Mousemove = function (e) {
            var viewport = GetViewport(), canvas = viewport.canvas();

            var currX = getCurrPoint(e)[0];
            var currY = getCurrPoint(e)[1];

            if (rightMouseDown == true) {
                scale_size(e, currX, currY)
            }
            if (openLink == true) {
                for (var i = 0; i < Viewport_Total; i++) {
                    GetViewport(i).newMousePointX = viewport.newMousePointX;
                    GetViewport(i).newMousePointY = viewport.newMousePointY;
                }
            }

            if (MouseDownCheck) {
                var MouseX = GetmouseX(e);
                var MouseY = GetmouseY(e);
                viewport.newMousePointX += MouseX - windowMouseX;
                viewport.newMousePointY += MouseY - windowMouseY;
                setTransform();
                windowMouseX = GetmouseX(e);
                windowMouseY = GetmouseY(e);

                if (openLink == true) {
                    for (var i = 0; i < Viewport_Total; i++) {
                        try {
                            GetViewportMark(i).style.width = GetViewport(i).canvas().style.width = viewport.canvas().style.width;
                            GetViewportMark(i).style.height = GetViewport(i).canvas().style.height = viewport.canvas().style.height;
                            setTransform(i);
                            GetViewport(i).newMousePointX = viewport.newMousePointX;
                            GetViewport(i).newMousePointX = viewport.newMousePointX;
                        } catch (ex) { }
                    }
                }
            }
        }
        Mouseup = function (e) {
            var currX = getCurrPoint(e)[0];
            var currY = getCurrPoint(e)[1];
            if (openMouseTool == true && rightMouseDown == true)
                displayMark();
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
            if (e2) {
                var currX2 = getCurrPoint(e2)[0];
                var currY2 = getCurrPoint(e2)[1];
            }

            if (rightTouchDown == true && e2) {
                //if (openRotate == false && (openMouseTool == true || openWindow == true || openZoom == true || openMeasure == true)) 
                {
                    if (openLink == true) {
                        for (var i = 0; i < Viewport_Total; i++) {
                            if (i == viewportNumber) continue;
                            try {
                                GetViewport(i).canvas().style.width = viewport.canvas().style.width;
                                GetViewport(i).canvas().style.height = viewport.canvas().style.height;
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
                            viewport.newMousePointX -= Math.abs(tempWidth - (parseFloat(canvasW))) / 2;
                        else
                            viewport.newMousePointX -= Math.abs(tempWidth - (parseFloat(canvasW))) / 2;
                        if (currY > parseFloat(cnavsH) / 2)
                            viewport.newMousePointY -= Math.abs(tempHeight - (parseFloat(cnavsH))) / 2;
                        else
                            viewport.newMousePointY -= Math.abs(tempHeight - (parseFloat(cnavsH))) / 2;
                        setTransform();

                    } else if (Math.abs(GetmouseY(e2) - GetmouseY(e)) + 2 < Math.abs(windowMouseY - windowMouseY2) - 2 ||
                        Math.abs(GetmouseX(e2) - GetmouseX(e)) + 2 < Math.abs(windowMouseX - windowMouseX2) - 2) {
                        var tempWidth = parseFloat(canvas.style.width);
                        var tempHeight = parseFloat(canvas.style.height)
                        var canvasW = GetViewportMark().style.width = canvas.style.width = tempWidth / 1.05 + "px";
                        var cnavsH = GetViewportMark().style.height = canvas.style.height = tempHeight / 1.05 + "px";
                        if (currX > parseFloat(canvasW) / 2)
                            viewport.newMousePointX += Math.abs(tempWidth - (parseFloat(canvasW))) / 2;
                        else
                            viewport.newMousePointX += Math.abs(tempWidth - (parseFloat(canvasW))) / 2;
                        if (currY > parseFloat(cnavsH) / 2)
                            viewport.newMousePointY += Math.abs(tempHeight - (parseFloat(cnavsH))) / 2;
                        else
                            viewport.newMousePointY += Math.abs(tempHeight - (parseFloat(cnavsH))) / 2;
                        setTransform();
                    }
                    windowMouseX = GetmouseX(e);
                    windowMouseY = GetmouseY(e);
                    windowMouseX2 = GetmouseX(e2);
                    windowMouseY2 = GetmouseY(e2);
                    viewport.NowCanvasSizeWidth = parseFloat(canvas.style.width);
                    viewport.NowCanvasSizeHeight = parseFloat(canvas.style.height);
                    if (openLink == true) {
                        for (var i = 0; i < Viewport_Total; i++) {
                            if (i == viewportNumber) continue;
                            GetViewportMark(i).style.width = GetViewport(i).canvas().style.width = viewport.canvas().style.width;
                            GetViewportMark(i).style.height = GetViewport(i).canvas().style.height = viewport.canvas().style.height;
                            setTransform(i);

                            GetViewport(i).NowCanvasSizeWidth = parseFloat(canvas.style.width);
                            GetViewport(i).NowCanvasSizeHeight = parseFloat(canvas.style.height);
                        }
                    }
                }
            }
            if (TouchDownCheck == true && rightTouchDown == false) {

                var MouseX = GetmouseX(e);
                var MouseY = GetmouseY(e);
                viewport.newMousePointX += MouseX - windowMouseX;
                viewport.newMousePointY += MouseY - windowMouseY;
                setTransform();
                windowMouseX = GetmouseX(e);
                windowMouseY = GetmouseY(e);

                if (openLink == true) {
                    for (var i = 0; i < Viewport_Total; i++) {
                        GetViewportMark(i).style.width = GetViewport(i).canvas().style.width = viewport.canvas().style.width;
                        GetViewportMark(i).style.height = GetViewport(i).canvas().style.height = viewport.canvas().style.height;
                        setTransform(i);


                        newMousePointX[i] = viewport.newMousePointX;
                        newMousePointX[i] = viewport.newMousePointX;
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