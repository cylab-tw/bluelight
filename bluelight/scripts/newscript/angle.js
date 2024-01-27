
//存放量角器
var Angle_Point0 = [];
var Angle_Point1 = [];
var Angle_Point2 = [];

//正在選取的Angle
var Angle_now_choose = null;
//正在繪製的Angle
var Angle_previous_choose = null;

function angle() {
    if (BL_mode == 'angle') {
        DeleteMouseEvent();
        //this.angle_=1;
        //cancelTools();
        angle.angle_ = "stop";
        set_BL_model.onchange = function () {
            displayMark();
            angle.angle_ = null;
            set_BL_model.onchange = function () { return 0; };
        }

        BlueLightMousedownList = [];
        BlueLightMousedownList.push(function (e) {
            angle_pounch(rotateCalculation(e)[0], rotateCalculation(e)[1]);
            Angle_previous_choose = null;
            if (Angle_now_choose) return;
            if (angle.angle_ == "rotate") angle.angle_ = "stop";
            if (angle.angle_ == "stop" && !Angle_previous_choose) {
                Angle_Point0 = Angle_Point1 = rotateCalculation(e);
                var AngleMark = new BlueLightMark();

                AngleMark.setQRLevels(GetViewport().QRLevels);
                AngleMark.color = "#FF0000";
                AngleMark.hideName = AngleMark.showName = "ruler";
                AngleMark.type = "AngleRuler";

                PatientMark.push(AngleMark);
                Angle_previous_choose = AngleMark;
                angle.angle_ = "line";
            }
        });

        BlueLightMousemoveList = [];
        BlueLightMousemoveList.push(function (e) {
            if (rightMouseDown) scale_size(e, originalPoint_X, originalPoint_Y);

            let angle2point = rotateCalculation(e);
            if (angle.angle_ == "rotate") {
                Angle_Point2 = angle2point;

                if (!Angle_previous_choose) return;
                var AngleMark = Angle_previous_choose;

                AngleMark.pointArray = [];
                AngleMark.setPoint2D(Angle_Point0[0], Angle_Point0[1]);
                AngleMark.setPoint2D(Angle_Point1[0], Angle_Point1[1]);
                AngleMark.setPoint2D(Angle_Point2[0], Angle_Point2[1]);
                AngleMark.Text = getAnglelValue(e);

                refreshMark(AngleMark);
                displayAllMark();
            }
            else if (MouseDownCheck && Angle_previous_choose) {
                if (angle.angle_ == "line") {
                    Angle_Point1 = angle2point;

                    var AngleMark = Angle_previous_choose;
                    AngleMark.pointArray = [];
                    AngleMark.setPoint2D(Angle_Point0[0], Angle_Point0[1]);
                    AngleMark.setPoint2D(Angle_Point1[0], Angle_Point1[1]);
                    AngleMark.Text = "";

                    refreshMark(AngleMark);
                    displayAllMark();
                }
            }
            else if (Angle_now_choose) {
                Angle_now_choose.pointArray[Angle_now_choose.order].x = angle2point[0];
                Angle_now_choose.pointArray[Angle_now_choose.order].y = angle2point[1];
                Angle_now_choose.dcm.Text = getAnglelValueBy2Point(Angle_now_choose.pointArray);
                refreshMark(Angle_now_choose.dcm);
            }
        });

        BlueLightMouseupList = [];
        BlueLightMouseupList.push(function (e) {
            if (openMouseTool && rightMouseDown) displayMark();
            if (Angle_now_choose) {
                Angle_now_choose.pointArray[Angle_now_choose.order].x = rotateCalculation(e)[0];
                Angle_now_choose.pointArray[Angle_now_choose.order].y = rotateCalculation(e)[1];
                Angle_now_choose.dcm.Text = getAnglelValueBy2Point(Angle_now_choose.pointArray);
                refreshMark(Angle_now_choose.dcm);
                angle.angle_ = "stop";
            }
            if (angle.angle_ == "rotate") {
                let angle2point = rotateCalculation(e);
                Angle_Point2 = angle2point;

                if (!Angle_previous_choose) return;
                var AngleMark = Angle_previous_choose;

                AngleMark.pointArray = [];
                AngleMark.setPoint2D(Angle_Point0[0], Angle_Point0[1]);
                AngleMark.setPoint2D(Angle_Point1[0], Angle_Point1[1]);
                AngleMark.setPoint2D(Angle_Point2[0], Angle_Point2[1]);
                AngleMark.Text = getAnglelValue(e);
                refreshMark(AngleMark);
                displayAllMark();
            }
            if (MouseDownCheck == true) {
                if (angle.angle_ == "line") angle.angle_ = "rotate";
                else if (angle.angle_ == "rotate") angle.angle_ = "stop";
            }
            if (Angle_now_choose) Angle_previous_choose = Angle_now_choose;
            Angle_now_choose = null;
        });

        BlueLightTouchstartList = [];
        BlueLightTouchstartList.push(function (e, e2) {
            angle_pounch(rotateCalculation(e)[0], rotateCalculation(e)[1]);
            Angle_previous_choose = null;
            if (Angle_now_choose) return;
            if (angle.angle_ == "rotate") angle.angle_ = "stop";
            if (angle.angle_ == "stop" && !Angle_previous_choose) {
                Angle_Point0 = Angle_Point1 = rotateCalculation(e);
                var AngleMark = new BlueLightMark();

                AngleMark.setQRLevels(GetViewport().QRLevels);
                AngleMark.color = "#FF0000";
                AngleMark.hideName = AngleMark.showName = "ruler";
                AngleMark.type = "AngleRuler";

                PatientMark.push(AngleMark);
                Angle_previous_choose = AngleMark;
                angle.angle_ = "line";
            }
        });

        BlueLightTouchmoveList = [];
        BlueLightTouchmoveList.push(function (e, e2) {
            if (rightTouchDown) scale_size(e, originalPoint_X, originalPoint_Y);

            let angle2point = rotateCalculation(e);
            if (angle.angle_ == "rotate") {
                Angle_Point2 = angle2point;

                if (!Angle_previous_choose) return;
                var AngleMark = Angle_previous_choose;

                AngleMark.pointArray = [];
                AngleMark.setPoint2D(Angle_Point0[0], Angle_Point0[1]);
                AngleMark.setPoint2D(Angle_Point1[0], Angle_Point1[1]);
                AngleMark.setPoint2D(Angle_Point2[0], Angle_Point2[1]);
                AngleMark.Text = getAnglelValue(e);

                refreshMark(AngleMark);
                displayAllMark();
            }
            else if (TouchDownCheck && Angle_previous_choose) {
                if (angle.angle_ == "line") {
                    Angle_Point1 = angle2point;

                    var AngleMark = Angle_previous_choose;
                    AngleMark.pointArray = [];
                    AngleMark.setPoint2D(Angle_Point0[0], Angle_Point0[1]);
                    AngleMark.setPoint2D(Angle_Point1[0], Angle_Point1[1]);
                    AngleMark.Text = "";

                    refreshMark(AngleMark);
                    displayAllMark();
                }
            }
            else if (Angle_now_choose) {
                Angle_now_choose.pointArray[Angle_now_choose.order].x = angle2point[0];
                Angle_now_choose.pointArray[Angle_now_choose.order].y = angle2point[1];
                Angle_now_choose.dcm.Text = getAnglelValueBy2Point(Angle_now_choose.pointArray);
                refreshMark(Angle_now_choose.dcm);
            }
        });

        BlueLightTouchendList = [];
        BlueLightTouchendList.push(function (e, e2) {
            if (openMouseTool && rightTouchDown) displayMark();
            if (Angle_now_choose) {
                Angle_now_choose.pointArray[Angle_now_choose.order].x = rotateCalculation(e)[0];
                Angle_now_choose.pointArray[Angle_now_choose.order].y = rotateCalculation(e)[1];
                Angle_now_choose.dcm.Text = getAnglelValueBy2Point(Angle_now_choose.pointArray);
                refreshMark(Angle_now_choose.dcm);
                angle.angle_ = "stop";
            }
            if (angle.angle_ == "rotate") {
                /*let angle2point = rotateCalculation(e);
                Angle_Point2 = angle2point;

                if (!Angle_previous_choose) return;
                var AngleMark = Angle_previous_choose;

                AngleMark.pointArray = [];
                AngleMark.setPoint2D(Angle_Point0[0], Angle_Point0[1]);
                AngleMark.setPoint2D(Angle_Point1[0], Angle_Point1[1]);
                AngleMark.setPoint2D(Angle_Point2[0], Angle_Point2[1]);
                AngleMark.Text = getAnglelValue(e);
                refreshMark(AngleMark);
                displayAllMark();*/
            }
            if (TouchDownCheck == true) {
                if (angle.angle_ == "line") angle.angle_ = "rotate";
                else if (angle.angle_ == "rotate") angle.angle_ = "stop";
            }
            if (Angle_now_choose) Angle_previous_choose = Angle_now_choose;
            Angle_now_choose = null;
        });

        AddMouseEvent();
    }
}

