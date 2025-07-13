
var MeasureShape_previous_choose = null;
var MeasureRect_now_choose = null;
var MeasureCircle_now_choose = null;

class MeasureRectTool extends ToolEvt {

    onMouseDown(e) {
        if (!MouseDownCheck) return;
        MeasureRect_pounch(rotateCalculation(e, true)[0], rotateCalculation(e, true)[1]);
        MeasureShape_previous_choose = null;
        if (MeasureRect_now_choose) return;
        var MeasureMark = new BlueLightMark();
        let angle2point = rotateCalculation(e, true);
        MeasureMark.setQRLevels(GetViewport().QRLevels);
        MeasureMark.color = "#FFFFFF";
        MeasureMark.hideName = MeasureMark.showName = "ruler";
        MeasureMark.type = "MeasureRect";
        MeasureMark.pointArray = [];
        MeasureMark.setPoint2D(angle2point[0], angle2point[1]);
        MeasureMark.setPoint2D(angle2point[0], angle2point[1]);
        MeasureShape_previous_choose = MeasureMark;
        PatientMark.push(MeasureMark);
        refreshMark(MeasureMark);
        displayAllMark();
    }
    onMouseMove(e) {
        if (rightMouseDown) scale_size(e, originalPoint_X, originalPoint_Y);
        let angle2point = rotateCalculation(e, true);
        if (MouseDownCheck && MeasureRect_now_choose) {
            MeasureRect_now_choose.pointArray[MeasureRect_now_choose.order].x = angle2point[0];
            MeasureRect_now_choose.pointArray[MeasureRect_now_choose.order].y = angle2point[1];

            refreshMark(MeasureRect_now_choose.dcm);
            displayAllMark();
        }
        else if (MouseDownCheck && MeasureShape_previous_choose) {
            MeasureShape_previous_choose.pointArray[1].x = angle2point[0];
            MeasureShape_previous_choose.pointArray[1].y = angle2point[1];

            refreshMark(MeasureShape_previous_choose);
            displayAllMark();
        }
    }
    onMouseUp(e) {
        if (MeasureShape_previous_choose) {
            Mark_previous_choose = MeasureShape_previous_choose;
            MeasureShape_previous_choose = null;
        }
        if (MeasureRect_now_choose) {
            Mark_previous_choose = MeasureRect_now_choose;
            MeasureRect_now_choose = null;
        }
        displayMark();
    }
    onSwitch() {
        displayMark();
        set_BL_model.onchange = function () { return 0; };
    }
}

function MeasureRect() {
    cancelTools();
    toolEvt.onSwitch();
    toolEvt = new MeasureRectTool();
    /*if (BL_mode == 'MeasureRect') {
    }*/
}

class MeasureCircleTool extends ToolEvt {

