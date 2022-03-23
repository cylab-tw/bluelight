var buffer_mpr_X = 0;
var buffer_mpr_Y = 0;

function Anatomical_Section2(nextInstanceNumber) {
    if (ImgMPR == false) return;
    cancelTools();

    var NewCanvas;
    if (!getByid("MprCanvas2")) {
        NewCanvas = document.createElement("CANVAS");
        NewCanvas.id = "MprCanvas2";
    } else {
        NewCanvas = getByid("MprCanvas2");
    }

    var VrDistance = 0;
    VrDistance += getByid("3DDiv" + (o3DListLength - 1)).thickness - Thickness - (getByid("3DDiv" + 0).thickness - Thickness);
    VrDistance /= o3DListLength;
    if (VrDistance == 0) VrDistance = 1;
    if (VrDistance < 0) VrDistance *= -1;
    NewCanvas.style = "position: absolute;top: 50%;left:50%; margin: -" +
        (o3DListLength * (parseInt(canvas.style.height) / parseFloat(GetViewport().imageHeight)) * VrDistance / 2) +
        "px 0 0 -" + (parseInt(canvas.style.width) / 2) + "px;transform:scaleY(" + (-1 * Direction_VR) + ");";
    GetViewport(1).appendChild(NewCanvas);
    try {
        GetViewport(1).canvas().style.display = "none";
        GetViewportMark(1).style.display = "none";
    } catch (ex) { };

    var o3Dcanvas = getByid("3DDiv" + 0).canvas();
    NewCanvas.height = o3DListLength;
    NewCanvas.width = o3Dcanvas.width;

    //NewCanvas.style.imageRendering = "-moz-crisp-edges";
    NewCanvas.style.height = (NewCanvas.height * (parseInt(canvas.style.height) / parseFloat(GetViewport().imageHeight)) * VrDistance) + "px"; // + "px";
    NewCanvas.style.width = canvas.style.width;
    var imgData2 = NewCanvas.getContext("2d").getImageData(0, 0, NewCanvas.width, NewCanvas.height);
    var PointY = parseInt(o3DPointY);
    var PointX = parseInt(o3DPointX);
    var buffer_mpr_Y_t = buffer_mpr_Y;
    var PointY_t = PointY;
    if (nextInstanceNumber >= 0) nowInstanceNumber = nextInstanceNumber;
    else nowInstanceNumber = getNowInstance();

    if (getByid("mprLight").checked == true) {
        for (var l = 0; l < o3DListLength; l++) {
            var canvas1 = getByid("3DDiv" + l).canvas();
            var ctxData0 = canvas1.getContext("2d").createImageData(NewCanvas.width, 1);
            var ctxData = canvas1.getContext("2d").createImageData(NewCanvas.width, 1);

            for (var dataH = l; dataH == l; dataH += 1) {
                for (var dataW = 0; dataW < NewCanvas.width * 4; dataW += 4) {
                    ctxData0.data[dataW] = Uint8Canvas[l][(buffer_mpr_Y_t) * o3Dcanvas.width * 4 + dataW + 0];
                    ctxData0.data[dataW + 1] = Uint8Canvas[l][(buffer_mpr_Y_t) * o3Dcanvas.width * 4 + dataW + 1];
                    ctxData0.data[dataW + 2] = Uint8Canvas[l][(buffer_mpr_Y_t) * o3Dcanvas.width * 4 + dataW + 2];
                    ctxData0.data[dataW + 3] = Uint8Canvas[l][(buffer_mpr_Y_t) * o3Dcanvas.width * 4 + dataW + 3];
                    ctxData.data[dataW] = 221;
                    ctxData.data[dataW + 1] = 53;
                    ctxData.data[dataW + 2] = 119;
                    ctxData.data[dataW + 3] = 255;
                }
            }
            canvas1.getContext("2d").putImageData(ctxData0, 0, buffer_mpr_Y_t);
            canvas1.getContext("2d").putImageData(ctxData, 0, PointY_t);
        }
        buffer_mpr_Y = PointY;
    }
    // var SeriesCount = getSeriesAmount();
    for (var l = 0; l < o3DListLength; l++) {
        for (var dataH = l; dataH == l; dataH += 1) {
            for (var dataW = 0; dataW < NewCanvas.width * 4; dataW += 4) {
                if (dataW == PointX * 4) {
                    imgData2.data[dataH * NewCanvas.width * 4 + dataW] = 38;
                    imgData2.data[dataH * NewCanvas.width * 4 + dataW + 1] = 140;
                    imgData2.data[dataH * NewCanvas.width * 4 + dataW + 2] = 191;
                    imgData2.data[dataH * NewCanvas.width * 4 + dataW + 3] = 255;
                } else if (dataH == parseInt(nowInstanceNumber * (o3DListLength / SeriesCount)) + 0) {
                    imgData2.data[dataH * NewCanvas.width * 4 + dataW] = 255;
                    imgData2.data[dataH * NewCanvas.width * 4 + dataW + 1] = 255;
                    imgData2.data[dataH * NewCanvas.width * 4 + dataW + 2] = 0;
                    imgData2.data[dataH * NewCanvas.width * 4 + dataW + 3] = 255;
                } else {
                    imgData2.data[dataH * NewCanvas.width * 4 + dataW] = Uint8Canvas[l][(PointY) * o3Dcanvas.width * 4 + dataW + 0];
                    imgData2.data[dataH * NewCanvas.width * 4 + dataW + 1] = Uint8Canvas[l][(PointY) * o3Dcanvas.width * 4 + dataW + 1];
                    imgData2.data[dataH * NewCanvas.width * 4 + dataW + 2] = Uint8Canvas[l][(PointY) * o3Dcanvas.width * 4 + dataW + 2];
                    imgData2.data[dataH * NewCanvas.width * 4 + dataW + 3] = 255;
                }
            }
        }
    }
    NewCanvas.getContext("2d").putImageData(imgData2, 0, 0);
}

