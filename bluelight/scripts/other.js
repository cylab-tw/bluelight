config = window.customWebWorkerConfig;
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.configure({
  beforeSend: function (xhr) {
  }
});
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