function rand(list){
  return list[Math.floor(Math.random() * list.length)];
}

function randomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
