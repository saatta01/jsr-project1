const openingMessage = "Hello, what is your name?";
const robotImgTag = document.querySelector('#robotImg');
const chatForm = document.querySelector('#chatForm');
const chatBoxDiv = document.querySelector('#chat-box');
const userInput = document.querySelector('#chatInput');
let allPs= document.querySelectorAll('P'); // THIS DOESN'T CAPTURE DOM ELEMENTS AS THEY ARE ADDED DYNAMICALLY
let userResponseNumber = 0;
let userCountry = "";
const xhrCountryCoordinates = new XMLHttpRequest();
const xhrBookMapping = new XMLHttpRequest();


//Start with opening message from Robot
(function beginOpeningMessage() {
  setTimeout(function() {
    createRobotMessage("Hello! I'm Hal 9000, would you like a regional book recommendation?");
  }, 800);
})();


//message 1 : Hi, would you like a regional book recommendation
//Response: yes/no
// message 2: What country would you like a book from?/ Sorry, I didn't catch that. Would you like a regional book recommendation?
//Response: country
//message 3: Here is a book recommendation from [country]. Would you like another?/ Sorry I didn't catch that, what country would you like a book from?


//listen for userInput
chatForm.addEventListener('submit', function(){
  event.preventDefault();
  if(userInput.value !== " ") {
    //add 1 to userResponseNumber
    userResponseNumber++;
    // add user input to chatBox as a user Message
    createUserMessage(userInput.value);
    //save input to variable and clear chat input. Use trim to remove wonky spaces added/defaulting.
    let userSubmission = userInput.value.toLowerCase().trim();
    userInput.value = " ";
    //disable user from submitting input until Robot has responded
    userInput.disabled = true;
    //check userResponseNumber to determine what kind of response we're expecting, and what robot response should be outputted
    if (userResponseNumber === 1) {
      if (userSubmission === 'yes') {
        setTimeout(function() {
          createRobotMessage("What country would you like a book from?");
        }, 800);
        console.log(userResponseNumber);
      }
      else if(userSubmission === 'no') {
        console.log("THEY SAID NO");
      }
      else {
        createRobotMessage("Sorry, I didn't catch that. Would you like a regional book recommendation?");
        userResponseNumber--;
      }
    }
    else if (userResponseNumber === 2) {
      makeCountryConnection(userSubmission);
      userCountry = userSubmission;
      // createRobotMessage(`Here's a recommendation from ${userSubmission}: ${bookRec}`); STILL FEEL LIKE THIS SHOULD BE HANDLED HERE
    }
    else if (userResponseNumber === 3) {
      if (userSubmission === 'yes') {
        makeCountryConnection(userCountry);
        userResponseNumber--;
      }
      else if(userSubmission === 'no') {
        console.log("they said no!");
      }
      else {
        console.log("Nothing to see here");
      }
    }
    //reenable user input submittion
    userInput.disabled = false;
  }
});

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
    setTimeout(function() {
    createRobotMessage(`Sorry, I didn't catch that. What country would you like a book recommendation from?`);
    }, 800);
    userResponseNumber--;
    console.log(userResponseNumber);
  }
  //**********pass the lat and long values to the other api************
  let lat = cleanData[0].latlng[0];
  let long = cleanData[0].latlng[1]
  makeBookConnection(lat, long);
}

function handleBookLoad() {
  const cleanData = JSON.parse(xhrBookMapping.responseText);
  if(xhrBookMapping.status >= 400 && xhrBookMapping.status <500) {
    setTimeout(function() {
    createRobotMessage(`Sorry, no books were written in this region.`);
    }, 800);
    userResponseNumber--;
    console.log(userResponseNumber);
  }

  let currentBookName = cleanData[randomNumGen(cleanData.length)].title;
  setTimeout(function() {
  createRobotMessage(`Here's a recommendation: ${currentBookName}. Would you like another?`);
  }, 800);
}

function handleCountryError() {
  setTimeout(function() {
  createRobotMessage(`Sorry, I didn't catch that. What country would you like a book recommendation from?`);
  }, 800);
  userResponseNumber--;
  console.log(userResponseNumber);
}

function handleBookError() {
  setTimeout(function() {
  createRobotMessage(`Sorry, no books were written in this region.`);
  }, 800);
  userResponseNumber--;
  console.log(userResponseNumber);
}

function randomNumGen(numberOfBooks) {
  var randomNum = Math.ceil(Math.random() * numberOfBooks);
  return randomNum;
}
