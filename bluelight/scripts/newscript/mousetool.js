
function scale_size(e, currX, currY) {
    var viewport = GetViewport(), canvas = GetViewport().canvas;
    if (openLink == true) {
        for (var i = 0; i < Viewport_Total; i++) {
            if (i == viewportNumber) continue;
            try {
                GetViewport(i).scale = viewport.scale;
                setTransform(i);
            } catch (ex) { }
        }
    }
    if (windowMouseDiffY < -2) {
        if (viewport.scale < 10) viewport.scale += viewport.scale * 0.05;
        setTransform();
    } else if (windowMouseDiffY > 2) {
        if (viewport.scale > 0.1) viewport.scale -= viewport.scale * 0.05;
        setTransform();
    }

    if (openLink == true) {
        for (var i = 0; i < Viewport_Total; i++) {
            if (i == viewportNumber) continue;
            GetViewport(i).scale = viewport.scale;
            setTransform(i);
        }
    }
}
class MoveTool extends ToolEvt {
    onMouseMove(e) {
        var currX = getCurrPoint(e)[0];
        var currY = getCurrPoint(e)[1];

        if (rightMouseDown == true) {
            scale_size(e, currX, currY);
            setTransform();
        }

        var viewport = GetViewport();

        if (MouseDownCheck) {
            viewport.translate.x += windowMouseDiffX
            viewport.translate.y += windowMouseDiffY;
            setTransform();

            if (openLink == true) {
                for (var i = 0; i < Viewport_Total; i++) {
                    try {
                        GetViewport(i).scale = viewport.scale;
                        GetViewport(i).translate.x = viewport.translate.x;
                        GetViewport(i).translate.y = viewport.translate.y;
                        setTransform(i);
                    } catch (ex) { }
                }
            }
        }
    }
    onMouseUp(e) {
        if (rightMouseDown) displayMark();
        if (openLink) displayAllRuler();
    }

    onTouchMove(e, e2) {
        var viewport = GetViewport(), canvas = GetViewport().canvas;

        if (getByid("DICOMTagsSelect").selected) return;

        if (rightTouchDown == true && e2) {
            if (openLink == true) {
                for (var i = 0; i < Viewport_Total; i++) {
                    if (i == viewportNumber) continue;
                    try {
                        setTransform(i);
                    } catch (ex) { }
                }
            }
            if (windowTouchDistDiffY > + 2 || windowTouchDistDiffX > 2) {
                if (viewport.scale < 10) viewport.scale += viewport.scale * 0.05;
                setTransform();

            } else if (windowTouchDistDiffY < - 2 || windowTouchDistDiffX < - 2) {
                if (viewport.scale > 0.1) viewport.scale -= viewport.scale * 0.05;
                setTransform();
            }

            if (openLink == true) {
                for (var i = 0; i < Viewport_Total; i++) {
                    if (i == viewportNumber) continue;
                    GetViewport(i).scale = viewport.scale;
                    setTransform(i);
                }
            }
        }

        if (TouchDownCheck == true && rightTouchDown == false) {

            viewport.translate.x += windowMouseDiffX;
            viewport.translate.y += windowMouseDiffY;
            setTransform();

            if (openLink == true) {
                for (var i = 0; i < Viewport_Total; i++) {
                    GetViewport(i).scale = viewport.scale;
                    GetViewport(i).translate.x = viewport.translate.x;
                    GetViewport(i).translate.y = viewport.translate.y;
                    setTransform(i);
                }
            }
        }
    }
}

function mouseTool() {
    toolEvt.onSwitch();
    toolEvt = new MoveTool();
}