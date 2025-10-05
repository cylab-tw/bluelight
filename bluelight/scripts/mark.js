//上一個選擇的標記
var Mark_previous_choose = null;

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
    if (CheckNull(viewport.Orientation) == false) {
        ctx.setTransform(new DOMMatrix(
            [viewport.Orientation[0], -viewport.Orientation[3], 0, viewport.imagePosition[0] * (1.0 / viewport.PixelSpacing[0]),
            -viewport.Orientation[1], viewport.Orientation[4], 0, viewport.imagePosition[1] * (1.0 / viewport.PixelSpacing[1]),
            viewport.Orientation[2], viewport.Orientation[5], 0, viewport.imagePosition[2],
                0, 0, 0, 1
            ]));
        /*
             ctx.setTransform(new DOMMatrix(
            [viewport.Orientation[0], -viewport.Orientation[3], 0, 0,
            -viewport.Orientation[1], viewport.Orientation[4], 0, 0,
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
    mirrorImage(ctx, Mark.canvas, 0, 0, viewport.HorizontalFlip, viewport.VerticalFlip);

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
    mirrorImage(ctx, Mark.canvas, 0, 0, viewport.HorizontalFlip, viewport.VerticalFlip);

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
        if (Mark.GraphicFilled == 'Y') {
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
        var dist = getDistance(x1 - middleX, (y1 - middleY));
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

    var [majorP1, majorP2, minorP1, minorP2] = Mark.pointArray;

    var centerX = (majorP1.x + majorP2.x) / 2, centerY = (majorP1.y + majorP2.y) / 2;

    var dxMajor = majorP2.x - majorP1.x, dyMajor = majorP2.y - majorP1.y;
    var radiusMajor = Math.sqrt(dxMajor * dxMajor + dyMajor * dyMajor) / 2;

    var dxMinor = minorP2.x - minorP1.x, dyMinor = minorP2.y - minorP1.y;
    var radiusMinor = Math.sqrt(dxMinor * dxMinor + dyMinor * dyMinor) / 2;
    var rotation = Math.atan2(dyMajor, dxMajor);

    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusMajor, radiusMinor, rotation, 0, 2 * Math.PI);
    ctx.stroke();
    if (Mark.GraphicFilled == 'Y') ctx.fill();
    ctx.closePath();
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
        x1 = mark.markX[o];
        y1 = mark.markY[o];
        o2 = o == mark.markX.length - 1 ? 0 : o + 1;
        x2 = mark.markX[o2];
        y2 = mark.markY[o2];

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
        var x1 = mark.markX[o];
        var y1 = mark.markY[o];
        var o2 = o == mark.markX.length - 1 ? 0 : o + 1;
        var x2 = mark.markX[o2];
        var y2 = mark.markY[o2];

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

        var heightHalf = getDistance(X1 - X3, Y1 - Y3) / 2;
        var widthHalf = getDistance(X2 - X4, Y2 - Y4) / 2
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
            var x1 = Math.ceil((Mark.pointArray[o].x - viewport.imagePosition[0]) * (1.0 / viewport.PixelSpacing[0]));
            var y1 = Math.ceil((Mark.pointArray[o].y - viewport.imagePosition[1]) * (1.0 / viewport.PixelSpacing[1]));
            var o2 = o == Mark.pointArray.length - 1 ? 0 : o + 1;
            var x2 = Math.ceil((Mark.pointArray[o2].x - viewport.imagePosition[0]) * (1.0 / viewport.PixelSpacing[0]));
            var y2 = Math.ceil((Mark.pointArray[o2].y - viewport.imagePosition[1]) * (1.0 / viewport.PixelSpacing[1]));

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
                var x1 = Math.ceil((Mark.pointArray[o].x - viewport.imagePosition[0]) * (1.0 / viewport.PixelSpacing[0]));
                var y1 = Math.ceil((Mark.pointArray[o].y - viewport.imagePosition[1]) * (1.0 / viewport.PixelSpacing[1]));
                var o2 = o == Mark.pointArray.length - 1 ? 0 : o + 1;
                var x2 = Math.ceil((Mark.pointArray[o2].x - viewport.imagePosition[0]) * (1.0 / viewport.PixelSpacing[0]));
                var y2 = Math.ceil((Mark.pointArray[o2].y - viewport.imagePosition[1]) * (1.0 / viewport.PixelSpacing[1]));

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

function generateCrossLine(imageA, imageB) {
    // 1. 向量運算
    const vec3 = {
        subtract: (v1, v2) => ({ x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z }),
        cross: (v1, v2) => ({ x: v1.y * v2.z - v1.z * v2.y, y: v1.z * v2.x - v1.x * v2.z, z: v1.x * v2.y - v1.y * v2.x, }),
        dot: (v1, v2) => v1.x * v2.x + v1.y * v2.y + v1.z * v2.z,
        add: (v1, v2) => ({ x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z }),
        scale: (v, s) => ({ x: v.x * s, y: v.y * s, z: v.z * s }),
        lengthSq: (v) => v.x * v.x + v.y * v.y + v.z * v.z,
    };

    // 2. 根據 DICOM 標籤計算 3D 座標的函數
    const calculate3DPosition = (col, row, info) => {
        const [Sx, Sy, Sz] = info.imagePosition;
        const [Xx, Xy, Xz, Yx, Yy, Yz] = info.Orientation;
        const [rowSpacing, colSpacing] = info.PixelSpacing;

        return {
            x: Sx + (Xx * colSpacing * col) + (Yx * rowSpacing * row),
            y: Sy + (Xy * colSpacing * col) + (Yy * rowSpacing * row),
            z: Sz + (Xz * colSpacing * col) + (Yz * rowSpacing * row),
        };
    };

    // --- 主要計算流程 ---

    // 步驟 1: 精確計算兩張影像的四個角點像素中心 3D 座標
    const getLast = (dim) => dim > 0 ? dim - 1 : 0;
    const cornersA = [
        calculate3DPosition(0, 0, imageA),
        calculate3DPosition(getLast(imageA.columns), 0, imageA),
        calculate3DPosition(0, getLast(imageA.rows), imageA),
        calculate3DPosition(getLast(imageA.columns), getLast(imageA.rows), imageA),
    ];
    const cornersB = [
        calculate3DPosition(0, 0, imageB),
        calculate3DPosition(getLast(imageB.columns), 0, imageB),
        calculate3DPosition(0, getLast(imageB.rows), imageB),
        calculate3DPosition(getLast(imageB.columns), getLast(imageB.rows), imageB),
    ];

    // 步驟 2: 從影像 B 的角點定義其 3D 平面
    const planeB = {
        point: cornersB[0],
        normal: vec3.cross(
            vec3.subtract(cornersB[1], cornersB[0]), // B的行向量
            vec3.subtract(cornersB[2], cornersB[0])  // B的列向量
        )
    };

    // 若法向量長度過小，表示 B 的角點共線，無法定義平面
    if (vec3.lengthSq(planeB.normal) < 1e-6) return null;

    // 步驟 3: 計算 B 平面與 A 的四條邊界線段的交點
    const edgesA = [
        { start: cornersA[0], end: cornersA[1] }, // 上邊界
        { start: cornersA[1], end: cornersA[3] }, // 右邊界
        { start: cornersA[3], end: cornersA[2] }, // 下邊界
        { start: cornersA[2], end: cornersA[0] }, // 左邊界
    ];

    const intersectionPoints3D = [];
    for (const edge of edgesA) {
        // 內部函數：線段與平面相交測試
        const lineDir = vec3.subtract(edge.end, edge.start);
        const denominator = vec3.dot(planeB.normal, lineDir);

        if (Math.abs(denominator) > 1e-6) {
            const w = vec3.subtract(edge.start, planeB.point);
            const t = -vec3.dot(planeB.normal, w) / denominator;

            if (t >= 0 && t <= 1) { // 確保交點在線段上
                const intersectPoint = vec3.add(edge.start, vec3.scale(lineDir, t));
                // 避免因浮點數誤差加入幾乎相同的點
                if (!intersectionPoints3D.some(p => vec3.lengthSq(vec3.subtract(p, intersectPoint)) < 1e-6))
                    intersectionPoints3D.push(intersectPoint);
            }
        }
    }

    // 步驟 4: 驗證交點數量，必須剛好為 2
    if (intersectionPoints3D.length !== 2) return null; // 不相交、共面或僅接觸一點

    // 步驟 5: 將兩個 3D 交點投影回影像 A 的 2D 像素座標
    const project3DPointTo2D = (point3D) => {
        const [p00, p10, p01] = cornersA; // 左上, 右上, 左下
        const vecRow = vec3.subtract(p10, p00);
        const vecCol = vec3.subtract(p01, p00);
        const vecToPoint = vec3.subtract(point3D, p00);

        const lenSqRow = vec3.lengthSq(vecRow);
        const lenSqCol = vec3.lengthSq(vecCol);

        if (lenSqRow < 1e-6 || lenSqCol < 1e-6) return { x: 0, y: 0 };

        const distCol = vec3.dot(vecToPoint, vecRow) / lenSqRow;
        const distRow = vec3.dot(vecToPoint, vecCol) / lenSqCol;

        return { x: distCol * getLast(imageA.columns), y: distRow * getLast(imageA.rows), };
    };

    return { start: project3DPointTo2D(intersectionPoints3D[0]), end: project3DPointTo2D(intersectionPoints3D[1]) };
}

function drawCrossReferenceLines() {

    function avgDiff(a, b) { return a.reduce((sum, val, i) => sum + Math.abs(val - b[i]), 0) / a.length; }

    var viewport = GetViewport();
    if (!viewport.content || !viewport.content.image || !viewport.content.image.Orientation) return;

    for (var z = 0; z < Viewport_Total; z++) {
        var viewport_ = GetViewport(z);
        if (viewport_.CrossReferenceLines && viewport_.width) {
            GetViewportMark(z).getContext('2d').clearRect(0, 0, viewport_.width, viewport_.height);
            viewport_.CrossReferenceLines = null;
        }
    }
    for (var z = 0; z < Viewport_Total; z++) {
        if (z == viewport.index) continue;
        var viewportB = GetViewport(z);
        if (viewportB.study != viewport.study) continue;
        if (!viewportB.content.image) continue;
        if (!viewportB.content.image.Orientation) continue;
        if (avgDiff(viewportB.content.image.Orientation, viewport.content.image.Orientation) < 0.1) continue;

        var points = generateCrossLine(viewportB.content.image, viewport.content.image);
        if (points == null) return;
        viewportB.CrossReferenceLines = true;
        viewportB.drawLine(GetViewportMark(z).getContext('2d'), viewportB, points.start, points.end, "blue");
    }
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

    if (openLink) SetAllViewport("drawMark", GetViewport().drawMark);

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
    drawCrossReferenceLines();
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

class MarkCollider {
    static selected = null;
    constructor(targetMark, currX, currY, parm) {
        this.x = parseInt(currX);
        this.y = parseInt(currY);
        this.targetMark = targetMark;
        this.parm = parm;
    }
    static detect(currX, currY, targetType = null) {
        MarkCollider.selected = null;
        let block_size = getMarkSize(GetViewportMark(), false) * 4;
        for (var n = 0; n < PatientMark.length; n++) {
            if (PatientMark[n].sop == GetViewport().sop && PatientMark[n].colliders) {
                if (targetType == null || PatientMark[n].type == targetType) {
                    for (var collider of PatientMark[n].colliders) {
                        if (currY + block_size >= collider.y && currY - block_size <= collider.y && currX + block_size >= collider.x && currX - block_size <= collider.x) {
                            MarkCollider.selected = collider;
                            return collider;
                        }
                    }
                }
            }
        }
    }
}

class EraseTool extends ToolEvt {
    onMouseDown(e) {
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

        MarkCollider.detect(rotateCalculation(e, true)[0], rotateCalculation(e, true)[1], "MeasureRuler");
        if (MarkCollider.selected) {
            PatientMark.splice(PatientMark.indexOf(MarkCollider.selected.targetMark), 1);
            displayMark();
            MarkCollider.selected = null;
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

        var other_irregular_now_choose = other_irregular_pounch(rotateCalculation(e, true)[0], rotateCalculation(e, true)[1]);
        if (other_irregular_now_choose) {
            PatientMark.splice(PatientMark.indexOf(other_irregular_now_choose.dcm), 1);
            displayMark();
            other_irregular_now_choose = null;
            refreshMarkFromSop(GetViewport().sop);
            return;
        }
    }

    onSwitch() {
        getByid("openMeasureImg").src = "../image/icon/lite/M.png";
        displayMark();
    }
}

function erase() {
    getByid("openMeasureImg").src = "../image/icon/lite/b_Eraser.png";
    toolEvt.onSwitch();
    toolEvt = new EraseTool();
}