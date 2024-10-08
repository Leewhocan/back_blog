import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import {
  registerValidator,
  loginValidator,
  PostCreateValidator,
} from "./validation.js";
import { checkAuth, handleValodationsErrors } from "./utils/index.js";
import {
  UserController,
  PostController,
  CommentController,
} from "./Controllers/index.js";
import cors from "cors";
mongoose
  .connect(
    "mongodb+srv://lollee31:yllKg2gVDXVOSo3E@cluster0.1ojqt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("DB OK");
  })
  .catch((err) => {
    console.log("db err", err);
  });

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.get("/", (req, res) => {
  res.send("hello");
});

app.post(
  "/auth/login",
  loginValidator,
  handleValodationsErrors,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidator,
  handleValodationsErrors,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});
app.get("/tags", PostController.getLastTags);
app.get("/posts", PostController.getAll);
app.get("/comments", CommentController.getAll);
app.get("/comments/:id", CommentController.getCommentsByAll);
app.delete("/posts/:id/comments/:commentId", CommentController.remove);
app.get("/posts/:id", PostController.getOne);
app.post("/posts/:id", checkAuth, CommentController.createcommentary);
app.post(
  "/posts",
  checkAuth,
  PostCreateValidator,
  handleValodationsErrors,
  PostController.create
);

app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  PostCreateValidator,
  handleValodationsErrors,
  PostController.update
);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("server ok");
});
