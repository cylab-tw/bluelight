import decodeLittleEndian from './decoders/decodeLittleEndian.js';
import decodeBigEndian from './decoders/decodeBigEndian.js';
import decodeRLE from './decoders/decodeRLE.js';
import decodeJPEGBaseline from './decoders/decodeJPEGBaseline.js';
import decodeJPEGLossless from './decoders/decodeJPEGLossless.js';
import decodeJPEGLS from './decoders/decodeJPEGLS.js';
import decodeJPEG2000 from './decoders/decodeJPEG2000.js';

function detectJPEGColorSpace(uint8) {
  if (uint8[0] !== 0xFF || uint8[1] !== 0xD8) return null; // Not JPEG
  let i = 2;
  while (i < uint8.length) {
    if (uint8[i] !== 0xFF) { i++; continue; }
    let marker = uint8[i + 1];
    // 找 SOF 標記（有顏色通道資訊）
    if ((marker >= 0xC0 && marker <= 0xC3) ||
      (marker >= 0xC5 && marker <= 0xC7) ||
      (marker >= 0xC9 && marker <= 0xCB) ||
      (marker >= 0xCD && marker <= 0xCF)) {

      let components = uint8[i + 9], ids = []; // 第 9 byte 是元件數量
      for (let c = 0; c < components; c++)
        ids.push(uint8[i + 10 + c * 3]);

      // 判斷色彩空間
      if (components === 1 && ids[0] === 1) return "Grayscale";
      if (components === 4) return "CMYK";
      if (components === 3) {
        if (ids[0] === 1 && ids[1] === 2 && ids[2] === 3) return "YCbCr";
        if (ids[0] === 'R'.charCodeAt(0) && ids[1] === 'G'.charCodeAt(0) && ids[2] === 'B'.charCodeAt(0)) return "RGB";
        if (ids[0] === 0 && ids[1] === 1 && ids[2] === 2) return "assuming RGB";
      }
      return "Unknown";
    }

    // 跳過 marker 區塊
    if (marker >= 0xD0 && marker <= 0xD9) i += 2;
    else i += 2 + ((uint8[i + 2] << 8) + uint8[i + 3]);
  }
  return "null";
}
export function decodeImageFrame(
  imageFrame,
  transferSyntax,
  pixelData,
  decodeConfig,
  options
) {
  const start = new Date().getTime();
  if (transferSyntax === '1.2.840.10008.1.2') {
    // Implicit VR Little Endian
    imageFrame = decodeLittleEndian(imageFrame, pixelData);
  } else if (transferSyntax === '1.2.840.10008.1.2.1') {
    // Explicit VR Little Endian
    imageFrame = decodeLittleEndian(imageFrame, pixelData);
  } else if (transferSyntax === '1.2.840.10008.1.2.2') {
    // Explicit VR Big Endian (retired)
    imageFrame = decodeBigEndian(imageFrame, pixelData);
  } else if (transferSyntax === '1.2.840.10008.1.2.1.99') {
    // Deflate transfer syntax (deflated by dicomParser)
    imageFrame = decodeLittleEndian(imageFrame, pixelData);
  } else if (transferSyntax === '1.2.840.10008.1.2.5') {
    // RLE Lossless
    imageFrame = decodeRLE(imageFrame, pixelData);
  } else if (transferSyntax === '1.2.840.10008.1.2.4.50') {
    // JPEG Baseline lossy process 1 (8 bit)
    imageFrame = decodeJPEGBaseline(imageFrame, pixelData);
  } else if (transferSyntax === '1.2.840.10008.1.2.4.51') {
    // JPEG Baseline lossy process 2 & 4 (12 bit)
    imageFrame = decodeJPEGBaseline(imageFrame, pixelData);
  } else if (transferSyntax === '1.2.840.10008.1.2.4.57') {
    // JPEG Lossless, Nonhierarchical (Processes 14)
    imageFrame = decodeJPEGLossless(imageFrame, pixelData);
  } else if (transferSyntax === '1.2.840.10008.1.2.4.70') {
    // JPEG Lossless, Nonhierarchical (Processes 14 [Selection 1])
    imageFrame = decodeJPEGLossless(imageFrame, pixelData);
    if (detectJPEGColorSpace(pixelData) == "assuming RGB") imageFrame.AssumingRGB = true;
  } else if (transferSyntax === '1.2.840.10008.1.2.4.80') {
    // JPEG-LS Lossless Image Compression
    imageFrame = decodeJPEGLS(imageFrame, pixelData);
  } else if (transferSyntax === '1.2.840.10008.1.2.4.81') {
    // JPEG-LS Lossy (Near-Lossless) Image Compression
    imageFrame = decodeJPEGLS(imageFrame, pixelData);
  } else if (transferSyntax === '1.2.840.10008.1.2.4.90') {
    // JPEG 2000 Lossless
    imageFrame = decodeJPEG2000(imageFrame, pixelData, decodeConfig, options);
  } else if (transferSyntax === '1.2.840.10008.1.2.4.91') {
    // JPEG 2000 Lossy
    imageFrame = decodeJPEG2000(imageFrame, pixelData, decodeConfig, options);
  } else {
    throw new Error(`no decoder for transfer syntax ${transferSyntax}`);
  }

  /* Don't know if these work...
   // JPEG 2000 Part 2 Multicomponent Image Compression (Lossless Only)
   else if(transferSyntax === "1.2.840.10008.1.2.4.92")
   {
   return decodeJPEG2000(dataSet, frame);
   }
   // JPEG 2000 Part 2 Multicomponent Image Compression
   else if(transferSyntax === "1.2.840.10008.1.2.4.93")
   {
   return decodeJPEG2000(dataSet, frame);
   }
   */

  const shouldShift =
    imageFrame.pixelRepresentation !== undefined &&
    imageFrame.pixelRepresentation === 1;
  const shift =
    shouldShift && imageFrame.bitsStored !== undefined
      ? 32 - imageFrame.bitsStored
      : undefined;

  if (shouldShift && shift !== undefined) {
    for (let i = 0; i < imageFrame.pixelData.length; i++) {
      // eslint-disable-next-line no-bitwise
      imageFrame.pixelData[i] = (imageFrame.pixelData[i] << shift) >> shift;
    }
  }

  const end = new Date().getTime();

  imageFrame.decodeTimeInMS = end - start;

  return imageFrame;
}

export default decodeImageFrame;
