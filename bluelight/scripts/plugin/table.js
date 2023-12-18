
var openTable = true;

function displayDicomTagsList(viewportNum0) {
    if (openTable == false) return;
    var viewportNum = viewportNum0 >= 0 ? viewportNum0 : viewportNumber;
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
    Table.style['zIndex'] = "20";

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
    if (openTable == false) return;
    var viewportNum = viewportNum0 >= 0 ? viewportNum0 : viewportNumber;
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
    Table.style['zIndex'] = "20";
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
    GetViewport(viewportNum).appendChild(Table);
    GetViewport(viewportNum).style.overflowY = "scroll";
    GetViewport(viewportNum).style.overflowX = "scroll";
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