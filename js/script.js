
let momentum = 50

function voteLeft(){
momentum -= 10
updateBar()
}

function voteRight(){
momentum += 10
updateBar()
}

function updateBar(){

if(momentum<5) momentum=5
if(momentum>95) momentum=95

document.getElementById("momentumBar").style.width = momentum + "%"

}

let time = 900

function startTimer(){

setInterval(()=>{

time--

let m=Math.floor(time/60)
let s=time%60

if(s<10) s="0"+s

document.getElementById("timer").innerText=m+":"+s

if(time<=0){

time=900
momentum=50
updateBar()

}

},1000)

}

startTimer()


const emojis=["🔥","💀","🤣","🤯","⚡","👀"]

function spawnEmoji(){

const e=document.createElement("div")

e.innerText=emojis[Math.floor(Math.random()*emojis.length)]

e.style.position="fixed"

e.style.left=Math.random()*window.innerWidth+"px"

e.style.bottom="0px"

e.style.fontSize="28px"

e.style.transition="all 3s linear"

document.body.appendChild(e)

setTimeout(()=>{

e.style.bottom="80vh"
e.style.opacity="0"

},50)

setTimeout(()=>e.remove(),3000)

}

setInterval(spawnEmoji,3500)


function crowdEnergy(){

const emojis=["🔥","🔥","💀","🤯","⚡"]

const e=document.createElement("div")

e.innerText=emojis[Math.floor(Math.random()*emojis.length)]

e.style.position="fixed"
e.style.left=Math.random()*window.innerWidth+"px"
e.style.bottom="0"

e.style.fontSize="26px"

e.style.transition="all 3s linear"

document.body.appendChild(e)

setTimeout(()=>{
e.style.bottom="70vh"
e.style.opacity="0"
},50)

setTimeout(()=>e.remove(),3000)

}

setInterval(crowdEnergy,3000)

