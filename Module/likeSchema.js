const { Schema, mongoose } = require("mongoose");

const likeSchema = new Schema(
  {
    postId: { type: mongoose.Types.ObjectId, ref: "posts" },
    userId: { type: mongoose.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

const likeModel = mongoose.model("likes", likeSchema);

module.exports = likeModel;
