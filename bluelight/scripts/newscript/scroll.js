
function scroll() {
    if (BL_mode == 'scroll') {
        DeleteMouseEvent();
        Mousedown = function (e) {
            switch (e.which) {
                case 1:
                    MouseDownCheck = true;
                    break;
                case 2:
                    break;
                case 3:
                    rightMouseDown = true;
                    break;
                default:
                    break
            }
            windowMouseX = GetmouseX(e);
            windowMouseY = GetmouseY(e);
            GetViewport().originalPointX = getCurrPoint(e)[0];
            GetViewport().originalPointY = getCurrPoint(e)[1];
        };

        

        Mousemove = function (e) {
            var currX = getCurrPoint(e)[0];
            var currY = getCurrPoint(e)[1];
            var labelXY = getClass('labelXY'); {
                let angel2point = rotateCalculation(e);
                labelXY[viewportNumber].innerText = "X: " + parseInt(angel2point[0]) + " Y: " + parseInt(angel2point[1]);
            }
            if (rightMouseDown == true) {
                scale_size(e,currX,currY);
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

            if (MouseDownCheck) {
                windowMouseX = GetmouseX(e);
                windowMouseY = GetmouseY(e);

                var nextInstanceNumber = -1;
                var alt = GetViewport().alt;
                let index = SearchUid2Index(alt);
                // if (!index) continue;
                let i = index[0],
                    j = index[1],
                    k = index[2];
                var Onum = parseInt(Patient.Study[i].Series[j].Sop[k].InstanceNumber);
                var list = sortInstance(alt);
                var l = 0;
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
            }
        }
        Mouseup = function (e) {
            var currX = getCurrPoint(e)[0];
            var currY = getCurrPoint(e)[1];
            if (openMouseTool == true && rightMouseDown == true)
                displayMark(NowResize, null, null, null, viewportNumber);
            MouseDownCheck = false;
            rightMouseDown = false;
            magnifierDiv.style.display = "none";
            displayMeasureRular();
            if (openLink) {
                for (var i = 0; i < Viewport_Total; i++)
                    displayRular(i);
            }
        }
        AddMouseEvent();
    }
}