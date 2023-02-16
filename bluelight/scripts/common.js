function cancelTools() {
    openMouseTool = false;
    openWindow = false;
    openZoom = false;
    openMeasure = false;
    openRotate = false;
    openAngle = 0;
    textWC.style.display = "none";
    textWW.style.display = "none";
    magnifierDiv.style.display = "none";
    getByid("MeasureLabel").style.display = "none";
    getByid("AngleLabel").style.display = "none";
    getByid("WindowLevelDiv").style.display = "none";
    getByid("labelZoom").style.display = "none";
    getByid("labelPlay").style.display = "none";
    getByid("textZoom").style.display = "none";
    getByid("textPlay").style.display = "none";
    getByid('playvideo').src = '../image/icon/black/b_CinePlay.png';
    getByid("WindowDefault").selected = true;
    displayWindowLevel();
    displayMark();
    for (var i = 0; i < Viewport_Total; i++) {
        GetViewport(i).openPlay = false;
    }
    PlayTimer();
}

function displayRuler(viewportNum0) {
    var viewportNum = viewportNum0 >= 0 ? viewportNum0 : viewportNumber;
    try {
        var downRule = getClass("downRule");
        var offsetWidth = GetViewport(viewportNum).offsetWidth;
        downRule[viewportNum].width = offsetWidth;
        downRule[viewportNum].style.left = '50%';
        downRule[viewportNum].style.transform = 'translateX(-50%)';

        var tempctx = downRule[viewportNum].getContext("2d");
        tempctx.clearRect(0, 0, offsetWidth, 20);
        tempctx.strokeStyle = "#FFFFFF";
        tempctx.lineWidth = "2";
        tempctx.beginPath();
        var x1 = 0;
        var y1 = 0;
        var canvas = GetViewport(viewportNum).canvas();
        tempctx.moveTo(0 + (offsetWidth / 2) - (40 * GetViewport(viewportNum).PixelSpacingX) * (parseFloat(canvas.style.width) / GetViewport(viewportNum).imageWidth), 10);
        tempctx.lineTo((90 * GetViewport(viewportNum).PixelSpacingX) * (parseFloat(canvas.style.width) / GetViewport(viewportNum).imageWidth) + (offsetWidth / 2) - (40 * GetViewport(viewportNum).PixelSpacingX) * (parseFloat(canvas.style.width) / GetViewport(viewportNum).imageWidth), 10);
        for (var i = 0; i < 10; i++) {
            tempctx.moveTo(x1 + (offsetWidth / 2) - (40 * GetViewport(viewportNum).PixelSpacingX) * (parseFloat(canvas.style.width) / GetViewport(viewportNum).imageWidth), y1);
            tempctx.lineTo(x1 + (offsetWidth / 2) - (40 * GetViewport(viewportNum).PixelSpacingX) * (parseFloat(canvas.style.width) / GetViewport(viewportNum).imageWidth), y1 + 20);
            tempctx.stroke();
            x1 += (10 * GetViewport(viewportNum).PixelSpacingX) * (parseFloat(canvas.style.width) / GetViewport(viewportNum).imageWidth);
        }
        tempctx.closePath();
    } catch (ex) { }
    displayRuler2(viewportNum0);
}

function displayRuler2(viewportNum0) {
    var viewportNum = viewportNum0 >= 0 ? viewportNum0 : viewportNumber;

    try {
        var leftRule = getClass("leftRule");
        var offsetHeight = GetViewport(viewportNum).offsetHeight;
        leftRule[viewportNum].height = offsetHeight;
        leftRule[viewportNum].style.left = 10 + bordersize + "px";
        leftRule[viewportNum].style.top = '50%';
        leftRule[viewportNum].style.transform = 'translateY(-50%)';
        var tempctx = leftRule[viewportNum].getContext("2d");
        var canvas = GetViewport(viewportNum).canvas();
        tempctx.clearRect(0, 0, 20, offsetHeight);
        tempctx.strokeStyle = "#FFFFFF";
        tempctx.lineWidth = "2";
        tempctx.beginPath();
        var x1 = 0;
        var y1 = 0;
        tempctx.moveTo(0, 0 + (offsetHeight / 2) - (40 * GetViewport(viewportNum).PixelSpacingY) * (parseFloat(canvas.style.height) / GetViewport(viewportNum).imageHeight));
        tempctx.lineTo(0, (90 * GetViewport(viewportNum).PixelSpacingY) * (parseFloat(canvas.style.height) / GetViewport(viewportNum).imageHeight) - (40 * GetViewport(viewportNum).PixelSpacingY) * (parseFloat(canvas.style.height) / GetViewport(viewportNum).imageHeight) + (offsetHeight / 2));
        tempctx.stroke();
        for (var i = 0; i < 10; i++) {
            tempctx.moveTo(x1, y1 + (offsetHeight / 2) - (40 * GetViewport(viewportNum).PixelSpacingY) * (parseFloat(canvas.style.height) / GetViewport(viewportNum).imageHeight));
            tempctx.lineTo(x1 + 20, y1 + (offsetHeight / 2) - (40 * GetViewport(viewportNum).PixelSpacingY) * (parseFloat(canvas.style.height) / GetViewport(viewportNum).imageHeight));
            tempctx.stroke();
            y1 += (10 * GetViewport(viewportNum).PixelSpacingY) * (parseFloat(canvas.style.height) / GetViewport(viewportNum).imageHeight);
        }
        tempctx.closePath();
    } catch (ex) { }
}

