window.addEventListener("load", function (event) {

    getByid("TAGTypeSelect").onchange = function () {
        displayMark(viewportNumber);
    }

    getByid("writeTAG").onclick = function () {
        if (imgInvalid(this)) return;
        cancelTools();
        openWriteTAG = !openWriteTAG;
        img2darkByClass("TAG", !openWriteTAG);
        this.src = openWriteTAG == true ? '../image/icon/black/tag_on.png' : '../image/icon/black/tag_off.png';
        if (openWriteTAG == true) {
            getByid('TAGStyleDiv').style.display = '';
            getByid('TAGStyleDiv').style.display = 'flex';
            // if (openWriteGSPS == true) {
            //     getByid('GspsStyleDiv').style.display = '';
            //     set_BL_model('writegsps');
            //     writegsps();
            // }
            set_BL_model('writeTAG');
            //@TODO DESCOMENTAR
            writeTAG();
        }
        else getByid('TAGStyleDiv').style.display = 'none';
        displayMark(viewportNumber);
        if (openWriteTAG == true) return;
        // else TAG_now_choose = null;

        function download(text, name, type) {
            let a = document.createElement('a');
            let file = new Blob([text], {
                type: type
            });
            a.href = window.URL.createObjectURL(file);
            //a.style.display = '';
            a.download = name;
            a.click();
        }
        function download2(text, name, type) {
            let a = document.createElement('a');
            let file = new File([text], name + ".xml", {
                type: type
            });
            var xhr = new XMLHttpRequest();

            xhr.open('POST', ConfigLog.Xml2Dcm.Xml2DcmUrl, true);
            xhr.setRequestHeader("enctype", "multipart/form-data");
            // define new form
            var formData = new FormData();
            formData.append("files", file);
            xhr.send(formData);
            xhr.onload = function () {
                if (xhr.status == 200) {
                    let data = JSON.parse(xhr.responseText);
                    for (let url of data) {
                        window.open(url);
                    }
                }
            }
        }
        set_TAG_context();
        if (ConfigLog.Xml2Dcm.enableXml2Dcm == true) download2(String(get_Graphic_context()), "" + CreateRandom(), 'text/plain');
        else download(String(get_Graphic_context()), 'filename_TAG.xml', 'text/plain');
        //download(String(get_Graphic_context()), 'filename_TAG.xml', 'text/plain');

        getByid('MouseOperation').click();
    }
});
