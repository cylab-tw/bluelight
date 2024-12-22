
var openAnatomicalPlane = false;

function loadAnatomicalPlane() {
    if (location.search.includes("AnatomicalPlaneTest=true")) {
        openAnatomicalPlane = true;
        PLUGIN.PushMarkList(drawAnatomicalPlane);

        VIEWPORT.drawAnatomicalPlane = function (element, image, viewportNum) {
            if (!element.Sop || element.Sop.type == "img") return;
            
            removeAnatomicalPlaneMark();
            for (var z = 0; z < Viewport_Total; z++) {
                if (z == viewportNum) continue;
                if (GetViewport(z).tags.FrameOfReferenceUID != element.tags.FrameOfReferenceUID) continue;
                if (!GetViewport(z).content.image.AnatomicalPlane) continue;
                if (GetViewport(z).content.image.AnatomicalPlane == element.content.image.AnatomicalPlane) continue;
                var MeasureMark = new BlueLightMark();
                MeasureMark.hideName = MeasureMark.showName = "AnatomicalPlane";
                MeasureMark.setQRLevels(GetViewport(z).QRLevels);
                MeasureMark.type = "AnatomicalPlane";
                PatientMark.push(MeasureMark);
                refreshMarkFromSop(GetViewport(z).sop);
                displayMark(z);
            }
        }
        VIEWPORT.loadViewportList.push('drawAnatomicalPlane');
    }
}

function removeAnatomicalPlaneMark() {
    for (var mark of PatientMark) {
        if (mark.type == 'AnatomicalPlane') {
            PatientMark.splice(PatientMark.indexOf(mark), 1);
        }
    }
    refreshMarkFromSop(GetViewport().sop);
}

function drawAnatomicalPlane(obj) {
    var viewport = obj.viewport;
    if (!openAnatomicalPlane) return;

    var SelectedViewport = GetViewport();
    var element = SelectedViewport;
    if (viewport == SelectedViewport) return;
    
    try {
        if (!SelectedViewport.content.image.AnatomicalPlane) return;
        if (!SelectedViewport.tags.FrameOfReferenceUID) return;
        
        var z = viewport.index;
        //for (var z = 0; z < Viewport_Total; z++) {
        if (z == viewportNumber) return;
        if (GetViewport(z).tags.FrameOfReferenceUID != SelectedViewport.tags.FrameOfReferenceUID) return;
        if (!GetViewport(z).content.image.AnatomicalPlane) return;
        if (GetViewport(z).content.image.AnatomicalPlane == SelectedViewport.content.image.AnatomicalPlane) return;
        var corners = [
            [0, 0, GetViewport(z).content.image.RCS.matrix[2][3]],        // 左上角
            [GetViewport(z).content.image.width, 0, GetViewport(z).content.image.RCS.matrix[2][3]],      // 右上角
            [0, GetViewport(z).content.image.height, GetViewport(z).content.image.RCS.matrix[2][3]],      // 左下角
            [GetViewport(z).content.image.width, GetViewport(z).content.image.height, GetViewport(z).content.image.RCS.matrix[2][3]]     // 右下角
        ];
        var transCor = corners.map(corner => Matrix4x4.applyMatrixToCoordinate(GetViewport(z).content.image.RCS.matrix, corner));
        var transCor = transCor.map(corner => Matrix4x4.applyMatrixToCoordinate(GetViewport().content.image.RCS.matrix, corner));

        var x = 0, y = 0, offsetX = 0, offsetY = 0, invertX = 1, invertY = 1;
        //GetViewport(z).clearRect();

        if (element.content.image.AnatomicalPlane === 'Sagittal' && GetViewport(z).content.image.AnatomicalPlane == 'Axial') {
            [x, y] = [0, 2];
            [offsetX, offsetY] = [GetViewport(z).content.image.width / 2, 0];
        }
        else if (element.content.image.AnatomicalPlane === 'Sagittal' && GetViewport(z).content.image.AnatomicalPlane == 'Coronal') {
            [x, y] = [0, 1];
            [offsetX, offsetY] = [GetViewport(z).content.image.width / 2, GetViewport(z).content.image.height];
        }
        else if (element.content.image.AnatomicalPlane === 'Axial' && GetViewport(z).content.image.AnatomicalPlane == 'Sagittal') {
            [x, y] = [1, 2];
            [offsetX, offsetY] = [GetViewport(z).content.image.width, GetViewport(z).content.image.height / 2];
            invertY = -1;
        }
        else if (element.content.image.AnatomicalPlane === 'Axial' && GetViewport(z).content.image.AnatomicalPlane == 'Coronal') {
            [x, y] = [0, 2];
            [offsetX, offsetY] = [GetViewport(z).content.image.width, GetViewport(z).content.image.height / 2];
            invertY = -1;
        }
        else if (element.content.image.AnatomicalPlane === 'Coronal' && GetViewport(z).content.image.AnatomicalPlane == 'Axial') {
            [x, y] = [2, 1];
            [offsetX, offsetY] = [0, GetViewport(z).content.image.height / 2];
        }
        else if (element.content.image.AnatomicalPlane === 'Coronal' && GetViewport(z).content.image.AnatomicalPlane == 'Sagittal') {
            [x, y] = [1, 2];
            [offsetX, offsetY] = [GetViewport(z).content.image.width / 2, 0];
        }
        else return;
        GetViewport(z).drawLine(GetViewportMark(z).getContext('2d'), GetViewport(z), { x: transCor[0][x] * invertX + offsetX, y: transCor[0][y] * invertY + offsetY }, { x: transCor[1][x] * invertX + offsetX, y: transCor[1][y] * invertY + offsetY }, "#00FF00", 1.0);
        GetViewport(z).drawLine(GetViewportMark(z).getContext('2d'), GetViewport(z), { x: transCor[1][x] * invertX + offsetX, y: transCor[1][y] * invertY + offsetY }, { x: transCor[2][x] * invertX + offsetX, y: transCor[2][y] * invertY + offsetY }, "#00FF00", 1.0);
        GetViewport(z).drawLine(GetViewportMark(z).getContext('2d'), GetViewport(z), { x: transCor[2][x] * invertX + offsetX, y: transCor[2][y] * invertY + offsetY }, { x: transCor[3][x] * invertX + offsetX, y: transCor[3][y] * invertY + offsetY }, "#00FF00", 1.0);
        GetViewport(z).drawLine(GetViewportMark(z).getContext('2d'), GetViewport(z), { x: transCor[3][x] * invertX + offsetX, y: transCor[3][y] * invertY + offsetY }, { x: transCor[0][x] * invertX + offsetX, y: transCor[0][y] * invertY + offsetY }, "#00FF00", 1.0);
        //}
    } catch (ex) { console.log(ex); }
}

loadAnatomicalPlane();