function resetViewport(viewportNum0) {
    var viewportNum = viewportNum0 >= 0 ? viewportNum0 : viewportNumber;
    GetViewport(viewportNum).NowCanvasSizeWidth = GetViewport(viewportNum).NowCanvasSizeHeight = null;
    GetViewport(viewportNum).newMousePointX = GetViewport(viewportNum).newMousePointY = GetViewport().rotateValue = 0;
    GetViewport(viewportNum).windowCenterList = GetViewport(viewportNum).windowWidthList = null;
}

function PictureOnclick(series) {
    if (!openLeftImgClick) return;
    WindowOpen = false;
    cancelTools();
    resetViewport();
    //drawBorder(getByid("MouseOperation"));
    //NowSeries = '';
    let index = SearchUid2IndexBySeries(series);
    let i = index[0],
        j = index[1];
    for (var l = 0; l < Patient.Study[i].Series[j].SopAmount; l++) {
        if (Patient.Study[i].Series[j].Sop[l].InstanceNumber == 1) {
            loadAndViewImage((Patient.Study[i].Series[j].Sop[l].imageId));
            break;
        } else if (l == Patient.Study[i].Series[j].SopAmount - 1) {
            loadAndViewImage((Patient.Study[i].Series[j].Sop[l].imageId));
        }
    }
}


function LeftImg(str) {
    //暫時取消的功能
    return;
    /*var pic = getByid("LeftPicture");
    var img = document.createElement("IMG");
    if (str == "Dose") {
        img.src = "../image/icon/black/rtdose.png"
    }
    if (str == "Plan") {
        img.src = "../image/icon/black/rtplan.png"
    }
    if (str == "Struct") {
        img.src = "../image/icon/black/rtstruct.png"
    }
    pic.appendChild(img);*/
}

