
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

        BlueLightMousedownList = [];

        Mousemove = function (e) {
            var currX = getCurrPoint(e)[0];
            var currY = getCurrPoint(e)[1];

            if (rightMouseDown == true) scale_size(e, currX, currY);

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

        BlueLightTouchstartList = [];

        Touchmove = function (e, e2) {
            if (openDisplayMarkup && (getByid("DICOMTagsSelect").selected || getByid("AIMSelect").selected)) return;

            var currX = getCurrPoint(e)[0];
            var currY = getCurrPoint(e)[1];
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