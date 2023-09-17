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
        if ("MyDicomDiv" + (i) == "" + this.id) {
            var viewportNum = viewportNumber;
            MeasureXY[0] = MeasureXY[1] = MeasureXY2[0] = MeasureXY2[1] = 0;
            viewportNumber = i;
            if (GetViewport().openPlay == false) {
                getByid('playvideo').src = '../image/icon/black/b_CinePlay.png';
            } else {
                getByid('playvideo').src = '../image/icon/black/b_CinePause.png';
            }
            changeMarkImg();
            var sop = GetViewport().sop;
            var uid = SearchUid2Json(sop);
            //NowResize = true;
            //NowCanvasSizeWidth = NowCanvasSizeHeight = null;
            if (uid)
                loadAndViewImage(Patient.Study[uid.studyuid].Series[uid.sreiesuid].Sop[uid.sopuid].imageId /*, null, null, viewportNumber*/);
            else {
                sop = GetViewport(viewportNum).sop;
                uid = SearchUid2Json(sop);
                try {
                    loadAndViewImage(Patient.Study[uid.studyuid].Series[uid.sreiesuid].Sop[uid.sopuid].imageId /*, null, null, viewportNumber*/);
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
    var sop = GetViewport().sop;
    let index = SearchUid2Index(sop);

    let i = index[0],
        j = index[1],
        k = index[2];
    var Onum = parseInt(Patient.Study[i].Series[j].Sop[k].InstanceNumber);
    var list = sortInstance(sop);
    for (l = 0; l < list.length; l++) {
        if (list[l].InstanceNumber == Onum) {
            break;
        }
    }
    if (nextInstanceNumber == -1) {
        nextFrame(viewportNumber, -1);
        if (l - 1 < 0) nextInstanceNumber = list.length - 1;
        else nextInstanceNumber = l - 1;
    } else if (nextInstanceNumber = 1) {
        nextFrame(viewportNumber, 1);
        if (list[l].InstanceNumber == Onum) {
            if (l + 1 >= list.length) nextInstanceNumber = 0;
            else nextInstanceNumber = l + 1;
        }
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
    var viewport = GetViewport(), canvas = viewport.canvas();
    var nextInstanceNumber = 0;
    var nextFramesNumber = 0;
    var break1 = false;
    var viewportNum = viewportNumber;

    for (var z = 0; z < Viewport_Total; z++) {
        var break1 = false;
        if (openLink == true) viewportNum = z;
        if (openWheel == true || openMouseTool == true || openChangeFile == true || openWindow == true || openZoom == true || openMeasure == true) {
            var currX1 = (e.pageX - canvas.getBoundingClientRect().left - GetViewport().newMousePointX - 100) * (GetViewport().imageWidth / parseInt(GetViewport().canvas().style.width));
            var currY1 = (e.pageY - canvas.getBoundingClientRect().top - GetViewport().newMousePointY - 100) * (GetViewport().imageHeight / parseInt(GetViewport().canvas().style.height));
            var sop = GetViewport(viewportNum).sop;
            try { var [i, j, k] = SearchUid2Index(viewport.sop) } catch (ex) { return; }
            /*let index = SearchUid2Index(sop);
            if (!index) continue;
            let i = index[0],
                j = index[1],
                k = index[2];*/
            var Onum = parseInt(Patient.Study[i].Series[j].Sop[k].InstanceNumber);
            var list = sortInstance(sop);
            if (list.length == 0) continue;
            if (list.length == 1 && !list[0].frames) continue;
            if (list.length == 1 && list[0].frames) {
                if (GetViewport(viewportNum).framesNumber == undefined) GetViewport(viewportNum).framesNumber = 0;
                if (e.deltaY < 0) {
                    for (var l = 0; l < list[0].frames.length; l++) {
                        if (break1 == true) break;
                        if (l == GetViewport(viewportNum).framesNumber) {
                            if (l - 1 < 0) {
                                loadAndViewImage(list[0].imageId, viewportNum, list[0].frames.length - 1);
                                nextFramesNumber = list[0].frames.length - 1;
                                break1 = true;
                                break;
                            }
                            loadAndViewImage(list[0].imageId, viewportNum, l - 1);
                            nextFramesNumber = l - 1;
                            break1 = true;
                            break;
                        }
                    }
                } else {
                    for (var l = 0; l < list[0].frames.length; l++) {
                        if (break1 == true) break;
                        if (l == GetViewport(viewportNum).framesNumber) {
                            if (l + 1 >= list[0].frames.length) {
                                loadAndViewImage(list[0].imageId, viewportNum, 0);
                                nextFramesNumber = 0;
                                break1 = true;
                                break;
                            }
                            loadAndViewImage(list[0].imageId, viewportNum, l + 1);
                            nextFramesNumber = l + 1;
                            break1 = true;
                            break;
                        }
                    }
                }
            } else {
                if (e.deltaY < 0) {
                    for (var l = 0; l < list.length; l++) {
                        if (break1 == true) break;
                        if (list[l].InstanceNumber == Onum) {
                            if (l - 1 < 0) {
                                loadAndViewImage(list[list.length - 1].imageId, viewportNum);
                                nextInstanceNumber = list.length - 1;
                                break1 = true;
                                break;
                            }
                            loadAndViewImage(list[l - 1].imageId, viewportNum);
                            nextInstanceNumber = l - 1;
                            break1 = true;
                            break;
                        }
                    }
                } else {
                    for (var l = 0; l < list.length; l++) {
                        if (break1 == true) break;
                        if (list[l].InstanceNumber == Onum) {
                            if (l + 1 >= list.length) {
                                loadAndViewImage(list[0].imageId, viewportNum);
                                nextInstanceNumber = 0;
                                break1 = true;
                                break;
                            }
                            loadAndViewImage(list[l + 1].imageId, viewportNum);
                            nextInstanceNumber = l + 1;
                            break1 = true;
                            break;
                        }
                    }
                }
            }
        }
        if (openLink == false)
            break;
    }
}

function Mouseout(e) {
    magnifierDiv.style.display = "none";
}

interact('.LeftImg').draggable({
    onmove(event) {
        if (!openLeftImgClick) return;
        dragseries = event.target.series;
    }
})

interact('.MyDicomDiv').dropzone({
    accept: '.LeftImg',
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
        PictureOnclick(dragseries);
    },
    ondropdeactivate: function (event) {
        event.target.classList.remove('drop-active')
        event.target.classList.remove('drop-target')
    }
})