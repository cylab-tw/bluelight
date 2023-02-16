
function windowlevel() {
    if (BL_mode == 'windowlevel') {
        DeleteMouseEvent();
        textWC.style.display = '';
        textWW.style.display = '';
        getByid('WindowLevelDiv').style.display = '';
        //  getByid('myWW').style.display = '';
        openWindow = true;

        set_BL_model.onchange1 = function () {
            openWindow = false;
            getByid('WindowLevelDiv').style.display = 'none';
            set_BL_model.onchange1 = function () { return 0; };
        }

        SetTable();
        Mousedown = function (e) {
            if (e.which == 1) MouseDownCheck = true;
            else if (e.which == 3) rightMouseDown = true;
            windowMouseX = GetmouseX(e);
            windowMouseY = GetmouseY(e);
            GetViewport().originalPointX = getCurrPoint(e)[0];
            GetViewport().originalPointY = getCurrPoint(e)[1];
        };



        Mousemove = function (e) {
            var currX = getCurrPoint(e)[0];
            var currY = getCurrPoint(e)[1];
            var labelXY = getClass('labelXY'); {
                let angle2point = rotateCalculation(e);
                labelXY[viewportNumber].innerText = "X: " + parseInt(angle2point[0]) + " Y: " + parseInt(angle2point[1]);
            }
            if (rightMouseDown == true) {
                scale_size(e, currX, currY);
            }
            if (openLink == true) {
                for (var i = 0; i < Viewport_Total; i++) {
                    GetViewport(i).newMousePointX = GetViewport().newMousePointX;
                    GetViewport(i).newMousePointY = GetViewport().newMousePointY;
                }
            }
            putLabel();
            for (var i = 0; i < Viewport_Total; i++)
                displayRuler(i);

            if (MouseDownCheck) {
                var MouseX = GetmouseX(e);
                var MouseY = GetmouseY(e);
                //GetViewport().newMousePointX += MouseX - windowMouseX;
                //GetViewport().newMousePointY += MouseY - windowMouseY;
                //setTransform();

                if (openWindow == true) {
                    getByid("WindowCustom").selected = true;
                    if (Math.abs(currY - GetViewport().originalPointY) > Math.abs(currX - GetViewport().originalPointX)) {
                        if (currY < GetViewport().originalPointY - 3)
                            GetViewport().windowCenterList = (parseInt(GetViewport().windowCenterList) + Math.abs(GetmouseY(e) - windowMouseY));
                        else if (currY > GetViewport().originalPointY + 3)
                            GetViewport().windowCenterList = (parseInt(GetViewport().windowCenterList) - Math.abs(GetmouseY(e) - windowMouseY));
                    } else {
                        if (currX < GetViewport().originalPointX - 3)
                            GetViewport().windowWidthList = (parseInt(GetViewport().windowWidthList) - Math.abs(GetmouseX(e) - windowMouseX));
                        else if (currX > GetViewport().originalPointX + 3)
                            GetViewport().windowWidthList = (parseInt(GetViewport().windowWidthList) + Math.abs(GetmouseX(e) - windowMouseX));
                    }
                    if (GetViewport().windowWidthList < 1) GetViewport().windowWidthList = 1;
                    textWC.value = "" + parseInt(GetViewport().windowCenterList);
                    textWW.value = "" + parseInt(GetViewport().windowWidthList);
                    if (openLink == true) {
                        for (var z = 0; z < 4; z++)
                            GetViewport(z).windowWidthList = GetViewport().windowWidthList;
                    }
                    displayWindowLevel();
                    
                    SetWindowWL();
                    WindowOpen = true;
                }
                windowMouseX = GetmouseX(e);
                windowMouseY = GetmouseY(e);
                GetViewport().originalPointX = currX;
                GetViewport().originalPointY = currY;
            }
        }
        Mouseup = function (e) {
            var currX = getCurrPoint(e)[0];
            var currY = getCurrPoint(e)[1];
            if (openMouseTool == true && rightMouseDown == true)
                displayMark();
            MouseDownCheck = false;
            rightMouseDown = false;
            magnifierDiv.style.display = "none";
            
            if (openLink) {
                for (var i = 0; i < Viewport_Total; i++)
                    displayRuler(i);
            }
        }
        Touchstart = function (e, e2) {

            if (!e2) TouchDownCheck = true;
            else rightTouchDown = true;
            windowMouseX = GetmouseX(e);
            windowMouseY = GetmouseY(e);
            if (rightTouchDown == true && e2) {
                windowMouseX2 = GetmouseX(e2);
                windowMouseY2 = GetmouseY(e2);
            }
            GetViewport().originalPointX = getCurrPoint(e)[0];
            GetViewport().originalPointY = getCurrPoint(e)[1];
            if (rightTouchDown == true && e2) {
                GetViewport().originalPointX2 = getCurrPoint(e2)[0];
                GetViewport().originalPointY2 = getCurrPoint(e2)[1];
            }
        }
        Touchmove = function (e, e2) {
            if (openDisplayMarkup && (getByid("DICOMTagsSelect").selected || getByid("AIMSelect").selected)) return;

            var currX = getCurrPoint(e)[0];
            var currY = getCurrPoint(e)[1];
            if (e2) {
                var currX2 = getCurrPoint(e2)[0];
                var currY2 = getCurrPoint(e2)[1];
            }
            var labelXY = getClass('labelXY');
            labelXY[viewportNumber].innerText = "X: " + Math.floor(currX) + " Y: " + Math.floor(currY);
            //尚未完成

            if (/*openWindow == true && */rightTouchDown == false) {
                getByid("WindowCustom").selected = true;
                if (Math.abs(currY - GetViewport().originalPointY) > Math.abs(currX - GetViewport().originalPointX)) {
                    if (currY < GetViewport().originalPointY - 3)
                        GetViewport().windowCenterList = (parseInt(GetViewport().windowCenterList) + Math.abs(GetmouseY(e) - windowMouseY));
                    else if (currY > GetViewport().originalPointY + 3)
                        GetViewport().windowCenterList = (parseInt(GetViewport().windowCenterList) - Math.abs(GetmouseY(e) - windowMouseY));
                } else {
                    if (currX < GetViewport().originalPointX - 3)
                        GetViewport().windowWidthList = (parseInt(GetViewport().windowWidthList) - Math.abs(GetmouseX(e) - windowMouseX));
                    else if (currX > GetViewport().originalPointX + 3)
                        GetViewport().windowWidthList = (parseInt(GetViewport().windowWidthList) + Math.abs(GetmouseX(e) - windowMouseX));
                }
                if (GetViewport().windowWidthList < 1) GetViewport().windowWidthList = 1;
                textWC.value = "" + parseInt(GetViewport().windowCenterList);
                textWW.value = "" + parseInt(GetViewport().windowWidthList);
                if (openLink == true) {
                    for (var z = 0; z < Viewport_Total; z++)
                        windowWidthList[z] = GetViewport().windowWidthList;
                }
                displayWindowLevel();
                
                SetWindowWL();
                GetViewport().originalPointX = currX;
                GetViewport().originalPointY = currY;
                WindowOpen = true;
            }
            // putLabel();
            //  for (var i = 0; i < Viewport_Total; i++)
            //   displayRuler(i);
        }
        Touchend = function (e, e2) {
            if (TouchDownCheck == true) {
                if (openAngle == 1) openAngle = 2;
                else if (openAngle == 2) openAngle = 3;
            }
            TouchDownCheck = false;
            rightTouchDown = false;

            magnifierDiv.style.display = "none";
            
        }

        AddMouseEvent();
    }
}

