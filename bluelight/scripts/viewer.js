
let VIEWPORT = {};
VIEWPORT.fixRow = null;
VIEWPORT.fixCol = null;
VIEWPORT.delPDFView = function (viewport) {
    if (viewport.div && viewport.div.PDFView) {
        viewport.div.removeChild(viewport.div.PDFView);
        viewport.div.PDFView = undefined;
    }
}

VIEWPORT.initPixelSpacing = function (viewport) {
    if (viewport.tags.PixelSpacing) {
        viewport.transform.PixelSpacingX = 1.0 / parseFloat(viewport.tags.PixelSpacing.split("\\")[0]);
        viewport.transform.PixelSpacingY = 1.0 / parseFloat(viewport.tags.PixelSpacing.split("\\")[1]);
    } else {
        viewport.transform.PixelSpacingX = viewport.transform.PixelSpacingY = 1.0;
    }
}

VIEWPORT.initImageOrientation = function (viewport) {
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
}

VIEWPORT.initImagePosition = function (viewport) {
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
    var date = element.StudyDate;
    var time = element.StudyTime;
    date = ("" + date).replace(/^(\d{4})(\d\d)(\d\d)$/, '$1/$2/$3');
    time = ("" + time).replace(/^(\d{2})(\d\d)(\d\d)/, '$1:$2:$3');
    date = date + " " + time.substr(0, 8);
    //清空label的數值
    label_LT.innerHTML = label_RT.innerHTML = "";
    //依照dicom tags設定檔載入影像
    function htmlEntities(str) {
        str = Null2Empty(str);
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace("\r\n", "<br/>").replace("\n", "<br/>");
    }
    for (var i = 0; i < DicomTags.LT.name.length; i++)
        label_LT.innerHTML += "" + DicomTags.LT.name[i] + " " + htmlEntities(image.data.string("x" + DicomTags.LT.tag[i])) + "<br/>";
    for (var i = 0; i < DicomTags.RT.name.length; i++) {
        //避免PatientName出現中文亂碼
        if ("x" + DicomTags.RT.tag[i] == 'x00100010') {
            var dataSet = image.data;
            var data = new Uint8Array(dataSet.byteArray.buffer, dataSet.elements['x00100010'].dataOffset, dataSet.elements['x00100010'].length);
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
VIEWPORT.loadViewportList = ['initImagePosition', 'initPixelSpacing', 'initImageOrientation', 'putLabel2Element', 'delPDFView'];

//VIEWPORT.lockViewportList = [];

/*
initImagePosition(element);
initPixelSpacing(element);//載入Pixel Spacing
initImageOrientation(element);//載入image Orientation
putLabel2Element(element, image, viewportNum);//putLabel
*/

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
                    //console.log(resBlob[i]);
                    string += String.fromCodePoint(intArray[i]);
                }

                //console.log(bops.to(resBlob, encoding="binary"))
                //let item = await resBlob.text();
                var url = await stowMultipartRelated(string);
                if (onlyload == true) onlyLoadImage("wadouri:" + url);
                else loadAndViewImage("wadouri:" + url);
            })
            .catch(function (err) {
                //console.log(err);
            })
    }
    async function stowMultipartRelated(iData) {
        //console.log(iData);

        //req.body= req.body.toString('binary');
        let multipartMessage = iData;
        //let boundary = req.headers["content-type"].split("boundary=")[1];
        let startBoundary = multipartMessage.split("\r\n")[0];
        //let startBoundary = `--${boundary}`;
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
        let contentDispositionList = [];
        let contentTypeList = [];
        for (let i in data) {
            let text = data[i];
            if (text.includes("Content-Disposition")) {
                contentDispositionList.push(text);
                let textSplitFileName = text.split("filename=")
                filename.push(textSplitFileName[textSplitFileName.length - 1].replace(/"/gm, ""));
            } else if (text.includes("Content-Type")) {
                contentTypeList.push(text);
            }
        }
        contentDispositionList = _.uniq(contentDispositionList);
        contentTypeList = _.uniq(contentTypeList);
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
            // //+4
        }
        let maxIndex = _.maxBy(matchesIndex, "index");
        fileStartIndex.push(maxIndex.index + maxIndex.length + 3);
        //console.log(fileStartIndex);
        for (let i in fileEndIndex) {
            let fileData = multipartMessage.substring(fileStartIndex[i], fileEndIndex[i]);
            //console.log(fileData);
            files.push(fileData);
        }
        //console.log("Upload Files complete");
        function str2ab(str) {
            var buf = new ArrayBuffer(str.length); // 2 bytes for each char
            var bufView = new Uint8Array(buf);
            for (var i = 0, strLen = str.length; i < strLen; i++) {
                bufView[i] = str.charCodeAt(i);
            }
            return buf;
        }
        let buf = str2ab(files[0]);
        //console.log(buf);
        var a = document.createElement("a"),
            url = URL.createObjectURL(new Blob([buf], { type: "application/dicom" }));
        return url;
        /*
        a.href = url;
        a.download = "test";
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);

        return { files: files, filename: filename };*/
    }
    return getData();
}

