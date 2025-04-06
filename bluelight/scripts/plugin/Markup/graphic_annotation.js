//代表GSPS標記模式為開啟狀態
var openWriteGSPS = false;
//代表Graphic Annotation標記模式為開啟狀態
var openWriteGraphic = false;

function loadMarkupPlugin() {
    if (getByid("MarkupImgParent")) return;
    var span = document.createElement("SPAN");
    span.id = "MarkupImgParent";
    span.innerHTML = `
     <img class="img" loading="lazy" altzhtw="3D" alt="3D" id="MarkupDrawerImg" src="../image/icon/lite/markup.png"
          width="50" height="50">
    <div id="MarkupDIv" class="drawer" style="position:absolute;left: 0;white-space:nowrap;z-index: 100;
    width: 500; display: none;background-color: black;">`;
    addIconSpan(span);
    getByid("MarkupDrawerImg").onclick = function () {
        if (this.enable == false) return;
        hideAllDrawer("MarkupDIv");
        invertDisplayById('MarkupDIv');
        if (getByid("MarkupDIv").style.display == "none") getByid("MarkupImgParent").style.position = "";
        else {
            getByid("MarkupImgParent").style.position = "relative";
            //onElementLeave();
        }
    }
}

function loadWriteGraphic() {
    loadMarkupPlugin();
    var span = document.createElement("SPAN")
    span.innerHTML =
        `<img class="img GSPS" alt="drawGSPS" id="drawGSPS" onmouseover="onElementOver(this);" onmouseleave="onElementLeave();" src="../image/icon/lite/GraphicDraw.png" width="50" height="50" style="display:none;" >
        <img class="img GSPS" alt="eraseGSPS" id="eraseGSPS" onmouseover="onElementOver(this);" onmouseleave="onElementLeave();" src="../image/icon/lite/b_Eraser.png" width="50" height="50" style="display:none;" >
        <img class="img GSPS" alt="exitGSPS" id="exitGSPS" onmouseover="onElementOver(this);" onmouseleave="onElementLeave();" src="../image/icon/lite/exit.png" width="50" height="50" style="display:none;" >
        <img class="img GSPS" alt="saveGSPS" id="saveGSPS" onmouseover="onElementOver(this);" onmouseleave="onElementLeave();" src="../image/icon/lite/download.png" width="50" height="50" style="display:none;" >`;

    addIconSpan(span);

    var span = document.createElement("SPAN")
    span.innerHTML =
        `<img class="innerimg GSPS" alt="writeGSPS" id="writeGSPS" onmouseover = "onElementOver(this);" onmouseleave = "onElementLeave();" src="../image/icon/lite/gsps_off.png" width="50" height="50">`;
    if (getByid("MarkupDIv").childNodes.length > 0) getByid("MarkupDIv").appendChild(document.createElement("BR"));
    getByid("MarkupDIv").appendChild(span);

    var span = document.createElement("SPAN")
    span.innerHTML =
        `<div id="GspsStyleDiv"">
        <select id="GSPScolorSelect" style="font-weight:bold;font-size:16px;">
          <option id="GSPSBlackSelect" style="background-color:#929292;color: #000000;font-weight:bold;">Black</option>
          <option id="GSPSBlueSelect" style="background-color:#929292;color: #0000FF;font-weight:bold;" selected="selected">Blue</option>
          <option id="GSPSBrownSelect" style="background-color:#929292;color: #A52A2A;font-weight:bold;">Brown</option>
          <option id="GSPSCyanSelect" style="background-color:#929292;color: #00FFFF;font-weight:bold;">Cyan</option>
          <option id="GSPSGreenSelect" style="background-color:#929292;color: #00FF00;font-weight:bold;">Green</option>
          <option id="GSPSMagentaSelect" style="background-color:#929292;color: #FF00FF;font-weight:bold;">Magenta</option>
          <option id="GSPSOrangeSelect" style="background-color:#929292;color: #FFA500;font-weight:bold;">Orange</option>
          <option id="GSPSPurpleSelect" style="background-color:#929292;color: #663399;font-weight:bold;">Purple</option>
          <option id="GSPSRedSelect" style="background-color:#929292;color: #FF0000;font-weight:bold;">Red</option>
          <option id="GSPSYellowSelect" style="background-color:#929292;color: #FFFF00;font-weight:bold;"> Yellow</option>
          <option id="GSPSWhiteSelect" style="background-color:#929292;color: #FFFFFF;font-weight:bold;">White</option>
        </select>
        <font color="white">Name：</font><input type="text" id="GspsName" value="T1" size="8" />
        <select id="GspsTypeSelect" style="font-weight:bold;font-size:16px;">
          <option id="GspsPOLYLINE" selected="selected">Rectangle</option>
          <option id="GspsCIRCLE">Circle</option>
          <option id="GspsLINE">Line</option>
        </select>
      </div>`
    getByid("page-header").appendChild(span);
    getByid("GspsStyleDiv").style.display = "none";
}
loadWriteGraphic();

window.addEventListener('keydown', (KeyboardKeys) => {
    var key = KeyboardKeys.which
    if ((openWriteGSPS || openWriteGraphic) && Graphic_now_choose && (key === 46 || key === 110)) {
        PatientMark.splice(PatientMark.indexOf(Graphic_now_choose.reference), 1);
        displayMark();
        Graphic_now_choose = null;
        refreshMarkFromSop(GetViewport().sop);
    }
});

