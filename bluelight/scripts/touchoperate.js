function Touchstart(e, e2) {
  if (openVR == true) return;
  getByid("MeasureLabel").style.display = "none";
  if (!e2) TouchDownCheck = true;
  else rightTouchDown = true;
  if (openMPR == true) {
    windowMouseX = GetmouseX(e);
    windowMouseY = GetmouseY(e);
    GetViewport().originalPointX = getCurrPoint(e)[0];
    GetViewport().originalPointY = getCurrPoint(e)[1];
    return;
  };
  if (openAngel == 3) openAngel = 1;
  if (openAngel == 2) getByid("AngelLabel").style.display = '';
  if (openMeasure == true) {
    getByid("MeasureLabel").style.display = '';
    let angel2point = rotateCalculation(e);
    MeasureXY = angel2point;
    MeasureXY2 = angel2point;
    for (var i = 0; i < Viewport_Total; i++)
        displayMark(NowResize, null, null, null, i);
    displayMeasureRular();
}
  if (openMeasure == true) {
    let angel2point = rotateCalculation(e);
    var currX11 = angel2point[0];
    var currY11 = angel2point[1];
    MeasureXY = [currX11, currY11];
    MeasureXY2 = [currX11, currY11];
    for (var i = 0; i < Viewport_Total; i++)
      displayMark(NowResize, null, null, null, i);
    displayMeasureRular();
  }

  if (openAngel == 1) {
    let angel2point = rotateCalculation(e);
    var currX11 = angel2point[0];
    var currY11 = angel2point[1];

    AngelXY0 = [currX11, currY11];
    AngelXY1 = [currX11, currY11];
    for (var i = 0; i < Viewport_Total; i++)
      displayMark(NowResize, null, null, null, i);
    displayAngelRular();
  }

  windowMouseX = GetmouseX(e);
  windowMouseY = GetmouseY(e);
  if (rightTouchDown == true && e2) {
    windowMouseX2 = GetmouseX(e2);
    windowMouseY2 = GetmouseY(e2);
  }
  GetViewport().originalPointX = getCurrPoint(e)[0];
  GetViewport().originalPointY = getCurrPoint(e)[1];
  if (rightTouchDown == true && e2) {
    GetViewport().originalPointX2 = getCurrPoint(e2)[0];
    GetViewport().originalPointY2 = getCurrPoint(e2)[1];
  }
  if (openZoom == true && MouseDownCheck == true) {
    magnifierDiv.style.display = "";
    let angel2point = rotateCalculation(e);
    var currX11 = angel2point[0];
    var currY11 = angel2point[1];
    magnifierIng(currX11, currY11);
  }
}

