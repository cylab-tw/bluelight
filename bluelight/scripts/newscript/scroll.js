//表示現在為開放用拖曳切換影像
var openChangeFile = false;


class ScrollTool extends ToolEvt {

    /*onMouseDown(e){
        switch (e.which) {
                case 1: MouseDownCheck = true; break;
                case 2: break;
                case 3: rightMouseDown = true; break;
                default: break;
            }
    }*/
    onMouseMove(e) {
        if (rightMouseDown) scale_size(e, originalPoint_X, originalPoint_Y);
        if (MouseDownCheck) {
            var nextBool = null;
            if (Math.abs(windowMouseDiffY) < Math.abs(windowMouseDiffX)) {
                if (windowMouseDiffX < - 3) nextBool = true;
                else if (windowMouseDiffX > 3) nextBool = false;
            } else {
                if (windowMouseDiffY < - 3) nextBool = true;
                else if (windowMouseDiffY > 3) nextBool = false;
            }

            if (nextBool != null && openLink == false) GetViewport().nextFrame(nextBool);
            else if (nextBool != null && openLink == true) {
                for (var z = 0; z < Viewport_Total; z++)
                    GetViewport(z).nextFrame(nextBool);
            }
        }
    }
    onMouseUp(e) {
        if (openMouseTool && rightMouseDown) displayMark();
        if (openLink) displayAllRuler();
    }
    onSwitch() {
        openChangeFile = false;
        set_BL_model.onchange = function () { return 0; };
    }
    onTouchMove(e, e2) {
        if (getByid("DICOMTagsSelect").selected) return;

        if (TouchDownCheck == true && rightTouchDown == false) {
            if (Math.abs(windowMouseDiffY) < Math.abs(windowMouseDiffX)) {
                if (windowMouseDiffX < - 3) GetViewport().nextFrame(true);
                else if (windowMouseDiffX > 3) GetViewport().nextFrame(false);
            } else {
                if (windowMouseDiffY < - 3) GetViewport().nextFrame(true);
                else if (windowMouseDiffY > 3) GetViewport().nextFrame(false);
            }
        }
    }
}

function scroll() {
    openChangeFile = true;
    toolEvt.onSwitch();
    toolEvt = new ScrollTool();
    /*if (BL_mode == 'scroll') {
    }*/
};


class ScrollBar {
    static selectedScrollBar = -1;
    static startPointY = -1;
    static endPointY = -1;
    static ShowOrHide = true;

    constructor(viewport) {
        this.viewport = viewport;
        this.total = 0;
        this.index = 0;
        this.width = 20;
        this.outerDIV = document.createElement("DIV");
        this.innerDIV = document.createElement("DIV");

        this.outerDIV.style.backgroundColor = "rgb(241,241,241)";
        this.innerDIV.style.backgroundColor = "rgb(193,193,193)";

        this.outerDIV.style.position = "absolute";
        this.innerDIV.style.position = "absolute";

        this.outerDIV.className = "ScrollBar"
        this.innerDIV.className = "ScrollBar"

        this.outerDIV.style.top = "0px";
        this.innerDIV.style.top = "0px";

        this.outerDIV.style.right = "0px";
        this.innerDIV.style.right = "0px";

        this.outerDIV.style.zIndex = "37";
        this.innerDIV.style.zIndex = "38";

        this.outerDIV.appendChild(this.innerDIV);
        this.viewport.appendChild(this.outerDIV);

        this.innerDIV.onmousedown = (e) => {
            ScrollBar.selectedScrollBar = this.viewport.viewportNum;
            e.stopPropagation();
        };
        this.innerDIV.ondblclick = (e) => { e.stopPropagation(); };
        this.outerDIV.onmousedown = (e) => { e.stopPropagation(); };
        this.outerDIV.ondblclick = (e) => { e.stopPropagation(); };

        this.reflesh();
    }
    setTotal(num) {
        this.total = num;
    }
    setIndex(num) {
        this.index = num;
    }
    reflesh() {
        if (ScrollBar.ShowOrHide == false) {
            this.outerDIV.style.display = "none";
            this.innerDIV.style.display = "none";
            document.documentElement.style.setProperty('--rightLabelPadding', `${rightLabelPadding}px`);
            return;
        } else {
            this.outerDIV.style.display = "";
            this.innerDIV.style.display = "";
        }
        this.outerDIV.style.width = this.width + "px";
        this.innerDIV.style.width = this.width + "px";

        this.outerDIV.style.height = "100%";//this.viewport.clientHeight + "px";
        if (this.total <= 1) this.innerDIV.style.height = "0%";//this.viewport.clientHeight + "px";
        else {
            this.innerDIV.style.height = this.total >= 100 ? "1%" : parseFloat(100 / this.total) + "%";
            this.innerDIV.style.top = ((((this.index) / this.total) * 100)) + "%";
        }

        //避免擋到Label
        document.documentElement.style.setProperty('--rightLabelPadding', `${this.width + rightLabelPadding}px`);
    }
}
onloadFunction.push(
    function () {
        getByid("b_Scroll").onclick = function () {
            if (this.enable == false) return;
            //BL_mode = 'scroll';
            hideAllDrawer();
            set_BL_model('scroll');
            scroll();
            drawBorder(this);
        }

        document.addEventListener("mousedown", (e) => {
            ScrollBar.startPointY = e.clientY;
        });

        document.addEventListener("mousemove", (e) => {
            var index = ScrollBar.selectedScrollBar;
            if (!(ScrollBar.selectedScrollBar >= 0)) return;

            var pointY = e.clientY - GetViewport().ScrollBar.outerDIV.getBoundingClientRect().y; //加上偏移
            //var NumOfBlocks = GetViewport(index).ScrollBar.outerDIV.clientHeight / GetViewport(index).ScrollBar.innerDIV.clientHeight; //一共多少格
            var targetGap = GetViewport(index).ScrollBar.outerDIV.clientHeight / GetViewport(index).ScrollBar.total; //動多少一格
            var nextFrame = parseInt((pointY + targetGap / 2) / targetGap);
            GetViewport(index).specifiedFrame(nextFrame, false);
        });

        document.addEventListener("mouseup", (e) => {
            ScrollBar.selectedScrollBar = -2;
        });
    });
