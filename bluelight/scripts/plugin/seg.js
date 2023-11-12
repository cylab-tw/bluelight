//代表SEG標記模式為開啟狀態
var openWriteSEG = false;

function loadWriteSEG() {
    var span = document.createElement("SPAN")
    span.innerHTML =
        `<img class="img SEG" alt="writeSEG" id="writeSEG" onmouseover = "onElementOver(this);" onmouseleave = "onElementLeave();" src="../image/icon/black/seg_off.png" width="50" height="50">`;
    getByid("icon-list").appendChild(span);

    var span = document.createElement("SPAN")
    span.innerHTML =
        `<div id="SegStyleDiv" style="background-color:#30306044;">
    <font color="white">ManufacturerModelName：</font><input type="text" id="SegManufacturerModelName"
      value="ModelName" size="8" />
    <font color="white">SeriesDescription：</font><input type="text" id="SegSeriesDescription" value="Research"
      size="8" />
    <font color="white">SegmentLabel</font><input type="text" id="SegSegmentLabel" value="SegmentLabel" size="8" />
    <font color="white">Brush Size</font><input type="text" id="SegBrushSizeText" value="10" size="2" />
    &nbsp;&nbsp;<button id="overlay2seg" sytle="">OverLay to Seg</button>
  </div>`
    getByid("page-header").appendChild(span);
    getByid("SegStyleDiv").style.display = "none";
}
loadWriteSEG();


getByid("overlay2seg").onclick = function () {
    getByid("overlay2seg").style.display = "none";
    var sop = GetViewport().sop;
    //if (o3DElement) sop = o3DElement.sop;
    let index = SearchUid2Index(sop);
    if (!index) return;
    let i = index[0],
        j = index[1],
        k = index[2];
    for (var n = 0; n < PatientMark.length; n++) {
        if (PatientMark[n].series == Patient.Study[i].Series[j].SeriesUID) {
            for (var l = 0; l < Patient.Study[i].Series[j].SopAmount; l++) {
                for (var m = 0; m < PatientMark[n].mark.length; m++) {
                    if (PatientMark[n].mark[m].type == "Overlay" && PatientMark[n].sop == Patient.Study[i].Series[j].Sop[l].SopUID) {
                        let Uid = GetNowUid();
                        var dcm = {};
                        dcm.study = Uid.study;
                        dcm.series = Uid.sreies;

                        dcm.ImagePositionPatient = GetViewport().ImagePositionPatient;
                        dcm.mark = [];
                        dcm.showName = "SEG"; //"" + getByid("xmlMarkNameText").value;
                        dcm.hideName = dcm.showName;
                        dcm.mark.push({});
                        dcm.sop = Patient.Study[i].Series[j].Sop[l].SopUID;
                        var DcmMarkLength = dcm.mark.length - 1;
                        dcm.mark[DcmMarkLength].type = "SEG";
                        function jsonDeepClone(obj) {
                            return JSON.parse(JSON.stringify(obj));
                        }
                        dcm.mark[DcmMarkLength].canvas = PatientMark[n].mark[m].canvas;
                        PatientMark.push(dcm);
                        refreshMark(dcm);
                        SEG_now_choose = dcm.mark[DcmMarkLength];

                        // PatientMark.splice(PatientMark.indexOf(temp_overlay), 1);
                    }
                }
            }
        }
    }
    refreshMarkFromSop(GetNowUid().sop);
}

getByid("writeSEG").onclick = function () {
    if (this.enable == false) return;
    cancelTools();
    openWriteSEG = !openWriteSEG;
    img2darkByClass("SEG", !openWriteSEG);
    openLeftImgClick = !openWriteSEG;
    this.src = openWriteSEG == true ? '../image/icon/black/seg_on.png' : '../image/icon/black/seg_off.png';
    if (openWriteSEG == true) {
        getByid("overlay2seg").style.display = "";
        getByid('SegStyleDiv').style.display = 'flex';
        set_BL_model('writeSeg');
        openWheel = true;
        writeSeg();
    }
    else getByid('SegStyleDiv').style.display = 'none';
    displayMark();

    if (openWriteSEG == true) return;
    // else Graphic_now_choose = null;

    function download(text, name, type) {
        let a = document.createElement('a');
        let file = new Blob([text], {
            type: type
        });
        a.href = window.URL.createObjectURL(file);
        //a.style.display = '';
        a.download = name;
        a.click();
    }
    function download2(text, name, type) {
        let a = document.createElement('a');
        let file = new File([text], name + ".xml", {
            type: type
        });
        var xhr = new XMLHttpRequest();

        xhr.open('POST', ConfigLog.Xml2Dcm.Xml2DcmUrl, true);
        xhr.setRequestHeader("enctype", "multipart/form-data");
        // define new form
        var formData = new FormData();
        formData.append("files", file);
        xhr.send(formData);
        xhr.onload = function () {
            if (xhr.status == 200) {
                let data = JSON.parse(xhr.responseText);
                for (let url of data) {
                    window.open(url);
                }
            }
        }
    }
    set_SEG_context();
    if (ConfigLog.Xml2Dcm.enableXml2Dcm == true) download2(String(get_SEG_context()), "" + CreateSecurePassword(), 'text/plain');
    else download(String(get_SEG_context()), 'filename_SEG.xml', 'text/plain');
    getByid('MouseOperation').click();
}


