
function windowlevel() {
    if (BL_mode == 'windowlevel') {
        DeleteMouseEvent();
        textWC.style.display = '';
        textWW.style.display = '';
        getByid('WindowLevelDiv').style.display = '';
        //  getByid('myWW').style.display = '';
        openWindow = true;

        set_BL_model.onchange1 = function () {
            openWindow = false;
            getByid('WindowLevelDiv').style.display = 'none';
            set_BL_model.onchange1 = function () { return 0; };
        }
        if (openVR || openMPR) return;

        SetTable();
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
        Touchstart = function (e, e2) {
            if (openVR == true) return;
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
            if (openDisplayMarkup && (getByid("DICOMTagsSelect").selected || getByid("AIMSelect").selected)) return;
            if (openVR == true) return;
            var currX = getCurrPoint(e)[0];
            var currY = getCurrPoint(e)[1];
            if (e2) {
                var currX2 = getCurrPoint(e2)[0];
                var currY2 = getCurrPoint(e2)[1];
            }
            var labelXY = getClass('labelXY');
            labelXY[viewportNumber].innerText = "X: " + Math.floor(currX) + " Y: " + Math.floor(currY);
            //尚未完成

            if (/*openWindow == true && */rightTouchDown == false) {
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
                    for (var z = 0; z < Viewport_Total; z++)
                        windowWidthList[z] = GetViewport().windowWidthList;
                }
                displayWindowLevel();
                displayMeasureRular();
                SetWindowWL();
                GetViewport().originalPointX = currX;
                GetViewport().originalPointY = currY;
                WindowOpen = true;
            }
            // putLabel();
            //  for (var i = 0; i < Viewport_Total; i++)
            //   displayRular(i);
        }
        Touchend = function (e, e2) {
            if (TouchDownCheck == true) {
                if (openAngle == 1) openAngle = 2;
                else if (openAngle == 2) openAngle = 3;
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