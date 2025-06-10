import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { asynchandler } from "../utils/asyncHandler.js"

const createTweet = asynchandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body
    if(!content){
      throw new ApiError(400, "Invalid Request")
    }
    const createdTweet = await Tweet.create(
      {
        owner: req.user._id,
        content,
      }
    )
    if(!createdTweet){
      throw new ApiError(404, "Tweet Not Found")
    }
    return res.status(200)
    .json(
      new ApiResponse(202, createdTweet, "Tweet Created Successfully")
    )
})

const getUserTweets = asynchandler(async (req, res) => {
  console.log("Logged-in user:", req.user);

  const owner = req.user._id;

  if (!isValidObjectId(owner)) {
    throw new ApiError(400, "Invalid User ID");
  }
  
  const userTweets = await Tweet.find(
    { owner },
    {
      content: 1,
      createdAt: 1,
      updatedAt: 1,
    }
  ).populate("owner", "name username");

  console.log("Tweets found:", userTweets);

  return res
    .status(200)
    .json(new ApiResponse(200, userTweets, "User Tweets fetched successfully"));
});

const updateTweet = asynchandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params
    const {content} = req.body
    if(!isValidObjectId(tweetId)){
      throw new ApiError(404, "Tweet Not Found")
    }
    if(!content?.trim()){
      throw new ApiError(404, "Content Not Found to update")
    }
    const updatedTweet = await Tweet.findOneAndUpdate({
      _id: tweetId,
      owner: req.user._id
    },{
      content,
    },{ new: true })
    if(!updatedTweet){
      throw new ApiError(400, "Tweet not updated")
    }
    return res
    .status(200)
    .json(
      new ApiResponse(200, updatedTweet, "Tweet updated succesfully")
    )

})

const deleteTweet = asynchandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params
    if(!isValidObjectId(tweetId)){
      throw new ApiError(404, "Tweet not found to delete")
    }
    const deletedtweet = await Tweet.findOneAndDelete(
      {
        _id: tweetId,
        owner: req.user._id
      }
    )
    if(!deletedtweet){
      throw new ApiError(402, "Tweet not deleted")
    }
    return res
    .status(200)
    .json(
      new ApiResponse(200, deletedtweet, "Tweet deleted sucessfully")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}

