function readXML(url) {
  var oReq = new XMLHttpRequest();
  try {
    oReq.open("get", url, true);
  } catch (err) { }
  oReq.responseType = "xml";
  oReq.onreadystatechange = function (oEvent) {
    try {
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(oReq.response, "text/xml");
      var studyTemp = xmlDoc.getElementsByTagName("ImageAnnotationCollection")[0].getElementsByTagName("imageAnnotations")[0].
        getElementsByTagName("imageReferenceEntityCollection")[0].getElementsByTagName("ImageReferenceEntity")[0]
        .getElementsByTagName("imageStudy")[0];

      var study = (studyTemp.getElementsByTagName("instanceUid")[0].getAttribute("root"));
      var series = (studyTemp.getElementsByTagName("imageSeries")[0].getElementsByTagName("instanceUid")[0].getAttribute("root"));
      var sop = (studyTemp.getElementsByTagName("imageSeries")[0].getElementsByTagName("imageCollection")[0]
        .getElementsByTagName("Image")[0].getElementsByTagName("sopInstanceUid")[0].getAttribute("root"));

      var temp = xmlDoc.getElementsByTagName("ImageAnnotationCollection")[0].getElementsByTagName("imageAnnotations")[0].
        getElementsByTagName("ImageAnnotation")[0].getElementsByTagName("markupEntityCollection")[0]
        .getElementsByTagName("MarkupEntity");
      var dcm = {};
      dcm.study = study;
      dcm.series = series;
      dcm.sop = sop;
      dcm.mark = [];
      dcm.showName = "AIM";
      dcm.hideName = dcm.showName;
      try {
        var tempText = xmlDoc.getElementsByTagName("ImageAnnotationCollection")[0].getElementsByTagName("imageAnnotations")[0].
          getElementsByTagName("ImageAnnotation")[0].getElementsByTagName("imagingObservationEntityCollection")[0]
          .getElementsByTagName("ImagingObservationEntity");
        for (var i = 0; i < tempText.length; i++) {
          dcm.mark.push({});
          var mark = dcm.mark[dcm.mark.length - 1];
          mark.type = "Characteristic";
          var temp2 = tempText[i].getElementsByTagName("imagingObservationCharacteristicCollection")[0].
            getElementsByTagName("ImagingObservationCharacteristic");
          mark.markTitle = "";
          mark.markTitle = "" + tempText[i].getElementsByTagName("label")[0].getAttribute("value") +
            ":" + tempText[i].getElementsByTagName("typeCode")[0].getElementsByTagName("iso:displayName")[0].getAttribute("value");;
          mark.markX = [];
          mark.markY = [];
          mark.markZ = [];
          for (var j = 0; j < temp2.length; j++) {
            mark.markX.push(temp2[j].getElementsByTagName("label")[0].getAttribute("value"));
            mark.markZ.push(temp2[j].getElementsByTagName("typeCode")[0].getAttribute("code"));
            mark.markY.push(temp2[j].getElementsByTagName("typeCode")[0].getElementsByTagName("iso:displayName")[0].getAttribute("value"));
          }
        }
      } catch (ex) {
        //console.log(ex);
      }

      for (var i = 0; i < temp.length; i++) {
        if (temp[i].getAttribute("xsi:type") == "TwoDimensionPolyline") {
          dcm.mark.push({});
          var mark = dcm.mark[dcm.mark.length - 1];
          mark.type = "TwoDimensionPolyline";
          var temp2 = temp[i].getElementsByTagName("twoDimensionSpatialCoordinateCollection")[0].getElementsByTagName("TwoDimensionSpatialCoordinate");
          mark.markX = [];
          mark.markY = [];
          for (var j = 0; j < temp2.length; j++) {
            //console.log(7);
            mark.markX.push(temp2[j].getElementsByTagName("x")[0].getAttribute("value"));
            mark.markY.push(temp2[j].getElementsByTagName("y")[0].getAttribute("value"));
          }
        } else if (temp[i].getAttribute("xsi:type") == "TwoDimensionMultiPoint") {
          dcm.mark.push({});
          var mark = dcm.mark[dcm.mark.length - 1];
          mark.type = "TwoDimensionMultiPoint";
          var temp2 = temp[i].getElementsByTagName("twoDimensionSpatialCoordinateCollection")[0].getElementsByTagName("TwoDimensionSpatialCoordinate");
          mark.markX = [];
          mark.markY = [];
          for (var j = 0; j < temp2.length; j++) {
            mark.markX.push(temp2[j].getElementsByTagName("x")[0].getAttribute("value"));
            mark.markY.push(temp2[j].getElementsByTagName("y")[0].getAttribute("value"));
          }
        } else if (temp[i].getAttribute("xsi:type") == "TwoDimensionEllipse") {
          dcm.mark.push({});
          var mark = dcm.mark[dcm.mark.length - 1];
          mark.type = "TwoDimensionEllipse";
          var temp2 = temp[i].getElementsByTagName("twoDimensionSpatialCoordinateCollection")[0].getElementsByTagName("TwoDimensionSpatialCoordinate");
          mark.markX = [];
          mark.markY = [];
          for (var j = 0; j < temp2.length; j++) {
            mark.markX.push(temp2[j].getElementsByTagName("x")[0].getAttribute("value"));
            mark.markY.push(temp2[j].getElementsByTagName("y")[0].getAttribute("value"));
          }
        } else if (temp[i].getAttribute("xsi:type") == "TextAnnotationEntity") {
          dcm.mark.push({});
          var mark = dcm.mark[dcm.mark.length - 1];
          mark.type = "TextAnnotationEntity";
          var temp2 = temp[i].getElementsByTagName("twoDimensionSpatialCoordinateCollection")[0].getElementsByTagName("TwoDimensionSpatialCoordinate");
          mark.markX = [];
          mark.markY = [];
          for (var j = 0; j < temp2.length; j++) {
            mark.markX.push(temp2[j].getElementsByTagName("x")[0].getAttribute("value"));
            mark.markY.push(temp2[j].getElementsByTagName("y")[0].getAttribute("value"));
          }
        }
      }

      PatientMark.push(dcm);
      refreshMark(dcm);
    } catch (ex) { }
  }
  oReq.send();
}

