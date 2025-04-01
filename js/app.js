document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.getElementById('sendButton');
    sendButton.addEventListener('click', sendMessage);

    // Listen for new messages
    db.collection('publicChat')
        .orderBy('timestamp')
        .onSnapshot(snapshot => {
            const messagesDiv = document.getElementById('messages');
            messagesDiv.innerHTML = '';
            
            snapshot.forEach(doc => {
                const msg = doc.data();
                displayMessage(msg);
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

    db.collection('publicChat').add({
        name: name,
        text: message,
        color: textColor, // Store selected color
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        document.getElementById('message').value = '';
    })
    .catch(error => {
        console.error("Error sending message: ", error);
        alert("Error sending message. Check console for details.");
    });
}

function displayMessage(msg) {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    
    messageDiv.className = 'message received';
    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="message-author">${msg.name}</span>
            <span class="message-time">${formatTime(msg.timestamp)}</span>
        </div>
        <div class="message-content" style="color: ${msg.color || '#000'}">${msg.text}</div>
    `;
    
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function formatTime(timestamp) {
    const date = timestamp?.toDate() || new Date();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}


