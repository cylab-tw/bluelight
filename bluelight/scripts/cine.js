
//播放動畫用的計時器
var Cineimer = null;

var PlayCine = function () {
    if (GetViewport().cine == false) {
        getByid('playvideo').src = '../image/icon/black/b_CinePlay.png';
    } else {
        getByid('playvideo').src = '../image/icon/black/b_CinePause.png';
    }

    if (openLink == true || GetViewport().cine == false) {
        for (var i = 0; i < Viewport_Total; i++) {
            GetViewport(i).cine = GetViewport().cine;
        }
    }

    clearInterval(Cineimer);
    var fps = parseInt((1 / parseFloat(getByid("textPlay").value) * 1000));
    Cineimer = setInterval(function () {
        for (var i = 0; i < Viewport_Total; i++) {
            if (GetViewport(i).cine != true) continue;
            if (!(parseInt(GetViewport(i).div.style.height) <= 1)) GetViewport(i).nextFrame(false);
        }
    }, fps);
}