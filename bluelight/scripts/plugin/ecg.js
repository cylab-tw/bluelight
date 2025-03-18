
function loadECG() {
    var span = document.createElement("SPAN");
    span.innerHTML =
        `<div id="ECGOptionsDIV">
            <label>Zoom：</label>
            <select id="ECGSpeedSelect">
              <option>12.5 mm/s</option><option>25 mm/s</option><option>50 mm/s</option><option>100 mm/s</option>
            </select>
            <select id="ECGVoltageSelect">
              <option>3 mm/mV</option><option>5 mm/mV</option><option >10 mm/mV</option>
              <option>15 mm/mV</option><option>20 mm/mV</option><option>30 mm/mV</option>
            </select>
          </div>`;
    getByid("EcgPage").appendChild(span);
    if (location.search.includes("ecgtest=true")) openECG = true;
}
onloadFunction.push2First(loadECG);

function EcgLoader(Sop) {
    Pages.displayPage("EcgPage");
    img2darkByClass("ecg", false);
    leftLayout.setAccent(Sop.parent.SeriesInstanceUID);
    if (!getByid("EcgView")) {
        var EcgView = document.createElement("div");
        EcgView.id = "EcgView";
        getByid("EcgPage").appendChild(EcgView);
        var EcgLabel = document.createElement("label");
        EcgLabel.style.position = "absolute";
        EcgLabel.style.fontSize = "48px";
        EcgLabel.style.zIndex = "10";
        EcgLabel.style.backgroundColor = "white";
        EcgLabel.innerText = "This is a test version.";
        getByid("EcgPage").appendChild(EcgLabel);
    }
    if (!getByid("EcgCanvas")) {
        var EcgCanvas = document.createElement("CANVAS");
        EcgCanvas.id = "EcgCanvas";

        getByid("EcgView").appendChild(EcgCanvas);
    }

    var ECGSpeedSelect = getByid("ECGSpeedSelect"), ECGVoltageSelect = getByid("ECGVoltageSelect");
    for (var opt of ECGSpeedSelect.options)
        if (parseFloat(opt.text) == 25) opt.setAttribute("selected", "selected");
    for (var opt of ECGVoltageSelect.options)
        if (parseFloat(opt.text) == 10) opt.setAttribute("selected", "selected");

    ECGSpeedSelect.onchange = function () { EcgLoader(GetViewport().Sop); }
    ECGVoltageSelect.onchange = function () { EcgLoader(GetViewport().Sop); }


    const speed = parseFloat(ECGSpeedSelect.options[ECGSpeedSelect.selectedIndex].text);
    const voltage = parseFloat(ECGVoltageSelect.options[ECGVoltageSelect.selectedIndex].text);
    var Channels12 = Sop.Image.NumberOfWaveformChannels;
    var NumberOfWaveformSamples = Sop.Image.NumberOfWaveformSamples;
    var WaveformData = Sop.Image.ReconstructionWaveformData;

    const totalSecnods = NumberOfWaveformSamples / Sop.Image.SamplingFrequency; //總共幾秒
    const NumberOfbigBlock = totalSecnods / ((1 / speed) * 5); //總共要有幾個大方塊
    const NumberOfsmallBlock = totalSecnods / (1 / speed); //總共要有幾個小方塊
    const bigBlockSize = 6 * 5;//橫向每隔多遠畫一條大方塊線
    const smallBlockSize = 6;//橫向每隔多遠畫一條小方塊線

    const VBigLineGap = voltage * 6 * smallBlockSize; //v*6小格的距離作分隔線，一格smallBlockSize(6px)大小
    const A4Width = totalSecnods * (speed) * 6, //總秒數*(幾格1秒)*(1格6像素)
        A4Height = voltage * 6 * 6 * Channels12; //一小格6像素，共6格，分12導程高度要多高

    var EcgCanvas = getByid("EcgCanvas");
    EcgCanvas.width = A4Width, EcgCanvas.height = A4Height;
    var ctx = EcgCanvas.getContext("2d");
    var imgData = ctx.createImageData(EcgCanvas.width, EcgCanvas.height);
    new Uint32Array(imgData.data.buffer).fill(0xFFFFFFFF);
    ctx.putImageData(imgData, 0, 0);

    //////////////////

    //粗線
    ctx.strokeStyle = ctx.fillStyle = "rgb(222,113,104)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    //橫向
    for (var i = 0; i < A4Height; i += VBigLineGap) {
        ctx.moveTo(0, i);
        ctx.lineTo(A4Width, i);
    }
    ctx.stroke();
    ctx.closePath();

    //開始畫大方塊
    ctx.strokeStyle = ctx.fillStyle = "rgb(222,113,104)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    //橫向
    for (var i = 0; i < NumberOfbigBlock; i++) {
        ctx.moveTo(i * bigBlockSize, 0);
        ctx.lineTo(i * bigBlockSize, A4Height);
    }
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    //縱向
    for (var i = 0; i < A4Height / bigBlockSize; i++) {
        ctx.moveTo(0, i * bigBlockSize);
        ctx.lineTo(A4Width, i * bigBlockSize);
    }
    ctx.stroke();
    ctx.closePath();

    ///////////////////////

    //開始畫小方塊
    ctx.strokeStyle = ctx.fillStyle = "rgb(222,113,104)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    //橫向
    for (var i = 0; i < NumberOfsmallBlock; i++) {
        ctx.moveTo(i * smallBlockSize, 0);
        ctx.lineTo(i * smallBlockSize, A4Height);
    }
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    //縱向
    for (var i = 0; i < A4Height / smallBlockSize; i++) {
        ctx.moveTo(0, i * smallBlockSize);
        ctx.lineTo(A4Width, i * smallBlockSize);
    }
    ctx.stroke();
    ctx.closePath();

    ///////////////////////////
    //畫心電圖
    ctx.strokeStyle = ctx.fillStyle = "rgb(0,0,0)";
    ctx.lineWidth = 1;
    var start = VBigLineGap / 2;

    for (var i = 0; i < Channels12; i++) {
        ctx.beginPath();
        ctx.moveTo(0, start + i * VBigLineGap);
        for (var j = i, s = 0; j < NumberOfWaveformSamples * Channels12; j += Channels12, s++) {
            ctx.lineTo((s / NumberOfWaveformSamples) * speed * totalSecnods * 6,
                start + i * VBigLineGap - ((WaveformData[j] * 6 * voltage)));
        }

        ctx.stroke();
        ctx.closePath();
    }
}