function displayPDF(pdf) {
    getClass("DicomCanvas")[viewportNumber].width = getClass("DicomCanvas")[viewportNumber].height = 1;
    GetViewportMark().width = GetViewportMark().height = 1;
    var element = GetViewport();
    var NewElement = GetNewViewport();
    for (var tag in element.DicomTagsList) element[element.DicomTagsList[tag][1]] = undefined;
    //element.image Width = element.image Height = 
    element.newMousePointX = element.newMousePointY = NewElement.rotate = element.NowCanvasSizeWidth = element.NowCanvasSizeHeight =
        NewElement.windowCenter = NewElement.windowWidth = NewElement.sop = undefined;

    VIEWPORT.delPDFView(element);
    var iFrame = document.createElement("iframe");
    iFrame.className = "PDFView";
    iFrame.id = "PDFView_" + viewportNumber;
    iFrame.src = pdf;
    iFrame.style.width = iFrame.style.height = "100%";
    iFrame.style.left = "0px";
    iFrame.style.position = "absolute";
    element.appendChild(iFrame);
    element.PDFView = iFrame;

    getClass("labelWC")[viewportNumber].style.display = "none";
    getClass("labelLT")[viewportNumber].style.display = "none";
    getClass("labelRT")[viewportNumber].style.display = "none";
    getClass("labelRB")[viewportNumber].style.display = "none";
    getClass("labelWC")[viewportNumber].style.display = "none";
    getClass("labelXY")[viewportNumber].style.display = "none";
    getClass("leftRule")[viewportNumber].style.display = "none";
    getClass("downRule")[viewportNumber].style.display = "none";
}

function parseDicomWithoutImage(dataSet, imageId) {
    //目前僅限於pdf的情況
    if (dataSet.string("x00020002") == '1.2.840.10008.5.1.4.1.1.104.1') {
        var fileTag = dataSet.elements.x00420011;
        var pdfByteArray = dataSet.byteArray.slice(fileTag.dataOffset, fileTag.dataOffset + fileTag.length);
        var pdfObj = new Blob([pdfByteArray], { type: 'application/pdf' });
        var pdf = URL.createObjectURL(pdfObj);

        var DICOM_obj = {
            study: dataSet.string('x0020000d'),
            series: dataSet.string('x0020000e'),
            sop: dataSet.string('x00080018'),
            instance: dataSet.string('x00200013'),
            imageId: imageId,
            image: null,
            pdf: pdf,
            pixelData: null,
            patientId: dataSet.string('x00100020')
        };
        loadUID(DICOM_obj);

        var checkleftCanvas = -1;
        //如果有，checkleftCanvas就指向該series
        for (var checkSeries in leftCanvasStudy) {
            if (leftCanvasStudy[checkSeries] == dataSet.string('x0020000e')) {
                checkleftCanvas = checkSeries;
            }
        }

        //改成無論是否曾出現在左側面板，都嘗試加到左側面板
        leftLayout.setImg2Left(new QRLv(dataSet), "patientID:" + securePassword(0, 99999, 1));

        dicomImageCount += 1;
        displayPDF(pdf);
    }
}

