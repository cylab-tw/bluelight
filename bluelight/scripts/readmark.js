
function readDicomOverlay(dataSet) {
  for (var ov = 0; ov <= 28; ov += 2) {
    var ov_str = "" + ov;
    if (ov < 10) ov_str = "0" + ov;
    if (!dataSet.elements['x600' + ov + '3000']) continue;
    try {
      var pixelData = new Uint8ClampedArray(dataSet.byteArray.buffer, dataSet.elements['x60' + ov_str + '3000'].dataOffset, dataSet.elements['x60' + ov_str + '3000'].length);
      var tempPixeldata = new Uint8ClampedArray(pixelData.length * 8);
      var tempi = 0, tempnum = 0;
      for (var num of pixelData) {
        tempnum = num;
        for (var i = 0; i <= 7; i++) {
          if (parseInt((tempnum) % 2) == 1) tempPixeldata[tempi + i] = 1;
          else tempPixeldata[num * 8 + i] = 0;
          if (i != 7) tempnum /= 2;
          else tempi += 8;
        }
      }

      var OverlayMark = new BlueLightMark();

      OverlayMark.study = dataSet.string(Tag.StudyInstanceUID);
      OverlayMark.series = dataSet.string(Tag.SeriesInstanceUID);
      OverlayMark.sop = dataSet.string(Tag.SOPInstanceUID);

      OverlayMark.height = dataSet.uint16('x600' + ov + '0010');
      OverlayMark.width = dataSet.uint16('x600' + ov + '0011');

      OverlayMark.type = OverlayMark.showName = 'Overlay';
      OverlayMark.hideName = OverlayMark.showName + 'x60' + ov_str + '1500';

      if (dataSet.string('x60' + ov_str + '1500'))
        OverlayMark.showName = dataSet.string('x60' + ov_str + '1500');

      OverlayMark.pixelData = tempPixeldata.slice(0);
      OverlayMark.canvas = document.createElement("CANVAS");
      OverlayMark.ctx = OverlayMark.canvas.getContext('2d');
      OverlayMark.canvas.width = OverlayMark.width;
      OverlayMark.canvas.height = OverlayMark.height;
      var pixelData = OverlayMark.ctx.getImageData(0, 0, OverlayMark.width, OverlayMark.height);
      var pixel32Data = new Uint32Array(pixelData.data.buffer);
      for (var i = 0; i < pixel32Data.length; i++) {
        if (OverlayMark.pixelData[i] == 1) pixel32Data[i] = 4294901760; //(0,0,255,255)
      }
      OverlayMark.ctx.putImageData(pixelData, 0, 0);
      PatientMark.push(OverlayMark);
      refreshMark(OverlayMark);
    } catch (ex) { console.log(ex) }
  }
}

function readDicomRTSS(dataSet) {
  if (dataSet.string(Tag.ROIContourSequence)) {
    var referenceSeries = null;
    for (var i in dataSet.elements.x30060039.items) {
      var color, colorStr = ("" + dataSet.elements.x30060039.items[i].dataSet.string(Tag.ROIDisplayColor)).split("\\");
      if (colorStr) color = "rgb(" + parseInt(colorStr[0]) + ", " + parseInt(colorStr[1]) + ", " + parseInt(colorStr[2]) + ")";

      if (!Object.prototype.hasOwnProperty.call(dataSet.elements.x30060039.items[i].dataSet.elements, Tag.ContourSequence))
        continue;

      for (var j in dataSet.elements.x30060039.items[i].dataSet.elements.x30060040.items) {
        var ContourData = ("" + dataSet.elements.x30060039.items[i].dataSet.elements.x30060040.items[j].dataSet.string(Tag.ContourData)).split("\\");
        for (var k in dataSet.elements.x30060039.items[i].dataSet.elements.x30060040.items[j].dataSet.elements.x30060016.items) {
          var RtssMark = new BlueLightMark();
          RtssMark.study = dataSet.string(Tag.StudyInstanceUID);
          RtssMark.series = dataSet.string(Tag.SeriesInstanceUID);
          try {
            RtssMark.series = dataSet.elements.x30060010.items[0].dataSet.elements.x30060012.items[0].dataSet.elements.x30060014.items[0].dataSet.string(Tag.SeriesInstanceUID);
            referenceSeries = RtssMark.series;
          } catch (ex) { }

          RtssMark.color = color;
          var ROIName = getROINameList(dataSet)[i];
          if (ROIName) RtssMark.hideName = RtssMark.showName = ROIName;
          RtssMark.sop = dataSet.elements.x30060039.items[i].dataSet.elements.x30060040.items[j].dataSet.elements.x30060016.items[k].dataSet.string(Tag.ReferencedSOPInstanceUID);;
          RtssMark.type = "RTSS";

          for (var k2 = 0; k2 < ContourData.length; k2 += 3) {
            RtssMark.setPoint3D(parseFloat(ContourData[k2]), parseFloat(ContourData[k2 + 1]), parseFloat(ContourData[k2 + 2]));
            RtssMark.imagePositionZ = parseFloat(ContourData[k2 + 2]);
          }
          PatientMark.push(RtssMark);
        }
      }
    }
    if (referenceSeries) refreshMarkFromSeries(referenceSeries);
  }
}

