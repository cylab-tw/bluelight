
//表示目前icon圖示的RWD收合功能為開啟狀態
var openRWD = true;
//邊框寬度
var bordersize = 5;

//表示左側的影像可以點擊
var openLeftImgClick = true;

let leftLayout;
onloadFunction.push2First(
    function () { leftLayout = new LeftLayout(); }
);

onloadFunction.push2Last(
    //載入延遲載入的影像
    function () {
        var imgs = document.querySelectorAll('.img,.innerimg');//className is img or innerimg
        for (img of imgs) {
            if (img.loading && img.loading == "lazy") img.loading = "eager";
        }
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

function invertDisplayById(id) {
    if (!id && !getByid(id)) return;
    if (getByid(id).style.display == "none") getByid(id).style.display = "";
    else getByid(id).style.display = "none";
}

function refleshGUI() {
    var viewport = GetViewport();
    if (!viewport) return;
    if (viewport.invert) getByid("color_invert").classList.add("activeImg");
    else getByid("color_invert").classList.remove("activeImg");
    if (viewport.HorizontalFlip) getByid("horizontal_flip").classList.add("activeImg");
    else getByid("horizontal_flip").classList.remove("activeImg");
    if (viewport.VerticalFlip) getByid("vertical_flip").classList.add("activeImg");
    else getByid("vertical_flip").classList.remove("activeImg");
    if (viewport.rotate != 0) getByid("MouseRotate").classList.add("activeImg");
    else getByid("MouseRotate").classList.remove("activeImg");
}

class LeftLayout {
    constructor() {
        this.initLeftLayout();
    }
    initLeftLayout() { }

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

    setAccent(series) {
        for (var series_div of getClass("LeftImgAndMark")) {
            series_div.style.border = "5px groove rgb(211, 217, 255)";
        }
        if (!series) return;
        if (getClass("LeftImgAndMark").length <= 1) return;
        for (var series_div of getClass("LeftImgAndMark")) {
            if (series_div.series == series) series_div.style.border = "5px solid rgb(255, 255, 255)";
        }
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

    setImg2Left(QRLevel, patientID) {
        var pic = getByid("LeftPicture");
        var Patient_div = document.createElement("DIV");
        Patient_div.className = "OutLeftImg";
        //Patient_div.id = "OutLeftImg" + patientID;
        Patient_div.style = "border:" + bordersize + "px #FFA3FF groove;padding:1px 1px 1px 1px;";
        Patient_div.PatientId = patientID;
        if (!this.findPatienID(patientID)) pic.appendChild(Patient_div);
        else {
            for (elem of getClass("OutLeftImg"))
                if (elem.PatientId == patientID) Patient_div = elem;
        }

        if (this.findSeries(QRLevel.series)) return;
        var series_div = document.createElement("DIV");
        series_div.className = "LeftImgAndMark";
        series_div.style = "width:" + 65 + "px;height:" + 65 + "px;border:" + bordersize + "px #D3D9FF groove;";
        series_div.series = QRLevel.series;
        series_div.style.touchAction = 'none';

        var ImgDiv = document.createElement("DIV");
        ImgDiv.className = "LeftImgDiv";
        ImgDiv.style = "width:" + 65 + "px;height:" + 65 + "px;";
        ImgDiv.series = QRLevel.series;
        ImgDiv.draggable = "true";
        ImgDiv.QRLevel = QRLevel;
        ImgDiv.onclick = function () {
            PictureOnclick(this.QRLevel);
        };

        ImgDiv.ondrag = function () {
            event.preventDefault();
            dragged = this;
        }

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
        //因為改成overflow-y已改成auto，不再需要
        /*getByid("LeftPicture").style["height"] = getByid("LeftPicture").style["overflow-y"] = "";
        if (parseInt(getByid("LeftPicture").offsetHeight) + 10 >= window.innerHeight - document.getElementsByClassName("container")[0].offsetTop - (bordersize * 2)) {
            getByid("LeftPicture").style["overflow-y"] = "scroll";
            getByid("LeftPicture").style.height = "" + (window.innerHeight - document.getElementsByClassName("container")[0].offsetTop - (bordersize * 2)) + "px;"
        }*/
    }
}

//此段原有Bug，若沒有載入滿Series，便載入最後一個，現在已修復
function PictureOnclick(QRLevel) {
    //console.log(series);
    if (!openLeftImgClick || !QRLevel) return;
    WindowOpen = false;
    cancelTools();
    resetViewport();
    //drawBorder(getByid("MouseOperation"));

    if (QRLevel.series) GetViewport().loadFirstImgBySeries(QRLevel.series);
    else if (QRLevel.sop) GetViewport().loadFirstImgBySop(QRLevel.sop);
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
        mirrorImage(ctx2, DicomCanvas, 0, 0, GetViewport().HorizontalFlip, GetViewport().VerticalFlip);
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


//當視窗大小改變
window.onresize = function () {
    //設定左側面板的style
    leftLayout.reflesh();
    //刷新每個Viewport
    for (var i = 0; i < Viewport_Total; i++) {
        try {
            if (!(GetViewport(i) && GetViewport(i).sop)) continue;
            GetViewport(i).scale = null;
            setSopToViewport(GetViewport(i).sop, i);
            //loadAndViewImage(Patient.findSop(GetViewport(i).sop).imageId, i);
        } catch (ex) { console.log(ex) }
    }
    hideAllDrawer();//關閉抽屜
    EnterRWD();
    for (var i = 0; i < Viewport_Total; i++) {
        try { setTransform(i); }
        catch (ex) { console.log(ex) }
    }
}

//執行icon圖示的摺疊效果
function EnterRWD() {
    //計算目前有幾個應被計算的icon在上方
    var count = 1;
    //計算上方icon的區塊有多少空間可以容納
    var iconWidth = getClass("page-header")[0].offsetWidth; //window.innerWidth;
    //檢查icon區塊的寬度是否足夠
    var check = false;
    for (let i = 0; i < getClass("page-header")[0].childNodes.length; i++) {
        if (getClass("page-header")[0].childNodes[i].tagName == "IMG") count++;
        if (getClass("page-header")[0].childNodes[i].alt == "輸出標記") continue;
        if (getClass("page-header")[0].childNodes[i].alt == "3dDisplay") continue;
        if (getClass("page-header")[0].childNodes[i].alt == "3dCave") continue;
        if (getClass("page-header")[0].childNodes[i].tagName == "IMG") {
            if (count >= parseInt(iconWidth / document.querySelector('.img').offsetWidth) - 2) {

                if (openRWD == true) { //如果折疊功能開啟中，隱藏應被隱藏的icon
                    getClass("page-header")[0].childNodes[i].style.display = "none";
                } else {
                    getClass("page-header")[0].childNodes[i].style.display = "";
                }
                //寬度足夠
                check = true;
            } else { //全部icon均顯示
                getClass("page-header")[0].childNodes[i].style.display = "";
            }
        }
    }
    //如果寬度足夠而沒有觸發折疊，摺疊的icon應該不顯示
    if (check == true) getByid("rwdImgTag").style.display = "";
    else getByid("rwdImgTag").style.display = "none";
    //刷新Viewport窗格
    SetTable();
    //刷新ScrollBar的Style
    //for (var slider of getClass("rightSlider")) slider.setStyle();
    if (GetViewport(0)) for (var i = 0; i < Viewport_Total; i++) GetViewport(i).ScrollBar.reflesh();
}

function SetTable(row0, col0) {
    //取得Viewport的row與col數量
    let row = Viewport_row,
        col = Viewport_col;
    //如果有傳入row與col的參數，則優先使用傳入的
    if (row0 && col0) {
        row = row0;
        col = col0
    }

    if (VIEWPORT.fixRow) row = VIEWPORT.fixRow;
    if (VIEWPORT.fixCol) col = VIEWPORT.fixCol;

    //重置各個Viewport的長寬大小(有顯示時)
    try {
        var WandH = getViewportFixSize(window.innerWidth, window.innerHeight, row, col);
        for (var i = 0; i < Viewport_Total; i++)
            GetViewport(i).div.style = `position:relative;float:left;left:100px;overflow:hidden;border:${bordersize}px #D3D9FF groove;margin:0px`;
        for (var r = 0; r < row; r++) {
            for (var c = 0; c < col; c++) {
                GetViewport(r * col + c).div.style.width = `calc(${parseInt(100 / col)}% - ${(parseInt(100 / col) + (bordersize * 2))}px)`;
                GetViewport(r * col + c).div.style.height = (WandH[1] - (bordersize * 2)) + "px";
            }
        }
    } catch (ex) { }
    //重置各個Viewport的長寬大小(不顯示時)
    for (var i = row * col; i < Viewport_Total; i++) {
        try {
            GetViewport(i).div.style = "position:relative;float: right;width:0px;" + "height:" + 0 + "px;overflow:hidden;border:" + 0 + "px #D3D9FF groove;margin:0px";
        } catch (ex) { }
    }


    if (viewportNumber >= row * col) viewportNumber = 0;

    if (GetViewport()) {
        GetViewport().div.style.backgroundColor = "rgb(10,6,6)";
        GetViewport().div.style.border = bordersize + "px #FFC3FF groove";
        leftLayout.setAccent(GetViewport().series);
    }
    // window.onresize();
}