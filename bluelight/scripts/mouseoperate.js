function Wheel(e) {
    if (openDisplayMarkup && (getByid("DICOMTagsSelect").selected || getByid("AIMSelect").selected)) return;
    //if (openPenDraw == true) return;
    var nextInstanceNumber = 0;
    getByid("MeasureLabel").style.display = "none";
    var break1 = false;
    var viewportNum = viewportNumber;
    for (var z = 0; z < Viewport_Total; z++) {
        var break1 = false;
        if (openLink == true)
            viewportNum = z;
        if (openWriteSEG == true || openWriteRTSS == true || openVR == true || openMPR == true || openMouseTool == true || openChangeFile == true || openWindow == true || openZoom == true || openMeasure == true) {
            var currX1 = (e.pageX - canvas.getBoundingClientRect().left - GetViewport().newMousePointX - 100) * (GetViewport().imageWidth / parseInt(canvas.style.width));
            var currY1 = (e.pageY - canvas.getBoundingClientRect().top - GetViewport().newMousePointY - 100) * (GetViewport().imageHeight / parseInt(canvas.style.height));
            var alt = GetViewport(viewportNum).alt;
            let index = SearchUid2Index(alt);
            if (!index) continue;
            let i = index[0],
                j = index[1],
                k = index[2];
            var Onum = parseInt(Patient.Study[i].Series[j].Sop[k].InstanceNumber);
            var list = sortInstance(alt);
            if (e.deltaY < 0) {
                for (var l = 0; l < list.length; l++) {
                    if (break1 == true) break;
                    if (list[l].InstanceNumber == Onum) {
                        if (l - 1 < 0) {
                            loadAndViewImage(list[list.length - 1].imageId, currX1, currY1, viewportNum);
                            nextInstanceNumber = list.length - 1;
                            break1 = true;
                            break;
                        }
                        loadAndViewImage(list[l - 1].imageId, currX1, currY1, viewportNum);
                        nextInstanceNumber = l - 1;
                        break1 = true;
                        break;
                    }
                }
            } else {
                for (var l = 0; l < list.length; l++) {
                    if (break1 == true) break;
                    if (list[l].InstanceNumber == Onum) {
                        if (l + 1 >= list.length) {
                            loadAndViewImage(list[0].imageId, currX1, currY1, viewportNum);
                            nextInstanceNumber = 0;
                            break1 = true;
                            break;
                        }
                        loadAndViewImage(list[l + 1].imageId, currX1, currY1, viewportNum);
                        nextInstanceNumber = l + 1;
                        break1 = true;
                        break;
                    }
                }
            }
        }
        if (openLink == false)
            break;
    }
    if (openMPR == true) {
        Anatomical_Section(nextInstanceNumber);
        Anatomical_Section2(nextInstanceNumber);
    }
}

