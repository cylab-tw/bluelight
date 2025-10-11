
function load3DPlugin() {
    if (getByid("3DImgParent")) return;
    var span = document.createElement("SPAN");
    span.id = "3DImgParent";
    span.innerHTML = `
     <img class="img" loading="lazy" altzhtw="3D" alt="3D" id="3dDrawerImg" src="../image/icon/lite/3D.png"
          width="50" height="50">
    <div id="3DImgeDIv" class="drawer" style="position:absolute;left: 0;white-space:nowrap;z-index: 100;
    width: 500; display: none;background-color: black;">`;
    addIconSpan(span);
    getByid("3dDrawerImg").onclick = function () {
        if (this.enable == false) return;
        hideAllDrawer("3DImgeDIv");
        invertDisplayById('3DImgeDIv');
        if (getByid("3DImgeDIv").style.display == "none") getByid("3DImgParent").style.position = "";
        else {
            getByid("3DImgParent").style.position = "relative";
        }
    }
}
function loadMPR3() {
    load3DPlugin();
    var span = document.createElement("SPAN")
    span.innerHTML = ` <img class="img MPR3" alt="exitMPR3" id="exitMPR3" onmouseover="onElementOver(this);" onmouseleave="onElementLeave();" src="../image/icon/lite/exit.png" width="50" height="50" style="display:none;" >`
    addIconSpan(span);
    var span = document.createElement("SPAN");
    span.innerHTML = ` <img class="innerimg MPR3" alt="MPR3" id="ImgMPR3" onmouseover = "onElementOver(this);" onmouseleave = "onElementLeave();" src="../image/icon/lite/b_LocalizerLines.png" width="50" height="50">`;
    if (getByid("3DImgeDIv").childNodes.length > 0) getByid("3DImgeDIv").appendChild(document.createElement("BR"));
    getByid("3DImgeDIv").appendChild(span); //addIconSpan(span); 

    function createMPR3_DIV() {
        var MPRPage = document.createElement("DIV");
        MPRPage.className = "page";
        MPRPage.style.overflow = "hidden";
        MPRPage.id = "MPRPage";
        MPRPage.addEventListener("contextmenu", contextmenuF, false);
        getByid("pages").appendChild(MPRPage);
        MPRPage.style.display = "none";

        var DIV = document.createElement("DIV");
        DIV.id = "MPR3_DIV";
        DIV.setAttribute("border", 2);
        MPRPage.appendChild(DIV);
        DIV.appendChild(createElem("div", "MPR3box1", "MPR3Box"));
        DIV.appendChild(createElem("div", "MPR3box2", "MPR3Box"));
        DIV.appendChild(createElem("div", "MPR3box3", "MPR3Box"));
    }
    createMPR3_DIV();
}
loadMPR3();

// 輸入的座標是以毫米為單位
function createMPRCameraZ(width, height, centerX, centerY, centerZ, PixelSpacing) {
    var Camera = {};
    var Points = new Array(width * height), count = 0;
    for (var h = parseInt(-height / 2); h < parseInt(height / 2) + (height % 2); h++)
        for (var w = parseInt(-width / 2); w < parseInt(width / 2) + (width % 2); w++)
            Points[count++] = new Point3D(centerX + w * PixelSpacing, centerY + h * PixelSpacing, centerZ);
    Camera.Points = Points;
    Camera.Center = new Point3D(centerX, centerY, centerZ);
    return Points;
}
function createMPRCameraX(width, height, centerX, centerY, centerZ, PixelSpacing) {
    var Points = new Array(width * height), count = 0;
    for (var h = parseInt(height / 2) + (height % 2) - 1; h >= parseInt(-height / 2); h--)
        for (var w = parseInt(-width / 2); w < parseInt(width / 2) + (width % 2); w++)
            Points[count++] = new Point3D(centerX, centerY + w * PixelSpacing, centerZ + h);
    return Points;
}
function createMPRCameraY(width, height, centerX, centerY, centerZ, PixelSpacing) {
    var Points = new Array(width * height), count = 0;
    for (var h = parseInt(height / 2) + (height % 2) - 1; h >= parseInt(-height / 2); h--)
        for (var w = parseInt(-width / 2); w < parseInt(width / 2) + (width % 2); w++)
            Points[count++] = new Point3D(centerX + w * PixelSpacing, centerY, centerZ + h);
    return Points;
}