function Anatomical_Section(nextInstanceNumber) {
    if (openMPR == false) return;
    cancelTools();
    var NewCanvas;
    if (!getByid("MprCanvas1")) {
        NewCanvas = document.createElement("CANVAS");
        NewCanvas.id = "MprCanvas1";
    } else {
        NewCanvas = getByid("MprCanvas1");
    }

    var VrDistance = 0;
    VrDistance += getByid("3DDiv" + (o3DListLength - 1)).thickness - Thickness - (getByid("3DDiv" + 0).thickness - Thickness);
    VrDistance /= o3DListLength;

    if (VrDistance < 0) VrDistance *= -1;
    if (VrDistance == 0) VrDistance = 1;
    NewCanvas.style = "position: absolute;top: 50%;left:50%; margin: -" + (parseInt(canvas.style.height) / 2) +
        "px 0 0 -" + (o3DListLength * (parseInt(canvas.style.height) / parseFloat(GetViewport().imageHeight)) * VrDistance / 2) + "px;" +
        "transform:rotate(" + (-90) + "deg) scaleY(" + (1) + ") scaleX(" + (Direction_VR) + ");";

    GetViewport(0).appendChild(NewCanvas);
    try {
        GetViewport(0).canvas().style.display = "none";
        GetViewportMark(0).style.display = "none";
    } catch (ex) { };

    var o3Dcanvas = getByid("3DDiv" + 0).canvas();
    //NewCanvas.style.imageRendering = "-moz-crisp-edges";
    NewCanvas.height = o3Dcanvas.height;
    NewCanvas.width = o3DListLength;
    NewCanvas.style.height = canvas.style.height;

    NewCanvas.style.width = (NewCanvas.width * (parseInt(canvas.style.height) / parseFloat(GetViewport().imageHeight)) * VrDistance) + "px";


    var imgData2 = NewCanvas.getContext("2d").getImageData(0, 0, NewCanvas.width, NewCanvas.height);
    var PointX = parseInt(o3DPointX);
    var PointY = parseInt(o3DPointY);
    var buffer_mpr_X_t = buffer_mpr_X;
    var PointX_t = PointX;
    if (nextInstanceNumber >= 0) nowInstanceNumber = nextInstanceNumber;
    else nowInstanceNumber = getNowInstance();
    if (getByid("mprLight").checked == true) {
        for (var l = 0; l < o3DListLength; l++) {
            var canvas1 = getByid("3DDiv" + l).canvas();
            var ctxData0 = canvas1.getContext("2d").createImageData(1, NewCanvas.height);
            var ctxData = canvas1.getContext("2d").createImageData(1, NewCanvas.height);
            for (var dataH = 0; dataH < NewCanvas.height; dataH += 1) {
                for (var dataW = l * 4; dataW == l * 4; dataW += 4) {
                    ctxData0.data[dataH * 4] = Uint8Canvas[l][dataH * o3Dcanvas.width * 4 + (buffer_mpr_X_t) * 4];
                    ctxData0.data[dataH * 4 + 1] = Uint8Canvas[l][dataH * o3Dcanvas.width * 4 + (buffer_mpr_X_t) * 4 + 1];
                    ctxData0.data[dataH * 4 + 2] = Uint8Canvas[l][dataH * o3Dcanvas.width * 4 + (buffer_mpr_X_t) * 4 + 2];
                    ctxData0.data[dataH * 4 + 3] = Uint8Canvas[l][dataH * o3Dcanvas.width * 4 + (buffer_mpr_X_t) * 4 + 3];
                    ctxData.data[dataH * 4] = 38;
                    ctxData.data[dataH * 4 + 1] = 140;
                    ctxData.data[dataH * 4 + 2] = 191;
                    ctxData.data[dataH * 4 + 3] = 255;
                }
            }
            canvas1.getContext("2d").putImageData(ctxData0, buffer_mpr_X_t, 0);
            canvas1.getContext("2d").putImageData(ctxData, PointX_t, 0);
        }
        buffer_mpr_X = PointX;
    }
    for (var l = 0; l < o3DListLength; l++) {
        for (var dataH = 0; dataH < NewCanvas.height; dataH += 1) {
            for (var dataW = l * 4; dataW == l * 4; dataW += 4) {
                if (dataH == PointY) {
                    imgData2.data[dataH * NewCanvas.width * 4 + dataW] = 221;
                    imgData2.data[dataH * NewCanvas.width * 4 + dataW + 1] = 53;
                    imgData2.data[dataH * NewCanvas.width * 4 + dataW + 2] = 119;
                    imgData2.data[dataH * NewCanvas.width * 4 + dataW + 3] = 255;
                } else if (l == parseInt(nowInstanceNumber * (o3DListLength / SeriesCount)) + 0) {
                    imgData2.data[dataH * NewCanvas.width * 4 + dataW] = 255;
                    imgData2.data[dataH * NewCanvas.width * 4 + dataW + 1] = 255;
                    imgData2.data[dataH * NewCanvas.width * 4 + dataW + 2] = 0;
                    imgData2.data[dataH * NewCanvas.width * 4 + dataW + 3] = 255;
                } else {
                    imgData2.data[dataH * NewCanvas.width * 4 + dataW] = Uint8Canvas[l][dataH * o3Dcanvas.width * 4 + (PointX) * 4];
                    imgData2.data[dataH * NewCanvas.width * 4 + dataW + 1] = Uint8Canvas[l][dataH * o3Dcanvas.width * 4 + (PointX) * 4 + 1];
                    imgData2.data[dataH * NewCanvas.width * 4 + dataW + 2] = Uint8Canvas[l][dataH * o3Dcanvas.width * 4 + (PointX) * 4 + 2];
                    imgData2.data[dataH * NewCanvas.width * 4 + dataW + 3] = 255;
                }
            }
        }
    }
    NewCanvas.getContext("2d").putImageData(imgData2, 0, 0);
}

