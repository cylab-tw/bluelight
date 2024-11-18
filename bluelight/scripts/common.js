function cancelTools() {
    openMouseTool = false;
    openWindow = false;
    openZoom = false;
    openMeasure = false;
    openWheel = false;
    openRotate = false;

    HideElemByID(["magnifierDiv", "textWC", "textWW", "WindowLevelDiv",
        "labelZoom", "labelPlay", "textZoom", "textPlay"]);

    getByid('playvideo').src = '../image/icon/lite/b_CinePlay.png';
    getByid("WindowDefault").selected = true;

    setWindowLevel();
    displayMark();
    for (var i = 0; i < Viewport_Total; i++) {
        GetViewport(i).cine = false;
    }
    PlayCine();
}

function displayAllRuler() {
    for (var i = 0; i < Viewport_Total; i++)
        displayRuler(i);
}

function displayRuler(viewportNum = viewportNumber) {
    if (!openAnnotation || !GetViewport(viewportNum) || !GetViewport(viewportNum).content || !GetViewport(viewportNum).content.image) {
        getClass("downRule")[viewportNum].style.display = "none";
        getClass("leftRule")[viewportNum].style.display = "none";
        return;
    }
    try {
        var downRule = getClass("downRule")[viewportNum];

        const offsetWidth = GetViewport(viewportNum).div.offsetWidth;
        if (downRule.width != offsetWidth) downRule.width = offsetWidth;

        downRule.style.display = "";

        var tempctx = downRule.getContext("2d");
        tempctx.clearRect(0, 0, offsetWidth, 20);
        tempctx.strokeStyle = tempctx.fillStyle = "#FFFFFF";
        tempctx.lineWidth = "2";
        var x1 = 0, y1 = 0;

        tempctx.beginPath();
        if (GetViewport(viewportNum).transform.PixelSpacingX && GetViewport(viewportNum).transform.PixelSpacingY) {
            tempctx.moveTo(0 + (offsetWidth / 2) - (50 * GetViewport(viewportNum).transform.PixelSpacingX) * (GetViewport(viewportNum).scale), 10 + 10);
            tempctx.lineTo((90 * GetViewport(viewportNum).transform.PixelSpacingX) * (GetViewport(viewportNum).scale) + (offsetWidth / 2) - (40 * GetViewport(viewportNum).transform.PixelSpacingX) * (GetViewport(viewportNum).scale), 10 + 10);
            for (var i = 0; i <= 10; i++) {
                tempctx.moveTo(x1 + (offsetWidth / 2) - (50 * GetViewport(viewportNum).transform.PixelSpacingX) * (GetViewport(viewportNum).scale), y1 + 10);
                tempctx.lineTo(x1 + (offsetWidth / 2) - (50 * GetViewport(viewportNum).transform.PixelSpacingX) * (GetViewport(viewportNum).scale), y1 + 10 + 10);
                tempctx.stroke();
                x1 += (10 * GetViewport(viewportNum).transform.PixelSpacingX) * (GetViewport(viewportNum).scale);
            }
            tempctx.closePath();
            x1 -= (10 * GetViewport(viewportNum).transform.PixelSpacingX) * (GetViewport(viewportNum).scale);

            tempctx.font = "" + (12) + "px Arial";
            tempctx.fillText("100 mm", 2 + x1 + (offsetWidth / 2) - (50 * GetViewport(viewportNum).transform.PixelSpacingX) * (GetViewport(viewportNum).scale), y1 + 3 + 10 + 5)
        } else {
            tempctx.strokeStyle = "#4855FF";
            var PX = 1, PY = 1;
            tempctx.moveTo(0 + (offsetWidth / 2) - (50 * PX) * (GetViewport(viewportNum).scale), 10 + 10);
            tempctx.lineTo((90 * PX) * (GetViewport(viewportNum).scale) + (offsetWidth / 2) - (40 * PX) * (GetViewport(viewportNum).scale), 10 + 10);
            for (var i = 0; i <= 10; i++) {
                tempctx.moveTo(x1 + (offsetWidth / 2) - (50 * PX) * (GetViewport(viewportNum).scale), y1 + 10);
                tempctx.lineTo(x1 + (offsetWidth / 2) - (50 * PX) * (GetViewport(viewportNum).scale), y1 + 10 + 10);
                tempctx.stroke();
                x1 += (10 * PX) * (GetViewport(viewportNum).scale);
            }
            tempctx.closePath();
            x1 -= (10 * PX) * (GetViewport(viewportNum).scale);

            tempctx.font = "" + (12) + "px Arial";
            tempctx.fillText("100 pix", 2 + x1 + (offsetWidth / 2) - (50 * PX) * (GetViewport(viewportNum).scale), y1 + 3 + 10 + 5)
        }

    } catch (ex) { }
    displayRuler2(viewportNum);
}

