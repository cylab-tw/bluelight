
//紀錄測量工具座標
var Measure_Point1 = [0, 0];
var Measure_Point2 = [0, 0];

var Measure_now_choose = null;
var Measure_previous_choose = null;

class MeasureTool extends ToolEvt {
    onMouseDown(e) {
        Measure_previous_choose = null;
        if (!MouseDownCheck) return;
        measure_pounch(rotateCalculation(e, true)[0], rotateCalculation(e, true)[1]);
        if (!Measure_now_choose && MouseDownCheck) {
            var MeasureMark = new BlueLightMark();

            MeasureMark.setQRLevels(GetViewport().QRLevels);
            MeasureMark.color = "#FF0000";
            MeasureMark.hideName = MeasureMark.showName = "ruler";
            MeasureMark.type = "MeasureRuler";

            Measure_previous_choose = MeasureMark;
            PatientMark.push(MeasureMark);
        }
        Measure_Point1 = Measure_Point2 = rotateCalculation(e, true);
        displayAllMark();
    }
    onMouseMove(e) {
        if (rightMouseDown) scale_size(e, originalPoint_X, originalPoint_Y);
        let angle2point = rotateCalculation(e, true);
        if (MouseDownCheck) {
            Measure_Point2 = angle2point;
            if (Measure_now_choose) {
                Measure_now_choose.pointArray[Measure_now_choose.order].x = angle2point[0];
                Measure_now_choose.pointArray[Measure_now_choose.order].y = angle2point[1];
                refreshMark(Measure_now_choose.dcm);
            } else if (Measure_previous_choose) {
                var MeasureMark = Measure_previous_choose;

                MeasureMark.pointArray = [];
                MeasureMark.setPoint2D(Measure_Point1[0], Measure_Point1[1]);
                MeasureMark.setPoint2D(Measure_Point2[0], Measure_Point2[1]);

                refreshMark(MeasureMark);
                displayAllMark();
            }
        }
    }
    onMouseUp(e) {
        let angle2point = rotateCalculation(e, true);
        Measure_Point2 = angle2point;

        if (Measure_now_choose) {
            Measure_now_choose.pointArray[Measure_now_choose.order].x = angle2point[0];
            Measure_now_choose.pointArray[Measure_now_choose.order].y = angle2point[1];
            refreshMark(Measure_now_choose.dcm);
            Mark_previous_choose = Measure_now_choose;
        }
        else if (Measure_previous_choose) {
            var MeasureMark = Measure_previous_choose;

            MeasureMark.pointArray = [];
            MeasureMark.setPoint2D(Measure_Point1[0], Measure_Point1[1]);
            MeasureMark.setPoint2D(Measure_Point2[0], Measure_Point2[1]);

            refreshMark(MeasureMark);
            //Graphic_now_choose = { reference: dcm };
            //Measure_previous_choose = dcm;
            Mark_previous_choose = Measure_previous_choose;
        }
        if (Measure_now_choose) Measure_previous_choose = Measure_now_choose;
        Measure_now_choose = null;
        displayAllMark();

        if (rightMouseDown == true) displayMark();

        if (openLink) displayAllRuler();
    }
    onSwitch() {
        displayMark();
        set_BL_model.onchange = function () { return 0; };
    }
    onTouchStart(e, e2) {
        measure_pounch(rotateCalculation(e, true)[0], rotateCalculation(e, true)[1]);
        Measure_previous_choose = null;
        if (!Measure_now_choose) {
            var MeasureMark = new BlueLightMark();

            MeasureMark.setQRLevels(GetViewport().QRLevels);
            MeasureMark.color = "#FF0000";
            MeasureMark.hideName = MeasureMark.showName = "ruler";
            MeasureMark.type = "MeasureRuler";

            Measure_previous_choose = MeasureMark;
            PatientMark.push(MeasureMark);
        }
        Measure_Point1 = Measure_Point2 = rotateCalculation(e, true);
        displayAllMark();
    }
    onTouchMove(e, e2) {
        if (rightTouchDown) scale_size(e, originalPoint_X, originalPoint_Y);
        let angle2point = rotateCalculation(e, true);
        if (TouchDownCheck) {
            Measure_Point2 = angle2point;
            if (Measure_now_choose) {
                Measure_now_choose.pointArray[Measure_now_choose.order].x = angle2point[0];
                Measure_now_choose.pointArray[Measure_now_choose.order].y = angle2point[1];
                refreshMark(Measure_now_choose.dcm);
            } else if (Measure_previous_choose) {
                var MeasureMark = Measure_previous_choose;

                MeasureMark.pointArray = [];
                MeasureMark.setPoint2D(Measure_Point1[0], Measure_Point1[1]);
                MeasureMark.setPoint2D(Measure_Point2[0], Measure_Point2[1]);

                refreshMark(MeasureMark);
                displayAllMark();
            }
        }
    }
    onTouchEnd(e, e2) {
        //let angle2point = rotateCalculation(e,true);
        //Measure_Point2 = angle2point;

        if (Measure_now_choose) {
            Measure_now_choose.pointArray[Measure_now_choose.order].x = angle2point[0];
            Measure_now_choose.pointArray[Measure_now_choose.order].y = angle2point[1];
            refreshMark(Measure_now_choose.dcm);
        }
        else if (Measure_previous_choose) {
            /*var MeasureMark = Measure_previous_choose;

            MeasureMark.pointArray = [];
            MeasureMark.setPoint2D(Measure_Point1[0], Measure_Point1[1]);
            MeasureMark.setPoint2D(Measure_Point2[0], Measure_Point2[1]);

            MeasureMark.Text = getMeasurelValue(e);
            refreshMark(MeasureMark);*/
            //Graphic_now_choose = { reference: dcm };
            //Measure_previous_choose = dcm;
        }
        if (Measure_now_choose) Measure_previous_choose = Measure_now_choose;
        Measure_now_choose = null;
        displayAllMark();

        if (rightMouseDown == true) displayMark();

        if (openLink) displayAllRuler();
    }
}

