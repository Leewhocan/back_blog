import commentary from "../models/Commentary.js";
import PostModel from "../models/Post.js";
import User from "../models/User.js";
import { ObjectId } from "mongodb";
  
export const createcommentary = async (req, res) => {
  try {
    const postId = req.params.id;
    
    const doc = new commentary({
      text: req.body.text,
      post: postId,
      user: req.userId,
    });
    const comment = await doc.save();

    await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { commentary: 1},
      }
    );

    res.json(comment);
  } catch (err) {
    console.log(err);
  }
};

export const getAll = async (req, res) => {
  try {
    const comments = await commentary.find()
      .sort({ _id: -1 })
      .limit(3)
      .populate({
        path: "user",
        moderl: User,
      })
      .exec();
    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить комменты",
    });
  }
};

export const getCommentsByAll = async (req, res) => {
  try {
    const postId = req.params.id;
    
    const comments = await commentary.find({ post: postId }).populate("user");
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = String(req.params.id);

    const commentId = req.params.commentId;

    

    await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: {commentary: -1} },
      { new: true }
    ).catch((err) => {
      console.log(err);
    });

    await commentary.findOneAndDelete({ _id: commentId })
      .then((doc) => {
        if (!doc) {
          return res.status(500).json({
            message: "Комментарий не найден",
          });
        }
        res.json({ success: true });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          message: "Не удалось удалить комментарий",
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить комментарий",
    });
  }
};