var SEG_format =
    `<?xml version="1.0" encoding="UTF-8"?>
    <file-format>
        <meta-header xfer="1.2.840.10008.1.2.1" name="Little Endian Explicit">
            <element tag="0002,0000" vr="UL" vm="1" len="___FileMetaInformationGroupLength(len)___" name="FileMetaInformationGroupLength">___FileMetaInformationGroupLength___</element>
            <element tag="0002,0001" vr="OB" vm="1" len="2" name="FileMetaInformationVersion" binary="yes">00\\01</element>
            <element tag="0002,0002" vr="UI" vm="1" len="28" name="MediaStorageSOPClassUID">1.2.840.10008.5.1.4.1.1.66.4</element>
            <element tag="0002,0003" vr="UI" vm="1" len="___SOPInstanceUID(len)___" name="MediaStorageSOPInstanceUID">___SOPInstanceUID___</element>
            <element tag="0002,0010" vr="UI" vm="1" len="20" name="TransferSyntaxUID">1.2.840.10008.1.2.1</element>
            <element tag="0002,0012" vr="UI" vm="1" len="48" name="ImplementationClassUID">1.2.826.0.1.3680043.2.1143.107.104.103.115.3.0.1</element>
            <element tag="0002,0013" vr="SH" vm="1" len="10" name="ImplementationVersionName">BlueLight</element>
            <element tag="0002,0016" vr="AE" vm="1" len="8" name="SourceApplicationEntityTitle">gdcmconv</element>
        </meta-header>
        <data-set xfer="1.2.840.10008.1.2.1" name="Little Endian Explicit">
            <element tag="0008,0008" vr="CS" vm="2" len="___ImageType(len)___" name="ImageType">___ImageType___</element>
            <element tag="0008,0016" vr="UI" vm="1" len="28" name="SOPClassUID">1.2.840.10008.5.1.4.1.1.66.4</element>
            <element tag="0008,0018" vr="UI" vm="1" len="___SOPInstanceUID(len)___" name="SOPInstanceUID">___SOPInstanceUID___</element>
            <element tag="0008,0020" vr="DA" vm="1" len="8" name="StudyDate">___StudyDate___</element>
            <element tag="0008,0021" vr="DA" vm="1" len="8" name="SeriesDate">___SeriesDate___</element>
            <element tag="0008,0023" vr="DA" vm="1" len="8" name="ContentDate">___SeriesDate___</element>
            <element tag="0008,0030" vr="TM" vm="1" len="10" name="StudyTime">___StudyTime___</element>
            <element tag="0008,0031" vr="TM" vm="1" len="10" name="SeriesTime">___SeriesTime___</element>
            <element tag="0008,0033" vr="TM" vm="1" len="10" name="ContentTime">___SeriesTime___</element>
            <element tag="0008,0050" vr="SH" vm="1" len="___AccessionNumber(len)___" name="AccessionNumber">___AccessionNumber___</element>
            <element tag="0008,0060" vr="CS" vm="1" len="4" name="Modality">SEG</element>
            <element tag="0008,0070" vr="LO" vm="1" len="10" name="Manufacturer">bluelight</element>
            <element tag="0008,0090" vr="PN" vm="1" len="___ReferringPhysicianName(len)___" name="ReferringPhysicianName">___ReferringPhysicianName___</element>
            <element tag="0008,103e" vr="LO" vm="1" len="___SeriesDescription(len)___" name="SeriesDescription">___SeriesDescription___</element>
            <element tag="0008,1090" vr="LO" vm="1" len="___ManufacturerModelName(len)___" name="ManufacturerModelName">___ManufacturerModelName___</element>
            <sequence tag="0008,1115" vr="SQ" card="1" name="ReferencedSeriesSequence">
                <item card="2">
                    <sequence tag="0008,114a" vr="SQ" card="44" name="ReferencedInstanceSequence">
___item2___
                    </sequence>
            <element tag="0020,000e" vr="UI" vm="1" len="___ReferencedSeriesInstanceUID(len)___" name="SeriesInstanceUID">___ReferencedSeriesInstanceUID___</element>
                </item>
            </sequence>
            <element tag="0010,0010" vr="PN" vm="1" len="___PatientName(len)___" name="PatientName">___PatientName___</element>
            <element tag="0010,0020" vr="LO" vm="1" len="___PatientID(len)___" name="PatientID">___PatientID___</element>
            <element tag="0010,0030" vr="DA" vm="0" len="___PatientBirthDate(len)___" name="PatientBirthDate">___PatientBirthDate___</element>
            <element tag="0010,0040" vr="CS" vm="0" len="___PatientSex(len)___" name="PatientSex">___PatientSex___</element>
            <element tag="0010,1010" vr="AS" vm="0" len="___PatientAge(len)___" name="PatientAge">___PatientAge___</element>
            <element tag="0018,1000" vr="LO" vm="1" len="4" name="DeviceSerialNumber">1799</element>
            <element tag="0018,1020" vr="LO" vm="1" len="4" name="SoftwareVersions">1.0</element>
            <element tag="0018,9004" vr="CS" vm="1" len="8" name="ContentQualification">RESEARCH</element> 
            <element tag="0020,000d" vr="UI" vm="1" len="___StudyInstanceUID(len)___" name="StudyInstanceUID">___StudyInstanceUID___</element>
            <element tag="0020,000e" vr="UI" vm="1" len="___SeriesInstanceUID(len)___" name="SeriesInstanceUID">___SeriesInstanceUID___</element>
            <element tag="0020,0010" vr="SH" vm="1" len="___StudyID(len)___" name="StudyID">___StudyID___</element>
            <element tag="0020,0011" vr="IS" vm="1" len="___SeriesNumber(len)___" name="SeriesNumber">___SeriesNumber___</element>
            <element tag="0020,0013" vr="IS" vm="1" len="0" name="InstanceNumber"></element>
            <element tag="0020,0052" vr="UI" vm="1" len="___FrameOfReferenceUID(len)___" name="FrameOfReferenceUID">___FrameOfReferenceUID___</element>
            <element tag="0020,1040" vr="LO" vm="0" len="0" name="PositionReferenceIndicator"></element>
            <sequence tag="0020,9221" vr="SQ" card="1" name="DimensionOrganizationSequence">
                <item card="1">
                    <element tag="0020,9164" vr="UI" vm="1" len="44" name="DimensionOrganizationUID">2.25.521890920689168201386532254542531936629</element>
                </item>
            </sequence>
            <sequence tag="0020,9222" vr="SQ" card="2" name="DimensionIndexSequence">
                <item card="4">
                    <element tag="0020,9164" vr="UI" vm="1" len="44" name="DimensionOrganizationUID">2.25.521890920689168201386532254542531936629</element>
                    <element tag="0020,9165" vr="AT" vm="1" len="4" name="DimensionIndexPointer">(000b,0062)</element>
                    <element tag="0020,9167" vr="AT" vm="1" len="4" name="FunctionalGroupPointer">(000a,0062)</element>
                    <element tag="0020,9421" vr="LO" vm="1" len="24" name="DimensionDescriptionLabel">ReferencedSegmentNumber</element>
                </item>
                <item card="4">
                    <element tag="0020,9164" vr="UI" vm="1" len="44" name="DimensionOrganizationUID">2.25.521890920689168201386532254542531936629</element>
                    <element tag="0020,9165" vr="AT" vm="1" len="4" name="DimensionIndexPointer">(0032,0020)</element>
                    <element tag="0020,9167" vr="AT" vm="1" len="4" name="FunctionalGroupPointer">(9113,0020)</element>
                    <element tag="0020,9421" vr="LO" vm="1" len="20" name="DimensionDescriptionLabel">ImagePositionPatient</element>
                </item>
            </sequence>
            <element tag="0028,0002" vr="US" vm="1" len="2" name="SamplesPerPixel">1</element> 
            <element tag="0028,0004" vr="CS" vm="1" len="___PhotometricInterpretation(len)___" name="PhotometricInterpretation">___PhotometricInterpretation___</element>
            <element tag="0028,0008" vr="IS" vm="1" len="___NumberOfFrames(len)___" name="NumberOfFrames">___NumberOfFrames___</element> 
            <element tag="0028,0010" vr="US" vm="1" len="___Rows(len)___" name="Rows">___Rows___</element> 
            <element tag="0028,0011" vr="US" vm="1" len="___Columns(len)___" name="Columns">___Columns___</element>
            <element tag="0028,0100" vr="US" vm="1" len="___BitsAllocated(len)___" name="BitsAllocated">___BitsAllocated___</element>
            <element tag="0028,0101" vr="US" vm="1" len="___BitsStored(len)___" name="BitsStored">___BitsStored___</element>
            <element tag="0028,0102" vr="US" vm="1" len="___HighBit(len)___" name="HighBit">___HighBit___</element>
            <element tag="0028,0103" vr="US" vm="1" len="___PixelRepresentation(len)___" name="PixelRepresentation">___PixelRepresentation___</element> 
            <element tag="0062,0001" vr="CS" vm="1" len="10" name="SegmentationType">FRACTIONAL</element>
            <sequence tag="0062,0002" vr="SQ" card="1" name="SegmentSequence">
                <item card="7">
                    <sequence tag="0062,0003" vr="SQ" card="1" name="SegmentedPropertyCategoryCodeSequence">
                        <item card="3">
                            <element tag="0008,0100" vr="SH" vm="1" len="8" name="CodeValue">T-D0050</element> 
                            <element tag="0008,0102" vr="SH" vm="1" len="4" name="CodingSchemeDesignator">SRT</element>
                            <element tag="0008,0104" vr="LO" vm="1" len="6" name="CodeMeaning">Tissue</element>
                        </item>
                    </sequence>
                    <element tag="0062,0004" vr="US" vm="1" len="___SegmentNumber(len)___" name="SegmentNumber">___SegmentNumber___</element>
                    <element tag="0062,0005" vr="LO" vm="1" len="___SegmentLabel(len)___" name="SegmentLabel">___SegmentLabel___</element>
                    <element tag="0062,0008" vr="CS" vm="1" len="14" name="SegmentAlgorithmType">SEMIAUTOMATIC</element>
                    <element tag="0062,0009" vr="LO" vm="1" len="16" name="SegmentAlgorithmName">Slicer Prototype</element>
                    <element tag="0062,000d" vr="US" vm="3" len="6" name="RecommendedDisplayCIELabValue">34885\\53485\\50171</element>
                    <sequence tag="0062,000f" vr="SQ" card="1" name="SegmentedPropertyTypeCodeSequence">
                        <item card="3">
                            <element tag="0008,0100" vr="SH" vm="1" len="8" name="CodeValue">T-D0050</element>
                            <element tag="0008,0102" vr="SH" vm="1" len="4" name="CodingSchemeDesignator">SRT</element>
                            <element tag="0008,0104" vr="LO" vm="1" len="6" name="CodeMeaning">Tissue</element>
                        </item>
                    </sequence>
                </item>
            </sequence>
        <element tag="0062,000e" vr="US" vm="1" len="2" name="MaximumFractionalValue">255</element>
        <element tag="0062,0010" vr="CS" vm="1" len="12" name="SegmentationFractionalType">PROBABILITY</element>
        <element tag="0070,0080" vr="CS" vm="1" len="12" name="ContentLabel">SEGMENTATION</element>
        <element tag="0070,0081" vr="LO" vm="0" len="0" name="ContentDescription"></element>
        <element tag="0070,0084" vr="PN" vm="0" len="0" name="ContentCreatorName"></element>
        <sequence tag="5200,9229" vr="SQ" card="1" name="SharedFunctionalGroupsSequence">
        <item card="2">
            <sequence tag="0020,9116" vr="SQ" card="1" name="PlaneOrientationSequence">
                <item card="1">
                    <element tag="0020,0037" vr="DS" vm="6" len="12" name="ImageOrientationPatient">1\\0\\0\\0\\1\\0</element>
                </item>
            </sequence>
            <sequence tag="0028,9110" vr="SQ" card="1" name="PixelMeasuresSequence">
                <item card="3">
                    <element tag="0018,0050" vr="DS" vm="1" len="___SliceThickness(len)___" name="SliceThickness">___SliceThickness___</element>
                    <element tag="0018,0088" vr="DS" vm="1" len="___SpacingBetweenSlices(len)___" name="SpacingBetweenSlices">___SpacingBetweenSlices___</element>
                    <element tag="0028,0030" vr="DS" vm="2" len="___PixelSpacing(len)___" name="PixelSpacing">___PixelSpacing___</element>
                </item>
            </sequence>
        </item>
    </sequence>
    <sequence tag="5200,9230" vr="SQ" card="3" name="PerFrameFunctionalGroupsSequence">
___item4___
    </sequence>
    <element tag="7fe0,0010" vr="OB" vm="1" len="___PixelData(len)___" name="PixelData" binary="yes">___PixelData___</element>
    </data-set>
    </file-format>
    `;

