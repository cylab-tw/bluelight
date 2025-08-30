
//邊框寬度
var bordersize = 5;

//表示左側的影像可以點擊
var openLeftImgClick = true;

let leftLayout, Pages;
onloadFunction.push2First(
    function () {
        leftLayout = new LeftLayout();
        Pages = new BlueLightPage();
    }
);

onloadFunction.push2Last(
    //載入延遲載入的影像
    function () {
        var imgs = document.querySelectorAll('.img,.innerimg');//className is img or innerimg
        for (var img of imgs) {
            if (img.loading && img.loading == "lazy") img.loading = "eager";
        }
    }
);

function HideElemByID(Elem) {
    if (Elem.constructor.name == "Array") {
        for (var elem of Elem) getByid(elem).style.display = "none";
    }
    else if (Elem.constructor.name == "String") {
        getByid(Elem).style.display = "none";
    }
}

function ShowElemByID(Elem) {
    if (Elem.constructor.name == "Array") {
        for (var elem of Elem) getByid(elem).style.display = "";
    }
    else if (Elem.constructor.name == "String") {
        getByid(Elem).style.display = "";
    }
}

function addIconSpan(span) {
    getByid("icon-list").appendChild(span);
    getByid("container").style.height = `calc(100vh - ${getByid("container").offsetTop}px)`;
}

function invertDisplayById(id) {
    if (!id && !getByid(id)) return;
    if (getByid(id).style.display == "none") getByid(id).style.display = "";
    else getByid(id).style.display = "none";
}

function refleshGUI() {
    var viewport = GetViewport();
    if (!viewport) return;

    //Viewport Border Color
    viewport.div.classList.add("SelectedViewport");
    for (var z = 0; z < Viewport_Total; z++) {
        if (z != viewportNumber) GetViewport(z).div.classList.remove("SelectedViewport");
    }
    if (GetViewport().Sop) leftLayout.setAccent(GetViewport().Sop.parent.SeriesInstanceUID);

    if (viewport.invert) getByid("color_invert").classList.add("activeImg");
    else getByid("color_invert").classList.remove("activeImg");
    if (viewport.HorizontalFlip) getByid("horizontal_flip").classList.add("activeImg");
    else getByid("horizontal_flip").classList.remove("activeImg");
    if (viewport.VerticalFlip) getByid("vertical_flip").classList.add("activeImg");
    else getByid("vertical_flip").classList.remove("activeImg");
    if (viewport.rotate != 0) getByid("MouseRotate").classList.add("activeImg");
    else getByid("MouseRotate").classList.remove("activeImg");
}

class BlueLightPage {
    constructor() {
        this.type = "DicomPage";
        this.pages = getByid("pages");
    }

    displayPage(PageID) {
        if (this.type == PageID || !PageID) return;
        for (var page of getClass("page")) {
            if (page.id == PageID) page.style.display = "";
            else page.style.display = "none";
        }
        this.type = PageID;
    }
}

function setImageObjToLeft(Sop) {
    var imageObj = Sop.Image, dataSet = Sop.Image.data;
    leftLayout.setImg2Left(new QRLv(dataSet), dataSet.string(Tag.PatientID));
    if (Sop.type == "frame") leftLayout.appendCanvasBySop(dataSet.string(Tag.SOPInstanceUID), imageObj, imageObj.getPixelData());
    else leftLayout.appendCanvasBySeries(dataSet.string(Tag.SeriesInstanceUID), imageObj, imageObj.getPixelData());
    leftLayout.refleshMarkWithSeries(dataSet.string(Tag.SeriesInstanceUID));
}

class LeftLayout {
    constructor() { }

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

