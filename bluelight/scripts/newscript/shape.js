
var openMeasureShape = false;

var MeasureShape_previous_choose = null;

function MeasureRect() {
    if (BL_mode == 'MeasureRect') {
        DeleteMouseEvent();
        cancelTools();
        openMeasureShape = true;

        set_BL_model.onchange = function () {
            displayMark();
            openMeasureShape = false;
            set_BL_model.onchange = function () { return 0; };
        }

        BlueLightMousedownList = [];
        BlueLightMousedownList.push(function (e) {
            var MeasureMark = new BlueLightMark();
            let angle2point = rotateCalculation(e);
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
        });

        BlueLightMousemoveList = [];
        BlueLightMousemoveList.push(function (e) {
            if (rightMouseDown) scale_size(e, originalPoint_X, originalPoint_Y);
            let angle2point = rotateCalculation(e);
            if (MouseDownCheck && MeasureShape_previous_choose) {
                MeasureShape_previous_choose.pointArray[1].x = angle2point[0];
                MeasureShape_previous_choose.pointArray[1].y = angle2point[1];
                MeasureShape_previous_choose.Text = parseInt(
                    (Math.abs(MeasureShape_previous_choose.pointArray[0].x - MeasureShape_previous_choose.pointArray[1].x)
                        * Math.abs(MeasureShape_previous_choose.pointArray[0].y - MeasureShape_previous_choose.pointArray[1].y)
                    ) / (GetViewport().transform.PixelSpacingX * GetViewport().transform.PixelSpacingY)) + "mm²";

                refreshMark(MeasureShape_previous_choose);
                displayAllMark();
            }
        });

        BlueLightMouseupList = [];
        BlueLightMouseupList.push(function (e) {
            if (MeasureShape_previous_choose) MeasureShape_previous_choose = null;
            displayMark();
        });

        AddMouseEvent();
    }
}

function MeasureCircle() {
    if (BL_mode == 'MeasureCircle') {
        DeleteMouseEvent();
        cancelTools();
        openMeasureShape = true;

        set_BL_model.onchange = function () {
            displayMark();
            openMeasureShape = false;
            set_BL_model.onchange = function () { return 0; };
        }

        BlueLightMousedownList = [];
        BlueLightMousedownList.push(function (e) {
            var MeasureMark = new BlueLightMark();
            let angle2point = rotateCalculation(e);
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
        });

        BlueLightMousemoveList = [];
        BlueLightMousemoveList.push(function (e) {
            if (rightMouseDown) scale_size(e, originalPoint_X, originalPoint_Y);
            let angle2point = rotateCalculation(e);
            if (MouseDownCheck && MeasureShape_previous_choose) {
                var originalPoint_X = MeasureShape_previous_choose.pointArray[0].x;
                var originalPoint_Y = MeasureShape_previous_choose.pointArray[0].y;
                MeasureShape_previous_choose.pointArray[1].x = originalPoint_X + Math.sqrt(Math.pow(Math.abs(originalPoint_X - angle2point[0]), 2) + Math.pow(Math.abs(originalPoint_Y - angle2point[1]), 2) / 2);
                MeasureShape_previous_choose.pointArray[1].y = originalPoint_Y + Math.sqrt(Math.pow(Math.abs(originalPoint_X - angle2point[0]), 2) + Math.pow(Math.abs(originalPoint_Y - angle2point[1]), 2) / 2)

                var x1 = MeasureShape_previous_choose.pointArray[0].x * 1;
                var y1 = MeasureShape_previous_choose.pointArray[0].y * 1;
                var x2 = MeasureShape_previous_choose.pointArray[0 + 1].x * 1;
                var y2 = MeasureShape_previous_choose.pointArray[0 + 1].y * 1;
                var temp_distance = getDistance(Math.abs(x1 - x2), Math.abs(y1 - y2));

                MeasureShape_previous_choose.Text = parseInt(
                    (temp_distance * temp_distance * Math.PI) / (GetViewport().transform.PixelSpacingX * GetViewport().transform.PixelSpacingY)) + "mm²";

                refreshMark(MeasureShape_previous_choose);
                displayAllMark();
            }
        });

        BlueLightMouseupList = [];
        BlueLightMouseupList.push(function (e) {
            if (MeasureShape_previous_choose) MeasureShape_previous_choose = null;
            displayMark();
        });

        AddMouseEvent();
    }
}


