
let VIEWPORT = {};
VIEWPORT.fixRow = null;
VIEWPORT.fixCol = null;

VIEWPORT.initTransform = function (viewport, image) {
    if (!viewport.Sop) return;
    if (viewport.Sop.type == "img") return;
    if (!image) return;
    if (viewport.tags.PixelSpacing) {
        viewport.transform.PixelSpacingX = 1.0 / parseFloat(viewport.tags.PixelSpacing.split("\\")[0]);
        viewport.transform.PixelSpacingY = 1.0 / parseFloat(viewport.tags.PixelSpacing.split("\\")[1]);
    } else if (viewport.tags.ImagerPixelSpacing) {
        viewport.transform.PixelSpacingX = 1.0 / parseFloat(viewport.tags.ImagerPixelSpacing.split("\\")[0]);
        viewport.transform.PixelSpacingY = 1.0 / parseFloat(viewport.tags.ImagerPixelSpacing.split("\\")[1]);
    }
    else {
        //viewport.transform.PixelSpacingX = viewport.transform.PixelSpacingY = 1.0;
    }

    if (viewport.tags.ImageOrientationPatient) {
        viewport.transform.imageOrientationX = viewport.tags.ImageOrientationPatient.split("\\")[0];
        viewport.transform.imageOrientationY = viewport.tags.ImageOrientationPatient.split("\\")[1];
        viewport.transform.imageOrientationZ = viewport.tags.ImageOrientationPatient.split("\\")[2];
        viewport.transform.imageOrientationX2 = viewport.tags.ImageOrientationPatient.split("\\")[3];
        viewport.transform.imageOrientationY2 = viewport.tags.ImageOrientationPatient.split("\\")[4];
        viewport.transform.imageOrientationZ2 = viewport.tags.ImageOrientationPatient.split("\\")[5];
    } else {
        viewport.transform.imageOrientationX = viewport.transform.imageOrientationY = viewport.transform.imageOrientationZ = 0;
        viewport.transform.imageOrientationX2 = viewport.transform.imageOrientationY2 = viewport.transform.imageOrientationZ2 = 0;
    }

    if (viewport.tags.ImagePositionPatient) {
        viewport.transform.imagePositionX = parseFloat(viewport.tags.ImagePositionPatient.split("\\")[0]);
        viewport.transform.imagePositionY = parseFloat(viewport.tags.ImagePositionPatient.split("\\")[1]);
        viewport.transform.imagePositionZ = parseFloat(viewport.tags.ImagePositionPatient.split("\\")[2]);
    } else {
        viewport.transform.imagePositionX = viewport.transform.imagePositionY = viewport.transform.imagePositionZ = 0;
    }

    setTransformLabel(viewport.index);
}

VIEWPORT.putLabel2Element = function (element, image, viewportNum) {
    if (!element.Sop || element.Sop.type == "img") return;
    setCommonLabel(viewportNum);
    element.refleshLabel();
}

VIEWPORT.loadViewport = function (viewport, image, viewportNum) {
    for (var i = 0; i < VIEWPORT.loadViewportList.length; i++) {
        VIEWPORT[VIEWPORT.loadViewportList[i]](viewport, image, viewportNum);
    }
}
//VIEWPORT.loadViewportList = ['initTransform', 'putLabel2Element', 'delPDFView', 'settype'];
VIEWPORT.loadViewportList = ['initTransform', 'putLabel2Element'];

class LoadFileInBatches {
    static queue = [];
    static lock = false;
    static NumOfFetchs = 0;
    static limit = 0;
    static timer = null;

    static wadoPreLoad(url, onlyload) {
        if (LoadFileInBatches.limit == 0) LoadFileInBatches.limit = ConfigLog.QIDO.limit ? ConfigLog.QIDO.limit : 100;

        if (LoadFileInBatches.NumOfFetchs >= LoadFileInBatches.limit) {
            LoadFileInBatches.lock = true;
            LoadFileInBatches.queue.push({ url: url, onlyload: onlyload });
            LoadFileInBatches.setTimer();
        }
        else if (LoadFileInBatches.lock == true) {
            LoadFileInBatches.queue.push({ url: url, onlyload: onlyload });
            LoadFileInBatches.setTimer();
        } else {
            LoadFileInBatches.NumOfFetchs++;
            if (ConfigLog.WADO.WADOType == "URI") loadDICOMFromUrl(url, onlyload);
            else if (ConfigLog.WADO.WADOType == "RS") wadorsLoader2(url, onlyload);
        }
    }

