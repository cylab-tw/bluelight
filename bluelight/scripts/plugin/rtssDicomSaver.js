getByid("writeRTSS").addEventListener('click', () => {
    getByid("saveRTSS").onclick = function () {
        let buffer = getRtssDicomInstance();

        let a = document.createElement("a");
        let file = new Blob([buffer], {
            type: "application/dicom"
        });

        a.href = window.URL.createObjectURL(file);
        a.download = "RTSS.dcm";
        a.click();
    };
});

function getRtssDicomInstance() {
    let viewport = GetViewport();

    let curInstance = viewport.Sop;
    let curSeriesUid = viewport.series;
    let generatedSopInstanceUid = CreateUid("sop");
    let generatedSeriesUid = CreateUid("series");
    let viewportInstanceTags = viewport.tags;

    let dataset = {
        _meta: {
            _vrMap: {},
            FileMetaInformationVersion: new Uint8Array([0, 1]).buffer,
            MediaStorageSOPClassUID: "1.2.840.10008.5.1.4.1.1.481.3",
            TransferSyntaxUID: "1.2.840.10008.1.2.1",
            ImplementationClassUID: "2.16.886.119.102568.9",
            ImplementationVersionName: "BlueLight"
        },
        DirectoryRecordType: "IMAGE",
        SOPClassUID: "1.2.840.10008.5.1.4.1.1.481.3", // rtss class
        SOPInstanceUID: generatedSopInstanceUid,
        StudyDate: viewportInstanceTags.StudyDate,
        StudyTime: viewportInstanceTags.StudyTime,
        AccessionNumber: viewportInstanceTags.AccessionNumber,
        Modality: "RTSTRUCT",
        Manufacturer: viewportInstanceTags.Manufacturer,
        InstitutionName: viewportInstanceTags.InstitutionName,
        InstitutionAddress: viewportInstanceTags.InstitutionAddress,
        ReferringPhysicianName: viewportInstanceTags.ReferringPhysicianName,
        StationName: viewportInstanceTags.StationName,
        StudyDescription: viewportInstanceTags.StudyDescription,
        SeriesDescription: viewportInstanceTags.SeriesDescription,
        PatientName: viewportInstanceTags.PatientName,
        PatientID: viewportInstanceTags.PatientID,
        StudyInstanceUID: viewportInstanceTags.StudyInstanceUID,
        SeriesInstanceUID: generatedSeriesUid,
        StudyID: viewportInstanceTags.StudyID,
        SeriesNumber: viewportInstanceTags.SeriesNumber + "01",
        RequestingPhysician: viewportInstanceTags.RequestingPhysician,
        StructureSetLabel: getByid("textStructureSetLabel").value,
        StructureSetName: getByid("textStructureSetName").value,
        StructureSetDescription: getByid("textStructureSetDescription").value,
        StructureSetDate: viewportInstanceTags.StudyDate,
        StructureSetTime: viewportInstanceTags.StudyTime,
        ReferencedStudySequence: [],
        ReferencedFrameOfReferenceSequence: {
            RTReferencedStudySequence:
                [
                    {
                        ReferencedSOPClassUID: "1.2.840.10008.5.1.4.1.1.4", // 應該使用原檔案的 SOPClassUID?
                        ReferencedSOPInstanceUID: viewportInstanceTags.StudyInstanceUID,
                        RTReferencedSeriesSequence: [
                            {
                                SeriesInstanceUID: curSeriesUid,
                                ContourImageSequence: []
                            }
                        ]
                    }
                ]
        },
        StructureSetROISequence: [],
        ROIContourSequence: [],
        RTROIObservationsSequence: [
            {
                ObservationNumber: getByid("textObservationNumber").value,
                ReferencedROINumber: getByid("textReferencedROINumber").value,
                RTROIInterpretedType: getByid("textRTROIInterpretedType").value
            }
        ]
    };

    let instances = ImageManager.findSeries(viewport.series).Sop;
    for (let i = 0; i < instances.length; i++) {
        let instance = instances[i];
        let sopClassUID = instance.dataSet.string("x00080016");
        dataset.ReferencedFrameOfReferenceSequence.RTReferencedStudySequence[0].RTReferencedSeriesSequence[0].ContourImageSequence.push({
            ReferencedSOPClassUID: sopClassUID,
            ReferencedSOPInstanceUID: instance.SOPInstanceUID,
        });

        dataset.ReferencedStudySequence.push({
            ReferencedSOPClassUID: sopClassUID,
            ReferencedSOPInstanceUID: instance.SOPInstanceUID,
        });
    }

    for (let y = 0; y < PatientMark.length; y++) {
        let curMark = PatientMark[y];
        let roiNumber = 1;
        if (curMark.series === viewport.series && curMark.type === "RTSS") {
            let roiContourSeqObj = {
                ROIDisplayColor: undefined,
                ContourSequence: [],
                ReferencedROINumber: roiNumber
            }

            let roiSeqObj = {
                ROINumber: 1,
                ReferencedFrameOfReferenceUID: "0",
                ROIName: curMark.showName,
                ROIGenerationAlgorithm: "MANUAL"
            }
            dataset.StructureSetROISequence.push(roiSeqObj);

            let contourSeqObj = {
                ContourImageSequence: [
                    {
                        ReferencedSOPClassUID: undefined,
                        ReferencedSOPInstanceUID: undefined
                    }
                ],
                ContourGeometricType: "CLOSED_PLANAR",
                ContourSlabThickness: 5,
                NumberOfContourPoints: undefined,
                ContourNumber: undefined,
                ContourData: undefined
            };

            let tempMark = curMark.pointArray;
            let markXy = [];
            for (let x = 0; x < tempMark.length; x++) {
                let tempX = parseFloat(tempMark[x].x);
                let tempY = parseFloat(tempMark[x].y);

                markXy.push(tempX);
                markXy.push(tempY);
                markXy.push(curMark.imagePositionZ);
            }

            contourSeqObj.ContourData = markXy;
            contourSeqObj.NumberOfContourPoints = tempMark.length;
            contourSeqObj.ContourNumber = y + 1;

            contourSeqObj.ContourImageSequence[0].ReferencedSOPClassUID = curInstance.dataSet.string("x00080016");
            contourSeqObj.ContourImageSequence[0].ReferencedSOPInstanceUID = curMark.sop;

            let contourColor = getColorFromRGB(curMark.color);
            roiContourSeqObj.ROIDisplayColor = "" + contourColor[0] + "\\" + contourColor[1] + "\\" + contourColor[2];
            roiContourSeqObj.ContourSequence.push(contourSeqObj);

            dataset.ROIContourSequence.push(roiContourSeqObj);

            roiNumber++;
        }
    }

    dataset._meta["MediaStorageSOPInstanceUID"] = generatedSopInstanceUid;

    const denaturalizedMetaHeader = dcmjs.data.DicomMetaDictionary.denaturalizeDataset(dataset._meta);
    const dicomDict = new dcmjs.data.DicomDict(denaturalizedMetaHeader);
    dicomDict.dict = dcmjs.data.DicomMetaDictionary.denaturalizeDataset(dataset);

    let dicomBuffer = dicomDict.write({ fragmentMultiframe: false });

    return dicomBuffer;
}