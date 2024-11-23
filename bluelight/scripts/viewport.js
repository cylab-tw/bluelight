//Viewport的總數量
const Viewport_Total = 16;
//Viewport的即時數量
let Viewport_row = 1;
let Viewport_col = 1;

//表示Viewport為連接狀態
var openLink = false;
var openECG = false;

//目前選取的Viewport是第幾個Viewport
var viewportNumber = 0;

let ViewPortList = [];

class ImageInfo {
    constructor() {
        this.type = type;
        this.image = image;
        this.dataSet = dataSet;
    }
}

class BlueLightViewPort {
    static only1Viewport = -1;
    constructor(index, init = true) {
        if (init) this.initViewport(index);
    }

    initViewport(index) {
        var div = document.createElement("DIV");
        div.id = "DicomViewport" + index;
        div.viewportNum = index;
        div.className = "DicomViewport";
        getByid("DicomPage").appendChild(div);
        this.div = div;
        this.index = index;
        this.QRLevel = "series";
        this.content = {};
        //this.dcm = null;
        this.initViewportOption(div, index);
        this.initLeftRule(div, index);
        this.initDownRule(div, index);
        //this.initLabelWC(div, index);
        this.initLabelLT(div, index);
        this.initLabelRT(div, index);
        this.initLabelLB(div, index);
        this.initLabelRB(div, index);
        //this.initLabelXY(div, index);
        this.initScrollBar(div, index);

        this.div.ondblclick = DoubleClickF;
    }
    clear() {
        this.invert = false;
        this.HorizontalFlip = false;
        this.VerticalFlip = false;
        this.rotate = 0;
        this.translate = new Point2D(0, 0);
        this.scale = null;
        this.Sop = undefined;

        this.windowCenter = null;
        this.windowWidth = null;

        this.transform = {};
        this.drawMark = true;
        this.play = false;

        this.enable = true;
        this.lockRender = false;
        this.cine = false;

        this.content = {};
        this.div.enable = true;
        this.div.lockRender = false;
        this.DicomTagsList = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.width = this.canvas.height = 1;
        this.MarkCanvas.getContext('2d').clearRect(0, 0, this.MarkCanvas.width, this.MarkCanvas.height);
        this.MarkCanvas.width = this.MarkCanvas.height = 1;
    }

    initViewportOption(div, index) {
        this.invert = false;
        this.HorizontalFlip = false;
        this.VerticalFlip = false;
        this.rotate = 0;
        this.translate = new Point2D(0, 0);
        this.scale = null;

        this.windowCenter = null;
        this.windowWidth = null;

        this.transform = {};
        this.drawMark = true;
        this.play = false;

        this.enable = true;
        this.lockRender = false;
        this.cine = false;

        this.content.framesNumber = 0;

        //div.newMousePointX = 0;
        //div.newMousePointY = 0;
        //div.openMark = true;
        //div.openInvert = false;

        div.enable = true;
        div.lockRender = false;
        this.DicomTagsList = [];
        this.labelDict = {};
        this.initViewportCanvas(div, index);
    }
    get enable() { return this.div.enable };
    get width() { return this.content.image ? this.content.image.width : undefined };
    get height() { return this.content.image ? this.content.image.height : undefined };
    get lockRender() { return this.div.lockRender };
    set enable(v) { this.div.enable = v };
    set lockRender(v) { this.div.lockRender = v };

    get study() { if (this.tags) return this.tags.StudyInstanceUID };
    get series() { if (this.tags) return this.tags.SeriesInstanceUID };
    get sop() { if (this.tags) return this.tags.SOPInstanceUID };
    get InstanceNumber() { return this.div.InstanceNumber };
    get framesNumber() { return this.content.framesNumber };
    get tags() { return this.DicomTagsList; }

