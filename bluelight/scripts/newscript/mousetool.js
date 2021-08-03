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
        AddMouseEvent();
    }
}