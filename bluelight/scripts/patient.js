//裝DICOM階層樣式表等資訊的物件

class QRLv {
    constructor(data) {
        if (data.constructor.name == 'DataSet') {
            this.study = data.string(Tag.StudyInstanceUID);
            this.series = data.string(Tag.SeriesInstanceUID);
            this.sop = data.string(Tag.SOPInstanceUID);
            this.frames = data.intString(Tag.NumberOfFrames) > 1 ? data.intString(Tag.NumberOfFrames) : null;
        }
    }
}
let ImageManager;

onloadFunction.push2First(
    function () {
        leftLayout = new LeftLayout();
        ImageManager = new BlueLightImageManager();
    }
);

let Tag = {};
onloadFunction.push2First(
    function () {
        var tags = Object.keys(TAG_DICT);
        for (var tag of tags) {
            Tag[TAG_DICT[tag].name] = ('x' + tag.replace('(', '').replace(',', '').replace(')', '')).toLowerCase();
        }
    }
);

let SOPClassUID = {};
onloadFunction.push2First(
    function () {
        //SOPClassUID.SegmentationStorage = "1.2.840.10008.5.1.4.1.1.66.4";
        //SOPClassUID.EncapsulatedPDFStorage = "1.2.840.10008.5.1.4.1.1.104.1";
        SOPClassUID.ComputedRadiographyImageStorage = "1.2.840.10008.5.1.4.1.1.1";
        SOPClassUID.DigitalX_RayImageStorage_ForPresentation = "1.2.840.10008.5.1.4.1.1.1.1";
        SOPClassUID.DigitalX_RayImageStorage_ForProcessing = "1.2.840.10008.5.1.4.1.1.1.1.1";
        SOPClassUID.DigitalMammographyX_RayImageStorage_ForPresentation = "1.2.840.10008.5.1.4.1.1.1.2";
        SOPClassUID.DigitalMammographyX_RayImageStorage_ForProcessing = "1.2.840.10008.5.1.4.1.1.1.2.1";
        SOPClassUID.DigitalIntra_OralX_RayImageStorage_ForPresentation = "1.2.840.10008.5.1.4.1.1.1.3";
        SOPClassUID.DigitalIntra_OralX_RayImageStorage_ForProcessing = "1.2.840.10008.5.1.4.1.1.1.3.1";
        SOPClassUID.CTImageStorage = "1.2.840.10008.5.1.4.1.1.2";
        SOPClassUID.EnhancedCTImageStorage = "1.2.840.10008.5.1.4.1.1.2.1";
        SOPClassUID.LegacyConvertedEnhancedCTImageStorage = "1.2.840.10008.5.1.4.1.1.2.2";
        SOPClassUID.UltrasoundMulti_frameImageStorage = "1.2.840.10008.5.1.4.1.1.3.1";
        SOPClassUID.MRImageStorage = "1.2.840.10008.5.1.4.1.1.4";
        SOPClassUID.EnhancedMRImageStorage = "1.2.840.10008.5.1.4.1.1.4.1";
        SOPClassUID.MRSpectroscopyStorage = "1.2.840.10008.5.1.4.1.1.4.2";
        SOPClassUID.EnhancedMRColorImageStorage = "1.2.840.10008.5.1.4.1.1.4.3";
        SOPClassUID.LegacyConvertedEnhancedMRImageStorage = "1.2.840.10008.5.1.4.1.1.4.4";
        SOPClassUID.UltrasoundImageStorage = "1.2.840.10008.5.1.4.1.1.6.1";
        SOPClassUID.EnhancedUSVolumeStorage = "1.2.840.10008.5.1.4.1.1.6.2";
        SOPClassUID.SecondaryCaptureImageStorage = "1.2.840.10008.5.1.4.1.1.7";
        SOPClassUID.Multi_frameSingleBitSecondaryCaptureImageStorage = "1.2.840.10008.5.1.4.1.1.7.1";
        SOPClassUID.Multi_frameGrayscaleByteSecondaryCaptureImageStorage = "1.2.840.10008.5.1.4.1.1.7.2";
        SOPClassUID.Multi_frameGrayscaleWordSecondaryCaptureImageStorage = "1.2.840.10008.5.1.4.1.1.7.3";
        SOPClassUID.Multi_frameTrueColorSecondaryCaptureImageStorage = "1.2.840.10008.5.1.4.1.1.7.4";
        SOPClassUID._12_leadECGWaveformStorage = "1.2.840.10008.5.1.4.1.1.9.1.1";
        SOPClassUID.GeneralECGWaveformStorage = "1.2.840.10008.5.1.4.1.1.9.1.2";
        SOPClassUID.AmbulatoryECGWaveformStorage = "1.2.840.10008.5.1.4.1.1.9.1.3";
        SOPClassUID.HemodynamicWaveformStorage = "1.2.840.10008.5.1.4.1.1.9.2.1";
        SOPClassUID.CardiacElectrophysiologyWaveformStorage = "1.2.840.10008.5.1.4.1.1.9.3.1";
        SOPClassUID.BasicVoiceAudioWaveformStorage = "1.2.840.10008.5.1.4.1.1.9.4.1";
        SOPClassUID.GeneralAudioWaveformStorage = "1.2.840.10008.5.1.4.1.1.9.4.2";
        SOPClassUID.ArterialPulseWaveformStorage = "1.2.840.10008.5.1.4.1.1.9.5.1";
        SOPClassUID.RespiratoryWaveformStorage = "1.2.840.10008.5.1.4.1.1.9.6.1";
        SOPClassUID.GrayscaleSoftcopyPresentationStateStorage = "1.2.840.10008.5.1.4.1.1.11.1";
        SOPClassUID.ColorSoftcopyPresentationStateStorage = "1.2.840.10008.5.1.4.1.1.11.2";
        SOPClassUID.Pseudo_ColorSoftcopyPresentationStateStorage = "1.2.840.10008.5.1.4.1.1.11.3";
        SOPClassUID.BlendingSoftcopyPresentationStateStorage = "1.2.840.10008.5.1.4.1.1.11.4";
        SOPClassUID.XA_XRFGrayscaleSoftcopyPresentationStateStorage = "1.2.840.10008.5.1.4.1.1.11.5";
        SOPClassUID.X_RayAngiographicImageStorage = "1.2.840.10008.5.1.4.1.1.12.1";
        SOPClassUID.EnhancedXAImageStorage = "1.2.840.10008.5.1.4.1.1.12.1.1";
        SOPClassUID.X_RayRadiofluoroscopicImageStorage = "1.2.840.10008.5.1.4.1.1.12.2";
        SOPClassUID.EnhancedXRFImageStorage = "1.2.840.10008.5.1.4.1.1.12.2.1";
        SOPClassUID.X_Ray3DAngiographicImageStorage = "1.2.840.10008.5.1.4.1.1.13.1.1";
        SOPClassUID.X_Ray3DCraniofacialImageStorage = "1.2.840.10008.5.1.4.1.1.13.1.2";
        SOPClassUID.BreastTomosynthesisImageStorage = "1.2.840.10008.5.1.4.1.1.13.1.3";
        SOPClassUID.IntravascularOpticalCoherenceTomographyImageStorage_ForPresentation = "1.2.840.10008.5.1.4.1.1.14.1";
        SOPClassUID.IntravascularOpticalCoherenceTomographyImageStorage_ForProcessing = "1.2.840.10008.5.1.4.1.1.14.2";
        SOPClassUID.NuclearMedicineImageStorage = "1.2.840.10008.5.1.4.1.1.20";
        SOPClassUID.RawDataStorage = "1.2.840.10008.5.1.4.1.1.66";
        SOPClassUID.SpatialRegistrationStorage = "1.2.840.10008.5.1.4.1.1.66.1";
        SOPClassUID.SpatialFiducialsStorage = "1.2.840.10008.5.1.4.1.1.66.2";
        SOPClassUID.DeformableSpatialRegistrationStorage = "1.2.840.10008.5.1.4.1.1.66.3";
        SOPClassUID.SegmentationStorage = "1.2.840.10008.5.1.4.1.1.66.4";
        SOPClassUID.SurfaceSegmentationStorage = "1.2.840.10008.5.1.4.1.1.66.5";
        SOPClassUID.RealWorldValueMappingStorage = "1.2.840.10008.5.1.4.1.1.67";
        SOPClassUID.SurfaceScanMeshStorage = "1.2.840.10008.5.1.4.1.1.68.1";
        SOPClassUID.SurfaceScanPointCloudStorage = "1.2.840.10008.5.1.4.1.1.68.2";
        SOPClassUID.VLEndoscopicImageStorage = "1.2.840.10008.5.1.4.1.1.77.1.1";
        SOPClassUID.VideoEndoscopicImageStorage = "1.2.840.10008.5.1.4.1.1.77.1.1.1";
        SOPClassUID.VLMicroscopicImageStorage = "1.2.840.10008.5.1.4.1.1.77.1.2";
        SOPClassUID.VideoMicroscopicImageStorage = "1.2.840.10008.5.1.4.1.1.77.1.2.1";
        SOPClassUID.VLSlide_CoordinatesMicroscopicImageStorage = "1.2.840.10008.5.1.4.1.1.77.1.3";
        SOPClassUID.VLPhotographicImageStorage = "1.2.840.10008.5.1.4.1.1.77.1.4";
        SOPClassUID.VideoPhotographicImageStorage = "1.2.840.10008.5.1.4.1.1.77.1.4.1";
        SOPClassUID.OphthalmicPhotography8BitImageStorage = "1.2.840.10008.5.1.4.1.1.77.1.5.1";
        SOPClassUID.OphthalmicPhotography16BitImageStorage = "1.2.840.10008.5.1.4.1.1.77.1.5.2";
        SOPClassUID.StereometricRelationshipStorage = "1.2.840.10008.5.1.4.1.1.77.1.5.3";
        SOPClassUID.OphthalmicTomographyImageStorage = "1.2.840.10008.5.1.4.1.1.77.1.5.4";
        SOPClassUID.VLWholeSlideMicroscopyImageStorage = "1.2.840.10008.5.1.4.1.1.77.1.6";
        SOPClassUID.LensometryMeasurementsStorage = "1.2.840.10008.5.1.4.1.1.78.1";
        SOPClassUID.AutorefractionMeasurementsStorage = "1.2.840.10008.5.1.4.1.1.78.2";
        SOPClassUID.KeratometryMeasurementsStorage = "1.2.840.10008.5.1.4.1.1.78.3";
        SOPClassUID.SubjectiveRefractionMeasurementsStorage = "1.2.840.10008.5.1.4.1.1.78.4";
        SOPClassUID.VisualAcuityMeasurementsStorage = "1.2.840.10008.5.1.4.1.1.78.5";
        SOPClassUID.SpectaclePrescriptionReportStorage = "1.2.840.10008.5.1.4.1.1.78.6";
        SOPClassUID.OphthalmicAxialMeasurementsStorage = "1.2.840.10008.5.1.4.1.1.78.7";
        SOPClassUID.IntraocularLensCalculationsStorage = "1.2.840.10008.5.1.4.1.1.78.8";
        SOPClassUID.MacularGridThicknessandVolumeReport = "1.2.840.10008.5.1.4.1.1.79.1";
        SOPClassUID.OphthalmicVisualFieldStaticPerimetryMeasurementsStorage = "1.2.840.10008.5.1.4.1.1.80.1";
        SOPClassUID.OphthalmicThicknessMapStorage = "1.2.840.10008.5.1.4.1.1.81.1";
        SOPClassUID.CornealTopographyMapStorage = "1.2.840.10008.5.1.4.1.1.82.1";
        SOPClassUID.BasicTextSR = "1.2.840.10008.5.1.4.1.1.88.11";
        SOPClassUID.EnhancedSR = "1.2.840.10008.5.1.4.1.1.88.22";
        SOPClassUID.ComprehensiveSR = "1.2.840.10008.5.1.4.1.1.88.33";
        SOPClassUID.Comprehensive3DSR = "1.2.840.10008.5.1.4.1.1.88.34";
        SOPClassUID.ProcedureLog = "1.2.840.10008.5.1.4.1.1.88.40";
        SOPClassUID.MammographyCADSR = "1.2.840.10008.5.1.4.1.1.88.50";
        SOPClassUID.KeyObjectSelection = "1.2.840.10008.5.1.4.1.1.88.59";
        SOPClassUID.ChestCADSR = "1.2.840.10008.5.1.4.1.1.88.65";
        SOPClassUID.X_RayRadiationDoseSR = "1.2.840.10008.5.1.4.1.1.88.67";
        SOPClassUID.ColonCADSR = "1.2.840.10008.5.1.4.1.1.88.69";
        SOPClassUID.ImplantationPlanSRDocumentStorage = "1.2.840.10008.5.1.4.1.1.88.70";
        SOPClassUID.EncapsulatedPDFStorage = "1.2.840.10008.5.1.4.1.1.104.1";
        SOPClassUID.EncapsulatedCDAStorage = "1.2.840.10008.5.1.4.1.1.104.2";
        SOPClassUID.PositronEmissionTomographyImageStorage = "1.2.840.10008.5.1.4.1.1.128";
        SOPClassUID.EnhancedPETImageStorage = "1.2.840.10008.5.1.4.1.1.130";
        SOPClassUID.LegacyConvertedEnhancedPETImageStorage = "1.2.840.10008.5.1.4.1.1.128.1";
        SOPClassUID.BasicStructuredDisplayStorage = "1.2.840.10008.5.1.4.1.1.131";
        SOPClassUID.RTImageStorage = "1.2.840.10008.5.1.4.1.1.481.1";
        SOPClassUID.RTDoseStorage = "1.2.840.10008.5.1.4.1.1.481.2";
        SOPClassUID.RTStructureSetStorage = "1.2.840.10008.5.1.4.1.1.481.3";
        SOPClassUID.RTBeamsTreatmentRecordStorage = "1.2.840.10008.5.1.4.1.1.481.4";
        SOPClassUID.RTPlanStorage = "1.2.840.10008.5.1.4.1.1.481.5";
        SOPClassUID.RTBrachyTreatmentRecordStorage = "1.2.840.10008.5.1.4.1.1.481.6";
        SOPClassUID.RTTreatmentSummaryRecordStorage = "1.2.840.10008.5.1.4.1.1.481.7";
        SOPClassUID.RTIonPlanStorage = "1.2.840.10008.5.1.4.1.1.481.8";
        SOPClassUID.RTIonBeamsTreatmentRecordStorage = "1.2.840.10008.5.1.4.1.1.481.9";
        SOPClassUID.RTBeamsDeliveryInstructionStorage = "1.2.840.10008.5.1.4.34.7";
        SOPClassUID.GenericImplantTemplateStorage = "1.2.840.10008.5.1.4.43.1";
        SOPClassUID.ImplantAssemblyTemplateStorage = "1.2.840.10008.5.1.4.44.1";
        SOPClassUID.ImplantTemplateGroupStorage = "1.2.840.10008.5.1.4.45.1";
    }
);