    static setTimer() {
        if (!LoadFileInBatches.timer) {
            LoadFileInBatches.timer = setInterval(function () {
                if (LoadFileInBatches.lock == true && LoadFileInBatches.NumOfFetchs == 0) {
                    //如果仍超出上限(比如超過100筆)
                    if (LoadFileInBatches.queue.length >= LoadFileInBatches.limit) {
                        var list = LoadFileInBatches.queue.splice(0, LoadFileInBatches.limit);
                        LoadFileInBatches.NumOfFetchs += list.length;
                        for (var i = 0; i < list.length; i++) {
                            if (ConfigLog.WADO.WADOType == "URI") loadDICOMFromUrl(list[i].url, list[i].onlyload);
                            else if (ConfigLog.WADO.WADOType == "RS") wadorsLoader2(list[i].url, list[i].onlyload);
                        }
                    } else {
                        LoadFileInBatches.lock = false;
                        var list = LoadFileInBatches.queue.splice(0, LoadFileInBatches.queue.length);
                        LoadFileInBatches.NumOfFetchs += list.length;
                        for (var i = 0; i < list.length; i++) {
                            if (ConfigLog.WADO.WADOType == "URI") loadDICOMFromUrl(list[i].url, list[i].onlyload);
                            else if (ConfigLog.WADO.WADOType == "RS") wadorsLoader2(list[i].url, list[i].onlyload);
                        }
                        clearInterval(LoadFileInBatches.timer);
                        LoadFileInBatches.timer = null;
                    }
                }
            }, 1000);
        }
    }

    static finishOne() {
        if (LoadFileInBatches.NumOfFetchs > 0) LoadFileInBatches.NumOfFetchs--;
    }
}

function wadorsLoader2(url, onlyload) {
    var headers = {
        'user-agent': 'Mozilla/4.0 MDN Example', 'content-type': 'multipart/related; type=application/dicom;'
    }
    var wadoToken = ConfigLog.WADO.token;
    for (var to = 0; to < Object.keys(wadoToken).length; to++) {
        if (wadoToken[Object.keys(wadoToken)[to]] != "")
            headers[Object.keys(wadoToken)[to]] = wadoToken[Object.keys(wadoToken)[to]];
    }

    fetch(url, { headers, }).then(async function (res) {
        let resBlob = await res.arrayBuffer();
        let decodedBuffers = multipartDecode(resBlob);
        for (let decodedBuf of decodedBuffers) {
            loadDicomDataSet(decodedBuf, !(onlyload == true), url, false);
        }
    }).finally(() => LoadFileInBatches.finishOne());
}

/**
 * Converts a Uint8Array to a String.
 * @param {Uint8Array} array that should be converted
 * @param {Number} offset array offset in case only subset of array items should be extracted (default: 0)
 * @param {Number} limit maximum number of array items that should be extracted (defaults to length of array)
 * @returns {String}
 */
function uint8ArrayToString(arr, offset, limit) {
    offset = offset || 0;
    limit = limit || arr.length - offset;
    let str = "";
    for (let i = offset; i < offset + limit; i++) {
        str += String.fromCharCode(arr[i]);
    }
    return str;
}

/**
 * Converts a String to a Uint8Array.
 * @param {String} str string that should be converted
 * @returns {Uint8Array}
 */
function stringToUint8Array(str) {
    const arr = new Uint8Array(str.length);
    for (let i = 0, j = str.length; i < j; i++) {
        arr[i] = str.charCodeAt(i);
    }
    return arr;
}

/**
 * Identifies the boundary in a multipart/related message header.
 * @param {String} header message header
 * @returns {String} boundary
 */
function identifyBoundary(header) {
    const parts = header.split("\r\n");

    for (let i = 0; i < parts.length; i++) {
        if (parts[i].substr(0, 2) === "--") {
            return parts[i];
        }
    }
}

/**
 * Checks whether a given token is contained by a message at a given offset.
 * @param {Uint8Array} message message content
 * @param {Uint8Array} token substring that should be present
 * @param {Number} offset offset in message content from where search should start
 * @returns {Boolean} whether message contains token at offset
 */
function containsToken(message, token, offset = 0) {
    if (offset + token.length > message.length) {
        return false;
    }

    let index = offset;
    for (let i = 0; i < token.length; i++) {
        if (token[i] !== message[index++]) {
            return false;
        }
    }
    return true;
}

