
function loadMarkupPlugin() {
    if (getByid("MarkupImgParent")) return;
    var span = document.createElement("SPAN");
    span.id = "MarkupImgParent";
    span.innerHTML = `
     <img class="img" loading="lazy" altzhtw="3D" alt="3D" id="MarkupDrawerImg" src="../image/icon/lite/markup.png"
          width="50" height="50">
    <div id="MarkupDIv" class="drawer" style="position:absolute;left: 0;white-space:nowrap;z-index: 100;
    width: 500; display: none;background-color: black;">`;
    addIconSpan(span);
    getByid("MarkupDrawerImg").onclick = function () {
        if (this.enable == false) return;
        hideAllDrawer("MarkupDIv");
        invertDisplayById('MarkupDIv');
        if (getByid("MarkupDIv").style.display == "none") getByid("MarkupImgParent").style.position = "";
        else {
            getByid("MarkupImgParent").style.position = "relative";
            //onElementLeave();
        }
    }
}

function loadWriteTAG() {
    loadMarkupPlugin();
    var span = document.createElement("SPAN")
    span.innerHTML =
        `<img class="innerimg TAG" alt="writeTAG" onmouseover = "onElementOver(this);" onmouseleave = "onElementLeave();" id="writeTAG" src="../image/icon/lite/tag_off.png" width="50" height="50">`;
    if (getByid("MarkupDIv").childNodes.length > 0) getByid("MarkupDIv").appendChild(document.createElement("BR"));
    getByid("MarkupDIv").appendChild(span);

    var span = document.createElement("SPAN")
    span.innerHTML =
        `<img class="img TAG" alt="saveTAG" id="saveTAG" onmouseover="onElementOver(this);" onmouseleave="onElementLeave();" src="../image/icon/lite/tag_off.png" width="50" height="50" style="display:none;" >`;
    addIconSpan(span);

    var span = document.createElement("SPAN")
    span.innerHTML =
        `<div id="TagStyleDiv" style="background-color:#30306044;">
        <span style="color: white;" id="medicalSpecialtyTagSpan">Medical specialty：</span>
        <select id="medicalSpecialtyTag">
        </select>
      </div>`
    getByid("page-header").appendChild(span);
    getByid("TagStyleDiv").style.display = "none";
}
loadWriteTAG();

function readImageTags(url) {
    let request = new XMLHttpRequest();
    request.open('GET', url);
    request.responseType = 'text';
    request.send();
    request.onload = function () {
        if (request.readyState != 4) { return; }
        var responseJson = JSON.parse(request.responseText);
        let response = Object.entries(responseJson['medicalSpecialty']);

        response.forEach(medicalSpecialityObject => {
            let [key, value] = medicalSpecialityObject;

            let medicalSpecialtyName = value['name'];
            let selectField = document.getElementById("medicalSpecialtyTag");
            let opt = document.createElement('option');
            opt.id = medicalSpecialtyName;
            opt.textContent = medicalSpecialtyName;
            selectField.appendChild(opt);

            let tagDiv = document.getElementById("TagStyleDiv");
            let diseasesDiv = document.createElement('div');
            diseasesDiv.id = medicalSpecialtyName;
            diseasesDiv.style.color = "white";
            tagDiv.appendChild(diseasesDiv);

            let diseases = Object.entries(value['diseases']);
            diseases.forEach(diseaseObject => {
                let [diseaseKey, diseaseValue] = diseaseObject;
                let span = document.createElement("span");
                let diseaseName = diseaseValue['name'];
                span.id = "diseaseTagSpan";
                span.textContent = "Disease：" + diseaseName + " ";
                diseasesDiv.appendChild(span);

                let select = document.createElement('select');
                select.id = "diseaseSelectorTag" + diseaseName.replace(/ /g, "");

                let selectDiseaseTagNumber = document.querySelectorAll('[id^=diseaseSelectorTag]').length
                if (selectDiseaseTagNumber > 0) {
                    diseasesDiv.hidden = true;
                }
                diseasesDiv.appendChild(select);

                diseaseValue['tags'].forEach(tag => {
                    let opt = document.createElement('option');
                    opt.id = tag;
                    opt.textContent = tag;
                    select.appendChild(opt);
                });
            });
        });
    }
}
readImageTags("../data/imageTags.json");