function getROINameList(dataSet) {
  var ROINameList = [];
  if (dataSet.string(Tag.StructureSetROISequence)) {
    for (var i in dataSet.elements.x30060020.items) {
      if (dataSet.elements.x30060020.items[i].dataSet.string(Tag.ROIName)) {
        ROINameList.push("" + (dataSet.elements.x30060020.items[i].dataSet.string(Tag.ROIName)));
      }
    }
  }
  return ROINameList;
}

function readDicomMark(dataSet) {
  readDicomOverlay(dataSet);

  if (dataSet.string(Tag.GraphicAnnotationSequence)) {
    var sop1;
    if (dataSet.string(Tag.ReferencedSeriesSequence)) {
      for (var ii2 in dataSet.elements.x00081115.items) {
        var x00081115DataSet = dataSet.elements.x00081115.items[ii2].dataSet.elements.x00081140.items;
        for (var s = 0; s < x00081115DataSet.length; s++) {
          sop1 = x00081115DataSet[s].dataSet.string(Tag.ReferencedSOPInstanceUID);

          var tempsop = "", tempDataSet = "", GSPS_Text = "";
          function POLYLINE_Function(tempDataSet, GSPS_Text, g) {
            if (tempDataSet == "") return;
            if (g != undefined) var tempDataSetLengthList = [g];
            else var tempDataSetLengthList = tempDataSet;
            for (var j1 = 0; j1 < tempDataSetLengthList.length; j1++) {
              var j = tempDataSetLengthList[j1];
              if (g != undefined) var j = tempDataSetLengthList[j1];
              else var j = j1;
              if (tempDataSet[j].dataSet.string(Tag.GraphicType) == 'POLYLINE' ||
                tempDataSet[j].dataSet.string(Tag.GraphicType) == 'INTERPOLATED') {

                var GspsMark = new BlueLightMark();
                GspsMark.sop = sop1;
                GspsMark.pointArray = [];

                var showname = "" + tempDataSet[j].dataSet.string(Tag.GraphicType);

                if (tempDataSet[j].dataSet.elements.x00700232) {
                  var ColorSequence = tempDataSet[j].dataSet.elements.x00700232.items[0].dataSet;
                  var color = getColorFrom16(ColorSequence.uint16(Tag.PatternOnColorCIELabValue, 0), ColorSequence.uint16(Tag.PatternOnColorCIELabValue, 1), ColorSequence.uint16(Tag.PatternOnColorCIELabValue, 2), 16);
                  if (color) GspsMark.color = color;
                }

                GspsMark.showName = showname;
                if (GSPS_Text != "" && GSPS_Text != undefined) GspsMark.showName = GSPS_Text;
                GspsMark.hideName = GspsMark.showName;

                GspsMark.type = tempDataSet[j].dataSet.string(Tag.GraphicType);//"POLYLINE";

                GspsMark.RotationAngle = tempDataSet[j].dataSet.double('x00710230');
                GspsMark.GraphicFilled = tempDataSet[j].dataSet.string(Tag.GraphicFilled);

                GspsMark.RotationPoint = [tempDataSet[j].dataSet.float('x00710273', 0), tempDataSet[j].dataSet.float('x00710273', 1)];
                if (GSPS_Text != "" && GSPS_Text != undefined) {
                  GspsMark.GSPS_Text = GSPS_Text;
                };

                function getTag(tag) {
                  var group = tag.substring(1, 5);
                  var element = tag.substring(5, 9);
                  var tagIndex = ("(" + group + "," + element + ")").toUpperCase();
                  var attr = TAG_DICT[tagIndex];
                  return attr;
                }
                var rect = parseInt(tempDataSet[j].dataSet.int16(Tag.GraphicDimensions)) * parseInt(tempDataSet[j].dataSet.int16(Tag.NumberOfGraphicPoints));
                for (var r = 0; r < rect; r += 2) {
                  var GraphicData = getTag(Tag.GraphicData);
                  var numX = 0, numY = 0;
                  if (GraphicData.vr == 'US') {
                    numX = tempDataSet[j].dataSet.uint16(Tag.GraphicData, r);
                    numY = tempDataSet[j].dataSet.uint16(Tag.GraphicData, r + 1);
                  } else if (GraphicData.vr === 'SS') {
                    numX = tempDataSet[j].dataSet.int16(Tag.GraphicData, r);
                    numY = tempDataSet[j].dataSet.int16(Tag.GraphicData, r + 1);
                  } else if (GraphicData.vr === 'UL') {
                    numX = tempDataSet[j].dataSet.uint32(Tag.GraphicData, r);
                    numY = tempDataSet[j].dataSet.uint32(Tag.GraphicData, r + 1);
                  } else if (GraphicData.vr === 'SL') {
                    numX = tempDataSet[j].dataSet.int32(Tag.GraphicData, r);
                    numY = tempDataSet[j].dataSet.int32(Tag.GraphicData, r + 1);
                  } else if (GraphicData.vr === 'FD') {
                    numX = tempDataSet[j].dataSet.double(Tag.GraphicData, r);
                    numY = tempDataSet[j].dataSet.double(Tag.GraphicData, r + 1);
                  } else if (GraphicData.vr === 'FL') {
                    numX = tempDataSet[j].dataSet.float(Tag.GraphicData, r);
                    numY = tempDataSet[j].dataSet.float(Tag.GraphicData, r + 1);
                  } else {
                    numX = tempDataSet[j].dataSet.float(Tag.GraphicData, r);
                    numY = tempDataSet[j].dataSet.float(Tag.GraphicData, r + 1);
                  }
                  if (GspsMark.RotationAngle && GspsMark.RotationPoint)
                    [numX, numY] = rotatePoint([numX, numY], -GspsMark.RotationAngle, GspsMark.RotationPoint);

                  GspsMark.setPoint2D(parseFloat(numX), parseFloat(numY));
                }
                PatientMark.push(GspsMark);
                refreshMark(GspsMark, false);
              }

              if (tempDataSet[j].dataSet.string(Tag.GraphicType) == 'CIRCLE') {
                var GspsMark = new BlueLightMark();
                GspsMark.sop = sop1;
                GspsMark.pointArray = [];

                var showname = 'CIRCLE';

                GspsMark.hideName = GspsMark.showName = showname;
                if (tempDataSet[j].dataSet.elements.x00700232) {
                  var ColorSequence = tempDataSet[j].dataSet.elements.x00700232.items[0].dataSet;
                  var color = getColorFrom16(ColorSequence.uint16(Tag.PatternOnColorCIELabValue, 0), ColorSequence.uint16(Tag.PatternOnColorCIELabValue, 1), ColorSequence.uint16(Tag.PatternOnColorCIELabValue, 2), 16);
                  if (color) GspsMark.color = color;
                }

                GspsMark.type = "CIRCLE";
                GspsMark.GraphicFilled = tempDataSet[j].dataSet.string(Tag.GraphicFilled);
                var rect = parseInt(tempDataSet[j].dataSet.int16(Tag.GraphicDimensions)) * parseInt(tempDataSet[j].dataSet.int16(Tag.NumberOfGraphicPoints));
                for (var r = 0; r < rect; r += 4) {
                  var numX = tempDataSet[j].dataSet.float(Tag.GraphicData, r),
                    numY = tempDataSet[j].dataSet.float(Tag.GraphicData, r + 1),
                    numX2 = tempDataSet[j].dataSet.float(Tag.GraphicData, r + 2),
                    numY2 = tempDataSet[j].dataSet.float(Tag.GraphicData, r + 3);

                  GspsMark.setPoint2D(parseFloat(numX), parseFloat(numY));
                  GspsMark.setPoint2D(parseFloat(numX2), parseFloat(numY2));
                }
                PatientMark.push(GspsMark);
                refreshMark(GspsMark, false);
              }
              if (tempDataSet[j].dataSet.string(Tag.AnchorPointVisibility) && tempDataSet[j].dataSet.string(Tag.AnchorPointVisibility) == 'Y') {
                var GspsMark = new BlueLightMark();
                GspsMark.sop = sop1;
                GspsMark.pointArray = [];

                var showname = 'Anchor';

                if (tempDataSet[j].dataSet.elements.x00700232) {
                  var ColorSequence = tempDataSet[j].dataSet.elements.x00700232.items[0].dataSet;
                  var color = getColorFrom16(ColorSequence.uint16(Tag.PatternOnColorCIELabValue, 0), ColorSequence.uint16(Tag.PatternOnColorCIELabValue, 1), ColorSequence.uint16(Tag.PatternOnColorCIELabValue, 2), 16);
                  if (color) GspsMark.color = color;
                }

                GspsMark.showName = showname;
                if (GSPS_Text != "" && GSPS_Text != undefined) GspsMark.showName = GSPS_Text;
                GspsMark.hideName = GspsMark.showName;
                GspsMark.type = "POLYLINE";
                GspsMark.setPoint2D(tempDataSet[j].dataSet.float(Tag.BoundingBoxTopLeftHandCorner, 0), tempDataSet[j].dataSet.float(Tag.BoundingBoxTopLeftHandCorner, 1));
                GspsMark.setPoint2D(tempDataSet[j].dataSet.float(Tag.BoundingBoxBottomRightHandCorner, 0), tempDataSet[j].dataSet.float(Tag.BoundingBoxBottomRightHandCorner, 1));
                PatientMark.push(GspsMark);
                refreshMark(GspsMark, false);
              }

              if (!tempDataSet[j].dataSet.string(Tag.GraphicType) && GSPS_Text == "") {
                GSPS_Text = tempDataSet[j].dataSet.string(Tag.UnformattedTextValue);
                if (GSPS_Text != "") {
                  var GspsMark = new BlueLightMark();
                  GspsMark.sop = sop1;
                  GspsMark.pointArray = [];

                  GspsMark.showName = GspsMark.hideName = GspsMark.type = "TEXT";

                  if (GSPS_Text != "" && GSPS_Text != undefined) {
                    GSPS_Text = ("" + GSPS_Text).replace('\r\n', '\n');
                    GspsMark.GSPS_Text = GSPS_Text;
                  };
                  GspsMark.setPoint2D(tempDataSet[j].dataSet.float(Tag.BoundingBoxTopLeftHandCorner, 0), tempDataSet[j].dataSet.float(Tag.BoundingBoxTopLeftHandCorner, 1));
                  GspsMark.setPoint2D(tempDataSet[j].dataSet.float(Tag.BoundingBoxBottomRightHandCorner, 0), tempDataSet[j].dataSet.float(Tag.BoundingBoxBottomRightHandCorner, 1));

                  PatientMark.push(GspsMark);
                  refreshMark(GspsMark, false);
                }
              }
              if (tempDataSet[j].dataSet.string(Tag.GraphicType) == 'ELLIPSE') {
                var GspsMark = new BlueLightMark();
                GspsMark.sop = sop1;
                GspsMark.pointArray = [];

                GspsMark.showName = GspsMark.hideName = GspsMark.type = "ELLIPSE";
                GspsMark.GraphicFilled = tempDataSet[j].dataSet.string(Tag.GraphicFilled);

                var offset = tempDataSet[j].dataSet.elements[Tag.GraphicData].dataOffset;
                var len = tempDataSet[j].dataSet.elements[Tag.GraphicData].length;
                if (len == 64) var typedArray = new Float64Array(tempDataSet[j].dataSet.byteArray.buffer.slice(offset, offset + len))
                else var typedArray = new Float32Array(tempDataSet[j].dataSet.byteArray.buffer.slice(offset, offset + len))
                for (var p = 0; p < typedArray.length; p += 2) {
                  GspsMark.setPoint2D(typedArray[p], typedArray[p + 1]);
                }
                PatientMark.push(GspsMark);
                refreshMark(GspsMark, false);
              }
            }
          }

          try {
            if (dataSet.elements.x00700001) {
              for (var i in dataSet.elements.x00700001.items) {
                for (var d1 = 0; d1 < dataSet.elements.x00700001.items[i].dataSet.elements.x00081140.items.length; d1++) {
                  var tempsop = dataSet.elements.x00700001.items[i].dataSet.elements.x00081140.items[d1].dataSet.string(Tag.ReferencedSOPInstanceUID)
                  if (tempsop == sop1 && dataSet.elements.x00700001.items[i].dataSet.elements.x00700009) {
                    tempDataSet = dataSet.elements.x00700001.items[i].dataSet.elements.x00700009.items;
                    try {
                      POLYLINE_Function(tempDataSet, "", undefined);
                    } catch (ex) { }
                    try {
                      for (var g = 0; g < dataSet.elements.x00700001.items[i].dataSet.elements.x00700008.items.length; g++) {
                        try {
                          GSPS_Text = dataSet.elements.x00700001.items[i].dataSet.elements.x00700008.items[g].dataSet.string(Tag.UnformattedTextValue);
                          tempDataSet = dataSet.elements.x00700001.items[i].dataSet.elements.x00700008.items;
                          POLYLINE_Function(tempDataSet, "", g);
                        } catch (ex) { }
                      }
                    } catch (ex) { }
                  };
                  if (tempsop != sop1) continue;
                }
              }
            }
            if (sop1) refreshMarkFromSop(sop1);
          } catch (ex) {
            for (var i in dataSet.elements.x00700001.items) {
              try {
                tempDataSet = dataSet.elements.x00700001.items[i].dataSet.elements.x00700009.items;

                POLYLINE_Function(tempDataSet, GSPS_Text);

              } catch (ex) {
                console.log(ex);
                continue;
              }
            }
            if (sop1) refreshMarkFromSop(sop1);
          }
        }
      }
    }
  }
  readDicomRTSS(dataSet);
}

