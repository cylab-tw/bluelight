function cancelTools() {
    getByid("WindowDefault").selected = true;

    setWindowLevel();
    displayMark();
    SetAllViewport("cine", false);
    PlayCine();
}

function displayAllRuler() {
    for (var i = 0; i < Viewport_Total; i++)
        displayRuler(i);
}

function displayRuler(viewportNum = viewportNumber) {
    var viewport = GetViewport(viewportNum);
    if (!openAnnotation || !viewport || !viewport.content || !viewport.content.image) {
        getClass("downRule")[viewportNum].style.display = "none";
        getClass("leftRule")[viewportNum].style.display = "none";
        return;
    }
    try {
        var downRule = getClass("downRule")[viewportNum];

        const offsetWidth = viewport.div.offsetWidth;
        if (downRule.width != offsetWidth) downRule.width = offsetWidth;

        downRule.style.display = "";

        var tempctx = downRule.getContext("2d");
        tempctx.clearRect(0, 0, offsetWidth, 20);
        tempctx.strokeStyle = tempctx.fillStyle = "#FFFFFF";
        tempctx.lineWidth = "2";
        var x1 = 0, y1 = 0;

        tempctx.beginPath();
        var PixelSpacingX = 1.0 / viewport.PixelSpacing[0];
        if (PixelSpacingX) {
            tempctx.moveTo(0 + (offsetWidth / 2) - (50 * PixelSpacingX) * (viewport.scale), 10 + 10);
            tempctx.lineTo((90 * PixelSpacingX) * (viewport.scale) + (offsetWidth / 2) - (40 * PixelSpacingX) * (viewport.scale), 10 + 10);
            for (var i = 0; i <= 10; i++) {
                tempctx.moveTo(x1 + (offsetWidth / 2) - (50 * PixelSpacingX) * (viewport.scale), y1 + 10);
                tempctx.lineTo(x1 + (offsetWidth / 2) - (50 * PixelSpacingX) * (viewport.scale), y1 + 10 + 10);
                tempctx.stroke();
                x1 += (10 * PixelSpacingX) * (viewport.scale);
            }
            tempctx.closePath();
            x1 -= (10 * PixelSpacingX) * (viewport.scale);

            tempctx.font = "" + (12) + "px Arial";
            tempctx.fillText("100 mm", 2 + x1 + (offsetWidth / 2) - (50 * PixelSpacingX) * (viewport.scale), y1 + 3 + 10 + 5)
        } else {
            tempctx.strokeStyle = "#4855FF";
            var PX = 1, PY = 1;
            tempctx.moveTo(0 + (offsetWidth / 2) - (50 * PX) * (viewport.scale), 10 + 10);
            tempctx.lineTo((90 * PX) * (viewport.scale) + (offsetWidth / 2) - (40 * PX) * (viewport.scale), 10 + 10);
            for (var i = 0; i <= 10; i++) {
                tempctx.moveTo(x1 + (offsetWidth / 2) - (50 * PX) * (viewport.scale), y1 + 10);
                tempctx.lineTo(x1 + (offsetWidth / 2) - (50 * PX) * (viewport.scale), y1 + 10 + 10);
                tempctx.stroke();
                x1 += (10 * PX) * (viewport.scale);
            }
            tempctx.closePath();
            x1 -= (10 * PX) * (viewport.scale);

            tempctx.font = "" + (12) + "px Arial";
            tempctx.fillText("100 pix", 2 + x1 + (offsetWidth / 2) - (50 * PX) * (viewport.scale), y1 + 3 + 10 + 5)
        }

    } catch (ex) { }
    displayRuler2(viewportNum);
}

