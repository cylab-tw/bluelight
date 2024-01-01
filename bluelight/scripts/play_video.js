function playVideo(viewportNum) {
    getByid("MeasureLabel").style.display = "none";
    getByid("AngleLabel").style.display = "none";
    if (!(parseInt(GetViewport(viewportNum).style.height) <= 1)) GetNewViewport(viewportNum).nextFrame(false);
}

var PlayTimer = function () {
    if (GetNewViewport().cine == false) {
        getByid('playvideo').src = '../image/icon/black/b_CinePlay.png';
    } else {
        getByid('playvideo').src = '../image/icon/black/b_CinePause.png';
    }
    if (openLink == true || GetNewViewport().cine  == false) {
        for (var i = 0; i < Viewport_Total; i++) {
            GetNewViewport(i).cine  = GetNewViewport().cine ;
        }
    }
    for (var i = 0; i < Viewport_Total; i++) {
        clearInterval(PlayTimer1[i]);
    }
    var fps = parseInt((1 / parseFloat(getByid("textPlay").value) * 1000));
    for (var i = 0; i < Viewport_Total; i++) {
        let i1 = i;
        if (GetNewViewport(i).cine  != true) {
            clearInterval(PlayTimer1[i]);
            continue;
        };
        PlayTimer1[i] = setInterval(function () {
            playVideo(parseInt(i1));
        }, fps);
    }

}