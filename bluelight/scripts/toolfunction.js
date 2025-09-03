function CreateUid(UidClass) {
    var Uid = "2.16.886.119.102568.9.";
    var date = new Date();
    Uid += date.getFullYear() + "." + (date.getMonth() + 1) + "." + (date.getDate()) + ".";
    Uid += (date.getHours() + 1) + "." + (date.getMinutes()) + "." +
        (date.getSeconds()) + "." + (date.getMilliseconds()) + ".";
    Uid += securePassword(1, 99999, 1) + ".";
    Uid += securePassword(1, 99, 1) + ".";
    Uid += securePassword(1, 9999, 1) + ".";
    if (UidClass == 0 || UidClass == 'study') Uid += securePassword(1, 2, 1);
    else if (UidClass == 1 || UidClass == 'series') Uid += securePassword(3, 4, 1);
    else if (UidClass == 2 || UidClass == 'sop') Uid += securePassword(5, 6, 1);
    else Uid += securePassword(7, 8, 1);
    if (Uid.length % 2 != 0) Uid += 0;
    return Uid;
}

function CreateSecurePassword() {
    var Uid = "xml_";
    var date = new Date();
    Uid += date.getFullYear() + "y" + (date.getMonth() + 1) + "m" + (date.getDate()) + "d";
    Uid += (date.getHours() + 1) + "h" + (date.getMinutes()) + "mm" +
        (date.getSeconds()) + "ss" + (date.getMilliseconds()) + "mmm";

    Uid += securePassword(1, 999, 1) + "b";
    Uid += securePassword(1, 999, 1) + "l";
    return Uid;
}

function securePassword(min, max, step) {
    if (!step) step = 1;
    var len = ((max - min) / step) + 1;
    var number = Math.floor((window.crypto.getRandomValues(new Uint32Array(1))[0] / (4294967295)) * (len)) * step + min;
    if (number < min) number = min;
    if (number > max) number = max;
    return number;
}

function htmlEntities(str) {
    if (str == undefined || str == null) str = "";
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/\r\n/g, "<br/>").replace(/\n/g, "<br/>");
}

function soryByKey(arr, key) {
    return arr.sort((a, b) => a[key] - b[key]);
}

function soryByTwoKey(arr, key1, key2) {
    return arr.sort((a, b) => a[key1][key2] - b[key1][key2]);
}

function random(min, max, step) {
    if (!step) step = 1;
    var len = ((max - min) / step) + 1;
    var number = Math.floor(Math.random() * (len)) * step + min;
    if (number < min) number = min;
    if (number > max) number = max;
    return number;
}

function getFactor(num) {
    var list = [];
    for (var i = 1; i <= num; i++) {
        if (num % i == 0) list.push(i);
    }
    return list;
}

function SortArrayByElem(arr, str) {
    return arr.sort((a, b) => a[str] - b[str]);
}

function splitArrayByElem(arr, str) {
    return arr.reduce((result, obj) => {
        const key = obj[str];
        if (!result[key]) {
            result[key] = [];
        }
        result[key].push(obj);
        return result;
    }, {});
}

function getCurrPoint(e) {
    var canvas = GetViewport().canvas
    if (!canvas) return [0, 0];

    var currX = parseFloat(parseFloat((e.pageX - canvas.getBoundingClientRect().left - 0)) * (1.0 / GetViewport().scale));
    var currY = parseFloat(parseFloat((e.pageY - canvas.getBoundingClientRect().top - 0)) * (1.0 / GetViewport().scale));
    return [currX, currY];
}

function getByid(str) {
    return document.getElementById(str);
}

function getByTag(str) {
    return document.getElementsByTagName(str);
}

function getClass(str) {
    return document.getElementsByClassName(str);
}

function createElem(tagName = 'div', Id = null, className = null) {
    var elem = document.createElement(tagName);
    if (Id) elem.id = Id;
    if (className) elem.className = className;
    return elem;
}

function log(value) {
    console.log(value);
}

function CheckNull(str) {
    if (str == undefined || str == null) return true;
    return false;
}

