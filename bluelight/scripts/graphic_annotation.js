var Graphic_Annotation_format =
    `<?xml version="1.0" encoding="UTF-8"?>
<file-format>
    <meta-header xfer="1.2.840.10008.1.2.1" name="Little Endian Explicit">
        <element tag="0002,0000" vr="UL" vm="1" len="4" name="FileMetaInformationGroupLength">200</element>
        <element tag="0002,0001" vr="OB" vm="1" len="2" name="FileMetaInformationVersion" binary="hidden"></element>
        <element tag="0002,0002" vr="UI" vm="1" len="28" name="MediaStorageSOPClassUID">1.2.840.10008.5.1.4.1.1.11.1</element>
        <element tag="0002,0003" vr="UI" vm="1" len="56" name="MediaStorageSOPInstanceUID">1.2.276.0.7230010.3.1.4.1386188699.53252.1596566123.4640</element>
        <element tag="0002,0010" vr="UI" vm="1" len="18" name="TransferSyntaxUID">1.2.840.10008.1.2</element>
        <element tag="0002,0012" vr="UI" vm="1" len="28" name="ImplementationClassUID">1.2.276.0.7230010.3.0.3.6.4</element>
        <element tag="0002,0013" vr="SH" vm="1" len="16" name="ImplementationVersionName">OFFIS_DCMTK_364</element>
    </meta-header>
    <data-set xfer="1.2.840.10008.1.2" name="Little Endian Implicit">
        <element tag="0008,0005" vr="CS" vm="1" len="10" name="SpecificCharacterSet">ISO_IR 192</element>
        <element tag="0008,0016" vr="UI" vm="1" len="28" name="SOPClassUID">1.2.840.10008.5.1.4.1.1.11.1</element>
        <element tag="0008,0018" vr="UI" vm="1" len="56" name="SOPInstanceUID">___SOPInstanceUID___</element>
        <element tag="0008,0020" vr="DA" vm="1" len="8" name="StudyDate">___StudyDate___</element>
        <element tag="0008,0023" vr="DA" vm="1" len="8" name="ContentDate">___StudyDate___</element>
        <element tag="0008,0030" vr="TM" vm="1" len="6" name="StudyTime">___StudyTime___</element>
        <element tag="0008,0033" vr="TM" vm="1" len="10" name="ContentTime">___StudyTime___</element>
        <element tag="0008,0050" vr="SH" vm="0" len="0" name="AccessionNumber"></element>
        <element tag="0008,0060" vr="CS" vm="1" len="2" name="Modality">PR</element>
        <element tag="0008,1030" vr="LO" vm="1" len="28" name="StudyDescription">L- SPINE AP LAT (FOR ORTHO)</element>
        <element tag="0008,103e" vr="LO" vm="1" len="12" name="SeriesDescription">Weasis GSPS</element>
        <sequence tag="0008,1115" vr="SQ" card="1" len="188" name="ReferencedSeriesSequence">
            <item card="2" len="180">
                <sequence tag="0008,1140" vr="SQ" card="1" len="108" name="ReferencedImageSequence">
                    <item card="2" len="100">
                        <element tag="0008,1150" vr="UI" vm="1" len="28" name="ReferencedSOPClassUID">1.2.840.10008.5.1.4.1.1.1.1</element>
                        <element tag="0008,1155" vr="UI" vm="1" len="56" name="ReferencedSOPInstanceUID">___ReferencedSOPInstanceUID___</element>
                    </item>
                </sequence>
                <element tag="0020,000e" vr="UI" vm="1" len="56" name="SeriesInstanceUID">___SeriesInstanceUID___</element>
            </item>
        </sequence>
        <element tag="0010,0010" vr="PN" vm="1" len="14" name="PatientName">VF001378_Name</element>
        <element tag="0010,0020" vr="LO" vm="1" len="8" name="PatientID">VF001378</element>
        <element tag="0010,0030" vr="DA" vm="1" len="8" name="PatientBirthDate">00000001</element>
        <element tag="0010,0040" vr="CS" vm="1" len="2" name="PatientSex">M</element>
        <element tag="0012,0062" vr="CS" vm="1" len="4" name="PatientIdentityRemoved">YES</element>
        <element tag="0012,0063" vr="LO" vm="1" len="14" name="DeidentificationMethod">AI99 ldcmdeid</element>
        <sequence tag="0012,0064" vr="SQ" card="4" len="340" name="DeidentificationMethodCodeSequence">
            <item card="3" len="76">
                <element tag="0008,0100" vr="SH" vm="1" len="6" name="CodeValue">113100</element>
                <element tag="0008,0102" vr="SH" vm="1" len="4" name="CodingSchemeDesignator">DCM</element>
                <element tag="0008,0104" vr="LO" vm="1" len="42" name="CodeMeaning">Basic Application Confidentiality Profile</element>
            </item>
            <item card="3" len="96">
                <element tag="0008,0100" vr="SH" vm="1" len="6" name="CodeValue">113107</element>
                <element tag="0008,0102" vr="SH" vm="1" len="4" name="CodingSchemeDesignator">DCM</element>
                <element tag="0008,0104" vr="LO" vm="1" len="62" name="CodeMeaning">Retain Longitudinal Temporal Information Modified Dates Option</element>
            </item>
            <item card="3" len="72">
                <element tag="0008,0100" vr="SH" vm="1" len="6" name="CodeValue">113108</element>
                <element tag="0008,0102" vr="SH" vm="1" len="4" name="CodingSchemeDesignator">DCM</element>
                <element tag="0008,0104" vr="LO" vm="1" len="38" name="CodeMeaning">Retain Patient Characteristics Option</element>
            </item>
            <item card="3" len="64">
                <element tag="0008,0100" vr="SH" vm="1" len="6" name="CodeValue">113109</element>
                <element tag="0008,0102" vr="SH" vm="1" len="4" name="CodingSchemeDesignator">DCM</element>
                <element tag="0008,0104" vr="LO" vm="1" len="30" name="CodeMeaning">Retain Device Identity Option</element>
            </item>
        </sequence>
        <element tag="0018,0015" vr="CS" vm="0" len="0" name="BodyPartExamined"></element>
        <element tag="0018,1020" vr="LO" vm="1" len="6" name="SoftwareVersions">3.5.4</element>
        <element tag="0020,000d" vr="UI" vm="1" len="56" name="StudyInstanceUID">___StudyInstanceUID___</element>
        <element tag="0020,000e" vr="UI" vm="1" len="56" name="SeriesInstanceUID">___SeriesInstanceUID___</element>
        <element tag="0020,0010" vr="SH" vm="1" len="16" name="StudyID">1553519062411434</element>
        <element tag="0020,0011" vr="IS" vm="1" len="4" name="SeriesNumber">999</element>
        <sequence tag="0070,0001" vr="SQ" card="1" len="194" name="GraphicAnnotationSequence">
            <item card="3" len="186">
                <element tag="0070,0002" vr="CS" vm="1" len="4" name="GraphicLayer">DRAW</element>
                <sequence tag="0070,0008" vr="SQ" card="0" len="0" name="TextObjectSequence">
                </sequence>
                <sequence tag="0070,0009" vr="SQ" card="1" len="158" name="GraphicObjectSequence">
___item___
                </sequence>
            </item>
        </sequence>
        <sequence tag="0070,0060" vr="SQ" card="1" len="60" name="GraphicLayerSequence">
            <item card="4" len="52">
                <element tag="0070,0002" vr="CS" vm="1" len="4" name="GraphicLayer">DRAW</element>
                <element tag="0070,0062" vr="IS" vm="1" len="2" name="GraphicLayerOrder">0</element>
                <element tag="0070,0068" vr="LO" vm="1" len="8" name="GraphicLayerDescription">Drawings</element>
                <element tag="0070,0401" vr="US" vm="3" len="6" name="GraphicLayerRecommendedDisplayCIELabValue">655\\33153\\32896</element>
            </item>
        </sequence>
        <element tag="0070,0080" vr="CS" vm="1" len="4" name="ContentLabel">GSPS</element>
        <element tag="0070,0081" vr="LO" vm="1" len="12" name="ContentDescription">Description</element>
        <element tag="0070,0082" vr="DA" vm="1" len="8" name="PresentationCreationDate">20200210</element>
        <element tag="0070,0083" vr="TM" vm="1" len="10" name="PresentationCreationTime">093348.775</element>
        <element tag="0070,0084" vr="PN" vm="1" len="10" name="ContentCreatorName">Bobby Chou</element>
    </data-set>
</file-format>`;