var SEG_format_object_list = [];
//有沒有標記都有
var SEG_format_tail_2 = `
                    <item card="2">
                        <element tag="0008,1150" vr="UI" vm="1" len="26" name="ReferencedSOPClassUID">1.2.840.10008.5.1.4.1.1.2</element>
                        <element tag="0008,1155" vr="UI" vm="1" len="___ReferencedSOPInstanceUID(len)___" name="ReferencedSOPInstanceUID">___ReferencedSOPInstanceUID___</element>
                    </item>`
var SEG_format_tail_4 = `
    <item card="4">
    <sequence tag="0008,9124" vr="SQ" card="1" name="DerivationImageSequence">
        <item card="2">
            <sequence tag="0008,2112" vr="SQ" card="1" name="SourceImageSequence">
                <item card="3">
                    <element tag="0008,1150" vr="UI" vm="1" len="26" name="ReferencedSOPClassUID">1.2.840.10008.5.1.4.1.1.2</element>
                    <element tag="0008,1155" vr="UI" vm="1" len="___ReferencedSOPInstanceUID(len)___" name="ReferencedSOPInstanceUID">___ReferencedSOPInstanceUID___</element>
                    <sequence tag="0040,a170" vr="SQ" card="1" name="PurposeOfReferenceCodeSequence">
                        <item card="3">
                            <element tag="0008,0100" vr="SH" vm="1" len="6" name="CodeValue">121322</element>
                            <element tag="0008,0102" vr="SH" vm="1" len="4" name="CodingSchemeDesignator">DCM</element>
                            <element tag="0008,0104" vr="LO" vm="1" len="44" name="CodeMeaning">Source image for image processing operation</element>
                        </item>
                    </sequence>
                </item>
            </sequence>
            <sequence tag="0008,9215" vr="SQ" card="1" name="DerivationCodeSequence">
                <item card="3">
                    <element tag="0008,0100" vr="SH" vm="1" len="6" name="CodeValue">113076</element>
                    <element tag="0008,0102" vr="SH" vm="1" len="4" name="CodingSchemeDesignator">DCM</element>
                    <element tag="0008,0104" vr="LO" vm="1" len="12" name="CodeMeaning">Segmentation</element>
                </item>
            </sequence>
        </item>
    </sequence>
    <sequence tag="0020,9111" vr="SQ" card="1" name="FrameContentSequence">
        <item card="1">
            <element tag="0020,9157" vr="UL" vm="2" len="___DimensionIndexValues(len)___" name="DimensionIndexValues">___DimensionIndexValues___</element>
        </item>
    </sequence>
    <sequence tag="0020,9113" vr="SQ" card="1" name="PlanePositionSequence">
        <item card="1">
            <element tag="0020,0032" vr="DS" vm="3" len="___ImagePositionPatient(len)___" name="ImagePositionPatient">___ImagePositionPatient___</element>
        </item>
    </sequence>
    <sequence tag="0062,000a" vr="SQ" card="1" name="SegmentIdentificationSequence">
        <item card="1">
            <element tag="0062,000b" vr="US" vm="1" len="2" name="ReferencedSegmentNumber">1</element>
        </item>
    </sequence>
    </item>`;