    set study(v) { this.div.study = v };
    set series(v) { this.div.series = v };
    set sop(v) { this.div.sop = v };
    set InstanceNumber(v) { this.div.InstanceNumber = v };
    set framesNumber(v) { this.content.framesNumber = v };
    initViewportCanvas(div, index) {
        //一般的Canvas
        var dicmCanvas = document.createElement("CANVAS");
        dicmCanvas.className = "DicomCanvas";
        div.appendChild(dicmCanvas);
        this.canvas = dicmCanvas;
        //只要取得canvas()就能快速取得該Viewport的影像
        div.canvas = function () {
            if (!this.getElementsByClassName("DicomCanvas")[0]) return null;
            else return this.getElementsByClassName("DicomCanvas")[0];
        }
        div.ctx = function () {
            if (!this.getElementsByClassName("DicomCanvas")[0]) return null;
            else return this.getElementsByClassName("DicomCanvas")[0].getContext("2d");
        }

        //標記Canvas
        var MarkCanvas = document.createElement("CANVAS");
        MarkCanvas.id = "MarkCanvas" + index;
        MarkCanvas.className = "MarkCanvas";
        div.appendChild(MarkCanvas);
        this.MarkCanvas = MarkCanvas;
    }

    get ctx() { return this.canvas.getContext("2d"); }

    initLeftRule(div, index) {
        var leftRule = document.createElement("CANVAS");
        leftRule.className = "leftRule";
        leftRule.height = 500;
        leftRule.width = 50;
        this.leftRule = div.leftRule = leftRule;
        div.appendChild(leftRule);
    }

    initDownRule(div, index) {
        var downRule = document.createElement("CANVAS");
        downRule.className = "downRule";
        downRule.height = 20;
        this.downRule = div.downRule = downRule;
        div.appendChild(downRule);
    }

    /*initLabelWC(div, index) {
        var labelWC = document.createElement("LABEL");
        labelWC.className = "labelWC innerLabel";
        this.labelWC = div.labelWC = labelWC;
        div.appendChild(labelWC);
    }*/
    initLabelLT(div, index) {
        var labelLT = document.createElement("LABEL");
        labelLT.className = "labelLT innerLabel";
        this.labelLT = div.labelLT = labelLT;
        div.appendChild(labelLT);
    }
    initLabelRT(div, index) {
        var labelRT = document.createElement("LABEL");
        labelRT.className = "labelRT innerLabel";
        this.labelRT = div.labelRT = labelRT;
        div.appendChild(labelRT);
    }
    initLabelLB(div, index) {
        var labelLB = document.createElement("LABEL");
        labelLB.className = "labelLB innerLabel";
        this.labelLB = div.labelLB = labelLB;
        div.appendChild(labelLB);
    }
    initLabelRB(div, index) {
        var labelRB = document.createElement("LABEL");
        labelRB.className = "labelRB innerLabel";
        this.labelRB = div.labelRB = labelRB;
        div.appendChild(labelRB);
    }
    setLabel(key, value) {
        this.labelDict[key] = value;
    }
    getLabel(key) {
        return this.labelDict[key] ? this.labelDict[key] : "";
    }
    refleshLabel() {
        if (!this.content.image) return;
        function extractTags(input) {
            var regex = /\{tag:([^}]+)\}/g, matches = [], match;
            while ((match = regex.exec(input)) !== null) matches.push(match[1]);
            return matches;
        }

