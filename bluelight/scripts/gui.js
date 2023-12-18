
let leftLayout;
onloadFunction.push2First(
    function () {
        leftLayout = new LeftLayout();
    }
);

function HideElemByID(Elem) {
    if (Elem.constructor.name == "Array") {
        for (elem of Elem) getByid(elem).style.display = "none";
    }
    else if (Elem.constructor.name == "String") {
        getByid(Elem).style.display = "none";
    }
}

function ShowElemByID(Elem) {
    if (Elem.constructor.name == "Array") {
        for (elem of Elem) getByid(elem).style.display = "";
    }
    else if (Elem.constructor.name == "String") {
        getByid(Elem).style.display = "";
    }
}

class LeftLayout {
    constructor() {
        this.initLeftLayout();
    }
    initLeftLayout() {}

    findPatienID(PatientId) {
        for (var Patient_div of getClass("OutLeftImg")) {
            if (Patient_div.PatientId == PatientId) return Patient_div;
        }
        return null;
    }

    findSeries(series) {
        for (var series_div of getClass("LeftImgAndMark")) {
            if (series_div.series == series) return series_div;
        }
        return null;
    }

    getCheckboxBySeriesAndHideName(series, hideName) {
        var MarkDiv = getByid("menu" + series);
        if (!MarkDiv) return;
        var checkboxList = MarkDiv.getElementsByTagName("input");
        for (var checkbox of checkboxList) {
            if (checkbox.name == hideName) return checkbox;
        }
        return null;
    }

    //注意leftCanvasStudy
    setImg2Left(QRLevel, patientID) {
        var pic = getByid("LeftPicture");
        var Patient_div = document.createElement("DIV");
        Patient_div.className = "OutLeftImg";
        //Patient_div.id = "OutLeftImg" + patientID;
        Patient_div.style = "border:" + bordersize + "px #FFA3FF groove;padding:1px 1px 1px 1px;";
        Patient_div.PatientId = patientID;
        if (!this.findPatienID(patientID)) pic.appendChild(Patient_div);

        if (this.findSeries(QRLevel.series)) return;
        var series_div = document.createElement("DIV");
        series_div.className = "LeftImgAndMark";
        series_div.style = "width:" + 65 + "px;height:" + 65 + "px;border:" + bordersize + "px #D3D9FF groove;";
        series_div.series = QRLevel.series;
        series_div.draggable = "true";
        series_div.style.touchAction = 'none';

        var ImgDiv = document.createElement("DIV");
        ImgDiv.className = "LeftImgDiv";
        ImgDiv.style = "width:" + 65 + "px;height:" + 65 + "px;";
        ImgDiv.series = QRLevel.series;
        ImgDiv.onclick = function () {
            PictureOnclick(this.series);
        };
        ImgDiv.canvas = function () {
            if (!this.getElementsByClassName("LeftCanvas")[0]) return null;
            else return this.getElementsByClassName("LeftCanvas")[0];
        }

        series_div.appendChild(ImgDiv);
        series_div.ImgDiv = ImgDiv;
        //series_div.appendChild(smallDiv);
        Patient_div.appendChild(series_div);
        //應該會return一個DIV供Display Canvas
    }

    appendCanvasBySeries(series, image, pixelData) {
        var series_div = this.findSeries(series);
        if (!series_div) return;
        var ImgDiv = series_div.ImgDiv;

        if (ImgDiv.canvas()) {
            return;
            displayLeftCanvas(ImgDiv.canvas(), image, pixelData);
        } else {
            var leftCanvas = document.createElement("CANVAS");
            leftCanvas.className = "LeftCanvas";
            ImgDiv.appendChild(leftCanvas);
            displayLeftCanvas(leftCanvas, image, pixelData);
        }
    }

