//代表XML標記模式為開啟狀態
var openWriteXML = false;

function loadxml_format() {
  var span = document.createElement("SPAN")
  span.innerHTML =
    `<img class="img XML" alt="writeXML" id="writeXML" onmouseover = "onElementOver(this);" onmouseleave = "onElementLeave();" src="../image/icon/black/xml_off.png" width="50" height="50">;
    <img class="img XML" alt="drawXML" id="drawXML" onmouseover="onElementOver(this);" onmouseleave="onElementLeave();" src="../image/icon/black/GraphicDraw.png" width="50" height="50" style="display:none;" >  
    <img class="img XML" alt="exitXML" id="exitXML" onmouseover="onElementOver(this);" onmouseleave="onElementLeave();" src="../image/icon/black/exit.png" width="50" height="50" style="display:none;" >
    <img class="img XML" alt="saveXML" id="saveXML" onmouseover="onElementOver(this);" onmouseleave="onElementLeave();" src="../image/icon/black/download.png" width="50" height="50" style="display:none;" >`;

  getByid("icon-list").appendChild(span);

  var span = document.createElement("SPAN")
  span.innerHTML =
    `<label style="color: #ffffff;" id="xmlMarkName">name<input type="text" id="xmlMarkNameText" value="noName" /></label>`
  getByid("page-header").appendChild(span);
  HideElemByID("xmlMarkName");
}
loadxml_format();

getByid("drawXML").onclick = function () {
  set_BL_model('writexml');
  writexml();
  drawBorder(getByid("drawXML"));
}
BorderList_Icon.push("drawXML");

getByid("writeXML").onclick = function () {
  if (this.enable == false) return;
  cancelTools();
  openWriteXML = true;
  img2darkByClass("XML", !openWriteXML);
  openLeftImgClick = !openWriteXML;
  if (openWriteXML == true) {
    ShowElemByID("xmlMarkName");
    set_BL_model('writexml');
    writexml();
  }
  //this.src = openWriteXML == true ? '../image/icon/black/xml_on.png' : '../image/icon/black/xml_off.png';
  this.style.display = openWriteXML != true ? "" : "none";
  getByid("exitXML").style.display = openWriteXML == true ? "" : "none";
  getByid("saveXML").style.display = openWriteXML == true ? "" : "none";
  getByid("drawXML").style.display = openWriteXML == true ? "" : "none";



  ShowElemByID("xmlMarkName");
  displayMark();

  getByid("exitXML").onclick = function () {
    openWriteXML = false;
    img2darkByClass("XML", !openWriteXML);
    HideElemByID("xmlMarkName");
    getByid("writeXML").style.display = openWriteXML != true ? "" : "none";
    getByid("exitXML").style.display = openWriteXML == true ? "" : "none";
    getByid("saveXML").style.display = openWriteXML == true ? "" : "none";
    getByid("drawXML").style.display = openWriteXML == true ? "" : "none";
    displayMark();
    xml_now_choose = null;
    getByid('MouseOperation').click();
  }

  getByid("saveXML").onclick = function () {
    function download(text, name, type) {
      let a = document.createElement('a');
      let file = new Blob([text], {
        type: type
      });
      a.href = window.URL.createObjectURL(file);
      a.download = name;
      a.click();
    }
    setXml_context();
    download(String(getXml_context()), 'filename.xml', 'text/plain');
  }
}

window.addEventListener('keydown', (KeyboardKeys) => {
  var key = KeyboardKeys.which
  if ((openWriteXML) && xml_now_choose && (key === 46 || key === 110)) {
    PatientMark.splice(PatientMark.indexOf(xml_now_choose.reference), 1);
    displayMark();
    xml_now_choose = null;
    refreshMarkFromSop(GetViewport().sop);
  }
  xml_now_choose = null;
});

getByid("xmlMarkNameText").onchange = function () {
  if (xml_now_choose) {
    xml_now_choose.reference.showName = '' + this.value;
    xml_now_choose.reference.hideName = xml_now_choose.reference.showName;
    refreshMark(xml_now_choose.reference);
    xml_now_choose = null;
    //this.value = '';
    displayAllMark();
  }
}

