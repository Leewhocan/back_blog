import Commentary from "../models/Commentary.js";
import PostModel from "../models/Post.js";
import User from "../models/User.js";
export const createCommentary = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = new Commentary({
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
        $push: { commentary: comment },
      }
    );

    res.json({ success: true });
  } catch (err) {
    console.log(err);
  }
};

export const getAll = async (req, res) => {
  try {
    const comments = await Commentary.find()
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