function displayRuler2(viewportNum = viewportNumber) {
    var viewport = GetViewport(viewportNum);
    try {
        var leftRule = getClass("leftRule")[viewportNum];
        var offsetHeight = viewport.div.offsetHeight;
        leftRule.height = offsetHeight;
        leftRule.style.display = "";

        var tempctx = leftRule.getContext("2d");

        tempctx.clearRect(0, 0, 20, offsetHeight);
        tempctx.strokeStyle = tempctx.fillStyle = "#FFFFFF";
        tempctx.lineWidth = "2";
        tempctx.beginPath();
        var x1 = 0, y1 = 0;

        var PixelSpacingY = 1.0 / viewport.PixelSpacing[1];
        if (PixelSpacingY) {
            tempctx.font = "12px Arial";
            tempctx.fillText("100 mm", 0, -5 + (offsetHeight / 2) - (50 * PixelSpacingY) * (viewport.scale))

            tempctx.moveTo(0, 0 + (offsetHeight / 2) - (50 * PixelSpacingY) * (viewport.scale));
            tempctx.lineTo(0, (90 * PixelSpacingY) * (viewport.scale) - (40 * PixelSpacingY) * (viewport.scale) + (offsetHeight / 2));
            tempctx.stroke();
            for (var i = 0; i <= 10; i++) {
                tempctx.moveTo(x1, y1 + (offsetHeight / 2) - (50 * PixelSpacingY) * (viewport.scale));
                tempctx.lineTo(x1 + 10, y1 + (offsetHeight / 2) - (50 * PixelSpacingY) * (viewport.scale));
                tempctx.stroke();
                y1 += (10 * PixelSpacingY) * (viewport.scale);
            }
            tempctx.closePath();
        } else {
            tempctx.strokeStyle = "#4855FF";
            var PX = 1, PY = 1;
            tempctx.font = "12px Arial";
            tempctx.fillText("100 pix", 0, -5 + (offsetHeight / 2) - (50 * PY) * (viewport.scale))

            tempctx.moveTo(0, 0 + (offsetHeight / 2) - (50 * PY) * (viewport.scale));
            tempctx.lineTo(0, (90 * PY) * (viewport.scale) - (40 * PY) * (viewport.scale) + (offsetHeight / 2));
            tempctx.stroke();
            for (var i = 0; i <= 10; i++) {
                tempctx.moveTo(x1, y1 + (offsetHeight / 2) - (50 * PY) * (viewport.scale));
                tempctx.lineTo(x1 + 10, y1 + (offsetHeight / 2) - (50 * PY) * (viewport.scale));
                tempctx.stroke();
                y1 += (10 * PY) * (viewport.scale);
            }
            tempctx.closePath();
        }
    } catch (ex) { }
}

function setTransformAll() {
    for (var z = 0; z < Viewport_Total; z++) setTransform(z);
}

function setTransform(viewportnum = viewportNumber) {
    var element = GetViewport(viewportnum);
    var scale = element.scale ? element.scale : 1;
    GetViewportMark(viewportnum).style.transform = `translate(calc(-50% + ${parseFloat(element.translate.x)}px) , calc(-50% + ${parseFloat(element.translate.y)}px)) scale( ${scale} ) rotate( ${element.rotate}deg)`;
    element.canvas.style.transform = `translate(calc(-50% + ${parseFloat(element.translate.x)}px) , calc(-50% + ${parseFloat(element.translate.y)}px)) scale( ${scale} ) rotate( ${element.rotate}deg)`;
    element.canvas.style.position = "absolute";
    GetViewportMark(viewportnum).style.position = "absolute";
    element.setLabel("scale", "" + (100 * element.scale).toFixed(1) + "%");
    element.refleshLabel();
    refleshGUI();
}

function resetViewport(viewportNum = viewportNumber) {
    GetViewport(viewportNum).translate.x = GetViewport(viewportNum).translate.y = GetViewport(viewportNum).rotate = 0;
    GetViewport(viewportNum).scale = null;
    GetViewport(viewportNum).windowCenter = GetViewport(viewportNum).windowWidth = null;
    GetViewport(viewportNum).invert = GetViewport(viewportNum).HorizontalFlip = GetViewport(viewportNum).VerticalFlip = false;
    GetViewport(viewportNum).transform = {};

    if (GetViewport(viewportNum).framesNumber != undefined) GetViewport(viewportNum).framesNumber = 0;
}

function resetAndLoadImg() {
    var viewport = GetViewport();

    viewport.windowCenter = viewport.windowWidth = null;
    viewport.translate.x = viewport.translate.y = GetViewport().rotate = 0;
    GetViewport().scale = null;
    GetViewport().VerticalFlip = GetViewport().HorizontalFlip = GetViewport().invert = false;
    if (getByid("removeAllRuler")) getByid("removeAllRuler").onclick();

    // if (dontLoad == false) GetViewport().reloadImg();
}

