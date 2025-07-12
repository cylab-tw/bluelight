
//代表正在使用旋轉工具
var openRotate = false;

class RotatelTool extends ToolEvt {
    onMouseMove(e) {
        if (rightMouseDown == true) {
            if (Math.abs(windowMouseDiffY) > Math.abs(windowMouseDiffX)) {
                if (windowMouseDiffY < - 3) GetViewport().rotate += 2;
                else if (windowMouseDiffY > 3) GetViewport().rotate -= 2;
            }
            GetViewport().rotate = (GetViewport().rotate % 360 + 360) % 360;//有考慮負值
            setTransform();
            if (openLink == true) {
                for (var z = 0; z < Viewport_Total; z++) {
                    GetViewport(z).rotate = GetViewport().rotate;
                    setTransform(z);
                }
            }
        }

        if (MouseDownCheck) {
            GetViewport().translate.x += windowMouseDiffX;
            GetViewport().translate.y += windowMouseDiffY;
            setTransform();

            if (openLink == true) {
                for (var i = 0; i < Viewport_Total; i++) {
                    try {
                        // setTransform(i);
                    } catch (ex) { }
                }
            }
        }
    }
    onMouseUp(e) {
        if (openMouseTool && rightMouseDown) displayMark();
        if (openLink) displayAllRuler();
    }
    onSwitch() {
        openRotate = false;
        openChangeFile = false;
        set_BL_model.onchange = function () { return 0; };
    }
    onTouchMove(e, e2) {
        if (rightTouchDown) {
            if (Math.abs(windowMouseDiffY) > Math.abs(windowMouseDiffX)) {
                if (windowMouseDiffY < - 3) GetViewport().rotate += 2;
                else if (windowMouseDiffY > 3) GetViewport().rotate -= 2;
            }
            GetViewport().rotate = (GetViewport().rotate % 360 + 360) % 360;//有考慮負值
            setTransform();
            if (openLink) {
                for (var z = 0; z < Viewport_Total; z++) {
                    GetViewport(z).rotate = GetViewport().rotate;
                    setTransform(z);
                }
            }
        }
        if (TouchDownCheck) {
            GetViewport().translate.x += windowMouseDiffX;
            GetViewport().translate.y += windowMouseDiffY;
            setTransform();

            if (openLink) {
                for (var i = 0; i < Viewport_Total; i++) {
                    try {
                        //setTransform(i);
                    } catch (ex) { }
                }
            }
        }
    }
}
function rotate() {
    openRotate = true;
    openChangeFile = true;
    toolEvt.onSwitch();
    toolEvt = new RotatelTool();
    /*if (BL_mode == 'rotate') {
    }*/
}