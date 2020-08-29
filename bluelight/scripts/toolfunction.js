function CreateUid(UidClass) {
    var Uid = "2.16.886.119.102568.9.";
    var date = new Date();
    Uid += date.getFullYear() + "." + (date.getMonth() + 1) + "." + (date.getDate()) + ".";
    Uid += (date.getHours() + 1) + "." + (date.getMinutes()) + "." +
        (date.getSeconds()) + "." + (date.getMilliseconds()) + ".";
    Uid += random(1, 9999999, 1) + ".";
    Uid += random(1, 99, 1) + ".";
    Uid += random(1, 9999, 1) + ".";
    if (UidClass == 0 || UidClass == 'study') Uid += random(1, 2, 1);
    else if (UidClass == 1 || UidClass == 'series') Uid += random(3, 4, 1);
    else if (UidClass == 2 || UidClass == 'sop') Uid += random(5, 6, 1);
    else Uid += random(7, 8, 1);
    if (Uid.length % 2 != 0) Uid += 0;
    return Uid;
}

function random(min, max, step) {
    if (!step) step = 1;
    var len = ((max - min) / step) + 1;
    var number = Math.floor(Math.random() * (len)) * step + min;
    if (number < min) number = min;
    if (number > max) number = max;
    return number;
}

function getCurrPoint(e) {
    var currX = parseFloat(parseFloat((e.pageX - canvas.getBoundingClientRect().left /* - newMousePointX[viewportNumber]*/ - 0)) * (GetViewport().imageWidth / parseFloat(canvas.style.width)));
    var currY = parseFloat(parseFloat((e.pageY - canvas.getBoundingClientRect().top /*- newMousePointY[viewportNumber] */ - 0)) * (GetViewport().imageHeight / parseFloat(canvas.style.height)));
    return [currX, currY];
}

function get3dCurrPoint(e) {
    var currX = parseFloat(e.pageX);
    var currY = parseFloat(e.pageY);
    // var currX = parseFloat(parseFloat((e.pageX - canvas.getBoundingClientRect().left /* - newMousePointX[viewportNumber]*/ - 0)) * (GetViewport().imageWidth / parseFloat(canvas.style.width)));
    //var currY = parseFloat(parseFloat((e.pageY - canvas.getBoundingClientRect().top /*- newMousePointY[viewportNumber] */ - 0)) * (GetViewport().imageHeight / parseFloat(canvas.style.height)));

    return [currX, currY];
}

function Css(element, style, value) {
    if (value == null) return element.style[style];
    else return element.style[style] = value;
}

function Ipx(value) {
    return parseInt(value) + "px";
}

function Fpx(value) {
    return parseFloat(value) + "px";
}

function ToPx(value) {
    return value + "px";
}

function getByid(str) {
    return document.getElementById(str);
}

function getClass(str) {
    return document.getElementsByClassName(str);
}

function Null2Empty(str) {
    if (str == undefined || str == null) str = "";
    return str;
}

function getViewprtStretchSize(width, height, element) {
    var wi = (parseFloat(element.clientWidth) - (bordersize * 2)) / parseFloat(width);
    var he = (parseFloat(element.clientHeight) - (bordersize * 2)) / parseFloat(height);
    var small = he < wi ? he : wi;
    height *= small;
    width *= small;
    return [width, height];
}

function getViewportFixSize(width, height, row, col) {
    while (width > window.innerWidth - 100 - (bordersize * 2) && width >= 10) width -= 5;
    while (height > window.innerHeight - document.getElementsByClassName("container")[0].offsetTop - (bordersize * 2) && height >= 10) height -= 5;
    return [width / col, height / row];
}

