window.addEventListener("load", function (event) {

    getByid("GspsTypeSelect").onchange = function () {
        displayMark(NowResize, null, null, null, viewportNumber);
    }

    getByid("writeGSPS").onclick = function () {
        if (imgInvalid(this)) return;
        cancelTools();
        openWriteGSPS = !openWriteGSPS;
        img2darkByClass("GSPS", !openWriteGSPS);
        this.src = openWriteGSPS == true ? '../image/icon/black/gsps_on.png' : '../image/icon/black/gsps_off.png';
        if (openWriteGSPS == true) {
            getByid('GspsStyleDiv').style.display = '';
            set_BL_model('writegsps');
            writegsps();
        }
        else getByid('GspsStyleDiv').style.display = 'none';
        displayMark(NowResize, null, null, null, viewportNumber);
        if (openWriteGSPS == true) return;
        // else GSPS_now_choose = null;

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
        set_GSPS_context();
        if (ConfigLog.Xml2Dcm.enableXml2Dcm == true) download2(String(get_Graphic_context()), "" + CreateRandom(), 'text/plain');
        else download(String(get_Graphic_context()), 'filename_GSPS.xml', 'text/plain');
        //download(String(get_Graphic_context()), 'filename_GSPS.xml', 'text/plain');

        getByid('MouseOperation').click();
    }
});

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
    let index = SearchUid2Index(GetViewport().alt);
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

