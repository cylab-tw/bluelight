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

function displayRuler(viewportNum0) {
    var viewportNum = viewportNum0 >= 0 ? viewportNum0 : viewportNumber;
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
        tempctx.moveTo(0 + (offsetWidth / 2) - (40 * GetViewport(viewportNum).PixelSpacingX) * (parseFloat(canvas.style.width) / GetViewport(viewportNum).imageWidth), 10);
        tempctx.lineTo((90 * GetViewport(viewportNum).PixelSpacingX) * (parseFloat(canvas.style.width) / GetViewport(viewportNum).imageWidth) + (offsetWidth / 2) - (40 * GetViewport(viewportNum).PixelSpacingX) * (parseFloat(canvas.style.width) / GetViewport(viewportNum).imageWidth), 10);
        for (var i = 0; i < 10; i++) {
            tempctx.moveTo(x1 + (offsetWidth / 2) - (40 * GetViewport(viewportNum).PixelSpacingX) * (parseFloat(canvas.style.width) / GetViewport(viewportNum).imageWidth), y1);
            tempctx.lineTo(x1 + (offsetWidth / 2) - (40 * GetViewport(viewportNum).PixelSpacingX) * (parseFloat(canvas.style.width) / GetViewport(viewportNum).imageWidth), y1 + 20);
            tempctx.stroke();
            x1 += (10 * GetViewport(viewportNum).PixelSpacingX) * (parseFloat(canvas.style.width) / GetViewport(viewportNum).imageWidth);
        }
        tempctx.closePath();
    } catch (ex) { }
    displayRuler2(viewportNum0);
}

function displayRuler2(viewportNum0) {
    var viewportNum = viewportNum0 >= 0 ? viewportNum0 : viewportNumber;

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
        tempctx.moveTo(0, 0 + (offsetHeight / 2) - (40 * GetViewport(viewportNum).PixelSpacingY) * (parseFloat(canvas.style.height) / GetViewport(viewportNum).imageHeight));
        tempctx.lineTo(0, (90 * GetViewport(viewportNum).PixelSpacingY) * (parseFloat(canvas.style.height) / GetViewport(viewportNum).imageHeight) - (40 * GetViewport(viewportNum).PixelSpacingY) * (parseFloat(canvas.style.height) / GetViewport(viewportNum).imageHeight) + (offsetHeight / 2));
        tempctx.stroke();
        for (var i = 0; i < 10; i++) {
            tempctx.moveTo(x1, y1 + (offsetHeight / 2) - (40 * GetViewport(viewportNum).PixelSpacingY) * (parseFloat(canvas.style.height) / GetViewport(viewportNum).imageHeight));
            tempctx.lineTo(x1 + 20, y1 + (offsetHeight / 2) - (40 * GetViewport(viewportNum).PixelSpacingY) * (parseFloat(canvas.style.height) / GetViewport(viewportNum).imageHeight));
            tempctx.stroke();
            y1 += (10 * GetViewport(viewportNum).PixelSpacingY) * (parseFloat(canvas.style.height) / GetViewport(viewportNum).imageHeight);
        }
        tempctx.closePath();
    } catch (ex) { }
}

function resetViewport(viewportNum0) {
    var viewportNum = viewportNum0 >= 0 ? viewportNum0 : viewportNumber;
    GetViewport(viewportNum).NowCanvasSizeWidth = GetViewport(viewportNum).NowCanvasSizeHeight = null;
    GetViewport(viewportNum).newMousePointX = GetViewport(viewportNum).newMousePointY = GetViewport().rotateValue = 0;
    GetViewport(viewportNum).windowCenterList = GetViewport(viewportNum).windowWidthList = null;
    if (GetViewport(viewportNum).framesNumber != undefined) GetViewport(viewportNum).framesNumber = 0;
}

function resetAndLoadImg(viewportNum0, dontLoad = false) {
    var viewportNum = viewportNum0 >= 0 ? viewportNum0 : viewportNumber;
    var viewport = GetViewport(viewportNum);

    viewport.NowCanvasSizeWidth = viewport.NowCanvasSizeHeight = null;
    viewport.windowCenterList = viewport.windowWidthList = null;
    viewport.newMousePointX = viewport.newMousePointY = GetViewport().rotateValue = 0;

    GetViewport().openVerticalFlip = GetViewport().openHorizontalFlip = GetViewport().openInvert = false;
    if (getByid("removeRuler")) getByid("removeRuler").onclick();

    if (dontLoad == false) GetViewport(viewportNum).obj.reloadImg();
}

function SetWindowWL(openOrigin) {
    getByid("MeasureLabel").style.display = "none";
    getByid("AngleLabel").style.display = "none";
    if (openLink == true) {
        for (var z = 0; z < Viewport_Total; z++) {
            GetViewport(z).windowCenterList = parseInt(getByid("textWC").value);
            GetViewport(z).windowWidthList = parseInt(getByid("textWW").value);
        }
        for (var z = 0; z < Viewport_Total; z++) {
            GetViewport(z).openVerticalFlip = GetViewport().openVerticalFlip;
            GetViewport(z).openHorizontalFlip = GetViewport().openHorizontalFlip;
            GetViewport(z).openInvert = GetViewport().openInvert;
            var sop = GetViewport(z).sop;

            var uid = SearchUid2Json(sop);
            if (uid) {
                if (z == viewportNumber)
                    loadAndViewImageByWindowLevwl(Patient.Study[uid.studyuid].Series[uid.sreiesuid].Sop[uid.sopuid].imageId, parseInt(getByid("textWC").value), parseInt(getByid("textWW").value), openOrigin, z);
                else
                    loadAndViewImageByWindowLevwl(Patient.Study[uid.studyuid].Series[uid.sreiesuid].Sop[uid.sopuid].imageId, parseInt(getByid("textWC").value), parseInt(getByid("textWW").value), false, z);
            }
        }
    } else {
        var sop = GetViewport().sop;
        GetViewport().windowCenterList = parseInt(getByid("textWC").value);
        GetViewport().windowWidthList = parseInt(getByid("textWW").value);
        var uid = SearchUid2Json(sop);
        loadAndViewImageByWindowLevwl(Patient.Study[uid.studyuid].Series[uid.sreiesuid].Sop[uid.sopuid].imageId, parseInt(getByid("textWC").value), parseInt(getByid("textWW").value), openOrigin);
    }
}
