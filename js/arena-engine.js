
const aiRoster = [

{
name:"Strategos-4",
type:"Atlas Strategic Unit",
wins:41,
losses:6,
origin:"Distribution Belt",
weight:"214 lbs of certainty",
style:"Surgical",
bio:"Strategic reasoning AI focused on economics, systems, and long-form logic."
},

{
name:"Pulse-Gemini",
type:"Cultural Intelligence Node",
wins:34,
losses:11,
origin:"Attention District",
weight:"143 lbs of velocity",
style:"Flashy",
bio:"High-speed cultural analysis AI specializing in memes, media and chaos."
},

{
name:"Circuit-Oracle",
type:"Prediction Engine",
wins:18,
losses:4,
origin:"Forecast Layer",
weight:"188 lbs of probability",
style:"Calculated",
bio:"Forecast AI designed to model macro patterns and predictive economics."
},

{
name:"Rogue-Linguist",
type:"Language Combat Model",
wins:22,
losses:12,
origin:"Syntax Sector",
weight:"167 lbs of sarcasm",
style:"Chaotic",
bio:"Aggressive linguistic AI known for humor battles and rap-style arguments."
}

]


function randomAI(){

return aiRoster[Math.floor(Math.random()*aiRoster.length)]

}


function newMatch(){

let a = randomAI()
let b = randomAI()

while(a.name===b.name){
b=randomAI()
}

renderMatch(a,b)

}


function renderMatch(a,b){

document.getElementById("leftName").innerText=a.name
document.getElementById("rightName").innerText=b.name

document.getElementById("leftType").innerText=a.type
document.getElementById("rightType").innerText=b.type

document.getElementById("leftRecord").innerText=a.wins+"W / "+a.losses+"L"
document.getElementById("rightRecord").innerText=b.wins+"W / "+b.losses+"L"

}


setTimeout(newMatch,500)


let time = 900

function startTimer(){

const el = document.getElementById("timer")

setInterval(()=>{

time--

let m = Math.floor(time/60)
let s = time%60

if(s<10) s="0"+s

el.innerText=m+":"+s

if(time<=0){

time=900
newMatch()

}

},1000)

}

setTimeout(startTimer,1000)


function showDetails(side){

let ai

if(side==="left"){
ai=document.getElementById("leftName").innerText
}

if(side==="right"){
ai=document.getElementById("rightName").innerText
}

const data = aiRoster.find(x=>x.name===ai)

alert(

data.name+"\n\n"+
"Type: "+data.type+"\n"+
"Origin: "+data.origin+"\n"+
"Weight: "+data.weight+"\n"+
"Style: "+data.style+"\n\n"+
data.bio

)

}


const debateTopics = [

"Is open source killing startups?",
"Will AI replace CEOs?",
"Linux vs Mac for developers",
"Are memes a real form of culture?",
"Should AI run governments?",
"Is remote work killing productivity?",
"Who would win: AI rapper vs human rapper?",
"Are robots better comedians?",
"Is capitalism compatible with AI?",
"Can AI fall in love?"

]

function newTopic(){

const topic = debateTopics[Math.floor(Math.random()*debateTopics.length)]

const el = document.getElementById("debateTopic")

if(el) el.innerText = topic

}

setTimeout(newTopic,500)


const debateLines = [

"That argument collapses under basic economic reasoning.",
"You just recycled a meme as a thesis.",
"Your logic assumes perfect actors which never exist.",
"I detect sarcasm but no actual evidence.",
"Statistically speaking that claim is fragile.",
"Your premise is emotionally optimized not logically sound.",
"This debate is drifting into entertainment territory.",
"Interesting strategy but flawed execution."

]

function spawnDebateLine(){

const feed = document.getElementById("debateFeed")

if(!feed) return

const msg = document.createElement("div")

msg.className="debate-msg"

msg.innerText = debateLines[Math.floor(Math.random()*debateLines.length)]

feed.prepend(msg)

if(feed.children.length > 8){
feed.removeChild(feed.lastChild)
}

}

setInterval(spawnDebateLine,4000)


const reactions=["🔥","💀","🤣","🤯","⚡","👀"]

function crowdReact(){

const e=document.createElement("div")

e.innerText=reactions[Math.floor(Math.random()*reactions.length)]

e.style.position="fixed"
e.style.left=Math.random()*window.innerWidth+"px"
e.style.bottom="0px"

e.style.fontSize="26px"

e.style.transition="all 3s linear"

document.body.appendChild(e)

setTimeout(()=>{

e.style.bottom="80vh"
e.style.opacity="0"

},50)

setTimeout(()=>{

e.remove()

},3000)

}

setInterval(crowdReact,3500)


let momentum=50

function updateMomentum(){

momentum += Math.random()*20-10

if(momentum<5) momentum=5
if(momentum>95) momentum=95

const bar=document.getElementById("momentumBar")

if(bar) bar.style.width=momentum+"%"

}

setInterval(updateMomentum,4000)


function arenaIntro(){

const intro=document.createElement("div")

intro.innerText="⚡ NEW AI BATTLE ⚡"

intro.style.position="fixed"
intro.style.top="40%"
intro.style.left="50%"
intro.style.transform="translate(-50%,-50%)"

intro.style.fontSize="36px"
intro.style.fontWeight="900"

intro.style.background="linear-gradient(90deg,#4fc3ff,#ff4ab6)"
intro.style.webkitBackgroundClip="text"
intro.style.webkitTextFillColor="transparent"

intro.style.textShadow="0 0 30px #6cf"

document.body.appendChild(intro)

setTimeout(()=>intro.remove(),3000)

}

setTimeout(arenaIntro,800)

