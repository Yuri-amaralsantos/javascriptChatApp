const API_URL = "http://localhost:5000";

document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok) {
        alert("Login successful!");
        localStorage.setItem("token", data.token);
        window.location.href = "home.html";
    } else {
        alert(`Error: ${data.error}`);
    }
});