function angle_pounch(currX, currY) {
    let block_size = getMarkSize(GetViewportMark(), false) * 4;

    for (var n = 0; n < PatientMark.length; n++) {
        if (PatientMark[n].sop == GetViewport().sop) {
            if (PatientMark[n].type == "AngleRuler") {
                var tempMark = PatientMark[n].pointArray;

                var x1 = parseInt(tempMark[0].x), y1 = parseInt(tempMark[0].y);
                if (currY + block_size >= y1 && currY - block_size <= y1 && currX + block_size >= x1 && currX - block_size <= x1) {
                    Angle_now_choose = { dcm: PatientMark[n], pointArray: PatientMark[n].pointArray, order: 0 };
                }

                var x2 = parseInt(tempMark[1].x), y2 = parseInt(tempMark[1].y);
                if (currY + block_size >= y2 && currY - block_size <= y2 && currX + block_size >= x2 && currX - block_size <= x2) {
                    Angle_now_choose = { dcm: PatientMark[n], pointArray: PatientMark[n].pointArray, order: 1 };
                }

                var x3 = parseInt(tempMark[2].x), y3 = parseInt(tempMark[2].y);
                if (currY + block_size >= y3 && currY - block_size <= y3 && currX + block_size >= x3 && currX - block_size <= x3) {
                    Angle_now_choose = { dcm: PatientMark[n], pointArray: PatientMark[n].pointArray, order: 2 };
                }
                /*if (currY + block_size >= y1 && currX + block_size >= x1 / 2 + x2 / 2 && currY < y1 + block_size && currX < x1 / 2 + x2 / 2 + block_size) {

                }*/
            }
        }
    }
}