function initMPR() {
    if (openMPR == false) {
        for (var ll = 0; ll < o3DListLength; ll++) {
            try {
                var elem = getByid("3DDiv" + ll);
                elem.canvas().width = 2;
                elem.canvas().height = 2;
                elem.getElementsByClassName("VrCanvas")[0] = null;
                delete elem.canvas();
                elem.parentElement.removeChild(elem);
                delete elem;
            } catch (ex) { }
        }
        for (var ll = 0; ll < o3d_3degree; ll++) {
            try {
                var elem = getByid("3DDiv2_" + ll);
                elem.canvas().width = 2;
                elem.canvas().height = 2;
                elem.getElementsByClassName("VrCanvas")[0] = null;
                delete elem;
                elem = getByid("3DDiv3_" + ll);
                elem.canvas().width = 2;
                elem.canvas().height = 2;
                elem.getElementsByClassName("VrCanvas")[0] = null;
                delete elem;
            } catch (ex) { }
        }
        GetViewport(3).removeEventListener("mousemove", mousemove3D, false);
        GetViewport(3).removeEventListener("mousedown", mousedown3D, false);
        GetViewport(3).removeEventListener("mouseup", mouseup3D, false);
        GetViewport(3).removeEventListener("touchstart", touchstart3D, false);
        GetViewport(3).removeEventListener("touchmove", touchmove3D, false);
        GetViewport(3).removeEventListener("touchend", touchend3D, false);
        GetViewport(0).removeEventListener("mousemove", Anatomical_SectionMouseMove0, false);
        GetViewport(0).removeEventListener("mousedown", Anatomical_SectionMouseDown0, false);
        GetViewport(0).removeEventListener("mouseup", Anatomical_SectionMouseMouseup0, false);
        GetViewport(0).removeEventListener("wheel", Wheel, false);
        GetViewport(1).removeEventListener("mousemove", Anatomical_SectionMouseMove, false);
        GetViewport(1).removeEventListener("mousedown", Anatomical_SectionMouseDown, false);
        GetViewport(1).removeEventListener("mouseup", Anatomical_SectionMouseMouseup, false);
        GetViewport(1).removeEventListener("wheel", Wheel, false);
        cancelTools();
        openMouseTool = true;
        drawBorder(getByid("MouseOperation"));
        getByid("ImgMPR").src = "../image/icon/black/b_AdvancedMode_off.png";
        getByid("3dDisplay").style.display = "none";
        getByid("mprLightLabel").style.display = "none";
        try {
            getByid("MprCanvas1").style.display = "none";
            getByid("MprCanvas2").style.display = "none";
        } catch (ex) { }
        if (getByid("OutSide3dDiv")) {
            delete getByid("OutSide3dDiv");
            getByid("OutSide3dDiv").parentElement.removeChild(getByid("OutSide3dDiv"));
        }
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

        }
        viewportNumber = 0;
        window.onresize();
        //SetTable();
        o3DListLength = 0;
        var alt0 = GetViewport(0).alt;
        var uid0 = SearchUid2Json(alt0);
        //set_BL_model('MouseTool');
        //mouseTool();
        if (uid0)
            loadAndViewImage(Patient.Study[uid0.studyuid].Series[uid0.sreiesuid].Sop[uid0.sopuid].imageId, null, null, 0);
        canvas = GetViewport().canvas()
        //getByid("MouseOperation").onclick();
    } else if (openMPR == true) {
        openLink = false;
        changeLinkImg();
        openAnnotation = false;
        displayAnnotation();
        getByid("3dDisplay").style.display = "";
        getByid("mprLightLabel").style.display = "";
        getByid("SplitViewportDiv").style.display = "none";
        cancelTools();
        getByid("ImgMPR").src = "../image/icon/black/b_AdvancedMode_on.png";
        var alt = GetViewport().alt;
        SetTable(2, 2);
        var uid = SearchUid2Json(alt);
        NowResize = true;
        GetViewport().NowCanvasSizeWidth = GetViewport().NowCanvasSizeHeight = null;
        viewportNumber = 2;
        loadAndViewImage(Patient.Study[uid.studyuid].Series[uid.sreiesuid].Sop[uid.sopuid].imageId);
        for (var i1 = 0; i1 < Viewport_Total; i1++) {
            GetViewport(i1).removeEventListener("contextmenu", contextmenuF, false);
            GetViewport(i1).removeEventListener("mousemove", Mousemove, false);
            GetViewport(i1).removeEventListener("mousedown", Mousedown, false);
            GetViewport(i1).removeEventListener("mouseup", Mouseup, false);
            GetViewport(i1).removeEventListener("mouseout", Mouseout, false);
            GetViewport(i1).removeEventListener("wheel", Wheel, false);
            GetViewport(i1).removeEventListener("mousedown", thisF, false);
            GetViewport(i1).removeEventListener("touchstart", touchstartF, false);
            GetViewport(i1).removeEventListener("touchend", touchendF, false);
            GetViewport(i1).addEventListener("touchstart", thisF, false);
            GetViewport(i1).addEventListener("mousedown", thisF, false);
            //GetViewport(i).addEventListener("wheel", wheelF, false);
        }
        GetViewport().removeEventListener("touchstart", thisF, false);
        GetViewport().removeEventListener("mousedown", thisF, false);
        GetViewport().addEventListener("contextmenu", contextmenuF, false);
        GetViewport().addEventListener("mouseout", Mouseout, false);
        GetViewport().addEventListener("touchstart", touchstartF, false);
        GetViewport().addEventListener("touchmove", touchmoveF, false);
        GetViewport().addEventListener("touchend", touchendF, false);
        GetViewport().addEventListener("wheel", Wheel, false);
        GetViewport(3).addEventListener("mousemove", mousemove3D, false);
        GetViewport(3).addEventListener("mousedown", mousedown3D, false);
        GetViewport(3).addEventListener("mouseup", mouseup3D, false);
        GetViewport(3).addEventListener("touchstart", touchstart3D, false);
        GetViewport(3).addEventListener("touchmove", touchmove3D, false);
        GetViewport(3).addEventListener("touchend", touchend3D, false);
        GetViewport(3).addEventListener("contextmenu", contextmenuF, false);

        GetViewport(0).addEventListener("mousemove", Anatomical_SectionMouseMove0, false);
        GetViewport(0).addEventListener("mousedown", Anatomical_SectionMouseDown0, false);
        GetViewport(0).addEventListener("mouseup", Anatomical_SectionMouseMouseup0, false);
        GetViewport(0).addEventListener("wheel", Wheel, false);
        GetViewport(1).addEventListener("mousemove", Anatomical_SectionMouseMove, false);
        GetViewport(1).addEventListener("mousedown", Anatomical_SectionMouseDown, false);
        GetViewport(1).addEventListener("mouseup", Anatomical_SectionMouseMouseup, false);
        GetViewport(1).addEventListener("wheel", Wheel, false);
        for (var ll = 0; ll < o3DListLength; ll++) {
            var elem = getByid("3DDiv" + ll);
            GetViewport(3).appendChild(elem);
        }
        var list = sortInstance(alt);
        //var WandH = getFixSize(window.innerWidth, window.innerHeight, GetViewport(0));
        var WandH = getViewportFixSize(window.innerWidth, window.innerHeight, 2, 2);
        if (o3DListLength != list.length) {
            for (var ll = 0; ll < o3DListLength; ll++) {
                try {
                    var elem = getByid("3DDiv" + ll);
                    elem.canvas().width = 2;
                    elem.canvas().height = 2;
                    elem.getElementsByClassName("VrCanvas")[0] = null;
                    delete elem.canvas();
                    elem.parentElement.removeChild(elem);
                    delete elem;
                } catch (ex) { }
            }
        }
        if (o3d_3degree >= 0) {
            for (var ll = 0; ll < o3d_3degree; ll++) {
                try {
                    var elem = getByid("3DDiv2_" + ll);
                    elem.canvas().width = 2;
                    elem.canvas().height = 2;
                    elem.getElementsByClassName("VrCanvas")[0] = null;
                    delete elem.canvas();
                    elem.parentElement.removeChild(elem);
                    delete elem;
                } catch (ex) { }
            }
            for (var ll = 0; ll < o3d_3degree; ll++) {
                try {
                    var elem = getByid("3DDiv3_" + ll);
                    elem.canvas().width = 2;
                    elem.canvas().height = 2;
                    elem.getElementsByClassName("VrCanvas")[0] = null;
                    delete elem.canvas();
                    elem.parentElement.removeChild(elem);
                    delete elem;
                } catch (ex) { }
            }
        }

        o3DListLength = list.length;
        Thickness = 0;
        var big = 100000000000000000000000000000;
        var OutSide3dDiv = document.createElement("DIV");
        OutSide3dDiv.id = "OutSide3dDiv";

        var checkRender = 0;
        openRendering = true;
        img2darkByClass("Rendering", !openRendering);

        function sleep(time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        }
        var catchError = false;
        function onImageRendered() {
            if (catchError == true && openMPR == true) {
                openRendering = false;
                img2darkByClass("MPR", !openMPR);
                getByid("ImgMPR").onclick();
                return;
            }

            sleep(100).then(() => {
                Direction_VR = 1;
                if ((getByid("3DDiv" + (o3DListLength - 1)).thickness - Thickness) - (getByid("3DDiv" + 0).thickness - Thickness) < 0) {
                    Direction_VR = -1;
                    var thicknessList = [];
                    for (var ll = 0; ll < o3DListLength; ll++) {
                        var div1 = getByid("3DDiv" + ll);
                        thicknessList.push(div1.thickness);
                    }
                    for (var ll = 0; ll < o3DListLength; ll++) {
                        var div1 = getByid("3DDiv" + ll);
                        div1.thickness = thicknessList[o3DListLength - ll - 1];
                    }
                }
                Alpha3D();
                sleep(100).then(() => {
                    openRendering = false;
                    img2darkByClass("MPR", !openMPR);
                    setTimeout(getByid("MouseOperation").click(), 100);
                })
            })
        }


        function displayCanvas(DicomCanvas, image, pixelData) {
            DicomCanvas.width = image.width;
            DicomCanvas.height = image.height
            DicomCanvas.style.width = image.width + "px";
            DicomCanvas.style.height = image.height + "px";
            var ctx2 = DicomCanvas.getContext("2d");
            var imgData2 = ctx2.createImageData(image.width, image.height);
            var windowWidth = image.windowWidth;
            var windowCenter = image.windowCenter;
            if (getByid("o3DAngio").selected == true) {
                windowWidth = 332;
                windowCenter = 287;
            } else if (getByid("o3DAirways").selected == true) {
                //如果是肺氣管模型，使用對應的Window Level
                windowWidth = 409;
                windowCenter = -538;
            }
            var high = windowCenter + (windowWidth / 2);
            var low = windowCenter - (windowWidth / 2);
            var intercept = image.intercept;
            if (CheckNull(intercept)) intercept = 0;
            var slope = image.slope;
            if (CheckNull(slope)) slope = 1;

            var _firstNumber = 0;
            if (image.color == true) {
                for (var i = 0; i < imgData2.data.length; i += 4) {
                    _firstNumber = pixelData[i];
                    _firstNumber = parseInt(((_firstNumber * slope - low + intercept) / (high - low)) * 255);
                    imgData2.data[i + 0] = _firstNumber;
                    _firstNumber = pixelData[i + 1];
                    _firstNumber = parseInt(((_firstNumber * slope - low + intercept) / (high - low)) * 255);
                    imgData2.data[i + 1] = _firstNumber;
                    _firstNumber = pixelData[i + 2];
                    _firstNumber = parseInt(((_firstNumber * slope - low + intercept) / (high - low)) * 255);
                    imgData2.data[i + 2] = _firstNumber;
                    imgData2.data[i + 3] = 255;
                }
            }
            else if ((image.invert != true && GetViewport().openInvert == true) || (image.invert == true && GetViewport().openInvert == false)) {
                for (var i = 0; i < imgData2.data.length; i += 4) {
                    _firstNumber = pixelData[i / 4];
                    _firstNumber = parseInt(((_firstNumber * slope - low + intercept) / (high - low)) * 255);
                    imgData2.data[i + 0] = 255 - _firstNumber
                    imgData2.data[i + 1] = 255 - _firstNumber
                    imgData2.data[i + 2] = 255 - _firstNumber
                    imgData2.data[i + 3] = 255;
                }
            }
            else {
                for (var i = 0; i < imgData2.data.length; i += 4) {
                    _firstNumber = pixelData[i / 4];
                    _firstNumber = parseInt(((_firstNumber * slope - low + intercept) / (high - low)) * 255);
                    imgData2.data[i + 0] = _firstNumber
                    imgData2.data[i + 1] = _firstNumber
                    imgData2.data[i + 2] = _firstNumber
                    imgData2.data[i + 3] = 255;
                }
            }
            ctx2.putImageData(imgData2, 0, 0);
        }
        GetViewport(3).appendChild(OutSide3dDiv);
        getByid("OutSide3dDiv").parentNode.replaceChild(OutSide3dDiv, getByid("OutSide3dDiv"));
        getByid("OutSide3dDiv").style.transformStyle = "";
        /*if (getByid("3dStrengthenAuto").selected == true || getByid("3dStrengthenAlways").selected|| getByid("o3DMinIP").selected) {
            if (getByid("OutSide3dDiv")) getByid("OutSide3dDiv").style.transformStyle = "preserve-3d";
        } else {
            if (getByid("OutSide3dDiv")) getByid("OutSide3dDiv").style.transformStyle = "";
        }*/

        Thickness = -Thickness + big;

        for (var l = 0; l < list.length; l++) {
            const l2 = l;
            const image = getPatientbyImageID[list[l2].imageId].image;
            const pixelData = getPatientbyImageID[list[l2].imageId].pixelData;
            try {
                var NewDiv = document.createElement("DIV");
                NewDiv.addEventListener("contextmenu", contextmenuF, false);
                //NewDiv.addEventListener('cornerstoneimagerendered', onImageRendered);
                NewDiv.id = "3DDiv" + l2;
                NewDiv.className = "o3DDiv";
                NewDiv.alt = image.data.string('x00080018');
                NewDiv.width = image.width;
                NewDiv.height = image.height;
                NewDiv.style.width = image.width + "px";
                NewDiv.style.height = image.height + "px";
                NewDiv.thickness = parseFloat(image.data.string('x00200032').split("\\")[2]) * GetViewport().PixelSpacingX;
                if (NewDiv.thickness < Thickness) Thickness = NewDiv.thickness;
                if (NewDiv.thickness < big) big = NewDiv.thickness;

                o3Dcount = list.length;
                OutSide3dDiv.appendChild(NewDiv);
                getByid("3DDiv" + l2).parentNode.replaceChild(NewDiv, getByid("3DDiv" + l2));
                NewDiv.style.zIndex = l2;

                var NewCanvas = document.createElement("CANVAS");
                NewCanvas.className = "VrCanvas";
                NewDiv.appendChild(NewCanvas);
                displayCanvas(NewCanvas, image, pixelData);
                //showTheImage(NewDiv, image, '3d', null, null);
                NewDiv.style.transform = "rotate3d(0, 0, 0 , 0deg) translateZ(-" + l2 + "px)";
                NewDiv.style.width = WandH[0] + "px";
                NewDiv.style.height = WandH[1] + "px";
                //NewDiv.style = "transform:rotate3d(0, 0, 0 , 0deg) translateZ(-" + l2 + "px);;position:absolute;width:" + WandH[0] + "px;height:" + WandH[1] + "px;"; //z-index:" + l2 + ";";
                NewDiv.canvas = function () {
                    if (this.getElementsByClassName("VrCanvas")[0])
                        return this.getElementsByClassName("VrCanvas")[0];
                    else
                        return null;
                }
                NewDiv.ctx = function () {
                    if (this.getElementsByClassName("VrCanvas")[0])
                        return this.getElementsByClassName("VrCanvas")[0].getContext("2d");
                    else
                        return null;
                }
            } catch (ex) {
                catchError = true;
                if (openMPR == true) {
                    openMPR = false;
                    alert("Error, this image may not support 3D.");
                };
                openRendering = false;
                getByid("ImgMPR").onclick('error');
                return;
            };

        }
        onImageRendered();
        return;
    }
}


