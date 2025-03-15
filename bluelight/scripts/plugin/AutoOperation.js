//test version ! ! !
//test version ! ! !
//test version ! ! !

function initAutoOperation() {
    if (!(location.search.includes("TrueSizeTest=true"))) return;
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
        console.log(element.index, scaleFactor, ViewportWidth, ImgWidth, distance)
        if (element.Sop.Image.data.string(Tag.ViewPosition) == "CC") {
            if (element.Sop.Image.data.string(Tag.ImageLaterality) == "L") element.translate.x = -distance;
            if (element.Sop.Image.data.string(Tag.ImageLaterality) == "R") element.translate.x = distance;
        }
        else if (element.Sop.Image.data.string(Tag.ViewPosition) == "MLO") {
            if (element.Sop.Image.data.string(Tag.ImageLaterality) == "L") element.translate.x = -distance;
            if (element.Sop.Image.data.string(Tag.ImageLaterality) == "R") element.translate.x = distance;
        }
    }
    VIEWPORT.loadViewportList.push('AutoOperation');
}
initAutoOperation();

function AutoOperation() {
    if (ImageManager.Study[0].Series.length == 4) {

        if (getByid("ScrollBarSelectHide").selected != true) {
            getByid("ScrollBarSelectHide").selected = true;
            getByid("ScrollBarSelect").onchange();
        }

        Viewport_col = Viewport_row = 2;
        if (viewportNumber >= Viewport_row * Viewport_col) viewportNumber = 0;
        BlueLightViewPort.only1Viewport = -1;
        SetTable();
        window.onresize();

        if (ImageManager.Study[0].Series.length == 4) {
            GetViewport(0).AutoOperation = true; GetViewport(1).AutoOperation = true; GetViewport(2).AutoOperation = true; GetViewport(3).AutoOperation = true;

            for (var Series of ImageManager.Study[0].Series) {
                if (Series.Sop[0].Image.data.string(Tag.ViewPosition) == "CC") {
                    if (Series.Sop[0].Image.data.string(Tag.ImageLaterality) == "L") GetViewport(1).loadImgBySop(Series.Sop[0]);
                    if (Series.Sop[0].Image.data.string(Tag.ImageLaterality) == "R") GetViewport(0).loadImgBySop(Series.Sop[0]);
                }
                if (Series.Sop[0].Image.data.string(Tag.ViewPosition) == "MLO") {
                    if (Series.Sop[0].Image.data.string(Tag.ImageLaterality) == "L") GetViewport(3).loadImgBySop(Series.Sop[0]);
                    if (Series.Sop[0].Image.data.string(Tag.ImageLaterality) == "R") GetViewport(2).loadImgBySop(Series.Sop[0]);
                }
            }
        }
        else if (ImageManager.Study[0].Series[0].Sop.length == 4) {
            GetViewport(0).AutoOperation = true; GetViewport(1).AutoOperation = true; GetViewport(2).AutoOperation = true; GetViewport(3).AutoOperation = true;

            for (var Sop of ImageManager.Study[0].Series[0].Sop) {
                if (Sop.Image.data.string(Tag.ViewPosition) == "CC") {
                    if (Sop.Image.data.string(Tag.ImageLaterality) == "L") GetViewport(1).loadImgBySop(Sop);
                    if (Sop.Image.data.string(Tag.ImageLaterality) == "R") GetViewport(0).loadImgBySop(Sop);
                }
                if (Sop.Image.data.string(Tag.ViewPosition) == "MLO") {
                    if (Sop.Image.data.string(Tag.ImageLaterality) == "L") GetViewport(3).loadImgBySop(Sop);
                    if (Sop.Image.data.string(Tag.ImageLaterality) == "R") GetViewport(2).loadImgBySop(Sop);
                }
            }
        }
    }
}
