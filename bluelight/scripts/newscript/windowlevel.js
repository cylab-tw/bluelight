
//表示按下WindowLevel調整
var openWindow = false;

//表示現在正在調整WindowLevel
var WindowOpen = false;

class WLevelTool extends ToolEvt {
    onMouseMove(e) {
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
                setWindowLevel();
                refleshViewport();
                WindowOpen = true;
            }
        }
    }
    onMouseUp(e) {
        if (openMouseTool && rightMouseDown) displayMark();
        if (openLink) displayAllRuler();
    }
    onSwitch(e) {
        openWindow = false;
        HideElemByID("WindowLevelDiv");
        set_BL_model.onchange = function () { return 0; };
    }
    onTouchMove(e, e2) {
        if (getByid("DICOMTagsSelect").selected) return;

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
            setWindowLevel();
            refleshViewport();
            WindowOpen = true;
        }
    }
}

function windowlevel() {

    ShowElemByID(["textWC", "textWW", "WindowLevelDiv"]);
    openWindow = true;
    SetTable();
    toolEvt.onSwitch();
    toolEvt = new WLevelTool();


    /*if (BL_mode == 'windowlevel') {
    }*/
}