        function extractVals(input) {
            var regex = /\{val:([^}]+)\}/g, matches = [], match;
            while ((match = regex.exec(input)) !== null) matches.push(match[1]);
            return matches;
        }

        this.labelLT.innerHTML = this.labelLB.innerHTML = this.labelRT.innerHTML = this.labelRB.innerHTML = "";

        for (var labels of [DicomTags.LT, DicomTags.LB, DicomTags.RT, DicomTags.RB]) {
            for (var i = 0; i < labels.value.length; i++) {
                var tags = extractTags(labels.value[i]), vals = extractVals(labels.value[i]);
                var str = labels.value[i];
                for (var j = 0; j < tags.length; j++)str = str.replace("{tag:" + tags[j] + "}", htmlEntities(getDicomTagString(this.content.image.data, "x" + tags[j].toLowerCase())));
                for (var j = 0; j < vals.length; j++)str = str.replace("{val:" + vals[j] + "}", htmlEntities(this.getLabel(vals[j])));
                if (labels == DicomTags.LT) this.labelLT.innerHTML += " " + str + "<br/>";
                if (labels == DicomTags.LB) this.labelLB.innerHTML += " " + str + "<br/>";
                if (labels == DicomTags.RT) this.labelRT.innerHTML += " " + str + "<br/>";
                if (labels == DicomTags.RB) this.labelRB.innerHTML += " " + str + "<br/>";
            }
        }
        this.refleshScrollBar();
        //labelLT.innerHTML += "" + DicomTags.LT.name[i] + " " + htmlEntities(image.data.string("x" + DicomTags.LT.tag[i])) + "<br/>";
    }
    /*initLabelXY(div, index) {
        var labelXY = document.createElement("LABEL");
        labelXY.className = "labelXY innerLabel";
        labelXY.innerText = "";//"X: 0 Y: 0";
        this.labelXY = div.labelXY = labelXY;
        div.appendChild(labelXY);
    }*/
    initScrollBar(div, index) {
        this.ScrollBar = new ScrollBar(div);//增加右側卷軸
    }

    get QRLevels() {
        return {
            study: this.study,
            series: this.series,
            sop: this.sop
        };
    }

    nextFrame(invert = false) {
        if (this.enable == false) return;
        if (this.QRLevel == "series" && this.tags && this.tags.length) {
            var Sop = ImageManager.getNextSopByQRLevelsAndInstanceNumber(this.QRLevels, this.tags.InstanceNumber, invert);
            if (Sop != undefined) this.loadImgBySop(Sop);
        }
        else if (this.QRLevel == "sop") {
            var SopList = ImageManager.findSeries(this.QRLevels.series).Sop;
            var index = SopList.findIndex((elem) => elem == this.Sop);
            if (invert == false) {
                if (index >= SopList.length - 1) var Sop = SopList[0];
                else var Sop = SopList[index + 1];
            } else {
                if (index <= 0) var Sop = SopList[SopList.length - 1];
                else var Sop = SopList[index - 1];
            }
            if (Sop != undefined) this.loadImgBySop(Sop);
        }
        else if (this.QRLevel == "frames" && this.framesNumber != undefined) {
            this.framesNumber += invert == true ? -1 : 1;
            if (this.framesNumber == -1) this.framesNumber = this.content.image.NumberOfFrames - 1;
            else if (this.framesNumber >= this.content.image.NumberOfFrames) this.framesNumber = 0;
            setSeriesCount(this.index);
            refleshCanvas(this);
            this.refleshScrollBar();
        }
    }

    reloadImg() {
        if (this.study == undefined) return;
        var Sop = ImageManager.getSopByQRLevels(this.QRLevels);
        if (Sop.pdf) PdfLoader(Sop.pdf);
        else if (Sop.ecg && openECG) EcgLoader(Sop);
        else this.loadImgBySop(Sop);
    }

    //統一由這載入影像到Viewport
    //底下那兩個和Frame要注意
    //readDicom要注意
    loadImgBySop(Sop) {
        if (!Sop) return;
        if (this.enable == false || this.lockRender == true) return;
        this.labelDict = {};
        if (Sop.constructor.name == 'String') Sop = ImageManager.findSop(Sop);

        this.Sop = Sop;
        requestAnimationFrame(() => {
            if (Sop.type == 'sop') DcmLoader(Sop.Image, this);
            else if (Sop.type == 'frame') {
                this.framesNumber = 0;
                DcmLoader(Sop.Image, this);
            }
            else if (Sop.type == 'pdf') PdfLoader(Sop.pdf, Sop);
            else if (Sop.type == 'ecg' && openECG) EcgLoader(Sop);
            else if (Sop.type == 'img') DcmLoader(Sop.Image, this);
        });
    }

    reload() {
        this.loadImgBySop(this.Sop);
    }

    refleshScrollBar() {
        var element = this;
        if (element.tags.NumberOfFrames && element.tags.NumberOfFrames > 0 && element.framesNumber != undefined && element.framesNumber != null) {
            element.ScrollBar.setTotal(parseInt(element.tags.NumberOfFrames));
            element.ScrollBar.setIndex(parseInt(element.framesNumber));
            element.ScrollBar.reflesh();
        } else {
            var sopList = sortInstance(element.sop);
            element.ScrollBar.setTotal(sopList.length);
            element.ScrollBar.setIndex(sopList.findIndex((l) => l.InstanceNumber == element.tags.InstanceNumber));
            element.ScrollBar.reflesh();
        }
    }

    drawClosedInterval(ctx, viewport, pointArray, colorGroup = null, alphaGroup = null) {
        ctx.save();
        setMarkSetting(ctx, viewport);
        if (alphaGroup != null && alphaGroup[0]) ctx.globalAlpha = alphaGroup[0];
        if (colorGroup != null && colorGroup[0]) ctx.strokeStyle = ctx.fillStyle = colorGroup[0];
        ctx.moveTo(Math.ceil((pointArray[0].x)), Math.ceil((pointArray[0].y)));
        ctx.beginPath();
        for (var o = 1; o < pointArray.length; o++) {
            var x1 = Math.ceil((pointArray[o].x));
            var y1 = Math.ceil((pointArray[o].y));
            ctx.lineTo(x1, y1);
        }
        ctx.lineTo(Math.ceil((pointArray[0].x)), Math.ceil((pointArray[0].y)));
        ctx.stroke();
        ctx.closePath();

        if (alphaGroup != null && alphaGroup[1]) ctx.globalAlpha = alphaGroup[1];
        if (colorGroup != null && colorGroup[1]) ctx.strokeStyle = ctx.fillStyle = colorGroup[1];
        ctx.fill();

        ctx.restore();
    }

    drawRect(ctx, viewport, pointArray, colorGroup = null, alphaGroup = null) {
        ctx.save();
        setMarkSetting(ctx, viewport);
        if (alphaGroup != null && alphaGroup[0]) ctx.globalAlpha = alphaGroup[0];
        if (colorGroup != null && colorGroup[0]) ctx.strokeStyle = ctx.fillStyle = colorGroup[0];

        var maxX = pointArray[0].x > pointArray[1].x ? pointArray[0].x : pointArray[1].x;
        var minX = pointArray[0].x < pointArray[1].x ? pointArray[0].x : pointArray[1].x;
        var maxY = pointArray[0].y > pointArray[1].y ? pointArray[0].y : pointArray[1].y;
        var minY = pointArray[0].y < pointArray[1].y ? pointArray[0].y : pointArray[1].y;
        if (maxX == minX || maxY == minY) return;

        ctx.beginPath();
        ctx.moveTo(Math.ceil((minX)), Math.ceil((maxY)));
        ctx.lineTo(Math.ceil((maxX)), Math.ceil((maxY)));
        ctx.lineTo(Math.ceil((maxX)), Math.ceil((minY)));
        ctx.lineTo(Math.ceil((minX)), Math.ceil((minY)));
        ctx.lineTo(Math.ceil((minX)), Math.ceil((maxY)));
        ctx.stroke();
        ctx.closePath();

        if (alphaGroup != null && alphaGroup[1]) ctx.globalAlpha = alphaGroup[1];
        if (colorGroup != null && colorGroup[1]) ctx.strokeStyle = ctx.fillStyle = colorGroup[1];
        ctx.fill();

        ctx.restore();
    }

    drawLine(ctx, viewport, point1, point2, color = null, alpha = null, dash = null) {
        ctx.save();
        setMarkSetting(ctx, viewport);
        if (alpha != null) ctx.globalAlpha = alpha;
        if (color) ctx.strokeStyle = ctx.fillStyle = color;
        if (dash) ctx.setLineDash(dash);
        ctx.beginPath();
        ctx.moveTo(point1.x, point1.y); ctx.lineTo(point2.x, point2.y);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }

    drawCircle(ctx, viewport, point, size = 3, colorGroup = null, alphaGroup = null) {
        ctx.save();
        setMarkSetting(ctx, viewport);
        if (alphaGroup != null && alphaGroup[0]) ctx.globalAlpha = alphaGroup[0];
        if (colorGroup != null && colorGroup[0]) ctx.strokeStyle = ctx.fillStyle = colorGroup[0];

        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();

        if (alphaGroup != null && alphaGroup[1]) ctx.globalAlpha = alphaGroup[1];
        if (colorGroup != null && colorGroup[1]) ctx.strokeStyle = ctx.fillStyle = colorGroup[1];
        ctx.fill();
        ctx.restore();
    }

    fillCircle(ctx, viewport, point, size = 3, color = null, alpha = null) {
        ctx.save();
        setMarkSetting(ctx, viewport);
        if (alpha != null) ctx.globalAlpha = alpha;
        if (color) ctx.strokeStyle = ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }

    drawText(ctx, viewport, point, text = "", size = 12, color = "#FF0000", alpha = null, otherSettingsGroup = null) {
        ctx.save();
        setMarkSetting(ctx, viewport);
        if (alpha != null) ctx.globalAlpha = alpha;
        if (color) ctx.strokeStyle = ctx.fillStyle = color;
        if (otherSettingsGroup && otherSettingsGroup.length) {
            for (var setting of otherSettingsGroup)
                ctx["" + Object.keys(setting)[0]] = "" + Object.values(setting)[0]
        }

        ctx.translate(point.x, point.y);
        ctx.scale(this.HorizontalFlip == true ? -1 : 1, this.VerticalFlip == true ? -1 : 1);
        if (!isNaN(this.scale) && this.scale < 1) size /= this.scale;
        ctx.beginPath();
        ctx.font = "" + (size) + "px Arial";
        ctx.fillText("" + text, 0, 0);
        ctx.closePath();
        ctx.restore();
    }
}

