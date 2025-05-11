//test version ! ! !
//test version ! ! !
//test version ! ! !

function initAutoOperation() {
    //if (!(location.search.includes("TrueSizeTest=true"))) return;
    var button = document.createElement('button');
    button.innerHTML = "test";
    button.onclick = AutoOperation;
    getByid("MarkStyleDiv").appendChild(button);
    VIEWPORT.AutoOperation = function (element, image, viewportNum) {
        if (!element.Sop || element.Sop.type == "img") return;
        if (!element.Sop.Image.data.string(Tag.ImageLaterality)) return;
        if (!element.AutoOperation) return;
        element.AutoOperation = undefined;

        var scaleFactor = ScaleToTrueSize(element.index);
        var ViewportWidth = element.div.offsetWidth;
        var ImgWidth = element.canvas.offsetWidth * scaleFactor, ImgLeft = element.canvas.offsetLeft;
        var distance = (ViewportWidth - ImgWidth) / 2;
        //console.log(element.index, scaleFactor, ViewportWidth, ImgWidth, distance)
        if (element.Sop.Image.data.string(Tag.ImageLaterality) == "L") element.translate.x = -distance;
        if (element.Sop.Image.data.string(Tag.ImageLaterality) == "R") element.translate.x = distance;

        //P,L or A,R
        if (element.Sop.Image.data.string(Tag.PatientOrientation)[0] == 'P' && element.Sop.Image.data.string(Tag.ImageLaterality) == "L") {
            element.HorizontalFlip = true;
            refleshCanvas(element);
        }
        if (element.Sop.Image.data.string(Tag.PatientOrientation)[0] == 'A' && element.Sop.Image.data.string(Tag.ImageLaterality) == "R") {
            element.HorizontalFlip = true;
            refleshCanvas(element);
        }
    }
    VIEWPORT.loadViewportList.push('AutoOperation');

    var span = document.createElement("SPAN");
    span.innerHTML = `<img class="innerimg" alt="autoLR" id="autoLR" onmouseover = "onElementOver(this);" onmouseleave = "onElementLeave();" src="../image/icon/lite/autoLR.png" width="50" height="50">;`;
    getByid("othereDIv").appendChild(document.createElement("BR"));
    getByid("othereDIv").appendChild(span);

    var span = document.createElement("SPAN");
    span.innerHTML = `<img class="innerimg" alt="autoL2R2" id="autoL2R2" onmouseover = "onElementOver(this);" onmouseleave = "onElementLeave();" src="../image/icon/lite/autoL2R2.png" width="50" height="50">;`;
    getByid("othereDIv").appendChild(document.createElement("BR"));
    getByid("othereDIv").appendChild(span);

    var span = document.createElement("SPAN");
    span.innerHTML = `<img class="innerimg" alt="autoLL" id="autoLL" onmouseover = "onElementOver(this);" onmouseleave = "onElementLeave();" src="../image/icon/lite/autoLL.png" width="50" height="50">;`;
    getByid("othereDIv").appendChild(document.createElement("BR"));
    getByid("othereDIv").appendChild(span);

    var span = document.createElement("SPAN");
    span.innerHTML = `<img class="innerimg" alt="autoRR" id="autoRR" onmouseover = "onElementOver(this);" onmouseleave = "onElementLeave();" src="../image/icon/lite/autoRR.png" width="50" height="50">;`;
    getByid("othereDIv").appendChild(document.createElement("BR"));
    getByid("othereDIv").appendChild(span);

}
initAutoOperation();

