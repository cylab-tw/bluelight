let MARKER = {};
MARKER.drawMarkList = [];

MARKER.drawMark = function (obj) {
    for (var i = 0; i < MARKER.drawMarkList.length; i++) {
        MARKER[MARKER.drawMarkList[i]](obj);
    }
}

function getColorFrom16(r, g, b, bit) {
    if (bit == 16) {
        r = parseInt(r / 256);
        g = parseInt(g / 256);
        b = parseInt(b / 256);
    }

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
    return rgbToHex(r, g, b);
}

function getRGBFrom0xFF(color, RGB, invert) {
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    var R = hexToRgb(color).r;
    var G = hexToRgb(color).g;
    var B = hexToRgb(color).b;
    if (invert == true) {
        R = 255 - R;
        G = 255 - G;
        B = 255 - B;
    }
    if (RGB == true) return ([R, G, B]);
    else return (getColorFrom16(R, G, B, 8));
}


function setMarkColor(ctx, color) {
    if (getByid("WhiteSelect").selected) {
        ctx.strokeStyle = ctx.fillStyle = "#FFFFFF";
    } else if (getByid("BlueSelect").selected) {
        ctx.strokeStyle = ctx.fillStyle = "#0000FF";
    } else if (getByid("RedSelect").selected) {
        ctx.strokeStyle = ctx.fillStyle = "#FF0000";
    } else if (getByid("GreenSelect").selected) {
        ctx.strokeStyle = ctx.fillStyle = "#00FF00";
    } else if (getByid("YellowSelect").selected) {
        ctx.strokeStyle = ctx.fillStyle = "#FFFF00";
    } else if (getByid("BrownSelect").selected) {
        ctx.strokeStyle = ctx.fillStyle = "#844200";
    } else if (getByid("OrangeSelect").selected) {
        ctx.strokeStyle = ctx.fillStyle = "#FFA500";
    } else if (getByid("PurpleSelect").selected) {
        ctx.strokeStyle = ctx.fillStyle = "#663399";
    } else {
        if (color) {
            ctx.strokeStyle = ctx.fillStyle = color;
            return true;
        } else {
            return false;
        }
    }
    return true;
}

function setImageOrientation2MarkCanvas(viewport, ctx) {
    var mat = ctx.getTransform();
    var checkTransform = false;
    //標記套用image Orientation和image Position，之後將以反方向旋轉
    if (CheckNull(viewport.imageOrientationX) == false && CheckNull(viewport.imageOrientationY) == false && CheckNull(viewport.imageOrientationZ) == false) {
        ctx.setTransform(new DOMMatrix(
            [viewport.imageOrientationX, -viewport.imageOrientationX2, 0, viewport.imagePositionX * viewport.PixelSpacingX,
            -viewport.imageOrientationY, viewport.imageOrientationY2, 0, viewport.imagePositionY * viewport.PixelSpacingY,
            viewport.imageOrientationZ, viewport.imageOrientationZ2, 0, viewport.imagePositionZ,
                0, 0, 0, 1
            ]));
        checkTransform = true;
    }
    mat = ctx.getTransform();
    //標記支援翻轉
    if (viewport.openHorizontalFlip == true && viewport.openVerticalFlip == true) {
        ctx.setTransform(mat.scaleSelf(-1, -1));
        ctx.setTransform(mat.translateSelf(-parseInt(viewport.imageWidth), parseInt(-viewport.imageHeight)));
    } else if (viewport.openHorizontalFlip == true) {
        ctx.setTransform(mat.scaleSelf(-1, 1));
        ctx.setTransform(mat.translateSelf(-parseInt(viewport.imageWidth), 0));
    } else if (viewport.openVerticalFlip == true) {
        ctx.setTransform(mat.scaleSelf(1, -1, 1));
        ctx.setTransform(mat.translateSelf(0, -parseInt(viewport.imageHeight)));
    } else {
        ctx.setTransform(mat.scaleSelf(1, 1, 1));
        ctx.setTransform(mat.translateSelf(0, 0));
    }
    if (checkTransform) ctx.setTransform(mat.invertSelf());
    return ctx;
}

function restoreImageOrientation2MarkCanvas(ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(1, 1);
    ctx.globalAlpha = 1.0;
}