function loadDicomMultiFrame(image, imageId, viewportNum0) {
    var dataSet = image.data;
    var Size = image.width * image.height;
    var pixelData;
    var BitsAllocated = image.data.int16('x00280100');

    if (BitsAllocated == 16) pixelData = new Int16Array(dataSet.byteArray.buffer, dataSet.elements.x7fe00010.dataOffset, dataSet.elements.x7fe00010.length / 2);
    else if (BitsAllocated == 32) pixelData = new Int32Array(dataSet.byteArray.buffer, dataSet.elements.x7fe00010.dataOffset, dataSet.elements.x7fe00010.length / 4);
    else if (BitsAllocated == 8) pixelData = new Int8Array(dataSet.byteArray.buffer, dataSet.elements.x7fe00010.dataOffset, dataSet.elements.x7fe00010.length / 1);
    else pixelData = new Int16Array(dataSet.byteArray.buffer, dataSet.elements.x7fe00010.dataOffset, dataSet.elements.x7fe00010.length / 2);
    if (!pixelData) return;

    let frames = [];
    let totalFrames = image.data.intString('x00280008');

    for (let i = 0; i < totalFrames; i++) {
        let imageFrameId = `${imageId}?frame=${i}`;
        cornerstone.loadImage(imageFrameId).then((img) => {
            frames.push(img.getPixelData());
        });
    }

    let checkFrameLoadedInterval = setInterval(() => {
        if (frames.length === totalFrames) {
            let DICOM_obj = {
                study: image.data.string('x0020000d'),
                series: image.data.string('x0020000e'),
                sop: image.data.string('x00080018'),
                instance: image.data.string('x00200013'),
                imageId: imageId,
                image: image,
                pixelData: frames[0],//pixelData.slice(0, Size),
                frames: frames,
                patientId: image.data.string('x00100020')
            };

            loadUID(DICOM_obj);
            GetViewport(viewportNum0).framesNumber = 0;

            if (image.data.string('x00080016') == '1.2.840.10008.5.1.4.1.1.66.4') loadDicomSeg(image, image.imageId);
            else if (image.data.string("x00020002") == '1.2.840.10008.5.1.4.1.1.104.1') parseDicomWithoutImage(image.data, image.imageId);
            else parseDicom(image, DICOM_obj.frames[0], viewportNum0);
            clearInterval(checkFrameLoadedInterval);
        }
    }, 200);
}

