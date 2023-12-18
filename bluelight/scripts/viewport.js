class QRLv {
    constructor(data) {
        if (data.constructor.name == 'DataSet') {
            this.study = data.string('x0020000d');
            this.series = data.string('x0020000e');
            this.sop = data.string('x00080018');
        }
    }
}
let Patient;

onloadFunction.push2First(
    function () {
        leftLayout = new LeftLayout();
        Patient = new BlueLightPatient();
        //PatientMark = new BlueLightPatientMark();
    }
);

/*class BlueLightPatientMark {
    constructor() { }
}*/
class BlueLightPatient {
    constructor() {
        this.Study = [];
        this.StudyAmount = 0;
    }

    getNextSopByQRLevelsAndInstanceNumber(QRLevel, InstanceNumber, invert = false) {
        var SopList = this.Study[QRLevel.study].Series[QRLevel.series].Sop;

        SopList = SortArrayByElem(SopList, "InstanceNumber");
        var index = SopList.findIndex((S) => S.InstanceNumber == InstanceNumber);
        if (invert == false) {
            if (index >= SopList.length - 1) return SopList[0];
            else return SopList[index + 1];
        } else {
            if (index <= 0) return SopList[SopList.length - 1];
            else return SopList[index - 1];
        }
    }

    getNextFrameByQRLevelsAndFrameNumber(QRLevel, index, invert = false) {
        var SopList = this.Study[QRLevel.study].Series[QRLevel.series].Sop;
        var FramesList = this.Study[QRLevel.study].Series[QRLevel.series].Sop[QRLevel.sop].frames;

        if (SopList.length == 1 && FramesList.length > 1) {
            if (invert == false) {
                if (index >= FramesList.length - 1) return 0;
                else return index + 1;
            } else {
                if (index <= 0) return FramesList.length - 1;
                else return index - 1;
            }
        }

        SopList = SortArrayByElem(SopList, "InstanceNumber");
        var index = SopList.findIndex((S) => S.InstanceNumber == InstanceNumber);
        if (invert == false) {
            if (index >= SopList.length - 1) return SopList[0]
            else return SopList[index + 1];
        } else {
            if (index <= 0) return SopList[SopList.length - 1];
            else return SopList[index - 1];
        }
    }

    getSopByQRLevels(QRLevel) {
        return this.Study[QRLevel.study].Series[QRLevel.series].Sop[QRLevel.sop];
    }

    getFirstSopByQRLevels(QRLevel) {
        return SortArrayByElem(this.Study[QRLevel.study].Series[QRLevel.series].Sop, "InstanceNumber")[0];
    }

    findStudy(study) {
        if (study == undefined) study = GetViewport().study;
        if (this.Study[study]) return this.Study[study]
        else return null;
    }

    findSeries(series) {//atient.Study[i].Series[j].SopAmount
        if (series == undefined) series = GetViewport().series;
        for (var studyObj of this.Study) {
            if (studyObj.Series[series]) return studyObj.Series[series];
        }
        return null;
    }

    findSop(sop) {
        if (sop == undefined) sop = GetViewport().sop;
        for (var studyObj of this.Study) {
            for (var seriesObj of studyObj.Series) {
                if (seriesObj.Sop[sop]) return seriesObj.Sop[sop];
            }
        }
        return null;
    }

    findSeriesBySop(sop) {
        if (sop == undefined) sop = GetViewport().sop;
        for (var studyObj of this.Study) {
            for (var seriesObj of studyObj.Series) {
                if (seriesObj.Sop[sop]) return seriesObj;
            }
        }
        return null;
    }

    getSopAmountBySeries(series){
        if (series == undefined) series = GetViewport().series;
        for (var studyObj of this.Study) {
            if (studyObj.Series[series]) return studyObj.Series.SopAmount;
        }
        return null;
    }
}