function getStretchSize(width, height, element) {
    if (width > window.innerWidth || height > window.innerHeight - document.getElementsByClassName("container")[0].offsetTop - (bordersize * 2)) {
        while (width > window.innerWidth || height > window.innerHeight - document.getElementsByClassName("container")[0].offsetTop - (bordersize * 2)) {
            width *= 0.99;
            height *= 0.99;
            if (width < 10 || height < 10) break;
        }
        /* var wi = parseFloat(width) / window.innerWidth;
        var he = parseFloat(height) / (window.innerHeight - document.getElementsByClassName("container")[0].offsetTop - (bordersize * 2));
        var wi_he = wi > he ? wi : he;
        height *= wi_he;
        width *= wi_he; */
    } else {
        if (window.innerWidth > window.innerHeight - document.getElementsByClassName("container")[0].offsetTop - (bordersize * 2)) {
            var he = (window.innerHeight - document.getElementsByClassName("container")[0].offsetTop - (bordersize * 2)) / parseFloat(height);
            height *= he;
            width *= he;

        }
        /*while (!width < window.innerWidth || !height < window.innerHeight - document.getElementsByClassName("container")[0].offsetTop - (bordersize * 2)) {
            width *= 1.1;
            height *= 1.1;
            if (width > window.innerWidth || height > window.innerHeight - document.getElementsByClassName("container")[0].offsetTop - (bordersize * 2)) break;
        }*/
    }
    return [width, height];
}

function getFixSize(width, height, element) {
    while (width > window.innerWidth - 100 - (bordersize * 2) && width >= 10) width -= 5;
    while (height > window.innerHeight - document.getElementsByClassName("container")[0].offsetTop - (bordersize * 2) && height >= 10) height -= 5;
    return [width, height];
}

function GetmouseX(evt) {
    if (evt.pageX) return (evt.pageX);
    else if (evt.clientX)
        return (evt.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft));
    else return null;
}

function GetmouseY(evt) {
    if (evt.pageY) return evt.pageY;
    else if (evt.clientY)
        return evt.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
    else return null;
}

function SearchUid2Json(alt) {
    for (var i = 0; i < Patient.StudyAmount; i++) {
        for (var j = 0; j < Patient.Study[i].SeriesAmount; j++) {
            for (var l = 0; l < Patient.Study[i].Series[j].SopAmount; l++) {
                if (Patient.Study[i].Series[j].Sop[l].SopUID == alt) {
                    return {
                        studyuid: i,
                        sreiesuid: j,
                        sopuid: l
                    }
                }
            }
        }
    }
}

function SearchUid2Index(alt) {
    for (var i = 0; i < Patient.StudyAmount; i++) {
        for (var j = 0; j < Patient.Study[i].SeriesAmount; j++) {
            for (var l = 0; l < Patient.Study[i].Series[j].SopAmount; l++) {
                if (Patient.Study[i].Series[j].Sop[l].SopUID == alt) {
                    return [i, j, l]
                }
            }
        }
    }
}

function SearchUid2IndexBySeries(alt) {
    for (var i = 0; i < Patient.StudyAmount; i++) {
        for (var j = 0; j < Patient.Study[i].SeriesAmount; j++) {
            if (Patient.Study[i].Series[j].SeriesUID == alt) {
                return [i, j];
            }
        }
    }
}

function SearchNowUid() {
    let alt = GetViewport().alt;
    for (var i = 0; i < Patient.StudyAmount; i++) {
        for (var j = 0; j < Patient.Study[i].SeriesAmount; j++) {
            for (var l = 0; l < Patient.Study[i].Series[j].SopAmount; l++) {
                if (Patient.Study[i].Series[j].Sop[l].SopUID == alt) {
                    return {
                        studyuid: Patient.Study[i],
                        sreiesuid: Patient.Study[i].Series[j],
                        sopuid: alt
                    }
                }
            }
        }
    }
}

function GetNowUid() {
    let alt = GetViewport().alt;
    for (var i = 0; i < Patient.StudyAmount; i++) {
        for (var j = 0; j < Patient.Study[i].SeriesAmount; j++) {
            for (var l = 0; l < Patient.Study[i].Series[j].SopAmount; l++) {
                if (Patient.Study[i].Series[j].Sop[l].SopUID == alt) {
                    return {
                        study: Patient.Study[i].StudyUID,
                        sreies: Patient.Study[i].Series[j].SeriesUID,
                        sop: Patient.Study[i].Series[j].Sop[l].SopUID
                    }
                }
            }
        }
    }
}