var SEG_now_choose = null;
var temp_SEG_format = "";
//0062,0004
function set_SEG_context() {
    SEG_format_object_list = []
    let temp = ""
    let tail4_list = "";
    let tail2_list = "";
    let index = SearchUid2Index(GetViewport().sop);
    let i = index[0],
        j = index[1],
        k = index[2];
    temp = "" + SEG_format;

    function setTag(temp, replace, str, len) {
        str = Null2Empty(str);
        str = "" + str;
        temp = temp.replace("___" + replace + "___", "" + str);
        var length = ("" + str).length;
        if (length % 2 != 0) length++;
        if (len == true) temp = temp.replace("___" + replace + "(len)___", length);
        return temp;
    }

    function zero(num, Milliseconds) {
        if (Milliseconds) {
            if (num < 10) return "" + "00" + num;
            else if (num < 100) return "" + "0" + num;
            return "" + num;
        }
        return "" + (num < 10 ? '0' : '') + num;
    }

    var sopList = getAllSop();
    for (var s = 0; s < sopList.length; s++) {
        let tail2 = "" + SEG_format_tail_2;
        // tail2 = tail2.replace("___ReferencedSOPInstanceUID___", sopList[s]);
        tail2 = setTag(tail2, "ReferencedSOPInstanceUID", sopList[s], true);
        tail2_list += tail2;
    }
    var segCount = 0;
    for (var n = 0; n < PatientMark.length; n++) {
        for (var m = 0; m < PatientMark[n].mark.length; m++) {
            if (PatientMark[n].series == Patient.Study[i].Series[j].SeriesUID) {
                if (PatientMark[n].mark[m].type == "SEG") {
                    segCount++;
                }
            }
        }
    }
    if (segCount == 0) return;
    temp = setTag(temp, "NumberOfFrames", segCount, true);
    temp = setTag(temp, "SegmentNumber", segCount, true);
    var mark_xy = "";
    var temp_segCount = 0;
    for (var n = 0; n < PatientMark.length; n++) {
        if (PatientMark[n].series == Patient.Study[i].Series[j].SeriesUID) {
            for (var m = 0; m < PatientMark[n].mark.length; m++) {
                if (PatientMark[n].mark[m].type == "SEG") {
                    temp_segCount++;
                    var tail4 = "" + SEG_format_tail_4;
                    var tempMark = PatientMark[n].mark[m];
                    for (var o = 0; o < tempMark.pixelData.length; o += 1) {
                        if (o == 0 && temp_segCount == 1) mark_xy += "0" + tempMark.pixelData[o];
                        else mark_xy += "\\" + "0" + tempMark.pixelData[o];
                    }
                    tail4 = setTag(tail4, "ReferencedSOPInstanceUID", PatientMark[n].sop, true);
                    tail4 = setTag(tail4, "ImagePositionPatient", "" + PatientMark[n].ImagePositionPatient, true);
                    tail4 = setTag(tail4, "DimensionIndexValues", "1\\" + temp_segCount, true);
                    tail4_list += tail4;
                }
            }
        }
        var createSopUid = CreateUid("sop");
        var createSeriesUid = CreateUid("series");
        for (var c = 0; c < 5; c++) {
            temp = setTag(temp, "StudyDate", GetViewport().StudyDate, true);
            temp = setTag(temp, "StudyTime", GetViewport().StudyTime, true);
            temp = setTag(temp, "StudyInstanceUID", Patient.Study[i].StudyUID, true);
            temp = setTag(temp, "SeriesInstanceUID", createSeriesUid, true);
            temp = setTag(temp, "SOPInstanceUID", createSopUid, true);
            temp = setTag(temp, "PatientID", GetViewport().PatientID, true);
            temp = setTag(temp, "PatientName", GetViewport().PatientName, true);
            temp = setTag(temp, "ReferencedSOPInstanceUID", PatientMark[n].sop, true);
            temp = setTag(temp, "ImageType", GetViewport().ImageType, true);
            temp = setTag(temp, "ReferencedSeriesInstanceUID", Patient.Study[i].Series[j].SeriesUID, true);
            temp = setTag(temp, "AccessionNumber", GetViewport().AccessionNumber, true);

            temp = setTag(temp, "StudyID", GetViewport().StudyID, true);

            temp = setTag(temp, "PatientSex", GetViewport().PatientSex, true);
            temp = setTag(temp, "PatientBirthDate", GetViewport().PatientBirthDate, true);
            temp = setTag(temp, "PatientAge", GetViewport().PatientAge, true);
            temp = setTag(temp, "Manufacturer", GetViewport().Manufacture, true);
            temp = setTag(temp, "PhotometricInterpretation", GetViewport().PhotometricInterpretation, true);
            temp = setTag(temp, "ReferringPhysicianName", GetViewport().ReferringPhysicianName, true);
            temp = setTag(temp, "SliceThickness", GetViewport().SliceThickness, true);
            temp = setTag(temp, "SpacingBetweenSlices", GetViewport().SpacingBetweenSlices, true);

            temp = setTag(temp, "SeriesDescription", getByid('SegSeriesDescription').value, true);
            temp = setTag(temp, "SeriesNumber", "" + GetViewport().SeriesNumber + "03", true);
            temp = setTag(temp, "PixelSpacing", "" + GetViewport().PixelSpacing, true);

            temp = setTag(temp, "ImagePositionPatient", "" + GetViewport().ImagePositionPatient, true);

            function setTagByElTag(temp, replace, len) {
                for (var d = 0; d < GetViewport().DicomTagsList.length; d++) {
                    if (GetViewport().DicomTagsList[d][1] == replace) {
                        temp = ("" + temp).replace("___" + replace + "___", "" + GetViewport().DicomTagsList[d][2]);
                        var length = ("" + GetViewport().DicomTagsList[d][2]).length;
                        if (length % 2 != 0) length++;
                        if (len == true) temp = temp.replace("___" + replace + "(len)___", length);
                        return temp;
                    }
                }
                return temp;
            }
            temp = setTag(temp, "BitsAllocated", '8', true);
            temp = setTag(temp, "BitsStored", '8', true);
            temp = setTag(temp, "HighBit", '7', true);

            temp = setTagByElTag(temp, "SpacingBetweenSlices", true);
            temp = setTagByElTag(temp, "SliceThickness", true);
            temp = setTagByElTag(temp, "ImageType", true);
            temp = setTagByElTag(temp, "PatientBirthDate", true);
            temp = setTagByElTag(temp, "PatientSex", true);
            temp = setTagByElTag(temp, "PatientAge", true);
            temp = setTagByElTag(temp, "FrameOfReferenceUID", true);
            temp = setTagByElTag(temp, "PhotometricInterpretation", true);
            temp = setTagByElTag(temp, "Rows", true);
            temp = setTagByElTag(temp, "Columns", true);
            temp = setTagByElTag(temp, "PixelRepresentation", true);
            temp = setTagByElTag(temp, "LossyImageCompression", true);
            temp = setTagByElTag(temp, "PixelSpacing", true);


            temp = setTag(temp, "ManufacturerModelName", getByid('SegManufacturerModelName').value, true);
            //temp = setTag(temp, "SeriesDescription", getByid('SegSeriesDescription').value, true);
            temp = setTag(temp, "SegmentLabel", getByid('SegSegmentLabel').value, true);
            var date = new Date();
            temp = setTag(temp, "SeriesDate", "" + date.getFullYear() + zero(date.getMonth() + 1) + zero(date.getDate()), true);
            temp = setTag(temp, "SeriesTime", "" + zero(date.getHours() + 1) + zero(date.getMinutes()) + zero(date.getSeconds()) + "." + zero(date.getMilliseconds(), true));
            temp = setTag(temp, "FileMetaInformationGroupLength", "" + ((8 * 6) + 12 + (2 + 28 + 20 + 48 + 10 + 8 + createSopUid.length)), true);
        }
    }
    temp = setTag(temp, "PixelData", "" + mark_xy, true);
    temp = temp.replace("___item4___", tail4_list);
    temp = temp.replace("___item2___", tail2_list);
    SEG_format_object_list.push(temp);
}

