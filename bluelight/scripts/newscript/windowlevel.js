
function windowlevel() {
    if (BL_mode == 'windowlevel') {
        DeleteMouseEvent();
        textWC.style.display = '';
        textWW.style.display = '';
        getByid('WindowLevelDiv').style.display = '';
        //  getByid('myWW').style.display = '';
        openWindow = true;

        SetTable();
        set_BL_model.onchange1 = function () {
            openWindow = false;
            getByid('WindowLevelDiv').style.display = 'none';
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
                scale_size(e, currX, currY);
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
                //GetViewport().newMousePointX += MouseX - windowMouseX;
                //GetViewport().newMousePointY += MouseY - windowMouseY;
                //setTransform();

                if (openWindow == true && !openVR) {
                    getByid("WindowCustom").selected = true;
                    if (Math.abs(currY - GetViewport().originalPointY) > Math.abs(currX - GetViewport().originalPointX)) {
                        if (currY < GetViewport().originalPointY - 3)
                            GetViewport().windowCenterList = (parseInt(GetViewport().windowCenterList) + Math.abs(GetmouseY(e) - windowMouseY));
                        else if (currY > GetViewport().originalPointY + 3)
                            GetViewport().windowCenterList = (parseInt(GetViewport().windowCenterList) - Math.abs(GetmouseY(e) - windowMouseY));
                    } else {
                        if (currX < GetViewport().originalPointX - 3)
                            GetViewport().windowWidthList = (parseInt(GetViewport().windowWidthList) - Math.abs(GetmouseX(e) - windowMouseX));
                        else if (currX > GetViewport().originalPointX + 3)
                            GetViewport().windowWidthList = (parseInt(GetViewport().windowWidthList) + Math.abs(GetmouseX(e) - windowMouseX));
                    }
                    if (GetViewport().windowWidthList < 1) GetViewport().windowWidthList = 1;
                    textWC.value = "" + parseInt(GetViewport().windowCenterList);
                    textWW.value = "" + parseInt(GetViewport().windowWidthList);
                    if (openLink == true) {
                        for (var z = 0; z < 4; z++)
                            GetViewport(z).windowWidthList = GetViewport().windowWidthList;
                    }
                    displayWindowLevel();
                    displayMeasureRular();
                    SetWindowWL();
                    WindowOpen = true;
                }
                windowMouseX = GetmouseX(e);
                windowMouseY = GetmouseY(e);
                GetViewport().originalPointX = currX;
                GetViewport().originalPointY = currY;
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