class BlueLightImageManager {
    constructor() {
        this.Study = [];
        this.preLoadSops = [];
        this.NumOfPreLoadSops = 0;
        this.StudyMap = {};
        this.SeriesMap = {};
        this.SopMap = {};
    }

    loadPreLoadSops() {
        var preLoadSeries = splitArrayByElem(this.preLoadSops, "SeriesInstanceUID");
        this.preLoadSops = [];

        for (var series in preLoadSeries) {
            var preLoadSops = preLoadSeries[series];
            var preLoadSops = SortArrayByElem(preLoadSops, "Index");

            var LoadImgSop = null;
            for (var sop of preLoadSops) {
                var QRLevel = new QRLv(sop.dataSet);

                if (!QRLevel.frames && !leftLayout.findSeries(sop.dataSet.string(Tag.SeriesInstanceUID))) {
                    leftLayout.setImg2Left(QRLevel, sop.dataSet.string(Tag.PatientID));
                    if (sop.image.imageDataLoaded == false && sop.image.loadImageData) sop.image.loadImageData();
                    leftLayout.appendCanvasBySeries(sop.dataSet.string(Tag.SeriesInstanceUID), sop.image, sop.image.getPixelData());
                    LoadImgSop = sop.Sop;
                }
                else if (QRLevel.frames && !leftLayout.findSop(sop.dataSet.string(Tag.SOPInstanceUID))) {
                    leftLayout.setImg2Left(QRLevel, sop.dataSet.string(Tag.PatientID));
                    if (sop.image.imageDataLoaded == false && sop.image.loadImageData) sop.image.loadImageData();
                    leftLayout.appendCanvasBySop(sop.dataSet.string(Tag.SOPInstanceUID), sop.image, sop.image.getPixelData());
                    LoadImgSop = sop.Sop;
                }
                leftLayout.refleshMarkWithSeries(sop.dataSet.string(Tag.SeriesInstanceUID));
            }
            if (LoadImgSop) {
                //requestAnimationFrame(() => {
                resetViewport();
                GetViewport().loadImgBySop(LoadImgSop);
                //});
            }
        }
    }

