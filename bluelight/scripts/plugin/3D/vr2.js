
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

        var rList = [], gList = [], bList = [];

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
        var lutArray = new Int32Array(256), AirlutArray = new Int32Array(256);
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

        ////////////////

        var colormap = [
            { value: 0.0, r: 0, g: 0, b: 0, a: 0.00, hu: -1000 },   // -1000
            { value: 0.12, r: 90, g: 180, b: 255, a: 0.05, hu: -700 },   // -700
            { value: 0.28, r: 245, g: 220, b: 180, a: 0.10, hu: -300 },   // -300
            { value: 0.40, r: 200, g: 200, b: 200, a: 0.15, hu: 0 },   // 0
            { value: 0.44, r: 180, g: 100, b: 100, a: 0.30, hu: 100 },   // 100
            { value: 0.52, r: 255, g: 0, b: 0, a: 0.50, hu: 300 },   // 300
            { value: 0.68, r: 255, g: 255, b: 255, a: 0.80, hu: 700 },   // 700
            { value: 0.80, r: 255, g: 255, b: 200, a: 1.00, hu: 1000 },   // 1000
            { value: 1.0, r: 255, g: 255, b: 255, a: 1.00, hu: 1500 },   // 1500
        ];
        var ColorMap = new Array(2500);
        for (var m = 1; m < colormap.length; m++) {
            var distance = Math.abs(colormap[m].hu - colormap[m - 1].hu);
            for (var i = 0; i <= distance; i++) {
                var ratio = i / distance;
                var r = parseInt(colormap[m - 1].r + (colormap[m].r - colormap[m - 1].r) * ratio);
                var g = parseInt(colormap[m - 1].g + (colormap[m].g - colormap[m - 1].g) * ratio);
                var b = parseInt(colormap[m - 1].b + (colormap[m].b - colormap[m - 1].b) * ratio);
                var a = parseInt(colormap[m - 1].a + (colormap[m].a - colormap[m - 1].a) * ratio * 255);
                var hu = parseInt(colormap[m - 1].hu + (colormap[m].hu - colormap[m - 1].hu) * ratio);
                ColorMap[hu + 1000] = [r, g, b, a];
            }
        }
        for (var c = 1; c < ColorMap.length; c++)
            if (!ColorMap[c]) ColorMap[c] = ColorMap[c - 1];


        var CT_LutArray = {
            name: "CT", array: ColorMap, defaultWindow: {
                windowWidth: "origin", windowCenter: "origin"
            }
        }

        VR2_LutArray.push(CT_LutArray);

        ///////////////////////

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

    img2darkByClass("VR2", false);

    getByid("exitVR2").style.display = "";
    getByid("windowVR2").style.display = "";
    getByid("saveVR2").style.display = "";
    getByid("moveVR2").style.display = "";
    initVR2();

    this.style.display = "none";
    getByid("exitVR2").onclick = function () {
        openLeftImgClick = true;

        img2darkByClass("VR2", true);
        getByid("ImgVR2").style.display = "";
        getByid("exitVR2").style.display = "none";
        getByid("windowVR2").style.display = "none";
        getByid("saveVR2").style.display = "none";
        getByid("moveVR2").style.display = "none";
        VRCube.cube.clear();

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
        this.invertColor = false;
        this.displayMark = false;
        this.reduceSlices = false;
        this.filter = null;
        this.PreviewWhileRotating = false;
        if (this.sopList.length >= 50) this.reduceSlices = true;
        if (this.sopList.length >= 50) this.PreviewWhileRotating = true;
        this.RotationMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]; // 初始旋轉矩陣
        VRCube.cube = this;
        getByid("saveVR2").onclick = saveVR2;
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
        for (var obj of [...this.ElemXs, ...this.ElemYs, ...this.ElemZs])
            this.container.removeChild(obj);

        this.ElemXs = []; this.ElemYs = []; this.ElemZs = [];
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
            if (this.filter || (this.PreviewWhileRotating && (this.MouseDownCheck || this.MiddleDownCheck || this.RightMouseDownCheck))) {
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
                this.applyTransformToCube();
            } else {
                this.container.style.transformStyle = "";
                if (this.PerspectiveCheck.checked) this.container.style['transform-origin'] = `center ${(this.height / 2 - offsety)}px ${-this.perspective}`;
                else this.container.style['transform-origin'] = `center ${(this.height / 2 - offsety)}px`;

                var Matrix = multiplyMatrices(getScaleMatrix(this.scale * this.step), [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
                var Matrix = multiplyMatrices(this.RotationMatrix, Matrix);
                var Matrix = multiplyMatrices(getTranslateMatrix(this.offset[0], this.offset[1] + (offsety), 0), Matrix);
                this.container.style.transform = applyRotationMatrix(Matrix);

                //this.container.style.transform =
                //   `translate3d(${this.offset[0]}px,${(this.offset[1] + (offsety))}px,0) scale(${this.scale * this.step}) rotateX(${this.VR2_RotateDeg[0]}deg) rotateY(${this.VR2_RotateDeg[1]}deg) rotateZ(${this.VR2_RotateDeg[2]}deg) `
            }
        }

        requestAnimationFrame(this.calculating_time);
    }
    applyTransformToCube() {
        var AllElem = [...this.ElemZs, ...this.ElemXs, ...this.ElemYs];
        var face = getFacingCubeFace(this.RotationMatrix), Len = AllElem.length + 32;
        if (face.includes('Z')) {
            var elems = (face == "-Z") ? this.ElemZs : this.ElemZs.slice().reverse();
            for (var obj of elems)
                obj.style.zIndex = "" + Len--;
            for (var obj of [...this.ElemYs, ...this.ElemXs])
                obj.style.zIndex = "" + Len--;
        }
        if (face.includes('X')) {
            var elems = (face == "+X") ? this.ElemXs : this.ElemXs.slice().reverse();
            for (var obj of elems)
                obj.style.zIndex = "" + Len--;
            for (var obj of [...this.ElemYs, ...this.ElemZs])
                obj.style.zIndex = "" + Len--;
        }
        if (face.includes('Y')) {
            var elems = (face == "+Y") ? this.ElemYs : this.ElemYs.slice().reverse();
            for (var obj of elems)
                obj.style.zIndex = "" + Len--;
            for (var obj of [...this.ElemZs, ...this.ElemXs])
                obj.style.zIndex = "" + Len--;
        }
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
            if (this.cube.PreviewWhileRotating && VRCube.operate_mode != "window" && (this.cube.MouseDownCheck || this.cube.MiddleDownCheck || this.cube.RightMouseDownCheck))
                requestAnimationFrame(() => { this.cube.resetZXY(); this.cube.reflesh() });
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
        var userDIV = createElem("DIV", "userDIV_VR2");
        this.userDIV = userDIV;
        getByid("VR2_DIV").appendChild(userDIV);

        //////////Slice//////////

        var sliceLable = createElem("LABEL", null, "VR2_Label");
        sliceLable.innerText = "Number of both sections";

        var sliceText = createElem("input", null, "VR2_Text");
        sliceText.type = "number";
        sliceText.value = this.slice ? this.slice : "";

        function sliceTextKeyDown(e) {
            if (isNaN(this.sliceText.value)) this.sliceText.value = this.cube.slice;
            else {
                if (this.sliceText.value > 30) this.sliceText.value = 30;
                else if (this.sliceText.value < 0) this.sliceText.value = 0;

                this.cube.slice = parseInt(Math.abs(this.sliceText.value));
                this.sliceText.value = this.cube.slice;
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

        this.WCLable = createElem("LABEL", null, "VR2_Label");
        this.WWLable = createElem("LABEL", null, "VR2_Label");
        this.WCLable.innerText = "Windtow Center", this.WWLable.innerText = "Window Width";

        this.WCText = createElem("input", null, "VR2_Text");
        this.WWText = createElem("input", null, "VR2_Text");
        this.WCText.type = this.WWText.type = "number";
        this.WCText.value = this.windowCenter ? this.windowCenter : "";
        this.WWText.value = this.windowWidth ? this.windowWidth : "";

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

        WCTextKeyDown = WCTextKeyDown.bind({ cube: this, WCText: this.WCText });
        WWTextKeyDown = WWTextKeyDown.bind({ cube: this, WWText: this.WWText });
        this.WCText.addEventListener("change", WCTextKeyDown, false);
        this.WWText.addEventListener("change", WWTextKeyDown, false);

        userDIV.appendChild(this.WCLable);
        userDIV.appendChild(this.WCText);
        userDIV.appendChild(this.WWLable);
        userDIV.appendChild(this.WWText);

        //////////opacity //////////
        var opacityLable = createElem("LABEL", null, "VR2_Label");
        opacityLable.innerText = "Opacity";

        var opacityText = createElem("input", null, "VR2_Text");
        opacityText.type = "number";
        opacityText.value = "100";
        opacityText.setAttribute("max", 100);
        opacityText.setAttribute("min", 0);
        userDIV.appendChild(opacityLable);
        userDIV.appendChild(opacityText);
        document.documentElement.style.setProperty('--VrOpacity', `initial`);
        opacityText.onchange = function () {
            document.documentElement.style.setProperty('--VrOpacity', this.value / 100);
        };
        //////////Reduce resolution//////////

        var resolutionLable = createElem("LABEL", null, "VR2_Label");
        resolutionLable.innerText = "Reduce resolution";
        userDIV.appendChild(resolutionLable);

        var resolutionSelect = createElem("select", null, "userSelect_VR2");
        var option = createElem("option");
        option.innerText = "1";
        option.setAttribute("value", 1);
        option.setAttribute("selected", "selected");
        resolutionSelect.appendChild(option);
        for (var i = 0; i < this.stepFactor.length; i++) {
            if (this.stepFactor[i] > 1 && this.stepFactor[i] <= this.width / 8) {
                var option = createElem("option");
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

        var lutLable = createElem("LABEL", null, "VR2_Label");
        lutLable.innerText = "LUT";
        userDIV.appendChild(lutLable);

        var lutSelect = createElem("select", null, "userSelect_VR2");
        var option = createElem("option");
        option.innerText = "default";
        option.setAttribute("selected", "selected");
        option.setAttribute("value", "default");
        lutSelect.appendChild(option);
        for (var i = 0; i < VR2_LutArray.length; i++) {
            var option = createElem("option");
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
            if (filter) this.cube.filter = filter;
            else this.cube.filter = null;
            this.cube.resetZXY();
            this.cube.reflesh();
        }

        ChangeLut = ChangeLut.bind({ cube: this, lutSelect: lutSelect });
        lutSelect.addEventListener("change", ChangeLut, false);


        //////////Shadow//////////
        var span = createElem("span", null, "userSpan_VR2");

        var ShadowLable = createElem("LABEL", null, "VR2_Label");
        ShadowLable.innerText = "Shadow";
        ShadowLable.style.float = "left";

        this.ShadowCheck = createElem("input", null, "userInput_VR2");
        this.ShadowCheck.type = "checkbox";
        this.ShadowCheck.setAttribute("checked", "checked");

        function ChangeShadow() {
            //this.ShadowCheck.setAttribute("disabled", "disabled");
            if (this.ShadowCheck.checked) this.cube.shadow = true;
            else this.cube.shadow = false;
            this.cube.resetZXY();
            this.cube.reflesh();
            //requestAnimationFrame(() => { setTimeout(this.ShadowCheck.removeAttribute("disabled"), 500); });
        }

        ChangeShadow = ChangeShadow.bind({ cube: this, ShadowCheck: this.ShadowCheck });
        this.ShadowCheck.addEventListener("change", ChangeShadow, false);

        span.appendChild(this.ShadowCheck);
        span.appendChild(ShadowLable);
        userDIV.appendChild(span);

        //////////Smooth//////////
        var span = createElem("span", null, "userSpan_VR2");
        var SmoothLable = createElem("LABEL", null, "VR2_Label");
        SmoothLable.innerText = "Smooth";
        SmoothLable.style.float = "left";

        var SmoothCheck = createElem("input", null, "userInput_VR2");
        SmoothCheck.type = "checkbox";

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

        //////////Invert Color//////////
        var span = createElem("span", null, "userSpan_VR2");
        var DisplayMarkLable = createElem("LABEL", null, "VR2_Label");
        DisplayMarkLable.innerText = "Display Mark";
        DisplayMarkLable.style.float = "left";

        var DisplayMarkCheck = createElem("input", "VR2_DisplayMarkCheck", "userInput_VR2");
        DisplayMarkCheck.type = "checkbox";

        this.DisplayMarkCheck = DisplayMarkCheck;
        function ChangeDisplayMark() {
            if (this.DisplayMarkCheck.checked) this.cube.displayMark = true;
            else this.cube.displayMark = false;
            this.cube.resetZXY();
            this.cube.reflesh();
        }
        ChangeDisplayMark = ChangeDisplayMark.bind({ cube: this, DisplayMarkCheck: DisplayMarkCheck });
        DisplayMarkCheck.addEventListener("change", ChangeDisplayMark, false);

        span.appendChild(DisplayMarkCheck);
        span.appendChild(DisplayMarkLable);
        userDIV.appendChild(span);

        //////////Display Mark//////////
        var span = createElem("span", null, "userSpan_VR2");
        var InvertColorLable = createElem("LABEL", null, "VR2_Label");
        InvertColorLable.innerText = "Invert Color";
        InvertColorLable.style.float = "left";

        var InvertColorCheck = createElem("input", "VR2_InvertColorLableCheck", "userInput_VR2");
        InvertColorCheck.type = "checkbox";

        this.InvertColorCheck = InvertColorCheck;
        function ChangeInvertColor() {
            if (this.InvertColorCheck.checked) this.cube.invertColor = true;
            else this.cube.invertColor = false;
            this.cube.resetZXY();
            this.cube.reflesh();
        }
        ChangeInvertColor = ChangeInvertColor.bind({ cube: this, InvertColorCheck: InvertColorCheck });
        InvertColorCheck.addEventListener("change", ChangeInvertColor, false);

        span.appendChild(InvertColorCheck);
        span.appendChild(InvertColorLable);
        userDIV.appendChild(span);

        //////////Reduce Slices//////////

        var span = createElem("span", null, "userSpan_VR2");
        var ReduceSliceLable = createElem("LABEL", null, "VR2_Label");
        ReduceSliceLable.innerText = "Reduce Slices While Rotating";
        ReduceSliceLable.style.float = "left";

        var ReduceSlicesCheck = createElem("input", "VR2_ReduceSlicesCheck", "userInput_VR2");
        ReduceSlicesCheck.type = "checkbox";
        this.ReduceSlicesCheck = ReduceSlicesCheck;
        if (this.sopList.length >= 50) ReduceSlicesCheck.setAttribute("checked", "checked");
        function ChangeReduceSlices() {
            if (this.ReduceSlicesCheck.checked) this.cube.reduceSlices = true;
            else this.cube.reduceSlices = false;
        }
        ChangeReduceSlices = ChangeReduceSlices.bind({ cube: this, ReduceSlicesCheck: ReduceSlicesCheck });
        ReduceSlicesCheck.addEventListener("change", ChangeReduceSlices, false);

        span.appendChild(ReduceSlicesCheck);
        span.appendChild(ReduceSliceLable);
        userDIV.appendChild(span);

        //////////PreviewWhileRotating//////////

        var span = createElem("span", null, "userSpan_VR2");
        var PreviewLable = createElem("LABEL", null, "VR2_Label");
        PreviewLable.innerText = "Preview While Rotating";
        PreviewLable.style.float = "left";

        var PreviewCheck = createElem("input", "VR2_PreviewCheck", "userInput_VR2");
        PreviewCheck.type = "checkbox";
        this.PreviewCheck = PreviewCheck;
        if (this.sopList.length >= 50) PreviewCheck.setAttribute("checked", "checked");
        function ChangePreview() {
            if (this.PreviewCheck.checked) this.cube.PreviewWhileRotating = true;
            else this.cube.PreviewWhileRotating = false;
        }
        ChangePreview = ChangePreview.bind({ cube: this, PreviewCheck: PreviewCheck });
        PreviewCheck.addEventListener("change", ChangePreview, false);

        span.appendChild(PreviewCheck);
        span.appendChild(PreviewLable);
        userDIV.appendChild(span);

        //////////STL//////////
        var span = createElem("span", null, "userSpan_VR2");
        var STLLable = createElem("LABEL", null, "VR2_Label");
        STLLable.innerText = "Download as hollow STL model";
        STLLable.style.float = "left";

        var STLCheck = createElem("input", "VR2_STLCheck", "userInput_VR2");
        STLCheck.type = "checkbox";
        STLCheck.setAttribute("checked", "checked");

        span.appendChild(STLCheck);
        span.appendChild(STLLable);
        userDIV.appendChild(span);
        //////////Perspective//////////
        var span = createElem("span", null, "userSpan_VR2");
        var PerspectiveLable = document.createElement("LABEL");
        PerspectiveLable.innerText = "Perspective(disabled)";
        PerspectiveLable.className = "VR2_Label";
        PerspectiveLable.style.float = "left";

        var PerspectiveCheck = createElem("input", "VR2_PerspectiveCheck", "userInput_VR2");
        PerspectiveCheck.type = "checkbox";
        this.PerspectiveCheck = PerspectiveCheck;

        var PerspectiveRange = createElem("input");
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
        span.appendChild(createElem("BR"));
        span.appendChild(PerspectiveCheck);
        span.appendChild(PerspectiveLable);
        span.appendChild(createElem("BR"));
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

        if (this.lut == "CT") {
            if (VR2_LutArray[0]) {
                var lut = null;
                for (var lutobj of VR2_LutArray) if (lutobj.name == this.lut) lut = lutobj;
                if (lut) {
                    var colorMap = lut.array;
                    for (var i = 0, j = 0; i < data.length, j < pixelData.length; i += 4, j++) {
                        if (pixelData[j] <= -1000) data[i + 0] = data[i + 1] = data[i + 2] = data[i + 3] = 0;
                        else if (pixelData[j] >= 1500) data[i + 0] = data[i + 1] = data[i + 2] = data[i + 3] = 255;
                        else {
                            data[i + 0] = colorMap[pixelData[j] + 1000][0];
                            data[i + 1] = colorMap[pixelData[j] + 1000][1];
                            data[i + 2] = colorMap[pixelData[j] + 1000][2];
                            data[i + 3] = colorMap[pixelData[j] + 1000][3];
                        }
                        if (pixelData[j] * multiplication + addition <= 0)
                            data[i + 0] = data[i + 1] = data[i + 2] = data[i + 3] = 0;
                    }
                }
            }

        }
        else {
            if (color == true) {
                if (this.invertColor) {
                    for (var i = 0; i < data.length; i += 4) {
                        data[i + 0] = 255 - pixelData[i] * multiplication + addition;
                        data[i + 1] = 255 - pixelData[i + 1] * multiplication + addition;
                        data[i + 2] = 255 - pixelData[i + 2] * multiplication + addition;
                    }
                } else {
                    for (var i = 0; i < data.length; i += 4) {
                        data[i + 0] = pixelData[i] * multiplication + addition;
                        data[i + 1] = pixelData[i + 1] * multiplication + addition;
                        data[i + 2] = pixelData[i + 2] * multiplication + addition;
                    }
                }
            } else {
                if (this.invertColor) {
                    //沒壓縮
                    if (step == 1) {
                        for (var i = 0, j = 0; i < data.length, j < pixelData.length; i += 4, j++) {
                            data[i + 0] = data[i + 1] = data[i + 2] = 255 - (pixelData[j] * multiplication + addition);
                            if (data[i + 0] == 0) data[i + 3] = 0;
                        }
                    }
                    //有壓縮
                    else {
                        for (var i = 0, j = 0; i < data.length, j < pixelData.length; i += 4, j += step) {
                            data[i + 0] = data[i + 1] = data[i + 2] = 255 - (pixelData[j] * multiplication + addition);
                            if (data[i + 0] == 0) data[i + 3] = 0;
                            if (j % (canvas.width * step) == 0) j += (step - 1) * canvas.width * step;
                        }
                    }
                }
                else {
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
        }

        if (this.smooth) {
            for (var i = data.length - 4; i >= 0; i -= 4) {
                data[i + 3] = parseInt((data[i] + data[i + 1] + data[i + 2]) / 3 * 2);
            }
        }

        ctx.putImageData(imgData, 0, 0);

        var SOP = canvas.SOP;
        if (SOP.Image.Orientation && SOP.Image.Orientation.length) {
            ctx.setTransform(new DOMMatrix(
                [SOP.Image.Orientation[0], -SOP.Image.Orientation[3], 0, SOP.Image.imagePosition[0] * SOP.Image.PixelSpacing[0],
                -SOP.Image.Orientation[1], SOP.Image.Orientation[4], 0, SOP.Image.imagePosition[1] * SOP.Image.PixelSpacing[1],
                SOP.Image.Orientation[2], SOP.Image.Orientation[5], 0, SOP.Image.imagePosition[2],
                    0, 0, 0, 1
                ]
            ));
            var cloneCanvas_ = cloneCanvas(canvas);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(cloneCanvas_, 0, 0);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
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

                [NewCanvas.width, NewCanvas.height] = [SOP.Image.width, SOP.Image.height];
                if (step != 1) [NewCanvas.width, NewCanvas.height] = [SOP.Image.width / step, SOP.Image.height / step];

                NewCanvas.pixelData = SOP.Image.pixelData;
                NewCanvas.SOPInstanceUID = SOP.SOPInstanceUID;
                NewCanvas.SOP = SOP;
                NewCanvas.windowCenter = this.windowCenter;
                NewCanvas.windowWidth = this.windowWidth;

                this.Render2Canvas(NewCanvas, SOP.Image.intercept, SOP.Image.slope, SOP.Image.color, step);
                if (this.displayMark) drawMarkForVR2(NewCanvas);

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

                if (this.step != 1) NewCanvas.height = this.height / this.step;

                var ctx = NewCanvas.getContext("2d");
                var imgData = ctx.createImageData(NewCanvas.width, NewCanvas.height);

                ctx.putImageData(imgData, 0, 0);
                var pos_x = (0 + this.width * (i / this.slice));
                const deep = parseInt(this.deep);

                for (var d = 0; d < deep; d++) {
                    var TwicheElemZ = this.getElemZByPosZ((deep - d) * this.step + this.GetMinByElemZ());
                    if (!TwicheElemZ.AfterElem) TwicheElemZ.AfterElem = TwicheElemZ.BeforeElem;
                    ctx.globalAlpha = TwicheElemZ.AfterDistance;
                    ctx.drawImage(TwicheElemZ.BeforeElem, parseInt(pos_x / this.step), 0, 1, TwicheElemZ.BeforeElem.height, d, 0, 1, NewCanvas.height);
                    ctx.globalAlpha = TwicheElemZ.BeforeDistance;
                    ctx.drawImage(TwicheElemZ.AfterElem, parseInt(pos_x / this.step), 0, 1, TwicheElemZ.AfterElem.height, d, 0, 1, NewCanvas.height);
                    ctx.globalAlpha = 1;
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

                if (this.step != 1) NewCanvas.width = this.width / this.step;

                var ctx = NewCanvas.getContext("2d");
                var imgData = ctx.createImageData(NewCanvas.width, NewCanvas.height);

                ctx.putImageData(imgData, 0, 0);
                var pos_y = (0 + this.height * (i / this.slice));
                const deep = parseInt(this.deep);

                for (var d = 0; d < deep; d++) {
                    var TwicheElemZ = this.getElemZByPosZ(d * this.step + this.GetMinByElemZ());
                    if (!TwicheElemZ.AfterElem) TwicheElemZ.AfterElem = TwicheElemZ.BeforeElem;
                    ctx.globalAlpha = TwicheElemZ.AfterDistance;
                    ctx.drawImage(TwicheElemZ.BeforeElem, 0, parseInt(pos_y / this.step), TwicheElemZ.BeforeElem.width, 1, 0, d, NewCanvas.width, 1);
                    ctx.globalAlpha = TwicheElemZ.BeforeDistance;
                    ctx.drawImage(TwicheElemZ.AfterElem, 0, parseInt(pos_y / this.step), TwicheElemZ.AfterElem.width, 1, 0, d, NewCanvas.width, 1);
                    ctx.globalAlpha = 1;
                }

                NewCanvas.position = new Point3D(0, 0, 0);
                NewCanvas.position.y = -pos_y;
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


function drawMarkForVR2(canvas) {
    if (!canvas.SOPInstanceUID) return;
    var marks = PatientMark.filter(M => M.sop == canvas.SOPInstanceUID);

    var ctx = canvas.getContext("2d");
    for (var mark of marks) {
        if (mark.type != "RTSS") continue;
        if (mark.color) ctx.strokeStyle = ctx.fillStyle = "" + mark.color;

        ctx.beginPath();
        for (var o = 0; o < mark.pointArray.length; o++) {
            var PixelSpacing = (1.0 / canvas.SOP.Image.rowPixelSpacing);
            var imagePositionX = parseFloat(canvas.SOP.Image.data.string(Tag.ImagePositionPatient).split("\\")[0]);
            var imagePositionY = parseFloat(canvas.SOP.Image.data.string(Tag.ImagePositionPatient).split("\\")[1]);
            var x1 = Math.ceil((mark.pointArray[o].x - imagePositionX) * PixelSpacing);
            var y1 = Math.ceil((mark.pointArray[o].y - imagePositionY) * PixelSpacing);
            var o2 = o == mark.pointArray.length - 1 ? 0 : o + 1;
            var x2 = Math.ceil((mark.pointArray[o2].x - imagePositionX) * PixelSpacing);
            var y2 = Math.ceil((mark.pointArray[o2].y - imagePositionY) * PixelSpacing);
            if (o == 0) { ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); }
            else { ctx.lineTo(x1, y1); ctx.lineTo(x2, y2); }
        }
        ctx.closePath();
        ctx.globalAlpha = 1.0;
        ctx.stroke();
        ctx.globalAlpha = 0.4;
        ctx.fill();
    }
    for (var mark of marks) {
        if (mark.type != "Overlay") continue;
        ctx.globalAlpha = 0.4;
        ctx.drawImage(mark.canvas, 0, 0);
        ctx.globalAlpha = 1.0;
    }
}

function initVR2() {
    openLeftImgClick = false;
    toolEvt.onSwitch();
    toolEvt = new ToolEvt();
    VRCube.operate_mode = "move";
    drawBorder(getByid("moveVR2"));

    var cube = new VRCube(GetViewport().sop);
    Pages.displayPage("VRPage");
    cube.build();
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

function getFacingCubeFace(matrix) {

    const normals = [
        { name: "+X", vec: [1, 0, 0] }, { name: "-X", vec: [-1, 0, 0] },
        { name: "+Y", vec: [0, 1, 0] }, { name: "-Y", vec: [0, -1, 0] },
        { name: "+Z", vec: [0, 0, 1] }, { name: "-Z", vec: [0, 0, -1] },
    ];

    // 提取旋轉 (3x3)
    function applyMat3(vec, m) {
        const [x, y, z] = vec;
        return [m[0] * x + m[4] * y + m[8] * z,
        m[1] * x + m[5] * y + m[9] * z,
        m[2] * x + m[6] * y + m[10] * z];
    }

    // 從 4x4 抓出旋轉部分
    const rot = matrix;
    const cameraDir = [0, 0, 1]
    let bestFace = null, bestDot = -Infinity;

    for (let n of normals) {
        const worldN = applyMat3(n.vec, rot);
        // 計算 dot product
        const dot = worldN[0] * cameraDir[0] + worldN[1] * cameraDir[1] + worldN[2] * cameraDir[2];
        if (dot > bestDot) {
            bestDot = dot;
            bestFace = n.name;
        }
    }

    //還是以Z為主，如果Z佔25%以上，便無視排序
    if (bestFace.includes("X") || bestFace.includes("Y")) {
        for (let n of normals) {
            const worldN = applyMat3(n.vec, rot);
            const dot = worldN[0] * cameraDir[0] + worldN[1] * cameraDir[1] + worldN[2] * cameraDir[2];
            if (n.name.includes("Z") && Math.abs(dot) > 0.25 && (bestFace.includes("X") || bestFace.includes("Y"))) {
                bestDot = dot;
                bestFace = n.name;
            }
            if (!(bestFace.includes("X") || bestFace.includes("Y")) && dot > bestDot) {
                bestDot = dot;
                bestFace = n.name;
            }
        }
    }

    if (bestFace.includes("Y") && Math.abs(matrix[1]) > 0.5 && Math.abs(matrix[8]) > 0.5) {
        if (bestFace == "+Y") bestFace = "-X";
        else if (bestFace == "-Y") bestFace = "+X";
        if (matrix[1] < 0) {
            if (bestFace == "+X") bestFace = "-X";
            else if (bestFace == "-X") bestFace = "+X";
        }
    }
    else if (bestFace.includes("X") && Math.abs(matrix[2]) > 0.5 && Math.abs(matrix[9]) > 0.5) {
        if (bestFace == "+X") bestFace = "-Y";
        else if (bestFace == "-X") bestFace = "+Y";
        if (matrix[4] < 0) {
            if (bestFace == "+Y") bestFace = "-Y";
            else if (bestFace == "-Y") bestFace = "+Y";
        }
    } else if (bestFace.includes("Y") && matrix[0] < 0) {
        if (bestFace == "+Y") bestFace = "-Y";
        else if (bestFace == "-Y") bestFace = "+Y";
    } else if (bestFace.includes("X") && matrix[5] < 0) {
        if (bestFace == "+X") bestFace = "-X";
        else if (bestFace == "-X") bestFace = "+X";
    }
    return bestFace;
}

function saveVR2() {
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
        intter_ = intter_.replace("v1x", "" + v1x); intter_ = intter_.replace("v1y", "" + v1y);
        intter_ = intter_.replace("v1z", "" + v1z); intter_ = intter_.replace("v2x", "" + v2x);
        intter_ = intter_.replace("v2y", "" + v2y); intter_ = intter_.replace("v2z", "" + v2z);
        intter_ = intter_.replace("v3x", "" + v3x); intter_ = intter_.replace("v3y", "" + v3y);
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
                            pushIntters(h, w, seg0.PositionZ, h + 1, w, seg0.PositionZ, h, w2, seg0.PositionZ);
                            pushIntters(h, w2, seg0.PositionZ, h + 1, w2, seg0.PositionZ, h, w, seg0.PositionZ);
                            pushIntters(h, w, seg0.PositionZ, h - 1, w, seg0.PositionZ, h, w2, seg0.PositionZ);
                            pushIntters(h, w2, seg0.PositionZ, h - 1, w2, seg0.PositionZ, h, w, seg0.PositionZ);
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
                            pushIntters(h, w, seg0.PositionZ, h, w + 1, seg0.PositionZ, h2, w, seg0.PositionZ);
                            pushIntters(h2, w, seg0.PositionZ, h2, w + 1, seg0.PositionZ, h, w, seg0.PositionZ);
                            pushIntters(h, w, seg0.PositionZ, h, w - 1, seg0.PositionZ, h2, w, seg0.PositionZ);
                            pushIntters(h2, w, seg0.PositionZ, h2, w - 1, seg0.PositionZ, h, w, seg0.PositionZ);
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