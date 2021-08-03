
function zoom() {
    if (BL_mode == 'zoom') {
        DeleteMouseEvent();
        openZoom = true;
        SetWindowWL(true);
        getByid('labelZoom').style.display = '';
        getByid('textZoom').style.display = '';
        SetTable();
        document.documentElement.onmousemove = displayZoom;
        document.documentElement.ontouchmove = displayZoom;
        set_BL_model.onchange1 = function () {
            document.documentElement.onmousemove = DivDraw;
            document.documentElement.ontouchmove = DivDraw;
            getByid('labelZoom').style.display = 'none';
            getByid('textZoom').style.display = 'none';
            openZoom = false;
            set_BL_model.onchange1 = function () { return 0; };
        }
        Mousedown = function (e) {

            if (e.which == 1) MouseDownCheck = true;
            else if (e.which == 3) rightMouseDown = true;

            windowMouseX = GetmouseX(e);
            windowMouseY = GetmouseY(e);
            GetViewport().originalPointX = getCurrPoint(e)[0];
            GetViewport().originalPointY = getCurrPoint(e)[1];
            if (MouseDownCheck == true) magnifierDiv.style.display = "";
            let angel2point = rotateCalculation(e);
            magnifierIng(angel2point[0], angel2point[1]);
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
                magnifierDiv.style.display = "";
                let angel2point = rotateCalculation(e);
                magnifierIng(angel2point[0], angel2point[1]);

                windowMouseX = GetmouseX(e);
                windowMouseY = GetmouseY(e);
                GetViewport().originalPointX = currX;
                GetViewport().originalPointY = currY;
            }
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
function displayZoom(e) {
    // x_out = -magnifierWidth / 2; // 與游標座標之水平距離
    // y_out = -magnifierHeight / 2; // 與游標座標之垂直距離
    x_out = -parseInt(magnifierCanvas.style.width) / 2; // 與游標座標之水平距離
    y_out = -parseInt(magnifierCanvas.style.height) / 2; // 與游標座標之垂直距離

    if (document.body.scrollTop && document.body.scrollTop != 0) {
        dbst = document.body.scrollTop;
        dbsl = document.body.scrollLeft;
    } else {
        dbst = document.getElementsByTagName("html")[0].scrollTop;
        dbsl = document.getElementsByTagName("html")[0].scrollLeft;
    }
    dgs = document.getElementById("magnifierDiv").style;

    y = e.clientY;
    x = e.clientX;
    if (!y || !x) {
        y = e.touches[0].clientY;
        x = e.touches[0].clientX;
    }
    if (MouseDownCheck == true || TouchDownCheck == true) {
        dgs.top = y + dbst + y_out + "px";
        dgs.left = x + dbsl + x_out + "px";
    }
}