function measure() {

    cancelTools();
    toolEvt.onSwitch();
    toolEvt = new MeasureTool();
    /*if (BL_mode == 'measure') {
    }*/
}

function measure_pounch(currX, currY) {
    let block_size = getMarkSize(GetViewportMark(), false) * 4;
    for (var n = 0; n < PatientMark.length; n++) {
        if (PatientMark[n].sop == GetViewport().sop) {
            if (PatientMark[n].type == "MeasureRuler") {
                var tempMark = PatientMark[n].pointArray;

                var x1 = parseInt(tempMark[0].x), y1 = parseInt(tempMark[0].y);
                if (currY + block_size >= y1 && currY - block_size <= y1 && currX + block_size >= x1 && currX - block_size <= x1) {
                    Measure_now_choose = { dcm: PatientMark[n], pointArray: PatientMark[n].pointArray, order: 0 };
                }

                var x2 = parseInt(tempMark[1].x), y2 = parseInt(tempMark[1].y);
                if (currY + block_size >= y2 && currY - block_size <= y2 && currX + block_size >= x2 && currX - block_size <= x2) {
                    Measure_now_choose = { dcm: PatientMark[n], pointArray: PatientMark[n].pointArray, order: 1 };
                }
                /*if (currY + block_size >= y1 && currX + block_size >= x1 / 2 + x2 / 2 && currY < y1 + block_size && currX < x1 / 2 + x2 / 2 + block_size) {

                }*/
            }
        }
    }
}

window.addEventListener('keydown', (KeyboardKeys) => {
    var key = KeyboardKeys.which

    if ((BL_mode == 'measure') && Measure_previous_choose && (key === 46 || key === 110)) {
        PatientMark.splice(PatientMark.indexOf(Measure_previous_choose.dcm), 1);
        displayMark();
        Measure_previous_choose = null;
        refreshMarkFromSop(GetViewport().sop);
    }
    Measure_previous_choose = null;
});

function drawMeasureRuler(obj) {
    try {
        var canvas = obj.canvas, Mark = obj.Mark, viewport = obj.viewport;
        if (!Mark) return;
        if (!Mark || Mark.type != "MeasureRuler" || Mark.pointArray.length < 2) return;
        var ctx = canvas.getContext("2d");

        var x1 = Mark.pointArray[0].x * 1, y1 = Mark.pointArray[0].y * 1;
        var x2 = Mark.pointArray[1].x * 1, y2 = Mark.pointArray[1].y * 1;
        if (Mark.RotationAngle && Mark.RotationPoint) {
            [x1, y1] = rotatePoint([x1, y1], Mark.RotationAngle, Mark.RotationPoint);
            [x2, y2] = rotatePoint([x2, y2], Mark.RotationAngle, Mark.RotationPoint);
        }
        viewport.drawLine(ctx, viewport, new Point2D(x1, y1), new Point2D(x2, y2), Mark.color, 1.0);

        viewport.fillCircle(ctx, viewport, Mark.pointArray[0], 3, "#00FF00", 1.0);
        viewport.fillCircle(ctx, viewport, Mark.lastMark, 3, "#00FF00", 1.0);

        if (Mark.pointArray[0] && Mark.pointArray[1]) {
            if (viewport.transform.PixelSpacingX && viewport.transform.PixelSpacingY) {
                var value = parseInt(Math.sqrt(
                    Math.pow(Mark.pointArray[0].x / viewport.transform.PixelSpacingX - Mark.pointArray[1].x / viewport.transform.PixelSpacingX, 2) +
                    Math.pow(Mark.pointArray[0].y / viewport.transform.PixelSpacingY - Mark.pointArray[1].y / viewport.transform.PixelSpacingY, 2), 2)) +
                    "mm";
                viewport.drawText(ctx, viewport, Mark.lastMark, value, 22, "#FF0000", alpha = 1.0);
            } else {
                var value = parseInt(Math.sqrt(
                    Math.pow(Mark.pointArray[0].x - Mark.pointArray[1].x, 2) +
                    Math.pow(Mark.pointArray[0].y - Mark.pointArray[1].y, 2), 2)) +
                    "px";
                viewport.drawText(ctx, viewport, Mark.lastMark, value, 22, "#FF0000", alpha = 1.0);
            }
        }

    } catch (ex) { console.log(ex) }
}
PLUGIN.PushMarkList(drawMeasureRuler);

onloadFunction.push2Last(function () {
    getByid("MeasureRuler").onclick = function () {
        if (this.enable == false) return;
        set_BL_model('measure');
        measure();
        drawBorder(getByid("openMeasureImg"));
        hideAllDrawer();
    }
});
