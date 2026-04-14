
let VIEWPORT = {};
VIEWPORT.fixRow = null;
VIEWPORT.fixCol = null;

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
VIEWPORT.loadViewportList = ['putLabel2Element'];

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
            else if (ConfigLog.WADO.WADOType == "RS") wadorsLoader(url, onlyload);
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
                            else if (ConfigLog.WADO.WADOType == "RS") wadorsLoader(list[i].url, list[i].onlyload);
                        }
                    } else {
                        LoadFileInBatches.lock = false;
                        var list = LoadFileInBatches.queue.splice(0, LoadFileInBatches.queue.length);
                        LoadFileInBatches.NumOfFetchs += list.length;
                        for (var i = 0; i < list.length; i++) {
                            if (ConfigLog.WADO.WADOType == "URI") loadDICOMFromUrl(list[i].url, list[i].onlyload);
                            else if (ConfigLog.WADO.WADOType == "RS") wadorsLoader(list[i].url, list[i].onlyload);
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

        // Only hide the status indicator when all fetches are complete and queue is empty
        if (LoadFileInBatches.NumOfFetchs === 0 && LoadFileInBatches.queue.length === 0) {
            hideDicomStatus();
        }
    }
}

function wadorsLoader(url, onlyload) {
    // Show loading status
    showDicomStatus("Loading images...");

    var headers = {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'multipart/related; type=application/dicom;'
    }

    var wadoToken = ConfigLog.WADO.token;
    for (var to = 0; to < Object.keys(wadoToken).length; to++) {
        if (wadoToken[Object.keys(wadoToken)[to]] != "")
            headers[Object.keys(wadoToken)[to]] = wadoToken[Object.keys(wadoToken)[to]];
    }

    fetch(url, { headers })
        .then(function (res) {
            if (!res.ok) {
                console.error("HTTP error:", res.status, res.statusText);
                showDicomStatus("PACS error: " + res.status + " " + res.statusText, true);
                throw new Error('HTTP error ' + res.status + ': ' + res.statusText);
            }
            return res.arrayBuffer();
        })
        .then(function (resBlob) {
            let decodedBuffers = multipartDecode(resBlob);
            for (let decodedBuf of decodedBuffers) {
                var byteArray = new Uint8Array(decodedBuf);
                var blob = new Blob([byteArray], { type: 'application/dicom' });
                var dcm_url = URL.createObjectURL(blob)

                var Sop = loadDicomDataSet(decodedBuf);
                setPixelDataToImageObj(Sop);
                Sop.Image.url = dcm_url;
                if (!(onlyload == true)) {
                    setImageObjToLeft(Sop);
                    resetViewport();
                    GetViewport().loadImgBySop(Sop);
                }
                else leftLayout.refreshNumberOfFramesOrSops(Sop.Image);
            }
            // Removed hideDicomStatus() call from here
        })
        .catch(function (error) {
            console.error("Fetch error:", error);
            showDicomStatus("PACS error: " + error.message, true);
        })
        .finally(function () {
            LoadFileInBatches.finishOne();
        });
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
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return (s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4());
}

