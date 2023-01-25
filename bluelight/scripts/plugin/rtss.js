//代表RTSS標記模式為開啟狀態
var openWriteRTSS = false;

function loadWriteRTSS() {
    var span = document.createElement("SPAN")
    span.innerHTML =
        ` <img class="img RTSS" alt="writeRTSS" id="writeRTSS" src="../image/icon/black/rtssdraw_OFF.png" width="50" height="50">`;
    getByid("icon-list").appendChild(span);

    var span = document.createElement("SPAN")
    span.innerHTML =
        `<div id="RtssDiv"
    style="background-color:#30306044;display:none;float:right;display: none;flex-direction: column;position: absolute;right:15px;top:100px;z-index: 20;"
    width="100">
    <div style="background-color:#889292;">
      <font color="white">Color：</font>
      <select id="RTSScolorSelect" style="background-color:#929292;font-weight:bold;font-size:16px;">
        <option class="RTSSColorSelectOption" id="RTSSBlackSelect" style="color: #000000;font-weight:bold;">Black
        </option>
        <option class="RTSSColorSelectOption" id="RTSSBlueSelect" style="color: #0000FF;font-weight:bold;"
          selected="selected">Blue</option>
        <option class="RTSSColorSelectOption" id="RTSSCyanSelect" style="color: #00FFFF;font-weight:bold;">Cyan
        </option>
        <option class="RTSSColorSelectOption" id="RTSSGreenSelect" style="color: #00FF00;font-weight:bold;">Green
        </option>
        <option class="RTSSColorSelectOption" id="RTSSMagentaSelect" style="color: #FF00FF;font-weight:bold;">
          Magenta</option>
        <option class="RTSSColorSelectOption" id="RTSSRedSelect" style="color: #FF0000;font-weight:bold;">Red
        </option>
        <option class="RTSSColorSelectOption" id="RTSSYellowSelect" style="color: #FFFF00;font-weight:bold;"> Yellow
        </option>
        <option class="RTSSColorSelectOption" id="RTSSWhiteSelect" style="color: #FFFFFF;font-weight:bold;">White
        </option>
      </select>
      <br />
      <font color="white">ROIName：</font><input type="text" id="textROIName" value="ROIName" size="8" />
    </div>
    <br />
    <font color="white">StructureSetLabel：</font><input type="text" id="textStructureSetLabel" value="STRUCTURE SET"
      size="15" />
    <font color="white">StructureSetName：</font><input type="text" id="textStructureSetName"
      value="StructureSetName" size="14" />
    <font color="white">StructureSetDescription：</font><input type="text" id="textStructureSetDescription"
      value="RT:" size="8" />
    <font color="white">ObservationNumber：</font><input type="text" id="textObservationNumber" value="1" size="2" />
    <font color="white">ReferencedROINumber：</font><input type="text" id="textReferencedROINumber" value="1"
      size="2" />
    <font color="white">RTROIInterpretedType：</font><input type="text" id="textRTROIInterpretedType" value="ORGAN"
      size="8" />
  </div>`
    getByid("form-group").appendChild(span);
    getByid("RtssDiv").style.display = "none";
}
loadWriteRTSS();

function getColorFromRGB(str) {
    return str.split("(")[1].split(")")[0].split(",");
}

window.addEventListener('keydown', (KeyboardKeys) => {
    var key = KeyboardKeys.which
    if (openWriteRTSS == true && (key === 46 || key === 110)) {
        var reference;
        for (var m = 0; m < PatientMark.length; m++) {
            if (PatientMark[m].showName == getByid('textROIName').value) {
                reference = PatientMark[m];
                break;
            }
        }
        PatientMark.splice(PatientMark.indexOf(reference), 1);
        displayMark();

        refreshMarkFromSop(GetNowUid().sop);
    }
});

