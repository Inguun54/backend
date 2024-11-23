const Route = require("express");
const userModel = require("../Module/userSchema");
const postModel = require("../Module/postSchema")

const userRoute = Route();

userRoute.post("/signup", async (req , res) => {
try {
    const { username, password, email, profileImage} = req.body
    console.log(username)

    const response = await userModel.create({
            username,
            password,
            email,
            profileImage,
        });
        res.status(200).json(response);
} catch (error) {
        res.status(500).json(error);
}
});

userRoute.get("/user/posts", async (req,res) => {
 try {
        const posts = await userModel.find().populate("posts", "email username _id");   
        res.status(200).json(posts)
 } catch (error) {
    
 }
})

userRoute.post('/user/follow', async (req, res) => {
 console.log(req.body)

 try {
        const { followingUserId , followedUserId } = req.body;
       await  userModel.findByIdAndUpdate(followingUserId, {
                $addToSet: {
                 following: followedUserId,
                },
         });
        await  userModel.findByIdAndUpdate(followedUserId, {
                $addToSet: {
                 followers: followingUserId,
                },
          })
          res.status(200).json("succesful")    
        } catch (error) {
                console.log(error)
         throw new Error(error)
        }
})
module.exports = userRoute;