
function loadMarkupPlugin() {
    if (getByid("MarkupImgParent")) return;
    var span = document.createElement("SPAN");
    span.id = "MarkupImgParent";
    span.innerHTML = `
     <img class="img" loading="lazy" altzhtw="3D" alt="3D" id="MarkupDrawerImg" src="../image/icon/lite/markup.png"
          width="50" height="50">
    <div id="MarkupDIv" class="drawer" style="position:absolute;left: 0;white-space:nowrap;z-index: 100;
    width: 500; display: none;background-color: black;">`;
    addIconSpan(span);
    getByid("MarkupDrawerImg").onclick = function () {
        if (this.enable == false) return;
        hideAllDrawer("MarkupDIv");
        invertDisplayById('MarkupDIv');
        if (getByid("MarkupDIv").style.display == "none") getByid("MarkupImgParent").style.position = "";
        else {
            getByid("MarkupImgParent").style.position = "relative";
            //onElementLeave();
        }
    }
}

function loadWriteVHS() {
    loadMarkupPlugin();

    var span = document.createElement("SPAN")
    span.innerHTML = `<img class="innerimg VHS" alt="writeVHS" id="writeVHS" onmouseover = "onElementOver(this);" onmouseleave = "onElementLeave();" src="../image/icon/lite/vhs.png" width="50" height="50">`;
    if (getByid("MarkupDIv").childNodes.length > 0) getByid("MarkupDIv").appendChild(document.createElement("BR"));
    getByid("MarkupDIv").appendChild(span);
}
loadWriteVHS();

getByid("writeVHS").onclick = function () {
    getByid("MarkupDIv").style.display = "none";
    MeasureVHS();
}

class MeasureVHSTool extends ToolEvt {
    static MeasureVHS_now_choose = null;
    onMouseDown(e) {
        if (!MouseDownCheck) return;

        if (MeasureVHSTool.MeasureVHS_now_choose == null) {
            var MeasureMark = new BlueLightMark();
            let angle2point = rotateCalculation(e, true);
            MeasureMark.setQRLevels(GetViewport().QRLevels);
            MeasureMark.color = "#FF2222";
            MeasureMark.hideName = MeasureMark.showName = "VHS";
            MeasureMark.type = "MeasureVHS";
            MeasureMark.pointArray = [];
            MeasureMark.setPoint2D(angle2point[0], angle2point[1]);
            MeasureMark.setPoint2D(angle2point[0], angle2point[1]);

            MeasureVHSTool.MeasureVHS_now_choose = MeasureMark;
            PatientMark.push(MeasureMark);
            refreshMark(MeasureMark);
            displayAllMark();
        } else if (MeasureVHSTool.MeasureVHS_now_choose.pointArray.length >= 6) {
            var MeasureMark = MeasureVHSTool.MeasureVHS_now_choose;
            let angle2point = rotateCalculation(e, true);
            MeasureMark.pointArray = [];
            MeasureMark.setPoint2D(angle2point[0], angle2point[1]);
            MeasureMark.setPoint2D(angle2point[0], angle2point[1]);
            refreshMark(MeasureMark);
            displayAllMark();
        }
        else {
            var MeasureMark = MeasureVHSTool.MeasureVHS_now_choose;
            let angle2point = rotateCalculation(e, true);
            MeasureMark.setPoint2D(angle2point[0], angle2point[1]);
            MeasureMark.setPoint2D(angle2point[0], angle2point[1]);
            refreshMark(MeasureMark);
            displayAllMark();
        }
    }
    onMouseMove(e) {
        if (rightMouseDown) scale_size(e, originalPoint_X, originalPoint_Y);
        let angle2point = rotateCalculation(e, true);
        if (MouseDownCheck && MeasureVHSTool.MeasureVHS_now_choose) {
            MeasureVHSTool.MeasureVHS_now_choose.pointArray[MeasureVHSTool.MeasureVHS_now_choose.pointArray.length - 1].x = angle2point[0];
            MeasureVHSTool.MeasureVHS_now_choose.pointArray[MeasureVHSTool.MeasureVHS_now_choose.pointArray.length - 1].y = angle2point[1];
            refreshMark(MeasureVHSTool.MeasureVHS_now_choose);
            displayAllMark();
        }
    }
    onMouseUp(e) {
        displayMark();
    }
    onSwitch() {
        displayMark();
        if (MeasureVHSTool.MeasureVHS_now_choose) {
            PatientMark.splice(PatientMark.indexOf(MeasureVHSTool.MeasureVHS_now_choose), 1);
            displayMark();
            MeasureVHSTool.MeasureVHS_now_choose = null;
            refreshMarkFromSop(GetViewport().sop);
        }
    }
    onKeyDown(KeyboardKeys) {
        var key = KeyboardKeys.which;
        if (MeasureVHSTool.MeasureVHS_now_choose && (key === 46 || key === 110)) {
            PatientMark.splice(PatientMark.indexOf(MeasureVHSTool.MeasureVHS_now_choose), 1);
            displayMark();
            MeasureVHSTool.MeasureVHS_now_choose = null;
            refreshMarkFromSop(GetViewport().sop);
        }
    }
}