function loadUID(DICOM_obj) {
    var study = DICOM_obj.study, series = DICOM_obj.series, sop = DICOM_obj.sop;
    var instance = DICOM_obj.instance, imageId = DICOM_obj.imageId, patientId = DICOM_obj.patientId, image = DICOM_obj.image, pixelData = DICOM_obj.pixelData;
    var frames = DICOM_obj.frames;
    var pdf = DICOM_obj.pdf;
    var Hierarchy = 0;
    var NumberOfStudy = -1;
    for (var i = 0; i < Patient.StudyAmount; i++) {
        if (Patient.Study[i].StudyUID == study)
            NumberOfStudy = i;
    }
    if (NumberOfStudy == -1) {
        var Study = {};
        Study.StudyUID = study;
        Study.PatientId = patientId;
        Study.SeriesAmount = 1;
        Study.Series = [];
        var Series = {};
        Series.SeriesUID = series;
        Series.SopAmount = 1;
        Series.Sop = [];
        var Sop = {};
        Sop.InstanceNumber = instance;
        Sop.SopUID = sop;
        Sop.imageId = imageId;
        Sop.image = image;
        Sop.pixelData = pixelData;
        Sop.pdf = pdf;
        Sop.frames = frames;
        getPatientbyImageID[imageId] = Sop;
        Series.Sop.push(Sop); Series.Sop[Sop.SopUID] = Sop;
        Study.Series.push(Series); Study.Series[Series.SeriesUID] = Series;
        Patient.Study.push(Study); Patient.Study[Study.StudyUID] = Study;
        Patient.StudyAmount += 1;
    } else {
        Hierarchy = 1;
        var isSeries = -1;
        for (var i = 0; i < Patient.Study[NumberOfStudy].SeriesAmount; i++) {
            if (Patient.Study[NumberOfStudy].Series[i].SeriesUID == series)
                isSeries = i;
        }
        if (isSeries == -1) {
            var Series = {};
            Series.SeriesUID = series;
            Series.SopAmount = 1;
            Series.Sop = [];
            var Sop = {};
            Sop.InstanceNumber = instance;
            Sop.SopUID = sop;
            Sop.imageId = imageId;
            Sop.image = image;
            Sop.pixelData = pixelData;
            Sop.pdf = pdf;
            Sop.frames = frames;
            getPatientbyImageID[imageId] = Sop;
            Series.Sop.push(Sop); Series.Sop[Sop.SopUID] = Sop;
            Patient.Study[NumberOfStudy].Series.push(Series); Patient.Study[NumberOfStudy].Series[Series.SeriesUID] = Series;
            Patient.Study[NumberOfStudy].SeriesAmount += 1;
        } else {
            Hierarchy = 2;
            var isSop = -1;
            for (var i = 0; i < Patient.Study[NumberOfStudy].Series[isSeries].SopAmount; i++) {
                if (Patient.Study[NumberOfStudy].Series[isSeries].Sop[i].SopUID == sop)
                    isSop = i;
            }
            if (isSop == -1) {
                var Sop = {};
                Sop.InstanceNumber = instance;
                Sop.SopUID = sop;
                Sop.imageId = imageId;
                Sop.image = image;
                Sop.pixelData = pixelData;
                Sop.pdf = pdf;
                Sop.frames = frames;
                Patient.Study[NumberOfStudy].Series[isSeries].Sop.push(Sop); Patient.Study[NumberOfStudy].Series[isSeries].Sop[Sop.SopUID] = Sop;
                Patient.Study[NumberOfStudy].Series[isSeries].SopAmount += 1;
                getPatientbyImageID[imageId] = Sop;
            } else {
                //  console.log("重複載入");
                Hierarchy = -1;
            }
        }
    }
    return Hierarchy;
}

class BlueLightViewPort {
    constructor(index, init = true) {
        if (init) this.initViewport(index);
    }

    initViewport(index) {
        var div = document.createElement("DIV");
        div.id = "MyDicomDiv" + index;
        div.viewportNum = index;
        div.className = "MyDicomDiv";
        document.getElementsByClassName("container")[0].appendChild(div);
        this.div = div;
        this.index = index;
        this.div.obj = this;
        this.QRLevel = "series";
        //this.dcm = null;
        this.initViewportOption(div, index);
        this.initLeftRule(div, index);
        this.initDownRule(div, index);
        this.initLabelWC(div, index);
        this.initLabelLT(div, index);
        this.initLabelRT(div, index);
        this.initLabelRB(div, index);
        this.initLabelXY(div, index);
        this.initScrollBar(div, index);
    }

    initViewportOption(div, index) {
        div.openHorizontalFlip = false;
        div.openVerticalFlip = false;
        div.openMark = true;
        div.openPlay = false;
        div.openInvert = false;

        div.enable = true;
        div.lockRender = false;
        //div.openDisplayMarkup = false;
        div.DicomTagsList = [];
        this.initViewportCanvas(div, index);
    }
    get enable() { return this.div.enable };
    get lockRender() { return this.div.lockRender };
    set enable(v) { this.div.enable = v };
    set lockRender(v) { this.div.lockRender = v };

    get study() { return this.div.study };
    get series() { return this.div.series };
    get sop() { return this.div.sop };
    get InstanceNumber() { return this.div.InstanceNumber };
    get framesNumber() { return this.div.framesNumber };
    get imageId() { return this.div.imageId };

    set study(v) { this.div.study = v };
    set series(v) { this.div.series = v };
    set sop(v) { this.div.sop = v };
    set InstanceNumber(v) { this.div.InstanceNumber = v };
    set framesNumber(v) { this.div.framesNumber = v };
    set imageId(v) { this.div.imageId = v };

