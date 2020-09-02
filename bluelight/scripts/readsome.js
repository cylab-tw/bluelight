function readXML(url) {
  var oReq = new XMLHttpRequest();
  try {
    oReq.open("get", url, true);
  } catch (err) {}
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
      try {
        var tempText = xmlDoc.getElementsByTagName("ImageAnnotationCollection")[0].getElementsByTagName("imageAnnotations")[0].
        getElementsByTagName("ImageAnnotation")[0].getElementsByTagName("imagingObservationEntityCollection")[0]
          .getElementsByTagName("ImagingObservationEntity");
        for (var i = 0; i < tempText.length; i++) {
          dcm.mark.push({});
          var DcmMarkLength = dcm.mark.length - 1;
          dcm.mark[DcmMarkLength].type = "Characteristic";
          var temp2 = tempText[i].getElementsByTagName("imagingObservationCharacteristicCollection")[0].
          getElementsByTagName("ImagingObservationCharacteristic");
          dcm.mark[DcmMarkLength].markTitle = "";
          dcm.mark[DcmMarkLength].markTitle = "" + tempText[i].getElementsByTagName("label")[0].getAttribute("value") +
            ":" + tempText[i].getElementsByTagName("typeCode")[0].getElementsByTagName("iso:displayName")[0].getAttribute("value");;
          dcm.mark[DcmMarkLength].markX = [];
          dcm.mark[DcmMarkLength].markY = [];
          dcm.mark[DcmMarkLength].markZ = [];
          for (var j = 0; j < temp2.length; j++) {
            dcm.mark[DcmMarkLength].markX.push(temp2[j].getElementsByTagName("label")[0].getAttribute("value"));
            dcm.mark[DcmMarkLength].markZ.push(temp2[j].getElementsByTagName("typeCode")[0].getAttribute("code"));
            dcm.mark[DcmMarkLength].markY.push(temp2[j].getElementsByTagName("typeCode")[0].getElementsByTagName("iso:displayName")[0].getAttribute("value"));
          }
        }
      } catch (ex) {
        //console.log(ex);
      }

      for (var i = 0; i < temp.length; i++) {
        if (temp[i].getAttribute("xsi:type") == "TwoDimensionPolyline") {
          dcm.mark.push({});
          var DcmMarkLength = dcm.mark.length - 1;
          dcm.mark[DcmMarkLength].type = "TwoDimensionPolyline";
          var temp2 = temp[i].getElementsByTagName("twoDimensionSpatialCoordinateCollection")[0].getElementsByTagName("TwoDimensionSpatialCoordinate");
          dcm.mark[DcmMarkLength].markX = [];
          dcm.mark[DcmMarkLength].markY = [];
          for (var j = 0; j < temp2.length; j++) {
            //console.log(7);
            dcm.mark[DcmMarkLength].markX.push(temp2[j].getElementsByTagName("x")[0].getAttribute("value"));
            dcm.mark[DcmMarkLength].markY.push(temp2[j].getElementsByTagName("y")[0].getAttribute("value"));
          }
        } else if (temp[i].getAttribute("xsi:type") == "TwoDimensionMultiPoint") {
          dcm.mark.push({});
          var DcmMarkLength = dcm.mark.length - 1;
          dcm.mark[DcmMarkLength].type = "TwoDimensionMultiPoint";
          var temp2 = temp[i].getElementsByTagName("twoDimensionSpatialCoordinateCollection")[0].getElementsByTagName("TwoDimensionSpatialCoordinate");
          dcm.mark[DcmMarkLength].markX = [];
          dcm.mark[DcmMarkLength].markY = [];
          for (var j = 0; j < temp2.length; j++) {
            dcm.mark[DcmMarkLength].markX.push(temp2[j].getElementsByTagName("x")[0].getAttribute("value"));
            dcm.mark[DcmMarkLength].markY.push(temp2[j].getElementsByTagName("y")[0].getAttribute("value"));
          }
        } else if (temp[i].getAttribute("xsi:type") == "TwoDimensionEllipse") {
          dcm.mark.push({});
          var DcmMarkLength = dcm.mark.length - 1;
          dcm.mark[DcmMarkLength].type = "TwoDimensionEllipse";
          var temp2 = temp[i].getElementsByTagName("twoDimensionSpatialCoordinateCollection")[0].getElementsByTagName("TwoDimensionSpatialCoordinate");
          dcm.mark[DcmMarkLength].markX = [];
          dcm.mark[DcmMarkLength].markY = [];
          for (var j = 0; j < temp2.length; j++) {
            dcm.mark[DcmMarkLength].markX.push(temp2[j].getElementsByTagName("x")[0].getAttribute("value"));
            dcm.mark[DcmMarkLength].markY.push(temp2[j].getElementsByTagName("y")[0].getAttribute("value"));
          }
        } else if (temp[i].getAttribute("xsi:type") == "TextAnnotationEntity") {
          dcm.mark.push({});
          var DcmMarkLength = dcm.mark.length - 1;
          dcm.mark[DcmMarkLength].type = "TextAnnotationEntity";
          var temp2 = temp[i].getElementsByTagName("twoDimensionSpatialCoordinateCollection")[0].getElementsByTagName("TwoDimensionSpatialCoordinate");
          dcm.mark[DcmMarkLength].markX = [];
          dcm.mark[DcmMarkLength].markY = [];
          for (var j = 0; j < temp2.length; j++) {
            dcm.mark[DcmMarkLength].markX.push(temp2[j].getElementsByTagName("x")[0].getAttribute("value"));
            dcm.mark[DcmMarkLength].markY.push(temp2[j].getElementsByTagName("y")[0].getAttribute("value"));
          }
        }
      }

      PatientMark.push(dcm);
      refreshMark(dcm);
    } catch (ex) {}
  }
  oReq.send();
}

