var Graphic_Annotation_format =
    `<?xml version="1.0" encoding="UTF-8"?>
<file-format>
    <meta-header xfer="1.2.840.10008.1.2.1" name="Little Endian Explicit">
        <element tag="0002,0000" vr="UL" vm="1" len="4" name="FileMetaInformationGroupLength">200</element>
        <element tag="0002,0001" vr="OB" vm="1" len="2" name="FileMetaInformationVersion" binary="hidden"></element>
        <element tag="0002,0002" vr="UI" vm="1" len="28" name="MediaStorageSOPClassUID">1.2.840.10008.5.1.4.1.1.11.1</element>
        <element tag="0002,0003" vr="UI" vm="1" len="___SOPInstanceUID(len)___" name="MediaStorageSOPInstanceUID">___SOPInstanceUID___</element>
        <element tag="0002,0010" vr="UI" vm="1" len="18" name="TransferSyntaxUID">1.2.840.10008.1.2</element>
        <element tag="0002,0012" vr="UI" vm="1" len="28" name="ImplementationClassUID">1.2.276.0.7230010.3.0.3.6.4</element>
        <element tag="0002,0013" vr="SH" vm="1" len="16" name="ImplementationVersionName">OFFIS_DCMTK_364</element>
    </meta-header>
    <data-set xfer="1.2.840.10008.1.2" name="Little Endian Implicit">
        <element tag="0008,0005" vr="CS" vm="1" len="10" name="SpecificCharacterSet">ISO_IR 192</element>
        <element tag="0008,0016" vr="UI" vm="1" len="28" name="SOPClassUID">1.2.840.10008.5.1.4.1.1.11.1</element>
        <element tag="0008,0018" vr="UI" vm="1" len="___SOPInstanceUID(len)___" name="SOPInstanceUID">___SOPInstanceUID___</element>
        <element tag="0008,0020" vr="DA" vm="1" len="8" name="StudyDate">___StudyDate___</element>
        <element tag="0008,0023" vr="DA" vm="1" len="8" name="ContentDate">___StudyDate___</element>
        <element tag="0008,0030" vr="TM" vm="1" len="10" name="StudyTime">___StudyTime___</element>
        <element tag="0008,0033" vr="TM" vm="1" len="10" name="ContentTime">___StudyTime___</element>
        <element tag="0008,0050" vr="SH" vm="1" len="___AccessionNumber(len)___" name="AccessionNumber">___AccessionNumber___</element>
        <element tag="0008,0060" vr="CS" vm="1" len="2" name="Modality">PR</element>
        <element tag="0008,1030" vr="LO" vm="1" len="___StudyDescription(len)___" name="StudyDescription">___StudyDescription___</element>
        <element tag="0008,103e" vr="LO" vm="1" len="12" name="SeriesDescription">BlueLight GSPS</element>
        <sequence tag="0008,1115" vr="SQ" card="1" len="188" name="ReferencedSeriesSequence">
            <item card="2" len="180">
                <sequence tag="0008,1140" vr="SQ" card="1" len="108" name="ReferencedImageSequence">
                    <item card="2" len="100">
                        <element tag="0008,1150" vr="UI" vm="1" len="28" name="ReferencedSOPClassUID">1.2.840.10008.5.1.4.1.1.1.1</element>
                        <element tag="0008,1155" vr="UI" vm="1" len="___ReferencedSOPInstanceUID(len)___" name="ReferencedSOPInstanceUID">___ReferencedSOPInstanceUID___</element>
                    </item>
                </sequence>
                <element tag="0020,000e" vr="UI" vm="1" len="___ReferencedSeriesInstanceUID(len)___" name="SeriesInstanceUID">___ReferencedSeriesInstanceUID___</element>
            </item>
        </sequence>
        <element tag="0010,0010" vr="PN" vm="1" len="___PatientName(len)___" name="PatientName">___PatientName___</element>
        <element tag="0010,0020" vr="LO" vm="1" len="___PatientID(len)___" name="PatientID">___PatientID___</element>
        <element tag="0018,0015" vr="CS" vm="0" len="0" name="BodyPartExamined"></element>
        <element tag="0018,1020" vr="LO" vm="1" len="6" name="SoftwareVersions">3.5.4</element>
        <element tag="0020,000d" vr="UI" vm="1" len="___StudyInstanceUID(len)___" name="StudyInstanceUID">___StudyInstanceUID___</element>
        <element tag="0020,000e" vr="UI" vm="1" len="___SeriesInstanceUID(len)___" name="SeriesInstanceUID">___SeriesInstanceUID___</element>
        <element tag="0020,0010" vr="SH" vm="1" len="___StudyID(len)___" name="StudyID">___StudyID___</element>
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
        <element tag="0070,0082" vr="DA" vm="1" len="8" name="PresentationCreationDate">___PresentationCreationDate___</element>
        <element tag="0070,0083" vr="TM" vm="1" len="10" name="PresentationCreationTime">___PresentationCreationTime___</element>
        <element tag="0070,0084" vr="PN" vm="1" len="10" name="ContentCreatorName">BlueLight</element>
    </data-set>
</file-format>`;

