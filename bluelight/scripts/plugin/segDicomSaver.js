getByid("writeSEG").addEventListener("click", function () {
    getByid("saveSEG").onclick = function () {
        let buffer = getSegDicomInstance();
        if (!buffer) return;

        let a = document.createElement("a");
        let file = new Blob([buffer], {
            type: "application/dicom"
        });

        a.href = window.URL.createObjectURL(file);
        a.download = "SEG.dcm";
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

function getSegDicomInstance() {
    if (!isHaveSeg()) return undefined;

    let generatedSopInstanceUid = CreateUid("sop");
    let generatedSeriesUid = CreateUid("series");

    let dicomParserDataset = GetViewport().Sop.dataSet;

    let { date: newSeriesDate, time: newSeriesTime } = getFormattedDateTime();

    let dataset = {
        _meta: {
            _vrMap: {},
            FileMetaInformationVersion: new Uint8Array([0, 1]).buffer,
            MediaStorageSOPClassUID: "1.2.840.10008.5.1.4.1.1.66.4",
            TransferSyntaxUID: "1.2.840.10008.1.2.1",
            ImplementationClassUID: "2.16.886.119.102568.9",
            ImplementationVersionName: "BlueLight"
        },
        SpecificCharacterSet: "ISO_IR 192",
        ImageType: dicomParserDataset.string("x00080008")?.split("\\"),
        SOPClassUID: "1.2.840.10008.5.1.4.1.1.66.4",
        SOPInstanceUID: generatedSopInstanceUid,
        StudyDate: dicomParserDataset.string("x00080020"),
        StudyTime: dicomParserDataset.string("x00080030"),
        SeriesDate: newSeriesDate,
        SeriesTime: newSeriesTime,
        ContentDate: newSeriesDate,
        ContentTime: newSeriesTime,
        AccessionNumber: dicomParserDataset.string("x00080050"),
        Modality: "SEG",
        Manufacturer: "BlueLight",
        StudyDescription: dicomParserDataset.string("x00081030"),
        SeriesDescription: dicomParserDataset.string("x0008103e") || "BlueLight Segmentation",
        ManufacturerModelName: getByid('SegManufacturerModelName').value,
        ReferencedSeriesSequence: [
            {
                ReferencedInstanceSequence: [],
                SeriesInstanceUID: dicomParserDataset.string("x0020000e")
            }
        ],
        PatientName: GetViewport().tags.PatientName,
        PatientID: GetViewport().tags.PatientID,
        PatientBirthDate: GetViewport().tags.PatientBirthDate,
        PatientSex: GetViewport().tags.PatientSex,
        PatientAge: GetViewport().tags.PatientAge,
        BodyPartExamined: dicomParserDataset.string("x00180015"),
        StudyInstanceUID: dicomParserDataset.string("x0020000d"),
        SeriesInstanceUID: generatedSeriesUid,
        SeriesNumber: GetViewport().seriesNumber + "03",
        FrameOfReferenceUID: dicomParserDataset.string("x00200052"),
        DimensionOrganizationSequence: {
            DimensionOrganizationUID: "2.25.521890920689168201386532254542531936629"
        },
        DimensionIndexSequence: [
            {
                DimensionOrganizationUID: "2.25.521890920689168201386532254542531936629",
                DimensionIndexPointer: 0x0062000b,
                FunctionalGroupPointer: 0x0062000a,
                DimensionDescriptionLabel: "ReferencedSegmentNumber",
            },
            {
                DimensionOrganizationUID: "2.25.521890920689168201386532254542531936629",
                DimensionIndexPointer: 0x00200032,
                FunctionalGroupPointer: 0x00209113,
                DimensionDescriptionLabel: "ImagePositionPatient",
            }
        ],
        SamplesPerPixel: 1,
        PhotometricInterpretation: "MONOCHROME2",
        NumberOfFrames: undefined,
        Rows: dicomParserDataset.int16("x00280010"),
        Columns: dicomParserDataset.int16("x00280011"),
        BitsAllocated: 1,
        BitsStored: 1,
        HighBit: 0,
        PixelRepresentation: dicomParserDataset.string("x00280103"),
        LossyImageCompression: dicomParserDataset.string("x00282110"),
        SegmentationType: "BINARY",
        SegmentSequence: {
            SegmentedPropertyCategoryCodeSequence: {
                CodeValue: "T-D0050",
                CodingSchemeDesignator: "SRT",
                CodeMeaning: "Tissue"
            },
            SegmentNumber: undefined,
            SegmentLabel: getByid('SegSegmentLabel').value,
            SegmentAlgorithmType: "SEMIAUTOMATIC",
            SegmentAlgorithmName: "Slicer Prototype",
            RecommendedDisplayCIELabValue: [
                34885,
                53485,
                50171
            ],
            SegmentedPropertyTypeCodeSequence: {
                CodeValue: "T-D0050",
                CodingSchemeDesignator: "SRT",
                CodeMeaning: "Tissue"
            }
        },
        ContentLabel: "BlueLight",
        ContentDescription: "BlueLight",
        SharedFunctionalGroupsSequence: {
            PlaneOrientationSequence: {
                ImageOrientationPatient: [
                    1,
                    0,
                    0,
                    0,
                    1,
                    0
                ]
            },
            PixelMeasuresSequence: {
                SliceThickness: dicomParserDataset.string("x00180050"),
                SpacingBetweenSlices: dicomParserDataset.string("x00180088"),
                PixelSpacing: dicomParserDataset.string("x00280030"),
            }
        },
        PerFrameFunctionalGroupsSequence: [],
        PixelData: undefined
    };

    dataset._meta["MediaStorageSOPInstanceUID"] = generatedSopInstanceUid;

    let sopList = ImageManager.findSeries(GetViewport().series).Sop;
    for (let s = 0; s < sopList.length; s++) {
        dataset.ReferencedSeriesSequence[0].ReferencedInstanceSequence.push({
            ReferencedSOPClassUID: sopList[s].dataSet.string("x00080016"),
            ReferencedSOPInstanceUID: sopList[s].SOPInstanceUID
        });
    }

    let markXy = [];
    let segCount = 0;
    for (let p = 0; p < PatientMark.length; p++) {
        let curMark = PatientMark[p];
        if (curMark.series === GetViewport().series && curMark.type === "SEG") {
            segCount++;
            markXy = concatenateUint8ClampedArrays(markXy, curMark.pixelData);

            dataset.PerFrameFunctionalGroupsSequence.push(getPerFrameFunctionGroup(curMark, segCount));
        }
    }
    dataset.NumberOfFrames = segCount;
    dataset.SegmentSequence.SegmentNumber = segCount;
    dataset.PixelData = markXy.buffer;

    const denaturalizedMetaHeader = dcmjs.data.DicomMetaDictionary.denaturalizeDataset(dataset._meta);
    const dicomDict = new dcmjs.data.DicomDict(denaturalizedMetaHeader);
    dicomDict.dict = dcmjs.data.DicomMetaDictionary.denaturalizeDataset(dataset);

    let dicomBuffer = dicomDict.write({ fragmentMultiframe: false });

    return dicomBuffer;
}

function isHaveSeg() {
    let segCount = 0;
    for (let p = 0; p < PatientMark.length; p++) {
        if (PatientMark[p].series === GetViewport().series && PatientMark[p].type === "SEG") segCount++;
    }

    return segCount > 0;
}

function getPerFrameFunctionGroup(mark, segCount) {
    let instance = ImageManager.findSop(mark.sop);
    let instanceDataset = instance.dataSet;

    let perFrameFunctionObj = {
        DerivationImageSequence: {
            SourceImageSequence: {
                ReferencedSOPClassUID: instanceDataset.string("x00080016"),
                ReferencedSOPInstanceUID: instance.SOPInstanceUID,
                PurposeOfReferenceCodeSequence: {
                    CodeValue: "121322",
                    CodingSchemeDesignator: "DCM",
                    CodeMeaning: "Source image for image processing operation"
                }
            },
            DerivationCodeSequence: {
                CodeValue: "113076",
                CodingSchemeDesignator: "DCM",
                CodeMeaning: "Segmentation"
            }
        },
        FrameContentSequence: {
            DimensionIndexValues: [
                1,
                segCount
            ]
        },
        PlanePositionSequence: {
            ImagePositionPatient: mark.ImagePositionPatient
        },
        SegmentIdentificationSequence: {
            ReferencedSegmentNumber: 1
        }
    }

    return perFrameFunctionObj;
}

function concatenateUint8ClampedArrays(...arrays) {
    const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);

    const result = new Uint8ClampedArray(totalLength);

    let offset = 0;
    for (const arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }

    return result;
}