    find(objs, uid) {
        for (var obj of objs) {
            if (obj[obj.Instance] == uid) return obj;
        }
    }

    findStudy(uid) {
        for (var obj of this.Study) {
            if (obj[obj.Instance] == uid) return obj;
        }
    }

    findSeries(uid) {
        for (var study of this.Study) {
            for (var obj of study.Series) {
                if (obj[obj.Instance] == uid) return obj;
            }
        }
    }

    findSop(uid) {
        for (var study of this.Study) {
            for (var series of study.Series) {
                for (var obj of series.Sop) {
                    if (obj[obj.Instance] == uid) return obj;
                }
            }
        }
    }

    getSopByQRLevels(QRLevel) {
        for (var study of this.Study) {
            if (QRLevel.study != study.StudyInstanceUID) continue;
            for (var series of study.Series) {
                if (QRLevel.series != series.SeriesInstanceUID) continue;
                for (var sop of series.Sop) {
                    if (QRLevel.sop == sop.SOPInstanceUID) return sop;
                }
            }
        }
        //return this.Study[QRLevel.study].Series[QRLevel.series].Sop[QRLevel.sop];
    }

    getNextSopByQRLevelsAndInstanceNumberAndKO(QRLevel, InstanceNumber, invert = false) {
        var SopList = this.findSeries(QRLevel.series).Sop;

        SopList = SortArrayByElem(SopList, "InstanceNumber");

        // 包含了KO的判斷
        SopList = SopList.filter(function (S) {
            var containKO = PatientMark.filter(M => S.SOPInstanceUID == M.sop && M.type == "KO");
            return containKO.length != 0;
        });

        var index = SopList.findIndex((S) => S.InstanceNumber == InstanceNumber);
        if (invert == false) {
            if (index >= SopList.length - 1) return SopList[0];
            else return SopList[index + 1];
        } else {
            if (index <= 0) return SopList[SopList.length - 1];
            else return SopList[index - 1];
        }
    }