function get_SEG_context() {
    var temp_str = "";
    for (var i = 0; i < SEG_format_object_list.length; i++) {
        temp_str += SEG_format_object_list[i];
    }
    return temp_str;
}

function Line_setSEG2PixelData(point1, point2) {
    if (!point1 || !point2) return;
    var distance = (Math.sqrt(((point1[0] - point2[0]) * (point1[0] - point2[0]) + (point1[1] - point2[1]) * (point1[1] - point2[1]))));

    var Reduce_X = point1[0] > point2[0] ? point2[0] : point1[0];
    var Reduce_Y = point1[1] > point2[1] ? point2[1] : point1[1];
    var Up_X = point1[0] < point2[0] ? point2[0] : point1[0];
    var Up_Y = point1[1] < point2[1] ? point2[1] : point1[1];
    /*for (var i = 0; i <  parseInt(distance); i++) {
        var x = parseInt(Reduce_X + ((Up_X - Reduce_X) / distance) * i);
        var y = parseInt(Reduce_Y + ((Up_Y - Reduce_Y) / distance) * i);
        setSEG2PixelData([x, y]);
    }*/
    if (point1[0] == Reduce_X && point1[1] == Reduce_Y) {
        for (var i = 0; i < parseInt(distance); i++) {
            var x = parseInt(Reduce_X + ((Up_X - Reduce_X) / distance) * i);
            var y = parseInt(Reduce_Y + ((Up_Y - Reduce_Y) / distance) * i);
            setSEG2PixelData([x, y]);
        }
    } else if (point1[0] == Up_X && point1[1] == Up_Y) {
        for (var i = 0; i < parseInt(distance); i++) {
            var x = parseInt(Up_X - ((Up_X - Reduce_X) / distance) * i);
            var y = parseInt(Up_Y - ((Up_Y - Reduce_Y) / distance) * i);
            setSEG2PixelData([x, y]);
        }
    } else if (point1[0] == Reduce_X && point1[1] == Up_Y) {
        for (var i = 0; i < parseInt(distance); i++) {
            var x = parseInt(Reduce_X + ((Up_X - Reduce_X) / distance) * i);
            var y = parseInt(Up_Y - ((Up_Y - Reduce_Y) / distance) * i);
            setSEG2PixelData([x, y]);
        }
    } else if (point1[0] == Up_X && point1[1] == Reduce_Y) {
        for (var i = 0; i < parseInt(distance); i++) {
            var x = parseInt(Up_X - ((Up_X - Reduce_X) / distance) * i);
            var y = parseInt(Reduce_Y + ((Up_Y - Reduce_Y) / distance) * i);
            setSEG2PixelData([x, y]);
        }
    }
};