function loadDicomKO(dataSet) {
  if (dataSet.elements[Tag.ContentSequence] && Array.isArray(dataSet.elements[Tag.ContentSequence].items)) {
    for (var item of dataSet.elements[Tag.ContentSequence].items) {
      if (item.dataSet.string(Tag.ValueType) === 'IMAGE') {
        var KoMark = new BlueLightMark();
        KoMark.sop = item.dataSet.elements[Tag.ReferencedSOPSequence].items[0].dataSet.string(Tag.ReferencedSOPInstanceUID);
        KoMark.showName = KoMark.hideName = "KeyObject";
        KoMark.type = "KO";
        PatientMark.push(KoMark);
        refreshMark(KoMark);
        refreshMarkFromSop(KoMark.sop);
      }
    }
  }
}

function loadDicomSeg(image) {
  var dataSet = image.data;

  var rect = (image.rows * image.columns);
  if (dataSet.elements.x7fe00010.fragments) {
    function x52009229_or_30(x52009230, x52009229) {
      try {
        for (var i = 0; i < dataSet.elements.x7fe00010.fragments.length; i++) {
          var pixeldata = new Uint8Array(dataSet.byteArray.buffer,
            dataSet.elements.x7fe00010.fragments[i].position,
            dataSet.elements.x7fe00010.fragments[i].length)
          var NewpixelData = decodeImage(image, dataSet.string(Tag.TransferSyntaxUID), pixeldata, {
            usePDFJS: false
          }).pixelData;
          var showname = 'SEG';
          var SegMark = new BlueLightMark();

          SegMark.study = image.data.string(Tag.StudyInstanceUID);
          SegMark.series = image.data.elements.x00081115.items[0].dataSet.string(Tag.SeriesInstanceUID)
          try {
            SegMark.sop = x52009230.items[i].dataSet.elements.x00089124.items[0].dataSet.elements.x00082112.items[0].dataSet.string(Tag.ReferencedSOPInstanceUID);
          } catch (ex) {
            SegMark.sop = x52009229.items[i].dataSet.elements.x00089124.items[0].dataSet.elements.x00082112.items[0].dataSet.string(Tag.ReferencedSOPInstanceUID);
          }
          try {
            SegMark.ImagePositionPatient = x52009230.items[i].dataSet.elements.x00209113.items[0].dataSet.string(Tag.ImagePositionPatient);
          } catch (ex) {
            SegMark.ImagePositionPatient = x52009229.items[i].dataSet.elements.x00209113.items[0].dataSet.string(Tag.ImagePositionPatient);
          }
          SegMark.showName = SegMark.hideName = showname;

          SegMark.type = "SEG";
          SegMark.pixelData = new Uint8ClampedArray(rect);
          for (var pix = 0; pix < rect; pix++)
            SegMark.pixelData[pix] = NewpixelData[pix];

          SegMark.canvas = document.createElement("CANVAS");
          SegMark.canvas.width = image.columns;
          SegMark.canvas.height = image.rows;
          SegMark.ctx = SegMark.canvas.getContext('2d');
          var pixelData = SegMark.ctx.getImageData(0, 0, image.columns, image.rows);
          var pixel32Data = new Uint32Array(pixelData.data.buffer);
          for (var i = 0; i < pixel32Data.length; i++) {
            if (SegMark.pixelData[i] != 0) pixel32Data[i] = 4294901760; //(0,0,255,255)
          }
          SegMark.ctx.putImageData(pixelData, 0, 0);

          PatientMark.push(SegMark);
          refreshMark(SegMark);
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
          var SegMark = new BlueLightMark();
          var showname = 'SEG';
          SegMark.study = image.data.string(Tag.StudyInstanceUID);
          SegMark.series = image.data.elements.x00081115.items[0].dataSet.string(Tag.SeriesInstanceUID)
          try {
            SegMark.sop = x52009230.items[k].dataSet.elements.x00089124.items[0].dataSet.elements.x00082112.items[0].dataSet.string(Tag.ReferencedSOPInstanceUID);
          } catch (ex) {
            SegMark.sop = x52009229.items[0].dataSet.elements.x00089124.items[0].dataSet.elements.x00082112.items[k].dataSet.string(Tag.ReferencedSOPInstanceUID);
          }
          try {
            SegMark.ImagePositionPatient = x52009230.items[k].dataSet.elements.x00209113.items[0].dataSet.string(Tag.ImagePositionPatient);
          } catch (ex) {
            SegMark.ImagePositionPatient = x52009229.items[k].dataSet.elements.x00209113.items[0].dataSet.string(Tag.ImagePositionPatient);
          }
          SegMark.mark = [];
          SegMark.showName = SegMark.hideName = showname;
          SegMark.type = "SEG";

          SegMark.pixelData = new Uint8ClampedArray(rect);
          if (NewpixelData.length == rect * x52009230.items.length) {
            for (var pix = 0; pix < rect; pix++)
              SegMark.pixelData[pix] = NewpixelData[pix + rect * k];
          } else {
            for (var pix = 0; pix < rect; pix++)
              SegMark.pixelData[pix] = NewpixelData[parseInt(pix / (rect / (NewpixelData.length / sliceNum))) + (NewpixelData.length / sliceNum) * k];
          }

          SegMark.canvas = document.createElement("CANVAS");
          SegMark.canvas.width = image.columns;
          SegMark.canvas.height = image.rows;
          SegMark.ctx = SegMark.canvas.getContext('2d');
          var pixelData = SegMark.ctx.getImageData(0, 0, image.columns, image.rows);
          var pixel32Data = new Uint32Array(pixelData.data.buffer);
          for (var i = 0; i < pixel32Data.length; i++) {
            if (SegMark.pixelData[i] != 0) pixel32Data[i] = 4294901760; //(0,0,255,255)
          }
          SegMark.ctx.putImageData(pixelData, 0, 0);
          PatientMark.push(SegMark);
          refreshMark(SegMark);
        }
      } catch (ex) {
      }
    }
    x52009229_or_30(image.data.elements.x52009230, image.data.elements.x52009229);
  }
}
