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

function setSeriesCount(viewportNum = viewportNumber) {
  var viewport = GetViewport(viewportNum), tags = viewport.tags, SeriesCount = 1;
  for (var i = 0; i < ImageManager.Study.length; i++) {
    for (var j = 0; j < ImageManager.Study[i].Series.length; j++) {
      if (ImageManager.Study[i].Series[j].SeriesInstanceUID == tags.SeriesInstanceUID) {
        SeriesCount = ImageManager.Study[i].Series[j].Sop.length;
        if (SeriesCount == 1) SeriesCount = 2;
        var str = "";
        if (tags.NumberOfFrames && tags.NumberOfFrames > 1) str = "" + (viewport.framesNumber + 1) + "/" + (tags.NumberOfFrames - 0);
        else str = "" + tags.InstanceNumber + "/" + (SeriesCount - 0);
        viewport.setLabel("Im", str);
        viewport.refleshLabel();
      }
    }
  }
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