function Touchmove(e, e2) {
  if (openVR == true) return;
  if (openMPR == true && openWindow != true && openChangeFile == false) {
    if (TouchDownCheck == true) {
      viewportNumber = 2;
      let angel2point = rotateCalculation(e);
      currX11M = angel2point[0];
      currY11M = angel2point[1];
      o3DPointX = currX11M;
      o3DPointY = currY11M;
      AngelXY0 = [currX11M, 0];
      AngelXY1 = [currX11M, GetViewport().imageHeight];
      if (openMPR == true) {
        Anatomical_Section();
        Anatomical_Section2();
      }
      display3DLine(currX11M, 0, currX11M, GetViewport().imageHeight, "rgb(38,140,191)");
      display3DLine(0, currY11M, GetViewport().imageWidth, currY11M, "rgb(221,53,119)");
    }
  }
  var currX = getCurrPoint(e)[0];
  var currY = getCurrPoint(e)[1];
  if (e2) {
    var currX2 = getCurrPoint(e2)[0];
    var currY2 = getCurrPoint(e2)[1];
  }
  var labelXY = getClass('labelXY');
  labelXY[viewportNumber].innerText = "X: " + Math.floor(currX) + " Y: " + Math.floor(currY);
  if (rightTouchDown == true && e2) {
    if (openRotate == false && (openMouseTool == true || openWindow == true || openZoom == true || openMeasure == true)) {
      if (openLink == true) {
        for (var i = 0; i < Viewport_Total; i++) {
          if (i == viewportNumber) continue;
          try {
            GetViewport(i).canvas().style.width = GetViewport().canvas().style.width;
            GetViewport(i).canvas().style.height = GetViewport().canvas().style.height;
            GetViewportMark(i).style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
            GetViewport(i).canvas().style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
            GetViewport(i).NowCanvasSizeWidth = parseFloat(canvas.style.width);
            GetViewport(i).NowCanvasSizeHeight = parseFloat(canvas.style.height);
          } catch (ex) {}
        }
      }
      if (Math.abs(GetmouseY(e2) - GetmouseY(e)) - 2 > Math.abs(windowMouseY - windowMouseY2) + 2 ||
        Math.abs(GetmouseX(e2) - GetmouseX(e)) - 2 > Math.abs(windowMouseX - windowMouseX2) + 2
      ) {
        var tempWidth = parseFloat(canvas.style.width);
        var tempHeight = parseFloat(canvas.style.height)
        var canvasW = GetViewportMark(viewportNumber).style.width = canvas.style.width = tempWidth * 1.05 + "px";
        var cnavsH = GetViewportMark(viewportNumber).style.height = canvas.style.height = tempHeight * 1.05 + "px";
        if (currX > parseFloat(canvasW) / 2)
          GetViewport().newMousePointX -= Math.abs(tempWidth - (parseFloat(canvasW))) / 2;
        else
          GetViewport().newMousePointX -= Math.abs(tempWidth - (parseFloat(canvasW))) / 2;
        if (currY > parseFloat(cnavsH) / 2)
          GetViewport().newMousePointY -= Math.abs(tempHeight - (parseFloat(cnavsH))) / 2;
        else
          GetViewport().newMousePointY -= Math.abs(tempHeight - (parseFloat(cnavsH))) / 2;
        GetViewportMark(viewportNumber).style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
        canvas.style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
      } else if (Math.abs(GetmouseY(e2) - GetmouseY(e)) + 2 < Math.abs(windowMouseY - windowMouseY2) - 2 ||
        Math.abs(GetmouseX(e2) - GetmouseX(e)) + 2 < Math.abs(windowMouseX - windowMouseX2) - 2) {
        var tempWidth = parseFloat(canvas.style.width);
        var tempHeight = parseFloat(canvas.style.height)
        var canvasW = GetViewportMark(viewportNumber).style.width = canvas.style.width = tempWidth / 1.05 + "px";
        var cnavsH = GetViewportMark(viewportNumber).style.height = canvas.style.height = tempHeight / 1.05 + "px";
        if (currX > parseFloat(canvasW) / 2)
          GetViewport().newMousePointX += Math.abs(tempWidth - (parseFloat(canvasW))) / 2;
        else
          GetViewport().newMousePointX += Math.abs(tempWidth - (parseFloat(canvasW))) / 2;
        if (currY > parseFloat(cnavsH) / 2)
          GetViewport().newMousePointY += Math.abs(tempHeight - (parseFloat(cnavsH))) / 2;
        else
          GetViewport().newMousePointY += Math.abs(tempHeight - (parseFloat(cnavsH))) / 2;
        GetViewportMark(viewportNumber).style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
        canvas.style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
      }
      windowMouseX = GetmouseX(e);
      windowMouseY = GetmouseY(e);
      windowMouseX2 = GetmouseX(e2);
      windowMouseY2 = GetmouseY(e2);
      GetViewport().NowCanvasSizeWidth = parseFloat(canvas.style.width);
      GetViewport().NowCanvasSizeHeight = parseFloat(canvas.style.height);
      if (openLink == true) {
        for (var i = 0; i < Viewport_Total; i++) {
          if (i == viewportNumber) continue;
          GetViewportMark(i).style.width = GetViewport(i).canvas().style.width = GetViewport().canvas().style.width;
          GetViewportMark(i).style.height = GetViewport(i).canvas().style.height = GetViewport().canvas().style.height;
          GetViewportMark(i).style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
          GetViewport(i).canvas().style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
          GetViewport(i).NowCanvasSizeWidth = parseFloat(canvas.style.width);
          GetViewport(i).NowCanvasSizeHeight = parseFloat(canvas.style.height);
        }
      }
    }
    if (openRotate == true) {
      if (Math.abs(currY - GetViewport().originalPointY) > Math.abs(currX - GetViewport().originalPointX) &&
        Math.abs(currY2 - GetViewport().originalPointY2) > Math.abs(currX2 - GetViewport().originalPointX2)
      ) {
        if (currY < GetViewport().originalPointY - 3)
          GetViewport().rotateValue += 2;
        else if (currY > GetViewport().originalPointY + 3)
          GetViewport().rotateValue -= 2;
      }
      GetViewportMark(viewportNumber).style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
      GetViewport().canvas().style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";

      if (openLink == true) {
        for (var z = 0; z < Viewport_Total; z++) {
          rotateValue[z] = GetViewport().rotateValue;
          GetViewportMark((z)).style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
          GetViewport(z).canvas().style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
        }
      }
    }
    if (openLink == true) {
      for (var i = 0; i < Viewport_Total; i++) {
        GetViewport(i).newMousePointX = GetViewport().newMousePointX;
        GetViewport(i).newMousePointY = GetViewport().newMousePointY;
      }
    }
    putLabel();
    for (var i = 0; i < Viewport_Total; i++)
      displayRular(i);
  }
  if (openAngel == 2) {
    let angel2point = rotateCalculation(e);
    var currX11 = angel2point[0];
    var currY11 = angel2point[1];
    AngelXY2 = [currX11, currY11];
    for (var i = 0; i < Viewport_Total; i++)
      displayMark(NowResize, null, null, null, i);
    displayAngelRular();
    return;
  }
  if (TouchDownCheck == true && rightTouchDown == false) {
    if (openMeasure == true) {
      // MeasureXY = [getCurrPoint(e)[0], getCurrPoint(e)[1]];
      let angel2point = rotateCalculation(e);
      var currX11 = angel2point[0];
      var currY11 = angel2point[1];
      MeasureXY2 = [currX11, currY11];
      for (var i = 0; i < Viewport_Total; i++)
        displayMark(NowResize, null, null, null, i);
      displayMeasureRular();
      return;
    }
    if (openAngel == 1) {
      // MeasureXY = [getCurrPoint(e)[0], getCurrPoint(e)[1]];
      let angel2point = rotateCalculation(e);
      var currX11 = angel2point[0];
      var currY11 = angel2point[1];
      AngelXY0 = [currX11, currY11];
      for (var i = 0; i < Viewport_Total; i++)
        displayMark(NowResize, null, null, null, i);
      displayAngelRular();
      return;
    }
    if (openChangeFile == true) {
      var nextInstanceNumber = -1;
      var alt = GetViewport().alt;
      let index = SearchUid2Index(alt);
      // if (!index) continue;
      let i = index[0],
        j = index[1],
        k = index[2];
      var Onum = parseInt(Patient.Study[i].Series[j].Sop[k].InstanceNumber);
      var list = sortInstance(alt);
      for (l = 0; l < list.length; l++) {
        if (list[l].InstanceNumber == Onum) {
          break;
        }
      }
      if (Math.abs(currY - GetViewport().originalPointY) < Math.abs(currX - GetViewport().originalPointX)) {
        if (currX < GetViewport().originalPointX - 3) {
          nextFrame(viewportNumber, -1);
          if (l - 1 < 0) nextInstanceNumber = list.length - 1;
          else nextInstanceNumber = l - 1;
        } else if (currX > GetViewport().originalPointX + 3) {
          nextFrame(viewportNumber, 1);
          if (list[l].InstanceNumber == Onum) {
            if (l + 1 >= list.length) nextInstanceNumber = 0;
            else nextInstanceNumber = l + 1;
          }
        }
      } else {
        if (currY < GetViewport().originalPointY - 3) {
          nextFrame(viewportNumber, -1);
          if (l - 1 < 0) nextInstanceNumber = list.length - 1;
          else nextInstanceNumber = l - 1;
        } else if (currY > GetViewport().originalPointY + 3) {
          nextFrame(viewportNumber, 1);
          if (l + 1 >= list.length) nextInstanceNumber = 0;
          else nextInstanceNumber = l + 1;
        }
      }
      GetViewport().originalPointX = currX;
      GetViewport().originalPointY = currY;
      if (openMPR == true && nextInstanceNumber > -1) {
        Anatomical_Section(nextInstanceNumber);
        Anatomical_Section2(nextInstanceNumber);
      }
    }

    if (openWindow == true && rightTouchDown == false) {
      if (Math.abs(currY - GetViewport().originalPointY) > Math.abs(currX - GetViewport().originalPointX)) {
        if (currY < GetViewport().originalPointY - 3)
          GetViewport().windowCenterList = (parseInt(GetViewport().windowCenterList) + Math.abs(GetmouseY(e) - windowMouseY));
        else if (currY > GetViewport().originalPointY + 3)
          GetViewport().windowCenterList = (parseInt(GetViewport().windowCenterList) - Math.abs(GetmouseY(e) - windowMouseY));
      } else {
        if (currX < GetViewport().originalPointX - 3)
          GetViewport().windowWidthList = (parseInt(GetViewport().windowWidthList) - Math.abs(GetmouseX(e) - windowMouseX));
        else if (currX > GetViewport().originalPointX + 3)
          GetViewport().windowWidthList = (parseInt(GetViewport().windowWidthList) + Math.abs(GetmouseX(e) - windowMouseX));
      }
      if (GetViewport().windowWidthList < 1) GetViewport().windowWidthList = 1;
      textWC.value = "" + parseInt(GetViewport().windowCenterList);
      textWW.value = "" + parseInt(GetViewport().windowWidthList);
      if (openLink == true) {
        for (var z = 0; z < Viewport_Total; z++)
          windowWidthList[z] = GetViewport().windowWidthList;
      }
      displayWindowLevel();
      displayMeasureRular();
      SetWindowWL();
      GetViewport().originalPointX = currX;
      GetViewport().originalPointY = currY;
      WindowOpen = true;
    }
    if (openZoom == true && rightTouchDown == false) {
      magnifierDiv.style.display = "";
      let angel2point = rotateCalculation(e);
      var currX11 = angel2point[0];
      var currY11 = angel2point[1];
      magnifierIng(currX11, currY11);
    }
    if ((openMouseTool == true || openRotate == true) && rightTouchDown == false && openChangeFile == false && openMPR == false) {
      var MouseX = GetmouseX(e);
      var MouseY = GetmouseY(e);
      GetViewport().newMousePointX += MouseX - windowMouseX;
      GetViewport().newMousePointY += MouseY - windowMouseY;
      canvas.style.transform = "translate(" + ToPx(GetViewport().newMousePointX) + "," + ToPx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
      GetViewportMark(viewportNumber).style.transform = "translate(" + ToPx(GetViewport().newMousePointX) + "," + ToPx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
      windowMouseX = GetmouseX(e);
      windowMouseY = GetmouseY(e);

      if (openLink == true) {
        for (var i = 0; i < Viewport_Total; i++) {
          GetViewportMark(i).style.width = GetViewport(i).canvas().style.width = GetViewport().canvas().style.width;
          GetViewportMark(i).style.height = GetViewport(i).canvas().style.height = GetViewport().canvas().style.height;
          GetViewportMark(i).style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
          GetViewport(i).canvas().style.transform = "translate(" + Fpx(GetViewport().newMousePointX) + "," + Fpx(GetViewport().newMousePointY) + ")rotate(" + GetViewport().rotateValue + "deg)";
          newMousePointX[i] = GetViewport().newMousePointX;
          newMousePointX[i] = GetViewport().newMousePointX;
        }
      }
      /* for (var i = 0; i < 4; i++)
         displayMark(NowResize, null, null, null, i);*/
      putLabel();
      for (var i = 0; i < Viewport_Total; i++)
        displayRular(i);
    }
  }
}

function Touchend(e, e2) {
  if (TouchDownCheck == true) {
    if (openAngel == 1) openAngel = 2;
    else if (openAngel == 2) openAngel = 3;
  }
  TouchDownCheck = false;
  rightTouchDown = false;
  if (openVR == true) return;
  magnifierDiv.style.display = "none";
  displayMeasureRular();
}

interact('.LeftImg').draggable({
  onmove(event) {
    dragalt = event.target.alt;
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
    viewportNumber = parseInt(event.target.viewportNum);
    PictureOnclick(dragalt);
  },
  ondropdeactivate: function (event) { 
    event.target.classList.remove('drop-active')
    event.target.classList.remove('drop-target')
  }
})