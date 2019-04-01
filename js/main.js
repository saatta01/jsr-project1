const openingMessage = "Hello, what is your name?";
const robotImgTag = document.querySelector('#robotImg');
const chatForm = document.querySelector('#chatForm');
const chatBoxDiv = document.querySelector('#chat-box');
const userInput = document.querySelector('#chatInput');
let allPs= document.querySelectorAll('P'); // THIS DOESN'T CAPTURE DOM ELEMENTS AS THEY ARE ADDED DYNAMICALLY
let counter = 0;
let userCountry = "";
let currentBookName = "";
const xhrCountryCoordinates = new XMLHttpRequest();
const xhrBookMapping = new XMLHttpRequest();
const affirmatives = ['yes', 'yeah', 'heck yes', 'hell yeah', 'yea', 'fine', 'okay', 'aye', 'affirmative', 'yep'];
const negatives = ['no', 'hell naw', 'heck no', 'nah', 'nope'];


//Start with opening message from Robot
(function OpeningMessage() {
  setTimeout(function() {
    createRobotMessage("Hello! I'm Hal 9000, would you like a regional book recommendation?");
  }, 800);
})();

function whichCountryQuestion(reply) {
  reply = reply.toLowerCase();
  if (affirmatives.indexOf(reply) > -1) {
    setTimeout(function() {
      createRobotMessage("What country would you like a book from?");
    }, 800);
  }
  else if(negatives.indexOf(reply) > -1) {
    setTimeout(function() {
      createRobotMessage("How rude...");
    }, 800);
  }
  else {
    setTimeout(function() {
      createRobotMessage("Sorry, I didn't catch that. Would you like a regional book recommendation?");
    }, 800);
    counter = -1;
  }
}

function provideBookRec(currentBookName) {
  if (currentBookName !== "") {
    setTimeout(function() {
    createRobotMessage(`Here's a recommendation: ${currentBookName}. Would you like another?`);
    }, 800);
  }
  else {
    setTimeout(function() {
    createRobotMessage(`Sorry, I couldn't find anything. Let's try again!`);
    }, 800);
    counter = 1;
    whichCountryQuestion('yes');
  }
}

function wouldYouLikeAnother(reply) {
  if (affirmatives.indexOf(reply) > -1) {
    counter = 1;
    makeCountryConnection(userCountry);
  }
  else if (reply.includes("another country") || reply.includes("different country")) {
    counter = 0;
    whichCountryQuestion('yes');
  }
  else if (negatives.indexOf(reply) > -1) {
    setTimeout(function() {
    createRobotMessage("Good, I'm all tuckered out from providing book suggestions. Catch ya later!");
    }, 800);
  }
  else {
    setTimeout(function() {
      createRobotMessage("Sorry, I didn't catch that. Would you like another rec?");
    }, 800);
    counter = 1;
  }
}


//message 1 : Hi, would you like a regional book recommendation
//Response: yes/no
// message 2: What country would you like a book from?/ Sorry, I didn't catch that. Would you like a regional book recommendation?
//Response: country
//message 3: Here is a book recommendation from [country]. Would you like another?/ Sorry I didn't catch that, what country would you like a book from?


//listen for userInput
chatForm.addEventListener('submit', function(){
    event.preventDefault();
    console.log(counter);
    userInput.disabled = true;
    createUserMessage(userInput.value);
    askQuestion(userInput.value);
    userInput.value = "";
    //reenable user input submittion
    userInput.disabled = false;
    counter++;
});

//switch between messages using counter
function askQuestion(userMessage) {
  userMessage = userMessage.toLowerCase();
  switch(counter) {
    case 0:
      whichCountryQuestion(userMessage);
      break;
    case 1:
      console.log(userMessage);
      userCountry = userMessage;
      makeCountryConnection(userMessage);
      break;
    case 2:
      wouldYouLikeAnother(userMessage);
      break;
    default:
      console.log('something is off');
  }
}

//create robot chat template. Should accept the appropriate robot text as an argument
function createRobotMessage(robotMessage) {
  // create new element and append to chatbox
  let newRobotChat = document.createElement('div');
  newRobotChat.innerHTML = `<div class="chat-message robot"><div class="user-photo"><img src="https://robohash.org/default"></div><p class="chat-text">${robotMessage}</p></div>`;
  chatBoxDiv.appendChild(newRobotChat);
  //Start scroll of chatbox at bottom
  chatBoxDiv.scrollTop = chatBoxDiv.scrollHeight;
}

//create user chat template. Should accept the submitted user text as an argument
function createUserMessage(userMessage) {
  //create new element and append to chatbox
  let newUserChat = document.createElement('div');
  newUserChat.innerHTML = `<div class="chat-message self"><div class="user-photo"><img src="https://robohash.org/self?set=set4"></div><p class="chat-text">${userMessage}</p></div>`;
  chatBoxDiv.appendChild(newUserChat);
  //Start scroll of chatbox at bottom
  chatBoxDiv.scrollTop = chatBoxDiv.scrollHeight;
}

//Connect to countries api
function makeCountryConnection(country) {
  xhrCountryCoordinates.open('GET', `https://restcountries.eu/rest/v2/name/${country}?fields=latlng;`);
  xhrCountryCoordinates.send();
  xhrCountryCoordinates.onload = handleCountryLoad;
  xhrCountryCoordinates.onerror = handleCountryError;
}

//connect to book api
function makeBookConnection(lat,long) {
  xhrBookMapping.open('GET', `https://www.mappit.net/bookmap/apis/?lat=${lat}&lon=${long}&radius=200`);
  xhrBookMapping.send();
  xhrBookMapping.onload = handleBookLoad;
  xhrBookMapping.onerror = handleBookError;
}

function handleCountryLoad() {
  const cleanData = JSON.parse(xhrCountryCoordinates.responseText);
  if(xhrCountryCoordinates.status >= 400 && xhrCountryCoordinates.status <500) {
    console.log("nothing returned from country lat/long api");
    currentBookName = "";
    provideBookRec(currentBookName);
  }
  //**********pass the lat and long values to the other api************
  let lat = cleanData[0].latlng[0];
  let long = cleanData[0].latlng[1]
  makeBookConnection(lat, long);
}

function handleBookLoad() {
  const cleanData = JSON.parse(xhrBookMapping.responseText);
  if(xhrBookMapping.status >= 400 && xhrBookMapping.status <500) {
    console.log("no books written in this region");
  }
  currentBookName = cleanData[randomNumGen(cleanData.length)-1].title;
  provideBookRec(currentBookName);
}

function handleCountryError() {
  console.log("Something happened when connecting to the lat/long api");
  currentBookName = "";
  provideBookRec(currentBookName);
}

function handleBookError() {
  console.log("Something happened when connecting to the book api");
  currentBookName = "";
  provideBookRec(currentBookName);
}

function randomNumGen(numberOfBooks) {
  var randomNum = Math.ceil(Math.random() * numberOfBooks);
  return randomNum;
}