function setECG(imageObj) {
    if (!imageObj.data.elements[Tag.WaveformSequence]) throw "WaveformSequence not found";
    var WaveformSequence = imageObj.data.elements[Tag.WaveformSequence];
    for (var i = 0; i < WaveformSequence.items.length; i++) {
        if (WaveformSequence.items[i].dataSet.string(Tag.WaveformOriginality) == 'ORIGINAL') {
            //Samples
            imageObj.NumberOfWaveformSamples = WaveformSequence.items[i].dataSet.int16(Tag.NumberOfWaveformSamples);
            //12
            imageObj.NumberOfWaveformChannels = WaveformSequence.items[i].dataSet.int16(Tag.NumberOfWaveformChannels);
            //BitsAllocated
            imageObj.WaveformBitsAllocated = WaveformSequence.items[i].dataSet.int16(Tag.WaveformBitsAllocated);
            //SamplingFrequency
            imageObj.SamplingFrequency = WaveformSequence.items[i].dataSet.intString(Tag.SamplingFrequency);
            //WaveformData.length=Samples*12*(BitsAllocated/8)
            var WaveformData = WaveformSequence.items[i].dataSet.elements[Tag.WaveformData];

            imageObj.FilterHighFrequency = WaveformSequence.items[i].dataSet.elements[Tag.ChannelDefinitionSequence].items[0].dataSet.intString(Tag.FilterHighFrequency);
            imageObj.FilterLowFrequency = WaveformSequence.items[i].dataSet.elements[Tag.ChannelDefinitionSequence].items[0].dataSet.intString(Tag.FilterLowFrequency);
            imageObj.ChannelSensitivity = WaveformSequence.items[i].dataSet.elements[Tag.ChannelDefinitionSequence].items[0].dataSet.intString(Tag.ChannelSensitivity);
            //check
            if (WaveformData.length != imageObj.NumberOfWaveformSamples * imageObj.NumberOfWaveformChannels * (imageObj.WaveformBitsAllocated / 8))
                throw "WaveformData parsing failed";

            var WaveformDataOffset = WaveformSequence.items[0].dataSet.elements[Tag.WaveformData].dataOffset;
            var WaveformDataLength = WaveformSequence.items[0].dataSet.elements[Tag.WaveformData].length;
            switch (imageObj.WaveformBitsAllocated) {
                case 8: imageObj.WaveformData = new Int8Array(imageObj.data.byteArray.buffer.slice(WaveformDataOffset, WaveformDataOffset + WaveformDataLength * 1)); break;
                case 16: imageObj.WaveformData = new Int16Array(imageObj.data.byteArray.buffer.slice(WaveformDataOffset, WaveformDataOffset + WaveformDataLength * 1)); break;
                case 32: imageObj.WaveformData = new Int32Array(imageObj.data.byteArray.buffer.slice(WaveformDataOffset, WaveformDataOffset + WaveformDataLength * 1)); break;
                default: throw "WaveformData parsing failed";
            }
            imageObj.ReconstructionWaveformData = new Float32Array(imageObj.WaveformData.length);

            for (var w = 0; w < imageObj.WaveformData.length; w++) {
                imageObj.ReconstructionWaveformData[w] = imageObj.WaveformData[w] / (imageObj.ChannelSensitivity ? imageObj.ChannelSensitivity : 1);
                if (!isNaN(imageObj.FilterHighFrequency) && !isNaN(imageObj.FilterLowFrequency))
                    imageObj.ReconstructionWaveformData[w] = (imageObj.ReconstructionWaveformData[w] - imageObj.FilterLowFrequency) / (imageObj.FilterHighFrequency - imageObj.FilterLowFrequency);
            }
            return;
        }
    }
    if (WaveformSequence.items.length == 0) throw "WaveformOriginality not found";
    throw "ORIGINAL WaveformOriginality not found";
}