
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

class zoomTool extends ToolEvt {

    onMouseDown(e) {
        let angle2point = rotateCalculation(e);
        magnifierIng(angle2point[0], angle2point[1]);
        // if (MouseDownCheck) magnifierDiv.show();
    }
    onMouseMove(e) {
        if (rightMouseDown) scale_size(e, originalPoint_X, originalPoint_Y);
        // if (!MouseDownCheck) return;
        magnifierDiv.show();
        let angle2point = rotateCalculation(e);
        magnifierIng(angle2point[0], angle2point[1]);

        var dgs = document.getElementById("magnifierDiv").style;
        if (document.body.scrollTop && document.body.scrollTop != 0) {
            var dbst = document.body.scrollTop;
            var dbsl = document.body.scrollLeft;
        }
        else {
            var dbst = getByTag("html")[0].scrollTop;
            var dbsl = getByTag("html")[0].scrollLeft;
        }
        var y = e.clientY, x = e.clientX;
        if (!y || !x) { y = e.touches[0].clientY; x = e.touches[0].clientX; }
        dgs.top = y + dbst + (-parseInt(magnifierCanvas.style.height) / 2) + "px";
        dgs.left = x + dbsl + (-parseInt(magnifierCanvas.style.width) / 2) + "px";
    }
    onMouseUp(e) {
        if (rightMouseDown) displayMark();
        //magnifierDiv.hide();
        if (openLink) displayAllRuler();
    }
    onSwitch() {
        getByid('labelZoom').style.display = 'none';
        getByid('textZoom').style.display = 'none';
        magnifierDiv.hide();
    }
    onTouchStart(e, e2) {
        magnifierDiv.show();
        let angle2point = rotateCalculation(e);
        [currX11, currY11] = angle2point[0];
        magnifierIng(currX11, currY11);
    }
    onTouchMove(e, e2) {
        if (getByid("DICOMTagsSelect").selected) return;
        if (TouchDownCheck == true && rightTouchDown == false) {
            magnifierDiv.show();
            let angle2point = rotateCalculation(e);
            magnifierIng(angle2point[0], angle2point[1]);
        }
    }
    onTouchEnd(e, e2) {
        magnifierDiv.hide();
    }
    onMouseEnter(viewportNum) {
        if (isNaN(viewportNum)) return;
        viewportNumber = viewportNum;
        if (GetViewport().Sop) GetViewport().reload();
        magnifierDiv.show();

    }
    onMouseOut() {
        magnifierDiv.hide();
    }
    onWheel(e) {
        var angle2point = rotateCalculation(e);
        magnifierIng(angle2point[0], angle2point[1]);
    }
}

function zoom() {

    refleshViewport();
    getByid('labelZoom').style.display = '';
    getByid('textZoom').style.display = '';
    SetTable();

    toolEvt.onSwitch();
    toolEvt = new zoomTool();
}