getByid("autoLR").onclick = function () {
    if (getByid("ScrollBarSelectHide").selected != true) {
        getByid("ScrollBarSelectHide").selected = true;
        getByid("ScrollBarSelect").onchange();
    }
    Viewport_col = 2; Viewport_row = 1;
    if (viewportNumber >= Viewport_row * Viewport_col) viewportNumber = 0;
    BlueLightViewPort.only1Viewport = -1;
    SetTable();
    EnterRWD();
    GetViewport(0).clear(); GetViewport(1).clear(); GetViewport(2).clear(); GetViewport(3).clear();
    GetViewport(0).AutoOperation = true; GetViewport(1).AutoOperation = true; GetViewport(2).AutoOperation = true; GetViewport(3).AutoOperation = true;
    if (ImageManager.Study[0].Series.length == 4) {
        for (var Series of ImageManager.Study[0].Series) {
            if (Series.Sop[0].Image.data.string(Tag.ViewPosition) == "CC" || (!Series.Sop[0].Image.data.string(Tag.ViewPosition) && ("" + Series.Sop[0].Image.data.string(Tag.PatientOrientation)).includes("F"))) {
                if (Series.Sop[0].Image.data.string(Tag.ImageLaterality) == "L") GetViewport(1).loadImgBySop(Series.Sop[0]);
                if (Series.Sop[0].Image.data.string(Tag.ImageLaterality) == "R") GetViewport(0).loadImgBySop(Series.Sop[0]);
            }
        }
    } else if (ImageManager.Study[0].Series[0].Sop.length == 4) {
        for (var Sop of ImageManager.Study[0].Series[0].Sop) {
            if (Sop.Image.data.string(Tag.ViewPosition) == "CC" || (!Sop.Image.data.string(Tag.ViewPosition) && ("" + Sop.Image.data.string(Tag.PatientOrientation)).includes("F"))) {
                if (Sop.Image.data.string(Tag.ImageLaterality) == "L") GetViewport(1).loadImgBySop(Sop);
                if (Sop.Image.data.string(Tag.ImageLaterality) == "R") GetViewport(0).loadImgBySop(Sop);
            }
        }
    }
}


getByid("autoL2R2").onclick = function () {
    if (getByid("ScrollBarSelectHide").selected != true) {
        getByid("ScrollBarSelectHide").selected = true;
        getByid("ScrollBarSelect").onchange();
    }
    Viewport_col = 2; Viewport_row = 1;
    if (viewportNumber >= Viewport_row * Viewport_col) viewportNumber = 0;
    BlueLightViewPort.only1Viewport = -1;
    SetTable();
    EnterRWD();
    GetViewport(0).clear(); GetViewport(1).clear(); GetViewport(2).clear(); GetViewport(3).clear();
    GetViewport(0).AutoOperation = true; GetViewport(1).AutoOperation = true; GetViewport(2).AutoOperation = true; GetViewport(3).AutoOperation = true;
    if (ImageManager.Study[0].Series.length == 4) {
        for (var Series of ImageManager.Study[0].Series) {
            if (Series.Sop[0].Image.data.string(Tag.ViewPosition) == "MLO" || (!Series.Sop[0].Image.data.string(Tag.ViewPosition) && !("" + Series.Sop[0].Image.data.string(Tag.PatientOrientation)).includes("F"))) {
                if (Series.Sop[0].Image.data.string(Tag.ImageLaterality) == "L") GetViewport(1).loadImgBySop(Series.Sop[0]);
                if (Series.Sop[0].Image.data.string(Tag.ImageLaterality) == "R") GetViewport(0).loadImgBySop(Series.Sop[0]);
            }
        }
    } else if (ImageManager.Study[0].Series[0].Sop.length == 4) {
        for (var Sop of ImageManager.Study[0].Series[0].Sop) {
            if (Sop.Image.data.string(Tag.ViewPosition) == "MLO" || (!Sop.Image.data.string(Tag.ViewPosition) && !("" + Sop.Image.data.string(Tag.PatientOrientation)).includes("F"))) {
                if (Sop.Image.data.string(Tag.ImageLaterality) == "L") GetViewport(1).loadImgBySop(Sop);
                if (Sop.Image.data.string(Tag.ImageLaterality) == "R") GetViewport(0).loadImgBySop(Sop);
            }
        }
    }
}

