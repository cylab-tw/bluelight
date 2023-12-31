function cancelTools() {
    openMouseTool = false;
    openWindow = false;
    openZoom = false;
    openMeasure = false;
    openWheel = false;
    openRotate = false;
    openAngle = 0;
    getByid("textWC").style.display = "none";
    getByid("textWW").style.display = "none";
    magnifierDiv.style.display = "none";
    getByid("MeasureLabel").style.display = "none";
    getByid("AngleLabel").style.display = "none";
    getByid("WindowLevelDiv").style.display = "none";
    getByid("labelZoom").style.display = "none";
    getByid("labelPlay").style.display = "none";
    getByid("textZoom").style.display = "none";
    getByid("textPlay").style.display = "none";
    getByid('playvideo').src = '../image/icon/black/b_CinePlay.png';
    getByid("WindowDefault").selected = true;
    displayWindowLevel();
    displayMark();
    for (var i = 0; i < Viewport_Total; i++) {
        GetViewport(i).openPlay = false;
    }
    PlayTimer();
}

function displayRuler(viewportNum = viewportNumber) {
    try {
        var downRule = getClass("downRule");
        var offsetWidth = GetViewport(viewportNum).offsetWidth;
        downRule[viewportNum].width = offsetWidth;
        downRule[viewportNum].style.left = '50%';
        downRule[viewportNum].style.transform = 'translateX(-50%)';

        var tempctx = downRule[viewportNum].getContext("2d");
        tempctx.clearRect(0, 0, offsetWidth, 20);
        tempctx.strokeStyle = "#FFFFFF";
        tempctx.lineWidth = "2";
        tempctx.beginPath();
        var x1 = 0;
        var y1 = 0;
        var canvas = GetViewport(viewportNum).canvas();
        tempctx.moveTo(0 + (offsetWidth / 2) - (40 * GetNewViewport(viewportNum).transform.PixelSpacingX) * (parseFloat(canvas.style.width) / GetViewport(viewportNum).imageWidth), 10);
        tempctx.lineTo((90 * GetNewViewport(viewportNum).transform.PixelSpacingX) * (parseFloat(canvas.style.width) / GetViewport(viewportNum).imageWidth) + (offsetWidth / 2) - (40 * GetNewViewport(viewportNum).transform.PixelSpacingX) * (parseFloat(canvas.style.width) / GetViewport(viewportNum).imageWidth), 10);
        for (var i = 0; i < 10; i++) {
            tempctx.moveTo(x1 + (offsetWidth / 2) - (40 * GetNewViewport(viewportNum).transform.PixelSpacingX) * (parseFloat(canvas.style.width) / GetViewport(viewportNum).imageWidth), y1);
            tempctx.lineTo(x1 + (offsetWidth / 2) - (40 * GetNewViewport(viewportNum).transform.PixelSpacingX) * (parseFloat(canvas.style.width) / GetViewport(viewportNum).imageWidth), y1 + 20);
            tempctx.stroke();
            x1 += (10 * GetNewViewport(viewportNum).transform.PixelSpacingX) * (parseFloat(canvas.style.width) / GetViewport(viewportNum).imageWidth);
        }
        tempctx.closePath();
    } catch (ex) { }
    displayRuler2(viewportNum);
}