function sortInstance(alt) {
    let index = SearchUid2Index(alt);
    let i = index[0],
        j = index[1],
        k = index[2];
    if (Patient.Study[i].Series[j].Sop[k].SopUID == alt) {
        var list = [];
        var Onum = parseInt(Patient.Study[i].Series[j].Sop[k].InstanceNumber);
        for (var l = 0; l < Patient.Study[i].Series[j].Sop.length; l++) {
            list.push(Patient.Study[i].Series[j].Sop[l]);
        }
        for (var m = 0; m < list.length; m++) {
            for (var n = 0; n < list.length; n++) {
                if (parseInt(list[m].InstanceNumber) < parseInt(list[n].InstanceNumber)) {
                    var tempUID = list[m];
                    list[m] = list[n];
                    list[n] = tempUID;
                }

            }
        }
        return list;
    }
}

function getAllSop(sop) {
    let alt;
    if (!sop) alt = GetViewport().alt;
    else alt = sop;

    function getSopList(i, j, l) {
        var list = [];
        for (var l = 0; l < Patient.Study[i].Series[j].SopAmount; l++) {
            list.push(Patient.Study[i].Series[j].Sop[l].SopUID);
        }
        return list;
    }
    for (var i = 0; i < Patient.StudyAmount; i++) {
        for (var j = 0; j < Patient.Study[i].SeriesAmount; j++) {
            for (var l = 0; l < Patient.Study[i].Series[j].SopAmount; l++) {
                if (Patient.Study[i].Series[j].Sop[l].SopUID == alt) {
                    return getSopList(i, j, l);
                }
            }
        }
    }
}

function getImgaeIdFromSop(sop) {
    for (var i = 0; i < Patient.StudyAmount; i++) {
        for (var j = 0; j < Patient.Study[i].SeriesAmount; j++) {
            for (var k = 0; k < Patient.Study[i].Series[j].SopAmount; k++) {
                if (sop == Patient.Study[i].Series[j].Sop[k].SopUID)
                    return Patient.Study[i].Series[j].Sop[k].imageId;
            }
        }
    }
}

function getNowInstance() {
    var break1 = false;
    var nowInstanceNumber = 0;
    var alt = GetViewport().alt;
    for (var i = 0; i < Patient.StudyAmount; i++) {
        for (var j = 0; j < Patient.Study[i].SeriesAmount; j++) {
            for (var k = 0; k < Patient.Study[i].Series[j].SopAmount; k++) {
                if (Patient.Study[i].Series[j].Sop[k].SopUID == alt) {
                    if (break1 == true) break;
                    var Onum = parseInt(Patient.Study[i].Series[j].Sop[k].InstanceNumber);
                    var list = sortInstance(alt);
                    for (var l = 0; l < list.length; l++) {
                        if (break1 == true) break;
                        if (list[l].InstanceNumber == Onum) {
                            nowInstanceNumber = l;
                        }
                    }
                }
            }
        }
    }
    return nowInstanceNumber;
}

function rotateCalculation(e) {
    let cx = (GetViewport().imageWidth / 2);
    let cy = (GetViewport().imageHeight / 2);
    canvas.style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")";
    let currX11 = (e.pageX - canvas.getBoundingClientRect().left - 0) *
        (GetViewport().imageWidth / parseFloat(canvas.style.width));
    let currY11 = (e.pageY - canvas.getBoundingClientRect().top - 0) *
        (GetViewport().imageHeight / parseFloat(canvas.style.height));
    canvas.style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
    let radians = GetViewport().rotateValue * (Math.PI / 180),
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (currX11 - cx)) + (sin * (currY11 - cy)) + cx,
        ny = (cos * (currY11 - cy)) - (sin * (currX11 - cx)) + cy;
    currX11 = nx;
    currY11 = ny;
    return [currX11, currY11];
}