getByid("writeRTSS").onclick = function () {
    if (this.enable == false) return;
    cancelTools();
    openWriteRTSS = !openWriteRTSS;
    img2darkByClass("RTSS", !openWriteRTSS);
    openLeftImgClick = !openWriteRTSS;
    this.src = openWriteRTSS == true ? '../image/icon/black/rtssdraw_ON.png' : '../image/icon/black/rtssdraw_OFF.png';
    if (openWriteRTSS == true) {
        getByid('RtssDiv').style.display = 'flex';
        set_BL_model('writertss');
        writertss();
    }
    else getByid('RtssDiv').style.display = 'none';
    displayMark();
    if (openWriteRTSS == true) return;
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
    set_RTSS_context();
    if (ConfigLog.Xml2Dcm.enableXml2Dcm == true) download2(String(get_RTSS_context()), "" + CreateSecurePassword(), 'text/plain');
    else download(String(get_RTSS_context()), 'filename_RTSS.xml', 'text/plain');
    //download(String(get_RTSS_context()), 'filename_RTSS.xml', 'text/plain');
    getByid('MouseOperation').click();
}

var RTSS_format =
    `<?xml version="1.0" encoding="UTF-8"?>
    <file-format>
        <meta-header xfer="1.2.840.10008.1.2.1" name="Little Endian Explicit">
            <element tag="0002,0000" vr="UL" vm="1" len="___FileMetaInformationGroupLength(len)___" name="FileMetaInformationGroupLength">___FileMetaInformationGroupLength___</element>
            <element tag="0002,0001" vr="OB" vm="1" len="2" name="FileMetaInformationVersion" binary="hidden"></element>
            <element tag="0002,0002" vr="UI" vm="1" len="30" name="MediaStorageSOPClassUID">1.2.840.10008.5.1.4.1.1.481.3</element>
            <element tag="0002,0003" vr="UI" vm="1" len="___SOPInstanceUID(len)___" name="MediaStorageSOPInstanceUID">___SOPInstanceUID___</element>
            <element tag="0002,0010" vr="UI" vm="1" len="20" name="TransferSyntaxUID">1.2.840.10008.1.2.1</element>
            <element tag="0002,0012" vr="UI" vm="1" len="24" name="ImplementationClassUID">2.16.886.119.102568.9</element>
            <element tag="0002,0013" vr="SH" vm="1" len="10" name="ImplementationVersionName">BlueLight</element>
        </meta-header>
        <data-set xfer="1.2.840.10008.1.2.1" name="Little Endian Explicit">
            <element tag="0004,1430" vr="CS" vm="1" len="6" name="DirectoryRecordType">IMAGE</element>
            <element tag="0008,0016" vr="UI" vm="1" len="30" name="SOPClassUID">1.2.840.10008.5.1.4.1.1.481.3</element>
            <element tag="0008,0018" vr="UI" vm="1" len="___SOPInstanceUID(len)___" name="SOPInstanceUID">___SOPInstanceUID___</element>
            <element tag="0008,0020" vr="DA" vm="1" len="8" name="StudyDate">___StudyDate___</element>
            <element tag="0008,0030" vr="TM" vm="1" len="6" name="StudyTime">___StudyTime___</element>
            <element tag="0008,0050" vr="SH" vm="1" len="___AccessionNumber(len)___" name="AccessionNumber">___AccessionNumber___</element>
            <element tag="0008,0060" vr="CS" vm="1" len="8" name="Modality">RTSTRUCT</element>
            <element tag="0008,0061" vr="CS" vm="1" len="___ModalitiesInStudy(len)___" name="ModalitiesInStudy">___ModalitiesInStudy___</element>
            <element tag="0008,0070" vr="LO" vm="1" len="___Manufacturer(len)___" name="Manufacturer">___Manufacturer___</element>
            <element tag="0008,0080" vr="LO" vm="1" len="___InstitutionName(len)___" name="InstitutionName">___InstitutionName___</element>
            <element tag="0008,0081" vr="ST" vm="1" len="___InstitutionAddress(len)___" name="InstitutionAddress">___InstitutionAddress___</element>
            <element tag="0008,0090" vr="PN" vm="1" len="___ReferringPhysicianName(len)___" name="ReferringPhysicianName">___ReferringPhysicianName___</element>
            <element tag="0008,1010" vr="SH" vm="1" len="___StationName(len)___" name="StationName">___StationName___</element>
            <element tag="0008,1030" vr="LO" vm="1" len="___StudyDescription(len)___" name="StudyDescription">___StudyDescription___</element>
            <element tag="0008,103e" vr="LO" vm="1" len="___SeriesDescription(len)___" name="SeriesDescription">___SeriesDescription___</element>
            <sequence tag="0008,1110" vr="SQ" card="1" name="ReferencedStudySequence">
                <item card="2">
                    <element tag="0008,1150" vr="UI" vm="1" len="24" name="ReferencedSOPClassUID">1.2.840.10008.3.1.2.3.1</element>
                    <element tag="0008,1155" vr="UI" vm="1" len="___ReferencedSOPInstanceUID(len)___" name="ReferencedSOPInstanceUID">___ReferencedSOPInstanceUID___</element>
                </item>
            </sequence>
            <element tag="0010,0010" vr="PN" vm="1" len="___PatientName(len)___" name="PatientName">___PatientName___</element>
            <element tag="0010,0020" vr="LO" vm="1" len="___PatientID(len)___" name="PatientID">___PatientID___</element>
            <element tag="0020,000d" vr="UI" vm="1" len="___StudyInstanceUID(len)___" name="StudyInstanceUID">___StudyInstanceUID___</element>
            <element tag="0020,000e" vr="UI" vm="1" len="___SeriesInstanceUID(len)___" name="SeriesInstanceUID">___SeriesInstanceUID___</element>
            <element tag="0020,0010" vr="SH" vm="1" len="___StudyID(len)___" name="StudyID">___StudyID___</element>
            <element tag="0020,0011" vr="IS" vm="1" len="___SeriesNumber(len)___" name="SeriesNumber">___SeriesNumber___</element>
            <element tag="0032,1032" vr="PN" vm="1" len="___RequestingPhysician(len)___" name="RequestingPhysician">___RequestingPhysician___</element>
            <element tag="01e1,1040" vr="UI" vm="1" len="___StudyInstanceUID(len)___" name="Unknown Tag &amp; Data">___StudyInstanceUID___</element>
            <element tag="3006,0002" vr="SH" vm="1" len="___StructureSetLabel(len)___" name="StructureSetLabel">___StructureSetLabel___</element>
            <element tag="3006,0004" vr="LO" vm="1" len="___StructureSetName(len)___" name="StructureSetName">___StructureSetName___</element>
            <element tag="3006,0006" vr="ST" vm="1" len="___StructureSetDescription(len)___" name="StructureSetDescription">___StructureSetDescription___</element>
            <element tag="3006,0008" vr="DA" vm="1" len="8" name="StructureSetDate">___StudyDate___</element>
            <element tag="3006,0009" vr="TM" vm="1" len="14" name="StructureSetTime">___StudyTime___</element>
            <sequence tag="3006,0010" vr="SQ" card="1" name="ReferencedFrameOfReferenceSequence">
                <item card="2">
                    <element tag="0020,0052" vr="UI" vm="1" len="54" name="FrameOfReferenceUID">1.2.840.113619.2.222.3596.375084.15213.1536104832.466</element>
                    <sequence tag="3006,0012" vr="SQ" card="1" name="RTReferencedStudySequence">
                        <item card="3">
                            <element tag="0008,1150" vr="UI" vm="1" len="26" name="ReferencedSOPClassUID">1.2.840.10008.5.1.4.1.1.4</element>
                            <element tag="0008,1155" vr="UI" vm="1" len="___ReferencedStudyInstanceUID(len)___" name="ReferencedSOPInstanceUID">___ReferencedStudyInstanceUID___</element>
                            <sequence tag="3006,0014" vr="SQ" card="1" name="RTReferencedSeriesSequence">
                                <item card="2">
                                    <element tag="0020,000e" vr="UI" vm="1" len="___ReferencedSeriesInstanceUID(len)___" name="SeriesInstanceUID">___ReferencedSeriesInstanceUID___</element>
                                    <sequence tag="3006,0016" vr="SQ" card="24" name="ContourImageSequence">
___item2___
                                    </sequence>
                                </item>
                            </sequence>
                        </item>
                    </sequence>
                </item>
            </sequence>
            <sequence tag="3006,0020" vr="SQ" card="1" name="StructureSetROISequence">                 
___item4___               
            </sequence>
            <sequence tag="3006,0039" vr="SQ" card="1" name="ROIContourSequence">
            <item card="3">
            <element tag="3006,002a" vr="IS" vm="3" len="___ROIDisplayColor(len)___" name="ROIDisplayColor">___ROIDisplayColor___</element>
                <sequence tag="3006,0040" vr="SQ" card="5" name="ContourSequence">      
                    
___item6___
                </sequence>
            <element tag="3006,0084" vr="IS" vm="1" len="2" name="ReferencedROINumber">1</element>
            </item>      

            </sequence>
            <sequence tag="3006,0080" vr="SQ" card="1" name="RTROIObservationsSequence">
                <item card="3">
                    <element tag="3006,0082" vr="IS" vm="1" len="___ObservationNumber(len)___" name="ObservationNumber">___ObservationNumber___</element>
                    <element tag="3006,0084" vr="IS" vm="1" len="___ReferencedROINumber(len)___" name="ReferencedROINumber">___ReferencedROINumber___</element>
                    <element tag="3006,00a4" vr="CS" vm="1" len="___RTROIInterpretedType(len)___" name="RTROIInterpretedType">___RTROIInterpretedType___</element>
                </item>
            </sequence>
        </data-set>
    </file-format>
    `;