function writeSeg() {
    if (BL_mode == 'writeSeg') {
        DeleteMouseEvent();
        Mousedown = function (e) {
            if (e.which == 1) MouseDownCheck = true;
            else if (e.which == 3) rightMouseDown = true;
            windowMouseX = GetmouseX(e);
            windowMouseY = GetmouseY(e);
            GetViewport().originalPointX = getCurrPoint(e)[0];
            GetViewport().originalPointY = getCurrPoint(e)[1];
            if (openWindow != true) {
                var sop = GetViewport().sop;
                var index_Seg = SearchUid2Index(sop);
                if (!index_Seg) return;
                let i_s = index_Seg[0],
                    j_s = index_Seg[1],
                    k_s = index_Seg[2];
                var break1 = false;
                for (var n_s = 0; n_s < PatientMark.length; n_s++) {
                    if (PatientMark[n_s].sop == Patient.Study[i_s].Series[j_s].Sop[k_s].SopUID) {
                        for (var m_s = 0; m_s < PatientMark[n_s].mark.length; m_s++) {
                            if (break1 == true) break;
                            if (PatientMark[n_s].mark[m_s].type == "SEG") {
                                SEG_now_choose = PatientMark[n_s].mark[m_s];
                                break1 = true;
                            }
                        }
                    }
                }
                if (break1 == false) {
                    let Uid = GetNowUid();
                    var dcm = {};
                    dcm.study = Uid.study;
                    dcm.series = Uid.sreies;

                    dcm.ImagePositionPatient = GetViewport().ImagePositionPatient;
                    dcm.mark = [];
                    dcm.showName = "SEG"; //"" + getByid("xmlMarkNameText").value;
                    dcm.hideName = dcm.showName;
                    dcm.mark.push({});
                    dcm.sop = Uid.sop;
                    var DcmMarkLength = dcm.mark.length - 1;
                    dcm.mark[DcmMarkLength].type = "SEG";
                    dcm.mark[DcmMarkLength].pixelData = new Uint8ClampedArray(GetViewport().imageWidth * GetViewport().imageHeight);
                    if (!dcm.mark[DcmMarkLength].canvas) {
                        dcm.mark[DcmMarkLength].canvas = document.createElement("CANVAS");
                        dcm.mark[DcmMarkLength].canvas.width = GetViewport().imageWidth;
                        dcm.mark[DcmMarkLength].canvas.height = GetViewport().imageHeight;
                        dcm.mark[DcmMarkLength].ctx = dcm.mark[DcmMarkLength].canvas.getContext('2d');

                        var pixelData = dcm.mark[DcmMarkLength].ctx.getImageData(0, 0, dcm.mark[DcmMarkLength].canvas.width, dcm.mark[DcmMarkLength].canvas.height);

                        for (var i = 0, j = 0; i < pixelData.data.length; i += 4, j++) {
                            if (dcm.mark[DcmMarkLength].pixelData[j] != 0) {
                                pixelData.data[i] = 0;
                                pixelData.data[i + 1] = 0;
                                pixelData.data[i + 2] = 255;
                                pixelData.data[i + 3] = 255;
                            }
                        }
                        dcm.mark[DcmMarkLength].ctx.putImageData(pixelData, 0, 0);
                    }
                    let angle2point = rotateCalculation(e);
                    PatientMark.push(dcm);
                    refreshMark(dcm);
                    SEG_now_choose = dcm.mark[DcmMarkLength];
                    setSEG2PixelData(angle2point);
                    refreshMark(dcm);
                }
                for (var i = 0; i < Viewport_Total; i++)
                    displayMark(i);
            }
        };
        var Previous_angle2point;

        Mousemove = function (e) {
            var currX = getCurrPoint(e)[0];
            var currY = getCurrPoint(e)[1];
            var labelXY = getClass('labelXY'); {
                let angle2point = rotateCalculation(e);
                labelXY[viewportNumber].innerText = "X: " + parseInt(angle2point[0]) + " Y: " + parseInt(angle2point[1]);
            }
            if (MouseDownCheck && !rightMouseDown && SEG_now_choose && openWindow != true) {
                let angle2point = rotateCalculation(e);
                if (Previous_angle2point && (Previous_angle2point[0] != angle2point[0] || Previous_angle2point[1] != angle2point[1])) {
                    setSEG2PixelData(angle2point);
                    Line_setSEG2PixelData(Previous_angle2point, angle2point);

                    let Uid = GetNowUid();
                    refreshMark(Uid.sop);
                    for (var i = 0; i < Viewport_Total; i++)
                        displayMark(i);
                }
                Previous_angle2point = angle2point;
            }
            if (!rightMouseDown && openWindow != true) {
                var rect = getByid("SegBrushSizeText").value;
                rect = parseInt(rect);
                if (isNaN(rect) || rect < 1 || rect > 1024) rect = getByid("SegBrushSizeText").value = 10;
                refreshMarkFromSop(GetNowUid().sop);
                let angle2point = rotateCalculation(e);
                var MarkCanvas = GetViewportMark();
                var segCtx = MarkCanvas.getContext("2d");
                segCtx.beginPath();
                segCtx.strokeStyle = "#FFFF00";
                segCtx.lineWidth = "3";
                segCtx.arc(angle2point[0], angle2point[1], rect, 0, 2 * Math.PI);
                segCtx.stroke();
                segCtx.closePath();
            }

        }
        Mouseup = function (e) {
            Previous_angle2point = undefined;
            var currX = getCurrPoint(e)[0];
            var currY = getCurrPoint(e)[1];
            if (openMouseTool == true && rightMouseDown == true)
                displayMark();
            MouseDownCheck = false;
            rightMouseDown = false;
            magnifierDiv.style.display = "none";

            if (openLink) {
                for (var i = 0; i < Viewport_Total; i++)
                    displayRuler(i);
            }
        }
        AddMouseEvent();
        return;
    }
}