function drawSEG(canvas, mark, viewport) {
    var ctx = canvas.getContext("2d");
    //Css(MarkCanvas, 'zIndex', "8");
    function mirrorImage(ctx, image, x = 0, y = 0, horizontal = false, vertical = false) {
        ctx.save();  // save the current canvas state
        ctx.setTransform(
            horizontal ? -1 : 1, 0, // set the direction of x axis
            0, vertical ? -1 : 1,   // set the direction of y axis
            x + (horizontal ? image.width : 0), // set the x origin
            y + (vertical ? image.height : 0)   // set the y origin
        );
        ctx.drawImage(image, 0, 0);
        ctx.restore(); // restore the state as it was when this function was called
    }
    ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);
    mirrorImage(ctx, mark.canvas, 0, 0, viewport.openHorizontalFlip, viewport.openVerticalFlip)
    // ctx.drawImage(mark.canvas, 0, 0, viewport.imageWidth, viewport.imageHeight);
    ctx.globalAlpha = 1;
    var globalCompositeOperation = ctx.globalCompositeOperation;

    ctx.globalCompositeOperation = "source-in";
    if (setMarkColor(ctx) == true) ctx.fillRect(0, 0, viewport.imageWidth, viewport.imageHeight);

    ctx.globalCompositeOperation = globalCompositeOperation;
    ctx.restore();
}

function drawOverLay(canvas, mark, viewport) {
    var ctx = canvas.getContext("2d");
    //Css(MarkCanvas, 'zIndex', "8");
    function mirrorImage(ctx, image, x = 0, y = 0, horizontal = false, vertical = false) {
        ctx.save();  // save the current canvas state
        ctx.setTransform(
            horizontal ? -1 : 1, 0, // set the direction of x axis
            0, vertical ? -1 : 1,   // set the direction of y axis
            x + (horizontal ? image.width : 0), // set the x origin
            y + (vertical ? image.height : 0)   // set the y origin
        );
        ctx.drawImage(image, 0, 0);
        ctx.restore(); // restore the state as it was when this function was called
    }
    ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);
    mirrorImage(ctx, mark.canvas, 0, 0, viewport.openHorizontalFlip, viewport.openVerticalFlip)
    // ctx.drawImage(mark.canvas, 0, 0, viewport.imageWidth, viewport.imageHeight);
    ctx.globalAlpha = 1;
    var globalCompositeOperation = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = "source-in";
    if (setMarkColor(ctx) == true) ctx.fillRect(0, 0, viewport.imageWidth, viewport.imageHeight);
    ctx.globalCompositeOperation = globalCompositeOperation;
    ctx.restore();
}

function drawXML_mark(canvas, mark, showName) {
    var ctx = canvas.getContext("2d");
    ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);
    var tempAlpha = ctx.globalAlpha;
    ctx.globalAlpha = 1.0;
    ctx.font = "" + (parseInt(ctx.lineWidth) * 12) + "px Arial";
    ctx.fillStyle = "red";
    for (var o = 0; o < mark.markX.length; o += 2) {
        ctx.strokeStyle = "" + mark.parent.color;
        ctx.beginPath();
        var x1 = mark.markX[o] * 1;
        var y1 = mark.markY[o] * 1;
        var o2 = o == mark.markX.length - 1 ? 0 : o + 1;
        var x2 = mark.markX[o + 1] * 1;
        var y2 = mark.markY[o + 1] * 1;
        ctx.fillText("" + showName, x1 < x2 ? x1 : x2, y1 < y2 ? y1 - 5 : y2 - 5);

        ctx.rect(x1, y1, x2 - x1, y2 - y1);
        ctx.stroke();
        ctx.closePath();
    }
    ctx.globalAlpha = tempAlpha;
}

