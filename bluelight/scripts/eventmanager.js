//暫時移除的功能
var openPenDraw = false;

var contextmenuF = function (e) {
    e.preventDefault();
};

var thisF = function () {
    getByid("WindowDefault").selected = true;

    var viewportNum = viewportNumber;

    viewportNumber = isNaN(this.viewportNum) ? viewportNumber : this.viewportNum;
    leftLayout.setAccent(GetViewport().series);
    if (GetViewport().cine) getByid('playvideo').src = '../image/icon/black/b_CinePause.png';
    else getByid('playvideo').src = '../image/icon/black/b_CinePlay.png';

    changeMarkImg();
    if (GetViewport().sop) setSopToViewport(GetViewport().sop);
    //loadAndViewImage(Patient.findSop(GetViewport().sop).imageId /*, null, null, viewportNumber*/);
    else {
        try {
            setSopToViewport(GetViewport(viewportNum).sop);
            //loadAndViewImage(Patient.findSop(GetViewport(viewportNum).sop).imageId /*, null, null, viewportNumber*/);
        } catch (ex) { }
    }
    refleshGUI();
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
        GetViewport().nextFrame(true);
    } else if (nextInstanceNumber = 1) {
        GetViewport().nextFrame(false);
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
    var viewportNum = viewportNumber;

    if (!(openWheel == true || openMouseTool == true || openChangeFile == true || openWindow == true || openZoom == true || openMeasure == true)) return;
    if (openLink == false) {
        if (e.deltaY < 0) GetViewport(viewportNum).nextFrame(true);
        else GetViewport(viewportNum).nextFrame(false);
    }
    else {
        for (var z = 0; z < Viewport_Total; z++) {
            //if (parseInt(GetViewport(z).div.style.height) <= 1) continue;
            if (e.deltaY < 0) GetViewport(z).nextFrame(true);
            else GetViewport(z).nextFrame(false);
        }
    }
    if(openZoom){
        var angle2point = rotateCalculation(e);
        magnifierIng(angle2point[0], angle2point[1]);
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