
if (!(Buffer as any).sconcat) {
  (Buffer as any).sconcat = Buffer.concat;
}

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { init } from "./utils/kiteSdk";
import connectDB, { UserToken } from "./utils/connectDb";
import cookieParser from "cookie-parser";
import { getOrders } from "./utils/addOrders";

    
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
connectDB();

async function requireAuth(req: { cookies: { access_token: any; }; }, res: { redirect: (arg0: string) => any; }, next: () => void) {
  const token = req.cookies.access_token;
  if (!token) return res.redirect("/login.html");

  const record = await UserToken.findOne({ access_token: token });
  if (!record) return res.redirect("/login.html");

  // Check expiry (24 hours)
  const ageMs = Date.now() - record.createdAt.getTime();
  if (ageMs > 24 * 60 * 60 * 1000) {
    console.log("Token expired");
    return res.redirect("/login.html");
  }

  next();
}

// Handle POST from frontend
app.post("/api/save-token", async (req, res) => {
  const { request_token } = req.body;
  console.log("Received token from frontend:", request_token);
  const accessToken = await init(request_token);
  await UserToken.create({ access_token: accessToken });
  res.clearCookie('access_token');
  res.cookie("access_token", accessToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
  res.json({ success: true });
});

app.get("/trade/redirect", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "redirect.html"));
});

app.get("/dashboard", requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/orders", (req, res) => {
  res.json({ orders: getOrders() });
});

app.post("/api/verify-token", async (req, res) => {
  const { token } = req.body;
  console.log("token-> ", token )
  if (!token) return res.json({ valid: false });

  const record = await UserToken.findOne({ access_token: token.access_token });
  if (!record) return res.json({ valid: false });

  const expired = Date.now() - record.createdAt.getTime() > 24 * 60 * 60 * 1000;
  if (expired) return res.json({ valid: false });

  res.json({ valid: true });
});



app.listen(3000, () => console.log("Server running on http://localhost:3000"));