function SetToLeft(series, checki, patientid) {
    var pic = getByid("LeftPicture");
    var outleftimg = getClass("OutLeftImg");

    let patientid_div = null;
    for (var lf = 0; lf < outleftimg.length; lf++) {
        if (outleftimg[lf].PatientId == patientid) patientid_div = outleftimg[lf];
    }
    var out_div;
    if (!patientid_div) {
        out_div = document.createElement("DIV");
        out_div.className = "OutLeftImg";
        out_div.id = "OutLeftImg" + patientid;
        out_div.style = "border:" + bordersize + "px #FFA3FF groove;padding:1px 1px 1px 1px;";
        out_div.PatientId = patientid;
    } else {
        out_div = patientid_div;
    }
    var div = document.createElement("DIV");
    div.id = "dicomDivListDIV" + dicomImageCount;
    div.className = "LeftImg";
    if (checki >= 0) div.id = "dicomDivListDIV" + checki;
    div.style = "width:" + 65 + "px;height:" + 65 + "px;border:" + bordersize + "px #D3D9FF groove;";
    div.series = series;
    div.draggable = "true";
    div.style.touchAction = 'none';

    var mainDiv = document.createElement("DIV");
    mainDiv.id = "dicomDivList" + dicomImageCount;
    mainDiv.className = "dicomDivList";
    if (checki >= 0) mainDiv.id = "dicomDivList" + checki;
    mainDiv.style = "width:" + 65 + "px;height:" + 65 + "px;";
    mainDiv.onclick = function () {
        PictureOnclick(div.series);
    };
    mainDiv.canvas = function () {
        if (this.getElementsByClassName("LeftCanvas")[0])
            return this.getElementsByClassName("LeftCanvas")[0];
        else
            return null;
    }
    if (checki >= 0 && getByid("dicomDivList" + checki) && getByid("dicomDivList" + checki).canvas()) {
        mainDiv.appendChild(getByid("dicomDivList" + checki).canvas());
    }
    var smallDiv = document.createElement("DIV");
    smallDiv.id = "menu" + series;
    var rtssList = [];
    var colorList = [];
    var hideList = [];
    let index = SearchUid2IndexBySeries(series);
    let i = index[0],
        j = index[1];
    for (var k = 0; k < Patient.Study[i].Series[j].SopAmount; k++) {
        for (var n = 0; n < PatientMark.length; n++) {
            if (PatientMark[n].sop == Patient.Study[i].Series[j].Sop[k].SopUID) {
                if (rtssList.length == 0) {
                    rtssList.push(PatientMark[n].showName);
                    colorList.push(PatientMark[n].color);
                    hideList.push(PatientMark[n].hideName);
                } else {
                    var check = 0;
                    for (var o = 0; o < rtssList.length; o++) {
                        if (hideList[o] == PatientMark[n].hideName) {
                            check = 1;
                        }
                    }
                    if (check == 0) {
                        hideList.push(PatientMark[n].hideName);
                        rtssList.push(PatientMark[n].showName);
                        colorList.push(PatientMark[n].color);
                    }
                }
            }
        }
    }
    for (var o = 0; o < rtssList.length; o++) {
        div.style.height = parseInt(div.style.height) + 35 + "px";
        var label = document.createElement('LABEL');
        label.innerText = "" + rtssList[o];
        label.name = "" + hideList[o];
        label.style = "text-shadow:0px 0px 10px #fff, 0px 0px 10px #fff, 0px 0px 10px #fff, 0px 0px 10px #fff, 0px 0px 10px #fff, 0px 0px 10px #fff, 0px 0px 10px #fff;" +
            "color:" + colorList[o] + ";";
        var li1 = document.createElement('input');
        li1.type = "checkbox";
        li1.id = "dicomDivListLabel" + dicomImageCount + o;
        if (checki >= 0) li1.id = "dicomDivListLabel" + checki + o;
        li1.checked = true;
        li1.name = "" + hideList[o];
        li1.series = 'true';
        if (getByid("dicomDivListLabel" + checki + o)) {
            li1.checked = getByid("dicomDivListLabel" + checki + o).checked;
            li1.series = getByid("dicomDivListLabel" + checki + o).series;
            var elem = getByid("dicomDivListLabel" + checki + o);
            elem.parentElement.removeChild(elem);
        }
        label.oncontextmenu = function (e) {
            e.preventDefault();
        };
        //設定滑鼠按鍵事件
        label.onmousedown = function (e) {
            if (e.button == 2) {
                jump2Mark(this.name);
            }
        }
        li1.onchange = function () {
            getByid("MeasureLabel").style.display = "none";
            getByid("AngleLabel").style.display = "none";
            this.series = this.series == 'true' ? 'false' : 'true';
            for (var i = 0; i < Viewport_Total; i++) displayMark(i)
        };
        label.appendChild(li1);
        smallDiv.appendChild(label);
        smallDiv.appendChild(document.createElement("br"))
    }
    div.appendChild(mainDiv);
    div.appendChild(smallDiv);
    //NowSeries = div.series;

    out_div.appendChild(div);

    if (patientid_div) {
        //getByid("OutLeftImg" + patientid).parentNode.replaceChild(out_div, getByid("OutLeftImg" + patientid));
    } else {
        pic.appendChild(out_div);
    }
    if (checki >= 0)
        getByid("dicomDivListDIV" + checki).parentNode.replaceChild(div, getByid("dicomDivListDIV" + checki));
    else getByid("dicomDivListDIV" + dicomImageCount).parentNode.replaceChild(div, getByid("dicomDivListDIV" + dicomImageCount)); {
        getByid("LeftPicture").style = "display: flex;flex-direction: column;position: absolute;z-index: 9";
        if (parseInt(getByid("LeftPicture").offsetHeight) + 10 >= window.innerHeight - document.getElementsByClassName("container")[0].offsetTop - (bordersize * 2)) {
            getByid("LeftPicture").style = "overflow-y: scroll;display: flex;flex-direction: column;position: absolute;z-index: 9;height:" + (window.innerHeight - document.getElementsByClassName("container")[0].offsetTop - (bordersize * 2)) + "px;"
        }
    }

    return getByid("dicomDivList" + dicomImageCount);
}