function readDicom(url, patientmark, openfile) {
  var oReq = new XMLHttpRequest();
  try {
    oReq.open("get", url, true);
  } catch (err) {}
  oReq.responseType = "arraybuffer";
  oReq.onreadystatechange = function (oEvent) {
    if (oReq.readyState == 4) {
      if (oReq.status == 200) {
        var byteArray = new Uint8Array(oReq.response);
        var dataSet = dicomParser.parseDicom(byteArray);
        try {
          var pixelData = new Uint8Array(dataSet.byteArray.buffer, dataSet.elements.x60003000.dataOffset, dataSet.elements.x60003000.length);
          var tempPixeldata = new Uint8Array(pixelData.length * 8);
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
          var tvList = ['Overlay'];
          var dcm = {};
          dcm.study = dataSet.string('x0020000d');
          dcm.series = dataSet.string('x0020000e');
          dcm.sop = dataSet.string('x00080018');
          dcm.mark = [];
          dcm.showName = tvList[0];
          dcm.mark.push({});
          var DcmMarkLength = dcm.mark.length - 1;
          dcm.mark[DcmMarkLength].type = "Overlay";
          dcm.mark[DcmMarkLength].pixelData = tempPixeldata.slice(0);;
          patientmark.push(dcm);
          refreshMark(dcm);
        } catch (ex) {}
        ////暫時取消的功能
        /*
        if (openfile && openfile == true) {
          if (dataSet.string('x00080016') == '1.2.840.10008.5.1.4.1.1.481.2') {
            LeftImg("Dose");
          }
          if (dataSet.string('x00080016') == '1.2.840.10008.5.1.4.1.1.481.3') {
            LeftImg("Struct");
          }
          if (dataSet.string('x00080016') == '1.2.840.10008.5.1.4.1.1.481.5') {
            LeftImg("Plan");
          }
        }*/
        var tvList = [];
        if (dataSet.string('x30060020')) {
          for (var i in dataSet.elements.x30060020.items) {
            if (dataSet.elements.x30060020.items[i].dataSet.string('x30060026')) {
              tvList.push("" + (dataSet.elements.x30060020.items[i].dataSet.string('x30060026')));
            }
          }
        }

        if (dataSet.string('x00700001')) {
          var sop1;
          if (dataSet.string('x00081115')) {
            for (var i in dataSet.elements.x00081115.items) {
              var x00081115DataSet = dataSet.elements.x00081115.items[i].dataSet.elements.x00081140.items;
              for (var i in x00081115DataSet) {
                sop1 = x00081115DataSet[i].dataSet.string('x00081155');
              }
            }
          }

          for (var i in dataSet.elements.x00700001.items) {
            try {
              var tempDataSet = dataSet.elements.x00700001.items[i].dataSet.elements.x00700009.items;
            } catch (ex) {
              continue;
            }
            for (var j in tempDataSet) {
              if (tempDataSet[j].dataSet.string('x00700023') == 'POLYLINE') {
                var dcm = {};
                dcm.sop = sop1;
                dcm.mark = [];
                dcm.mark.push({});

                var tvList = ['POLYLINE'];
                if (tempDataSet[j].dataSet.elements.x00700232) {
                  var ColorSequence = tempDataSet[j].dataSet.elements.x00700232.items[0].dataSet;
                  var color = ConvertGraphicColor(ColorSequence.uint16('x00700251', 0), ColorSequence.uint16('x00700251', 1), ColorSequence.uint16('x00700251', 2));
                  if (color) {
                    dcm.color = color[0];
                    tvList = [color[1]];
                  }
                }

                dcm.showName = tvList[0];
                var DcmMarkLength = dcm.mark.length - 1;
                dcm.mark[DcmMarkLength].type = "POLYLINE";
                dcm.mark[DcmMarkLength].markX = [];
                dcm.mark[DcmMarkLength].markY = [];
                dcm.mark[DcmMarkLength].RotationAngle = tempDataSet[j].dataSet.double('x00710230');
                dcm.mark[DcmMarkLength].RotationPoint = [tempDataSet[j].dataSet.float('x00710273', 0), tempDataSet[j].dataSet.float('x00710273', 1)];

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
                  if (dcm.mark[DcmMarkLength].RotationAngle && dcm.mark[DcmMarkLength].RotationPoint) {
                    [numX, numY] = rotatePoint([numX, numY], -dcm.mark[DcmMarkLength].RotationAngle, dcm.mark[DcmMarkLength].RotationPoint);
                  }
                  dcm.mark[DcmMarkLength].markX.push(parseFloat(numX));
                  dcm.mark[DcmMarkLength].markY.push(parseFloat(numY));
                }
                patientmark.push(dcm);
                refreshMark(dcm);
              }
              if (tempDataSet[j].dataSet.string('x00700023') == 'CIRCLE') {
                var dcm = {};
                dcm.sop = sop1;
                dcm.mark = [];
                dcm.mark.push({});
                var tvList = ['CIRCLE'];
                if (tempDataSet[j].dataSet.elements.x00700232) {
                  var ColorSequence = tempDataSet[j].dataSet.elements.x00700232.items[0].dataSet;
                  var color = ConvertGraphicColor(ColorSequence.uint16('x00700251', 0), ColorSequence.uint16('x00700251', 1), ColorSequence.uint16('x00700251', 2));
                  if (color) {
                    dcm.color = color[0];
                    tvList = [color[1]];
                  }
                }
                dcm.showName = tvList[0];
                var DcmMarkLength = dcm.mark.length - 1;
                dcm.mark[DcmMarkLength].type = "CIRCLE";
                dcm.mark[DcmMarkLength].markX = [];
                dcm.mark[DcmMarkLength].markY = [];
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
                  dcm.mark[DcmMarkLength].markX.push(parseFloat(numX));
                  dcm.mark[DcmMarkLength].markY.push(parseFloat(numY));
                  dcm.mark[DcmMarkLength].markX.push(parseFloat(numX2));
                  dcm.mark[DcmMarkLength].markY.push(parseFloat(numY2));
                }
                patientmark.push(dcm);
                refreshMark(dcm);
              }
              if (tempDataSet[j].dataSet.string('x00700023') == 'ELLIPSE') {
                var dcm = {};
                dcm.sop = sop1;
                dcm.mark = [];
                dcm.mark.push({});
                var tvList = ['ELLIPSE'];
                dcm.showName = tvList[0];
                var DcmMarkLength = dcm.mark.length - 1;
                dcm.mark[DcmMarkLength].type = "ELLIPSE";
                dcm.mark[DcmMarkLength].markX = [];
                dcm.mark[DcmMarkLength].markY = [];
                var xTemp16 = tempDataSet[j].dataSet.string('x00700022');;
                var ablecheck = false;
                for (var k2 = 0; k2 < xTemp16.length; k2 += 4) {

                  var output1 = xTemp16[k2].charCodeAt(0).toString(2) + "";
                  var output2 = xTemp16[k2 + 1].charCodeAt(0).toString(2) + "";
                  var output3 = xTemp16[k2 + 2].charCodeAt(0).toString(2) + "";
                  var output4 = xTemp16[k2 + 3].charCodeAt(0).toString(2) + "";
                  var data = [parseInt(output1, 2), parseInt(output2, 2), parseInt(output3, 2), parseInt(output4, 2)];
                  var buf = new ArrayBuffer(4 /* * 4*/ );
                  var view = new DataView(buf);
                  data.forEach(function (b, i) {
                    view.setUint8(i, b, true);
                  });
                  var num = view.getFloat32(0, true);
                  if (ablecheck == false) {
                    dcm.mark[DcmMarkLength].markX.push(num);
                  } else {
                    dcm.mark[DcmMarkLength].markY.push(num);
                  }
                  ablecheck = !ablecheck;
                }
                patientmark.push(dcm);
                //console.log(PatientMark);
                refreshMark(dcm);
              }
            }

          }
        }

        if (dataSet.string('x30060039')) {
          for (var i in dataSet.elements.x30060039.items) {
            var colorStr = ("" + dataSet.elements.x30060039.items[i].dataSet.string('x3006002a')).split("\\");
            var color;
            if (colorStr) color = "rgb(" + parseInt(colorStr[0]) + ", " + parseInt(colorStr[1]) + ", " + parseInt(colorStr[2]) + ")";
            for (var j in dataSet.elements.x30060039.items[i].dataSet.elements.x30060040.items) {
              for (var k in dataSet.elements.x30060039.items[i].dataSet.elements.x30060040.items[j].dataSet.elements.x30060016.items) {
                var dcm = {};
                dcm.study = dataSet.string('x0020000d');
                dcm.series = dataSet.string('x0020000e');
                try {
                  dcm.series = dataSet.elements.x30060010.items[0].dataSet.elements.x30060012.items[0].dataSet.elements.x30060014.items[0].dataSet.string('x0020000e');
                } catch (ex) {}

                dcm.color = color;
                dcm.mark = [];
                if (tvList[i]) {
                  dcm.showName = tvList[i];
                }
                dcm.mark.push({});
                //dcm.SliceLocation=dataSet.string('x00201041');
                dcm.sop = dataSet.elements.x30060039.items[i].dataSet.elements.x30060040.items[j].dataSet.elements.x30060016.items[k].dataSet.string('x00081155');;
                var DcmMarkLength = dcm.mark.length - 1;
                dcm.mark[DcmMarkLength].type = "RTSS";
                dcm.mark[DcmMarkLength].markX = [];
                dcm.mark[DcmMarkLength].markY = [];
                var str0 = ("" + dataSet.elements.x30060039.items[i].dataSet.elements.x30060040.items[j].dataSet.string('x30060050')).split("\\");
                for (var k2 = 0; k2 < str0.length; k2 += 3) {
                  dcm.mark[DcmMarkLength].markX.push((parseFloat(str0[k2])));
                  dcm.mark[DcmMarkLength].markY.push((parseFloat(str0[k2 + 1])));
                  dcm.imagePositionZ = parseFloat(str0[k2 + 2]);
                }
                patientmark.push(dcm);
                refreshMark(dcm);
              }
            }
          }
        }
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
    for (var i = 0; i < dataSet.elements.x7fe00010.fragments.length; i++) {
      var pixeldata = new Uint8Array(dataSet.byteArray.buffer,
        dataSet.elements.x7fe00010.fragments[i].position,
        dataSet.elements.x7fe00010.fragments[i].length)
      var NewpixelData = decodeImageFrame(ImageFrame, dataSet.string("x00020010"), pixeldata, {
        usePDFJS: false
      }).pixelData;
      var tvList = ['SEG'];
      var dcm = {};
      dcm.study = image.data.string('x0020000d');
      dcm.series = image.data.elements.x00081115.items[0].dataSet.string('x0020000e')
      dcm.sop = image.data.elements.x52009230.items[i].dataSet.elements.x00089124.items[0].dataSet.elements.x00082112.items[0].dataSet.string("x00081155");
      dcm.ImagePositionPatient = image.data.elements.x52009230.items[i].dataSet.elements.x00209113.items[0].dataSet.string("x00200032");
      dcm.mark = [];
      dcm.showName = tvList[0];
      dcm.mark.push({});
      var DcmMarkLength = dcm.mark.length - 1;
      dcm.mark[DcmMarkLength].type = "SEG";
      dcm.mark[DcmMarkLength].pixelData = new Uint8Array(rect);
      for (var pix = 0; pix < rect; pix++)
        dcm.mark[DcmMarkLength].pixelData[pix] = NewpixelData[pix];
      PatientMark.push(dcm);
      refreshMark(dcm);
    }
  } else {
    var NewpixelData = new Uint8Array(dataSet.byteArray.buffer, dataSet.elements.x7fe00010.dataOffset, dataSet.elements.x7fe00010.length);
    for (var k = 0; k < image.data.elements.x52009230.items.length; k++) {
      var tvList = ['SEG'];
      var dcm = {};
      dcm.study = image.data.string('x0020000d');
      dcm.series = image.data.elements.x00081115.items[0].dataSet.string('x0020000e')
      dcm.sop = image.data.elements.x52009230.items[k].dataSet.elements.x00089124.items[0].dataSet.elements.x00082112.items[0].dataSet.string("x00081155");
      dcm.ImagePositionPatient = image.data.elements.x52009230.items[k].dataSet.elements.x00209113.items[0].dataSet.string("x00200032");
      dcm.mark = [];
      dcm.showName = tvList[0];
      dcm.mark.push({});
      var DcmMarkLength = dcm.mark.length - 1;
      dcm.mark[DcmMarkLength].type = "SEG";
      dcm.mark[DcmMarkLength].pixelData = new Uint8Array(rect);
      if (NewpixelData.length == rect * image.data.elements.x52009230.items.length) {
        for (var pix = 0; pix < rect; pix++)
          dcm.mark[DcmMarkLength].pixelData[pix] = NewpixelData[pix + rect * k];
      } else {
        for (var pix = 0; pix < rect; pix++)
          dcm.mark[DcmMarkLength].pixelData[pix] = NewpixelData[pix];
      }
      PatientMark.push(dcm);
      refreshMark(dcm);
    }
  }
}

