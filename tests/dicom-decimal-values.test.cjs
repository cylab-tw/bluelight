const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

// Synthetic Part 10 image only; no patient data or external services.
function element(group, tag, vr, value) {
    let data;
    if (vr === 'US') {
        data = Buffer.alloc(2);
        data.writeUInt16LE(value);
    } else data = Buffer.isBuffer(value) ? value : Buffer.from(value);
    if (data.length % 2) data = Buffer.concat([data, Buffer.from([vr === 'UI' ? 0 : 32])]);
    const header = Buffer.alloc(vr === 'OW' ? 12 : 8);
    header.writeUInt16LE(group);
    header.writeUInt16LE(tag, 2);
    header.write(vr, 4);
    if (vr === 'OW') header.writeUInt32LE(data.length, 8);
    else header.writeUInt16LE(data.length, 6);
    return Buffer.concat([header, data]);
}

function imageBytes(center, width, intercept) {
    const sopClass = '1.2.840.10008.5.1.4.1.1.7';
    const attributes = [
        [2, 2, 'UI', sopClass], [2, 3, 'UI', '2.25.100001'],
        [2, 0x10, 'UI', '1.2.840.10008.1.2.1'],
        [8, 0x16, 'UI', sopClass], [8, 0x18, 'UI', '2.25.100001'],
        [0x10, 0x10, 'PN', 'SYNTHETIC^ONLY'],
        [0x20, 0x0d, 'UI', '2.25.100'], [0x20, 0x0e, 'UI', '2.25.1000'],
        [0x20, 0x13, 'IS', '1'],
        [0x28, 2, 'US', 1], [0x28, 4, 'CS', 'MONOCHROME2'],
        [0x28, 0x10, 'US', 1], [0x28, 0x11, 'US', 2],
        [0x28, 0x100, 'US', 16], [0x28, 0x101, 'US', 16],
        [0x28, 0x102, 'US', 15], [0x28, 0x103, 'US', 0],
        [0x28, 0x1053, 'DS', '1'], [0x28, 0x1054, 'LO', 'US'],
        [0x28, 0x1056, 'CS', 'LINEAR_EXACT'],
        [0x7fe0, 0x10, 'OW', Buffer.from([50, 0, 100, 0])]
    ];
    for (const [tag, value] of [[0x1050, center], [0x1051, width], [0x1052, intercept]]) {
        if (value !== undefined) attributes.push([0x28, tag, 'DS', value]);
    }
    attributes.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    return Uint8Array.from(Buffer.concat([
        Buffer.alloc(128), Buffer.from('DICM'), ...attributes.map(args => element(...args))
    ]));
}

function loadImage(center, width, intercept) {
    const context = vm.createContext({
        console, Uint8Array, Uint16Array, Int16Array, Uint8ClampedArray, Uint32Array,
        onloadFunction: { push2First() {} }, PatientMark: [],
        ErrorMessage: { pushErrorMessage(code) { throw new Error(`DICOM load error ${code}`); } }
    });
    for (const file of [
        'external/cornerstone/dicomParser.js', 'external/cornerstone/dataDictionary.js',
        'patient.js', 'toolfunction.js', 'readmark.js', 'dicomloader.js', 'viewer.js', 'viewport.js'
    ]) {
        vm.runInContext(readFileSync(path.join(__dirname, '../bluelight/scripts', file), 'utf8'), context);
    }
    vm.runInContext(`
        for (const tag of Object.keys(TAG_DICT)) {
            Tag[TAG_DICT[tag].name] = ('x' + tag.replace(/[(),]/g, '')).toLowerCase();
        }
        ImageManager = new BlueLightImageManager();
    `, context);
    const sop = context.loadDicomDataSet(imageBytes(center, width, intercept));
    sop.Image.loadImageData();
    return { image: sop.Image, context };
}

test('preserve fractional DS values through Part 10 loading and rendering', () => {
    const { image, context } = loadImage('99.5\\199.5', '201.5\\401.5', '-0.5');
    assert.equal(image.windowCenter, 99.5);
    assert.equal(image.windowWidth, 201.5);
    assert.equal(image.intercept, -0.5);
    let rendered;
    const ctx = {
        createImageData: (width, height) => ({ data: new Uint8ClampedArray(width * height * 4) }),
        putImageData: data => { rendered = data.data; }, save() {}, restore() {}
    };
    // The existing canvas pipeline implements LINEAR_EXACT; preserve that behavior.
    context.renderPixelData2Cnavas(image, image.getPixelData(), { getContext: () => ctx });
    const expected = new Uint8ClampedArray([((50 - 0.5 - 99.5) / 201.5 + 0.5) * 255,
        ((100 - 0.5 - 99.5) / 201.5 + 0.5) * 255]);
    assert.equal(rendered[0], expected[0]);
    assert.equal(rendered[4], expected[1]);
});

test('preserve integer values and DS exponent notation', () => {
    for (const values of [['100', '200', '-1024'], ['1e2', '2e2', '-1.024e3']]) {
        const { image } = loadImage(...values);
        assert.equal(image.windowCenter, 100);
        assert.equal(image.windowWidth, 200);
        assert.equal(image.intercept, -1024);
        assert.deepEqual(Array.from(image.getPixelData()), [50, 100]);
    }
});

test('retain automatic windowing when optional window attributes are absent', () => {
    const { image } = loadImage(undefined, undefined, undefined);
    assert.equal(image.windowCenter, 75);
    assert.equal(image.windowWidth, 50);
    assert.equal(image.intercept, undefined);
});
