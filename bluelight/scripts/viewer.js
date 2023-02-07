
let VIEWPORT = {};
VIEWPORT.fixRow = null;
VIEWPORT.fixCol = null;
VIEWPORT.initPixelSpacing = function (viewport) {
    if (viewport.PixelSpacing) {
        viewport.PixelSpacingX = 1.0 / parseFloat(viewport.PixelSpacing.split("\\")[0]);
        viewport.PixelSpacingY = 1.0 / parseFloat(viewport.PixelSpacing.split("\\")[1]);
    } else {
        viewport.PixelSpacingX = viewport.PixelSpacingY = 1.0;
    }
}

VIEWPORT.initImageOrientation = function (viewport) {
    if (viewport.ImageOrientationPatient) {
        viewport.imageOrientationX = viewport.ImageOrientationPatient.split("\\")[0];
        viewport.imageOrientationY = viewport.ImageOrientationPatient.split("\\")[1];
        viewport.imageOrientationZ = viewport.ImageOrientationPatient.split("\\")[2];
        viewport.imageOrientationX2 = viewport.ImageOrientationPatient.split("\\")[3];
        viewport.imageOrientationY2 = viewport.ImageOrientationPatient.split("\\")[4];
        viewport.imageOrientationZ2 = viewport.ImageOrientationPatient.split("\\")[5];
    } else {
        viewport.imageOrientationX = viewport.imageOrientationY = viewport.imageOrientationZ = 0;
        viewport.imageOrientationX2 = viewport.imageOrientationY2 = viewport.imageOrientationZ2 = 0;
    }
}

VIEWPORT.initImagePosition = function (viewport) {
    if (viewport.ImagePositionPatient) {
        viewport.imagePositionX = parseFloat(viewport.ImagePositionPatient.split("\\")[0]);
        viewport.imagePositionY = parseFloat(viewport.ImagePositionPatient.split("\\")[1]);
        viewport.imagePositionZ = parseFloat(viewport.ImagePositionPatient.split("\\")[2]);
    } else {
        viewport.imagePositionX = viewport.imagePositionY = viewport.imagePositionZ = 0;
    }
}

VIEWPORT.putLabel2Element = function (element, image, viewportNum) {
    labelLT = getClass("labelLT");
    labelRT = getClass("labelRT");
    labelRB = getClass("labelRB");
    var date = element.StudyDate;
    var time = element.StudyTime;
    date = ("" + date).replace(/^(\d{4})(\d\d)(\d\d)$/, '$1/$2/$3');
    time = ("" + time).replace(/^(\d{2})(\d\d)(\d\d)/, '$1:$2:$3');
    date = date + " " + time.substr(0, 8);
    //清空label的數值
    labelLT[viewportNum].innerHTML = labelRT[viewportNum].innerHTML = "";
    //依照dicom tags設定檔載入影像
    function htmlEntities(str) {
        str = Null2Empty(str);
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace("\r\n", "<br/>").replace("\n", "<br/>");
    }
    for (var i = 0; i < DicomTags.LT.name.length; i++)
        labelLT[viewportNum].innerHTML += "" + DicomTags.LT.name[i] + " " + htmlEntities(image.data.string("x" + DicomTags.LT.tag[i])) + "<br/>";
    for (var i = 0; i < DicomTags.RT.name.length; i++)
        labelRT[viewportNum].innerHTML += "" + DicomTags.RT.name[i] + " " + htmlEntities(image.data.string("x" + DicomTags.RT.tag[i])) + "<br/>";
}

VIEWPORT.loadViewport = function (element, image, viewportNum) {
    for (var i = 0; i < VIEWPORT.loadViewportList.length; i++) {
        VIEWPORT[VIEWPORT.loadViewportList[i]](element, image, viewportNum);
    }
}
VIEWPORT.loadViewportList = ['initImagePosition', 'initPixelSpacing', 'initImageOrientation', 'putLabel2Element'];