function readDicomOverlay(byteArray, dataSet, patientmark) {
  for (var ov = 0; ov <= 28; ov += 2) {
    var ov_str = "" + ov;
    if (ov < 10) ov_str = "0" + ov;
    if (!dataSet.elements['x600' + ov + '3000']) continue;
    try {
      var pixelData = new Uint8ClampedArray(dataSet.byteArray.buffer, dataSet.elements['x60' + ov_str + '3000'].dataOffset, dataSet.elements['x60' + ov_str + '3000'].length);
      var tempPixeldata = new Uint8ClampedArray(pixelData.length * 8);
      var tempi = 0;
      var tempnum = 0;
      for (var num of pixelData) {
        tempnum = num;
        if (parseInt((tempnum) % 2) == 1) tempPixeldata[tempi + 0] = 1;
        else tempPixeldata[num * 8 + 0] = 0;
        tempnum /= 2;
        if (parseInt((tempnum) % 2) == 1) tempPixeldata[tempi + 1] = 1;
        else tempPixeldata[num * 8 + 1] = 0;
        tempnum /= 2;
        if (parseInt((tempnum) % 2) == 1) tempPixeldata[tempi + 2] = 1;
        else tempPixeldata[num * 8 + 2] = 0;
        tempnum /= 2;
        if (parseInt((tempnum) % 2) == 1) tempPixeldata[tempi + 3] = 1;
        else tempPixeldata[num * 8 + 3] = 0;
        tempnum /= 2;
        if (parseInt((tempnum) % 2) == 1) tempPixeldata[tempi + 4] = 1;
        else tempPixeldata[num * 8 + 4] = 0;
        tempnum /= 2;
        if (parseInt((tempnum) % 2) == 1) tempPixeldata[tempi + 5] = 1;
        else tempPixeldata[num * 8 + 5] = 0;
        tempnum /= 2;
        if (parseInt((tempnum) % 2) == 1) tempPixeldata[tempi + 6] = 1;
        else tempPixeldata[num * 8 + 6] = 0;
        tempnum /= 2;
        if (parseInt((tempnum) % 2) == 1) tempPixeldata[tempi + 7] = 1;
        else tempPixeldata[num * 8 + 7] = 0;
        tempi += 8;
      }

      var dcm = {};
      dcm.study = dataSet.string('x0020000d');
      dcm.series = dataSet.string('x0020000e');
      dcm.sop = dataSet.string('x00080018');
      dcm.height = dataSet.uint16('x600' + ov + '0010');
      dcm.width = dataSet.uint16('x600' + ov + '0011');
      dcm.mark = [];
      dcm.showName = 'Overlay';
      dcm.hideName = dcm.showName + 'x60' + ov_str + '1500';
      if (dataSet.string('x60' + ov_str + '1500')) {
        dcm.showName = dataSet.string('x60' + ov_str + '1500');
      }
      dcm.mark.push({});
      var mark = dcm.mark[dcm.mark.length - 1];
      mark.type = "Overlay";
      mark.pixelData = tempPixeldata.slice(0);
      mark.canvas = document.createElement("CANVAS");
      mark.canvas.width = dcm.width;
      mark.canvas.height = dcm.height;
      mark.ctx = mark.canvas.getContext('2d');
      var pixelData = mark.ctx.getImageData(0, 0, dcm.width, dcm.height);
      for (var i = 0, j = 0; i < pixelData.data.length; i += 4, j++)
        if (mark.pixelData[j] == 1) {
          pixelData.data[i] = 0;
          pixelData.data[i + 1] = 0;
          pixelData.data[i + 2] = 255;
          pixelData.data[i + 3] = 255;
        }
      mark.ctx.putImageData(pixelData, 0, 0);
      patientmark.push(dcm);
      refreshMark(dcm);
    } catch (ex) { console.log(ex) }
  }
}