function drawXML_mark_Write(obj) {
  var canvas = obj.canvas, Mark = obj.Mark, showName = obj.showName;
  if (Mark.type != "XML_mark") return;
  var ctx = canvas.getContext("2d");
  ctx.globalAlpha = (parseFloat(getByid('markAlphaText').value) / 100);
  var tempAlpha = ctx.globalAlpha;
  ctx.globalAlpha = 1.0;
  ctx.font = "" + (parseInt(ctx.lineWidth) * 12) + "px Arial";
  ctx.fillStyle = "red";
  if (openWriteXML == true) {
    for (var o = 0; o < Mark.pointArray.length; o += 2) {
      ctx.strokeStyle = "" + Mark.color;
      ctx.beginPath();
      var x1 = Mark.pointArray[o].x * 1;
      var y1 = Mark.pointArray[o].y * 1;
      var x2 = Mark.pointArray[o + 1].x * 1;
      var y2 = Mark.pointArray[o + 1].y * 1;

      ctx.fillText("" + showName, x1 < x2 ? x1 : x2, y1 < y2 ? y1 - 5 : y2 - 5);

      ctx.rect(x1, y1, x2 - x1, y2 - y1);
      ctx.stroke();

      ctx.closePath();
      if (openWriteXML == true) {
        ctx.lineWidth = "" + parseInt(ctx.lineWidth) * 2;
        ctx.beginPath();
        if (xml_now_choose && xml_now_choose.Mark == Mark) {
          ctx.strokeStyle = "#00FFFF";
          ctx.arc(x1 / 2 + x2 / 2, y1, parseInt(ctx.lineWidth), 0, 2 * Math.PI);
          ctx.stroke();
          ctx.closePath();

          ctx.beginPath();
          ctx.strokeStyle = "#00FFFF";
          ctx.arc(x1 / 2 + x2 / 2, y2, parseInt(ctx.lineWidth), 0, 2 * Math.PI);
          ctx.stroke();
          ctx.closePath();

          ctx.beginPath();
          ctx.strokeStyle = "#00FFFF";
          ctx.arc(x1, y1 / 2 + y2 / 2, parseInt(ctx.lineWidth), 0, 2 * Math.PI);
          ctx.stroke();
          ctx.closePath();

          ctx.beginPath();
          ctx.strokeStyle = "#00FFFF";
          ctx.arc(x2, y1 / 2 + y2 / 2, parseInt(ctx.lineWidth), 0, 2 * Math.PI);
          ctx.stroke();
          ctx.closePath();
        };
        ctx.beginPath();
        ctx.fillStyle = "#FF0000";
        ctx.arc(x1 / 2 + x2 / 2, y1, parseInt(ctx.lineWidth), 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "#FF0000";
        ctx.arc(x1 / 2 + x2 / 2, y2, parseInt(ctx.lineWidth), 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "#FF0000";
        ctx.arc(x1, y1 / 2 + y2 / 2, parseInt(ctx.lineWidth), 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "#FF0000";
        ctx.arc(x2, y1 / 2 + y2 / 2, parseInt(ctx.lineWidth), 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        ctx.lineWidth = "" + parseInt(ctx.lineWidth) / 2;
      }
    }
  } else {
    for (var o = 0; o < Mark.pointArray.length; o += 2) {
      ctx.strokeStyle = "" + Mark.color;
      ctx.beginPath();
      var x1 = Mark.pointArray[o].x * 1;
      var y1 = Mark.pointArray[o].y * 1;
      var x2 = Mark.pointArray[o + 1].x * 1;
      var y2 = Mark.pointArray[o + 1].y * 1;

      ctx.fillText("" + showName, x1 < x2 ? x1 : x2, y1 < y2 ? y1 - 5 : y2 - 5);

      ctx.rect(x1, y1, x2 - x1, y2 - y1);
      ctx.stroke();
      ctx.closePath();
      if (openWriteXML == true) {
        ctx.lineWidth = "" + parseInt(ctx.lineWidth) * 2;
        ctx.beginPath();
        ctx.fillStyle = "#FF0000";
        ctx.arc(x1 / 2 + x2 / 2, y1, parseInt(ctx.lineWidth), 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "#FF0000";
        ctx.arc(x1 / 2 + x2 / 2, y2, parseInt(ctx.lineWidth), 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "#FF0000";
        ctx.arc(x1, y1 / 2 + y2 / 2, parseInt(ctx.lineWidth), 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "#FF0000";
        ctx.arc(x2, y1 / 2 + y2 / 2, parseInt(ctx.lineWidth), 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        ctx.lineWidth = "" + parseInt(ctx.lineWidth) / 2;
      }
    }
  }
  ctx.globalAlpha = tempAlpha;
}

PLUGIN.PushMarkList(drawXML_mark_Write);

var xml_format = `
<annotation>
  <folder>Unknown</folder>
  <filename>Unknown</filename>
  <path>Unknown</path>
  <source>
    <database>Unknown</database>
  </source>
  <size>
    <width>_width_</width>
    <height>_height_</height>
    <depth>3</depth>
  </size>
  <segmented>0</segmented>
  <object>
    <name>_name_</name>
    <pose>Unknown</pose>
    <truncated>0</truncated>
    <difficult>0</difficult>
    <bndbox>
      <xmin>_xmin_</xmin>
      <ymin>_ymin_</ymin>
      <xmax>_xmax_</xmax>
      <ymax>_ymax_</ymax>
    </bndbox>
  </object>
  
</annotation>
`;
var xml_format_title = `
<annotation>
  <folder>Unknown</folder>
  <filename>Unknown</filename>
  <path>Unknown</path>
  <source>
    <database>Unknown</database>
  </source>
  <size>
    <width>_width_</width>
    <height>_height_</height>
    <depth>3</depth>
  </size>
  <segmented>0</segmented>`
var xml_format_object = `
  <object>
    <name>_name_</name>
    <pose>Unknown</pose>
    <truncated>0</truncated>
    <difficult>0</difficult>
    <bndbox>
      <xmin>_xmin_</xmin>
      <ymin>_ymin_</ymin>
      <xmax>_xmax_</xmax>
      <ymax>_ymax_</ymax>
    </bndbox>
  </object>
`
var xml_format_object_list = [];
var xml_format_tail = `
</annotation>
`;
//正在選取的XML
var xml_now_choose = null;
//正在繪製的XML
var xml_previous_choose = null;

var temp_xml_format = "";

function setXml_context() {
  xml_format_object_list = []
  let temp = ""

  for (var n = 0; n < PatientMark.length; n++) {
    temp = "" + xml_format_object;
    if (PatientMark[n].sop == GetViewport().sop) {
      if (PatientMark[n].type == "XML_mark") {
        for (var m = 0; m < PatientMark[n].pointArray.length; m++) {
          for (var o = 0; o < PatientMark[n].pointArray.length; o += 2) {
            var x1 = parseInt(PatientMark[n].pointArray[o].x);
            var y1 = parseInt(PatientMark[n].pointArray[o].y);
            var x2 = parseInt(PatientMark[n].pointArray[o + 1].x);
            var y2 = parseInt(PatientMark[n].pointArray[o + 1].y);
            temp = temp.replace("_xmin_", x1 < x2 ? x1 : x2);
            temp = temp.replace("_ymin_", y1 < y2 ? y1 : y2);
            temp = temp.replace("_xmax_", x1 > x2 ? x1 : x2);
            temp = temp.replace("_ymax_", y1 > y2 ? y1 : y2);
            temp = temp.replace("_name_", PatientMark[n].showName);
            xml_format_object_list.push(temp);
          }
        }
      }
    }
  }
}

function getXml_context() {
  var temp_str = "";
  for (var i = 0; i < xml_format_object_list.length; i++) {
    temp_str += xml_format_object_list[i];
  }
  return xml_format_title.replace("_width_", GetViewport().width).replace("_height_", GetViewport().height) +
    temp_str + xml_format_tail;
}

function xml_pounch(currX, currY) {
  let block_size = getMarkSize(GetViewportMark(), false) * 4;

  for (var n = 0; n < PatientMark.length; n++) {
    if (PatientMark[n].sop == GetViewport().sop) {
      if (PatientMark[n].type == "XML_mark") {
        for (var o = 0; o < PatientMark[n].pointArray.length; o += 2) {
          var tempMark = PatientMark[n].pointArray;
          var x1 = parseInt(tempMark[o].x);
          var y1 = parseInt(tempMark[o].y);
          var x2 = parseInt(tempMark[o + 1].x);
          var y2 = parseInt(tempMark[o + 1].y);
          if (currY + block_size >= y1 && currX + block_size >= x1 / 2 + x2 / 2 && currY < y1 + block_size && currX < x1 / 2 + x2 / 2 + block_size) {
            xml_now_choose = {
              reference: PatientMark[n],
              mark: tempMark,
              value: 'up'
            };
            getByid("xmlMarkNameText").value = "" + PatientMark[n].showName;
            return true;
          } else if (currY + block_size >= y2 && currX + block_size >= x1 / 2 + x2 / 2 && currY < y2 + block_size && currX < x1 / 2 + x2 / 2 + block_size) {
            xml_now_choose = {
              reference: PatientMark[n],
              mark: tempMark,
              value: 'down'
            };
            getByid("xmlMarkNameText").value = "" + PatientMark[n].showName;
            return true;
          } else if (currY + block_size >= y1 / 2 + y2 / 2 && currX + block_size >= x1 && currY < y1 / 2 + y2 / 2 + block_size && currX < x1 + block_size) {
            xml_now_choose = {
              reference: PatientMark[n],
              mark: tempMark,
              value: 'left'
            };
            getByid("xmlMarkNameText").value = "" + PatientMark[n].showName;
            return true;
          } else if (currY + block_size >= y1 / 2 + y2 / 2 && currX + block_size >= x2 && currY < y1 / 2 + y2 / 2 + block_size && currX < x2 + block_size) {
            xml_now_choose = {
              reference: PatientMark[n],
              mark: tempMark,
              value: 'right'
            };
            getByid("xmlMarkNameText").value = "" + PatientMark[n].showName;
            return true;
          }
          // return false;
        }
      }
    }
  }
  xml_now_choose = null;
  return false;
}

function deleteXml() {
  let index = SearchUid2Index(GetViewport().sop);
  let i = index[0],
    j = index[1],
    k = index[2];
  var list = [];
  for (var n = 0; n < PatientMark.length; n++) {
    if (PatientMark[n].sop == Patient.Study[i].Series[j].Sop[k].SopUID) {
      for (var m = 0; m < PatientMark[n].mark.length; m++) {
        if (PatientMark[n].mark[m].type == "XML_mark") {
          list.push(PatientMark[n]);
        }
      }
    }
  }
  for (var l = 0; l < list.length; l++) {
    PatientMark.splice(PatientMark.indexOf(list), 1);
  }
  refreshMarkFromSop(Patient.Study[i].Series[j].Sop[k].SopUID);
  displayMark();
}

function importXml(url) {
  var oReq = new XMLHttpRequest();
  try {
    oReq.open("get", url, false);
  } catch (err) { }
  oReq.responseType = "xml";
  oReq.onreadystatechange = function (oEvent) {
    try {
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(oReq.response, "text/xml");
      var objlist = xmlDoc.getElementsByTagName("annotation")[0].getElementsByTagName("object");

      for (var i = 0; i < objlist.length; i++) {

        var RtssMark = new BlueLightMark();
        RtssMark.setQRLevels(GetViewport().QRLevels);
        RtssMark.color = "#0000FF";
        RtssMark.hideName = RtssMark.showName = "" + objlist[i].getElementsByTagName("name")[0].childNodes[0].data;
        RtssMark.type = "XML_mark";

        RtssMark.pointArray = [];
        RtssMark.setPoint2D(
          objlist[i].getElementsByTagName("bndbox")[0].getElementsByTagName("xmin")[0].childNodes[0].data,
          objlist[i].getElementsByTagName("bndbox")[0].getElementsByTagName("ymin")[0].childNodes[0].data
        );
        RtssMark.setPoint2D(
          objlist[i].getElementsByTagName("bndbox")[0].getElementsByTagName("xmax")[0].childNodes[0].data,
          objlist[i].getElementsByTagName("bndbox")[0].getElementsByTagName("ymax")[0].childNodes[0].data
        );

        PatientMark.push(RtssMark);
        refreshMark(RtssMark);
      }
      setXml_context();
    } catch (ex) { }
  }
  oReq.send();
}


function writexml() {

  if (BL_mode == 'writexml') {
    DeleteMouseEvent();
    drawBorder(getByid("drawXML"));

    GetViewport().rotate = 0;
    setTransform();

    BlueLightMousedownList = [];
    BlueLightMousedownList.push(function (e) {
      if (xml_previous_choose) xml_previous_choose = null;
      if (xml_pounch(getCurrPoint(e)[0], getCurrPoint(e)[1]) == true) displayMark();
    });

    BlueLightMousemoveList = [];
    BlueLightMousemoveList.push(function (e) {
      var [currX, currY] = getCurrPoint(e);

      if (rightMouseDown == true) scale_size(e, currX, currY);

      if (MouseDownCheck) {
        if (!xml_now_choose) {
          var RtssMark = xml_previous_choose ? xml_previous_choose : new BlueLightMark();
          if (!xml_previous_choose) PatientMark.push(RtssMark);

          RtssMark.setQRLevels(GetViewport().QRLevels);
          RtssMark.color = "#0000FF";
          RtssMark.hideName = RtssMark.showName = "" + getByid("xmlMarkNameText").value;
          RtssMark.type = "XML_mark";
          RtssMark.pointArray = [];
          RtssMark.setPoint2D(originalPoint_X, originalPoint_Y);
          RtssMark.setPoint2D(currX, currY);

          xml_previous_choose = RtssMark;
          refreshMark(RtssMark);
        } else {
          var direction = xml_now_choose.value;
          if (direction == "up") xml_now_choose.reference.pointArray[0].y = currY;
          else if (direction == "down") xml_now_choose.reference.pointArray[1].y = currY;
          else if (direction == "left") xml_now_choose.reference.pointArray[0].x = currX;
          else if (direction == "right") xml_now_choose.reference.pointArray[1].x = currX;
        }
        displayAllMark();
      }
    });

    BlueLightMouseupList = [];
    BlueLightMouseupList.push(function (e) {
      if (xml_previous_choose) {
        //xml_previous_choose.pointArray[1] = [currX, currY];
        //refreshMark(xml_previous_choose);
        xml_previous_choose = null;
      }
    });
  }

  AddMouseEvent();
}