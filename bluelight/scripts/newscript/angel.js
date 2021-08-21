
function angel() {
    if (BL_mode == 'angel') {
        DeleteMouseEvent();
        //this.angel_=1;
        //cancelTools();
        document.documentElement.onmousemove = displayAngelLabel;
        document.documentElement.ontouchmove = displayAngelLabel;
        openAngel = 0;
        angel.angel_ = 1;
        set_BL_model.onchange1 = function () {
            getByid("AngelLabel").style.display = "none";
            displayMark();
            angel.angel_ = false;
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

            if (angel.angel_ == 3) angel.angel_ = 1;
            if (angel.angel_ == 2) getByid("AngelLabel").style.display = '';

            if (angel.angel_ == 1) {
                let angel2point = rotateCalculation(e);
                AngelXY0 = angel2point;
                AngelXY1 = angel2point;
                for (var i = 0; i < Viewport_Total; i++)
                    displayMark(NowResize, null, null, null, i);
                displayAngelRular();
            }
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
            if (angel.angel_ == 2) {
                let angel2point = rotateCalculation(e);
                AngelXY2 = angel2point;
                for (var i = 0; i < Viewport_Total; i++)
                    displayMark(NowResize, null, null, null, i);
                displayAngelRular();
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
                if (angel.angel_ == 1) {
                    let angel2point = rotateCalculation(e);
                    AngelXY0 = angel2point;
                    for (var i = 0; i < Viewport_Total; i++)
                        displayMark(NowResize, null, null, null, i);
                    displayAngelRular();
                    return;
                }
            }
            GetViewport().originalPointX = currX;
            GetViewport().originalPointY = currY;
        }
        Mouseup = function (e) {
            if (openMouseTool == true && rightMouseDown == true)
                displayMark(NowResize, null, null, null, viewportNumber);
            if (MouseDownCheck == true) {
                if (angel.angel_ == 1) angel.angel_ = 2;
                else if (angel.angel_ == 2) angel.angel_ = 3;
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
            if (angel.angel_ == 3) angel.angel_ = 1;
            if (angel.angel_ == 2) getByid("AngelLabel").style.display = '';
            if (angel.angel_ == 1) {
                let angel2point = rotateCalculation(e);
                var currX11 = angel2point[0];
                var currY11 = angel2point[1];

                AngelXY0 = [currX11, currY11];
                AngelXY1 = [currX11, currY11];
                for (var i = 0; i < Viewport_Total; i++)
                    displayMark(NowResize, null, null, null, i);
                displayAngelRular();
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
            if (angel.angel_ == 2) {
                let angel2point = rotateCalculation(e);
                var currX11 = angel2point[0];
                var currY11 = angel2point[1];
                AngelXY2 = [currX11, currY11];
                for (var i = 0; i < Viewport_Total; i++)
                    displayMark(NowResize, null, null, null, i);
                displayAngelRular();
                return;
            }
            if (angel.angel_ == 1) {
                // MeasureXY = [getCurrPoint(e)[0], getCurrPoint(e)[1]];
                let angel2point = rotateCalculation(e);
                var currX11 = angel2point[0];
                var currY11 = angel2point[1];
                AngelXY0 = [currX11, currY11];
                for (var i = 0; i < Viewport_Total; i++)
                    displayMark(NowResize, null, null, null, i);
                displayAngelRular();
                return;
            }
        }
        Touchend = function (e, e2) {
            if (TouchDownCheck == true) {
                if (angel.angel_ == 1) angel.angel_ = 2;
                else if (angel.angel_ == 2) angel.angel_ = 3;
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

function displayAngelRular() {
    if (!angel.angel_) return;
    if (parseInt(Math.sqrt(
        Math.pow(AngelXY1[0] / GetViewport().PixelSpacingX - AngelXY0[0] / GetViewport().PixelSpacingX, 2) +
        Math.pow(AngelXY1[1] / GetViewport().PixelSpacingY - AngelXY0[1] / GetViewport().PixelSpacingY, 2), 2)) <= 0) return;

    var MarkCanvas = GetViewportMark();
    var tempctx = MarkCanvas.getContext("2d");

    var lineWid = parseFloat(MarkCanvas.width) / parseFloat(Css(MarkCanvas, 'width'));

    if (lineWid <= 0) lineWid = parseFloat(Css(MarkCanvas, 'width')) / parseFloat(MarkCanvas.width);
    if (lineWid <= 1.5) lineWid = 1.5;

    tempctx.lineWidth = "" + ((Math.abs(lineWid)) * 1);

    tempctx.beginPath();
    tempctx.strokeStyle = "#00FF00";
    tempctx.fillStyle = "#00FF00";

    tempctx.moveTo(AngelXY0[0], AngelXY0[1]);
    tempctx.lineTo(AngelXY1[0], AngelXY1[1]);
    tempctx.stroke();
    if (angel.angel_ == 2) {
        tempctx.moveTo(AngelXY0[0], AngelXY0[1]);
        tempctx.lineTo(AngelXY2[0], AngelXY2[1]);
    }
    tempctx.stroke();
    tempctx.closePath();
    tempctx.beginPath();
    tempctx.strokeStyle = "#FF0000";
    tempctx.fillStyle = "#FF0000";
    tempctx.arc(AngelXY0[0], AngelXY0[1], 3, 0, 2 * Math.PI);
    tempctx.fill();

    tempctx.arc(AngelXY1[0], AngelXY1[1], 3, 0, 2 * Math.PI);
    tempctx.fill();
    if (angel.angel_ == 2) {
        tempctx.strokeStyle = "#FF0000";
        tempctx.fillStyle = "#FF0000";
        tempctx.arc(AngelXY0[0], AngelXY0[1], 3, 0, 2 * Math.PI);
        tempctx.fill();
        tempctx.arc(AngelXY2[0], AngelXY2[1], 3, 0, 2 * Math.PI);
        tempctx.fill();
    }
    tempctx.closePath();
    //displayAngelLabel();
}

function displayAngelLabel(e) {
    x_out = -parseInt(magnifierCanvas.style.width) / 2; // 與游標座標之水平距離
    y_out = -parseInt(magnifierCanvas.style.height) / 2; // 與游標座標之垂直距離
    if (angel.angel_ >= 2) {
        getByid("AngelLabel").style.display = '';
        if (AngelXY2[0] > AngelXY0[0])
            x_out = 20; // 與游標座標之水平距離
        else x_out = -20;
        if (AngelXY2[1] > AngelXY0[1])
            y_out = 20; // 與游標座標之水平距離
        else y_out = -20;
    } else {
        getByid("AngelLabel").style.display = 'none';
    }
    if (document.body.scrollTop && document.body.scrollTop != 0) {
        dbst = document.body.scrollTop;
        dbsl = document.body.scrollLeft;
    } else {
        dbst = document.getElementsByTagName("html")[0].scrollTop;
        dbsl = document.getElementsByTagName("html")[0].scrollLeft;
    }
    dgs = document.getElementById("AngelLabel").style;
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
    var angle = getAngle({
        x: AngelXY0[0] - AngelXY2[0],
        y: AngelXY0[1] - AngelXY2[1],
    }, {
        x: AngelXY0[0] - AngelXY1[0],
        y: AngelXY0[1] - AngelXY1[1],
    });
    if (angle > 180) angle = 360 - angle;
    getByid("AngelLabel").innerText = parseInt(angle) + "°";
}