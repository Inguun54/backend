const Route = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../Module/userSchema");
const userRoute = Route();

userRoute.post("/signup", async (req, res) => {
  const { username, email, password, profileImage } = req.body;
  const saltRound = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRound);
    const createdUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
      profileImage,
    });

    const token = jwt.sign(
      {
        userId: createdUser._id,
        username: createdUser.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.send({ token });
  } catch (error) {
    res.json({ message: `Failed to create user: ${error}` });
  }
});

userRoute.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

userRoute.get("/user/posts", async (req, res) => {
  try {
    const posts = await userModel
      .find()
      .populate("posts", "email username _id");

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
});

userRoute.post("/user/follow", async (req, res) => {
  try {
    const { followingUserId, followedUserId } = req.body;

    await userModel.findByIdAndUpdate(followingUserId, {
      $addToSet: { following: followedUserId },
    });

    await userModel.findByIdAndUpdate(followedUserId, {
      $addToSet: { followers: followingUserId },
    });

    res.status(200).json({ message: "Follow successful" });
  } catch (error) {
    res.status(500).json({ message: "Error following user", error });
  }
});

module.exports = userRoute;