function drawAngleRuler(obj) {
    try {

        var canvas = obj.canvas, Mark = obj.Mark;
        if (!Mark) return;
        if (Mark.type != "AngleRuler") return;
        var ctx = canvas.getContext("2d");
        ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);
        setMarkColor(ctx);

        var tempAlpha2 = ctx.globalAlpha;
        ctx.globalAlpha = 1.0;
        ctx.beginPath();
        ctx.strokeStyle = "#00FF00";
        ctx.fillStyle = "#00FF00";

        ctx.moveTo(Mark.pointArray[0].x, Mark.pointArray[0].y);
        ctx.lineTo(Mark.pointArray[1].x, Mark.pointArray[1].y);
        ctx.stroke();
        if (Mark.pointArray.length > 2) {
            ctx.moveTo(Mark.pointArray[1].x, Mark.pointArray[1].y);
            ctx.lineTo(Mark.pointArray[2].x, Mark.pointArray[2].y);
            ctx.stroke();
        }
        /*if (Mark.pointArray.length > 3) {
            ctx.moveTo(Mark.pointArray[1].x, Mark.pointArray[1].y);
            ctx.lineTo(Mark.pointArray[3].x, Mark.pointArray[3].y);
            ctx.stroke();
        }*/
        ctx.closePath();
        ctx.strokeStyle = "#FF0000";
        ctx.fillStyle = "#FF0000";
        if (Mark.pointArray.length > 0) {
            ctx.beginPath();
            ctx.arc(Mark.pointArray[0].x, Mark.pointArray[0].y, 3, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        }
        if (Mark.pointArray.length > 1) {
            ctx.beginPath();
            ctx.arc(Mark.pointArray[1].x, Mark.pointArray[1].y, 3, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        }
        /*if (Mark.pointArray.length > 3) {
            ctx.beginPath();
            ctx.arc(Mark.pointArray[3].x, Mark.pointArray[3].y, 3, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        }*/
        ctx.beginPath();
        if (Mark.pointArray.length > 2) {
            ctx.strokeStyle = "#FF0000";
            ctx.fillStyle = "#FF0000";
            ctx.arc(Mark.pointArray[1].x, Mark.pointArray[1].y, 3, 0, 2 * Math.PI);
            ctx.fill();
            ctx.arc(Mark.pointArray[2].x, Mark.pointArray[2].y, 3, 0, 2 * Math.PI);
            ctx.fill();
        }
        ctx.closePath();

        if (Mark.Text) {
            ctx.beginPath();
            ctx.font = "" + (22) + "px Arial";
            ctx.fillStyle = "#FF0000";
            ctx.fillText("" + Mark.Text, Mark.lastMark.x, Mark.lastMark.y);
            ctx.closePath();
        }
        ctx.globalAlpha = tempAlpha2;
    } catch (ex) { }
}
PLUGIN.PushMarkList(drawAngleRuler);

function getAnglelValueBy2Point(pointArray) {
    //if (!angle.angle_) return;
    var getAngle = ({
        x: x1, y: y1
    }, {
        x: x2, y: y2
    }) => {
        const dot = x1 * x2 + y1 * y2
        const det = x1 * y2 - y1 * x2
        const angle = Math.atan2(det, dot) / Math.PI * 180
        return (angle + 360) % 360
    }
    var angle1 = getAngle({
        x: pointArray[1].x - pointArray[2].x,
        y: pointArray[1].y - pointArray[2].y,
    }, {
        x: pointArray[1].x - pointArray[0].x,
        y: pointArray[1].y - pointArray[0].y,
    });
    if (angle1 > 180) angle1 = 360 - angle1;
    return parseInt(angle1) + "°";
}

window.addEventListener('keydown', (KeyboardKeys) => {
    var key = KeyboardKeys.which

    if ((BL_mode == 'angle') && Angle_previous_choose && (key === 46 || key === 110)) {
        PatientMark.splice(PatientMark.indexOf(Angle_previous_choose.dcm), 1);
        displayMark();
        Angle_previous_choose = null;
        refreshMarkFromSop(GetViewport().sop);
    }
    Angle_previous_choose = null;
});

function getAnglelValue(e, Label) {
    if (!angle.angle_) return;
    var getAngle = ({
        x: x1, y: y1
    }, {
        x: x2, y: y2
    }) => {
        const dot = x1 * x2 + y1 * y2
        const det = x1 * y2 - y1 * x2
        const angle = Math.atan2(det, dot) / Math.PI * 180
        return (angle + 360) % 360
    }
    var angle1 = getAngle({
        x: Angle_Point1[0] - Angle_Point2[0],
        y: Angle_Point1[1] - Angle_Point2[1],
    }, {
        x: Angle_Point1[0] - Angle_Point0[0],
        y: Angle_Point1[1] - Angle_Point0[1],
    });
    if (angle1 > 180) angle1 = 360 - angle1;
    if (!Label) return parseInt(angle1) + "°";

    x_out = -parseInt(magnifierCanvas.style.width) / 2; // 與游標座標之水平距離
    y_out = -parseInt(magnifierCanvas.style.height) / 2; // 與游標座標之垂直距離
    if (angle.angle_ >= 2) {
        Label.style.display = '';
        if (Angle_Point2[0] > Angle_Point0[0])
            x_out = 20; // 與游標座標之水平距離
        else x_out = -20;
        if (Angle_Point2[1] > Angle_Point0[1])
            y_out = 20; // 與游標座標之水平距離
        else y_out = -20;
    } else {
        Label.style.display = 'none';
    }
    if (document.body.scrollTop && document.body.scrollTop != 0) {
        dbst = document.body.scrollTop;
        dbsl = document.body.scrollLeft;
    } else {
        dbst = document.getElementsByTagName("html")[0].scrollTop;
        dbsl = document.getElementsByTagName("html")[0].scrollLeft;
    }
    dgs = Label.style;
    y = e.clientY;
    x = e.clientX;
    if (!y || !x) {
        y = e.touches[0].clientY;
        x = e.touches[0].clientX;
    }
    dgs.top = y + dbst + y_out + "px";
    dgs.left = x + dbsl + x_out + "px";

    var angle1 = getAngle({
        x: Angle_Point0[0] - Angle_Point2[0],
        y: Angle_Point0[1] - Angle_Point2[1],
    }, {
        x: Angle_Point0[0] - Angle_Point1[0],
        y: Angle_Point0[1] - Angle_Point1[1],
    });
    if (angle1 > 180) angle1 = 360 - angle1;
    return parseInt(angle1) + "°";
}