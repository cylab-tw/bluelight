window.addEventListener("load", function(event) {
  getByid("writeXML").onclick = function () {
    if (imgInvalid(this)) return;
    cancelTools();
    openWriteXML = !openWriteXML;
    img2darkByClass("XML", !openWriteXML);
    this.src = openWriteXML == true ? '../image/icon/black/xml_on.png' : '../image/icon/black/xml_off.png';
    if (openWriteXML == true) {
      getByid('xmlMarkName').style.display = '';
      set_BL_model('writexml');
      writexml();
    }
    else getByid('xmlMarkName').style.display = 'none';
    displayMark(NowResize, null, null, null, viewportNumber);
    if (openWriteXML == true) return;
    else xml_now_choose = null;

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
    setXml_context();
    download(String(getXml_context()), 'filename.xml', 'text/plain');
    getByid('MouseOperation').click();
  }
});

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
var xml_now_choose = null;
var temp_xml_format = "";

function setXml_context() {
  xml_format_object_list = []
  let temp = ""
  // x1 = parseInt(x1); x2 = parseInt(x2); y1 = parseInt(y1); y2 = parseInt(y2);
  let index = SearchUid2Index(GetViewport().alt);
  let i = index[0],
    j = index[1],
    k = index[2];
  for (var n = 0; n < PatientMark.length; n++) {
    temp = "" + xml_format_object;
    if (PatientMark[n].sop == Patient.Study[i].Series[j].Sop[k].SopUID) {
      for (var m = 0; m < PatientMark[n].mark.length; m++) {
        if (PatientMark[n].mark[m].type == "XML_mark") {
          var tempMark = PatientMark[n].mark[m];
          for (var o = 0; o < PatientMark[n].mark[m].markX.length; o += 2) {
            var x1 = parseInt(tempMark.markX[o]);
            var y1 = parseInt(tempMark.markY[o]);
            var x2 = parseInt(tempMark.markX[o + 1]);
            var y2 = parseInt(tempMark.markY[o + 1]);
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
  return xml_format_title.replace("_width_", GetViewport().imageWidth).replace("_height_", GetViewport().imageHeight) +
    temp_str + xml_format_tail;
}

function xml_pounch(currX, currY) {
  let block_size = getMarkSize(GetViewportMark(), false) * 4;
  let index = SearchUid2Index(GetViewport().alt);
  let i = index[0],
    j = index[1],
    k = index[2];
  for (var n = 0; n < PatientMark.length; n++) {
    //  temp = "" + xml_format_object;
    if (PatientMark[n].sop == Patient.Study[i].Series[j].Sop[k].SopUID) {
      for (var m = 0; m < PatientMark[n].mark.length; m++) {
        if (PatientMark[n].mark[m].type == "XML_mark") {
          var tempMark = PatientMark[n].mark[m];
          for (var o = 0; o < PatientMark[n].mark[m].markX.length; o += 2) {
            var x1 = parseInt(tempMark.markX[o]);
            var y1 = parseInt(tempMark.markY[o]);
            var x2 = parseInt(tempMark.markX[o + 1]);
            var y2 = parseInt(tempMark.markY[o + 1]);
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
  }
  xml_now_choose = null;
  return false;
}

function deleteXml() {
  let index = SearchUid2Index(GetViewport().alt);
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
  displayMark(NowResize, null, null, null, undefined);
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

      let Uid = SearchNowUid();

      for (var i = 0; i < objlist.length; i++) {
        var dcm = {};
        dcm.study = Uid.studyuid;
        dcm.series = Uid.sreiesuid;
        dcm.color = "#0000FF";
        dcm.mark = [];
        dcm.showName = "" + objlist[i].getElementsByTagName("name")[0].childNodes[0].data;
        dcm.hideName = dcm.showName;
        dcm.mark.push({});
        dcm.sop = Uid.sopuid;
        var DcmMarkLength = dcm.mark.length - 1;
        dcm.mark[DcmMarkLength].type = "XML_mark";
        dcm.mark[DcmMarkLength].markX = [];
        dcm.mark[DcmMarkLength].markY = [];
        dcm.mark[DcmMarkLength].markX.push(objlist[i].getElementsByTagName("bndbox")[0].getElementsByTagName("xmin")[0].childNodes[0].data);
        dcm.mark[DcmMarkLength].markY.push(objlist[i].getElementsByTagName("bndbox")[0].getElementsByTagName("ymin")[0].childNodes[0].data);
        dcm.mark[DcmMarkLength].markX.push(objlist[i].getElementsByTagName("bndbox")[0].getElementsByTagName("xmax")[0].childNodes[0].data);
        dcm.mark[DcmMarkLength].markY.push(objlist[i].getElementsByTagName("bndbox")[0].getElementsByTagName("ymax")[0].childNodes[0].data);
        PatientMark.push(dcm);
      }

      refreshMark(dcm);
      setXml_context();
    } catch (ex) { }
  }
  oReq.send();
}


function writexml() {

  if (BL_mode == 'writexml') {
    DeleteMouseEvent();
    //this.angel_=1;
    //cancelTools();
    /*set_BL_model.onchange1 = function () {
        getByid("AngelLabel").style.display = "none";
        displayMark();
        angel.angel_ = false;
       // document.documentElement.onmousemove = DivDraw;
       // document.documentElement.ontouchmove = DivDraw;
        set_BL_model.onchange1 = function () { return 0; };
    }*/
    Mousedown = function (e) {
      if (e.which == 1) MouseDownCheck = true;
      else if (e.which == 3) rightMouseDown = true;
      var currX = getCurrPoint(e)[0];
      var currY = getCurrPoint(e)[1];
      windowMouseX = GetmouseX(e);
      windowMouseY = GetmouseY(e);
      GetViewport().originalPointX = getCurrPoint(e)[0];
      GetViewport().originalPointY = getCurrPoint(e)[1];
      if (xml_pounch(currX, currY) == true) displayMark(NowResize, null, null, null, undefined);
    };

    Mousemove = function (e) {
      var currX = getCurrPoint(e)[0];
      var currY = getCurrPoint(e)[1];
      var labelXY = getClass('labelXY'); {
        let angel2point = rotateCalculation(e);
        labelXY[viewportNumber].innerText = "X: " + parseInt(angel2point[0]) + " Y: " + parseInt(angel2point[1]);
      }
      if (rightMouseDown == true) {
        scale_size(e, currX, currY);
      }

      if (openLink == true) {
        for (var i = 0; i < Viewport_Total; i++) {
          GetViewport(i).newMousePointX = GetViewport().newMousePointX;
          GetViewport(i).newMousePointY = GetViewport().newMousePointY;
        }
      }
      putLabel();
      for (var i = 0; i < Viewport_Total; i++)
        displayRular(i);

      if (MouseDownCheck) {
        windowMouseX = GetmouseX(e);
        windowMouseY = GetmouseY(e);
        if (!xml_now_choose) {
          let Uid = SearchNowUid();
          var dcm = {};
          dcm.study = Uid.studyuid;
          dcm.series = Uid.sreiesuid;
          dcm.color = "#0000FF";
          dcm.mark = [];
          dcm.showName = "" + getByid("xmlMarkNameText").value;
          dcm.hideName = dcm.showName;
          dcm.mark.push({});
          dcm.sop = Uid.sopuid;
          var DcmMarkLength = dcm.mark.length - 1;
          dcm.mark[DcmMarkLength].type = "XML_mark";
          dcm.mark[DcmMarkLength].markX = [];
          dcm.mark[DcmMarkLength].markY = [];
          dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
          dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
          dcm.mark[DcmMarkLength].markX.push(currX);
          dcm.mark[DcmMarkLength].markY.push(currY);
          PatientMark.push(dcm);
          refreshMark(dcm);
          for (var i = 0; i < Viewport_Total; i++)
            displayMark(NowResize, null, null, null, i);
          displayAngelRular();
          PatientMark.splice(PatientMark.indexOf(dcm), 1);
        } else {
          if (xml_now_choose.value == "up") {
            xml_now_choose.mark.markY[0] = currY;
          } else if (xml_now_choose.value == "down") {
            xml_now_choose.mark.markY[1] = currY;
          } else if (xml_now_choose.value == "left") {
            xml_now_choose.mark.markX[0] = currX;
          } else if (xml_now_choose.value == "right") {
            xml_now_choose.mark.markX[1] = currX;
          }
          //setXml_context();
          for (var i = 0; i < Viewport_Total; i++)
            displayMark(NowResize, null, null, null, i);

        }
      }
    }
    Mouseup = function (e) {
      var currX = getCurrPoint(e)[0];
      var currY = getCurrPoint(e)[1];
      MouseDownCheck = false;
      rightMouseDown = false;
      if (openWriteXML == true && !xml_now_choose) {
        let Uid = SearchNowUid();
        var dcm = {};
        dcm.study = Uid.studyuid;
        dcm.series = Uid.sreiesuid;
        dcm.color = "#0000FF";
        dcm.mark = [];
        dcm.showName = "" + getByid("xmlMarkNameText").value;
        dcm.hideName = dcm.showName;
        dcm.mark.push({});
        dcm.sop = Uid.sopuid;
        var DcmMarkLength = dcm.mark.length - 1;
        dcm.mark[DcmMarkLength].type = "XML_mark";
        dcm.mark[DcmMarkLength].markX = [];
        dcm.mark[DcmMarkLength].markY = [];
        dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
        dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
        dcm.mark[DcmMarkLength].markX.push(currX);
        dcm.mark[DcmMarkLength].markY.push(currY);
        PatientMark.push(dcm);
        refreshMark(dcm);
        for (var i = 0; i < Viewport_Total; i++)
          displayMark(NowResize, null, null, null, i);
        displayAngelRular();
        //setXml_context();
      }
    }
  }
  AddMouseEvent();
}