var RTSS_format_object_list = [];
//有沒有標記都有
var RTSS_format_tail_2 = `
                                        <item card="2">
                                            <element tag="0008,1150" vr="UI" vm="1" len="26" name="ReferencedSOPClassUID">1.2.840.10008.5.1.4.1.1.4</element>
                                            <element tag="0008,1155" vr="UI" vm="1" len="___ReferencedSOPInstanceUID(len)___" name="ReferencedSOPInstanceUID">___ReferencedSOPInstanceUID___</element>
                                        </item>`
var RTSS_format_tail_4 = `
                <item card="4">
                    <element tag="3006,0022" vr="IS" vm="1" len="2" name="ROINumber">1</element>
                    <element tag="3006,0024" vr="UI" vm="1" len="2" name="ReferencedFrameOfReferenceUID">0</element>
                    <element tag="3006,0026" vr="LO" vm="1" len="___ROIName(len)___" name="ROIName">___ROIName___</element>
                    <element tag="3006,0036" vr="CS" vm="1" len="6" name="ROIGenerationAlgorithm">MANUAL</element>
                </item>
`
var RTSS_format_tail_6 = `

                            <item card="6">
                                <sequence tag="3006,0016" vr="SQ" card="1" name="ContourImageSequence">
                                    <item card="2">
                                        <element tag="0008,1150" vr="UI" vm="1" len="26" name="ReferencedSOPClassUID">1.2.840.10008.5.1.4.1.1.4</element>
                                        <element tag="0008,1155" vr="UI" vm="1" len="___ReferencedSOPInstanceUID(len)___" name="ReferencedSOPInstanceUID">___ReferencedSOPInstanceUID___</element>
                                    </item>
                                </sequence>
                                <element tag="3006,0042" vr="CS" vm="1" len="14" name="ContourGeometricType">CLOSED_PLANAR</element>
                                <element tag="3006,0044" vr="DS" vm="1" len="2" name="ContourSlabThickness">5</element>
                                <element tag="3006,0046" vr="IS" vm="1" len="___NumberOfContourPoints(len)___" name="NumberOfContourPoints">___NumberOfContourPoints___</element>
                                <element tag="3006,0048" vr="IS" vm="1" len="___ContourNumber(len)___" name="ContourNumber">___ContourNumber___</element>
                                <element tag="3006,0050" vr="DS" vm="___vm___" len="___len___" name="ContourData">___ContourData___</element>
                            </item>
                        `;
