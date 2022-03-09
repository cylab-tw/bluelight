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

function displayDicomTagsList(viewportNum0) {
    var viewportNum;
    if (viewportNum0 >= 0) viewportNum = viewportNum0;
    else viewportNum = viewportNumber
    dropTable(viewportNum);
    GetViewport(viewportNum).style.overflowY = "hidden";
    GetViewport(viewportNum).style.overflowX = "hidden";
    if (getByid("DICOMTagsSelect").selected == false) return;
    if (openDisplayMarkup == false) return;
    var Table = document.createElement("table");
    Table.id = "DicomTagsTable" + (viewportNum + 1);
    Table.className = "table table-dark table-striped";
    Table.setAttribute("border", 2);
    Table.style = "border-collapse:collapse";
    Table.style.color = "#ffffff";
    Table.style.position = "absolute";
    Table.style.backgroundColor = "black";
    //Table.style.right = "0px";
    Css(Table, 'zIndex', "20");

    var row0 = Table.insertRow(0);
    row0.setAttribute("border", 2);
    row0.style.backgroundColor = "#555555";
    var cells0 = row0.insertCell(0);
    cells0.innerHTML = "Tag";
    var cells0 = row0.insertCell(1);
    cells0.innerHTML = "Name";
    var cells0 = row0.insertCell(2);
    cells0.innerHTML = "Value";

    var rowCount = 1;
    for (var i = 0; i < GetViewport().DicomTagsList.length; i++) {
        var row = Table.insertRow(rowCount);
        row.setAttribute("border", 2);
        row.style.backgroundColor = "#151515";
        var cells = row.insertCell(0);
        cells.innerHTML = "" + GetViewport().DicomTagsList[i][0];
        cells = row.insertCell(1);
        cells.innerHTML = "" + GetViewport().DicomTagsList[i][1];
        cells = row.insertCell(2);
        if (GetViewport().DicomTagsList[i][2] && GetViewport().DicomTagsList[i][2].length > 100)
            cells.innerHTML = ("" + GetViewport().DicomTagsList[i][2]).substring(0, 99) + "...";
        else
            cells.innerHTML = "" + GetViewport().DicomTagsList[i][2];
        /*var dicomtag = GetViewport().DicomTagsList[i][0].replace("x", "");
        dicomtag = dicomtag.slice(0, 4) + "," + dicomtag.slice(4);
        cells.innerHTML = "" + dicomtag;

        cells = row.insertCell(1);
        if (GetViewport().DicomTagsList[i][1] && GetViewport().DicomTagsList[i][1].length > 100)
            cells.innerHTML = "";
        else
            cells.innerHTML = "" + GetViewport().DicomTagsList[i][1];*/
        rowCount++;
    }
    GetViewport(viewportNum).appendChild(Table);
    GetViewport(viewportNum).style.overflowY = "scroll";
    GetViewport(viewportNum).style.overflowX = "scroll";
}

function displayAIM(viewportNum0) {
    var viewportNum;
    if (viewportNum0 >= 0) viewportNum = viewportNum0;
    else viewportNum = viewportNumber
    var break1 = false;
    dropTable(viewportNum);
    GetViewport(viewportNum).style.overflowY = "hidden";
    GetViewport(viewportNum).style.overflowX = "hidden"
    if (getByid("AIMSelect").selected == false) return;
    if (openDisplayMarkup == false) return;
    var Table = document.createElement("table");
    Table.id = "AimTable" + (viewportNum + 1);
    Table.className = "table table-dark table-striped";
    Table.setAttribute("border", 2);
    Table.style = "border-collapse:collapse";
    Table.style.color = "#ffffff";
    Table.style.position = "absolute";
    Table.style.backgroundColor = "black";
    //Table.style.right = "0px";
    Css(Table, 'zIndex', "20");
    //SearchUid2Index
    var alt = GetViewport(viewportNum).alt;
    let index = SearchUid2Index(alt);
    if (!index) return;
    let i = index[0],
        j = index[1],
        k = index[2];
    for (var n = 0; n < PatientMark.length; n++) {
        if (break1 == true) break;
        if (PatientMark[n].sop == Patient.Study[i].Series[j].Sop[k].SopUID) {
            var rowCount = 0;
            for (var m = 0; m < PatientMark[n].mark.length; m++) {
                if (PatientMark[n].mark[m].type == "Characteristic") {
                    if (m != 0) {
                        var row00 = Table.insertRow(rowCount);
                        row00.setAttribute("border", 0);
                        row00.style.height = "25px"
                        rowCount++;
                    }
                    var row0 = Table.insertRow(rowCount);
                    row0.style.backgroundColor = "#DDDDDD";
                    row0.style.color = "#000000";
                    row0.setAttribute("border", 2);
                    var cells0 = row0.insertCell(0);
                    cells0.innerHTML = "" + PatientMark[n].mark[m].markTitle;
                    cells0.colSpan = 3;
                    rowCount++;
                    row0 = Table.insertRow(rowCount);
                    row0.style.backgroundColor = "#555555";
                    cells0 = row0.insertCell(0);
                    cells0.innerHTML = "option";
                    cells0 = row0.insertCell(1);
                    cells0.innerHTML = "value";
                    cells0 = row0.insertCell(2);
                    cells0.innerHTML = "code";
                    rowCount++;
                    for (var o = 0; o < PatientMark[n].mark[m].markX.length; o += 1) {
                        var tempMark = PatientMark[n].mark[m];
                        var row = Table.insertRow(rowCount);
                        row.setAttribute("border", 2);
                        row.style.backgroundColor = "#151515";
                        var cells = row.insertCell(0);
                        cells.innerHTML = "" + tempMark.markX[o];
                        cells = row.insertCell(1);
                        cells.innerHTML = "" + tempMark.markY[o];
                        cells = row.insertCell(2);
                        cells.innerHTML = "" + tempMark.markZ[o];
                        rowCount++;
                    }

                }
            }
            break1 = true;
            break;
        }
    }
    GetViewport(viewportNum).appendChild(Table);
    GetViewport(viewportNum).style.overflowY = "scroll";
    GetViewport(viewportNum).style.overflowX = "scroll";
}

function displayRular(viewportNum0) {
    var viewportNum;
    if (viewportNum0 >= 0) viewportNum = viewportNum0;
    else viewportNum = viewportNumber;
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
    displayRular2(viewportNum0);
}