function rotatePoint(point, RotationAngle, RotationPoint) {
    let cx = RotationPoint[0];
    let cy = RotationPoint[1];
    currX = point[0];
    currY = point[1];
    let radians = RotationAngle * (Math.PI / 180),
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (currX - cx)) + (sin * (currY - cy)) + cx,
        ny = (cos * (currY - cy)) - (sin * (currX - cx)) + cy;
    currX = nx;
    currY = ny;
    return [currX, currY];
}

function GetViewport(num) {
    if (!num) {
        if (num === 0) {
            return getByid("MyDicomDiv" + (0 + 0));
        }
        return getByid("MyDicomDiv" + (viewportNumber + 0));
    }
    return getByid("MyDicomDiv" + (num + 0));
}

function GetViewportMark(num) {
    if (!num) {
        if (num === 0) {
            return getByid("MarkCanvas" + (0 - 0));
        }
        return getByid("MarkCanvas" + (viewportNumber - 0));
    }
    return getByid("MarkCanvas" + (num - 0));
}

function jump2Mark(showName) {
    let index = SearchUid2Index(GetViewport().alt);
    if (!index) return;
    let i = index[0],
        j = index[1],
        k = index[2];
    for (var n = 0; n < PatientMark.length; n++) {
        if (PatientMark[n].series == Patient.Study[i].Series[j].SeriesUID) {
            if (PatientMark[n].showName == showName) {
                for (var m = 0; m < PatientMark[n].mark.length; m++) {
                    let checkRtss = 0;
                    checkRtss = checkMark(i, j, n);
                    if (checkRtss == 0) continue;
                    else {
                        loadAndViewImage(getImgaeIdFromSop(PatientMark[n].sop));
                        return;
                    }
                }
            }
        }
    }
}

function checkMark(i, j, n) {
    let checkRtss = 0;
    for (var dCount = 0; dCount < dicomImageCount; dCount++) {
        if (getByid("dicomDivListDIV" + dCount)) {
            if (getByid("dicomDivListDIV" + dCount).alt == Patient.Study[i].Series[j].SeriesUID) {
                var elem = document.querySelectorAll("#dicomDivListDIV" + dCount + " label input");
                for (var elemNum in elem) {
                    if (elem[elemNum].name == PatientMark[n].showName) {
                        if (elem[elemNum].alt == "true") {
                            checkRtss = 1;
                            return checkRtss;
                        }
                    }
                }
            }
        }
    }
    return checkRtss;
}

function refreshMark(dcm) {
    var index = SearchUid2Index(dcm.sop);
    if (!index) return;
    var i3 = index[0],
        j3 = index[1],
        k3 = index[2];
    var checkNum;
    for (var dCount = 0; dCount < dicomImageCount; dCount++) {
        if (getByid("dicomDivListDIV" + dCount) && getByid("dicomDivListDIV" + dCount).alt == Patient.Study[i3].Series[j3].SeriesUID) {
            checkNum = dCount;
        }
    }
    SetToLeft(Patient.Study[i3].Series[j3].SeriesUID, checkNum, Patient.Study[i3].PatientId);
    for (var i9 = 0; i9 < Viewport_Total; i9++) displayMark(NowResize, null, null, null, i9);
}

function refreshMarkFromSop(sop) {
    var index = SearchUid2Index(sop);
    if (!index) return;
    var i3 = index[0],
        j3 = index[1],
        k3 = index[2];
    var checkNum;
    for (var dCount = 0; dCount < dicomImageCount; dCount++) {
        if (getByid("dicomDivListDIV" + dCount) && getByid("dicomDivListDIV" + dCount).alt == Patient.Study[i3].Series[j3].SeriesUID) {
            checkNum = dCount;
        }
    }
    SetToLeft(Patient.Study[i3].Series[j3].SeriesUID, checkNum, Patient.Study[i3].PatientId);
    for (var i9 = 0; i9 < Viewport_Total; i9++) displayMark(NowResize, null, null, null, i9);
}

