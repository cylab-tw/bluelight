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
    let index = SearchUid2Index(GetViewport().alt);
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
    var temp_segCount=0;
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
            temp = setTagByElTag(temp, "BitsAllocated", true);
            temp = setTagByElTag(temp, "BitsStored", true);
            temp = setTagByElTag(temp, "HighBit", true);
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