
//紀錄測量工具座標
var Measure_Point1 = [0, 0];
var Measure_Point2 = [0, 0];

var Measure_now_choose = null;
var Measure_previous_choose = null;
function measure() {
    if (BL_mode == 'measure') {
        DeleteMouseEvent();
        //cancelTools();
        //document.documentElement.onmousemove = displayMeasurelLabel;
        //document.documentElement.ontouchmove = displayMeasurelLabel;
        cancelTools();
        openMeasure = true;
        set_BL_model.onchange1 = function () {
            getByid("MeasureLabel").style.display = 'none';
            displayMark();
            openMeasure = false;
            document.documentElement.onmousemove = DivDraw;
            document.documentElement.ontouchmove = DivDraw;
            set_BL_model.onchange1 = function () { return 0; };
        }

        BlueLightMousedownList = [];
        BlueLightMousedownList.push(function (e) {
            measure_pounch(rotateCalculation(e)[0], rotateCalculation(e)[1]);
            Measure_previous_choose = null;
            if (!Measure_now_choose) {
                var MeasureMark = new BlueLightMark();

                MeasureMark.setQRLevels(GetNewViewport().QRLevels);
                MeasureMark.color = "#FF0000";
                MeasureMark.hideName = MeasureMark.showName = "ruler";
                MeasureMark.type = "MeasureRuler";

                Measure_previous_choose = MeasureMark;
                PatientMark.push(MeasureMark);
            }
            Measure_Point1 = Measure_Point2 = rotateCalculation(e);
            displayAllMark();
        });

        Mousemove = function (e) {
            var [currX, currY] = getCurrPoint(e);
            let angle2point = rotateCalculation(e);

            if (rightMouseDown == true) scale_size(e, currX, currY);

            if (MouseDownCheck) {
                Measure_Point2 = angle2point;
                if (Measure_now_choose) {
                    Measure_now_choose.pointArray[Measure_now_choose.order].x = angle2point[0];
                    Measure_now_choose.pointArray[Measure_now_choose.order].y = angle2point[1];
                    Measure_now_choose.dcm.Text = getMeasurelValueBy2Point(Measure_now_choose.pointArray);
                    refreshMark(Measure_now_choose.dcm);
                    return;
                } else if (Measure_previous_choose) {
                    MeasureMark = Measure_previous_choose;

                    MeasureMark.pointArray = [];
                    MeasureMark.setPoint2D(Measure_Point1[0], Measure_Point1[1]);
                    MeasureMark.setPoint2D(Measure_Point2[0], Measure_Point2[1]);

                    MeasureMark.Text = getMeasurelValue(e);
                    refreshMark(MeasureMark);
                    displayAllMark();
                    return;
                }
            }

            //GetViewport().originalPointX = currX;
            //GetViewport().originalPointY = currY;
        }

        Mouseup = function (e) {

            let angle2point = rotateCalculation(e);
            Measure_Point2 = angle2point;

            if (Measure_now_choose) {
                Measure_now_choose.pointArray[Measure_now_choose.order].x = angle2point[0];
                Measure_now_choose.pointArray[Measure_now_choose.order].y = angle2point[1];
                Measure_now_choose.dcm.Text = getMeasurelValueBy2Point(Measure_now_choose.pointArray);
                refreshMark(Measure_now_choose.dcm);
            }
            else if (Measure_previous_choose) {
                MeasureMark = Measure_previous_choose;

                MeasureMark.pointArray = [];
                MeasureMark.setPoint2D(Measure_Point1[0], Measure_Point1[1]);
                MeasureMark.setPoint2D(Measure_Point2[0], Measure_Point2[1]);

                MeasureMark.Text = getMeasurelValue(e);
                refreshMark(MeasureMark);
                //Graphic_now_choose = { reference: dcm };
                //Measure_previous_choose = dcm;
            }
            if (Measure_now_choose) Measure_previous_choose = Measure_now_choose;
            Measure_now_choose = null;
            displayAllMark();

            if (openMouseTool == true && rightMouseDown == true) displayMark();
            MouseDownCheck = rightMouseDown = false;
            magnifierDiv.hide();

            if (openLink) displayAllRuler();
        }

        BlueLightTouchstartList = [];
        BlueLightTouchstartList.push(function (e, e2) {
            getByid("MeasureLabel").style.display = '';
            var [currX11, currY11] = rotateCalculation(e);
            Measure_Point2 = Measure_Point1 = [currX11, currY11];
            displayAllMark();
        });

        Touchmove = function (e, e2) {
            if (openDisplayMarkup && (getByid("DICOMTagsSelect").selected || getByid("AIMSelect").selected)) return;

            var currX = getCurrPoint(e)[0];
            var currY = getCurrPoint(e)[1];
            if (e2) {
                var currX2 = getCurrPoint(e2)[0];
                var currY2 = getCurrPoint(e2)[1];
            }

            //尚未完成
            if (TouchDownCheck == true && rightTouchDown == false) {
                // if (openMeasure == true) 
                {
                    // Measure_Point1 = [getCurrPoint(e)[0], getCurrPoint(e)[1]];
                    let angle2point = rotateCalculation(e);
                    var currX11 = angle2point[0];
                    var currY11 = angle2point[1];
                    Measure_Point2 = [currX11, currY11];
                    displayAllMark();

                    return;
                }
            }
        }
        Touchend = function (e, e2) {
            if (TouchDownCheck == true) {
                if (openAngle == 1) openAngle = 2;
                else if (openAngle == 2) openAngle = 3;
            }
            TouchDownCheck = false;
            rightTouchDown = false;

            magnifierDiv.hide();

        }
        AddMouseEvent();
    }
}

