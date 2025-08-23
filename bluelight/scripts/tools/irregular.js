
var Arrow_Point1 = [0, 0];
var Arrow_Point2 = [0, 0];
var ArrowRule_previous_choose = null;
var MeasureIrregular_previous_choose = null;
var MeasureIrregular_now_choose = null;

class MeasureIrregularTool extends ToolEvt {

    onMouseDown(e) {
        if (!MouseDownCheck) return;
        MeasureIrregular_now_choose = null;
        MeasureIrregular_now_choose = other_irregular_pounch(rotateCalculation(e, true)[0], rotateCalculation(e, true)[1]);
        if (MeasureIrregular_now_choose) return;
        var MeasureMark = new BlueLightMark();
        let angle2point = rotateCalculation(e, true);
        MeasureMark.setQRLevels(GetViewport().QRLevels);
        MeasureMark.color = "#FFFFFF";
        MeasureMark.hideName = MeasureMark.showName = "ruler";
        MeasureMark.type = "IrregularRuler";
        MeasureMark.pointArray = [];
        MeasureMark.setPoint2D(angle2point[0], angle2point[1]);
        MeasureMark.setPoint2D(angle2point[0], angle2point[1]);
        MeasureIrregular_previous_choose = MeasureMark;
        PatientMark.push(MeasureMark);
        refreshMark(MeasureMark);
        displayAllMark();
    }
    onMouseMove(e) {
        if (rightMouseDown) scale_size(e, originalPoint_X, originalPoint_Y);
        let angle2point = rotateCalculation(e, true);
        if (MeasureIrregular_now_choose && MeasureIrregular_now_choose.dcm.type == "IrregularRuler") {
            if (!MeasureIrregular_now_choose.origin_point)
                MeasureIrregular_now_choose.origin_point = angle2point;
            for (var i in MeasureIrregular_now_choose.dcm.pointArray) {
                MeasureIrregular_now_choose.dcm.pointArray[i].x += (angle2point[0] - MeasureIrregular_now_choose.origin_point[0]);
                MeasureIrregular_now_choose.dcm.pointArray[i].y += (angle2point[1] - MeasureIrregular_now_choose.origin_point[1]);
            }
            MeasureIrregular_now_choose.origin_point = angle2point;
            refreshMark(MeasureIrregular_now_choose);
            displayAllMark();
        }
        else if (MouseDownCheck && MeasureIrregular_previous_choose) {
            MeasureIrregular_previous_choose.setPoint2D(angle2point[0], angle2point[1]);
            var vector = [];
            for (var o = 0; o < MeasureIrregular_previous_choose.pointArray.length; o++) {
                vector.push({ x: MeasureIrregular_previous_choose.pointArray[o].x, y: MeasureIrregular_previous_choose.pointArray[o].y });
            }
            MeasureIrregular_previous_choose.PixelNumber = parseInt(shoelaceFormula(vector));

            refreshMark(MeasureIrregular_previous_choose);
            displayAllMark();
        }
    }
    onMouseUp(e) {
        if (MeasureIrregular_previous_choose) {
            Mark_previous_choose = MeasureIrregular_previous_choose;
            MeasureIrregular_previous_choose = null;
        }
        if (MeasureIrregular_now_choose) {
            MeasureIrregular_now_choose.origin_point = null;
            Mark_previous_choose = MeasureIrregular_now_choose;
            MeasureIrregular_now_choose = null;
        }
        displayMark();
    }
    onSwitch() {
        Mark_previous_choose = null;
        displayMark();
    }
}

class TextAnnotationTool extends ToolEvt {