function SetWindowWL(openOrigin) {
    getByid("MeasureLabel").style.display = "none";
    getByid("AngleLabel").style.display = "none";
    if (openLink == true) {
        for (var z = 0; z < Viewport_Total; z++) {
            GetViewport(z).windowCenterList = parseInt(textWC.value);
            GetViewport(z).windowWidthList = parseInt(textWW.value);
        }
        for (var z = 0; z < Viewport_Total; z++) {
            GetViewport(z).openVerticalFlip = GetViewport().openVerticalFlip;
            GetViewport(z).openHorizontalFlip = GetViewport().openHorizontalFlip;
            GetViewport(z).openInvert = GetViewport().openInvert;
            var sop = GetViewport(z).sop;

            var uid = SearchUid2Json(sop);
            if (uid) {
                if (z == viewportNumber)
                    loadAndViewImageByWindowLevwl(Patient.Study[uid.studyuid].Series[uid.sreiesuid].Sop[uid.sopuid].imageId, parseInt(textWC.value), parseInt(textWW.value), openOrigin, z);
                else
                    loadAndViewImageByWindowLevwl(Patient.Study[uid.studyuid].Series[uid.sreiesuid].Sop[uid.sopuid].imageId, parseInt(textWC.value), parseInt(textWW.value), false, z);
            }
        }
    } else {
        var sop = GetViewport().sop;
        GetViewport().windowCenterList = parseInt(textWC.value);
        GetViewport().windowWidthList = parseInt(textWW.value);
        var uid = SearchUid2Json(sop);
        loadAndViewImageByWindowLevwl(Patient.Study[uid.studyuid].Series[uid.sreiesuid].Sop[uid.sopuid].imageId, parseInt(textWC.value), parseInt(textWW.value), openOrigin);
    }
}

function magnifierIng(currX, currY) {
    var canvas = GetViewport().canvas();
    var zoom = parseFloat(getByid('textZoom').value);
    if ((zoom <= 25)) getByid('textZoom').value = zoom = 25;
    if (zoom >= 400) getByid('textZoom').value = zoom = 400;
    zoom /= 100;
    magnifierWidth = parseFloat(GetViewport().imageWidth / parseFloat(canvas.style.width)) * (magnifierWidth0 / zoom);
    magnifierHeight = parseFloat(GetViewport().imageHeight / parseFloat(canvas.style.height)) * (magnifierHeight0 / zoom);
    var magnifierCanvas = document.getElementById("magnifierCanvas");
    var magnifierCtx = magnifierCanvas.getContext("2d");
    magnifierCanvas.width = magnifierWidth;
    magnifierCanvas.height = magnifierHeight;
    magnifierCanvas.style.width = magnifierWidth0 + "px";
    magnifierCanvas.style.height = magnifierHeight0 + "px";
    magnifierCanvas.style.transform = "rotate(" + GetViewport().rotateValue + "deg)";
    magnifierCtx.clearRect(0, 0, magnifierWidth, magnifierHeight);

    var currX02 = Math.floor(currX) - magnifierWidth / 2;
    var currY02 = Math.floor(currY) - magnifierHeight / 2;
    magnifierCtx.drawImage(canvas, currX02, currY02, magnifierWidth, magnifierHeight, 0, 0, magnifierWidth, magnifierHeight);
    magnifierCtx.drawImage(GetViewportMark(), currX02, currY02, magnifierWidth, magnifierHeight, 0, 0, magnifierWidth, magnifierHeight);
}

function nextFrame(dir, frame) {
    getByid("MeasureLabel").style.display = "none";
    getByid("AngleLabel").style.display = "none";
    var dir0 = dir;
    if (openLink == true) {
        dir0 = 0;
        dir = 3
    };
    for (var linkF = dir0; linkF <= dir; linkF++) {
        var viewportNum = linkF;
        var sop = GetViewport(viewportNum).sop;
        var break1 = false;
        let index = SearchUid2Index(sop);
        let i = index[0],
            j = index[1],
            k = index[2];
        if (Patient.Study[i].Series[j].Sop[k].SopUID == sop) {
            var Onum = parseInt(Patient.Study[i].Series[j].Sop[k].InstanceNumber);
            var list = sortInstance(sop);
            for (var l = 0; l < list.length; l++) {
                if (break1 == true) break;
                if (list[l].InstanceNumber == Onum) {
                    if (l + frame < 0) {
                        loadAndViewImage(list[list.length + frame].imageId, null, null, viewportNum);
                        break1 = true;
                        break;
                    }
                    if (l + frame >= list.length) {
                        loadAndViewImage(list[0].imageId, null, null, viewportNum);
                        break1 = true;
                        break;
                    }
                    loadAndViewImage(list[l + frame].imageId, null, null, viewportNum);
                    break1 = true;
                    break;
                }
            }
        }
    }
}