    findSop(sop) {
        for (var series_div of getClass("LeftImgAndMark")) {
            if (series_div.sop == sop) return series_div;
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
        Patient_div.PatientId = patientID;
        if (!this.findPatienID(patientID)) pic.appendChild(Patient_div);
        else {
            for (var elem of getClass("OutLeftImg"))
                if (elem.PatientId == patientID) Patient_div = elem;
        }

        if (!QRLevel.frames && this.findSeries(QRLevel.series)) return;
        if (QRLevel.frames && this.findSop(QRLevel.sop)) return;

        var series_div = document.createElement("DIV");
        series_div.className = "LeftImgAndMark";

        series_div.series = QRLevel.series;
        if (QRLevel.frames) series_div.sop = QRLevel.sop;
        series_div.style.touchAction = 'none';

        var ImgDiv = document.createElement("DIV");
        ImgDiv.className = "LeftImgDiv";
        ImgDiv.series = QRLevel.series;
        if (QRLevel.frames) ImgDiv.series = QRLevel.sop;
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

        if (!ImgDiv.canvas()) {
            var leftCanvas = document.createElement("CANVAS");
            leftCanvas.className = "LeftCanvas";
            ImgDiv.appendChild(leftCanvas);
            displayLeftCanvas(leftCanvas, image, pixelData);
            var label = document.createElement("label");
            label.className = "LeftImgCountLabel";
            series_div.series_label = label;
            ImgDiv.appendChild(label);
        }
        this.refreshNumberOfFramesOrSops(image);
    }

    appendCanvasBySop(sop, image, pixelData) {
        var sop_div = this.findSop(sop);
        if (!sop_div) return;
        var ImgDiv = sop_div.ImgDiv;

        if (!ImgDiv.canvas()) {
            var leftCanvas = document.createElement("CANVAS");
            leftCanvas.className = "LeftCanvas";
            ImgDiv.appendChild(leftCanvas);
            displayLeftCanvas(leftCanvas, image, pixelData);
            var label = document.createElement("label");
            label.className = "LeftImgCountLabel";
            sop_div.series_label = label;
            ImgDiv.appendChild(label);
        }
        this.refreshNumberOfFramesOrSops(image);
    }

    refreshNumberOfFramesOrSops(image) {
        if (image.NumberOfFrames > 1) var series_div = this.findSop(image.SOPInstanceUID);
        else var series_div = this.findSeries(image.SeriesInstanceUID);
        if (!series_div) return;

        if (image.NumberOfFrames > 1) series_div.series_label.innerText = htmlEntities("" + image.NumberOfFrames);
        else if (image.haveSameInstanceNumber) series_div.series_label.innerText = "";
        else series_div.series_label.innerText = "" + htmlEntities(ImageManager.findSeries(image.SeriesInstanceUID).Sop.length);
    }

    refleshMarkWithSeries(series) {
        var series_div = this.findSeries(series);
        if (!series_div) return;
        if (getByid("menu" + series)) getByid("menu" + series).innerHTML = "";

        var showNameList = [], colorList = [], hideNameList = [];
        var Series = ImageManager.findSeries(series);
        for (var k = 0; k < Series.Sop.length; k++) {
            for (var n = 0; n < PatientMark.length; n++) {
                if (PatientMark[n].sop == Series.Sop[k].SOPInstanceUID) {
                    if (showNameList.length == 0) {
                        showNameList.push(PatientMark[n].showName);
                        colorList.push(PatientMark[n].color);
                        hideNameList.push(PatientMark[n].hideName);
                    } else {
                        if (!hideNameList.includes(PatientMark[n].hideName)) {
                            hideNameList.push(PatientMark[n].hideName);
                            showNameList.push(PatientMark[n].showName);
                            colorList.push(PatientMark[n].color);
                        }
                    }
                }
            }
        }

        for (var o = 0; o < showNameList.length; o++) {
            var label = document.createElement('LABEL');
            label.innerText = "" + showNameList[o];
            label.name = "" + hideNameList[o];
            label.className = "LeftShadowLabel";
            label.style.color = colorList[o];
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

        if (getByid("LeftPicture"))
            if (hasScroll(getByid("LeftPicture")))
                document.documentElement.style.setProperty('--ishaveLeftScroll', `1`);
            else document.documentElement.style.setProperty('--ishaveLeftScroll', `0`);
    }
}

//此段原有Bug，若沒有載入滿Series，便載入最後一個，現在已修復
function PictureOnclick(QRLevel) {
    if (!openLeftImgClick || !QRLevel) return;
    cancelTools();
    resetViewport();

    if (QRLevel.frames) GetViewport().loadImgBySop(ImageManager.findSop(QRLevel.sop));
    else if (QRLevel.series) GetViewport().loadImgBySop(ImageManager.findSeries(QRLevel.series).Sop[0])
    else if (QRLevel.sop) GetViewport().loadImgBySop(ImageManager.findSop(QRLevel.sop).parent.Sop[0]);
    //if (QRLevel.series) GetViewport().loadFirstImgBySeries(QRLevel.series);
    //else if (QRLevel.sop) GetViewport().loadFirstImgBySop(QRLevel.sop);
}

function displayLeftCanvas(DicomCanvas, image, pixelData) {
    DicomCanvas.width = image.width;
    DicomCanvas.height = image.height
    if (pixelData) renderPixelData2Cnavas(image, pixelData, DicomCanvas);
    else {
        var ctx = DicomCanvas.getContext("2d");
        var imgData = ctx.createImageData(66, 66);
        new Uint32Array(imgData.data.buffer).fill(0xFF000000);
        ctx.putImageData(imgData, 0, 0);
    }
}

//當視窗大小改變
window.onresize = function () {
    if (Pages.type == "DicomPage") {
        //刷新每個Viewport
        for (var i = 0; i < Viewport_Total; i++) {
            try {
                GetViewport(i).scale = null;
                GetViewport(i).translate.x = GetViewport(i).translate.y = 0;
                GetViewport(i).loadImgBySop(GetViewport(i).Sop);
            } catch (ex) { console.log(ex) }
        }

        //關閉抽屜
        for (var obj of getClass("drawer")) obj.style.display = "none";

        EnterRWD();
        for (var i = 0; i < Viewport_Total; i++) {
            try { setTransform(i); }
            catch (ex) { console.log(ex) }
        }
    } else {
        getByid("container").style.height = `calc(100vh - ${getByid("container").offsetTop}px)`;
    }
}

//執行icon圖示的摺疊效果
function EnterRWD() {
    //刷新Viewport窗格
    SetTable();
    if (GetViewport(0)) for (var i = 0; i < Viewport_Total; i++) GetViewport(i).ScrollBar.reflesh();
}

function SetTable(row0, col0) {
    getByid("container").style.height = `calc(100vh - ${getByid("container").offsetTop}px)`;

    //取得Viewport的row與col數量
    let row = Viewport_row, col = Viewport_col;
    //如果有傳入row與col的參數，則優先使用傳入的
    if (row0 && col0) [row, col] = [row0, col0];

    if (VIEWPORT.fixRow) row = VIEWPORT.fixRow;
    if (VIEWPORT.fixCol) col = VIEWPORT.fixCol;

    //如果限制只顯示其中一個viewport
    if (BlueLightViewPort.only1Viewport >= 0) {
        for (var i = 0; i < row * col; i++) {
            if (i == BlueLightViewPort.only1Viewport) {
                GetViewport(i).div.style.display = "";
                GetViewport(i).enable = true;
            } else {
                GetViewport(i).div.style.display = "none";
                GetViewport(i).enable = false;
            }
        }
        GetViewport(BlueLightViewPort.only1Viewport).div.style.width = `calc(${100 / 1}% - ${bordersize * 2}px)`;
        GetViewport(BlueLightViewPort.only1Viewport).div.style.height = `calc(${100 / 1}% - ${bordersize * 2}px)`;
        refleshGUI();
        return;
    }

    //重置各個Viewport的長寬大小(有顯示時)
    try {
        for (var r = 0; r < row; r++) {
            for (var c = 0; c < col; c++) {
                GetViewport(r * col + c).div.style.width = `calc(${100 / col}% - ${bordersize * 2}px)`;
                GetViewport(r * col + c).div.style.height = `calc(${100 / row}% - ${bordersize * 2}px)`;
            }
        }
    } catch (ex) { }
    //重置各個Viewport的長寬大小(不顯示時)

    for (var i = 0; i < row * col; i++) {
        GetViewport(i).div.style.display = "";
        GetViewport(i).enable = true;
    }
    for (var i = row * col; i < Viewport_Total; i++) {
        GetViewport(i).div.style.display = "none";
        GetViewport(i).enable = false;
    }

    if (GridMode == "fullcol") {
        GetViewport(0).div.style.height = `calc(${100 / 1}% - ${bordersize * 2}px)`;
        for (var r = 1; r < row; r++) {
            for (var c = 0; c < col; c++) {
                GetViewport(r * col + 0).div.style.display = "none";
                GetViewport(r * col + 0).enable = false;
            }
        }
    }
    else if (GridMode == "fullrow") {
        GetViewport(0).div.style.width = `calc(${100 / 1}% - ${bordersize * 2}px)`;
        for (var r = 0; r < row; r++) {
            for (var c = 1; c < col; c++) {
                GetViewport(0 * col + c).div.style.display = "none";
                GetViewport(0 * col + c).enable = false;
            }
        }
    }

    refleshGUI();
}