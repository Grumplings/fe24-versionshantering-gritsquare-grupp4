import { db } from './firebase-config.js';  
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, getDoc, doc, setDoc, updateDoc, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js';
import { addRemoveButton } from './removeshake.js';

document.addEventListener('DOMContentLoaded', function () {
    const sendButton = document.getElementById('sendButton');
    sendButton.addEventListener('click', sendMessage);

    // Listen to new messages
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

async function sendMessage() {
    const name = document.getElementById('name').value.trim();
    const message = document.getElementById('message').value.trim();
    const textColor = document.getElementById('textColor').value;

    if (!name || !message) {
        alert('Please enter both name and message');
        return;
    }

    // Kolla om användaren är bannad
    const isBanned = await checkBanStatus(name);
    if (isBanned) {
        alert('You are banned from sending messages.');
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
    })
    .catch(error => {
        console.error("Error sending message: ", error);
        alert("Error sending message. Check console for details.");
    });
}

async function checkBanStatus(username) {
    try {
        const banDoc = await getDoc(doc(db, 'bannedUsers', username));
        return banDoc.exists();  // Om dokumentet finns, är användaren bannad
    } catch (error) {
        console.error('Error checking ban status:', error);
        return false;
    }
}

async function banUser(userId) {
    const userRef = doc(db, "bannedUsers", userId);
    await setDoc(userRef, { banned: true });
}

async function unbanUser(userId) {
    const userRef = doc(db, "bannedUsers", userId);
    await updateDoc(userRef, { banned: false });
}

async function toggleBanStatus(userId) {
    console.log("Toggling ban status for:", userId); 
    const isBanned = await checkBanStatus(userId);
    if (isBanned) {
        await unbanUser(userId);
    } else {
        await banUser(userId);
    }
}

function displayMessage(msg, key) {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    
    messageDiv.setAttribute("data-id", key);
    messageDiv.className = 'message received';
    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="message-author">${msg.name} ${msg.banned ? "(BANNED)" : ""}</span>
            <button class="ban-button" data-user-id="${key}">${msg.banned ? "Unban" : "Ban"}</button>
        </div>
        <div class="message-content" style="color: ${msg.color || '#000'}">${msg.banned ? "🚫 This user is banned" : msg.text}</div>
    `;

    messagesDiv.appendChild(messageDiv);
    addRemoveButton(messageDiv, key);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    document.querySelector(`[data-user-id='${key}']`).addEventListener('click', async () => {
        await toggleBanStatus(key);
    });
}

function formatTime(timestamp) {
    const date = timestamp?.toDate() || new Date();
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

let isBouncing = false;

document.getElementById('bounce-button').addEventListener('click', function() {
  const element = document.getElementById('messages');
  const button = document.getElementById('bounce-button');
  
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
