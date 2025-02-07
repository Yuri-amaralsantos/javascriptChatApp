const API_URL = "http://localhost:5000";
const socket = io(API_URL);

async function fetchProtectedData() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const response = await fetch(`${API_URL}/protected`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await response.json();
    if (response.ok) {
        document.getElementById("welcomeMessage").textContent = `Hello, ${data.username}!`;
        localStorage.setItem("username", data.username);
    } else {
        alert("Unauthorized. Redirecting to login...");
        localStorage.removeItem("token");
        window.location.href = "login.html";
    }
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

function sendMessage() {
    const message = document.getElementById("messageInput").value;
    const username = localStorage.getItem("username") || "Anonymous";
    if (message.trim() !== "") {
        socket.emit("chatMessage", `${username}: ${message}`);
        document.getElementById("messageInput").value = "";
    }
}

socket.on("chatMessage", (msg) => {
    const chatBox = document.getElementById("chatBox");
    const newMessage = document.createElement("p");
    newMessage.textContent = msg;
    chatBox.appendChild(newMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
});

fetchProtectedData();
