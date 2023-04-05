<div> 
  <div style="float: left;width: 15%;"><img src="https://raw.githubusercontent.com/cylab-tw/bluelight/master/bluelight/image/icon/black/BLLogoSmall.png" width="90px"></div>
  <div style="float: left;width: 85%;"><h1>BlueLight Web-based DICOM Viewer (BlueLight Viewer)</h1> 
</div>
<p><strong>Blue Light</strong> is a browser-based medical image viewer is primarily maintained by the <a href="https://cylab.dicom.tw/">Imaging Informatics Labs</a>. It is a pure single-page application (SPA), lightweight, and using only JavaScript and HTML5 technologies so as to deploy it on any HTTP server easily (just put it in HTTP server). It supports not only opening local data, but also connecting to medical image archives which support <a href="https://www.dicomstandard.org/dicomweb/">DICOMweb</a>. It can display the various image markups and annotations such as Annotation and Image Markup (AIM), DICOM-RT structure set (RTSS), DICOM Overlay, and DICOM Presentation State. It provides tools for medical image interpretation and 3D image reconstruction, e.g., Multiplanar Rreformation or Reconstruction (MPR) and Volume Rendering (VR).</p>

<a href="https://blsearch.dicom.tw"><strong>Live DEMO</strong></a>&ensp;&ensp;&ensp;
<a href="https://bl.dicom.tw"><strong>Online Viewer</strong></a>&ensp;&ensp;&ensp;
<a href="https://youtu.be/UkZt_Qbw1Rk"><strong> Video - Basic operation</strong></a> &ensp;&ensp;&ensp;
<a href="https://youtu.be/N2VLWxpTWjg"><strong> Video - Labeling tools</strong></a> 


## Install
* Put all files into any directory in the static directory on any HTTP server.

## DICOMWeb Configuration
* go to `./bluelight/data/config.json` and change the configuration of DICOM server.
 - **Reminder** the DICOMWeb Plugin of the DICOM server shall be installed first. 
 
## About
* BlueLight是少數能在網頁上顯示3D VR、MIP及MPR的開源DICOM瀏覽系統，它擁有平易近人的操作介面並支援RWD及Web零足跡瀏覽，可在任意大小的裝置上執行。
* 標記顯示方面支援RTSS、Overlay、Graphic Annotation、AIM等標記，亦可於3D系統中轉換成3D標記。
* 此專案亦支援LabelImg格式的標記繪製。
* 3D VR顯示模式支援染色、窗度、透明、壓縮、貼皮、內插、降噪、打光、挖洞及最大密度投影，針對骨骼及肺氣管有專門的顯示模式，MPR模式則支援內插、貼皮、染色以及3D切面的顯示。
* 通過台灣醫學資訊聯測 MI-TW 2020 - Track 4: DICOMWeb Query/Retrieve Consumer

## Key Features
### Network support
* Load local files
* Integration with any DICOMWeb Image Archive, including Raccoon, Orthanc, and dcm4chee server
  - Retrieve methods: WADO-URI (as default) and WADO-RS: specify one of them in config.json