function displayRuler2(viewportNum = viewportNumber) {
    if (!GetViewport() || !GetViewport().content || !GetViewport().content.image) return;
    try {
        var leftRule = getClass("leftRule")[viewportNum];
        var offsetHeight = GetViewport(viewportNum).div.offsetHeight;
        leftRule.height = offsetHeight;
        leftRule.style.display = "";

        //leftRule[viewportNum].style.left = 10 + bordersize + "px";
        var tempctx = leftRule.getContext("2d");

        tempctx.clearRect(0, 0, 20, offsetHeight);
        tempctx.strokeStyle = tempctx.fillStyle = "#FFFFFF";
        tempctx.lineWidth = "2";
        tempctx.beginPath();
        var x1 = 0, y1 = 0;

        if (GetViewport(viewportNum).transform.PixelSpacingX && GetViewport(viewportNum).transform.PixelSpacingY) {
            tempctx.font = "" + (12) + "px Arial";
            tempctx.fillText("100 mm", 0, -5 + (offsetHeight / 2) - (50 * GetViewport(viewportNum).transform.PixelSpacingY) * (GetViewport(viewportNum).scale))

            tempctx.moveTo(0, 0 + (offsetHeight / 2) - (50 * GetViewport(viewportNum).transform.PixelSpacingY) * (GetViewport(viewportNum).scale));
            tempctx.lineTo(0, (90 * GetViewport(viewportNum).transform.PixelSpacingY) * (GetViewport(viewportNum).scale) - (40 * GetViewport(viewportNum).transform.PixelSpacingY) * (GetViewport(viewportNum).scale) + (offsetHeight / 2));
            tempctx.stroke();
            for (var i = 0; i <= 10; i++) {
                tempctx.moveTo(x1, y1 + (offsetHeight / 2) - (50 * GetViewport(viewportNum).transform.PixelSpacingY) * (GetViewport(viewportNum).scale));
                tempctx.lineTo(x1 + 10, y1 + (offsetHeight / 2) - (50 * GetViewport(viewportNum).transform.PixelSpacingY) * (GetViewport(viewportNum).scale));
                tempctx.stroke();
                y1 += (10 * GetViewport(viewportNum).transform.PixelSpacingY) * (GetViewport(viewportNum).scale);
            }
            tempctx.closePath();
        } else {
            tempctx.strokeStyle = "#4855FF";
            var PX = 1, PY = 1;
            tempctx.font = "" + (12) + "px Arial";
            tempctx.fillText("100 pix", 0, -5 + (offsetHeight / 2) - (50 * PY) * (GetViewport(viewportNum).scale))

            tempctx.moveTo(0, 0 + (offsetHeight / 2) - (50 * PY) * (GetViewport(viewportNum).scale));
            tempctx.lineTo(0, (90 * PY) * (GetViewport(viewportNum).scale) - (40 * PY) * (GetViewport(viewportNum).scale) + (offsetHeight / 2));
            tempctx.stroke();
            for (var i = 0; i <= 10; i++) {
                tempctx.moveTo(x1, y1 + (offsetHeight / 2) - (50 * PY) * (GetViewport(viewportNum).scale));
                tempctx.lineTo(x1 + 10, y1 + (offsetHeight / 2) - (50 * PY) * (GetViewport(viewportNum).scale));
                tempctx.stroke();
                y1 += (10 * PY) * (GetViewport(viewportNum).scale);
            }
            tempctx.closePath();
        }
    } catch (ex) { }
}

