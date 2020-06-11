let webWorkerUrl = '../scripts/external/threejs/cornerstoneWADOImageLoaderWebWorker.min.js';
let codecsUrl = './cornerstoneWADOImageLoaderCodecs.js';
let webWorkerTaskPath = './convolveTask.js';
window.customWebWorkerConfig = {
  maxWebWorkers: navigator.hardwareConcurrency || 1,
  startWebWorkersOnDemand: true,
  webWorkerPath: webWorkerUrl,
  webWorkerTaskPaths: [webWorkerTaskPath],
  taskConfiguration: {
    decodeTask: {
      loadCodecsOnStartup: true,
      initializeCodecsOnStartup: false,
      codecsPath: codecsUrl,
      usePDFJS: false
    }
  }
};

cornerstoneWebImageLoader.external.cornerstone = cornerstone;
cornerstoneWebImageLoader.configure({
  beforeSend: function (xhr) {
  }
});
config = window.customWebWorkerConfig;
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.webWorkerManager.initialize(config);/*
*/
function getBlobUrl(url) {
  const baseUrl = window.URL || window.webkitURL;
  const blob = new Blob([`importScripts('${url}')`], { type: 'application/javascript' });
  return baseUrl.createObjectURL(blob);
}

function UrlExists(url) {
  const http = new XMLHttpRequest();
  http.open('HEAD', url, false);
  http.send();
  return http.status !== 404;
}