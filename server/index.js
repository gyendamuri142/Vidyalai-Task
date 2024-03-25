import express from "express";
import connection from "./Database/db.js";
import multer from "multer";
import cors from "cors";
import PdfSchema from "./pdfDetails.js";

const app = express();
const PORT = 8000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));

app.use("/files", express.static("files"));

// Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Routes
app.post("/upload-files", upload.single("file"), async (req, res) => {
  console.log(req.file);
  const title = req.body.title;
  const fileName = req.file.filename;
  try {
    await PdfSchema.create({ title: title, pdf: fileName });
    res.send({ status: "ok" });
  } catch (error) {
    res.json({ status: error });
  }
});

app.get("/get-files", async (req, res) => {
  try {
    const data = await PdfSchema.find({});
    res.send({ status: "ok", data: data });
  } catch (error) {
    res.json({ status: error });
  }
});

// New route handler for serving PDF files
app.get("/files/:filename", (req, res) => {
  const { filename } = req.params;
  res.sendFile(filename, { root: "./files" });
});

app.get("/", async (req, res) => {
  res.send("Success!!!!!!");
});

// Server
connection(); // Call connection function only once
app.listen(PORT, () => {
  console.log(`Server is started at ${PORT}`);
});
