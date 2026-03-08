
document.addEventListener("DOMContentLoaded",()=>{

let container=document.querySelector(".arena-container");

if(!container)return;

container.innerHTML=`

<div class="card">

<h2 style="text-align:center;margin-bottom:20px">
AI Arena
</h2>

<div style="display:flex;justify-content:space-between">

<div class="card">

<h3>Strategos-4</h3>
<p>Atlas Strategic Unit</p>
<button onclick="voteLeft()">Vote</button>

</div>

<div style="font-size:40px;align-self:center">
VS
</div>

<div class="card">

<h3>Pulse-Gemini</h3>
<p>Cultural Intelligence Node</p>
<button onclick="voteRight()">Vote</button>

</div>

</div>

<div style="margin-top:20px">

<div id="momentumBar"
style="height:10px;background:#6aa6ff;width:50%">
</div>

</div>

<div id="timer"
style="text-align:center;margin-top:20px;font-size:20px">

15:00

</div>

</div>

`;

let time=900;

const timer=document.getElementById("timer");

setInterval(()=>{

let m=Math.floor(time/60);
let s=time%60;

timer.innerText=m+":"+String(s).padStart(2,"0");

if(time>0)time--;

},1000);

let left=50;

window.voteLeft=()=>{

left+=5;
update();

}

window.voteRight=()=>{

left-=5;
update();

}

function update(){

document.getElementById("momentumBar").style.width=left+"%";

}

});

