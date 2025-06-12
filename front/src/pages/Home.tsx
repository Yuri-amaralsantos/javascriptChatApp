import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const API_URL = "http://localhost:5000";
const socket = io(API_URL);

export default function Home() {
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    fetch(`${API_URL}/protected`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.username) {
          setUsername(data.username);
          localStorage.setItem("username", data.username);
        } else {
          navigate("/login");
        }
      });
  }, [navigate]);

  useEffect(() => {
    socket.on("chatMessage", (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("chatMessage");
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const user = localStorage.getItem("username") || "Anonymous";
      socket.emit("chatMessage", `${user}: ${message}`);
      setMessage("");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <h2>Welcome to Home Page</h2>
      <p>Hello, {username}!</p>
      <button onClick={logout}>Logout</button>

      <h3>Chat</h3>
      <div className="chat-container">
        {messages.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