    onMouseDown(e) {
        if (!MouseDownCheck) return;
        MeasureCircle_pounch(rotateCalculation(e, true)[0], rotateCalculation(e, true)[1]);
        MeasureShape_previous_choose = null;
        if (MeasureCircle_now_choose) return;
        var MeasureMark = new BlueLightMark();
        let angle2point = rotateCalculation(e, true);
        MeasureMark.setQRLevels(GetViewport().QRLevels);
        MeasureMark.color = "#FFFFFF";
        MeasureMark.hideName = MeasureMark.showName = "ruler";
        MeasureMark.type = "MeasureCircle";
        MeasureMark.pointArray = [];
        MeasureMark.setPoint2D(angle2point[0], angle2point[1]);
        MeasureMark.setPoint2D(angle2point[0], angle2point[1]);
        MeasureShape_previous_choose = MeasureMark;
        PatientMark.push(MeasureMark);
        refreshMark(MeasureMark);
        displayAllMark();
    }
    onMouseMove(e) {
        if (rightMouseDown) scale_size(e, originalPoint_X, originalPoint_Y);
        let angle2point = rotateCalculation(e, true);
        if (MouseDownCheck && MeasureCircle_now_choose) {
            //MeasureCircle_now_choose.pointArray[MeasureCircle_now_choose.order].x = angle2point[0];
            //MeasureCircle_now_choose.pointArray[MeasureCircle_now_choose.order].y = angle2point[1];

            if (MeasureCircle_now_choose.value == "begin") {
                var origin_point = [MeasureCircle_now_choose.pointArray[0].x, MeasureCircle_now_choose.pointArray[0].y];
                MeasureCircle_now_choose.pointArray[0].x = angle2point[0];
                MeasureCircle_now_choose.pointArray[0].y = angle2point[1];
                MeasureCircle_now_choose.pointArray[1].x += (angle2point[0] - origin_point[0]);
                MeasureCircle_now_choose.pointArray[1].y += (angle2point[1] - origin_point[1]);
            } else if (MeasureCircle_now_choose.value == "end") {
                MeasureCircle_now_choose.pointArray[1].x = angle2point[0];
                MeasureCircle_now_choose.pointArray[1].y = angle2point[1];
            }

            var x1 = MeasureCircle_now_choose.pointArray[0].x * 1;
            var y1 = MeasureCircle_now_choose.pointArray[0].y * 1;
            var x2 = MeasureCircle_now_choose.pointArray[0 + 1].x * 1;
            var y2 = MeasureCircle_now_choose.pointArray[0 + 1].y * 1;

            refreshMark(MeasureCircle_now_choose.dcm);
            displayAllMark();
        }
        if (MouseDownCheck && MeasureShape_previous_choose) {
            var originalPoint_X = MeasureShape_previous_choose.pointArray[0].x;
            var originalPoint_Y = MeasureShape_previous_choose.pointArray[0].y;
            MeasureShape_previous_choose.pointArray[1].x = originalPoint_X + Math.sqrt(Math.pow(Math.abs(originalPoint_X - angle2point[0]), 2) + Math.pow(Math.abs(originalPoint_Y - angle2point[1]), 2) / 2);
            MeasureShape_previous_choose.pointArray[1].y = originalPoint_Y + Math.sqrt(Math.pow(Math.abs(originalPoint_X - angle2point[0]), 2) + Math.pow(Math.abs(originalPoint_Y - angle2point[1]), 2) / 2)

            var x1 = MeasureShape_previous_choose.pointArray[0].x * 1;
            var y1 = MeasureShape_previous_choose.pointArray[0].y * 1;
            var x2 = MeasureShape_previous_choose.pointArray[0 + 1].x * 1;
            var y2 = MeasureShape_previous_choose.pointArray[0 + 1].y * 1;

            refreshMark(MeasureShape_previous_choose);
            displayAllMark();
        }
    }
    onMouseUp(e) {
        if (MeasureShape_previous_choose) {
            Mark_previous_choose = MeasureShape_previous_choose;
            MeasureShape_previous_choose = null;
        }
        if (MeasureCircle_now_choose) {
            Mark_previous_choose = MeasureCircle_now_choose;
            MeasureCircle_now_choose = null;
        }
        displayMark();
    }
    onSwitch() {
        displayMark();
        set_BL_model.onchange = function () { return 0; };
    }
}

function MeasureCircle() {
    cancelTools();
    toolEvt.onSwitch();
    toolEvt = new MeasureCircleTool();

    /*if (BL_mode == 'MeasureCircle') {
    }*/
}

function MeasureRect_pounch(currX, currY) {
    let block_size = getMarkSize(GetViewportMark(), false) * 4;
    for (var n = 0; n < PatientMark.length; n++) {
        if (PatientMark[n].sop == GetViewport().sop) {
            if (PatientMark[n].type == "MeasureRect") {
                var tempMark = PatientMark[n].pointArray;

                var x1 = parseInt(tempMark[0].x), y1 = parseInt(tempMark[0].y);
                if (currY + block_size >= y1 && currY - block_size <= y1 && currX + block_size >= x1 && currX - block_size <= x1) {
                    MeasureRect_now_choose = { dcm: PatientMark[n], pointArray: PatientMark[n].pointArray, order: 0 };
                }

                var x2 = parseInt(tempMark[1].x), y2 = parseInt(tempMark[1].y);
                if (currY + block_size >= y2 && currY - block_size <= y2 && currX + block_size >= x2 && currX - block_size <= x2) {
                    MeasureRect_now_choose = { dcm: PatientMark[n], pointArray: PatientMark[n].pointArray, order: 1 };
                }
            }
        }
    }
}

function MeasureCircle_pounch(currX, currY) {
    let block_size = getMarkSize(GetViewportMark(), false) * 4;
    for (var n = 0; n < PatientMark.length; n++) {
        if (PatientMark[n].sop == GetViewport().sop) {
            if (PatientMark[n].type == "MeasureCircle") {
                var tempMark = PatientMark[n].pointArray;

                var x1 = parseInt(tempMark[0].x), y1 = parseInt(tempMark[0].y);
                if (currY + block_size >= y1 && currY - block_size <= y1 && currX + block_size >= x1 && currX - block_size <= x1) {
                    MeasureCircle_now_choose = {
                        dcm: PatientMark[n], Mark: PatientMark[n], pointArray: tempMark, value: 'begin'
                    };
                }

                var x2 = parseInt(tempMark[1].x), y2 = parseInt(tempMark[1].y);
                if (currY + block_size >= y2 && currY - block_size <= y2 && currX + block_size >= x2 && currX - block_size <= x2) {
                    MeasureCircle_now_choose = {
                        dcm: PatientMark[n], Mark: PatientMark[n], pointArray: tempMark, value: 'end'
                    };
                }
            }
        }
    }
}

