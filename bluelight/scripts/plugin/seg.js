//代表SEG標記模式為開啟狀態
var openWriteSEG = false;

function loadWriteSEG() {
    var span = document.createElement("SPAN")
    span.innerHTML =
        `<img class="img SEG" alt="writeSEG" id="writeSEG" onmouseover = "onElementOver(this);" onmouseleave = "onElementLeave();" src="../image/icon/black/seg_off.png" width="50" height="50">
        <img class="img SEG" alt="drawSEG" id="drawSEG" onmouseover="onElementOver(this);" onmouseleave="onElementLeave();" src="../image/icon/black/GraphicDraw.png" width="50" height="50" style="display:none;" >  
        <img class="img SEG" alt="exitSEG" id="exitSEG" onmouseover="onElementOver(this);" onmouseleave="onElementLeave();" src="../image/icon/black/exit.png" width="50" height="50" style="display:none;" >
        <img class="img SEG" alt="saveSEG" id="saveSEG" onmouseover="onElementOver(this);" onmouseleave="onElementLeave();" src="../image/icon/black/download.png" width="50" height="50" style="display:none;" >`;

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
                &nbsp;&nbsp;<button id="overlay2seg" sytle="">OverLay to Seg</button>&nbsp;&nbsp;
                <button id="RemoveSEG" onclick="DeleteSelectedSEG();" style="font-size: 14px;display:none;">Delete Selected SEG</button>
            </div>`
    getByid("page-header").appendChild(span);
    getByid("SegStyleDiv").style.display = "none";
}
loadWriteSEG();


getByid("overlay2seg").onclick = function () {
    getByid("overlay2seg").style.display = "none";

    for (var n = 0; n < PatientMark.length; n++) {
        if (PatientMark[n].type == "Overlay" && PatientMark[n].sop == GetViewport().sop) {

            var SegMark = new BlueLightMark();
            SegMark.setQRLevels(GetViewport().QRLevels);
            SegMark.type = SegMark.hideName = SegMark.showName = "SEG";
            SegMark.ImagePositionPatient = GetViewport().tags.ImagePositionPatient;

            SegMark.canvas = PatientMark[n].canvas;
            PatientMark.push(SegMark);
            refreshMark(SegMark);
            SEG_now_choose = SegMark;
            function jsonDeepClone(obj) { return JSON.parse(JSON.stringify(obj)); }
            // PatientMark.splice(PatientMark.indexOf(temp_overlay), 1);
        }

    }
    refreshMarkFromSop(GetViewport().sop);
}

getByid("drawSEG").onclick = function () {
    set_BL_model('writeSeg');
    writeSeg();
    drawBorder(getByid("drawSEG"));
}
BorderList_Icon.push("drawSEG");

getByid("writeSEG").onclick = function () {
    if (this.enable == false) return;
    cancelTools();
    openWriteSEG = true;
    img2darkByClass("SEG", !openWriteSEG);
    openLeftImgClick = !openWriteSEG;
    if (openWriteSEG == true) {
        getByid("overlay2seg").style.display = "";
        getByid('SegStyleDiv').style.display = 'flex';
        set_BL_model('writeSeg');
        openWheel = true;
        writeSeg();
    }

    this.src = openWriteSEG == true ? '../image/icon/black/seg_on.png' : '../image/icon/black/seg_off.png';
    this.style.display = openWriteSEG != true ? "" : "none";
    getByid("exitSEG").style.display = openWriteSEG == true ? "" : "none";
    getByid("saveSEG").style.display = openWriteSEG == true ? "" : "none";
    getByid("drawSEG").style.display = openWriteSEG == true ? "" : "none";

    getByid("exitSEG").onclick = function () {
        openWriteSEG = false;
        img2darkByClass("SEG", !openWriteSEG);
        getByid('SegStyleDiv').style.display = 'none';
        getByid("writeSEG").style.display = openWriteSEG != true ? "" : "none";
        getByid("exitSEG").style.display = openWriteSEG == true ? "" : "none";
        getByid("saveSEG").style.display = openWriteSEG == true ? "" : "none";
        getByid("drawSEG").style.display = openWriteSEG == true ? "" : "none";
        displayMark();
        getByid('MouseOperation').click();
    }
    getByid("saveSEG").onclick = function () {
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
        displayMark();
    }

    displayMark();
    //getByid('MouseOperation').click();
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
    let temp = "" + SEG_format;
    let tail2_list = "", tail4_list = "";

    function setTag(temp, replace, str, len) {
        if (str == undefined || str == null) str = "";
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

    //此更動待驗證
    var sopList = Patient.findSeries(GetViewport().series).Sop;
    for (var s = 0; s < sopList.length; s++) {
        let tail2 = "" + SEG_format_tail_2;
        // tail2 = tail2.replace("___ReferencedSOPInstanceUID___", sopList[s]);
        tail2 = setTag(tail2, "ReferencedSOPInstanceUID", sopList[s].SopUID, true);
        tail2_list += tail2;
    }
    var segCount = 0;
    for (var n = 0; n < PatientMark.length; n++) {
        //for (var m = 0; m < PatientMark[n].mark.length; m++) {
        if (PatientMark[n].series == GetViewport().series) {
            if (PatientMark[n].type == "SEG") {
                segCount++;
            }
        }
        // }
    }
    if (segCount == 0) return;
    temp = setTag(temp, "NumberOfFrames", segCount, true);
    temp = setTag(temp, "SegmentNumber", segCount, true);
    var mark_xy = "";
    var temp_segCount = 0;
    for (var n = 0; n < PatientMark.length; n++) {
        if (PatientMark[n].series == GetViewport().series) {
            //for (var m = 0; m < PatientMark[n].mark.length; m++) {
            if (PatientMark[n].type == "SEG") {
                temp_segCount++;
                var tail4 = "" + SEG_format_tail_4;
                var tempMark = PatientMark[n];
                for (var o = 0; o < tempMark.pixelData.length; o += 1) {
                    if (o == 0 && temp_segCount == 1) mark_xy += "0" + tempMark.pixelData[o];
                    else mark_xy += "\\" + "0" + tempMark.pixelData[o];
                }
                tail4 = setTag(tail4, "ReferencedSOPInstanceUID", PatientMark[n].sop, true);
                tail4 = setTag(tail4, "ImagePositionPatient", "" + PatientMark[n].ImagePositionPatient, true);
                tail4 = setTag(tail4, "DimensionIndexValues", "1\\" + temp_segCount, true);
                tail4_list += tail4;
            }
            //}
        }
        var createSopUid = CreateUid("sop");
        var createSeriesUid = CreateUid("series");
        var tags = GetViewport().tags;
        for (var c = 0; c < 5; c++) {
            temp = setTag(temp, "StudyDate", GetViewport().studyDate, true);
            temp = setTag(temp, "StudyTime", GetViewport().studyTime, true);
            temp = setTag(temp, "StudyInstanceUID", GetViewport().study, true);
            temp = setTag(temp, "SeriesInstanceUID", createSeriesUid, true);
            temp = setTag(temp, "SOPInstanceUID", createSopUid, true);
            temp = setTag(temp, "PatientID", tags.PatientID, true);
            temp = setTag(temp, "PatientName", tags.PatientName, true);
            temp = setTag(temp, "ReferencedSOPInstanceUID", GetViewport().sop, true);
            temp = setTag(temp, "ImageType", tags.ImageType, true);
            temp = setTag(temp, "ReferencedSeriesInstanceUID", GetViewport().series, true);
            temp = setTag(temp, "AccessionNumber", tags.AccessionNumber, true);

            temp = setTag(temp, "StudyID", GetViewport().studyID, true);

            temp = setTag(temp, "PatientSex", tags.PatientSex, true);
            temp = setTag(temp, "PatientBirthDate", tags.PatientBirthDate, true);
            temp = setTag(temp, "PatientAge", tags.PatientAge, true);
            temp = setTag(temp, "Manufacturer", tags.Manufacture, true);
            temp = setTag(temp, "PhotometricInterpretation", tags.PhotometricInterpretation, true);
            temp = setTag(temp, "ReferringPhysicianName", tags.ReferringPhysicianName, true);
            temp = setTag(temp, "SliceThickness", tags.SliceThickness, true);
            temp = setTag(temp, "SpacingBetweenSlices", tags.SpacingBetweenSlices, true);

            temp = setTag(temp, "SeriesDescription", getByid('SegSeriesDescription').value, true);
            temp = setTag(temp, "SeriesNumber", "" + GetViewport().seriesNumber + "03", true);
            temp = setTag(temp, "PixelSpacing", "" + tags.PixelSpacing, true);

            temp = setTag(temp, "ImagePositionPatient", "" + tags.ImagePositionPatient, true);

            function setTagByElTag(temp, replace, len) {
                for (var d = 0; d < GetViewport().tags.length; d++) {
                    if (GetViewport().tags[d][1] == replace) {
                        temp = ("" + temp).replace("___" + replace + "___", "" + GetViewport().tags[d][2]);
                        var length = ("" + GetViewport().tags[d][2]).length;
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

function DeleteSelectedSEG() {
    if (!SEG_now_choose) return;
    PatientMark.splice(PatientMark.indexOf(SEG_now_choose), 1);
    displayMark();

    refreshMarkFromSop(GetViewport().sop);
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
        drawBorder(getByid("drawSEG"));

        BlueLightMousedownList = [];
        BlueLightMousedownList.push(function (e) {
            if (openWindow != true) {
                var break1 = false;
                for (var n_s = 0; n_s < PatientMark.length; n_s++) {
                    if (PatientMark[n_s].sop == GetViewport().sop) {
                        if (break1 == true) break;
                        if (PatientMark[n_s].type == "SEG") {
                            SEG_now_choose = PatientMark[n_s];
                            break1 = true;
                        }

                    }
                }
                if (break1 == false) {
                    var SegMark = new BlueLightMark();
                    SegMark.setQRLevels(GetViewport().QRLevels);
                    SegMark.type = SegMark.hideName = SegMark.showName = "SEG";
                    SegMark.ImagePositionPatient = GetViewport().tags.ImagePositionPatient;
                    SegMark.pixelData = new Uint8ClampedArray(GetViewport().canvas.width * GetViewport().canvas.height);

                    if (!SegMark.canvas) {
                        SegMark.canvas = document.createElement("CANVAS");
                        SegMark.canvas.width = GetViewport().canvas.width;
                        SegMark.canvas.height = GetViewport().canvas.height;
                        SegMark.ctx = SegMark.canvas.getContext('2d');

                        var pixelData = SegMark.ctx.getImageData(0, 0, SegMark.canvas.width, SegMark.canvas.height);

                        for (var i = 0, j = 0; i < pixelData.data.length; i += 4, j++) {
                            if (SegMark.pixelData[j] != 0) {
                                pixelData.data[i] = 0;
                                pixelData.data[i + 1] = 0;
                                pixelData.data[i + 2] = 255;
                                pixelData.data[i + 3] = 255;
                            }
                        }
                        SegMark.ctx.putImageData(pixelData, 0, 0);
                    }
                    let angle2point = rotateCalculation(e, true);
                    PatientMark.push(SegMark);
                    SEG_now_choose = SegMark;
                    setSEG2PixelData(angle2point);
                    refreshMark(SegMark);
                }
                displayAllMark();
            }
        });

        var Previous_angle2point;

        BlueLightMousemoveList = [];
        BlueLightMousemoveList.push(function (e) {
            if (MouseDownCheck && !rightMouseDown && SEG_now_choose && openWindow != true) {
                let angle2point = rotateCalculation(e, true);
                if (Previous_angle2point && (Previous_angle2point[0] != angle2point[0] || Previous_angle2point[1] != angle2point[1])) {
                    setSEG2PixelData(angle2point);
                    Line_setSEG2PixelData(Previous_angle2point, angle2point);

                    refreshMarkFromSop(GetViewport().sop);
                    displayAllMark();
                }
                Previous_angle2point = angle2point;
            }
            if (!rightMouseDown && openWindow != true) {
                var rect = getByid("SegBrushSizeText").value;
                rect = parseInt(rect);
                if (isNaN(rect) || rect < 1 || rect > 1024) rect = getByid("SegBrushSizeText").value = 10;
                refreshMarkFromSop(GetViewport().sop);
                let angle2point = rotateCalculation(e, false);
                var MarkCanvas = GetViewportMark();
                var segCtx = MarkCanvas.getContext("2d");
                segCtx.beginPath();
                segCtx.strokeStyle = "#FFFF00";
                segCtx.lineWidth = "3";
                segCtx.arc(angle2point[0], angle2point[1], rect, 0, 2 * Math.PI);
                segCtx.stroke();
                segCtx.closePath();
            }
        });

        BlueLightMouseupList = [];
        BlueLightMouseupList.push(function (e) {
            Previous_angle2point = undefined;
            if (openMouseTool && rightMouseDown) displayMark();

            if (openLink) displayAllRuler();
        });

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
                    SEG_now_choose.pixelData[Math.floor(angle2point[1] + s) * GetViewport().width + Math.floor(angle2point[0] + s2)] = 0;
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
                    SEG_now_choose.pixelData[Math.floor(angle2point[1] + s) * GetViewport().width + Math.floor(angle2point[0] + s2)] = 1;
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