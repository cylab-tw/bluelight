//裝DICOM階層樣式表等資訊的物件
//var Patient = {};
//
var getPatientbyImageID = {};

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

    getSopAmountBySeries(series) {
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
