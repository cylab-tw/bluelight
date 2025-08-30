function cancelTools() {

    HideElemByID(["textWC", "textWW", "WindowLevelDiv",
        "labelZoom", "labelPlay", "textZoom", "textPlay"]);

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

    if (dontLoad == false) GetViewport().reloadImg();
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

    var TableDIV = document.createElement("DIV");
    TableDIV.id = "DicomTableDIV" + (viewportNum + 1);
    TableDIV.className = "DicomTableDIV";
    TableDIV.onmousedown = stopPropagation;
    TableDIV.ondblclick = stopPropagation;

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

        if (GetViewport().tags[i][1] == "PatientName" && GetViewport().content.image) cells.innerHTML = "" + GetViewport().content.image.PatientName;

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

function avgDiff(a, b) {
    return a.reduce((sum, val, i) => sum + Math.abs(val - b[i]), 0) / a.length;
}

function generateCrossLine(imageA, imageB) {
    // 1. 向量運算
    const vec3 = {
        subtract: (v1, v2) => ({ x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z }),
        cross: (v1, v2) => ({ x: v1.y * v2.z - v1.z * v2.y, y: v1.z * v2.x - v1.x * v2.z, z: v1.x * v2.y - v1.y * v2.x, }),
        dot: (v1, v2) => v1.x * v2.x + v1.y * v2.y + v1.z * v2.z,
        add: (v1, v2) => ({ x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z }),
        scale: (v, s) => ({ x: v.x * s, y: v.y * s, z: v.z * s }),
        lengthSq: (v) => v.x * v.x + v.y * v.y + v.z * v.z,
    };

    // 2. 根據 DICOM 標籤計算 3D 座標的函數
    const calculate3DPosition = (col, row, info) => {
        const [Sx, Sy, Sz] = info.imagePosition;
        const [Xx, Xy, Xz, Yx, Yy, Yz] = info.Orientation;
        const [rowSpacing, colSpacing] = info.PixelSpacing;

        return {
            x: Sx + (Xx * colSpacing * col) + (Yx * rowSpacing * row),
            y: Sy + (Xy * colSpacing * col) + (Yy * rowSpacing * row),
            z: Sz + (Xz * colSpacing * col) + (Yz * rowSpacing * row),
        };
    };

    // --- 主要計算流程 ---

    // 步驟 1: 精確計算兩張影像的四個角點像素中心 3D 座標
    const getLast = (dim) => dim > 0 ? dim - 1 : 0;
    const cornersA = [
        calculate3DPosition(0, 0, imageA),
        calculate3DPosition(getLast(imageA.columns), 0, imageA),
        calculate3DPosition(0, getLast(imageA.rows), imageA),
        calculate3DPosition(getLast(imageA.columns), getLast(imageA.rows), imageA),
    ];
    const cornersB = [
        calculate3DPosition(0, 0, imageB),
        calculate3DPosition(getLast(imageB.columns), 0, imageB),
        calculate3DPosition(0, getLast(imageB.rows), imageB),
        calculate3DPosition(getLast(imageB.columns), getLast(imageB.rows), imageB),
    ];

    // 步驟 2: 從影像 B 的角點定義其 3D 平面
    const planeB = {
        point: cornersB[0],
        normal: vec3.cross(
            vec3.subtract(cornersB[1], cornersB[0]), // B的行向量
            vec3.subtract(cornersB[2], cornersB[0])  // B的列向量
        )
    };

    // 若法向量長度過小，表示 B 的角點共線，無法定義平面
    if (vec3.lengthSq(planeB.normal) < 1e-6) return null;

    // 步驟 3: 計算 B 平面與 A 的四條邊界線段的交點
    const edgesA = [
        { start: cornersA[0], end: cornersA[1] }, // 上邊界
        { start: cornersA[1], end: cornersA[3] }, // 右邊界
        { start: cornersA[3], end: cornersA[2] }, // 下邊界
        { start: cornersA[2], end: cornersA[0] }, // 左邊界
    ];

    const intersectionPoints3D = [];
    for (const edge of edgesA) {
        // 內部函數：線段與平面相交測試
        const lineDir = vec3.subtract(edge.end, edge.start);
        const denominator = vec3.dot(planeB.normal, lineDir);

        if (Math.abs(denominator) > 1e-6) {
            const w = vec3.subtract(edge.start, planeB.point);
            const t = -vec3.dot(planeB.normal, w) / denominator;

            if (t >= 0 && t <= 1) { // 確保交點在線段上
                const intersectPoint = vec3.add(edge.start, vec3.scale(lineDir, t));
                // 避免因浮點數誤差加入幾乎相同的點
                if (!intersectionPoints3D.some(p => vec3.lengthSq(vec3.subtract(p, intersectPoint)) < 1e-6))
                    intersectionPoints3D.push(intersectPoint);
            }
        }
    }

    // 步驟 4: 驗證交點數量，必須剛好為 2
    if (intersectionPoints3D.length !== 2) return null; // 不相交、共面或僅接觸一點

    // 步驟 5: 將兩個 3D 交點投影回影像 A 的 2D 像素座標
    const project3DPointTo2D = (point3D) => {
        const [p00, p10, p01] = cornersA; // 左上, 右上, 左下
        const vecRow = vec3.subtract(p10, p00);
        const vecCol = vec3.subtract(p01, p00);
        const vecToPoint = vec3.subtract(point3D, p00);

        const lenSqRow = vec3.lengthSq(vecRow);
        const lenSqCol = vec3.lengthSq(vecCol);

        if (lenSqRow < 1e-6 || lenSqCol < 1e-6) return { x: 0, y: 0 };

        const distCol = vec3.dot(vecToPoint, vecRow) / lenSqRow;
        const distRow = vec3.dot(vecToPoint, vecCol) / lenSqCol;

        return { x: distCol * getLast(imageA.columns), y: distRow * getLast(imageA.rows), };
    };

    return { start: project3DPointTo2D(intersectionPoints3D[0]), end: project3DPointTo2D(intersectionPoints3D[1]) };
}
