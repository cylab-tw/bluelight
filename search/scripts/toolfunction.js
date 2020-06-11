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
