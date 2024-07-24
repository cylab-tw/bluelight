
//表示按下WindowLevel調整
var openWindow = false;

//表示現在正在調整WindowLevel
var WindowOpen = false;

function windowlevel() {
    if (BL_mode == 'windowlevel') {
        DeleteMouseEvent();
        ShowElemByID(["textWC", "textWW", "WindowLevelDiv"]);
        openWindow = true;

        set_BL_model.onchange = function () {
            openWindow = false;
            HideElemByID("WindowLevelDiv");
            set_BL_model.onchange = function () { return 0; };
        }

        SetTable();

        BlueLightMousedownList = [];

        BlueLightMousemoveList = [];
        BlueLightMousemoveList.push(function (e) {
            if (rightMouseDown) scale_size(e, originalPoint_X, originalPoint_Y);

            if (MouseDownCheck) {
                if (openWindow == true) {
                    getByid("WindowCustom").selected = true;
                    if (Math.abs(windowMouseDiffY) > Math.abs(windowMouseDiffX)) {
                        if (windowMouseDiffY < - 3)
                            GetViewport().windowCenter = (parseInt(GetViewport().windowCenter) + Math.abs(windowMouseDiffY));
                        else if (windowMouseDiffY > 3)
                            GetViewport().windowCenter = (parseInt(GetViewport().windowCenter) - Math.abs(windowMouseDiffY));
                    } else {
                        if (windowMouseDiffX < - 3)
                            GetViewport().windowWidth = (parseInt(GetViewport().windowWidth) - Math.abs(windowMouseDiffX));
                        else if (windowMouseDiffX > 3)
                            GetViewport().windowWidth = (parseInt(GetViewport().windowWidth) + Math.abs(windowMouseDiffX));
                    }
                    if (GetViewport().windowWidth < 1) GetViewport().windowWidth = 1;
                    getByid("textWC").value = "" + parseInt(GetViewport().windowCenter);
                    getByid("textWW").value = "" + parseInt(GetViewport().windowWidth);
                    if (openLink == true) {
                        for (var z = 0; z < Viewport_Total; z++) {
                            GetViewport(z).windowWidth = GetViewport().windowWidth;
                            GetViewport(z).windowCenter = GetViewport().windowCenter;
                        }
                    }
                    displayWindowLevel();
                    refleshViewport();
                    WindowOpen = true;
                }
            }
        });

        BlueLightMouseupList = [];
        BlueLightMouseupList.push(function (e) {
            if (openMouseTool && rightMouseDown) displayMark();
            if (openLink) displayAllRuler();
        });

        BlueLightTouchstartList = [];

        BlueLightTouchmoveList = [];
        BlueLightTouchmoveList.push(function (e, e2) {
            if ((getByid("DICOMTagsSelect").selected || getByid("AIMSelect").selected)) return;

            if (TouchDownCheck && openWindow) {
                getByid("WindowCustom").selected = true;
                if (Math.abs(windowMouseDiffY) > Math.abs(windowMouseDiffX)) {
                    if (windowMouseDiffY < - 3)
                        GetViewport().windowCenter = (parseInt(GetViewport().windowCenter) + Math.abs(windowMouseDiffY));
                    else if (windowMouseDiffY > 3)
                        GetViewport().windowCenter = (parseInt(GetViewport().windowCenter) - Math.abs(windowMouseDiffY));
                } else {
                    if (windowMouseDiffX < - 3)
                        GetViewport().windowWidth = (parseInt(GetViewport().windowWidth) - Math.abs(windowMouseDiffX));
                    else if (windowMouseDiffX > 3)
                        GetViewport().windowWidth = (parseInt(GetViewport().windowWidth) + Math.abs(windowMouseDiffX));
                }
                if (GetViewport().windowWidth < 1) GetViewport().windowWidth = 1;
                getByid("textWC").value = "" + parseInt(GetViewport().windowCenter);
                getByid("textWW").value = "" + parseInt(GetViewport().windowWidth);
                if (openLink == true) {
                    for (var z = 0; z < Viewport_Total; z++) {
                        GetViewport(z).windowWidth = GetViewport().windowWidth;
                        GetViewport(z).windowCenter = GetViewport().windowCenter;
                    }
                }
                displayWindowLevel();
                refleshViewport();
                WindowOpen = true;
            }
        });

        AddMouseEvent();
    }
}