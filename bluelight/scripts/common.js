function cancelTools() {

    HideElemByID(["magnifierDiv", "textWC", "textWW", "WindowLevelDiv",
        "labelZoom", "labelPlay", "textZoom", "textPlay"]);

    getByid('playvideo').src = '../image/icon/lite/b_CinePlay.png';
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
    if (!openAnnotation || !GetViewport(viewportNum) || !GetViewport(viewportNum).content || !GetViewport(viewportNum).content.image) {
        getClass("downRule")[viewportNum].style.display = "none";
        getClass("leftRule")[viewportNum].style.display = "none";
        return;
    }
    try {
        var downRule = getClass("downRule")[viewportNum];

        const offsetWidth = GetViewport(viewportNum).div.offsetWidth;
        if (downRule.width != offsetWidth) downRule.width = offsetWidth;

        downRule.style.display = "";

        var tempctx = downRule.getContext("2d");
        tempctx.clearRect(0, 0, offsetWidth, 20);
        tempctx.strokeStyle = tempctx.fillStyle = "#FFFFFF";
        tempctx.lineWidth = "2";
        var x1 = 0, y1 = 0;

        tempctx.beginPath();
        if (GetViewport(viewportNum).transform.PixelSpacingX && GetViewport(viewportNum).transform.PixelSpacingY) {
            tempctx.moveTo(0 + (offsetWidth / 2) - (50 * GetViewport(viewportNum).transform.PixelSpacingX) * (GetViewport(viewportNum).scale), 10 + 10);
            tempctx.lineTo((90 * GetViewport(viewportNum).transform.PixelSpacingX) * (GetViewport(viewportNum).scale) + (offsetWidth / 2) - (40 * GetViewport(viewportNum).transform.PixelSpacingX) * (GetViewport(viewportNum).scale), 10 + 10);
            for (var i = 0; i <= 10; i++) {
                tempctx.moveTo(x1 + (offsetWidth / 2) - (50 * GetViewport(viewportNum).transform.PixelSpacingX) * (GetViewport(viewportNum).scale), y1 + 10);
                tempctx.lineTo(x1 + (offsetWidth / 2) - (50 * GetViewport(viewportNum).transform.PixelSpacingX) * (GetViewport(viewportNum).scale), y1 + 10 + 10);
                tempctx.stroke();
                x1 += (10 * GetViewport(viewportNum).transform.PixelSpacingX) * (GetViewport(viewportNum).scale);
            }
            tempctx.closePath();
            x1 -= (10 * GetViewport(viewportNum).transform.PixelSpacingX) * (GetViewport(viewportNum).scale);

            tempctx.font = "" + (12) + "px Arial";
            tempctx.fillText("100 mm", 2 + x1 + (offsetWidth / 2) - (50 * GetViewport(viewportNum).transform.PixelSpacingX) * (GetViewport(viewportNum).scale), y1 + 3 + 10 + 5)
        } else {
            tempctx.strokeStyle = "#4855FF";
            var PX = 1, PY = 1;
            tempctx.moveTo(0 + (offsetWidth / 2) - (50 * PX) * (GetViewport(viewportNum).scale), 10 + 10);
            tempctx.lineTo((90 * PX) * (GetViewport(viewportNum).scale) + (offsetWidth / 2) - (40 * PX) * (GetViewport(viewportNum).scale), 10 + 10);
            for (var i = 0; i <= 10; i++) {
                tempctx.moveTo(x1 + (offsetWidth / 2) - (50 * PX) * (GetViewport(viewportNum).scale), y1 + 10);
                tempctx.lineTo(x1 + (offsetWidth / 2) - (50 * PX) * (GetViewport(viewportNum).scale), y1 + 10 + 10);
                tempctx.stroke();
                x1 += (10 * PX) * (GetViewport(viewportNum).scale);
            }
            tempctx.closePath();
            x1 -= (10 * PX) * (GetViewport(viewportNum).scale);

            tempctx.font = "" + (12) + "px Arial";
            tempctx.fillText("100 pix", 2 + x1 + (offsetWidth / 2) - (50 * PX) * (GetViewport(viewportNum).scale), y1 + 3 + 10 + 5)
        }

    } catch (ex) { }
    displayRuler2(viewportNum);
}