function setSopToViewport(Sop, viewportNum = viewportNumber, framesNumber) {
    if (Sop.constructor.name == "String") Sop = Patient.findSop(Sop);
    var NewElement = GetNewViewport(viewportNum);

    if (NewElement.div.enable == false || NewElement.div.lockRender == true) return;

    var image = Sop.image, pixelData = Sop.pixelData;
    var MainCanvas = NewElement.canvas, MarkCanvas = NewElement.MarkCanvas;
    NewElement.content.image = image;

    if (image.data.intString("x00280008") > 1) NewElement.QRLevel = "frames";
    else NewElement.QRLevel = "series";

    createDicomTagsList2Viewport(NewElement);
    if (NewElement.QRLevel == "frames") {
        if (framesNumber != undefined) {
            GetViewport(viewportNum).framesNumber = framesNumber;
            NewElement.content.pixelData = Sop.frames[framesNumber];
        }
        else NewElement.content.pixelData = getPatientbyImageID[NewElement.content.image.imageId].pixelData;
    }
    else NewElement.content.pixelData = Sop.pixelData;//QRLevel is "series"

    refleshCanvas(NewElement);

    VIEWPORT.loadViewport(NewElement, image, viewportNum);

    //改成無論是否曾出現在左側面板，都嘗試加到左側面板
    leftLayout.setImg2Left(new QRLv(image.data), image.data.string('x00100020'));
    leftLayout.appendCanvasBySeries(NewElement.tags.SeriesInstanceUID, image, pixelData);
    leftLayout.refleshMarkWithSeries(NewElement.tags.SeriesInstanceUID);

    var HandW = getStretchSize(NewElement.width, NewElement.height, NewElement.div);
    NewElement.div.style = "position:block;left:100px;width:" + NewElement.width + "px;height:" + NewElement.height + "px;overflow:hidden;border:" + bordersize + "px #D3D9FF groove;";
    NewElement.div.study = NewElement.tags.StudyInstanceUID;
    NewElement.div.series = NewElement.tags.SeriesInstanceUID;
    NewElement.div.sop = NewElement.tags.SOPInstanceUID;

    //渲染影像到viewport和原始影像
    // showTheImage(element, image, 'normal', ifNowSeries, viewportNum);
    // showTheImage(originelement, image, 'origin', null, viewportNum);

    //紀錄Window Level
    if (!NewElement.windowCenter) NewElement.windowCenter = image.windowCenter;
    if (!NewElement.windowWidth) NewElement.windowWidth = image.windowWidth;

    SetTable();

    GetViewport().style.backgroundColor = "rgb(10,6,6)";
    GetViewport().style.border = bordersize + "px #FFC3FF groove";

    //渲染上去後畫布應該從原始大小縮小為適當大小
    var HandW = getViewprtStretchSize(NewElement.width, NewElement.height, NewElement.div);
    MainCanvas.style = "width:" + HandW[0] + "px;height:" + HandW[1] + "px;display:block;position:absolute;top:50%;left:50%";
    MainCanvas.style.margin = "-" + (HandW[1] / 2) + "px 0 0 -" + (HandW[0] / 2) + "px";

    MarkCanvas.width = MainCanvas.width;
    MarkCanvas.height = MainCanvas.height;

    MarkCanvas.getContext("2d").save();
    Css(MainCanvas, 'zIndex', "6");
    MarkCanvas.style = MainCanvas.style.cssText;
    Css(MarkCanvas, 'zIndex', "8");
    Css(MarkCanvas, 'pointerEvents', "none");
    /*BlueLight2//if (!(viewportNum0 >= 0))*/initNewCanvas(MainCanvas);
    dicomImageCount += 1;

    // if (!(viewportNum0 >= 0)) { --*
    if (!(isNaN(NewElement.div.NowCanvasSizeHeight) || isNaN(NewElement.div.NowCanvasSizeWidth))) {
        Css(MainCanvas, 'width', Fpx(NewElement.div.NowCanvasSizeWidth));
        Css(MainCanvas, 'height', Fpx(NewElement.div.NowCanvasSizeHeight));
        Css(MarkCanvas, 'width', Fpx(NewElement.div.NowCanvasSizeWidth));
        Css(MarkCanvas, 'height', Fpx(NewElement.div.NowCanvasSizeHeight));
    }
    setTransform(viewportNum);

    if (openWindow == false && openZoom == false) openMouseTool = true;

    //顯示資訊到label
    DisplaySeriesCount(viewportNum);
    //隱藏Table
    getByid("TableSelectNone").selected = true;

    displayMark(viewportNum);
    displayRuler(viewportNum);
    putLabel();
    displayAIM();
    displayAnnotation();
    displayAllRuler();

    //ScrollBar
    if (NewElement.tags.NumberOfFrames && NewElement.tags.NumberOfFrames > 0 && NewElement.tags.framesNumber != undefined && NewElement.tags.framesNumber != null) {
        NewElement.div.ScrollBar.setTotal(parseInt(NewElement.tags.NumberOfFrames));
        NewElement.div.ScrollBar.setIndex(parseInt(NewElement.tags.framesNumber));
        NewElement.div.ScrollBar.reflesh();
    } else {
        var sopList = sortInstance(NewElement.sop);
        NewElement.div.ScrollBar.setTotal(sopList.length);
        NewElement.div.ScrollBar.setIndex(sopList.findIndex((l) => l.InstanceNumber == NewElement.tags.InstanceNumber));
        NewElement.div.ScrollBar.reflesh();
    }
}

