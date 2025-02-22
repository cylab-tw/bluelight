let PLUGIN = {};
PLUGIN.List = [];

PLUGIN.loadScript = function (path, name, scriptType) {
    if (scriptType && scriptType == "module") {
        var script = document.createElement('script');
        script.src = path;
        script.type = 'module';
        document.getElementsByTagName('head')[0].appendChild(script);
        PLUGIN[name] = true;
    } else {
        var script = document.createElement('script');
        script.src = path;
        script.type = 'text/javascript';
        document.getElementsByTagName('head')[0].appendChild(script);
        PLUGIN[name] = true;
    }
}

onloadFunction.push(
    function () {
        function sleep(time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        }
        var request = new XMLHttpRequest();
        request.open('GET', "../data/plugin.json");
        request.responseType = 'text';
        request.send();
        request.onload = function () {
            if (request.readyState != 4)  { return; }
            var responseJson = JSON.parse(request.responseText);
            var plugins = responseJson["plugin"];
            plugins = plugins.sort((a, b) => a.value - b.value);
            for (var i = 0; i < plugins.length; i++) {
                const plugin = plugins[i];
                var str_disableCatch = plugin.disableCatch == "true" ? "?" + parseInt(Math.random() * 9999) : "";
                sleep(150 * (i + 1)).then(() => { PLUGIN.loadScript(plugin.path + str_disableCatch, plugin.name, plugin.scriptType); })
            }
        }
        /*PLUGIN.loadScript("../scripts/plugin/mpr.js", "MPR");
        PLUGIN.loadScript("../scripts/plugin/vr.js", "VR");
        PLUGIN.loadScript("../scripts/plugin/xml_format.js", "xml_format");
        PLUGIN.loadScript("../scripts/plugin/graphic_annotation.js", "graphic_annotation");
        PLUGIN.loadScript("../scripts/plugin/rtss.js", "rtss");
        PLUGIN.loadScript("../scripts/plugin/seg.js", "seg");*/
    });

PLUGIN.PushLoadViewportList = function (fun) {
    VIEWPORT[fun.name] = fun;
    VIEWPORT.loadViewportList.push(fun.name);
}

PLUGIN.RemoveLoadViewportList = function (funName) {
    VIEWPORT.loadViewportList = VIEWPORT.loadViewportList.filter(name => name != funName);
}

PLUGIN.PushMarkList = function (fun) {
    MARKER[fun.name] = fun;
    MARKER.drawMarkList.push(fun.name);
}

PLUGIN.RemoveMarkList = function (funName) {
    MARKER.drawMarkList = MARKER.drawMarkList.filter(name => name != funName);
}