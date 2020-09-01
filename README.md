<h1>BlueLight Web-based DICOM Viewer (BlueLight Viewer)</h1>
<p><strong>Blue Light</strong> is a browser-based medical image viewer is primarily maintained by the <a href="https://cylab.dicom.tw/">Imaging Informatics Labs</a>. It is a pure single-page application (SPA), lightweight, and using only JavaScript and HTML5 technologies so as to deploy it on any HTTP server easily (just put it in HTTP server). It supports not only opening local data, but also connecting to medical image archives which support <a href="https://www.dicomstandard.org/dicomweb/">DICOMweb</a>. It can display the various image markups and annotations such as Annotation and Image Markup (AIM), DICOM-RT structure set (RTSS), DICOM Overlay, and DICOM Presentation State. It provides tools for medical image interpretation and 3D image reconstruction, e.g., Multiplanar Rreformation or Reconstruction (MPR) and Volume Rendering (VR).</p>

<a href="https://blsearch.dicom.tw"><strong>Live DEMO</strong></a>&ensp;&ensp;&ensp;
<a href="https://bl.dicom.tw"><strong>Online Viewer</strong></a>&ensp;&ensp;&ensp;
<a href="https://youtu.be/UkZt_Qbw1Rk"><strong> Video - Basic operation</strong></a> 

## Install
* Put all files into any directory in the static directory on any HTTP server.

## DICOMWeb Configuration
* go to `./bluelight/data/config.json` and change the configuration of DICOM server.
 - **Reminder** the DICOMWeb Plugin of the DICOM server shall be installed first. 
 
## About
* BlueLight是少數能在網頁上顯示3D VR、MIP及MPR的開源DICOM瀏覽系統，它擁有平易近人的操作介面並支援RWD及Web零足跡瀏覽，可在任意大小的裝置上執行。
* 標記顯示方面支援RTSS、Overlay、Graphic Annotation、AIM等標記，亦可於3D系統中專換成3D標記。
* 此專案亦支援LabelImg格式的標記繪製。
* 3D VR顯示模式支援染色、窗度、透明、壓縮、貼皮、內插、降噪、打光、挖洞及最大密度投影，針對骨骼及肺氣管有專門的顯示模式，MPR模式則支援內插、貼皮、染色以及3D切面的顯示。

## Key Features
### Network support
* load local files
* Integration with any DICOMWeb Image Archive, including Orthanc, and dcm4chee server
* Integration with IHE Invoke Image Display (IID) Profile, as the Image Display Acotr in Transaction [RAD-106]. (on going)
  - We are trying to implement it with in the scenario of FHIR ImagingStudy.
* Integration with XNAT (currently doesn't build as an XNAT plugin)

### 2D image interpretation
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

### supported the display of the kinds of markups and annotations
* GSPS: DICOM Graphic Annotation
* DICOM Overlay
* DICOM-RT structure set (RTSS)
* Annotation and Image Markup (AIM)
* DICOM SEG (Segementation)
* [LabelImg](https://github.com/tzutalin/labelImg)

### 3D Post-Processing
* MPR (Multiplanar Reconstruction)
* 3D Volume Rendering 
* MIP (maximum intensity projection)

### Labeling tool interfaces 
* [LabelImg](https://github.com/tzutalin/labelImg)
* GSPS: DICOM Graphic Annotation (Done)
* DICOM-RT structure set (RTSS) (on going)
* DICOM SEG (Segementation) (on going)
* **Note:** *Currently, the format of annotation is the DCMTK DICOM-XML, support the download of the DICOM format should be with [micala Server](https://github.com/cylab-tw/micala), we are trying to release it ASAP*
* Downloading the DICOM-XML, you can use the DCMTK tool: xml2dcm to convert the xml to DICOM format which BlueLight can display as well.

## Supported library
* BlueLight Viewer uses several oepn source libraries as folowing:
  - <a href="https://github.com/taye/interact.js">interact</a> for drag and drop objects.
  - <a href="https://github.com/cornerstonejs">cornerstone</a> for reading, parsing DICOM-formatted data.
  - <a href="https://github.com/cornerstonejs/dicomParser">dicomParser</a> for parsing DICOM tags.
  - <a href="https://github.com/cornerstonejs/cornerstoneWADOImageLoader">cornerstoneWADOImageLoader</a> for communicating with the DICOMWeb servers such as  <a href="https://www.orthanc-server.com">Orthanc</a> and <a href="https://www.dcm4che.org">Dcm4chee</a> 
 
## Special projects
* **BlueLight@XANT**
* **BlueLight@Orthanc**
* **BlueLight@micala**: [micala](https://github.com/cylab-tw/micala) is a noSQL-based medical image repository.

## Acknowledgement
* This project was supported by a grant from the Ministry of Science and Technology Taiwan. We acknowledge AI99 teams at Taipei Veterans General Hospital (TVGH) for validation and provides many useful suggestions in many aspects of the clinical domain. We acknowledge AI99 teams at Taipei Veterans General Hospital (TVGH) for validation and provides many useful suggestions, especially to thank Dr. Ying-Chou Sun and his professional team.

## Copyright Chung-Yueh Lien