function parseDicom(image, pixelData, viewportNum = viewportNumber) {
    //var viewportNum = viewportNum0 >= 0 ? viewportNum0 : viewportNumber;
    //if (VIEWPORT.lockViewportList && VIEWPORT.lockViewportList.includes(viewportNum)) return;

    var element = GetViewport(viewportNum);
    var NewElement = GetNewViewport(viewportNum);
    if (element.enable == false || element.lockRender == true) return;
    var MarkCanvas = GetViewportMark(viewportNum);
    //原始影像，通常被用於放大鏡的參考

    if (image.data.intString("x00280008") > 1) NewElement.QRLevel = "frames";
    else NewElement.QRLevel = "series";

    //var PreviousSeriesInstanceUID = element.SeriesInstanceUID == undefined ? "undefined" : element.SeriesInstanceUID;

    NewElement.content.image = image;
    NewElement.content.pixelData = pixelData;
    //需要setimage到NewElement
    createDicomTagsList2Viewport(NewElement);

    refleshCanvas(NewElement);

    //StudyUID:x0020000d,Series UID:x0020000e,SOP UID:x00080018,
    //Instance Number:x00200013,影像檔編碼資料:imageId,PatientId:x00100020



    VIEWPORT.loadViewport(NewElement, image, viewportNum);
    /*//載入image Position
    initImagePosition(element);
    //載入Pixel Spacing
    initPixelSpacing(element);
    //載入image Orientation
    initImageOrientation(element);
    //putLabel
    putLabel2Element(element, image, viewportNum);*/
    //載入影像的原始長寬
    //*BlueLight2*/element.image Width = image.width;
    //*BlueLight2*/element.image Height = image.height;

    //如果現在載入的這張跟上次載入的不一樣
    //bluelight2註解
    /*if (!(PreviousSeriesInstanceUID == element.SeriesInstanceUID && element.windowWidthList != 0) || WindowOpen == false) {
        element.windowCenterList = image.windowCenter;
        element.windowWidthList = image.windowWidth;
    }

    if (PreviousSeriesInstanceUID != element.SeriesInstanceUID) {
        //重置滑鼠座標
        element.newMousePointX = element.newMousePointY = element.rotateValue = 0;
        PreviousSeriesInstanceUID = element.SeriesInstanceUID;
        //重置縮放大小
        element.NowCanvasSizeWidth = element.NowCanvasSizeHeight = null;
    } else { //如果一樣
        if (element.newMousePointX == null) element.newMousePointX = element.newMousePointY = 0;
    }*/


    //BlueLight2
    //表示目前的影像在左側的面板是否已經有了
    /*var checkleftCanvas = -1;
    //如果有，checkleftCanvas就指向該series
    for (var checkSeries in leftCanvasStudy) {
        if (leftCanvasStudy[checkSeries] == image.data.string('x0020000e')) {
            checkleftCanvas = checkSeries;
        }
    }*/

    //改成無論是否曾出現在左側面板，都嘗試加到左側面板
    leftLayout.setImg2Left(new QRLv(image.data), image.data.string('x00100020'));
    leftLayout.appendCanvasBySeries(NewElement.tags.SeriesInstanceUID, image, pixelData);
    leftLayout.refleshMarkWithSeries(NewElement.tags.SeriesInstanceUID);

    //顯示資訊到label
    DisplaySeriesCount(viewportNum);
    var HandW = getStretchSize(NewElement.width, NewElement.height, NewElement.div);
    element.style = "position:block;left:100px;width:" + NewElement.width + "px;height:" + NewElement.height + "px;overflow:hidden;border:" + bordersize + "px #D3D9FF groove;";
    element.study = NewElement.tags.StudyInstanceUID;
    element.series = NewElement.tags.SeriesInstanceUID;
    element.sop = NewElement.tags.SOPInstanceUID;

    //渲染影像到viewport和原始影像
    // showTheImage(element, image, 'normal', ifNowSeries, viewportNum);
    // showTheImage(originelement, image, 'origin', null, viewportNum);

    //紀錄Window Level
    if (!NewElement.windowCenter) NewElement.windowCenter = image.windowCenter;
    if (!NewElement.windowWidth) NewElement.windowWidth = image.windowWidth;

    var MainCanvas = element.canvas();
    SetTable();

    GetViewport().style.backgroundColor = "rgb(10,6,6)";
    GetViewport().style.border = bordersize + "px #FFC3FF groove";

    //渲染上去後畫布應該從原始大小縮小為適當大小
    var HandW = getViewprtStretchSize(NewElement.width, NewElement.height, element);
    MainCanvas.style = "width:" + HandW[0] + "px;height:" + HandW[1] + "px;display:block;position:absolute;top:50%;left:50%";
    MainCanvas.style.margin = "-" + (HandW[1] / 2) + "px 0 0 -" + (HandW[0] / 2) + "px";

    MarkCanvas.width = MainCanvas.width;
    MarkCanvas.height = MainCanvas.height;

    MarkCanvas.getContext("2d").save();
    Css(MainCanvas, 'zIndex', "6");
    MarkCanvas.style = MainCanvas.style.cssText;
    Css(MarkCanvas, 'zIndex', "8");
    Css(MarkCanvas, 'pointerEvents', "none");
    /*BlueLight2//if (!(viewportNum0 >= 0))*/initNewCanvas(MainCanvas);
    dicomImageCount += 1;
    //BlueLight2//if (!(viewportNum0 >= 0)) displayWindowLevel();
    //BlueLight2//else displayWindowLevel(viewportNum);

    // if (!(viewportNum0 >= 0)) { --*
    if (!(isNaN(element.NowCanvasSizeHeight) || isNaN(element.NowCanvasSizeWidth))) {
        Css(MainCanvas, 'width', Fpx(element.NowCanvasSizeWidth));
        Css(MainCanvas, 'height', Fpx(element.NowCanvasSizeHeight));
        Css(MarkCanvas, 'width', Fpx(element.NowCanvasSizeWidth));
        Css(MarkCanvas, 'height', Fpx(element.NowCanvasSizeHeight));
    }
    setTransform(viewportNum);
    //Css(MainCanvas, 'transform', "translate(" + ToPx(element.newMousePointX) + "," + ToPx(element.newMousePointY) + ")rotate(" + element.rotateValue + "deg)");
    //Css(MarkCanvas, 'transform', "translate(" + ToPx(element.newMousePointX) + "," + ToPx(element.newMousePointY) + ")rotate(" + element.rotateValue + "deg)");

    if (openWindow == false && openZoom == false) openMouseTool = true;
    //openChangeFile = true;

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
    if (NewElement.tags.NumberOfFrames && NewElement.tags.NumberOfFrames > 0 && NewElement.tags.framesNumber != undefined && NewElement.tags.framesNumber != null) {
        NewElement.div.ScrollBar.setTotal(parseInt(NewElement.tags.NumberOfFrames));
        NewElement.div.ScrollBar.setIndex(parseInt(NewElement.tags.framesNumber));
        NewElement.div.ScrollBar.reflesh();
    } else {
        var sopList = sortInstance(NewElement.sop);
        NewElement.div.ScrollBar.setTotal(sopList.length);
        NewElement.div.ScrollBar.setIndex(sopList.findIndex((l) => l.InstanceNumber == NewElement.tags.InstanceNumber));
        NewElement.div.ScrollBar.reflesh();
    }
}