    onMouseDown(e) {
        MeasureIrregular_now_choose = null;
        MeasureIrregular_now_choose = other_irregular_pounch(rotateCalculation(e, true)[0], rotateCalculation(e, true)[1]);
        if (MeasureIrregular_now_choose) return;
    }
    onMouseMove(e) {
        if (rightMouseDown) scale_size(e, originalPoint_X, originalPoint_Y);
        let angle2point = rotateCalculation(e, true);
        if (MeasureIrregular_now_choose && MeasureIrregular_now_choose.dcm.type == "TextAnnotation") {
            if (!MeasureIrregular_now_choose.origin_point)
                MeasureIrregular_now_choose.origin_point = angle2point;
            for (var i in MeasureIrregular_now_choose.dcm.pointArray) {
                MeasureIrregular_now_choose.dcm.pointArray[i].x += (angle2point[0] - MeasureIrregular_now_choose.origin_point[0]);
                MeasureIrregular_now_choose.dcm.pointArray[i].y += (angle2point[1] - MeasureIrregular_now_choose.origin_point[1]);
            }
            MeasureIrregular_now_choose.origin_point = angle2point;
            refreshMark(MeasureIrregular_now_choose);
            displayAllMark();
        }
    }
    onMouseUp(e) {
        if (!getByid('text_TextAnnotation').value || getByid('text_TextAnnotation').value == "") return;
        if (MeasureIrregular_now_choose) {
            MeasureIrregular_now_choose.origin_point = null;
            Mark_previous_choose = MeasureIrregular_now_choose;
            MeasureIrregular_now_choose = null;
        }
        else if (MouseDownCheck) {
            var MeasureMark = new BlueLightMark();
            let angle2point = rotateCalculation(e, true);
            MeasureMark.setQRLevels(GetViewport().QRLevels);
            MeasureMark.color = "#FF0000";
            MeasureMark.hideName = MeasureMark.showName = "ruler";
            MeasureMark.type = "TextAnnotation";
            MeasureMark.Text = getByid('text_TextAnnotation').value;
            MeasureMark.pointArray = [];
            MeasureMark.setPoint2D(angle2point[0], angle2point[1]);
            PatientMark.push(MeasureMark);
            refreshMark(MeasureMark);
            Mark_previous_choose = MeasureMark;
        }
        displayAllMark();
        displayMark();
    }
    onSwitch() {
        Mark_previous_choose = null;
        displayMark();
        getByid("span_TextAnnotation").style.display = "none";
        SetTable();
    }
}
class ArrowRulerTool extends ToolEvt {

    onMouseDown(e) {
        MeasureIrregular_now_choose = null;
        MeasureIrregular_now_choose = other_irregular_pounch(rotateCalculation(e, true)[0], rotateCalculation(e, true)[1]);
        if (MeasureIrregular_now_choose) return;

        if (MouseDownCheck) {
            Arrow_Point1 = Arrow_Point2 = rotateCalculation(e, true);
            var MeasureMark = new BlueLightMark();

            MeasureMark.setQRLevels(GetViewport().QRLevels);
            MeasureMark.color = "#FF0000";
            MeasureMark.hideName = MeasureMark.showName = "ruler";
            MeasureMark.type = "ArrowRuler";

            ArrowRule_previous_choose = MeasureMark;
            PatientMark.push(MeasureMark);
            displayAllMark();
        }
    }
    onMouseMove(e) {
        if (rightMouseDown) scale_size(e, originalPoint_X, originalPoint_Y);
        let angle2point = rotateCalculation(e, true);
        if (MeasureIrregular_now_choose && MeasureIrregular_now_choose.dcm.type == "ArrowRuler") {
            if (!MeasureIrregular_now_choose.origin_point)
                MeasureIrregular_now_choose.origin_point = angle2point;
            for (var i in MeasureIrregular_now_choose.dcm.pointArray) {
                MeasureIrregular_now_choose.dcm.pointArray[i].x += (angle2point[0] - MeasureIrregular_now_choose.origin_point[0]);
                MeasureIrregular_now_choose.dcm.pointArray[i].y += (angle2point[1] - MeasureIrregular_now_choose.origin_point[1]);
            }
            MeasureIrregular_now_choose.origin_point = angle2point;
            refreshMark(MeasureIrregular_now_choose);
            displayAllMark();
        }
        else if (MouseDownCheck) {
            Arrow_Point2 = angle2point;
            if (ArrowRule_previous_choose) {
                var MeasureMark = ArrowRule_previous_choose;
                MeasureMark.pointArray = [];
                MeasureMark.setPoint2D(Arrow_Point1[0], Arrow_Point1[1]);
                MeasureMark.setPoint2D(Arrow_Point2[0], Arrow_Point2[1]);
                refreshMark(MeasureMark);
            }
        }
        displayAllMark();
    }
    onMouseUp(e) {
        let angle2point = rotateCalculation(e, true);
        Arrow_Point2 = angle2point;
        if (MeasureIrregular_now_choose) {
            MeasureIrregular_now_choose.origin_point = null;
            Mark_previous_choose = MeasureIrregular_now_choose;
            MeasureIrregular_now_choose = null;
        }
        else if (ArrowRule_previous_choose) {
            var MeasureMark = ArrowRule_previous_choose;
            MeasureMark.pointArray = [];
            MeasureMark.setPoint2D(Arrow_Point1[0], Arrow_Point1[1]);
            MeasureMark.setPoint2D(Arrow_Point2[0], Arrow_Point2[1]);
            refreshMark(MeasureMark);
            Mark_previous_choose = ArrowRule_previous_choose;
        }

        ArrowRule_previous_choose = null;
        displayAllMark();

        if (rightMouseDown == true) displayMark();
    }
    onSwitch() {
        Mark_previous_choose = null;
        displayMark();
    }
}