function drawTEXT(canvas, mark, viewport) {
    var ctx = canvas.getContext("2d");
    ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);
    setMarkColor(ctx, "#FFFF00");
    if (mark.parent.color) ctx.strokeStyle = ctx.fillStyle = "" + mark.parent.color;
    try {
        for (var o = 0; o < mark.markX.length; o += 1) {
            ctx.beginPath();

            var x1 = mark.markX[o] * 1;
            var y1 = mark.markY[o + 1] * 1;
            var offsetX_Text = 0;
            var offsetY_Text = 0;
            var lines = mark.GSPS_Text.split('\n');
            for (var i2 = 0; i2 < lines.length; i2++) {
                var offsetX_temp = x1 + (3 * 4 * lines[i2].length) > MarkCanvas.width ? (x1 + (3 * 4 * lines[i2].length)) - MarkCanvas.width : 0;
                var offsetY_temp = y1 + (3 * 4 * lines[i2].length) > MarkCanvas.height ? (y1 + (3 * 4 * lines[i2].length)) - MarkCanvas.height : 0;
                if (offsetX_temp > offsetX_Text) offsetX_Text = offsetX_temp;
                if (offsetY_temp > offsetY_Text) offsetY_Text = offsetY_temp;
            }

            x1 -= offsetX_Text;
            y1 -= offsetY_Text;
            if (mark.GSPS_Text && o == 0) {
                ctx.font = "" + (3 * 4) + "px Arial";
                ctx.fillStyle = "red";
                var tempAlpha = ctx.globalAlpha;
                ctx.globalAlpha = 1.0;
                var lines = mark.GSPS_Text.split('\n');
                for (var i2 = 0; i2 < lines.length; i2++) {
                    ctx.fillText(lines[i2], x1, y1 - 7 - ((lines.length - 1) * 3 * 4) + (i2 * 3 * 4));
                }
                ctx.globalAlpha = tempAlpha;
            }
            ctx.stroke();
            ctx.closePath();
        }
    } catch (ex) { console.log(ex); }
}

function drawPOLYLINE(canvas, mark, viewport) {
    var ctx = canvas.getContext("2d");
    ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);
    setMarkColor(ctx);
    if (mark.parent.color) ctx.strokeStyle = ctx.fillStyle = "" + mark.parent.color;

    for (var o = 0; o < mark.markX.length; o += 1) {
        ctx.beginPath();

        var x1 = mark.markX[o] * 1;
        var y1 = mark.markY[o] * 1;
        var x2 = mark.markX[o + 1] * 1;
        var y2 = mark.markY[o + 1] * 1;

        if (mark.RotationAngle && mark.RotationPoint) {
            [x1, y1] = rotatePoint([x1, y1], mark.RotationAngle, mark.RotationPoint);
            [x2, y2] = rotatePoint([x2, y2], mark.RotationAngle, mark.RotationPoint);
        }

        if (mark.GSPS_Text && o == 0) {
            ctx.font = "" + (parseInt(ctx.lineWidth) * 4) + "px Arial";
            ctx.fillStyle = "red";
            var tempAlpha = ctx.globalAlpha;
            ctx.globalAlpha = 1.0;
            ctx.fillText("" + mark.GSPS_Text, x1 < x2 ? x1 : x2, y1 < y2 ? y1 - 7 : y2 - 7);
            ctx.globalAlpha = tempAlpha;
        }
        var tempAlpha2 = ctx.globalAlpha;
        ctx.globalAlpha = 1.0;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.globalAlpha = tempAlpha2;
        if (mark.GraphicFilled && mark.GraphicFilled == 'Y') {
            ctx.fillStyle = "#FFFF88";
            ctx.fill();
            console.log(x1, y1, x2, y2)
        };
        ctx.closePath();

        if (openWriteGraphic == true || (getByid("GspsPOLYLINE").selected == true && openWriteGSPS == true)) {
            if (mark.RotationAngle && mark.RotationPoint) {
                [x1, y1] = rotatePoint([x1, y1], -mark.RotationAngle, mark.RotationPoint);
                [x2, y2] = rotatePoint([x2, y2], -mark.RotationAngle, mark.RotationPoint);
            }
            ctx.lineWidth = "" + parseInt(ctx.lineWidth) * 2;
            var fillstyle = ctx.fillStyle;

            if (Graphic_now_choose && Graphic_now_choose.mark == mark) ctx.strokeStyle = getRGBFrom0xFF(ctx.strokeStyle, false, true);
            ctx.beginPath();
            ctx.arc(x1 / 2 + x2 / 2, y1 / 2 + y2 / 2, parseInt(ctx.lineWidth), 0, 2 * Math.PI);
            ctx.stroke();
            ctx.closePath();

            for (var fil = 0; fil < 2; fil++) {
                ctx.fillStyle = fillstyle;
                ctx.beginPath();
                ctx.arc(x1 / 2 + x2 / 2, y1 / 2 + y2 / 2, parseInt(ctx.lineWidth), 0, 2 * Math.PI);
                ctx.fill();
                ctx.closePath();
            }
            ctx.lineWidth = "" + parseInt(ctx.lineWidth) / 2;
        }
    }
}