/**
 * Finds a given token in a message at a given offset.
 * @param {Uint8Array} message message content
 * @param {Uint8Array} token substring that should be found
 * @param {Number} offset message body offset from where search should start
 * @returns {Boolean} whether message has a part at given offset or not
 */
function findToken(message, token, offset = 0, maxSearchLength) {
    let searchLength = message.length;
    if (maxSearchLength) {
        searchLength = Math.min(offset + maxSearchLength, message.length);
    }

    for (let i = offset; i < searchLength; i++) {
        // If the first value of the message matches
        // the first value of the token, check if
        // this is the full token.
        if (message[i] === token[0]) {
            if (containsToken(message, token, i)) {
                return i;
            }
        }
    }

    return -1;
}

/**
 * Decode a Multipart encoded ArrayBuffer and return the components as an Array.
 *
 * @param {ArrayBuffer} response Data encoded as a 'multipart/related' message
 * @returns {Array} The content
 */
function multipartDecode(response) {
    const message = new Uint8Array(response);

    /* Set a maximum length to search for the header boundaries, otherwise
       findToken can run for a long time
    */
    const maxSearchLength = 1000;

    // First look for the multipart mime header
    let separator = stringToUint8Array("\r\n\r\n");
    let headerIndex = findToken(message, separator, 0, maxSearchLength);
    if (headerIndex === -1) {
        throw new Error("Response message has no multipart mime header");
    }

    const header = uint8ArrayToString(message, 0, headerIndex);
    const boundaryString = identifyBoundary(header);
    if (!boundaryString) {
        throw new Error("Header of response message does not specify boundary");
    }

    const boundary = stringToUint8Array(boundaryString);
    const components = [];

    let offset = headerIndex + separator.length;

    // Loop until we cannot find any more boundaries
    let boundaryIndex;

    while (boundaryIndex !== -1) {
        // Search for the next boundary in the message, starting
        // from the current offset position
        boundaryIndex = findToken(message, boundary, offset);

        // If no further boundaries are found, stop here.
        if (boundaryIndex === -1) {
            break;
        }

        // Extract data from response message, excluding "\r\n"
        const spacingLength = 2;
        const length = boundaryIndex - offset - spacingLength;
        const data = response.slice(offset, offset + length);

        // Add the data to the array of results
        components.push(data);

        // find the end of the boundary
        var boundaryEnd = findToken(
            message,
            separator,
            boundaryIndex + 1,
            maxSearchLength
        );
        if (boundaryEnd === -1) break;
        // Move the offset to the end of the identified boundary
        offset = boundaryEnd + separator.length;
    }

    return components;
}

/**
 * Create a random GUID
 *
 * @return {string}
 */
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return (
        s4() +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        s4() +
        s4()
    );
}

function PdfLoader(pdf, Sop) {
    Pages.displayPage("PdfPage");
    img2darkByClass("pdf", false);
    leftLayout.setAccent(Sop.parent.SeriesInstanceUID);

    //如果瀏覽器支援顯示pdf
    if ('PDF Viewer' in navigator.plugins) {
        if (getByid("PDFView")) {
            if (getByid("PDFView").src != pdf)
                getByid("PDFView").src = pdf;
        }
        else {
            var iFrame = document.createElement("iframe");
            iFrame.className = "PDFView";
            iFrame.id = "PDFView";
            iFrame.src = pdf;
            getByid("PdfPage").appendChild(iFrame);
        }
    } else {
        if (getByid("PDFDownloadImg")) {
            if (getByid("PDFDownloadImg").pdf != pdf)
                getByid("PDFDownloadImg").pdf = pdf;
        } else {
            var img = new Image();
            img.id = "PDFDownloadImg";
            img.width = 100, img.height = 100;
            img.src = "../image/icon/lite/download_pdf.png";
            img.pdf = pdf;
            img.onclick = function () {
                var link = document.createElement('a');
                link.href = this.pdf;
                link.download = 'file.pdf';
                link.dispatchEvent(new MouseEvent('click'));
            }
            getByid("PdfPage").appendChild(img);
        }
    }
}