function readDicomRTSS(byteArray, dataSet, patientmark) {
  if (dataSet.string('x30060039')) {
    for (var i in dataSet.elements.x30060039.items) {
      var colorStr = ("" + dataSet.elements.x30060039.items[i].dataSet.string('x3006002a')).split("\\");
      var color;
      if (colorStr) color = "rgb(" + parseInt(colorStr[0]) + ", " + parseInt(colorStr[1]) + ", " + parseInt(colorStr[2]) + ")";


      if (!Object.prototype.hasOwnProperty.call(dataSet.elements.x30060039.items[i].dataSet.elements, "x30060040")) {
        continue;
      }

      for (var j in dataSet.elements.x30060039.items[i].dataSet.elements.x30060040.items) {
        for (var k in dataSet.elements.x30060039.items[i].dataSet.elements.x30060040.items[j].dataSet.elements.x30060016.items) {
          var dcm = {};
          dcm.study = dataSet.string('x0020000d');
          dcm.series = dataSet.string('x0020000e');
          try {
            dcm.series = dataSet.elements.x30060010.items[0].dataSet.elements.x30060012.items[0].dataSet.elements.x30060014.items[0].dataSet.string('x0020000e');
          } catch (ex) { }

          dcm.color = color;
          dcm.mark = [];
          var ROIName = getROINameList(byteArray, dataSet)[i];
          if (ROIName) dcm.showName = ROIName;

          dcm.hideName = dcm.showName;
          dcm.mark.push({});
          //dcm.SliceLocation=dataSet.string('x00201041');
          dcm.sop = dataSet.elements.x30060039.items[i].dataSet.elements.x30060040.items[j].dataSet.elements.x30060016.items[k].dataSet.string('x00081155');;
          var mark = dcm.mark[dcm.mark.length - 1];
          mark.type = "RTSS";
          mark.markX = [];
          mark.markY = [];
          mark.point = [];
          var str0 = ("" + dataSet.elements.x30060039.items[i].dataSet.elements.x30060040.items[j].dataSet.string('x30060050')).split("\\");
          for (var k2 = 0; k2 < str0.length; k2 += 3) {
            mark.markX.push((parseFloat(str0[k2])));
            mark.markY.push((parseFloat(str0[k2 + 1])));
            mark.point.push([parseFloat(str0[k2]), parseFloat(str0[k2 + 1])]);
            dcm.imagePositionZ = parseFloat(str0[k2 + 2]);
          }
          patientmark.push(dcm);
          refreshMark(dcm);
        }
      }
    }
  }
}

function getROINameList(byteArray, dataSet) {
  var ROINameList = [];
  if (dataSet.string('x30060020')) {
    for (var i in dataSet.elements.x30060020.items) {
      if (dataSet.elements.x30060020.items[i].dataSet.string('x30060026')) {
        ROINameList.push("" + (dataSet.elements.x30060020.items[i].dataSet.string('x30060026')));
      }
    }
  }
  return ROINameList;
}