    getNextSopByQRLevelsAndInstanceNumber(QRLevel, InstanceNumber, invert = false) {
        var SopList = this.findSeries(QRLevel.series).Sop; //this.Study[QRLevel.study].Series[QRLevel.series].Sop;

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

    pushStudy(imageObj) {
        var obj = this.StudyMap[imageObj.StudyInstanceUID || imageObj.data.string(Tag.StudyInstanceUID)];//this.find(this.Study, imageObj.StudyInstanceUID || imageObj.data.string(Tag.StudyInstanceUID));
        if (obj) {
            return this.pushSeries(imageObj, obj.Series, obj);
        } else {
            var Study = {};
            Study.StudyInstanceUID = imageObj.StudyInstanceUID || imageObj.data.string(Tag.StudyInstanceUID);
            Study.Instance = "StudyInstanceUID";
            Study.Series = [];
            this.StudyMap[Study.StudyInstanceUID] = Study;
            this.Study.push(Study);
            return this.pushSeries(imageObj, Study.Series, Study);
        }
    }

    pushSeries(imageObj, series, parent) {
        var obj = this.SeriesMap[imageObj.SeriesInstanceUID || imageObj.data.string(Tag.SeriesInstanceUID)];//this.find(series, imageObj.SeriesInstanceUID || imageObj.data.string(Tag.SeriesInstanceUID));
        if (obj) {
            return this.pushSop(imageObj, obj.Sop, obj);
        } else {
            var Seris = {};
            Seris.SeriesInstanceUID = imageObj.SeriesInstanceUID || imageObj.data.string(Tag.SeriesInstanceUID);
            Seris.Instance = "SeriesInstanceUID";
            Seris.Sop = [];
            Seris.parent = parent;
            series.push(Seris);
            this.SeriesMap[Seris.SeriesInstanceUID] = Seris;
            return this.pushSop(imageObj, Seris.Sop, Seris);
        }
    }

    pushSop(imageObj, sop, parent) {
        var obj = this.SopMap[imageObj.SOPInstanceUID || imageObj.data.string(Tag.SOPInstanceUID)];//this.find(sop, imageObj.SOPInstanceUID || imageObj.data.string(Tag.SOPInstanceUID));
        if (obj) {
            console.log("repeat");
        } else {
            var Sop = {};
            Sop.SOPInstanceUID = imageObj.SOPInstanceUID || imageObj.data.string(Tag.SOPInstanceUID);
            Sop.Instance = "SOPInstanceUID";
            Sop.Image = imageObj;
            Sop.InstanceNumber = Sop.Image.InstanceNumber;
            Sop.pdf = Sop.Image.pdf;
            Sop.sr = Sop.Image.sr;
            Sop.dataSet = imageObj.data;
            Sop.parent = parent;
            this.SopMap[Sop.SOPInstanceUID] = Sop;
            sop.push(Sop);
            sop = SortArrayByElem(sop, "InstanceNumber");

            for (var s = 0; s < sop.length - 1; s++) {
                if (sop[s].InstanceNumber == sop[s + 1].InstanceNumber) {
                    for (var sop_ of sop) {
                        sop_.Image.haveSameInstanceNumber = true;
                    }
                }
            }
            return Sop;
        }
    }
}