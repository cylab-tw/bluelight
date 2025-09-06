getByid("writeGSPS").addEventListener('click', () => {
    getByid("saveGSPS").onclick = function () {
        let buffer = getGspsDicomInstance();

        let a = document.createElement("a");
        let file = new Blob([buffer], {
            type: "application/dicom"
        });
    
        a.href = window.URL.createObjectURL(file);
        a.download = "GSPS.dcm";
        a.click();
    };
});

function getFormattedDateTime() {
    const now = new Date();

    // Format YYYYMMDD
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const formattedDate = `${year}${month}${day}`;

    // Format HHMMSS.FFFFFF
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    const fractionalSecond = String(now.getUTCMilliseconds() * 1000).padStart(6, '0');

    // UTC Offset (+/-ZZXX)
    const timezoneOffset = now.getTimezoneOffset();
    const offsetSign = timezoneOffset <= 0 ? '+' : '-';
    const offsetHours = String(Math.abs(Math.floor(timezoneOffset / 60))).padStart(2, '0');
    const offsetMinutes = String(Math.abs(timezoneOffset % 60)).padStart(2, '0');
    const offset = `${offsetSign}${offsetHours}${offsetMinutes}`;

    // Combine date and time
    const formattedTime = `${hours}${minutes}${seconds}.${fractionalSecond}${offset}`;
    return { date: formattedDate, time: formattedTime };
}

function getGspsDicomInstance() {
    let instanceUid = GetViewport().sop;
    let generatedSopInstanceUid = CreateUid("sop");
    let generatedSeriesUid = CreateUid("series");

    let dicomParserDataset = GetViewport().Sop.dataSet;

    let { date: curDate, time: curTime } = getFormattedDateTime();
    let dataset = {
        _meta: {
            _vrMap: {},
            FileMetaInformationVersion: new Uint8Array([0, 1]).buffer,
            MediaStorageSOPClassUID: "1.2.840.10008.5.1.4.1.1.11.1",
            TransferSyntaxUID: "1.2.840.10008.1.2.1",
            ImplementationClassUID: "2.16.886.119.102568.9",
            ImplementationVersionName: "BlueLight"
        },
        SpecificCharacterSet: "ISO_IR 192",
        SOPClassUID: "1.2.840.10008.5.1.4.1.1.11.1",
        SOPInstanceUID: generatedSopInstanceUid,
        StudyDate: dicomParserDataset.string("x00080020"),
        StudyTime: dicomParserDataset.string("x00080030"),
        ContentDate: dicomParserDataset.string("x00080023") || dicomParserDataset.string("x00080020"),
        ContentTime: dicomParserDataset.string("x00080033") || dicomParserDataset.string("x00080030"),
        AccessionNumber: dicomParserDataset.string("x00080050"),
        Modality: "PR",
        StudyDescription: dicomParserDataset.string("x00081030"),
        SeriesDescription: "BlueLight GSPS",
        ReferencedSeriesSequence: [
            {
                ReferencedImageSequence: {
                    ReferencedSOPClassUID: dicomParserDataset.string("x00080016"),
                    ReferencedSOPInstanceUID: instanceUid
                },
                SeriesInstanceUID: dicomParserDataset.string("x0020000e")
            }
        ],
        PatientName: GetViewport().tags.PatientName,
        PatientID: GetViewport().tags.PatientID,
        StudyInstanceUID: dicomParserDataset.string("x0020000d"),
        SeriesInstanceUID: generatedSeriesUid,
        GraphicAnnotationSequence: [
            {
                GraphicLayer: "DRAW",
                TextObjectSequence: {},
                GraphicObjectSequence: undefined
            }
        ],
        GraphicLayerSequence: {
            GraphicLayer: "DRAW",
            GraphicLayerOrder: "0",
            GraphicLayerDescription: "Drawings",
            GraphicLayerRecommendedDisplayCIELabValue: [
                655,
                33153,
                32896
            ]
        },
        ContentLabel: "GSPS",
        ContentDescription: "Description",
        PresentationCreationDate: curDate,
        PresentationCreationTime: curTime,
        ContentCreatorName: "BlueLight",
    };

    for (let i = 0 ; i < PatientMark.length ; i++) {
        let curMark = PatientMark[i];
        if (curMark.sop === GetViewport().sop) {
            if (curMark.type === "POLYLINE") {
                let graphicObject = getPolylineGraphicObject(curMark);
                dataset.GraphicAnnotationSequence[0].GraphicObjectSequence = graphicObject;
            } else if (curMark.type === "CIRCLE") {
                let graphicObject = getCircleGraphicObject(curMark);
                dataset.GraphicAnnotationSequence[0].GraphicObjectSequence = graphicObject;
            }
        }
    }
    dataset._meta["MediaStorageSOPInstanceUID"] = generatedSopInstanceUid;

    const denaturalizedMetaHeader = dcmjs.data.DicomMetaDictionary.denaturalizeDataset(dataset._meta);
    const dicomDict = new dcmjs.data.DicomDict(denaturalizedMetaHeader);
    dicomDict.dict = dcmjs.data.DicomMetaDictionary.denaturalizeDataset(dataset);

    let dicomBuffer = dicomDict.write({ fragmentMultiframe: false });

    return dicomBuffer;
}

