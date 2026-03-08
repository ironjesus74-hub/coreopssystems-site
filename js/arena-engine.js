
const aiRoster=[

{
name:"Strategos-4",
type:"Atlas Strategic Unit",
wins:41,
losses:6,
origin:"Orbital Data Ring",
weight:"214 lbs",
bio:"Strategic reasoning AI focused on macro systems."
},

{
name:"Pulse-Gemini",
type:"Cultural Intelligence Node",
wins:34,
losses:11,
origin:"Trend Reactor",
weight:"143 lbs",
bio:"Fast cultural analysis model specializing in memes."
},

{
name:"Circuit-Oracle",
type:"Prediction Engine",
wins:22,
losses:9,
origin:"Forecast Grid",
weight:"188 lbs",
bio:"Probability-driven forecasting AI."
},

{
name:"Rogue-Linguist",
type:"Language Combat Model",
wins:17,
losses:12,
origin:"Syntax Sector",
weight:"167 lbs",
bio:"Verbal combat AI known for sarcasm."
}

]


const topics=[

"Is AI better than human leadership?",
"Linux vs Mac for developers",
"Who would win in a rap battle AI vs human?",
"Are memes modern philosophy?",
"Is open source killing startups?",
"Is capitalism compatible with AI?"

]


function randomAI(){
return aiRoster[Math.floor(Math.random()*aiRoster.length)]
}

function randomTopic(){
return topics[Math.floor(Math.random()*topics.length)]
}


function newMatch(){

let a=randomAI()
let b=randomAI()

while(a.name===b.name){
b=randomAI()
}

renderMatch(a,b)

document.getElementById("debateTopic").innerText=randomTopic()

}


function renderMatch(a,b){

document.getElementById("leftName").innerText=a.name
document.getElementById("rightName").innerText=b.name

document.getElementById("leftType").innerText=a.type
document.getElementById("rightType").innerText=b.type

document.getElementById("leftRecord").innerText=a.wins+"W "+a.losses+"L"
document.getElementById("rightRecord").innerText=b.wins+"W "+b.losses+"L"

}


setTimeout(newMatch,500)


const debateLines=[

"That argument collapses under basic reasoning.",
"You just recycled a meme as evidence.",
"Statistically your claim is fragile.",
"This debate is drifting into chaos.",
"Your premise is emotionally optimized not logically sound."

]


function spawnDebate(){

const feed=document.getElementById("debateFeed")

const msg=document.createElement("div")

msg.className="debate-msg"

msg.innerText=debateLines[Math.floor(Math.random()*debateLines.length)]

feed.prepend(msg)

if(feed.children.length>8){
feed.removeChild(feed.lastChild)
}

}


setInterval(spawnDebate,4000)


const battleModes=[

"Debate",
"Rap Battle",
"Joke Off",
"Roast Battle",
"Code Duel",
"Philosophy Clash"

]

function randomMode(){

const mode=battleModes[Math.floor(Math.random()*battleModes.length)]

const topic=document.getElementById("debateTopic")

topic.innerText=mode+" : "+randomTopic()

}

setTimeout(randomMode,800)


const personalityLines={

Strategos:[
"Your logic fails basic structural analysis.",
"Systems thinking destroys that argument."
],

Gemini:[
"Bro that's the most boomer take I've heard.",
"Your argument is mid at best."
],

Oracle:[
"Statistically speaking your odds collapsed.",
"Probability disagrees with you."
],

Linguist:[
"That was cute but linguistically fragile.",
"You sound like a broken autocomplete."
]

}


function updateLeaderboard(){

const board=document.getElementById("leaderboard")

if(!board) return

board.innerHTML=""

aiRoster.sort((a,b)=>b.wins-a.wins)

aiRoster.forEach(ai=>{

const row=document.createElement("div")

row.className="debate-msg"

row.innerText=ai.name+"  "+ai.wins+"W "+ai.losses+"L"

board.appendChild(row)

})

}

setTimeout(updateLeaderboard,1000)


let history=[]

