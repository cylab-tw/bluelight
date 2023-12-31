var contextmenuF = function (e) {
    e.preventDefault();
};

var touchstartF = function (e) {
    if (e.touches[1]) Touchstart(e.touches[0], e.touches[1]);
    else Touchstart(e.touches[0]);
};
var touchendF = function (e) {
    if (e.touches[1]) Touchend(e.touches[0], e.touches[1]);
    else Touchend(e.touches[0]);
};
var touchmoveF = function (e) {
    if (e.touches[1]) Touchmove(e.touches[0], e.touches[1]);
    else Touchmove(e.touches[0]);
};
var thisF = function () {
    getByid("WindowDefault").selected = true;
    for (var i = 0; i < Viewport_Total; i++) {
        if (i == this.viewportNum) {
            var viewportNum = viewportNumber;
            MeasureXY[0] = MeasureXY[1] = MeasureXY2[0] = MeasureXY2[1] = 0;
            viewportNumber = i;
            if (GetViewport().openPlay == false) {
                getByid('playvideo').src = '../image/icon/black/b_CinePlay.png';
            } else {
                getByid('playvideo').src = '../image/icon/black/b_CinePause.png';
            }
            changeMarkImg();
            //NowResize = true;
            //NowCanvasSizeWidth = NowCanvasSizeHeight = null;
            if (GetNewViewport().sop)
                loadAndViewImage(Patient.findSop(GetNewViewport().sop).imageId /*, null, null, viewportNumber*/);
            else {
                try {
                    loadAndViewImage(Patient.findSop(GetViewport(viewportNum).sop).imageId /*, null, null, viewportNumber*/);
                } catch (ex) { }
            }
            break;
        }
    }
}
window.addEventListener("keydown", function (e) {
    e = e || window.event;
    var nextInstanceNumber = 0;
    if (e.keyCode == '38') nextInstanceNumber = -1;
    else if (e.keyCode == '40') nextInstanceNumber = 1;
    else if (e.keyCode == '37') nextInstanceNumber = -1;
    else if (e.keyCode == '39') nextInstanceNumber = 1;
    if (!GetViewport() || nextInstanceNumber == 0) return;

    if (nextInstanceNumber == -1) {
        GetNewViewport().nextFrame(true);
    } else if (nextInstanceNumber = 1) {
        GetNewViewport().nextFrame(false);
    }
});

window.addEventListener('load', function () {
    var isWindowTop = false;
    var lastTouchY = 0;
    var touchStartHandler = function (e) {
        if (e.touches.length !== 1) return;
        lastTouchY = e.touches[0].clientY;
        isWindowTop = (window.pageYOffset === 0);
    };

    var touchMoveHandler = function (e) {
        var touchY = e.touches[0].clientY;
        var touchYmove = touchY - lastTouchY;
        lastTouchY = touchY;
        if (isWindowTop) {
            isWindowTop = false;
            // 阻擋移動事件
            if (touchYmove > 0) {
                e.preventDefault();
                return;
            }
        }

    };
    document.addEventListener('touchstart', touchStartHandler, false);
    document.addEventListener('touchmove', touchMoveHandler, false);
});

function Wheel(e) {
    if (openDisplayMarkup && (getByid("DICOMTagsSelect").selected || getByid("AIMSelect").selected)) return;
    //if (openPenDraw == true) return;
    getByid("MeasureLabel").style.display = "none";
    var viewportNum = viewportNumber;

    if (!(openWheel == true || openMouseTool == true || openChangeFile == true || openWindow == true || openZoom == true || openMeasure == true)) return;
    if (openLink == false) {
        if (e.deltaY < 0) GetNewViewport(viewportNum).nextFrame(true);
        else GetNewViewport(viewportNum).nextFrame(false);
    }
    else {
        for (var z = 0; z < Viewport_Total; z++) {
            if (e.deltaY < 0) GetNewViewport(z).nextFrame(true);
            else GetNewViewport(z).nextFrame(false);
        }
    }
}

function Mouseout(e) {
    magnifierDiv.hide();
}

interact('.LeftImgDiv').draggable({
    onmove(event) {
        if (!openLeftImgClick) return;
        dragQRLevel = event.target.QRLevel;
    }
})

interact('.MyDicomDiv').dropzone({
    accept: '.LeftImgDiv',
    ondropactivate: function (event) {
        event.target.classList.add('drop-active')
    },
    ondragenter: function (event) {
        var draggableElement = event.relatedTarget
        var dropzoneElement = event.target
        dropzoneElement.classList.add('drop-target')
        draggableElement.classList.add('can-drop')
    },
    ondragleave: function (event) {
        event.target.classList.remove('drop-target')
        event.relatedTarget.classList.remove('can-drop')
    },
    ondrop: function (event) {
        if (!openLeftImgClick) return;
        viewportNumber = parseInt(event.target.viewportNum);
        PictureOnclick(dragQRLevel);
    },
    ondropdeactivate: function (event) {
        event.target.classList.remove('drop-active')
        event.target.classList.remove('drop-target')
    }
})