function displayRuler2(viewportNum = viewportNumber) {

    try {
        var leftRule = getClass("leftRule");
        var offsetHeight = GetViewport(viewportNum).offsetHeight;
        leftRule[viewportNum].height = offsetHeight;
        leftRule[viewportNum].style.left = 10 + bordersize + "px";
        leftRule[viewportNum].style.top = '50%';
        leftRule[viewportNum].style.transform = 'translateY(-50%)';
        var tempctx = leftRule[viewportNum].getContext("2d");
        var canvas = GetViewport(viewportNum).canvas();
        tempctx.clearRect(0, 0, 20, offsetHeight);
        tempctx.strokeStyle = "#FFFFFF";
        tempctx.lineWidth = "2";
        tempctx.beginPath();
        var x1 = 0;
        var y1 = 0;
        tempctx.moveTo(0, 0 + (offsetHeight / 2) - (40 * GetNewViewport(viewportNum).transform.PixelSpacingY) * (parseFloat(canvas.style.height) / GetViewport(viewportNum).imageHeight));
        tempctx.lineTo(0, (90 * GetNewViewport(viewportNum).transform.PixelSpacingY) * (parseFloat(canvas.style.height) / GetViewport(viewportNum).imageHeight) - (40 * GetNewViewport(viewportNum).transform.PixelSpacingY) * (parseFloat(canvas.style.height) / GetViewport(viewportNum).imageHeight) + (offsetHeight / 2));
        tempctx.stroke();
        for (var i = 0; i < 10; i++) {
            tempctx.moveTo(x1, y1 + (offsetHeight / 2) - (40 * GetNewViewport(viewportNum).transform.PixelSpacingY) * (parseFloat(canvas.style.height) / GetViewport(viewportNum).imageHeight));
            tempctx.lineTo(x1 + 20, y1 + (offsetHeight / 2) - (40 * GetNewViewport(viewportNum).transform.PixelSpacingY) * (parseFloat(canvas.style.height) / GetViewport(viewportNum).imageHeight));
            tempctx.stroke();
            y1 += (10 * GetNewViewport(viewportNum).transform.PixelSpacingY) * (parseFloat(canvas.style.height) / GetViewport(viewportNum).imageHeight);
        }
        tempctx.closePath();
    } catch (ex) { }
}

function resetViewport(viewportNum = viewportNumber) {
    GetViewport(viewportNum).NowCanvasSizeWidth = GetViewport(viewportNum).NowCanvasSizeHeight = null;
    GetViewport(viewportNum).newMousePointX = GetViewport(viewportNum).newMousePointY = GetViewport().rotateValue = 0;
    GetNewViewport(viewportNum).windowCenter = GetNewViewport(viewportNum).windowWidth = null;
    GetNewViewport(viewportNum).invert = GetNewViewport(viewportNum).HorizontalFlip = GetNewViewport(viewportNum).VerticalFlip = false;
    GetNewViewport(viewportNum).transform = {};

    if (GetViewport(viewportNum).framesNumber != undefined) GetViewport(viewportNum).framesNumber = 0;
}

function resetAndLoadImg(viewportNum = viewportNumber, dontLoad = false) {

    for (var z = 0; z < Viewport_Total; z++) {
        if (openLink == false) z = viewportNum;
        var viewport = GetViewport(z);
        var Newviewport = GetNewViewport(z);

        viewport.NowCanvasSizeWidth = viewport.NowCanvasSizeHeight = null;
        Newviewport.windowCenter = Newviewport.windowWidth = null;
        viewport.newMousePointX = viewport.newMousePointY = GetViewport().rotateValue = 0;

        GetNewViewport(z).VerticalFlip = GetNewViewport(z).HorizontalFlip = GetNewViewport(z).invert = false;
        if (getByid("removeRuler")) getByid("removeRuler").onclick();

        if (dontLoad == false) GetNewViewport(z).reloadImg();
        if (openLink == false) break;
    }
}

function refleshViewport() {
    if (openLink == true) {
        for (var z = 0; z < Viewport_Total; z++) {
            GetNewViewport(z).VerticalFlip = GetNewViewport().VerticalFlip;
            GetNewViewport(z).HorizontalFlip = GetNewViewport().HorizontalFlip;
            GetNewViewport(z).windowCenter = GetNewViewport().windowCenter;
            GetNewViewport(z).windowWidth = GetNewViewport().windowWidth;
            GetNewViewport(z).invert = GetNewViewport().invert;
        }
        for (var z = 0; z < Viewport_Total; z++)
            refleshCanvas(GetNewViewport(z));
    } else {
        refleshCanvas(GetNewViewport());
    }
}
