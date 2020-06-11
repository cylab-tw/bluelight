window.onload = function () {
  setInterval(function () { createTable() }, 1000);
  loadLdcmview();
}
function PasswordCheck() {
  try {
    var str = "" + getByid('PasswordText').value;
    if (str && str.length == 3) {
      if (parseInt(str.charAt(0)) * parseInt(str.charAt(2) % parseInt(str.charAt(1))) == 1) {
        if (parseInt(str.charAt(2)) * parseInt(str.charAt(1)) + parseInt(str.charAt(0)) == 7) {
          return true;
        }
      }
    }
  } catch (ex) { }
  alert("wrong password");
  return false;
}
/* var formInput = ["StudyDate", "StudyTime", "AccessionNumber", "ModalitiesInStudy", "ReferringPhysicianName",
      "PatientName", "PatientID", "StudyID", "StudyInstanceUID"];
*/
var Patient = {};
var PatientMark = [];
var DicomTags = {};
var ConfigLog;
var configOnload = false;

var LoacationSercher = "";
var UidListCount = 0;
var UidListCount2 = 0;
var SerchState = "";
function createTable() {
  if (UidListCount2 == UidListCount) return;
  UidListCount2 = UidListCount;
  if (getByid("myTable1")) {
    var elem = getByid("myTable1");
    elem.parentElement.removeChild(elem);
  }
  var list = [];
  var list2 = [];
  var list3 = [];
  var list4 = [];
  var list5 = [];
  var list6 = [];
  for (var i = 0; i < Patient.StudyAmount; i++) {
    var flag = 0;
    for (var j = 0; j < Patient.Study[i].SeriesAmount; j++) {
      if (flag == 1) break;
      for (var k = 0; k < Patient.Study[i].Series[j].SopAmount; k++) {
        list.push(Patient.Study[i].Series[j].Sop[k].PatientID);
        list2.push(Patient.Study[i].Series[j].Sop[k].StudyDate);
        list3.push(Patient.Study[i].Series[j].Sop[k].PatientName);
        list4.push(Patient.Study[i].Series[j].SopAmount);
        list5.push(Patient.Study[i].Series[j].Sop[k].ModalitiesInStudy)
        list6.push(Patient.Study[i].StudyUID);
        flag = 1;
        break;
      }
    }
  }
  if (list.length == 0) return;
  rows = list.length;
  lines = 1;

  var Body = document.getElementById("body");
  var Table = document.createElement("table");
  Table.id = "myTable1";
  Table.style.color = "#ffffff";

  Table.className = "table table-dark table-striped";
  Table.setAttribute("border", 1);
  var row0 = Table.insertRow(0);
  var cells0 = row0.insertCell(0);
  cells0.innerHTML = "PatientID";
  var cells1 = row0.insertCell(1);
  cells1.innerHTML = "PatientName";

  var cells1 = row0.insertCell(2);
  cells1.innerHTML = "StudyDate";

  var cells2 = row0.insertCell(3);
  cells2.innerHTML = "Modality";
  var cells3 = row0.insertCell(4);
  cells3.innerHTML = "SopAmount";

  for (var i = 1; i <= rows; i++) {
    var row = Table.insertRow(i);
    row.className = "PatientRow";
    for (var j = 0; j < lines; j += 4) {
      var cells = row.insertCell(j);
      cells.innerHTML = "" + list[i - 1];
      cells = row.insertCell(j + 1);
      cells.innerHTML = "" + list3[i - 1];
      cells = row.insertCell(j + 2);
      cells.innerHTML = "" + list2[i - 1];

      cells = row.insertCell(j + 3);
      cells.innerHTML = "" + list5[i - 1];

      cells = row.insertCell(j + 4);
      cells.innerHTML = "" + list4[i - 1];
      var str = "";
      str += "PatientID=" + Null2Empty(encodeURI(list[i - 1]));
      str += "&StudyDate=" + Null2Empty(encodeURI(list2[i - 1]));
      str += "&StudyInstanceUID=" + Null2Empty(encodeURI(list6[i - 1]));
      str += "&PatientName=" + Null2Empty(encodeURI(list3[i - 1]));
      str += "&ModalitiesInStudy=" + Null2Empty(encodeURI(list5[i - 1]));

      row.alt = 'https://cylab-tw.github.io/bluelight/bluelight/html/start.html?' + str;
      row.onclick = function () {
        window.open(this.alt, '_blank');
      };
    }
  }
  Body.appendChild(Table);
}

function loadLdcmview() {
  labelPadding = 5;
  Patient.patientName = '';
  Patient.StudyAmount = 0;
  Patient.Study = [];
  readConfigJson("../data/config.json");
}