function onlyLoadImage(imageId) {
    var dicomData = getPatientbyImageID[imageId];
    if (!dicomData) {
        try {
            cornerstone.loadImage(imageId, {
                usePDFJS: true
            }).then(function (image) {
                if (image.data.intString("x00280008") > 1) {//muti frame
                    loadDicomMultiFrame(image, image.imageId, viewportNum0);
                } else {
                    var DICOM_obj = {
                        study: image.data.string('x0020000d'),
                        series: image.data.string('x0020000e'),
                        sop: image.data.string('x00080018'),
                        instance: image.data.string('x00200013'),
                        imageId: imageId,
                        image: image,
                        pixelData: image.getPixelData(),
                        patientId: image.data.string('x00100020')
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

                if (image.data.intString("x00280008") > 1) {//muti frame
                    loadDicomMultiFrame(image, image.imageId, viewportNum);
                } else {
                    var DICOM_obj = {
                        study: image.data.string('x0020000d'),
                        series: image.data.string('x0020000e'),
                        sop: image.data.string('x00080018'),
                        instance: image.data.string('x00200013'),
                        imageId: imageId,
                        image: image,
                        pixelData: image.getPixelData(),
                        patientId: image.data.string('x00100020')
                    };
                    loadUID(DICOM_obj);
                    if (image.data.string('x00080016') == '1.2.840.10008.5.1.4.1.1.66.4') loadDicomSeg(image, DICOM_obj.imageId);
                    else if (image.data.string("x00020002") == '1.2.840.10008.5.1.4.1.1.104.1') parseDicomWithoutImage(image.data, DICOM_obj.imageId);
                    else parseDicom(image, DICOM_obj.pixelData, viewportNum);
                }
            },
                function (err) { if (err.dataSet) parseDicomWithoutImage(err.dataSet, imageId); });
        } catch (err) { }
    }
    else {
        if (framesNumber != undefined) {
            GetViewport(viewportNum).framesNumber = framesNumber;
            if (dicomData.image.data.string('x00080016') == '1.2.840.10008.5.1.4.1.1.66.4') loadDicomSeg(dicomData.image, dicomData.image.imageId);
            else if (dicomData.image.data.string("x00020002") == '1.2.840.10008.5.1.4.1.1.104.1') parseDicomWithoutImage(dicomData.image.data, dicomData.image.imageId);
            else parseDicom(dicomData.image, dicomData.frames[framesNumber], viewportNum);
        }
        else {
            if (dicomData.image.data.string('x00080016') == '1.2.840.10008.5.1.4.1.1.66.4') loadDicomSeg(dicomData.image, dicomData.image.imageId);
            else if (dicomData.image.data.string("x00020002") == '1.2.840.10008.5.1.4.1.1.104.1') parseDicomWithoutImage(dicomData.image.data, dicomData.image.imageId);
            else parseDicom(dicomData.image, dicomData.pixelData, viewportNum);
        }
    }
}

function initNewCanvas(newCanvas) {
    //初始化Canvas，添加事件
    var canvas = newCanvas;
    var ctx = canvas.getContext("2d");
    var viewportNumber2 = (viewportNumber + 1);
    if (viewportNumber2 > 3) viewportNumber2 = 0
    try {
        for (var i = 0; i < Viewport_Total; i++) {
            GetNewViewport(i).div.removeEventListener("contextmenu", contextmenuF, false);
            GetNewViewport(i).div.removeEventListener("mousemove", Mousemove, false);
            GetNewViewport(i).div.removeEventListener("mousedown", Mousedown, false);
            GetNewViewport(i).div.removeEventListener("mouseup", Mouseup, false);
            GetNewViewport(i).div.removeEventListener("mouseout", Mouseout, false);
            GetNewViewport(i).div.removeEventListener("wheel", Wheel, false);
            GetNewViewport(i).div.removeEventListener("mousedown", thisF, false);
            GetNewViewport(i).div.removeEventListener("touchstart", touchstartF, false);
            GetNewViewport(i).div.removeEventListener("touchend", touchendF, false);
            GetNewViewport(i).div.addEventListener("touchstart", thisF, false);
            GetNewViewport(i).div.addEventListener("mousedown", thisF, false);
            GetNewViewport(i).div.addEventListener("wheel", Wheel, false);
        }
        GetNewViewport().div.removeEventListener("touchstart", thisF, false);
        GetNewViewport().div.removeEventListener("mousedown", thisF, false);
        GetNewViewport().div.addEventListener("contextmenu", contextmenuF, false);
        GetNewViewport().div.addEventListener("mousemove", Mousemove, false);
        GetNewViewport().div.addEventListener("mousedown", Mousedown, false);
        GetNewViewport().div.addEventListener("mouseup", Mouseup, false);
        GetNewViewport().div.addEventListener("mouseout", Mouseout, false);
        GetNewViewport().div.addEventListener("touchstart", touchstartF, false);
        GetNewViewport().div.addEventListener("touchmove", touchmoveF, false);
        GetNewViewport().div.addEventListener("touchend", touchendF, false);
    } catch (ex) { console.log(ex); }
    //GetNewViewport().div.addEventListener("wheel", wheelF, false); --*
}

//按下滑鼠或觸控要做的事情 --*
function DivDraw(e) {
    //if (MouseDownCheck == false) getByid("MeasureLabel").style.display = "none";
    if (openZoom == false && openMeasure == false && MouseDownCheck == false && openAngle == 0) return;
    //magnifierDiv.style.display="none";
    // x_out = -magnifierWidth / 2; // 與游標座標之水平距離
    // y_out = -magnifierHeight / 2; // 與游標座標之垂直距離
    x_out = -parseInt(magnifierCanvas.style.width) / 2; // 與游標座標之水平距離
    y_out = -parseInt(magnifierCanvas.style.height) / 2; // 與游標座標之垂直距離

    /*if (openMeasure && (MouseDownCheck == true || TouchDownCheck == true)) {
        getByid("MeasureLabel").style.display = '';
        if (MeasureXY2[0] > MeasureXY[0])
            x_out = 20; // 與游標座標之水平距離
        else x_out = -20;
        if (MeasureXY2[1] > MeasureXY[1])
            y_out = 20; // 與游標座標之水平距離
        else y_out = -20;
    }*/
    if (openAngle >= 2) {
        getByid("AngleLabel").style.display = '';
        if (AngleXY2[0] > AngleXY0[0])
            x_out = 20; // 與游標座標之水平距離
        else x_out = -20;
        if (AngleXY2[1] > AngleXY0[1])
            y_out = 20; // 與游標座標之水平距離
        else y_out = -20;
    } else {
        getByid("AngleLabel").style.display = 'none';
    }

    if (document.body.scrollTop && document.body.scrollTop != 0) {
        dbst = document.body.scrollTop;
        dbsl = document.body.scrollLeft;
    } else {
        dbst = document.getElementsByTagName("html")[0].scrollTop;
        dbsl = document.getElementsByTagName("html")[0].scrollLeft;
    }
    if (openZoom)
        dgs = document.getElementById("magnifierDiv").style;
    else if (openMeasure)
        dgs = document.getElementById("MeasureLabel").style;
    else /* if (openAngle==2)*/
        dgs = document.getElementById("AngleLabel").style;
    y = e.clientY;
    x = e.clientX;
    if (!y || !x) {
        y = e.touches[0].clientY;
        x = e.touches[0].clientX;
    }
    if (MouseDownCheck == true || TouchDownCheck == true || openAngle == 2) {
        dgs.top = y + dbst + y_out + "px";
        dgs.left = x + dbsl + x_out + "px";
    }
    if (openMeasure) {
        /*getByid("MeasureLabel").innerText = parseInt(Math.sqrt(
            Math.pow(MeasureXY2[0] / GetNewViewport().transform.PixelSpacingX - MeasureXY[0] / GetNewViewport().transform.PixelSpacingX, 2) +
            Math.pow(MeasureXY2[1] / GetNewViewport().transform.PixelSpacingY - MeasureXY[1] / GetNewViewport().transform.PixelSpacingY, 2), 2)) +
            "mm";*/
    } else if (openAngle == 2) {
        var getAngle = ({
            x: x1,
            y: y1
        }, {
            x: x2,
            y: y2
        }) => {
            const dot = x1 * x2 + y1 * y2
            const det = x1 * y2 - y1 * x2
            const angle = Math.atan2(det, dot) / Math.PI * 180
            return (angle + 360) % 360
        }
        var angle1 = getAngle({
            x: AngleXY0[0] - AngleXY2[0],
            y: AngleXY0[1] - AngleXY2[1],
        }, {
            x: AngleXY0[0] - AngleXY1[0],
            y: AngleXY0[1] - AngleXY1[1],
        });
        if (angle1 > 180) angle1 = 360 - angle1;
        getByid("AngleLabel").innerText = parseInt(angle1) + "°";
    }
    if (parseInt(getByid("MeasureLabel").innerText) <= 1) getByid("MeasureLabel").style.display = "none";
}
