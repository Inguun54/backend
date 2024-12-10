const { Schema, mongoose } = require("mongoose");

const commentSchema = new Schema(
  {
    comment: { type: String, required: true },
    postId: { type: mongoose.Types.ObjectId, ref: "Posts", required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

const commentModel = mongoose.model("comment", commentSchema);

module.exports = commentModel;
