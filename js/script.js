
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

