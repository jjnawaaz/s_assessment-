import express from "express";
import "dotenv/config";
import uploadRouter from "./routes/upload";

const app = express();
app.use(express.json());

app.use("/api", uploadRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