function MeasureArrowRuler() {
    cancelTools();
    toolEvt.onSwitch();
    toolEvt = new ArrowRulerTool();
}
function MeasureTextAnnotation() {
    cancelTools();
    getByid("span_TextAnnotation").style.display = "";
    SetTable();
    toolEvt.onSwitch();
    toolEvt = new TextAnnotationTool();
}
function MeasureIrregular() {
    cancelTools();
    toolEvt.onSwitch();
    toolEvt = new MeasureIrregularTool();
}

function other_irregular_pounch(currX, currY) {
    let block_size = getMarkSize(GetViewportMark(), false) * 4;

    for (var n = 0; n < PatientMark.length; n++) {
        if (PatientMark[n].sop == GetViewport().sop) {
            if (PatientMark[n].type == "IrregularRuler" || PatientMark[n].type == "TextAnnotation" || PatientMark[n].type == "ArrowRuler") {
                var tempMark = PatientMark[n].pointArray;
                var x1 = parseInt(tempMark[0].x), y1 = parseInt(tempMark[0].y);
                if (currY + block_size >= y1 && currY - block_size <= y1 && currX + block_size >= x1 && currX - block_size <= x1)
                    return { dcm: PatientMark[n], pointArray: tempMark, order: 0 };
            }
        }
    }
    return null;
}

const shoelaceFormula = (vertices) => {
    const length = vertices.length;
    var area = vertices.reduce((sum, vertice, i, array) => {
        const afterIndex = i + 1 >= length ? 0 : i + 1;
        const bforeIndex = i - 1 < 0 ? length - 1 : i - 1;
        return sum + vertice.x * (array[afterIndex].y - array[bforeIndex].y);
    }, 0);
    return Math.abs(area) / 2;
};

function drawIrregularRuler(obj) {
    var canvas = obj.canvas, Mark = obj.Mark, viewport = obj.viewport;
    if (!Mark) return;
    if (!Mark || Mark.type != "IrregularRuler" || Mark.pointArray.length < 2) return;

    var ctx = canvas.getContext("2d"), color = null;
    try {
        if (Mark.color && getByid("AutoColorSelect") && getByid("AutoColorSelect").selected) color = Mark.color;
        viewport.drawClosedInterval(ctx, viewport, Mark.pointArray, [color, color], [1.0, 0.3]);
        if (toolEvt.constructor.name == "EraseTool" || toolEvt.constructor.name == "MeasureIrregularTool") viewport.fillCircle(ctx, viewport, Mark.pointArray[0], 3, "#FF0000", 1.0);
    } catch (ex) { }

    try {
        if (Mark.PixelNumber) {
            var value = "";
            if (viewport.transform.PixelSpacingX && viewport.transform.PixelSpacingY) {
                value = parseInt(Mark.PixelNumber / (viewport.transform.PixelSpacingX * viewport.transform.PixelSpacingY)) + "mm²";
            } else {
                value = parseInt(Mark.PixelNumber) + "px²";
            }

            viewport.drawText(ctx, viewport, Mark.lastMark, value, 22, "#FF0000", alpha = 1.0);
        }
    } catch (ex) { }
}
PLUGIN.PushMarkList(drawIrregularRuler);