VIEWPORT.lockViewportList = [];
/*
initImagePosition(element);
initPixelSpacing(element);//載入Pixel Spacing
initImageOrientation(element);//載入image Orientation
putLabel2Element(element, image, viewportNum);//putLabel
*/

//當視窗大小改變
window.onresize = function () {
    //設定左側面板的style
    getByid("LeftPicture").style = "display: flex;flex-direction: column;position: absolute;z-index: 9";
    if (parseInt(getByid("LeftPicture").offsetHeight) + 10 >= window.innerHeight - document.getElementsByClassName("container")[0].offsetTop - (bordersize * 2)) { //getByid("LeftPicture").style.height=""+(window.innerHeight- document.getElementsByClassName("container")[0].offsetTop- (bordersize * 2))+"px";
        getByid("LeftPicture").style = "overflow-y: scroll;display: flex;flex-direction: column;position: absolute;z-index: 9;height:" + (window.innerHeight - document.getElementsByClassName("container")[0].offsetTop - (bordersize * 2)) + "px;"
    }
    //刷新每個Viewport
    for (i = 0; i < Viewport_Total; i++) {
        try {
            var sop = GetViewport(i).sop;
            var uid = SearchUid2Json(sop);
            //NowResize = true;
            //20210919新增
            //NowSeries = '';
            GetViewport().NowCanvasSizeWidth = GetViewport().NowCanvasSizeHeight = null;
            loadAndViewImage(Patient.Study[uid.studyuid].Series[uid.sreiesuid].Sop[uid.sopuid].imageId, null, null, i);
        } catch (ex) { }
    }

    //暫時移除的功能
    /*if (openPenDraw == true) {
        var WandH = getFixSize(window.innerWidth, window.innerHeight, GetViewport(0));
        GetViewport(0).style = "position:relative;float: top;left:100px;width:calc(100% - " + (100 + (bordersize * 2)) + "px);" + "height:" + (WandH[1] - (bordersize * 2)) + "px;overflow:hidden;border:" + bordersize + "px #D3D9FF groove;margin:0px";
    }*/
    try { //需要再做更正--*
        var height = window.innerHeight;
        while (height > window.innerHeight - document.getElementsByClassName("container")[0].offsetTop - (bordersize * 2) && height >= 10) height -= 5;
        getByid("cornerstonePenCanvas").getElementsByClassName("CornerstoneViewport")[0]
            .getElementsByClassName("viewport-element")[0].getElementsByClassName("cornerstone-canvas")[0].
            style.height = "" + height + "px";
    } catch (ex) { }
    EnterRWD();
}