function display3DLine(x0, y0, x1, y1, color) {
    if (!color) color = "#00FF00";
    if (!openMPR) return;

    var MarkCanvas = GetViewportMark();
    var tempctx = MarkCanvas.getContext("2d");

    var lineWid = parseFloat(MarkCanvas.width) / parseFloat(Css(MarkCanvas, 'width'));
    var sizeCheck = false;
    if (sizeCheck == true && lineWid <= 0) {
        lineWid = parseFloat(Css(MarkCanvas, 'width')) / parseFloat(MarkCanvas.width);
        if (lineWid <= 1.5) lineWid = 1.5;
        lineWid *= Math.abs(parseFloat(MarkCanvas.width) / parseFloat(Css(MarkCanvas, 'width')));
    } else if (sizeCheck == true) {
        lineWid *= Math.abs(parseFloat(Css(MarkCanvas, 'width')) / parseFloat(MarkCanvas.width));
    } else if (lineWid <= 0) {
        lineWid = parseFloat(Css(MarkCanvas, 'width')) / parseFloat(MarkCanvas.width);
    }
    if (lineWid <= 1.5) lineWid = 1.5;
    tempctx.lineWidth = "" + ((Math.abs(lineWid)) * 1);
    nowInstanceNumber = getNowInstance;

    tempctx.beginPath();
    tempctx.strokeStyle = color;
    tempctx.fillStyle = color;

    tempctx.moveTo(x0, y0);
    tempctx.lineTo(x1, y1);
    tempctx.stroke();
    if (openAngle == 2) {
        tempctx.moveTo(x0, y0);
        tempctx.lineTo(x2, y2);
        tempctx.stroke();
    }
    tempctx.closePath();
}

