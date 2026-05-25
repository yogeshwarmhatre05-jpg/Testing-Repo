const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function aiReply(message){

  message = message.toLowerCase();

  if(message.includes("hello")){
    return "Hello 👋";
  }

  if(message.includes("how are you")){
    return "I am fine 🚀";
  }

  if(message.includes("chess")){
    return "Chess is strategy ♟️";
  }

  if(message.includes("minecraft")){
    return "Minecraft is awesome ⛏️";
  }

  if(message.includes("bye")){
    return "Goodbye 👋";
  }

  return "I don't understand that";
}

function chat(){

  rl.question("You: ", (msg) => {

    const reply = aiReply(msg);

    console.log("AI:", reply);

    if(msg.toLowerCase() === "bye"){
      rl.close();
      return;
    }

    chat();
  });

}

console.log("AI Bot Started 🚀");

chat();