function DcmLoader(image, viewport) {
    if (Pages.type != "DicomPage") {
        Pages.displayPage("DicomPage");
        img2darkByClass("dcm", true);
    }

    var MarkCanvas = viewport.MarkCanvas, MainCanvas = viewport.canvas;

    if (image.NumberOfFrames > 1) viewport.QRLevel = "frames";
    else if (image.haveSameInstanceNumber) viewport.QRLevel = "sop";
    else viewport.QRLevel = "series";

    viewport.content.image = image;
    if (image.imageDataLoaded == false && image.loadImageData) image.loadImageData();
    viewport.content.pixelData = image.pixelData;
    //需要setimage到element
    createDicomTagsList2Viewport(viewport);

    refleshCanvas(viewport);

    //StudyUID:x0020000d,Series UID:x0020000e,SOP UID:x00080018,
    //Instance Number:x00200013,影像檔編碼資料:imageId,PatientId:x00100020
    VIEWPORT.loadViewport(viewport, image, viewport.index);

    //渲染影像到viewport和原始影像
    // showTheImage(element, image, 'normal', ifNowSeries, viewportNum);
    // showTheImage(originelement, image, 'origin', null, viewportNum);

    //紀錄Window Level
    if (!viewport.windowCenter) viewport.windowCenter = image.windowCenter;
    if (!viewport.windowWidth) viewport.windowWidth = image.windowWidth;

    //顯示資訊到label
    setSeriesCount(viewport.index);
    setWindowLevel(viewport.index);

    //渲染上去後畫布應該從原始大小縮小為適當大小
    if (!viewport.scale)
        viewport.scale = Math.min(viewport.div.clientWidth / viewport.width, viewport.div.clientHeight / viewport.height);

    MarkCanvas.width = MainCanvas.width, MarkCanvas.height = MainCanvas.height;

    MarkCanvas.getContext("2d").save();
    //initNewCanvas();

    setTransform(viewport.index);
    MarkCanvas.style.transform = MainCanvas.style.transform;

    if (openWindow == false && openZoom == false) openMouseTool = true;

    //隱藏Table
    getByid("TableSelectNone").selected = true;
    displayMark(viewport.index);//BlueLight2//
    displayRuler(viewport.index);
    displayAIM();
    //displayAnnotation();
    //displayAllRuler();
    viewport.refleshScrollBar();
    refleshGUI();
}

function loadPicture(url) {
    var img = new Image();
    img.onload = function () {
        var imageObj = {};
        imageObj.StudyInstanceUID = CreateUid("study");
        imageObj.SeriesInstanceUID = CreateUid("series");
        imageObj.SOPInstanceUID = CreateUid("sop");
        imageObj.DicomTagsList
        imageObj.data = {};
        imageObj.data.string = function () { return ""; };
        imageObj.color = true;
        imageObj.windowCenter = 127.5;
        imageObj.windowWidth = 255;
        imageObj.data.elements = [];

        imageObj.width = img.width;
        imageObj.height = img.height;
        imageObj.instance = 0;
        imageObj.patientId = "patientID:" + securePassword(0, 99999, 1);
        imageObj.url = img.src;

        var Sop = ImageManager.pushStudy(imageObj);
        Sop.type = 'img';

        var canvas = document.createElement("CANVAS");
        canvas.width = img.width, canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        imageObj.pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        imageObj.getPixelData = function () { return this.pixelData; };
        //改成無論是否曾出現在左側面板，都嘗試加到左側面板
        var qrLv = new QRLv({});
        qrLv.study = imageObj.StudyInstanceUID, qrLv.series = imageObj.SeriesInstanceUID, qrLv.sop = imageObj.SOPInstanceUID;
        leftLayout.setImg2Left(qrLv, imageObj.patientId);
        leftLayout.appendCanvasBySeries(imageObj.SeriesInstanceUID, imageObj, imageObj.pixelData);
        leftLayout.refleshMarkWithSeries(imageObj.SeriesInstanceUID);
        resetViewport();
        GetViewport().loadImgBySop(Sop);
    }
    img.src = url;
}