function setSEG2PixelData(angle2point) {
    var rect = getByid("SegBrushSizeText").value;
    rect = parseInt(rect);
    if (isNaN(rect) || rect < 1 || rect > 1024) rect = getByid("SegBrushSizeText").value = 10;

    var pixelData = SEG_now_choose.ctx.getImageData(parseInt(angle2point[0]) - rect, parseInt(angle2point[1]) - rect, rect * 2, rect * 2);
    var p = 0;
    if (KeyCode_ctrl == true) {
        for (var s = -rect; s < rect; s++) {
            for (var s2 = -rect; s2 < rect; s2++) {
                if ((s * s) + (s2 * s2) < rect * rect) {
                    SEG_now_choose.pixelData[Math.floor(angle2point[1] + s) * GetViewport().imageWidth + Math.floor(angle2point[0] + s2)] = 0;
                    pixelData.data[p] = 0;
                    pixelData.data[p + 1] = 0;
                    pixelData.data[p + 2] = 0;
                    pixelData.data[p + 3] = 0;
                }
                p += 4;
            }
        }
    } else {
        for (var s = -rect; s < rect; s++) {
            for (var s2 = -rect; s2 < rect; s2++) {
                if ((s * s) + (s2 * s2) < rect * rect) {
                    SEG_now_choose.pixelData[Math.floor(angle2point[1] + s) * GetViewport().imageWidth + Math.floor(angle2point[0] + s2)] = 1;
                    pixelData.data[p] = 0;
                    pixelData.data[p + 1] = 0;
                    pixelData.data[p + 2] = 255;
                    pixelData.data[p + 3] = 255;
                }
                p += 4;
            }
        }
    }
    SEG_now_choose.ctx.putImageData(pixelData, parseInt(angle2point[0]) - rect, parseInt(angle2point[1]) - rect);
}