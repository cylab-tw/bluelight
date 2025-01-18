import { OpenJPEGWASM } from '../../codecs/openjpegwasm_decode.js';
const openjpegWasm = new URL('../../codecs/openjpegwasm_decode.wasm', import.meta.url);
const local = {
    codec: undefined,
    decoder: undefined,
    decodeConfig: {},
};

(function initialize(decodeConfig) {
    local.decodeConfig = decodeConfig;
    if (local.codec) {
        return;
    }
    OpenJPEGWASM({
        locateFile: (f) => {
            console.log("locateFile", f);
            if (f.endsWith('.wasm')) {
                return openjpegWasm.toString();
            }
            return f;
        },
    }).then(instance => {

        local.decoder = new instance.J2KDecoder();
        console.log("loaded jpeg2000 decoder", local.decoder);
    }).catch(error => {
        console.error("Failed to initialize JPEG2000 decoder:", error);
    });
})(local.decodeConfig);

function decodeAsync(imageInfo, compressedImageFrame) {
    const decoder = local.decoder;
    const encodedBufferInWASM = decoder.getEncodedBuffer(compressedImageFrame.length);
    encodedBufferInWASM.set(compressedImageFrame);
    decoder.decode();
    const frameInfo = decoder.getFrameInfo();
    const decodedBufferInWASM = decoder.getDecodedBuffer();
    const imageFrame = new Uint8Array(decodedBufferInWASM.length);
    imageFrame.set(decodedBufferInWASM);
    const imageOffset = `x: ${decoder.getImageOffset().x}, y: ${decoder.getImageOffset().y}`;
    const numDecompositions = decoder.getNumDecompositions();
    const numLayers = decoder.getNumLayers();
    const progessionOrder = ['unknown', 'LRCP', 'RLCP', 'RPCL', 'PCRL', 'CPRL'][decoder.getProgressionOrder() + 1];
    const reversible = decoder.getIsReversible();
    const blockDimensions = `${decoder.getBlockDimensions().width} x ${decoder.getBlockDimensions().height}`;
    const tileSize = `${decoder.getTileSize().width} x ${decoder.getTileSize().height}`;
    const tileOffset = `${decoder.getTileOffset().x}, ${decoder.getTileOffset().y}`;
    const colorTransform = decoder.getColorSpace();
    const decodedSize = `${decodedBufferInWASM.length.toLocaleString()} bytes`;
    const compressionRatio = `${(decodedBufferInWASM.length / encodedBufferInWASM.length).toFixed(2)}:1`;
    const encodedImageInfo = {
        columns: frameInfo.width,
        rows: frameInfo.height,
        bitsPerPixel: frameInfo.bitsPerSample,
        signed: frameInfo.isSigned,
        bytesPerPixel: imageInfo.bytesPerPixel,
        componentsPerPixel: frameInfo.componentCount,
    };
    const pixelData = getPixelData(frameInfo, decodedBufferInWASM);
    const encodeOptions = {
        imageOffset,
        numDecompositions,
        numLayers,
        progessionOrder,
        reversible,
        blockDimensions,
        tileSize,
        tileOffset,
        colorTransform,
        decodedSize,
        compressionRatio,
    };
    return {
        ...imageInfo,
        pixelData,
        imageInfo: encodedImageInfo,
        encodeOptions,
        ...encodeOptions,
        ...encodedImageInfo,
    };
}
function getPixelData(frameInfo, decodedBuffer) {
    if (frameInfo.bitsPerSample > 8) {
        if (frameInfo.isSigned) {
            return new Int16Array(decodedBuffer.buffer, decodedBuffer.byteOffset, decodedBuffer.byteLength / 2);
        }
        return new Uint16Array(decodedBuffer.buffer, decodedBuffer.byteOffset, decodedBuffer.byteLength / 2);
    }
    if (frameInfo.isSigned) {
        return new Int8Array(decodedBuffer.buffer, decodedBuffer.byteOffset, decodedBuffer.byteLength);
    }
    return new Uint8Array(decodedBuffer.buffer, decodedBuffer.byteOffset, decodedBuffer.byteLength);
}
export default decodeAsync;