    refleshMarkWithSeries(series) {
        var series_div = this.findSeries(series);
        if (!series_div) return;
        if (getByid("menu" + series)) {
            getByid("menu" + series).innerHTML = "";
            series_div.style.height = 65 + "px";
        }

        var showNameList = [];
        var colorList = [];
        var hideNameList = [];
        var Series = Patient.findSeries(series);
        for (var k = 0; k < Series.SopAmount; k++) {
            for (var n = 0; n < PatientMark.length; n++) {
                if (PatientMark[n].sop == Series.Sop[k].SopUID) {
                    if (showNameList.length == 0) {
                        showNameList.push(PatientMark[n].showName);
                        colorList.push(PatientMark[n].color);
                        hideNameList.push(PatientMark[n].hideName);
                    } else {
                        var check = 0;
                        for (var o = 0; o < showNameList.length; o++) {
                            if (hideNameList[o] == PatientMark[n].hideName) {
                                check = 1;
                            }
                        }
                        if (check == 0) {
                            hideNameList.push(PatientMark[n].hideName);
                            showNameList.push(PatientMark[n].showName);
                            colorList.push(PatientMark[n].color);
                        }
                    }
                }
            }
        }

        for (var o = 0; o < showNameList.length; o++) {
            series_div.style.height = parseInt(series_div.style.height) + 35 + "px";
            var label = document.createElement('LABEL');
            label.innerText = "" + showNameList[o];
            label.name = "" + hideNameList[o];
            label.style = "text-shadow:0px 0px 10px #fff, 0px 0px 10px #fff, 0px 0px 10px #fff, 0px 0px 10px #fff, 0px 0px 10px #fff, 0px 0px 10px #fff, 0px 0px 10px #fff;" +
                "color:" + colorList[o] + ";";
            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";

            checkbox.checked = true;
            checkbox.name = "" + hideNameList[o];

            label.oncontextmenu = function (e) { e.preventDefault(); };
            //設定滑鼠按鍵事件
            label.onmousedown = function (e) {
                if (e.button == 2) jump2Mark(this.name);
            }
            checkbox.onchange = function () {
                getByid("AngleLabel").style.display = getByid("MeasureLabel").style.display = "none";
                for (var i = 0; i < Viewport_Total; i++) displayMark(i)
            };
            label.appendChild(checkbox);

            if (getByid("menu" + series)) {
                getByid("menu" + series).appendChild(label);
                getByid("menu" + series).appendChild(document.createElement("br"));
            } else {
                var smallDiv = document.createElement("DIV");
                smallDiv.id = "menu" + series;
                smallDiv.appendChild(label);
                smallDiv.appendChild(document.createElement("br"));
                series_div.appendChild(smallDiv);
            }
        }
    }

    reflesh() {
        getByid("LeftPicture").style["height"] = getByid("LeftPicture").style["overflow-y"] = "";
        if (parseInt(getByid("LeftPicture").offsetHeight) + 10 >= window.innerHeight - document.getElementsByClassName("container")[0].offsetTop - (bordersize * 2)) {
            getByid("LeftPicture").style["overflow-y"] = "scroll";
            getByid("LeftPicture").style.height = "" + (window.innerHeight - document.getElementsByClassName("container")[0].offsetTop - (bordersize * 2)) + "px;"
        }
    }
}

//此段原有Bug，若沒有載入滿Series，便載入最後一個，現在已修復
function PictureOnclick(series) {console.log(series);
    if (!openLeftImgClick) return;
    WindowOpen = false;
    cancelTools();
    resetViewport();
    //drawBorder(getByid("MouseOperation"));

    GetViewport().obj.loadFirstImgBySeries(series);
    GetViewport().obj.loadFirstImgBySeries(series);
}