function SrLoader(Sop) {
    try {
        Pages.displayPage("SrPage");
        getByid("SrPage").innerHTML = ""; // 清空，避免顯示到錯誤影像。
        img2darkByClass("sr", false);
        leftLayout.setAccent(Sop.parent.SeriesInstanceUID);
        var iFrame = document.createElement("iframe");
        iFrame.className = "SRView";
        iFrame.id = "SRView";
        const dateString = Sop.dataSet.string(Tag.ContentDate) + Sop.dataSet.string(Tag.ContentTime);

        // 1. 將字串轉換為 JavaScript Date 物件
        // 格式化為 ISO 8601 標準格式 (YYYY-MM-DDTHH:mm:ss)，這樣 new Date() 才能正確解析
        const isoString =
            dateString.substring(0, 4) + '-' +  // 年 (2025)
            dateString.substring(4, 6) + '-' +  // 月 (10)
            dateString.substring(6, 8) + 'T' +  // 日 (19)
            dateString.substring(8, 10) + ':' + // 時 (01)
            dateString.substring(10, 12) + ':' +// 分 (13)
            dateString.substring(12, 14);     // 秒 (27)

        // 預設它是一個本地時間，但最好的做法是明確指定時區， 如果不指定時區，new Date(isoString) 會被解析為執行環境的本地時間
        const date = new Date(isoString);

        // 2. 使用 Intl.DateTimeFormat 進行格式化
        const options = {
            year: 'numeric',
            month: 'short', // 'Oct'
            day: 'numeric', // '19'
            hour: 'numeric',  // 12小時制
            minute: '2-digit',
            second: '2-digit',
            hour12: true, // 顯示 AM/PM
        };

        // 'en-US' (美式英文) 語言環境最接近您要的格式
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

        var PersonObserverInformation = "";
        var ContentSequence = Sop.dataSet.elements[Tag.ContentSequence];
        function dumpContentSequence(ContentSequence, level) {
            if (!ContentSequence) return;
            for (var i = 0; i < ContentSequence.items.length; i++) {
                var ValueType = ContentSequence.items[i].dataSet.string(Tag.ValueType);
                if (ValueType == "CONTAINER") {
                    for (var l = 0; l < level * 4; l++)PersonObserverInformation += "&nbsp;";
                    if (!ContentSequence.items[i].dataSet.elements[Tag.ConceptNameCodeSequence].items.length) continue;
                    PersonObserverInformation += htmlEntities(ContentSequence.items[i].dataSet.elements[Tag.ConceptNameCodeSequence].items[0].dataSet.string(Tag.CodeMeaning));
                    PersonObserverInformation += "<br>";
                    dumpContentSequence(ContentSequence.items[i].dataSet.elements[Tag.ContentSequence], level + 1);
                    PersonObserverInformation += "<br>";
                }
                else if (ValueType == "TEXT") {
                    for (var l = 0; l < level * 4; l++)PersonObserverInformation += "&nbsp;";
                    if (!ContentSequence.items[i].dataSet.elements[Tag.ConceptNameCodeSequence].items.length) continue;
                    PersonObserverInformation += htmlEntities(ContentSequence.items[i].dataSet.elements[Tag.ConceptNameCodeSequence].items[0].dataSet.string(Tag.CodeMeaning));
                    PersonObserverInformation += ":";
                    PersonObserverInformation += htmlEntities(ContentSequence.items[i].dataSet.string(Tag.TextValue));
                    PersonObserverInformation += "<br>";
                }
                else if (ValueType == "CODE") {
                    for (var l = 0; l < level * 4; l++)PersonObserverInformation += "&nbsp;";
                    if (!ContentSequence.items[i].dataSet.elements[Tag.ConceptNameCodeSequence].items.length) continue;
                    PersonObserverInformation += htmlEntities(ContentSequence.items[i].dataSet.elements[Tag.ConceptNameCodeSequence].items[0].dataSet.string(Tag.CodeMeaning));
                    PersonObserverInformation += ":";
                    PersonObserverInformation += htmlEntities(ContentSequence.items[i].dataSet.string(Tag.TextValue));
                    PersonObserverInformation += "<br>";
                }
                else if (ValueType == "NUM") {
                    for (var l = 0; l < level * 4; l++)PersonObserverInformation += "&nbsp;";
                    if (!ContentSequence.items[i].dataSet.elements[Tag.ConceptNameCodeSequence].items.length) continue;
                    PersonObserverInformation += htmlEntities(ContentSequence.items[i].dataSet.elements[Tag.ConceptNameCodeSequence].items[0].dataSet.string(Tag.CodeMeaning));
                    PersonObserverInformation += ":";
                    PersonObserverInformation += htmlEntities(ContentSequence.items[i].dataSet.string(Tag.TextValue));
                    PersonObserverInformation += "<br>";
                }
                else if (ValueType == "IMAGE") {
                    for (var l = 0; l < level * 4; l++)PersonObserverInformation += "&nbsp;";
                    PersonObserverInformation += '<font color="blue">Image</font>'
                    PersonObserverInformation += "<br>";
                }
            }
        }
        dumpContentSequence(ContentSequence, 0);
        function StringProcessing(str) {
            str = htmlEntities("" + str);
            if (looksLikeMojibake(str) && Sop.dataSet.string('x00080005')) {
                try {
                    str = window['dicom-character-set'].convertBytes(Sop.dataSet.string('x00080005'), new Uint8Array(str.split('').map(ch => ch.charCodeAt(0))), { vr: 'LT' });
                } catch (ex) { console.log(ex); }
            }
            return str;
        }
        iFrame.srcdoc = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Embedded Content</title>
            <style>
            .SRTable{
                border-collapse: separate;
                border-spacing: 20px 0;
            }
            </style>
        </head>
        <body style="background:white">
            <h1>Image Measurement Report</h1>
            <p>${"" + formattedDate}</p>
            <table class="SRTable">
                <thead>
                    <tr>
                    <th>Patient</th>
                    <th>Study</th>
                    <th>ReportStatus</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                           PatientName:${StringProcessing(Sop.dataSet.string(Tag.PatientName))}<br>
                           PatientID:${StringProcessing(Sop.dataSet.string(Tag.PatientID))}<br>
                           PatientBirthDate:${StringProcessing(Sop.dataSet.string(Tag.PatientBirthDate))}<br>
                           PatiePatientSexntName: ${StringProcessing(Sop.dataSet.string(Tag.PatientSex))}
                        </td>
                        <td>
                            StudyDate:${StringProcessing(Sop.dataSet.string(Tag.StudyDate))}<br>
                            StudyID:${StringProcessing(Sop.dataSet.string(Tag.StudyID))}<br>
                            AccessioNumber:${StringProcessing(Sop.dataSet.string(Tag.AccessioNumber))}<br>
                            Referring Physician's Name:${StringProcessing(Sop.dataSet.string(Tag.ReferringPhysicianName))}
                        </td>
                        <td>
                            Completion Flag:${StringProcessing(Sop.dataSet.string(Tag.CompletionFlag))}<br>
                            Verification Flag:${StringProcessing(Sop.dataSet.string(Tag.VerificationFlag))}
                        </td>
                    </tr>
                </tbody>
            </table>
            <hr>
            <p>${PersonObserverInformation}</p>
        </body>
        </html>
        `;
        getByid("SrPage").appendChild(iFrame);
    } catch (ex) {
        ErrorMessage.pushErrorMessage(515);
    }
}

function PdfLoader(pdf, Sop) {
    try {
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
    } catch (ex) {
        ErrorMessage.pushErrorMessage(514);
    }
}

function DcmLoader(image, viewport) {
    try {
        if (Pages.type != "DicomPage") {
            Pages.displayPage("DicomPage");
            img2darkByClass("dcm", true);
        }

        var MarkCanvas = viewport.MarkCanvas, MainCanvas = viewport.canvas;

        if (image.NumberOfFrames > 1) viewport.QRLevel = "frames";
        else if (image.haveSameInstanceNumber) viewport.QRLevel = "sop";
        else viewport.QRLevel = "series";

        if (viewport.content.image) {
            if (viewport.content.image.windowCenter != image.windowCenter) viewport.windowCenter = null;
            if (viewport.content.image.windowWidth != image.windowWidth) viewport.windowWidth = null;
        }

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

        setTransform(viewport.index);
        MarkCanvas.style.transform = MainCanvas.style.transform;

        //隱藏Table
        displayMark(viewport.index);//BlueLight2//
        displayRuler(viewport.index);

        viewport.refleshScrollBar();
        refleshGUI();
    } catch (ex) {
        ErrorMessage.pushErrorMessage(510, viewport.sop, viewport.series, viewport.study);
    }
}

function loadPicture(url) {
    try {
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
    } catch (ex) {
        ErrorMessage.pushErrorMessage(511);
    }
}

function EcgLoader(Sop) {
    try {
        Pages.displayPage("EcgPage");
        img2darkByClass("ecg", false);
        leftLayout.setAccent(Sop.parent.SeriesInstanceUID);
        if (!getByid("EcgView")) {
            var EcgView = document.createElement("div");
            EcgView.id = "EcgView";
            getByid("EcgPage").appendChild(EcgView);
            var EcgLabel = document.createElement("label");
            EcgLabel.style.position = "absolute";
            EcgLabel.style.fontSize = "48px";
            EcgLabel.style.zIndex = "10";
            EcgLabel.style.right = "5px";
            EcgLabel.style.bottom = "5px";
            EcgLabel.style.marginTop = "6px";
            EcgLabel.style.border = "2px solid black";
            EcgLabel.style.backgroundColor = "white";
            EcgLabel.innerText = "This is a test version.";
            getByid("EcgPage").appendChild(EcgLabel);
        }
        if (!getByid("EcgCanvas")) {
            var EcgCanvas = document.createElement("CANVAS");
            EcgCanvas.id = "EcgCanvas";

            getByid("EcgView").appendChild(EcgCanvas);
        }

        var ECGSpeedSelect = getByid("ECGSpeedSelect"), ECGVoltageSelect = getByid("ECGVoltageSelect");
        for (var opt of ECGSpeedSelect.options)
            if (parseFloat(opt.text) == 25) opt.setAttribute("selected", "selected");
        for (var opt of ECGVoltageSelect.options)
            if (parseFloat(opt.text) == 10) opt.setAttribute("selected", "selected");

        ECGSpeedSelect.onchange = function () { EcgLoader(GetViewport().Sop); }
        ECGVoltageSelect.onchange = function () { EcgLoader(GetViewport().Sop); }

        //////////////////////////////////////////////////

        // 紙張大小
        const A4Width = 3508, A4Height = 2480;
        // 準備畫布
        var EcgCanvas = getByid("EcgCanvas"), ctx = EcgCanvas.getContext("2d");
        EcgCanvas.width = A4Width, EcgCanvas.height = A4Height;
        ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, A4Width, A4Height);

        //////////////////////////////////////////////////

        // 標準參數
        const speed = parseFloat(ECGSpeedSelect.options[ECGSpeedSelect.selectedIndex].text);
        const voltage = parseFloat(ECGVoltageSelect.options[ECGVoltageSelect.selectedIndex].text);
        // 有幾個導程
        var Channels12 = Sop.Image.NumberOfWaveformChannels;
        if (Channels12 != 12) return;

        // 一個導程有幾個Samples
        var NumberOfWaveformSamples = Sop.Image.NumberOfWaveformSamples;
        // 十二個導程有幾個Samples
        var WaveformData = Sop.Image.ReconstructionWaveformData;
        // 總共幾秒
        const totalSecnods = NumberOfWaveformSamples / Sop.Image.SamplingFrequency;

        //////////////////////////////////////////////////

        // 解析度：1 mm 等於幾個 pixel(給4x4用)
        var px_per_mm = A4Width / (10 * speed);
        // 解析度：1 mm 等於幾個 pixel(給&1用)
        var px_per_mm_Rhythm = A4Width / (totalSecnods * speed);

        // 佈局參數 (4x4&1)
        var Rows = 4, Cols = 4;
        var Row_height = A4Height / Rows, Col_width = A4Width / Cols;
        // 12導程分別位於的位置
        var layout = [
            { name: 'I', row: 0, col: 0 }, { name: 'aVR', row: 0, col: 1 }, { name: 'V1', row: 0, col: 2 }, { name: 'V4', row: 0, col: 3 },
            { name: 'II', row: 1, col: 0 }, { name: 'aVL', row: 1, col: 1 }, { name: 'V2', row: 1, col: 2 }, { name: 'V5', row: 1, col: 3 },
            { name: 'III', row: 2, col: 0 }, { name: 'aVF', row: 2, col: 1 }, { name: 'V3', row: 2, col: 2 }, { name: 'V6', row: 2, col: 3 },
            { name: 'II', row: 3, col: 0, isRhythm: true } // 長節律導程
        ];

        //////////////////////////////////////////////////

        // 畫底框框
        function creatEcgBackground() {
            const w = A4Width, h = A4Height;
            // 畫 1mm 小網格 (淺色)
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 180, 180, 0.5)', ctx.lineWidth = 1;
            for (let x = 0; x <= w; x += px_per_mm) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
            for (let y = 0; y <= h; y += px_per_mm) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
            ctx.stroke();

            // 畫 5mm 大網格 (深色)
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 100, 100, 0.8)', ctx.lineWidth = 1.5;
            for (let x = 0; x <= w; x += px_per_mm * 5) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
            for (let y = 0; y <= h; y += px_per_mm * 5) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
            ctx.stroke();

            // 畫區分12格的最大網格 (粗線)
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 80, 80, 0.9)', ctx.lineWidth = 5;
            for (let x = 0; x <= w; x += Col_width) { ctx.moveTo(x, 0); ctx.lineTo(x, h - Row_height); }
            for (let y = 0; y <= h; y += Row_height) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
            ctx.stroke();
        }
        creatEcgBackground();

        // 準備好波型資料
        function parseDICOMWaveformData(waveData, numChannels, numSamples, samplingRate) {

            const signals = {};
            const leadNames = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'];

            // 只打算畫 10 秒，超過的不用畫
            const targetSeconds = 11;
            const targetSamples = targetSeconds * samplingRate;

            // 如果原始資料超過 10 秒，得計算要「跳過」前面幾個點(例如 5500 - 5000 = 500點)
            const skipSamples = numSamples > targetSamples ? numSamples - targetSamples : 0;

            // 陣列長度固定給要畫的長度
            for (var name of leadNames) signals[name] = new Float32Array(targetSamples);

            // 從 skipSamples 開始讀取，只抓後面10秒的點
            for (let i = 0; i < targetSamples; i++) {
                // 原始資料的實際索引 (要加上跳過的那些點)
                const originalIndex = i + skipSamples;
                if (originalIndex >= numSamples) break;
                // 對應到指定的點
                for (let ch = 0; ch < numChannels; ch++) {
                    const index = (originalIndex * numChannels) + ch;
                    const leadName = leadNames[ch] || `CH${ch + 1}`;
                    signals[leadName][i] = waveData[index];
                }
            }
            return signals;
        }
        var ecgData = parseDICOMWaveformData(WaveformData, Channels12, NumberOfWaveformSamples, Sop.Image.SamplingFrequency)

        // 實際開始畫波形資料
        function drawWaveforms(ecgData) {
            const sr = Sop.Image.SamplingFrequency;
            for (var l = 0; l < layout.length; l++) {
                var block = layout[l];
                const signal = ecgData[block.name];
                if (!signal) return;

                // 計算繪圖區塊範圍
                const startX = block.col * Col_width;
                const startY = block.row * Row_height;
                const width = block.isRhythm ? A4Width : Col_width;
                const height = Row_height;
                const baselineY = startY + (height / 2); // 0 mV 在區塊正中間

                // 計算這個區塊要畫幾秒的資料(最後一個是畫全部，其他是2.5秒)
                const durationSec = block.isRhythm ? totalSecnods : 2.5;
                const numSamples = durationSec * sr;

                // 短導程需要偏移起始點 (例如 aVR 是從 2.5秒 開始)
                const sampleOffset = block.isRhythm ? 0 : (block.col * 2.5 * sr);
                // 由於長導程不一定等於10秒，所以短導程和長導程的(1 mm 等於幾個 pixel)，並不相同
                const Px_per_mm = block.isRhythm ? px_per_mm_Rhythm : px_per_mm;

                ctx.save();
                // 設定剪裁區域，避免畫到其他的格子
                ctx.beginPath(); ctx.rect(startX, startY, width, height); ctx.clip();
                // 繪製導程名稱
                ctx.fillStyle = 'black'; ctx.font = 'bold 16px sans-serif'; ctx.fillText(block.name, startX + 10, startY + 25);

                // 繪製波型
                ctx.beginPath();
                ctx.strokeStyle = 'black'; ctx.lineJoin = 'round'; ctx.lineWidth = 1.5;
                for (let i = 0; i < numSamples; i++) {
                    const index = sampleOffset + i;
                    if (index >= signal.length) break;

                    const x = (i / sr) * speed * Px_per_mm;
                    const y = (signal[index] * voltage * Px_per_mm);
                    if (i === 0) ctx.moveTo(startX + x, baselineY - y);
                    else ctx.lineTo(startX + x, baselineY - y);
                }
                ctx.stroke();
                ctx.restore();
            }
        }
        drawWaveforms(ecgData);
    } catch (ex) {
        ErrorMessage.pushErrorMessage(512);
    }
}

function setECG(imageObj) {
    try {
        if (!imageObj.data.elements[Tag.WaveformSequence]) throw "WaveformSequence not found";
        var WaveformSequence = imageObj.data.elements[Tag.WaveformSequence];
        imageObj.ecg = true;
        for (var i = 0; i < WaveformSequence.items.length; i++) {
            if (WaveformSequence.items[i].dataSet.string(Tag.WaveformOriginality) == 'ORIGINAL') {
                //Samples
                imageObj.NumberOfWaveformSamples = WaveformSequence.items[i].dataSet.int16(Tag.NumberOfWaveformSamples);
                //12
                imageObj.NumberOfWaveformChannels = WaveformSequence.items[i].dataSet.int16(Tag.NumberOfWaveformChannels);
                //BitsAllocated
                imageObj.WaveformBitsAllocated = WaveformSequence.items[i].dataSet.int16(Tag.WaveformBitsAllocated);
                //SamplingFrequency
                imageObj.SamplingFrequency = WaveformSequence.items[i].dataSet.intString(Tag.SamplingFrequency);
                //WaveformData.length=Samples*12*(BitsAllocated/8)
                var WaveformData = WaveformSequence.items[i].dataSet.elements[Tag.WaveformData];

                imageObj.FilterHighFrequency = WaveformSequence.items[i].dataSet.elements[Tag.ChannelDefinitionSequence].items[0].dataSet.intString(Tag.FilterHighFrequency);
                imageObj.FilterLowFrequency = WaveformSequence.items[i].dataSet.elements[Tag.ChannelDefinitionSequence].items[0].dataSet.intString(Tag.FilterLowFrequency);
                imageObj.ChannelSensitivity = WaveformSequence.items[i].dataSet.elements[Tag.ChannelDefinitionSequence].items[0].dataSet.intString(Tag.ChannelSensitivity);
                //check
                if (WaveformData.length != imageObj.NumberOfWaveformSamples * imageObj.NumberOfWaveformChannels * (imageObj.WaveformBitsAllocated / 8))
                    throw "WaveformData parsing failed";

                var WaveformDataOffset = WaveformSequence.items[0].dataSet.elements[Tag.WaveformData].dataOffset;
                var WaveformDataLength = WaveformSequence.items[0].dataSet.elements[Tag.WaveformData].length;
                switch (imageObj.WaveformBitsAllocated) {
                    case 8: imageObj.WaveformData = new Int8Array(imageObj.data.byteArray.buffer.slice(WaveformDataOffset, WaveformDataOffset + WaveformDataLength * 1)); break;
                    case 16: imageObj.WaveformData = new Int16Array(imageObj.data.byteArray.buffer.slice(WaveformDataOffset, WaveformDataOffset + WaveformDataLength * 1)); break;
                    case 32: imageObj.WaveformData = new Int32Array(imageObj.data.byteArray.buffer.slice(WaveformDataOffset, WaveformDataOffset + WaveformDataLength * 1)); break;
                    default: throw "WaveformData parsing failed";
                }
                imageObj.ReconstructionWaveformData = new Float32Array(imageObj.WaveformData.length);

                for (var w = 0; w < imageObj.WaveformData.length; w++) {
                    imageObj.ReconstructionWaveformData[w] = imageObj.WaveformData[w] / (imageObj.ChannelSensitivity ? imageObj.ChannelSensitivity : 1);
                    if (!isNaN(imageObj.FilterHighFrequency) && !isNaN(imageObj.FilterLowFrequency))
                        imageObj.ReconstructionWaveformData[w] = (imageObj.ReconstructionWaveformData[w] - imageObj.FilterLowFrequency) / (imageObj.FilterHighFrequency - imageObj.FilterLowFrequency);
                }
                return;
            }
        }
        if (WaveformSequence.items.length == 0) throw "WaveformOriginality not found";
        throw "ORIGINAL WaveformOriginality not found";
    } catch (ex) {
        ErrorMessage.pushErrorMessage(513);
    }
}

class ErrorMessage {
    static message = [];
    static getErrorMessage() {
        return ErrorMessage.message
    }
    static pushErrorMessage(ErrorCode = -1, sop = "unknown", series = "unknown", study = "unknown") {
        const now = new Date(); const formatter = new Intl.DateTimeFormat('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        ErrorMessage.message.push({
            sop: sop, series: series, study: study,
            ErrorCode: ErrorCode, time: formatter.format(now) //(2026/02/10 22:30:37)
        })
    }
}

function getEntropy() {
    var canvas = GetViewport().canvas, ctx = canvas.getContext('2d');

    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    var blackPixelCount = 0;
    for (let i = 0; i < imgData.length - 8; i += 8) {
        if (Math.abs(imgData[i] - imgData[i + 4]) >= 80) blackPixelCount++;
    }
    var entropy = (blackPixelCount / (canvas.width * canvas.height)) * 100;
    return { percent: entropy, error: entropy >= 3 };
}

function getBlackPercent() {
    var canvas = GetViewport().canvas, ctx = canvas.getContext('2d');

    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    var blackPixelCount = 0;
    for (let i = 0; i < imgData.length - 8; i += 8) {
        if (Math.abs(imgData[i]) == 0) blackPixelCount++;
    }
    var blackPercent = (blackPixelCount / (canvas.width * canvas.height)) * 100;
    return { percent: blackPercent, error: blackPercent >= 99 };
}

function getWhitePercent() {
    var canvas = GetViewport().canvas, ctx = canvas.getContext('2d');

    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    var whitePixelCount = 0;
    for (let i = 0; i < imgData.length - 8; i += 8) {
        if (Math.abs(imgData[i]) == 255) whitePixelCount++;
    }
    var whitePercent = (whitePixelCount / (canvas.width * canvas.height)) * 100;
    return { percent: whitePercent, error: whitePercent >= 25 };
}

function getWhitePercent() {
    var canvas = GetViewport().canvas, ctx = canvas.getContext('2d');

    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    var clippingPixels = 0;
    for (let i = 0; i < imgData.length - 8; i += 8) {
        var r = imgData[i];
        var g = imgData[i + 1];
        var b = imgData[i + 2];
        if ((r <= 20 || r >= 235) && (g <= 20 || g >= 235) && (b <= 20 || b >= 235)) {
            if (r + g + b <= 60) { }
            else if (r + g + b >= 700) { }
            else clippingPixels++;
        }
    }
    var clippingPercent = (clippingPixels / (canvas.width * canvas.height)) * 100;
    return { percent: clippingPercent, error: clippingPercent >= 0.5 };
}

function detectPhotometricAnomaly() {
    var image = GetViewport().content.image, dataSet = image.data;
    var photometric = dataSet.string('x00280004');
    if ((image.isYCbCr && photometric === 'RGB') || (image.AssumingRGB && photometric.includes("YBR")))
        return { isYCbCr: image.isYCbCr, AssumingRGB: image.AssumingRGB, photometric: photometric, error: true };
    return { isYCbCr: image.isYCbCr, AssumingRGB: image.AssumingRGB, photometric: photometric, error: false };
}

function loadDicomDataSet(fileData) {
    var byteArray = fileData.constructor.name == 'Uint8Array' ? fileData : new Uint8Array(fileData), Sop;

    try {
        var dataSet = dicomParser.parseDicom(byteArray);
    } catch (ex) {
        if (ImageManager.NumOfPreLoadSops >= 1) ImageManager.NumOfPreLoadSops -= 1;
        console.log(ex);
        ErrorMessage.pushErrorMessage(300);
        return;
    }

    //PDF
    if (dataSet.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.EncapsulatedPDFStorage)
        Sop = loadSopFromDataSet(dataSet, 'pdf');

    //Mark
    else if (dataSet.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.RTStructureSetStorage)//RTSS
        readDicomMark(dataSet);
    else if (dataSet.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.KeyObjectSelection)//KO
        loadDicomKO(dataSet);
    else if (dataSet.string(Tag.SOPClassUID) == SOPClassUID.SegmentationStorage)
        loadDicomSeg(getDefaultImageObj(dataSet, 'seg'))
    else if (dataSet.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.GrayscaleSoftcopyPresentationStateStorage)
        readDicomMark(dataSet)

    //ECG
    else if (dataSet.string(Tag.MediaStorageSOPClassUID) == SOPClassUID._12_leadECGWaveformStorage)
        Sop = loadSopFromDataSet(dataSet, 'ecg');
    else if (dataSet.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.GeneralECGWaveformStorage)
        Sop = loadSopFromDataSet(dataSet, 'ecg');

    //SR
    else if (dataSet.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.ComprehensiveSR)
        Sop = loadSopFromDataSet(dataSet, 'sr');
    else if (dataSet.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.EnhancedSR)
        Sop = loadSopFromDataSet(dataSet, 'sr');
    else if (dataSet.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.X_RayRadiationDoseSR)
        Sop = loadSopFromDataSet(dataSet, 'sr');

    //CAD 
    else if (dataSet.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.MammographyCADSR) { }

    //DiCOM Image
    else if (dataSet.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.MRImageStorage)//MR
        Sop = loadSopFromDataSet(dataSet, dataSet.intString(Tag.NumberOfFrames) > 1 ? 'frame' : 'sop');
    else if (dataSet.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.CTImageStorage)//CT
        Sop = loadSopFromDataSet(dataSet, dataSet.intString(Tag.NumberOfFrames) > 1 ? 'frame' : 'sop');
    else if (dataSet.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.ComputedRadiographyImageStorage)//X-Ray
        Sop = loadSopFromDataSet(dataSet, dataSet.intString(Tag.NumberOfFrames) > 1 ? 'frame' : 'sop');

    //DiCOM Image(Multi-Frame)
    else if (dataSet.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.Multi_frameSingleBitSecondaryCaptureImageStorage)
        Sop = loadSopFromDataSet(dataSet, dataSet.intString(Tag.NumberOfFrames) > 1 ? 'frame' : 'sop');
    else if (dataSet.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.Multi_frameGrayscaleByteSecondaryCaptureImageStorage)
        Sop = loadSopFromDataSet(dataSet, dataSet.intString(Tag.NumberOfFrames) > 1 ? 'frame' : 'sop');
    else if (dataSet.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.Multi_frameGrayscaleWordSecondaryCaptureImageStorage)
        Sop = loadSopFromDataSet(dataSet, dataSet.intString(Tag.NumberOfFrames) > 1 ? 'frame' : 'sop');
    else if (dataSet.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.Multi_frameTrueColorSecondaryCaptureImageStorage)
        Sop = loadSopFromDataSet(dataSet, dataSet.intString(Tag.NumberOfFrames) > 1 ? 'frame' : 'sop');

    //try parse
    else Sop = loadSopFromDataSet(dataSet, dataSet.intString(Tag.NumberOfFrames) > 1 ? 'frame' : 'sop');
    //else if (dataSet.intString(Tag.NumberOfFrames) > 1) loadSopFromDataSet(dataSet, 'frame', loadimage, url);
    //else loadSopFromDataSet(dataSet, 'sop', loadimage, url);


    //else if (image.data.string(Tag.SOPClassUID) == SOPClassUID.SegmentationStorage) loadDicomSeg(image, DICOM_obj.imageId);
    //else if (image.data.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.EncapsulatedPDFStorage) parseDicomWithoutImage(image.data, DICOM_obj.imageId); 
    return Sop;
}

function loadDICOMFromUrl(url, loadimage = true) {
    // Show loading status
    showDicomStatus("Loading images...");

    var headers = {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'multipart/related; type=application/dicom;'
    }

    var wadoToken = ConfigLog.WADO.token;
    for (var to = 0; to < Object.keys(wadoToken).length; to++) {
        if (wadoToken[Object.keys(wadoToken)[to]] != "")
            headers[Object.keys(wadoToken)[to]] = wadoToken[Object.keys(wadoToken)[to]];
    }

    fetch(url, { headers })
        .then(function (res) {
            if (!res.ok) {
                console.error("HTTP error:", res.status, res.statusText);
                showDicomStatus("PACS error: " + res.status + " " + res.statusText, true);
                throw new Error('HTTP error ' + res.status + ': ' + res.statusText);
            }
            return res.arrayBuffer();
        })
        .then(function (oReq) {
            var Sop = loadDicomDataSet(oReq);
            setPixelDataToImageObj(Sop);
            Sop.Image.url = url;
            if (loadimage == true) {
                setImageObjToLeft(Sop);
                resetViewport();
                GetViewport().loadImgBySop(Sop);
            }
            else leftLayout.refreshNumberOfFramesOrSops(Sop.Image);
            // Removed hideDicomStatus() call from here
        })
        .catch(function (error) {
            console.error("Fetch error:", error);
            showDicomStatus("PACS error: " + error.message, true);
        })
        .finally(function () {
            LoadFileInBatches.finishOne();
        });
}

// Add this near the top of onload.js if showDicomStatus isn't available
function showDicomStatus(message, isError = false) {
    console.log("Status update:", message, "isError:", isError);
    var statusDiv = document.getElementById('dicomStatusIndicator');
    if (statusDiv) {
        if (isError) {
            statusDiv.innerHTML = '<span style="color:#ff3333;font-weight:bold;">⚠️ ' + message + '</span>';
            statusDiv.style.backgroundColor = 'rgba(50,0,0,0.85)';
        } else {
            statusDiv.innerHTML = '<span style="display:inline-block;width:12px;height:12px;border:2px solid #fff;border-radius:50%;border-top-color:transparent;animation:spin 1s linear infinite;margin-right:5px;"></span>' + message;
            statusDiv.style.backgroundColor = 'rgba(0,0,0,0.85)';
        }
        if (!document.getElementById('spinner-style')) {
            var s = document.createElement('style');
            s.id = 'spinner-style';
            s.textContent = '@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}';
            document.head.appendChild(s);
        }
        statusDiv.style.display = 'block';
    }
}

function hideDicomStatus() {
    var statusDiv = getByid('dicomStatusIndicator');
    if (statusDiv) {
        statusDiv.style.display = 'none';
        statusDiv.style.backgroundColor = 'rgba(0,0,0,0.7)'; // Reset background
    }
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

    for (var el in viewport.content.image.data.elements) {
        try {
            var tag = (`(${el.substring(1, 5)},${el.substring(5, 9)})`).toUpperCase();
            var el1 = getTag(el);
            el1.tag = "" + el;
            var content = dicomParser.explicitElementToString(viewport.content.image.data, el1);
            if (content) {
                if (viewport.content?.image?.SpecificCharacterSet &&
                    (el1.vr === 'PN' || el1.vr === 'LO' || el1.vr === 'SH'
                        || el1.vr === 'ST' || el1.vr === 'LT' || el1.vr === 'UT')) {
                    try {
                        var dataSet = viewport.content.image.data, name = ("" + el1.name).toLowerCase();
                        var str = window['dicom-character-set'].convertBytes(viewport.content?.image?.SpecificCharacterSet, new Uint8Array(dataSet.byteArray.buffer, dataSet.elements[el].dataOffset, dataSet.elements[el].length), { vr: 'LT' });
                        if (str) {
                            viewport.DicomTagsList.push([tag, el1.name, str]);
                            viewport.DicomTagsList[el1.name] = str;
                        } else {
                            viewport.DicomTagsList.push([tag, el1.name, content]);
                            viewport.DicomTagsList[el1.name] = content;
                        }
                    } catch (ex) { console.log(ex); }
                }
                else {
                    viewport.DicomTagsList.push([tag, el1.name, content]);
                    viewport.DicomTagsList[el1.name] = content;
                }
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
                    } /*else if (viewport.content?.image?.SpecificCharacterSet &&
                        (el1.vr === 'PN' || el1.vr === 'LO' || el1.vr === 'SH'
                            || el1.vr === 'ST' || el1.vr === 'LT' || el1.vr === 'UT')) {
                        var dataSet = viewport.content.image.data;
                        var str = window['dicom-character-set'].convertBytes(viewport.content?.image?.SpecificCharacterSet, new Uint8Array(dataSet.byteArray.buffer, dataSet.elements[el1.name].dataOffset, dataSet.elements[el1.name].length), { vr: 'LT' });
                        viewport.DicomTagsList.push([tag, el1.name, str]);
                        viewport.DicomTagsList[el1.name] = "";
                    }*/ else {
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