function drawMeasureRect(obj) {
    var canvas = obj.canvas, Mark = obj.Mark, viewport = obj.viewport;
    if (!Mark) return;
    if (!Mark || Mark.type != "MeasureRect" || Mark.pointArray.length < 2) return;
    var ctx = canvas.getContext("2d"), color = null, pointArray = Mark.pointArray, size = 22;
    if (Mark.color && getByid("AutoColorSelect") && getByid("AutoColorSelect").selected) color = "" + Mark.color;

    try {
        viewport.drawRect(ctx, viewport, pointArray, [color, color], [1.0, 0.3]);

        viewport.fillCircle(ctx, viewport, Mark.pointArray[0], 3, "#FF0000", 1.0);
        viewport.fillCircle(ctx, viewport, Mark.pointArray[1], 3, "#FF0000", 1.0);


        if (Mark.pointArray[0] && Mark.pointArray[1]) {
            var value = "";
            if (viewport.transform.PixelSpacingX && viewport.transform.PixelSpacingY) {
                value = parseInt(
                    (Math.abs(Mark.pointArray[0].x - Mark.pointArray[1].x)
                        * Math.abs(Mark.pointArray[0].y - Mark.pointArray[1].y)
                    ) / (viewport.transform.PixelSpacingX * viewport.transform.PixelSpacingY)) + "mm²";
            } else {
                value = parseInt(
                    (Math.abs(Mark.pointArray[0].x - Mark.pointArray[1].x)
                        * Math.abs(Mark.pointArray[0].y - Mark.pointArray[1].y)
                    )) + "px²";
            }

            var maxX = pointArray[0].x > pointArray[1].x ? pointArray[0].x : pointArray[1].x;
            var maxY = pointArray[0].y > pointArray[1].y ? pointArray[0].y : pointArray[1].y;
            var point = new Point2D(maxX - (value.length * (size / 2) + size), maxY - (size / 4));
            for (var t = 0; t < 5; t++)
                viewport.drawText(ctx, viewport, point, value, size, "#FF0000", alpha = 1.0, [{ shadowBlur: 7 }, { shadowColor: "white" }]);
        }

    } catch (ex) { console.log(ex) }
}
PLUGIN.PushMarkList(drawMeasureRect);


function drawMeasureCIRCLE(obj) {
    var canvas = obj.canvas, Mark = obj.Mark, viewport = obj.viewport;
    if (!Mark) return;
    if (!Mark || Mark.type != "MeasureCircle" || Mark.pointArray.length < 2) return;

    var ctx = canvas.getContext("2d"), color = null, pointArray = Mark.pointArray, size = 22;
    if (Mark.color && getByid("AutoColorSelect") && getByid("AutoColorSelect").selected) color = "" + Mark.color;

    try {
        var dist = getDistance(Math.abs(pointArray[0].x - pointArray[1].x), Math.abs(pointArray[0].y - pointArray[1].y));
        viewport.drawCircle(ctx, viewport, pointArray[0], dist, [color, color], [1.0, 0.3]);
        viewport.fillCircle(ctx, viewport, pointArray[0], 3, "#FF0000", 1.0);
        viewport.fillCircle(ctx, viewport, pointArray[1], 3, "#FF0000", 1.0);

        var value = "";
        if (viewport.transform.PixelSpacingX && viewport.transform.PixelSpacingY) {
            value = parseInt((dist * dist * Math.PI) / (viewport.transform.PixelSpacingX * viewport.transform.PixelSpacingY)) + "mm²";
        } else {
            value = parseInt((dist * dist * Math.PI)) + "px²";
        }

        var point = new Point2D(pointArray[0].x - (value.length * (size / 4)), pointArray[0].y - 10);
        for (var t = 0; t < 5; t++)
            viewport.drawText(ctx, viewport, point, value, size, "#FF0000", alpha = 1.0, [{ shadowBlur: 7 }, { shadowColor: "white" }]);

    } catch (ex) { console.log(ex) }
}

PLUGIN.PushMarkList(drawMeasureCIRCLE);

onloadFunction.push2Last(function () {
    getByid("RectRuler").onclick = function () {
        if (this.enable == false) return;
        set_BL_model('MeasureRect');
        MeasureRect();
        drawBorder(getByid("openMeasureImg"));
        hideAllDrawer();
    }

    getByid("CircleRuler").onclick = function () {
        if (this.enable == false) return;
        set_BL_model('MeasureCircle');
        MeasureCircle();
        drawBorder(getByid("openMeasureImg"));
        hideAllDrawer();
    }
});