function loadUID(study, series, sop, instance, imageId, patientId) {
  var Hierarchy = 0;
  var NumberOfStudy = -1;
  for (var i = 0; i < Patient.StudyAmount; i++) {
    if (Patient.Study[i].StudyUID == study)
      NumberOfStudy = i;
  }
  if (NumberOfStudy == -1) {
    var Study = {};
    Study.StudyUID = study;
    Study.PatientId = patientId;
    Study.SeriesAmount = 1;
    Study.Series = [];
    var Series = {};
    Series.SeriesUID = series;
    Series.SopAmount = 1;
    Series.Sop = [];
    var Sop = {};
    Sop.InstanceNumber = instance;
    Sop.SopUID = sop;
    Sop.imageId = imageId;
    Series.Sop.push(Sop);
    Study.Series.push(Series);
    Patient.Study.push(Study);
    Patient.StudyAmount += 1;
  } else {
    Hierarchy = 1;
    var isSeries = -1;
    for (var i = 0; i < Patient.Study[NumberOfStudy].SeriesAmount; i++) {
      if (Patient.Study[NumberOfStudy].Series[i].SeriesUID == series)
        isSeries = i;
    }
    if (isSeries == -1) {
      var Series = {};
      Series.SeriesUID = series;
      Series.SopAmount = 1;
      Series.Sop = [];
      var Sop = {};
      Sop.InstanceNumber = instance;
      Sop.SopUID = sop;
      Sop.imageId = imageId;
      Series.Sop.push(Sop);
      Patient.Study[NumberOfStudy].Series.push(Series);
      Patient.Study[NumberOfStudy].SeriesAmount += 1;
    } else {
      Hierarchy = 2;
      var isSop = -1;
      for (var i = 0; i < Patient.Study[NumberOfStudy].Series[isSeries].SopAmount; i++) {
        if (Patient.Study[NumberOfStudy].Series[isSeries].Sop[i].SopUID == sop)
          isSop = i;
      }
      if (isSop == -1) {
        var Sop = {};
        Sop.InstanceNumber = instance;
        Sop.SopUID = sop;
        Sop.imageId = imageId;
        Patient.Study[NumberOfStudy].Series[isSeries].Sop.push(Sop);
        Patient.Study[NumberOfStudy].Series[isSeries].SopAmount += 1;
      } else {
        //  console.log("重複載入");
        Hierarchy = -1;
      }
    }
  }
  return Hierarchy;
}