function initVR() {
    if (openVR == false) {
        document.body.style.perspective = "";
        document.body.style.transformStyle = "";
        getByid("3dYellow").checked = false;
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
                elem = getByid("3DDiv3_" + ll);
                elem.canvas().width = 2;
                elem.canvas().height = 2;
                elem.getElementsByClassName("cornerstone-canvas")[0] = null;
            } catch (ex) { }
        }
        // o3DListLength = 0;
        GetViewport(0).removeEventListener("mousemove", mousemove3D, false);
        GetViewport(0).removeEventListener("mousedown", mousedown3D, false);
        GetViewport(0).removeEventListener("mouseup", mouseup3D, false);
        GetViewport(0).removeEventListener("touchstart", touchstart3D, false);
        GetViewport(0).removeEventListener("touchmove", touchmove3D, false);
        GetViewport(0).removeEventListener("touchend", touchend3D, false);
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
            //GetViewport(i).addEventListener("wheel", wheelF, false);
        }
        cancelTools();
        openMouseTool = true;
        drawBorder(getByid("MouseOperation"));
        getByid("ImgVR").src = "../image/icon/black/b_3D_off.png";
        getByid("3dDisplay").style.display = "none";
        getByid("VR_setup").style.display = "none";
        getByid("3dCave").style.display = "none";

        if (getByid("OutSide3dDiv")) {
            delete getByid("OutSide3dDiv");
            getByid("OutSide3dDiv").parentElement.removeChild(getByid("OutSide3dDiv"));
        }
        try {
            getByid("MprCanvas1").style.display = "none";
            getByid("MprCanvas2").style.display = "none";
        } catch (ex) { }
        viewportNumber = 0;
        window.onresize();
        //SetTable();
        var alt0 = GetViewport(0).alt;
        var uid0 = SearchUid2Json(alt0);
        if (uid0)
            loadAndViewImage(Patient.Study[uid0.studyuid].Series[uid0.sreiesuid].Sop[uid0.sopuid].imageId, null, null, 0);
        o3DListLength = 0;
    } else if (openVR == true) {
        getByid("3dYellow").checked = true;
        openLink = false;
        changeLinkImg();
        openAnnotation = false;
        displayAnnotation();
        getByid("3dDisplay").style.display = "";
        getByid("SplitViewportDiv").style.display = "none";
        getByid("VR_setup").style.display = "";
        getByid("3dCave").style.display = "";
        cancelTools();
        getByid("ImgVR").src = "../image/icon/black/b_3D_on.png";
        var alt = GetViewport().alt;
        SetTable(1, 1);
        var uid = SearchUid2Json(alt);
        NowResize = true;
        GetViewport().NowCanvasSizeWidth = GetViewport().NowCanvasSizeHeight = null;
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
        }
        GetViewport(0).addEventListener("mousemove", mousemove3D, false);
        GetViewport(0).addEventListener("mousedown", mousedown3D, false);
        GetViewport(0).addEventListener("mouseup", mouseup3D, false);
        GetViewport(0).addEventListener("touchstart", touchstart3D, false);
        GetViewport(0).addEventListener("touchmove", touchmove3D, false);
        GetViewport(0).addEventListener("touchend", touchend3D, false);
        GetViewport(0).addEventListener("contextmenu", contextmenuF, false);
        for (var ll = 0; ll < o3DListLength; ll++) {
            var elem = getByid("3DDiv" + ll);
            GetViewport(0).appendChild(elem);
        }
        var list = sortInstance(alt);
        var WandH = getFixSize(window.innerWidth, window.innerHeight, GetViewport(0));
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
        var OutSide3dDiv = document.createElement("DIV");
        OutSide3dDiv.id = "OutSide3dDiv";
        OutSide3dDiv.addEventListener("contextmenu", contextmenuF, false);

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
            if (catchError == true && openVR == true) {
                openRendering = false;
                img2darkByClass("VR", !openVR);
                getByid("ImgVR").onclick();
                return;
            }
            if (checkRender == o3DListLength) {
                sleep(100).then(() => {
                    if ((getByid("3DDiv" + (o3DListLength - 1)).thickness - Thickness) - (getByid("3DDiv" + 0).thickness - Thickness) < 0) {
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
                        img2darkByClass("VR", !openVR);
                    })
                })
            }
        }

        for (var l = 0; l < list.length; l++) {
            const l2 = l;
            Thickness = 0;
            var big = 10000000000000000000;
            cornerstone.loadAndCacheImage(list[l].imageId, {
                usePDFJS: true
            }).then(function (image) {
                try {
                    var NewDiv = document.createElement("DIV");
                    NewDiv.addEventListener("contextmenu", contextmenuF, false);
                    NewDiv.addEventListener('cornerstoneimagerendered', onImageRendered);
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
                    NewDiv.style = "position:absolute;width:" + image.width + "px;height:" + image.height + "px;"; ///z-index:" + l2 + ";";
                    o3Dcount = list.length;
                    OutSide3dDiv.appendChild(NewDiv);
                    getByid("3DDiv" + l2).parentNode.replaceChild(NewDiv, getByid("3DDiv" + l2));
                    showTheImage(NewDiv, image, '3d', null, null);
                    NewDiv.style = "transform:rotate3d(0, 0, 0 , 0deg) translateZ(-" + l2 + "px);;position:absolute;width:" + WandH[0] + "px;height:" + WandH[1] + "px;"; //z-index:" + l2 + ";";
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
                    img2darkByClass("VR", !openVR);
                    getByid("ImgVR").onclick();
                    return;
                }
            }, function (err) {
                alert(err);
            });

        }

        GetViewport(0).appendChild(OutSide3dDiv);
        getByid("OutSide3dDiv").parentNode.replaceChild(OutSide3dDiv, getByid("OutSide3dDiv"));
        getByid("OutSide3dDiv").style.transformStyle = "preserve-3d";

        Thickness = -Thickness + big;
        return;
    }
}