function drawELLIPSE(canvas, mark, viewport) {
    var ctx = canvas.getContext("2d");
    ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);
    for (var o = 0; o < mark.markX.length; o += 1) {
        ctx.beginPath();

        var x1 = mark.markX[o] * 1;
        var y1 = mark.markY[o] * 1;
        var o2 = o == mark.markX.length - 1 ? 0 : o + 1;
        var x2 = mark.markX[o + 1] * 1;
        var y2 = mark.markY[o + 1] * 1;
        var x3 = mark.markX[o + 2] * 1;
        var y3 = mark.markY[o + 2] * 1;
        var x4 = mark.markX[o + 3] * 1;
        var y4 = mark.markY[o + 3] * 1;

        ctx.ellipse((x1 + x3) / 2, (y2 + y4) / 2, Math.abs(x1 - x3), Math.abs(y2 - y4), 0 * Math.PI / 180, 0, 2 * Math.PI);
        ctx.stroke();
        if (getByid("markFillCheck").checked) ctx.fill();
        ctx.closePath();
    }
}

function drawCIRCLE(canvas, mark, viewport) {
    var ctx = canvas.getContext("2d");
    ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);
    setMarkColor(ctx);
    if (mark.parent.color) ctx.strokeStyle = ctx.fillStyle = "" + mark.parent.color;
    for (var o = 0; o < mark.markX.length; o += 2) {
        var x1 = mark.markX[o] * 1;
        var y1 = mark.markY[o] * 1;
        var x2 = mark.markX[o + 1] * 1;
        var y2 = mark.markY[o + 1] * 1;

        ctx.beginPath();
        var temp_distance = getDistance(Math.abs(x1 - x2), Math.abs(y1 - y2)); //Math.abs(x1 - x2) > Math.abs(y1 - y2) ? Math.abs(x1 - x2) : Math.abs(y1 - y2);
        ctx.arc(x1, y1, temp_distance, 0, 2 * Math.PI);
        ctx.stroke();
        //if (getByid("markFillCheck").checked) ctx.fill();
        ctx.closePath();
    }
}

function drawTwoDimensionPolyline(canvas, mark, viewport) {
    var ctx = canvas.getContext("2d");
    ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);

    if (mark.parent.color) ctx.strokeStyle = ctx.fillStyle = "" + mark.parent.color;
    setMarkColor(ctx);
    for (var o = 0; o < mark.markX.length; o++) {
        ctx.beginPath();
        x1 = mark.markX[o] /* * viewport.PixelSpacingX*/;
        y1 = mark.markY[o] /** viewport.PixelSpacingY*/;
        o2 = o == mark.markX.length - 1 ? 0 : o + 1;
        x2 = mark.markX[o2] /* * viewport.PixelSpacingX*/;
        y2 = mark.markY[o2] /* * viewport.PixelSpacingY*/;

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
    }
    ctx.fill();
    ctx.closePath();

}

function drawTwoDimensionMultiPoint(canvas, mark, viewport) {
    var ctx = canvas.getContext("2d");
    ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);
    if (mark.parent.color) ctx.strokeStyle = ctx.fillStyle = "" + mark.parent.color;
    setMarkColor(ctx);

    for (var o = 0; o < mark.markX.length; o++) {
        ctx.beginPath();
        var x1 = mark.markX[o] /* * viewport.PixelSpacingX*/;
        var y1 = mark.markY[o] /* * viewport.PixelSpacingY*/;
        var o2 = o == mark.markX.length - 1 ? 0 : o + 1;
        var x2 = mark.markX[o2] /* * viewport.PixelSpacingX*/;
        var y2 = mark.markY[o2] /* * viewport.PixelSpacingY*/;

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
    }
}

function drawTwoDimensionEllipse(canvas, mark, viewport) {
    var ctx = canvas.getContext("2d");
    ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);
    if (mark.parent.color) ctx.strokeStyle = ctx.fillStyle = "" + mark.parent.color;
    setMarkColor(ctx);
    for (var o = 0; o < mark.markX.length; o++) {
        ctx.beginPath();
        var X1 = mark.markX[o + 0];
        var Y1 = mark.markY[o + 0];
        var X2 = mark.markX[o + 2];
        var Y2 = mark.markY[o + 2];
        var X3 = mark.markX[o + 1];
        var Y3 = mark.markY[o + 1];
        var X4 = mark.markX[o + 3];
        var Y4 = mark.markY[o + 3];

        var heightHalf = Math.sqrt(Math.pow((X1 - X3), 2) + Math.pow((Y1 - Y3), 2)) / 2;
        var widthHalf = Math.sqrt(Math.pow((X2 - X4), 2) + Math.pow((Y2 - Y4), 2)) / 2;
        ctx.ellipse(X3, Y3, heightHalf, widthHalf, 0 * Math.PI / 180, 0, 2 * Math.PI);
        if (getByid("markFillCheck").checked) ctx.fill();
        ctx.stroke();
        ctx.closePath();
        break;
    }
}

