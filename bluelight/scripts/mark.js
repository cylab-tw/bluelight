
var openDisplayMarkup = false;
//裝標記的物件
var PatientMark = [];
let MARKER = {};
MARKER.drawMarkList = [];

MARKER.drawMark = function (obj) {
    for (var i = 0; i < MARKER.drawMarkList.length; i++) {
        try {
            MARKER[MARKER.drawMarkList[i]](obj);
        } catch (ex) { }
    }
}

function compatibleMark(mark) {
    if (!mark.point) {
        mark.point = [];
        if (mark.markX && mark.markY) {
            var len = mark.markX.length >= mark.markY.length ? mark.markX.length : mark.markY.length;
            for (var o = 0; o < len; o++) {
                mark.point.push([mark.markX[o], mark.markY[o]]);
            }
        }
    }
    return mark;
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

function setMarkSetting(ctx, viewport) {
    if (ctx.constructor.name == 'HTMLCanvasElement') ctx = ctx.getContext('2d');
    setMarkColor(ctx);
    setMarkFlip(ctx, viewport);
}

function setMarkFlip(ctx, viewport) {
    if (!viewport) viewport = GetViewport();
    if (viewport.HorizontalFlip == true || viewport.VerticalFlip == true) {
        ctx.transform(
            viewport.HorizontalFlip ? -1 : 1, 0, // set the direction of x axis
            0, viewport.VerticalFlip ? -1 : 1,   // set the direction of y axis
            (viewport.HorizontalFlip ? viewport.width : 0), // set the x origin
            (viewport.VerticalFlip ? viewport.height : 0)   // set the y origin
        );
    }
}

function setMarkColor(ctx, color) {
    //BlueLight2(改成只將色彩選項套用在沒有預設顏色的情況)
    if (color) {
        ctx.strokeStyle = ctx.fillStyle = color;
        return true;
    }

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
    if (CheckNull(viewport.transform.imageOrientationX) == false && CheckNull(viewport.transform.imageOrientationY) == false && CheckNull(viewport.transform.imageOrientationZ) == false) {
        ctx.setTransform(new DOMMatrix(
            [viewport.transform.imageOrientationX, -viewport.transform.imageOrientationX2, 0, viewport.transform.imagePositionX * viewport.transform.PixelSpacingX,
            -viewport.transform.imageOrientationY, viewport.transform.imageOrientationY2, 0, viewport.transform.imagePositionY * viewport.PixelSpacingY,
            viewport.transform.imageOrientationZ, viewport.transform.imageOrientationZ2, 0, viewport.transform.imagePositionZ,
                0, 0, 0, 1
            ]));
        /*
             ctx.setTransform(new DOMMatrix(
            [viewport.transform.imageOrientationX, -viewport.transform.imageOrientationX2, 0, 0,
            -viewport.transform.imageOrientationY, viewport.transform.imageOrientationY2, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 1
        ])); */
        checkTransform = true;
    }
    mat = ctx.getTransform();
    //標記支援翻轉
    if (viewport.HorizontalFlip == true && viewport.VerticalFlip == true) {
        ctx.setTransform(mat.scaleSelf(-1, -1));
        ctx.setTransform(mat.translateSelf(-parseInt(viewport.width), parseInt(-viewport.height)));
    } else if (viewport.HorizontalFlip == true) {
        ctx.setTransform(mat.scaleSelf(-1, 1));
        ctx.setTransform(mat.translateSelf(-parseInt(viewport.width), 0));
    } else if (viewport.VerticalFlip == true) {
        ctx.setTransform(mat.scaleSelf(1, -1, 1));
        ctx.setTransform(mat.translateSelf(0, -parseInt(viewport.height)));
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

function drawSEG(canvas, Mark, viewport) {
    var ctx = canvas.getContext("2d");
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
    mirrorImage(ctx, Mark.canvas, 0, 0, viewport.HorizontalFlip, viewport.VerticalFlip)
    // ctx.drawImage(mark.canvas, 0, 0, viewport.width, viewport.height);
    ctx.globalAlpha = 1;
    var globalCompositeOperation = ctx.globalCompositeOperation;

    ctx.globalCompositeOperation = "source-in";
    if (setMarkColor(ctx, Mark.color) == true) ctx.fillRect(0, 0, viewport.width, viewport.height);

    ctx.globalCompositeOperation = globalCompositeOperation;
    ctx.restore();
}

function drawOverLay(canvas, Mark, viewport) {
    var ctx = canvas.getContext("2d");
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
    mirrorImage(ctx, Mark.canvas, 0, 0, viewport.HorizontalFlip, viewport.VerticalFlip)
    // ctx.drawImage(mark.canvas, 0, 0, viewport.width, viewport.height);
    ctx.globalAlpha = 1;
    var globalCompositeOperation = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = "source-in";
    if (setMarkColor(ctx, Mark.color) == true) ctx.fillRect(0, 0, viewport.width, viewport.height);
    ctx.globalCompositeOperation = globalCompositeOperation;
    ctx.restore();
}

function drawXML_mark(canvas, Mark, showName) {
    var ctx = canvas.getContext("2d");
    ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);
    var tempAlpha = ctx.globalAlpha;
    ctx.globalAlpha = 1.0;
    ctx.font = "" + (parseInt(ctx.lineWidth) * 12) + "px Arial";
    ctx.fillStyle = "red";
    for (var o = 0; o < Mark.pointArray.length; o += 2) {
        ctx.strokeStyle = "" + Mark.color;
        ctx.beginPath();
        var x1 = Mark.pointArray[o].x * 1;
        var y1 = Mark.pointArray[o].y * 1;
        var x2 = Mark.pointArray[o + 1].x * 1;
        var y2 = Mark.pointArray[o + 1].y * 1;
        ctx.fillText("" + showName, x1 < x2 ? x1 : x2, y1 < y2 ? y1 - 5 : y2 - 5);

        ctx.rect(x1, y1, x2 - x1, y2 - y1);
        ctx.stroke();
        ctx.closePath();
    }
    ctx.globalAlpha = tempAlpha;
}

function drawTEXT(canvas, Mark, viewport) {
    var ctx = canvas.getContext("2d");
    ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);
    setMarkColor(ctx, "#FFFF00");
    if (Mark.color) ctx.strokeStyle = ctx.fillStyle = "" + Mark.color;
    try {
        for (var o = 0; o < Mark.pointArray.length; o += 1) {
            ctx.beginPath();

            var x1 = Mark.pointArray[o].x * 1;
            var y1 = Mark.pointArray[o + 1].y * 1;
            var offsetX_Text = 0;
            var offsetY_Text = 0;
            var lines = Mark.GSPS_Text.split('\n');
            for (var i2 = 0; i2 < lines.length; i2++) {
                var offsetX_temp = x1 + (3 * 4 * lines[i2].length) > canvas.width ? (x1 + (3 * 4 * lines[i2].length)) - canvas.width : 0;
                var offsetY_temp = y1 + (3 * 4 * lines[i2].length) > canvas.height ? (y1 + (3 * 4 * lines[i2].length)) - canvas.height : 0;
                if (offsetX_temp > offsetX_Text) offsetX_Text = offsetX_temp;
                if (offsetY_temp > offsetY_Text) offsetY_Text = offsetY_temp;
            }

            x1 -= offsetX_Text;
            y1 -= offsetY_Text;
            if (Mark.GSPS_Text && o == 0) {
                ctx.font = "" + (3 * 4) + "px Arial";
                ctx.fillStyle = "red";
                var tempAlpha = ctx.globalAlpha;
                ctx.globalAlpha = 1.0;
                var lines = Mark.GSPS_Text.split('\n');
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

function drawPOLYLINE(canvas, Mark, viewport) {
    var ctx = canvas.getContext("2d");
    ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);
    setMarkColor(ctx, Mark.color);
    if (Mark.color) ctx.strokeStyle = ctx.fillStyle = "" + Mark.color;

    for (var o = 0; o < Mark.pointArray.length - 1; o += 1) {
        ctx.beginPath();

        var x1 = Mark.pointArray[o].x * 1;
        var y1 = Mark.pointArray[o].y * 1;
        var x2 = Mark.pointArray[o + 1].x * 1;
        var y2 = Mark.pointArray[o + 1].y * 1;

        if (Mark.RotationAngle && Mark.RotationPoint) {
            [x1, y1] = rotatePoint([x1, y1], Mark.RotationAngle, Mark.RotationPoint);
            [x2, y2] = rotatePoint([x2, y2], Mark.RotationAngle, Mark.RotationPoint);
        }

        if (Mark.GSPS_Text && o == 0) {
            ctx.font = "" + (parseInt(ctx.lineWidth) * 4) + "px Arial";
            ctx.fillStyle = "red";
            var tempAlpha = ctx.globalAlpha;
            ctx.globalAlpha = 1.0;
            ctx.fillText("" + Mark.GSPS_Text, x1 < x2 ? x1 : x2, y1 < y2 ? y1 - 7 : y2 - 7);
            ctx.globalAlpha = tempAlpha;
        }
        var tempAlpha2 = ctx.globalAlpha;
        ctx.globalAlpha = 1.0;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.globalAlpha = tempAlpha2;
        if (Mark.GraphicFilled && Mark.GraphicFilled == 'Y') {
            ctx.fillStyle = "#FFFF88";
            ctx.fill();
            console.log(x1, y1, x2, y2)
        };
        ctx.closePath();
    }
}

function drawINTERPOLATED(canvas, Mark, viewport) {
    var ctx = canvas.getContext("2d");
    ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);
    setMarkColor(ctx, Mark.color);
    if (Mark.color) ctx.strokeStyle = ctx.fillStyle = "" + Mark.color;

    var middleX = (Mark.pointArray[0].x + Mark.pointArray[2].x) / 2;
    var middleY = (Mark.pointArray[0].y + Mark.pointArray[2].y) / 2;

    for (var o = 0; o < Mark.pointArray.length - 1; o += 1) {
        ctx.beginPath();
        var x1 = Mark.pointArray[o].x * 1;
        var y1 = Mark.pointArray[o].y * 1;
        var x2 = Mark.pointArray[o + 1].x * 1;
        var y2 = Mark.pointArray[o + 1].y * 1;

        if (Mark.RotationAngle && Mark.RotationPoint) {
            [x1, y1] = rotatePoint([x1, y1], Mark.RotationAngle, Mark.RotationPoint);
            [x2, y2] = rotatePoint([x2, y2], Mark.RotationAngle, Mark.RotationPoint);
        }

        var tempAlpha2 = ctx.globalAlpha;
        ctx.globalAlpha = 1.0;
        var dist = Math.sqrt(Math.pow((x1 - middleX), 2) + Math.pow((y1 - middleY), 2));
        var angle1 = (180 / Math.PI) * Math.atan2(x1 - middleX, y1 + middleY)
        var angle2 = (180 / Math.PI) * Math.atan2(x2 - middleX, y2 + middleY)
        ctx.arc(middleX, middleY, dist, (2 * Math.PI) / angle1, (2 * Math.PI) / angle2);
        ctx.stroke();
        ctx.globalAlpha = tempAlpha2;
        ctx.closePath();

        if (Mark.GSPS_Text && o == 0) {
            ctx.font = "" + (parseInt(ctx.lineWidth) * 4) + "px Arial";
            ctx.fillStyle = "red";
            var tempAlpha = ctx.globalAlpha;
            ctx.globalAlpha = 1.0;
            ctx.fillText("" + Mark.GSPS_Text, x1 < x2 ? x1 : x2, y1 < y2 ? y1 - 7 : y2 - 7);
            ctx.globalAlpha = tempAlpha;
        }
    }
}

function drawELLIPSE(canvas, Mark, viewport) {
    var ctx = canvas.getContext("2d");
    ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);
    for (var o = 0; o < Mark.pointArray.length; o += 1) {
        ctx.beginPath();

        var x1 = Mark.pointArray[o].x * 1;
        //var y1 = mark.markY[o] * 1;
        //var o2 = o == mark.markX.length - 1 ? 0 : o + 1;
        //var x2 = mark.markX[o + 1] * 1;
        var y2 = Mark.pointArray[o + 1].y * 1;
        var x3 = Mark.pointArray[o + 2].x * 1;
        //var y3 = mark.markY[o + 2] * 1;
        //var x4 = mark.markX[o + 3] * 1;
        var y4 = Mark.pointArray[o + 3].y * 1;

        ctx.ellipse((x1 + x3) / 2, (y2 + y4) / 2, Math.abs(x1 - x3), Math.abs(y2 - y4), 0 * Math.PI / 180, 0, 2 * Math.PI);
        ctx.stroke();
        if (getByid("markFillCheck").checked) ctx.fill();
        ctx.closePath();
    }
}

function drawCIRCLE(canvas, Mark, viewport) {
    var ctx = canvas.getContext("2d");
    ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);
    setMarkColor(ctx, Mark.color);
    if (Mark.color) ctx.strokeStyle = ctx.fillStyle = "" + Mark.color;
    for (var o = 0; o < Mark.pointArray.length; o += 2) {
        var x1 = Mark.pointArray[o].x * 1;
        var y1 = Mark.pointArray[o].y * 1;
        var x2 = Mark.pointArray[o + 1].x * 1;
        var y2 = Mark.pointArray[o + 1].y * 1;

        ctx.beginPath();
        var tempAlpha = ctx.globalAlpha;
        ctx.globalAlpha = 1.0;
        var temp_distance = getDistance(Math.abs(x1 - x2), Math.abs(y1 - y2)); //Math.abs(x1 - x2) > Math.abs(y1 - y2) ? Math.abs(x1 - x2) : Math.abs(y1 - y2);
        ctx.arc(x1, y1, temp_distance, 0, 2 * Math.PI);
        ctx.stroke();
        //if (getByid("markFillCheck").checked) ctx.fill();
        ctx.globalAlpha = tempAlpha;
        ctx.closePath();
    }
}

function drawTwoDimensionPolyline(canvas, mark, viewport) {
    var ctx = canvas.getContext("2d");
    ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);

    if (mark.parent.color) ctx.strokeStyle = ctx.fillStyle = "" + mark.parent.color;
    setMarkColor(ctx, mark.parent.color);
    for (var o = 0; o < mark.markX.length; o++) {
        ctx.beginPath();
        x1 = mark.markX[o] /* * viewport.transform.PixelSpacingX*/;
        y1 = mark.markY[o] /** viewport.PixelSpacingY*/;
        o2 = o == mark.markX.length - 1 ? 0 : o + 1;
        x2 = mark.markX[o2] /* * viewport.transform.PixelSpacingX*/;
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
    setMarkColor(ctx, mark.parent.color);

    for (var o = 0; o < mark.markX.length; o++) {
        ctx.beginPath();
        var x1 = mark.markX[o] /* * viewport.transform.PixelSpacingX*/;
        var y1 = mark.markY[o] /* * viewport.PixelSpacingY*/;
        var o2 = o == mark.markX.length - 1 ? 0 : o + 1;
        var x2 = mark.markX[o2] /* * viewport.transform.PixelSpacingX*/;
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
    setMarkColor(ctx, mark.parent.color);
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

function drawRTSS(canvas, Mark, viewport) {
    try {
        var ctx = canvas.getContext("2d");
        setImageOrientation2MarkCanvas(viewport, ctx);

        ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);
        //ctx.setTransform(1, 0, 0, 1, 0, 0);
        //ctx.scale(1, 1);
        if (Mark.color) ctx.strokeStyle = ctx.fillStyle = "" + Mark.color;
        setMarkColor(ctx, Mark.color);
        for (var o = 0; o < Mark.pointArray.length; o++) {
            ctx.beginPath();
            var x1 = Math.ceil((Mark.pointArray[o].x - viewport.transform.imagePositionX) * viewport.transform.PixelSpacingX);
            var y1 = Math.ceil((Mark.pointArray[o].y - viewport.transform.imagePositionY) * viewport.transform.PixelSpacingY);
            var o2 = o == Mark.pointArray.length - 1 ? 0 : o + 1;
            var x2 = Math.ceil((Mark.pointArray[o2].x - viewport.transform.imagePositionX) * viewport.transform.PixelSpacingX);
            var y2 = Math.ceil((Mark.pointArray[o2].y - viewport.transform.imagePositionY) * viewport.transform.PixelSpacingY);

            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.globalAlpha = 1.0;
            ctx.stroke();
            ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);
            ctx.closePath();
        }
        if (getByid("markFillCheck").checked) {
            ctx.beginPath();
            for (var o = 0; o < Mark.pointArray.length; o++) {
                var x1 = Math.ceil((Mark.pointArray[o].x - viewport.transform.imagePositionX) * viewport.transform.PixelSpacingX);
                var y1 = Math.ceil((Mark.pointArray[o].y - viewport.transform.imagePositionY) * viewport.transform.PixelSpacingY);
                var o2 = o == Mark.pointArray.length - 1 ? 0 : o + 1;
                var x2 = Math.ceil((Mark.pointArray[o2].x - viewport.transform.imagePositionX) * viewport.transform.PixelSpacingX);
                var y2 = Math.ceil((Mark.pointArray[o2].y - viewport.transform.imagePositionY) * viewport.transform.PixelSpacingY);

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
    catch (ex) { console.log(ex) };
}

function drawTextAnnotationEntity(canvas, mark, viewport) {
    var ctx = canvas.getContext("2d");
    setImageOrientation2MarkCanvas(viewport, ctx);
    ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);
    if (mark.parent.color) ctx.strokeStyle = ctx.fillStyle = "" + mark.parent.color;
    setMarkColor(ctx, mark.parent.color);

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

function getMarkSize(MarkCanvas, sizeCheck, viewport) {
    if (!viewport) viewport = GetViewport();
    var lineSize = parseFloat(getByid('markSizeText').value);
    var lineWid = 2 * 1.0 / viewport.scale;
    if (sizeCheck == true && lineWid <= 0) {
        lineWid = viewport.scale;
        if (lineWid <= 1.5) lineWid = 1.5;
        lineWid *= Math.abs(1.0 / viewport.scale);
    } else if (sizeCheck == true) {
        lineWid *= Math.abs(viewport.scale);
    } else if (lineWid <= 0) {
        lineWid = viewport.scale;
    }
    if (lineWid <= 1.5) lineWid = 1.5;
    return ((Math.abs(lineWid)) * 2 * lineSize);
}

function displayAllMark() {
    for (var i = 0; i < Viewport_Total; i++)displayMark(i);
}

function displayMark(viewportNum = viewportNumber) {

    if (openLink) for (var z = 0; z < Viewport_Total; z++)  GetViewport(z).drawMark = GetViewport().drawMark;

    var viewport = GetViewport(viewportNum), MarkCanvas = GetViewportMark(viewportNum);
    if (!viewport.drawMark) return;

    var ctx = MarkCanvas.getContext("2d");
    ctx.clearRect(0, 0, viewport.width, viewport.height);

    //注意：標記顏色選擇紅色跟自動都會先初始化為紅色
    ctx.strokeStyle = ctx.fillStyle = "#FF0000";
    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.lineWidth = "" + getMarkSize(MarkCanvas, false, viewport);
    setMarkColor(ctx);
    //try { var [i, j, k] = SearchUid2Index(viewport.sop) } catch (ex) { return; }
    if (!viewport.tags) return;
    var patientMark_all = PatientMark.filter(M => M.sop == viewport.sop);
    var patientMark_enable = patientMark_all.filter(M => checkMarkEnabled(viewport.series, M));

    //compatibleMark
    /*for (var Mark of patientMark_all) {
        for (var mark of Mark.mark) {
            if (!mark.point) mark = compatibleMark(mark);
        }
    }*/

    for (var Mark of patientMark_enable) {
        if (Mark.type == "SEG") drawSEG(MarkCanvas, Mark, viewport);
        else if (Mark.type == "Overlay") drawOverLay(MarkCanvas, Mark, viewport);
    }

    for (var Mark of patientMark_enable) {
        if (Mark.type == "XML_mark") drawXML_mark(MarkCanvas, Mark, Mark.showName);
        else if (Mark.type == "TEXT") drawTEXT(MarkCanvas, Mark, viewport);
        else if (Mark.type == "POLYLINE") drawPOLYLINE(MarkCanvas, Mark, viewport);
        else if (Mark.type == "INTERPOLATED") drawINTERPOLATED(MarkCanvas, Mark, viewport);
        else if (Mark.type == "ELLIPSE") drawELLIPSE(MarkCanvas, Mark, viewport);
        else if (Mark.type == "CIRCLE") drawCIRCLE(MarkCanvas, Mark, viewport);
    }

    for (var Mark of patientMark_enable) {
        for (var mark of Mark.mark) {
            mark.parent = Mark;
            if (mark.type == "TwoDimensionPolyline") drawTwoDimensionPolyline(MarkCanvas, mark, viewport);
            else if (mark.type == "TwoDimensionMultiPoint") drawTwoDimensionMultiPoint(MarkCanvas, mark, viewport);
            else if (mark.type == "TwoDimensionEllipse") drawTwoDimensionEllipse(MarkCanvas, mark, viewport);
            else if (mark.type == "TextAnnotationEntity") drawTextAnnotationEntity(MarkCanvas, mark, viewport);
        }
    }

    for (var Mark of patientMark_enable) {
        if (Mark.type == "RTSS") drawRTSS(MarkCanvas, Mark, viewport);
    }

    for (var Mark of patientMark_enable) {
        if (Mark.constructor.name == "BlueLightMark") {
            MARKER.drawMark({ "canvas": MarkCanvas, "Mark": Mark, "showName": Mark.showName, "viewport": viewport });
            continue;
        }
        else {
            for (var mark of Mark.mark) {
                mark.parent = Mark;
                MARKER.drawMark({ "canvas": MarkCanvas, "mark": mark, "showName": Mark.showName, "viewport": viewport });//MarkCanvas, mark, viewport
            }
        }
    }
}

class BlueLightMark {
    constructor() {
        this.mark = [];
        this.pointArray = [];
        this.study = null;
        this.series = null;
        this.sop = null;
        this.color = null;
        this.imagePositionZ = null;
        this.ImagePositionPatient = null;
        this.width = null;
        this.height = null;
        this.showName = "";
        this.hideName = "";
        this.type = "";
        this.Text = "";
        //Point3D
    }

    setQR(study, series, sop) {
        this.study = study;
        this.series = series;
        this.sop = sop;
    }
    setQRLevels(QRLevels) {
        this.study = QRLevels.study;
        this.series = QRLevels.series;
        this.sop = QRLevels.sop;
    }
    setPoint2D(x, y) {
        this.pointArray.push(new Point2D(x, y));
    }
    setPoint3D(x, y, z) {
        this.pointArray.push(new Point3D(x, y, z));
    }
    get lastMark() { if (this.pointArray.length) return this.pointArray[this.pointArray.length - 1] };
}


function erase() {
    if (BL_mode == 'erase') {
        DeleteMouseEvent();
        getByid("openMeasureImg").src = "../image/icon/black/b_Eraser.png";

        set_BL_model.onchange = function () {
            getByid("openMeasureImg").src = "../image/icon/black/M.png";
            displayMark();
            set_BL_model.onchange = function () { return 0; };
        }

        BlueLightMousedownList = [];
        BlueLightMousedownList.push(function (e) {
            angle_pounch(rotateCalculation(e, true)[0], rotateCalculation(e, true)[1]);
            if (Angle_now_choose) {
                PatientMark.splice(PatientMark.indexOf(Angle_now_choose.dcm), 1);
                displayMark();
                Angle_now_choose = null;
                refreshMarkFromSop(GetViewport().sop);
                return;
            }
            angle_pounch2(rotateCalculation(e, true)[0], rotateCalculation(e, true)[1]);
            if (Angle_now_choose) {
                PatientMark.splice(PatientMark.indexOf(Angle_now_choose.dcm), 1);
                displayMark();
                Angle_now_choose = null;
                refreshMarkFromSop(GetViewport().sop);
                return;
            }
            measure_pounch(rotateCalculation(e, true)[0], rotateCalculation(e, true)[1]);
            if (Measure_now_choose) {
                PatientMark.splice(PatientMark.indexOf(Measure_now_choose.dcm), 1);
                displayMark();
                Measure_now_choose = null;
                refreshMarkFromSop(GetViewport().sop);
                return;
            }
            MeasureRect_pounch(rotateCalculation(e, true)[0], rotateCalculation(e, true)[1]);
            if (MeasureRect_now_choose) {
                PatientMark.splice(PatientMark.indexOf(MeasureRect_now_choose.dcm), 1);
                displayMark();
                MeasureRect_now_choose = null;
                refreshMarkFromSop(GetViewport().sop);
                return;
            }
            MeasureCircle_pounch(rotateCalculation(e, true)[0], rotateCalculation(e, true)[1]);
            if (MeasureCircle_now_choose) {
                PatientMark.splice(PatientMark.indexOf(MeasureCircle_now_choose.dcm), 1);
                displayMark();
                MeasureCircle_now_choose = null;
                refreshMarkFromSop(GetViewport().sop);
                return;
            }
        });
        BlueLightMousemoveList = [];
        BlueLightMouseupList = [];
        AddMouseEvent();
    }
}