function o3dWindowLevel() {
    var alt = GetViewport().alt;
    if (o3Dcount != o3DListLength) {
        for (var ll = o3DListLength - 1; ll >= o3Dcount; ll--) {
            var elem = getByid("3DDiv" + ll);
            elem.canvas().width = 2;
            elem.canvas().height = 2;
            elem.parentElement.removeChild(elem);
        }
    }
    o3DListLength = o3Dcount;
    for (var ll = 0; ll < o3DListLength; ll++) {
        try {
            var elem = getByid("3DDiv" + ll);
            elem.canvas().width = 2;
            elem.canvas().height = 2;
        } catch (ex) { }
    }
    if (o3d_3degree >= 0) {
        for (var ll = 0; ll < o3d_3degree; ll++) {
            var elem = getByid("3DDiv2_" + ll);
            elem.canvas().width = 2;
            elem.canvas().height = 2;
            elem.getElementsByClassName("VrCanvas")[0] = null;
            delete elem.canvas();
            elem.parentElement.removeChild(elem);
            delete elem;
        }
        for (var ll = 0; ll < o3d_3degree; ll++) {
            var elem = getByid("3DDiv3_" + ll);
            elem.canvas().width = 2;
            elem.canvas().height = 2;
            elem.getElementsByClassName("VrCanvas")[0] = null;
            delete elem.canvas();
            elem.parentElement.removeChild(elem);
            delete elem;
        }
    }
    var list = sortInstance(alt);
    var WandH;
    if (openVR) WandH = getViewportFixSize(window.innerWidth, window.innerHeight, 1, 1);
    else if (openMPR) WandH = getViewportFixSize(window.innerWidth, window.innerHeight, 2, 2);

    o3DListLength = list.length;
    var big = 10000000000000000000000000000;
    Thickness = 0;

    var checkRender = 0;
    openRendering = true;
    img2darkByClass("Rendering", !openRendering);

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    function onImageRendered() {
        Direction_VR = 1;
        sleep(100).then(() => {
            if ((getByid("3DDiv" + (o3DListLength - 1)).thickness - Thickness) - (getByid("3DDiv" + 0).thickness - Thickness) < 0) {
                var thicknessList = [];
                Direction_VR = -1;
                for (var ll = 0; ll < o3DListLength; ll++) {
                    var div1 = getByid("3DDiv" + ll);
                    thicknessList.push(div1.thickness);
                }
                for (var ll = 0; ll < o3DListLength; ll++) {
                    var div1 = getByid("3DDiv" + ll);
                    div1.thickness = thicknessList[o3DListLength - ll - 1];
                }
            }
            Alpha3D();
            sleep(100).then(() => {
                openRendering = false;
                if (openMPR) img2darkByClass("MPR", !openMPR);
                else if (openVR) img2darkByClass("VR", !openVR);
            })
        })

    }

    Thickness = 0;
    var big = 10000000000000000000;
    Thickness = -Thickness + big;
    for (var l = 0; l < list.length; l++) {
        const l2 = l;
        const image = getPatientbyImageID[list[l2].imageId].image;
        const pixelData = getPatientbyImageID[list[l2].imageId].pixelData;
        var NewDiv = document.createElement("DIV");
        NewDiv.addEventListener("contextmenu", contextmenuF, false);
        // NewDiv.addEventListener('cornerstoneimagerendered', onImageRendered);
        NewDiv.id = "3DDiv" + l2;
        NewDiv.className = "o3DDiv";
        NewDiv.alt = image.data.string('x00080018');
        NewDiv.thickness = parseFloat(image.data.string('x00200032').split("\\")[2]) * GetViewport().PixelSpacingX;
        if (NewDiv.thickness < Thickness) Thickness = NewDiv.thickness;
        if (NewDiv.thickness < big) big = NewDiv.thickness;
        NewDiv.width = image.width;
        NewDiv.height = image.height;
        NewDiv.style.width = image.width + "px";
        NewDiv.style.height = image.height + "px";
        NewDiv.style.zIndex = l2;
        //NewDiv.style = "position:absolute;width:" + image.width + "px;height:" + image.height + "px;z-index:" + l2 + ";";
        o3Dcount = list.length;
        if (openVR == true) GetViewport(0).appendChild(NewDiv);
        else if (openMPR == true) GetViewport(3).appendChild(NewDiv);
        getByid("3DDiv" + l2).parentNode.replaceChild(NewDiv, getByid("3DDiv" + l2));

        var NewCanvas = document.createElement("CANVAS");
        NewCanvas.className = "VrCanvas";
        NewDiv.appendChild(NewCanvas);
        displayCanvas(NewCanvas, image, pixelData);
        //showTheImage(NewDiv, image, '3d', null, null);
        NewDiv.style.transform = "rotate3d(0, 0, 0 , 0deg) translateZ(-" + l2 + "px)";
        NewDiv.style.width = WandH[0] + "px";
        NewDiv.style.height = WandH[1] + "px";
        //NewDiv.style = "transform:rotate3d(0, 0, 0 , 0deg) translateZ(-" + l2 + "px);;position:absolute;width:" + WandH[0] + "px;height:" + WandH[1] + "px;"; //z-index:" + l2 + ";";

        NewDiv.canvas = function () {
            if (this.getElementsByClassName("VrCanvas")[0])
                return this.getElementsByClassName("VrCanvas")[0];
            else
                return null;
        }
        NewDiv.ctx = function () {
            if (this.getElementsByClassName("VrCanvas")[0])
                return this.getElementsByClassName("VrCanvas")[0].getContext("2d");
            else
                return null;
        }
    }
    onImageRendered();
    return;
}