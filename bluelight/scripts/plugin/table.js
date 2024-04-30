
var openTable = true;

function displayDicomTagsList(viewportNum = viewportNumber) {
    if (openTable == false) return;

    dropTable(viewportNum);
    GetViewport(viewportNum).div.style.overflowY = "hidden";
    GetViewport(viewportNum).div.style.overflowX = "hidden";
    if (getByid("DICOMTagsSelect").selected == false) return;
    if (openDisplayMarkup == false) return;
    var Table = document.createElement("table");
    Table.id = "DicomTagsTable" + (viewportNum + 1);
    Table.className = "DicomTable";
    Table.setAttribute("border", 2);

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
    for (var i = 0; i < GetViewport().tags.length; i++) {
        var row = Table.insertRow(rowCount);
        row.setAttribute("border", 2);
        row.style.backgroundColor = "#151515";
        var cells = row.insertCell(0);
        cells.innerHTML = "" + GetViewport().tags[i][0];
        cells = row.insertCell(1);
        cells.innerHTML = "" + GetViewport().tags[i][1];
        cells = row.insertCell(2);
        if (GetViewport().tags[i][2] && GetViewport().tags[i][2].length > 100)
            cells.innerHTML = ("" + GetViewport().tags[i][2]).substring(0, 99) + "...";
        else
            cells.innerHTML = "" + GetViewport().tags[i][2];
        /*var dicomtag = GetViewport().tags[i][0].replace("x", "");
        dicomtag = dicomtag.slice(0, 4) + "," + dicomtag.slice(4);
        cells.innerHTML = "" + dicomtag;

        cells = row.insertCell(1);
        if (GetViewport().tags[i][1] && GetViewport().tags[i][1].length > 100)
            cells.innerHTML = "";
        else
            cells.innerHTML = "" + GetViewport().tags[i][1];*/
        rowCount++;
    }
    GetViewport(viewportNum).div.appendChild(Table);
    GetViewport(viewportNum).div.style.overflowY = "scroll";
    GetViewport(viewportNum).div.style.overflowX = "scroll";
}

function displayAIM(viewportNum = viewportNumber) {
    if (openTable == false) return;

    var break1 = false;
    dropTable(viewportNum);
    GetViewport(viewportNum).div.style.overflowY = "hidden";
    GetViewport(viewportNum).div.style.overflowX = "hidden"
    if (getByid("AIMSelect").selected == false) return;
    if (openDisplayMarkup == false) return;
    var Table = document.createElement("table");
    Table.id = "AimTable" + (viewportNum + 1);
    Table.className = "DicomTable";
    Table.setAttribute("border", 2);
   
    //SearchUid2Index
    var sop = GetViewport(viewportNum).sop;
    let index = SearchUid2Index(sop);
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
    GetViewport(viewportNum).div.appendChild(Table);
    GetViewport(viewportNum).div.style.overflowY = "scroll";
    GetViewport(viewportNum).div.style.overflowX = "scroll";
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

function createDicomTagsList2Viewport(viewport) {
    function getTag(tag) {
        var group = tag.substring(1, 5);
        var element = tag.substring(5, 9);
        var tagIndex = (`(${group},${element})`).toUpperCase();
        var attr = TAG_DICT[tagIndex];
        return attr;
    }

    /*//清除之前的值
    if (element.DicomTagsList) {
        for (var elem of element.DicomTagsList) {
            element[elem[1]] = undefined;
        }
    }*/
    //取得DICOM Tags放入清單
    viewport.DicomTagsList = [];
    viewport.imageId = viewport.content.image.imageId ? viewport.content.image.imageId : "";

    for (el in viewport.content.image.data.elements) {
        try {
            var tag = (`(${el.substring(1, 5)},${el.substring(5, 9)})`).toUpperCase();
            var el1 = getTag(el);
            el1.tag = "" + el;
            var content = dicomParser.explicitElementToString(viewport.content.image.data, el1);
            if (content) {
                viewport.DicomTagsList.push([tag, el1.name, content]);
                viewport.DicomTagsList[el1.name] = content;
            } else {
                var name = ("" + el1.name).toLowerCase();
                if (!viewport.content.image[name]) {
                    if (el1.vr == 'US') {
                        viewport.DicomTagsList.push([tag, el1.name, viewport.content.image.data.uint16(el)]);
                        viewport.DicomTagsList[el1.name] = image.data.uint16(el);
                    } else if (el1.vr === 'SS') {
                        viewport.DicomTagsList.push([tag, el1.name, viewport.content.image.data.int16(el)]);
                        viewport.DicomTagsList[el1.name] = image.data.int16(el);
                    } else if (el1.vr === 'UL') {
                        viewport.DicomTagsList.push([tag, el1.name, viewport.content.image.data.uint32(el)]);
                        viewport.DicomTagsList[el1.name] = image.data.uint32(el);
                    } else if (el1.vr === 'SL') {
                        viewport.DicomTagsList.push([tag, el1.name, viewport.content.image.data.int32(el)]);
                        viewport.DicomTagsList[el1.name] = image.data.int32(el);
                    } else if (el1.vr === 'FD') {
                        viewport.DicomTagsList.push([tag, el1.name, viewport.content.image.data.double(el)]);
                        viewport.DicomTagsList[el1.name] = image.data.double(el);
                    } else if (el1.vr === 'FL') {
                        viewport.DicomTagsList.push([tag, el1.name, viewport.content.image.data.float(el)]);
                        viewport.DicomTagsList[el1.name] = image.data.float(el);
                    } else {
                        viewport.DicomTagsList.push([tag, el1.name, ""]);
                        viewport.DicomTagsList[el1.name] = "";
                    }
                } else {
                    viewport.DicomTagsList.push([tag, el1.name, viewport.content.image[name]]);
                    viewport[el1.name] = viewport.content.image[name];
                }
            }
        } catch (ex) { }
    }
}