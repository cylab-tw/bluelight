
class RotatelTool extends ToolEvt {
    onMouseMove(e) {
        if (rightMouseDown == true) {
            GetViewport().rotate += parseInt(windowMouseDiffY / 2);
            GetViewport().rotate = (GetViewport().rotate % 360 + 360) % 360; //有考慮負值
            setTransform();
            if (openLink == true) {
                SetAllViewport("rotate", GetViewport().rotate);
                setTransformAll();
            }
        }

        if (MouseDownCheck) {
            GetViewport().translate.x += windowMouseDiffX;
            GetViewport().translate.y += windowMouseDiffY;
            setTransform();
        }
    }
    onMouseUp(e) {
        if (rightMouseDown) displayMark();
        if (openLink) displayAllRuler();
    }

    onTouchMove(e, e2) {
        if (rightTouchDown) {
            GetViewport().rotate += parseInt(windowMouseDiffY / 2);
            GetViewport().rotate = (GetViewport().rotate % 360 + 360) % 360; //有考慮負值
            setTransform();
            if (openLink) {
                SetAllViewport("rotate", GetViewport().rotate);
                setTransformAll();
            }
        }
        if (TouchDownCheck) {
            GetViewport().translate.x += windowMouseDiffX;
            GetViewport().translate.y += windowMouseDiffY;
            setTransform();
        }
    }
}
function rotate() {
    toolEvt.onSwitch();
    toolEvt = new RotatelTool();
}