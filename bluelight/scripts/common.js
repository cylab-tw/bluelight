function cancelTools() {
    openMouseTool = false;
    openWindow = false;
    openZoom = false;
    openMeasure = false;
    openWheel = false;
    openRotate = false;

    HideElemByID(["magnifierDiv", "textWC", "textWW", "WindowLevelDiv",
        "labelZoom", "labelPlay", "textZoom", "textPlay"]);

    getByid('playvideo').src = '../image/icon/lite/b_CinePlay.png';
    getByid("WindowDefault").selected = true;

    setWindowLevel();
    displayMark();
    for (var i = 0; i < Viewport_Total; i++) {
        GetViewport(i).cine = false;
    }
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

        //leftRule[viewportNum].style.left = 10 + bordersize + "px";
        var tempctx = leftRule.getContext("2d");

        tempctx.clearRect(0, 0, 20, offsetHeight);
        tempctx.strokeStyle = tempctx.fillStyle = "#FFFFFF";
        tempctx.lineWidth = "2";
        tempctx.beginPath();
        var x1 = 0, y1 = 0;

        if (GetViewport(viewportNum).transform.PixelSpacingX && GetViewport(viewportNum).transform.PixelSpacingY) {
            tempctx.font = "" + (12) + "px Arial";
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
            tempctx.font = "" + (12) + "px Arial";
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

function resetAndLoadImg(viewportNum = viewportNumber, dontLoad = false) {

    /*for (var z = 0; z < Viewport_Total; z++) {
        if (openLink == false) z = viewportNum;
        var viewport = GetViewport(z);

        viewport.windowCenter = viewport.windowWidth = null;
        viewport.translate.x = viewport.translate.y = GetViewport(z).rotate = 0;
        GetViewport(z).scale = null;
        GetViewport(z).VerticalFlip = GetViewport(z).HorizontalFlip = GetViewport(z).invert = false;
        if (getByid("removeAllRuler")) getByid("removeAllRuler").onclick();

        if (dontLoad == false) GetViewport(z).reloadImg();
        if (openLink == false) break;
    }*/
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
        /*for (var z = 0; z < Viewport_Total; z++) {
            GetViewport(z).VerticalFlip = GetViewport().VerticalFlip;
            GetViewport(z).HorizontalFlip = GetViewport().HorizontalFlip;
            GetViewport(z).windowCenter = GetViewport().windowCenter;
            GetViewport(z).windowWidth = GetViewport().windowWidth;
            GetViewport(z).invert = GetViewport().invert;
        }*/
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

function showToast(message) {
    // Create toast element if it doesn't exist  
    let toast = getByid("errorToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "errorToast";
      toast.style.position = "fixed";
      toast.style.bottom = "20px";
      toast.style.right = "20px";
      toast.style.backgroundColor = "#f44336";
      toast.style.color = "white";
      toast.style.padding = "15px";
      toast.style.borderRadius = "4px";
      toast.style.zIndex = "1000";
      toast.style.minWidth = "300px";
      toast.style.maxWidth = "500px";
      toast.style.boxShadow = "0 2px 5px rgba(0,0,0,0.3)";
      toast.style.fontWeight = "bold";
      toast.style.fontFamily = "Arial, sans-serif";
      document.body.appendChild(toast);
    }
  
    // Set message and show toast  
    toast.innerHTML = message;
    toast.style.display = "block";
  
    // Add close button  
    let closeBtn = document.createElement("span");
    closeBtn.innerHTML = "×";
    closeBtn.style.float = "right";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.marginLeft = "10px";
    closeBtn.onclick = function () {
      toast.style.display = "none";
    };
    toast.prepend(closeBtn);
  
    // Hide toast after 10 seconds  
    setTimeout(function () {
      toast.style.display = "none";
    }, 3000);
  }

// Function to get user-friendly error messages  
function getErrorMessage(statusCode) {
    switch (statusCode) {
      case 204:
        return "No Content";
      case 400:
        return "Bad Request";
      case 401:
        return "Unauthorized";
      case 403:
        return "Forbidden";
      case 404:
        return "Not Found";
      case 500:
        return "Internal Server Error";
      case 502:
        return "PACS Server Not Available";
      case 503:
        return "Service Unavailable";
      case 504:
        return "Gateway Timeout";
      default:
        return "Unknown Error";
    }
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
