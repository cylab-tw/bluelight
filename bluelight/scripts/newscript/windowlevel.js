
//表示現在正在調整WindowLevel
var WindowOpen = false;

function windowlevel() {
    if (BL_mode == 'windowlevel') {
        DeleteMouseEvent();
        getByid("textWC").style.display = '';
        getByid("textWW").style.display = '';
        getByid('WindowLevelDiv').style.display = '';
        //  getByid('myWW').style.display = '';
        openWindow = true;

        set_BL_model.onchange1 = function () {
            openWindow = false;
            getByid('WindowLevelDiv').style.display = 'none';
            set_BL_model.onchange1 = function () { return 0; };
        }

        SetTable();
        Mousedown = function (e) {
            if (e.which == 1) MouseDownCheck = true;
            else if (e.which == 3) rightMouseDown = true;
            windowMouseX = GetmouseX(e);
            windowMouseY = GetmouseY(e);
            [GetViewport().originalPointX, GetViewport().originalPointY] = getCurrPoint(e);
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
            displayAllRuler();

            if (MouseDownCheck) {
                var MouseX = GetmouseX(e);
                var MouseY = GetmouseY(e);
                //GetViewport().newMousePointX += MouseX - windowMouseX;
                //GetViewport().newMousePointY += MouseY - windowMouseY;
                //setTransform();

                if (openWindow == true) {
                    getByid("WindowCustom").selected = true;
                    if (Math.abs(currY - GetViewport().originalPointY) > Math.abs(currX - GetViewport().originalPointX)) {
                        if (currY < GetViewport().originalPointY - 3)
                            GetNewViewport().windowCenter = (parseInt(GetNewViewport().windowCenter) + Math.abs(GetmouseY(e) - windowMouseY));
                        else if (currY > GetViewport().originalPointY + 3)
                            GetNewViewport().windowCenter = (parseInt(GetNewViewport().windowCenter) - Math.abs(GetmouseY(e) - windowMouseY));
                    } else {
                        if (currX < GetViewport().originalPointX - 3)
                            GetNewViewport().windowWidth = (parseInt(GetNewViewport().windowWidth) - Math.abs(GetmouseX(e) - windowMouseX));
                        else if (currX > GetViewport().originalPointX + 3)
                            GetNewViewport().windowWidth = (parseInt(GetNewViewport().windowWidth) + Math.abs(GetmouseX(e) - windowMouseX));
                    }
                    if (GetNewViewport().windowWidth < 1) GetNewViewport().windowWidth = 1;
                    getByid("textWC").value = "" + parseInt(GetNewViewport().windowCenter);
                    getByid("textWW").value = "" + parseInt(GetNewViewport().windowWidth);
                    if (openLink == true) {
                        for (var z = 0; z < Viewport_Total; z++) {
                            GetNewViewport(z).windowWidth = GetNewViewport().windowWidth;
                            GetNewViewport(z).windowCenter = GetNewViewport().windowCenter;
                        }
                    }
                    displayWindowLevel();

                    refleshViewport();
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
                displayMark();
            MouseDownCheck = rightMouseDown = false;
            magnifierDiv.hide();

            if (openLink) displayAllRuler();
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
            [GetViewport().originalPointX, GetViewport().originalPointY] = getCurrPoint(e);
            if (rightTouchDown == true && e2) {
                GetViewport().originalPointX2 = getCurrPoint(e2)[0];
                GetViewport().originalPointY2 = getCurrPoint(e2)[1];
            }
        }
        Touchmove = function (e, e2) {
            if (openDisplayMarkup && (getByid("DICOMTagsSelect").selected || getByid("AIMSelect").selected)) return;

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
                        GetNewViewport().windowCenter = (parseInt(GetNewViewport().windowCenter) + Math.abs(GetmouseY(e) - windowMouseY));
                    else if (currY > GetViewport().originalPointY + 3)
                        GetNewViewport().windowCenter = (parseInt(GetNewViewport().windowCenter) - Math.abs(GetmouseY(e) - windowMouseY));
                } else {
                    if (currX < GetViewport().originalPointX - 3)
                        GetNewViewport().windowWidth = (parseInt(GetNewViewport().windowWidth) - Math.abs(GetmouseX(e) - windowMouseX));
                    else if (currX > GetViewport().originalPointX + 3)
                        GetNewViewport().windowWidth = (parseInt(GetNewViewport().windowWidth) + Math.abs(GetmouseX(e) - windowMouseX));
                }
                if (GetNewViewport().windowWidth < 1) GetNewViewport().windowWidth = 1;
                getByid("textWC").value = "" + parseInt(GetNewViewport().windowCenter);
                getByid("textWW").value = "" + parseInt(GetNewViewport().windowWidth);
                if (openLink == true) {
                    for (var z = 0; z < Viewport_Total; z++) {
                        GetNewViewport(z).windowWidth = GetNewViewport().windowWidth;
                        GetNewViewport(z).windowCenter = GetNewViewport().windowCenter;
                    }
                }
                displayWindowLevel();

                refleshViewport();
                GetViewport().originalPointX = currX;
                GetViewport().originalPointY = currY;
                WindowOpen = true;
            }
            // putLabel();
            //  for (var i = 0; i < Viewport_Total; i++)
            //   displayRuler(i);
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