/* ==========================================
   CHESS CALENDAR SCRIPT
========================================== */


let currentCalendarDate = new Date();



function renderCalendar(){


const year =
currentCalendarDate.getFullYear();


const month =
currentCalendarDate.getMonth();



const title =
document.getElementById("calendarMonth");


const days =
document.getElementById("calendarDays");



const months = [
"January","February","March",
"April","May","June",
"July","August","September",
"October","November","December"
];


title.innerText =
months[month]+" "+year;



days.innerHTML="";



let first =
new Date(year,month,1)
.getDay();



first =
first===0 ? 6 : first-1;



let total =
new Date(year,month+1,0)
.getDate();



for(let i=0;i<first;i++){

let empty =
document.createElement("div");

empty.className="empty-day";

days.appendChild(empty);

}



for(let d=1;d<=total;d++){


let day =
document.createElement("div");


day.className="calendar-day";


day.innerText=d;



let today =
new Date();



if(
d===today.getDate() &&
month===today.getMonth() &&
year===today.getFullYear()
){

day.classList.add("today");

}



days.appendChild(day);


}


}



function changeMonth(value){

currentCalendarDate.setMonth(
currentCalendarDate.getMonth()+value
);

renderCalendar();

}



renderCalendar();