function displayLefyCanvas(DicomCanvas, image, pixelData) {
    DicomCanvas.width = image.width;
    DicomCanvas.height = image.height
    DicomCanvas.style.width = 66 + "px";
    DicomCanvas.style.height = 66 + "px";
    var ctx2 = DicomCanvas.getContext("2d");
    var imgData2 = ctx2.createImageData(image.width, image.height);
    var windowCenter = image.windowCenter;
    var windowWidth = image.windowWidth;
    var high = windowCenter + (windowWidth / 2);
    var low = windowCenter - (windowWidth / 2);
    var intercept = image.intercept;
    if (CheckNull(intercept)) intercept = 0;
    var slope = image.slope;
    if (CheckNull(slope)) slope = 1;
    var multiplication = 255 / ((high - low)) * slope;
    var addition = (- low + intercept) / (high - low) * 255;
    if (image.color == true) {
        for (var i = imgData2.data.length; i >= 0; i -= 4) {
            imgData2.data[i + 0] = pixelData[i] * multiplication + addition;
            imgData2.data[i + 1] = pixelData[i + 1] * multiplication + addition;
            imgData2.data[i + 2] = pixelData[i + 2] * multiplication + addition;
            imgData2.data[i + 3] = 255;
        }
    } else {
        for (var i = imgData2.data.length, j = imgData2.data.length / 4; i >= 0; i -= 4, j--) {
            imgData2.data[i + 0] = imgData2.data[i + 1] = imgData2.data[i + 2] = pixelData[j] * multiplication + addition;
            imgData2.data[i + 3] = 255;
        }
    }
    ctx2.putImageData(imgData2, 0, 0);

    var invert = (image.invert == true);
    function mirrorImage(ctx, picture, x = 0, y = 0, horizontal = false, vertical = false) {
        ctx.save();  // save the current canvas state
        ctx.setTransform(
            horizontal ? -1 : 1, 0, // set the direction of x axis
            0, vertical ? -1 : 1,   // set the direction of y axis
            x + (horizontal ? image.width : 0), // set the x origin
            y + (vertical ? image.height : 0)   // set the y origin
        );
        if (invert == true) ctx.filter = "invert()";
        ctx.drawImage(picture, 0, 0);
        ctx.restore(); // restore the state as it was when this function was called
    }
    if (invert == true) {
        mirrorImage(ctx2, DicomCanvas, 0, 0, GetViewport().openHorizontalFlip, GetViewport().openVerticalFlip);
    }
}
//執行icon圖示的摺疊效果
function EnterRWD() {

    //if (openPenDraw == true) return;
    //計算目前有幾個應被計算的icon在上方
    var count = 1;
    //計算上方icon的區塊有多少空間可以容納
    var iconWidth = getClass("page-header")[0].offsetWidth; //window.innerWidth;
    //檢查icon區塊的寬度是否足夠
    var check = false;
    for (let i = 0; i < getClass("page-header")[0].childNodes.length; i++) {
        if (getClass("page-header")[0].childNodes[i].tagName == "IMG") count++;
        if (getClass("page-header")[0].childNodes[i].alt == "輸出標記") continue;
        if (getClass("page-header")[0].childNodes[i].alt == "3dDisplay") continue;
        if (getClass("page-header")[0].childNodes[i].alt == "3dCave") continue;
        if (getClass("page-header")[0].childNodes[i].tagName == "IMG") {
            if (count >= parseInt(iconWidth / document.querySelector('.img').offsetWidth) - 2) {

                if (openRWD == true) { //如果折疊功能開啟中，隱藏應被隱藏的icon
                    getClass("page-header")[0].childNodes[i].style.display = "none";
                } else {
                    getClass("page-header")[0].childNodes[i].style.display = "";
                }
                //寬度足夠
                check = true;
            } else { //全部icon均顯示
                getClass("page-header")[0].childNodes[i].style.display = "";
            }
        }
    }
    //如果寬度足夠而沒有觸發折疊，摺疊的icon應該不顯示
    if (check == true) getByid("rwdImgTag").style.display = "";
    else getByid("rwdImgTag").style.display = "none";
    //刷新Viewport窗格
    SetTable();
}

