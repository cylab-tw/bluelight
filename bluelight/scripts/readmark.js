
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
      OverlayMark.canvas = createCanvas(OverlayMark.width, OverlayMark.height);
      OverlayMark.ctx = OverlayMark.canvas.getContext('2d');
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

// 測試版本：讀取參數圖，建立來源影像上的彩色標記。
function readParametricMap(dataSet) {
  try {
    var rows = dataSet.uint16(Tag.Rows), cols = dataSet.uint16(Tag.Columns);
    var rect = rows * cols;
    var numberOfFrames = dataSet.intString(Tag.NumberOfFrames) || 1;
    var bitsAllocated = dataSet.uint16(Tag.BitsAllocated);
    var pixelRepresentation = dataSet.uint16(Tag.PixelRepresentation);
    var pixelElement = dataSet.elements.x7fe00008 || dataSet.elements.x7fe00009 || dataSet.elements.x7fe00010;
    if (!pixelElement || !rect || numberOfFrames < 1) return;

    var isInteger = !dataSet.elements.x7fe00008 && !dataSet.elements.x7fe00009;
    if (bitsAllocated != (isInteger ? 16 : (dataSet.elements.x7fe00008 ? 32 : 64))) return;
    var littleEndian = dataSet.byteArrayParser
      ? dataSet.byteArrayParser.readUint16(new Uint8Array([1, 0]), 0) == 1
      : dataSet.string(Tag.TransferSyntaxUID) != "1.2.840.10008.1.2.2";
    var shared = dataSet.elements.x52009229?.items?.[0]?.dataSet;
    var perFrame = dataSet.elements.x52009230?.items || [];

    // 優先使用該影格的資料，沒有時使用共用資料。
    function getSequence(frameIndex, tag) {
      return perFrame[frameIndex]?.dataSet.elements[tag] || shared?.elements[tag];
    }
    function getGroup(frameIndex, tag) {
      return getSequence(frameIndex, tag)?.items?.[0]?.dataSet;
    }
    function getNumbers(ds, tag) {
      return ds?.string(tag)?.split("\\").map(Number) || null;
    }
    function getDataView(element) {
      return new DataView(dataSet.byteArray.buffer,
        dataSet.byteArray.byteOffset + element.dataOffset, element.length);
    }

    // 展開分段式調色盤，支援離散值、線性插值及間接引用。
    function readSegmentedPalette(data, bits, count) {
      var values = [], stride = bits / 8;
      function readValue(offset) {
        return stride == 2 ? data.getUint16(offset, littleEndian) : data.getUint8(offset);
      }
      function expand(offset, segmentCount, indirect) {
        for (var n = 0; n < segmentCount && offset + stride * 2 <= data.byteLength; n++) {
          var opcode = readValue(offset), length = readValue(offset + stride);
          offset += stride * 2;
          if (opcode == 0) {
            if (values.length + length > count) return false;
            for (var j = 0; j < length; j++, offset += stride) values.push(readValue(offset));
          } else if (opcode == 1) {
            if (!values.length || values.length + length > count) return false;
            var start = values[values.length - 1], end = readValue(offset);
            offset += stride;
            for (var j = 1; j <= length; j++) values.push(Math.round(start + (end - start) * j / length));
          } else if (opcode == 2) {
            if (indirect || !values.length) return false;
            var target = data.getUint16(offset, littleEndian) + data.getUint16(offset + 2, littleEndian) * 65536;
            offset += 4;
            if (target % stride || !expand(target, length, true)) return false;
          } else return false;
        }
        return n == segmentCount || !indirect;
      }
      return expand(0, Infinity, false) && values.length == count ? values : null;
    }

    // 讀取檔案內建的紅、綠、藍調色盤；沒有調色盤時使用灰階。
    var palette = [];
    for (var channel = 1; channel <= 3; channel++) {
      var descriptorTag = "x0028110" + channel;
      var direct = dataSet.elements["x0028120" + channel];
      var segmented = dataSet.elements["x0028122" + channel];
      if (!dataSet.elements[descriptorTag] && !direct && !segmented) continue;
      if (!dataSet.elements[descriptorTag] || (!direct && !segmented)) return;
      var count = dataSet.uint16(descriptorTag, 0) || 65536;
      var first = isInteger && pixelRepresentation == 1
        ? dataSet.int16(descriptorTag, 1) : dataSet.uint16(descriptorTag, 1);
      var bits = dataSet.uint16(descriptorTag, 2);
      if (bits != 8 && bits != 16) return;
      var lutView = getDataView(direct || segmented), lut;
      if (direct) {
        var wordEntries = bits == 16 || (count > 1 && direct.length == count * 2);
        if (direct.length != (wordEntries ? count * 2 : count + count % 2)) return;
        lut = new Uint16Array(count);
        for (var i = 0; i < count; i++) {
          var byteIndex = !littleEndian && direct.vr != "OB" ? (i ^ 1) : i;
          lut[i] = wordEntries ? lutView.getUint16(i * 2, littleEndian) : lutView.getUint8(byteIndex);
        }
      } else lut = readSegmentedPalette(lutView, bits, count);
      if (!lut) return;
      palette.push({ count: count, first: first, scale: bits == 16 ? 255 / 65535 : 1, values: lut });
    }
    if (palette.length && palette.length != 3) return;

    // 壓縮像素沿用既有解碼器；一般像素依資料型別與位元組順序讀取。
    var image, pixelView;
    if (pixelElement.encapsulatedPixelData) image = getDefaultImageObj(dataSet, "frame");
    else {
      if (pixelElement.length != rect * numberOfFrames * bitsAllocated / 8) return;
      pixelView = getDataView(pixelElement);
    }
    var readPixel = isInteger ? (pixelRepresentation == 1 ? "getInt16" : "getUint16") : (bitsAllocated == 32 ? "getFloat32" : "getFloat64");
    var paddingMethod = isInteger ? (pixelRepresentation == 1 ? "int16" : "uint16") : (bitsAllocated == 32 ? "float" : "double");
    var paddingValue = dataSet[paddingMethod](isInteger ? "x00280120" : (bitsAllocated == 32 ? "x00280122" : "x00280123"));
    var paddingLimit = dataSet[paddingMethod](isInteger ? "x00280121" : (bitsAllocated == 32 ? "x00280124" : "x00280125")) ?? paddingValue;
    function validPixel(value) {
      return Number.isFinite(value) && !(paddingValue !== undefined &&
        value >= Math.min(paddingValue, paddingLimit) && value <= Math.max(paddingValue, paddingLimit));
    }

    // 建立來源影像與序列的對照。
    var referencedSeries = dataSet.elements.x00081115?.items || [];
    var referencedImages = [];
    for (var seriesItem of referencedSeries) {
      for (var instance of seriesItem.dataSet.elements.x0008114a?.items || []) {
        referencedImages.push({
          series: seriesItem.dataSet.string(Tag.SeriesInstanceUID),
          sopInstanceUID: instance.dataSet.string("x00081155"),
          frameNumbers: getNumbers(instance.dataSet, "x00081160")
        });
      }
    }

    for (var k = 0; k < numberOfFrames; k++) {
      var NewpixelData = new Float64Array(rect);
      if (image) {
        var decoded = getPixelDataFromDataSet(image, dataSet, k);
        if (!decoded || decoded.length != rect) return;
        NewpixelData.set(decoded);
      } else {
        var frameOffset = k * rect * bitsAllocated / 8;
        for (var pix = 0; pix < rect; pix++)
          NewpixelData[pix] = pixelView[readPixel](frameOffset + pix * bitsAllocated / 8, littleEndian);
      }

      // 物理量與顯示顏色分開保存，避免改變原始量測值。
      var mappings = [], mappingItems = getSequence(k, "x00409096")?.items || [];
      for (var item of mappingItems) {
        var mapping = item.dataSet;
        var rangeMethod = isInteger && pixelRepresentation == 0 ? "uint16" : "int16";
        var firstValue = mapping.double("x00409214") ?? mapping[rangeMethod]("x00409216");
        var lastValue = mapping.double("x00409213") ?? mapping[rangeMethod]("x00409211");
        var slope = mapping.double("x00409225"), intercept = mapping.double("x00409224");
        var lutElement = mapping.elements.x00409212, lutData = null;
        if (!Number.isFinite(firstValue) || !Number.isFinite(lastValue) || firstValue > lastValue) return;
        if (lutElement) {
          if (!isInteger || lutElement.length != (lastValue - firstValue + 1) * 8) return;
          lutData = new Float64Array(lastValue - firstValue + 1);
          for (var i = 0; i < lutData.length; i++) lutData[i] = mapping.double("x00409212", i);
        } else if (!Number.isFinite(slope) || !Number.isFinite(intercept)) return;
        var values = new Float64Array(rect).fill(NaN);
        for (var pix = 0; pix < rect; pix++) {
          var value = NewpixelData[pix];
          if (validPixel(value) && value >= firstValue && value <= lastValue)
            values[pix] = lutData ? lutData[value - firstValue] : value * slope + intercept;
        }
        var unit = mapping.elements.x004008ea?.items?.[0]?.dataSet;
        var unitCode = unit?.string("x00080100") || unit?.string("x00080119") || unit?.string("x00080120") || "";
        mappings.push({
          firstValueMapped: firstValue, lastValueMapped: lastValue, slope: slope, intercept: intercept, lutData: lutData,
          lutLabel: mapping.string("x00409210") || "", values: values,
          unit: unit?.string("x00080104") || unitCode, unitCode: unitCode,
          codingSchemeDesignator: unit?.string("x00080102") || "",
          quantityDefinition: mapping.elements.x00409220?.items?.map(item => item.dataSet) || []
        });
      }
      if (!mappings.length) return;

      var sources = [];
      for (var derivation of getSequence(k, "x00089124")?.items || []) {
        for (var source of derivation.dataSet.elements.x00082112?.items || []) {
          sources.push({
            sopClassUID: source.dataSet.string("x00081150"),
            sopInstanceUID: source.dataSet.string("x00081155"),
            frameNumbers: getNumbers(source.dataSet, "x00081160")
          });
        }
      }
      if (!sources.length) {
        for (var source of getSequence(k, "x00081140")?.items || []) {
          sources.push({
            sopInstanceUID: source.dataSet.string("x00081155"),
            frameNumbers: getNumbers(source.dataSet, "x00081160")
          });
        }
      }
      if (!sources.length && numberOfFrames == 1) sources = referencedImages;
      if (!sources.length) continue;

      // 有調色盤時依檔案指定範圍上色，否則使用窗位或像素範圍顯示灰階。
      var min = Infinity, max = -Infinity;
      for (var value of NewpixelData) {
        if (validPixel(value)) { min = Math.min(min, value); max = Math.max(max, value); }
      }
      var storedMin = min == Infinity ? null : min, storedMax = max == -Infinity ? null : max;
      min = storedMin ?? 0;
      max = storedMax ?? min;
      var voiDs = getGroup(k, "x00289132") || dataSet;
      var wc = voiDs.floatString("x00281050"), ww = voiDs.floatString("x00281051");
      var voiFunction = voiDs.string("x00281056") || "LINEAR";
      var lutDataSets = voiDs.elements.x00283010?.items?.map(item => item.dataSet) || [];
      var voiLut = Number.isFinite(wc) && Number.isFinite(ww) && ww > 0
        ? { windowCenter: wc, windowWidth: ww, function: voiFunction, lutDataSets: lutDataSets }
        : (lutDataSets.length ? { lutDataSets: lutDataSets } : null);
      var colorRange = getGroup(k, "x00281230") || dataSet.elements.x00281230?.items?.[0]?.dataSet;
      var colorMin = colorRange?.double("x00281231"), colorMax = colorRange?.double("x00281232");
      if (palette.length && (colorRange || !isInteger) &&
          (!Number.isFinite(colorMin) || !Number.isFinite(colorMax) || colorMax < colorMin)) return;

      var canvas = createCanvas(cols, rows), ctx = canvas.getContext("2d");
      var pixelData = ctx.createImageData(cols, rows);
      for (var pix = 0; pix < rect; pix++) {
        if (!mappings.some(mapping => Number.isFinite(mapping.values[pix]))) continue;
        var value = NewpixelData[pix], offset = pix * 4;
        if (palette.length) {
          for (var channel = 0; channel < 3; channel++) {
            var color = palette[channel];
            var index = colorRange
              ? (colorMax == colorMin ? 0 : (value - colorMin) / (colorMax - colorMin) * (color.count - 1))
              : value - color.first;
            index = Math.max(0, Math.min(color.count - 1, index));
            var lower = Math.floor(index), upper = Math.min(lower + 1, color.count - 1);
            pixelData.data[offset + channel] = Math.round((color.values[lower] +
              (color.values[upper] - color.values[lower]) * (index - lower)) * color.scale);
          }
        } else {
          var gray;
          if (voiLut?.windowWidth !== undefined) {
            if (voiFunction == "SIGMOID") gray = 255 / (1 + Math.exp(-4 * (value - wc) / ww));
            else if (voiFunction == "LINEAR_EXACT") gray = ((value - wc) / ww + 0.5) * 255;
            else gray = ww <= 1 ? (value > wc - 0.5 ? 255 : 0) : ((value - (wc - 0.5)) / (ww - 1) + 0.5) * 255;
          } else gray = max == min ? 128 : (value - min) / (max - min) * 255;
          pixelData.data[offset] = pixelData.data[offset + 1] = pixelData.data[offset + 2] = gray;
        }
        pixelData.data[offset + 3] = 255;
      }
      ctx.putImageData(pixelData, 0, 0);

      for (var source of sources) {
        var sop = source.sopInstanceUID;
        if (!sop) continue;
        var loadedSource = ImageManager.findSop?.(sop);
        var series = referencedImages.find(ref => ref.sopInstanceUID == sop)?.series ||
          loadedSource?.parent?.SeriesInstanceUID ||
          (referencedSeries.length == 1 ? referencedSeries[0].dataSet.string(Tag.SeriesInstanceUID) : null);
        if (!series) continue;

        var PmMark = new BlueLightMark();
        PmMark.study = loadedSource?.Image?.StudyInstanceUID || dataSet.string(Tag.StudyInstanceUID);
        PmMark.series = series;
        PmMark.sop = sop;
        PmMark.parametricMapSop = dataSet.string(Tag.SOPInstanceUID);
        PmMark.referencedFrameNumbers = source.frameNumbers;
        PmMark.frameIndex = k;
        PmMark.rows = PmMark.height = rows;
        PmMark.cols = PmMark.width = cols;
        PmMark.numberOfFrames = numberOfFrames;
        PmMark.imagePositionPatient = getNumbers(getGroup(k, "x00209113"), "x00200032");
        PmMark.ImagePositionPatient = PmMark.imagePositionPatient?.join("\\") || null;
        PmMark.imageOrientationPatient = getNumbers(getGroup(k, "x00209116"), "x00200037");
        PmMark.pixelSpacing = getNumbers(getGroup(k, "x00289110"), "x00280030");
        PmMark.frameContent = getGroup(k, "x00209111") || null;
        PmMark.sourceImages = sources;
        PmMark.showName = PmMark.hideName = "ParametricMap";
        PmMark.type = "ParametricMap";
        PmMark.pixelData = PmMark.storedValues = NewpixelData;
        PmMark.storedMin = storedMin;
        PmMark.storedMax = storedMax;
        PmMark.mappings = mappings;
        PmMark.frameRealWorldValues = mappings.length == 1 ? mappings[0].values : null;
        PmMark.voiLut = voiLut;
        PmMark.canvas = canvas;
        PmMark.ctx = ctx;
        PatientMark.push(PmMark);
        refreshMark(PmMark);
      }
    }
  } catch (ex) {
    console.warn("讀取參數圖失敗：", ex);
  }
}

function readDicomMark(dataSet) {
  readDicomOverlay(dataSet);

  if (dataSet.string(Tag.ShutterShape)) {
    var sop1;
    if (dataSet.string(Tag.ReferencedSeriesSequence)) {
      for (var ii2 in dataSet.elements.x00081115.items) {
        var x00081115DataSet = dataSet.elements.x00081115.items[ii2].dataSet.elements.x00081140.items;
        for (var s = 0; s < x00081115DataSet.length; s++) {
          sop1 = x00081115DataSet[s].dataSet.string(Tag.ReferencedSOPInstanceUID);
        }
      }
    }

    if (sop1) {
      if (dataSet.string(Tag.ShutterShape) == "RECTANGULAR") {
        var ShutterLeftVerticalEdge = dataSet.intString(Tag.ShutterLeftVerticalEdge);
        var ShutterRightVerticalEdge = dataSet.intString(Tag.ShutterRightVerticalEdge);
        var ShutterUpperHorizontalEdge = dataSet.intString(Tag.ShutterUpperHorizontalEdge);
        var ShutterLowerHorizontalEdge = dataSet.intString(Tag.ShutterLowerHorizontalEdge);
        var GspsMark = new BlueLightMark();
        GspsMark.sop = sop1;
        GspsMark.ShutterLeftVerticalEdge = ShutterLeftVerticalEdge;
        GspsMark.ShutterRightVerticalEdge = ShutterRightVerticalEdge;
        GspsMark.ShutterUpperHorizontalEdge = ShutterUpperHorizontalEdge;
        GspsMark.ShutterLowerHorizontalEdge = ShutterLowerHorizontalEdge;
        GspsMark.hideName = GspsMark.showName = "RECTANGULAR";
        GspsMark.type = "Shutter";
        PatientMark.push(GspsMark);
        refreshMark(GspsMark, false);
      }
      if (dataSet.string(Tag.ShutterShape) == "CIRCULAR") {
        var GspsMark = new BlueLightMark();
        GspsMark.sop = sop1;

        GspsMark.centerRow = parseInt(dataSet.string(Tag.CenterOfCircularShutter).split("\\")[0]);
        GspsMark.centerColumn = parseInt(dataSet.string(Tag.CenterOfCircularShutter).split("\\")[1]);
        GspsMark.radius = dataSet.intString(Tag.RadiusOfCircularShutter);
        GspsMark.hideName = GspsMark.showName = "CIRCULAR";
        GspsMark.type = "Shutter";
        PatientMark.push(GspsMark);
        refreshMark(GspsMark, false);
      }
      if (dataSet.string(Tag.ShutterShape) == "POLYGONAL") {
        var GspsMark = new BlueLightMark();
        GspsMark.sop = sop1;
        GspsMark.pointArray = dataSet.string(Tag.VerticesOfThePolygonalShutter).split("\\");
        for (var i in GspsMark.pointArray) GspsMark.pointArray[i] = parseInt(GspsMark.pointArray[i]);
        GspsMark.hideName = GspsMark.showName = "POLYGONAL";
        GspsMark.type = "Shutter";
        PatientMark.push(GspsMark);
        refreshMark(GspsMark, false);
      }
      if (dataSet.string(Tag.ShutterShape) == "BITMAP") {}
      refreshMarkFromSop(sop1);
      displayMark(GetViewport().index);
    }
  }

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

            // Image Horizontal Flip -> Y, N
            // Image Rotation -> 0, 90, 180, 270
            // Presentation Pixel Magnification Ratio -> float
            var PresentationPixelMagnificationRatio = dataSet.elements?.x0070005a?.items[0]?.dataSet?.float('x00700103');
            var LUTData = dataSet.elements?.x20500010?.items[0]?.dataSet?.elements.x00283006;
            var windowCenter = dataSet.elements?.x00283110?.items[0]?.dataSet?.intString('x00281050');
            var windowWidth = dataSet.elements?.x00283110?.items[0]?.dataSet?.intString('x00281051');
            if (dataSet.string("x00700041") == "Y" || dataSet.int16("x00700042") >= 90 || PresentationPixelMagnificationRatio || LUTData || !isNaN(WindowCenter) || !isNaN(WindowWidth)) {
              var x00081115DataSet = dataSet.elements.x00081115.items[ii2].dataSet.elements.x00081140.items;
              for (var s = 0; s < x00081115DataSet.length; s++) {
                sop1 = x00081115DataSet[s].dataSet.string(Tag.ReferencedSOPInstanceUID);
                var GspsMark = new BlueLightMark();
                GspsMark.sop = sop1;
                GspsMark.pointArray = [];
                GspsMark.windowCenter = windowCenter;
                GspsMark.windowWidth = windowWidth;
                GspsMark.showName = GspsMark.hideName = GspsMark.type = "PS";
                GspsMark.ImageHorizontalFlip = dataSet.string("x00700041") == "Y";
                GspsMark.ImageRotation = dataSet.int16("x00700042");
                GspsMark.PresentationPixelMagnificationRatio = PresentationPixelMagnificationRatio;

                if (LUTData) {
                  var length = dataSet.elements?.x20500010?.items[0]?.dataSet?.elements.x00283006.length / 2, array = new Array(length);;
                  if (length == 256) {
                    for (var lut_ = 0; lut_ < 256; lut_++)
                      array[lut_] = dataSet.elements?.x20500010?.items[0]?.dataSet.uint16('x00283006', lut_);
                    GspsMark.LUTData = array;
                  }
                }

                PatientMark.push(GspsMark);
                refreshMark(GspsMark, false);
                if (sop1) refreshMarkFromSop(sop1);
                displayMark(GetViewport().index, firstLoad = true);
              }
            }
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
    var StudyInstanceUID = dataSet.string(Tag.StudyInstanceUID);
    var SeriesDescription = dataSet.string(Tag.SeriesDescription);
    for (var item of dataSet.elements[Tag.ContentSequence].items) {
      if (item.dataSet.string(Tag.ValueType) === 'IMAGE') {
        var KoMark = new BlueLightMark();
        KoMark.study = StudyInstanceUID;
        KoMark.SeriesDescription = SeriesDescription;
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

          SegMark.canvas = createCanvas(image.columns, image.rows);
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

          SegMark.canvas = createCanvas(image.columns, image.rows);
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