function displayRuler2(viewportNum = viewportNumber) {
    if (!GetViewport() || !GetViewport().content || !GetViewport().content.image) return;
    try {
        var leftRule = getClass("leftRule")[viewportNum];
        var offsetHeight = GetViewport(viewportNum).div.offsetHeight;
        leftRule.height = offsetHeight;
        leftRule.style.display = "";

        var tempctx = leftRule.getContext("2d");

        tempctx.clearRect(0, 0, 20, offsetHeight);
        tempctx.strokeStyle = tempctx.fillStyle = "#FFFFFF";
        tempctx.lineWidth = "2";
        tempctx.beginPath();
        var x1 = 0, y1 = 0;

        if (GetViewport(viewportNum).transform.PixelSpacingX && GetViewport(viewportNum).transform.PixelSpacingY) {
            tempctx.font = "12px Arial";
            tempctx.fillText("100 mm", 0, -5 + (offsetHeight / 2) - (50 * GetViewport(viewportNum).transform.PixelSpacingY) * (GetViewport(viewportNum).scale))

            tempctx.moveTo(0, 0 + (offsetHeight / 2) - (50 * GetViewport(viewportNum).transform.PixelSpacingY) * (GetViewport(viewportNum).scale));
            tempctx.lineTo(0, (90 * GetViewport(viewportNum).transform.PixelSpacingY) * (GetViewport(viewportNum).scale) - (40 * GetViewport(viewportNum).transform.PixelSpacingY) * (GetViewport(viewportNum).scale) + (offsetHeight / 2));
            tempctx.stroke();
            for (var i = 0; i <= 10; i++) {
                tempctx.moveTo(x1, y1 + (offsetHeight / 2) - (50 * GetViewport(viewportNum).transform.PixelSpacingY) * (GetViewport(viewportNum).scale));
                tempctx.lineTo(x1 + 10, y1 + (offsetHeight / 2) - (50 * GetViewport(viewportNum).transform.PixelSpacingY) * (GetViewport(viewportNum).scale));
                tempctx.stroke();
                y1 += (10 * GetViewport(viewportNum).transform.PixelSpacingY) * (GetViewport(viewportNum).scale);
            }
            tempctx.closePath();
        } else {
            tempctx.strokeStyle = "#4855FF";
            var PX = 1, PY = 1;
            tempctx.font = "12px Arial";
            tempctx.fillText("100 pix", 0, -5 + (offsetHeight / 2) - (50 * PY) * (GetViewport(viewportNum).scale))

            tempctx.moveTo(0, 0 + (offsetHeight / 2) - (50 * PY) * (GetViewport(viewportNum).scale));
            tempctx.lineTo(0, (90 * PY) * (GetViewport(viewportNum).scale) - (40 * PY) * (GetViewport(viewportNum).scale) + (offsetHeight / 2));
            tempctx.stroke();
            for (var i = 0; i <= 10; i++) {
                tempctx.moveTo(x1, y1 + (offsetHeight / 2) - (50 * PY) * (GetViewport(viewportNum).scale));
                tempctx.lineTo(x1 + 10, y1 + (offsetHeight / 2) - (50 * PY) * (GetViewport(viewportNum).scale));
                tempctx.stroke();
                y1 += (10 * PY) * (GetViewport(viewportNum).scale);
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
    GetViewportMark(viewportnum).style.transform = `translate(calc(-50% + ${Fpx(element.translate.x)}) , calc(-50% + ${Fpx(element.translate.y)})) scale( ${scale} ) rotate( ${element.rotate}deg)`;
    element.canvas.style.transform = `translate(calc(-50% + ${Fpx(element.translate.x)}) , calc(-50% + ${Fpx(element.translate.y)})) scale( ${scale} ) rotate( ${element.rotate}deg)`;
    //element.canvas.style.transform=" translate(-50%,-50%)"
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
        for (var z = 0; z < Viewport_Total; z++) {
            refleshCanvas(GetViewport(z));
            displayMark(z);
        }
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

//用來計算，2D座標在3D空間中的位置
function get3dPositionOf2dPoint(viewport, point) {
    //用來計算，2D座標在3D空間中的位置(供下方調用)
    function calculateDicom3DPosition(pixelCoordinates, imagePosition, imageOrientation, pixelSpacing) {
        // --- 1. 參數驗證 ---
        if (!pixelCoordinates || pixelCoordinates.length !== 2 ||
            !imagePosition || imagePosition.length !== 3 ||
            !imageOrientation || imageOrientation.length !== 6 ||
            !pixelSpacing || pixelSpacing.length !== 2) {
            console.error("無效的輸入參數。請檢查陣列長度。");
            return null;
        }

        // --- 2. 為了可讀性，解構輸入參數 ---
        const [j, i] = pixelCoordinates; // j 是 column index, i 是 row index
        const [Sx, Sy, Sz] = imagePosition;
        const [Xx, Xy, Xz, Yx, Yy, Yz] = imageOrientation;
        // Xx, Xy, Xz 是行向量 (Row Vector)、 Yx, Yy, Yz 是列向量 (Column Vector)

        const [rowSpacing, columnSpacing] = pixelSpacing; // Δi, Δj

        // --- 3. 應用 DICOM 標準公式計算 ---
        // P(i,j) = S + X * Δj * j + Y * Δi * i
        const Px = Sx + (Xx * columnSpacing * j) + (Yx * rowSpacing * i);
        const Py = Sy + (Xy * columnSpacing * j) + (Yy * rowSpacing * i);
        const Pz = Sz + (Xz * columnSpacing * j) + (Yz * rowSpacing * i);

        // --- 4. 回傳結果 ---
        return { x: Px, y: Py, z: Pz };
    }
    var exampleImagePosition = viewport.content.image.imagePosition;
    var exampleImageOrientation = viewport.content.image.Orientation;
    var examplePixelSpacing = viewport.content.image.PixelSpacing;
    var position = calculateDicom3DPosition(point, exampleImagePosition, exampleImageOrientation, examplePixelSpacing);
    return position;
}

function getCrossReferenceLine(cornersA, cornersB, dimensionsA) {
    const vec3 = {
        // 向量相減: v1 - v2
        subtract: (v1, v2) => ({ x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z }),
        // 向量叉積: v1 x v2
        cross: (v1, v2) => ({ x: v1.y * v2.z - v1.z * v2.y, y: v1.z * v2.x - v1.x * v2.z, z: v1.x * v2.y - v1.y * v2.x, }),
        dot: (v1, v2) => v1.x * v2.x + v1.y * v2.y + v1.z * v2.z, // 向量點積: v1 · v2
        add: (v1, v2) => ({ x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z }), // 向量加法: v1 + v2
        scale: (v, s) => ({ x: v.x * s, y: v.y * s, z: v.z * s }), // 向量與純量相乘
        lengthSq: (v) => v.x * v.x + v.y * v.y + v.z * v.z, // 向量長度的平方
    };
    function intersectLineSegmentWithPlane(lineStart, lineEnd, plane) {
        const lineDirection = vec3.subtract(lineEnd, lineStart);
        const denominator = vec3.dot(plane.normal, lineDirection);

        // 如果分母接近於零，表示線與平面平行或共面
        if (Math.abs(denominator) < 1e-6) return null;

        const w = vec3.subtract(lineStart, plane.point);
        const t = -vec3.dot(plane.normal, w) / denominator;

        // 如果 t 在 [0, 1] 範圍內，交點才在線段上
        if (t >= 0 && t <= 1) return vec3.add(lineStart, vec3.scale(lineDirection, t));
        return null;
    }

    function project3DPointTo2D(point3D, cornersA, dimensionsA) {
        const [p00, p10, p01] = cornersA; // TopLeft, TopRight, BottomLeft

        const vecRow = vec3.subtract(p10, p00);
        const vecCol = vec3.subtract(p01, p00);
        const vecToPoint = vec3.subtract(point3D, p00);

        // 投影到行向量和列向量上，得到相對距離比例 (0 to 1)
        const distCol = vec3.dot(vecToPoint, vecRow) / vec3.lengthSq(vecRow);
        const distRow = vec3.dot(vecToPoint, vecCol) / vec3.lengthSq(vecCol);

        // 轉換為像素座標
        const pixelX = distCol * (dimensionsA.columns);
        const pixelY = distRow * (dimensionsA.rows);

        return { x: pixelX, y: pixelY };
    }

    // 步驟 1: 從 B 的角點定義出 B 的平面
    const planeB = {
        point: cornersB[0], // 平面上的一點
        normal: vec3.cross(
            vec3.subtract(cornersB[1], cornersB[0]), // B的行向量
            vec3.subtract(cornersB[2], cornersB[0])  // B的列向量
        )
    };

    // 如果法向量為零向量（例如，角點共線），則無法定義平面
    if (vec3.lengthSq(planeB.normal) < 1e-6) {
        console.error("無法從影像B的角點定義一個有效的平面。");
        return null;
    }

    // 步驟 2: 計算 B 平面與 A 的四條邊界的交點
    const edgesA = [
        { start: cornersA[0], end: cornersA[1] }, // Top
        { start: cornersA[1], end: cornersA[3] }, // Right
        { start: cornersA[3], end: cornersA[2] }, // Bottom
        { start: cornersA[2], end: cornersA[0] }, // Left
    ];

    const intersectionPoints3D = [];
    for (const edge of edgesA) {
        const intersection = intersectLineSegmentWithPlane(edge.start, edge.end, planeB);
        if (intersection) {
            intersectionPoints3D.push(intersection);
        }
    }

    // 一個平面與矩形邊界應該恰好有兩個交點
    if (intersectionPoints3D.length !== 2) {
        // 可能的情況：B平面與A平面平行、共面，或完全不相交
        console.warn(`找到 ${intersectionPoints3D.length} 個交點，無法繪製線段。兩平面可能平行或不相交。`);
        return null;
    }

    // 步驟 3: 將兩個3D交點轉換回影像A的2D像素座標
    const startPoint2D = project3DPointTo2D(intersectionPoints3D[0], cornersA, dimensionsA);
    const endPoint2D = project3DPointTo2D(intersectionPoints3D[1], cornersA, dimensionsA);

    return { start: startPoint2D, end: endPoint2D };
}

function avgDiff(a, b) {
    return a.reduce((sum, val, i) => sum + Math.abs(val - b[i]), 0) / a.length;
}