
function angle() {
    if (BL_mode == 'angle') {
        DeleteMouseEvent();
        //this.angle_=1;
        //cancelTools();
        document.documentElement.onmousemove = displayAngleLabel;
        document.documentElement.ontouchmove = displayAngleLabel;
        openAngle = 0;
        angle.angle_ = 1;
        set_BL_model.onchange1 = function () {
            getByid("AngleLabel").style.display = "none";
            displayMark();
            angle.angle_ = false;
            // document.documentElement.onmousemove = DivDraw;
            // document.documentElement.ontouchmove = DivDraw;
            set_BL_model.onchange1 = function () { return 0; };
        }
        Mousedown = function (e) {
            if (e.which == 1) MouseDownCheck = true;
            else if (e.which == 3) rightMouseDown = true;

            windowMouseX = GetmouseX(e);
            windowMouseY = GetmouseY(e);
            GetViewport().originalPointX = getCurrPoint(e)[0];
            GetViewport().originalPointY = getCurrPoint(e)[1];

            if (angle.angle_ == 3) angle.angle_ = 1;
            if (angle.angle_ == 2) getByid("AngleLabel").style.display = '';

            if (angle.angle_ == 1) {
                let angle2point = rotateCalculation(e);
                AngleXY0 = angle2point;
                AngleXY1 = angle2point;
                for (var i = 0; i < Viewport_Total; i++)
                    displayMark(i);
                displayAngleRular();
            }
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
            if (angle.angle_ == 2) {
                let angle2point = rotateCalculation(e);
                AngleXY2 = angle2point;
                for (var i = 0; i < Viewport_Total; i++)
                    displayMark(i);
                displayAngleRular();
                return;
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
                if (angle.angle_ == 1) {
                    let angle2point = rotateCalculation(e);
                    AngleXY0 = angle2point;
                    for (var i = 0; i < Viewport_Total; i++)
                        displayMark(i);
                    displayAngleRular();
                    return;
                }
            }
            GetViewport().originalPointX = currX;
            GetViewport().originalPointY = currY;
        }
        Mouseup = function (e) {
            if (openMouseTool == true && rightMouseDown == true)
                displayMark(viewportNumber);
            if (MouseDownCheck == true) {
                if (angle.angle_ == 1) angle.angle_ = 2;
                else if (angle.angle_ == 2) angle.angle_ = 3;
            }
            MouseDownCheck = false;
            rightMouseDown = false;
        }
        Touchstart = function (e, e2) {
            if (openVR == true) return;
            if (!e2) TouchDownCheck = true;
            else rightTouchDown = true;
            windowMouseX = GetmouseX(e);
            windowMouseY = GetmouseY(e);
            if (rightTouchDown == true && e2) {
                windowMouseX2 = GetmouseX(e2);
                windowMouseY2 = GetmouseY(e2);
            }
            GetViewport().originalPointX = getCurrPoint(e)[0];
            GetViewport().originalPointY = getCurrPoint(e)[1];
            if (rightTouchDown == true && e2) {
                GetViewport().originalPointX2 = getCurrPoint(e2)[0];
                GetViewport().originalPointY2 = getCurrPoint(e2)[1];
            }
            if (angle.angle_ == 3) angle.angle_ = 1;
            if (angle.angle_ == 2) getByid("AngleLabel").style.display = '';
            if (angle.angle_ == 1) {
                let angle2point = rotateCalculation(e);
                var currX11 = angle2point[0];
                var currY11 = angle2point[1];

                AngleXY0 = [currX11, currY11];
                AngleXY1 = [currX11, currY11];
                for (var i = 0; i < Viewport_Total; i++)
                    displayMark(i);
                displayAngleRular();
            }
        }
        Touchmove = function (e, e2) {
            if (openDisplayMarkup && (getByid("DICOMTagsSelect").selected || getByid("AIMSelect").selected)) return;
            if (openVR == true) return;
            var currX = getCurrPoint(e)[0];
            var currY = getCurrPoint(e)[1];
            if (e2) {
                var currX2 = getCurrPoint(e2)[0];
                var currY2 = getCurrPoint(e2)[1];
            }
            var labelXY = getClass('labelXY');
            labelXY[viewportNumber].innerText = "X: " + Math.floor(currX) + " Y: " + Math.floor(currY);
            if (angle.angle_ == 2) {
                let angle2point = rotateCalculation(e);
                var currX11 = angle2point[0];
                var currY11 = angle2point[1];
                AngleXY2 = [currX11, currY11];
                for (var i = 0; i < Viewport_Total; i++)
                    displayMark(i);
                displayAngleRular();
                return;
            }
            if (angle.angle_ == 1) {
                // MeasureXY = [getCurrPoint(e)[0], getCurrPoint(e)[1]];
                let angle2point = rotateCalculation(e);
                var currX11 = angle2point[0];
                var currY11 = angle2point[1];
                AngleXY0 = [currX11, currY11];
                for (var i = 0; i < Viewport_Total; i++)
                    displayMark(i);
                displayAngleRular();
                return;
            }
        }
        Touchend = function (e, e2) {
            if (TouchDownCheck == true) {
                if (angle.angle_ == 1) angle.angle_ = 2;
                else if (angle.angle_ == 2) angle.angle_ = 3;
            }
            TouchDownCheck = false;
            rightTouchDown = false;
            if (openVR == true) return;
            magnifierDiv.style.display = "none";
            displayMeasureRular();
        }
        AddMouseEvent();
    }
}