getByid("autoLL").onclick = function () {
    if (getByid("ScrollBarSelectHide").selected != true) {
        getByid("ScrollBarSelectHide").selected = true;
        getByid("ScrollBarSelect").onchange();
    }
    Viewport_col = 2; Viewport_row = 1;
    if (viewportNumber >= Viewport_row * Viewport_col) viewportNumber = 0;
    BlueLightViewPort.only1Viewport = -1;
    SetTable();
    EnterRWD();
    GetViewport(0).clear(); GetViewport(1).clear(); GetViewport(2).clear(); GetViewport(3).clear();
    GetViewport(0).AutoOperation = true; GetViewport(1).AutoOperation = true; GetViewport(2).AutoOperation = true; GetViewport(3).AutoOperation = true;
    if (ImageManager.Study[0].Series.length == 4) {
        for (var Series of ImageManager.Study[0].Series) {
            if (Series.Sop[0].Image.data.string(Tag.ViewPosition) == "CC" || (!Series.Sop[0].Image.data.string(Tag.ViewPosition) && ("" + Series.Sop[0].Image.data.string(Tag.PatientOrientation)).includes("F"))) {
                if (Series.Sop[0].Image.data.string(Tag.ImageLaterality) == "L") GetViewport(0).loadImgBySop(Series.Sop[0]);
            }
            if (Series.Sop[0].Image.data.string(Tag.ViewPosition) == "MLO" || (!Series.Sop[0].Image.data.string(Tag.ViewPosition) && !("" + Series.Sop[0].Image.data.string(Tag.PatientOrientation)).includes("F"))) {
                if (Series.Sop[0].Image.data.string(Tag.ImageLaterality) == "L") GetViewport(1).loadImgBySop(Series.Sop[0]);
            }
        }
    } else if (ImageManager.Study[0].Series[0].Sop.length == 4) {
        for (var Sop of ImageManager.Study[0].Series[0].Sop) {
            if (Sop.Image.data.string(Tag.ViewPosition) == "CC" || (!Sop.Image.data.string(Tag.ViewPosition) && ("" + Sop.Image.data.string(Tag.PatientOrientation)).includes("F"))) {
                if (Sop.Image.data.string(Tag.ImageLaterality) == "L") GetViewport(0).loadImgBySop(Sop);
            }
            if (Sop.Image.data.string(Tag.ViewPosition) == "MLO" || (!Sop.Image.data.string(Tag.ViewPosition) && !("" + Sop.Image.data.string(Tag.PatientOrientation)).includes("F"))) {
                if (Sop.Image.data.string(Tag.ImageLaterality) == "L") GetViewport(1).loadImgBySop(Sop);
            }
        }
    }
}

getByid("autoRR").onclick = function () {
    if (getByid("ScrollBarSelectHide").selected != true) {
        getByid("ScrollBarSelectHide").selected = true;
        getByid("ScrollBarSelect").onchange();
    }
    Viewport_col = 2; Viewport_row = 1;
    if (viewportNumber >= Viewport_row * Viewport_col) viewportNumber = 0;
    BlueLightViewPort.only1Viewport = -1;
    SetTable();
    EnterRWD();
    GetViewport(0).clear(); GetViewport(1).clear(); GetViewport(2).clear(); GetViewport(3).clear();
    GetViewport(0).AutoOperation = true; GetViewport(1).AutoOperation = true; GetViewport(2).AutoOperation = true; GetViewport(3).AutoOperation = true;
    if (ImageManager.Study[0].Series.length == 4) {
        for (var Series of ImageManager.Study[0].Series) {
            if (Series.Sop[0].Image.data.string(Tag.ViewPosition) == "CC" || (!Series.Sop[0].Image.data.string(Tag.ViewPosition) && ("" + Series.Sop[0].Image.data.string(Tag.PatientOrientation)).includes("F"))) {
                if (Series.Sop[0].Image.data.string(Tag.ImageLaterality) == "R") GetViewport(0).loadImgBySop(Series.Sop[0]);
            }
            if (Series.Sop[0].Image.data.string(Tag.ViewPosition) == "MLO" || (!Series.Sop[0].Image.data.string(Tag.ViewPosition) && !("" + Series.Sop[0].Image.data.string(Tag.PatientOrientation)).includes("F"))) {
                if (Series.Sop[0].Image.data.string(Tag.ImageLaterality) == "R") GetViewport(1).loadImgBySop(Series.Sop[0]);
            }
        }
    } else if (ImageManager.Study[0].Series[0].Sop.length == 4) {
        for (var Sop of ImageManager.Study[0].Series[0].Sop) {
            if (Sop.Image.data.string(Tag.ViewPosition) == "CC" || (!Sop.Image.data.string(Tag.ViewPosition) && ("" + Sop.Image.data.string(Tag.PatientOrientation)).includes("F"))) {
                if (Sop.Image.data.string(Tag.ImageLaterality) == "R") GetViewport(0).loadImgBySop(Sop);
            }
            if (Sop.Image.data.string(Tag.ViewPosition) == "MLO" || (!Sop.Image.data.string(Tag.ViewPosition) && !("" + Sop.Image.data.string(Tag.PatientOrientation)).includes("F"))) {
                if (Sop.Image.data.string(Tag.ImageLaterality) == "R") GetViewport(1).loadImgBySop(Sop);
            }
        }
    }
}

