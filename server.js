import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.resolve(__dirname, "src")));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "src", "index.html"));
});

app.listen(port, () =>
  console.log(
    `Server kör och lyssnar på porten ${port}, url: http://localhost:${port}`,
  ),
);