var Graphic_format_object_list = [];
var Graphic_format_tail = `
                    <item card="7" len="150">
                        <element tag="0070,0005" vr="CS" vm="1" len="6" name="GraphicAnnotationUnits">PIXEL</element>
                        <element tag="0070,0020" vr="US" vm="1" len="2" name="GraphicDimensions">2</element>
                        <element tag="0070,0021" vr="US" vm="1" len="2" name="NumberOfGraphicPoints">5</element>
                        <element tag="0070,0022" vr="FL" vm="___vm___" len="___len___" name="GraphicData">___GraphicData___</element>
                        <element tag="0070,0023" vr="CS" vm="1" len="8" name="GraphicType">___GraphicType___</element>___rotation___
                        <element tag="0070,0024" vr="CS" vm="1" len="2" name="GraphicFilled">N</element>
                        <sequence tag="0070,0232" vr="SQ" card="1" len="34" name="LineStyleSequence">
                            <item card="2" len="26">
                                <element tag="0070,0251" vr="US" vm="3" len="6" name="PatternOnColorCIELabValue">___PatternOnColorCIELabValue___</element>
                                <element tag="0070,0253" vr="FL" vm="1" len="4" name="LineThickness">1</element>
                            </item>
                        </sequence>
                    </item>`;
var Graphic_format_rotation = `

                        <element tag="0070,0230" vr="FD" vm="1" len="8" name="RotationAngle">___RotationAngle___</element>
                        <element tag="0070,0273" vr="FL" vm="2" len="8" name="RotationPoint">___RotationPoint___</element>`
