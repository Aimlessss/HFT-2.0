import cors from "cors";
import express from "express";
import axios from "axios";
import { preMoniter } from "./mainStrategy/premoniterMarket";
import { kiteConnectMain } from "../utils/kiteSdk";
import { getLiveHoldings } from "./mainStrategy/continuesMoniter";
import { Server } from "socket.io";
import http from "http";

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

export { io };

// ----------------------------
// REST ENDPOINTS
// ----------------------------
app.post("/trade/execute", async (req, res) => {
  const authHeader = req.headers.cookie;

  if (!authHeader) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const token = Object.fromEntries(
    authHeader.split("; ").map(c => {
      const [key, ...v] = c.split("=");
      return [key, v.join("=")];
    })
  );

  try {
    const verifyRes = await axios.post("http://localhost:3000/api/verify-token", { token });

    if (!verifyRes.data.valid) {
      return res.status(403).json({ error: "Invalid or expired token" });
    } else {
      const { access_token } = token;
      kiteConnectMain.setAccessToken(access_token);
      const result = await preMoniter(access_token);

      // Send back response
      res.json(result);
    }

  } catch (err) {
    console.error("Error verifying token:", err instanceof Error ? err.message : err);
    res.status(500).json({ error: "Internal error verifying token" });
  }
});

app.get("/holdings", (req, res) => {
  const data = getLiveHoldings();
  res.json({ holdings: data });
});

// ✅ Listen on port 5000
server.listen(5000, () => console.log("🚀 Trade Execution Server running on port 5000"));
