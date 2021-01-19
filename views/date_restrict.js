//JS to set minimum date to today so organization can't add event with a past date
//set the format today into date format

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; // since January is 0
var yyyy = today.getFullYear();

if(dd<10){
    dd='0'+dd
}
if(mm<10){
    mm='0'+mm
}



today = yyyy+'-'+mm+'-'+dd;
document.getElementById('datefield').setAttribute("min", today);