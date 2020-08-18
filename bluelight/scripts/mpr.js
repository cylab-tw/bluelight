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
                elem.getElementsByClassName("cornerstone-canvas")[0] = null;
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
                elem.getElementsByClassName("cornerstone-canvas")[0] = null;
                delete elem;
                elem = getByid("3DDiv3_" + ll);
                elem.canvas().width = 2;
                elem.canvas().height = 2;
                elem.getElementsByClassName("cornerstone-canvas")[0] = null;
                delete elem;
            } catch (ex) { }
        }
        GetViewport(3).removeEventListener("mousemove", mousemove3D, false);
        GetViewport(3).removeEventListener("mousedown", mousedown3D, false);
        GetViewport(3).removeEventListener("mouseup", mouseup3D, false);
        GetViewport(3).removeEventListener("touchstart", touchstart3D, false);
        GetViewport(3).removeEventListener("touchmove", touchmove3D, false);
        GetViewport(3).removeEventListener("touchend", touchend3D, false);
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

        }
        viewportNumber = 0;
        window.onresize();
        //SetTable();
        o3DListLength = 0;
        var alt0 = GetViewport(0).alt;
        var uid0 = SearchUid2Json(alt0);
        if (uid0)
            loadAndViewImage(Patient.Study[uid0.studyuid].Series[uid0.sreiesuid].Sop[uid0.sopuid].imageId, null, null, 0);
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
            GetViewport(i1).removeEventListener("mousemove", mousemoveF, false);
            GetViewport(i1).removeEventListener("mousedown", mousedownF, false);
            GetViewport(i1).removeEventListener("mouseup", mouseupF, false);
            GetViewport(i1).removeEventListener("mouseout", mouseoutF, false);
            GetViewport(i1).removeEventListener("wheel", wheelF, false);
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
        GetViewport().addEventListener("mousemove", mousemoveF, false);
        GetViewport().addEventListener("mousedown", mousedownF, false);
        GetViewport().addEventListener("mouseup", mouseupF, false);
        GetViewport().addEventListener("mouseout", mouseoutF, false);
        GetViewport().addEventListener("touchstart", touchstartF, false);
        GetViewport().addEventListener("touchmove", touchmoveF, false);
        GetViewport().addEventListener("touchend", touchendF, false);
        GetViewport().addEventListener("wheel", wheelF, false);
        GetViewport(3).addEventListener("mousemove", mousemove3D, false);
        GetViewport(3).addEventListener("mousedown", mousedown3D, false);
        GetViewport(3).addEventListener("mouseup", mouseup3D, false);
        GetViewport(3).addEventListener("touchstart", touchstart3D, false);
        GetViewport(3).addEventListener("touchmove", touchmove3D, false);
        GetViewport(3).addEventListener("touchend", touchend3D, false);
        GetViewport(3).addEventListener("contextmenu", contextmenuF, false);
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
                    elem.getElementsByClassName("cornerstone-canvas")[0] = null;
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
                    elem.getElementsByClassName("cornerstone-canvas")[0] = null;
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
                    elem.getElementsByClassName("cornerstone-canvas")[0] = null;
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
        var onImageRendered = function (e) {
            checkRender += 1;
            this.removeEventListener('cornerstoneimagerendered', onImageRendered);
            if (catchError == true && openMPR == true) {
                openRendering = false;
                img2darkByClass("MPR", !openMPR);
                getByid("ImgMPR").onclick();
                return;
            }
            if (checkRender == o3DListLength) {
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
                    })
                })
            }
        }
        for (var l = 0; l < list.length; l++) {
            const l2 = l;
            cornerstone.loadAndCacheImage(list[l].imageId, {
                usePDFJS: true
            }).then(function (image) {
                try {
                    var NewDiv = document.createElement("DIV");
                    NewDiv.addEventListener("contextmenu", contextmenuF, false);
                    NewDiv.addEventListener('cornerstoneimagerendered', onImageRendered);
                    NewDiv.id = "3DDiv" + l2;
                    NewDiv.className = "o3DDiv";
                    NewDiv.width = image.width;
                    NewDiv.height = image.height;
                    NewDiv.thickness = parseFloat(image.data.string('x00200032').split("\\")[2]) * GetViewport().PixelSpacingX;
                    if (NewDiv.thickness < Thickness) Thickness = NewDiv.thickness;
                    if (NewDiv.thickness < big) big = NewDiv.thickness;
                    NewDiv.style.width = image.width + "px";
                    NewDiv.style.height = image.height + "px";
                    NewDiv.alt = image.data.string('x00080018');
                    NewDiv.style.zIndex = l2;
                    // NewDiv.style = "position:absolute;width:" + image.width + "px;height:" + image.height + "px;z-index:" + l2 + ";";
                    o3Dcount = list.length;
                    OutSide3dDiv.appendChild(NewDiv);
                    getByid("3DDiv" + l2).parentNode.replaceChild(NewDiv, getByid("3DDiv" + l2));
                    showTheImage(NewDiv, image, '3d', null, null);
                    NewDiv.style.transform = "rotate3d(0, 0, 0 , 0deg) translateZ(-" + l2 + "px)";
                    NewDiv.style.width = WandH[0] + "px";
                    NewDiv.style.height = WandH[1] + "px";
                    //NewDiv.style = "transform:rotate3d(0, 0, 0 , 0deg) translateZ(-" + l2 + "px);;position:absolute;width:" + WandH[0] + "px;height:" + WandH[1] + "px;"; //z-index:" + l2 + ";";
                    NewDiv.canvas = function () {
                        if (this.getElementsByClassName("cornerstone-canvas")[0])
                            return this.getElementsByClassName("cornerstone-canvas")[0];
                        else
                            return null;
                    }
                    NewDiv.ctx = function () {
                        if (this.getElementsByClassName("cornerstone-canvas")[0])
                            return this.getElementsByClassName("cornerstone-canvas")[0].getContext("2d");
                        else
                            return null;
                    }
                } catch (ex) {
                    catchError = true;
                    alert("Error, this image may not support 3D.");
                    openRendering = false;
                    img2darkByClass("MPR", !openVR);
                    getByid("ImgMPR").onclick();
                    return;
                };
            }, function (err) {
                alert(err);
            });
        }
        GetViewport(3).appendChild(OutSide3dDiv);
        getByid("OutSide3dDiv").parentNode.replaceChild(OutSide3dDiv, getByid("OutSide3dDiv"));
        getByid("OutSide3dDiv").style.transformStyle = "";
        /*if (getByid("3dStrengthenAuto").selected == true || getByid("3dStrengthenAlways").selected) {
            if (getByid("OutSide3dDiv")) getByid("OutSide3dDiv").style.transformStyle = "preserve-3d";
        } else {
            if (getByid("OutSide3dDiv")) getByid("OutSide3dDiv").style.transformStyle = "";
        }*/

        Thickness = -Thickness + big;
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
    if (openAngel == 2) {
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
            elem.getElementsByClassName("cornerstone-canvas")[0] = null;
            delete elem.canvas();
            elem.parentElement.removeChild(elem);
            delete elem;
        }
        for (var ll = 0; ll < o3d_3degree; ll++) {
            var elem = getByid("3DDiv3_" + ll);
            elem.canvas().width = 2;
            elem.canvas().height = 2;
            elem.getElementsByClassName("cornerstone-canvas")[0] = null;
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

    var onImageRendered = function (e) {
        checkRender += 1;
        this.removeEventListener('cornerstoneimagerendered', onImageRendered);
        if (checkRender == o3DListLength) {
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
    }
    for (var l = 0; l < list.length; l++) {
        const l2 = l;
        cornerstone.loadAndCacheImage(list[l].imageId, {
            usePDFJS: true
        }).then(function (image) {
            var NewDiv = document.createElement("DIV");
            NewDiv.addEventListener("contextmenu", contextmenuF, false);
            NewDiv.addEventListener('cornerstoneimagerendered', onImageRendered);
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
            showTheImage(NewDiv, image, '3d', null, null);
            NewDiv.style.transform = "rotate3d(0, 0, 0 , 0deg) translateZ(-" + l2 + "px)";
            NewDiv.style.width = WandH[0] + "px";
            NewDiv.style.height = WandH[1] + "px";
            //NewDiv.style = "transform:rotate3d(0, 0, 0 , 0deg) translateZ(-" + l2 + "px);;position:absolute;width:" + WandH[0] + "px;height:" + WandH[1] + "px;"; //z-index:" + l2 + ";";

            NewDiv.canvas = function () {
                if (this.getElementsByClassName("cornerstone-canvas")[0])
                    return this.getElementsByClassName("cornerstone-canvas")[0];
                else
                    return null;
            }
            NewDiv.ctx = function () {
                if (this.getElementsByClassName("cornerstone-canvas")[0])
                    return this.getElementsByClassName("cornerstone-canvas")[0].getContext("2d");
                else
                    return null;
            }
        }, function (err) {
            alert(err);
        });
    }
    Thickness = -Thickness + big;
    return;
}