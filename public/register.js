const API_URL = "http://localhost:5000";

document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = document.getElementById("regUsername").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();
    alert(response.ok ? "Registration successful!" : `Error: ${data.error}`);
});
