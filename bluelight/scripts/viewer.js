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
            var alt = GetViewport(i).alt;
            var uid = SearchUid2Json(alt);
            NowResize = true;
            GetViewport().NowCanvasSizeWidth = GetViewport().NowCanvasSizeHeight = null;
            loadAndViewImage(Patient.Study[uid.studyuid].Series[uid.sreiesuid].Sop[uid.sopuid].imageId, null, null, i);
        } catch (ex) { }
    }

    for (var tempSizeNum = 0; tempSizeNum < Viewport_Total; tempSizeNum++) {
        //如果VR及MPR開著，刷新VR的大小(MPR的右下角也有VR)
        if (openVR == true || openMPR == true) {
            for (var ll = 0; ll < o3DListLength; ll++) {
                var div1 = getByid("3DDiv" + ll);
                var WandH = 0;
                if (openVR) WandH = getViewportFixSize(window.innerWidth, window.innerHeight, 1, 1);
                else if (openMPR) WandH = getViewportFixSize(window.innerWidth, window.innerHeight, 2, 2);
                div1.style.width = WandH[0] + "px";
                div1.style.height = WandH[1] + "px";
            }
            for (var ll = 0; ll < o3d_3degree; ll++) {
                var div2 = getByid("3DDiv2_" + ll);
                var WandH = 0;
                if (openVR) WandH = getViewportFixSize(window.innerWidth, window.innerHeight, 1, 1);
                else if (openMPR) WandH = getViewportFixSize(window.innerWidth, window.innerHeight, 2, 2);
                div2.style.width = WandH[0] + "px";
                div2.style.height = WandH[1] + "px";

                var div3 = getByid("3DDiv3_" + ll);
                div3.style.width = WandH[0] + "px";
                div3.style.height = WandH[1] + "px";
            }
            if (tempSizeNum != viewportNumber) continue;
        }
        //需要再做更正--*
        try {
            MainCanvasT = GetViewport(tempSizeNum).canvas();
            MarkCanvasT = GetViewport(tempSizeNum);
            var HandWT = getStretchSize(GetViewport(tempSizeNum).imageWidth, GetViewport(tempSizeNum).imageHeight, GetViewport(tempSizeNum));
            MainCanvasT.style = "width:" + HandWT[0] + "px;height:" + HandWT[1] + "px;display:block;position:absolute;top:50%;left:50%";
            MainCanvasT.style.margin = "-" + (HandWT[0] / 2) + "px 0 0 -" + (HandWT[1] / 2) + "px";
            GetViewport(tempSizeNum).newMousePointX = 0;
            GetViewport(tempSizeNum).newMousePointY = 0;
            // NowCanvasSizeHeight = 0;
            // NowCanvasSizeWidth = 0;
            Css(MainCanvasT, 'transform', "translate(" + ToPx(GetViewport(tempSizeNum).newMousePointX) + "," + ToPx(GetViewport(tempSizeNum).newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)");
            Css(MarkCanvasT, 'transform', "translate(" + ToPx(GetViewport(tempSizeNum).newMousePointX) + "," + ToPx(GetViewport(tempSizeNum).newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)");
            MarkCanvasT.width = MainCanvasT.width;
            MarkCanvasT.height = MainCanvasT.height;
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
        if (getClass("page-header")[0].childNodes[i].tagName == "IMG")
            if (count * 50 >= iconWidth - 50 - 30) {
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
    //如果寬度足夠而沒有觸發折疊，摺疊的icon應該不顯示
    if (check == true) getByid("rwdImgTag").style.display = "";
    else getByid("rwdImgTag").style.display = "none";
    //刷新Viewport窗格
    SetTable();
}

function virtualLoadImage(imageId, left) {
    //left==1代表為該series首張影像，為零代表非首張影像，為-1代表為使用local端載入
    try {
        cornerstone.loadAndCacheImage(imageId, {
            usePDFJS: true
        }).then(function (image) {
            //StudyUID:x0020000d,Series UID:x0020000e,SOP UID:x00080018,
            //Instance Number:x00200013,影像檔編碼資料:imageId,PatientId:x00100020
            var Hierarchy = loadUID(image.data.string('x0020000d'), image.data.string('x0020000e'), image.data.string('x00080018'), image.data.string('x00200013'), imageId, image.data.string('x00100020'));
            NowAlt = image.data.string('x0020000e');
            DisplaySeriesCount(null);
            //如果為使用local端開啟並且為初次載入，顯示影像
            if (left != -1 && (Hierarchy == 0 || Hierarchy == 1)) left = 1;
            //如果為首張，顯示影像
            if (left == 1) {
                var newView = SetToLeft(image.data.string('x0020000e'), undefined, image.data.string('x00100020'));
                showTheImage(newView, image, 'leftCanvas');
                loadAndViewImage(imageId);
            }
            return image.data.string('x0020000e');
        }, function (err) { });
    } catch (err) { }
}

//imageId:影像編碼資料，currX,currY:放大鏡座標，viewportNum0傳入的Viewport是第幾個
function loadAndViewImage(imageId, currX1, currY1, viewportNum0) {
    //if (openPenDraw == true) return;
    //如果沒有傳入指定的viewport，則使用目前選取的viewport
    var viewportNum;
    if (viewportNum0 >= 0) viewportNum = viewportNum0;
    else viewportNum = viewportNumber;

    var element = GetViewport(viewportNum);
    //if (viewportNum0 >= 0) element = GetViewport(viewportNum);
    var MarkCanvas = GetViewportMark(viewportNum);
    //if (viewportNum0 >= 0) MarkCanvas = GetViewportMark((viewportNum));
    //原始影像，通常被用於放大鏡的參考
    var originelement = getByid("origindicomImage");
    labelLT = getClass("labelLT");
    labelRT = getClass("labelRT");
    labelRB = getClass("labelRB");
    try {
        cornerstone.loadAndCacheImage(imageId, {
            usePDFJS: true
        }).then(function (image) {
            //如果是DICOM SEG，載入至PatientMark
            if (image.data.string('x00080016') == '1.2.840.10008.5.1.4.1.1.66.4') {
                loadDicomSeg(image, imageId);
                return;
            }

            //StudyUID:x0020000d,Series UID:x0020000e,SOP UID:x00080018,
            //Instance Number:x00200013,影像檔編碼資料:imageId,PatientId:x00100020
            loadUID(image.data.string('x0020000d'), image.data.string('x0020000e'), image.data.string('x00080018'),
                image.data.string('x00200013'), imageId, image.data.string('x00100020'));

            function getTag(tag) {
                var group = tag.substring(1, 5);
                var element = tag.substring(5, 9);
                var tagIndex = ("(" + group + "," + element + ")").toUpperCase();
                var attr = TAG_DICT[tagIndex];
                return attr;
            }
            //取得DICOM Tags放入清單
            element.DicomTagsList = [];
            for (el in image.data.elements) {
                try {
                    var tag = ("(" + el.substring(1, 5) + "," + el.substring(5, 9) + ")").toUpperCase();
                    var el1 = getTag(el);
                    el1.tag = "" + el;
                    var content = dicomParser.explicitElementToString(image.data, el1);
                    if (content) {
                        element.DicomTagsList.push([tag, el1.name, content]);
                    } else {
                        var name = ("" + el1.name).toLowerCase();
                        if (!image[name]) {
                            if (el1.vr == 'US') {
                                element.DicomTagsList.push([tag, el1.name, image.data.uint16(el)]);
                            } else if (el1.vr === 'SS') {
                                element.DicomTagsList.push([tag, el1.name, image.data.int16(el)]);
                            } else if (el1.vr === 'UL') {
                                element.DicomTagsList.push([tag, el1.name, image.data.uint32(el)]);
                            } else if (el1.vr === 'SL') {
                                element.DicomTagsList.push([tag, el1.name, image.data.int32(el)]);
                            } else if (el1.vr === 'FD') {
                                element.DicomTagsList.push([tag, el1.name, image.data.double(el)]);
                            } else if (el1.vr === 'FL') {
                                element.DicomTagsList.push([tag, el1.name, image.data.float(el)]);
                            } else {
                                element.DicomTagsList.push([tag, el1.name, ""]);
                            }
                        } else {
                            element.DicomTagsList.push([tag, el1.name, image[name]]);
                        }
                    }
                } catch (ex) { }
            }

            //載入image Position
            if (image.data.string('x00200032')) {
                element.imagePositionX = parseFloat(image.data.string('x00200032').split("\\")[0]);
                element.imagePositionY = parseFloat(image.data.string('x00200032').split("\\")[1]);
                element.imagePositionZ = parseFloat(image.data.string('x00200032').split("\\")[2]);
            } else {
                imagePosition = 0;
            }
            //載入Pixel Spacing
            if (image.data.string('x00280030')) {
                element.PixelSpacingX = 1.0 / parseFloat(image.data.string('x00280030').split("\\")[0]);
                element.PixelSpacingY = 1.0 / parseFloat(image.data.string('x00280030').split("\\")[1]);
                //alert(image.data.string('x00181164'));
                // alert(parseFloat(image.data.string('x00200032').split("\\")[2]));
            } else {
                element.PixelSpacingX = 1.0;
                element.PixelSpacingY = 1.0;
            }
            //載入image Orientation
            if (image.data.string('x00200037')) {
                element.imageOrientationX = image.data.string('x00200037').split("\\")[0];
                element.imageOrientationY = image.data.string('x00200037').split("\\")[1];
                element.imageOrientationZ = image.data.string('x00200037').split("\\")[2];

                element.imageOrientationX2 = image.data.string('x00200037').split("\\")[3];
                element.imageOrientationY2 = image.data.string('x00200037').split("\\")[4];
                element.imageOrientationZ2 = image.data.string('x00200037').split("\\")[5];
            } else {
                element.imageOrientationX = 0;
                element.imageOrientationY = 0;
            }
            //載入影像的日期與時間
            element.PatientID = image.data.string('x00100020');
            element.PatientName = image.data.string('x00100010');

            element.AccessionNumber = image.data.string('x00080050');
            element.StudyDescription = image.data.string('x00081030');
            element.StudyID = image.data.string('x00200010');

            var date = element.StudyDate = image.data.string('x00080020');
            var time = element.StudyTime = image.data.string('x00080030');
            date = ("" + date).replace(/^(\d{4})(\d\d)(\d\d)$/, '$1/$2/$3');
            time = ("" + time).replace(/^(\d{2})(\d\d)(\d\d)/, '$1:$2:$3');
            date = date + " " + time.substr(0, 8);
            //清空label的數值
            labelLT[viewportNum].innerHTML = "";
            labelRT[viewportNum].innerHTML = "";
            //依照dicom tags設定檔載入影像
            for (var i = 0; i < DicomTags.LT.name.length; i++)
                labelLT[viewportNum].innerHTML += "" + DicomTags.LT.name[i] + " " + Null2Empty(image.data.string("x" + DicomTags.LT.tag[i])) + "<br>";
            for (var i = 0; i < DicomTags.RT.name.length; i++)
                labelRT[viewportNum].innerHTML += "" + DicomTags.RT.name[i] + " " + Null2Empty(image.data.string("x" + DicomTags.RT.tag[i])) + "<br>";

            //載入影像的原始長寬
            element.imageWidth = image.width;
            element.imageHeight = image.height;

            //設定原始影像的長寬
            originelement.style = "position:absolute;left:100px;width:" + element.imageWidth + "px;height:" + element.imageHeight + "px;overflow:hidden;";

            //代表如果當前載入的這張是目前選擇的影像
            var ifNowAlt = false; //--*
            //如果現在載入的這張跟上次載入的不一樣
            if (NowAlt != image.data.string('x0020000e')) {
                //重置滑鼠座標
                element.newMousePointX = element.newMousePointY = 0;
                NowAlt = image.data.string('x0020000e');
                //重置縮放大小
                GetViewport(viewportNum).NowCanvasSizeWidth = GetViewport(viewportNum).NowCanvasSizeHeight = null;
            } else { //如果一樣
                ifNowAlt = true;
                if (element.newMousePointX == null)
                    element.newMousePointX = element.newMousePointY = 0;
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
                showTheImage(newView, image, 'leftCanvas', null, viewportNum);
            } else {
                var checkNum;
                for (var dCount = 0; dCount < dicomImageCount; dCount++) {
                    if (getByid("dicomDivListDIV" + dCount) && getByid("dicomDivListDIV" + dCount).alt == image.data.string('x0020000e')) {
                        checkNum = dCount;
                    }
                }
                SetToLeft(image.data.string('x0020000e'), checkNum, image.data.string('x00100020'));
            }
            //顯示資訊到label
            DisplaySeriesCount(image.data.string('x00200013'), viewportNum, date);
            var HandW = getStretchSize(element.imageWidth, element.imageHeight, element);
            element.style = "position:block;left:100px;width:" + element.imageWidth + "px;height:" + element.imageHeight + "px;overflow:hidden;border:" + bordersize + "px #D3D9FF groove;";
            element.alt = image.data.string('x00080018');

            //渲染影像到viewport和原始影像
            showTheImage(element, image, 'normal', ifNowAlt, viewportNum);
            showTheImage(originelement, image, 'origin', null, viewportNum);

            //隱藏原始影像
            originelement.style.display = "none";

            //紀錄Window Level
            element.windowCenter = image.windowCenter;
            element.windowWidth = image.windowWidth;
            if (!(ifNowAlt == true && element.windowWidthList != 0) || WindowOpen == false) {
                element.windowCenterList = image.windowCenter;
                element.windowWidthList = image.windowWidth;
            }
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
            if (!(isNaN(GetViewport(viewportNum).NowCanvasSizeHeight) || isNaN(GetViewport(viewportNum).NowCanvasSizeWidth))) {
                Css(MainCanvas, 'width', Fpx(GetViewport(viewportNum).NowCanvasSizeWidth));
                Css(MainCanvas, 'height', Fpx(GetViewport(viewportNum).NowCanvasSizeHeight));
                Css(MarkCanvas, 'width', Fpx(GetViewport(viewportNum).NowCanvasSizeWidth));
                Css(MarkCanvas, 'height', Fpx(GetViewport(viewportNum).NowCanvasSizeHeight));
            }
            Css(MainCanvas, 'transform', "translate(" + ToPx(element.newMousePointX) + "," + ToPx(element.newMousePointY) + ")rotate(" + element.rotateValue + "deg)");
            Css(MarkCanvas, 'transform', "translate(" + ToPx(element.newMousePointX) + "," + ToPx(element.newMousePointY) + ")rotate(" + element.rotateValue + "deg)");
            // }
            if (openWindow == false && openZoom == false)
                openMouseTool = true;
            //openChangeFile = true;
            //如果放大鏡功能正在使用就顯示放大鏡
            if (openZoom == true && MouseDownCheck == true) {
                magnifierIng(currX1, currY1)
            }
            //隱藏Table
            getByid("TableSelectNone").selected = true;
            //刷新介面並顯示標記
            if (viewportNum0 >= 0) displayMark(NowResize, null, null, null, viewportNum);
            else displayMark(NowResize);
            displayRular(viewportNum);
            putLabel();
            displayAIM();
            for (var i = 0; i < Viewport_Total; i++)
                displayRular(i);
            //如果VR和MPR開著，禁止其顯示圖片
            if (openVR == true || openMPR == true) {
                try {
                    GetViewport(0).canvas().style.display = "none";
                } catch (ex) { };
                try {
                    GetViewport(1).canvas().style.display = "none";
                } catch (ex) { };
                try {
                    var alt3 = GetViewport(3).alt;
                    var uid3 = SearchUid2Json(alt3);
                    if (uid3) GetViewport(3).canvas().style.display = "none";
                } catch (ex) { };
                try {
                    GetViewportMark(0).style.display = "none";
                } catch (ex) { };
                try {
                    GetViewportMark(1).style.display = "none";
                } catch (ex) { };
                try {
                    GetViewportMark(3).style.display = "none";
                } catch (ex) { };
            }
        },
            function (err) { });
    } catch (err) { }
}

function initNewCanvas(newCanvas) {
    //初始化Canvas，添加事件
    canvas = newCanvas;
    ctx = canvas.getContext("2d");
    var viewportNumber2 = (viewportNumber + 1);
    if (viewportNumber2 > 3) viewportNumber2 = 0
    for (var i = 0; i < Viewport_Total; i++) {
        GetViewport(i).removeEventListener("contextmenu", contextmenuF, false);
        GetViewport(i).removeEventListener("mousemove", mousemoveF, false);
        GetViewport(i).removeEventListener("mousedown", mousedownF, false);
        GetViewport(i).removeEventListener("mouseup", mouseupF, false);
        GetViewport(i).removeEventListener("mouseout", mouseoutF, false);
        GetViewport(i).removeEventListener("wheel", wheelF, false);
        GetViewport(i).removeEventListener("mousedown", thisF, false);
        GetViewport(i).removeEventListener("touchstart", touchstartF, false);
        GetViewport(i).removeEventListener("touchend", touchendF, false);
        GetViewport(i).addEventListener("touchstart", thisF, false);
        GetViewport(i).addEventListener("mousedown", thisF, false);
        GetViewport(i).addEventListener("wheel", wheelF, false);
    }
    GetViewport().removeEventListener("touchstart", thisF, false);
    GetViewport().removeEventListener("mousedown", thisF, false);
    GetViewport().addEventListener("contextmenu", contextmenuF, false);
    GetViewport().addEventListener("mousemove", mousemoveF, false);
    GetViewport().addEventListener("mousedown", mousedownF, false);
    GetViewport().addEventListener("mouseup", mouseupF, false);
    GetViewport().addEventListener("mouseout", mouseoutF, false);
    GetViewport().addEventListener("touchstart", touchstartF, false);
    GetViewport().addEventListener("touchmove", touchmoveF, false);
    GetViewport().addEventListener("touchend", touchendF, false);
    //GetViewport((viewportNumber )).addEventListener("wheel", wheelF, false); --*
}

//跟loadAndViewImage()一樣，只是只調整Window Level而不重置設定
//註解請參考loadAndViewImage()
function loadAndViewImageByWindowLevwl(imageId, windowcenter, windowwidth, openOrigin, viewportNum0) {

    var viewportNum;
    if (viewportNum0 >= 0) viewportNum = viewportNum0;
    else viewportNum = viewportNumber;

    var element = GetViewport(viewportNum);
    try {
        cornerstone.loadAndCacheImage(imageId, {
            usePDFJS: true
        }).then(function (image) {
            element.imageWidth = image.width;
            element.imageHeight = image.height;

            var HandW = getViewprtStretchSize(element.imageWidth, element.imageHeight, element);
            element.style = "position:block;left:100px;width:" + element.imageWidth + "px;height:" + element.imageHeight + "px;overflow:hidden;border:" + bordersize + "px #D3D9FF groove;";
            element.alt = image.data.string('x00080018');

            element.windowWidthList = windowwidth;
            element.windowCenterList = windowcenter;
            showTheImage(element, image, 'windowLevel', null, viewportNum);
            if (openOrigin == true) {
                var originelement = getByid("origindicomImage");
                originelement.style = "position:absolute;left:100px;width:" + element.imageWidth + "px;height:" + element.imageHeight + "px;overflow:hidden;";
                showTheImage(originelement, image, 'origin');
                originelement.style.display = "none";
            }

            var WandH = getFixSize(window.innerWidth, window.innerHeight, element);
            element.style = "position:absolute;left:100px;width:calc(100% - " + (100 + (bordersize * 2)) + "px);" + "height:" + WandH[1] + "px;overflow:hidden;border:" + bordersize + "px #D3D9FF groove;";
            element.alt = image.data.string('x00080018');
            SetTable();
            GetViewport().style.backgroundColor = "rgb(10,6,6)";
            GetViewport().style.border = bordersize + "px #FFC3FF groove";

            var MainCanvas = GetViewport(viewportNum).canvas();
            var MarkCanvas = GetViewportMark((viewportNum));
            MainCanvas.style = "width:" + HandW[0] + "px;height:" + HandW[1] + "px;" + "display:block;position:absolute;top:50%;left:50%";
            MainCanvas.style.margin = "-" + (HandW[1] / 2) + "px 0 0 -" + (HandW[0] / 2) + "px";
            Css(MainCanvas, 'zIndex', "6");
            MarkCanvas.style = MainCanvas.style.cssText;
            Css(MarkCanvas, 'zIndex', "8");
            Css(MarkCanvas, 'pointerEvents', "none");
            // initNewCanvas(MainCanvas);
            if ((viewportNum0 >= 0)) {
                for (var i = 0; i < Viewport_Total; i++)
                    displayWindowLevel(i);
            } else {
                displayWindowLevel();
            }
            if (!(isNaN(GetViewport(viewportNum).NowCanvasSizeHeight) || isNaN(GetViewport(viewportNum).NowCanvasSizeWidth))) {
                Css(MainCanvas, 'width', Fpx(GetViewport(viewportNum).NowCanvasSizeWidth));
                Css(MainCanvas, 'height', Fpx(GetViewport(viewportNum).NowCanvasSizeHeight));
                Css(MarkCanvas, 'width', Fpx(GetViewport(viewportNum).NowCanvasSizeWidth));
                Css(MarkCanvas, 'height', Fpx(GetViewport(viewportNum).NowCanvasSizeHeight));
            }
            MainCanvas.style.transform = "translate(" + ToPx(element.newMousePointX) + "," + ToPx(element.newMousePointY) + ")rotate(" + element.rotateValue + "deg)";
            MarkCanvas.style.transform = "translate(" + ToPx(element.newMousePointX) + "," + ToPx(element.newMousePointY) + ")rotate(" + element.rotateValue + "deg)";

            putLabel();
            for (var i = 0; i < Viewport_Total; i++) {
                displayRular(i);
                displayMark(NowResize, null, null, null, i);
            }
            //隱藏Table
            getByid("TableSelectNone").selected = true;
        }, function (err) {
            //  alert(err);
        });
    } catch (err) {
        // alert(err);
    }
}

//渲染圖片到Viewport的函數
function showTheImage(element, image, mode, ifNowAlt, viewportNum0) {
    //-30是代表3D VR的顯示模式
    if (mode == '3d') {
        cornerstone.enable(element);
        const viewport1 = cornerstone.getDefaultViewportForImage(element, image);
        viewport1.voi.windowWidth = GetViewport().windowWidthList;
        viewport1.voi.windowCenter = GetViewport().windowCenterList;
        //如果是骨骼模型，使用對應的Window Level
        if (getByid("o3DAngio").selected == true) {
            viewport1.voi.windowWidth = 332;
            viewport1.voi.windowCenter = 287;
        } else if (getByid("o3DAirways").selected == true) {
            //如果是肺氣管模型，使用對應的Window Level
            viewport1.voi.windowWidth = 409;
            viewport1.voi.windowCenter = -538;
        }
        if (element.openInvert == true) viewport1.invert = !viewport1.invert;
        cornerstone.setViewport(element, viewport1);
        cornerstone.displayImage(element, image, viewport1);
        return;
    }
    var viewportNum;
    if (viewportNum0 >= 0) viewportNum = viewportNum0;
    else viewportNum = viewportNumber;
    //使用WebGL渲染，但目前尚未加入程式 --*
    const options = {
        renderer: 'webgl'
    };
    cornerstone.enable(element);
    const viewport = cornerstone.getDefaultViewportForImage(element, image);
    if (mode == 'normal' || mode == 'windowLevel' || mode == 'origin' || WindowOpen == true) {
        if (mode == 'origin') {
            if (GetViewport().windowWidthList && GetViewport().windowCenterList) {
                viewport.voi.windowWidth = GetViewport().windowWidthList;
                viewport.voi.windowCenter = GetViewport().windowCenterList;
            }
            if (GetViewport(viewportNum).openInvert == true) viewport.invert = !viewport.invert;
            cornerstone.setViewport(element, viewport);
        } else if (mode == 'windowLevel' || (WindowOpen == true && (ifNowAlt == true && element.windowWidthList != 0))) {
            viewport.voi.windowWidth = element.windowWidthList;
            viewport.voi.windowCenter = element.windowCenterList;
            cornerstone.setViewport(element, viewport);
        }
    }
    if (GetViewport(viewportNum).openHorizontalFlip == true) viewport.hflip = !viewport.hflip;
    if (GetViewport(viewportNum).openVerticalFlip == true) viewport.vflip = !viewport.vflip;
    if (element.openInvert == true) viewport.invert = !viewport.invert;
    cornerstone.displayImage(element, image, viewport);
}

//按下滑鼠或觸控要做的事情 --*
function DivDraw(e) {
    //if (MouseDownCheck == false) getByid("MeasureLabel").style.display = "none";
    if (openZoom == false && openMeasure == false && MouseDownCheck == false && openAngel == 0) return;
    //magnifierDiv.style.display="none";
    // x_out = -magnifierWidth / 2; // 與游標座標之水平距離
    // y_out = -magnifierHeight / 2; // 與游標座標之垂直距離
    x_out = -parseInt(magnifierCanvas.style.width) / 2; // 與游標座標之水平距離
    y_out = -parseInt(magnifierCanvas.style.height) / 2; // 與游標座標之垂直距離

    if (openMeasure && (MouseDownCheck == true || TouchDownCheck == true)) {
        getByid("MeasureLabel").style.display = '';
        if (MeasureXY2[0] > MeasureXY[0])
            x_out = 20; // 與游標座標之水平距離
        else x_out = -20;
        if (MeasureXY2[1] > MeasureXY[1])
            y_out = 20; // 與游標座標之水平距離
        else y_out = -20;
    }
    if (openAngel >= 2) {
        getByid("AngelLabel").style.display = '';
        if (AngelXY2[0] > AngelXY0[0])
            x_out = 20; // 與游標座標之水平距離
        else x_out = -20;
        if (AngelXY2[1] > AngelXY0[1])
            y_out = 20; // 與游標座標之水平距離
        else y_out = -20;
    } else {
        getByid("AngelLabel").style.display = 'none';
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
    else /* if (openAngel==2)*/
        dgs = document.getElementById("AngelLabel").style;
    y = e.clientY;
    x = e.clientX;
    if (!y || !x) {
        y = e.touches[0].clientY;
        x = e.touches[0].clientX;
    }
    if (MouseDownCheck == true || TouchDownCheck == true || openAngel == 2) {
        dgs.top = y + dbst + y_out + "px";
        dgs.left = x + dbsl + x_out + "px";
    }
    if (openMeasure) {
        getByid("MeasureLabel").innerText = parseInt(Math.sqrt(
            Math.pow(MeasureXY2[0] / GetViewport().PixelSpacingX - MeasureXY[0] / GetViewport().PixelSpacingX, 2) +
            Math.pow(MeasureXY2[1] / GetViewport().PixelSpacingY - MeasureXY[1] / GetViewport().PixelSpacingY, 2), 2)) +
            "mm";
    } else if (openAngel == 2) {
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
        var angle = getAngle({
            x: AngelXY0[0] - AngelXY2[0],
            y: AngelXY0[1] - AngelXY2[1],
        }, {
            x: AngelXY0[0] - AngelXY1[0],
            y: AngelXY0[1] - AngelXY1[1],
        });
        if (angle > 180) angle = 360 - angle;
        getByid("AngelLabel").innerText = parseInt(angle) + "°";
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
    //如果MPR模式正在開啟，固定2x2
    if (openMPR) {
        row = 2, col = 2;
    };
    //如果VR模式正在開啟，固定1x1
    if (openVR) {
        row = 1, col = 1;
    };
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