function measure_pounch(currX, currY) {
    let block_size = getMarkSize(GetViewportMark(), false) * 4;
    for (var n = 0; n < PatientMark.length; n++) {
        if (PatientMark[n].sop == GetNewViewport().sop) {
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

function getMeasurelValueBy2Point(pointArray) {
    var value = parseInt(Math.sqrt(
        Math.pow(pointArray[0].x / GetNewViewport().transform.PixelSpacingX - pointArray[1].x / GetNewViewport().transform.PixelSpacingX, 2) +
        Math.pow(pointArray[0].y / GetNewViewport().transform.PixelSpacingY - pointArray[1].y / GetNewViewport().transform.PixelSpacingY, 2), 2)) +
        "mm";
    return value;
}

function getMeasurelValue(e) {
    var value = parseInt(Math.sqrt(
        Math.pow(Measure_Point2[0] / GetNewViewport().transform.PixelSpacingX - Measure_Point1[0] / GetNewViewport().transform.PixelSpacingX, 2) +
        Math.pow(Measure_Point2[1] / GetNewViewport().transform.PixelSpacingY - Measure_Point1[1] / GetNewViewport().transform.PixelSpacingY, 2), 2)) +
        "mm";
    return value;
}

window.addEventListener('keydown', (KeyboardKeys) => {
    var key = KeyboardKeys.which

    if ((BL_mode == 'measure') && Measure_previous_choose && (key === 46 || key === 110)) {
        PatientMark.splice(PatientMark.indexOf(Measure_previous_choose.dcm), 1);
        displayMark();
        Measure_previous_choose = null;
        refreshMarkFromSop(GetNewViewport().sop);
    }
    Measure_previous_choose = null;
});

function drawMeasureRuler(obj) {
    try {
        var canvas = obj.canvas, Mark = obj.Mark;
        if (!Mark) return;
        if (!Mark || Mark.type != "MeasureRuler" || Mark.pointArray.length < 2) return;
        var ctx = canvas.getContext("2d");
        ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);
        setMarkColor(ctx);
        if (Mark.color) ctx.strokeStyle = ctx.fillStyle = "" + Mark.color;

        ctx.beginPath();
        var x1 = Mark.pointArray[0].x * 1, y1 = Mark.pointArray[0].y * 1;
        var x2 = Mark.pointArray[1].x * 1, y2 = Mark.pointArray[1].y * 1;

        if (Mark.RotationAngle && Mark.RotationPoint) {
            [x1, y1] = rotatePoint([x1, y1], Mark.RotationAngle, Mark.RotationPoint);
            [x2, y2] = rotatePoint([x2, y2], Mark.RotationAngle, Mark.RotationPoint);
        }

        var tempAlpha2 = ctx.globalAlpha;
        ctx.globalAlpha = 1.0;
        ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.globalAlpha = tempAlpha2;
        ctx.closePath();

        var tempAlpha2 = ctx.globalAlpha;
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = "#00FF00";
        ctx.fillStyle = "#00FF00";
        ctx.beginPath();
        ctx.arc(Mark.pointArray[0].x, Mark.pointArray[0].y, 3, 0, 2 * Math.PI);
        ctx.arc(Mark.lastMark.x, Mark.lastMark.y, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        if (Mark.Text) {
            ctx.beginPath();
            ctx.font = "" + (22) + "px Arial";
            ctx.fillStyle = "#FF0000";
            ctx.fillText("" + Mark.Text, Mark.lastMark.x, Mark.lastMark.y);
            ctx.closePath();
        }
        ctx.globalAlpha = tempAlpha2;
    } catch (ex) { console.log(ex) }

}
PLUGIN.PushMarkList(drawMeasureRuler);