function drawTextAnnotatoin(obj) {
    var canvas = obj.canvas, Mark = obj.Mark, viewport = obj.viewport;
    if (!Mark) return;
    if (!Mark || Mark.type != "TextAnnotation") return;

    var ctx = canvas.getContext("2d"), color = null;
    try {
        if (Mark.Text) viewport.drawText(ctx, viewport, Mark.pointArray[0], Mark.Text, 22, "#FF0000", alpha = 1.0);
        if (toolEvt.constructor.name == "EraseTool" || toolEvt.constructor.name == "TextAnnotationTool") viewport.fillCircle(ctx, viewport, Mark.pointArray[0], 3, "#00FF00", 1.0);
    } catch (ex) { }
}
PLUGIN.PushMarkList(drawTextAnnotatoin);

function drawArrowRuler(obj) {
    try {
        var canvas = obj.canvas, Mark = obj.Mark, viewport = obj.viewport;
        if (!Mark) return;
        if (!Mark || Mark.type != "ArrowRuler" || Mark.pointArray.length < 2) return;
        var ctx = canvas.getContext("2d");

        var x1 = Mark.pointArray[0].x * 1, y1 = Mark.pointArray[0].y * 1;
        var x2 = Mark.pointArray[1].x * 1, y2 = Mark.pointArray[1].y * 1;
        viewport.drawLine(ctx, viewport, new Point2D(x1, y1), new Point2D(x2, y2), Mark.color, 1.0);
        var L = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2), 2);
        var VDist = viewport.width + viewport.height;
        L = L < VDist / 100 ? VDist / 100 : L > VDist / 40 ? VDist / 40 : L;
        var a = Math.atan2((y2 - y1), (x2 - x1));
        var x3 = x2 - L * Math.cos(a + 30 * Math.PI / 180);
        var y3 = y2 - L * Math.sin(a + 30 * Math.PI / 180);
        var x4 = x2 - L * Math.cos(a - 30 * Math.PI / 180);
        var y4 = y2 - L * Math.sin(a - 30 * Math.PI / 180);
        viewport.drawLine(ctx, viewport, new Point2D(x3, y3), new Point2D(x2, y2), Mark.color, 1.0);
        viewport.drawLine(ctx, viewport, new Point2D(x4, y4), new Point2D(x2, y2), Mark.color, 1.0);
        if (toolEvt.constructor.name == "EraseTool" || toolEvt.constructor.name == "ArrowRulerTool") viewport.fillCircle(ctx, viewport, Mark.pointArray[0], 3, "#00FF00", 1.0);
    } catch (ex) { console.log(ex) }
}
PLUGIN.PushMarkList(drawArrowRuler);

onloadFunction.push2Last(function () {
    getByid("IrregularRuler").onclick = function () {
        if (this.enable == false) return;
        MeasureIrregular();
        drawBorder(getByid("openMeasureImg"));
        hideAllDrawer();
    }

    getByid("TextAnnotation").onclick = function () {
        if (this.enable == false) return;
        MeasureTextAnnotation();
        drawBorder(getByid("openMeasureImg"));
        hideAllDrawer();
    }

    getByid("ArrowRuler").onclick = function () {
        if (this.enable == false) return;
        MeasureArrowRuler();
        drawBorder(getByid("openMeasureImg"));
        hideAllDrawer();
    }
});