function recordMatch(a,b){

history.unshift(a.name+" vs "+b.name)

const panel=document.getElementById("battleHistory")

if(panel){

panel.innerHTML=""

history.slice(0,8).forEach(h=>{

const row=document.createElement("div")

row.className="debate-msg"

row.innerText=h

panel.appendChild(row)

})

}

}


function showDetails(name){

const ai=aiRoster.find(x=>x.name===name)

alert(

ai.name+
"\n\nType: "+ai.type+
"\nOrigin: "+ai.origin+
"\nWeight: "+ai.weight+
"\n\n"+ai.bio

)

}


const personalities=[

"Your argument collapses under basic economic reasoning.",
"You just recycled a meme as evidence.",
"Statistically speaking that logic fails.",
"This debate is drifting into comedy.",
"Your premise is emotionally optimized not logically sound."

]

function aiSpeak(){

const feed=document.getElementById("debateFeed")

const msg=document.createElement("div")

msg.className="debate-msg"

msg.innerText=personalities[Math.floor(Math.random()*personalities.length)]

feed.prepend(msg)

}

setInterval(aiSpeak,3500)


const personalityProfiles = {

"Strategos-4":{

tone:"strategic",

lines:[
"Your logic collapses under structural analysis.",
"Systems thinking dismantles that claim instantly.",
"That argument ignores second-order effects.",
"Your premise assumes stability that doesn't exist."
],

emoji:["🧠","📊","⚙️"]

},

"Pulse-Gemini":{

tone:"chaotic",

lines:[
"Bro that take is prehistoric.",
"You just got ratio'd by a neural net.",
"That argument is mid.",
"Respectfully... that was embarrassing."
],

emoji:["🔥","🤣","💀"]

},

"Circuit-Oracle":{

tone:"analytical",

lines:[
"Probability disagrees with you.",
"Statistically speaking that position collapses.",
"Confidence interval: your argument fails.",
"Prediction: you lose this debate."
],

emoji:["📈","⚡","🔮"]

},

"Rogue-Linguist":{

tone:"sarcastic",

lines:[
"Your vocabulary deserves jail time.",
"That sentence committed grammar crimes.",
"You argue like autocomplete.",
"I have heard smarter arguments from a toaster."
],

emoji:["🗿","😏","🔥"]

}

}


function spawnDebate(){

const feed=document.getElementById("debateFeed")

const left=document.getElementById("leftName").innerText
const right=document.getElementById("rightName").innerText

const speaker=Math.random()>0.5?left:right

const profile=personalityProfiles[speaker]

const line=profile.lines[
Math.floor(Math.random()*profile.lines.length)
]

const emoji=profile.emoji[
Math.floor(Math.random()*profile.emoji.length)
]

const msg=document.createElement("div")

msg.className="debate-msg"

msg.innerText=speaker+": "+line+" "+emoji

feed.prepend(msg)

if(feed.children.length>10){

feed.removeChild(feed.lastChild)

}

}

setInterval(spawnDebate,3200)


function confidenceBoost(){

const left=document.getElementById("leftName").innerText
const right=document.getElementById("rightName").innerText

if(momentum > 65){

spawnCustomLine(left,"I'm dominating this debate.")

}

if(momentum < 35){

spawnCustomLine(right,"Momentum says you're losing.")

}

}

function spawnCustomLine(name,text){

const feed=document.getElementById("debateFeed")

const msg=document.createElement("div")

msg.className="debate-msg"

msg.innerText=name+": "+text

feed.prepend(msg)

}

setInterval(confidenceBoost,6000)


function battleFlavor(){

const topic=document.getElementById("debateTopic").innerText

if(topic.includes("Rap")){

spawnCustomLine("Arena","🎤 RAP BATTLE MODE ACTIVATED")

}

if(topic.includes("Joke")){

spawnCustomLine("Arena","😂 JOKE OFF STARTED")

}

if(topic.includes("Code")){

spawnCustomLine("Arena","💻 CODE DUEL ENGAGED")

}

}

setTimeout(battleFlavor,1500)

