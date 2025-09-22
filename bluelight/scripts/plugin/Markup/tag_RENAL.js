function loadMarkupPlugin_RENAL() {
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
        invertDisplayById("MarkupDIv");
        if (getByid("MarkupDIv").style.display == "none")
            getByid("MarkupImgParent").style.position = "";
        else {
            getByid("MarkupImgParent").style.position = "relative";
            //onElementLeave();
        }
    };
}

function loadWriteTAG_RENAL() {
    loadMarkupPlugin_RENAL();
    var span = document.createElement("SPAN");
    span.innerHTML = `<img class="innerimg TAG" alt="writeTAG_RENAL" id="writeTAG_RENAL" src="../image/icon/lite/tag_RENAL.png" width="50" height="50">`;
    if (getByid("MarkupDIv").childNodes.length > 0)
        getByid("MarkupDIv").appendChild(document.createElement("BR"));
    getByid("MarkupDIv").appendChild(span);

    var span = document.createElement("SPAN");
    span.innerHTML = `<img class="img TAG" alt="exitTAG_RENAL" id="exitTAG_RENAL" onmouseover="onElementOver(this);" onmouseleave="onElementLeave();" src="../image/icon/lite/exit.png" width="50" height="50" style="display:none;" >`;
    addIconSpan(span);

    var span = document.createElement("SPAN");
    span.innerHTML = `<img class="img TAG" alt="saveTAG_RENAL" id="saveTAG_RENAL" onmouseover="onElementOver(this);" onmouseleave="onElementLeave();" src="../image/icon/lite/download.png" width="50" height="50" style="display:none;" >`;
    addIconSpan(span);

    var span = document.createElement("SPAN");
    span.innerHTML = `<div id="TagStyleDiv_RENAL" style="background-color:#30306044;">
        <span style="color: white;" id="medicalSpecialtyTagSpan_RENAL">Medical specialty：</span>
        <select id="medicalSpecialtyTag_RENAL">
        </select>
      </div>`;
    getByid("page-header").appendChild(span);
    getByid("TagStyleDiv_RENAL").style.display = "none";
}
loadWriteTAG_RENAL();

function readImageTags_RENAL(url) {
    let request = new XMLHttpRequest();
    request.open("GET", url);
    request.responseType = "text";
    request.send();
    request.onload = function () {
        if (request.readyState != 4) {
            return;
        }
        var responseJson = JSON.parse(request.responseText);
        let response = Object.entries(responseJson["medicalSpecialty"]);

        response.forEach((medicalSpecialityObject) => {
            let [key, value] = medicalSpecialityObject;

            let medicalSpecialtyName = value["name"];
            let selectField = document.getElementById(
                "medicalSpecialtyTag_RENAL"
            );
            let opt = document.createElement("option");
            opt.id = medicalSpecialtyName;
            opt.textContent = medicalSpecialtyName;
            selectField.appendChild(opt);

            let tagDiv = document.getElementById("TagStyleDiv_RENAL");
            let diseasesDiv = document.createElement("span"); //Medical specialty與Disease為單行(span)顯示；原先為'div'
            diseasesDiv.id = medicalSpecialtyName;
            diseasesDiv.style.color = "white";
            tagDiv.appendChild(diseasesDiv);

            if (
                medicalSpecialtyName === "R.E.N.A.L." &&
                typeof value["diseases"] === "object" &&
                !Array.isArray(value["diseases"])
            ) {
                let diseases = Object.entries(value["diseases"]);
                diseases.forEach((diseaseObject) => {
                    let [diseaseKey, diseaseValue] = diseaseObject;
                    let span = document.createElement("span");
                    let diseaseName = diseaseValue["name"];
                    span.id = "diseaseTagSpan_RENAL";
                    span.textContent = "Disease：" + diseaseName + " ";
                    diseasesDiv.appendChild(span);

                    let select = document.createElement("select");
                    select.id = "diseaseSelectorTag_RENAL" + diseaseKey;

                    diseasesDiv.appendChild(select);

                    diseaseValue["tags"].forEach((tag) => {
                        let opt = document.createElement("option");
                        opt.id = tag;
                        opt.textContent = tag;
                        select.appendChild(opt);
                    });
                });
            } else {
                // 標準數組結構處理
                let diseases = Array.isArray(value["diseases"])
                    ? value["diseases"]
                    : Object.entries(value["diseases"]);
                diseases.forEach((diseaseObject) => {
                    // 處理標準數組結構
                    let diseaseValue;
                    if (Array.isArray(value["diseases"])) {
                        diseaseValue = diseaseObject;
                    } else {
                        let [diseaseKey, val] = diseaseObject;
                        diseaseValue = val;
                    }

                    let span = document.createElement("span");
                    let diseaseName = diseaseValue["name"];
                    span.id = "diseaseTagSpan_RENAL";
                    span.textContent = "Disease：" + diseaseName + " ";
                    diseasesDiv.appendChild(span);

                    let select = document.createElement("select");
                    select.id =
                        "diseaseSelectorTag_RENAL" +
                        diseaseName.replace(/ /g, "");

                    let selectDiseaseTagNumber = document.querySelectorAll(
                        "[id^=diseaseSelectorTag_RENAL]"
                    ).length;
                    if (selectDiseaseTagNumber > 0) {
                        diseasesDiv.hidden = true;
                    }
                    diseasesDiv.appendChild(select);

                    diseaseValue["tags"].forEach((tag) => {
                        let opt = document.createElement("option");
                        opt.id = tag;
                        opt.textContent = tag;
                        select.appendChild(opt);
                    });
                });
            }
        });
    };
}
readImageTags_RENAL("../data/imageTags_RENAL.json");

