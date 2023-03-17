function displayWindowLevel(viewportNum0) {
  var viewportNum = viewportNum0 >= 0 ? viewportNum0 : viewportNumber;
  getByid("textWC").value = "originWindowCenter";
  getByid("textWW").value = "originWindowWidth";
  getByid("textWW").value = "" + parseInt(GetViewport(viewportNum).windowWidthList);
  getByid("textWC").value = "" + parseInt(GetViewport(viewportNum).windowCenterList);
  labelWC[viewportNum].innerText = " WC: " + parseInt(GetViewport(viewportNum).windowCenterList) + " WW: " + parseInt(GetViewport(viewportNum).windowWidthList);
}

function DisplaySeriesCount(viewportNum0) {
  var viewportNum = viewportNum0 >= 0 ? viewportNum0 : viewportNumber;
  var viewport = GetViewport(viewportNum);
  SeriesCount = 1;
  for (var i = 0; i < Patient.StudyAmount; i++) {
    for (var j = 0; j < Patient.Study[i].SeriesAmount; j++) {
      if (Patient.Study[i].Series[j].SeriesUID == viewport.SeriesInstanceUID) {
        SeriesCount = Patient.Study[i].Series[j].SopAmount;
        if (SeriesCount == 1) SeriesCount = 2;
        if (viewport.InstanceNumber == null) {
          if (labelRB[viewportNum].innerText.indexOf('/') >= 1) {
            labelRB[viewportNum].innerText = labelRB[viewportNum].innerText.substr(0, labelRB[viewportNum].innerText.indexOf('/') + 1) + (SeriesCount - 1) + "\n" + viewport.StudyDate;
            return;
          }
        } else {
          labelRB[viewportNum].innerText = "Im: " + viewport.InstanceNumber + "/" + (SeriesCount - 0) + "\n" + viewport.StudyDate;
          return;
        }
      }
    }
  }
  labelRB[viewportNum].innerText = "Im: " + viewport.InstanceNumber + "/" + SeriesCount + "\n" + viewport.StudyDate;
}

function putLabel() {
  for (var i = 0; i < Viewport_Total; i++) {
    getClass("labelLT")[i].style.top = labelPadding + "px";
    getClass("labelLT")[i].style.left = labelPadding + "px";
    getClass("labelRT")[i].style.top = labelPadding + "px";
    getClass("labelRT")[i].style.right = labelPadding + "px";
    getClass("labelRB")[i].style.right = labelPadding + "px";
    getClass("labelRB")[i].style.bottom = labelPadding + "px";
    getClass("labelXY")[i].style.left = labelPadding + "px";
    getClass("labelXY")[i].style.bottom = labelPadding + "px";
    getClass("labelWC")[i].style.left = labelPadding + "px";
    getClass("labelWC")[i].style.bottom = labelPadding + getClass("labelXY")[i].clientHeight + "px";
  }
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
  putLabel();
}