function displayImageWithMPRCamera(canvas, MprObject, camera, centerX, centerY, centerZ) {
    var ctx = canvas.getContext("2d"), pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var count = 0;
    for (var h = 0; h < canvas.height; h++) {
        for (var w = 0; w < canvas.width * 4; w += 4) {
            var targetPoint = { y: camera[count].x, x: camera[count].y, z: camera[count].z };
            count++;
            var target = findClosestPixelInSeries(targetPoint, MprObject);
            if (!target) continue;
            var obj = MprObject[target.sliceIndex];     //[h * canvas.width * 1 + w/4 + 0];
            pixels.data[h * canvas.width * 4 + w + 0] = obj.pixels[target.column * obj.columns * 1 + target.row + 0];
            pixels.data[h * canvas.width * 4 + w + 1] = obj.pixels[target.column * obj.columns * 1 + target.row + 0];
            pixels.data[h * canvas.width * 4 + w + 2] = obj.pixels[target.column * obj.columns * 1 + target.row + 0];
            pixels.data[h * canvas.width * 4 + w + 3] = 255; //obj.pixels[target.column * obj.columns * 1 + target.row + 0];
        }
    }
    ctx.putImageData(pixels, 0, 0);
}

function create8BitImageData(image) {
    if (image.color == true) throw "not support this image";
    let Uint8Data = new Uint8ClampedArray(image.width * image.height * 1);
    var pixelData = image.getPixelData();

    var windowCenter = image.windowCenter, windowWidth = image.windowWidth;
    var intercept = image.intercept, slope = image.slope;
    var high = windowCenter + (windowWidth / 2), low = windowCenter - (windowWidth / 2);
    if (CheckNull(intercept)) intercept = 0;
    if (CheckNull(slope)) slope = 1;
    const multiplication = 255 / ((high - low)) * slope;
    const addition = (- low + intercept) / (high - low) * 255;

    for (var i = 0; i < Uint8Data.length; i++) {
        Uint8Data[i] = (pixelData[i] * multiplication + addition);
    }
    return Uint8Data;
}

getByid("ImgMPR3").onclick = function () {
    var Sops = ImageManager.findSeries(GetViewport().series).Sop;
    if (!Sops.length) return;

    // 建立用於方便運算座標的物件
    var MprObject = new Array(Sops.length);
    var minX = Number.MAX_VALUE, maxX = Number.MIN_VALUE;
    var minY = Number.MAX_VALUE, maxY = Number.MIN_VALUE;
    var minZ = Number.MAX_VALUE, maxZ = Number.MIN_VALUE;
    for (var i in Sops) {
        if (Sops[i].Image.imageDataLoaded == false && Sops[i].Image.loadImageData) Sops[i].Image.loadImageData();
        MprObject[i] = {};
        MprObject[i].imagePositionPatient = Sops[i].Image.imagePosition;
        MprObject[i].imageOrientationPatient = Sops[i].Image.Orientation;
        MprObject[i].pixelSpacing = [Sops[i].Image.rowPixelSpacing, Sops[i].Image.columnPixelSpacing];
        MprObject[i].rows = Sops[i].Image.rows;       // height
        MprObject[i].columns = Sops[i].Image.columns; // width
        MprObject[i].pixels = create8BitImageData(Sops[i].Image);
        //順便計算XYZ軸的長度，imagePosition本身就已經是以毫米為單位了！
        if (Sops[i].Image.imagePosition[0] < minX) minX = Sops[i].Image.imagePosition[0];
        if (Sops[i].Image.imagePosition[0] > maxX) maxX = Sops[i].Image.imagePosition[0];
        if (Sops[i].Image.imagePosition[1] < minY) minY = Sops[i].Image.imagePosition[1];
        if (Sops[i].Image.imagePosition[1] > maxY) maxY = Sops[i].Image.imagePosition[1];
        if (Sops[i].Image.imagePosition[2] < minZ) minZ = Sops[i].Image.imagePosition[2];
        if (Sops[i].Image.imagePosition[2] > maxZ) maxZ = Sops[i].Image.imagePosition[2];
    }
    var PixelSpacing = Sops[0].Image.rowPixelSpacing;
    var Width = Sops[0].Image.columns, Height = Sops[0].Image.rows, Deep = Math.abs(maxZ - minZ);
    var centerX = minX + Width / 2 * PixelSpacing, centerY = minY + Height / 2 * PixelSpacing, centerZ = (maxZ + minZ) / 2;

    // 第一個畫面
    var canvas = createElem("Canvas", "MPR3Canvas1", "MPR3Canvas");
    canvas.width = Width; canvas.height = Deep;
    canvas.style.translate = `${-canvas.width / 2}px ${-canvas.height / 2}px`;
    //canvas.style.scale = `${1 / MprObject[0].pixelSpacing[0]}`;
    getByid("MPR3box1").appendChild(canvas);
    var camera = createMPRCameraX(canvas.width, canvas.height, centerX, centerY, centerZ, PixelSpacing);
    displayImageWithMPRCamera(canvas, MprObject, camera);

    // 第二個畫面
    var canvas = createElem("Canvas", "MPR3Canvas2", "MPR3Canvas");
    canvas.width = Width; canvas.height = Deep;
    canvas.style.translate = `${-canvas.width / 2}px ${-canvas.height / 2}px`;
    //canvas.style.scale = `${1 / MprObject[0].pixelSpacing[0]}`;
    getByid("MPR3box2").appendChild(canvas);
    var camera = createMPRCameraY(canvas.width, canvas.height, centerX, centerY, centerZ, PixelSpacing);
    displayImageWithMPRCamera(canvas, MprObject, camera);

    // 第三個畫面
    var canvas = createElem("Canvas", "MPR3Canvas3", "MPR3Canvas");
    canvas.width = Width; canvas.height = Height;
    canvas.style.translate = `${-canvas.width / 2}px ${-canvas.height / 2}px`;
    //canvas.style.scale = `${1 / MprObject[0].pixelSpacing[0]}`;
    getByid("MPR3box3").appendChild(canvas);
    var camera = createMPRCameraZ(canvas.width, canvas.height, centerX, centerY, centerZ, PixelSpacing);
    displayImageWithMPRCamera(canvas, MprObject, camera);

    // 顯示MPR
    Pages.displayPage("MPRPage");
}