function Mousedown_origin(e) {
    // if (openPenDraw == true) return;
    getByid("MeasureLabel").style.display = "none";
    switch (e.which) {
        case 1:
            MouseDownCheck = true;
            break;
        case 2:
            break;
        case 3:
            rightMouseDown = true;
            break;
        default:
            break
    }
    if (openVR == true || openMPR == true) {
        /*windowMouseX = GetmouseX(e);
        windowMouseY = GetmouseY(e);
        GetViewport().originalPointX = getCurrPoint(e)[0];
        GetViewport().originalPointY = getCurrPoint(e)[1];*/
        return;
    };
    if (openAngel == 3) openAngel = 1;
    if (openAngel == 2) getByid("AngelLabel").style.display = '';
    if (openMeasure == true) {
        getByid("MeasureLabel").style.display = '';
        let angel2point = rotateCalculation(e);
        MeasureXY = angel2point;
        MeasureXY2 = angel2point;
        for (var i = 0; i < Viewport_Total; i++)
            displayMark(NowResize, null, null, null, i);
        displayMeasureRular();
    }
    if (openAngel == 1) {
        let angel2point = rotateCalculation(e);
        AngelXY0 = angel2point;
        AngelXY1 = angel2point;
        for (var i = 0; i < Viewport_Total; i++)
            displayMark(NowResize, null, null, null, i);
        displayAngelRular();
    }
    windowMouseX = GetmouseX(e);
    windowMouseY = GetmouseY(e);
    GetViewport().originalPointX = getCurrPoint(e)[0];
    GetViewport().originalPointY = getCurrPoint(e)[1];
    if (openZoom == true && MouseDownCheck == true) {
        magnifierDiv.style.display = "";
        let angel2point = rotateCalculation(e);
        magnifierIng(angel2point[0], angel2point[1]);
    }
    if (openWriteSEG == true && openWindow == false) {
        var alt = GetViewport().alt;
        var index_Seg = SearchUid2Index(alt);
        if (!index_Seg) return;
        let i_s = index_Seg[0],
            j_s = index_Seg[1],
            k_s = index_Seg[2];
        var break1 = false;
        for (var n_s = 0; n_s < PatientMark.length; n_s++) {
            if (PatientMark[n_s].sop == Patient.Study[i_s].Series[j_s].Sop[k_s].SopUID) {
                for (var m_s = 0; m_s < PatientMark[n_s].mark.length; m_s++) {
                    if (break1 == true) break;
                    if (PatientMark[n_s].mark[m_s].type == "SEG") {
                        SEG_now_choose = PatientMark[n_s].mark[m_s];
                        break1 = true;
                    }
                }
            }
        }
        if (break1 == false) {
            let Uid = GetNowUid();
            var dcm = {};
            dcm.study = Uid.study;
            dcm.series = Uid.sreies;

            dcm.ImagePositionPatient = GetViewport().ImagePositionPatient;
            dcm.mark = [];
            dcm.showName = "SEG"; //"" + getByid("xmlMarkNameText").value;
            dcm.hideName = dcm.showName;
            dcm.mark.push({});
            dcm.sop = Uid.sop;
            var DcmMarkLength = dcm.mark.length - 1;
            dcm.mark[DcmMarkLength].type = "SEG";
            dcm.mark[DcmMarkLength].pixelData = new Uint8Array(GetViewport().imageWidth * GetViewport().imageHeight);
            PatientMark.push(dcm);
            refreshMark(dcm);
            SEG_now_choose = dcm.mark[DcmMarkLength];
        }
        for (var i = 0; i < Viewport_Total; i++)
            displayMark(NowResize, null, null, null, i);
    }
    if (openWriteXML == true) {
        var currX = getCurrPoint(e)[0];
        var currY = getCurrPoint(e)[1];

        var currXml_X1 = currX;
        var currXml_Y1 = currY;
        var currXml_X2 = currXml_X1;
        var currXml_Y2 = currXml_Y1;

        /*if (GetViewport().imageOrientationX && GetViewport().imageOrientationY && GetViewport().imageOrientationZ) {
            currXml_X2 = (currXml_X1 * GetViewport().imageOrientationX + currXml_Y1 * -GetViewport().imageOrientationY + 0);
            currXml_Y2 = (currXml_X1 * -GetViewport().imageOrientationX2 + currXml_Y1 * GetViewport().imageOrientationY2 + 0);
            if ((GetViewport().openHorizontalFlip != GetViewport().openVerticalFlip)) {
                currXml_X2 = currXml_X2 - (currXml_X2 - currXml_X1) * 2;
                currXml_Y2 = currXml_Y2 - (currXml_Y2 - currXml_Y1) * 2;
            }
        }*/
        if (xml_pounch(currXml_X2, currXml_Y2) == true) displayMark(NowResize, null, null, null, undefined);
    }
    if (openWriteRTSS == true && !rightMouseDown) {
        var angel2point = rotateCalculation(e)
        var currX11 = Math.floor(angel2point[0]);
        var currY11 = Math.floor(angel2point[1]);
        var currX02 = currX11;
        var currY02 = currY11;

        if (GetViewport().imageOrientationX && GetViewport().imageOrientationY && GetViewport().imageOrientationZ) {
            currX02 = (currX11 * GetViewport().imageOrientationX + currY11 * -GetViewport().imageOrientationY + 0);
            currY02 = (currX11 * -GetViewport().imageOrientationX2 + currY11 * GetViewport().imageOrientationY2 + 0);
            if ((GetViewport().openHorizontalFlip != GetViewport().openVerticalFlip)) {
                currX02 = currX02 - (currX02 - currX11) * 2;
                currY02 = currY02 - (currY02 - currY11) * 2;
            }
        }
        currX02 = currX02 / GetViewport().PixelSpacingX + GetViewport().imagePositionX;
        currY02 = currY02 / GetViewport().PixelSpacingY + GetViewport().imagePositionY;
        let Uid = GetNowUid();
        var dcm = {};
        dcm.study = Uid.study;
        dcm.series = Uid.sreies;
        dcm.color = "rgb(0,0,128)";
        for (var co = 0; co < getClass("RTSSColorSelectOption").length; co++) {
            if (getClass("RTSSColorSelectOption")[co].selected == true) {
                dcm.color = getClass("RTSSColorSelectOption")[co].style.color;
            }
        }

        dcm.imagePositionZ = GetViewport().imagePositionZ;
        dcm.mark = [];
        dcm.showName = getByid('textROIName').value; //"" + getByid("xmlMarkNameText").value;
        dcm.hideName = dcm.showName;
        dcm.mark.push({});
        dcm.sop = Uid.sop;
        var DcmMarkLength = dcm.mark.length - 1;
        dcm.mark[DcmMarkLength].type = "RTSS";
        dcm.mark[DcmMarkLength].markX = [];
        dcm.mark[DcmMarkLength].markY = [];
        dcm.mark[DcmMarkLength].markX.push(angel2point[0] - Math.abs(currX02 - angel2point[0]));
        dcm.mark[DcmMarkLength].markY.push(angel2point[1] - Math.abs(currY02 - angel2point[1]));
        PatientMark.push(dcm);
        refreshMark(dcm);
        RTSSc_now_choose = dcm.mark[DcmMarkLength];
        for (var i = 0; i < Viewport_Total; i++)
            displayMark(NowResize, null, null, null, i);
    }
    if (openWriteGSPS == true && !rightMouseDown && getByid("GspsPOLYLINE").selected == true) {
        var currX = getCurrPoint(e)[0];
        var currY = getCurrPoint(e)[1];

        var currXml_X1 = currX;
        var currXml_Y1 = currY;
        if (Graphic_pounch(currXml_X1, currXml_Y1) == true) {
            displayMark(NowResize, null, null, null, undefined);
        };
    }
    if (openWriteGraphic == true && !rightMouseDown) {
        var currX = getCurrPoint(e)[0];
        var currY = getCurrPoint(e)[1];
        if (currX <= 0)
            currX = 0;
        if (currY <= 0)
            currY = 0;
        if (currX > GetViewport().imageWidth)
            currX = GetViewport().imageWidth;
        if (currY > GetViewport().imageHeight)
            currY = GetViewport().imageHeight;
        if (GetViewport().originalPointX <= 0)
            GetViewport().originalPointX = 0;
        if (GetViewport().originalPointY <= 0)
            GetViewport().originalPointY = 0;
        if (GetViewport().originalPointX > GetViewport().imageWidth)
            GetViewport().originalPointX = GetViewport().imageWidth;
        if (GetViewport().originalPointY > GetViewport().imageHeight)
            GetViewport().originalPointY = GetViewport().imageHeight;
        var currXml_X1 = currX;
        var currXml_Y1 = currY;
        var currXml_X2 = currXml_X1;
        var currXml_Y2 = currXml_Y1;

        /* if (GetViewport().imageOrientationX && GetViewport().imageOrientationY && GetViewport().imageOrientationZ) {
             currXml_X2 = (currXml_X1 * GetViewport().imageOrientationX + currXml_Y1 * -GetViewport().imageOrientationY + 0);
             currXml_Y2 = (currXml_X1 * -GetViewport().imageOrientationX2 + currXml_Y1 * GetViewport().imageOrientationY2 + 0);
             if ((GetViewport().openHorizontalFlip != GetViewport().openVerticalFlip)) {
                 currXml_X2 = currXml_X2 - (currXml_X2 - currXml_X1) * 2;
                 currXml_Y2 = currXml_Y2 - (currXml_Y2 - currXml_Y1) * 2;
             }
         }*/
        if (Graphic_pounch(currXml_X2, currXml_Y2) == true) displayMark(NowResize, null, null, null, undefined);
    }

}

