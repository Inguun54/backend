const Route = require("express");
const postModel = require("../Module/postSchema");
const userModel = require("../Module/userSchema");
const commentModel = require("../Module/commentSchema");
const authMiddleWare = require("../authMiddleware");
const postRoute = Route();

postRoute.post("/writeComment", async (req, res) => {
  try {
    const { comment, postId, userId } = req.body;

    const respond = await commentModel.create({
      comment,
      postId,
      userId,
    });
    res.status(200).json(respond);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

postRoute.post("/postcreate", async (req, res) => {
  const { caption, postImage, userId } = req.body;
  try {
    const createdPost = await postModel.create({
      caption,
      postImage,
      userId,
    });
    await userModel.findByIdAndUpdate(userId, {
      $push: {
        posts: createdPost._id,
      },
    });
    res.status(200).json(createdPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

postRoute.get("/posts", authMiddleWare, async (req, res) => {
  const authHeader = req.headers("authorization");
  if (!token) res.json({ message: "no token in header" });
  const token = authHeader.split(" ")[1];
  console.log(token);
  try {
    const posts = await postModel
      .find()
      .populate("userId", "email username profileImage _id");
    res.json(posts);
  } catch (error) {
    res.status(404).json({ message: `failed to get posts, ${error}` });
  }
});

postRoute.get("/post", async (req, res) => {
  const posts = await postModel
    .find()
    .populate("userId", "email username _id")
    .populate({
      path: "likes",
      populate: {
        path: "userId",
        select: "username profileImage",
      },
    });

  return res.json({ posts });
});
postRoute.get("/post/:postId", async (req, res) => {
  const { postId } = req.query;
  const response = await postModel.find({ _id: postId }).populate({
    path: "comments",
    populate: {
      path: "userId",
      select: "username profileImage",
    },
  });
  res.send(response);
});

module.exports = postRoute;