function readDicom(url, patientmark, openfile) {
  var oReq = new XMLHttpRequest();
  try {
    oReq.open("get", url, true);
    var wadoToken = ConfigLog.WADO.token;
    for (var to = 0; to < Object.keys(wadoToken).length; to++) {
      if (wadoToken[Object.keys(wadoToken)[to]] != "") {
        oReq.setRequestHeader("" + Object.keys(wadoToken)[to], "" + wadoToken[Object.keys(wadoToken)[to]]);
      }
    }
  } catch (err) { }
  oReq.responseType = "arraybuffer";
  oReq.onreadystatechange = function (oEvent) {
    if (oReq.readyState == 4) {
      if (oReq.status == 200) {
        var byteArray = new Uint8Array(oReq.response);
        var dataSet = dicomParser.parseDicom(byteArray);
        readDicomOverlay(byteArray, dataSet, patientmark);

        if (dataSet.string('x00700001')) {
          var sop1;
          if (dataSet.string('x00081115')) {
            for (var ii2 in dataSet.elements.x00081115.items) {
              var x00081115DataSet = dataSet.elements.x00081115.items[ii2].dataSet.elements.x00081140.items;
              //console.log(x00081115DataSet.length);
              for (var s = 0; s < x00081115DataSet.length; s++) {
                //for (var ii3 in x00081115DataSet) {
                sop1 = x00081115DataSet[s].dataSet.string('x00081155');
                //}

                var tempsop = ""
                var tempDataSet = "";
                var GSPS_Text = "";
                function POLYLINE_Function(tempDataSet, GSPS_Text, g) {
                  if (tempDataSet == "") {
                    return;
                  };
                  // for (var j in tempDataSet) {
                  if (g != undefined) var tempDataSetLengthList = [g];
                  else {
                    var tempDataSetLengthList = tempDataSet;
                    // console.log(tempDataSetLengthList.length);
                  }
                  for (var j1 = 0; j1 < tempDataSetLengthList.length; j1++) {
                    var j = tempDataSetLengthList[j1];
                    if (g != undefined) var j = tempDataSetLengthList[j1];
                    else {
                      var j = j1;
                    }
                    if (tempDataSet[j].dataSet.string('x00700023') == 'POLYLINE' ||
                      tempDataSet[j].dataSet.string('x00700023') == 'INTERPOLATED') {
                      var dcm = {};
                      dcm.sop = sop1;
                      dcm.mark = [];
                      dcm.mark.push({});

                      var showname = "" + tempDataSet[j].dataSet.string('x00700023');
                      if (tempDataSet[j].dataSet.elements.x00700232) {
                        var ColorSequence = tempDataSet[j].dataSet.elements.x00700232.items[0].dataSet;
                        var color = ConvertGraphicColor(ColorSequence.uint16('x00700251', 0), ColorSequence.uint16('x00700251', 1), ColorSequence.uint16('x00700251', 2));
                        if (color) {
                          dcm.color = color[0];
                          showname = color[1];
                        }
                      }

                      dcm.showName = showname;
                      if (GSPS_Text != "" && GSPS_Text != undefined) {
                        dcm.showName = GSPS_Text;
                      };
                      dcm.hideName = dcm.showName;
                      var mark = dcm.mark[dcm.mark.length - 1];
                      mark.type = tempDataSet[j].dataSet.string('x00700023');//"POLYLINE";
                      mark.markX = [];
                      mark.markY = [];
                      mark.point = [];
                      mark.RotationAngle = tempDataSet[j].dataSet.double('x00710230');
                      mark.GraphicFilled = tempDataSet[j].dataSet.string('x00700024');

                      mark.RotationPoint = [tempDataSet[j].dataSet.float('x00710273', 0), tempDataSet[j].dataSet.float('x00710273', 1)];
                      if (GSPS_Text != "" && GSPS_Text != undefined) {
                        mark.GSPS_Text = GSPS_Text;
                      };
                      var xTemp16 = tempDataSet[j].dataSet.string('x00700022');

                      function getTag(tag) {
                        var group = tag.substring(1, 5);
                        var element = tag.substring(5, 9);
                        var tagIndex = ("(" + group + "," + element + ")").toUpperCase();
                        var attr = TAG_DICT[tagIndex];
                        return attr;
                      }
                      var rect = parseInt(tempDataSet[j].dataSet.int16("x00700020")) * parseInt(tempDataSet[j].dataSet.int16("x00700021"));
                      for (var r = 0; r < rect; r += 2) {
                        var GraphicData = getTag("x00700022");
                        var numX = 0,
                          numY = 0;
                        if (GraphicData.vr == 'US') {
                          numX = tempDataSet[j].dataSet.uint16("x00700022", r);
                          numY = tempDataSet[j].dataSet.uint16("x00700022", r + 1);
                        } else if (GraphicData.vr === 'SS') {
                          numX = tempDataSet[j].dataSet.int16("x00700022", r);
                          numY = tempDataSet[j].dataSet.int16("x00700022", r + 1);
                        } else if (GraphicData.vr === 'UL') {
                          numX = tempDataSet[j].dataSet.uint32("x00700022", r);
                          numY = tempDataSet[j].dataSet.uint32("x00700022", r + 1);
                        } else if (GraphicData.vr === 'SL') {
                          numX = tempDataSet[j].dataSet.int32("x00700022", r);
                          numY = tempDataSet[j].dataSet.int32("x00700022", r + 1);
                        } else if (GraphicData.vr === 'FD') {
                          numX = tempDataSet[j].dataSet.double("x00700022", r);
                          numY = tempDataSet[j].dataSet.double("x00700022", r + 1);
                        } else if (GraphicData.vr === 'FL') {
                          numX = tempDataSet[j].dataSet.float("x00700022", r);
                          numY = tempDataSet[j].dataSet.float("x00700022", r + 1);
                        } else {
                          numX = tempDataSet[j].dataSet.float("x00700022", r);
                          numY = tempDataSet[j].dataSet.float("x00700022", r + 1);
                        }
                        if (mark.RotationAngle && mark.RotationPoint) {
                          [numX, numY] = rotatePoint([numX, numY], -mark.RotationAngle, mark.RotationPoint);
                        }
                        mark.markX.push(parseFloat(numX));
                        mark.markY.push(parseFloat(numY));
                        mark.point.push([parseFloat(numX), parseFloat(numY)]);
                      }
                      patientmark.push(dcm);
                      refreshMark(dcm, false);
                    }

                    if (tempDataSet[j].dataSet.string('x00700023') == 'CIRCLE') {
                      var dcm = {};
                      dcm.sop = sop1;
                      dcm.mark = [];
                      dcm.mark.push({});
                      var showname = 'CIRCLE';
                      if (tempDataSet[j].dataSet.elements.x00700232) {
                        var ColorSequence = tempDataSet[j].dataSet.elements.x00700232.items[0].dataSet;
                        var color = ConvertGraphicColor(ColorSequence.uint16('x00700251', 0), ColorSequence.uint16('x00700251', 1), ColorSequence.uint16('x00700251', 2));
                        if (color) {
                          dcm.color = color[0];
                          showname = color[1];
                        }
                      }
                      dcm.showName = showname;
                      dcm.hideName = dcm.showName;
                      var mark = dcm.mark[dcm.mark.length - 1];
                      mark.type = "CIRCLE";
                      mark.markX = [];
                      mark.markY = [];
                      mark.point = [];
                      mark.GraphicFilled = tempDataSet[j].dataSet.string('x00700024');
                      var xTemp16 = tempDataSet[j].dataSet.string('x00700022');;
                      var rect = parseInt(tempDataSet[j].dataSet.int16("x00700020")) * parseInt(tempDataSet[j].dataSet.int16("x00700021"));
                      for (var r = 0; r < rect; r += 4) {
                        var numX = 0,
                          numY = 0,
                          numX2 = 0,
                          numY2 = 0;
                        numX = tempDataSet[j].dataSet.float("x00700022", r);
                        numY = tempDataSet[j].dataSet.float("x00700022", r + 1);
                        numX2 = tempDataSet[j].dataSet.float("x00700022", r + 2);
                        numY2 = tempDataSet[j].dataSet.float("x00700022", r + 3);
                        /*if (dcm.mark[DcmMarkLength].RotationAngle && dcm.mark[DcmMarkLength].RotationPoint) {
                          [numX, numY] = rotatePoint([numX, numY], -dcm.mark[DcmMarkLength].RotationAngle, dcm.mark[DcmMarkLength].RotationPoint);
                        }*/
                        mark.markX.push(parseFloat(numX));
                        mark.markY.push(parseFloat(numY));
                        mark.point.push([parseFloat(numX), parseFloat(numY)]);
                        mark.markX.push(parseFloat(numX2));
                        mark.markY.push(parseFloat(numY2));
                        mark.point.push([parseFloat(numX2), parseFloat(numY2)]);
                      }
                      patientmark.push(dcm);
                      refreshMark(dcm, false);
                    }
                    if (tempDataSet[j].dataSet.string('x00700015') && tempDataSet[j].dataSet.string('x00700015') == 'Y') {
                      var dcm = {};
                      dcm.sop = sop1;
                      dcm.mark = [];
                      dcm.mark.push({});

                      var showname = 'Anchor';
                      if (tempDataSet[j].dataSet.elements.x00700232) {
                        var ColorSequence = tempDataSet[j].dataSet.elements.x00700232.items[0].dataSet;
                        var color = ConvertGraphicColor(ColorSequence.uint16('x00700251', 0), ColorSequence.uint16('x00700251', 1), ColorSequence.uint16('x00700251', 2));
                        if (color) {
                          dcm.color = color[0];
                          showname = color[1];
                        }
                      }

                      dcm.showName = showname;
                      if (GSPS_Text != "" && GSPS_Text != undefined) {
                        dcm.showName = GSPS_Text;
                      };
                      dcm.hideName = dcm.showName;
                      var mark = dcm.mark[dcm.mark.length - 1];
                      mark.type = "POLYLINE";
                      mark.markX = [];
                      mark.markY = [];
                      mark.point = [];
                      mark.markX.push(tempDataSet[j].dataSet.float('x00700010', 0), tempDataSet[j].dataSet.float('x00700011', 0));
                      mark.markY.push(tempDataSet[j].dataSet.float('x00700010', 1), tempDataSet[j].dataSet.float('x00700011', 1));
                      mark.point.push(
                        [tempDataSet[j].dataSet.float('x00700010', 0), tempDataSet[j].dataSet.float('x00700010', 1)],
                        [tempDataSet[j].dataSet.float('x00700011', 0), tempDataSet[j].dataSet.float('x00700011', 1)]
                      );
                      patientmark.push(dcm);
                      refreshMark(dcm, false);
                    }

                    if (!tempDataSet[j].dataSet.string('x00700023') && GSPS_Text == "") {
                      //var xTemp10 = [tempDataSet[j].dataSet.float('x00700010', 0), tempDataSet[j].dataSet.float('x00700010', 1)];
                      //var yTemp10 = [tempDataSet[j].dataSet.float('x00700011', 0), tempDataSet[j].dataSet.float('x00700011', 1)];
                      GSPS_Text = tempDataSet[j].dataSet.string("x00700006");
                      //console.log(j+"   "+GSPS_Text);
                      if (GSPS_Text != "") {
                        //console.log(xTemp10+"  "+yTemp10+"   "+GSPS_Text);
                        var dcm = {};
                        dcm.sop = sop1;
                        dcm.mark = [];
                        dcm.mark.push({});
                        var showname = 'TEXT';
                        dcm.showName = showname;
                        dcm.hideName = dcm.showName;
                        var mark = dcm.mark[dcm.mark.length - 1];
                        mark.type = "TEXT";
                        mark.markX = [];
                        mark.markY = [];
                        mark.point = [];
                        if (GSPS_Text != "" && GSPS_Text != undefined) {
                          GSPS_Text = ("" + GSPS_Text).replace('\r\n', '\n');
                          mark.GSPS_Text = GSPS_Text;
                        };
                        mark.markX.push(tempDataSet[j].dataSet.float('x00700010', 0));
                        mark.markX.push(tempDataSet[j].dataSet.float('x00700011', 0));
                        mark.markY.push(tempDataSet[j].dataSet.float('x00700010', 1));
                        mark.markY.push(tempDataSet[j].dataSet.float('x00700011', 1));

                        mark.point.push([tempDataSet[j].dataSet.float('x00700010', 0), tempDataSet[j].dataSet.float('x00700010', 1)]);
                        mark.point.push([tempDataSet[j].dataSet.float('x00700011', 0), tempDataSet[j].dataSet.float('x00700011', 1)]);
                        patientmark.push(dcm);
                        refreshMark(dcm, false);
                      }
                    }
                    if (tempDataSet[j].dataSet.string('x00700023') == 'ELLIPSE') {
                      var dcm = {};
                      dcm.sop = sop1;
                      dcm.mark = [];
                      dcm.mark.push({});
                      var showname = 'ELLIPSE';
                      dcm.showName = showname;
                      dcm.hideName = dcm.showName;
                      var mark = dcm.mark[dcm.mark.length - 1];
                      mark.type = "ELLIPSE";
                      mark.markX = [];
                      mark.markY = [];
                      mark.point = [];
                      mark.GraphicFilled = tempDataSet[j].dataSet.string('x00700024');
                      var xTemp16 = tempDataSet[j].dataSet.string('x00700022');;
                      var ablecheck = false;
                      for (var k2 = 0; k2 < xTemp16.length; k2 += 4) {

                        var output1 = xTemp16[k2].charCodeAt(0).toString(2) + "";
                        var output2 = xTemp16[k2 + 1].charCodeAt(0).toString(2) + "";
                        var output3 = xTemp16[k2 + 2].charCodeAt(0).toString(2) + "";
                        var output4 = xTemp16[k2 + 3].charCodeAt(0).toString(2) + "";
                        var data = [parseInt(output1, 2), parseInt(output2, 2), parseInt(output3, 2), parseInt(output4, 2)];
                        var buf = new ArrayBuffer(4 /* * 4*/);
                        var view = new DataView(buf);
                        data.forEach(function (b, i) {
                          view.setUint8(i, b, true);
                        });
                        var num = view.getFloat32(0, true);
                        if (ablecheck == false) {
                          mark.markX.push(num);
                        } else {
                          mark.markY.push(num);
                        }
                        ablecheck = !ablecheck;
                      }
                      patientmark.push(dcm);
                      //console.log(PatientMark);
                      refreshMark(dcm, false);
                    }
                  }

                }

                try {
                  for (var i in dataSet.elements.x00700001.items) {
                    for (var d1 = 0; d1 < dataSet.elements.x00700001.items[i].dataSet.elements.x00081140.items.length; d1++) {
                      var tempsop = dataSet.elements.x00700001.items[i].dataSet.elements.x00081140.items[d1].dataSet.string('x00081155')
                      if (tempsop == sop1) {
                        tempDataSet = dataSet.elements.x00700001.items[i].dataSet.elements.x00700009.items;
                        // for (var g = 0; g < dataSet.elements.x00700001.items[i].dataSet.elements.x00700009.items.length; g++) {
                        try {
                          //GSPS_Text = dataSet.elements.x00700001.items[i].dataSet.elements.x00700008.items[g].dataSet.string("x00700006");
                          POLYLINE_Function(tempDataSet, "", undefined);
                        } catch (ex) { }
                        try {
                          for (var g = 0; g < dataSet.elements.x00700001.items[i].dataSet.elements.x00700008.items.length; g++) {
                            try {
                              GSPS_Text = dataSet.elements.x00700001.items[i].dataSet.elements.x00700008.items[g].dataSet.string("x00700006");
                              tempDataSet = dataSet.elements.x00700001.items[i].dataSet.elements.x00700008.items;
                              POLYLINE_Function(tempDataSet, "", g);
                            } catch (ex) { }
                          }
                        } catch (ex) { }

                        //break;
                      };

                      if (tempsop != sop1) continue;
                    }
                  }
                  if (sop1) refreshMarkFromSop(sop1);
                } catch (ex) {
                  for (var i in dataSet.elements.x00700001.items) {
                    try {
                      tempDataSet = dataSet.elements.x00700001.items[i].dataSet.elements.x00700009.items;

                      POLYLINE_Function(tempDataSet, GSPS_Text);

                    } catch (ex) {
                      console.log(GSPS_Text);
                      continue;
                    }
                  }
                  if (sop1) refreshMarkFromSop(sop1);
                }
              }
            }
          }
        }

        readDicomRTSS(byteArray, dataSet, patientmark);

      }
    }
  };
  oReq.send();
}