function Mousemove_origin(e) {
    if (openDisplayMarkup && (getByid("DICOMTagsSelect").selected || getByid("AIMSelect").selected)) return;
    if (openMPR == true && openWindow != true && openChangeFile == false) {
        if (MouseDownCheck == true) {
            viewportNumber = 2;
            let angel2point = rotateCalculation(e);
            currX11M = angel2point[0];
            currY11M = angel2point[1];
            o3DPointX = currX11M;
            o3DPointY = currY11M;
            AngelXY0 = [currX11M, 0];
            AngelXY1 = [currX11M, GetViewport().imageHeight];
            if (openMPR == true) {
                Anatomical_Section();
                Anatomical_Section2();
            }
            display3DLine(currX11M, 0, currX11M, GetViewport().imageHeight, "rgb(38,140,191)");
            display3DLine(0, currY11M, GetViewport().imageWidth, currY11M, "rgb(221,53,119)");
        }
    }
    var currX = getCurrPoint(e)[0];
    var currY = getCurrPoint(e)[1];
    var labelXY = getClass('labelXY'); {
        let angel2point = rotateCalculation(e);
        labelXY[viewportNumber].innerText = "X: " + parseInt(angel2point[0]) + " Y: " + parseInt(angel2point[1]);
    }
    if (rightMouseDown == true) {
        if (!openRotate && !openVR && !openWriteGSPS && !openWriteGraphic && (openMPR == true || openMouseTool == true || openWindow == true || openZoom == true || openMeasure == true)) {
            if (openLink == true && openMPR == false) {
                for (var i = 0; i < Viewport_Total; i++) {
                    if (i == viewportNumber) continue;
                    try {
                        GetViewport(i).canvas().style.width = GetViewport().canvas().style.width;
                        GetViewport(i).canvas().style.height = GetViewport().canvas().style.height;
                        GetViewportMark(i).style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
                        GetViewport(i).canvas().style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
                        GetViewport(i).NowCanvasSizeWidth = parseFloat(canvas.style.width);
                        GetViewport(i).NowCanvasSizeHeight = parseFloat(canvas.style.height);
                    } catch (ex) { }
                }
            }
            if (GetmouseY(e) < windowMouseY - 2) {
                var tempWidth = parseFloat(canvas.style.width);
                var tempHeight = parseFloat(canvas.style.height)
                var canvasW = GetViewportMark().style.width = canvas.style.width = tempWidth * 1.05 + "px";
                var cnavsH = GetViewportMark().style.height = canvas.style.height = tempHeight * 1.05 + "px";
                if (currX > parseFloat(canvasW) / 2)
                    GetViewport().newMousePointX -= Math.abs(tempWidth - (parseFloat(canvasW))) / 2;
                else
                    GetViewport().newMousePointX -= Math.abs(tempWidth - (parseFloat(canvasW))) / 2;
                if (currY > parseFloat(cnavsH) / 2)
                    GetViewport().newMousePointY -= Math.abs(tempHeight - (parseFloat(cnavsH))) / 2;
                else
                    GetViewport().newMousePointY -= Math.abs(tempHeight - (parseFloat(cnavsH))) / 2;
                GetViewportMark().style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
                canvas.style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
            } else if (GetmouseY(e) > windowMouseY + 2) {
                var tempWidth = parseFloat(canvas.style.width);
                var tempHeight = parseFloat(canvas.style.height)
                var canvasW = GetViewportMark().style.width = canvas.style.width = tempWidth / 1.05 + "px";
                var cnavsH = GetViewportMark().style.height = canvas.style.height = tempHeight / 1.05 + "px";
                if (currX > parseFloat(canvasW) / 2)
                    GetViewport().newMousePointX += Math.abs(tempWidth - (parseFloat(canvasW))) / 2;
                else
                    GetViewport().newMousePointX += Math.abs(tempWidth - (parseFloat(canvasW))) / 2;
                if (currY > parseFloat(cnavsH) / 2)
                    GetViewport().newMousePointY += Math.abs(tempHeight - (parseFloat(cnavsH))) / 2;
                else
                    GetViewport().newMousePointY += Math.abs(tempHeight - (parseFloat(cnavsH))) / 2;
                GetViewportMark().style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
                canvas.style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
            }
            windowMouseX = GetmouseX(e);
            windowMouseY = GetmouseY(e);
            GetViewport().NowCanvasSizeWidth = parseFloat(canvas.style.width);
            GetViewport().NowCanvasSizeHeight = parseFloat(canvas.style.height);
            if (openLink == true) {
                for (var i = 0; i < Viewport_Total; i++) {
                    if (i == viewportNumber) continue;
                    GetViewportMark((i)).style.width = GetViewport(i).canvas().style.width = GetViewport().canvas().style.width;
                    GetViewportMark((i)).style.height = GetViewport(i).canvas().style.height = GetViewport().canvas().style.height;
                    GetViewportMark((i)).style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
                    GetViewport(i).canvas().style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
                    GetViewport(i).NowCanvasSizeWidth = parseFloat(canvas.style.width);
                    GetViewport(i).NowCanvasSizeHeight = parseFloat(canvas.style.height);
                }
            }
        }
        if (openRotate == true) {
            if (Math.abs(currY - GetViewport().originalPointY) > Math.abs(currX - GetViewport().originalPointX)) {
                if (currY < GetViewport().originalPointY - 3)
                    GetViewport().rotateValue += 2;
                else if (currY > GetViewport().originalPointY + 3)
                    GetViewport().rotateValue -= 2;
            }
            GetViewportMark().style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
            GetViewport().canvas().style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";

            if (openLink == true) {
                for (var z = 0; z < 4; z++) {
                    GetViewport(z).rotateValue = GetViewport().rotateValue;
                    GetViewportMark(z).style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
                    GetViewport(z).canvas().style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
                }
            }
        }
        if (openLink == true) {
            for (var i = 0; i < Viewport_Total; i++) {
                GetViewport(i).newMousePointX = GetViewport().newMousePointX;
                GetViewport(i).newMousePointY = GetViewport().newMousePointY;
            }
        }
        putLabel();
        for (var i = 0; i < Viewport_Total; i++)
            displayRular(i);
    }
    if (openAngel == 2) {
        let angel2point = rotateCalculation(e);
        AngelXY2 = angel2point;
        for (var i = 0; i < Viewport_Total; i++)
            displayMark(NowResize, null, null, null, i);
        displayAngelRular();
        return;
    }

    if (openWriteSEG == true && MouseDownCheck && !rightMouseDown && SEG_now_choose && openWindow == false) {
        let angel2point = rotateCalculation(e);
        var rect = getByid("SegBrushSizeText").value;
        rect = parseInt(rect);
        if (isNaN(rect) || rect < 1 || rect > 1024) rect = getByid("SegBrushSizeText").value = 10;
        if (KeyCode_ctrl == true) {
            for (var s = -rect; s < rect; s++) {
                for (var s2 = -rect; s2 < rect; s2++) {
                    if ((s * s) + (s2 * s2) < rect * rect)
                        SEG_now_choose.pixelData[Math.floor(angel2point[1] + s) * GetViewport().imageWidth + Math.floor(angel2point[0] + s2)] = 0;
                }
            }
        } else {
            for (var s = -rect; s < rect; s++) {
                for (var s2 = -rect; s2 < rect; s2++) {
                    if ((s * s) + (s2 * s2) < rect * rect)
                        SEG_now_choose.pixelData[Math.floor(angel2point[1] + s) * GetViewport().imageWidth + Math.floor(angel2point[0] + s2)] = 1;
                }
            }
        }
        let Uid = GetNowUid();
        refreshMark(Uid.sop);
        for (var i = 0; i < Viewport_Total; i++)
            displayMark(NowResize, null, null, null, i);
    }
    if (openWriteRTSS == true && !rightMouseDown && RTSSc_now_choose) {
        let Uid = GetNowUid();
        var angel2point = rotateCalculation(e)
        var currX11 = Math.floor(angel2point[0]);
        var currY11 = Math.floor(angel2point[1]);
        var currX02 = currX11;
        var currY02 = currY11;

        if (GetViewport().imageOrientationX && GetViewport().imageOrientationY && GetViewport().imageOrientationZ) {
            currX02 = (currX11 * GetViewport().imageOrientationX + currY11 * -GetViewport().imageOrientationY + 0);
            currY02 = (currX11 * -GetViewport().imageOrientationX2 + currY11 * GetViewport().imageOrientationY2 + 0);
            if ((GetViewport().openHorizontalFlip != GetViewport().openVerticalFlip)) {
                currX02 = currX02 - (currX02 - currX11) * 2;
                currY02 = currY02 - (currY02 - currY11) * 2;
            }
        }
        currX02 = currX02 / GetViewport().PixelSpacingX + GetViewport().imagePositionX;
        currY02 = currY02 / GetViewport().PixelSpacingY + GetViewport().imagePositionY;
        // var DcmMarkLength = RTSSc_now_choose.mark.length - 1;
        RTSSc_now_choose.markX.push(angel2point[0] - Math.abs(currX02 - angel2point[0]));
        RTSSc_now_choose.markY.push(angel2point[1] - Math.abs(currY02 - angel2point[1]));
        //PatientMark.push(RTSSc_now_choose);
        refreshMark(Uid.sop);
        for (var i = 0; i < Viewport_Total; i++)
            displayMark(NowResize, null, null, null, i);
    }
    if (openWriteGSPS == true && MouseDownCheck == true && getByid("GspsCIRCLE").selected == true) { //flag
        let Uid = SearchNowUid();
        var dcm = {};
        dcm.study = Uid.studyuid;
        dcm.series = Uid.sreiesuid;
        dcm.color = GetGSPSColor();
        dcm.mark = [];
        dcm.showName = getByid("GspsName").value; //"" + getByid("xmlMarkNameText").value;
        dcm.hideName = dcm.showName;
        dcm.mark.push({});
        dcm.sop = Uid.sopuid;
        var DcmMarkLength = dcm.mark.length - 1;
        dcm.mark[DcmMarkLength].type = "CIRCLE";
        dcm.mark[DcmMarkLength].markX = [];
        dcm.mark[DcmMarkLength].markY = [];
        dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
        dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
        dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX + Math.sqrt(Math.pow(Math.abs(GetViewport().originalPointX - currX), 2) + Math.pow(Math.abs(GetViewport().originalPointY - currY), 2) / 2));
        dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY + Math.sqrt(Math.pow(Math.abs(GetViewport().originalPointX - currX), 2) + Math.pow(Math.abs(GetViewport().originalPointY - currY), 2) / 2));
        PatientMark.push(dcm);
        refreshMark(dcm);
        for (var i = 0; i < Viewport_Total; i++)
            displayMark(NowResize, null, null, null, i);
        displayAngelRular();
        PatientMark.splice(PatientMark.indexOf(dcm), 1);
    }
    if (openWriteGSPS == true && MouseDownCheck == true && getByid("GspsLINE").selected == true) {
        let Uid = SearchNowUid();
        var dcm = {};
        dcm.study = Uid.studyuid;
        dcm.series = Uid.sreiesuid;
        dcm.color = GetGSPSColor();
        dcm.mark = [];
        dcm.showName = "" + getByid("GspsName").value; //"" + getByid("xmlMarkNameText").value;
        dcm.hideName = dcm.showName;
        dcm.mark.push({});
        dcm.sop = Uid.sopuid;
        var DcmMarkLength = dcm.mark.length - 1;
        dcm.mark[DcmMarkLength].type = "POLYLINE";
        dcm.mark[DcmMarkLength].markX = [];
        dcm.mark[DcmMarkLength].markY = [];
        dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
        dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
        dcm.mark[DcmMarkLength].markY.push(currY);
        dcm.mark[DcmMarkLength].markX.push(currX);
        PatientMark.push(dcm);
        refreshMark(dcm);
        for (var i = 0; i < Viewport_Total; i++)
            displayMark(NowResize, null, null, null, i);
        displayAngelRular();
        PatientMark.splice(PatientMark.indexOf(dcm), 1);
    }
    if ((openWriteGraphic == true || (openWriteGSPS == true && getByid("GspsPOLYLINE").selected == true)) && (MouseDownCheck == true || rightMouseDown == true)) {
        if (currX <= 0)
            currX = 0;
        if (currY <= 0)
            currY = 0;
        if (currX > GetViewport().imageWidth)
            currX = GetViewport().imageWidth;
        if (currY > GetViewport().imageHeight)
            currY = GetViewport().imageHeight;
        if (GetViewport().originalPointX <= 0)
            GetViewport().originalPointX = 0;
        if (GetViewport().originalPointY <= 0)
            GetViewport().originalPointY = 0;
        if (GetViewport().originalPointX > GetViewport().imageWidth)
            GetViewport().originalPointX = GetViewport().imageWidth;
        if (GetViewport().originalPointY > GetViewport().imageHeight)
            GetViewport().originalPointY = GetViewport().imageHeight;
        if (!Graphic_now_choose && MouseDownCheck == true) {
            let Uid = SearchNowUid();
            var dcm = {};
            dcm.study = Uid.studyuid;
            dcm.series = Uid.sreiesuid;
            dcm.color = GetGraphicColor();
            if (openWriteGSPS == true && getByid("GspsPOLYLINE").selected == true) dcm.color = GetGSPSColor();
            dcm.mark = [];
            dcm.showName = GetGraphicName(); //"" + getByid("xmlMarkNameText").value;
            dcm.hideName = dcm.showName;
            if (openWriteGSPS == true && getByid("GspsPOLYLINE").selected == true) dcm.showName = getByid("GspsName").value;
            dcm.mark.push({});
            dcm.sop = Uid.sopuid;
            var DcmMarkLength = dcm.mark.length - 1;
            dcm.mark[DcmMarkLength].type = "POLYLINE";
            dcm.mark[DcmMarkLength].markX = [];
            dcm.mark[DcmMarkLength].markY = [];
            dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
            dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
            dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
            dcm.mark[DcmMarkLength].markY.push(currY);
            dcm.mark[DcmMarkLength].markX.push(currX);
            dcm.mark[DcmMarkLength].markY.push(currY);
            dcm.mark[DcmMarkLength].markX.push(currX);
            dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
            dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
            dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
            PatientMark.push(dcm);
            refreshMark(dcm);
            for (var i = 0; i < Viewport_Total; i++)
                displayMark(NowResize, null, null, null, i);
            displayAngelRular();
            PatientMark.splice(PatientMark.indexOf(dcm), 1);
        } else {
            if (rightMouseDown == true) {
                if (Math.abs(currY - GetViewport().originalPointY) > Math.abs(currX - GetViewport().originalPointX)) {
                    if (!Graphic_now_choose.mark || !Graphic_now_choose.mark.RotationAngle) Graphic_now_choose.mark.RotationAngle = 0;
                    if (currY < GetViewport().originalPointY - 1)
                        Graphic_now_choose.mark.RotationAngle += parseInt((GetViewport().originalPointY - currY) / 3);
                    else if (currY > GetViewport().originalPointY + 1)
                        Graphic_now_choose.mark.RotationAngle -= parseInt((currY - GetViewport().originalPointY) / 3);

                } else if (Math.abs(currX - GetViewport().originalPointX) > Math.abs(currY - GetViewport().originalPointY)) {
                    if (!Graphic_now_choose.mark || !Graphic_now_choose.mark.RotationAngle) Graphic_now_choose.mark.RotationAngle = 0;
                    if (currX < GetViewport().originalPointX - 1)
                        Graphic_now_choose.mark.RotationAngle += parseInt((GetViewport().originalPointX - currX) / 3);
                    else if (currX > GetViewport().originalPointX + 1)
                        Graphic_now_choose.mark.RotationAngle -= parseInt((currX - GetViewport().originalPointX) / 3);
                }
                if (Graphic_now_choose.mark.RotationAngle > 360) Graphic_now_choose.mark.RotationAngle -= 360;
                if (Graphic_now_choose.mark.RotationAngle < 0) Graphic_now_choose.mark.RotationAngle += 360;
                GetViewport().originalPointX = currX;
                GetViewport().originalPointY = currY;
            } else if (MouseDownCheck == true) {
                var Graphic_point = Graphic_now_choose.point;
                if (Graphic_now_choose.value == "up") {
                    for (var p = 0; p < Graphic_point.length; p++) {
                        Graphic_now_choose.mark.markY[Graphic_point[p]] = currY;
                    }
                } else if (Graphic_now_choose.value == "down") {
                    for (var p = 0; p < Graphic_point.length; p++) {
                        Graphic_now_choose.mark.markY[Graphic_point[p]] = currY;
                    }
                } else if (Graphic_now_choose.value == "left") {
                    for (var p = 0; p < Graphic_point.length; p++) {
                        Graphic_now_choose.mark.markX[Graphic_point[p]] = currX;
                    }
                } else if (Graphic_now_choose.value == "right") {
                    for (var p = 0; p < Graphic_point.length; p++) {
                        Graphic_now_choose.mark.markX[Graphic_point[p]] = currX;
                    }
                }
            }
            if (Graphic_now_choose.mark.RotationAngle >= 0)
                Graphic_now_choose.mark.RotationPoint = getRotationPoint(Graphic_now_choose.mark, true);
            //Graphic_now_choose.mark.RotationPoint = [Graphic_now_choose.middle[0], Graphic_now_choose.middle[1]];
            displayMark(NowResize, null, null, null, viewportNumber);
        }
    }
    if (MouseDownCheck == true) {
        if (openMeasure == true) {
            // MeasureXY = [getCurrPoint(e)[0], getCurrPoint(e)[1]];
            let angel2point = rotateCalculation(e);
            MeasureXY2 = angel2point;
            for (var i = 0; i < Viewport_Total; i++)
                displayMark(NowResize, null, null, null, i);
            displayMeasureRular();
            return;
        }
        if (openAngel == 1) {
            // MeasureXY = [getCurrPoint(e)[0], getCurrPoint(e)[1]];
            let angel2point = rotateCalculation(e);
            AngelXY0 = angel2point;
            for (var i = 0; i < Viewport_Total; i++)
                displayMark(NowResize, null, null, null, i);
            displayAngelRular();
            return;
        }

        if (openChangeFile == true && !openWriteGraphic && !openWriteXML && !openWriteGSPS) {
            var nextInstanceNumber = -1;
            var alt = GetViewport().alt;
            let index = SearchUid2Index(alt);
            // if (!index) continue;
            let i = index[0],
                j = index[1],
                k = index[2];
            var Onum = parseInt(Patient.Study[i].Series[j].Sop[k].InstanceNumber);
            var list = sortInstance(alt);
            var l = 0;
            for (l = 0; l < list.length; l++) {
                if (list[l].InstanceNumber == Onum) {
                    break;
                }
            }
            if (Math.abs(currY - GetViewport().originalPointY) < Math.abs(currX - GetViewport().originalPointX)) {
                if (currX < GetViewport().originalPointX - 3) {
                    nextFrame(viewportNumber, -1);
                    if (l - 1 < 0) nextInstanceNumber = list.length - 1;
                    else nextInstanceNumber = l - 1;
                } else if (currX > GetViewport().originalPointX + 3) {
                    nextFrame(viewportNumber, 1);
                    if (list[l].InstanceNumber == Onum) {
                        if (l + 1 >= list.length) nextInstanceNumber = 0;
                        else nextInstanceNumber = l + 1;
                    }
                }
            } else {
                if (currY < GetViewport().originalPointY - 3) {
                    nextFrame(viewportNumber, -1);
                    if (l - 1 < 0) nextInstanceNumber = list.length - 1;
                    else nextInstanceNumber = l - 1;
                } else if (currY > GetViewport().originalPointY + 3) {
                    nextFrame(viewportNumber, 1);
                    if (l + 1 >= list.length) nextInstanceNumber = 0;
                    else nextInstanceNumber = l + 1;
                }
            }
            GetViewport().originalPointX = currX;
            GetViewport().originalPointY = currY;
            if (openMPR == true && nextInstanceNumber > -1) {
                Anatomical_Section(nextInstanceNumber);
                Anatomical_Section2(nextInstanceNumber);
            }
        }

        if (openWindow == true && !openVR) {
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
            displayMeasureRular();
            SetWindowWL();
            GetViewport().originalPointX = currX;
            GetViewport().originalPointY = currY;
            WindowOpen = true;
        }
        if (openZoom == true) {
            magnifierDiv.style.display = "";
            let angel2point = rotateCalculation(e);
            magnifierIng(angel2point[0], angel2point[1]);
        }
        if ((openMouseTool == true || openRotate == true) && openWriteRTSS == false && openWriteSEG == false && openChangeFile == false && openWriteXML == false && openWriteGraphic == false && openWriteGSPS == false) {
            var MouseX = GetmouseX(e);
            var MouseY = GetmouseY(e);
            GetViewport().newMousePointX += MouseX - windowMouseX;
            GetViewport().newMousePointY += MouseY - windowMouseY;
            canvas.style.transform = "translate(" + ToPx(GetViewport().newMousePointX) + "," + ToPx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
            GetViewportMark().style.transform = "translate(" + ToPx(GetViewport().newMousePointX) + "," + ToPx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
            windowMouseX = GetmouseX(e);
            windowMouseY = GetmouseY(e);

            if (openLink == true) {
                for (var i = 0; i < Viewport_Total; i++) {
                    try {
                        GetViewportMark((i)).style.width = GetViewport(i).canvas().style.width = GetViewport().canvas().style.width;
                        GetViewportMark((i)).style.height = GetViewport(i).canvas().style.height = GetViewport().canvas().style.height;
                        GetViewportMark((i)).style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
                        GetViewport(i).canvas().style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
                        GetViewport(i).newMousePointX = GetViewport().newMousePointX;
                        GetViewport(i).newMousePointX = GetViewport().newMousePointX;
                    } catch (ex) { }
                }
            }
            putLabel();
            for (var i = 0; i < Viewport_Total; i++)
                displayRular(i);
        }

        if (openWriteXML == true) {
            if (!xml_now_choose) {
                let Uid = SearchNowUid();
                var dcm = {};
                dcm.study = Uid.studyuid;
                dcm.series = Uid.sreiesuid;
                dcm.color = "#0000FF";
                dcm.mark = [];
                dcm.showName = "" + getByid("xmlMarkNameText").value;
                dcm.hideName = dcm.showName;
                dcm.mark.push({});
                dcm.sop = Uid.sopuid;
                var DcmMarkLength = dcm.mark.length - 1;
                dcm.mark[DcmMarkLength].type = "XML_mark";
                dcm.mark[DcmMarkLength].markX = [];
                dcm.mark[DcmMarkLength].markY = [];
                dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
                dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
                dcm.mark[DcmMarkLength].markX.push(currX);
                dcm.mark[DcmMarkLength].markY.push(currY);
                PatientMark.push(dcm);
                refreshMark(dcm);
                for (var i = 0; i < Viewport_Total; i++)
                    displayMark(NowResize, null, null, null, i);
                displayAngelRular();
                PatientMark.splice(PatientMark.indexOf(dcm), 1);
            } else {
                if (xml_now_choose.value == "up") {
                    xml_now_choose.mark.markY[0] = currY;
                } else if (xml_now_choose.value == "down") {
                    xml_now_choose.mark.markY[1] = currY;
                } else if (xml_now_choose.value == "left") {
                    xml_now_choose.mark.markX[0] = currX;
                } else if (xml_now_choose.value == "right") {
                    xml_now_choose.mark.markX[1] = currX;
                }
                //setXml_context();
                for (var i = 0; i < Viewport_Total; i++)
                    displayMark(NowResize, null, null, null, i);
            }
        }
    }
    if (openWriteSEG == true & !rightMouseDown && openWindow == false) {
        var rect = getByid("SegBrushSizeText").value;
        rect = parseInt(rect);
        if (isNaN(rect) || rect < 1 || rect > 1024) rect = getByid("SegBrushSizeText").value = 10;
        refreshMarkFromSop(GetNowUid().sop);
        let angel2point = rotateCalculation(e);
        var MarkCanvas = GetViewportMark();
        var segCtx = MarkCanvas.getContext("2d");
        segCtx.beginPath();
        segCtx.strokeStyle = "#FFFF00";
        segCtx.lineWidth = "3";
        segCtx.arc(angel2point[0], angel2point[1], rect, 0, 2 * Math.PI);
        segCtx.stroke();
        segCtx.closePath();
    }
}

