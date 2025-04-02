import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAFw3sG33l1tBpH6aGkzJswiXPBtbStNgU",
  authDomain: "message-board-d42f0.firebaseapp.com",
  projectId: "message-board-d42f0",
  storageBucket: "message-board-d42f0.appspot.com",
  messagingSenderId: "990408826134",
  appId: "1:990408826134:web:c1e81d782510d6cddb8437",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const authorInput = document.getElementById("author-input");
const messageContainer = document.getElementById("message-container");
const postStatus = document.getElementById("post-status");

const userId = "user-" + Math.random().toString(36).substr(2, 9);

async function checkBanStatus(userId) {
  const userRef = doc(db, "bannedUsers", userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() && userSnap.data().banned;
}

async function banUser(userId) {
  const userRef = doc(db, "bannedUsers", userId);
  await setDoc(userRef, { banned: true });

  const messagesQuery = query(collection(db, "messages"));
  const snapshot = await getDocs(messagesQuery);
  snapshot.forEach(async (doc) => {
    if (doc.data().userId === userId) {
      await updateDoc(doc.ref, { banned: true });
    }
  });
  fetchMessages();
}

async function unbanUser(userId) {
  const userRef = doc(db, "bannedUsers", userId);
  await updateDoc(userRef, { banned: false });

  const messagesQuery = query(collection(db, "messages"));
  const snapshot = await getDocs(messagesQuery);
  snapshot.forEach(async (doc) => {
    if (doc.data().userId === userId) {
      await updateDoc(doc.ref, { banned: false });
    }
  });
  fetchMessages();
}

messageForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const messageText = messageInput.value.trim();
  const author = authorInput.value.trim() || "Anonymous";

  if (!messageText) {
    postStatus.textContent = "Please enter a message";
    postStatus.style.color = "red";
    return;
  }

  const isBanned = await checkBanStatus(userId);
  if (isBanned) {
    postStatus.textContent = "You are banned from posting messages.";
    postStatus.style.color = "red";
    return;
  }

  try {
    postStatus.textContent = "Posting...";
    postStatus.style.color = "blue";

    await addDoc(collection(db, "messages"), {
      text: messageText,
      author: author,
      userId: userId,
      banned: false,
      timestamp: serverTimestamp(),
    });

    messageInput.value = "";
    postStatus.textContent = "Message posted!";
    postStatus.style.color = "green";
    setTimeout(() => (postStatus.textContent = ""), 2000);
  } catch (error) {
    postStatus.textContent = "Error posting message: " + error.message;
    postStatus.style.color = "red";
    console.error("Error:", error);
  }
});

function fetchMessages() {
  const q = query(collection(db, "messages"), orderBy("timestamp"));
  onSnapshot(q, (snapshot) => {
    messageContainer.innerHTML = "";
    snapshot.forEach((doc) => {
      const msg = doc.data();
      const messageEl = document.createElement("div");
      messageEl.className = "message";
      messageEl.innerHTML = `
        <div class="message-avatar">${msg.author.charAt(0).toUpperCase()}</div>
        <div class="message-content">
          <div class="message-header">
            <span class="message-author">${msg.author} ${msg.banned ? "(BANNED)" : ""}</span>
            <button onclick="toggleBanStatus('${msg.userId}')">${msg.banned ? "Unban" : "Ban"}</button>
          </div>
          <p class="message-text">${msg.banned ? "🚫 This user is banned" : msg.text}</p>
        </div>
      `;
      messageContainer.appendChild(messageEl);
    });
  });
}

async function toggleBanStatus(userId) {
  const isBanned = await checkBanStatus(userId);
  if (isBanned) {
    await unbanUser(userId);
  } else {
    await banUser(userId);
  }
} 

fetchMessages();
