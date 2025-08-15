import express from "express";
import cors from "cors";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// DB setup
const adapter = new JSONFile("db.json");
const db = new Low(adapter, { items: [] });
await db.read();
db.data ||= { items: [] };

// Routes
app.get("/items", (req, res) => {
  const search = req.query.search?.toLowerCase() || "";
  const filtered = db.data.items.filter(
    (item) =>
      item.title.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search) ||
      item.location.toLowerCase().includes(search)
  );
  res.json(filtered);
});

app.post("/items", async (req, res) => {
  const { title, description, location, type, image } = req.body;
  if (!title || !description || !location || !type) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const newItem = {
    id: Date.now(),
    title,
    description,
    location,
    type,
    image: image || "",
    date: new Date().toLocaleString(),
  };
  db.data.items.push(newItem);
  await db.write();
  res.json(newItem);
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
