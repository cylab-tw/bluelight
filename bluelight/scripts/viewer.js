
let VIEWPORT = {};
VIEWPORT.fixRow = null;
VIEWPORT.fixCol = null;
VIEWPORT.delPDFView = function (viewport) {
    if (viewport && viewport.PDFView) {
        viewport.div.removeChild(viewport.PDFView);
        viewport.PDFView = undefined;
    }
}

VIEWPORT.initTransform = function (viewport, image) {
    if (!image) return;
    if (viewport.tags.PixelSpacing) {
        viewport.transform.PixelSpacingX = 1.0 / parseFloat(viewport.tags.PixelSpacing.split("\\")[0]);
        viewport.transform.PixelSpacingY = 1.0 / parseFloat(viewport.tags.PixelSpacing.split("\\")[1]);
    } else {
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
}

VIEWPORT.putLabel2Element = function (element, image, viewportNum) {
    var label_LT = getClass("labelLT")[viewportNum];
    var label_RT = getClass("labelRT")[viewportNum];
    label_LT.innerHTML = label_RT.innerHTML = "";
    if (!image) return;
    var date = element.StudyDate;
    var time = element.StudyTime;
    date = ("" + date).replace(/^(\d{4})(\d\d)(\d\d)$/, '$1/$2/$3');
    time = ("" + time).replace(/^(\d{2})(\d\d)(\d\d)/, '$1:$2:$3');
    date = date + " " + time.substr(0, 8);
    //清空label的數值

    //依照dicom tags設定檔載入影像
    function htmlEntities(str) {
        if (str == undefined || str == null) str = "";
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace("\r\n", "<br/>").replace("\n", "<br/>");
    }

    for (var i = 0; i < DicomTags.LT.name.length; i++)
        label_LT.innerHTML += "" + DicomTags.LT.name[i] + " " + htmlEntities(image.data.string("x" + DicomTags.LT.tag[i])) + "<br/>";
    for (var i = 0; i < DicomTags.RT.name.length; i++) {
        //避免PatientName出現中文亂碼
        if ("x" + DicomTags.RT.tag[i] == Tag.PatientName) {
            var dataSet = image.data;
            var data = new Uint8Array(dataSet.byteArray.buffer, dataSet.elements[Tag.PatientName].dataOffset, dataSet.elements[Tag.PatientName].length);
            var textDecoder = new TextDecoder('utf-8');
            var decodedString = textDecoder.decode(data);
            //element.PatientName = decodedString;
            label_RT.innerHTML += "" + DicomTags.RT.name[i] + " " + htmlEntities(decodedString) + "<br/>";
        } else {
            label_RT.innerHTML += "" + DicomTags.RT.name[i] + " " + htmlEntities(image.data.string("x" + DicomTags.RT.tag[i])) + "<br/>";
        }
    }
}

VIEWPORT.loadViewport = function (viewport, image, viewportNum) {
    for (var i = 0; i < VIEWPORT.loadViewportList.length; i++) {
        VIEWPORT[VIEWPORT.loadViewportList[i]](viewport, image, viewportNum);
    }
}
VIEWPORT.loadViewportList = ['initTransform', 'putLabel2Element', 'delPDFView'];

function wadorsLoader(url, onlyload) {
    var data = [];

    function getData() {
        var headers = {
            'user-agent': 'Mozilla/4.0 MDN Example',
            'content-type': 'multipart/related; type=application/dicom;'
        }
        var wadoToken = ConfigLog.WADO.token;
        for (var to = 0; to < Object.keys(wadoToken).length; to++) {
            if (wadoToken[Object.keys(wadoToken)[to]] != "") {
                headers[Object.keys(wadoToken)[to]] = wadoToken[Object.keys(wadoToken)[to]];
                // InstanceRequest.setRequestHeader("" + Object.keys(wadoToken)[to], "" + wadoToken[Object.keys(wadoToken)[to]]);
            }
        }
        fetch(url, {
            headers,
        })
            .then(async function (res) {
                let resBlob = await res.arrayBuffer();
                let intArray = new Uint8Array(resBlob);
                var string = '';
                for (let i = 0; i < intArray.length; i++) {
                    string += String.fromCodePoint(intArray[i]);
                }

                var url = await stowMultipartRelated(string);
                if (onlyload == true) onlyLoadImage("wadouri:" + url);
                else loadAndViewImage("wadouri:" + url);
            })
            .catch(function (err) { })
    }
    async function stowMultipartRelated(iData) {
        let multipartMessage = iData;
        let startBoundary = multipartMessage.split("\r\n")[0];
        let matches = multipartMessage.matchAll(new RegExp(startBoundary, "gi"));
        let fileEndIndex = [];
        let fileStartIndex = [];
        for (let match of matches) {
            fileEndIndex.push(match.index - 2);
        }
        fileEndIndex = fileEndIndex.slice(1);
        let data = multipartMessage.split("\r\n");
        let filename = [];
        let files = [];
        //let contentDispositionList = [];
        //let contentTypeList = [];
        for (let i in data) {
            let text = data[i];
            if (text.includes("Content-Disposition")) {
                //contentDispositionList.push(text);
                let textSplitFileName = text.split("filename=")
                filename.push(textSplitFileName[textSplitFileName.length - 1].replace(/"/gm, ""));
            } else if (text.includes("Content-Type")) {
                //contentTypeList.push(text);
            }
        }
        //contentDispositionList = _.uniq(contentDispositionList);
        //contentTypeList = _.uniq(contentTypeList);
        let teststring = ["Content-Type", "Content-Length", "MIME-Version"]
        let matchesIndex = []
        for (let type of teststring) {
            let contentTypeMatches = multipartMessage.matchAll(new RegExp(`${type}.*[\r\n|\r|\n]$`, "gim"));
            for (let match of contentTypeMatches) {
                matchesIndex.push({
                    index: match.index,
                    length: match['0'].length
                })
            }
        }

        function maxBy(array, n) {
            let result;
            if (!array) return result;
            var tempN = Number.MIN_VALUE;
            for (const obj of array) {
                if (obj && obj[n]) {
                    var value = obj[n];
                    if (!isNaN(value) && value > tempN) {
                        tempN = value;
                        result = obj;
                    }
                }
            }
            return result;
        }

        let maxIndex = maxBy(matchesIndex, "index");
        fileStartIndex.push(maxIndex.index + maxIndex.length + 3);
        for (let i in fileEndIndex) {
            let fileData = multipartMessage.substring(fileStartIndex[i], fileEndIndex[i]);
            files.push(fileData);
        }

        function str2ab(str) {
            var buf = new ArrayBuffer(str.length); // 2 bytes for each char
            var bufView = new Uint8Array(buf);
            for (var i = 0, strLen = str.length; i < strLen; i++) {
                bufView[i] = str.charCodeAt(i);
            }
            return buf;
        }
        let buf = str2ab(files[0]);

        var url = URL.createObjectURL(new Blob([buf], { type: "application/dicom" }));
        return url;

    }
    return getData();
}

function displayPDF(pdf) {
    getClass("DicomCanvas")[viewportNumber].width = getClass("DicomCanvas")[viewportNumber].height = 1;
    GetViewportMark().width = GetViewportMark().height = 1;
    var element = GetViewport();
    //for (var tag in element.DicomTagsList) element[element.DicomTagsList[tag][1]] = undefined;
    element.DicomTagsList = [];
    //element.image Width = element.image Height = 
    element.translate.x = element.translate.y = element.rotate =
        element.windowCenter = element.windowWidth = element.sop = undefined;
    element.scale = null;

    VIEWPORT.delPDFView(element.div);
    var iFrame = document.createElement("iframe");
    iFrame.className = "PDFView";
    iFrame.id = "PDFView_" + viewportNumber;
    iFrame.src = pdf;
    element.div.appendChild(iFrame);
    element.PDFView = iFrame;

    for (label of ["labelWC", "labelLT", "labelRT", "labelRB", "labelWC", "labelXY", "leftRule", "downRule"])
        getClass(label)[viewportNumber].style.display = "none";
}

function parseDicomWithoutImage(dataSet, imageId) {
    //目前僅限於pdf的情況
    if (dataSet.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.EncapsulatedPDFStorage) {
        var fileTag = dataSet.elements.x00420011;
        var pdfByteArray = dataSet.byteArray.slice(fileTag.dataOffset, fileTag.dataOffset + fileTag.length);
        var pdfObj = new Blob([pdfByteArray], { type: 'application/pdf' });
        var pdf = URL.createObjectURL(pdfObj);

        var DICOM_obj = {
            study: dataSet.string(Tag.StudyInstanceUID),
            series: dataSet.string(Tag.SeriesInstanceUID),
            sop: dataSet.string(Tag.SOPInstanceUID),
            instance: dataSet.string(Tag.InstanceNumber),
            imageId: imageId,
            image: null,
            pdf: pdf,
            pixelData: null,
            patientId: dataSet.string(Tag.PatientID)
        };
        loadUID(DICOM_obj);

        //改成無論是否曾出現在左側面板，都嘗試加到左側面板
        leftLayout.setImg2Left(new QRLv(dataSet), "patientID:" + securePassword(0, 99999, 1));
        displayPDF(pdf);
    }
}

function loadDicomMultiFrame(image, imageId, viewportNum0) {
    var dataSet = image.data;
    var Size = image.width * image.height;
    var pixelData;
    var BitsAllocated = image.data.int16(Tag.BitsAllocated);

    if (BitsAllocated == 16) pixelData = new Int16Array(dataSet.byteArray.buffer, dataSet.elements.x7fe00010.dataOffset, dataSet.elements.x7fe00010.length / 2);
    else if (BitsAllocated == 32) pixelData = new Int32Array(dataSet.byteArray.buffer, dataSet.elements.x7fe00010.dataOffset, dataSet.elements.x7fe00010.length / 4);
    else if (BitsAllocated == 8) pixelData = new Int8Array(dataSet.byteArray.buffer, dataSet.elements.x7fe00010.dataOffset, dataSet.elements.x7fe00010.length / 1);
    else pixelData = new Int16Array(dataSet.byteArray.buffer, dataSet.elements.x7fe00010.dataOffset, dataSet.elements.x7fe00010.length / 2);
    if (!pixelData) return;

    let frames = [];
    let totalFrames = image.data.intString(Tag.NumberOfFrames);

    for (let i = 0; i < totalFrames; i++) {
        let imageFrameId = `${imageId}?frame=${i}`;
        cornerstone.loadImage(imageFrameId).then((img) => {
            frames.push(img.getPixelData());
        });
    }

    let checkFrameLoadedInterval = setInterval(() => {
        if (frames.length === totalFrames) {
            let DICOM_obj = {
                study: image.data.string(Tag.StudyInstanceUID),
                series: image.data.string(Tag.SeriesInstanceUID),
                sop: image.data.string(Tag.SOPInstanceUID),
                instance: image.data.string(Tag.InstanceNumber),
                imageId: imageId,
                image: image,
                pixelData: frames[0],//pixelData.slice(0, Size),
                frames: frames,
                patientId: image.data.string(Tag.PatientID)
            };

            loadUID(DICOM_obj);
            GetViewport(viewportNum0).framesNumber = 0;

            if (image.data.string(Tag.SOPClassUID) == SOPClassUID.SegmentationStorage) loadDicomSeg(image, image.imageId);
            else if (image.data.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.EncapsulatedPDFStorage) parseDicomWithoutImage(image.data, image.imageId);
            else parseDicom(image, DICOM_obj.frames[0], viewportNum0);
            clearInterval(checkFrameLoadedInterval);
        }
    }, 200);
}

function setSopToViewport(Sop, viewportNum = viewportNumber, framesNumber) {
    if (Sop.constructor.name == "String") Sop = Patient.findSop(Sop);
    var element = GetViewport(viewportNum);

    if (element.div.enable == false || element.div.lockRender == true) return;

    var image = Sop.image, pixelData = Sop.pixelData;
    var MainCanvas = element.canvas, MarkCanvas = element.MarkCanvas;
    element.content.image = image;

    if (image.data.intString(Tag.NumberOfFrames) > 1) element.QRLevel = "frames";
    else element.QRLevel = "series";

    createDicomTagsList2Viewport(element);
    if (element.QRLevel == "frames") {
        if (framesNumber != undefined) {
            GetViewport(viewportNum).framesNumber = framesNumber;
            element.content.pixelData = Sop.frames[framesNumber];
        }
        else element.content.pixelData = getPatientbyImageID[element.content.image.imageId].pixelData;
    }
    else element.content.pixelData = Sop.pixelData;//QRLevel is "series"

    refleshCanvas(element);

    VIEWPORT.loadViewport(element, image, viewportNum);

    //改成無論是否曾出現在左側面板，都嘗試加到左側面板
    leftLayout.setImg2Left(new QRLv(image.data), image.data.string(Tag.PatientID));
    leftLayout.appendCanvasBySeries(element.tags.SeriesInstanceUID, image, pixelData);
    leftLayout.refleshMarkWithSeries(element.tags.SeriesInstanceUID);

    //渲染影像到viewport和原始影像
    // showTheImage(element, image, 'normal', ifNowSeries, viewportNum);
    // showTheImage(originelement, image, 'origin', null, viewportNum);

    //紀錄Window Level
    if (!element.windowCenter) element.windowCenter = image.windowCenter;
    if (!element.windowWidth) element.windowWidth = image.windowWidth;

    SetTable();

    GetViewport().div.style.backgroundColor = "rgb(10,6,6)";
    GetViewport().div.style.border = bordersize + "px #FFC3FF groove";

    //渲染上去後畫布應該從原始大小縮小為適當大小
    var HandW = getViewprtStretchSize(element.width, element.height, element.div);
    if (!element.scale && (image.width / HandW[0])) element.scale = (1.0 / (image.width / HandW[0]));

    MarkCanvas.width = MainCanvas.width;
    MarkCanvas.height = MainCanvas.height;

    MarkCanvas.getContext("2d").save();
    MainCanvas.style["zIndex"] = "6";
    MarkCanvas.style = MainCanvas.style.cssText;
    MarkCanvas.style["zIndex"] = "8";
    MarkCanvas.style["pointerEvents"] = "none";
    initNewCanvas();

    setTransform(viewportNum);

    if (openWindow == false && openZoom == false) openMouseTool = true;

    //顯示資訊到label
    DisplaySeriesCount(viewportNum);
    displayWindowLevel(viewportNum);
    //隱藏Table
    getByid("TableSelectNone").selected = true;

    displayMark(viewportNum);
    displayRuler(viewportNum);
    putLabel();
    displayAIM();
    displayAnnotation();
    displayAllRuler();

    element.refleshScrollBar();
    refleshGUI();
}

function parseDicom(image, pixelData, viewportNum = viewportNumber) {

    var element = GetViewport(viewportNum);
    if (element.enable == false || element.lockRender == true) return;
    var MarkCanvas = GetViewportMark(viewportNum);
    //原始影像，通常被用於放大鏡的參考

    if (image.data.intString(Tag.NumberOfFrames) > 1) element.QRLevel = "frames";
    else element.QRLevel = "series";

    //var PreviousSeriesInstanceUID = element.SeriesInstanceUID == undefined ? "undefined" : element.SeriesInstanceUID;

    element.content.image = image;
    element.content.pixelData = pixelData;
    //需要setimage到element
    createDicomTagsList2Viewport(element);

    refleshCanvas(element);

    //StudyUID:x0020000d,Series UID:x0020000e,SOP UID:x00080018,
    //Instance Number:x00200013,影像檔編碼資料:imageId,PatientId:x00100020

    VIEWPORT.loadViewport(element, image, viewportNum);

    //改成無論是否曾出現在左側面板，都嘗試加到左側面板
    leftLayout.setImg2Left(new QRLv(image.data), image.data.string(Tag.PatientID));
    leftLayout.appendCanvasBySeries(element.tags.SeriesInstanceUID, image, pixelData);
    leftLayout.refleshMarkWithSeries(element.tags.SeriesInstanceUID);

    //渲染影像到viewport和原始影像
    // showTheImage(element, image, 'normal', ifNowSeries, viewportNum);
    // showTheImage(originelement, image, 'origin', null, viewportNum);

    //紀錄Window Level
    if (!element.windowCenter) element.windowCenter = image.windowCenter;
    if (!element.windowWidth) element.windowWidth = image.windowWidth;

    //顯示資訊到label
    DisplaySeriesCount(viewportNum);
    displayWindowLevel(viewportNum);

    var MainCanvas = element.canvas;
    SetTable();

    element.div.style.backgroundColor = "rgb(10,6,6)";
    element.div.style.border = bordersize + "px #FFC3FF groove";

    //渲染上去後畫布應該從原始大小縮小為適當大小
    var HandW = getViewprtStretchSize(element.width, element.height, element.div);
    if (!element.scale && (image.width / HandW[0])) element.scale = (1.0 / (image.width / HandW[0]));

    MarkCanvas.width = MainCanvas.width, MarkCanvas.height = MainCanvas.height;

    MarkCanvas.getContext("2d").save();
    MainCanvas.style["zIndex"] = "6";
    MarkCanvas.style = MainCanvas.style.cssText;
    MarkCanvas.style["zIndex"] = "8";
    MarkCanvas.style["pointerEvents"] = "none";
    initNewCanvas();
    //BlueLight2//if (!(viewportNum0 >= 0)) displayWindowLevel();
    //BlueLight2//else displayWindowLevel(viewportNum);

    setTransform(viewportNum);

    if (openWindow == false && openZoom == false) openMouseTool = true;

    //隱藏Table
    getByid("TableSelectNone").selected = true;
    //刷新介面並顯示標記
    //BlueLight2//if (viewportNum0 >= 0) displayMark(viewportNum);
    //BlueLight2//else displayMark();
    displayMark(viewportNum);//BlueLight2//
    displayRuler(viewportNum);
    putLabel();
    displayAIM();
    displayAnnotation();
    displayAllRuler();

    //ScrollBar
    if (element.tags.NumberOfFrames && element.tags.NumberOfFrames > 0 && element.tags.framesNumber != undefined && element.tags.framesNumber != null) {
        element.ScrollBar.setTotal(parseInt(element.tags.NumberOfFrames));
        element.ScrollBar.setIndex(parseInt(element.tags.framesNumber));
        element.ScrollBar.reflesh();
    } else {
        var sopList = sortInstance(element.sop);
        element.ScrollBar.setTotal(sopList.length);
        element.ScrollBar.setIndex(sopList.findIndex((l) => l.InstanceNumber == element.tags.InstanceNumber));
        element.ScrollBar.reflesh();
    }
    refleshGUI();
}

function onlyLoadImage(imageId) {
    var dicomData = getPatientbyImageID[imageId];
    if (!dicomData) {
        try {
            cornerstone.loadImage(imageId, {
                usePDFJS: true
            }).then(function (image) {
                if (image.data.intString(Tag.NumberOfFrames) > 1) {//muti frame
                    loadDicomMultiFrame(image, image.imageId, viewportNum0);
                } else {
                    var DICOM_obj = {
                        study: image.data.string(Tag.StudyInstanceUID),
                        series: image.data.string(Tag.SeriesInstanceUID),
                        sop: image.data.string(Tag.SOPInstanceUID),
                        instance: image.data.string(Tag.InstanceNumber),
                        imageId: imageId,
                        image: image,
                        pixelData: image.getPixelData(),
                        patientId: image.data.string(Tag.PatientID)
                    };
                    loadUID(DICOM_obj);
                }
            }, function (err) { if (err.dataSet) parseDicomWithoutImage(err.dataSet, imageId); });
        } catch (err) { }
    }
}

//imageId:影像編碼資料，currX,currY:放大鏡座標，viewportNum0傳入的Viewport是第幾個
function loadAndViewImage(imageId, viewportNum = viewportNumber, framesNumber) {
    var dicomData = getPatientbyImageID[imageId];
    if (!dicomData) {
        try {
            cornerstone.loadImage(imageId, {
                usePDFJS: true
            }).then(function (image) {
                resetViewport();
                if (image.data.intString(Tag.NumberOfFrames) > 1) {//muti frame
                    loadDicomMultiFrame(image, image.imageId, viewportNum);
                } else {
                    var DICOM_obj = {
                        study: image.data.string(Tag.StudyInstanceUID),
                        series: image.data.string(Tag.SeriesInstanceUID),
                        sop: image.data.string(Tag.SOPInstanceUID),
                        instance: image.data.string(Tag.InstanceNumber),
                        imageId: imageId,
                        image: image,
                        pixelData: image.getPixelData(),
                        patientId: image.data.string(Tag.PatientID)
                    };
                    loadUID(DICOM_obj);
                    if (image.data.string(Tag.SOPClassUID) == SOPClassUID.SegmentationStorage) loadDicomSeg(image, DICOM_obj.imageId);
                    else if (image.data.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.EncapsulatedPDFStorage) parseDicomWithoutImage(image.data, DICOM_obj.imageId);
                    else parseDicom(image, DICOM_obj.pixelData, viewportNum);
                }
            },
                function (err) { if (err.dataSet) parseDicomWithoutImage(err.dataSet, imageId); });
        } catch (err) { }
    }
    else {
        if (framesNumber != undefined) {
            GetViewport(viewportNum).framesNumber = framesNumber;
            if (dicomData.image.data.string(Tag.SOPClassUID) == SOPClassUID.SegmentationStorage) loadDicomSeg(dicomData.image, dicomData.image.imageId);
            else if (dicomData.image.data.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.EncapsulatedPDFStorage) parseDicomWithoutImage(dicomData.image.data, dicomData.image.imageId);
            else parseDicom(dicomData.image, dicomData.frames[framesNumber], viewportNum);
        }
        else {
            if (dicomData.image.data.string(Tag.SOPClassUID) == SOPClassUID.SegmentationStorage) loadDicomSeg(dicomData.image, dicomData.image.imageId);
            else if (dicomData.image.data.string(Tag.MediaStorageSOPClassUID) == SOPClassUID.EncapsulatedPDFStorage) parseDicomWithoutImage(dicomData.image.data, dicomData.image.imageId);
            else parseDicom(dicomData.image, dicomData.pixelData, viewportNum);
        }
    }
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