function GetViewport(num) {
    if (!num) {
        if (num === 0) {
            return ViewPortList[0];
        }
        return ViewPortList[viewportNumber];
    }
    return ViewPortList[num];
}

function SetAllViewport(key, value) {
    if (!key) return;
    for (var i = 0; i < Viewport_Total; i++) {
        GetViewport(i)[key] = value;
    }
}

function GetViewportMark(num) {
    if (!num) {
        if (num === 0) {
            return getByid("MarkCanvas" + (0 - 0));
        }
        return getByid("MarkCanvas" + (viewportNumber - 0));
    }
    return getByid("MarkCanvas" + (num - 0));
}

function renderPixelData2Cnavas(image, pixelData, canvas, info = {}) {
    var ctx = canvas.getContext("2d");
    var imgData = ctx.createImageData(image.width, image.height);
    //預先填充不透明度為255
    new Uint32Array(imgData.data.buffer).fill(0xFF000000);

    var windowCenter = info.windowCenter ? info.windowCenter : image.windowCenter;
    var windowWidth = info.windowWidth ? info.windowWidth : image.windowWidth;
    var high = windowCenter + (windowWidth / 2);
    var low = windowCenter - (windowWidth / 2);
    var intercept = image.intercept;
    if (CheckNull(intercept)) intercept = 0;
    var slope = image.slope;
    if (CheckNull(slope)) slope = 1;

    //未最佳化之版本
    /*if (image.color == true) {
        for (var i = imgData.data.length; i >=0 ; i -= 4) {
            imgData.data[i + 0] = parseInt(((pixelData[i] * slope - low + intercept) / (high - low)) * 255);
            imgData.data[i + 1] = parseInt(((pixelData[i + 1] * slope - low + intercept) / (high - low)) * 255);
            imgData.data[i + 2] = parseInt(((pixelData[i + 2] * slope - low + intercept) / (high - low)) * 255);
            imgData.data[i + 3] = 255;
        }
    } else {
        for (var i = imgData.data.length, j = imgData.data.length/4; i>=0 ; i -= 4, j--) {
            imgData.data[i + 0] = imgData.data[i + 1] = imgData.data[i + 2] = parseInt(((pixelData[j] * slope - low + intercept) / (high - low)) * 255);
            imgData.data[i + 3] = 255;
        }
    }*/
    const multiplication = 255 / ((high - low)) * slope;
    const addition = (- low + intercept) / (high - low) * 255;
    const data = imgData.data;
    if (image.color == true) {
        if (("" + image.PhotometricInterpretation).includes("YBR") || ("" + image.PhotometricInterpretation).includes("RGB")) {
            for (var i = 0, j = 0; i < data.length; i += 4, j += 3) {
                data[i + 0] = pixelData[j] * multiplication + addition;
                data[i + 1] = pixelData[j + 1] * multiplication + addition;
                data[i + 2] = pixelData[j + 2] * multiplication + addition;
            }
        } else {
            for (var i = 0; i < data.length; i += 4) {
                data[i + 0] = pixelData[i] * multiplication + addition;
                data[i + 1] = pixelData[i + 1] * multiplication + addition;
                data[i + 2] = pixelData[i + 2] * multiplication + addition;
            }
        }
    } else {
        for (var i = 0, j = 0; i < data.length; i += 4, j++) {
            data[i + 0] = data[i + 1] = data[i + 2] = pixelData[j] * multiplication + addition;
        }
    }
    ctx.putImageData(imgData, 0, 0);
    var shouldReDraw = false;
    ctx.save();
    /*if (CheckNull(viewport.transform.imageOrientationX) == false && CheckNull(viewport.transform.imageOrientationY) == false && CheckNull(viewport.transform.imageOrientationZ) == false) {
        ctx.setTransform(new DOMMatrix(
            [viewport.transform.imageOrientationX, -viewport.transform.imageOrientationX2, 0, viewport.transform.imagePositionX * viewport.transform.PixelSpacingX,
            -viewport.transform.imageOrientationY, viewport.transform.imageOrientationY2, 0, viewport.transform.imagePositionY * viewport.transform.PixelSpacingY,
            viewport.transform.imageOrientationZ, viewport.transform.imageOrientationZ2, 0, viewport.transform.imagePositionZ,
                0, 0, 0, 1
            ]
        ));
        shouldReDraw = true;
    }*/

    var invert = ((image.invert != true && info.invert == true) || (image.invert == true && info.invert == false));
    if (Object.keys(info).length === 0) invert = image.invert;
    if (invert == true) shouldReDraw = ctx.filter = "invert()";

    if (info.HorizontalFlip == true || info.VerticalFlip == true) {
        ctx.transform(
            info.HorizontalFlip ? -1 : 1, 0, // set the direction of x axis
            0, info.VerticalFlip ? -1 : 1,   // set the direction of y axis
            (info.HorizontalFlip ? image.width : 0), // set the x origin
            (info.VerticalFlip ? image.height : 0)   // set the y origin
        );
        shouldReDraw = true;
    }

    if (shouldReDraw != false) ctx.drawImage(cloneCanvas(canvas), 0, 0);

    ctx.restore();
}

