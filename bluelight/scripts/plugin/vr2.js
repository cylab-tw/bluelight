
var openVR2 = false;

function loadVR2() {
    var span = document.createElement("SPAN")
    span.innerHTML =
        ` <img class="img VR2" alt="VR2" id="ImgVR2" onmouseover = "onElementOver(this);" onmouseleave = "onElementLeave();" src="../image/icon/black/vr2.png" width="50" height="50">  `;
    getByid("icon-list").appendChild(span);

    function createVR2_DIV(viewportNum = viewportNumber) {
        var DIV = document.createElement("DIV");
        DIV.id = "VR2_DIV";
        DIV.setAttribute("border", 2);
        DIV.style = "border-collapse:collapse";
        DIV.style.position = "absolute";
        DIV.style.backgroundColor = "black";
        DIV.style['zIndex'] = "200";
        DIV.style['width'] = DIV.style['height'] = "100%";
        DIV.style['left'] = DIV.style['top'] = "0px";
        DIV.style['display'] = "none";
        GetViewport(viewportNum).div.appendChild(DIV);
        var label = document.createElement("LABEL");
        label.innerText = "This is a test version.";
        label.style['zIndex'] = "500";
        label.style['color'] = "white";
        label.style['position'] = "absolute";
        label.style['font-size'] = "32px";
        label.style['user-select'] = "none";
        DIV.appendChild(label);
    }
    createVR2_DIV();
}
loadVR2();

function displayVR2() {
    getByid("VR2_DIV").style['display'] = "";
}

function hideVR2() {
    getByid("VR2_DIV").style['display'] = "none";
}

getByid("ImgVR2").onclick = function () {
    if (this.enable == false) return;
    openVR2 = !openVR2;
    img2darkByClass("VR2", !openVR2);

    if (!openVR2) {
        for (cube of VRCube.VRCubeList) {
            cube.clear();
        }
        hideVR2();
        getByid("MouseOperation").click();
    } else {
        set_BL_model('VR2');
        initVR2();
    }
    //getByid("MouseOperation_VR").click();
}

class VRCube {
    static VRCubeList = [];

    constructor(sop, slice = 15, step = 1) {
        this.sop = sop;
        this.sopList = sortInstance(sop);
        this.SOP = this.sopList[0];
        this.slice = slice;
        this.step = step;
        this.scale = 1;
        this.pixelSpacing = this.SOP.image.rowPixelSpacing;
        this.rescaleMode = "resize";
        this.renderMode = "whole";
        this.width = this.SOP.image.width;
        this.height = this.SOP.image.height;
        this.ElemXs = [];
        this.ElemYs = [];
        this.ElemZs = [];
        this.container = null;
        this.VR2_Point = new Vector3(0, 0, 0);
        this.VR2_RotateDeg = new Vector3(0, 0, 0);
        this.offset = new Vector3(0, 0, 0);
        this.MouseDownCheck = false;
        this.MiddleDownCheck = false;
        this.RightMouseDownCheck = false;
        VRCube.VRCubeList.push(this);
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
        this.container = null;
    }

    reflesh() {
        if (this.container)
            this.container.style.transform =
                `translate3d(${this.offset[0]}px,${this.offset[1]}px,0) scale(${this.scale}) rotateX(${this.VR2_RotateDeg[0]}deg) rotateY(${this.VR2_RotateDeg[1]}deg) rotateZ(${this.VR2_RotateDeg[2]}deg) `
    }