/*function GetGraphicColor() {//舊時的
    //if (getByid("Graphicselected").selected) return "#0000FF";
    if (getByid("GraphicBlackSelect").selected) return "#000000";
    else if (getByid("GraphicBlueSelect").selected) return "#0000FF";
    else if (getByid("GraphicBrownSelect").selected) return "#844200";
    else if (getByid("GraphicCyanSelect").selected) return "#00FFFF";
    else if (getByid("GraphicGreenSelect").selected) return "#00FF00";
    else if (getByid("GraphicMagentaSelect").selected) return "#FF00FF";
    else if (getByid("GraphicOrangeSelect").selected) return "#FFA500";
    else if (getByid("GraphicPurpleSelect").selected) return "#663399";
    else if (getByid("GraphicRedSelect").selected) return "#FF0000";
    else if (getByid("GraphicYellowSelect").selected) return "#FFFF00";
    else if (getByid("GraphicWhiteSelect").selected) return "#FFFFFF";
    else return "#0000FF";
}*/

function GetGSPSColor() {
    //if (getByid("Graphicselected").selected) return "#0000FF";
    if (getByid("GSPSBlackSelect").selected) return "#000000";
    else if (getByid("GSPSBlueSelect").selected) return "#0000FF";
    else if (getByid("GSPSBrownSelect").selected) return "#844200";
    else if (getByid("GSPSCyanSelect").selected) return "#00FFFF";
    else if (getByid("GSPSGreenSelect").selected) return "#00FF00";
    else if (getByid("GSPSMagentaSelect").selected) return "#FF00FF";
    else if (getByid("GSPSOrangeSelect").selected) return "#FFA500";
    else if (getByid("GSPSPurpleSelect").selected) return "#663399";
    else if (getByid("GSPSRedSelect").selected) return "#FF0000";
    else if (getByid("GSPSYellowSelect").selected) return "#FFFF00";
    else if (getByid("GSPSWhiteSelect").selected) return "#FFFFFF";
    else return "#0000FF";
}

/*function GetGraphicName() {
    //if (getByid("Graphicselected").selected) return "T8";
    if (getByid("GraphicBlackSelect").selected) return "T7";
    else if (getByid("GraphicBlueSelect").selected) return "T8";
    else if (getByid("GraphicBrownSelect").selected) return "T9";
    else if (getByid("GraphicCyanSelect").selected) return "T10";
    else if (getByid("GraphicGreenSelect").selected) return "T11";
    else if (getByid("GraphicMagentaSelect").selected) return "T12";
    else if (getByid("GraphicOrangeSelect").selected) return "L1";
    else if (getByid("GraphicPurpleSelect").selected) return "L2";
    else if (getByid("GraphicRedSelect").selected) return "L3";
    else if (getByid("GraphicYellowSelect").selected) return "L4";
    else if (getByid("GraphicWhiteSelect").selected) return "L5";
    else return "T8";
}*/


getByid("GspsTypeSelect").onchange = function () {
    displayMark();
}

getByid("drawGSPS").onclick = function () {
    set_BL_model('writegsps');
    writegsps();
    drawBorder(getByid("drawGSPS"));
}
BorderList_Icon.push("drawGSPS");
BorderList_Icon.push("eraseGSPS");

getByid("writeGSPS").onclick = function () {
    if (this.enable == false) return;
    getByid("MarkupDIv").style.display = "none";
    cancelTools();
    openWriteGSPS = true;
    img2darkByClass("GSPS", !openWriteGSPS);
    openLeftImgClick = !openWriteGSPS;
    if (openWriteGSPS == true) {
        getByid('GspsStyleDiv').style.display = '';
        set_BL_model('writegsps');
        writegsps();
    }
    //this.src = openWriteGSPS == true ? '../image/icon/lite/gsps_on.png' : '../image/icon/lite/gsps_off.png';
    this.style.display = openWriteGSPS != true ? "" : "none";
    getByid("eraseGSPS").style.display = openWriteGSPS == true ? "" : "none";
    getByid("exitGSPS").style.display = openWriteGSPS == true ? "" : "none";
    getByid("saveGSPS").style.display = openWriteGSPS == true ? "" : "none";
    getByid("drawGSPS").style.display = openWriteGSPS == true ? "" : "none";

    getByid("exitGSPS").onclick = function () {
        openWriteGSPS = false;
        openLeftImgClick = true;
        img2darkByClass("GSPS", !openWriteGSPS);
        getByid('GspsStyleDiv').style.display = 'none';
        getByid("writeGSPS").style.display = openWriteGSPS != true ? "" : "none";
        getByid("eraseGSPS").style.display = openWriteGSPS == true ? "" : "none";
        getByid("exitGSPS").style.display = openWriteGSPS == true ? "" : "none";
        getByid("saveGSPS").style.display = openWriteGSPS == true ? "" : "none";
        getByid("drawGSPS").style.display = openWriteGSPS == true ? "" : "none";
        SetTable();
        displayMark();
        getByid('MouseOperation').click();
    }

    getByid("eraseGSPS").onclick = function () {
        set_BL_model('eraseGSPS');
        eraseGSPS();
        drawBorder(getByid("eraseGSPS"));
        hideAllDrawer();
        displayAllMark();
    }

    getByid("saveGSPS").onclick = function () {
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
        if (ConfigLog.Xml2Dcm.enableXml2Dcm == true) download2(String(get_Graphic_context()), "" + CreateSecurePassword(), 'text/plain');
        else download(String(get_Graphic_context()), 'filename_GSPS.xml', 'text/plain');
        displayMark();
    }

    SetTable();
    displayMark();
    //download(String(get_Graphic_context()), 'filename_GSPS.xml', 'text/plain');
}


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