function getPolylineGraphicObject(mark) {
    let graphicObject = {
        GraphicAnnotationUnits: "PIXEL",
        GraphicDimensions: 2,
        NumberOfGraphicPoints: undefined,
        GraphicData: undefined,
        GraphicType: undefined,
        GraphicFilled: "N",
        LineStyleSequence: {
            PatternOnColorCIELabValue: undefined,
            LineThickness: 1
        }
    };

    let tempMark = mark.pointArray;
    let markXy = [];
    for (let i = 0; i < tempMark.length ; i++) {
        let tempX = 0;
        let tempY = 0;

        if (tempMark.RotationAngle && tempMark.RotationPoint) {
            [tempX, tempY] = rotatePoint([tempMark[i].x, tempMark[i].y], tempMark.RotationAngle, tempMark.RotationPoint);
        } else {
            [tempX, tempY] = [tempMark[i].x, tempMark[i].y];
        }

        tempX = parseInt(tempX) + ".0123";
        tempY = parseInt(tempY) + ".0123";
        markXy.push(tempX, tempY);

        graphicObject.GraphicData = markXy;
        graphicObject.LineStyleSequence.PatternOnColorCIELabValue = ("" + SetGraphicColor(mark.color)).split("\\").map(v => parseInt(v));
        graphicObject.GraphicType = "POLYLINE";
        graphicObject.NumberOfGraphicPoints = (tempMark.length + tempMark.length) / 2;
    }

    return graphicObject;
}

function getCircleGraphicObject(mark) {
    let graphicObject = {
        GraphicAnnotationUnits: "PIXEL",
        GraphicDimensions: 2,
        NumberOfGraphicPoints: undefined,
        GraphicData: undefined,
        GraphicType: undefined,
        GraphicFilled: "N",
        LineStyleSequence: {
            PatternOnColorCIELabValue: undefined,
            LineThickness: 1
        }
    };

    let tempMark = mark.pointArray;
    let markXy = [];
    for (let i = 0; i < tempMark.length ; i++) {
        let tempX = 0;
        let tempY = 0;

        if (tempMark.RotationAngle && tempMark.RotationPoint) {
            [tempX, tempY] = rotatePoint([tempMark[i].x, tempMark[i].y], tempMark.RotationAngle, tempMark.RotationPoint);
        } else {
            [tempX, tempY] = [tempMark[i].x, tempMark[i].y];
        }

        tempX = parseInt(tempX) + ".0123";
        tempY = parseInt(tempY) + ".0123";
        markXy.push(tempX, tempY);

        graphicObject.GraphicData = markXy;
        graphicObject.LineStyleSequence.PatternOnColorCIELabValue =  ("" + SetGraphicColor(mark.color)).split("\\").map(v => parseInt(v));
        graphicObject.GraphicType = "CIRCLE";
        graphicObject.NumberOfGraphicPoints = (tempMark.length + tempMark.length) / 2;
    }

    return graphicObject;
}