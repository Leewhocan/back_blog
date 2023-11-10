import Commentary from "../models/Commentary.js";
import PostModel from "../models/Post.js";
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