function displayRular2(viewportNum0) {
    var viewportNum = viewportNumber
    if (viewportNum0 >= 0) viewportNum = viewportNum0;

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

function displayAngleRular() {
    if (!openAngle) return;
    if (parseInt(Math.sqrt(
        Math.pow(AngleXY1[0] / GetViewport().PixelSpacingX - AngleXY0[0] / GetViewport().PixelSpacingX, 2) +
        Math.pow(AngleXY1[1] / GetViewport().PixelSpacingY - AngleXY0[1] / GetViewport().PixelSpacingY, 2), 2)) <= 0) return;

    var MarkCanvas = GetViewportMark();
    var tempctx = MarkCanvas.getContext("2d");

    var lineWid = parseFloat(MarkCanvas.width) / parseFloat(Css(MarkCanvas, 'width'));

    if (lineWid <= 0) lineWid = parseFloat(Css(MarkCanvas, 'width')) / parseFloat(MarkCanvas.width);
    if (lineWid <= 1.5) lineWid = 1.5;

    tempctx.lineWidth = "" + ((Math.abs(lineWid)) * 1);

    tempctx.beginPath();
    tempctx.strokeStyle = "#00FF00";
    tempctx.fillStyle = "#00FF00";

    tempctx.moveTo(AngleXY0[0], AngleXY0[1]);
    tempctx.lineTo(AngleXY1[0], AngleXY1[1]);
    tempctx.stroke();
    if (openAngle == 2) {
        tempctx.moveTo(AngleXY0[0], AngleXY0[1]);
        tempctx.lineTo(AngleXY2[0], AngleXY2[1]);
    }
    tempctx.stroke();
    tempctx.closePath();
    tempctx.beginPath();
    tempctx.strokeStyle = "#FF0000";
    tempctx.fillStyle = "#FF0000";
    tempctx.arc(AngleXY0[0], AngleXY0[1], 3, 0, 2 * Math.PI);
    tempctx.fill();

    tempctx.arc(AngleXY1[0], AngleXY1[1], 3, 0, 2 * Math.PI);
    tempctx.fill();
    if (openAngle == 2) {
        tempctx.strokeStyle = "#FF0000";
        tempctx.fillStyle = "#FF0000";
        tempctx.arc(AngleXY0[0], AngleXY0[1], 3, 0, 2 * Math.PI);
        tempctx.fill();
        tempctx.arc(AngleXY2[0], AngleXY2[1], 3, 0, 2 * Math.PI);
        tempctx.fill();
    }
    tempctx.closePath();
}

function displayMeasureRular() {
    if (!openMeasure) return;
    if (parseInt(Math.sqrt(
        Math.pow(MeasureXY2[0] / GetViewport().PixelSpacingX - MeasureXY[0] / GetViewport().PixelSpacingX, 2) +
        Math.pow(MeasureXY2[1] / GetViewport().PixelSpacingY - MeasureXY[1] / GetViewport().PixelSpacingY, 2), 2)) <= 0) return;

    var MarkCanvas = GetViewportMark();
    var tempctx = MarkCanvas.getContext("2d");

    var lineWid = parseFloat(MarkCanvas.width) / parseFloat(Css(MarkCanvas, 'width'));

    if (lineWid <= 0) lineWid = parseFloat(Css(MarkCanvas, 'width')) / parseFloat(MarkCanvas.width);
    if (lineWid <= 1.5) lineWid = 1.5;

    tempctx.lineWidth = "" + ((Math.abs(lineWid)) * 1);

    tempctx.beginPath();
    tempctx.strokeStyle = "#FF0000";
    tempctx.fillStyle = "#FF0000";

    tempctx.moveTo(MeasureXY[0], MeasureXY[1]);
    tempctx.lineTo(MeasureXY2[0], MeasureXY2[1]);
    tempctx.stroke();
    tempctx.closePath();

    tempctx.strokeStyle = "#00FF00";
    tempctx.fillStyle = "#00FF00";
    tempctx.beginPath();
    tempctx.arc(MeasureXY[0], MeasureXY[1], 3, 0, 2 * Math.PI);
    tempctx.arc(MeasureXY2[0], MeasureXY2[1], 3, 0, 2 * Math.PI);
    tempctx.fill();
    tempctx.closePath();
}

function displayMark(size, magnifier, currX0, currY0, viewportNum0, o3DElement) {
    var alpha = (parseFloat(getByid('markAlphaText').value)) / 100;
    //var lineSize = parseFloat(getByid('markSizeText').value);
    var fill = getByid("markFillCheck").checked;

    if (openLink == true) {
        for (var z = 0; z < Viewport_Total; z++) {
            GetViewport(z).openMark = GetViewport().openMark
        }
    }
    var viewportNum;
    if (viewportNum0 >= 0) viewportNum = viewportNum0;
    else viewportNum = viewportNumber;
    if (GetViewport(viewportNum).openMark == false) return;
    var currX = 0,
        currY = 0;
    if (currX0 && currY0) {
        currX = currX0;
        currY = currY0;
    }
    var MarkCanvas = GetViewportMark(viewportNum);
    if (o3DElement) {
        viewportNum = viewportNumber;
        MarkCanvas = o3DElement.canvas();
    };
    var tempctx = MarkCanvas.getContext("2d");
    if (!o3DElement) {
        MarkCanvas.style.width = GetViewport(viewportNum).canvas().style.width;
        MarkCanvas.style.height = GetViewport(viewportNum).canvas().style.height;
        tempctx.clearRect(0, 0, GetViewport(viewportNum).imageWidth, GetViewport(viewportNum).imageHeight);
    }
    
    //var originW = Css(MarkCanvas, 'width');
    //var originH = Css(MarkCanvas, 'height');
    var sizeCheck = false;
    // if (size == false && (parseFloat(Css(MarkCanvas, 'width')) != GetViewport(viewportNum).imageWidth || parseFloat(Css(MarkCanvas, 'height')) != GetViewport(viewportNum).imageHeight)) {
    if (size == false) {
        sizeCheck = true;
        if (!o3DElement) {
            MarkCanvas.width = GetViewport(viewportNum).imageWidth;
            MarkCanvas.height = GetViewport(viewportNum).imageHeight;
        }
    }

    tempctx.lineWidth = "" + getMarkSize(MarkCanvas, sizeCheck); //((Math.abs(lineWid)) * 2 * lineSize);
    NowResize = false;

    function setMarkColor(tempctx, color) {
        if (getByid("WhiteSelect").selected == true) {
            tempctx.strokeStyle = "#FFFFFF";
            tempctx.fillStyle = "#FFFFFF";
        } else if (getByid("BlueSelect").selected == true) {
            tempctx.strokeStyle = "#0000FF";
            tempctx.fillStyle = "#0000FF";
        } else if (getByid("RedSelect").selected == true) {
            tempctx.strokeStyle = "#FF0000";
            tempctx.fillStyle = "#FF0000";
        } else {
            if (color) {
                tempctx.strokeStyle = color;
                tempctx.fillStyle = color;
            }
        }
    }


    if (GetViewport(viewportNum).openMark == true) {
        //注意：標記顏色選擇紅色跟自動都會先初始化為紅色
        tempctx.strokeStyle = "#FF0000";
        tempctx.fillStyle = "#FF0000";
        setMarkColor(tempctx);

        tempctx.lineJoin = tempctx.lineCap = 'round';

        var alt = GetViewport(viewportNum).alt;
        if (o3DElement) alt = o3DElement.alt;
        let index = SearchUid2Index(alt);
        if (!index) return;
        let i = index[0],
            j = index[1],
            k = index[2];

        for (var n = 0; n < PatientMark.length; n++) {
            if (PatientMark[n].sop == Patient.Study[i].Series[j].Sop[k].SopUID) {
                for (var m = 0; m < PatientMark[n].mark.length; m++) {
                    if (PatientMark[n].mark[m].type == "SEG") {
                        let checkRtss = 0;
                        checkRtss = checkMark(i, j, n);
                        if (checkRtss == 0) continue;
                        Css(MarkCanvas, 'zIndex', "8");
                        function mirrorImage(ctx, image, x = 0, y = 0, horizontal = false, vertical = false) {
                            ctx.save();  // save the current canvas state
                            ctx.setTransform(
                                horizontal ? -1 : 1, 0, // set the direction of x axis
                                0, vertical ? -1 : 1,   // set the direction of y axis
                                x + (horizontal ? image.width : 0), // set the x origin
                                y + (vertical ? image.height : 0)   // set the y origin
                            );
                            ctx.drawImage(image, 0, 0);
                            ctx.restore(); // restore the state as it was when this function was called
                        }
                        tempctx.globalAlpha = alpha;
                        mirrorImage(tempctx, PatientMark[n].mark[m].canvas, 0, 0, GetViewport(viewportNum).openHorizontalFlip, GetViewport(viewportNum).openVerticalFlip)
                        // tempctx.drawImage(PatientMark[n].mark[m].canvas, 0, 0, GetViewport(viewportNum).imageWidth, GetViewport(viewportNum).imageHeight);
                        tempctx.globalAlpha = 1;
                        var globalCompositeOperation = tempctx.globalCompositeOperation;
                        if (getByid("BlueSelect").selected == true) {
                            tempctx.globalCompositeOperation = "source-in";
                            tempctx.fillStyle = "blue";
                            tempctx.fillRect(0, 0, GetViewport(viewportNum).imageWidth, GetViewport(viewportNum).imageHeight);
                        } else if (getByid("RedSelect").selected == true) {
                            tempctx.globalCompositeOperation = "source-in";
                            tempctx.fillStyle = "red";
                            tempctx.fillRect(0, 0, GetViewport(viewportNum).imageWidth, GetViewport(viewportNum).imageHeight);
                        } else if (getByid("WhiteSelect").selected == true) {
                            tempctx.globalCompositeOperation = "source-in";
                            tempctx.fillStyle = "white";
                            tempctx.fillRect(0, 0, GetViewport(viewportNum).imageWidth, GetViewport(viewportNum).imageHeight);
                        }
                        tempctx.globalCompositeOperation = globalCompositeOperation;
                        tempctx.restore();
                    } else if (PatientMark[n].mark[m].type == "Overlay") {
                        let checkRtss = 0;
                        checkRtss = checkMark(i, j, n);
                        if (checkRtss == 0) continue;
                        Css(MarkCanvas, 'zIndex', "8");
                        function mirrorImage(ctx, image, x = 0, y = 0, horizontal = false, vertical = false) {
                            ctx.save();  // save the current canvas state
                            ctx.setTransform(
                                horizontal ? -1 : 1, 0, // set the direction of x axis
                                0, vertical ? -1 : 1,   // set the direction of y axis
                                x + (horizontal ? image.width : 0), // set the x origin
                                y + (vertical ? image.height : 0)   // set the y origin
                            );
                            ctx.drawImage(image, 0, 0);
                            ctx.restore(); // restore the state as it was when this function was called
                        }
                        tempctx.globalAlpha = alpha;
                        mirrorImage(tempctx, PatientMark[n].mark[m].canvas, 0, 0, GetViewport(viewportNum).openHorizontalFlip, GetViewport(viewportNum).openVerticalFlip)
                        // tempctx.drawImage(PatientMark[n].mark[m].canvas, 0, 0, GetViewport(viewportNum).imageWidth, GetViewport(viewportNum).imageHeight);
                        tempctx.globalAlpha = 1;
                        var globalCompositeOperation = tempctx.globalCompositeOperation;
                        if (getByid("BlueSelect").selected == true) {
                            tempctx.globalCompositeOperation = "source-in";
                            tempctx.fillStyle = "blue";
                            tempctx.fillRect(0, 0, GetViewport(viewportNum).imageWidth, GetViewport(viewportNum).imageHeight);
                        } else if (getByid("RedSelect").selected == true) {
                            tempctx.globalCompositeOperation = "source-in";
                            tempctx.fillStyle = "red";
                            tempctx.fillRect(0, 0, GetViewport(viewportNum).imageWidth, GetViewport(viewportNum).imageHeight);
                        } else if (getByid("WhiteSelect").selected == true) {
                            tempctx.globalCompositeOperation = "source-in";
                            tempctx.fillStyle = "white";
                            tempctx.fillRect(0, 0, GetViewport(viewportNum).imageWidth, GetViewport(viewportNum).imageHeight);
                        }
                        tempctx.globalCompositeOperation = globalCompositeOperation;
                        tempctx.restore();
                    }
                }
            }
        }
        tempctx.globalAlpha = alpha;
        var mat = tempctx.getTransform();
        var checkTransform = false;
        //標記套用image Orientation和image Position，之後將以反方向旋轉
        if (CheckNull(GetViewport(viewportNum).imageOrientationX) == false && CheckNull(GetViewport(viewportNum).imageOrientationY) == false && CheckNull(GetViewport(viewportNum).imageOrientationZ) == false) {
            tempctx.setTransform(new DOMMatrix(
                [GetViewport(viewportNum).imageOrientationX, -GetViewport(viewportNum).imageOrientationX2, 0, GetViewport(viewportNum).imagePositionX * GetViewport(viewportNum).PixelSpacingX,
                -GetViewport(viewportNum).imageOrientationY, GetViewport(viewportNum).imageOrientationY2, 0, GetViewport(viewportNum).imagePositionY * GetViewport(viewportNum).PixelSpacingY,
                GetViewport(viewportNum).imageOrientationZ, GetViewport(viewportNum).imageOrientationZ2, 0, GetViewport(viewportNum).imagePositionZ,
                    0, 0, 0, 1
                ]));
            checkTransform = true;
        }
        mat = tempctx.getTransform();
        //標記支援翻轉
        if (GetViewport(viewportNum).openHorizontalFlip == true && GetViewport(viewportNum).openVerticalFlip == true) {
            tempctx.setTransform(mat.scaleSelf(-1, -1));
            tempctx.setTransform(mat.translateSelf(-parseInt(GetViewport(viewportNum).imageWidth), parseInt(-GetViewport(viewportNum).imageHeight)));
        } else if (GetViewport(viewportNum).openHorizontalFlip == true) {
            tempctx.setTransform(mat.scaleSelf(-1, 1));
            tempctx.setTransform(mat.translateSelf(-parseInt(GetViewport(viewportNum).imageWidth), 0));
        } else if (GetViewport(viewportNum).openVerticalFlip == true) {
            tempctx.setTransform(mat.scaleSelf(1, -1, 1));
            tempctx.setTransform(mat.translateSelf(0, -parseInt(GetViewport(viewportNum).imageHeight)));
        } else {
            tempctx.setTransform(mat.scaleSelf(1, 1, 1));
            tempctx.setTransform(mat.translateSelf(0, 0));
        }
        if (checkTransform) tempctx.setTransform(mat.invertSelf());

        for (var n = 0; n < PatientMark.length; n++) {
            if (PatientMark[n].sop == Patient.Study[i].Series[j].Sop[k].SopUID) {
                for (var m = 0; m < PatientMark[n].mark.length; m++) {
                    if (PatientMark[n].mark[m].type == "XML_mark") {
                        tempctx.save();
                        tempctx.setTransform(1, 0, 0, 1, 0, 0);
                        tempctx.font = "" + (parseInt(tempctx.lineWidth) * 5) + "px Arial";
                        tempctx.fillStyle = "red";
                        if (openWriteXML == true) {
                            var tempMark = PatientMark[n].mark[m];
                            for (var o = 0; o < PatientMark[n].mark[m].markX.length; o += 2) {
                                let checkRtss = 0;
                                checkRtss = checkMark(i, j, n);
                                if (checkRtss == 0) continue;

                                tempctx.strokeStyle = "" + PatientMark[n].color;
                                tempctx.beginPath();
                                var x1 = tempMark.markX[o] * 1 - currX;
                                var y1 = tempMark.markY[o] * 1 - currY;
                                var o2 = o == tempMark.markX.length - 1 ? 0 : o + 1;
                                var x2 = tempMark.markX[o + 1] * 1 - currX;
                                var y2 = tempMark.markY[o + 1] * 1 - currY;
                                let tempAlpha = tempctx.globalAlpha;
                                tempctx.globalAlpha = 1.0;
                                tempctx.fillText("" + PatientMark[n].showName, x1 < x2 ? x1 : x2, y1 < y2 ? y1 - 5 : y2 - 5);
                                tempctx.globalAlpha = tempAlpha;

                                tempctx.rect(x1, y1, x2 - x1, y2 - y1);
                                tempctx.stroke();
                                tempctx.closePath();
                                if (openWriteXML == true) {
                                    tempctx.lineWidth = "" + parseInt(tempctx.lineWidth) * 2;
                                    tempctx.beginPath();
                                    if (xml_now_choose && xml_now_choose.mark == tempMark) {
                                        tempctx.strokeStyle = "#00FFFF";
                                        tempctx.arc(x1 / 2 + x2 / 2, y1, parseInt(tempctx.lineWidth), 0, 2 * Math.PI);
                                        tempctx.stroke();
                                        tempctx.closePath();
                                    };
                                    tempctx.beginPath();
                                    tempctx.fillStyle = "#FF0000";
                                    tempctx.arc(x1 / 2 + x2 / 2, y1, parseInt(tempctx.lineWidth), 0, 2 * Math.PI);
                                    tempctx.fill();
                                    tempctx.closePath();

                                    if (xml_now_choose && xml_now_choose.mark == tempMark) {
                                        tempctx.beginPath();
                                        tempctx.strokeStyle = "#00FFFF";
                                        tempctx.arc(x1 / 2 + x2 / 2, y2, parseInt(tempctx.lineWidth), 0, 2 * Math.PI);
                                        tempctx.stroke();
                                        tempctx.closePath();
                                    };
                                    tempctx.beginPath();
                                    tempctx.fillStyle = "#FF0000";
                                    tempctx.arc(x1 / 2 + x2 / 2, y2, parseInt(tempctx.lineWidth), 0, 2 * Math.PI);
                                    tempctx.fill();
                                    tempctx.closePath();

                                    tempctx.beginPath();
                                    if (xml_now_choose && xml_now_choose.mark == tempMark) {
                                        tempctx.strokeStyle = "#00FFFF";
                                        tempctx.arc(x1, y1 / 2 + y2 / 2, parseInt(tempctx.lineWidth), 0, 2 * Math.PI);
                                        tempctx.stroke();
                                        tempctx.closePath();
                                    };
                                    tempctx.beginPath();
                                    tempctx.fillStyle = "#FF0000";
                                    tempctx.arc(x1, y1 / 2 + y2 / 2, parseInt(tempctx.lineWidth), 0, 2 * Math.PI);
                                    tempctx.fill();
                                    tempctx.closePath();

                                    tempctx.beginPath();
                                    if (xml_now_choose && xml_now_choose.mark == tempMark) {
                                        tempctx.strokeStyle = "#00FFFF";
                                        tempctx.arc(x2, y1 / 2 + y2 / 2, parseInt(tempctx.lineWidth), 0, 2 * Math.PI);
                                        tempctx.stroke();
                                        tempctx.closePath();
                                    };
                                    tempctx.beginPath();
                                    tempctx.fillStyle = "#FF0000";
                                    tempctx.arc(x2, y1 / 2 + y2 / 2, parseInt(tempctx.lineWidth), 0, 2 * Math.PI);
                                    tempctx.fill();
                                    tempctx.closePath();
                                    tempctx.lineWidth = "" + parseInt(tempctx.lineWidth) / 2;
                                }
                            }
                        } else {
                            let checkRtss = 0;
                            checkRtss = checkMark(i, j, n);
                            if (checkRtss == 0) continue;
                            var tempMark = PatientMark[n].mark[m];
                            for (var o = 0; o < PatientMark[n].mark[m].markX.length; o += 2) {
                                tempctx.strokeStyle = "" + PatientMark[n].color;
                                tempctx.beginPath();
                                var x1 = tempMark.markX[o] * 1 - currX;
                                var y1 = tempMark.markY[o] * 1 - currY;
                                var o2 = o == tempMark.markX.length - 1 ? 0 : o + 1;
                                var x2 = tempMark.markX[o + 1] * 1 - currX;
                                var y2 = tempMark.markY[o + 1] * 1 - currY;

                                let tempAlpha = tempctx.globalAlpha;
                                tempctx.globalAlpha = 1.0;
                                tempctx.fillText("" + PatientMark[n].showName, x1 < x2 ? x1 : x2, y1 < y2 ? y1 - 5 : y2 - 5);
                                tempctx.globalAlpha = tempAlpha;

                                tempctx.rect(x1, y1, x2 - x1, y2 - y1);
                                tempctx.stroke();
                                tempctx.closePath();
                                if (openWriteXML == true) {
                                    tempctx.lineWidth = "" + parseInt(tempctx.lineWidth) * 2;
                                    tempctx.beginPath();
                                    tempctx.fillStyle = "#FF0000";
                                    tempctx.arc(x1 / 2 + x2 / 2, y1, parseInt(tempctx.lineWidth), 0, 2 * Math.PI);
                                    tempctx.fill();
                                    tempctx.closePath();

                                    tempctx.beginPath();
                                    tempctx.fillStyle = "#FF0000";
                                    tempctx.arc(x1 / 2 + x2 / 2, y2, parseInt(tempctx.lineWidth), 0, 2 * Math.PI);
                                    tempctx.fill();
                                    tempctx.closePath();

                                    tempctx.beginPath();
                                    tempctx.fillStyle = "#FF0000";
                                    tempctx.arc(x1, y1 / 2 + y2 / 2, parseInt(tempctx.lineWidth), 0, 2 * Math.PI);
                                    tempctx.fill();
                                    tempctx.closePath();

                                    tempctx.beginPath();
                                    tempctx.fillStyle = "#FF0000";
                                    tempctx.arc(x2, y1 / 2 + y2 / 2, parseInt(tempctx.lineWidth), 0, 2 * Math.PI);
                                    tempctx.fill();
                                    tempctx.closePath();
                                    tempctx.lineWidth = "" + parseInt(tempctx.lineWidth) / 2;
                                }
                            }
                        }
                        tempctx.restore();
                    }
                    if (PatientMark[n].mark[m].type == "TEXT") {
                        try {
                            tempctx.save();
                            tempctx.setTransform(1, 0, 0, 1, 0, 0);
                            for (var o = 0; o < PatientMark[n].mark[m].markX.length; o += 1) {
                                let checkRtss = 0;
                                checkRtss = checkMark(i, j, n);
                                if (checkRtss == 0) continue;


                                setMarkColor(tempctx, "#FFFF00");

                                if (PatientMark[n].color) {
                                    tempctx.strokeStyle = "" + PatientMark[n].color;
                                    tempctx.fillStyle = "" + PatientMark[n].color;
                                }

                                var tempMark = PatientMark[n].mark[m];
                                tempctx.beginPath();

                                var x1 = tempMark.markX[o] * 1 - currX;
                                var y1 = tempMark.markY[o + 1] * 1 - currY;
                                var offsetX_Text = 0;
                                var offsetY_Text = 0;
                                var lines = tempMark.GSPS_Text.split('\n');
                                for (var i2 = 0; i2 < lines.length; i2++) {
                                    var offsetX_temp = x1 + (3 * 4 * lines[i2].length) > MarkCanvas.width ? (x1 + (3 * 4 * lines[i2].length)) - MarkCanvas.width : 0;
                                    var offsetY_temp = y1 + (3 * 4 * lines[i2].length) > MarkCanvas.height ? (y1 + (3 * 4 * lines[i2].length)) - MarkCanvas.height : 0;
                                    if (offsetX_temp > offsetX_Text) offsetX_Text = offsetX_temp;
                                    if (offsetY_temp > offsetY_Text) offsetY_Text = offsetY_temp;
                                }

                                x1 -= offsetX_Text;
                                y1 -= offsetY_Text;
                                if (tempMark.GSPS_Text && o == 0) {

                                    tempctx.font = "" + (3 * 4) + "px Arial";
                                    tempctx.fillStyle = "red";
                                    let tempAlpha = tempctx.globalAlpha;
                                    tempctx.globalAlpha = 1.0;
                                    var lines = tempMark.GSPS_Text.split('\n');
                                    for (var i2 = 0; i2 < lines.length; i2++) {
                                        tempctx.fillText(lines[i2], x1, y1 - 7 - ((lines.length - 1) * 3 * 4) + (i2 * 3 * 4));
                                    }
                                    tempctx.globalAlpha = tempAlpha;
                                }
                                tempctx.stroke();
                                tempctx.closePath();
                            }
                            tempctx.restore();
                        } catch (ex) { console.log(ex); }
                        //console.log(0)
                    }
                    if (PatientMark[n].mark[m].type == "POLYLINE") {
                        tempctx.save();
                        tempctx.setTransform(1, 0, 0, 1, 0, 0);
                        for (var o = 0; o < PatientMark[n].mark[m].markX.length; o += 1) {
                            let checkRtss = 0;
                            checkRtss = checkMark(i, j, n);
                            if (checkRtss == 0) continue;

                            setMarkColor(tempctx);

                            if (PatientMark[n].color) {
                                tempctx.strokeStyle = "" + PatientMark[n].color;
                                tempctx.fillStyle = "" + PatientMark[n].color;
                            }

                            var tempMark = PatientMark[n].mark[m];
                            tempctx.beginPath();

                            var x1 = tempMark.markX[o] * 1 - currX;
                            var y1 = tempMark.markY[o] * 1 - currY;
                            var x2 = tempMark.markX[o + 1] * 1 - currX;
                            var y2 = tempMark.markY[o + 1] * 1 - currY;

                            if (tempMark.RotationAngle && tempMark.RotationPoint) {
                                [x1, y1] = rotatePoint([x1, y1], tempMark.RotationAngle, tempMark.RotationPoint);
                                [x2, y2] = rotatePoint([x2, y2], tempMark.RotationAngle, tempMark.RotationPoint);
                            }

                            if (tempMark.GSPS_Text && o == 0) {
                                tempctx.font = "" + (parseInt(tempctx.lineWidth) * 4) + "px Arial";
                                tempctx.fillStyle = "red";
                                let tempAlpha = tempctx.globalAlpha;
                                tempctx.globalAlpha = 1.0;
                                tempctx.fillText("" + tempMark.GSPS_Text, x1 < x2 ? x1 : x2, y1 < y2 ? y1 - 7 : y2 - 7);
                                tempctx.globalAlpha = tempAlpha;
                            }
                            let tempAlpha2 = tempctx.globalAlpha;
                            tempctx.globalAlpha = 1.0;
                            tempctx.moveTo(x1, y1);
                            tempctx.lineTo(x2, y2);
                            tempctx.stroke();
                            tempctx.globalAlpha = tempAlpha2;
                            if (tempMark.GraphicFilled && tempMark.GraphicFilled == 'Y') {
                                tempctx.fillStyle = "#FFFF88";
                                tempctx.fill();
                                console.log(x1, y1, x2, y2)
                            };
                            tempctx.closePath(); ''

                            if (openWriteGraphic == true || (getByid("GspsPOLYLINE").selected == true && openWriteGSPS == true)) {
                                if (tempMark.RotationAngle && tempMark.RotationPoint) {
                                    [x1, y1] = rotatePoint([x1, y1], -tempMark.RotationAngle, tempMark.RotationPoint);
                                    [x2, y2] = rotatePoint([x2, y2], -tempMark.RotationAngle, tempMark.RotationPoint);
                                }
                                tempctx.lineWidth = "" + parseInt(tempctx.lineWidth) * 2;
                                var fillstyle = tempctx.fillStyle;

                                if (Graphic_now_choose && Graphic_now_choose.mark == tempMark) tempctx.strokeStyle = getRGBFrom0xFF(tempctx.strokeStyle, false, true);
                                tempctx.beginPath();
                                tempctx.arc(x1 / 2 + x2 / 2, y1 / 2 + y2 / 2, parseInt(tempctx.lineWidth), 0, 2 * Math.PI);
                                tempctx.stroke();
                                tempctx.closePath();

                                for (var fil = 0; fil < 2; fil++) {
                                    tempctx.fillStyle = fillstyle;
                                    tempctx.beginPath();
                                    tempctx.arc(x1 / 2 + x2 / 2, y1 / 2 + y2 / 2, parseInt(parseInt(tempctx.lineWidth)), 0, 2 * Math.PI);
                                    tempctx.fill();
                                    tempctx.closePath();
                                }
                                tempctx.lineWidth = "" + parseInt(tempctx.lineWidth) / 2;
                            }
                        }
                        tempctx.restore();
                    }
                    if (PatientMark[n].mark[m].type == "ELLIPSE") {
                        tempctx.save();
                        tempctx.setTransform(1, 0, 0, 1, 0, 0);
                        for (var o = 0; o < PatientMark[n].mark[m].markX.length; o += 1) {
                            let checkRtss = 0;
                            checkRtss = checkMark(i, j, n);
                            if (checkRtss == 0) continue;

                            var tempMark = PatientMark[n].mark[m];
                            tempctx.beginPath();

                            var x1 = tempMark.markX[o] * 1 - currX;
                            var y1 = tempMark.markY[o] * 1 - currY;
                            var o2 = o == tempMark.markX.length - 1 ? 0 : o + 1;
                            var x2 = tempMark.markX[o + 1] * 1 - currX;
                            var y2 = tempMark.markY[o + 1] * 1 - currY;
                            var x3 = tempMark.markX[o + 2] * 1 - currX;
                            var y3 = tempMark.markY[o + 2] * 1 - currY;
                            var x4 = tempMark.markX[o + 3] * 1 - currX;
                            var y4 = tempMark.markY[o + 3] * 1 - currY;

                            tempctx.ellipse((x1 + x3) / 2, (y2 + y4) / 2, Math.abs(x1 - x3), Math.abs(y2 - y4), 0 * Math.PI / 180, 0, 2 * Math.PI);
                            tempctx.stroke();
                            if (fill == true) tempctx.fill();
                            tempctx.closePath();
                        }
                        tempctx.restore();
                    }
                    if (PatientMark[n].mark[m].type == "CIRCLE") {
                        tempctx.save();
                        tempctx.setTransform(1, 0, 0, 1, 0, 0);
                        for (var o = 0; o < PatientMark[n].mark[m].markX.length; o += 2) {
                            let checkRtss = 0;
                            checkRtss = checkMark(i, j, n);
                            if (checkRtss == 0) continue;

                            setMarkColor(tempctx);
                            if (PatientMark[n].color) {
                                tempctx.strokeStyle = "" + PatientMark[n].color;
                                tempctx.fillStyle = "" + PatientMark[n].color;
                            }

                            var tempMark = PatientMark[n].mark[m];


                            var x1 = tempMark.markX[o] * 1 - currX;
                            var y1 = tempMark.markY[o] * 1 - currY;
                            var x2 = tempMark.markX[o + 1] * 1 - currX;
                            var y2 = tempMark.markY[o + 1] * 1 - currY;

                            tempctx.beginPath();
                            var temp_distance = getDistance(Math.abs(x1 - x2), Math.abs(y1 - y2)); //Math.abs(x1 - x2) > Math.abs(y1 - y2) ? Math.abs(x1 - x2) : Math.abs(y1 - y2);
                            tempctx.arc(x1, y1, temp_distance, 0, 2 * Math.PI);
                            tempctx.stroke();
                            //if (fill == true) tempctx.fill();
                            tempctx.closePath();

                        }
                        tempctx.restore();
                    }
                    if (PatientMark[n].mark[m].type == "TwoDimensionPolyline") {
                        tempctx.save();
                        tempctx.setTransform(1, 0, 0, 1, 0, 0);
                        let checkRtss = 0;
                        checkRtss = checkMark(i, j, n);
                        if (checkRtss == 0) continue;
                        if (PatientMark[n].color) {
                            tempctx.strokeStyle = "" + PatientMark[n].color;
                            tempctx.fillStyle = "" + PatientMark[n].color;
                        }
                        setMarkColor(tempctx);
                        for (var o = 0; o < PatientMark[n].mark[m].markX.length; o++) {
                            var tempMark = PatientMark[n].mark[m];
                            tempctx.beginPath();
                            x1 = tempMark.markX[o] - currX /* * GetViewport(viewportNum).PixelSpacingX*/;
                            y1 = tempMark.markY[o] - currY /** GetViewport(viewportNum).PixelSpacingY*/;
                            o2 = o == tempMark.markX.length - 1 ? 0 : o + 1;
                            x2 = tempMark.markX[o2] - currX /* * GetViewport(viewportNum).PixelSpacingX*/;
                            y2 = tempMark.markY[o2] - currY /* * GetViewport(viewportNum).PixelSpacingY*/;

                            tempctx.moveTo(x1, y1);
                            tempctx.lineTo(x2, y2);
                            tempctx.stroke();
                            tempctx.closePath();
                        }
                        tempctx.fill();
                        tempctx.closePath();
                        tempctx.restore();
                    }
                    if (PatientMark[n].mark[m].type == "RTSS") {
                        //tempctx.setTransform(1, 0, 0, 1, 0, 0);
                        //tempctx.scale(1, 1);
                        let checkRtss = 0;
                        checkRtss = checkMark(i, j, n);
                        if (checkRtss == 0) continue;
                        if (PatientMark[n].color) {
                            tempctx.strokeStyle = "" + PatientMark[n].color;
                            tempctx.fillStyle = "" + PatientMark[n].color;
                        }
                        setMarkColor(tempctx);
                        for (var o = 0; o < PatientMark[n].mark[m].markX.length; o++) {
                            var tempMark = PatientMark[n].mark[m];
                            tempctx.beginPath();
                            var x1 = (tempMark.markX[o] - GetViewport(viewportNum).imagePositionX) * GetViewport(viewportNum).PixelSpacingX - currX;
                            var y1 = (tempMark.markY[o] - GetViewport(viewportNum).imagePositionY) * GetViewport(viewportNum).PixelSpacingY - currY;
                            var o2 = o == tempMark.markX.length - 1 ? 0 : o + 1;
                            var x2 = (tempMark.markX[o2] - GetViewport(viewportNum).imagePositionX) * GetViewport(viewportNum).PixelSpacingX - currX;
                            var y2 = (tempMark.markY[o2] - GetViewport(viewportNum).imagePositionY) * GetViewport(viewportNum).PixelSpacingY - currY;

                            x1 = Math.ceil(x1);
                            x2 = Math.ceil(x2);
                            y1 = Math.ceil(y1);
                            y2 = Math.ceil(y2);
                            tempctx.moveTo(x1, y1);
                            tempctx.lineTo(x2, y2);
                            tempctx.globalAlpha = 1.0;
                            tempctx.stroke();
                            tempctx.globalAlpha = alpha;
                            tempctx.closePath();
                        }
                        if (fill == true) {
                            tempctx.beginPath();
                            for (var o = 0; o < PatientMark[n].mark[m].markX.length; o++) {
                                var tempMark = PatientMark[n].mark[m];
                                var x1 = (tempMark.markX[o] - GetViewport(viewportNum).imagePositionX) * GetViewport(viewportNum).PixelSpacingX - currX;
                                var y1 = (tempMark.markY[o] - GetViewport(viewportNum).imagePositionY) * GetViewport(viewportNum).PixelSpacingY - currY;
                                var o2 = o == tempMark.markX.length - 1 ? 0 : o + 1;
                                var x2 = (tempMark.markX[o2] - GetViewport(viewportNum).imagePositionX) * GetViewport(viewportNum).PixelSpacingX - currX;
                                var y2 = (tempMark.markY[o2] - GetViewport(viewportNum).imagePositionY) * GetViewport(viewportNum).PixelSpacingY - currY;

                                x1 = Math.ceil(x1);
                                x2 = Math.ceil(x2);
                                y1 = Math.ceil(y1);
                                y2 = Math.ceil(y2);
                                if (o == 0) {
                                    tempctx.moveTo(x1, y1);
                                    tempctx.lineTo(x2, y2);
                                } else {
                                    tempctx.lineTo(x1, y1);
                                    tempctx.lineTo(x2, y2);
                                }
                            }
                            tempctx.fill();
                            tempctx.closePath();
                        }
                    } else if (PatientMark[n].mark[m].type == "TwoDimensionMultiPoint") {
                        tempctx.save();
                        tempctx.setTransform(1, 0, 0, 1, 0, 0);
                        let checkRtss = 0;
                        checkRtss = checkMark(i, j, n);
                        if (checkRtss == 0) continue;
                        if (PatientMark[n].color) {
                            tempctx.strokeStyle = "" + PatientMark[n].color;
                            tempctx.fillStyle = "" + PatientMark[n].color;
                        }
                        setMarkColor(tempctx);
                        if (checkRtss == 0) continue;
                        if (PatientMark[n].color) {
                            tempctx.strokeStyle = "" + PatientMark[n].color;
                            tempctx.fillStyle = "" + PatientMark[n].color;
                        }
                        setMarkColor(tempctx);
                        for (var o = 0; o < PatientMark[n].mark[m].markX.length; o++) {
                            var tempMark = PatientMark[n].mark[m];
                            tempctx.beginPath();
                            var x1 = tempMark.markX[o] - currX /* * GetViewport(viewportNum).PixelSpacingX*/;
                            var y1 = tempMark.markY[o] - currY /* * GetViewport(viewportNum).PixelSpacingY*/;
                            var o2 = o == tempMark.markX.length - 1 ? 0 : o + 1;
                            var x2 = tempMark.markX[o2] - currX /* * GetViewport(viewportNum).PixelSpacingX*/;
                            var y2 = tempMark.markY[o2] - currY /* * GetViewport(viewportNum).PixelSpacingY*/;

                            tempctx.moveTo(x1, y1);
                            tempctx.lineTo(x2, y2);
                            tempctx.stroke();
                            tempctx.closePath();
                        }
                        tempctx.restore();
                    } else if (PatientMark[n].mark[m].type == "TwoDimensionEllipse") {
                        tempctx.save();
                        tempctx.setTransform(1, 0, 0, 1, 0, 0);
                        let checkRtss = 0;
                        checkRtss = checkMark(i, j, n);
                        if (checkRtss == 0) continue;
                        if (PatientMark[n].color) {
                            tempctx.strokeStyle = "" + PatientMark[n].color;
                            tempctx.fillStyle = "" + PatientMark[n].color;
                        }
                        setMarkColor(tempctx);
                        for (var o = 0; o < PatientMark[n].mark[m].markX.length; o++) {
                            var tempMark = PatientMark[n].mark[m];
                            tempctx.beginPath();
                            var X1 = tempMark.markX[o + 0] - currX;
                            var Y1 = tempMark.markY[o + 0] - currY;
                            var X2 = tempMark.markX[o + 2] - currX;
                            var Y2 = tempMark.markY[o + 2] - currY;
                            var X3 = tempMark.markX[o + 1] - currX;
                            var Y3 = tempMark.markY[o + 1] - currY;
                            var X4 = tempMark.markX[o + 3] - currX;
                            var Y4 = tempMark.markY[o + 3] - currY;

                            var heightHalf = Math.sqrt(Math.pow((X1 - X3), 2) + Math.pow((Y1 - Y3), 2)) / 2;
                            var widthHalf = Math.sqrt(Math.pow((X2 - X4), 2) + Math.pow((Y2 - Y4), 2)) / 2;
                            tempctx.ellipse(X3, Y3, heightHalf, widthHalf, 0 * Math.PI / 180, 0, 2 * Math.PI);
                            if (fill == true) tempctx.fill();
                            tempctx.stroke();
                            tempctx.closePath();
                            break;
                        }
                        tempctx.restore();
                    } else if (PatientMark[n].mark[m].type == "TextAnnotationEntity") {
                        let checkRtss = 0;
                        checkRtss = checkMark(i, j, n);
                        if (checkRtss == 0) continue;
                        if (PatientMark[n].color) {
                            tempctx.strokeStyle = "" + PatientMark[n].color;
                            tempctx.fillStyle = "" + PatientMark[n].color;
                        }
                        setMarkColor(tempctx);
                        for (var o = 0; o < PatientMark[n].mark[m].markX.length; o++) {
                            var theta = 30;
                            var tempMark = PatientMark[n].mark[m];
                            tempctx.moveTo(parseInt(tempMark.markX[o]), parseInt(tempMark.markY[o]));
                            tempctx.lineTo(parseInt(tempMark.markX[o + 1]), parseInt(tempMark.markY[o + 1]));
                            tempctx.stroke();
                            tempctx.save();

                            tempctx.translate(tempMark.markX[o], tempMark.markY[o]);
                            var ang = Math.atan2(tempMark.markY[o] - tempMark.markY[o + 1], tempMark.markX[o] - tempMark.markX[o + 1]) + Math.PI / 2;
                            tempctx.rotate(ang);
                            tempctx.moveTo(0, 0);
                            tempctx.lineTo(0 - 3, 0 + 7);
                            tempctx.lineTo(0 + 3, 0 + 7);
                            tempctx.fill();
                            tempctx.restore();
                            tempctx.closePath();
                            break;
                        }
                    }
                }
            }
        }
    }
    tempctx.setTransform(1, 0, 0, 1, 0, 0);
    tempctx.scale(1, 1);
    tempctx.globalAlpha = 1.0;
}

function PictureOnclick(alt) {
    if (openVR == true || openMPR == true) return;
    WindowOpen = false;
    cancelTools();
    drawBorder(getByid("MouseOperation"));
    NowAlt = '';
    let index = SearchUid2IndexBySeries(alt);
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

function SetToLeft(alt, checki, patientid) {
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
    div.alt = alt;
    div.draggable = "true";
    div.style.touchAction = 'none';

    var mainDiv = document.createElement("DIV");
    mainDiv.id = "dicomDivList" + dicomImageCount;
    mainDiv.className = "dicomDivList";
    if (checki >= 0) mainDiv.id = "dicomDivList" + checki;
    mainDiv.style = "width:" + 65 + "px;height:" + 65 + "px;";
    mainDiv.onclick = function () {
        PictureOnclick(div.alt);
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
    smallDiv.id = "menu" + alt;
    var rtssList = [];
    var colorList = [];
    var hideList = [];
    let index = SearchUid2IndexBySeries(alt);
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
        li1.alt = 'true';
        if (getByid("dicomDivListLabel" + checki + o)) {
            li1.checked = getByid("dicomDivListLabel" + checki + o).checked;
            li1.alt = getByid("dicomDivListLabel" + checki + o).alt;
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
            this.alt = this.alt == 'true' ? 'false' : 'true';
            for (var i = 0; i < Viewport_Total; i++) displayMark(NowResize, null, null, null, i)
        };
        label.appendChild(li1);
        smallDiv.appendChild(label);
        smallDiv.appendChild(document.createElement("br"))
    }
    div.appendChild(mainDiv);
    div.appendChild(smallDiv);
    NowAlt = div.alt;

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
            var alt = GetViewport(z).alt;

            var uid = SearchUid2Json(alt);
            if (uid) {
                if (z == viewportNumber)
                    loadAndViewImageByWindowLevwl(Patient.Study[uid.studyuid].Series[uid.sreiesuid].Sop[uid.sopuid].imageId, parseInt(textWC.value), parseInt(textWW.value), openOrigin, z);
                else
                    loadAndViewImageByWindowLevwl(Patient.Study[uid.studyuid].Series[uid.sreiesuid].Sop[uid.sopuid].imageId, parseInt(textWC.value), parseInt(textWW.value), false, z);
            }
        }
    } else {
        var alt = GetViewport().alt;
        GetViewport().windowCenterList = parseInt(textWC.value);
        GetViewport().windowWidthList = parseInt(textWW.value);
        var uid = SearchUid2Json(alt);
        loadAndViewImageByWindowLevwl(Patient.Study[uid.studyuid].Series[uid.sreiesuid].Sop[uid.sopuid].imageId, parseInt(textWC.value), parseInt(textWW.value), openOrigin);
    }
}

function magnifierIng(currX, currY) {
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

    var currX11 = Math.floor(currX) - magnifierWidth / 2;
    var currY11 = Math.floor(currY) - magnifierHeight / 2;
    var currX02 = currX11;
    var currY02 = currY11;
    magnifierCtx.drawImage(GetViewport().canvas(), currX02, currY02, magnifierWidth, magnifierHeight, 0, 0, magnifierWidth, magnifierHeight);
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
        var alt = GetViewport(viewportNum).alt;
        var break1 = false;
        let index = SearchUid2Index(alt);
        let i = index[0],
            j = index[1],
            k = index[2];
        if (Patient.Study[i].Series[j].Sop[k].SopUID == alt) {
            var Onum = parseInt(Patient.Study[i].Series[j].Sop[k].InstanceNumber);
            var list = sortInstance(alt);
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