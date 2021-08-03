
function measure() {
    if (BL_mode == 'measure') {
        DeleteMouseEvent();
        //cancelTools();
        document.documentElement.onmousemove = displayMeasurelLabel;
        document.documentElement.ontouchmove = displayMeasurelLabel;
        cancelTools();
        openMeasure = true;
        set_BL_model.onchange1 = function () {
            getByid("MeasureLabel").style.display = 'none';
            displayMark();
            openMeasure = false;
            document.documentElement.onmousemove = DivDraw;
            document.documentElement.ontouchmove = DivDraw;
            set_BL_model.onchange1 = function () { return 0; };
        }
        Mousedown = function (e) {
            if (e.which == 1) MouseDownCheck = true;
            else if (e.which == 3) rightMouseDown = true;

            windowMouseX = GetmouseX(e);
            windowMouseY = GetmouseY(e);
            GetViewport().originalPointX = getCurrPoint(e)[0];
            GetViewport().originalPointY = getCurrPoint(e)[1];

            getByid("MeasureLabel").style.display = '';
            let angel2point = rotateCalculation(e);
            MeasureXY = angel2point;
            MeasureXY2 = angel2point;
            for (var i = 0; i < Viewport_Total; i++)
                displayMark(NowResize, null, null, null, i);
            displayMeasureRular();
        };

        Mousemove = function (e) {
            var currX = getCurrPoint(e)[0];
            var currY = getCurrPoint(e)[1];
            var labelXY = getClass('labelXY'); {
                let angel2point = rotateCalculation(e);
                labelXY[viewportNumber].innerText = "X: " + parseInt(angel2point[0]) + " Y: " + parseInt(angel2point[1]);
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
                windowMouseX = GetmouseX(e);
                windowMouseY = GetmouseY(e);

                let angel2point = rotateCalculation(e);
                MeasureXY2 = angel2point;
                for (var i = 0; i < Viewport_Total; i++)
                    displayMark(NowResize, null, null, null, i);
                displayMeasureRular();
                return;
            }
            GetViewport().originalPointX = currX;
            GetViewport().originalPointY = currY;
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
        AddMouseEvent();
    }
}

function displayMeasurelLabel(e) {
    // x_out = -magnifierWidth / 2; // 與游標座標之水平距離
    // y_out = -magnifierHeight / 2; // 與游標座標之垂直距離
    x_out = -parseInt(magnifierCanvas.style.width) / 2; // 與游標座標之水平距離
    y_out = -parseInt(magnifierCanvas.style.height) / 2; // 與游標座標之垂直距離

    if (openMeasure && (MouseDownCheck == true || TouchDownCheck == true)) {
        getByid("MeasureLabel").style.display = '';
        if (MeasureXY2[0] > MeasureXY[0])
            x_out = 20; // 與游標座標之水平距離
        else x_out = -20;
        if (MeasureXY2[1] > MeasureXY[1])
            y_out = 20; // 與游標座標之水平距離
        else y_out = -20;
    }

    if (document.body.scrollTop && document.body.scrollTop != 0) {
        dbst = document.body.scrollTop;
        dbsl = document.body.scrollLeft;
    } else {
        dbst = document.getElementsByTagName("html")[0].scrollTop;
        dbsl = document.getElementsByTagName("html")[0].scrollLeft;
    }
    dgs = document.getElementById("MeasureLabel").style;
    y = e.clientY;
    x = e.clientX;
    if (!y || !x) {
        y = e.touches[0].clientY;
        x = e.touches[0].clientX;
    }
    if (MouseDownCheck == true) {
        dgs.top = y + dbst + y_out + "px";
        dgs.left = x + dbsl + x_out + "px";
    }
    getByid("MeasureLabel").innerText = parseInt(Math.sqrt(
        Math.pow(MeasureXY2[0] / GetViewport().PixelSpacingX - MeasureXY[0] / GetViewport().PixelSpacingX, 2) +
        Math.pow(MeasureXY2[1] / GetViewport().PixelSpacingY - MeasureXY[1] / GetViewport().PixelSpacingY, 2), 2)) +
        "mm";
    if (parseInt(getByid("MeasureLabel").innerText) <= 1) getByid("MeasureLabel").style.display = "none";

}