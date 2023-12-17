
//放大鏡元素
let magnifierDiv;

onloadFunction.push(
    function () {
        magnifierDiv = getByid("magnifierDiv");
        initMagnifier();
    });

function initMagnifier() {
    //設定放大鏡長寬
    getByid("magnifierCanvas").style.width = getByid("magnifierDiv").style.width = magnifierWidth + "px";
    getByid("magnifierCanvas").style.height = getByid("magnifierDiv").style.height = magnifierHeight + "px";
    getByid("magnifierCanvas").width = getByid("magnifierDiv").width = magnifierWidth;
    getByid("magnifierCanvas").height = getByid("magnifierDiv").height = magnifierHeight;

    magnifierDiv = document.getElementById("magnifierDiv");
    magnifierDiv.style.display = "none";

    magnifierDiv.hide = function () {
        this.style.display = "none";
    }
    magnifierDiv.show = function () {
        this.style.display = "";
    }
}

function magnifierIng(currX, currY) {
    var canvas = GetViewport().canvas();
    var zoom = parseFloat(getByid('textZoom').value);
    if ((zoom <= 25)) getByid('textZoom').value = zoom = 25;
    if (zoom >= 400) getByid('textZoom').value = zoom = 400;
    zoom /= 100;
    magnifierWidth = parseFloat(GetViewport().imageWidth / parseFloat(canvas.style.width)) * (magnifierWidth0 / zoom);
    magnifierHeight = parseFloat(GetViewport().imageHeight / parseFloat(canvas.style.height)) * (magnifierHeight0 / zoom);
    var magnifierCanvas = document.getElementById("magnifierCanvas");
    var magnifierCtx = magnifierCanvas.getContext("2d");
    magnifierCanvas.width = magnifierWidth;
    magnifierCanvas.height = magnifierHeight;
    magnifierCanvas.style.width = magnifierWidth0 + "px";
    magnifierCanvas.style.height = magnifierHeight0 + "px";
    magnifierCanvas.style.transform = "rotate(" + GetViewport().rotateValue + "deg)";
    magnifierCtx.clearRect(0, 0, magnifierWidth, magnifierHeight);

    var currX02 = Math.floor(currX) - magnifierWidth / 2;
    var currY02 = Math.floor(currY) - magnifierHeight / 2;
    magnifierCtx.drawImage(canvas, currX02, currY02, magnifierWidth, magnifierHeight, 0, 0, magnifierWidth, magnifierHeight);
    magnifierCtx.drawImage(GetViewportMark(), currX02, currY02, magnifierWidth, magnifierHeight, 0, 0, magnifierWidth, magnifierHeight);
}

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
            if (MouseDownCheck == true) magnifierDiv.show();
            let angle2point = rotateCalculation(e);
            magnifierIng(angle2point[0], angle2point[1]);
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
            if (openLink == true) {
                for (var i = 0; i < Viewport_Total; i++) {
                    GetViewport(i).newMousePointX = GetViewport().newMousePointX;
                    GetViewport(i).newMousePointY = GetViewport().newMousePointY;
                }
            }
            putLabel();
            for (var i = 0; i < Viewport_Total; i++)
                displayRuler(i);

            if (MouseDownCheck) {
                magnifierDiv.show();;
                let angle2point = rotateCalculation(e);
                magnifierIng(angle2point[0], angle2point[1]);

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
                displayMark();
            MouseDownCheck = false;
            rightMouseDown = false;
            magnifierDiv.hide();

            if (openLink) {
                for (var i = 0; i < Viewport_Total; i++)
                    displayRuler(i);
            }
        }

        Touchstart = function (e, e2) {

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
            //  if (openZoom == true && MouseDownCheck == true)
            {
                magnifierDiv.show();;
                let angle2point = rotateCalculation(e);
                var currX11 = angle2point[0];
                var currY11 = angle2point[1];
                magnifierIng(currX11, currY11);
            }
        }
        Touchmove = function (e, e2) {
            //尚未完成
            if (openDisplayMarkup && (getByid("DICOMTagsSelect").selected || getByid("AIMSelect").selected)) return;

            var currX = getCurrPoint(e)[0];
            var currY = getCurrPoint(e)[1];
            if (e2) {
                var currX2 = getCurrPoint(e2)[0];
                var currY2 = getCurrPoint(e2)[1];
            }
            var labelXY = getClass('labelXY');
            labelXY[viewportNumber].innerText = "X: " + Math.floor(currX) + " Y: " + Math.floor(currY);
            if (TouchDownCheck == true && rightTouchDown == false) {
                if (/*openZoom == true && */rightTouchDown == false) {
                    magnifierDiv.show();;
                    let angle2point = rotateCalculation(e);
                    var currX11 = angle2point[0];
                    var currY11 = angle2point[1];
                    magnifierIng(currX11, currY11);
                }
            }
        }
        Touchend = function (e, e2) {
            if (TouchDownCheck == true) {
                if (openAngle == 1) openAngle = 2;
                else if (openAngle == 2) openAngle = 3;
            }
            TouchDownCheck = false;
            rightTouchDown = false;

            magnifierDiv.hide();

        }
        // Touchstart = function (e, e2) {}
        // Touchmove = function (e, e2) {}
        // Touchend = function (e, e2) {}
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
    if (e.touches && (!y || !x)) {
        y = e.touches[0].clientY;
        x = e.touches[0].clientX;
    }
    if (MouseDownCheck == true || TouchDownCheck == true) {
        dgs.top = y + dbst + y_out + "px";
        dgs.left = x + dbsl + x_out + "px";
    }
}