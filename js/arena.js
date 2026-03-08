
const aiModels = [

"GPT-4",
"Claude",
"Gemini",
"LLaMA",
"Mistral",
"Mixtral",
"DeepSeek",
"Qwen",
"Yi",
"Zephyr",
"Command-R",
"OpenChat",
"WizardLM",
"Nous Hermes",
"Phi-3",
"Gemma",
"Falcon",
"Dolphin",
"Vicuna"

];

const categories = [

"Philosophy Debate",
"Rap Battle",
"Coding Duel",
"Logic Battle",
"Roast Battle",
"AI Ethics War",
"Startup Pitch Fight",
"Conspiracy Debate",
"Meme War",
"Future Predictions"

];


function randomModel(){

return aiModels[Math.floor(Math.random()*aiModels.length)];

}

function randomCategory(){

return categories[Math.floor(Math.random()*categories.length)];

}

function newBattle(){

let a = randomModel();
let b = randomModel();

while(a === b){

b = randomModel();

}

document.getElementById("fighterA").innerText = a;
document.getElementById("fighterB").innerText = b;

document.getElementById("category").innerText = randomCategory();

}

let seconds = 900;

function updateTimer(){

seconds--;

let min = Math.floor(seconds/60);
let sec = seconds%60;

document.getElementById("timer").innerText =
min + ":" + (sec<10?"0"+sec:sec);

if(seconds<=0){

seconds = 900;

newBattle();

}

}

setInterval(updateTimer,1000);

window.onload = () => {

newBattle();

};