function wadorsLoader(url) {
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
                loadAndViewImage("wadouri:" + url);
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

function parseDicom(image, pixelData, viewportNum0) {
    var viewportNum;
    if (viewportNum0 >= 0) viewportNum = viewportNum0;
    else viewportNum = viewportNumber;
    if (VIEWPORT.lockViewportList && VIEWPORT.lockViewportList.includes(viewportNum)) return;

    var element = GetViewport(viewportNum);
    //if (viewportNum0 >= 0) element = GetViewport(viewportNum);
    var MarkCanvas = GetViewportMark(viewportNum);
    //if (viewportNum0 >= 0) MarkCanvas = GetViewportMark((viewportNum));
    //原始影像，通常被用於放大鏡的參考

    if (image.data.string('x00080016') == '1.2.840.10008.5.1.4.1.1.66.4') {
        loadDicomSeg(image, image.imageId);
        return;
    }

    var PreviousSeriesInstanceUID = element.SeriesInstanceUID == undefined ? "undefined" : element.SeriesInstanceUID;

    function displayCanvas(DicomCanvas) {
        DicomCanvas.width = image.width;
        DicomCanvas.height = image.height
        var ctx2 = DicomCanvas.getContext("2d");
        var imgData2 = ctx2.createImageData(image.width, image.height);
        var windowCenter = element.windowCenterList ? element.windowCenterList : image.windowCenter;
        var windowWidth = element.windowWidthList ? element.windowWidthList : image.windowWidth;
        var high = windowCenter + (windowWidth / 2);
        var low = windowCenter - (windowWidth / 2);
        var intercept = image.intercept;
        if (CheckNull(intercept)) intercept = 0;
        var slope = image.slope;
        if (CheckNull(slope)) slope = 1;

        /*if (image.color == true) {
            for (var i = imgData2.data.length; i >=0 ; i -= 4) {
                imgData2.data[i + 0] = parseInt(((pixelData[i] * slope - low + intercept) / (high - low)) * 255);
                imgData2.data[i + 1] = parseInt(((pixelData[i + 1] * slope - low + intercept) / (high - low)) * 255);
                imgData2.data[i + 2] = parseInt(((pixelData[i + 2] * slope - low + intercept) / (high - low)) * 255);
                imgData2.data[i + 3] = 255;
            }
        } else {
            for (var i = imgData2.data.length, j = imgData2.data.length/4; i>=0 ; i -= 4, j--) {
                imgData2.data[i + 0] = imgData2.data[i + 1] = imgData2.data[i + 2] = parseInt(((pixelData[j] * slope - low + intercept) / (high - low)) * 255);
                imgData2.data[i + 3] = 255;
            }
        }*/
        var multiplication = 255 / ((high - low)) * slope;
        var addition = (- low + intercept) / (high - low) * 255;
        if (image.color == true) {
            for (var i = imgData2.data.length; i >= 0; i -= 4) {
                imgData2.data[i + 0] = pixelData[i] * multiplication + addition;
                imgData2.data[i + 1] = pixelData[i + 1] * multiplication + addition;
                imgData2.data[i + 2] = pixelData[i + 2] * multiplication + addition;
                imgData2.data[i + 3] = 255;
            }
        } else {
            for (var i = imgData2.data.length, j = imgData2.data.length / 4; i >= 0; i -= 4, j--) {
                imgData2.data[i + 0] = imgData2.data[i + 1] = imgData2.data[i + 2] = pixelData[j] * multiplication + addition;
                imgData2.data[i + 3] = 255;
            }
        }
        ctx2.putImageData(imgData2, 0, 0);

        var invert = ((image.invert != true && element.openInvert == true) || (image.invert == true && element.openInvert == false));
        function mirrorImage(ctx, picture, x = 0, y = 0, horizontal = false, vertical = false) {
            ctx.save();  // save the current canvas state
            ctx.setTransform(
                horizontal ? -1 : 1, 0, // set the direction of x axis
                0, vertical ? -1 : 1,   // set the direction of y axis
                x + (horizontal ? image.width : 0), // set the x origin
                y + (vertical ? image.height : 0)   // set the y origin
            );
            if (invert == true) ctx.filter = "invert()";
            ctx.drawImage(picture, 0, 0);
            ctx.restore(); // restore the state as it was when this function was called
        }
        if (invert == true || element.openHorizontalFlip == true || element.openVerticalFlip == true) {
            mirrorImage(ctx2, DicomCanvas, 0, 0, element.openHorizontalFlip, element.openVerticalFlip);
        }
    }

    displayCanvas(getClass("DicomCanvas")[viewportNum]);

    //StudyUID:x0020000d,Series UID:x0020000e,SOP UID:x00080018,
    //Instance Number:x00200013,影像檔編碼資料:imageId,PatientId:x00100020

    function getTag(tag) {
        var group = tag.substring(1, 5);
        var element = tag.substring(5, 9);
        var tagIndex = ("(" + group + "," + element + ")").toUpperCase();
        var attr = TAG_DICT[tagIndex];
        return attr;
    }
    //取得DICOM Tags放入清單
    element.DicomTagsList = [];
    element.imageId = image.imageId ? image.imageId : "";

    for (el in image.data.elements) {
        try {
            var tag = ("(" + el.substring(1, 5) + "," + el.substring(5, 9) + ")").toUpperCase();
            var el1 = getTag(el);
            el1.tag = "" + el;
            var content = dicomParser.explicitElementToString(image.data, el1);
            if (content) {
                element.DicomTagsList.push([tag, el1.name, content]);
                element[el1.name] = content;
            } else {
                var name = ("" + el1.name).toLowerCase();
                if (!image[name]) {
                    if (el1.vr == 'US') {
                        element.DicomTagsList.push([tag, el1.name, image.data.uint16(el)]);
                        element[el1.name] = image.data.uint16(el);
                    } else if (el1.vr === 'SS') {
                        element.DicomTagsList.push([tag, el1.name, image.data.int16(el)]);
                        element[el1.name] = image.data.int16(el);
                    } else if (el1.vr === 'UL') {
                        element.DicomTagsList.push([tag, el1.name, image.data.uint32(el)]);
                        element[el1.name] = image.data.uint32(el);
                    } else if (el1.vr === 'SL') {
                        element.DicomTagsList.push([tag, el1.name, image.data.int32(el)]);
                        element[el1.name] = image.data.int32(el);
                    } else if (el1.vr === 'FD') {
                        element.DicomTagsList.push([tag, el1.name, image.data.double(el)]);
                        element[el1.name] = image.data.double(el);
                    } else if (el1.vr === 'FL') {
                        element.DicomTagsList.push([tag, el1.name, image.data.float(el)]);
                        element[el1.name] = image.data.float(el);
                    } else {
                        element.DicomTagsList.push([tag, el1.name, ""]);
                        element[el1.name] = "";
                    }
                } else {
                    element.DicomTagsList.push([tag, el1.name, image[name]]);
                    element[el1.name] = image[name];
                }
            }
        } catch (ex) { }
    }

    VIEWPORT.loadViewport(element, image, viewportNum);
    /*//載入image Position
    initImagePosition(element);
    //載入Pixel Spacing
    initPixelSpacing(element);
    //載入image Orientation
    initImageOrientation(element);
    //putLabel
    putLabel2Element(element, image, viewportNum);*/
    //載入影像的原始長寬
    element.imageWidth = image.width;
    element.imageHeight = image.height;

    //代表如果當前載入的這張是目前選擇的影像
    //var ifNowSeries = false; //--*
    //如果現在載入的這張跟上次載入的不一樣
    if (!(PreviousSeriesInstanceUID == element.SeriesInstanceUID && element.windowWidthList != 0) || WindowOpen == false) {
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
        //ifNowSeries = true;
        if (element.newMousePointX == null) element.newMousePointX = element.newMousePointY = 0;
    }

    //表示目前的影像在左側的面板是否已經有了
    var checkleftCanvas = -1;
    //如果有，checkleftCanvas就指向該series
    for (var checkSeries in leftCanvasStudy) {
        if (leftCanvasStudy[checkSeries] == image.data.string('x0020000e')) {
            checkleftCanvas = checkSeries;
        }
    }

    //如果未曾出現在左側面板，就加到左側面板
    if (checkleftCanvas == -1) {
        var newView = SetToLeft(image.data.string('x0020000e'), -1, image.data.string('x00100020'));
        leftCanvasStudy.push(image.data.string('x0020000e'));
        var NewCanvas = document.createElement("CANVAS");
        NewCanvas.className = "LeftCanvas";
        newView.appendChild(NewCanvas);
        displayLefyCanvas(NewCanvas, image, pixelData);
        // showTheImage(newView, image, 'leftCanvas', null, viewportNum);
    } else {
        var checkNum;
        for (var dCount = 0; dCount <= dicomImageCount; dCount++) {
            if (getByid("dicomDivListDIV" + dCount) && getByid("dicomDivListDIV" + dCount).series == image.data.string('x0020000e')) {
                checkNum = dCount;
                break;
            }
        }
        if (checkNum != undefined) SetToLeft(image.data.string('x0020000e'), checkNum, image.data.string('x00100020'));
    }
    //顯示資訊到label
    DisplaySeriesCount(viewportNum);
    var HandW = getStretchSize(element.imageWidth, element.imageHeight, element);
    element.style = "position:block;left:100px;width:" + element.imageWidth + "px;height:" + element.imageHeight + "px;overflow:hidden;border:" + bordersize + "px #D3D9FF groove;";
    element.sop = element.SOPInstanceUID;

    //渲染影像到viewport和原始影像
    // showTheImage(element, image, 'normal', ifNowSeries, viewportNum);
    // showTheImage(originelement, image, 'origin', null, viewportNum);

    //紀錄Window Level
    element.windowCenter = image.windowCenter;
    element.windowWidth = image.windowWidth;

    textWC = getByid("textWC");
    textWW = getByid("textWW");
    labelWC = getClass("labelWC");

    var MainCanvas = element.canvas();
    SetTable();

    GetViewport().style.backgroundColor = "rgb(10,6,6)";
    GetViewport().style.border = bordersize + "px #FFC3FF groove";

    //渲染上去後畫布應該從原始大小縮小為適當大小
    var HandW = getViewprtStretchSize(element.imageWidth, element.imageHeight, element);
    MainCanvas.style = "width:" + HandW[0] + "px;height:" + HandW[1] + "px;display:block;position:absolute;top:50%;left:50%";
    MainCanvas.style.margin = "-" + (HandW[1] / 2) + "px 0 0 -" + (HandW[0] / 2) + "px";

    MarkCanvas.width = MainCanvas.width;
    MarkCanvas.height = MainCanvas.height;

    MarkCanvas.getContext("2d").save();
    Css(MainCanvas, 'zIndex', "6");
    MarkCanvas.style = MainCanvas.style.cssText;
    Css(MarkCanvas, 'zIndex', "8");
    Css(MarkCanvas, 'pointerEvents', "none");
    if (!(viewportNum0 >= 0)) initNewCanvas(MainCanvas);
    dicomImageCount += 1;
    if (!(viewportNum0 >= 0)) displayWindowLevel();
    else displayWindowLevel(viewportNum);

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
    if (viewportNum0 >= 0) displayMark(viewportNum);
    else displayMark();
    displayRuler(viewportNum);
    putLabel();
    displayAIM();
    for (var i = 0; i < Viewport_Total; i++)
        displayRuler(i);
}
//imageId:影像編碼資料，currX,currY:放大鏡座標，viewportNum0傳入的Viewport是第幾個
function loadAndViewImage(imageId, currX1, currY1, viewportNum0) {
    //if (openPenDraw == true) return;
    //如果沒有傳入指定的viewport，則使用目前選取的viewport
    var viewportNum = viewportNum0 >= 0 ? viewportNum0 : viewportNumber;
    var element = GetViewport(viewportNum);
    //if (viewportNum0 >= 0) element = GetViewport(viewportNum);
    var MarkCanvas = GetViewportMark(viewportNum);
    //if (viewportNum0 >= 0) MarkCanvas = GetViewportMark((viewportNum));
    //原始影像，通常被用於放大鏡的參考
    labelLT = getClass("labelLT");
    labelRT = getClass("labelRT");
    labelRB = getClass("labelRB");

    var dicomData = getPatientbyImageID[imageId];
    if (!dicomData) {

        try {
            cornerstone.loadImage(imageId, {
                usePDFJS: true
            }).then(function (image) {
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
                parseDicom(image, DICOM_obj.pixelData, viewportNum0);

            },
                function (err) { });
        } catch (err) { }
    }
    else {
        parseDicom(dicomData.image, dicomData.pixelData, viewportNum0);
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
            GetViewport(i).removeEventListener("contextmenu", contextmenuF, false);
            GetViewport(i).removeEventListener("mousemove", Mousemove, false);
            GetViewport(i).removeEventListener("mousedown", Mousedown, false);
            GetViewport(i).removeEventListener("mouseup", Mouseup, false);
            GetViewport(i).removeEventListener("mouseout", Mouseout, false);
            GetViewport(i).removeEventListener("wheel", Wheel, false);
            GetViewport(i).removeEventListener("mousedown", thisF, false);
            GetViewport(i).removeEventListener("touchstart", touchstartF, false);
            GetViewport(i).removeEventListener("touchend", touchendF, false);
            GetViewport(i).addEventListener("touchstart", thisF, false);
            GetViewport(i).addEventListener("mousedown", thisF, false);
            GetViewport(i).addEventListener("wheel", Wheel, false);
        }
        GetViewport().removeEventListener("touchstart", thisF, false);
        GetViewport().removeEventListener("mousedown", thisF, false);
        GetViewport().addEventListener("contextmenu", contextmenuF, false);
        GetViewport().addEventListener("mousemove", Mousemove, false);
        GetViewport().addEventListener("mousedown", Mousedown, false);
        GetViewport().addEventListener("mouseup", Mouseup, false);
        GetViewport().addEventListener("mouseout", Mouseout, false);
        GetViewport().addEventListener("touchstart", touchstartF, false);
        GetViewport().addEventListener("touchmove", touchmoveF, false);
        GetViewport().addEventListener("touchend", touchendF, false);
    } catch (ex) { console.log(ex); }
    //GetViewport((viewportNumber )).addEventListener("wheel", wheelF, false); --*
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
            Math.pow(MeasureXY2[0] / GetViewport().PixelSpacingX - MeasureXY[0] / GetViewport().PixelSpacingX, 2) +
            Math.pow(MeasureXY2[1] / GetViewport().PixelSpacingY - MeasureXY[1] / GetViewport().PixelSpacingY, 2), 2)) +
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