function loadDicomDataSet(fileData, loadimage = true, url, fromLocal = false) {
    var byteArray = fileData.constructor.name == 'Uint8Array' ? fileData : new Uint8Array(fileData);

    try {
        var dataSet = dicomParser.parseDicom(byteArray);
    } catch (ex) {
        if (loadimage && ImageManager.NumOfPreLoadSops >= 1) ImageManager.NumOfPreLoadSops -= 1;
        console.log(ex);
        return;
    }

    //PDF
    if (dataSet.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.EncapsulatedPDFStorage)
        loadImageFromDataSet(dataSet, 'pdf', loadimage, url, fromLocal);

    //Mark
    else if (dataSet.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.RTStructureSetStorage)//RTSS
        readDicomMark(dataSet);
    else if (dataSet.string(Tag.SOPClassUID) == SOPClassUID.SegmentationStorage)
        loadDicomSeg(getDefaultImageObj(dataSet, 'seg'))
    else if (dataSet.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.GrayscaleSoftcopyPresentationStateStorage)
        readDicomMark(dataSet)

    //ECG
    else if (dataSet.string(Tag.MediaStorageSOPClassUID) == SOPClassUID._12_leadECGWaveformStorage) {
        if (openECG) loadImageFromDataSet(dataSet, 'ecg', loadimage, url, fromLocal);
        throw "not support ECG";
    }

    //DiCOM Image
    else if (dataSet.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.MRImageStorage)//MR
        loadImageFromDataSet(dataSet, dataSet.intString(Tag.NumberOfFrames) > 1 ? 'frame' : 'sop', loadimage, url, fromLocal);
    else if (dataSet.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.CTImageStorage)//CT
        loadImageFromDataSet(dataSet, dataSet.intString(Tag.NumberOfFrames) > 1 ? 'frame' : 'sop', loadimage, url, fromLocal);
    else if (dataSet.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.ComputedRadiographyImageStorage)//X-Ray
        loadImageFromDataSet(dataSet, dataSet.intString(Tag.NumberOfFrames) > 1 ? 'frame' : 'sop', loadimage, url, fromLocal);

    //DiCOM Image(Multi-Frame)
    else if (dataSet.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.Multi_frameSingleBitSecondaryCaptureImageStorage)
        loadImageFromDataSet(dataSet, dataSet.intString(Tag.NumberOfFrames) > 1 ? 'frame' : 'sop', loadimage, url, fromLocal);
    else if (dataSet.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.Multi_frameGrayscaleByteSecondaryCaptureImageStorage)
        loadImageFromDataSet(dataSet, dataSet.intString(Tag.NumberOfFrames) > 1 ? 'frame' : 'sop', loadimage, url, fromLocal);
    else if (dataSet.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.Multi_frameGrayscaleWordSecondaryCaptureImageStorage)
        loadImageFromDataSet(dataSet, dataSet.intString(Tag.NumberOfFrames) > 1 ? 'frame' : 'sop', loadimage, url, fromLocal);
    else if (dataSet.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.Multi_frameTrueColorSecondaryCaptureImageStorage)
        loadImageFromDataSet(dataSet, dataSet.intString(Tag.NumberOfFrames) > 1 ? 'frame' : 'sop', loadimage, url, fromLocal);

    //try parse
    else loadImageFromDataSet(dataSet, dataSet.intString(Tag.NumberOfFrames) > 1 ? 'frame' : 'sop', loadimage, url, fromLocal);
    //else if (dataSet.intString(Tag.NumberOfFrames) > 1) loadImageFromDataSet(dataSet, 'frame', loadimage, url);
    //else loadImageFromDataSet(dataSet, 'sop', loadimage, url);


    //else if (image.data.string(Tag.SOPClassUID) == SOPClassUID.SegmentationStorage) loadDicomSeg(image, DICOM_obj.imageId);
    //else if (image.data.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.EncapsulatedPDFStorage) parseDicomWithoutImage(image.data, DICOM_obj.imageId); 
}

function loadDICOMFromUrl(url, loadimage = true) {
    var headers = {
        'user-agent': 'Mozilla/4.0 MDN Example', 'content-type': 'multipart/related; type=application/dicom;'
    }
    var wadoToken = ConfigLog.WADO.token;
    for (var to = 0; to < Object.keys(wadoToken).length; to++) {
        if (wadoToken[Object.keys(wadoToken)[to]] != "")
            headers[Object.keys(wadoToken)[to]] = wadoToken[Object.keys(wadoToken)[to]];
    }

    fetch(url, { headers, }).then(async function (res) {
        let oReq = await res.arrayBuffer();
        loadDicomDataSet(oReq, loadimage == true, url, false);
    }).finally(() => LoadFileInBatches.finishOne());
}

