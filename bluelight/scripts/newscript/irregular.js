
var openMeasureIrregular = false;

var Measure_previous_choose = null;

function MeasureIrregular() {
    if (BL_mode == 'Irregular') {
        DeleteMouseEvent();
        cancelTools();
        openMeasureIrregular = true;

        set_BL_model.onchange = function () {
            displayMark();
            openMeasureIrregular = false;
            set_BL_model.onchange = function () { return 0; };
        }

        BlueLightMousedownList = [];
        BlueLightMousedownList.push(function (e) {
            var MeasureMark = new BlueLightMark();
            let angle2point = rotateCalculation(e);
            MeasureMark.setQRLevels(GetViewport().QRLevels);
            MeasureMark.color = "#FFFFFF";
            MeasureMark.hideName = MeasureMark.showName = "ruler";
            MeasureMark.type = "IrregularRuler";
            MeasureMark.pointArray = [];
            MeasureMark.setPoint2D(angle2point[0], angle2point[1]);
            MeasureMark.setPoint2D(angle2point[0], angle2point[1]);
            Measure_previous_choose = MeasureMark;
            PatientMark.push(MeasureMark);
            refreshMark(MeasureMark);
            displayAllMark();
        });

        BlueLightMousemoveList = [];
        BlueLightMousemoveList.push(function (e) {
            if (rightMouseDown) scale_size(e, originalPoint_X, originalPoint_Y);
            let angle2point = rotateCalculation(e);
            if (MouseDownCheck && Measure_previous_choose) {
                Measure_previous_choose.setPoint2D(angle2point[0], angle2point[1]);
                var vector = [];
                for (var o = 0; o < Measure_previous_choose.pointArray.length; o++) {
                    vector.push({ x: Measure_previous_choose.pointArray[o].x, y: Measure_previous_choose.pointArray[o].y });
                }
                Measure_previous_choose.Text = parseInt(shoelaceFormula(vector) / (GetViewport().transform.PixelSpacingX * GetViewport().transform.PixelSpacingY)) + "mm²";

                refreshMark(Measure_previous_choose);
                displayAllMark();
            }
        });

        BlueLightMouseupList = [];
        BlueLightMouseupList.push(function (e) {
            if (Measure_previous_choose) Measure_previous_choose = null;
            displayMark();
        });

        AddMouseEvent();
    }
}

/*getByid("IrregularRuler").onclick = function () {
    if (this.enable == false) return;
    set_BL_model('Irregular');
    MeasureIrregular();

    drawBorder(this);
}*/
//HTMLICON.cancelBorderList.push(getByid("IrregularRuler"));

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
    var canvas = obj.canvas, Mark = obj.Mark;
    if (!Mark) return;
    if (!Mark || Mark.type != "IrregularRuler" || Mark.pointArray.length < 2) return;
    var ctx = canvas.getContext("2d");
    ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);
    setMarkColor(ctx);
    if (Mark.color) ctx.strokeStyle = ctx.fillStyle = "" + Mark.color;

    var tempAlpha = ctx.globalAlpha;
    ctx.globalAlpha = 1.0;

    ctx.moveTo(Math.ceil((Mark.pointArray[0].x)), Math.ceil((Mark.pointArray[0].y)));
    ctx.beginPath();
    for (var o = 1; o < Mark.pointArray.length; o++) {
        var x1 = Math.ceil((Mark.pointArray[o].x));
        var y1 = Math.ceil((Mark.pointArray[o].y));
        ctx.lineTo(x1, y1);
        //ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.fill();
    if (Mark.Text) {
        ctx.beginPath();
        ctx.font = "" + (22) + "px Arial";
        ctx.fillStyle = "#FF0000";
        ctx.fillText("" + Mark.Text, Mark.lastMark.x, Mark.lastMark.y);
        ctx.closePath();
    }
    ctx.globalAlpha = tempAlpha;
}
PLUGIN.PushMarkList(drawIrregularRuler);