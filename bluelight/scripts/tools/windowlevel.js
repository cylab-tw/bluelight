
class WLevelTool extends ToolEvt {
    onMouseMove(e) {
        if (rightMouseDown) scale_size(e, originalPoint_X, originalPoint_Y);
        if (MouseDownCheck) {
            getByid("WindowCustom").selected = true;
            GetViewport().windowCenter = (parseInt(GetViewport().windowCenter) - (windowMouseDiffY));
            GetViewport().windowWidth = (parseInt(GetViewport().windowWidth) + (windowMouseDiffX));

            if (GetViewport().windowWidth < 1) GetViewport().windowWidth = 1;
            getByid("textWC").value = "" + parseInt(GetViewport().windowCenter);
            getByid("textWW").value = "" + parseInt(GetViewport().windowWidth);
            if (openLink == true) {
                SetAllViewport("windowWidth", GetViewport().windowWidth);
                SetAllViewport("windowCenter", GetViewport().windowCenter);
            }
            setWindowLevel();
            refleshViewport();
        }
    }
    onMouseUp(e) {
        if (rightMouseDown) displayMark();
        if (openLink) displayAllRuler();
    }
    onSwitch(e) {
        HideElemByID("WindowLevelDiv");
    }
    onTouchMove(e, e2) {
        if (!TouchDownCheck) return;
        getByid("WindowCustom").selected = true;
        GetViewport().windowCenter = (parseInt(GetViewport().windowCenter) - (windowMouseDiffY));
        GetViewport().windowWidth = (parseInt(GetViewport().windowWidth) + (windowMouseDiffX));

        if (GetViewport().windowWidth < 1) GetViewport().windowWidth = 1;
        getByid("textWC").value = "" + parseInt(GetViewport().windowCenter);
        getByid("textWW").value = "" + parseInt(GetViewport().windowWidth);
        if (openLink == true) {
            SetAllViewport("windowWidth", GetViewport().windowWidth);
            SetAllViewport("windowCenter", GetViewport().windowCenter);
        }
        setWindowLevel();
        refleshViewport();
    }
}

function windowlevel() {
    ShowElemByID(["textWC", "textWW", "WindowLevelDiv"]);
    SetTable();
    toolEvt.onSwitch();
    toolEvt = new WLevelTool();
}