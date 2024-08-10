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

function displayWindowLevel(viewportNum = viewportNumber) {
  getByid("textWW").value = "" + parseInt(GetViewport(viewportNum).windowWidth);
  getByid("textWC").value = "" + parseInt(GetViewport(viewportNum).windowCenter);
  getClass("labelWC")[viewportNum].innerText = ` WC: ${parseInt(GetViewport(viewportNum).windowCenter)} WW: ${parseInt(GetViewport(viewportNum).windowWidth)}`;
}

function DisplaySeriesCount(viewportNum = viewportNumber) {
  var viewport = GetViewport(viewportNum);
  var tags = viewport.tags;
  var label_RB = getClass("labelRB")[viewportNum];

  var SeriesCount = 1;
  for (var i = 0; i < ImageManager.Study.length; i++) {
    for (var j = 0; j < ImageManager.Study[i].Series.length; j++) {
      if (ImageManager.Study[i].Series[j].SeriesInstanceUID == tags.SeriesInstanceUID) {
        SeriesCount = ImageManager.Study[i].Series[j].Sop.length;
        if (SeriesCount == 1) SeriesCount = 2;
        if (tags.InstanceNumber == null) {
          if (label_RB.innerText.indexOf('/') >= 1) {
            label_RB.innerText = label_RB.innerText.substr(0, label_RB.innerText.indexOf('/') + 1) + (SeriesCount - 1) + "\n" + tags.StudyDate;
            return;
          }
        } else {
          if (tags.NumberOfFrames && tags.NumberOfFrames > 1) label_RB.innerText = "Im: " + (viewport.framesNumber + 1) + "/" + (tags.NumberOfFrames - 0) + "\n" + tags.StudyDate;
          else if (viewport.QRLevel == "sop") label_RB.innerText = "Im: " + "/" + (SeriesCount - 0) + "\n" + tags.StudyDate;
          else label_RB.innerText = "Im: " + tags.InstanceNumber + "/" + (SeriesCount - 0) + "\n" + tags.StudyDate;
          return;
        }
      }
    }
  }
  if (tags.NumberOfFrames && tags.NumberOfFrames > 1) label_RB.innerText = "Im: " + (viewport.framesNumber + 1) + "/" + tags.NumberOfFrames + "\n" + tags.StudyDate;
  else if (viewport.QRLevel == "sop") label_RB.innerText = "Im: " + "/" + (SeriesCount - 0) + "\n" + tags.StudyDate;
  else label_RB.innerText = "Im: " + tags.InstanceNumber + "/" + SeriesCount + "\n" + tags.StudyDate;
}

function displayAnnotation() {
  for (var i = 0; i < Viewport_Total; i++) {
    if (openAnnotation == true) {
      getClass("labelWC")[i].style.display = "";
      getClass("labelLT")[i].style.display = "";
      getClass("labelRT")[i].style.display = "";
      getClass("labelRB")[i].style.display = "";
      getClass("labelXY")[i].style.display = "";
      getClass("labelWC")[i].style.display = "";
      getClass("leftRule")[i].style.display = "";
      getClass("downRule")[i].style.display = "";
    } else {
      getClass("labelWC")[i].style.display = "none";
      getClass("labelLT")[i].style.display = "none";
      getClass("labelRT")[i].style.display = "none";
      getClass("labelRB")[i].style.display = "none";
      getClass("labelWC")[i].style.display = "none";
      getClass("labelXY")[i].style.display = "none";
      getClass("leftRule")[i].style.display = "none";
      getClass("downRule")[i].style.display = "none";
    }
  }
}