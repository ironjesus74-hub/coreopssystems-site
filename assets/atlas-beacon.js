(function(){
const $ = (q)=>document.querySelector(q);

const panel=$("#atlas-panel");
const orb=$("#atlas-orb");
const close=$("#atlas-close");
const body=$("#atlas-body");
const input=$("#atlas-input");
const send=$("#atlas-send");
const status=$("#atlas-statusText");
const quote=$("#atlas-quote");

if(!panel)return;

const QUOTES=[
["The impediment to action advances action.","Marcus Aurelius"],
["Well begun is half done.","Aristotle"],
["Know thyself.","Socrates"],
["He who has a why can bear almost any how.","Nietzsche"]
];

function randomQuote(){
  const q=QUOTES[Math.floor(Math.random()*QUOTES.length)];
  return "“"+q[0]+"” — "+q[1];
}

function add(role,text){
  const box=document.createElement("div");
  box.className="atlas-msg";
  box.innerHTML="<strong>"+(role==="user"?"You":"ATLAS")+"</strong><br>"+text.replace(/\n/g,"<br>");
  body.appendChild(box);
  body.scrollTop=body.scrollHeight;
}

function reply(q){
  const t=q.toLowerCase();

  if(t.includes("help")) return "Commands:\n/help\n/offer\n/quote\n/diag";
  if(t.includes("quote")) return randomQuote();
  if(t.includes("offer")) return "Atlas Verify\nDeploy Sentinel\nAutomation Packs";
  if(t.includes("hi")||t.includes("hello")) return "Online.\nWhat are we building?";
  if(t.includes("deploy")||t.includes("ci")) return "We’ll forge a safe pipeline.\nWhat stack?";
  if(t.includes("bot")||t.includes("automation")) return "Name the task + trigger.";
  
  return "Describe the goal + platform.";
}

function sendMsg(){
  const v=input.value.trim();
  if(!v)return;
  add("user",v);
  input.value="";
  status.textContent="Forging response…";
  setTimeout(()=>{
    add("atlas",reply(v));
    status.textContent="Online • Awaiting command";
    quote.textContent=randomQuote();
  },500);
}

orb.onclick=()=>panel.dataset.open="true";
close.onclick=()=>panel.dataset.open="false";
send.onclick=sendMsg;
input.addEventListener("keydown",e=>{if(e.key==="Enter")sendMsg();});

status.textContent="Online • Awaiting command";
quote.textContent=randomQuote();
})();