    buildContainer() {
        var DIV = getByid("VR2_DIV");
        var ContainerDIV = document.createElement("DIV");
        ContainerDIV.style['width'] = ContainerDIV.style['height'] = "100%";
        ContainerDIV.id = "VR2_Container";
        DIV.appendChild(ContainerDIV);
        this.container = ContainerDIV;

        function VR2Mousedown(e) {
            if (e.which == 1) this.cube.MouseDownCheck = true;
            else if (e.which == 2) this.cube.MiddleDownCheck = true;
            else if (e.which == 3) this.cube.RightMouseDownCheck = true;
            this.cube.VR2_Point = [e.pageX, e.pageY];
        }

        function VR2Mousemove(e) {
            if (this.cube.MouseDownCheck) {
                this.cube.VR2_RotateDeg[1] -= this.cube.VR2_Point[0] - e.pageX;
                this.cube.VR2_RotateDeg[0] += this.cube.VR2_Point[1] - e.pageY;
                this.cube.VR2_RotateDeg[1] -= this.cube.VR2_Point[0] * (180 / (180 % this.cube.VR2_Point[1])) - e.pageX;
                this.cube.VR2_RotateDeg[0] += this.cube.VR2_Point[1] * (180 / (180 % this.cube.VR2_Point[0])) - e.pageY;
                this.cube.VR2_RotateDeg[0] = (this.cube.VR2_RotateDeg[0] % 360 + 360) % 360;
                this.cube.VR2_RotateDeg[1] = (this.cube.VR2_RotateDeg[1] % 360 + 360) % 360;
                this.cube.reflesh();
            }
            if (this.cube.MiddleDownCheck) {
                this.cube.offset[0] -= this.cube.VR2_Point[0] - e.pageX;
                this.cube.offset[1] -= this.cube.VR2_Point[1] - e.pageY;
                this.cube.reflesh();
            }
            if (this.cube.RightMouseDownCheck) {
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
            this.cube.VR2_Point = [e.pageX, e.pageY];
        }

        function VR2Mouseup(e) {
            this.cube.MouseDownCheck = false;
            this.cube.MiddleDownCheck = false;
            this.cube.RightMouseDownCheck = false;
        }
        VR2Mousedown = VR2Mousedown.bind({ cube: this });
        VR2Mousemove = VR2Mousemove.bind({ cube: this });
        VR2Mouseup = VR2Mouseup.bind({ cube: this });
        DIV.addEventListener("mousemove", VR2Mousemove, false);
        DIV.addEventListener("mousedown", VR2Mousedown, false);
        DIV.addEventListener("mouseup", VR2Mouseup, false);
    }

    build() {
        this.clear();
        this.buildContainer();
        this.buildZ();
        this.ReArrangeZ();
        this.buildX();
        this.buildY();
    }

    Render2Canvas(canvas, intercept, slope, color, step) {
        var ctx = canvas.getContext("2d"), pixelData = canvas.pixelData;
        var imgData = ctx.createImageData(canvas.width, canvas.height);
        //預先填充不透明度為255
        canvas.imgData = new Uint32Array(imgData.data.buffer).fill(0xFF0000FF);

        var high = canvas.windowCenter + (canvas.windowWidth / 2), low = canvas.windowCenter - (canvas.windowWidth / 2);
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
        ctx.putImageData(imgData, 0, 0);
    }

    buildZ() {
        var step = this.step;

        for (var ll = 0; ll < this.sopList.length; ll++) {
            try {
                var SOP = this.sopList[ll], NewCanvas = document.createElement("CANVAS");
                NewCanvas.className = "VrCanvas";
                NewCanvas.style.position = "absolute";
                //[NewCanvas.style.width, NewCanvas.style.height] = [SOP.image.width + "px", SOP.image.height + "px"]

                if (this.rescaleMode == "resize") [NewCanvas.width, NewCanvas.height] = [SOP.image.width, SOP.image.height];
                else[NewCanvas.width, NewCanvas.height] = [SOP.image.width / step, SOP.image.height / step];

                NewCanvas.pixelData = SOP.pixelData;
                NewCanvas.windowCenter = SOP.image.windowCenter;
                NewCanvas.windowWidth = SOP.image.windowWidth;

                this.Render2Canvas(NewCanvas, SOP.image.intercept, SOP.image.slope, SOP.image.color, step);

                NewCanvas.position = new Point3D(0, 0, 0);
                NewCanvas.position.z = parseFloat(SOP.image.data.string(Tag.ImagePositionPatient).split("\\")[2]) * (1 / (parseFloat(SOP.image.rowPixelSpacing)));
                if (this.rescaleMode == "resize" && step != 1) NewCanvas.position.z /= step;

                NewCanvas.style.transform = "rotate3d(0, 0, 0 , 0deg) translateZ(-" + NewCanvas.position.z + "px)";
                this.container.appendChild(NewCanvas);
                this.ElemZs.push(NewCanvas);
            } catch (ex) { };
        }
        this.ElemZs = soryByTwoKey(this.ElemZs, "position", "z");
    }

    getElemZByPosZ(num) {
        var distance = Number.MAX_VALUE;
        var BeforeElem = null;
        var elem = null;
        for (var obj of this.ElemZs) {
            if (Math.abs(obj.position.z - num) < distance) {
                distance = Math.abs(obj.position.z - num);
                elem = obj;
            }
        }
        BeforeElem = elem;
        var BeforeDistance = distance;
        var distance = Number.MAX_VALUE;
        var AfterElem = null;
        elem = null;
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


    buildX() {
        for (var i = 0; i < this.slice; i++) {
            try {
                var NewCanvas = document.createElement("CANVAS");
                NewCanvas.className = "VrCanvas";
                NewCanvas.style.position = "absolute";
                NewCanvas.width = parseInt(this.deep);
                NewCanvas.height = this.height;
                //NewCanvas.style.width = NewCanvas.width + "px";
                //NewCanvas.style.height = NewCanvas.height + "px";

                var ctx = NewCanvas.getContext("2d");
                var imgData = ctx.createImageData(NewCanvas.width, NewCanvas.height);
                new Uint32Array(imgData.data.buffer).fill(0x00000000);
                var data = imgData.data;

                ctx.putImageData(imgData, 0, 0);
                var pos_x = (0 + this.width * (i / this.slice));
                const deep = parseInt(this.deep);

                for (var d = 0; d < deep; d++) {
                    //var originData = ctx.getImageData(d, 0, 1, NewCanvas.height);
                    var TwicheElemZ = this.getElemZByPosZ((deep - d) * this.pixelSpacing);
                    //var TargetData = elemZ.getContext('2d').getImageData(parseInt(pos_x), 0, 1, elemZ.height)
                    //for (var f = 0; f < originData.data.length; f++) originData.data[f] = TargetData.data[f];
                    ctx.globalAlpha = TwicheElemZ.AfterDistance;
                    ctx.drawImage(TwicheElemZ.BeforeElem, parseInt(pos_x), 0, 1, TwicheElemZ.BeforeElem.height, d, 0, 1, NewCanvas.height);
                    ctx.globalAlpha = TwicheElemZ.BeforeDistance;
                    ctx.drawImage(TwicheElemZ.AfterElem, parseInt(pos_x), 0, 1, TwicheElemZ.AfterElem.height, d, 0, 1, NewCanvas.height);
                    ctx.globalAlpha = 1;
                    //ctx.putImageData(TargetData, d, 0);
                }

                NewCanvas.position = new Point3D(0, 0, 0);
                NewCanvas.position.x = pos_x;
                NewCanvas.style.transform = "rotateY(90deg) translateZ(" + (NewCanvas.position.x - this.width / 2) + "px)";
                this.container.appendChild(NewCanvas);
                this.ElemXs.push(NewCanvas);
            } catch (ex) { };
        }
    }

    buildY() {
        for (var i = 0; i < this.slice; i++) {
            try {
                var NewCanvas = document.createElement("CANVAS");
                NewCanvas.className = "VrCanvas";
                NewCanvas.style.position = "absolute";
                NewCanvas.width = this.width;
                NewCanvas.height = parseInt(this.deep);
                //NewCanvas.style.width = NewCanvas.width + "px";
                //NewCanvas.style.height = NewCanvas.height + "px";

                //NewCanvas.pixelData = this.ElemZs[0].pixelData;
                var ctx = NewCanvas.getContext("2d");
                var imgData = ctx.createImageData(NewCanvas.width, NewCanvas.height);
                new Uint32Array(imgData.data.buffer).fill(0x00000000);
                var data = imgData.data;

                ctx.putImageData(imgData, 0, 0);

                var pos_y = (0 + this.height * (i / this.slice));
                const deep = parseInt(this.deep);

                for (var d = 0; d < deep; d++) {
                    //var originData = ctx.getImageData(0, d, NewCanvas.width, 1);
                    var TwicheElemZ = this.getElemZByPosZ(d * this.pixelSpacing);
                    //var TargetData = elemZ.getContext('2d').getImageData(0, parseInt(pos_y), elemZ.width, 1);
                    //for (var f = 0; f < originData.data.length; f++)  originData.data[f] = TargetData.data[f];;
                    ctx.globalAlpha = TwicheElemZ.AfterDistance;
                    ctx.drawImage(TwicheElemZ.BeforeElem, 0, parseInt(pos_y), TwicheElemZ.BeforeElem.width, 1, 0, d, NewCanvas.width, 1);
                    ctx.globalAlpha = TwicheElemZ.BeforeDistance;
                    ctx.drawImage(TwicheElemZ.AfterElem, 0, parseInt(pos_y), TwicheElemZ.AfterElem.width, 1, 0, d, NewCanvas.width, 1);
                    ctx.globalAlpha = 1;
                    //ctx.putImageData(TargetData, 0, d);
                }

                NewCanvas.position = new Point3D(0, 0, 0);
                NewCanvas.position.y = -pos_y;

                NewCanvas.style.transform = "rotateX(90deg) translateZ(" + (NewCanvas.position.y + this.deep / 2) + "px)";
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
            obj.style.transform = "rotate3d(0, 0, 0 , 0deg) translateZ(" + obj.position.z + "px)";
        }
        this.deep = this.GetMaxByElemZ() - this.GetMinByElemZ();
    }
}


function initVR2() {
    if (BL_mode == 'VR2') {
        set_BL_model.onchange = function () {
            displayMark();
            set_BL_model.onchange = function () { return 0; };
        }

        BlueLightMousedownList = [];
        BlueLightMousemoveList = [];
        BlueLightMouseupList = [];
        displayVR2();

        var cube = new VRCube(GetViewport().sop);
        cube.build();
    }
}
