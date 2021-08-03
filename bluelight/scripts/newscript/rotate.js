
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
                let angel2point = rotateCalculation(e);
                labelXY[viewportNumber].innerText = "X: " + parseInt(angel2point[0]) + " Y: " + parseInt(angel2point[1]);
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
                displayRular(i);

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
            GetViewport().originalPointX = currX;
            GetViewport().originalPointY = currY;
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