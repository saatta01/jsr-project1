// add an event listener to the form to submit Dave's message

// create a function for HAL to respond to Dave's messages with variable logic based upon
// Dave's inputs

// create a function for HAL to open the chat with "Good morning, Dave"

// invoke the opening message

// add code

const openingMessage = "Hello, what is your name?";

const robotImgTag = document.querySelector('#robotImg');
// const robotChatPaneDiv = document.querySelector('#hal');
const chatForm = document.querySelector('#chatForm');
const chatBoxDiv = document.querySelector('#chat-box');

//Start scroll of chatbox at bottom
chatBoxDiv.scrollTop = chatBoxDiv.scrollHeight;



//Start with opening message from Robot
(function beginOpeningMessage() {
  setTimeout(function() {
    createRobotMessage("Hello!");
  }, 800);
})();

//listen for userInput
chatForm.addEventListener('submit', function(){
    let userStatement = userChatInput.value;
    userChatInput.value = "";

    let robohashURL = `https://robohash.org/${userStatement}`
    robotImgTag.src = robohashURL;

    //take user input and add it to a p tag

});

//create robot chat template. Should accept the appropriate robot text as an argument
function createRobotMessage(robotMessage) {
  // create new element and append to chatbox
  let newRobotChat = document.createElement('div');
  newRobotChat.innerHTML = `<div class="chat-message robot"><div class="user-photo"><img src="https://robohash.org/default"></div><p class="chat-text">${robotMessage}</p></div>`;
  chatBoxDiv.appendChild(newRobotChat);
}

//create user chat template. Should accept the submitted user text as an argument
function createUserMessage(userMessage) {
  //create new element and append to chatbox
  let newUserChat = document.createElement('div');
  newUserChat.innerHTML = `<div class="chat-message self"><div class="user-photo"><img src="https://robohash.org/self?set=set4"></div><p class="chat-text">${userMessage}</p></div>`
  chatBoxDiv.appendChild(newUserChat);
}