* Integration with XNAT by plugin [xnat.js](/bluelight/scripts/plugin/xnat.js). BlueLight will query the XNAT's API to get the XML and retrieve the DICOM stored in experiments and its scans. Currently we doesn't build it as an XNAT plugin. [issue: XNAT Connection](https://github.com/cylab-tw/bluelight/issues/11)
  - Step1: copy BlueLight to XNAT deployment folder
  - Step2: type URL: https://{XNAT's hostname}/bluelight/search/html/start.html?experiments={XNAT expID}&scans={scanID}&format=json

```html
  http://{XNAT's hostname}/REST/projects/test/subjects/XNAT_S00001/experiments/XNAT_E00002/scans/1/files?format=json
```

### Support IODs
* Most general image IODs (CR, DX, CT, MR, US, etc)
* PDF

### Mative features for 2D image interpretation 
* Pan, zoom, move
* Scroll images within a series
* Rotation, Flip, Invert
* Windowing
* Cine
* viewports:  4×4
* Cross-Studies synchronization
* Magnifier, etc
* Line and angle measurement
* hide/display markups and annotations
* Export image

### supported the display of the kinds of markups and annotations
* GSPS: DICOM Graphic Annotation
* DICOM Overlay
* DICOM-RT structure set (RTSS)
* Annotation and Image Markup (AIM)
* DICOM SEG (Segementation)
* [LabelImg](https://github.com/tzutalin/labelImg)
* *Provide the function to convert the DICOM Overalys to a DICOM SEG object.*

## Plugin 
* Some advanced features are separated from the native parts of Bluelight to facilitate better performance. All supported functions are placed in folder `/scripts/plugin`. Using the [config](/bluelight/data/plugin.json) enable the selected plugins. If disableCatch is set as false, the plugin is enabled.

```json
{
    "plugin": [
    /*  path: the location of plugin
     *  name: the name of plugin
     *  disableCatch: enable the plugin or not.
     *  examples show as follows:        
     * /
        {"path":"../scripts/plugin/oauth.js", "name": "oauth", "disableCatch": "true"},
        {"path":"../scripts/plugin/mpr.js", "name": "MPR", "disableCatch": "true"},        
    ]
}

```
* We welcome any idea of adding new plugins from any third party, such as:
  - Create the customized annotations encoded as a xml - see [xml_format.js](/bluelight/scripts/plugin/xml_format.js)
  
### Plugin: Authentication
* OAuth2 - see [oauth.js](/bluelight/scripts/plugin/oauth.js). If OAuth2 is enabled, and then modify the [config](/bluelight/data/configOAuth.json). 
   - **Note:** we used Keycloak to test the function of OAuth2.

```json
{
    "enabled":false,
    "hostname":"127.0.0.1",
    "port":"8080",
    "http":"http",
    "client_id":"account",
    "endpoints":
    {
        "auth":"realms/TestRealm/protocol/openid-connect/auth",
        "validation":"realms/TestRealm/protocol/openid-connect/userinfo", 
        "token":"realms/TestRealm/protocol/openid-connect/token" 
    },
    "tokenInRequest":true
}
```
### Plugin : 3D Post-Processing
* MPR (Multiplanar Reconstruction) - see [mpr.js](/bluelight/scripts/plugin/mpr.js)
* MIP (maximum intensity projection) - implemented in MPR 
* 3D Volume Rendering - see [vr.js](/bluelight/scripts/plugin/vr.js)

### Plugin : Labeling tool interfaces (on experiment state)
* [LabelImg](https://github.com/tzutalin/labelImg)
* GSPS: DICOM Graphic Annotation - see [graphic_annotation.js](/bluelight/scripts/plugin/graphic_annotation.js)
* DICOM-RT structure set (RTSS) - see [rtss.js](/bluelight/scripts/plugin/rtss.js)
* DICOM SEG (Segementation) - see [seg.js](/bluelight/scripts/plugin/seg.js)
  - **Download as DCMTK DICOM-XML**: only launch BlueLight
  - **Download as DIOCM SEG**: It is integrated with [Raccoon.net](https://github.com/cylab-tw/raccoon). Please put the BlightLight on Raccoon.

### Plugin : General
* Display DICOM TAG - see [tag.js](/bluelight/scripts/plugin/tag.js)
* Display LUT- see [table.js](/bluelight/scripts/plugin/table.js)

## Supported library
* BlueLight Viewer uses several oepn source libraries as folowing:
  - <a href="https://github.com/taye/interact.js">interact</a> for drag and drop objects.
  - <a href="https://github.com/cornerstonejs">cornerstone</a> for reading, parsing DICOM-formatted data.
  - <a href="https://github.com/cornerstonejs/dicomParser">dicomParser</a> for parsing DICOM tags.
  - <a href="https://github.com/cornerstonejs/cornerstoneWADOImageLoader">cornerstoneWADOImageLoader</a> for communicating with the DICOMWeb servers such as  <a href="https://www.orthanc-server.com">Orthanc</a> and <a href="https://www.dcm4che.org">Dcm4chee</a> 
  - <a href="https://www.npmjs.com/package/lodash">lodash</a> for decoding the multipart/related objects in WADO-RS response.

# Roadmap
* FHIR ImagingStudy Query/Retrieve Interface
* Support the IHE Invoke Image Display (IID) Profile [RAD-106]
* Display DICOM Structured Report
* Display DICOM Waveform - 12 Lead ECG Waveform

# Special projects
* **BlueLight-WSI**: :construction: please visit the project [mainecoon](https://github.com/cylab-tw/mainecoon)
* **BlueLight@Orthanc**: :secret:
* **BlueLight@XANT**: :white_check_mark:
* **BlueLight@Raccoon.net**: :white_check_mark: - [Raccoon.net](https://github.com/cylab-tw/raccoon) is a noSQL-based medical image repository.

# Acknowledgement
* To acknowledge the BlueLight in an academic publication, please cite

 *Chen, TT., Sun, YC., Chu, WC. et al. BlueLight: An Open Source DICOM Viewer Using Low-Cost Computation Algorithm Implemented with JavaScript Using Advanced Medical Imaging Visualization. J Digit Imaging (2022). https://doi.org/10.1007/s10278-022-00746-0*

* This project was supported by a grant from the Ministry of Science and Technology Taiwan.
* We acknowledge AI99 teams at Taipei Veterans General Hospital (TVGH) for validation and provides many useful suggestions in many aspects of the clinical domain, especially to thank Dr. Ying-Chou Sun and his professional team.
* Thanks [琦雯Queenie](https://www.cakeresume.com/Queenie0814?locale=zh-TW), [Queenie's github](https://github.com/Queenie0814) for contributing the logo design. 