var RTSS_now_choose = null;
var temp_xml_format = "";


function RTSS_pounch(currX, currY, dcm) {
    let block_size = getMarkSize(GetViewportMark(), false) * 4;
    let index = SearchUid2Index(GetViewport().sop);
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

function set_RTSS_context() {
    RTSS_format_object_list = []
    let temp = ""
    let tail6_list = "";
    let tail2_list = "";
    let tail4_list = ";"
    var viewport = GetViewport();
    let index = SearchUid2Index(viewport.sop);
    let i = index[0],
        j = index[1],
        k = index[2];
    temp = "" + RTSS_format;

    function setTag(temp, replace, str, len) {
        str = Null2Empty(str);
        str = "" + str;
        temp = temp.replace("___" + replace + "___", "" + str);
        var length = ("" + str).length;
        if (length % 2 != 0) length++;
        if (len == true) temp = temp.replace("___" + replace + "(len)___", length);
        return temp;
    }
    var sopList = getAllSop();
    for (var s = 0; s < sopList.length; s++) {
        let tail2 = "" + RTSS_format_tail_2;
        // tail2 = tail2.replace("___ReferencedSOPInstanceUID___", sopList[s]);
        tail2 = setTag(tail2, "ReferencedSOPInstanceUID", sopList[s], true);
        tail2_list += tail2;
    }
    for (var n = 0; n < PatientMark.length; n++) {
        if (PatientMark[n].series == Patient.Study[i].Series[j].SeriesUID) {
            for (var m = 0; m < PatientMark[n].mark.length; m++) {
                if (PatientMark[n].mark[m].type == "RTSS") {
                    var tail6 = "" + RTSS_format_tail_6;
                    var tail4 = "" + RTSS_format_tail_4;
                    tail4 = setTag(tail4, "ROIName", PatientMark[n].showName, true);
                    var tempMark = PatientMark[n].mark[m];
                    var mark_xy = "";
                    for (var o = 0; o < tempMark.markX.length; o += 1) {
                        var tempX = 0,
                            tempY = 0;
                        [tempX, tempY] = [tempMark.markX[o], tempMark.markY[o]];
                        tempX = parseFloat(tempX);
                        tempY = parseFloat(tempY);
                        if (o != 0) mark_xy += "\\";
                        mark_xy += tempX + "\\" + tempY + "\\" + PatientMark[n].imagePositionZ;
                    }
                    tail6 = tail6.replace("___ContourData___", mark_xy);
                    tail6 = tail6.replace("___vm___", "" + (tempMark.markX.length * 3));
                    tail6 = tail6.replace("___len___", (tempMark.markX.length * 3 * 16));
                    tail6 = setTag(tail6, "NumberOfContourPoints", (tempMark.markX.length), true);
                    tail6 = setTag(tail6, "ContourNumber", n + 1, true);
                    tail6 = setTag(tail6, "ReferencedSOPInstanceUID", PatientMark[n].sop, true);
                    var color = getColorFromRGB(PatientMark[n].color);
                    tail6 = setTag(tail6, "ROIDisplayColor", "" + color[0] + "\\" + color[1] + "\\" + color[2], true);
                    //tail6 = tail6.replace("___ReferencedSOPInstanceUID___", PatientMark[n].sop);
                    //tail = tail.replace("___PatternOnColorCIELabValue___", "" + SetGraphicColor(PatientMark[n].color));
                    //tail = tail.replace("___GraphicType___", "POLYLINE"); 
                }
            }
            tail6_list += tail6;
            tail4_list += tail4;
        }
        var createSopUid = CreateUid("sop");
        var createSeriesUid = CreateUid("series");
        for (var c = 0; c < 5; c++) {
            temp = setTag(temp, "StudyDate", viewport.StudyDate, true);
            temp = setTag(temp, "StudyTime", viewport.StudyTime, true);
            temp = setTag(temp, "StudyInstanceUID", Patient.Study[i].StudyUID, true);
            temp = setTag(temp, "SeriesInstanceUID", createSeriesUid, true);
            temp = setTag(temp, "SOPInstanceUID", createSopUid, true);
            temp = setTag(temp, "PatientID", viewport.PatientID, true);
            temp = setTag(temp, "PatientName", viewport.PatientName, true);
            temp = setTag(temp, "ReferencedSOPInstanceUID", PatientMark[n].sop, true);
            temp = setTag(temp, "ReferencedSeriesInstanceUID", Patient.Study[i].Series[j].SeriesUID, true);
            temp = setTag(temp, "ReferencedStudyInstanceUID", Patient.Study[i].StudyUID, true);
            temp = setTag(temp, "AccessionNumber", viewport.AccessionNumber, true);
            temp = setTag(temp, "StudyDescription", viewport.StudyDescription, true);
            temp = setTag(temp, "StudyID", viewport.StudyID, true);

            temp = setTag(temp, "ModalitiesInStudy", viewport.ModalitiesInStudy, true);
            temp = setTag(temp, "Manufacturer", viewport.Manufacture, true);
            temp = setTag(temp, "InstitutionName", viewport.InstitutionName, true);
            temp = setTag(temp, "InstitutionAddress", viewport.InstitutionAddress, true);
            temp = setTag(temp, "ReferringPhysicianName", viewport.ReferringPhysicianName, true);
            temp = setTag(temp, "StationName", viewport.StationName, true);
            temp = setTag(temp, "SeriesDescription", viewport.SeriesDescription, true);
            temp = setTag(temp, "SeriesNumber", "" + viewport.SeriesNumber + "01", true);
            temp = setTag(temp, "RequestingPhysician", "" + viewport.RequestingPhysician, true);

            temp = setTag(temp, "StructureSetLabel", getByid('textStructureSetLabel').value, true);
            temp = setTag(temp, "StructureSetName", getByid('textStructureSetName').value, true);
            temp = setTag(temp, "StructureSetDescription", getByid('textStructureSetDescription').value, true);
            // temp = setTag(temp, "ROIName", getByid('textROIName').value, true);
            temp = setTag(temp, "ObservationNumber", getByid('textObservationNumber').value, true);
            temp = setTag(temp, "ReferencedROINumber", getByid('textReferencedROINumber').value, true);
            temp = setTag(temp, "RTROIInterpretedType", getByid('textRTROIInterpretedType').value, true);

            var color1 = [0, 0, 128];
            for (var co = 0; co < getClass("RTSSColorSelectOption").length; co++) {
                if (getClass("RTSSColorSelectOption")[co].selected == true) {
                    color1 = getColorFromRGB(getClass("RTSSColorSelectOption")[co].style.color);
                }
            }
            temp = setTag(temp, "ROIDisplayColor", "" + color1[0] + "\\" + color1[1] + "\\" + color1[2], true)

            temp = setTag(temp, "FileMetaInformationGroupLength", "" + ((8 * 5) + 12 + (2 + 30 + 20 + 24 + 8 + createSopUid.length)), true);
        }
    }

    temp = temp.replace("___item6___", tail6_list);
    temp = temp.replace("___item2___", tail2_list);
    temp = temp.replace("___item4___", tail4_list);
    RTSS_format_object_list.push(temp);
}

function get_RTSS_context() {
    var temp_str = "";
    for (var i = 0; i < RTSS_format_object_list.length; i++) {
        temp_str += RTSS_format_object_list[i];
    }
    return temp_str;
}

function writertss() {
    if (BL_mode == 'writertss') {
        DeleteMouseEvent();

        //return;
        Mousedown = function (e) {
            if (e.which == 1) MouseDownCheck = true;
            else if (e.which == 3) rightMouseDown = true;
            var currX = getCurrPoint(e)[0];
            var currY = getCurrPoint(e)[1];
            var viewport = GetViewport();
            windowMouseX = GetmouseX(e);
            windowMouseY = GetmouseY(e);
            viewport.originalPointX = getCurrPoint(e)[0];
            viewport.originalPointY = getCurrPoint(e)[1];
            if (!rightMouseDown) {
                var angle2point = rotateCalculation(e)
                var currX11 = Math.floor(angle2point[0]);
                var currY11 = Math.floor(angle2point[1]);
                var currX02 = currX11;
                var currY02 = currY11;

                if (viewport.imageOrientationX && viewport.imageOrientationY && viewport.imageOrientationZ) {
                    currX02 = (currX11 * viewport.imageOrientationX + currY11 * -viewport.imageOrientationY + 0);
                    currY02 = (currX11 * -viewport.imageOrientationX2 + currY11 * viewport.imageOrientationY2 + 0);
                    if ((viewport.openHorizontalFlip != viewport.openVerticalFlip)) {
                        currX02 = currX02 - (currX02 - currX11) * 2;
                        currY02 = currY02 - (currY02 - currY11) * 2;
                    }
                }
                currX02 = currX02 / viewport.PixelSpacingX + viewport.imagePositionX;
                currY02 = currY02 / viewport.PixelSpacingY + viewport.imagePositionY;
                let Uid = GetNowUid();
                var dcm = {};
                dcm.study = Uid.study;
                dcm.series = Uid.sreies;
                dcm.color = "rgb(0,0,128)";
                for (var co = 0; co < getClass("RTSSColorSelectOption").length; co++) {
                    if (getClass("RTSSColorSelectOption")[co].selected == true) {
                        dcm.color = getClass("RTSSColorSelectOption")[co].style.color;
                    }
                }

                dcm.imagePositionZ = viewport.imagePositionZ;
                dcm.mark = [];
                dcm.showName = getByid('textROIName').value; //"" + getByid("xmlMarkNameText").value;
                dcm.hideName = dcm.showName;
                dcm.mark.push({});
                dcm.sop = Uid.sop;
                var DcmMarkLength = dcm.mark.length - 1;
                dcm.mark[DcmMarkLength].type = "RTSS";
                dcm.mark[DcmMarkLength].markX = [];
                dcm.mark[DcmMarkLength].markY = [];
                dcm.mark[DcmMarkLength].markX.push(angle2point[0] - Math.abs(currX02 - angle2point[0]));
                dcm.mark[DcmMarkLength].markY.push(angle2point[1] - Math.abs(currY02 - angle2point[1]));
                PatientMark.push(dcm);
                refreshMark(dcm);
                RTSS_now_choose = dcm.mark[DcmMarkLength];
                for (var i = 0; i < Viewport_Total; i++)
                    displayMark(i);
            }
        };

        Mousemove = function (e) {
            var currX = getCurrPoint(e)[0];
            var currY = getCurrPoint(e)[1];
            var viewport = GetViewport();
            var labelXY = getClass('labelXY'); {
                let angle2point = rotateCalculation(e);
                labelXY[viewportNumber].innerText = "X: " + parseInt(angle2point[0]) + " Y: " + parseInt(angle2point[1]);
            }
            if (rightMouseDown == true) {
                scale_size(e, currX, currY);
            }

            if (openLink == true) {
                for (var i = 0; i < Viewport_Total; i++) {
                    GetViewport(i).newMousePointX = viewport.newMousePointX;
                    GetViewport(i).newMousePointY = viewport.newMousePointY;
                }
            }
            putLabel();
            for (var i = 0; i < Viewport_Total; i++)
                displayRular(i);
            if (!rightMouseDown && RTSS_now_choose) {
                let Uid = GetNowUid();
                var angle2point = rotateCalculation(e)
                var currX11 = Math.floor(angle2point[0]);
                var currY11 = Math.floor(angle2point[1]);
                var currX02 = currX11;
                var currY02 = currY11;

                if (viewport.imageOrientationX && viewport.imageOrientationY && viewport.imageOrientationZ) {
                    currX02 = (currX11 * viewport.imageOrientationX + currY11 * -viewport.imageOrientationY + 0);
                    currY02 = (currX11 * -viewport.imageOrientationX2 + currY11 * viewport.imageOrientationY2 + 0);
                    if ((viewport.openHorizontalFlip != viewport.openVerticalFlip)) {
                        currX02 = currX02 - (currX02 - currX11) * 2;
                        currY02 = currY02 - (currY02 - currY11) * 2;
                    }
                }
                currX02 = currX02 / viewport.PixelSpacingX + viewport.imagePositionX;
                currY02 = currY02 / viewport.PixelSpacingY + viewport.imagePositionY;
                // var DcmMarkLength = RTSS_now_choose.mark.length - 1;
                RTSS_now_choose.markX.push(angle2point[0] - Math.abs(currX02 - angle2point[0]));
                RTSS_now_choose.markY.push(angle2point[1] - Math.abs(currY02 - angle2point[1]));
                //PatientMark.push(RTSS_now_choose);
                refreshMark(Uid.sop);
                for (var i = 0; i < Viewport_Total; i++)
                    displayMark(i);
            }

        }
        Mouseup = function (e) {
            var currX = getCurrPoint(e)[0];
            var currY = getCurrPoint(e)[1];
            MouseDownCheck = false;
            rightMouseDown = false;
            if (RTSS_now_choose) {
                RTSS_now_choose = null;
            }
        }
        AddMouseEvent();
    }
}