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
/* ==========================================
   PART 3C
   FINAL JAVASCRIPT
========================================== */


/* ==========================
   MUSIC CONTROL
========================== */


const musicVideo =
document.getElementById("musicVideo");


const musicButtons =
document.querySelectorAll(
".music-controls button"
);



if(musicButtons.length){

musicButtons[1].addEventListener(
"click",
()=>{

if(musicVideo.paused){

musicVideo.play();

musicButtons[1].innerHTML="⏸";

}

else{

musicVideo.pause();

musicButtons[1].innerHTML="▶";

}

});



musicButtons[0].addEventListener(
"click",
()=>{

musicVideo.currentTime=0;

});



musicButtons[2].addEventListener(
"click",
()=>{

musicVideo.currentTime=0;

musicVideo.play();

});

}



/* ==========================
   SCROLL REVEAL
========================== */


const revealElements =
document.querySelectorAll(
".section-title, .feature-card, .event-card, .player-row, .partner-card"
);



const revealObserver =
new IntersectionObserver(
(entries)=>{


entries.forEach(
entry=>{


if(entry.isIntersecting){

entry.target.classList.add(
"show"
);

}


});


},
{
threshold:.15
}
);



revealElements.forEach(
element=>{

element.classList.add(
"hidden"
);

revealObserver.observe(
element
);

});



/* ==========================
   FLOATING CHESS PIECES
========================== */


const pieces=[

"♟",
"♞",
"♝",
"♜",
"♛"

];


function createPiece(){


const piece =
document.createElement("div");


piece.innerHTML =
pieces[
Math.floor(
Math.random()*pieces.length
)
];


piece.className =
"floating-piece";



piece.style.left =
Math.random()*100+"vw";


piece.style.animationDuration =
(8+Math.random()*8)+"s";



document.body.appendChild(
piece
);



setTimeout(()=>{

piece.remove();

},16000);


}



setInterval(
createPiece,
2500
);



/* ==========================
   BUTTON RIPPLE
========================== */


document.querySelectorAll(
".btn"
)
.forEach(
button=>{


button.addEventListener(
"click",
function(e){


let ripple =
document.createElement("span");


ripple.className =
"ripple";


this.appendChild(
ripple
);



setTimeout(
()=>ripple.remove(),
600
);


});

});



/* ==========================
   CURRENT YEAR
========================== */


const yearElement =
document.querySelector(
".footer-line"
);


if(yearElement){

yearElement.innerHTML =
"© "
+new Date().getFullYear()
+" Pixel Glow • All Rights Reserved";

}