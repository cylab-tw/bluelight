
function scale_size(e, currX, currY) {
    var viewport = GetViewport();
    var previousScale = viewport.scale;

    if (windowMouseDiffY < 0 && viewport.scale < 10 && (Math.abs(windowMouseDiffX) < Math.abs((windowMouseDiffY))))
        viewport.scale += viewport.scale * 0.05;
    else if (windowMouseDiffY > 0 && viewport.scale > 0.1 && (Math.abs(windowMouseDiffX) < Math.abs((windowMouseDiffY))))
        viewport.scale -= viewport.scale * 0.05;

    if (openLink == true && viewport.scale != previousScale) {
        // 只套用縮放比例。
        var scaleRatio = viewport.scale / previousScale;
        for (var i = 0; i < Viewport_Total; i++) {
            if (i != viewport.index && GetViewport(i).scale > 0)
                GetViewport(i).scale *= scaleRatio;
        }
        setTransformAll();
    }
    else setTransform();
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

        if (rightTouchDown == true && e2) {
            var previousScale = viewport.scale;
            if (windowMouseDiffY < 0 && viewport.scale < 10)
                viewport.scale += viewport.scale * 0.05;
            else if (windowMouseDiffY > 0 && viewport.scale > 0.1)
                viewport.scale -= viewport.scale * 0.05;

            if (openLink == true && viewport.scale != previousScale) {
                // 只套用縮放比例。
                var scaleRatio = viewport.scale / previousScale;
                for (var i = 0; i < Viewport_Total; i++) {
                    if (i != viewport.index && GetViewport(i).scale > 0)
                        GetViewport(i).scale *= scaleRatio;
                }
                setTransformAll();
            }
            else setTransform();
        }

        if (TouchDownCheck == true && rightTouchDown == false) {

            viewport.translate.x += windowMouseDiffX;
            viewport.translate.y += windowMouseDiffY;
            setTransform();

            if (openLink == true) {
                for (var i = 0; i < Viewport_Total; i++) {
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