    initViewportCanvas(div, index) {
        //一般的Canvas
        var dicmCanvas = document.createElement("CANVAS");
        dicmCanvas.className = "DicomCanvas";
        div.appendChild(dicmCanvas);
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
        div.appendChild(MarkCanvas);
    }

    initLeftRule(div, index) {
        var leftRule = document.createElement("CANVAS");
        leftRule.className = "leftRule";
        leftRule.style = "z-index:30;position:absolute;left:110px;";
        leftRule.height = 500;
        leftRule.width = 10;
        this.leftRule = div.leftRule = leftRule;
        div.appendChild(leftRule);
    }

    initDownRule(div, index) {
        var downRule = document.createElement("CANVAS");
        downRule.className = "downRule";
        downRule.style = "z-index:30;position:absolute;bottom:15px;left:100px;";
        downRule.height = 10;
        this.downRule = div.downRule = downRule;
        div.appendChild(downRule);
    }

    initLabelWC(div, index) {
        var labelWC = document.createElement("LABEL");
        labelWC.className = "labelWC innerLabel";
        labelWC.style = "position:absolute;left:115px;bottom:30px;color: white;z-index: 10;-webkit-user-select: none; ";
        this.labelWC = div.labelWC = labelWC;
        div.appendChild(labelWC);
    }
    initLabelLT(div, index) {
        var labelLT = document.createElement("LABEL");
        labelLT.className = "labelLT innerLabel";
        labelLT.style = "position:absolute;left:115px;top:10px;color: white;z-index: 10;-webkit-user-select: none; ";
        this.labelLT = div.labelLT = labelLT;
        div.appendChild(labelLT);
    }
    initLabelRT(div, index) {
        var labelRT = document.createElement("LABEL");
        labelRT.className = "labelRT innerLabel";
        labelRT.style = "position:absolute;right:20px;top:10px;color: white;z-index: 10;-webkit-user-select: none;text-align:right;";
        this.labelRT = div.labelRT = labelRT;
        div.appendChild(labelRT);
    }
    initLabelRB(div, index) {
        var labelRB = document.createElement("LABEL");
        labelRB.className = "labelRB innerLabel";
        labelRB.style = "position:absolute;right:20px;bottom:20px;color: white;z-index: 10;-webkit-user-select: none;text-align:right;";
        this.labelRB = div.labelRB = labelRB;
        div.appendChild(labelRB);
    }
    initLabelXY(div, index) {
        var labelXY = document.createElement("LABEL");
        labelXY.className = "labelXY innerLabel";
        labelXY.style = "position:absolute;left:115px;bottom:10px;color: white;z-index: 10;-webkit-user-select: none;";
        labelXY.innerText = "X: " + 0 + " Y: " + 0;
        this.labelXY = div.labelXY = labelXY;
        div.appendChild(labelXY);
    }
    initScrollBar(div, index) {
        div.ScrollBar = new ScrollBar(div);//增加右側卷軸
    }

    get QRLevels() {
        return {
            study: this.study,
            series: this.series,
            sop: this.sop
        };
    }
    nextFrame(invert = false) {
        if (this.study == undefined) return;
        if (this.QRLevel == "series") {
            var Sop = Patient.getNextSopByQRLevelsAndInstanceNumber(this.QRLevels, this.InstanceNumber, invert);
            if (Sop != undefined) loadAndViewImage(Sop.imageId, this.index);
        } else if (this.QRLevel == "frames") {
            var framsNumber = Patient.getNextFrameByQRLevelsAndFrameNumber(this.QRLevels, this.framesNumber, invert);
            if (framsNumber != undefined) loadAndViewImage(this.imageId, this.index, framsNumber);
        }
    }

    reloadImg() {
        if (this.study == undefined) return;
        var Sop = Patient.getSopByQRLevels(this.QRLevels);
        if (Sop.pdf) displayPDF(Sop.pdf);
        else loadAndViewImage(Sop.imageId, this.index);
    }

    reloadFirstImg() {
        if (this.study == undefined) return;
        var Sop = Patient.getSopByQRLevels(this.QRLevels);
        if (Sop.pdf) displayPDF(Sop.pdf);
        else loadAndViewImage(Patient.getFirstSopByQRLevels(this.QRLevels).imageId, this.index);
    }

    loadFirstImgBySeries(series) {
        var Series = Patient.findSeries(series);
        var Sop = Series.Sop[0];
        if (Sop.pdf) displayPDF(Sop.pdf);
        else loadAndViewImage(Sop.imageId, this.index);
    }
}

function GetViewport(num) {
    if (!num) {
        if (num === 0) {
            return getByid("MyDicomDiv" + (0 + 0));
        }
        return getByid("MyDicomDiv" + (viewportNumber + 0));
    }
    return getByid("MyDicomDiv" + (num + 0));
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