function displayAngleRular() {
    if (!angle.angle_) return;
    if (parseInt(Math.sqrt(
        Math.pow(AngleXY1[0] / GetViewport().PixelSpacingX - AngleXY0[0] / GetViewport().PixelSpacingX, 2) +
        Math.pow(AngleXY1[1] / GetViewport().PixelSpacingY - AngleXY0[1] / GetViewport().PixelSpacingY, 2), 2)) <= 0) return;

    var MarkCanvas = GetViewportMark();
    var tempctx = MarkCanvas.getContext("2d");

    var lineWid = parseFloat(MarkCanvas.width) / parseFloat(Css(MarkCanvas, 'width'));

    if (lineWid <= 0) lineWid = parseFloat(Css(MarkCanvas, 'width')) / parseFloat(MarkCanvas.width);
    if (lineWid <= 1.5) lineWid = 1.5;

    tempctx.lineWidth = "" + ((Math.abs(lineWid)) * 1);

    tempctx.beginPath();
    tempctx.strokeStyle = "#00FF00";
    tempctx.fillStyle = "#00FF00";

    tempctx.moveTo(AngleXY0[0], AngleXY0[1]);
    tempctx.lineTo(AngleXY1[0], AngleXY1[1]);
    tempctx.stroke();
    if (angle.angle_ == 2) {
        tempctx.moveTo(AngleXY0[0], AngleXY0[1]);
        tempctx.lineTo(AngleXY2[0], AngleXY2[1]);
    }
    tempctx.stroke();
    tempctx.closePath();
    tempctx.beginPath();
    tempctx.strokeStyle = "#FF0000";
    tempctx.fillStyle = "#FF0000";
    tempctx.arc(AngleXY0[0], AngleXY0[1], 3, 0, 2 * Math.PI);
    tempctx.fill();

    tempctx.arc(AngleXY1[0], AngleXY1[1], 3, 0, 2 * Math.PI);
    tempctx.fill();
    if (angle.angle_ == 2) {
        tempctx.strokeStyle = "#FF0000";
        tempctx.fillStyle = "#FF0000";
        tempctx.arc(AngleXY0[0], AngleXY0[1], 3, 0, 2 * Math.PI);
        tempctx.fill();
        tempctx.arc(AngleXY2[0], AngleXY2[1], 3, 0, 2 * Math.PI);
        tempctx.fill();
    }
    tempctx.closePath();
    //displayAngleLabel();
}

function displayAngleLabel(e) {
    if (!angle.angle_) return;
    x_out = -parseInt(magnifierCanvas.style.width) / 2; // 與游標座標之水平距離
    y_out = -parseInt(magnifierCanvas.style.height) / 2; // 與游標座標之垂直距離
    if (angle.angle_ >= 2) {
        getByid("AngleLabel").style.display = '';
        if (AngleXY2[0] > AngleXY0[0])
            x_out = 20; // 與游標座標之水平距離
        else x_out = -20;
        if (AngleXY2[1] > AngleXY0[1])
            y_out = 20; // 與游標座標之水平距離
        else y_out = -20;
    } else {
        getByid("AngleLabel").style.display = 'none';
    }
    if (document.body.scrollTop && document.body.scrollTop != 0) {
        dbst = document.body.scrollTop;
        dbsl = document.body.scrollLeft;
    } else {
        dbst = document.getElementsByTagName("html")[0].scrollTop;
        dbsl = document.getElementsByTagName("html")[0].scrollLeft;
    }
    dgs = document.getElementById("AngleLabel").style;
    y = e.clientY;
    x = e.clientX;
    if (!y || !x) {
        y = e.touches[0].clientY;
        x = e.touches[0].clientX;
    }
    dgs.top = y + dbst + y_out + "px";
    dgs.left = x + dbsl + x_out + "px";
    var getAngle = ({
        x: x1,
        y: y1
    }, {
        x: x2,
        y: y2
    }) => {
        const dot = x1 * x2 + y1 * y2
        const det = x1 * y2 - y1 * x2
        const angle = Math.atan2(det, dot) / Math.PI * 180
        return (angle + 360) % 360
    }
    var angle1 = getAngle({
        x: AngleXY0[0] - AngleXY2[0],
        y: AngleXY0[1] - AngleXY2[1],
    }, {
        x: AngleXY0[0] - AngleXY1[0],
        y: AngleXY0[1] - AngleXY1[1],
    });
    if (angle1 > 180) angle1 = 360 - angle1;
    getByid("AngleLabel").innerText = parseInt(angle1) + "°";
}