function displayLeftCanvas(DicomCanvas, image, pixelData) {
    DicomCanvas.width = image.width;
    DicomCanvas.height = image.height
    DicomCanvas.style.width = 66 + "px";
    DicomCanvas.style.height = 66 + "px";
    var ctx2 = DicomCanvas.getContext("2d");
    var imgData2 = ctx2.createImageData(image.width, image.height);
    if ((image.data.elements.x00281050 == undefined || image.data.elements.x00281051 == undefined)) {
        var max = -99999999999, min = 99999999999;
        if (image.MinPixel == undefined || image.MaxPixel == undefined) {
            for (var i in pixelData) {
                if (pixelData[i] > max) max = pixelData[i];
                if (pixelData[i] < min) min = pixelData[i];
            }
            image.MinPixel = min; image.MaxPixel = max;
        }
        min = image.MinPixel; max = image.MaxPixel;
        if (min != max && min != undefined && max != undefined) {
            if (image.color == true) {
                for (var i = imgData2.data.length; i >= 0; i -= 4) {
                    imgData2.data[i + 0] = parseInt((pixelData[i] / (max - min)) * 255);
                    imgData2.data[i + 1] = parseInt((pixelData[i + 1] / (max - min)) * 255);
                    imgData2.data[i + 2] = parseInt((pixelData[i + 2] / (max - min)) * 255);
                    imgData2.data[i + 3] = 255;
                }
            } else {
                for (var i = imgData2.data.length, j = imgData2.data.length / 4; i >= 0; i -= 4, j--) {
                    imgData2.data[i + 0] = imgData2.data[i + 1] = imgData2.data[i + 2] = parseInt((pixelData[j] / (max - min)) * 255);
                    imgData2.data[i + 3] = 255;
                }
            }
            ctx2.putImageData(imgData2, 0, 0);
        }
    } else {
        var windowCenter = image.windowCenter;
        var windowWidth = image.windowWidth;
        var high = windowCenter + (windowWidth / 2);
        var low = windowCenter - (windowWidth / 2);
        var intercept = image.intercept;
        if (CheckNull(intercept)) intercept = 0;
        var slope = image.slope;
        if (CheckNull(slope)) slope = 1;
        var multiplication = 255 / ((high - low)) * slope;
        var addition = (- low + intercept) / (high - low) * 255;
        if (image.color == true) {
            for (var i = imgData2.data.length; i >= 0; i -= 4) {
                imgData2.data[i + 0] = pixelData[i] * multiplication + addition;
                imgData2.data[i + 1] = pixelData[i + 1] * multiplication + addition;
                imgData2.data[i + 2] = pixelData[i + 2] * multiplication + addition;
                imgData2.data[i + 3] = 255;
            }
        } else {
            for (var i = imgData2.data.length, j = imgData2.data.length / 4; i >= 0; i -= 4, j--) {
                imgData2.data[i + 0] = imgData2.data[i + 1] = imgData2.data[i + 2] = pixelData[j] * multiplication + addition;
                imgData2.data[i + 3] = 255;
            }
        }
        ctx2.putImageData(imgData2, 0, 0);
    }
    var invert = (image.invert == true);
    function mirrorImage(ctx, picture, x = 0, y = 0, horizontal = false, vertical = false) {
        ctx.save();  // save the current canvas state
        ctx.setTransform(
            horizontal ? -1 : 1, 0, // set the direction of x axis
            0, vertical ? -1 : 1,   // set the direction of y axis
            x + (horizontal ? image.width : 0), // set the x origin
            y + (vertical ? image.height : 0)   // set the y origin
        );
        if (invert == true) ctx.filter = "invert()";
        ctx.drawImage(picture, 0, 0);
        ctx.restore(); // restore the state as it was when this function was called
    }
    if (invert == true) {
        mirrorImage(ctx2, DicomCanvas, 0, 0, GetViewport().openHorizontalFlip, GetViewport().openVerticalFlip);
    }
}

function displayImg2LeftCanvas(DicomCanvas, image, pixelData) {
    DicomCanvas.width = 100;
    DicomCanvas.height = 100;
    DicomCanvas.style.width = 66 + "px";
    DicomCanvas.style.height = 66 + "px";
    var ctx = DicomCanvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 100, 100);
    ctx.fillStyle = "gray";
    function roundRect(ctx, x, y, w, h, r = 10) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        ctx.fill();
    }
    roundRect(ctx, 10, 10, 80, 80, 10);
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.font = "32px serif";
    ctx.closePath();
    ctx.fillText("PDF", 20, 59);
    ctx.closePath();
    ctx.fill();
}