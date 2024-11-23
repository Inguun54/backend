const Route = require("express");
const commentModel = require("../Module/commentSchema");
const postModel = require("../Module/postSchema");
const commentRoute = Route();
commentRoute.post('/writeComment', async(req, res) => {
    try {
            const { comment, postId, userId } = req.body;
    
    const newComment = await commentModel.create({
        comment,
        postId,
        userId
    });

    await postModel.findByIdAndUpdate(postId, {
        $addToSet: newComment._id
    })

    res.status(200).json(respond)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
    })


module.exports = commentRoute;