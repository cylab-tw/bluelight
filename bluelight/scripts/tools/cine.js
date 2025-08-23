
var PlayCine = function () {
    //播放動畫用的計時器
    let CineTimer = CineEnd = null;
    if (GetViewport().cine) getByid('playvideo').src = '../image/icon/lite/b_CinePause.png';
    else getByid('playvideo').src = '../image/icon/lite/b_CinePlay.png';

    if (openLink || !GetViewport().cine) SetAllViewport("cine", GetViewport().cine);

    clearInterval(CineTimer);
    if (!GetViewport().cine) return;
    var fps = parseInt((1 / parseFloat(getByid("textPlay").value) * 1000));
    CineEnd = true;

    CineTimer = setInterval(function () {
        if (!CineEnd) return;
        CineEnd = false;
        for (var i = 0; i < Viewport_Total; i++)
            if (GetViewport(i).cine) GetViewport(i).nextFrame(false);
        CineEnd = true;
    }, fps);
}

onloadFunction.push(
    function () {
        getByid("playvideo").onclick = function () {
            if (this.enable == false) return;
            drawBorder(this);
            hideAllDrawer();
            GetViewport().cine = !GetViewport().cine;
            if (GetViewport().cine) {
                getByid('labelPlay').style.display = '';
                getByid('textPlay').style.display = '';
            }
            else {
                getByid('labelPlay').style.display = 'none';
                getByid('textPlay').style.display = 'none';
            }
            SetTable();
            PlayCine();
        }

        getByid("textPlay").onchange = function () {
            if ((parseInt(getByid('textPlay').value) <= 1)) getByid('textPlay').value = 1;
            else if (parseInt(getByid('textPlay').value) >= 60) getByid('textPlay').value = 60;
            else if (!(parseInt(getByid('textPlay').value) >= 1)) getByid('textPlay').value = 10;
            PlayCine();
        }
    });