getByid("medicalSpecialtyTag").onchange = function () {

    let disabledDiseaseDiv = document.getElementById("TagStyleDiv").querySelectorAll("div");
    disabledDiseaseDiv.forEach((elem) => {
        elem.hidden = true;
    });

    let enabledDiseaseDiv = document.querySelectorAll("div[id='" + this.value + "']");
    enabledDiseaseDiv.forEach((elem) => {
        elem.hidden = false;
    });
}

getByid("saveTAG").onclick = function () {
    getByid("saveTAG").style.display = "none";
    //getByid("writeTAG").src = '../image/icon/lite/tag_off.png';
    img2darkByClass("TAG", true);
    getByid('TagStyleDiv').style.display = 'none';
    SetTable();
    displayMark();
    function download(text, name, type) {
        let a = document.createElement('a');
        let file = new Blob([text], {
            type: type
        });
        a.href = window.URL.createObjectURL(file);
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
    let index = SearchUid2Index(GetViewport().sop);
    let i = index[0], j = index[1], k = index[2];
    let sopUID = ImageManager.Study[i].Series[j].Sop[k].SOPInstanceUID;

    set_TAG_context(index);

    if (ConfigLog.Xml2Dcm.enableXml2Dcm == true)
        download2(String(get_TAG_context()), "" + CreateRandom(), 'text/plain');
    else
        download(String(get_TAG_context()), sopUID + ".xml", 'text/plain');

    getByid('MouseOperation').click();
}

getByid("writeTAG").onclick = function () {
    cancelTools();

    getByid("MarkupDIv").style.display = "none";
    img2darkByClass("TAG", false);
    //this.src = '../image/icon/lite/tag_on.png';
    if (true) {
        getByid("saveTAG").style.display = "";
        getByid('TagStyleDiv').style.display = '';
    }
    SetTable();
    displayMark();
}


var TAG_format =
    `<?xml version="1.0" encoding="UTF-8"?>
    <file-format>
        <meta-header xfer="1.2.840.10008.1.2.1" name="Little Endian Explicit">
            <element tag="0002,0013" vr="SH" vm="1" len="10" name="ImplementationVersionName">BlueLight</element>
        </meta-header>
        <data-set xfer="1.2.840.10008.1.2.1" name="Little Endian Explicit">
            <element tag="0004,1430" vr="CS" vm="1" len="6" name="DirectoryRecordType">IMAGE</element>
            <element tag="0008,0018" vr="UI" vm="1" len="___SOPInstanceUID(len)___" name="SOPInstanceUID">___SOPInstanceUID___</element>
            <element tag="0020,0013" vr="IS" vm="1" len="___InstanceNumber(len)___" name="InstanceNumber">___InstanceNumber___</element>
            <element tag="0020,000d" vr="UI" vm="1" len="___StudyInstanceUID(len)___" name="StudyInstanceUID">___StudyInstanceUID___</element>
            <element name="ImageTag">___ImageTag___</element>
        </data-set>
    </file-format>
    `;


var TAG_format_object_list = [];

function set_TAG_context(index) {
    TAG_format_object_list = []
    let temp = "" + TAG_format;
    let i = index[0],
        j = index[1],
        k = index[2];

    function setTag(temp, replace, str, len) {
        if (str == undefined || str == null) str = "";
        str = "" + str;
        temp = temp.replace("___" + replace + "___", "" + str);
        var length = ("" + str).length;
        if (length % 2 != 0) length++;
        if (len == true) temp = temp.replace("___" + replace + "(len)___", length);
        return temp;
    }

    let selectedTag;
    let disabledDiseaseDivs = document.getElementById("TagStyleDiv").querySelectorAll("div");

    disabledDiseaseDivs.forEach((elem) => {
        if (elem.hidden === false) {
            //TODO Currently supported just only one disease
            let selector = elem.querySelectorAll("[id^=diseaseSelectorTag]")[0];
            selectedTag = selector.value;
        }
    });
    let sopDcm = ImageManager.Study[i].Series[j].Sop[k];
    temp = setTag(temp, "SOPInstanceUID", sopDcm.SOPInstanceUID, true);
    temp = setTag(temp, "InstanceNumber", sopDcm.InstanceNumber, true);
    temp = setTag(temp, "StudyInstanceUID", ImageManager.Study[i].StudyInstanceUID, true);
    temp = setTag(temp, "ImageTag", selectedTag, true)
    TAG_format_object_list.push(temp);
}

function get_TAG_context() {
    var temp_str = "";
    for (var i = 0; i < TAG_format_object_list.length; i++) {
        temp_str += TAG_format_object_list[i];
    }
    return temp_str;
}