//function refleshCanvas(DicomCanvas, image, viewport, pixelData) {
function refleshCanvas(viewport) {
    var canvas = viewport.canvas;
    var image = viewport.content.image, pixelData;
    if (!viewport.Sop) return;
    if (viewport.Sop.type == 'frame') pixelData = viewport.content.image.getPixelData(viewport.framesNumber);
    else if (viewport.Sop.type == 'sop') pixelData = viewport.content.image.getPixelData();
    else if (viewport.Sop.type == 'img') pixelData = viewport.content.image.getPixelData();
    if (!image) return;
    if (canvas.width != image.width) canvas.width = image.width;
    if (canvas.height != image.height) canvas.height = image.height
    renderPixelData2Cnavas(image, pixelData, canvas, viewport);
    refleshGUI();
}

/*
if (viewport.type == 'img') {
        var windowCenter = viewport.windowCenter ? viewport.windowCenter : image.windowCenter;
        var windowWidth = viewport.windowWidth ? viewport.windowWidth : image.windowWidth;
        var high = windowCenter + (windowWidth / 2);
        var low = windowCenter - (windowWidth / 2);
        const multiplication = 255 / ((high - low)) * 1;
        const addition = (- low + 0) / (high - low) * 255;
        const data = imgData.data;
        for (var i = data.length - 4; i >= 0; i -= 4) {
            data[i + 0] = parseInt(pixelData[i] * multiplication + addition);
            data[i + 1] = parseInt(pixelData[i + 1] * multiplication + addition);
            data[i + 2] = parseInt(pixelData[i + 2] * multiplication + addition);
        }
        ctx.putImageData(imgData, 0, 0);
        refleshGUI();
        return;
    }
*/

function cloneCanvas(canvas) {
    var newCanvas = document.createElement('canvas');
    newCanvas.width = canvas.width, newCanvas.height = canvas.height;
    newCanvas.getContext('2d').drawImage(canvas, 0, 0);
    return newCanvas;
}