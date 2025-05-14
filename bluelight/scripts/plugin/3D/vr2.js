
var openVR2 = false;
var VR2_LutArray = [];

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
            //onElementLeave();
        }
    }
}

function loadVR2() {
    load3DPlugin();
    var span = document.createElement("SPAN")
    span.innerHTML = ` 
        <img class="img VR2" alt="exitVR2" id="exitVR2" onmouseover="onElementOver(this);" onmouseleave="onElementLeave();" src="../image/icon/lite/exit.png" width="50" height="50" style="display:none;" >
        <img class="img VR2" alt="moveVR2" id="moveVR2" onmouseover="onElementOver(this);" onmouseleave="onElementLeave();" src="../image/icon/lite/b_Pan.png" width="50" height="50" style="display:none;" >
        <img class="img VR2" alt="windowVR2" id="windowVR2" onmouseover="onElementOver(this);" onmouseleave="onElementLeave();" src="../image/icon/lite/b_Window.png" width="50" height="50" style="display:none;" >
        <img class="img VR2" alt="saveVR2" id="saveVR2" onmouseover="onElementOver(this);" onmouseleave="onElementLeave();" src="../image/icon/lite/download.png" width="50" height="50" style="display:none;" >`;;
    addIconSpan(span);
    var span = document.createElement("SPAN");
    span.innerHTML = ` <img class="innerimg VR2" alt="VR2" id="ImgVR2" onmouseover = "onElementOver(this);" onmouseleave = "onElementLeave();" src="../image/icon/lite/vr2.png" width="50" height="50">`;
    if (getByid("3DImgeDIv").childNodes.length > 0) getByid("3DImgeDIv").appendChild(document.createElement("BR"));
    getByid("3DImgeDIv").appendChild(span); //addIconSpan(span); 

    function createVR2_DIV(viewportNum = viewportNumber) {
        var VRPage = document.createElement("DIV");
        VRPage.className = "page";
        VRPage.style.overflow = "hidden";
        VRPage.id = "VRPage";
        VRPage.addEventListener("contextmenu", contextmenuF, false);
        getByid("pages").appendChild(VRPage);
        VRPage.style.display = "none";

        var DIV = document.createElement("DIV");
        DIV.id = "VR2_DIV";
        DIV.setAttribute("border", 2);
        VRPage.appendChild(DIV);

        var label = document.createElement("LABEL");
        label.id = "VR2_TestLabel"
        label.innerText = "This is a test version.";

        DIV.appendChild(label);
    }
    createVR2_DIV();

    BorderList_Icon.push("moveVR2");
    BorderList_Icon.push("windowVR2");
    BorderList_Icon.push("saveVR2");

    function createLut() {
        var r0 = parseFloat((100 - 0) / 85);
        var g0 = parseFloat((50 - 0) / 85);
        var b0 = parseFloat((35 - 0) / 85);

        var r1 = parseFloat((255 - 190) / 85);
        var g1 = parseFloat((220 - 120) / 85);
        var b1 = parseFloat((180 - 65) / 85);
        var r2 = parseFloat((190 - 100) / 85);
        var g2 = parseFloat((120 - 50) / 85);
        var b2 = parseFloat((65 - 35) / 85);

        var rList = [];
        var gList = [];
        var bList = [];

        for (var i = 0; i <= 85; i++) {
            rList.push(parseInt(0 + r0 * i));
            gList.push(parseInt(0 + g0 * i));
            bList.push(parseInt(0 + b0 * i));
        }
        for (var i = 0; i <= 85; i++) {
            rList.push(parseInt(100 + r2 * i));
            gList.push(parseInt(50 + g2 * i));
            bList.push(parseInt(35 + b2 * i));
        }
        for (var i = 0; i <= 43; i++) {
            rList.push(parseInt(190 + r1 * i));
            gList.push(parseInt(120 + g1 * i));
            bList.push(parseInt(65 + b1 * i));
        }
        for (var i = 0; i <= 43; i++) {
            rList.push(parseInt(190 + r1 * i));
            gList.push(parseInt(170 + g1 * i));
            bList.push(parseInt(150 + b1 * i));
        }

        var lutArray = new Int32Array(256);
        for (var i = 0; i < lutArray.length; i++) {
            var tempcolor = 128 - Math.abs(128 - i);
            lutArray[i] = parseInt(parseInt(93) +
                parseInt(256 * 238) +
                parseInt(256 * 256 * 238) +
                parseInt(256 * 256 * 256 * parseInt(tempcolor <= 25 ? 0 : tempcolor)));
        }
        var Airways_LutArray = {
            name: "Airways", array: lutArray, defaultWindow: {
                windowWidth: 409, windowCenter: -538
            }
        }

        var lutArray = new Int32Array(256);
        for (var i = 0; i < lutArray.length; i++) {
            lutArray[i] = parseInt(parseInt(rList[i]) +
                parseInt(256 * gList[i]) +
                parseInt(256 * 256 * bList[i]) +
                parseInt(256 * 256 * 256 * (i <= 25 ? 0 : 255)));
        }

        var Color_LutArray = {
            name: "Color", array: lutArray, defaultWindow: {
                windowWidth: "origin", windowCenter: "origin"
            }
        }
        var Angio_LutArray = {
            name: "Angio", array: lutArray, defaultWindow: {
                windowWidth: 332, windowCenter: 287
            }
        }

        VR2_LutArray.push(Color_LutArray);
        VR2_LutArray.push(Angio_LutArray);
        VR2_LutArray.push(Airways_LutArray);
        /*var lutArray = new Int32Array(256);
        var AirlutArray = new Int32Array(256);
        for (var i = 0; i < lutArray.length; i++) {
            var tempcolor = 128 - Math.abs(128 - i);
            AirlutArray[i] = parseInt(parseInt(93) +
                parseInt(256 * 238) +
                parseInt(256 * 256 * 238) +
                parseInt(256 * 256 * 256 * parseInt(tempcolor <= 25 ? 0 : tempcolor)));
        }
        for (var i = 0; i < lutArray.length; i++) {
            if (i > 160) lutArray[i] = Angio_LutArray.array[i]
            else if (i > 100);
            else lutArray[i] = AirlutArray[i]
        }

        var Combine_LutArray = {
            name: "Combine", array: lutArray, defaultWindow: {
                windowWidth: 1650, windowCenter: 80
            }
        }

        VR2_LutArray.push(Combine_LutArray);*/
        var lutArray = new Int32Array(256);
        var AirlutArray = new Int32Array(256);
        for (var i = 0; i < lutArray.length; i++) {
            var tempcolor = 128 - Math.abs(128 - i);
            AirlutArray[i] = parseInt(parseInt(93) +
                parseInt(256 * 238) +
                parseInt(256 * 256 * 238) +
                parseInt(256 * 256 * 256 * parseInt(tempcolor <= 25 ? 0 : tempcolor)));
        }
        for (var i = 0; i < lutArray.length; i++) {
            if (i > 200) lutArray[i] = Angio_LutArray.array[i]
            else if (i > 128);
            else lutArray[i] = AirlutArray[i]
        }

        var Combine_LutArray = {
            name: "Combine", array: lutArray, defaultWindow: {
                windowWidth: 1200, windowCenter: -150
            }
        }

        VR2_LutArray.push(Combine_LutArray);

        var MIP_LutArray = {
            name: "MIP", filter: "lighten", defaultWindow: {
                windowWidth: "origin", windowCenter: "origin",
            }
        }
        VR2_LutArray.push(MIP_LutArray);

        var MinIP_LutArray = {
            name: "MinIP", filter: "darken", defaultWindow: {
                windowWidth: "origin", windowCenter: "origin",
            }
        }
        VR2_LutArray.push(MinIP_LutArray);
    }
    createLut();
    function loadLut(path, name) {
        var request = new XMLHttpRequest();
        request.open('GET', path);
        request.responseType = 'text';
        request.onload = function () {
            if (request.readyState == 4) {
                if (request.status == 200) {
                    var lutstring = request.response;
                    lutstring = lutstring.replaceAll("\r\n", "\n");
                    var lutArray = lutstring.split("\n");
                    for (var i = 0; i < lutArray.length; i++) {
                        lutArray[i] = lutArray[i].split("\t");
                        for (var j = 0; j < lutArray[i].length; j++) {
                            lutArray[i][j] = parseInt(lutArray[i][j]);
                        }
                    }

                    if (lutArray.length == 256) {
                        for (var i = 0; i < lutArray.length; i++) {
                            if (lutArray[i][0] + lutArray[i][1] + lutArray[i][2] == 0) lutArray[i] = 0;
                            else {
                                lutArray[i] = parseInt(parseInt(lutArray[i][0]) +
                                    parseInt(256 * lutArray[i][1]) +
                                    parseInt(256 * 256 * lutArray[i][2]) +
                                    parseInt(256 * 256 * 256 * 255));
                            }
                        }
                        VR2_LutArray.push({ name: name, array: lutArray });
                    }
                }
            }
        }
        request.send();
    }
    //loadLut("../data/lut/VR_Color.txt", "VR Color");
    //loadLut("../data/lut/VR_Bones.txt", "VR Bones");
}
loadVR2();

