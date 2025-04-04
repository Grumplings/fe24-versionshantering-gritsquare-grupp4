import { doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js';
import { db } from './firebase-config.js';  

export function addRemoveButton(messageDiv,key ) {
    // const message = document.querySelector(`.${messageDiv}`);

    const message = messageDiv.getElementsByClassName("message-content")[0]
    const removeButton = document.createElement("button");
 
    removeButton.textContent = "❌";
    removeButton.classList.add("removeButton");
    message.appendChild(removeButton);

    removeButton.addEventListener("click", () => {
        const messageId = messageDiv.getAttribute("data-id");
        console.log(messageId);
        removeMessageById(messageId);
    });
}

export async function removeMessageById(messageId) {
    try {
        await deleteDoc(doc(db,"publicChat", messageId));
        console.log(`Message with ID: ${messageId} removed successfully.`);
    } catch (error) {
        console.error(`Error removing message with ID: ${messageId}`, error);
    }
}
