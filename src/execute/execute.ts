import cors from "cors";
import express from "express";
import axios from "axios";
import { preMoniter } from './mainStrategy/premoniterMarket'
import { kiteConnectMain } from "../utils/kiteSdk";
import { getLiveHoldings } from "./mainStrategy/continuesMoniter";

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

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
    }
    else {
      const { access_token } = token;
      kiteConnectMain.setAccessToken(access_token);
      const result = await preMoniter(access_token);
      res.json(result);
    }
    await new Promise(r => setTimeout(r, 1000));

    res.json({ message: "Trade executed successfully 🚀" });
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error verifying token:", err.message);
    } else {
      console.error("Error verifying token:", err);
    }
    res.status(500).json({ error: "Internal error verifying token" });
  }
});

app.get("/holdings", (req, res) => {
  const data = getLiveHoldings();
  res.json({ holdings: data });
});

app.listen(5000, () => console.log("Trade Execution Server running on 5000"));