function drawMeasureRect(obj) {
    var canvas = obj.canvas, Mark = obj.Mark, viewport = obj.viewport;
    if (!Mark) return;
    if (!Mark || Mark.type != "MeasureRect" || Mark.pointArray.length < 2) return;
    var ctx = canvas.getContext("2d");
    ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);
    setMarkColor(ctx);
    if (Mark.color && getByid("AutoColorSelect") && getByid("AutoColorSelect").selected) ctx.strokeStyle = ctx.fillStyle = "" + Mark.color;

    var tempAlpha = ctx.globalAlpha;
    ctx.globalAlpha = 1.0;
    var maxX = Mark.pointArray[0].x > Mark.pointArray[1].x ? Mark.pointArray[0].x : Mark.pointArray[1].x;
    var minX = Mark.pointArray[0].x < Mark.pointArray[1].x ? Mark.pointArray[0].x : Mark.pointArray[1].x;
    var maxY = Mark.pointArray[0].y > Mark.pointArray[1].y ? Mark.pointArray[0].y : Mark.pointArray[1].y;
    var minY = Mark.pointArray[0].y < Mark.pointArray[1].y ? Mark.pointArray[0].y : Mark.pointArray[1].y;
    if (maxX == minX || maxY == minY) return;

    ctx.beginPath();
    ctx.moveTo(Math.ceil((minX)), Math.ceil((maxY)));
    ctx.lineTo(Math.ceil((maxX)), Math.ceil((maxY)));
    ctx.lineTo(Math.ceil((maxX)), Math.ceil((minY)));
    ctx.lineTo(Math.ceil((minX)), Math.ceil((minY)));
    ctx.lineTo(Math.ceil((minX)), Math.ceil((maxY)));

    ctx.stroke();
    ctx.closePath();
    ctx.globalAlpha = 0.3;
    ctx.fill();
    ctx.globalAlpha = 1.0;
    if (Mark.Text) {
        var tempShadowColor = ctx.shadowColor;
        var tempshadowBlur = ctx.shadowBlur;
        ctx.shadowBlur = 7;
        ctx.shadowColor = "white";
        ctx.beginPath();
        var n = 22;
        if (viewport && !isNaN(viewport.scale) && viewport.scale < 1) n /= viewport.scale;
        ctx.font = "" + (n) + "px Arial";
        ctx.fillStyle = "#FF0000";
        for (var t = 0; t < 5; t++)
            ctx.fillText("" + Mark.Text, maxX - (Mark.Text.length * (n / 2) + n), maxY - (n / 4));
        ctx.closePath();
        ctx.shadowColor = tempShadowColor;
        ctx.shadowBlur = tempshadowBlur;
    }
    ctx.globalAlpha = tempAlpha;
}
PLUGIN.PushMarkList(drawMeasureRect);


function drawMeasureCIRCLE(obj) {
    var canvas = obj.canvas, Mark = obj.Mark, viewport = obj.viewport;
    if (!Mark) return;
    if (!Mark || Mark.type != "MeasureCircle" || Mark.pointArray.length < 2) return;
    var ctx = canvas.getContext("2d");
    ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);
    setMarkColor(ctx);
    if (Mark.color && getByid("AutoColorSelect") && getByid("AutoColorSelect").selected) ctx.strokeStyle = ctx.fillStyle = "" + Mark.color;

    var tempAlpha = ctx.globalAlpha;
    ctx.globalAlpha = 1.0;
    var x1 = Mark.pointArray[0].x * 1;
    var y1 = Mark.pointArray[0].y * 1;
    var x2 = Mark.pointArray[0 + 1].x * 1;
    var y2 = Mark.pointArray[0 + 1].y * 1;

    ctx.beginPath();
    var tempAlpha = ctx.globalAlpha;
    ctx.globalAlpha = 1.0;
    var temp_distance = getDistance(Math.abs(x1 - x2), Math.abs(y1 - y2));
    ctx.arc(x1, y1, temp_distance, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.globalAlpha = 0.3;
    ctx.fill();
    ctx.globalAlpha = 1.0;
    ctx.closePath();
    if (Mark.Text) {
        ctx.beginPath();
        var n = 22;
        if (viewport && !isNaN(viewport.scale) && viewport.scale < 1) n /= viewport.scale;
        ctx.font = "" + (n) + "px Arial";
        var tempShadowColor = ctx.shadowColor;
        var tempshadowBlur = ctx.shadowBlur;
        ctx.shadowBlur = 7;
        ctx.shadowColor = "white";
        ctx.fillStyle = "#FF0000";
        for (var t = 0; t < 5; t++)
            ctx.fillText("" + Mark.Text, Mark.pointArray[0].x - (Mark.Text.length * (n / 4)), Mark.pointArray[0].y);

        ctx.closePath();
        ctx.shadowColor = tempShadowColor;
        ctx.shadowBlur = tempshadowBlur;
    }
    ctx.globalAlpha = tempAlpha;
}

PLUGIN.PushMarkList(drawMeasureCIRCLE);