getByid("ImgVR2").onclick = function () {
    if (this.enable == false) return;
    getByid("3DImgeDIv").style.display = "none";

    openVR2 = !openVR2;
    img2darkByClass("VR2", !openVR2);

    getByid("exitVR2").style.display = openVR2 == true ? "" : "none";
    getByid("windowVR2").style.display = openVR2 == true ? "" : "none";
    getByid("saveVR2").style.display = openVR2 == true ? "" : "none";
    getByid("moveVR2").style.display = openVR2 == true ? "" : "none";
    set_BL_model('VR2');
    initVR2();

    this.style.display = openVR2 != true ? "" : "none";
    getByid("exitVR2").onclick = function () {
        openLeftImgClick = true;
        openVR2 = false;
        img2darkByClass("VR2", !openVR2);
        getByid("ImgVR2").style.display = openWriteGSPS != true ? "" : "none";
        getByid("exitVR2").style.display = openWriteGSPS == true ? "" : "none";
        getByid("windowVR2").style.display = openWriteRTSS == true ? "" : "none";
        getByid("saveVR2").style.display = openWriteRTSS == true ? "" : "none";
        getByid("moveVR2").style.display = openWriteRTSS == true ? "" : "none";
        for (cube of VRCube.VRCubeList) {
            cube.clear();
        }
        VRCube.cube = null;

        Pages.displayPage("DicomPage");
        getByid("MouseOperation").click();
        displayMark();
        getByid('MouseOperation').click();
    }

    getByid("moveVR2").onclick = function () {
        VRCube.operate_mode = "move";
        drawBorder(getByid("moveVR2"));
    }

    getByid("windowVR2").onclick = function () {
        VRCube.operate_mode = "window";
        drawBorder(getByid("windowVR2"));
    }
}

class VRCube {
    static VRCubeList = [];
    static operate_mode = "move";