getByid("medicalSpecialtyTag_RENAL").onchange = function () {
    let disabledDiseaseDiv = document
        .getElementById("TagStyleDiv_RENAL")
        .querySelectorAll("div");
    disabledDiseaseDiv.forEach((elem) => {
        elem.hidden = true;
    });

    let enabledDiseaseDiv = document.querySelectorAll(
        "div[id='" + this.value + "']"
    );
    enabledDiseaseDiv.forEach((elem) => {
        elem.hidden = false;
    });
};

getByid("exitTAG_RENAL").onclick = function () {
    getByid("saveTAG_RENAL").style.display = "none";
    getByid("exitTAG_RENAL").style.display = "none";
    img2darkByClass("TAG", true);
    getByid("TagStyleDiv_RENAL").style.display = "none";
    SetTable();
    displayMark();
    
    getByid("MouseOperation").click();
}

getByid("saveTAG_RENAL").onclick = function () {
    if (getByid("medicalSpecialtyTag_RENAL").value === "R.E.N.A.L.") {
        // 跳轉到 handleRENALTag_RENAL 處理
        handleRENALTag_RENAL();
        return;
    }

    function download_RENAL(text, name, type) {
        let a = document.createElement("a");
        let file = new Blob([text], {
            type: type,
        });
        a.href = window.URL.createObjectURL(file);
        a.download = name;
        a.click();
    }

    function download2_RENAL(text, name, type) {
        let a = document.createElement("a");
        let file = new File([text], name + ".xml", {
            type: type,
        });
        var xhr = new XMLHttpRequest();

        xhr.open("POST", ConfigLog.Xml2Dcm.Xml2DcmUrl, true);
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
        };
    }
    let index = SearchUid2Index(GetViewport().sop);
    let i = index[0],
        j = index[1],
        k = index[2];
    let sopUID = ImageManager.Study[i].Series[j].Sop[k].SOPInstanceUID;

    set_TAG_context_RENAL(index);

    if (ConfigLog.Xml2Dcm.enableXml2Dcm == true)
        download2_RENAL(
            String(get_TAG_context_RENAL()),
            "" + CreateRandom(),
            "text/plain"
        );
    else
        download_RENAL(
            String(get_TAG_context_RENAL()),
            sopUID + ".xml",
            "text/plain"
        );
};

getByid("writeTAG_RENAL").onclick = function () {
    cancelTools();

    getByid("MarkupDIv").style.display = "none";
    img2darkByClass("TAG", false);
    //this.src = '../image/icon/lite/tag_on.png';
    if (true) {
        getByid("saveTAG_RENAL").style.display = "";
        getByid("exitTAG_RENAL").style.display = "";
        getByid("TagStyleDiv_RENAL").style.display = "";
    }
    SetTable();
    displayMark();
};