var Unit8Canvas = [];

function Alpha3D() {
    if (!openVR && !openMPR) return;
    zoomRatio3D = 1;
    var r0 = parseFloat((100 - 0) / 85);
    var g0 = parseFloat((50 - 0) / 85);
    var b0 = parseFloat((35 - 0) / 85);

    var r1 = parseFloat((255 - 190) / 85);
    var g1 = parseFloat((220 - 120) / 85);
    var b1 = parseFloat((180 - 65) / 85);
    var r2 = parseFloat((190 - 100) / 85);
    var g2 = parseFloat((120 - 50) / 85);
    var b2 = parseFloat((65 - 35) / 85);

    var rList = [];
    var gList = [];
    var bList = [];

    for (var i = 0; i <= 85; i++) {
        rList.push(parseInt(0 + r0 * i));
        gList.push(parseInt(0 + g0 * i));
        bList.push(parseInt(0 + b0 * i));
    }
    for (var i = 0; i <= 85; i++) {
        rList.push(parseInt(100 + r2 * i));
        gList.push(parseInt(50 + g2 * i));
        bList.push(parseInt(35 + b2 * i));
    }
    for (var i = 0; i <= 85; i++) {
        rList.push(parseInt(190 + r1 * i));
        gList.push(parseInt(120 + g1 * i));
        bList.push(parseInt(65 + b1 * i));
    }

    for (var ll = 0; ll < o3DListLength; ll++) {
        if (getByid("o3DMip").selected == true && openVR) break;
        var canvas1 = getByid("3DDiv" + ll).canvas();
        canvas1.addEventListener("mousedown", mousedownFocus3D, false);
        canvas1.addEventListener("mousemove", mousemoveFocus3D, false);
        canvas1.addEventListener("mouseup", mouseupFocus3D, false);
        var ctx1 = canvas1.getContext("2d");
        var imageData = ctx1.getImageData(0, 0, canvas1.width, canvas1.height);
        var imageBuffer = imageData.data;
        if (openCave == true) {
            for (let i = 0; i < imageBuffer.length; i += 4) {
                if (imageBuffer[i] <= 25 && imageBuffer[i + 1] <= 25 && imageBuffer[i + 2] <= 25) {
                    imageBuffer[i + 3] = 0;
                }
            }
        } else if (getByid("o3DAirways").selected == true) {
            var tempcolor = 0;
            for (let i = 0; i < imageBuffer.length; i += 4) {
                tempcolor = 128 - Math.abs(128 - imageBuffer[i]);
                imageBuffer[i] = 93;
                imageBuffer[i + 1] = 238;
                imageBuffer[i + 2] = 238;
                imageBuffer[i + 3] = tempcolor <= 25 ? 0 : tempcolor;

            }
        } else if (getByid("3dYellow").checked == true) {
            if (getByid("3dSmooth").checked == true) {
                for (let i = 0; i < imageBuffer.length; i += 4) {
                    if (imageBuffer[i] <= 25 && imageBuffer[i + 1] <= 25 && imageBuffer[i + 2] <= 25) {
                        imageBuffer[i + 3] = 0;
                    } else {
                        imageBuffer[i] = rList[imageBuffer[i]];
                        imageBuffer[i + 1] = gList[imageBuffer[i + 1]];
                        imageBuffer[i + 2] = bList[imageBuffer[i + 2]];
                        imageBuffer[i + 3] = (imageBuffer[i] + imageBuffer[i + 1] + imageBuffer[i + 2]) / 3 * 2;
                        imageBuffer[i + 3] = (imageBuffer[i + 3] * o3DAlphaValue) / 100;
                    }
                }
            } else {
                for (let i = 0; i < imageBuffer.length; i += 4) {
                    if (imageBuffer[i] <= 25 && imageBuffer[i + 1] <= 25 && imageBuffer[i + 2] <= 25) {
                        imageBuffer[i + 3] = 0;
                    } else {
                        imageBuffer[i] = rList[imageBuffer[i]];
                        imageBuffer[i + 1] = gList[imageBuffer[i + 1]];
                        imageBuffer[i + 2] = bList[imageBuffer[i + 2]];
                        imageBuffer[i + 3] = (imageBuffer[i + 3] * o3DAlphaValue) / 100;
                    }
                }
            }
        } else {
            if (getByid("3dSmooth").checked == true) {
                for (let i = 0; i < imageBuffer.length; i += 4) {
                    imageBuffer[i + 3] = imageBuffer[i];
                    imageBuffer[i + 3] = (imageBuffer[i + 3] * o3DAlphaValue) / 100;
                }
            } else {
                for (let i = 0; i < imageBuffer.length; i += 4) {
                    if (imageBuffer[i] <= 25 && imageBuffer[i + 1] <= 25 && imageBuffer[i + 2] <= 25) {
                        imageBuffer[i + 3] = 0;
                    } else {
                        imageBuffer[i + 3] = (imageBuffer[i + 3] * o3DAlphaValue) / 100;
                    }
                }
            }
        }
        ctx1.putImageData(imageData, 0, 0);
        displayMark(null, null, null, null, null, getByid("3DDiv" + ll));
    }

    if (o3Dcount == o3DListLength) {
        for (var k = 0; k < parseInt(getByid('3dInsertText').value); k++) {
            for (var ll = o3DListLength - 1; ll >= 0; ll--) {
                getByid("3DDiv" + ll).id = "3DDiv" + (ll * 2);
            }
            o3DListLength = o3DListLength * 2 - 1;

            var WandH;
            if (openVR) WandH = getViewportFixSize(window.innerWidth, window.innerHeight, 1, 1);
            else if (openMPR) WandH = getViewportFixSize(window.innerWidth, window.innerHeight, 2, 2);

            for (var ll = 0; ll < o3DListLength; ll++) {
                if (ll % 2 != 0) {
                    var NewDiv = document.createElement("DIV");
                    NewDiv.addEventListener("contextmenu", contextmenuF, false);
                    NewDiv.id = "3DDiv" + ll;
                    NewDiv.className = "o3DDiv";
                    NewDiv.alt = getByid("3DDiv" + (ll - 1)).alt;
                    NewDiv.width = getByid("3DDiv" + (ll - 1)).width;
                    NewDiv.height = getByid("3DDiv" + (ll - 1)).height;
                    NewDiv.style.width = getByid("3DDiv" + (ll - 1)).style.width;
                    NewDiv.style.height = getByid("3DDiv" + (ll - 1)).style.height;
                    NewDiv.thickness = (getByid("3DDiv" + (ll - 1)).thickness + getByid("3DDiv" + (ll + 1)).thickness) / 2;
                    NewDiv.style = "position:absolute;width:" + NewDiv.width + "px;height:" + NewDiv.height + "px;z-index:" + ll + ";";
                    var NewCanvas = document.createElement("CANVAS");
                    NewCanvas.className = "cornerstone-canvas";
                    NewCanvas.width = NewDiv.width;
                    NewCanvas.height = NewDiv.height;
                    NewCanvas.style.width = NewDiv.style.width;
                    NewCanvas.style.height = NewDiv.style.height;
                    NewCanvas.getContext('2d').globalAlpha = 0.5;;
                    var sourceCtx = getByid("3DDiv" + (ll - 1)).canvas();
                    NewCanvas.getContext('2d').drawImage(sourceCtx, 0, 0);
                    sourceCtx = getByid("3DDiv" + (ll + 1)).canvas();
                    NewCanvas.getContext('2d').drawImage(sourceCtx, 0, 0);
                    NewCanvas.getContext('2d').globalAlpha = 1.0;
                    NewDiv.appendChild(NewCanvas);
                    if (openVR == true) getByid('OutSide3dDiv').appendChild(NewDiv);
                    else if (openMPR == true) getByid('OutSide3dDiv').appendChild(NewDiv);
                    getByid("3DDiv" + ll).parentNode.replaceChild(NewDiv, getByid("3DDiv" + ll));
                    NewDiv.style = "transform:rotate3d(0, 0, 0 , 0deg) translateZ(-" + ll + "px);;position:absolute;width:" + WandH[0] + "px;height:" + WandH[1] + "px;";
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
                }
            }

        }
    }

    for (var ll = 0; ll < o3DListLength; ll++) {
        var canvas1 = getByid("3DDiv" + ll).canvas();
        if (!parseInt(canvas1.style.width) >= 1) {
            canvas1.style.width = canvas.style.width;
            canvas1.style.height = canvas.style.height;
        }
        canvas1.style = "position: absolute;top: 50%;left:50%; margin: -" + (parseInt(canvas1.style.height) / 2) +
            "px 0 0 -" + (parseInt(canvas1.style.width) / 2) + "px;width:" + canvas1.style.width + ";height:" + canvas1.style.height + ";";
    }
    // if (openMPR == false) return;
    Unit8Canvas = [];
    var o3Dcanvas = getByid("3DDiv" + 0).canvas();
    for (var l = 0; l < o3DListLength; l++) {
        canvasCtx0 = getByid("3DDiv" + l).canvas().getContext("2d");
        canvasCtx = canvasCtx0.getImageData(0, 0, o3Dcanvas.width, o3Dcanvas.height);
        var buffer = new ArrayBuffer(canvasCtx.data.length);
        var binary = new Uint8Array(buffer);
        for (var i = 0; i < binary.length; i++) {
            binary[i] = canvasCtx.data[i];
        }
        Unit8Canvas.push(binary);
    }
    //////////////////////
    o3d_3degree = parseInt(getByid("3DskinText").value);
    //if (o3d_3degree >= o3DListLength) o3d_3degree = o3DListLength - 1;
    var WandH;
    if (openVR) WandH = getViewportFixSize(window.innerWidth, window.innerHeight, 1, 1);
    else if (openMPR) WandH = getViewportFixSize(window.innerWidth, window.innerHeight, 2, 2);

    for (var ll = 0; ll < o3d_3degree; ll++) {

        var VrDistance = get3dDistance();

        var NewDiv = document.createElement("DIV");
        var o3Dcanvas = getByid("3DDiv" + 0).canvas();
        NewDiv.addEventListener("contextmenu", contextmenuF, false);
        NewDiv.id = "3DDiv2_" + ll;
        NewDiv.className = "o3DDiv";
        NewDiv.width = o3Dcanvas.width;
        NewDiv.height = o3DListLength;
        NewDiv.style.width = getByid("3DDiv" + 0).style.width;
        NewDiv.style.height = getByid("3DDiv" + 0).style.height;
        NewDiv.style.position = "absolute";
        NewDiv.rotatePosition = ll * (canvas.height / o3DListLength);
        NewDiv.zPosition = ((canvas.height / o3d_3degree) * (o3d_3degree - ll)) - (canvas.height - VrDistance) / 2; //( (canvas.height / 2)-(canvas.height / o3d_3degree) * 0));

        var NewCanvas = document.createElement("CANVAS");
        NewCanvas.className = "cornerstone-canvas";
        NewCanvas.width = o3Dcanvas.width;
        NewCanvas.height = o3DListLength;
        NewCanvas.style.width = o3Dcanvas.width + "px";
        NewCanvas.style.height = ( /*o3DListLength * */ /*(parseInt(canvas.style.height) / parseFloat(GetViewport().imageHeight)) **/ VrDistance) + "px"; //(NewCanvas.height * (parseInt(canvas.style.height) / parseFloat(GetViewport().imageHeight)) * o3d_3degree) + "px";
        NewCanvas.originWidth = parseFloat(NewCanvas.style.width);
        NewCanvas.originHeight = parseFloat(NewCanvas.style.height);
        NewCanvas.rotatePosition = ll * (canvas.height / o3DListLength);
        var imgData2 = NewCanvas.getContext("2d").getImageData(0, 0, NewCanvas.width, NewCanvas.height);
        if (getByid("3DDiv" + (o3DListLength - 1)).thickness - Thickness - (getByid("3DDiv" + 0).thickness - Thickness) < 0) {
            for (var l = 0; l < o3DListLength; l++) {
                for (var dataH = l; dataH == l; dataH += 1) {
                    for (var dataW = 0; dataW < NewCanvas.width * 4; dataW += 4) {
                        imgData2.data[(dataH) * NewCanvas.width * 4 + dataW] = Unit8Canvas[l][(parseInt(( /*o3d_3degree -*/ ll) * (canvas.height / o3d_3degree))) * o3Dcanvas.width * 4 + (dataW) + 0];
                        imgData2.data[(dataH) * NewCanvas.width * 4 + dataW + 1] = Unit8Canvas[l][(parseInt(( /*o3d_3degree -*/ ll) * (canvas.height / o3d_3degree))) * o3Dcanvas.width * 4 + dataW + 1];
                        imgData2.data[(dataH) * NewCanvas.width * 4 + dataW + 2] = Unit8Canvas[l][(parseInt(( /*o3d_3degree -*/ ll) * (canvas.height / o3d_3degree))) * o3Dcanvas.width * 4 + dataW + 2];
                        imgData2.data[(dataH) * NewCanvas.width * 4 + dataW + 3] = Unit8Canvas[l][(parseInt(( /*o3d_3degree -*/ ll) * (canvas.height / o3d_3degree))) * o3Dcanvas.width * 4 + dataW + 3];
                    }
                }
            }
        } else {
            for (var l = 0; l < o3DListLength; l++) {
                for (var dataH = l; dataH == l; dataH += 1) {
                    for (var dataW = 0; dataW < NewCanvas.width * 4; dataW += 4) {
                        imgData2.data[(dataH) * NewCanvas.width * 4 + dataW] = Unit8Canvas[o3DListLength - l - 1][(parseInt(( /*o3d_3degree -*/ ll) * (canvas.height / o3d_3degree))) * o3Dcanvas.width * 4 + (dataW) + 0];
                        imgData2.data[(dataH) * NewCanvas.width * 4 + dataW + 1] = Unit8Canvas[o3DListLength - l - 1][(parseInt(( /*o3d_3degree -*/ ll) * (canvas.height / o3d_3degree))) * o3Dcanvas.width * 4 + dataW + 1];
                        imgData2.data[(dataH) * NewCanvas.width * 4 + dataW + 2] = Unit8Canvas[o3DListLength - l - 1][(parseInt(( /*o3d_3degree -*/ ll) * (canvas.height / o3d_3degree))) * o3Dcanvas.width * 4 + dataW + 2];
                        imgData2.data[(dataH) * NewCanvas.width * 4 + dataW + 3] = Unit8Canvas[o3DListLength - l - 1][(parseInt(( /*o3d_3degree -*/ ll) * (canvas.height / o3d_3degree))) * o3Dcanvas.width * 4 + dataW + 3];
                    }
                }
            }
        }
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
        NewDiv.appendChild(NewCanvas);
        NewCanvas.getContext("2d").putImageData(imgData2, 0, 0);
        if (openVR == true || openMPR == true) getByid("OutSide3dDiv").appendChild(NewDiv);
        getByid("3DDiv2_" + ll).parentNode.replaceChild(NewDiv, getByid("3DDiv2_" + ll));
    }

    for (var ll = 0; ll < o3d_3degree; ll++) {
        var VrDistance = get3dDistance();

        var NewDiv = document.createElement("DIV");
        var o3Dcanvas = getByid("3DDiv" + 0).canvas();
        NewDiv.addEventListener("contextmenu", contextmenuF, false);
        NewDiv.id = "3DDiv3_" + ll;
        NewDiv.className = "o3DDiv";
        NewDiv.width = o3DListLength;
        NewDiv.height = o3Dcanvas.height;
        NewDiv.style.width = getByid("3DDiv" + 0).style.width;
        NewDiv.style.height = getByid("3DDiv" + 0).style.height;
        NewDiv.style.position = "absolute";
        NewDiv.rotatePosition = ll * (canvas.height / o3DListLength);
        NewDiv.zPosition = ((canvas.width / o3d_3degree) * (o3d_3degree - ll)) - (canvas.width - VrDistance) / 2;

        var NewCanvas = document.createElement("CANVAS");
        NewCanvas.className = "cornerstone-canvas";
        NewCanvas.width = o3DListLength;
        NewCanvas.height = o3Dcanvas.height;
        NewCanvas.style.width = VrDistance + "px"; //(NewCanvas.width * (parseInt(canvas.style.height) / parseFloat(GetViewport().imageHeight)) * o3d_3degree /*VrDistance*/ ) + "px";
        NewCanvas.style.height = o3Dcanvas.height + "px";
        NewCanvas.rotatePosition = ll * (canvas.height / o3DListLength);
        NewCanvas.originWidth = parseFloat(NewCanvas.style.width);
        NewCanvas.originHeight = parseFloat(NewCanvas.style.height);

        var imgData2 = NewCanvas.getContext("2d").getImageData(0, 0, NewCanvas.width, NewCanvas.height);

        if (getByid("3DDiv" + (o3DListLength - 1)).thickness - Thickness - (getByid("3DDiv" + 0).thickness - Thickness) < 0) {
            for (var l = 0; l < o3DListLength; l++) {
                for (var dataH = 0; dataH < NewCanvas.height; dataH += 1) {
                    for (var dataW = l * 4; dataW == l * 4; dataW += 4) {
                        imgData2.data[dataH * NewCanvas.width * 4 + dataW] = Unit8Canvas[l][( /*NewCanvas.height -*/ dataH) * o3Dcanvas.width * 4 + ( /*o3Dcanvas.width -*/ parseInt(( /*o3d_3degree -*/ ll) * (canvas.width / o3d_3degree))) * 4];
                        imgData2.data[dataH * NewCanvas.width * 4 + dataW + 1] = Unit8Canvas[l][( /*NewCanvas.height - */ dataH) * o3Dcanvas.width * 4 + ( /*o3Dcanvas.width -*/ parseInt(( /*o3d_3degree -*/ ll) * (canvas.width / o3d_3degree))) * 4 + 1];
                        imgData2.data[dataH * NewCanvas.width * 4 + dataW + 2] = Unit8Canvas[l][( /*NewCanvas.height -*/ dataH) * o3Dcanvas.width * 4 + ( /*o3Dcanvas.width -*/ parseInt(( /*o3d_3degree -*/ ll) * (canvas.width / o3d_3degree))) * 4 + 2];
                        imgData2.data[dataH * NewCanvas.width * 4 + dataW + 3] = Unit8Canvas[l][( /*NewCanvas.height - */ dataH) * o3Dcanvas.width * 4 + ( /*o3Dcanvas.width - */ parseInt(( /*o3d_3degree -*/ ll) * (canvas.width / o3d_3degree))) * 4 + 3];
                    }
                }
            }
        } else {
            for (var l = 0; l < o3DListLength; l++) {
                for (var dataH = 0; dataH < NewCanvas.height; dataH += 1) {
                    for (var dataW = l * 4; dataW == l * 4; dataW += 4) {
                        imgData2.data[dataH * NewCanvas.width * 4 + dataW] = Unit8Canvas[o3DListLength - l - 1][( /*NewCanvas.height -*/ dataH) * o3Dcanvas.width * 4 + ( /*o3Dcanvas.width -*/ parseInt(( /*o3d_3degree -*/ ll) * (canvas.width / o3d_3degree))) * 4];
                        imgData2.data[dataH * NewCanvas.width * 4 + dataW + 1] = Unit8Canvas[o3DListLength - l - 1][( /*NewCanvas.height - */ dataH) * o3Dcanvas.width * 4 + ( /*o3Dcanvas.width -*/ parseInt(( /*o3d_3degree -*/ ll) * (canvas.width / o3d_3degree))) * 4 + 1];
                        imgData2.data[dataH * NewCanvas.width * 4 + dataW + 2] = Unit8Canvas[o3DListLength - l - 1][( /*NewCanvas.height -*/ dataH) * o3Dcanvas.width * 4 + ( /*o3Dcanvas.width -*/ parseInt(( /*o3d_3degree -*/ ll) * (canvas.width / o3d_3degree))) * 4 + 2];
                        imgData2.data[dataH * NewCanvas.width * 4 + dataW + 3] = Unit8Canvas[o3DListLength - l - 1][( /*NewCanvas.height - */ dataH) * o3Dcanvas.width * 4 + ( /*o3Dcanvas.width - */ parseInt(( /*o3d_3degree -*/ ll) * (canvas.width / o3d_3degree))) * 4 + 3];
                    }
                }
            }
        }
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
        NewDiv.appendChild(NewCanvas);
        NewCanvas.getContext("2d").putImageData(imgData2, 0, 0);
        if (openVR == true || openMPR == true) getByid("OutSide3dDiv").appendChild(NewDiv);
        getByid("3DDiv3_" + ll).parentNode.replaceChild(NewDiv, getByid("3DDiv3_" + ll));
    }

    for (var ll = 0; ll < o3DListLength; ll++) {
        var canvas1 = getByid("3DDiv" + ll).canvas();
        var div1 = getByid("3DDiv" + ll);
        if (getByid("3dZipCheckbox").checked == true && parseInt(getByid("3dZipText").value) < o3DListLength) {
            //if (ll > parseInt(getByid("3dZipText").value) / 2 && ll < o3DListLength - parseInt(getByid("3dZipText").value) / 2)
            if (ll % parseInt(o3DListLength / parseFloat(getByid("3dZipText").value)) != 0)
                canvas1.style.display = "none";
        }
        if (getByid("o3DMip").selected == true && openVR) {
            div1.style.mixBlendMode = "lighten";
        }
    }
    //做定位到正確位置的動作
    for (var ll = 0; ll < o3d_3degree; ll++) {
        var canvas2 = getByid("3DDiv2_" + ll).canvas();
        canvas2.style = "position: absolute;top: 50%;left:50%;" +
            "margin:" + "" + ((getByid("3DDiv2_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().imageHeight)))) +
            "px 0 0 -" + (parseInt(canvas2.style.width) / 2) + "px;" +
            "width:" + canvas2.style.width + ";height:" +
            canvas2.style.height + ";";
    }
    for (var ll = 0; ll < o3d_3degree; ll++) {
        var canvas3 = getByid("3DDiv3_" + ll).canvas();
        canvas3.style = "position: absolute;top: 50%;left:50%;" +
            "margin:" + "-" + (parseInt(canvas3.style.height) / 2) +
            "px 0 0 " + ((getByid("3DDiv3_" + ll).zPosition * -1 * (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().imageHeight)))) + "px;" +
            "height:" + canvas3.style.height + ";width:" +
            canvas3.style.width + ";";
    }
    VrDistance = get3dDistance();
    rotate3dVR(VrDistance);
    for (var ll = 0; ll < o3d_3degree; ll++) {
        var canvas2 = getByid("3DDiv2_" + ll).canvas();
        var div2 = getByid("3DDiv2_" + ll);
        canvas2.style.transformStyle = "preserve-3d";
        canvas2.style.transform = "rotateY(" + (0 + 0) + "deg) rotateX(" + (-90) + "deg)";
        if (getByid("o3DMip").selected == true && openVR) {
            div2.style.mixBlendMode = "lighten";
        }
    }
    for (var ll = 0; ll < o3d_3degree; ll++) {
        var canvas3 = getByid("3DDiv3_" + ll).canvas();
        var div3 = getByid("3DDiv3_" + ll);
        canvas3.style.transformStyle = "preserve-3d";
        canvas3.style.transform = "rotateY(" + (90 + 0) + "deg) rotateX(" + (0 + 0) + "deg)";
        if (getByid("o3DMip").selected == true && openVR) {
            div3.style.mixBlendMode = "lighten";
        }
    }
}