function hasScroll(element) {
    // 檢查是否出現垂直或水平卷軸
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

function getViewprtStretchSize(width, height, element) {
    var wi = (parseFloat(element.clientWidth)) / parseFloat(width);
    var he = (parseFloat(element.clientHeight)) / parseFloat(height);
    var small = he < wi ? he : wi;
    return [width * small, height * small];
}

function getViewportFixSize(width, height, row, col) {
    while (width > window.innerWidth - 100 - (bordersize * 2) && width >= 10) width -= 5;
    while (height > window.innerHeight - getByid("container").offsetTop - (bordersize * 2) && height >= 10) height -= 5;
    return [width / col, height / row];
}

function getFixSize(width, height, element) {
    while (width > window.innerWidth - 100 - (bordersize * 2) && width >= 10) width -= 5;
    while (height > window.innerHeight - getByid("container").offsetTop - (bordersize * 2) && height >= 10) height -= 5;
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

function GetmouseXY(evt) {
    return [GetmouseX(evt), GetmouseY(evt)];
}

function getDicomTagString(dataSet, tag) {
    if (!dataSet.elements[tag]) return "";

    var vr = dataSet.elements[tag].vr;
    if (vr == 'US') return dataSet.uint16(tag);
    else if (vr === 'SS') return dataSet.uint16(tag);
    else if (vr === 'UL') return dataSet.uint32(tag);
    else if (vr === 'SL') return dataSet.int32(tag);
    else if (vr === 'FD') return dataSet.double(tag);
    else if (vr === 'FL') return dataSet.float(tag);
    else return dataSet.string(tag);
}

function SearchUid2Index(sop) {
    for (var i = 0; i < ImageManager.Study.length; i++) {
        for (var j = 0; j < ImageManager.Study[i].Series.length; j++) {
            for (var l = 0; l < ImageManager.Study[i].Series[j].Sop.length; l++) {
                if (ImageManager.Study[i].Series[j].Sop[l].SOPInstanceUID == sop) {
                    return [i, j, l]
                }
            }
        }
    }
}

function sortInstance(sop) {
    let index = SearchUid2Index(sop);
    let i = index[0],
        j = index[1],
        k = index[2];
    if (ImageManager.Study[i].Series[j].Sop[k].SOPInstanceUID == sop) {
        var list = [];
        var Onum = parseInt(ImageManager.Study[i].Series[j].Sop[k].Image.InstanceNumber);
        for (var l = 0; l < ImageManager.Study[i].Series[j].Sop.length; l++) {
            list.push(ImageManager.Study[i].Series[j].Sop[l]);
        }
        for (var m = 0; m < list.length; m++) {
            for (var n = 0; n < list.length; n++) {
                if (parseInt(list[m].Image.InstanceNumber) < parseInt(list[n].Image.InstanceNumber)) {
                    var tempUID = list[m];
                    list[m] = list[n];
                    list[n] = tempUID;
                }

            }
        }
        return list;
    }
}

function rotateCalculation(e, flip = false) {
    var canvas = GetViewport().canvas;
    if (!canvas) return [0, 0];
    let cx = (GetViewport().width / 2);
    let cy = (GetViewport().height / 2);
    var element = GetViewport();
    canvas.style.transform = "translate(" + "calc(-50% + " + parseFloat(element.translate.x) + "px)" + "," + "calc(-50% + " + parseFloat(element.translate.y) + "px)" + ")scale(" + element.scale + ")";
    //BlueLight2
    /*let currX11 = (e.pageX - canvas.getBoundingClientRect().left - 0) *
        (GetViewport().width / parseFloat(canvas.style.width));
    let currY11 = (e.pageY - canvas.getBoundingClientRect().top - 0) *
        (GetViewport().height / parseFloat(canvas.style.height));*/
    let currX11 = (e.pageX - canvas.getBoundingClientRect().left - 0) *
        (1.0 / element.scale);
    let currY11 = (e.pageY - canvas.getBoundingClientRect().top - 0) *
        (1.0 / element.scale);
    canvas.style.transform = "translate(" + "calc(-50% + " + parseFloat(element.translate.x) + "px)" + "," + "calc(-50% + " + parseFloat(element.translate.y) + "px)" + ")scale(" + element.scale + ")" + "rotate(" + element.rotate + "deg)";
    let radians = element.rotate * (Math.PI / 180),
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (currX11 - cx)) + (sin * (currY11 - cy)) + cx,
        ny = (cos * (currY11 - cy)) - (sin * (currX11 - cx)) + cy;
    currX11 = nx;
    currY11 = ny;
    if (flip == true) {
        if (GetViewport().VerticalFlip == true) currY11 = GetViewport().height - currY11;
        if (GetViewport().HorizontalFlip == true) currX11 = GetViewport().width - currX11;
    }
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

function jump2UpOrEnd(number, choose) {

    var Series = ImageManager.findSeries(GetViewport().series);
    var max = Number.MIN_VALUE, min = Number.MAX_VALUE;
    for (var l = 0; l < Series.Sop.length; l++) {
        var instance = parseInt(Series.Sop[l].InstanceNumber);
        if (instance < min) min = instance;
        else if (instance > max) max = instance;
    }

    if (choose == 'up') number = min;
    else if (choose == 'end') number = max;
    else {
        if (number > max) number = max;
        if (number < min) number = min;
    }

    for (var l = 0; l < Series.Sop.length; l++) {
        if (parseInt(Series.Sop[l].InstanceNumber) == number) {
            GetViewport().loadImgBySop(Series.Sop[l]);
            break;
        }
    }
}

function jump2Mark(showName) {
    for (var n = 0; n < PatientMark.length; n++) {
        if (PatientMark[n].series == GetViewport().series) {
            if (PatientMark[n].showName == showName) {
                for (var m = 0; m < PatientMark[n].mark.length; m++) {
                    if (checkMarkEnabled(GetViewport().series, PatientMark[n]) == 0) continue;
                    else {
                        GetViewport().loadImgBySop(PatientMark[n].sop);
                        return;
                    }
                }
            }
        }
    }
}

function checkMarkEnabled(seriesUID, Mark) {
    var mark = leftLayout.getCheckboxBySeriesAndHideName(seriesUID, Mark.hideName);
    if (mark && mark.checked) return 1;
    else return 0;
}

function refreshMark(dcm, refresh) {
    if (refresh == false) return;
    leftLayout.refleshMarkWithSeries(dcm.series);
    displayAllMark();
}


function refreshMarkFromSeries(series) {
    leftLayout.refleshMarkWithSeries(series);
    displayAllMark();
}

function refreshMarkFromSop(sop) {
    var Sop = ImageManager.findSop(sop);
    if (Sop) leftLayout.refleshMarkWithSeries(Sop.parent.SeriesInstanceUID);
    displayAllMark();
}

function getDistance(x, y) {
    return Math.sqrt(x * x + y * y);
}

function getRotationPoint(Mark, middle) {
    var Max_X = Number.MIN_VALUE,
        Max_Y = Number.MIN_VALUE,
        Min_X = Number.MAX_VALUE,
        Min_Y = Number.MAX_VALUE;
    for (var o = 0; o < Mark.pointArray.length; o += 1) {
        if (parseInt(Mark.pointArray[o].x) >= Max_X) Max_X = parseInt(Mark.pointArray[o].x);
        if (parseInt(Mark.pointArray[o].x) <= Min_X) Min_X = parseInt(Mark.pointArray[o].x);
    }
    for (var o = 0; o < Mark.pointArray.length; o += 1) {
        if (parseInt(Mark.pointArray[o].y) >= Max_Y) Max_Y = parseInt(Mark.pointArray[o].y);
        if (parseInt(Mark.pointArray[o].y) <= Min_Y) Min_Y = parseInt(Mark.pointArray[o].y);
    }
    if (middle == true) return [(Max_X + Min_X) / 2, (Max_Y + Min_Y) / 2];
    return [Max_X, Min_X, Max_Y, Min_Y];
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

function GetPixel(angle2point) {
    if (!GetViewport() || !GetViewport().content || !GetViewport().content.pixelData) return "";
    var x = parseInt(angle2point[0]);
    var y = parseInt(angle2point[1]);
    var width = GetViewport().width;
    var height = GetViewport().height;
    if (GetViewport().PixelSpacing) {
        var pixel = GetViewport().content.pixelData[y * width + x];
        if (isNaN(pixel)) return "";
        else return `${pixel} `;
    } else {
        var pixelR = GetViewport().content.pixelData[y * 4 * width + x * 4 + 0];
        var pixelG = GetViewport().content.pixelData[y * 4 * width + x * 4 + 1];
        var pixelB = GetViewport().content.pixelData[y * 4 * width + x * 4 + 2];
        //var pixelA = GetViewport().content.pixelData[y * 4 * width + x * 4 + 3];
        if (isNaN(pixelR) || isNaN(pixelG) || isNaN(pixelB)) return "";
        else return `B=${pixelB} G=${pixelG} R=${pixelR} `;
    }
}

function saveStringToFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href); // 釋放 URL 物件
}