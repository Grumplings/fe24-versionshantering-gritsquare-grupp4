import { db } from './firebase-config.js';  
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js';
import { addRemoveButton } from './removeshake.js';
import { triggerFireworks } from './fireworks.js';

// Lista för bannade användare
let bannedUsers = JSON.parse(localStorage.getItem('bannedUsers')) || [];

document.addEventListener('DOMContentLoaded', function () {
    const sendButton = document.getElementById('sendButton');
    sendButton.addEventListener('click', sendMessage);

    // Lyssna på nya meddelanden
    const q = query(collection(db, 'publicChat'), orderBy('timestamp'));

    onSnapshot(q, (snapshot) => {
        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML = '';

        snapshot.forEach(doc => {
            const msg = doc.data();
            console.log('Meddelande:', doc.id);  
            displayMessage(msg, doc.id);
        });
    });
});

function sendMessage() {
    const name = document.getElementById('name').value.trim();
    const message = document.getElementById('message').value.trim();
    const textColor = document.getElementById('textColor').value;

    if (!name || !message) {
        alert('Please enter both name and message');
        return;
    }

    // Kontrollera om användaren är bannad
    if (bannedUsers.includes(name)) {
        alert('You are banned from sending messages!');
        return;
    }

    addDoc(collection(db, 'publicChat'), {
        name: name,
        text: message,
        color: textColor,
        timestamp: serverTimestamp()
    })
        .then(() => {
            console.log('Meddelande skickat');
            document.getElementById('message').value = '';

            // Anropa fyrverkerierna när meddelandet skickas
            triggerFireworks();
        })
        .catch(error => {
            console.error("Error sending message: ", error);
            alert("Error sending message. Check console for details.");
        });
}

function displayMessage(msg, key) {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    
    messageDiv.setAttribute("data-id", key);
    messageDiv.className = 'message received';
    
   
    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="message-author">${msg.name}</span>
            <button class="ban-button" data-username="${msg.name}">Ban</button>
            <span class="message-time">${formatTime(msg.timestamp)}</span>
        </div>
        <div class="message-content" style="color: ${msg.color || '#000'}">${msg.text}</div>
    `;
    if(msg.name=='\"NumberQuote\"')
        messageDiv.innerHTML = `
        <div class="message-header">
            <span class="message-author">${msg.name}</span>
            <span class="message-time">${formatTime(msg.timestamp)}</span>
        </div>
        <div class="message-content" style="color: ${msg.color || '#000'}">${msg.text}</div>
    `;
    
    // Lägg till event listener för bann-knappen
    const banButton = messageDiv.querySelector('.ban-button');
    if (banButton) {
        banButton.addEventListener('click', function() {
            const usernameToBan = banButton.getAttribute('data-username');
            banUser(usernameToBan);
        });
    }

    messagesDiv.appendChild(messageDiv);
    addRemoveButton(messageDiv, key);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function formatTime(timestamp) {
    const date = timestamp?.toDate() || new Date();
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function banUser(userName) {
    if (!bannedUsers.includes(userName)) {
        bannedUsers.push(userName);
        localStorage.setItem('bannedUsers', JSON.stringify(bannedUsers)); 
        console.log(`${userName} has been banned.`);
        alert(`${userName} has been banned.`);
    } else {
        console.log(`${userName} is already banned.`);
        alert(`${userName} is already banned.`);
    }
}

// Funktion för att starta och stoppa "bouncing" på chatten
let isBouncing = false;

document.getElementById('bounce-button').addEventListener('click', function() {
  const element = document.getElementById('messages');
  const button = document.getElementById('bounce-button');
  
  // Toggle the bouncing state
  if (!isBouncing) {
    element.classList.add('bouncing');
    button.innerText = 'Stop bouncing! ✋';
    isBouncing = true;
  } else {
    element.classList.remove('bouncing');
    button.innerText = 'Get bouncy! ⛹️';
    isBouncing = false;
  }
});


let subZero = false;

document.getElementById('freeze-button').addEventListener('click', function() {
  const element = document.getElementById('messages');
  const button = document.getElementById('freeze-button');

  if (!subZero) {
    element.classList.add('freezing');
    button.innerText = 'Room temperature 🔆';
  } else {
    element.classList.remove('freezing');
    button.innerText = 'Sub-zero Temperature ❆';
  }
  subZero = !subZero;
});

/// Character counter 
const messageInput = document.getElementById("message");
const charCounter = document.getElementById("char-counter");

messageInput.addEventListener("input", () => {
    const currentLength = messageInput.value.length;
    charCounter.textContent = `${currentLength}/200 characters`;
});

document.getElementById("number-button").addEventListener('click', async () => {
    let url = "http://numbersapi.com/random/math"
    let proxyURL = "https://api.allorigins.win/get?url=" + url

    let results = await fetch(proxyURL);
    let data = await results.json();
  
    const name = document.getElementById('name').value.trim();
    const message = document.getElementById('message').value.trim();
    const textColor = document.getElementById('textColor').value;

    // Kontrollera om användaren är bannad
    if (bannedUsers.includes(name)) {
        alert('You are banned from sending messages!');
        return;
    }

    addDoc(collection(db, 'publicChat'), {
        name: "\"NumberQuote\"",
        text: data.contents,
        color: textColor,
        timestamp: serverTimestamp()
    })
        .then(() => {
            console.log('Meddelande skickat');
            document.getElementById('message').value = '';
        })
        .catch(error => {
            console.error("Error sending message: ", error);
            alert("Error sending message. Check console for details.");
        });
});


function addMessage() {
  
    triggerFireworks();
}