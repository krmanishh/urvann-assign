import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { appendFile } from "fs"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    if(!videoId){
      throw new ApiError(400, "Video ID is required")
    }
    const comments = await Comment.find({videoId})
    .populate("userId", "name")
    .skip((page - 1) * limit)
    .limit(limit)
    
    return res
    .status(200)
    .json(
      new ApiResponse(200, comments, "Comments fetched successfully")
    ) 
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {content} = req.body
    if(!videoId || !content){
      throw new ApiError(400, "Video Id and Comment are required")
    }
    const comment  = await Comment.create({
      videoId,
      content,
      userId: req.user._id
    }
  )
  if(!comment){
    throw new ApiError(400, "Failed to add comment")
  }
  return res
  .status(201)
  .json(
    new ApiResponse(201, comment, "Comment added successfully")
  )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const{ commentId, userId } = req.params
    const{ content } = req.body
    if(!commentId && !content?.trim()){
      throw new ApiError(400, "Invalid request")
    }
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      throw new ApiError(400, "Invalid Comment ID");
    }
    const updatingComment = await Comment.findOneAndUpdate({
      _id: commentId,
      owner: req.user._id
    },{
      content,
    },{
      new: true
    })
    if(!updatingComment){
      throw new ApiError(404, "Comment or User not found")
    }
    return res
    .status(200)
    .json(
      new ApiResponse(200, updatingComment, "Comment updated successfully")
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId, userId } = req.params
    if(!mongoose.Types.ObjectId.isValid(userId)){
      throw new ApiError(400, "Not allowed to update the comment")
    }
    if(!commentId){
      throw new ApiError(404, "Comment not found")
    }
    const deletedComment = await Comment.findByIdAndUpdate({
      _id: commentId,
      owner: req.params.usesr._id
    }, {
      $pull:{
        comments: commentId,
      }
    }, {new: true})
    if(!deletedComment){
      throw new ApiError(404, "Comment not Found")
    }
    return res
    .status(200)
    .json(
      new ApiResponse(201 ,deletedComment, "Comment deleted successfully")
    )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }