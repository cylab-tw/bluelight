
function loadImageFromDataSet(dataSet, type, loadimage = true, url) {
    var imageObj = getDefaultImageObj(dataSet, type, url);
    if (type == 'pdf') setPDF(imageObj);
    var Sop = ImageManager.pushStudy(imageObj); //註冊此Image至Viewer
    if (!Sop) return; //發生重覆，等情況
    Sop.type = type;
    readDicomOverlay(imageObj.data, PatientMark);

    //改成無論是否曾出現在左側面板，都嘗試加到左側面板
    leftLayout.setImg2Left(new QRLv(dataSet), dataSet.string(Tag.PatientID));
    leftLayout.appendCanvasBySeries(dataSet.string(Tag.SeriesInstanceUID), imageObj, imageObj.getPixelData());
    leftLayout.refleshMarkWithSeries(dataSet.string(Tag.SeriesInstanceUID));

    if (loadimage) {
        resetViewport();
        GetViewport().loadImgBySop(Sop);
    } else {
        for (var z = 0; z < Viewport_Total; z++) DisplaySeriesCount();
        putLabel();
    }
}

function setPDF(imageObj) {
    var fileTag = imageObj.data.elements.x00420011;
    var pdfByteArray = imageObj.data.byteArray.slice(fileTag.dataOffset, fileTag.dataOffset + fileTag.length);
    var pdfObj = new Blob([pdfByteArray], { type: 'application/pdf' });
    var pdf = URL.createObjectURL(pdfObj);
    imageObj.pdf = pdf;
}

function getDefaultImageObj(dataSet, type, url) {
    var imageObj = {};
    imageObj.windowCenter = dataSet.intString('x00281050');
    imageObj.windowWidth = dataSet.intString('x00281051');
    imageObj.accessionNumber = dataSet.string('x00080050');
    imageObj.acquisitionTime = dataSet.string('x00080032');
    imageObj.bitsAllocation = dataSet.string('x00280100');
    imageObj.highBit = dataSet.intString('x00280102');
    imageObj.InstanceNumber = dataSet.string('x00200013');
    imageObj.institutionName = dataSet.string('x00080080');
    imageObj.PatientAge = dataSet.string('x00101010');
    imageObj.PatientID = dataSet.string('x00100020');
    imageObj.PatientName = dataSet.string('x00100010');
    imageObj.patentSex = dataSet.string('x00100040');
    imageObj.pixelRepresentation = dataSet.int16('x00280103');
    imageObj.bitsStored = dataSet.int16('x00280101');
    imageObj.seriesDescription = dataSet.string('x0008103e');
    imageObj.seriesNumber = dataSet.string('x00200011');
    imageObj.sliceLocation = dataSet.string('x00201041');
    imageObj.sliceThickness = dataSet.string('x00180050');
    imageObj.stationName = dataSet.string('x00081010');
    imageObj.invert = dataSet.string('x00280004') == "MONOCHROME1" ? true : false;
    imageObj.color = dataSet.int16(Tag.SamplesPerPixel) === 3;
    imageObj.NumberOfFrames = dataSet.intString(Tag.NumberOfFrames);
    imageObj.photometricInterpretation = dataSet.string(Tag.PhotometricInterpretation);
    imageObj.width = imageObj.columns = dataSet.int16('x00280011');
    imageObj.height = imageObj.rows = dataSet.int16('x00280010');
    imageObj.PhotometricInterpretation = dataSet.string(Tag.PhotometricInterpretation);
    
    if (dataSet.elements[Tag.GridFrameOffsetVector]) {
        imageObj.GridFrameOffsetVector = dataSet.string(Tag.GridFrameOffsetVector).split("\\");
        for (var i in imageObj.GridFrameOffsetVector) imageObj.GridFrameOffsetVector[i] = parseInt(imageObj.GridFrameOffsetVector[i]);
    }

    imageObj.intercept = dataSet.intString('x00281052');
    imageObj.slope = dataSet.floatString('x00281053');
    imageObj.bitsAllocated = dataSet.int16(Tag.BitsAllocated);
    if (dataSet.string('x00280030')) imageObj.rowPixelSpacing = parseFloat(dataSet.string('x00280030').split("\\")[0]);
    if (dataSet.string('x00280030')) imageObj.columnPixelSpacing = parseFloat(dataSet.string('x00280030').split("\\")[1]);
    imageObj.samplesPerPixel = dataSet.string('x00280004') === 'YBR_FULL_422' ? 2 : dataSet.uint16('x00280002');
    imageObj.data = dataSet;
    imageObj.url = url;

    if (type == "sop")
        imageObj.pixelData = getPixelDataFromDataSet(imageObj, dataSet);

    if (type == "sop") imageObj.getPixelData = function () { return this.pixelData; }
    else if (type == "frame") imageObj.getPixelData = function (framesNumber = 0) {
        return getPixelDataFromDataSet(this, this.data, isNaN(framesNumber) ? 0 : framesNumber);
    }
    else imageObj.getPixelData = function () { return; }

    return imageObj;
}

function getPixelDataFromDataSet(imageObj, dataSet, frameIndex = 0) {
    function IfNoWL(imageObj, dataSet, pixelData) {
        if (imageObj.windowCenter == undefined || imageObj.windowWidth == undefined ||
            imageObj.windowCenter == null || imageObj.windowWidth == null) {
            var max = Number.MIN_VALUE, min = Number.MAX_VALUE;
            for (var i = 0; i < pixelData.length; i++) {
                if (pixelData[i] > max) max = pixelData[i];
                if (pixelData[i] < min) min = pixelData[i];
            }

            var slope = isNaN(imageObj.slope) ? 1 : imageObj.slope;
            var intercept = isNaN(imageObj.intercept) ? 0 : imageObj.intercept;
            imageObj.windowCenter = ((max + min) / 2 * slope) + intercept; //(max + min) / 2
            imageObj.windowWidth = (max - min) * slope; //(max - min)
        }
    }
    function YBR(imageObj, dataSet, pixelData) {
        if (dataSet.string('x00280004') === 'YBR_FULL_422' && imageObj.color) {
            //var pixelData = imageObj.pixelData;
            for (var i = 0; i < pixelData.length; i += 3) {
                var R = pixelData[i] + 1.402 * (pixelData[i + 2] - 128);
                var G = pixelData[i] - 0.344136 * (pixelData[i + 1] - 128) - 0.714136 * (pixelData[i + 2] - 128);
                var B = pixelData[i] + 1.772 * (pixelData[i + 1] - 128);
                pixelData[i] = R; // R = Y + 1.402 * (Cr - 128);
                pixelData[i + 1] = G; // G = Y - 0.344136 * (Cb - 128) - 0.714136 * (Cr - 128);
                pixelData[i + 2] = B; // B = Y + 1.772 * (Cb - 128);
            }
        }
        return pixelData;
    }
    function PixelProcessing(imageObj, dataSet, pixelData) {
        pixelData = YBR(imageObj, dataSet, pixelData);
        IfNoWL(imageObj, dataSet, pixelData);
        return pixelData;
    }
    const PXL_Elem = dataSet.elements.x7fe00010 || dataSet.elements.x7fe00008;
    if (!PXL_Elem) return null;
    else if (PXL_Elem.encapsulatedPixelData) {
        var PXL = dataSet.elements.x7fe00010;
        //Basic Offset Table is not empty
        if (PXL && PXL.basicOffsetTable.length)
            return PixelProcessing(imageObj, dataSet, decodeImage(imageObj, dataSet.string(Tag.TransferSyntaxUID),
                dicomParser.readEncapsulatedImageFrame(dataSet, PXL, frameIndex), {
                usePDFJS: false
            }).pixelData);
        //Empty basic offset table              && (!(dataSet.intString('x00280008') == undefined && PXL.fragments.length == 1))
        if (dataSet.intString('x00280008') !== PXL.fragments.length) {
            return PixelProcessing(imageObj, dataSet, decodeImage(imageObj, dataSet.string(Tag.TransferSyntaxUID),
                dicomParser.readEncapsulatedImageFrame(dataSet, PXL, frameIndex, dicomParser.createJPEGBasicOffsetTable(dataSet, PXL)), {
                usePDFJS: false
            }).pixelData);
        }

        return PixelProcessing(imageObj, dataSet, dicomParser.readEncapsulatedPixelDataFromFragments(dataSet, PXL, frameIndex));
    } else {
        function unpackBinaryFrame(byteArray, frameOffset, pixelData) {
            if (frameOffset >= byteArray.length) throw new Error('frame exceeds size of pixelData');
            for (let i = 0; i < pixelsPerFrame; i++) {
                const bytePos = Math.floor(i / 8);
                const byte = byteArray[bytePos + frameOffset];
                const bitPos = i % 8;
                pixelData[i] = (byte & (1 << bitPos)) ? 1 : 0;
            }
            return PixelProcessing(imageObj, dataSet, pixelData);
        }
        const samplesPerPixel = dataSet.string('x00280004') === 'YBR_FULL_422' ? 2 : dataSet.uint16('x00280002');
        const pixelsPerFrame = dataSet.uint16('x00280010') * dataSet.uint16('x00280011') * samplesPerPixel;

        let frameOffset = PXL_Elem.dataOffset;
        switch (dataSet.uint16('x00280100')) {
            case 8: frameOffset += frameIndex * pixelsPerFrame; break;
            case 16: frameOffset += frameIndex * pixelsPerFrame * 2; break;
            case 32: frameOffset += frameIndex * pixelsPerFrame * 4; break;
            case 1: frameOffset += frameIndex * pixelsPerFrame * 0.125; break;
        }
        //if (imageObj.GridFrameOffsetVector && imageObj.GridFrameOffsetVector.length > frameIndex)
        //   frameOffset += imageObj.GridFrameOffsetVector[frameIndex];

        if (frameOffset >= dataSet.byteArray.length) throw new Error('frame exceeds size of pixelData');

        //PixelRepresentation = 0 -> unsigned, PixelRepresentation = 1 -> signed
        if (dataSet.uint16('x00280103') == 1) {
            switch (dataSet.uint16('x00280100')) {
                case 8: return PixelProcessing(imageObj, dataSet, new Int8Array(dataSet.byteArray.buffer.slice(frameOffset, frameOffset + pixelsPerFrame)));
                case 16: return PixelProcessing(imageObj, dataSet, new Int16Array(dataSet.byteArray.buffer.slice(frameOffset, frameOffset + pixelsPerFrame * 2)));
                case 32: return PixelProcessing(imageObj, dataSet, new Int32Array(dataSet.byteArray.buffer.slice(frameOffset, frameOffset + pixelsPerFrame * 4)));
                case 1: return PixelProcessing(imageObj, dataSet, unpackBinaryFrame(dataSet.byteArray, frameOffset * 0.125, new Int8Array(pixelsPerFrame)));
            }
        } else {
            switch (dataSet.uint16('x00280100')) {
                case 8: return PixelProcessing(imageObj, dataSet, new Uint8Array(dataSet.byteArray.buffer.slice(frameOffset, frameOffset + pixelsPerFrame)));
                case 16: return PixelProcessing(imageObj, dataSet, new Uint16Array(dataSet.byteArray.buffer.slice(frameOffset, frameOffset + pixelsPerFrame * 2)));
                case 32: return PixelProcessing(imageObj, dataSet, new Uint32Array(dataSet.byteArray.buffer.slice(frameOffset, frameOffset + pixelsPerFrame * 4)));
                case 1: return PixelProcessing(imageObj, dataSet, unpackBinaryFrame(dataSet.byteArray, frameOffset * 0.125, new Uint8Array(pixelsPerFrame)));
            }
        }
        /*see 364*/
        throw new Error('unsupported pixel format');
    }
}