function writegsps() {
    if (BL_mode == 'writegsps') {
        DeleteMouseEvent();

        Mousedown = function (e) {
            if (e.which == 1) MouseDownCheck = true;
            else if (e.which == 3) rightMouseDown = true;
            var currX = getCurrPoint(e)[0];
            var currY = getCurrPoint(e)[1];
            windowMouseX = GetmouseX(e);
            windowMouseY = GetmouseY(e);
            GetViewport().originalPointX = getCurrPoint(e)[0];
            GetViewport().originalPointY = getCurrPoint(e)[1];
            if (!rightMouseDown && getByid("GspsPOLYLINE").selected == true) {
                var currX = getCurrPoint(e)[0];
                var currY = getCurrPoint(e)[1];
                if (Graphic_pounch(currX, currY) == true) {
                    displayMark(NowResize, null, null, null, undefined);
                };
            }
        };

        Mousemove = function (e) {
            var currX = getCurrPoint(e)[0];
            var currY = getCurrPoint(e)[1];
            var labelXY = getClass('labelXY'); {
                let angel2point = rotateCalculation(e);
                labelXY[viewportNumber].innerText = "X: " + parseInt(angel2point[0]) + " Y: " + parseInt(angel2point[1]);
            }
            // if (rightMouseDown == true) {
            //      scale_size(e, currX, currY);
            // }

            if (openLink == true) {
                for (var i = 0; i < Viewport_Total; i++) {
                    GetViewport(i).newMousePointX = GetViewport().newMousePointX;
                    GetViewport(i).newMousePointY = GetViewport().newMousePointY;
                }
            }
            putLabel();
            for (var i = 0; i < Viewport_Total; i++)
                displayRular(i);

            if (MouseDownCheck == true && getByid("GspsCIRCLE").selected == true) { //flag
                let Uid = SearchNowUid();
                var dcm = {};
                dcm.study = Uid.studyuid;
                dcm.series = Uid.sreiesuid;
                dcm.color = GetGSPSColor();
                dcm.mark = [];
                dcm.showName = getByid("GspsName").value; //"" + getByid("xmlMarkNameText").value;
                dcm.hideName = dcm.showName;
                dcm.mark.push({});
                dcm.sop = Uid.sopuid;
                var DcmMarkLength = dcm.mark.length - 1;
                dcm.mark[DcmMarkLength].type = "CIRCLE";
                dcm.mark[DcmMarkLength].markX = [];
                dcm.mark[DcmMarkLength].markY = [];
                dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
                dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
                dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX + Math.sqrt(Math.pow(Math.abs(GetViewport().originalPointX - currX), 2) + Math.pow(Math.abs(GetViewport().originalPointY - currY), 2) / 2));
                dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY + Math.sqrt(Math.pow(Math.abs(GetViewport().originalPointX - currX), 2) + Math.pow(Math.abs(GetViewport().originalPointY - currY), 2) / 2));
                PatientMark.push(dcm);
                refreshMark(dcm);
                for (var i = 0; i < Viewport_Total; i++)
                    displayMark(NowResize, null, null, null, i);
                displayAngelRular();
                PatientMark.splice(PatientMark.indexOf(dcm), 1);
            }
            if (MouseDownCheck == true && getByid("GspsLINE").selected == true) {
                let Uid = SearchNowUid();
                var dcm = {};
                dcm.study = Uid.studyuid;
                dcm.series = Uid.sreiesuid;
                dcm.color = GetGSPSColor();
                dcm.mark = [];
                dcm.showName = "" + getByid("GspsName").value; //"" + getByid("xmlMarkNameText").value;
                dcm.hideName = dcm.showName;
                dcm.mark.push({});
                dcm.sop = Uid.sopuid;
                var DcmMarkLength = dcm.mark.length - 1;
                dcm.mark[DcmMarkLength].type = "POLYLINE";
                dcm.mark[DcmMarkLength].markX = [];
                dcm.mark[DcmMarkLength].markY = [];
                dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
                dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
                dcm.mark[DcmMarkLength].markY.push(currY);
                dcm.mark[DcmMarkLength].markX.push(currX);
                PatientMark.push(dcm);
                refreshMark(dcm);
                for (var i = 0; i < Viewport_Total; i++)
                    displayMark(NowResize, null, null, null, i);
                displayAngelRular();
                PatientMark.splice(PatientMark.indexOf(dcm), 1);
            }
            if ((openWriteGraphic == true || (getByid("GspsPOLYLINE").selected == true)) && (MouseDownCheck == true || rightMouseDown == true)) {
                if (currX <= 0)
                    currX = 0;
                if (currY <= 0)
                    currY = 0;
                if (currX > GetViewport().imageWidth)
                    currX = GetViewport().imageWidth;
                if (currY > GetViewport().imageHeight)
                    currY = GetViewport().imageHeight;
                if (GetViewport().originalPointX <= 0)
                    GetViewport().originalPointX = 0;
                if (GetViewport().originalPointY <= 0)
                    GetViewport().originalPointY = 0;
                if (GetViewport().originalPointX > GetViewport().imageWidth)
                    GetViewport().originalPointX = GetViewport().imageWidth;
                if (GetViewport().originalPointY > GetViewport().imageHeight)
                    GetViewport().originalPointY = GetViewport().imageHeight;
                if (!Graphic_now_choose && MouseDownCheck == true) {
                    let Uid = SearchNowUid();
                    var dcm = {};
                    dcm.study = Uid.studyuid;
                    dcm.series = Uid.sreiesuid;
                    dcm.color = GetGraphicColor();
                    if (getByid("GspsPOLYLINE").selected == true) dcm.color = GetGSPSColor();
                    dcm.mark = [];
                    dcm.showName = GetGraphicName(); //"" + getByid("xmlMarkNameText").value;
                    dcm.hideName = dcm.showName;
                    if (getByid("GspsPOLYLINE").selected == true) dcm.showName = getByid("GspsName").value;
                    dcm.mark.push({});
                    dcm.sop = Uid.sopuid;
                    var DcmMarkLength = dcm.mark.length - 1;
                    dcm.mark[DcmMarkLength].type = "POLYLINE";
                    dcm.mark[DcmMarkLength].markX = [];
                    dcm.mark[DcmMarkLength].markY = [];
                    dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
                    dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
                    dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
                    dcm.mark[DcmMarkLength].markY.push(currY);
                    dcm.mark[DcmMarkLength].markX.push(currX);
                    dcm.mark[DcmMarkLength].markY.push(currY);
                    dcm.mark[DcmMarkLength].markX.push(currX);
                    dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
                    dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
                    dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
                    PatientMark.push(dcm);
                    refreshMark(dcm);
                    for (var i = 0; i < Viewport_Total; i++)
                        displayMark(NowResize, null, null, null, i);
                    displayAngelRular();
                    PatientMark.splice(PatientMark.indexOf(dcm), 1);
                } else {
                    if (rightMouseDown == true) {
                        if (Math.abs(currY - GetViewport().originalPointY) > Math.abs(currX - GetViewport().originalPointX)) {
                            if (!Graphic_now_choose.mark || !Graphic_now_choose.mark.RotationAngle) Graphic_now_choose.mark.RotationAngle = 0;
                            if (currY < GetViewport().originalPointY - 1)
                                Graphic_now_choose.mark.RotationAngle += parseInt((GetViewport().originalPointY - currY) / 3);
                            else if (currY > GetViewport().originalPointY + 1)
                                Graphic_now_choose.mark.RotationAngle -= parseInt((currY - GetViewport().originalPointY) / 3);

                        } else if (Math.abs(currX - GetViewport().originalPointX) > Math.abs(currY - GetViewport().originalPointY)) {
                            if (!Graphic_now_choose.mark || !Graphic_now_choose.mark.RotationAngle) Graphic_now_choose.mark.RotationAngle = 0;
                            if (currX < GetViewport().originalPointX - 1)
                                Graphic_now_choose.mark.RotationAngle += parseInt((GetViewport().originalPointX - currX) / 3);
                            else if (currX > GetViewport().originalPointX + 1)
                                Graphic_now_choose.mark.RotationAngle -= parseInt((currX - GetViewport().originalPointX) / 3);
                        }
                        if (Graphic_now_choose.mark.RotationAngle > 360) Graphic_now_choose.mark.RotationAngle -= 360;
                        if (Graphic_now_choose.mark.RotationAngle < 0) Graphic_now_choose.mark.RotationAngle += 360;
                        GetViewport().originalPointX = currX;
                        GetViewport().originalPointY = currY;
                    } else if (MouseDownCheck == true) {
                        var Graphic_point = Graphic_now_choose.point;
                        if (Graphic_now_choose.value == "up") {
                            for (var p = 0; p < Graphic_point.length; p++) {
                                Graphic_now_choose.mark.markY[Graphic_point[p]] = currY;
                            }
                        } else if (Graphic_now_choose.value == "down") {
                            for (var p = 0; p < Graphic_point.length; p++) {
                                Graphic_now_choose.mark.markY[Graphic_point[p]] = currY;
                            }
                        } else if (Graphic_now_choose.value == "left") {
                            for (var p = 0; p < Graphic_point.length; p++) {
                                Graphic_now_choose.mark.markX[Graphic_point[p]] = currX;
                            }
                        } else if (Graphic_now_choose.value == "right") {
                            for (var p = 0; p < Graphic_point.length; p++) {
                                Graphic_now_choose.mark.markX[Graphic_point[p]] = currX;
                            }
                        }
                    }
                    if (Graphic_now_choose.mark.RotationAngle >= 0)
                        Graphic_now_choose.mark.RotationPoint = getRotationPoint(Graphic_now_choose.mark, true);
                    //Graphic_now_choose.mark.RotationPoint = [Graphic_now_choose.middle[0], Graphic_now_choose.middle[1]];
                    displayMark(NowResize, null, null, null, viewportNumber);
                }
            }
        }
        Mouseup = function (e) {
            var currX = getCurrPoint(e)[0];
            var currY = getCurrPoint(e)[1];
            MouseDownCheck = false;
            rightMouseDown = false;
            if (getByid("GspsLINE").selected == true) {
                let Uid = SearchNowUid();
                var dcm = {};
                dcm.study = Uid.studyuid;
                dcm.series = Uid.sreiesuid;
                dcm.color = GetGSPSColor();
                dcm.mark = [];
                dcm.showName = "" + getByid("xmlMarkNameText").value; //"" + getByid("xmlMarkNameText").value;
                dcm.hideName = dcm.showName;
                dcm.mark.push({});
                dcm.sop = Uid.sopuid;
                var DcmMarkLength = dcm.mark.length - 1;
                dcm.mark[DcmMarkLength].type = "POLYLINE";
                dcm.mark[DcmMarkLength].markX = [];
                dcm.mark[DcmMarkLength].markY = [];
                dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
                dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
                dcm.mark[DcmMarkLength].markY.push(currY);
                dcm.mark[DcmMarkLength].markX.push(currX);
                PatientMark.push(dcm);
                refreshMark(dcm);
                for (var i = 0; i < Viewport_Total; i++)
                    displayMark(NowResize, null, null, null, i);
                displayAngelRular();
                Graphic_now_choose = {
                    reference: dcm
                };
            } //flag
            if (getByid("GspsCIRCLE").selected == true) {
                let Uid = SearchNowUid();
                var dcm = {};
                dcm.study = Uid.studyuid;
                dcm.series = Uid.sreiesuid;
                dcm.color = GetGSPSColor();
                dcm.mark = [];
                dcm.showName = getByid("GspsName").value;
                dcm.hideName = dcm.showName;
                dcm.mark.push({});
                dcm.sop = Uid.sopuid;
                var DcmMarkLength = dcm.mark.length - 1;
                dcm.mark[DcmMarkLength].type = "CIRCLE";
                dcm.mark[DcmMarkLength].markX = [];
                dcm.mark[DcmMarkLength].markY = [];
                dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
                dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
                dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX + Math.sqrt(Math.pow(Math.abs(GetViewport().originalPointX - currX), 2) + Math.pow(Math.abs(GetViewport().originalPointY - currY), 2) / 2));
                dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY + Math.sqrt(Math.pow(Math.abs(GetViewport().originalPointX - currX), 2) + Math.pow(Math.abs(GetViewport().originalPointY - currY), 2) / 2));
                PatientMark.push(dcm);
                refreshMark(dcm);
                for (var i = 0; i < Viewport_Total; i++)
                    displayMark(NowResize, null, null, null, i);
                displayAngelRular();
                Graphic_now_choose = {
                    reference: dcm
                };
            }
            if (openWriteGraphic == true && !Graphic_now_choose || (getByid("GspsPOLYLINE").selected == true && !Graphic_now_choose)) {
                if (currX <= 0)
                    currX = 0;
                if (currY <= 0)
                    currY = 0;
                if (currX > GetViewport().imageWidth)
                    currX = GetViewport().imageWidth;
                if (currY > GetViewport().imageHeight)
                    currY = GetViewport().imageHeight;
                if (GetViewport().originalPointX <= 0)
                    GetViewport().originalPointX = 0;
                if (GetViewport().originalPointY <= 0)
                    GetViewport().originalPointY = 0;
                if (GetViewport().originalPointX > GetViewport().imageWidth)
                    GetViewport().originalPointX = GetViewport().imageWidth;
                if (GetViewport().originalPointY > GetViewport().imageHeight)
                    GetViewport().originalPointY = GetViewport().imageHeight;
                let Uid = SearchNowUid();
                var dcm = {};
                dcm.study = Uid.studyuid;
                dcm.series = Uid.sreiesuid;
                dcm.color = GetGraphicColor();
                if (getByid("GspsPOLYLINE").selected == true) dcm.color = GetGSPSColor();
                dcm.mark = [];
                dcm.showName = GetGraphicName(); //"" + getByid("xmlMarkNameText").value;
                dcm.hideName = dcm.showName;
                if (getByid("GspsPOLYLINE").selected == true) dcm.showName = getByid("GspsName").value;

                dcm.mark.push({});
                dcm.sop = Uid.sopuid;
                var DcmMarkLength = dcm.mark.length - 1;
                dcm.mark[DcmMarkLength].type = "POLYLINE";
                dcm.mark[DcmMarkLength].markX = [];
                dcm.mark[DcmMarkLength].markY = [];
                dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
                dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
                dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
                dcm.mark[DcmMarkLength].markY.push(currY);
                dcm.mark[DcmMarkLength].markX.push(currX);
                dcm.mark[DcmMarkLength].markY.push(currY);
                dcm.mark[DcmMarkLength].markX.push(currX);
                dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
                dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
                dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
                PatientMark.push(dcm);
                Graphic_pounch(currX, (currY + GetViewport().originalPointY) / 2, dcm);
                for (var i = 0; i < Viewport_Total; i++)
                    displayMark(NowResize, null, null, null, i);
                displayAngelRular();
                //set_Graphic_context();
                refreshMark(dcm);
            }
        }
    }
    AddMouseEvent();
}