function rotate3dVR(VrDistance) {
    if ((!(degerrY >= 90 && degerrY <= 270) && (degerrX >= 90 && degerrX <= 270)) ||
        (degerrY >= 90 && degerrY <= 270) && !(degerrX >= 90 && degerrX <= 270)) {
        for (var ll = 0; ll < o3DListLength; ll++) {
            var canvas1 = getByid("3DDiv" + ll).getElementsByClassName("cornerstone-canvas")[0];
            var div1 = getByid("3DDiv" + ll);
            div1.style.zIndex = -ll + o3DListLength + o3d_3degree;
            div1.style.transform = "translate3d(0,0,0) rotateY(" + degerrX + "deg) rotateX(" + degerrY + "deg)  translateZ(" + (parseFloat(parseFloat(1) * (parseFloat(canvas1.style.height) / parseFloat(GetViewport().imageHeight))) * (div1.thickness - Thickness) - (VrDistance / 2)) + "px)";
        }
    } else {
        for (var ll = 0; ll < o3DListLength; ll++) {
            var canvas1 = getByid("3DDiv" + ll).getElementsByClassName("cornerstone-canvas")[0];
            var div1 = getByid("3DDiv" + ll);
            div1.style.zIndex = ll + o3d_3degree;
            div1.style.transform = "translate3d(0,0,0) rotateY(" + degerrX + "deg) rotateX(" + degerrY + "deg)  translateZ(" + (parseFloat(parseFloat(1) * (parseFloat(canvas1.style.height) / parseFloat(GetViewport().imageHeight))) * (div1.thickness - Thickness) - (VrDistance / 2)) + "px)";
        }
    }
    if ((!(degerrY >= 0 && degerrY <= 180) && (degerrX >= 90 && degerrX <= 270)) ||
        (degerrY >= 0 && degerrY <= 180) && !(degerrX >= 90 && degerrX <= 270)) {
        for (var ll = 0; ll < o3d_3degree; ll++) {
            var div2 = getByid("3DDiv2_" + ll);
            if (Math.abs(90 - degerrY) < 25 || Math.abs(270 - degerrY) < 25)
                div2.style.zIndex = ll + o3DListLength + o3d_3degree;
            else
                div2.style.zIndex = ll;
            div2.style.transform = "translate3d(0,0,0) rotateY(" + (degerrX + 0) + "deg) rotateX(" + (degerrY + 0) + "deg)  translateZ(" + (0) + "px)";
        }
    } else {
        for (var ll = 0; ll < o3d_3degree; ll++) {
            var div2 = getByid("3DDiv2_" + ll);
            if (Math.abs(90 - degerrY) < 25 || Math.abs(270 - degerrY) < 25)
                div2.style.zIndex = -ll + o3DListLength + o3d_3degree + o3d_3degree;
            else
                div2.style.zIndex = -ll + o3d_3degree;
            div2.style.transform = "translate3d(0,0,0) rotateY(" + (degerrX + 0) + "deg) rotateX(" + (degerrY + 0) + "deg)  translateZ(" + (0) + "px)";
        }
    }
    if ((!(degerrY >= 90 && degerrY <= 270) && (degerrX >= 0 && degerrX <= 180)) ||
        (degerrY >= 90 && degerrY <= 270) && !(degerrX >= 0 && degerrX <= 180)) {
        for (var ll = 0; ll < o3d_3degree; ll++) {
            var div3 = getByid("3DDiv3_" + ll);
            if (Math.abs(90 - degerrY) < 25 || Math.abs(270 - degerrY) < 25) {
                if (Math.abs(90 - degerrX) < 25 || Math.abs(270 - degerrX) < 25) {
                    if (degerrX >= 0 && degerrX <= 180) {
                        div3.style.zIndex = -ll + o3DListLength + o3d_3degree + o3d_3degree;
                    } else {
                        div3.style.zIndex = ll + o3DListLength + o3d_3degree;
                    }
                } else {
                    if (degerrX >= 0 && degerrX <= 180) {
                        div3.style.zIndex = -ll + o3d_3degree;
                    } else {
                        div3.style.zIndex = ll;
                    }
                }
            } else {
                if (Math.abs(90 - degerrX) < 25 || Math.abs(270 - degerrX) < 25) {
                    if (degerrX >= 0 && degerrX <= 180) {
                        div3.style.zIndex = -ll + o3d_3degree + o3DListLength + o3d_3degree;
                    } else {
                        div3.style.zIndex = ll + o3DListLength + o3d_3degree;
                    }
                } else {
                    if (degerrX >= 0 && degerrX <= 180) {
                        div3.style.zIndex = -ll + o3d_3degree;
                    } else {
                        div3.style.zIndex = ll;
                    }
                }
            }
            div3.style.transform = "translate3d(0,0,0) rotateY(" + (degerrX + 0) + "deg) rotateX(" + (degerrY + 0) + "deg)  translateZ(" + (0) + "px)";
        }
    } else {
        for (var ll = 0; ll < o3d_3degree; ll++) {
            var div3 = getByid("3DDiv3_" + ll);
            if (Math.abs(90 - degerrY) < 25 || Math.abs(270 - degerrY) < 25) {
                if (Math.abs(90 - degerrX) < 25 || Math.abs(270 - degerrX) < 25) {
                    if (degerrX >= 0 && degerrX <= 180) {
                        div3.style.zIndex = -ll + o3d_3degree + o3DListLength + o3d_3degree;
                    } else {
                        div3.style.zIndex = ll + o3DListLength + o3d_3degree;
                    }
                } else {
                    if (degerrX >= 0 && degerrX <= 180) {
                        div3.style.zIndex = -ll + o3d_3degree;
                    } else {
                        div3.style.zIndex = ll;
                    }
                }
            } else {
                if (Math.abs(90 - degerrX) < 25 || Math.abs(270 - degerrX) < 25) {
                    if (degerrX >= 0 && degerrX <= 180) {
                        div3.style.zIndex = -ll + o3d_3degree + o3DListLength + o3d_3degree;
                    } else {
                        div3.style.zIndex = ll + o3DListLength + o3d_3degree;
                    }
                } else {
                    if (degerrX >= 0 && degerrX <= 180) {
                        div3.style.zIndex = -ll + o3d_3degree;
                    } else {
                        div3.style.zIndex = ll;
                    }
                }
            }
            div3.style.transform = "translate3d(0,0,0) rotateY(" + (degerrX + 0) + "deg) rotateX(" + (degerrY + 0) + "deg)  translateZ(" + (0) + "px)";
        }
    }
}