var Graphic_format_object_list = [];
var Graphic_format_tail = `
                    <item card="7" len="150">
                        <element tag="0070,0005" vr="CS" vm="1" len="6" name="GraphicAnnotationUnits">PIXEL</element>
                        <element tag="0070,0020" vr="US" vm="1" len="2" name="GraphicDimensions">2</element>
                        <element tag="0070,0021" vr="US" vm="1" len="___NumberOfGraphicPoints(len)___" name="NumberOfGraphicPoints">___NumberOfGraphicPoints___</element>
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

                        <element tag="0071,0230" vr="FD" vm="1" len="8" name="RotationAngle">___RotationAngle___</element>
                        <element tag="0071,0273" vr="FL" vm="2" len="8" name="RotationPoint">___RotationPoint___</element>`
var Graphic_now_choose = null;
var temp_xml_format = "";


function Graphic_pounch(currX, currY, dcm) {
    let block_size = getMarkSize(GetViewportMark(), false) * 4;
    let index = SearchUid2Index(GetViewport((viewportNumber)).alt);
    let i = index[0],
        j = index[1],
        k = index[2];
    for (var n = 0; n < PatientMark.length; n++) {
        if (dcm && PatientMark[n] != dcm) continue;
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
                        if (equal_TOL(Max_X, parseInt(tempMark.markX[o]), block_size)) Max_X_list.push(o);
                        if (equal_TOL(Min_X, parseInt(tempMark.markX[o]), block_size)) Min_X_list.push(o);
                    }
                    for (var o = 0; o < PatientMark[n].mark[m].markY.length; o += 1) {
                        if (parseInt(tempMark.markY[o]) >= Max_Y) Max_Y = parseInt(tempMark.markY[o]);
                        if (parseInt(tempMark.markY[o]) <= Min_Y) Min_Y = parseInt(tempMark.markY[o]);
                    }
                    for (var o = 0; o < PatientMark[n].mark[m].markX.length; o += 1) {
                        if (equal_TOL(Max_Y, parseInt(tempMark.markY[o]), block_size)) Max_Y_list.push(o);
                        if (equal_TOL(Min_Y, parseInt(tempMark.markY[o]), block_size)) Min_Y_list.push(o);
                    }
                    for (var o = 0; o < PatientMark[n].mark[m].markX.length - 1; o += 1) {
                        var x_middle = (parseInt(tempMark.markX[o]) + parseInt(tempMark.markX[o + 1])) / 2;
                        var y_middle = (parseInt(tempMark.markY[o]) + parseInt(tempMark.markY[o + 1])) / 2;
                        if (currY + block_size >= y_middle && currX + block_size >= x_middle && currY < y_middle + block_size && currX < x_middle + block_size) {
                            if (equal_TOL(y_middle, Max_Y, block_size)) {
                                Graphic_now_choose = {
                                    reference: PatientMark[n],
                                    point: Max_Y_list,
                                    mark: tempMark,
                                    middle: [(Max_X + Min_X) / 2, (Max_Y + Min_Y) / 2],
                                    value: 'up'
                                };
                                return true;
                            } else if (equal_TOL(y_middle, Min_Y, block_size)) {
                                Graphic_now_choose = {
                                    reference: PatientMark[n],
                                    point: Min_Y_list,
                                    mark: tempMark,
                                    middle: [(Max_X + Min_X) / 2, (Max_Y + Min_Y) / 2],
                                    value: 'down'
                                };
                                return true;
                            } else if (equal_TOL(x_middle, Min_X, block_size)) {
                                Graphic_now_choose = {
                                    reference: PatientMark[n],
                                    point: Min_X_list,
                                    mark: tempMark,
                                    middle: [(Max_X + Min_X) / 2, (Max_Y + Min_Y) / 2],
                                    value: 'left'
                                };
                                return true;
                            } else if (equal_TOL(x_middle, Max_X, block_size)) {
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
            for (var m = 0; m < PatientMark[n].mark.length; m++) {
                if (PatientMark[n].mark[m].type == "POLYLINE") {
                    let tail = "" + Graphic_format_tail;
                    var tempMark = PatientMark[n].mark[m];
                    var mark_xy = "";
                    for (var o = 0; o < tempMark.markX.length; o += 1) {
                        var tempX = 0,
                            tempY = 0;
                        if (tempMark.RotationAngle && tempMark.RotationPoint)
                            [tempX, tempY] = rotatePoint([tempMark.markX[o], tempMark.markY[o]], tempMark.RotationAngle, tempMark.RotationPoint)
                        else
                            [tempX, tempY] = [tempMark.markX[o], tempMark.markY[o]];
                        tempX = parseInt(tempX) + ".0123";
                        tempY = parseInt(tempY) + ".0123";
                        if (o != 0) mark_xy += "\\";
                        mark_xy += tempX + "\\" + tempY;
                    }
                    tail = tail.replace("___GraphicData___", mark_xy);
                    tail = tail.replace("___vm___", "10");
                    tail = tail.replace("___len___", (tempMark.markX.length + tempMark.markY.length) * 4);
                    tail = tail.replace("___PatternOnColorCIELabValue___", "" + SetGraphicColor(PatientMark[n].color));
                    tail = tail.replace("___GraphicType___", "POLYLINE");
                    tail = setTag(tail, "NumberOfGraphicPoints", 5, true);
                    if (tempMark.RotationAngle && tempMark.RotationPoint) {
                        var rotation = ("" + Graphic_format_rotation).replace("___RotationAngle___", tempMark.RotationAngle);
                        rotation = rotation.replace("___RotationPoint___", "" + tempMark.RotationPoint[0] + "\\" + tempMark.RotationPoint[1]);
                        tail = tail.replace("___rotation___", rotation);
                    } else {
                        tail = tail.replace("___rotation___", "");
                    }
                    tail_list += tail;
                }
                var date = new Date();

                function zero(num, Milliseconds) {
                    if (Milliseconds) {
                        if (num < 10) return "" + "00" + num;
                        else if (num < 100) return "" + "0" + num;
                        return "" + num;
                    }
                    return "" + (num < 10 ? '0' : '') + num;
                }

                function setTag(temp, replace, str, len) {
                    str = Null2Empty(str);
                    temp = temp.replace("___" + replace + "___", "" + str);
                    var length = ("" + str).length;
                    if (length % 2 != 0) length++;
                    if (len == true) temp = temp.replace("___" + replace + "(len)___", length);
                    return temp;
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
                    temp = setTag(temp, "ReferencedSeriesInstanceUID", Patient.Study[i].Series[j].SeriesUID, true);
                    temp = setTag(temp, "AccessionNumber", GetViewport().AccessionNumber, true);
                    temp = setTag(temp, "StudyDescription", GetViewport().StudyDescription, true);
                    temp = setTag(temp, "StudyID", GetViewport().StudyID, true);
                    temp = temp.replace("___PresentationCreationDate___", "" + date.getFullYear() + zero(date.getMonth() + 1) + zero(date.getDate())); // 20200210
                    temp = temp.replace("___PresentationCreationTime___", "" + zero(date.getHours() + 1) + zero(date.getMinutes()) + zero(date.getSeconds()) + "." + zero(date.getMilliseconds(), true)); // 093348.775
                }
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



function set_GSPS_context() {
    Graphic_format_object_list = []
    let temp = ""
    let tail_list = "";
    let index = SearchUid2Index(GetViewport().alt);
    let i = index[0],
        j = index[1],
        k = index[2];
    temp = "" + Graphic_Annotation_format;

    function setTag(temp, replace, str, len) {
        str = Null2Empty(str);
        temp = temp.replace("___" + replace + "___", "" + str);
        var length = ("" + str).length;
        if (length % 2 != 0) length++;
        if (len == true) temp = temp.replace("___" + replace + "(len)___", length);
        return temp;
    }
    for (var n = 0; n < PatientMark.length; n++) {
        if (PatientMark[n].sop == Patient.Study[i].Series[j].Sop[k].SopUID) {
            for (var m = 0; m < PatientMark[n].mark.length; m++) {
                if (PatientMark[n].mark[m].type == "POLYLINE") {
                    let tail = "" + Graphic_format_tail;
                    var tempMark = PatientMark[n].mark[m];
                    var mark_xy = "";
                    for (var o = 0; o < tempMark.markX.length; o += 1) {
                        var tempX = 0,
                            tempY = 0;
                        if (tempMark.RotationAngle && tempMark.RotationPoint)
                            [tempX, tempY] = rotatePoint([tempMark.markX[o], tempMark.markY[o]], tempMark.RotationAngle, tempMark.RotationPoint)
                        else
                            [tempX, tempY] = [tempMark.markX[o], tempMark.markY[o]];
                        tempX = parseInt(tempX) + ".0123";
                        tempY = parseInt(tempY) + ".0123";
                        if (o != 0) mark_xy += "\\";
                        mark_xy += tempX + "\\" + tempY;
                    }
                    tail = tail.replace("___GraphicData___", mark_xy);
                    tail = tail.replace("___vm___", (tempMark.markX.length + tempMark.markY.length));
                    tail = tail.replace("___len___", (tempMark.markX.length + tempMark.markY.length) * 4);
                    tail = tail.replace("___PatternOnColorCIELabValue___", "" + SetGraphicColor(PatientMark[n].color));
                    tail = tail.replace("___GraphicType___", "POLYLINE");
                    tail = setTag(tail, "NumberOfGraphicPoints", (tempMark.markX.length + tempMark.markY.length) / 2, true);
                    if (tempMark.RotationAngle && tempMark.RotationPoint) {
                        var rotation = ("" + Graphic_format_rotation).replace("___RotationAngle___", tempMark.RotationAngle);
                        rotation = rotation.replace("___RotationPoint___", "" + tempMark.RotationPoint[0] + "\\" + tempMark.RotationPoint[1]);
                        tail = tail.replace("___rotation___", rotation);
                    } else {
                        tail = tail.replace("___rotation___", "");
                    }
                    tail_list += tail;
                } else if (PatientMark[n].mark[m].type == "CIRCLE") {
                    let tail = "" + Graphic_format_tail;
                    var tempMark = PatientMark[n].mark[m];
                    var mark_xy = "";
                    for (var o = 0; o < tempMark.markX.length; o += 1) {
                        var tempX = 0,
                            tempY = 0;
                        [tempX, tempY] = [tempMark.markX[o], tempMark.markY[o]];
                        tempX = parseInt(tempX) + ".0123";
                        tempY = parseInt(tempY) + ".0123";
                        if (o != 0) mark_xy += "\\";
                        mark_xy += tempX + "\\" + tempY;
                    }
                    tail = tail.replace("___rotation___", "");
                    tail = tail.replace("___GraphicData___", mark_xy);
                    tail = tail.replace("___vm___", "4");
                    tail = tail.replace("___len___", (tempMark.markX.length + tempMark.markY.length) * 4);
                   // var color = getRGBFrom0xFF(PatientMark[n].color);
                    tail = tail.replace("___PatternOnColorCIELabValue___", "" + SetGraphicColor(PatientMark[n].color));
                    //tail = tail.replace("___PatternOnColorCIELabValue___", "" + color[0] + "\\" + color[1] + "\\" + color[2], true);
                    tail = tail.replace("___GraphicType___", "CIRCLE");
                    tail = setTag(tail, "NumberOfGraphicPoints", (tempMark.markX.length + tempMark.markY.length) / 2, true);
                    tail_list += tail;
                }
                var date = new Date();

                function zero(num, Milliseconds) {
                    if (Milliseconds) {
                        if (num < 10) return "" + "00" + num;
                        else if (num < 100) return "" + "0" + num;
                        return "" + num;
                    }
                    return "" + (num < 10 ? '0' : '') + num;
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
                    temp = setTag(temp, "ReferencedSeriesInstanceUID", Patient.Study[i].Series[j].SeriesUID, true);
                    temp = setTag(temp, "AccessionNumber", GetViewport().AccessionNumber, true);
                    temp = setTag(temp, "StudyDescription", GetViewport().StudyDescription, true);
                    temp = setTag(temp, "StudyID", GetViewport().StudyID, true);
                    temp = temp.replace("___PresentationCreationDate___", "" + date.getFullYear() + zero(date.getMonth() + 1) + zero(date.getDate())); // 20200210
                    temp = temp.replace("___PresentationCreationTime___", "" + zero(date.getHours() + 1) + zero(date.getMinutes()) + zero(date.getSeconds()) + "." + zero(date.getMilliseconds(), true)); // 093348.775
                }
            }
        }
    }
    temp = temp.replace("___item___", tail_list);
    Graphic_format_object_list.push(temp);
}