var Graphic_now_choose = null;
var temp_xml_format = "";


function Graphic_pounch(currX, currY) {
    let block_size = getMarkSize(GetViewportMark(), false) * 2;
    let index = SearchUid2Index(GetViewport((viewportNumber)).alt);
    let i = index[0],
        j = index[1],
        k = index[2];
    for (var n = 0; n < PatientMark.length; n++) {
        if (PatientMark[n].sop == Patient.Study[i].Series[j].Sop[k].SopUID) {
            for (var m = 0; m < PatientMark[n].mark.length; m++) {
                if (PatientMark[n].mark[m].type == "POLYLINE") {
                    var tempMark = PatientMark[n].mark[m];
                    var Max_X = -999999,
                        Max_Y = -999999,
                        Min_X = 999999,
                        Min_Y = 999999;
                    var Max_X_list = [],
                        Max_Y_list = [],
                        Min_X_list = [],
                        Min_Y_list = [];
                    for (var o = 0; o < PatientMark[n].mark[m].markX.length; o += 1) {
                        if (parseInt(tempMark.markX[o]) >= Max_X) Max_X = parseInt(tempMark.markX[o]);
                        if (parseInt(tempMark.markX[o]) <= Min_X) Min_X = parseInt(tempMark.markX[o]);
                    }
                    for (var o = 0; o < PatientMark[n].mark[m].markX.length; o += 1) {
                        if (Max_X == parseInt(tempMark.markX[o])) Max_X_list.push(o);
                        if (Min_X == parseInt(tempMark.markX[o])) Min_X_list.push(o);
                    }
                    for (var o = 0; o < PatientMark[n].mark[m].markY.length; o += 1) {
                        if (parseInt(tempMark.markY[o]) >= Max_Y) Max_Y = parseInt(tempMark.markY[o]);
                        if (parseInt(tempMark.markY[o]) <= Min_Y) Min_Y = parseInt(tempMark.markY[o]);
                    }
                    for (var o = 0; o < PatientMark[n].mark[m].markX.length; o += 1) {
                        if (Max_Y == parseInt(tempMark.markY[o])) Max_Y_list.push(o);
                        if (Min_Y == parseInt(tempMark.markY[o])) Min_Y_list.push(o);
                    }
                    for (var o = 0; o < PatientMark[n].mark[m].markX.length - 1; o += 1) {
                        var x_middle = (parseInt(tempMark.markX[o]) + parseInt(tempMark.markX[o + 1])) / 2;
                        var y_middle = (parseInt(tempMark.markY[o]) + parseInt(tempMark.markY[o + 1])) / 2;
                        if (currY + block_size >= y_middle && currX + block_size >= x_middle && currY < y_middle + block_size && currX < x_middle + block_size) {
                            if (y_middle == Max_Y) {
                                Graphic_now_choose = {
                                    reference: PatientMark[n],
                                    point: Max_Y_list,
                                    mark: tempMark,
                                    middle: [(Max_X + Min_X) / 2, (Max_Y + Min_Y) / 2],
                                    value: 'up'
                                };
                                return true;
                            } else if (y_middle == Min_Y) {
                                Graphic_now_choose = {
                                    reference: PatientMark[n],
                                    point: Min_Y_list,
                                    mark: tempMark,
                                    middle: [(Max_X + Min_X) / 2, (Max_Y + Min_Y) / 2],
                                    value: 'down'
                                };
                                return true;
                            } else if (x_middle == Min_X) {
                                Graphic_now_choose = {
                                    reference: PatientMark[n],
                                    point: Min_X_list,
                                    mark: tempMark,
                                    middle: [(Max_X + Min_X) / 2, (Max_Y + Min_Y) / 2],
                                    value: 'left'
                                };
                                return true;
                            } else if (x_middle == Max_X) {
                                Graphic_now_choose = {
                                    reference: PatientMark[n],
                                    point: Max_X_list,
                                    mark: tempMark,
                                    middle: [(Max_X + Min_X) / 2, (Max_Y + Min_Y) / 2],
                                    value: 'right'
                                };
                                return true;
                            }
                        }
                    }
                }
            }
        }
    }
    Graphic_now_choose = null;
    return false;
}