function setVrLight() {
    var num = 0;
    if (getByid("3dShadow_0").selected == true) num = 0;
    else if (getByid("3dShadow_05").selected == true) num = 0.005;
    else if (getByid("3dShadow_1").selected == true) num = 0.01;
    else if (getByid("3dShadow_2").selected == true) num = 0.02;
    else if (getByid("3dShadow_3").selected == true) num = 0.03;
    else if (getByid("3dShadow_4").selected == true) num = 0.04;
    else if (getByid("3dShadow_5").selected == true) num = 0.05;
    else if (getByid("3dShadow_6").selected == true) num = 0.06;
    else if (getByid("3dShadow_7").selected == true) num = 0.07;
    else if (getByid("3dShadow_8").selected == true) num = 0.08;
    else if (getByid("3dShadow_12").selected == true) num = 0.12;
    if (num == 0) {
        for (var ll = 0; ll < o3DListLength; ll++) {
            var canvas1 = getByid("3DDiv" + ll).canvas();
            canvas1.style.backgroundColor = "";
        }
        for (var ll = 0; ll < o3d_3degree; ll++) {
            var canvas1 = getByid("3DDiv2_" + ll).canvas();
            canvas1.style.backgroundColor = "";
        }
        for (var ll = 0; ll < o3d_3degree; ll++) {
            var canvas1 = getByid("3DDiv3_" + ll).canvas();
            canvas1.style.backgroundColor = "";
        }
    } else {
        for (var ll = 0; ll < o3DListLength; ll++) {
            var canvas1 = getByid("3DDiv" + ll).canvas();
            canvas1.style.backgroundColor = "rgba(0,0,0," + num + ")";
        }
        for (var ll = 0; ll < o3d_3degree; ll++) {
            var canvas1 = getByid("3DDiv2_" + ll).canvas();
            canvas1.style.backgroundColor = "rgba(0,0,0," + num + ")";
        }
        for (var ll = 0; ll < o3d_3degree; ll++) {
            var canvas1 = getByid("3DDiv3_" + ll).canvas();
            canvas1.style.backgroundColor = "rgba(0,0,0," + num + ")";
        }
    }
}

