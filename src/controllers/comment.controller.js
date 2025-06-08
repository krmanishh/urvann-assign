import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { asynchandler } from "../utils/asyncHandler.js"

const getVideoComments = asynchandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
})

const addComment = asynchandler(async (req, res) => {
    // TODO: add a comment to a video
    const commentId = req.params
    const {content} = req.body
    if(!videoId || !content) {
        throw new ApiError(400, "Video ID and content are required")
    }
    const addedComment = await Comment.create({
      content,
      commentId: req.comment._id,
      owner: req.user._id
    })
    if(!addedComment) {
        throw new ApiError(500, "Failed to add comment")
    }
    return res
    .status(200)
    .json(
      new ApiResponse(200, addedComment, "Comment added successfully")
    )
})
  
const updateComment = asynchandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {content} = req.body
    if(!mongoose.isValidObjectId(commentId) || !content) {
        throw new ApiError(400, "Invalid comment ID or content")
    } 

    const updatedComment = await Comment.findOneAndUpdate(
      {
        _id: commentId,
        owner: req.user._id
      },  
      {
        $set:{
          content,
        }
      }, {new:true}
    )
    if(!updatedComment) {
        throw new ApiError(404, "Comment not found or you do not have permission to update it")
    }
  return res
  .status(200)
  .json(
    new ApiResponse(200, updatedComment, "Comment updated successfully")
  )
})

const deleteComment = asynchandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params
    if(!commentId){
      throw new ApiError(402, "Comment not found")
    }
    const commentToDelete = await Comment.findOneAndDelete(
      {
        _id: commentId,
        owner: req.user._id
      }
    )
    if(!commentToDelete){
      throw new ApiError(400, "Comment not found or you don't have access to delete it")
    }
    return res
    .status(200)
    .json(
      new ApiResponse(200, commentToDelete, "Comment deleted successfully")
    )
})

export {
  getVideoComments, 
  addComment, 
  updateComment,
  deleteComment
}