function Mouseup_origin(e) {
    var currX = getCurrPoint(e)[0];
    var currY = getCurrPoint(e)[1];
    // if (openPenDraw == true) return;
    if (MouseDownCheck == true) {
        if (openAngel == 1) openAngel = 2;
        else if (openAngel == 2) openAngel = 3;
    }
    if (openMouseTool == true && rightMouseDown == true)
        displayMark(NowResize, null, null, null, viewportNumber);
    MouseDownCheck = false;
    rightMouseDown = false;
    if (openVR == true) return;
    if (RTSSc_now_choose) {
        RTSSc_now_choose = null;
    }
    if (openWriteXML == true && !xml_now_choose) {
        let Uid = SearchNowUid();
        var dcm = {};
        dcm.study = Uid.studyuid;
        dcm.series = Uid.sreiesuid;
        dcm.color = "#0000FF";
        dcm.mark = [];
        dcm.showName = "" + getByid("xmlMarkNameText").value;
        dcm.hideName = dcm.showName;
        dcm.mark.push({});
        dcm.sop = Uid.sopuid;
        var DcmMarkLength = dcm.mark.length - 1;
        dcm.mark[DcmMarkLength].type = "XML_mark";
        dcm.mark[DcmMarkLength].markX = [];
        dcm.mark[DcmMarkLength].markY = [];
        dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
        dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
        dcm.mark[DcmMarkLength].markX.push(currX);
        dcm.mark[DcmMarkLength].markY.push(currY);
        PatientMark.push(dcm);
        refreshMark(dcm);
        for (var i = 0; i < Viewport_Total; i++)
            displayMark(NowResize, null, null, null, i);
        displayAngelRular();
        //setXml_context();
    }
    if (openWriteGSPS == true && getByid("GspsLINE").selected == true) {
        let Uid = SearchNowUid();
        var dcm = {};
        dcm.study = Uid.studyuid;
        dcm.series = Uid.sreiesuid;
        dcm.color = GetGSPSColor();
        dcm.mark = [];
        dcm.showName = "" + getByid("xmlMarkNameText").value; //"" + getByid("xmlMarkNameText").value;
        dcm.hideName = dcm.showName;
        dcm.mark.push({});
        dcm.sop = Uid.sopuid;
        var DcmMarkLength = dcm.mark.length - 1;
        dcm.mark[DcmMarkLength].type = "POLYLINE";
        dcm.mark[DcmMarkLength].markX = [];
        dcm.mark[DcmMarkLength].markY = [];
        dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
        dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
        dcm.mark[DcmMarkLength].markY.push(currY);
        dcm.mark[DcmMarkLength].markX.push(currX);
        PatientMark.push(dcm);
        refreshMark(dcm);
        for (var i = 0; i < Viewport_Total; i++)
            displayMark(NowResize, null, null, null, i);
        displayAngelRular();
        Graphic_now_choose = {
            reference: dcm
        };
    } //flag
    if (openWriteGSPS == true && getByid("GspsCIRCLE").selected == true) {
        let Uid = SearchNowUid();
        var dcm = {};
        dcm.study = Uid.studyuid;
        dcm.series = Uid.sreiesuid;
        dcm.color = GetGSPSColor();
        dcm.mark = [];
        dcm.showName = getByid("GspsName").value;
        dcm.hideName = dcm.showName;
        dcm.mark.push({});
        dcm.sop = Uid.sopuid;
        var DcmMarkLength = dcm.mark.length - 1;
        dcm.mark[DcmMarkLength].type = "CIRCLE";
        dcm.mark[DcmMarkLength].markX = [];
        dcm.mark[DcmMarkLength].markY = [];
        dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
        dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
        dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX + Math.sqrt(Math.pow(Math.abs(GetViewport().originalPointX - currX), 2) + Math.pow(Math.abs(GetViewport().originalPointY - currY), 2) / 2));
        dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY + Math.sqrt(Math.pow(Math.abs(GetViewport().originalPointX - currX), 2) + Math.pow(Math.abs(GetViewport().originalPointY - currY), 2) / 2));
        PatientMark.push(dcm);
        refreshMark(dcm);
        for (var i = 0; i < Viewport_Total; i++)
            displayMark(NowResize, null, null, null, i);
        displayAngelRular();
        Graphic_now_choose = {
            reference: dcm
        };
    }
    if (openWriteGraphic == true && !Graphic_now_choose || (openWriteGSPS == true && getByid("GspsPOLYLINE").selected == true && !Graphic_now_choose)) {
        if (currX <= 0)
            currX = 0;
        if (currY <= 0)
            currY = 0;
        if (currX > GetViewport().imageWidth)
            currX = GetViewport().imageWidth;
        if (currY > GetViewport().imageHeight)
            currY = GetViewport().imageHeight;
        if (GetViewport().originalPointX <= 0)
            GetViewport().originalPointX = 0;
        if (GetViewport().originalPointY <= 0)
            GetViewport().originalPointY = 0;
        if (GetViewport().originalPointX > GetViewport().imageWidth)
            GetViewport().originalPointX = GetViewport().imageWidth;
        if (GetViewport().originalPointY > GetViewport().imageHeight)
            GetViewport().originalPointY = GetViewport().imageHeight;
        let Uid = SearchNowUid();
        var dcm = {};
        dcm.study = Uid.studyuid;
        dcm.series = Uid.sreiesuid;
        dcm.color = GetGraphicColor();
        if (openWriteGSPS == true && getByid("GspsPOLYLINE").selected == true) dcm.color = GetGSPSColor();
        dcm.mark = [];
        dcm.showName = GetGraphicName(); //"" + getByid("xmlMarkNameText").value;
        dcm.hideName = dcm.showName;
        if (openWriteGSPS == true && getByid("GspsPOLYLINE").selected == true) dcm.showName = getByid("GspsName").value;

        dcm.mark.push({});
        dcm.sop = Uid.sopuid;
        var DcmMarkLength = dcm.mark.length - 1;
        dcm.mark[DcmMarkLength].type = "POLYLINE";
        dcm.mark[DcmMarkLength].markX = [];
        dcm.mark[DcmMarkLength].markY = [];
        dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
        dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
        dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
        dcm.mark[DcmMarkLength].markY.push(currY);
        dcm.mark[DcmMarkLength].markX.push(currX);
        dcm.mark[DcmMarkLength].markY.push(currY);
        dcm.mark[DcmMarkLength].markX.push(currX);
        dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
        dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
        dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
        PatientMark.push(dcm);
        Graphic_pounch(currX, (currY + GetViewport().originalPointY) / 2, dcm);
        for (var i = 0; i < Viewport_Total; i++)
            displayMark(NowResize, null, null, null, i);
        displayAngelRular();
        //set_Graphic_context();
        refreshMark(dcm);
    }

    magnifierDiv.style.display = "none";
    displayMeasureRular();
    if (openLink) {
        for (var i = 0; i < Viewport_Total; i++)
            displayRular(i);
    }
}

function Mouseout(e) {
    magnifierDiv.style.display = "none";
}