function get3dDistance() {
    var VrDistance = 0;
    VrDistance += getByid("3DDiv" + (o3Dcount - 1)).thickness - (getByid("3DDiv" + 0).thickness);
    if (VrDistance < 0) VrDistance *= -1;
    VrDistance *= (parseFloat(getByid("3DDiv" + 0).canvas().style.height) / parseFloat(GetViewport().imageHeight));
    return VrDistance;
}

function dropTable(num) {
    if (getByid("DicomTagsTable" + (num + 1))) {
        var elem = getByid("DicomTagsTable" + (num + 1));
        elem.parentElement.removeChild(elem);
    }
    if (getByid("AimTable" + (num + 1))) {
        var elem = getByid("AimTable" + (num + 1));
        elem.parentElement.removeChild(elem);
    }
}

function getMarkSize(MarkCanvas, sizeCheck) {
    var lineSize = parseFloat(getByid('markSizeText').value);
    var lineWid = parseFloat(MarkCanvas.width) / parseFloat(Css(MarkCanvas, 'width'));
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
    return ((Math.abs(lineWid)) * 2 * lineSize);
}

function getDistance(x, y) {
    return Math.sqrt(x * x + y * y);
}

function getRotationPoint(mark, middle) {
    var Max_X = -999999,
        Max_Y = -999999,
        Min_X = 999999,
        Min_Y = 999999;
    for (var o = 0; o < mark.markX.length; o += 1) {
        if (parseInt(mark.markX[o]) >= Max_X) Max_X = parseInt(mark.markX[o]);
        if (parseInt(mark.markX[o]) <= Min_X) Min_X = parseInt(mark.markX[o]);
    }
    for (var o = 0; o < mark.markY.length; o += 1) {
        if (parseInt(mark.markY[o]) >= Max_Y) Max_Y = parseInt(mark.markY[o]);
        if (parseInt(mark.markY[o]) <= Min_Y) Min_Y = parseInt(mark.markY[o]);
    }
    if (middle == true) return [(Max_X + Min_X) / 2, (Max_Y + Min_Y) / 2];
    return [Max_X, Min_X, Max_Y, Min_Y];
}

function GetGraphicColor() {
    //if (getByid("Graphicselected").selected) return "#0000FF";
    if (getByid("GraphicBlackSelect").selected) return "#000000";
    else if (getByid("GraphicBlueSelect").selected) return "#0000FF";
    else if (getByid("GraphicBrownSelect").selected) return "#844200";
    else if (getByid("GraphicCyanSelect").selected) return "#00FFFF";
    else if (getByid("GraphicGreenSelect").selected) return "#00FF00";
    else if (getByid("GraphicMagentaSelect").selected) return "#FF00FF";
    else if (getByid("GraphicOrangeSelect").selected) return "#FFA500";
    else if (getByid("GraphicPurpleSelect").selected) return "#663399";
    else if (getByid("GraphicRedSelect").selected) return "#FF0000";
    else if (getByid("GraphicYellowSelect").selected) return "#FFFF00";
    else if (getByid("GraphicWhiteSelect").selected) return "#FFFFFF";
    else return "#0000FF";
}

function GetGSPSColor() {
    //if (getByid("Graphicselected").selected) return "#0000FF";
    if (getByid("GSPSBlackSelect").selected) return "#000000";
    else if (getByid("GSPSBlueSelect").selected) return "#0000FF";
    else if (getByid("GSPSBrownSelect").selected) return "#844200";
    else if (getByid("GSPSCyanSelect").selected) return "#00FFFF";
    else if (getByid("GSPSGreenSelect").selected) return "#00FF00";
    else if (getByid("GSPSMagentaSelect").selected) return "#FF00FF";
    else if (getByid("GSPSOrangeSelect").selected) return "#FFA500";
    else if (getByid("GSPSPurpleSelect").selected) return "#663399";
    else if (getByid("GSPSRedSelect").selected) return "#FF0000";
    else if (getByid("GSPSYellowSelect").selected) return "#FFFF00";
    else if (getByid("GSPSWhiteSelect").selected) return "#FFFFFF";
    else return "#0000FF";
}