function refleshViewport() {
    if (openLink == true) {
        refleshAllCanvas()
        displayAllMark();
    } else {
        refleshCanvas(GetViewport());
        displayMark();
    }
}

function ScaleToTrueSize(viewportNum = viewportNumber) {
    function calcScreenDPI() {
        const el = document.createElement('div');
        el.style = 'width: 1in;'
        document.body.appendChild(el);
        const dpi = el.offsetWidth;
        document.body.removeChild(el);
        return dpi;
    }

    function getMmInPixels() {
        let div = document.createElement("div");
        div.style.width = "100mm";
        div.style.position = "absolute";
        div.style.visibility = "hidden";
        document.body.appendChild(div);

        let mmInPixels = div.offsetWidth / 100;
        document.body.removeChild(div);
        return mmInPixels;
    }

    let mmInPixels = getMmInPixels();
    var image = GetViewport(viewportNum).content.image;
    let PixelSpacing = ((image.rowPixelSpacing ? image.rowPixelSpacing : image.ImagerPixelSpacing));
    let scaleFactor = PixelSpacing * mmInPixels / window.devicePixelRatio;
    if (isNaN(scaleFactor)) scaleFactor = 1 / window.devicePixelRatio;

    GetViewport(viewportNum).scale = scaleFactor;
    setTransform(viewportNum);
    displayAllRuler();
    return scaleFactor;
}

class Matrix4x4 {
    constructor() {
        this.matrix = [[0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]]
    }

    static applyMatrixToCoordinate(matrix, coordinate) {
        const [x, y, z] = coordinate;
        const w = 1; // 齊次座標的第四個分量

        // 計算新座標
        const newX = matrix[0][0] * x + matrix[0][1] * y + matrix[0][2] * z + matrix[0][3] * w;
        const newY = matrix[1][0] * x + matrix[1][1] * y + matrix[1][2] * z + matrix[1][3] * w;
        const newZ = matrix[2][0] * x + matrix[2][1] * y + matrix[2][2] * z + matrix[2][3] * w;
        const newW = matrix[3][0] * x + matrix[3][1] * y + matrix[3][2] * z + matrix[3][3] * w;

        // 除以 w 確保齊次坐標轉為常規坐標
        return [newX / 1, newY / 1, newZ / 1];
    }

    static multiplyMatrices(matrixA, matrixB) {
        const result = Array.from({ length: 4 }, () => Array(4).fill(0));
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                for (let k = 0; k < 4; k++) {
                    result[i][j] += matrixA[i][k] * matrixB[k][j];
                }
            }
        }
        return result;
    }

    static multiplyMatrices_invert(matrixA, matrixB) {
        const result = Array.from({ length: 4 }, () => Array(4).fill(0));
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                for (let k = 0; k < 4; k++) {
                    result[i][j] -= matrixA[i][k] * matrixB[k][j];
                }
            }
        }
        return result;
    }
}

function displayDicomTagsList(viewportNum = viewportNumber) {
    dropTable(viewportNum);

    var TableDIV = createElem("DIV", "DicomTableDIV" + (viewportNum + 1), "DicomTableDIV");
    TableDIV.onmousedown = stopPropagation;
    TableDIV.ondblclick = stopPropagation;

    var Table = createElem("table", "DicomTagsTable" + (viewportNum + 1), "DicomTable");
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
    cells0.style.position = "relative";
    cells0.innerHTML = `Value<img class="closeBtn" onclick="dropTable(${viewportNum})" style='right:3px;position:absolute;height:100%' src='../image/icon/lite/X.png'>`;

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

        // 如果看起來像亂碼的比率過高，改用UTF-8
        if (looksLikeMojibake(cells.innerHTML)) cells.innerHTML = "" + (fixMojibake(cells.innerHTML));

        rowCount++;
    }
    GetViewport(viewportNum).div.appendChild(TableDIV);
    TableDIV.appendChild(Table);
}

function dropTable(num) {
    if (getByid("DicomTagsTable" + (num + 1))) {
        var elem = getByid("DicomTagsTable" + (num + 1));
        elem.parentElement.removeChild(elem);
    }
    if (getByid("DicomTableDIV" + (num + 1))) {
        var elem = getByid("DicomTableDIV" + (num + 1));
        elem.parentElement.removeChild(elem);
    }
}
