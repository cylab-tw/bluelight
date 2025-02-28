//代表病患資訊顯示狀態
var openAnnotation = true;

//label距離邊緣多遠
var labelPadding = 3;
var leftLabelPadding = labelPadding;
var rightLabelPadding = labelPadding;
var topLabelPadding = labelPadding;
var bottomLabelPadding = labelPadding;

//數著這個Series有幾張影像
//var SeriesCount = 0;

function setWindowLevel(viewportNum = viewportNumber) {
  getByid("textWW").value = "" + parseInt(GetViewport(viewportNum).windowWidth);
  getByid("textWC").value = "" + parseInt(GetViewport(viewportNum).windowCenter);
  GetViewport(viewportNum).setLabel("WindowWidth", parseInt(GetViewport(viewportNum).windowWidth));
  GetViewport(viewportNum).setLabel("WindowCenter", parseInt(GetViewport(viewportNum).windowCenter));
  GetViewport(viewportNum).refleshLabel();
}

function setCommonLabel(viewportNum = viewportNumber) {
  var viewport = GetViewport(viewportNum);
  if (!isNaN(viewport.tags.SliceThickness)) viewport.setLabel("SliceThickness", parseFloat(viewport.tags.SliceThickness).toFixed(1));

  if (viewport.content.image) {

    if (viewport.tags.PatientName) viewport.setLabel("PatientName", "" + viewport.content.image.PatientName);

    if (viewport.content.image.Orientation) {
      var orien = viewport.content.image.Orientation;
      //左右
      if (Math.round(orien[0]) == 1 && Math.round(orien[1]) == 0 && Math.round(orien[2]) == 0) {
        viewport.setLabel("PostionRight", "L"); viewport.setLabel("PostionLeft", "R");
      }
      if (Math.round(orien[0]) == -1 && Math.round(orien[1]) == 0 && Math.round(orien[2]) == 0) {
        viewport.setLabel("PostionRight", "R"); viewport.setLabel("PostionLeft", "L");
      }
      if (Math.round(orien[0]) == 0 && Math.round(orien[1]) == 1 && Math.round(orien[2]) == 0) {
        viewport.setLabel("PostionRight", "P"); viewport.setLabel("PostionLeft", "A");
      }
      if (Math.round(orien[0]) == 0 && Math.round(orien[1]) == -1 && Math.round(orien[2]) == 0) {
        viewport.setLabel("PostionRight", "A"); viewport.setLabel("PostionLeft", "P");
      }
      if (Math.round(orien[0]) == 0 && Math.round(orien[1]) == 0 && Math.round(orien[2]) == 1) {
        viewport.setLabel("PostionRight", "S"); viewport.setLabel("PostionLeft", "I");
      }
      if (Math.round(orien[0]) == 0 && Math.round(orien[1]) == 0 && Math.round(orien[2]) == -1) {
        viewport.setLabel("PostionRight", "I"); viewport.setLabel("PostionLeft", "S");
      }
      //上下
      if (Math.round(orien[3]) == 1 && Math.round(orien[4]) == 0 && Math.round(orien[5]) == 0) {
        viewport.setLabel("PostionBottom", "L"); viewport.setLabel("PostionTop", "R");
      }
      if (Math.round(orien[3]) == -1 && Math.round(orien[4]) == 0 && Math.round(orien[5]) == 0) {
        viewport.setLabel("PostionBottom", "R"); viewport.setLabel("PostionTop", "L");
      }
      if (Math.round(orien[3]) == 0 && Math.round(orien[4]) == 1 && Math.round(orien[5]) == 0) {
        viewport.setLabel("PostionBottom", "P"); viewport.setLabel("PostionTop", "A");
      }
      if (Math.round(orien[3]) == 0 && Math.round(orien[4]) == -1 && Math.round(orien[5]) == 0) {
        viewport.setLabel("PostionBottom", "A"); viewport.setLabel("PostionTop", "P");
      }
      if (Math.round(orien[3]) == 0 && Math.round(orien[4]) == 0 && Math.round(orien[5]) == 1) {
        viewport.setLabel("PostionBottom", "S"); viewport.setLabel("PostionTop", "I");
      }
      if (Math.round(orien[3]) == 0 && Math.round(orien[4]) == 0 && Math.round(orien[5]) == -1) {
        viewport.setLabel("PostionBottom", "I"); viewport.setLabel("PostionTop", "S");
      }
    }

    if (viewport.content.image.AnatomicalPlane == "Axial") viewport.setLabel("AnatomicalPlane", "Axial");
    if (viewport.content.image.AnatomicalPlane == "Sagittal") viewport.setLabel("AnatomicalPlane", "Sagittal");
    if (viewport.content.image.AnatomicalPlane == "Coronal") viewport.setLabel("AnatomicalPlane", "Coronal");
  }

  viewport.refleshLabel();
}

function setSeriesCount(viewportNum = viewportNumber) {
  var viewport = GetViewport(viewportNum), tags = viewport.tags, SeriesCount = 1;
  if (!viewport.Sop) return;
  SeriesCount = viewport.Sop.parent.Sop.length;
  if (SeriesCount == 1) SeriesCount = 2;
  var str = "";
  if (tags.NumberOfFrames && tags.NumberOfFrames > 1) str = "" + (viewport.framesNumber + 1) + "/" + (tags.NumberOfFrames - 0);
  else str = "" + tags.InstanceNumber + "/" + (SeriesCount - 0);
  viewport.setLabel("Im", str);
  viewport.refleshLabel();
}

function setTransformLabel(viewportNum = viewportNumber) {
  var viewport = GetViewport(viewportNum);
  if (!viewport.transform || !viewport.transform.imagePositionZ) return;
  viewport.setLabel("imagePositionX", viewport.transform.imagePositionX.toFixed(1));
  viewport.setLabel("imagePositionY", viewport.transform.imagePositionY.toFixed(1));
  viewport.setLabel("imagePositionZ", viewport.transform.imagePositionZ.toFixed(1));
  viewport.refleshLabel();
}

function displayAnnotation() {
  for (var i = 0; i < Viewport_Total; i++) {
    if (openAnnotation == true) {
      //getClass("labelWC")[i].style.display = "";
      getClass("labelLT")[i].style.display = "";
      getClass("labelRT")[i].style.display = "";
      getClass("labelRB")[i].style.display = "";
      //getClass("labelXY")[i].style.display = "";
      //getClass("labelWC")[i].style.display = "";
      getClass("leftRule")[i].style.display = "";
      getClass("downRule")[i].style.display = "";
    } else {
      //getClass("labelWC")[i].style.display = "none";
      getClass("labelLT")[i].style.display = "none";
      getClass("labelRT")[i].style.display = "none";
      getClass("labelRB")[i].style.display = "none";
      //getClass("labelWC")[i].style.display = "none";
      //getClass("labelXY")[i].style.display = "none";
      getClass("leftRule")[i].style.display = "none";
      getClass("downRule")[i].style.display = "none";
    }
  }
}