function MeasureVHS() {
    cancelTools();
    toolEvt.onSwitch();
    toolEvt = new MeasureVHSTool();
    MeasureVHSTool.MeasureVHS_now_choose = null
}


function drawMeasureVHS(obj) {
    var canvas = obj.canvas, Mark = obj.Mark, viewport = obj.viewport;
    if (!Mark) return;
    if (!Mark || Mark.type != "MeasureVHS" || Mark.pointArray.length < 2) return;
    var ctx = canvas.getContext("2d"), color = null, pointArray = Mark.pointArray, size = 22;
    if (Mark.color && getByid("AutoColorSelect") && getByid("AutoColorSelect").selected) color = "" + Mark.color;

    try {
        // T4
        if (Mark.pointArray.length >= 2) {
            viewport.drawLine(ctx, viewport, Mark.pointArray[0], Mark.pointArray[1], "#ff9022", 1.0);
            viewport.drawText(ctx, viewport, Mark.pointArray[1], "T4:" + ((Mark.pointArray[0].x - Mark.pointArray[1].x) ** 2 + (Mark.pointArray[0].y - Mark.pointArray[1].y) ** 2).toFixed(2), 22, "#ff9022", alpha = 1.0);
        }
        // L
        if (Mark.pointArray.length >= 4) {
            viewport.drawLine(ctx, viewport, Mark.pointArray[2], Mark.pointArray[3], "#ff9022", 1.0);
            viewport.drawText(ctx, viewport, Mark.pointArray[3], "L:" + ((Mark.pointArray[2].x - Mark.pointArray[3].x) ** 2 + (Mark.pointArray[2].y - Mark.pointArray[3].y) ** 2).toFixed(2), 22, "#ff9022", alpha = 1.0);
        }
        // S
        if (Mark.pointArray.length >= 6) {
            viewport.drawLine(ctx, viewport, Mark.pointArray[4], Mark.pointArray[5], "#3822ff", 1.0);
            viewport.drawText(ctx, viewport, Mark.pointArray[5], "S:" + ((Mark.pointArray[4].x - Mark.pointArray[5].x) ** 2 + (Mark.pointArray[4].y - Mark.pointArray[5].y) ** 2).toFixed(2), 22, "#3822ff", alpha = 1.0);
        }
        // VHS = L / T4 + S / T4 
        if (Mark.pointArray.length >= 6) {
            var T4 = ((Mark.pointArray[0].x - Mark.pointArray[1].x) ** 2 + (Mark.pointArray[0].y - Mark.pointArray[1].y) ** 2);
            var L = ((Mark.pointArray[2].x - Mark.pointArray[3].x) ** 2 + (Mark.pointArray[2].y - Mark.pointArray[3].y) ** 2);
            var S = ((Mark.pointArray[4].x - Mark.pointArray[5].x) ** 2 + (Mark.pointArray[4].y - Mark.pointArray[5].y) ** 2);
            var VHS = L / T4 + S / T4;
            viewport.drawText(ctx, viewport, Mark.pointArray[0], "VHS:" + VHS.toFixed(2), 22, "#FFFFFF", alpha = 1.0);
        }
    } catch (ex) { console.log(ex) }
}
PLUGIN.PushMarkList(drawMeasureVHS);