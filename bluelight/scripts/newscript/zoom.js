
//表示現在開啟放大鏡功能
var openZoom = false;
//放大鏡元素
let magnifierDiv;

//放大鏡預設長寬
var magnifierDefaultWidth = 200;
var magnifierDefaultHeight = 200;
//放大鏡設定長寬
var magnifierWidth = 200;
var magnifierHeight = 200;


onloadFunction.push(
    function () {
        magnifierDiv = getByid("magnifierDiv");
        initMagnifier();
        getByid("zoom").onclick = function () {
            if (this.enable == false) return;
            hideAllDrawer();
            //BL_mode = 'zoom';
            set_BL_model('zoom')
            zoom();
            drawBorder(this);
        }
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
    var canvas = GetViewport().canvas;
    var zoom = parseFloat(getByid('textZoom').value);
    if ((zoom <= 25)) getByid('textZoom').value = zoom = 25;
    if (zoom >= 400) getByid('textZoom').value = zoom = 400;
    zoom /= 100;
    magnifierWidth = parseFloat(1.0 / GetViewport().scale) * (magnifierDefaultWidth / zoom);
    magnifierHeight = parseFloat(1.0 / GetViewport().scale) * (magnifierDefaultHeight / zoom);
    var magnifierCanvas = document.getElementById("magnifierCanvas");
    var magnifierCtx = magnifierCanvas.getContext("2d");
    magnifierCanvas.width = magnifierWidth;
    magnifierCanvas.height = magnifierHeight;
    magnifierCanvas.style.width = magnifierDefaultWidth + "px";
    magnifierCanvas.style.height = magnifierDefaultHeight + "px";
    magnifierCanvas.style.transform = "rotate(" + GetViewport().rotate + "deg)";
    magnifierCtx.clearRect(0, 0, magnifierWidth, magnifierHeight);

    var currX02 = Math.floor(currX) - magnifierWidth / 2;
    var currY02 = Math.floor(currY) - magnifierHeight / 2;
    magnifierCtx.drawImage(canvas, currX02, currY02, magnifierWidth, magnifierHeight, 0, 0, magnifierWidth, magnifierHeight);
    magnifierCtx.drawImage(GetViewportMark(), currX02, currY02, magnifierWidth, magnifierHeight, 0, 0, magnifierWidth, magnifierHeight);
}

function zoom() {
    if (BL_mode == 'zoom') {
        
        openZoom = true;
        refleshViewport();
        getByid('labelZoom').style.display = '';
        getByid('textZoom').style.display = '';
        SetTable();

        set_BL_model.onchange = function () {
            getByid('labelZoom').style.display = 'none';
            getByid('textZoom').style.display = 'none';
            openZoom = false;
            magnifierDiv.hide();
            set_BL_model.onchange = function () { return 0; };
        }

        BlueLightMousedownList = [];
        BlueLightMousedownList.push(function (e) {
            let angle2point = rotateCalculation(e);
            magnifierIng(angle2point[0], angle2point[1]);
            if (MouseDownCheck) magnifierDiv.show();
        });

        BlueLightMousemoveList = [];
        BlueLightMousemoveList.push(function (e) {
            if (rightMouseDown) scale_size(e, originalPoint_X, originalPoint_Y);
            if (MouseDownCheck) {
                magnifierDiv.show();
                let angle2point = rotateCalculation(e);
                magnifierIng(angle2point[0], angle2point[1]);

                dgs = document.getElementById("magnifierDiv").style;
                if (document.body.scrollTop && document.body.scrollTop != 0) {
                    dbst = document.body.scrollTop;
                    dbsl = document.body.scrollLeft;
                }
                else {
                    dbst = getByTag("html")[0].scrollTop;
                    dbsl = getByTag("html")[0].scrollLeft;
                }
                y = e.clientY; x = e.clientX;
                if (!y || !x) { y = e.touches[0].clientY; x = e.touches[0].clientX; }
                dgs.top = y + dbst + (-parseInt(magnifierCanvas.style.height) / 2) + "px";
                dgs.left = x + dbsl + (-parseInt(magnifierCanvas.style.width) / 2) + "px";
            }
        });

        BlueLightMouseupList = [];
        BlueLightMouseupList.push(function (e) {
            if (openMouseTool && rightMouseDown) displayMark();
            magnifierDiv.hide();
            if (openLink) displayAllRuler();
        });

        BlueLightTouchstartList = [];
        BlueLightTouchstartList.push(function (e, e2) {
            magnifierDiv.show();
            let angle2point = rotateCalculation(e);
            [currX11, currY11] = angle2point[0];
            magnifierIng(currX11, currY11);
        });

        BlueLightTouchmoveList = [];
        BlueLightTouchmoveList.push(function (e, e2) {
            if ((getByid("DICOMTagsSelect").selected || getByid("AIMSelect").selected)) return;
            if (TouchDownCheck == true && rightTouchDown == false) {
                magnifierDiv.show();
                let angle2point = rotateCalculation(e);
                magnifierIng(angle2point[0], angle2point[1]);
            }
        });

        BlueLightTouchendList = [];
        BlueLightTouchendList.push(function (e, e2) {
            magnifierDiv.hide();
        });
    }
}