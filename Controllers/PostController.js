import commentary from "../models/Commentary.js";
import PostModel from "../models/Post.js";
import User from "../models/User.js";
export const getAll = async (req, res) => {
  try {
    const postsTag = req.query.tag;
    const sortBy = req.query.sortBy;

    const posts = await PostModel.find(
      !postsTag ? {} : { tags: { $in: [postsTag] } }
    )
      .populate("user")
      .exec();
    if (sortBy === "Новые") {
      return res.json(
        posts.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
      );
    } else {
      res.json(posts.sort((a, b) => (a.viewsCount > b.viewsCount ? -1 : 1)));
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findOneAndUpdate(
      { _id: postId },
      {
        $inc: { viewsCount: 1 },
      },
      { new: true }
    ).populate({
      path: "user",
      model: User,
    });

    res.json(doc);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Can not find post",
    });
  }
};

export const getByTag = async (req, res) => {
  try {
    const postsTag = req.params.tag;

    PostModel.find(
      {
        tags: { $in: [postsTag] },
      },
      { returnDocument: "after" }
    )
      .populate("user")
      .then((doc) => {
        if (!doc) {
          return res
            .status(404)
            .json({ message: "Не удалось вернуть статью", error: err });
        }
        res.json(doc);
      })
      .catch((err) => {
        if (err) {
          return res
            .status(403)
            .json({ message: "Пост не был найден", error: err });
        }
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete({
      _id: postId,
    })
      .then((doc) => {
        if (!doc) {
          return res.status(500).json({
            message: "Статья не найдена",
          });
        }

        res.json({
          success: true,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          message: "Нет удалось удалить статью",
        });
      });
    await commentary.deleteMany({ post: postId });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статью",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });
    const post = await doc.save();
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось cоздать статью",
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        imageUrl: req.body.imageUrl,
      }
    );
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось cоздать статью",
    });
  }
};

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
        $push: { commentary: comment },
      }
    );

    res.json({ success: true });
  } catch (err) {
    console.log(err);
  }
};
