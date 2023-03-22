function playVideo(dir) {
    getByid("MeasureLabel").style.display = "none";
    getByid("AngleLabel").style.display = "none";
    var viewportNum = dir;
    var sop = GetViewport(viewportNum).sop;
    var break1 = false;
    let index = SearchUid2Index(sop);
    if (!index) return;
    let i = index[0],
        j = index[1],
        k = index[2];
    if (Patient.Study[i].Series[j].Sop[k].SopUID == sop) {
        var Onum = parseInt(Patient.Study[i].Series[j].Sop[k].InstanceNumber);
        var list = sortInstance(sop);
        if (!(list.length <= 1)) {
            for (var l = 0; l < list.length; l++) {
                if (break1 == true) break;
                if (list[l].InstanceNumber == Onum) {
                    if (l + 1 >= list.length) {
                        loadAndViewImage(list[0].imageId, viewportNum);
                        break1 = true;
                        break;
                    }
                    loadAndViewImage(list[l + 1].imageId, viewportNum);
                    break1 = true;
                    break;
                }
            }
        }
        else if ((list.length==1&&list[0].frames)) {
            for (var l = 0; l < list[0].frames.length; l++) {
                if (break1 == true) break;
                if (l == GetViewport(viewportNum).framesNumber) {
                    if (l + 1 >= list[0].frames.length) {
                        loadAndViewImage(list[0].imageId, viewportNum,0);
                        break1 = true;
                        break;
                    }
                    loadAndViewImage(list[0].imageId, viewportNum,l+1);
                    break1 = true;
                    break;
                }
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