function GetGraphicName() {
    //if (getByid("Graphicselected").selected) return "T8";
    if (getByid("GraphicBlackSelect").selected) return "T7";
    else if (getByid("GraphicBlueSelect").selected) return "T8";
    else if (getByid("GraphicBrownSelect").selected) return "T9";
    else if (getByid("GraphicCyanSelect").selected) return "T10";
    else if (getByid("GraphicGreenSelect").selected) return "T11";
    else if (getByid("GraphicMagentaSelect").selected) return "T12";
    else if (getByid("GraphicOrangeSelect").selected) return "L1";
    else if (getByid("GraphicPurpleSelect").selected) return "L2";
    else if (getByid("GraphicRedSelect").selected) return "L3";
    else if (getByid("GraphicYellowSelect").selected) return "L4";
    else if (getByid("GraphicWhiteSelect").selected) return "L5";
    else return "T8";
}

function ConvertGraphicColor(r, g, b) {
    var str = "" + r + "\\" + g + "\\" + b;
    if (str == "0\\32896\\32896") return ["#000000", "T7"];
    else if (str == "0\\32896\\33153") return ["#0000FF", "T8"];
    else if (str == "393\\32998\\32947") return ["#844200", "T9"];
    else if (str == "0\\33153\\33153") return ["#00FFFF", "T10"];
    else if (str == "0\\33153\\32896") return ["#00FF00", "T11"];
    else if (str == "655\\32896\\33153") return ["#FF00FF", "T12"];
    else if (str == "655\\33025\\32896") return ["#FFA500", "L1"];
    else if (str == "328\\32896\\33025") return ["#663399", "L2"];
    else if (str == "655\\32896\\32896") return ["#FF0000", "L3"];
    else if (str == "655\\33153\\32896") return ["#FFFF00", "L4"];
    else if (str == "655\\33153\\33153") return ["#FFFFFF", "L5"];
    else return undefined;
}

function SetGraphicColor(str) {
    if (str == "#000000") return "0\\32896\\32896";
    else if (str == "#0000FF") return "0\\32896\\33153";
    else if (str == "#844200") return "393\\32998\\32947";
    else if (str == "#00FFFF") return "0\\33153\\33153";
    else if (str == "#00FF00") return "0\\33153\\32896";
    else if (str == "#FF00FF") return "655\\32896\\33153";
    else if (str == "#FFA500") return "655\\33025\\32896";
    else if (str == "#663399") return "328\\32896\\33025";
    else if (str == "#FF0000") return "655\\32896\\32896";
    else if (str == "#FFFF00") return "655\\33153\\32896";
    else if (str == "#FFFFFF") return "655\\33153\\33153";
    else return "0\\32896\\33153";
}

function equal_TOL(a, b, tolerance) {
    if (tolerance === undefined) tolerance = 1;
    if (Math.abs(a - b) <= tolerance) return true;
    return false;
}

function getColorFromRGB(str) {
    return str.split("(")[1].split(")")[0].split(",");
}

function getColorFrom16(r, g, b, bit) {
    if (bit == 16) {
        r = parseInt(r / 256);
        g = parseInt(g / 256);
        b = parseInt(b / 256);
    }

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
    return rgbToHex(r, g, b);
}

function getRGBFrom0xFF(color, RGB, invert) {
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    var R = hexToRgb(color).r;
    var G = hexToRgb(color).g;
    var B = hexToRgb(color).b;
    if (invert == true) {
        R = 255 - R;
        G = 255 - G;
        B = 255 - B;
    }
    if (RGB == true) return ([R, G, B]);
    else return (getColorFrom16(R, G, B, 8));
}