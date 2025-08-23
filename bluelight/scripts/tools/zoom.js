
onloadFunction.push(
    function () {
        zoomTool.magnifierDiv = getByid("magnifierDiv");

        getByid("zoom").onclick = function () {
            if (this.enable == false) return;
            hideAllDrawer();
            zoom();
            drawBorder(this);
        }
    });

function initMagnifier() {
    var magnifierDiv = document.createElement("DIV");
    var magnifierCanvas = document.createElement("Canvas");
    magnifierDiv.id = "magnifierDiv";
    magnifierCanvas.id = "magnifierCanvas";
    magnifierDiv.appendChild(magnifierCanvas);
    document.body.appendChild(magnifierDiv);

    //設定放大鏡長寬
    getByid("magnifierCanvas").style.width = getByid("magnifierDiv").style.width = zoomTool.magnifierWidth + "px";
    getByid("magnifierCanvas").style.height = getByid("magnifierDiv").style.height = zoomTool.magnifierHeight + "px";
    getByid("magnifierCanvas").width = getByid("magnifierDiv").width = zoomTool.magnifierWidth;
    getByid("magnifierCanvas").height = getByid("magnifierDiv").height = zoomTool.magnifierHeight;

    zoomTool.magnifierDiv = document.getElementById("magnifierDiv");
    zoomTool.magnifierDiv.style.display = "none";

    zoomTool.magnifierDiv.hide = function () {
        this.style.display = "none";
    }
    zoomTool.magnifierDiv.show = function () {
        this.style.display = "";
    }
}

function magnifierIng(currX, currY) {
    var canvas = GetViewport().canvas;
    var zoom = parseFloat(getByid('textZoom').value);
    if ((zoom <= 25)) getByid('textZoom').value = zoom = 25;
    if (zoom >= 400) getByid('textZoom').value = zoom = 400;
    zoom /= 100;
    zoomTool.magnifierWidth = parseFloat(1.0 / GetViewport().scale) * (zoomTool.magnifierDefaultWidth / zoom);
    zoomTool.magnifierHeight = parseFloat(1.0 / GetViewport().scale) * (zoomTool.magnifierDefaultHeight / zoom);
    var magnifierCanvas = document.getElementById("magnifierCanvas");
    var magnifierCtx = magnifierCanvas.getContext("2d");
    magnifierCanvas.width = zoomTool.magnifierWidth;
    magnifierCanvas.height = zoomTool.magnifierHeight;
    magnifierCanvas.style.width = zoomTool.magnifierDefaultWidth + "px";
    magnifierCanvas.style.height = zoomTool.magnifierDefaultHeight + "px";
    magnifierCanvas.style.transform = "rotate(" + GetViewport().rotate + "deg)";
    magnifierCtx.clearRect(0, 0, zoomTool.magnifierWidth, zoomTool.magnifierHeight);

    var currX02 = Math.floor(currX) - zoomTool.magnifierWidth / 2;
    var currY02 = Math.floor(currY) - zoomTool.magnifierHeight / 2;
    magnifierCtx.drawImage(canvas, currX02, currY02, zoomTool.magnifierWidth, zoomTool.magnifierHeight, 0, 0, zoomTool.magnifierWidth, zoomTool.magnifierHeight);
    magnifierCtx.drawImage(GetViewportMark(), currX02, currY02, zoomTool.magnifierWidth, zoomTool.magnifierHeight, 0, 0, zoomTool.magnifierWidth, zoomTool.magnifierHeight);
}

class zoomTool extends ToolEvt {
    //放大鏡元素
    static magnifierDiv;

    //放大鏡預設長寬
    static magnifierDefaultWidth = 200;
    static magnifierDefaultHeight = 200;
    //放大鏡設定長寬
    static magnifierWidth = 200;
    static magnifierHeight = 200;
    onMouseDown(e) {
        let angle2point = rotateCalculation(e);
        magnifierIng(angle2point[0], angle2point[1]);
    }
    onMouseMove(e) {
        if (rightMouseDown) scale_size(e, originalPoint_X, originalPoint_Y);
        zoomTool.magnifierDiv.show();
        let angle2point = rotateCalculation(e);
        magnifierIng(angle2point[0], angle2point[1]);

        var dbst, dbsl, dgs = document.getElementById("magnifierDiv").style;
        if (document.body.scrollTop && document.body.scrollTop != 0)
            dbst = document.body.scrollTop, dbsl = document.body.scrollLeft;
        else
            dbst = getByTag("html")[0].scrollTop, dbsl = getByTag("html")[0].scrollLeft;

        var y = e.clientY, x = e.clientX;
        if (!y || !x) { y = e.touches[0].clientY; x = e.touches[0].clientX; }
        dgs.top = y + dbst + (-parseInt(magnifierCanvas.style.height) / 2) + "px";
        dgs.left = x + dbsl + (-parseInt(magnifierCanvas.style.width) / 2) + "px";
    }
    onMouseUp(e) {
        if (rightMouseDown) displayMark();
        if (openLink) displayAllRuler();
    }
    onSwitch() {
        getByid('labelZoom').style.display = 'none';
        getByid('textZoom').style.display = 'none';
        getByid("magnifierDiv").removeChild(getByid("magnifierCanvas"));
        document.body.removeChild(getByid("magnifierDiv"));
    }
    onTouchStart(e, e2) {
        zoomTool.magnifierDiv.show();
        let angle2point = rotateCalculation(e);
        magnifierIng(angle2point[0], angle2point[1]);
    }
    onTouchMove(e, e2) {
        if (getByid("DICOMTagsSelect").selected) return;
        if (TouchDownCheck == true && rightTouchDown == false) {
            var dbst, dbsl, dgs = document.getElementById("magnifierDiv").style;
            if (document.body.scrollTop && document.body.scrollTop != 0)
                dbst = document.body.scrollTop, dbsl = document.body.scrollLeft;
            else
                dbst = getByTag("html")[0].scrollTop, dbsl = getByTag("html")[0].scrollLeft;
            var y = e.clientY, x = e.clientX;
            if (!y || !x) { y = e.touches[0].clientY; x = e.touches[0].clientX; }
            dgs.top = y + dbst + (-parseInt(magnifierCanvas.style.height) / 2) + "px";
            dgs.left = x + dbsl + (-parseInt(magnifierCanvas.style.width) / 2) + "px";

            zoomTool.magnifierDiv.show();
            let angle2point = rotateCalculation(e);
            magnifierIng(angle2point[0], angle2point[1]);
        }
    }
    onTouchEnd(e, e2) {
        zoomTool.magnifierDiv.hide();
    }
    onMouseEnter(viewportNum) {
        if (isNaN(viewportNum)) return;
        viewportNumber = viewportNum;
        zoomTool.magnifierDiv.show();
    }
    onMouseOut() {
        zoomTool.magnifierDiv.hide();
    }
    onWheel(e) {
        var angle2point = rotateCalculation(e);
        magnifierIng(angle2point[0], angle2point[1]);
    }
}

function zoom() {

    initMagnifier();
    refleshViewport();
    getByid('labelZoom').style.display = '';
    getByid('textZoom').style.display = '';
    SetTable();

    toolEvt.onSwitch();
    toolEvt = new zoomTool();
}