    constructor(sop, slice = 15, step = 1) {
        this.sop = sop;
        this.sopList = sortInstance(sop);
        this.SOP = this.sopList[0];
        this.slice = slice;
        this.step = step;
        this.lut = "default";
        this.step_tmp = -1;
        this.startRenderTime = -1;
        this.perspective = "";

        this.scale = 1;
        this.pixelSpacing = this.SOP.Image.rowPixelSpacing;

        this.width = this.SOP.Image.width;
        this.height = this.SOP.Image.height;
        this.windowCenter = this.SOP.Image.windowCenter;
        this.windowWidth = this.SOP.Image.windowWidth;
        this.OriginWindowCenter = this.SOP.Image.windowCenter;
        this.OriginWindowWidth = this.SOP.Image.windowWidth;
        this.ElemXs = []; this.ElemYs = []; this.ElemZs = [];

        if (this.width == this.height) this.stepFactor = getFactor(this.width);
        else this.stepFactor = [];

        this.container = null;
        this.VR2_Point = new Vector3(0, 0, 0);
        this.VR2_RotateDeg = new Vector3(0, 0, 0);
        this.offset = new Vector3(0, 0, 0);
        this.MouseDownCheck = false;
        this.MiddleDownCheck = false;
        this.RightMouseDownCheck = false;
        this.shadow = true;
        this.smooth = false;
        this.reduceSlices = false;
        this.filter = null;
        if (this.sopList.length >= 50) this.reduceSlices = true;
        this.RotationMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]; // 初始旋轉矩陣
        VRCube.VRCubeList.push(this);
        VRCube.cube = this;
        getByid("saveVR2").onclick = this.saveVR2;
    }

    saveVR2() {

        var outer = `solid name
    facet normal 0 0 0
    __intter__
    endfacet
endsolid name`
        var intter = `
    outer loop
        vertex v1x v1y v1z
        vertex v2x v2y v2z
        vertex v3x v3y v3z
    endloop
    `
        var intters = "";

        function pushIntters(v1x, v1y, v1z, v2x, v2y, v2z, v3x, v3y, v3z) {
            var intter_ = intter;
            intter_ = intter_.replace("v1x", "" + v1x);
            intter_ = intter_.replace("v1y", "" + v1y);
            intter_ = intter_.replace("v1z", "" + v1z);
            intter_ = intter_.replace("v2x", "" + v2x);
            intter_ = intter_.replace("v2y", "" + v2y);
            intter_ = intter_.replace("v2z", "" + v2z);
            intter_ = intter_.replace("v3x", "" + v3x);
            intter_ = intter_.replace("v3y", "" + v3y);
            intter_ = intter_.replace("v3z", "" + v3z);
            intters += intter_;
        }
        var segList = [];
        for (var obj of VRCube.cube.ElemZs) {
            segList.push({
                pixelData: obj.imgData,
                PositionZ: parseInt(obj.originPositionZ)
            });
        }

        segList = soryByKey(segList, "PositionZ");
        var height = GetViewport().height, width = GetViewport().width;

        if (segList.length <= 1) return;

        function iterPointList(pointlist1, pointlist2) {
            //開始遍歷pointlist1，並找出pointlist2距離最近的兩個，若未滿兩個則跳過
            for (var p = 0; p < pointlist1.length - 1; p++) {
                var point = pointlist1[p];
                var dists = new Array(pointlist2.length);

                //得到一張距離表
                for (var p2 = 0; p2 < pointlist2.length; p2++) {
                    dists[p2] = {
                        index: p2,
                        dist: (point[0] - pointlist2[p2][0]) ** 2 + (point[1] - pointlist2[p2][1]) ** 2
                    }
                }

                //將距離由小到大排序
                dists = soryByKey(dists, "dist");
                if (dists[0] * 2 > parseInt(getByid("SegBrushSizeText").value) ** 2) continue;
                if (dists[1] * 2 > parseInt(getByid("SegBrushSizeText").value) ** 2) continue;
                if ((pointlist2[dists[0]['index']][0] - pointlist2[dists[1]['index']][0]) ** 2 + (pointlist2[dists[0]['index']][1] - pointlist2[dists[1]['index']][1]) ** 2 > parseInt(getByid("SegBrushSizeText").value) ** 2) continue;
                if ((pointlist1[p][0] - pointlist1[p + 1][0]) ** 2 + (pointlist1[p][1] - pointlist1[p + 1][1]) ** 2 > parseInt(getByid("SegBrushSizeText").value) ** 2) continue;

                pushIntters(
                    pointlist2[dists[0]['index']][0], pointlist2[dists[0]['index']][1], seg2.PositionZ,
                    pointlist2[dists[1]['index']][0], pointlist2[dists[1]['index']][1], seg2.PositionZ,
                    pointlist1[p + 0][0], pointlist1[p + 0][1], seg1.PositionZ
                );
                pushIntters(
                    pointlist2[dists[0]['index']][0], pointlist2[dists[0]['index']][1], seg2.PositionZ,
                    pointlist2[dists[1]['index']][0], pointlist2[dists[1]['index']][1], seg2.PositionZ,
                    pointlist1[p + 1][0], pointlist1[p + 1][1], seg1.PositionZ
                );
                pushIntters(
                    pointlist1[p][0], pointlist1[p][1], seg1.PositionZ,
                    pointlist1[p + 1][0], pointlist1[p + 1][1], seg1.PositionZ,
                    pointlist2[dists[0]['index']][0], pointlist2[dists[0]['index']][1], seg2.PositionZ
                );
                pushIntters(
                    pointlist2[dists[0]['index']][0], pointlist2[dists[0]['index']][1], seg2.PositionZ,
                    pointlist2[dists[1]['index']][0], pointlist2[dists[1]['index']][1], seg2.PositionZ,
                    pointlist1[p + 1][0], pointlist1[p + 1][1], seg1.PositionZ
                );
            }
        }

        //針對第一面和最後一面
        for (var p0 = 0; p0 < segList.length; p0++) {

            //如果選擇空心，非0層就直接跳最後一層
            if (getByid("VR2_STLCheck").checked) {
                if (p0 != 0) p0 = segList.length - 1;
            }

            var seg0 = segList[p0];
            var pixel = seg0.pixelData;
            //左到右
            for (var h = 1; h < height - 1; h += 1) {
                for (var w = 1; w < width; w++) {
                    if (pixel[h * width + w] > 0xFF000000 && pixel[h * width + w - 1] <= 0xFF000000) {
                        for (var w2 = w; w2 < width; w2++) {
                            if (pixel[h * width + w2] <= 0xFF000000 && pixel[h * width + w2 - 1] > 0xFF000000) {
                                pushIntters(
                                    h, w, seg0.PositionZ,
                                    h + 1, w, seg0.PositionZ,
                                    h, w2, seg0.PositionZ
                                );
                                pushIntters(
                                    h, w2, seg0.PositionZ,
                                    h + 1, w2, seg0.PositionZ,
                                    h, w, seg0.PositionZ
                                );
                                pushIntters(
                                    h, w, seg0.PositionZ,
                                    h - 1, w, seg0.PositionZ,
                                    h, w2, seg0.PositionZ
                                );
                                pushIntters(
                                    h, w2, seg0.PositionZ,
                                    h - 1, w2, seg0.PositionZ,
                                    h, w, seg0.PositionZ
                                );
                                break;
                            }
                        }
                        continue;
                    }
                }
            }
            //上到下
            for (var w = 1; w < width; w += 1) {
                for (var h = 1; h < height; h++) {
                    if (pixel[h * width + w] > 0xFF000000 && pixel[(h - 1) * width + w] <= 0xFF000000) {
                        for (var h2 = h; h2 < height; h2++) {
                            if (pixel[h2 * width + w] <= 0xFF000000 && pixel[(h2 - 1) * width + w] > 0xFF000000) {
                                pushIntters(
                                    h, w, seg0.PositionZ,
                                    h, w + 1, seg0.PositionZ,
                                    h2, w, seg0.PositionZ
                                );
                                pushIntters(
                                    h2, w, seg0.PositionZ,
                                    h2, w + 1, seg0.PositionZ,
                                    h, w, seg0.PositionZ
                                );
                                pushIntters(
                                    h, w, seg0.PositionZ,
                                    h, w - 1, seg0.PositionZ,
                                    h2, w, seg0.PositionZ
                                );
                                pushIntters(
                                    h2, w, seg0.PositionZ,
                                    h2, w - 1, seg0.PositionZ,
                                    h, w, seg0.PositionZ
                                );
                                break;
                            }
                        }
                        continue;
                    }
                }
            }
        }


        //左到右
        for (var s = 0; s < segList.length - 1; s++) {
            var seg1 = segList[s], pointlist1 = [];
            var pixel = seg1.pixelData;
            for (var h = 0; h < height; h += 5) {
                for (var w = 1; w < width; w++) {
                    if (pixel[h * width + w] > 0xFF000000 && pixel[h * width + w - 1] <= 0xFF000000) {
                        pointlist1.push([h, w]);
                        break;
                    }
                }
            }

            var seg2 = segList[s + 1], pointlist2 = [];
            var pixel = seg2.pixelData;
            for (var h = 0; h < height; h += 5) {
                for (var w = 1; w < width; w++) {
                    if (pixel[h * width + w] > 0xFF000000 && pixel[h * width + w - 1] <= 0xFF000000) {
                        pointlist2.push([h, w]);
                        break;
                    }
                }
            }

            iterPointList(pointlist1, pointlist2);
        }

        //右到左
        for (var s = 0; s < segList.length - 1; s++) {
            var seg1 = segList[s], pointlist1 = [];
            var pixel = seg1.pixelData;
            for (var h = 0; h < height; h += 5) {
                for (var w = width - 2; w > 0; w--) {
                    if (pixel[h * width + w] > 0xFF000000 && pixel[h * width + w + 1] <= 0xFF000000) {
                        pointlist1.push([h, w]);
                        break;
                    }
                }
            }

            var seg2 = segList[s + 1], pointlist2 = [];
            var pixel = seg2.pixelData;
            for (var h = 0; h < height; h += 5) {
                for (var w = width - 2; w > 0; w--) {
                    if (pixel[h * width + w] > 0xFF000000 && pixel[h * width + w + 1] <= 0xFF000000) {
                        pointlist2.push([h, w]);
                        break;
                    }
                }
            }

            iterPointList(pointlist1, pointlist2);
        }


        //上到下
        for (var s = 0; s < segList.length - 1; s++) {
            var seg1 = segList[s], pointlist1 = [];
            var pixel = seg1.pixelData;
            for (var w = 0; w < width; w += 5) {
                for (var h = 1; h < height; h++) {
                    if (pixel[h * width + w] > 0xFF000000 && pixel[(h - 1) * width + w] <= 0xFF000000) {
                        pointlist1.push([h, w]);
                        break;
                    }
                }
            }

            var seg2 = segList[s + 1], pointlist2 = [];
            var pixel = seg2.pixelData;
            for (var w = 0; w < width; w += 5) {
                for (var h = 1; h < height; h++) {
                    if (pixel[h * width + w] > 0xFF000000 && pixel[(h - 1) * width + w] <= 0xFF000000) {
                        pointlist2.push([h, w]);
                        break;
                    }
                }
            }

            iterPointList(pointlist1, pointlist2);
        }

        //下到上
        for (var s = 0; s < segList.length - 1; s++) {
            var seg1 = segList[s], pointlist1 = [];
            var pixel = seg1.pixelData;
            for (var w = 0; w < width; w += 5) {
                for (var h = height - 2; h > 0; h--) {
                    if (pixel[h * width + w] > 0xFF000000 && pixel[(h + 1) * width + w] <= 0xFF000000) {
                        pointlist1.push([h, w]);
                        break;
                    }
                }
            }

            var seg2 = segList[s + 1], pointlist2 = [];
            var pixel = seg2.pixelData;
            for (var w = 0; w < width; w += 5) {
                for (var h = height - 2; h > 0; h--) {
                    if (pixel[h * width + w] > 0xFF000000 && pixel[(h + 1) * width + w] <= 0xFF000000) {
                        pointlist2.push([h, w]);
                        break;
                    }
                }
            }

            iterPointList(pointlist1, pointlist2);
        }

        var export_ = outer.replace("__intter__", intters);
        saveStringToFile("seg.stl", export_);
        return;
    }

    resetZ() {
        for (var obj of this.ElemZs)
            this.container.removeChild(obj);
        this.ElemZs = [];
        this.buildZ();
        this.ReArrangeZ();
        this.RenderShadow();
    }

    resetX() {
        for (var obj of this.ElemXs)
            this.container.removeChild(obj);
        this.ElemXs = [];
        this.buildX();
    }

    resetY() {
        for (var obj of this.ElemYs)
            this.container.removeChild(obj);
        this.ElemYs = [];
        this.buildY();
    }

    resetZXY() {
        this.resetZ(); this.resetX(); this.resetY();
    }

    clear() {
        for (var obj of this.ElemXs)
            this.container.removeChild(obj);
        for (var obj of this.ElemYs)
            this.container.removeChild(obj);
        for (var obj of this.ElemZs)
            this.container.removeChild(obj);
        this.ElemXs = [];
        this.ElemYs = [];
        this.ElemZs = [];
        if (this.container) getByid("VR2_DIV").removeChild(this.container);
        if (this.userDIV_LB) getByid("VR2_DIV").removeChild(this.userDIV_LB);
        if (this.userDIV) getByid("VR2_DIV").removeChild(this.userDIV);
        this.userDIV = this.userDIV_LB = this.container = null;
    }

    updatePerspective() {
        getByid("VR2_DIV").style.perspective = this.perspective;
    }

    calculating_time() {
        this.cube.FPSLable.innerText = "FPS:" + parseInt(1000 / (performance.now() - this.cube.startRenderTime));
        this.cube.startRenderTime = -1;
    }

    reflesh() {
        if (this.startRenderTime != -1) return;
        this.startRenderTime = performance.now();
        var offsety = (this.height / 1 / 2) - (this.height / this.step / 2);
        if (this.container) {
            if (!this.filter) {
                this.container.style.transformStyle = "";
                if (this.PerspectiveCheck.checked) this.container.style['transform-origin'] = `center ${(this.height / 2 - offsety)}px ${-this.perspective}`;
                else this.container.style['transform-origin'] = `center ${(this.height / 2 - offsety)}px`;

                var Matrix = multiplyMatrices(getScaleMatrix(this.scale * this.step), [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
                var Matrix = multiplyMatrices(this.RotationMatrix, Matrix);
                var Matrix = multiplyMatrices(getTranslateMatrix(this.offset[0], this.offset[1] + (offsety), 0), Matrix);
                this.container.style.transform = applyRotationMatrix(Matrix);
                //this.container.style.transform =
                //   `translate3d(${this.offset[0]}px,${(this.offset[1] + (offsety))}px,0) scale(${this.scale * this.step}) rotateX(${this.VR2_RotateDeg[0]}deg) rotateY(${this.VR2_RotateDeg[1]}deg) rotateZ(${this.VR2_RotateDeg[2]}deg) `
            } else {
                this.container.style.transform = "";
                this.container.style.transformStyle = "flat";
                for (var obj of this.ElemZs) {
                    if (this.PerspectiveCheck.checked) objstyle['transform-origin'] = `center ${(this.height / 2 - offsety)}px ${-this.perspective}`;
                    else obj.style['transform-origin'] = `center ${(this.height / 2 - offsety)}px`;

                    var Matrix = multiplyMatrices(getTranslateMatrix(0, 0, (obj.position.z / this.step)), [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

                    var Matrix = multiplyMatrices(getScaleMatrix(this.scale * this.step), Matrix);
                    var Matrix = multiplyMatrices(this.RotationMatrix, Matrix);
                    var Matrix = multiplyMatrices(getTranslateMatrix(this.offset[0], this.offset[1] + (offsety), 0), Matrix);

                    obj.style.transform = applyRotationMatrix(Matrix);
                    obj.style.mixBlendMode = this.filter;
                }
                for (var obj of this.ElemXs) {
                    if (this.PerspectiveCheck.checked) objstyle['transform-origin'] = `center ${(this.height / 2 - offsety)}px ${-this.perspective}`;
                    else obj.style['transform-origin'] = `center ${(this.height / 2 - offsety)}px`;

                    var Matrix = multiplyMatrices(getRotationMatrix(0, Math.PI / 2), [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
                    var Matrix = multiplyMatrices(getTranslateMatrix(((((obj.position.x - this.width / 2) / this.step))), 0, 0), Matrix);

                    var Matrix = multiplyMatrices(getScaleMatrix(this.scale * this.step), Matrix);
                    var Matrix = multiplyMatrices(this.RotationMatrix, Matrix);
                    var Matrix = multiplyMatrices(getTranslateMatrix(this.offset[0], this.offset[1] + (offsety), 0), Matrix);

                    obj.style.transform = applyRotationMatrix(Matrix);
                    obj.style.mixBlendMode = this.filter;
                }
                for (var obj of this.ElemYs) {
                    if (this.PerspectiveCheck.checked) objstyle['transform-origin'] = `center ${(this.height / 2 - offsety)}px ${-this.perspective}`;
                    else obj.style['transform-origin'] = `center ${(this.height / 2 - offsety)}px`;

                    var Matrix = multiplyMatrices(getRotationMatrix(Math.PI / 2, 0), [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
                    var Matrix = multiplyMatrices(getTranslateMatrix(0, -((((obj.position.y + this.width / 2) / this.step))), ((this.width / this.step - this.deep) / 2)), Matrix);
                    //var Matrix = multiplyMatrices(getTranslateMatrix(0, -this.width / 2, (this.width - this.deep) / 2), Matrix);

                    var Matrix = multiplyMatrices(getScaleMatrix(this.scale * this.step), Matrix);
                    var Matrix = multiplyMatrices(this.RotationMatrix, Matrix);
                    var Matrix = multiplyMatrices(getTranslateMatrix(this.offset[0], this.offset[1] + (offsety), 0), Matrix);

                    obj.style.transform = applyRotationMatrix(Matrix);
                    obj.style.mixBlendMode = this.filter;
                }
            }
        }

        requestAnimationFrame(this.calculating_time);
    }

    buildContainer() {
        var DIV = getByid("VR2_DIV");
        var ContainerDIV = document.createElement("DIV");
        ContainerDIV.id = "VR2_Container";
        DIV.appendChild(ContainerDIV);
        this.container = ContainerDIV;

        function VR2Mousedown(e) {
            if (e.target.tagName != "CANVAS" && e.target.tagName != "DIV") return;
            if (e.which == 1) this.cube.MouseDownCheck = true;
            else if (e.which == 2) this.cube.MiddleDownCheck = true;
            else if (e.which == 3) this.cube.RightMouseDownCheck = true;
            this.cube.VR2_Point = [e.pageX, e.pageY];
            if (VRCube.operate_mode == "window" && !this.cube.filter) {
                var step = -1;
                if (this.cube.stepFactor) {
                    for (var i = 0; i < this.cube.stepFactor.length; i++) {
                        if (this.cube.stepFactor[i] >= 2 && this.cube.stepFactor[i] <= 15)
                            step = this.cube.stepFactor[i];
                    }
                }
                if (step != -1 && step > this.cube.step) {
                    this.cube.step_tmp = this.cube.step;
                    this.cube.step = step;
                    this.cube.resetZXY();
                    this.cube.reflesh();
                }
            } else if (VRCube.operate_mode == "move") {
                if (this.cube.reduceSlices == true) {
                    for (var ll = 0; ll < this.cube.ElemZs.length; ll++)
                        if (ll % 2 != 0 && ll != 0 && ll != this.cube.ElemZs.length - 1)
                            this.cube.ElemZs[ll].style.display = this.cube.reduceSlices == true ? "none" : "";
                    for (var ll = 0; ll < this.cube.ElemXs.length; ll++)
                        if (ll % 2 != 0 && ll != 0 && ll != this.cube.ElemXs.length - 1)
                            this.cube.ElemXs[ll].style.display = this.cube.reduceSlices == true ? "none" : "";
                    for (var ll = 0; ll < this.cube.ElemYs.length; ll++)
                        if (ll % 2 != 0 && ll != 0 && ll != this.cube.ElemYs.length - 1)
                            this.cube.ElemYs[ll].style.display = this.cube.reduceSlices == true ? "none" : "";
                }
            }
        }

        function VR2Mousemove(e) {
            if (this.isRequestPending) return;
            this.isRequestPending = true;
            requestAnimationFrame(() => {
                if (VRCube.operate_mode == "window" && !this.cube.filter) {
                    if (this.cube.MouseDownCheck && this.cube.step_tmp != -1 && !isNaN(e.pageX) && !isNaN(e.pageY)) {
                        if (Math.abs(this.cube.VR2_Point[0] - e.pageX) > Math.abs(this.cube.VR2_Point[1] - e.pageY)) {
                            this.cube.windowCenter += (this.cube.VR2_Point[0] - e.pageX);
                        } else if (Math.abs(this.cube.VR2_Point[0] - e.pageX) < Math.abs(this.cube.VR2_Point[1] - e.pageY)) {
                            this.cube.windowWidth += (this.cube.VR2_Point[1] - e.pageY);
                        }
                        this.cube.resetZXY();
                        this.cube.VR2_Point = [e.pageX, e.pageY];
                        //this.cube.reflesh();
                    }
                }
                if (VRCube.operate_mode == "move") {
                    if (this.cube.MouseDownCheck && !isNaN(e.pageX) && !isNaN(e.pageY)) {
                        const deltaX = e.pageX - this.cube.VR2_Point[0];
                        const deltaY = e.pageY - this.cube.VR2_Point[1];
                        //this.cube.rotation[0] += -deltaY * 0.025;
                        //this.cube.rotation[1] += deltaX * 0.025;
                        const rotationX = -deltaY * 0.025;
                        const rotationY = deltaX * 0.025;

                        const rotationMatrix = getRotationMatrix(rotationX, rotationY);
                        this.cube.RotationMatrix = multiplyMatrices(rotationMatrix, this.cube.RotationMatrix);
                        this.cube.reflesh();
                    }
                }
                if (VRCube.operate_mode == "move" || (VRCube.operate_mode == "window" && this.cube.MouseDownCheck && this.cube.step_tmp != -1)) {
                    if (this.cube.MiddleDownCheck && !isNaN(e.pageX) && !isNaN(e.pageY)) {
                        this.cube.offset[0] -= this.cube.VR2_Point[0] - e.pageX;
                        this.cube.offset[1] -= this.cube.VR2_Point[1] - e.pageY;
                        this.cube.reflesh();
                    }
                    if (this.cube.RightMouseDownCheck && !isNaN(e.pageX) && !isNaN(e.pageY)) {
                        if (Math.abs(this.cube.VR2_Point[0] - e.pageX) > Math.abs(this.cube.VR2_Point[1] - e.pageY)) {
                            this.cube.scale -= (this.cube.VR2_Point[0] - e.pageX) * 0.02;
                            if (this.cube.scale > 3) this.cube.scale = 3;
                            else if (this.cube.scale < 0.1) this.cube.scale = 0.1;
                            this.cube.reflesh();
                        } else if (Math.abs(this.cube.VR2_Point[0] - e.pageX) < Math.abs(this.cube.VR2_Point[1] - e.pageY)) {
                            this.cube.scale += (this.cube.VR2_Point[1] - e.pageY) * 0.02;
                            if (this.cube.scale > 3) this.cube.scale = 3;
                            else if (this.cube.scale < 0.1) this.cube.scale = 0.1;
                            this.cube.reflesh();
                        }
                    }
                    if (!isNaN(e.pageX) && !isNaN(e.pageY)) this.cube.VR2_Point = [e.pageX, e.pageY];
                }
                this.isRequestPending = false;
            });
        }

        function VR2Mouseup(e) {
            this.cube.MouseDownCheck = false;
            this.cube.MiddleDownCheck = false;
            this.cube.RightMouseDownCheck = false;
            if (VRCube.operate_mode == "window" && !this.cube.filter) {
                if (this.cube.step_tmp != -1) {
                    this.cube.step = this.cube.step_tmp;
                    this.cube.step_tmp = -1;
                    this.cube.resetZXY();
                    requestAnimationFrame(() => { this.cube.reflesh() });
                }

                if (!isNaN(this.cube.windowCenter)) this.cube.WCText.value = this.cube.windowCenter;
                if (!isNaN(this.cube.windowWidth)) this.cube.WWText.value = this.cube.windowWidth;
            }
            else if (VRCube.operate_mode == "move") {
                if (this.cube.reduceSlices == true) {
                    for (var ll = 0; ll < this.cube.ElemZs.length; ll++)
                        if (ll % 2 != 0 && ll != 0 && ll != this.cube.ElemZs.length - 1)
                            this.cube.ElemZs[ll].style.display = "";
                    for (var ll = 0; ll < this.cube.ElemXs.length; ll++)
                        if (ll % 2 != 0 && ll != 0 && ll != this.cube.ElemXs.length - 1)
                            this.cube.ElemXs[ll].style.display = "";
                    for (var ll = 0; ll < this.cube.ElemYs.length; ll++)
                        if (ll % 2 != 0 && ll != 0 && ll != this.cube.ElemYs.length - 1)
                            this.cube.ElemYs[ll].style.display = "";
                }
            }
        }
        VR2Mousedown = VR2Mousedown.bind({ cube: this });
        VR2Mousemove = VR2Mousemove.bind({ cube: this, isRequestPending: false });
        VR2Mouseup = VR2Mouseup.bind({ cube: this, container: this.container });
        DIV.addEventListener("mousemove", VR2Mousemove, false);
        DIV.addEventListener("mousedown", VR2Mousedown, false);
        DIV.addEventListener("mouseup", VR2Mouseup, false);
    }

    buildOutputer() {
        var userDIV_LB = document.createElement("DIV");
        userDIV_LB.style['position'] = "absolute";
        userDIV_LB.style['bottom'] = "0";

        var FPSLable = document.createElement("LABEL");
        FPSLable.className = "VR2_LabelLB";
        FPSLable.innerText = "FPS:";
        this.FPSLable = FPSLable;
        this.userDIV_LB = userDIV_LB;
        userDIV_LB.appendChild(FPSLable);
        getByid("VR2_DIV").appendChild(userDIV_LB);
        this.calculating_time = this.calculating_time.bind({ cube: this });
    }

    buildInputer() {
        var userDIV = document.createElement("DIV");
        userDIV.style['flex-direction'] = "column";
        userDIV.style['float'] = "right";
        userDIV.style['display'] = "flex";
        this.userDIV = userDIV;
        getByid("VR2_DIV").appendChild(userDIV);

        //////////Slice//////////

        var sliceLable = document.createElement("LABEL");
        sliceLable.className = "VR2_Label";
        sliceLable.innerText = "Number of both sections";

        var sliceText = document.createElement("input");
        sliceText.type = sliceText.className = "text";
        sliceText.value = this.slice ? this.slice : "";
        sliceText.className = "VR2_Text";

        function sliceTextKeyDown(e) {
            if (isNaN(this.sliceText.value)) this.sliceText.value = this.cube.slice;
            else {
                if (this.sliceText.value > 30) this.sliceText.value = 30;
                else if (this.sliceText.value < 0) this.sliceText.value = 0;

                this.cube.slice = parseInt(Math.abs(this.sliceText.value));
                this.sliceText.value = this.cube.slice; //abs and in
                this.cube.resetX();
                this.cube.resetY();
                this.cube.reflesh();
            }
        }

        sliceTextKeyDown = sliceTextKeyDown.bind({ cube: this, sliceText: sliceText });
        sliceText.addEventListener("change", sliceTextKeyDown, false);

        userDIV.appendChild(sliceLable);
        userDIV.appendChild(sliceText);

        //////////WindowLevel//////////

        var WCLable = document.createElement("LABEL");
        var WWLable = document.createElement("LABEL");
        WCLable.innerText = "Windtow Center";
        WWLable.innerText = "Window Width";
        WCLable.className = WWLable.className = "VR2_Label";

        var WCText = document.createElement("input");
        var WWText = document.createElement("input");
        WCText.type = WCText.className = WWText.type = WWText.className = "text";
        WCText.value = this.windowCenter ? this.windowCenter : "";
        WWText.value = this.windowWidth ? this.windowWidth : "";
        WCText.className = WWText.className = "VR2_Text";
        this.WWText = WWText;
        this.WCText = WCText;

        function WCTextKeyDown(e) {
            if (isNaN(this.WCText.value)) {
                this.WCText.value = this.cube.windowCenter;
            }
            else {
                this.cube.windowCenter = parseInt(this.WCText.value);
                this.WCText.value = this.cube.windowCenter; //abs and in
                this.cube.resetZXY();
                this.cube.reflesh();
            }
        }

        function WWTextKeyDown(e) {
            if (isNaN(this.WWText.value)) {
                this.WWText.value = this.cube.windowWidth;
            }
            else {
                this.cube.windowWidth = parseInt(this.WWText.value);
                this.WWText.value = this.cube.windowWidth; //abs and in
                this.cube.resetZXY();
                this.cube.reflesh();
            }
        }

        WCTextKeyDown = WCTextKeyDown.bind({ cube: this, WCText: WCText });
        WWTextKeyDown = WWTextKeyDown.bind({ cube: this, WWText: WWText });
        WCText.addEventListener("change", WCTextKeyDown, false);
        WWText.addEventListener("change", WWTextKeyDown, false);

        userDIV.appendChild(WCLable);
        userDIV.appendChild(WCText);
        userDIV.appendChild(WWLable);
        userDIV.appendChild(WWText);

        //////////opacity //////////
        var opacityLable = document.createElement("LABEL");
        opacityLable.innerText = "Opacity";
        opacityLable.className = "VR2_Label";

        var opacityText = document.createElement("input");
        opacityText.type = "number";
        opacityText.value = "100";
        opacityText.setAttribute("max", 100);
        opacityText.setAttribute("min", 0);
        opacityText.className = "VR2_Text";
        userDIV.appendChild(opacityLable);
        userDIV.appendChild(opacityText);
        document.documentElement.style.setProperty('--VrOpacity', `initial`);
        opacityText.onchange = function () {
            document.documentElement.style.setProperty('--VrOpacity', this.value / 100);
        };
        //////////Reduce resolution//////////

        var resolutionLable = document.createElement("LABEL");
        resolutionLable.innerText = "Reduce resolution";
        resolutionLable.className = "VR2_Label";

        userDIV.appendChild(resolutionLable);
        var resolutionSelect = document.createElement("select");
        resolutionSelect.style = "z-index: 490;font-weight:bold;font-size:16px";
        var option = document.createElement("option");
        option.innerText = "1";
        option.setAttribute("value", 1);
        option.setAttribute("selected", "selected");
        resolutionSelect.appendChild(option);
        for (var i = 0; i < this.stepFactor.length; i++) {
            if (this.stepFactor[i] > 1 && this.stepFactor[i] <= this.width / 8) {
                option = document.createElement("option");
                option.innerText = this.stepFactor[i];
                option.setAttribute("value", this.stepFactor[i]);
                resolutionSelect.appendChild(option);
            }
        }
        userDIV.appendChild(resolutionSelect);
        function ChangeResolution() {
            this.cube.step = parseInt(this.resolutionSelect.options[this.resolutionSelect.options.selectedIndex].value);
            this.cube.resetZXY();
            this.cube.reflesh();
        }

        ChangeResolution = ChangeResolution.bind({ cube: this, resolutionSelect: resolutionSelect });
        resolutionSelect.addEventListener("change", ChangeResolution, false);
        //////////LUT//////////

        var lutLable = document.createElement("LABEL");
        lutLable.innerText = "LUT";
        lutLable.className = "VR2_Label";
        userDIV.appendChild(lutLable);

        var lutSelect = document.createElement("select");
        lutSelect.style = "z-index: 490;font-weight:bold;font-size:16px";
        var option = document.createElement("option");
        option.innerText = "default";
        option.setAttribute("selected", "selected");
        option.setAttribute("value", "default");
        lutSelect.appendChild(option);
        for (var i = 0; i < VR2_LutArray.length; i++) {
            option = document.createElement("option");
            option.innerText = VR2_LutArray[i].name;
            option.setAttribute("value", VR2_LutArray[i].name);
            option.setAttribute("filter", VR2_LutArray[i].filter);
            option.setAttribute("defaultWindow", VR2_LutArray[i].defaultWindow);
            option.defaultWindow = VR2_LutArray[i].defaultWindow;
            option.filter = VR2_LutArray[i].filter;

            if (option.innerText == "Color") option.setAttribute("selected", "selected");
            lutSelect.appendChild(option);
        }

        userDIV.appendChild(lutSelect);
        this.lut = lutSelect.options[lutSelect.options.selectedIndex].value;

        function ChangeLut() {
            this.cube.lut = this.lutSelect.options[this.lutSelect.options.selectedIndex].value;
            var defaultWindow = this.lutSelect.options[this.lutSelect.options.selectedIndex].defaultWindow;
            var filter = this.lutSelect.options[this.lutSelect.options.selectedIndex].filter;

            if (defaultWindow) {
                this.cube.windowCenter = defaultWindow.windowCenter == 'origin' ? this.cube.OriginWindowCenter : defaultWindow.windowCenter;
                this.cube.windowWidth = defaultWindow.windowWidth == 'origin' ? this.cube.OriginWindowWidth : defaultWindow.windowWidth;
                if (!isNaN(this.cube.windowCenter)) this.cube.WCText.value = this.cube.windowCenter;
                if (!isNaN(this.cube.windowWidth)) this.cube.WWText.value = this.cube.windowWidth;
            }
            if (filter) {
                this.cube.filter = filter;
            } else this.cube.filter = null;
            this.cube.resetZXY();
            this.cube.reflesh();
        }

        ChangeLut = ChangeLut.bind({ cube: this, lutSelect: lutSelect });
        lutSelect.addEventListener("change", ChangeLut, false);


        //////////Shadow//////////
        var span = document.createElement("span");
        span.style['zIndex'] = "490";
        span.style['float'] = "right";
        var ShadowLable = document.createElement("LABEL");
        ShadowLable.innerText = "Shadow";
        ShadowLable.className = "VR2_Label";
        ShadowLable.style.float = "left";

        var ShadowCheck = document.createElement("input");
        ShadowCheck.style = "z-index: 490;float:left";
        ShadowCheck.type = "checkbox";
        ShadowCheck.setAttribute("checked", "checked");
        this.ShadowCheck = ShadowCheck;

        function ChangeShadow() {
            //this.ShadowCheck.setAttribute("disabled", "disabled");
            if (this.ShadowCheck.checked) this.cube.shadow = true;
            else this.cube.shadow = false;
            this.cube.resetZXY();
            this.cube.reflesh();
            //requestAnimationFrame(() => { setTimeout(this.ShadowCheck.removeAttribute("disabled"), 500); });
        }

        ChangeShadow = ChangeShadow.bind({ cube: this, ShadowCheck: ShadowCheck });
        ShadowCheck.addEventListener("change", ChangeShadow, false);

        span.appendChild(ShadowCheck);
        span.appendChild(ShadowLable);
        userDIV.appendChild(span);

        //////////Smooth//////////
        var span = document.createElement("span");
        span.style['zIndex'] = "490";
        span.style['float'] = "right";
        var SmoothLable = document.createElement("LABEL");
        SmoothLable.innerText = "Smooth";
        SmoothLable.className = "VR2_Label";
        SmoothLable.style.float = "left";

        var SmoothCheck = document.createElement("input");
        SmoothCheck.style = "z-index: 490;float:left";
        SmoothCheck.type = "checkbox";
        //SmoothCheck.setAttribute("checked", "checked");
        this.SmoothCheck = SmoothCheck;

        function ChangeSmooth() {
            if (this.SmoothCheck.checked) this.cube.smooth = true;
            else this.cube.smooth = false;
            this.cube.resetZXY();
            this.cube.reflesh();
        }

        ChangeSmooth = ChangeSmooth.bind({ cube: this, SmoothCheck: SmoothCheck });
        SmoothCheck.addEventListener("change", ChangeSmooth, false);

        span.appendChild(SmoothCheck);
        span.appendChild(SmoothLable);
        userDIV.appendChild(span);

        //////////Reduce Slices//////////

        var span = document.createElement("span");
        span.style['zIndex'] = "490";
        span.style['float'] = "right";
        var ReduceSliceLable = document.createElement("LABEL");
        ReduceSliceLable.innerText = "Reduce Slices";
        ReduceSliceLable.className = "VR2_Label";
        ReduceSliceLable.style.float = "left";

        var ReduceSlicesCheck = document.createElement("input");
        ReduceSlicesCheck.style = "z-index: 490;float:left";
        ReduceSlicesCheck.type = "checkbox";
        ReduceSlicesCheck.id = "VR2_ReduceSlicesCheck";
        //PerspectiveCheck.setAttribute("checked", "checked");
        this.ReduceSlicesCheck = ReduceSlicesCheck;
        if (this.sopList.length >= 50) ReduceSlicesCheck.setAttribute("checked", "checked");
        function ChangeReduceSlices() {
            if (this.ReduceSlicesCheck.checked) this.cube.reduceSlices = true;
            else this.cube.reduceSlices = false;
            /*
            for (var ll = 0; ll < this.cube.ElemZs.length; ll++)
                if (ll % 2 != 0 && ll != 0 && ll != this.cube.ElemZs.length - 1)
                    this.cube.ElemZs[ll].style.display = this.cube.reduceSlices == true ? "none" : "";
            this.cube.reflesh();*/
        }
        ChangeReduceSlices = ChangeReduceSlices.bind({ cube: this, ReduceSlicesCheck: ReduceSlicesCheck });
        ReduceSlicesCheck.addEventListener("change", ChangeReduceSlices, false);

        span.appendChild(ReduceSlicesCheck);
        span.appendChild(ReduceSliceLable);
        userDIV.appendChild(span);

        //////////STL//////////
        var span = document.createElement("span");
        span.style['zIndex'] = "490";
        span.style['float'] = "right";
        var STLLable = document.createElement("LABEL");
        STLLable.innerText = "Download as hollow STL model";
        STLLable.className = "VR2_Label";
        STLLable.style.float = "left";

        var STLCheck = document.createElement("input");
        STLCheck.style = "z-index: 490;float:left";
        STLCheck.type = "checkbox";
        STLCheck.id = "VR2_STLCheck";
        STLCheck.setAttribute("checked", "checked");

        span.appendChild(STLCheck);
        span.appendChild(STLLable);
        userDIV.appendChild(span);
        //////////Perspective//////////
        var span = document.createElement("span");
        span.style['zIndex'] = "490";
        span.style['float'] = "right";
        var PerspectiveLable = document.createElement("LABEL");
        PerspectiveLable.innerText = "Perspective(disabled)";
        PerspectiveLable.className = "VR2_Label";
        PerspectiveLable.style.float = "left";

        var PerspectiveCheck = document.createElement("input");
        PerspectiveCheck.style = "z-index: 490;float:left";
        PerspectiveCheck.type = "checkbox";
        PerspectiveCheck.id = "VR2_PerspectiveCheck";
        //PerspectiveCheck.setAttribute("checked", "checked");
        this.PerspectiveCheck = PerspectiveCheck;

        var PerspectiveRange = document.createElement("input");
        PerspectiveRange.setAttribute("type", "range")
        PerspectiveRange.setAttribute("min", 1);
        PerspectiveRange.setAttribute("max", 512);
        PerspectiveRange.setAttribute("value", 512);
        PerspectiveRange.setAttribute("disabled", "disabled");

        function ChangePerspective(e) {
            if (this.PerspectiveCheck.checked) {
                if (e.target == this.PerspectiveCheck) {
                    var userConfirmed = false;
                    //警告訊息
                    userConfirmed = prompt('Caution! "Perspective" is a test feature and may cause the computer to crash in some situations.\nDo you still want to use it? (Enter yes or no)\n\n注意！「Perspective」為測試功能，部份情況可能導致電腦當機。\n請問您仍然要使用嗎？ (輸入yes或no)', 'no');

                    if (!userConfirmed || userConfirmed.toLowerCase() != "yes") {
                        this.PerspectiveCheck.checked = false;
                        return;
                    }
                }

                this.cube.perspective = this.PerspectiveRange.value + "px";
                PerspectiveLable.innerText = "Perspective(" + this.PerspectiveRange.value + "px)";
                PerspectiveRange.removeAttribute("disabled");
                this.cube.updatePerspective();
            } else {
                this.cube.perspective = "";
                PerspectiveLable.innerText = "Perspective(disabled)";
                PerspectiveRange.setAttribute("disabled", "disabled");
                this.cube.updatePerspective();
            }
        }

        getByid("VR2_DIV").style.perspective = "";
        ChangePerspective = ChangePerspective.bind({ cube: this, PerspectiveLable: PerspectiveLable, PerspectiveCheck: PerspectiveCheck, PerspectiveRange: PerspectiveRange });
        PerspectiveCheck.addEventListener("change", ChangePerspective, false);
        PerspectiveRange.addEventListener("change", ChangePerspective, false);
        span.appendChild(document.createElement("BR"));
        span.appendChild(PerspectiveCheck);
        span.appendChild(PerspectiveLable);
        span.appendChild(document.createElement("BR"));
        span.appendChild(PerspectiveRange);
        userDIV.appendChild(span);
    }

    build() {
        this.clear();
        this.buildContainer();
        this.buildInputer();
        this.buildOutputer();
        this.buildZ();
        this.ReArrangeZ();
        this.RenderShadow();
        this.buildX();
        this.buildY();
    }

    RenderShadow() {
        if (!this.shadow) return;
        if (VRCube.operate_mode == "window" && this.MouseDownCheck == true) return;
        for (var ll = 0; ll < this.ElemZs.length; ll++) {
            if (ll % 2 != 0 && ll != 0 && ll != this.ElemZs.length - 1) continue;
            var canvas = this.ElemZs[ll];
            var length = Math.abs(this.GetMaxByElemZ() - this.GetMinByElemZ());
            var dist = 1 - (Math.abs(canvas.position.z - this.GeMediumByElemZ()) / length);

            var ctx = canvas.getContext("2d");
            ctx.save();
            var ShadowScale = 0.25;
            var gradient = ctx.createRadialGradient(this.width / 2, this.height / 2, 0, this.width / 2, this.height / 2, Math.max(this.width * (1 - ShadowScale), this.height * (1 - ShadowScale)) / 2);

            gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');  // Center: full opacity black
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');  // Edge: transparent black
            ctx.globalAlpha = 0.2 * dist;
            ctx.fillStyle = gradient;
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.restore();
        }
    }

    Render2Canvas(canvas, intercept, slope, color, step) {
        var ctx = canvas.getContext("2d"), pixelData = canvas.pixelData;
        var imgData = ctx.createImageData(canvas.width, canvas.height);
        //預先填充不透明度為255
        canvas.imgData = new Uint32Array(imgData.data.buffer).fill(0xFF0000FF);

        var high = this.windowCenter + (this.windowWidth / 2), low = this.windowCenter - (this.windowWidth / 2);
        var intercept = (intercept == undefined || intercept == null) ? 0 : intercept;
        var slope = (slope == undefined || slope == null) ? 1 : slope;

        const multiplication = 255 / ((high - low)) * slope;
        const addition = (- low + intercept) / (high - low) * 255;
        const data = imgData.data;
        if (color == true) {
            for (var i = data.length - 4; i >= 0; i -= 4) {
                data[i + 0] = pixelData[i] * multiplication + addition;
                data[i + 1] = pixelData[i + 1] * multiplication + addition;
                data[i + 2] = pixelData[i + 2] * multiplication + addition;
            }
        } else {
            //沒壓縮
            if (step == 1) {
                for (var i = 0, j = 0; i < data.length, j < pixelData.length; i += 4, j++) {
                    data[i + 0] = data[i + 1] = data[i + 2] = pixelData[j] * multiplication + addition;
                    if (data[i + 0] == 0) data[i + 3] = 0;
                }
            }
            //有壓縮
            else {
                for (var i = 0, j = 0; i < data.length, j < pixelData.length; i += 4, j += step) {
                    data[i + 0] = data[i + 1] = data[i + 2] = pixelData[j] * multiplication + addition;
                    if (data[i + 0] == 0) data[i + 3] = 0;
                    if (j % (canvas.width * step) == 0) j += (step - 1) * canvas.width * step;
                }
            }
        }

        if (this.lut != "MIP" && this.lut != "MinIP" && this.lut != "default") {
            if (VR2_LutArray[0]) {
                var lut = null;
                for (var lutobj of VR2_LutArray) if (lutobj.name == this.lut) lut = lutobj;
                if (lut) {
                    var data_ = canvas.imgData;
                    var arr = lut.array;
                    for (var i = 0, i4 = 0; i < data_.length; i++, i4 += 4) {
                        data_[i] = arr[data[i4]];
                    }
                }
            }
        }
        if (this.smooth) {
            for (var i = data.length - 4; i >= 0; i -= 4) {
                data[i + 3] = parseInt((data[i] + data[i + 1] + data[i + 2]) / 3 * 2);
            }
        }

        ctx.putImageData(imgData, 0, 0);
    }

    buildZ() {
        var step = this.step;

        for (var ll = 0; ll < this.sopList.length; ll++) {
            try {
                var SOP = this.sopList[ll], NewCanvas = document.createElement("CANVAS");
                if (SOP.Image.imageDataLoaded == false && SOP.Image.loadImageData) SOP.Image.loadImageData();
                NewCanvas.className = "VrCanvas"; //"VrCanvas VRshadow"

                //預覽模式可以讓左右兩側的圖正常
                if ((ll == 0 || ll == this.sopList.length - 1) && this.step_tmp != -1 && (/*!this.ShadowCheck.checked ||*/ (VRCube.operate_mode == "window" && this.MouseDownCheck == true))) {
                    step = this.step_tmp > 1 ? this.step_tmp : 1;
                    [NewCanvas.style.width, NewCanvas.style.height] = [parseInt(SOP.Image.width / this.step) + "px", parseInt(SOP.Image.height / this.step) + "px"]
                }
                else step = this.step;

                NewCanvas.style.position = "absolute";
                //[NewCanvas.style.width, NewCanvas.style.height] = [SOP.Image.width + "px", SOP.Image.height + "px"]

                [NewCanvas.width, NewCanvas.height] = [SOP.Image.width, SOP.Image.height];
                if (step != 1) {
                    [NewCanvas.width, NewCanvas.height] = [SOP.Image.width / step, SOP.Image.height / step];
                    /////[NewCanvas.style.width, NewCanvas.style.height] = [SOP.Image.width + "px", SOP.Image.height + "px"]
                }//else[NewCanvas.width, NewCanvas.height] = [SOP.Image.width / step, SOP.Image.height / step];

                NewCanvas.pixelData = SOP.Image.pixelData;
                NewCanvas.windowCenter = this.windowCenter;
                NewCanvas.windowWidth = this.windowWidth;

                this.Render2Canvas(NewCanvas, SOP.Image.intercept, SOP.Image.slope, SOP.Image.color, step);

                NewCanvas.position = new Point3D(0, 0, 0);
                NewCanvas.position.z = parseFloat(SOP.Image.data.string(Tag.ImagePositionPatient).split("\\")[2]) * (1 / (parseFloat(SOP.Image.rowPixelSpacing)));
                NewCanvas.originPositionZ = NewCanvas.position.z;
                NewCanvas.direction = 'z';

                var Matrix = multiplyMatrices(getTranslateMatrix(0, 0, (NewCanvas.position.z / step)), [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
                NewCanvas.style.transform = applyRotationMatrix(Matrix);
                //if (this.rescaleMode == "resize" && step != 1) NewCanvas.position.z /= step;
                //NewCanvas.style.transform = `translate3d(0, 0, -` + (NewCanvas.position.z / step) + ")";
                //if (this.reduceSlices == true && ll % 2 != 0 && ll != 0 && ll != this.sopList.length - 1) NewCanvas.style.display = "none";
                this.container.appendChild(NewCanvas);
                this.ElemZs.push(NewCanvas);
            } catch (ex) { console.log(ex); };
        }
        this.ElemZs = soryByTwoKey(this.ElemZs, "position", "z");
    }

    getElemZByPosZ(num) {
        var distance = Number.MAX_VALUE;
        var BeforeElem = null, elem = null;

        for (var obj of this.ElemZs) {
            if (Math.abs(obj.position.z - num) < distance) {
                distance = Math.abs(obj.position.z - num);
                elem = obj;
            }
        }
        BeforeElem = elem;
        var BeforeDistance = distance;
        var distance = Number.MAX_VALUE;
        var AfterElem = null, elem = null;

        if (obj.position.z - num > 0) {
            for (var obj of this.ElemZs) {
                if (Math.abs(obj.position.z - num) < distance && obj.position.z - num < 0) {
                    distance = Math.abs(obj.position.z - num);
                    elem = obj;
                }
            }
        } else if (obj.position.z - num < 0) {
            for (var obj of this.ElemZs) {
                if (Math.abs(obj.position.z - num) < distance && obj.position.z - num > 0) {
                    distance = Math.abs(obj.position.z - num);
                    elem = obj;
                }
            }
        } else {
            distance = BeforeDistance;
        }
        AfterElem = elem;
        if (AfterElem == null) AfterElem = elem;
        var AfterDistance = distance;

        BeforeDistance = Math.abs(BeforeDistance);
        AfterDistance = Math.abs(AfterDistance);
        var Distance = BeforeDistance + AfterDistance;

        return {
            BeforeElem: BeforeElem, AfterElem: AfterElem,
            BeforeDistance: BeforeDistance / Distance, AfterDistance: AfterDistance / Distance
        };
    }

    //從左往右看
    buildX() {
        for (var i = 0; i < this.slice; i++) {
            try {
                var NewCanvas = document.createElement("CANVAS");
                NewCanvas.className = "VrCanvas"; //"VrCanvas VRshadow"

                NewCanvas.style.position = "absolute";
                NewCanvas.width = parseInt(this.deep);
                NewCanvas.height = this.height;


                if (this.step != 1) {
                    NewCanvas.height = this.height / this.step;
                    ////NewCanvas.style.height = this.height + "px";
                    ////NewCanvas.style.width = parseInt(this.deep) + "px";
                }
                //NewCanvas.style.width = NewCanvas.width + "px";
                //NewCanvas.style.height = NewCanvas.height + "px";

                var ctx = NewCanvas.getContext("2d");
                var imgData = ctx.createImageData(NewCanvas.width, NewCanvas.height);
                //new Uint32Array(imgData.data.buffer).fill(0x00000000);
                //var data = imgData.data;

                ctx.putImageData(imgData, 0, 0);
                var pos_x = (0 + this.width * (i / this.slice));
                const deep = parseInt(this.deep);

                for (var d = 0; d < deep; d++) {
                    //var originData = ctx.getImageData(d, 0, 1, NewCanvas.height);
                    var TwicheElemZ = this.getElemZByPosZ((deep - d) * this.step + this.GetMinByElemZ());
                    if (!TwicheElemZ.AfterElem) TwicheElemZ.AfterElem = TwicheElemZ.BeforeElem;
                    //var TargetData = elemZ.getContext('2d').getImageData(parseInt(pos_x), 0, 1, elemZ.height)
                    //for (var f = 0; f < originData.data.length; f++) originData.data[f] = TargetData.data[f];
                    ctx.globalAlpha = TwicheElemZ.AfterDistance;
                    ctx.drawImage(TwicheElemZ.BeforeElem, parseInt(pos_x / this.step), 0, 1, TwicheElemZ.BeforeElem.height, d, 0, 1, NewCanvas.height);
                    ctx.globalAlpha = TwicheElemZ.BeforeDistance;
                    ctx.drawImage(TwicheElemZ.AfterElem, parseInt(pos_x / this.step), 0, 1, TwicheElemZ.AfterElem.height, d, 0, 1, NewCanvas.height);
                    ctx.globalAlpha = 1;
                    //ctx.putImageData(TargetData, d, 0);
                }

                NewCanvas.position = new Point3D(0, 0, 0);
                NewCanvas.position.x = pos_x;
                NewCanvas.direction = 'x';

                var Matrix = multiplyMatrices(getRotationMatrix(0, Math.PI / 2), [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
                var Matrix = multiplyMatrices(getTranslateMatrix(((NewCanvas.position.x - this.width / 2) / this.step), 0, 0), Matrix);
                NewCanvas.style.transform = applyRotationMatrix(Matrix);
                //NewCanvas.style.transform = applyRotationMatrix(Matrix, ((NewCanvas.position.x - this.width / 2) / this.step), 0, 0);
                //NewCanvas.style.transform = `translate3d(0, 0, 0) rotateY(90deg) translateZ(` + ((NewCanvas.position.x - this.width / 2) / this.step) + "px)";
                this.container.appendChild(NewCanvas);
                this.ElemXs.push(NewCanvas);
            } catch (ex) { };
        }
    }

    //從上往下看
    buildY() {
        for (var i = 0; i < this.slice; i++) {
            try {
                var NewCanvas = document.createElement("CANVAS");
                NewCanvas.className = "VrCanvas"; //"VrCanvas VRshadow"

                NewCanvas.style.position = "absolute";

                NewCanvas.width = this.width;
                NewCanvas.height = parseInt(this.deep);

                if (this.step != 1) {
                    NewCanvas.width = this.width / this.step;
                    /////NewCanvas.style.width = this.width + "px";
                    /////NewCanvas.style.height = parseInt(this.deep) + "px";
                }

                //NewCanvas.pixelData = this.ElemZs[0].pixelData;
                var ctx = NewCanvas.getContext("2d");
                var imgData = ctx.createImageData(NewCanvas.width, NewCanvas.height);
                //new Uint32Array(imgData.data.buffer).fill(0x00000000);
                //var data = imgData.data;

                ctx.putImageData(imgData, 0, 0);
                var pos_y = (0 + this.height * (i / this.slice));
                const deep = parseInt(this.deep);

                for (var d = 0; d < deep; d++) {
                    //var originData = ctx.getImageData(0, d, NewCanvas.width, 1);
                    var TwicheElemZ = this.getElemZByPosZ(d * this.step + this.GetMinByElemZ());
                    if (!TwicheElemZ.AfterElem) TwicheElemZ.AfterElem = TwicheElemZ.BeforeElem;
                    //var TargetData = elemZ.getContext('2d').getImageData(0, parseInt(pos_y), elemZ.width, 1);
                    //for (var f = 0; f < originData.data.length; f++)  originData.data[f] = TargetData.data[f];;
                    ctx.globalAlpha = TwicheElemZ.AfterDistance;
                    ctx.drawImage(TwicheElemZ.BeforeElem, 0, parseInt(pos_y / this.step), TwicheElemZ.BeforeElem.width, 1, 0, d, NewCanvas.width, 1);
                    ctx.globalAlpha = TwicheElemZ.BeforeDistance;
                    ctx.drawImage(TwicheElemZ.AfterElem, 0, parseInt(pos_y / this.step), TwicheElemZ.AfterElem.width, 1, 0, d, NewCanvas.width, 1);
                    ctx.globalAlpha = 1;
                    //ctx.putImageData(TargetData, 0, d);
                }

                NewCanvas.position = new Point3D(0, 0, 0);
                NewCanvas.position.y = -pos_y;//+ offsety;
                NewCanvas.direction = 'y';

                var Matrix = multiplyMatrices(getRotationMatrix(Math.PI / 2, 0), [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
                var Matrix = multiplyMatrices(getTranslateMatrix(0, -((((NewCanvas.position.y / this.step + (this.deep) / 2)))), 0), Matrix);
                NewCanvas.style.transform = applyRotationMatrix(Matrix);
                //NewCanvas.style.transform = `translate3d(0, 0, 0) rotateX(90deg) translateZ(` + (((NewCanvas.position.y / this.step + (this.deep) / 2))) + "px)";
                this.container.appendChild(NewCanvas);
                this.ElemYs.push(NewCanvas);
            } catch (ex) { };
        }
    }

    GetMinByElemZ() {
        var MinZ = Number.MAX_VALUE;
        var thicknessList = [];
        for (var obj of this.ElemZs) {
            thicknessList.push(obj.thickness);
            if (obj.position.z < MinZ) MinZ = obj.position.z;
        }
        return MinZ;
    }

    GetMaxByElemZ() {
        var MaxZ = Number.MIN_VALUE;
        var thicknessList = [];
        for (var obj of this.ElemZs) {
            thicknessList.push(obj.position.z);
            if (obj.position.z > MaxZ) MaxZ = obj.position.z;
        }
        return MaxZ;
    }

    GeMediumByElemZ() {
        let getMedium = arr => {
            let len = arr.length;
            arr = arr.sort((a, b) => a - b);
            if (len % 2 === 0) return (arr[len / 2] + arr[len / 2 - 1]) / 2;
            else return arr[(len - 1) / 2];
        }
        var thicknessList = [];
        for (var obj of this.ElemZs)
            thicknessList.push(obj.position.z);
        return getMedium(thicknessList);
    }

    ReArrangeZ() {
        var CenterZ = this.GeMediumByElemZ();
        for (var obj of this.ElemZs) {
            obj.position.z = obj.position.z - CenterZ;
            obj.style.transform = `translate3d(0, 0, 0) translateZ(` + (obj.position.z / this.step) + "px)";
        }
        this.deep = (this.GetMaxByElemZ() - this.GetMinByElemZ()) / this.step;
    }
}


function initVR2() {
    if (BL_mode == 'VR2') {
        set_BL_model.onchange = function () {
            displayMark();
            set_BL_model.onchange = function () { return 0; };
        }

        openLeftImgClick = false;
        BlueLightMousedownList = [];
        BlueLightMousemoveList = [];
        BlueLightMouseupList = [];
        //displayVR2();
        VRCube.operate_mode = "move";
        drawBorder(getByid("moveVR2"));

        var cube = new VRCube(GetViewport().sop);
        Pages.displayPage("VRPage");
        cube.build();
    }
}

function multiplyMatrices(a, b) {
    const c = [];
    for (let i = 0; i < 4; i++) {
        c[i * 4 + 0] = a[i * 4 + 0] * b[0] + a[i * 4 + 1] * b[4] + a[i * 4 + 2] * b[8] + a[i * 4 + 3] * b[12];
        c[i * 4 + 1] = a[i * 4 + 0] * b[1] + a[i * 4 + 1] * b[5] + a[i * 4 + 2] * b[9] + a[i * 4 + 3] * b[13];
        c[i * 4 + 2] = a[i * 4 + 0] * b[2] + a[i * 4 + 1] * b[6] + a[i * 4 + 2] * b[10] + a[i * 4 + 3] * b[14];
        c[i * 4 + 3] = a[i * 4 + 0] * b[3] + a[i * 4 + 1] * b[7] + a[i * 4 + 2] * b[11] + a[i * 4 + 3] * b[15];
    }
    return c;
}

function getTranslateMatrix(translateX = 0, translateY = 0, translateZ = 0) {
    const translateMatrix = [
        1, 0, 0, translateX,
        0, 1, 0, translateY,
        0, 0, 1, translateZ,
        0, 0, 0, 1
    ];
    return translateMatrix;
}

function getRotationMatrix(rotateX = 0, rotateY = 0, rotateZ = 0) {
    const cosX = Math.cos(rotateX);
    const sinX = Math.sin(rotateX);
    const cosY = Math.cos(rotateY);
    const sinY = Math.sin(rotateY);
    const cosZ = Math.cos(rotateZ);
    const sinZ = Math.sin(rotateZ);

    const rotationXMatrix = [
        1, 0, 0, 0,
        0, cosX, -sinX, 0,
        0, sinX, cosX, 0,
        0, 0, 0, 1
    ];

    const rotationYMatrix = [
        cosY, 0, sinY, 0,
        0, 1, 0, 0,
        -sinY, 0, cosY, 0,
        0, 0, 0, 1
    ];

    const rotationZMatrix = [
        cosZ, -sinZ, 0, 0,
        sinZ, cosZ, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];

    return multiplyMatrices(rotationYMatrix, rotationXMatrix);
}

function getScaleMatrix(scale) {
    return scaleMatrix = [
        scale, 0, 0, 0,
        0, scale, 0, 0,
        0, 0, scale, 0,
        0, 0, 0, 1
    ];
}

function applyRotationMatrix(m) {
    return `matrix3d(${m[0]}, ${m[4]}, ${m[8]}, 0, ${m[1]}, ${m[5]}, ${m[9]}, 0, ${m[2]}, ${m[6]}, ${m[10]}, 0, ${m[3]}, ${m[7]}, ${m[11]}, 1)`;
}