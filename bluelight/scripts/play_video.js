function playVideo(dir) {
    getByid("MeasureLabel").style.display = "none";
    getByid("AngelLabel").style.display = "none";
    var viewportNum = dir;
    var alt = GetViewport(viewportNum).alt;
    var break1 = false;
    let index = SearchUid2Index(alt);
    if (!index) return;
    let i = index[0],
        j = index[1],
        k = index[2];
    if (Patient.Study[i].Series[j].Sop[k].SopUID == alt) {
        var Onum = parseInt(Patient.Study[i].Series[j].Sop[k].InstanceNumber);
        var list = sortInstance(alt);
        for (var l = 0; l < list.length; l++) {
            if (break1 == true) break;
            if (list[l].InstanceNumber == Onum) {
                if (l + 1 >= list.length) {
                    loadAndViewImage(list[0].imageId, null, null, viewportNum);
                    break1 = true;
                    break;
                }
                loadAndViewImage(list[l + 1].imageId, null, null, viewportNum);
                break1 = true;
                break;
            }
        }
    }
}


var PlayTimer = function () {
    if (GetViewport().openPlay == false) {
        getByid('playvideo').src = '../image/icon/black/b_CinePlay.png';
    } else {
        getByid('playvideo').src = '../image/icon/black/b_CinePause.png';
    }
    if (openLink == true || GetViewport().openPlay == false) {
        for (var i = 0; i < Viewport_Total; i++) {
            GetViewport(i).openPlay = GetViewport().openPlay;
        }
    }
    for (var i = 0; i < Viewport_Total; i++) {
        clearInterval(PlayTimer1[i]);
    }
    var fps = parseInt((1 / parseFloat(getByid("textPlay").value) * 1000));
    for (var i = 0; i < Viewport_Total; i++) {
        let i1 = i;
        if (GetViewport(i).openPlay != true) {
            clearInterval(PlayTimer1[i]);
            continue;
        };
        PlayTimer1[i] = setInterval(function () {
            playVideo(parseInt(i1));
        }, fps);
    }

}