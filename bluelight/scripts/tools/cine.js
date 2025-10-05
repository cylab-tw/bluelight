
function PlayCine() {
    clearInterval(PlayCine.CineTimer);

    //播放動畫用的計時器
    PlayCine.CineTimer = PlayCine.CineEnd = null;
    changeCineImg();

    if (openLink || !GetViewport().cine) SetAllViewport("cine", GetViewport().cine);

    if (!GetViewport().cine) return;
    var fps = parseInt((1 / parseFloat(getByid("textPlay").value) * 1000));
    PlayCine.CineEnd = true;

    PlayCine.CineTimer = setInterval(function () {
        if (!PlayCine.CineEnd) return;
        PlayCine.CineEnd = false;
        for (var i = 0; i < Viewport_Total; i++)
            if (GetViewport(i).cine) GetViewport(i).nextFrame(false);
        PlayCine.CineEnd = true;
    }, fps);
}

onloadFunction.push(
    function () {
        getByid("playvideo").onclick = function () {
            if (this.enable == false) return;
            
            hideAllDrawer("playvideolDiv");
            invertDisplayById('playvideolDiv');
            if (getByid("playvideolDiv").style.display == "none") getByid("playvideoDiv_span").style.position = "";
            else {
                getByid("playvideoDiv_span").style.position = "relative";
                onElementLeave();
            }
            
            drawBorder(this);
            GetViewport().cine = !GetViewport().cine;
            PlayCine();
        }

        getByid("textPlay").oninput = function () {
            if ((parseInt(getByid('textPlay').value) <= 1)) getByid('textPlay').value = 1;
            else if (parseInt(getByid('textPlay').value) >= 60) getByid('textPlay').value = 60;
            else if (!(parseInt(getByid('textPlay').value) >= 1)) getByid('textPlay').value = 10;
            PlayCine();
        }
    });