var TAG_format_RENAL = `<?xml version="1.0" encoding="UTF-8"?>
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

var TAG_format_object_list_RENAL = [];

function set_TAG_context_RENAL(index) {
    TAG_format_object_list_RENAL = [];
    let temp = "" + TAG_format_RENAL;
    let i = index[0],
        j = index[1],
        k = index[2];

    function setTag(temp, replace, str, len) {
        if (str == undefined || str == null) str = "";
        str = "" + str;
        temp = temp.replace("___" + replace + "___", "" + str);
        var length = ("" + str).length;
        if (length % 2 != 0) length++;
        if (len == true)
            temp = temp.replace("___" + replace + "(len)___", length);
        return temp;
    }

    let selectedTag;
    let disabledDiseaseDivs = document
        .getElementById("TagStyleDiv_RENAL")
        .querySelectorAll("div");

    disabledDiseaseDivs.forEach((elem) => {
        if (elem.hidden === false) {
            //TODO Currently supported just only one disease
            let selector = elem.querySelectorAll(
                "[id^=diseaseSelectorTag_RENAL]"
            )[0];
            selectedTag = selector.value;
        }
    });
    let sopDcm = ImageManager.Study[i].Series[j].Sop[k];
    temp = setTag(temp, "SOPInstanceUID", sopDcm.SOPInstanceUID, true);
    temp = setTag(temp, "InstanceNumber", sopDcm.InstanceNumber, true);
    temp = setTag(
        temp,
        "StudyInstanceUID",
        ImageManager.Study[i].StudyInstanceUID,
        true
    );
    temp = setTag(temp, "ImageTag", selectedTag, true);
    TAG_format_object_list_RENAL.push(temp);
}

function get_TAG_context_RENAL() {
    var temp_str = "";
    for (var i = 0; i < TAG_format_object_list_RENAL.length; i++) {
        temp_str += TAG_format_object_list_RENAL[i];
    }
    return temp_str;
}

function handleRENALTag_RENAL() {
    console.log("handleRENALTag_RENAL");

    // 獲取當前視窗的 SeriesInstanceUID 和 StudyInstanceUID
    let index = SearchUid2Index(GetViewport().sop);
    let i = index[0],
        j = index[1],
        k = index[2];
    let sopUID = ImageManager.Study[i].Series[j].Sop[k].SOPInstanceUID;
    let seriesUID = ImageManager.Study[i].Series[j].SeriesInstanceUID;
    let studyUID = ImageManager.Study[i].StudyInstanceUID;

    // 獲取三個選擇器的值（使用簡化的ID）
    let eSelector = document.getElementById("diseaseSelectorTag_RENALE");
    let nSelector = document.getElementById("diseaseSelectorTag_RENALN");
    let lSelector = document.getElementById("diseaseSelectorTag_RENALL");

    let eValue = eSelector ? eSelector.value : "";
    let nValue = nSelector ? nSelector.value : "";
    let lValue = lSelector ? lSelector.value : "";

    // XML escape function（使用 DOM 自動處理特殊字元）
    function escapeXML(value) {
        let div = document.createElement("div");
        div.appendChild(document.createTextNode(value));
        return div.innerHTML;
    }

    function parseTag(tagStr) {
        const match = tagStr.match(/^\((\d+)pt\)(.+)$/);
        if (match) {
            console.log(match[1], match[2]);
            return { score: parseInt(match[1], 10), desc: match[2].trim() };
        }
        return { score: null, desc: tagStr };
    }
    // 對值進行轉換，避免 < > & 等特殊字元破壞 XML
    let eValueEscaped = parseTag(escapeXML(eValue));
    let nValueEscaped = parseTag(escapeXML(nValue));
    let lValueEscaped = parseTag(escapeXML(lValue));
    // let eValueEscaped = escapeXML(eValue);
    // let nValueEscaped = escapeXML(nValue);
    // let lValueEscaped = escapeXML(lValue);

    // 生成 XML 內容
    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
    <file-format>
        <meta-header xfer="1.2.840.10008.1.2.1" name="Little Endian Explicit">
            <element tag="0002,0013" vr="SH" vm="1" len="10" name="ImplementationVersionName">BlueLight</element>
        </meta-header>
        <data-set xfer="1.2.840.10008.1.2.1" name="Little Endian Explicit">
            <element tag="0004,1430" vr="CS" vm="1" len="6" name="DirectoryRecordType">IMAGE</element>
            <element tag="0008,0018" vr="UI" vm="1" len="${sopUID.length}" name="SOPInstanceUID">${sopUID}</element>
            <element tag="0020,000E" vr="UI" vm="1" len="${seriesUID.length}" name="SeriesInstanceUID">${seriesUID}</element>
            <element tag="0020,000D" vr="UI" vm="1" len="${studyUID.length}" name="StudyInstanceUID">${studyUID}</element>
            <element tag="0040,a043" vr="SQ" vm="1" name="ConceptNameCodeSequence">
                <item>
                    <element tag="0008,0100" vr="SH" vm="1" len="${eValueEscaped.length}" name="RENAL_E" score="${eValueEscaped.score}">${eValueEscaped.desc}</element>
                    <element tag="0008,0102" vr="SH" vm="1" len="${nValueEscaped.length}" name="RENAL_N" score="${nValueEscaped.score}">${nValueEscaped.desc}</element>
                    <element tag="0008,0104" vr="LO" vm="1" len="${lValueEscaped.length}" name="RENAL_L" score="${lValueEscaped.score}">${lValueEscaped.desc}</element>
                </item>
            </element>
        </data-set>
    </file-format>`;

    // 下載 XML 文件
    function download_RENAL(text, name, type) {
        let a = document.createElement("a");
        let file = new Blob([text], { type: type });
        a.href = window.URL.createObjectURL(file);
        a.download = name;
        a.click();
    }

    download_RENAL(xmlContent, sopUID + "_RENAL.xml", "text/xml");
    getByid("MouseOperation").click();
}
