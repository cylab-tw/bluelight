

var KeyObjecyList = [];
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

VIEWPORT.SelectKeyObejctIcon = function (element, image, viewportNum) {
    var inKO = false;
    for (var KO of KeyObjecyList) {
        if (KO.sopInstanceUid == GetViewport().content.image.SOPInstanceUID) {
            inKO = true;
        }
    }
    if (inKO) getByid("KOSelectImg").style.filter = "brightness(80%) sepia(10) saturate(10) hue-rotate(0deg)";
    else getByid("KOSelectImg").style.filter = "none";
}

function loadKeyObjecyPlugin() {
    loadMarkupPlugin();
    var span = document.createElement("SPAN");
    span.innerHTML = `<img class="innerimg" alt="KeyObjecy" id="KeyObjecyImg" onmouseover = "onElementOver(this);" onmouseleave = "onElementLeave();" src="../image/icon/lite/b_ko.png" width="50" height="50">;`;
    if (getByid("MarkupDIv").childNodes.length > 0) getByid("MarkupDIv").appendChild(document.createElement("BR"));
    getByid("MarkupDIv").appendChild(span);

    getByid("KeyObjecyImg").onclick = function () {
        getByid("MarkupDIv").style.display = "none";
        if (getByid("KOSelectImg").style.display == "none") {
            getByid("KOSelectImg").style.display = "";
            KeyObjecyList = [];
            VIEWPORT.loadViewportList.push('SelectKeyObejctIcon');
            VIEWPORT.SelectKeyObejctIcon();
            return;
        }
        VIEWPORT.loadViewportList = VIEWPORT.loadViewportList.filter(function (item) { return item !== "SelectKeyObejctIcon"; });

        getByid("KOSelectImg").style.display = "none";
        try {
            const mockStudyInfo = {
                PatientName: GetViewport().content.image.PatientName,
                PatientBirthDate: GetViewport().content.image.data.string(Tag.PatientBirthDate),
                PatientSex: GetViewport().content.image.data.string(Tag.PatientSex),
                PatientID: GetViewport().content.image.data.string(Tag.PatientID),
                StudyID: GetViewport().content.image.data.string(Tag.StudyID),
                ReferringPhysicianName: GetViewport().content.image.data.string(Tag.ReferringPhysicianName),
                ReferencedPerformedProcedureStepSequence: GetViewport().content.image.data.string(Tag.ReferencedPerformedProcedureStepSequence),
                StudyInstanceUID: GetViewport().content.image.StudyInstanceUID,
                StudyDate: GetViewport().content.image.data.string(Tag.StudyDate)
            };

            // 產生 KOS
            const buffer = generateKOS(mockStudyInfo, KeyObjecyList, 'Browser Generated KOS');

            // 觸發瀏覽器下載
            const blob = new Blob([buffer], { type: 'application/dicom' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'kos-browser-test.dcm';
            document.body.appendChild(link);
            link.click();

            // 清理
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } catch (e) {
            console.error(e);
        }
    }
    var img = createElem("IMG", "KOSelectImg")
    img.src = "../image/icon/lite/b_ko.png"; img.className = "closeBtn";
    img.style.position = "absolute"; img.style.zIndex = "80";
    img.style.top = "var(--leftLabelPadding)"; img.style.right = "var(--rightLabelPadding)";
    getByid("DicomPage").appendChild(img);
    img.onclick = function () {
        KeyObjecyList.push(
            {
                sopClassUid: '1.2.840.10008.5.1.4.1.1.2', // CT Image Storage
                sopInstanceUid: GetViewport().content.image.SOPInstanceUID,
                seriesInstanceUid: GetViewport().content.image.SeriesInstanceUID
            }
        )
        VIEWPORT.SelectKeyObejctIcon();
    }
    img.style.display = "none";
}
loadKeyObjecyPlugin();

function generateKOS(studyInfo, referencedImages, description) {

    const kosInstanceUid = dcmjs.data.DicomMetaDictionary.uid();
    const seriesInstanceUid = dcmjs.data.DicomMetaDictionary.uid();
    const now = new Date();
    const dateStr = now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
    const timeStr = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0') + String(now.getSeconds()).padStart(2, '0');

    // 1. 定義 Dataset (JSON 格式)
    const dataset = {
        // --- Patient & Study (必須與原圖一致) ---
        PatientName: studyInfo.PatientName,
        PatientID: studyInfo.PatientID,
        StudyInstanceUID: studyInfo.StudyInstanceUID,
        StudyDate: studyInfo.StudyDate || dateStr,
        StudyTime: studyInfo.StudyTime || timeStr,
        AccessionNumber: studyInfo.AccessionNumber || '',

        // --- Series (KOS 獨立 Series) ---
        Modality: 'KO',
        SeriesInstanceUID: seriesInstanceUid,
        SeriesNumber: 999,
        SeriesDescription: description,
        SeriesDate: dateStr,
        SeriesTime: timeStr,

        // --- Instance ---
        SOPClassUID: '1.2.840.10008.5.1.4.1.1.88.59', // KOS Storage UID
        SOPInstanceUID: kosInstanceUid,
        InstanceNumber: 1,
        ContentDate: dateStr,
        ContentTime: timeStr,
        Manufacturer: 'Browser KOS Generator',

        // --- KOS Specific ---
        ValueType: 'CONTAINER',
        ContinuityOfContent: 'SEPARATE',
        ConceptNameCodeSequence: [{
            CodeValue: '113000',
            CodingSchemeDesignator: 'DCM',
            CodeMeaning: 'Of Interest'
        }],

        // 放入被選取的影像引用
        ContentSequence: []
    };

    // 2. 填充影像引用 (Content Sequence)
    referencedImages.forEach((img, index) => {
        dataset.ContentSequence.push({
            RelationshipType: 'CONTAINS',
            ValueType: 'IMAGE',
            ReferencedSOPSequence: [{
                ReferencedSOPClassUID: img.sopClassUid,
                ReferencedSOPInstanceUID: img.sopInstanceUid
            }]
        });
    });

    // 3. 填充 Evidence Sequence (讓 PACS 知道這些引用屬於哪個 Study)
    // 簡單起見，假設所有影像都在同一個 Series
    if (referencedImages.length > 0) {
        dataset.CurrentRequestedProcedureEvidenceSequence = [{
            StudyInstanceUID: studyInfo.StudyInstanceUID,
            ReferencedSeriesSequence: [{
                SeriesInstanceUID: referencedImages[0].seriesInstanceUid,
                ReferencedSOPSequence: referencedImages.map(img => ({
                    ReferencedSOPClassUID: img.sopClassUid,
                    ReferencedSOPInstanceUID: img.sopInstanceUid
                }))
            }]
        }];
    }

    // 4. 編碼 (Encoding)
    // 定義 File Meta Information (Header)
    const meta = {
        FileMetaInformationVersion: new Uint8Array([0, 1]),
        MediaStorageSOPClassUID: dataset.SOPClassUID,
        MediaStorageSOPInstanceUID: dataset.SOPInstanceUID,
        TransferSyntaxUID: '1.2.840.10008.1.2.1', // Explicit VR Little Endian
        ImplementationClassUID: dcmjs.data.DicomMetaDictionary.uid(),
        ImplementationVersionName: 'DCMJS_BROWSER'
    };

    // 將 JSON 轉為 dcmjs 內部格式
    const denaturalizedMeta = dcmjs.data.DicomMetaDictionary.denaturalizeDataset(meta);
    const denaturalizedDataset = dcmjs.data.DicomMetaDictionary.denaturalizeDataset(dataset);

    // 合併 Header 和 Body
    const dicomDict = new dcmjs.data.DicomDict(denaturalizedMeta);
    dicomDict.dict = denaturalizedDataset;

    // 寫入二進位 Buffer
    const buffer = dicomDict.write();

    return buffer;
}