function AutoOperation() {
    //if (ImageManager.Study[0].Series.length == 4) 
    {
        if (getByid("ScrollBarSelectHide").selected != true) {
            getByid("ScrollBarSelectHide").selected = true;
            getByid("ScrollBarSelect").onchange();
        }

        if (ImageManager.Study.length == 2) {
            Viewport_col = 4; Viewport_row = 2;
            if (viewportNumber >= Viewport_row * Viewport_col) viewportNumber = 0;
            BlueLightViewPort.only1Viewport = -1;
            SetTable();
            EnterRWD();

            GetViewport(0).clear(); GetViewport(1).clear(); GetViewport(2).clear(); GetViewport(3).clear();
            GetViewport(4).clear(); GetViewport(5).clear(); GetViewport(6).clear(); GetViewport(7).clear();
            GetViewport(0).AutoOperation = true; GetViewport(1).AutoOperation = true; GetViewport(2).AutoOperation = true; GetViewport(3).AutoOperation = true;
            GetViewport(4).AutoOperation = true; GetViewport(5).AutoOperation = true; GetViewport(6).AutoOperation = true; GetViewport(7).AutoOperation = true;

            if (ImageManager.Study[0].Series.length == 4) {
                for (var Series of ImageManager.Study[0].Series) {
                    if (Series.Sop[0].Image.data.string(Tag.ViewPosition) == "CC" || (!Series.Sop[0].Image.data.string(Tag.ViewPosition) && ("" + Series.Sop[0].Image.data.string(Tag.PatientOrientation)).includes("F"))) {
                        if (Series.Sop[0].Image.data.string(Tag.ImageLaterality) == "L") GetViewport(1).loadImgBySop(Series.Sop[0]);
                        if (Series.Sop[0].Image.data.string(Tag.ImageLaterality) == "R") GetViewport(0).loadImgBySop(Series.Sop[0]);
                    }
                    else if (Series.Sop[0].Image.data.string(Tag.ViewPosition) == "MLO" || (!Series.Sop[0].Image.data.string(Tag.ViewPosition) && !("" + Series.Sop[0].Image.data.string(Tag.PatientOrientation)).includes("F"))) {
                        if (Series.Sop[0].Image.data.string(Tag.ImageLaterality) == "L") GetViewport(3).loadImgBySop(Series.Sop[0]);
                        if (Series.Sop[0].Image.data.string(Tag.ImageLaterality) == "R") GetViewport(2).loadImgBySop(Series.Sop[0]);
                    }
                }
            }
            else if (ImageManager.Study[0].Series[0].Sop.length == 4) {
                for (var Sop of ImageManager.Study[0].Series[0].Sop) {
                    if (Sop.Image.data.string(Tag.ViewPosition) == "CC" || (!Sop.Image.data.string(Tag.ViewPosition) && "" + Sop.Image.data.string(Tag.PatientOrientation)).includes("F")) {
                        if (Sop.Image.data.string(Tag.ImageLaterality) == "L") GetViewport(1).loadImgBySop(Sop);
                        if (Sop.Image.data.string(Tag.ImageLaterality) == "R") GetViewport(0).loadImgBySop(Sop);
                    }
                    else if (Sop.Image.data.string(Tag.ViewPosition) == "MLO" || (!Sop.Image.data.string(Tag.ViewPosition) && !("" + Sop.Image.data.string(Tag.PatientOrientation)).includes("F"))) {
                        if (Sop.Image.data.string(Tag.ImageLaterality) == "L") GetViewport(3).loadImgBySop(Sop);
                        if (Sop.Image.data.string(Tag.ImageLaterality) == "R") GetViewport(2).loadImgBySop(Sop);
                    }
                }
            }

            if (ImageManager.Study[1].Series.length == 4) {
                for (var Series of ImageManager.Study[1].Series) {
                    if (Series.Sop[0].Image.data.string(Tag.ViewPosition) == "CC" || (!Series.Sop[0].Image.data.string(Tag.ViewPosition) && ("" + Series.Sop[0].Image.data.string(Tag.PatientOrientation)).includes("F"))) {
                        if (Series.Sop[0].Image.data.string(Tag.ImageLaterality) == "L") GetViewport(5).loadImgBySop(Series.Sop[0]);
                        if (Series.Sop[0].Image.data.string(Tag.ImageLaterality) == "R") GetViewport(4).loadImgBySop(Series.Sop[0]);
                    }
                    else if (Series.Sop[0].Image.data.string(Tag.ViewPosition) == "MLO" || (!Series.Sop[0].Image.data.string(Tag.ViewPosition) && !("" + Series.Sop[0].Image.data.string(Tag.PatientOrientation)).includes("F"))) {
                        if (Series.Sop[0].Image.data.string(Tag.ImageLaterality) == "L") GetViewport(7).loadImgBySop(Series.Sop[0]);
                        if (Series.Sop[0].Image.data.string(Tag.ImageLaterality) == "R") GetViewport(6).loadImgBySop(Series.Sop[0]);
                    }
                }
            }
            else if (ImageManager.Study[1].Series[0].Sop.length == 4) {
                for (var Sop of ImageManager.Study[1].Series[0].Sop) {
                    if (Sop.Image.data.string(Tag.ViewPosition) == "CC" || (!Sop.Image.data.string(Tag.ViewPosition) && ("" + Sop.Image.data.string(Tag.PatientOrientation)).includes("F"))) {
                        if (Sop.Image.data.string(Tag.ImageLaterality) == "L") GetViewport(5).loadImgBySop(Sop);
                        if (Sop.Image.data.string(Tag.ImageLaterality) == "R") GetViewport(4).loadImgBySop(Sop);
                    }
                    else if (Sop.Image.data.string(Tag.ViewPosition) == "MLO" || (!Sop.Image.data.string(Tag.ViewPosition) && !("" + Sop.Image.data.string(Tag.PatientOrientation)).includes("F"))) {
                        if (Sop.Image.data.string(Tag.ImageLaterality) == "L") GetViewport(7).loadImgBySop(Sop);
                        if (Sop.Image.data.string(Tag.ImageLaterality) == "R") GetViewport(6).loadImgBySop(Sop);
                    }
                }
            }
        } else {
            if (ImageManager.Study[0].Series.length == 4) {
                Viewport_col = Viewport_row = 2;
                if (viewportNumber >= Viewport_row * Viewport_col) viewportNumber = 0;
                BlueLightViewPort.only1Viewport = -1;
                SetTable();
                EnterRWD();

                GetViewport(0).clear(); GetViewport(1).clear(); GetViewport(2).clear(); GetViewport(3).clear();
                GetViewport(0).AutoOperation = true; GetViewport(1).AutoOperation = true; GetViewport(2).AutoOperation = true; GetViewport(3).AutoOperation = true;

                for (var Series of ImageManager.Study[0].Series) {
                    if (Series.Sop[0].Image.data.string(Tag.ViewPosition) == "CC" || (!Series.Sop[0].Image.data.string(Tag.ViewPosition) && ("" + Series.Sop[0].Image.data.string(Tag.PatientOrientation)).includes("F"))) {
                        if (Series.Sop[0].Image.data.string(Tag.ImageLaterality) == "L") GetViewport(1).loadImgBySop(Series.Sop[0]);
                        if (Series.Sop[0].Image.data.string(Tag.ImageLaterality) == "R") GetViewport(0).loadImgBySop(Series.Sop[0]);
                    }
                    else if (Series.Sop[0].Image.data.string(Tag.ViewPosition) == "MLO" || (!Series.Sop[0].Image.data.string(Tag.ViewPosition) && !("" + Series.Sop[0].Image.data.string(Tag.PatientOrientation)).includes("F"))) {
                        if (Series.Sop[0].Image.data.string(Tag.ImageLaterality) == "L") GetViewport(3).loadImgBySop(Series.Sop[0]);
                        if (Series.Sop[0].Image.data.string(Tag.ImageLaterality) == "R") GetViewport(2).loadImgBySop(Series.Sop[0]);
                    }
                }
            }
            else if (ImageManager.Study[0].Series[0].Sop.length == 4) {
                Viewport_col = Viewport_row = 2;
                if (viewportNumber >= Viewport_row * Viewport_col) viewportNumber = 0;
                BlueLightViewPort.only1Viewport = -1;
                SetTable();
                EnterRWD();

                GetViewport(0).clear(); GetViewport(1).clear(); GetViewport(2).clear(); GetViewport(3).clear();
                GetViewport(0).AutoOperation = true; GetViewport(1).AutoOperation = true; GetViewport(2).AutoOperation = true; GetViewport(3).AutoOperation = true;

                for (var Sop of ImageManager.Study[0].Series[0].Sop) {
                    if (Sop.Image.data.string(Tag.ViewPosition) == "CC" || (!Sop.Image.data.string(Tag.ViewPosition) && ("" + Sop.Image.data.string(Tag.PatientOrientation)).includes("F"))) {
                        if (Sop.Image.data.string(Tag.ImageLaterality) == "L") GetViewport(1).loadImgBySop(Sop);
                        if (Sop.Image.data.string(Tag.ImageLaterality) == "R") GetViewport(0).loadImgBySop(Sop);
                    }
                    else if (Sop.Image.data.string(Tag.ViewPosition) == "MLO" || (!Sop.Image.data.string(Tag.ViewPosition) && !("" + Sop.Image.data.string(Tag.PatientOrientation)).includes("F"))) {
                        if (Sop.Image.data.string(Tag.ImageLaterality) == "L") GetViewport(3).loadImgBySop(Sop);
                        if (Sop.Image.data.string(Tag.ImageLaterality) == "R") GetViewport(2).loadImgBySop(Sop);
                    }
                }
            }
            else if (ImageManager.Study[0].Series[0].Sop.length == 2) {
                Viewport_col = 2; Viewport_row = 1;
                if (viewportNumber >= Viewport_row * Viewport_col) viewportNumber = 0;
                BlueLightViewPort.only1Viewport = -1;
                SetTable();
                EnterRWD();

                GetViewport(0).clear(); GetViewport(1).clear();
                GetViewport(0).AutoOperation = true; GetViewport(1).AutoOperation = true;

                for (var Sop of ImageManager.Study[0].Series[0].Sop) {
                    if (Sop.Image.data.string(Tag.ImageLaterality) == "L") GetViewport(1).loadImgBySop(Sop);
                    if (Sop.Image.data.string(Tag.ImageLaterality) == "R") GetViewport(0).loadImgBySop(Sop);
                }
            }
        }
    }
}