function parseDicomW(image, pixelData, viewportNum0, WindowLevelObj) {
    var windowcenter = WindowLevelObj.windowcenter;
    var windowwidth = WindowLevelObj.windowwidth;
    var openOrigin = WindowLevelObj.openOrigin;
    var viewportNum = viewportNum0 >= 0 ? viewportNum0 : viewportNumber;

    var element = GetViewport(viewportNum);

    function displayCanvas(DicomCanvas) {
        DicomCanvas.width = image.width;
        DicomCanvas.height = image.height
        var ctx2 = DicomCanvas.getContext("2d");
        var imgData2 = ctx2.createImageData(image.width, image.height);
        var high = WindowLevelObj.windowcenter + (windowwidth / 2);
        var low = WindowLevelObj.windowcenter - (windowwidth / 2);
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
        var invert = ((image.invert != true && element.openInvert == true) || (image.invert == true && element.openInvert == false));
        function mirrorImage(ctx2, picture, x = 0, y = 0, horizontal = false, vertical = false) {
            ctx2.save();  // save the current canvas state
            ctx2.setTransform(
                horizontal ? -1 : 1, 0, // set the direction of x axis
                0, vertical ? -1 : 1,   // set the direction of y axis
                x + (horizontal ? image.width : 0), // set the x origin
                y + (vertical ? image.height : 0)   // set the y origin
            );
            if (invert == true) ctx2.filter = "invert()";
            ctx2.drawImage(picture, 0, 0);
            ctx2.restore(); // restore the state as it was when this function was called
        }
        if (invert == true || element.openHorizontalFlip == true || element.openVerticalFlip == true) {
            mirrorImage(ctx2, DicomCanvas, 0, 0, element.openHorizontalFlip, element.openVerticalFlip);
        }
    }
    displayCanvas(getClass("DicomCanvas")[viewportNum]);

    element.imageWidth = image.width;
    element.imageHeight = image.height;

    var HandW = getViewprtStretchSize(element.imageWidth, element.imageHeight, element);
    element.style = "position:block;left:100px;width:" + element.imageWidth + "px;height:" + element.imageHeight + "px;overflow:hidden;border:" + bordersize + "px #D3D9FF groove;";
    element.sop = element.SOPInstanceUID;

    element.windowWidthList = windowwidth;
    element.windowCenterList = windowcenter;
    // showTheImage(element, image, 'windowLevel', null, viewportNum);

    var WandH = getFixSize(window.innerWidth, window.innerHeight, element);
    element.style = "position:absolute;left:100px;width:calc(100% - " + (100 + (bordersize * 2)) + "px);" + "height:" + WandH[1] + "px;overflow:hidden;border:" + bordersize + "px #D3D9FF groove;";
    element.sop = element.SOPInstanceUID;
    SetTable();
    GetViewport().style.backgroundColor = "rgb(10,6,6)";
    GetViewport().style.border = bordersize + "px #FFC3FF groove";

    var MainCanvas = element.canvas();
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
    if (!(isNaN(element.NowCanvasSizeHeight) || isNaN(element.NowCanvasSizeWidth))) {
        Css(MainCanvas, 'width', Fpx(element.NowCanvasSizeWidth));
        Css(MainCanvas, 'height', Fpx(element.NowCanvasSizeHeight));
        Css(MarkCanvas, 'width', Fpx(element.NowCanvasSizeWidth));
        Css(MarkCanvas, 'height', Fpx(element.NowCanvasSizeHeight));
    }
    setTransform(viewportNum);
    //MainCanvas.style.transform = "translate(" + ToPx(element.newMousePointX) + "," + ToPx(element.newMousePointY) + ")rotate(" + element.rotateValue + "deg)";
    //MarkCanvas.style.transform = "translate(" + ToPx(element.newMousePointX) + "," + ToPx(element.newMousePointY) + ")rotate(" + element.rotateValue + "deg)";

    putLabel();
    for (var i = 0; i < Viewport_Total; i++) {
        displayRuler(i);
        displayMark(i);
    }
    //隱藏Table
    getByid("TableSelectNone").selected = true;
}
//跟loadAndViewImage()一樣，只是只調整Window Level而不重置設定
//註解請參考loadAndViewImage()
function loadAndViewImageByWindowLevwl(imageId, windowcenter, windowwidth, openOrigin, viewportNum0) {

    var dicomData = getPatientbyImageID[imageId];
    WindowLevelObj = {
        windowcenter: windowcenter,
        windowwidth: windowwidth,
        openOrigin: openOrigin
    }
    if (dicomData) parseDicomW(dicomData.image, dicomData.pixelData, viewportNum0, WindowLevelObj);
}