function drawRTSS(canvas, mark, viewport) {
    var ctx = canvas.getContext("2d");
    setImageOrientation2MarkCanvas(viewport, ctx);

    ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);
    //ctx.setTransform(1, 0, 0, 1, 0, 0);
    //ctx.scale(1, 1);
    if (mark.parent.color) ctx.strokeStyle = ctx.fillStyle = "" + mark.parent.color;
    setMarkColor(ctx);
    for (var o = 0; o < mark.markX.length; o++) {
        ctx.beginPath();
        var x1 = Math.ceil((mark.markX[o] - viewport.imagePositionX) * viewport.PixelSpacingX);
        var y1 = Math.ceil((mark.markY[o] - viewport.imagePositionY) * viewport.PixelSpacingY);
        var o2 = o == mark.markX.length - 1 ? 0 : o + 1;
        var x2 = Math.ceil((mark.markX[o2] - viewport.imagePositionX) * viewport.PixelSpacingX);
        var y2 = Math.ceil((mark.markY[o2] - viewport.imagePositionY) * viewport.PixelSpacingY);

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.globalAlpha = 1.0;
        ctx.stroke();
        ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);
        ctx.closePath();
    }
    if (getByid("markFillCheck").checked) {
        ctx.beginPath();
        for (var o = 0; o < mark.markX.length; o++) {
            var mark = mark;
            var x1 = Math.ceil((mark.markX[o] - viewport.imagePositionX) * viewport.PixelSpacingX);
            var y1 = Math.ceil((mark.markY[o] - viewport.imagePositionY) * viewport.PixelSpacingY);
            var o2 = o == mark.markX.length - 1 ? 0 : o + 1;
            var x2 = Math.ceil((mark.markX[o2] - viewport.imagePositionX) * viewport.PixelSpacingX);
            var y2 = Math.ceil((mark.markY[o2] - viewport.imagePositionY) * viewport.PixelSpacingY);

            if (o == 0) {
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
            } else {
                ctx.lineTo(x1, y1);
                ctx.lineTo(x2, y2);
            }
        }
        ctx.fill();
        ctx.closePath();
    }

    restoreImageOrientation2MarkCanvas(ctx);
}

function drawTextAnnotationEntity(canvas, mark, viewport) {
    var ctx = canvas.getContext("2d");
    setImageOrientation2MarkCanvas(viewport, ctx);
    ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);
    if (mark.parent.color) ctx.strokeStyle = ctx.fillStyle = "" + mark.parent.color;
    setMarkColor(ctx);

    for (var o = 0; o < mark.markX.length; o++) {
        var theta = 30;
        ctx.moveTo(parseInt(mark.markX[o]), parseInt(mark.markY[o]));
        ctx.lineTo(parseInt(mark.markX[o + 1]), parseInt(mark.markY[o + 1]));
        ctx.stroke();
        ctx.save();

        ctx.translate(mark.markX[o], mark.markY[o]);
        var ang = Math.atan2(mark.markY[o] - mark.markY[o + 1], mark.markX[o] - mark.markX[o + 1]) + Math.PI / 2;
        ctx.rotate(ang);
        ctx.moveTo(0, 0);
        ctx.lineTo(0 - 3, 0 + 7);
        ctx.lineTo(0 + 3, 0 + 7);
        ctx.fill();
        ctx.restore();
        ctx.closePath();
        break;
    }

    restoreImageOrientation2MarkCanvas(ctx);
}

function getMarkSize(MarkCanvas, sizeCheck) {
    var lineSize = parseFloat(getByid('markSizeText').value);
    var lineWid = 2 * parseFloat(MarkCanvas.width) / parseFloat(Css(MarkCanvas, 'width'));
    if (sizeCheck == true && lineWid <= 0) {
        lineWid = parseFloat(Css(MarkCanvas, 'width')) / parseFloat(MarkCanvas.width);
        if (lineWid <= 1.5) lineWid = 1.5;
        lineWid *= Math.abs(parseFloat(MarkCanvas.width) / parseFloat(Css(MarkCanvas, 'width')));
    } else if (sizeCheck == true) {
        lineWid *= Math.abs(parseFloat(Css(MarkCanvas, 'width')) / parseFloat(MarkCanvas.width));
    } else if (lineWid <= 0) {
        lineWid = parseFloat(Css(MarkCanvas, 'width')) / parseFloat(MarkCanvas.width);
    }
    if (lineWid <= 1.5) lineWid = 1.5;
    return ((Math.abs(lineWid)) * 2 * lineSize);
}