function setTransform(viewportnum = viewportNumber) {
    var element = GetViewport(viewportnum);
    var scale = element.scale ? element.scale : 1;
    GetViewportMark(viewportnum).style.transform = `translate(calc(-50% + ${Fpx(element.translate.x)}) , calc(-50% + ${Fpx(element.translate.y)})) scale( ${scale} ) rotate( ${element.rotate}deg)`;
    element.canvas.style.transform = `translate(calc(-50% + ${Fpx(element.translate.x)}) , calc(-50% + ${Fpx(element.translate.y)})) scale( ${scale} ) rotate( ${element.rotate}deg)`;
    //element.canvas.style.transform=" translate(-50%,-50%)"
    element.canvas.style.position = "absolute";
    GetViewportMark(viewportnum).style.position = "absolute";
    element.setLabel("scale", "" + element.scale);
    element.refleshLabel();
    refleshGUI();
}

function resetViewport(viewportNum = viewportNumber) {
    GetViewport(viewportNum).translate.x = GetViewport(viewportNum).translate.y = GetViewport(viewportNum).rotate = 0;
    GetViewport(viewportNum).scale = null;
    GetViewport(viewportNum).windowCenter = GetViewport(viewportNum).windowWidth = null;
    GetViewport(viewportNum).invert = GetViewport(viewportNum).HorizontalFlip = GetViewport(viewportNum).VerticalFlip = false;
    GetViewport(viewportNum).transform = {};

    if (GetViewport(viewportNum).framesNumber != undefined) GetViewport(viewportNum).framesNumber = 0;
}

function resetAndLoadImg(viewportNum = viewportNumber, dontLoad = false) {

    /*for (var z = 0; z < Viewport_Total; z++) {
        if (openLink == false) z = viewportNum;
        var viewport = GetViewport(z);

        viewport.windowCenter = viewport.windowWidth = null;
        viewport.translate.x = viewport.translate.y = GetViewport(z).rotate = 0;
        GetViewport(z).scale = null;
        GetViewport(z).VerticalFlip = GetViewport(z).HorizontalFlip = GetViewport(z).invert = false;
        if (getByid("removeAllRuler")) getByid("removeAllRuler").onclick();

        if (dontLoad == false) GetViewport(z).reloadImg();
        if (openLink == false) break;
    }*/
    var viewport = GetViewport();

    viewport.windowCenter = viewport.windowWidth = null;
    viewport.translate.x = viewport.translate.y = GetViewport().rotate = 0;
    GetViewport().scale = null;
    GetViewport().VerticalFlip = GetViewport().HorizontalFlip = GetViewport().invert = false;
    if (getByid("removeAllRuler")) getByid("removeAllRuler").onclick();

    if (dontLoad == false) GetViewport().reloadImg();
}

function refleshViewport() {
    if (openLink == true) {
        /*for (var z = 0; z < Viewport_Total; z++) {
            GetViewport(z).VerticalFlip = GetViewport().VerticalFlip;
            GetViewport(z).HorizontalFlip = GetViewport().HorizontalFlip;
            GetViewport(z).windowCenter = GetViewport().windowCenter;
            GetViewport(z).windowWidth = GetViewport().windowWidth;
            GetViewport(z).invert = GetViewport().invert;
        }*/
        for (var z = 0; z < Viewport_Total; z++) {
            refleshCanvas(GetViewport(z));
            displayMark(z);
        }
    } else {
        refleshCanvas(GetViewport());
        displayMark();
    }
}
