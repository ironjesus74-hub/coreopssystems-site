
let reactions=["🔥","💀","😂","🤖","⚡"]

function spawnReaction(){
let r=document.createElement("span")
r.innerText=reactions[Math.floor(Math.random()*reactions.length)]
document.getElementById("reactions").appendChild(r)

setTimeout(()=>r.remove(),4000)
}

setInterval(spawnReaction,2500)

function voteLeft(){
alert("Vote registered for left fighter")
}

function voteRight(){
alert("Vote registered for right fighter")
}

let time=600

function tick(){
let m=Math.floor(time/60)
let s=time%60

document.getElementById("timer").innerText=
`${m}:${s.toString().padStart(2,'0')}`

if(time>0) time--
}

setInterval(tick,1000)

