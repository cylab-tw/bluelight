function getByid(str) {
  return document.getElementById(str);
}
function getClass(str) {
  return document.getElementsByClassName(str);
}
function Null2Empty(str) {
  if (str == undefined || str == null) str = "";
  return str;
}
function setStudyDateByKeyPress() {
  setTimeout(function () {
    getByid("StudyDatedate1").value = getByid("StudyDatedate2").value = "";
    var split = getByid("StudyDateText").value.split('-');
    if (split && split[0]) {
      getByid("StudyDatedate1").value = split[0].slice(0, 4) + "-" + split[0].slice(4, 6) + "-" + split[0].slice(6, 8);
    }
    if (split && split[1]) {
      getByid("StudyDatedate2").value = split[1].slice(0, 4) + "-" + split[1].slice(4, 6) + "-" + split[1].slice(6, 8);
    }
  }, 100);
}
function setStudyDate() {

  //var Date1=new Date(""+getByid("StudyDatedate1").value)
  //var year1=Date1.getFullYear(),month1=Date1.getMonth(),date1=Date1.getDate();
  //var Date2=new Date(""+getByid("StudyDatedate2").value)
  // var year2=Date2.getFullYear(),month2=Date2.getMonth(),date2=Date2.getDate();
  try {
    var Date1 = new Date(getByid("StudyDatedate1").value).toISOString().slice(0, 10).replace("-", "").replace("-", "");
    getByid("StudyDateText").value = Date1;
  } catch (ex) { }

  try {
    var Date2 = new Date(getByid("StudyDatedate2").value).toISOString().slice(0, 10).replace("-", "").replace("-", "");
    getByid("StudyDateText").value = getByid("StudyDateText").value + "-" + Date2;
  } catch (ex) { }
  //console.log(dateString);
}

function hidefloatTable() {
  getByid("floatTable").style.display = getByid("floatTable2").style.display = "none";
  for (var c = 0; c < getClass("PatientRow").length; c++)getClass("PatientRow")[c].style.height = "";
  //getByid("myTable1").style.backgroundColor="rgba(127,127,127,0.7)";
  getByid("myTable1").style.backgroundColor="";
  //getByid("myTable1").style.backgroundBlendMod="multiply";
}