function SetTable(row0, col0) {
    //取得Viewport的row與col數量
    let row = Viewport_row,
        col = Viewport_col;
    //如果有傳入row與col的參數，則優先使用傳入的
    if (row0 && col0) {
        row = row0;
        col = col0
    }

    if (VIEWPORT.fixRow) row = VIEWPORT.fixRow;
    if (VIEWPORT.fixCol) col = VIEWPORT.fixCol;

    //重置各個Viewport的長寬大小(有顯示時)
    try {
        var WandH = getViewportFixSize(window.innerWidth, window.innerHeight, row, col);
        for (var i = 0; i < Viewport_Total; i++)
            GetViewport(i).style = "position:relative;float: left;left:100px;overflow:hidden;border:" + bordersize + "px #D3D9FF groove;margin:0px";
        for (var r = 0; r < row; r++) {
            for (var c = 0; c < col; c++) {
                GetViewport(r * col + c).style.width = "calc(" + parseInt(100 / col) + "% - " + (parseInt(100 / col) + (bordersize * 2)) + "px)";
                GetViewport(r * col + c).style.height = (WandH[1] - (bordersize * 2)) + "px";
            }
        }
    } catch (ex) { }
    //重置各個Viewport的長寬大小(不顯示時)
    for (var i = row * col; i < Viewport_Total; i++) {
        try {
            GetViewport(i).style = "position:relative;float: right;;width:0px;" + "height:" + 0 + "px;overflow:hidden;border:" + 0 + "px #D3D9FF groove;margin:0px";
        } catch (ex) { }
    }
    // window.onresize();
}