function eraseGSPS() {
    if (BL_mode == 'eraseGSPS') {

        set_BL_model.onchange = function () {
            displayMark();
            set_BL_model.onchange = function () { return 0; };
        }

        BlueLightMousedownList = [];
        BlueLightMousedownList.push(function (e) {
            Graphic_pounch(rotateCalculation(e, true)[0], rotateCalculation(e, true)[1]);
            if (Graphic_now_choose) {
                PatientMark.splice(PatientMark.indexOf(Graphic_now_choose.reference), 1);
                displayMark();
                Graphic_now_choose = null;
                refreshMarkFromSop(GetViewport().sop);
                return;
            }
        });
        BlueLightMousemoveList = [];
        BlueLightMouseupList = [];
    }
}

function Graphic_pounch(currX, currY) {
    let block_size = getMarkSize(GetViewportMark(), false) * 4;

    for (var n = 0; n < PatientMark.length; n++) {
        if (PatientMark[n].sop == GetViewport().sop) {
            if (PatientMark[n].type == "POLYLINE") {
                var tempMark = PatientMark[n].pointArray;
                if (tempMark.length >= 4) {
                    //Rect
                    var Max_X = Max_Y = Number.MIN_VALUE;
                    var Min_X = Min_Y = Number.MAX_VALUE;
                    var Max_X_list = [],
                        Max_Y_list = [],
                        Min_X_list = [],
                        Min_Y_list = [];
                    for (var o = 0; o < tempMark.length; o += 1) {
                        if (parseInt(tempMark[o].x) >= Max_X) Max_X = parseInt(tempMark[o].x);
                        if (parseInt(tempMark[o].x) <= Min_X) Min_X = parseInt(tempMark[o].x);
                    }
                    for (var o = 0; o < tempMark.length; o += 1) {
                        if (equal_TOL(Max_X, parseInt(tempMark[o].x), block_size)) Max_X_list.push(o);
                        if (equal_TOL(Min_X, parseInt(tempMark[o].x), block_size)) Min_X_list.push(o);
                    }
                    for (var o = 0; o < tempMark.length; o += 1) {
                        if (parseInt(tempMark[o].y) >= Max_Y) Max_Y = parseInt(tempMark[o].y);
                        if (parseInt(tempMark[o].y) <= Min_Y) Min_Y = parseInt(tempMark[o].y);
                    }
                    for (var o = 0; o < tempMark.length; o += 1) {
                        if (equal_TOL(Max_Y, parseInt(tempMark[o].y), block_size)) Max_Y_list.push(o);
                        if (equal_TOL(Min_Y, parseInt(tempMark[o].y), block_size)) Min_Y_list.push(o);
                    }
                    for (var o = 0; o < tempMark.length - 1; o += 1) {
                        var x_middle = (parseInt(tempMark[o].x) + parseInt(tempMark[o + 1].x)) / 2;
                        var y_middle = (parseInt(tempMark[o].y) + parseInt(tempMark[o + 1].y)) / 2;
                        if (currY + block_size >= y_middle && currX + block_size >= x_middle && currY < y_middle + block_size && currX < x_middle + block_size) {
                            if (equal_TOL(y_middle, Max_Y, block_size)) {
                                Graphic_now_choose = {
                                    reference: PatientMark[n],
                                    Mark: PatientMark[n],
                                    point: Max_Y_list,
                                    pointArray: tempMark,
                                    middle: [(Max_X + Min_X) / 2, (Max_Y + Min_Y) / 2],
                                    value: 'up'
                                };
                                return true;
                            } else if (equal_TOL(y_middle, Min_Y, block_size)) {
                                Graphic_now_choose = {
                                    reference: PatientMark[n],
                                    Mark: PatientMark[n],
                                    point: Min_Y_list,
                                    pointArray: tempMark,
                                    middle: [(Max_X + Min_X) / 2, (Max_Y + Min_Y) / 2],
                                    value: 'down'
                                };
                                return true;
                            } else if (equal_TOL(x_middle, Min_X, block_size)) {
                                Graphic_now_choose = {
                                    reference: PatientMark[n],
                                    Mark: PatientMark[n],
                                    point: Min_X_list,
                                    pointArray: tempMark,
                                    middle: [(Max_X + Min_X) / 2, (Max_Y + Min_Y) / 2],
                                    value: 'left'
                                };
                                return true;
                            } else if (equal_TOL(x_middle, Max_X, block_size)) {
                                Graphic_now_choose = {
                                    reference: PatientMark[n],
                                    Mark: PatientMark[n],
                                    point: Max_X_list,
                                    pointArray: tempMark,
                                    middle: [(Max_X + Min_X) / 2, (Max_Y + Min_Y) / 2],
                                    value: 'right'
                                };
                                return true;
                            }
                        }
                    }
                } else {
                    //Line
                    var Max_X = tempMark[1].x, Max_Y = tempMark[1].y;
                    var Min_X = tempMark[0].x, Min_Y = tempMark[0].y;
                    if (currY + block_size >= Min_Y && currX + block_size >= Min_X && currY < Min_Y + block_size && currX < Min_X + block_size) {
                        Graphic_now_choose = {
                            reference: PatientMark[n],
                            Mark: PatientMark[n],
                            //point: [Min_X,Min_Y],
                            pointArray: tempMark,
                            //middle: [(Max_X + Min_X) / 2, (Max_Y + Min_Y) / 2],
                            value: 'begin'
                        };
                        return true;
                    } else if (currY + block_size >= Max_Y && currX + block_size >= Max_X && currY < Max_Y + block_size && currX < Max_X + block_size) {
                        Graphic_now_choose = {
                            reference: PatientMark[n],
                            Mark: PatientMark[n],
                            //point: [Max_X,Max_Y],
                            pointArray: tempMark,
                            //middle: [(Max_X + Min_X) / 2, (Max_Y + Min_Y) / 2],
                            value: 'end'
                        };
                        return true;
                    }
                }
            }
            if (PatientMark[n].type == "CIRCLE") {
                var tempMark = PatientMark[n].pointArray;
                var Max_X = tempMark[1].x, Max_Y = tempMark[1].y;
                var Min_X = tempMark[0].x, Min_Y = tempMark[0].y;
                if (currY + block_size >= Min_Y && currX + block_size >= Min_X && currY < Min_Y + block_size && currX < Min_X + block_size) {
                    Graphic_now_choose = {
                        reference: PatientMark[n],
                        Mark: PatientMark[n],
                        //point: [Min_X,Min_Y],
                        pointArray: tempMark,
                        //middle: [(Max_X + Min_X) / 2, (Max_Y + Min_Y) / 2],
                        value: 'begin'
                    };
                    return true;
                } else if (currY + block_size >= Max_Y && currX + block_size >= Max_X && currY < Max_Y + block_size && currX < Max_X + block_size) {
                    Graphic_now_choose = {
                        reference: PatientMark[n],
                        Mark: PatientMark[n],
                        //point: [Max_X,Max_Y],
                        pointArray: tempMark,
                        //middle: [(Max_X + Min_X) / 2, (Max_Y + Min_Y) / 2],
                        value: 'end'
                    };
                    return true;
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
    let index = SearchUid2Index(GetViewport().sop);
    let i = index[0],
        j = index[1],
        k = index[2];
    temp = "" + Graphic_Annotation_format;
    for (var n = 0; n < PatientMark.length; n++) {
        if (PatientMark[n].sop == GetViewport().sop) {
            if (PatientMark[n].type == "POLYLINE") {
                let tail = "" + Graphic_format_tail;
                var Mark = PatientMark[n];
                var tempMark = PatientMark[n].pointArray;
                var mark_xy = "";
                for (var o = 0; o < tempMark.length; o += 1) {
                    var tempX = 0,
                        tempY = 0;
                    if (Mark.RotationAngle && Mark.RotationPoint)
                        [tempX, tempY] = rotatePoint([tempMark[o].x, tempMark[o].y], Mark.RotationAngle, Mark.RotationPoint)
                    else
                        [tempX, tempY] = [tempMark[o].x, tempMark[o].y];
                    tempX = parseInt(tempX) + ".0123";
                    tempY = parseInt(tempY) + ".0123";
                    if (o != 0) mark_xy += "\\";
                    mark_xy += tempX + "\\" + tempY;
                }
                tail = tail.replace("___GraphicData___", mark_xy);
                tail = tail.replace("___vm___", "10");
                tail = tail.replace("___len___", (tempMark.length + tempMark.length) * 4);
                tail = tail.replace("___PatternOnColorCIELabValue___", "" + SetGraphicColor(PatientMark[n].color));
                tail = tail.replace("___GraphicType___", "POLYLINE");
                tail = setTag(tail, "NumberOfGraphicPoints", 5, true);
                if (Mark.RotationAngle && Mark.RotationPoint) {
                    var rotation = ("" + Graphic_format_rotation).replace("___RotationAngle___", Mark.RotationAngle);
                    rotation = rotation.replace("___RotationPoint___", "" + Mark.RotationPoint[0] + "\\" + Mark.RotationPoint[1]);
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
                if (str == undefined || str == null) str = "";
                temp = temp.replace("___" + replace + "___", "" + str);
                var length = ("" + str).length;
                if (length % 2 != 0) length++;
                if (len == true) temp = temp.replace("___" + replace + "(len)___", length);
                return temp;
            }
            var createSopUid = CreateUid("sop");
            var createSeriesUid = CreateUid("series");
            for (var c = 0; c < 5; c++) {
                temp = setTag(temp, "StudyDate", GetViewport().studyDate, true);
                temp = setTag(temp, "StudyTime", GetViewport().studyTime, true);
                temp = setTag(temp, "StudyInstanceUID", ImageManager.Study[i].StudyInstanceUID, true);
                temp = setTag(temp, "SeriesInstanceUID", createSeriesUid, true);
                temp = setTag(temp, "SOPInstanceUID", createSopUid, true);
                temp = setTag(temp, "PatientID", GetViewport().tags.PatientID, true);
                temp = setTag(temp, "PatientName", GetViewport().tags.PatientName, true);
                temp = setTag(temp, "ReferencedSOPInstanceUID", PatientMark[n].sop, true);
                temp = setTag(temp, "ReferencedSeriesInstanceUID", ImageManager.Study[i].Series[j].SeriesInstanceUID, true);
                temp = setTag(temp, "AccessionNumber", GetViewport().tags.AccessionNumber, true);
                temp = setTag(temp, "StudyDescription", GetViewport().studyDescription, true);
                temp = setTag(temp, "StudyID", GetViewport().studyID, true);
                temp = temp.replace("___PresentationCreationDate___", "" + date.getFullYear() + zero(date.getMonth() + 1) + zero(date.getDate())); // 20200210
                temp = temp.replace("___PresentationCreationTime___", "" + zero(date.getHours() + 1) + zero(date.getMinutes()) + zero(date.getSeconds()) + "." + zero(date.getMilliseconds(), true)); // 093348.775
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
    let temp = tail_list = ""

    temp = "" + Graphic_Annotation_format;

    function setTag(temp, replace, str, len) {
        if (str == undefined || str == null) str = "";
        temp = temp.replace("___" + replace + "___", "" + str);
        var length = ("" + str).length;
        if (length % 2 != 0) length++;
        if (len == true) temp = temp.replace("___" + replace + "(len)___", length);
        return temp;
    }
    for (var n = 0; n < PatientMark.length; n++) {
        if (PatientMark[n].sop == GetViewport().sop) {
            if (PatientMark[n].type == "POLYLINE") {
                let tail = "" + Graphic_format_tail;
                var tempMark = PatientMark[n].pointArray;
                var mark_xy = "";
                for (var o = 0; o < tempMark.length; o += 1) {
                    var tempX = tempY = 0;
                    if (tempMark.RotationAngle && tempMark.RotationPoint)
                        [tempX, tempY] = rotatePoint([tempMark[o].x, tempMark[o].y], tempMark.RotationAngle, tempMark.RotationPoint)
                    else
                        [tempX, tempY] = [tempMark[o].x, tempMark[o].y];
                    tempX = parseInt(tempX) + ".0123";
                    tempY = parseInt(tempY) + ".0123";
                    if (o != 0) mark_xy += "\\";
                    mark_xy += tempX + "\\" + tempY;
                }
                tail = tail.replace("___GraphicData___", mark_xy);
                tail = tail.replace("___vm___", (tempMark.length + tempMark.length));
                tail = tail.replace("___len___", (tempMark.length + tempMark.length) * 4);
                tail = tail.replace("___PatternOnColorCIELabValue___", "" + SetGraphicColor(PatientMark[n].color));
                tail = tail.replace("___GraphicType___", "POLYLINE");
                tail = setTag(tail, "NumberOfGraphicPoints", (tempMark.length + tempMark.length) / 2, true);
                if (tempMark.RotationAngle && tempMark.RotationPoint) {
                    var rotation = ("" + Graphic_format_rotation).replace("___RotationAngle___", tempMark.RotationAngle);
                    rotation = rotation.replace("___RotationPoint___", "" + tempMark.RotationPoint[0] + "\\" + tempMark.RotationPoint[1]);
                    tail = tail.replace("___rotation___", rotation);
                } else {
                    tail = tail.replace("___rotation___", "");
                }
                tail_list += tail;
            } else if (PatientMark[n].type == "CIRCLE") {
                let tail = "" + Graphic_format_tail;
                var tempMark = PatientMark[n].pointArray;
                var mark_xy = "";
                for (var o = 0; o < tempMark.length; o += 1) {
                    var tempX = 0,
                        tempY = 0;
                    [tempX, tempY] = [tempMark[o].x, tempMark[o].y];
                    tempX = parseInt(tempX) + ".0123";
                    tempY = parseInt(tempY) + ".0123";
                    if (o != 0) mark_xy += "\\";
                    mark_xy += tempX + "\\" + tempY;
                }
                tail = tail.replace("___rotation___", "");
                tail = tail.replace("___GraphicData___", mark_xy);
                tail = tail.replace("___vm___", "4");
                tail = tail.replace("___len___", (tempMark.length + tempMark.length) * 4);
                // var color = getRGBFrom0xFF(PatientMark[n].color);
                tail = tail.replace("___PatternOnColorCIELabValue___", "" + SetGraphicColor(PatientMark[n].color));
                //tail = tail.replace("___PatternOnColorCIELabValue___", "" + color[0] + "\\" + color[1] + "\\" + color[2], true);
                tail = tail.replace("___GraphicType___", "CIRCLE");
                tail = setTag(tail, "NumberOfGraphicPoints", (tempMark.length + tempMark.length) / 2, true);
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
            var tags = GetViewport().tags;
            for (var c = 0; c < 5; c++) {
                temp = setTag(temp, "StudyDate", tags.studyDate, true);
                temp = setTag(temp, "StudyTime", tags.studyTime, true);
                temp = setTag(temp, "StudyInstanceUID", GetViewport().study, true);
                temp = setTag(temp, "SeriesInstanceUID", createSeriesUid, true);
                temp = setTag(temp, "SOPInstanceUID", createSopUid, true);
                temp = setTag(temp, "PatientID", tags.PatientID, true);
                temp = setTag(temp, "PatientName", tags.PatientName, true);
                temp = setTag(temp, "ReferencedSOPInstanceUID", GetViewport().sop, true);
                temp = setTag(temp, "ReferencedSeriesInstanceUID", GetViewport().series, true);
                temp = setTag(temp, "AccessionNumber", tags.AccessionNumber, true);
                temp = setTag(temp, "StudyDescription", tags.studyDescription, true);
                temp = setTag(temp, "StudyID", GetViewport().study, true);
                temp = temp.replace("___PresentationCreationDate___", "" + date.getFullYear() + zero(date.getMonth() + 1) + zero(date.getDate())); // 20200210
                temp = temp.replace("___PresentationCreationTime___", "" + zero(date.getHours() + 1) + zero(date.getMinutes()) + zero(date.getSeconds()) + "." + zero(date.getMilliseconds(), true)); // 093348.775
            }
        }
    }
    temp = temp.replace("___item___", tail_list);
    Graphic_format_object_list.push(temp);
}

var Gsps_previous_choose = null;
function writegsps() {
    if (BL_mode == 'writegsps') {

        drawBorder(getByid("drawGSPS"));

        GetViewport().rotate = 0;
        setTransform();

        BlueLightMousedownList = [];
        BlueLightMousedownList.push(function (e) {
            if (Gsps_previous_choose) Gsps_previous_choose = null;
            if (!rightMouseDown && (getByid("GspsPOLYLINE").selected == true || getByid("GspsLINE").selected == true) || getByid("GspsCIRCLE").selected == true) {
                let angle2point = rotateCalculation(e);
                if (Graphic_pounch(angle2point[0], angle2point[1]) == true) {
                    displayMark();
                };
            }
        });

        BlueLightMousemoveList = [];
        BlueLightMousemoveList.push(function (e) {
            var [currX, currY] = getCurrPoint(e);
            // if (rightMouseDown == true) {scale_size(e, currX, currY);  }

            if (MouseDownCheck == true && getByid("GspsCIRCLE").selected == true) {
                if (!Graphic_now_choose) {
                    var GspsMark = Gsps_previous_choose ? Gsps_previous_choose : new BlueLightMark();
                    if (!Gsps_previous_choose) PatientMark.push(GspsMark);
                    GspsMark.setQRLevels(GetViewport().QRLevels);
                    GspsMark.color = GetGSPSColor();

                    GspsMark.showName = getByid("GspsName").value; //"" + getByid("xmlMarkNameText").value;
                    GspsMark.hideName = GspsMark.showName + "_CIRCLE";

                    GspsMark.type = "CIRCLE";
                    GspsMark.pointArray = [];
                    GspsMark.setPoint2D(originalPoint_X, originalPoint_Y);
                    GspsMark.setPoint2D(
                        originalPoint_X + Math.sqrt(Math.pow(Math.abs(originalPoint_X - currX), 2) + Math.pow(Math.abs(originalPoint_Y - currY), 2) / 2),
                        originalPoint_Y + Math.sqrt(Math.pow(Math.abs(originalPoint_X - currX), 2) + Math.pow(Math.abs(originalPoint_Y - currY), 2) / 2)
                    );
                    Gsps_previous_choose = GspsMark;
                    refreshMark(GspsMark);
                    displayAllMark();
                } else {
                    var Graphic_point = Graphic_now_choose.point;
                    if (Graphic_now_choose.value == "begin") {
                        var origin_point = [Graphic_now_choose.pointArray[0].x, Graphic_now_choose.pointArray[0].y];
                        Graphic_now_choose.pointArray[0].x = currX;
                        Graphic_now_choose.pointArray[0].y = currY;
                        Graphic_now_choose.pointArray[1].x += (currX - origin_point[0]);
                        Graphic_now_choose.pointArray[1].y += (currY - origin_point[1]);
                    } else if (Graphic_now_choose.value == "end") {
                        Graphic_now_choose.pointArray[1].x = currX;
                        Graphic_now_choose.pointArray[1].y = currY;
                    }
                    displayMark();
                }
            }
            if (MouseDownCheck == true && getByid("GspsLINE").selected == true) {
                if (!Graphic_now_choose) {
                    var GspsMark = Gsps_previous_choose ? Gsps_previous_choose : new BlueLightMark();
                    if (!Gsps_previous_choose) PatientMark.push(GspsMark);
                    GspsMark.setQRLevels(GetViewport().QRLevels);
                    GspsMark.color = GetGSPSColor();

                    GspsMark.showName = getByid("GspsName").value; //"" + getByid("xmlMarkNameText").value;
                    GspsMark.hideName = GspsMark.showName + "_POLYLINE";

                    GspsMark.type = "POLYLINE";
                    GspsMark.pointArray = [];
                    GspsMark.setPoint2D(originalPoint_X, originalPoint_Y);
                    GspsMark.setPoint2D(currX, currY);//注意要釐清這個為什麼是顛倒的
                    /*原先的Code：
                        dcm.mark[DcmMarkLength].markX.push(originalPoint_X);
                        dcm.mark[DcmMarkLength].markY.push(originalPoint_Y);
                        dcm.mark[DcmMarkLength].markY.push(currY);
                        dcm.mark[DcmMarkLength].markX.push(currX);
                    */
                    Gsps_previous_choose = GspsMark;
                    refreshMark(GspsMark);
                    displayAllMark();
                } else {
                    var Graphic_point = Graphic_now_choose.point;
                    if (Graphic_now_choose.value == "begin") {
                        Graphic_now_choose.pointArray[0].x = currX;
                        Graphic_now_choose.pointArray[0].y = currY;
                    } else if (Graphic_now_choose.value == "end") {
                        Graphic_now_choose.pointArray[1].x = currX;
                        Graphic_now_choose.pointArray[1].y = currY;
                    }
                    displayMark();
                }
            }
            if ((openWriteGraphic == true || (getByid("GspsPOLYLINE").selected == true)) && (MouseDownCheck == true || rightMouseDown == true)) {
                if (currX <= 0) currX = 0;
                if (currY <= 0) currY = 0;
                if (currX > GetViewport().width) currX = GetViewport().width;
                if (currY > GetViewport().height) currY = GetViewport().height;
                if (originalPoint_X <= 0) originalPoint_X = 0;
                if (originalPoint_Y <= 0) originalPoint_Y = 0;
                if (originalPoint_X > GetViewport().width) originalPoint_X = GetViewport().width;
                if (originalPoint_Y > GetViewport().height) originalPoint_Y = GetViewport().height;
                if (!Graphic_now_choose && MouseDownCheck == true) {

                    var GspsMark = Gsps_previous_choose ? Gsps_previous_choose : new BlueLightMark();
                    if (!Gsps_previous_choose) PatientMark.push(GspsMark);
                    GspsMark.setQRLevels(GetViewport().QRLevels);
                    //GspsMark.color = GetGraphicColor();//舊時的
                    if (getByid("GspsPOLYLINE").selected == true) GspsMark.color = GetGSPSColor();
                    else GspsMark.color = GetGSPSColor();//改成無條件

                    //舊時的
                    //GspsMark.showName = GetGraphicName(); //"" + getByid("xmlMarkNameText").value;
                    //GspsMark.hideName = GspsMark.showName + "_Rectangle";
                    if (getByid("GspsPOLYLINE").selected == true) {
                        GspsMark.showName = getByid("GspsName").value;
                        GspsMark.hideName = GspsMark.showName + "_Rectangle";
                    } else {
                        //改成無條件
                        GspsMark.showName = getByid("GspsName").value;
                        GspsMark.hideName = GspsMark.showName + "_Rectangle";
                    }

                    GspsMark.type = "POLYLINE";
                    GspsMark.pointArray = [];
                    GspsMark.RotationAngle = 0;
                    GspsMark.RotationPoint = 0;
                    GspsMark.setPoint2D(originalPoint_X, originalPoint_Y);
                    GspsMark.setPoint2D(originalPoint_X, currY);
                    GspsMark.setPoint2D(currX, currY);
                    GspsMark.setPoint2D(currX, originalPoint_Y);
                    GspsMark.setPoint2D(originalPoint_X, originalPoint_Y);

                    Gsps_previous_choose = GspsMark;
                    refreshMark(GspsMark);
                    displayAllMark();
                } else {
                    if (rightMouseDown == true) {
                        if (Math.abs(currY - originalPoint_Y) > Math.abs(currX - originalPoint_X)) {
                            if (!Graphic_now_choose.Mark || !Graphic_now_choose.Mark.RotationAngle) Graphic_now_choose.Mark.RotationAngle = 0;
                            if (currY < originalPoint_Y - 1)
                                Graphic_now_choose.Mark.RotationAngle += parseInt((originalPoint_Y - currY) / 3);
                            else if (currY > originalPoint_Y + 1)
                                Graphic_now_choose.Mark.RotationAngle -= parseInt((currY - originalPoint_Y) / 3);

                        } else if (Math.abs(currX - originalPoint_X) > Math.abs(currY - originalPoint_Y)) {
                            if (!Graphic_now_choose.Mark || !Graphic_now_choose.Mark.RotationAngle) Graphic_now_choose.Mark.RotationAngle = 0;
                            if (currX < originalPoint_X - 1)
                                Graphic_now_choose.Mark.RotationAngle += parseInt((originalPoint_X - currX) / 3);
                            else if (currX > originalPoint_X + 1)
                                Graphic_now_choose.Mark.RotationAngle -= parseInt((currX - originalPoint_X) / 3);
                        }
                        if (Graphic_now_choose.Mark.RotationAngle > 360) Graphic_now_choose.Mark.RotationAngle -= 360;
                        if (Graphic_now_choose.Mark.RotationAngle < 0) Graphic_now_choose.Mark.RotationAngle += 360;

                        originalPoint_X = currX;
                        originalPoint_Y = currY;
                    } else if (MouseDownCheck == true) {
                        var Graphic_point = Graphic_now_choose.point;
                        if (Graphic_now_choose.value == "up") {
                            for (var p = 0; p < Graphic_point.length; p++) {
                                Graphic_now_choose.pointArray[Graphic_point[p]].y = currY;
                            }
                        } else if (Graphic_now_choose.value == "down") {
                            for (var p = 0; p < Graphic_point.length; p++) {
                                Graphic_now_choose.pointArray[Graphic_point[p]].y = currY;
                            }
                        } else if (Graphic_now_choose.value == "left") {
                            for (var p = 0; p < Graphic_point.length; p++) {
                                Graphic_now_choose.pointArray[Graphic_point[p]].x = currX;
                            }
                        } else if (Graphic_now_choose.value == "right") {
                            for (var p = 0; p < Graphic_point.length; p++) {
                                Graphic_now_choose.pointArray[Graphic_point[p]].x = currX;
                            }
                        }
                    }
                    if (Graphic_now_choose.Mark.RotationAngle >= 0)
                        Graphic_now_choose.Mark.RotationPoint = getRotationPoint(Graphic_now_choose.Mark, true);
                    //Graphic_now_choose.Mark.RotationPoint = [Graphic_now_choose.middle[0], Graphic_now_choose.middle[1]];
                    displayMark();
                }
            }
        });

        BlueLightMouseupList = [];
        BlueLightMouseupList.push(function (e) {
            if (Gsps_previous_choose) Graphic_now_choose = { reference: Gsps_previous_choose };
        });
    }
}

function drawPOLYLINE_Write(obj) {
    var canvas = obj.canvas, Mark = obj.Mark, viewport = obj.viewport;
    if (Mark.type != "POLYLINE") return;
    var ctx = canvas.getContext("2d");
    var ArcSize = 3;//控制圓點之大小
    ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);
    setMarkColor(ctx);
    if (Mark.color) ctx.strokeStyle = ctx.fillStyle = "" + Mark.color;

    for (var o = 0; o < Mark.pointArray.length; o += 1) {
        ctx.beginPath();

        var x1 = Mark.pointArray[o].x * 1;
        var y1 = Mark.pointArray[o].y * 1;
        var x2 = Mark.pointArray[o + 1].x * 1;
        var y2 = Mark.pointArray[o + 1].y * 1;

        if (Mark.RotationAngle && Mark.RotationPoint) {
            [x1, y1] = rotatePoint([x1, y1], Mark.RotationAngle, Mark.RotationPoint);
            [x2, y2] = rotatePoint([x2, y2], Mark.RotationAngle, Mark.RotationPoint);
        }

        if (Mark.GSPS_Text && o == 0) {
            var n = parseInt(ctx.lineWidth) * 4;
            if (viewport && !isNaN(viewport.scale) && viewport.scale < 1) n /= viewport.scale;
            ctx.font = "" + (n) + "px Arial";
            ctx.fillStyle = "red";
            var tempAlpha = ctx.globalAlpha;
            ctx.globalAlpha = 1.0;
            ctx.fillText("" + Mark.GSPS_Text, x1 < x2 ? x1 : x2, y1 < y2 ? y1 - 7 : y2 - 7);
            ctx.globalAlpha = tempAlpha;
        }
        var tempAlpha2 = ctx.globalAlpha;
        ctx.globalAlpha = 1.0;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.globalAlpha = tempAlpha2;
        if (Mark.GraphicFilled && Mark.GraphicFilled == 'Y') {
            ctx.fillStyle = "#FFFF88";
            ctx.fill();
        };
        ctx.closePath();

        if (BL_mode == 'eraseGSPS' || openWriteGraphic == true || (getByid("GspsPOLYLINE").selected == true && openWriteGSPS == true)) {
            if (Mark.pointArray.length >= 4) {
                if (Mark.RotationAngle && Mark.RotationPoint) {
                    [x1, y1] = rotatePoint([x1, y1], -Mark.RotationAngle, Mark.RotationPoint);
                    [x2, y2] = rotatePoint([x2, y2], -Mark.RotationAngle, Mark.RotationPoint);
                }
                ctx.lineWidth = "" + parseInt(ctx.lineWidth) * 2;
                var fillStyle = ctx.fillStyle, strokeStyle = ctx.strokeStyle;

                if (Graphic_now_choose && Graphic_now_choose.Mark == Mark) ctx.strokeStyle = getRGBFrom0xFF(ctx.strokeStyle, false, true);
                for (var fil = 0; fil < 2; fil++) {
                    ctx.beginPath();
                    ctx.arc(x1 / 2 + x2 / 2, y1 / 2 + y2 / 2, parseInt(parseFloat(ctx.lineWidth) * ArcSize), 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.fill();
                    ctx.closePath();
                }
                ctx.lineWidth = "" + parseInt(ctx.lineWidth) / 2;
                ctx.fillstyle = fillStyle; ctx.strokeStyle = strokeStyle;
            }
        }
        if (BL_mode == 'eraseGSPS' || openWriteGraphic == true || (getByid("GspsLINE").selected == true && openWriteGSPS == true)) {
            if (Mark.pointArray.length < 4) {
                if (Mark.RotationAngle && Mark.RotationPoint) {
                    [x1, y1] = rotatePoint([x1, y1], -Mark.RotationAngle, Mark.RotationPoint);
                    [x2, y2] = rotatePoint([x2, y2], -Mark.RotationAngle, Mark.RotationPoint);
                }
                ctx.lineWidth = "" + parseInt(ctx.lineWidth) * 2;
                var fillStyle = ctx.fillStyle, strokeStyle = ctx.strokeStyle;
                if (Graphic_now_choose && Graphic_now_choose.Mark == Mark) ctx.strokeStyle = getRGBFrom0xFF(ctx.strokeStyle, false, true);

                for (var fil = 0; fil < 2; fil++) {
                    ctx.beginPath();
                    ctx.arc(x1, y1, parseInt(parseFloat(ctx.lineWidth) * ArcSize), 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.fill();
                    ctx.closePath();
                    ctx.beginPath();
                    ctx.arc(x2, y2, parseInt(parseFloat(ctx.lineWidth) * ArcSize), 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.fill();
                    ctx.closePath();
                }
                ctx.lineWidth = "" + parseInt(ctx.lineWidth) / 2;
                ctx.fillstyle = fillStyle; ctx.strokeStyle = strokeStyle;
            }
        }
    }
}

PLUGIN.PushMarkList(drawPOLYLINE_Write);


function drawCircle_Write(obj) {
    var canvas = obj.canvas, Mark = obj.Mark, viewport = obj.viewport;
    if (Mark.type != "CIRCLE") return;
    var ctx = canvas.getContext("2d");
    var ArcSize = 3;//控制圓點之大小
    ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);
    setMarkColor(ctx);
    if (Mark.color) ctx.strokeStyle = ctx.fillStyle = "" + Mark.color;

    if (BL_mode == 'eraseGSPS' || openWriteGraphic == true || (getByid("GspsCIRCLE").selected == true && openWriteGSPS == true)) {
        if (Mark.pointArray.length >= 2) {
            var x1 = Mark.pointArray[0].x * 1;
            var y1 = Mark.pointArray[0].y * 1;
            var x2 = Mark.pointArray[1].x * 1;
            var y2 = Mark.pointArray[1].y * 1;
            if (Mark.RotationAngle && Mark.RotationPoint) {
                [x1, y1] = rotatePoint([x1, y1], -Mark.RotationAngle, Mark.RotationPoint);
                [x2, y2] = rotatePoint([x2, y2], -Mark.RotationAngle, Mark.RotationPoint);
            }
            ctx.lineWidth = "" + parseInt(ctx.lineWidth) * 2;
            var fillStyle = ctx.fillStyle, strokeStyle = ctx.strokeStyle;
            if (Graphic_now_choose && Graphic_now_choose.Mark == Mark) ctx.strokeStyle = getRGBFrom0xFF(ctx.strokeStyle, false, true);

            for (var fil = 0; fil < 2; fil++) {
                ctx.beginPath();
                ctx.arc(x1, y1, parseInt(parseFloat(ctx.lineWidth) * ArcSize), 0, 2 * Math.PI);
                ctx.stroke();
                ctx.fill();
                ctx.closePath();
                ctx.beginPath();
                ctx.arc(x2, y2, parseInt(parseFloat(ctx.lineWidth) * ArcSize), 0, 2 * Math.PI);
                ctx.stroke();
                ctx.fill();
                ctx.closePath();
            }
            ctx.lineWidth = "" + parseInt(ctx.lineWidth) / 2;
            ctx.fillstyle = fillStyle; ctx.strokeStyle = strokeStyle;
        }
    }
}

PLUGIN.PushMarkList(drawCircle_Write);