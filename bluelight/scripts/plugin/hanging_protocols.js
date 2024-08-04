//test version ! ! !
//test version ! ! !
//test version ! ! !

function getQueryVariable_HaningProtocols(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return false;
}

function displayHaningProtocols(viewportNum = viewportNumber) {
    getByid("HaningProtocolsDIV").style['display'] = "";
}

function createHaningProtocolsDIV(viewportNum = viewportNumber) {
    var DIV = document.createElement("DIV");
    DIV.id = "HaningProtocolsDIV";
    DIV.setAttribute("border", 2);
    DIV.style = "border-collapse:collapse";
    DIV.style.color = "#ffffff";
    DIV.style.position = "absolute";
    DIV.style.backgroundColor = "black";
    DIV.style['zIndex'] = "105";
    DIV.style['width'] = DIV.style['height'] = "100%";
    DIV.style['left'] = DIV.style['top'] = "0px";
    DIV.style['font-size'] = "x-large";
    DIV.style['line-height'] = "36px";
    DIV.style['paddingLeft'] = DIV.style['paddingTop'] = "12px";
    DIV.style['display'] = "none";
    GetViewport(viewportNum).div.appendChild(DIV);

    function addRow(container, type, text, content, name) {
        function htmlEntities(str) {
            if (str == undefined || str == null) str = "";
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace("\r\n", "<br/>").replace("\n", "<br/>");
        }

        var row = document.createElement("div");
        row.name = name;
        if (type == "if") row.className = "HeHaningProtocols_if";
        else if (type == "then") row.className = "HeHaningProtocols_then";

        var checkbox = document.createElement("input");
        checkbox.type = checkbox.className = "checkbox";
        checkbox.style.transform = "scale(1.5)";
        var label = document.createElement("label");
        label.innerHTML = "&#9;&#9;" + htmlEntities(text) + "&#9;&#9;";
        var textbox = document.createElement("input");
        textbox.type = textbox.className = "text";
        textbox.value = content ? content : "";
        row.appendChild(checkbox);
        row.appendChild(label);
        row.appendChild(textbox);
        container.appendChild(row);
    }

    function addText(container, text) {
        var row = document.createElement("div");
        var label = document.createElement("label");
        label.innerText = "" + text;
        row.appendChild(label);
        container.appendChild(row);
    }

    function addButton(container) {
        var button_Exit = document.createElement("button");
        button_Exit.style['font-size'] = "x-large";
        button_Exit.style['width'] = "100px";
        button_Exit.innerText = " Exit ";
        button_Exit.onclick = function () {
            getByid("HaningProtocolsDIV").style['display'] = "none";
            img2darkByClass("HP", true);
        }

        var button_Export = document.createElement("button");
        button_Export.style['font-size'] = "x-large";
        button_Export.style['width'] = "100px";
        button_Export.innerText = " Export ";
        button_Export.onclick = function () {
            var json = {};
            json.if = [];
            json.then = [];
            for (var row of getClass("HeHaningProtocols_if")) {
                var checkbox = row.getElementsByClassName("checkbox");
                if (checkbox && checkbox[0] && checkbox[0].checked) {
                    json.if.push({ name: row.name, value: row.getElementsByClassName("text")[0].value });
                }
            }
            for (var row of getClass("HeHaningProtocols_then")) {
                var checkbox = row.getElementsByClassName("checkbox");
                if (checkbox && checkbox[0] && checkbox[0].checked) {
                    json.then.push({ name: row.name, value: row.getElementsByClassName("text")[0].value });
                }
            }

            function exportJSONFile(json) {
                var jsonData = JSON.stringify(json);
                function download(content, fileName, contentType) {
                    var a = document.createElement("a");
                    var file = new Blob([content], { type: contentType });
                    a.href = URL.createObjectURL(file);
                    a.download = fileName;
                    a.click();
                }
                download(jsonData, 'HaningProtocols.json', 'text/plain');
            }
            exportJSONFile(json);
        }

        container.appendChild(button_Export);
        container.appendChild(document.createTextNode(" "));
        container.appendChild(button_Exit);
    }
    addText(getByid("HaningProtocolsDIV"), "If:");
    addRow(getByid("HaningProtocolsDIV"), "if", "Modality is:", "CT", "Modality");
    addText(getByid("HaningProtocolsDIV"), "Then:");
    addRow(getByid("HaningProtocolsDIV"), "then", "Set scale:", "2", "Scale");
    getByid("HaningProtocolsDIV").appendChild(document.createElement("BR"));
    addButton(getByid("HaningProtocolsDIV"));
}

function loadHaningProtocols() {
    if (getQueryVariable_HaningProtocols("HaningProtocols") == false) return;
    var span = document.createElement("SPAN");
    span.innerHTML =
        `<img class="innerimg HP" alt="Haning Protocols" id="HaningProtocols" onmouseover = "onElementOver(this);" onmouseleave = "onElementLeave();" src="../image/icon/lite/H.png" width="50" height="50">;`;
    getByid("othereDIv").appendChild(document.createElement("BR"));
    getByid("othereDIv").appendChild(span);
    BorderList_Icon.push("HaningProtocols");

    getByid("HaningProtocols").onclick = function () {
        hideAllDrawer();
        displayHaningProtocols();
        img2darkByClass("HP", false);
    }
    createHaningProtocolsDIV();
}

loadHaningProtocols();