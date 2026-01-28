import { io } from "socket.io-client";

const SOCKET_URL = "https://cointradingbot-backend.chainbull.net/"; // your server URL
// const SOCKET_URL = "https://localhost:4000/"; // your server URL
const USER_ID = "535339194"; // replace with a real user ID

const socket = io(SOCKET_URL);

socket.on("connect", () => {
    console.log("✅ Connected to Socket.IO server");
    socket.emit("join:user", USER_ID);
    console.log(`🔑 Emitted join:user for ${USER_ID}`);
});

socket.on("order:confirmed", (data) => {
    console.log("📦 Order confirmed event received:", data);
});

socket.on("deposit:confirmed", (data) => {
    console.log("💰 Deposit confirmed event received:", data);
});

socket.on("deposit:invalid", (data) => {
    console.log("⚠️ Deposit invalid event received:", data);
});

socket.on("disconnect", () => {
    console.log("❌ Disconnected from Socket.IO server");
});