function loadDicomSeg(image, imageId) {
  var dataSet = image.data;
  var ImageFrame = cornerstoneWADOImageLoader.getImageFrame(imageId);
  var rect = (image.rows * image.columns);
  if (dataSet.elements.x7fe00010.fragments) {
    function x52009229_or_30(x52009230, x52009229) {
      try {
        for (var i = 0; i < dataSet.elements.x7fe00010.fragments.length; i++) {
          var pixeldata = new Uint8Array(dataSet.byteArray.buffer,
            dataSet.elements.x7fe00010.fragments[i].position,
            dataSet.elements.x7fe00010.fragments[i].length)
          var NewpixelData = decodeImageFrame(ImageFrame, dataSet.string("x00020010"), pixeldata, {
            usePDFJS: false
          }).pixelData;
          var showname = 'SEG';
          var dcm = {};
          dcm.study = image.data.string('x0020000d');
          dcm.series = image.data.elements.x00081115.items[0].dataSet.string('x0020000e')
          try {
            dcm.sop = x52009230.items[i].dataSet.elements.x00089124.items[0].dataSet.elements.x00082112.items[0].dataSet.string("x00081155");
          } catch (ex) {
            dcm.sop = x52009229.items[i].dataSet.elements.x00089124.items[0].dataSet.elements.x00082112.items[0].dataSet.string("x00081155");
          } try {
            dcm.ImagePositionPatient = x52009230.items[i].dataSet.elements.x00209113.items[0].dataSet.string("x00200032");
          } catch (ex) {
            dcm.ImagePositionPatient = x52009229.items[i].dataSet.elements.x00209113.items[0].dataSet.string("x00200032");
          }
          dcm.mark = [];
          dcm.showName = showname;
          dcm.hideName = dcm.showName;
          dcm.mark.push({});
          var mark = dcm.mark[dcm.mark.length - 1];
          mark.type = "SEG";
          mark.pixelData = new Uint8ClampedArray(rect);
          for (var pix = 0; pix < rect; pix++)
            mark.pixelData[pix] = NewpixelData[pix];

          mark.canvas = document.createElement("CANVAS");
          mark.canvas.width = image.columns;
          mark.canvas.height = image.rows;
          mark.ctx = mark.canvas.getContext('2d');
          var pixelData = mark.ctx.getImageData(0, 0, image.columns, image.rows);
          for (var i = 0, j = 0; i < pixelData.data.length; i += 4, j++)
            if (mark.pixelData[j] != 0) {
              pixelData.data[i] = 0;
              pixelData.data[i + 1] = 0;
              pixelData.data[i + 2] = 255;
              pixelData.data[i + 3] = 255;
            }
          mark.ctx.putImageData(pixelData, 0, 0);

          PatientMark.push(dcm);
          refreshMark(dcm);
        }
      } catch (ex) {
      }
    }
    x52009229_or_30(image.data.elements.x52009230, image.data.elements.x52009229);
  } else {
    var NewpixelData = new Uint8Array(dataSet.byteArray.buffer, dataSet.elements.x7fe00010.dataOffset, dataSet.elements.x7fe00010.length);

    function x52009229_or_30(x52009230, x52009229) {
      try {
        var sliceNum = x52009230.items.length;
        for (var k = 0; k < x52009230.items.length; k++) {
          var showname = 'SEG';
          var dcm = {};
          dcm.study = image.data.string('x0020000d');
          dcm.series = image.data.elements.x00081115.items[0].dataSet.string('x0020000e')
          try {
            dcm.sop = x52009230.items[k].dataSet.elements.x00089124.items[0].dataSet.elements.x00082112.items[0].dataSet.string("x00081155");
          } catch (ex) {
            dcm.sop = x52009229.items[0].dataSet.elements.x00089124.items[0].dataSet.elements.x00082112.items[k].dataSet.string("x00081155");
          }
          try {
            dcm.ImagePositionPatient = x52009230.items[k].dataSet.elements.x00209113.items[0].dataSet.string("x00200032");
          } catch (ex) {
            dcm.ImagePositionPatient = x52009229.items[k].dataSet.elements.x00209113.items[0].dataSet.string("x00200032");
          }
          dcm.mark = [];
          dcm.showName = showname;
          dcm.hideName = dcm.showName;
          dcm.mark.push({});
          var mark = dcm.mark[dcm.mark.length - 1];
          mark.type = "SEG";

          mark.pixelData = new Uint8ClampedArray(rect);
          if (NewpixelData.length == rect * x52009230.items.length) {
            for (var pix = 0; pix < rect; pix++)
              mark.pixelData[pix] = NewpixelData[pix + rect * k];
          } else {
            for (var pix = 0; pix < rect; pix++)
              mark.pixelData[pix] = NewpixelData[parseInt(pix / (rect / (NewpixelData.length / sliceNum))) + (NewpixelData.length / sliceNum) * k];
          }

          mark.canvas = document.createElement("CANVAS");
          mark.canvas.width = image.columns;
          mark.canvas.height = image.rows;
          mark.ctx = mark.canvas.getContext('2d');
          var pixelData = mark.ctx.getImageData(0, 0, image.columns, image.rows);
          for (var i = 0, j = 0; i < pixelData.data.length; i += 4, j++)
            if (mark.pixelData[j] != 0) {
              pixelData.data[i] = 0;
              pixelData.data[i + 1] = 0;
              pixelData.data[i + 2] = 255;
              pixelData.data[i + 3] = 255;
            }
          mark.ctx.putImageData(pixelData, 0, 0);
          PatientMark.push(dcm);
          refreshMark(dcm);
        }
      } catch (ex) {
      }
    }
    x52009229_or_30(image.data.elements.x52009230, image.data.elements.x52009229);
  }
}