function displayMark(viewportNum0) {

    if (openLink) for (var z = 0; z < Viewport_Total; z++)  GetViewport(z).openMark = GetViewport().openMark;

    var viewportNum = viewportNum0 >= 0 ? viewportNum0 : viewportNumber;
    var viewport = GetViewport(viewportNum), MarkCanvas = GetViewportMark(viewportNum);
    if (!viewport.openMark) return;

    var ctx = MarkCanvas.getContext("2d");
    ctx.clearRect(0, 0, viewport.imageWidth, viewport.imageHeight);

    //注意：標記顏色選擇紅色跟自動都會先初始化為紅色
    ctx.strokeStyle = ctx.fillStyle = "#FF0000";
    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.lineWidth = "" + getMarkSize(MarkCanvas, false);
    setMarkColor(ctx);               
    try { var [i, j, k] = SearchUid2Index(viewport.sop) } catch (ex) { return; }

    for (var n = 0; n < PatientMark.length; n++) {
        if (PatientMark[n].sop == Patient.Study[i].Series[j].Sop[k].SopUID) {
            for (var m = 0; m < PatientMark[n].mark.length; m++) {
                if (checkMark(i, j, n) == 0) continue;
                var mark = PatientMark[n].mark[m];
                mark.parent = PatientMark[n];
                if (mark.type == "SEG") drawSEG(MarkCanvas, mark, viewport);
                else if (mark.type == "Overlay") drawOverLay(MarkCanvas, mark, viewport);
            }
        }
    }

    for (var n = 0; n < PatientMark.length; n++) {
        if (PatientMark[n].sop == Patient.Study[i].Series[j].Sop[k].SopUID) {
            for (var m = 0; m < PatientMark[n].mark.length; m++) {
                if (checkMark(i, j, n) == 0) continue;
                var mark = PatientMark[n].mark[m];
                mark.parent = PatientMark[n];
                if (mark.type == "XML_mark") drawXML_mark(MarkCanvas, mark, PatientMark[n].showName);
                else if (mark.type == "TEXT") drawTEXT(MarkCanvas, mark, viewport);
                else if (mark.type == "POLYLINE") drawPOLYLINE(MarkCanvas, mark, viewport);
                else if (mark.type == "ELLIPSE") drawELLIPSE(MarkCanvas, mark, viewport);
                else if (mark.type == "CIRCLE") drawCIRCLE(MarkCanvas, mark, viewport);
                else if (mark.type == "TwoDimensionPolyline") drawTwoDimensionPolyline(MarkCanvas, mark, viewport);
                else if (mark.type == "TwoDimensionMultiPoint") drawTwoDimensionMultiPoint(MarkCanvas, mark, viewport);
                else if (mark.type == "TwoDimensionEllipse") drawTwoDimensionEllipse(MarkCanvas, mark, viewport);
            }
        }
    }

    for (var n = 0; n < PatientMark.length; n++) {
        if (PatientMark[n].sop == Patient.Study[i].Series[j].Sop[k].SopUID) {
            for (var m = 0; m < PatientMark[n].mark.length; m++) {
                if (checkMark(i, j, n) == 0) continue;
                var mark = PatientMark[n].mark[m];
                mark.parent = PatientMark[n];
                if (mark.type == "RTSS") drawRTSS(MarkCanvas, mark, viewport);
                else if (mark.type == "TextAnnotationEntity") drawTextAnnotationEntity(MarkCanvas, mark, viewport);
            }
        }
    }
  
    for (var n = 0; n < PatientMark.length; n++) {
        if (PatientMark[n].sop == Patient.Study[i].Series[j].Sop[k].SopUID) { 
            for (var m = 0; m < PatientMark[n].mark.length; m++) { 
                if (checkMark(i, j, n) == 0) continue;
                var mark = PatientMark[n].mark[m];
                mark.parent = PatientMark[n];
                MARKER.drawMark({ "canvas": MarkCanvas, "mark": mark, "showName": PatientMark[n].showName });//MarkCanvas, mark, viewport
            }
        }
    }
}