function set_Graphic_context() {
    Graphic_format_object_list = []
    let temp = ""
    let tail_list = "";
    let index = SearchUid2Index(GetViewport().alt);
    let i = index[0],
        j = index[1],
        k = index[2];
    temp = "" + Graphic_Annotation_format;
    for (var n = 0; n < PatientMark.length; n++) {
        if (PatientMark[n].sop == Patient.Study[i].Series[j].Sop[k].SopUID) {
            let tail = "" + Graphic_format_tail;
            for (var m = 0; m < PatientMark[n].mark.length; m++) {
                var tempMark = PatientMark[n].mark[m];
                var mark_xy = "";
                for (var o = 0; o < tempMark.markX.length; o += 1) {
                    var x1 = parseInt(tempMark.markX[o]) + ".0123";
                    var y1 = parseInt(tempMark.markY[o]) + ".0123";
                    if (o != 0) mark_xy += "\\";
                    mark_xy += x1 + "\\" + y1;
                }  
                tail = tail.replace("___GraphicData___", mark_xy);
                tail = tail.replace("___vm___", "4");
                tail = tail.replace("___len___", tempMark.markX.length + tempMark.markY.length);
                tail = tail.replace("___PatternOnColorCIELabValue___", "" + SetGraphicColor(PatientMark[n].color));
                tail = tail.replace("___GraphicType___", "POLYLINE");
                if (tempMark.RotationAngle && tempMark.RotationPoint) {
                    var rotation = ("" + Graphic_format_rotation).replace("___RotationAngle___", tempMark.RotationAngle);
                    rotation = rotation.replace("___RotationPoint___", "" + tempMark.RotationPoint[0] + "\\" + tempMark.RotationPoint[1]);
                    tail = tail.replace("___rotation___", rotation);
                } else {
                    tail = tail.replace("___rotation___", "");
                }
            }
            tail_list += tail;
            for (var c = 0; c < 2; c++) {
                temp = temp.replace("___StudyDate___", GetViewport().StudyDate);
                temp = temp.replace("___StudyTime___", GetViewport().StudyTime);
                temp = temp.replace("___StudyInstanceUID___", Patient.Study[i].StudyUID);
                temp = temp.replace("___SeriesInstanceUID___", Patient.Study[i].Series[j].SeriesUID);
                temp = temp.replace("___SOPInstanceUID___", Patient.Study[i].Series[j].Sop[k].SopUID);
                temp = temp.replace("___ReferencedSOPInstanceUID___", PatientMark[n].sop);
            }
        }
    }
    temp = temp.replace("___item___", tail_list);
    Graphic_format_object_list.push(temp);
}

function get_Graphic_context() {
    var temp_str = "";
    for (var i = 0; i < Graphic_format_object_list.length; i++) {
        temp_str += Graphic_format_object_list[i];
    }
    return temp_str;
}