// 一個包含最近像素資訊的物件，或在找不到時回傳 null。
function findClosestPixelInSeries(targetPoint, seriesInfo) {
    // --- 內部輔助工具 ---
    const vec3 = {
        subtract: (v1, v2) => ({ x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z }),
        dot: (v1, v2) => v1.x * v2.x + v1.y * v2.y + v1.z * v2.z,
        lengthSq: (v) => v.x * v.x + v.y * v.y + v.z * v.z,
        cross: (v1, v2) => ({ x: v1.y * v2.z - v1.z * v2.y, y: v1.z * v2.x - v1.x * v2.z, z: v1.x * v2.y - v1.y * v2.x, }),
    };

    let closestMatch = { sliceIndex: -1, column: -1, row: -1, distance: Infinity, minDistanceSq: Infinity };

    // --- 遍歷所有影像 (Slice) ---
    for (let i = 0; i < seriesInfo.length; i++) {
        const slice = seriesInfo[i];

        // 1. 取得該 slice 的幾何定義
        const slicePosition = { x: slice.imagePositionPatient[0], y: slice.imagePositionPatient[1], z: slice.imagePositionPatient[2] };
        const rowVec = { x: slice.imageOrientationPatient[0], y: slice.imageOrientationPatient[1], z: slice.imageOrientationPatient[2] };
        const colVec = { x: slice.imageOrientationPatient[3], y: slice.imageOrientationPatient[4], z: slice.imageOrientationPatient[5] };
        const [rowSpacing, colSpacing] = slice.pixelSpacing;

        // 2. 計算目標點到此 slice 平面的正交投影點
        const normalVec = vec3.cross(rowVec, colVec);
        const vecToPoint = vec3.subtract(targetPoint, slicePosition);
        const distToPlane = vec3.dot(vecToPoint, normalVec); // 假設 normalVec 是單位向量

        // projectedPoint = targetPoint - distToPlane * normalVec
        const projectedPoint = { x: targetPoint.x - distToPlane * normalVec.x, y: targetPoint.y - distToPlane * normalVec.y, z: targetPoint.z - distToPlane * normalVec.z, };

        // 3. 將 3D 投影點轉換回該 slice 的 2D 像素座標
        const vecInPlane = vec3.subtract(projectedPoint, slicePosition);
        const distAlongRowVec = vec3.dot(vecInPlane, rowVec), distAlongColVec = vec3.dot(vecInPlane, colVec);

        const fractionalCol = distAlongRowVec / colSpacing, fractionalRow = distAlongColVec / rowSpacing;

        // 取得最近的整數像素座標
        const nearestCol = Math.round(fractionalCol), nearestRow = Math.round(fractionalRow);

        // 4. 檢查此像素是否在影像範圍內
        if (nearestCol >= 0 && nearestCol < slice.columns && nearestRow >= 0 && nearestRow < slice.rows) {
            // 5. 計算此像素中心的 3D 座標
            const pixelCenter3D = {
                x: slicePosition.x + rowVec.x * nearestCol * colSpacing + colVec.x * nearestRow * rowSpacing,
                y: slicePosition.y + rowVec.y * nearestCol * colSpacing + colVec.y * nearestRow * rowSpacing,
                z: slicePosition.z + rowVec.z * nearestCol * colSpacing + colVec.z * nearestRow * rowSpacing,
            };

            // 6. 計算目標點與此像素中心的距離平方，並更新最小值
            // (使用距離平方可避免開根號，效能較好)
            const distanceSq = vec3.lengthSq(vec3.subtract(targetPoint, pixelCenter3D));

            if (distanceSq < closestMatch.minDistanceSq) {
                closestMatch.minDistanceSq = distanceSq;
                closestMatch.sliceIndex = i;
                closestMatch.column = nearestCol;
                closestMatch.row = nearestRow;
            }
        }
    }

    // 沒有找到任何在影像範圍內的像素
    if (closestMatch.sliceIndex === -1) return null;

    closestMatch.distance = Math.sqrt(closestMatch.minDistanceSq);
    delete closestMatch.minDistanceSq; // 清理臨時變數
    return closestMatch;
}