function initNewCanvas() {
    //添加事件
    try {
        for (var i = 0; i < Viewport_Total; i++) {
            GetViewport(i).div.removeEventListener("contextmenu", contextmenuF, false);
            GetViewport(i).div.removeEventListener("mousemove", BlueLightMousemove, false);
            GetViewport(i).div.removeEventListener("mousedown", BlueLightMousedown, false);
            GetViewport(i).div.removeEventListener("mouseup", BlueLightMouseup, false);
            GetViewport(i).div.removeEventListener("mouseout", Mouseout, false);
            GetViewport(i).div.removeEventListener("wheel", Wheel, false);
            GetViewport(i).div.removeEventListener("mousedown", SwitchViewport, false);
            GetViewport(i).div.removeEventListener("touchstart", BlueLightTouchstart, false);
            GetViewport(i).div.removeEventListener("touchend", BlueLightTouchend, false);
            GetViewport(i).div.addEventListener("touchstart", SwitchViewport, false);
            GetViewport(i).div.addEventListener("mousedown", SwitchViewport, false);
            GetViewport(i).div.addEventListener("wheel", Wheel, false);
        }
        GetViewport().div.removeEventListener("touchstart", SwitchViewport, false);
        GetViewport().div.removeEventListener("mousedown", SwitchViewport, false);
        GetViewport().div.addEventListener("contextmenu", contextmenuF, false);
        GetViewport().div.addEventListener("mousemove", BlueLightMousemove, false);
        GetViewport().div.addEventListener("mousedown", BlueLightMousedown, false);
        GetViewport().div.addEventListener("mouseup", BlueLightMouseup, false);
        GetViewport().div.addEventListener("mouseout", Mouseout, false);
        GetViewport().div.addEventListener("touchstart", BlueLightTouchstart, false);
        GetViewport().div.addEventListener("touchmove", BlueLightTouchmove, false);
        GetViewport().div.addEventListener("touchend", BlueLightTouchend, false);
    } catch (ex) { console.log(ex); }
    //GetViewport().div.addEventListener("wheel", wheelF, false); --*
}

function createDicomTagsList2Viewport(viewport) {
    function getTag(tag) {
        var group = tag.substring(1, 5);
        var element = tag.substring(5, 9);
        var tagIndex = (`(${group},${element})`).toUpperCase();
        var attr = TAG_DICT[tagIndex];
        return attr;
    }

    //取得DICOM Tags放入清單
    viewport.DicomTagsList = [];
    if (viewport.Sop.type == "img") viewport.DicomTagsList.SOPInstanceUID = viewport.content.image.SOPInstanceUID;

    for (el in viewport.content.image.data.elements) {
        try {
            var tag = (`(${el.substring(1, 5)},${el.substring(5, 9)})`).toUpperCase();
            var el1 = getTag(el);
            el1.tag = "" + el;
            var content = dicomParser.explicitElementToString(viewport.content.image.data, el1);
            if (content) {
                viewport.DicomTagsList.push([tag, el1.name, content]);
                viewport.DicomTagsList[el1.name] = content;
            } else {
                var name = ("" + el1.name).toLowerCase();
                if (!viewport.content.image[name]) {
                    if (el1.vr == 'US') {
                        viewport.DicomTagsList.push([tag, el1.name, viewport.content.image.data.uint16(el)]);
                        viewport.DicomTagsList[el1.name] = image.data.uint16(el);
                    } else if (el1.vr === 'SS') {
                        viewport.DicomTagsList.push([tag, el1.name, viewport.content.image.data.int16(el)]);
                        viewport.DicomTagsList[el1.name] = image.data.int16(el);
                    } else if (el1.vr === 'UL') {
                        viewport.DicomTagsList.push([tag, el1.name, viewport.content.image.data.uint32(el)]);
                        viewport.DicomTagsList[el1.name] = image.data.uint32(el);
                    } else if (el1.vr === 'SL') {
                        viewport.DicomTagsList.push([tag, el1.name, viewport.content.image.data.int32(el)]);
                        viewport.DicomTagsList[el1.name] = image.data.int32(el);
                    } else if (el1.vr === 'FD') {
                        viewport.DicomTagsList.push([tag, el1.name, viewport.content.image.data.double(el)]);
                        viewport.DicomTagsList[el1.name] = image.data.double(el);
                    } else if (el1.vr === 'FL') {
                        viewport.DicomTagsList.push([tag, el1.name, viewport.content.image.data.float(el)]);
                        viewport.DicomTagsList[el1.name] = image.data.float(el);
                    } else {
                        viewport.DicomTagsList.push([tag, el1.name, ""]);
                        viewport.DicomTagsList[el1.name] = "";
                    }
                } else {
                    viewport.DicomTagsList.push([tag, el1.name, viewport.content.image[name]]);
                    viewport[el1.name] = viewport.content.image[name];
                }
            }
        } catch (ex) { }
    }
}