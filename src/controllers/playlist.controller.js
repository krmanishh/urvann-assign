import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    const {userId} = req.params
    if (!name || !description) {
      throw new ApiError(400, "Name and description are required");
    }

    if(!mongoose.Types.ObjectId.isValid(userId)){
      throw new ApiError(400, "Invalid user id")
    }

    const playlist = await Playlist.create({
      name, 
      description,
      owner: userId
    })
    
    if(!playlist){
      throw new ApiError(400, "Failed to create playlist")
    }

    return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Playlist created successfully")
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(!mongoose.Types.ObjectId.isValid(userId)){
      throw new ApiError(404, "User Not Found")
    }
    const userPlaylist = await Playlist.find({owner: userId}, {
      name:1, 
      description:1,
      createdAt:1,
      updatedAt:1
    })
    if(!userPlaylist || userPlaylist.length === 0){
      throw new ApiError(404, "No playlists found for this user")
    }
    return res.status(200)
    .json(
      new ApiResponse(200, userPlaylist, "User playlist fetched successfully")
    )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    const {userId} = req.params
    if(!mongoose.Types.ObjectId.isValid(playlistId)){
      throw new ApiError(404, "Playlist not found")
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, "Invalid user ID");
    } 
    const playlist = await Playlist.findOne({
      _id: playlistId,
      owner: userId
    },{
      name: 1,
      description: 1,
      videos: 1,
      createdAt: 1,
      updatedAt: 1
    })
    if(!playlist){
      throw new ApiError(404, "Playlist not found or you do not have permission to view it")
    }
    return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "User Playlist Fetched Successfully")
    )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!playlistId || !videoId){
      throw new ApiError(400, "Playlist or Video is missing")
    }
    const addVideo = await Playlist.findByIdAndUpdate(playlistId, {
      $addToSet:{
        videos: videoId
      }
    }, {new: true})
    if(!addVideo){
      throw new ApiError(404, "Playlist not found or you do not have permission to add video")  
    }
    return res
    .status(200)
    .json(
      new ApiResponse(200, addVideo, "Video added to playlist")
    );
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if(!playlistId || !videoId){
      throw new ApiError(400, "Playlist or Video is missing")
    }
    const removeVideo = await Playlist.findByIdAndUpdate(
      {
        _id: playlistId,
        owner: req.params.userId
      },
      {
        $pull: {
          videos: videoId
        }
      },
      {new: true}
    )
    if(!removeVideo){
      throw new ApiError(404, "Playlist not found or you do not have permission to remove video")
    }
    return res.status(200)
    .json(
      new ApiResponse(200, removeVideo, "Video removed from playlist")
    )
  })
const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    const {userId} = req.params
    if(!playlistId || ! userId){
      throw new ApiError(404, "Playlist or User not found")
    }
    const playlistDelete = await Playlist.findOneAndDelete({
      _id: playlistId,
      owner: userId
    })
    if(!playlistDelete){
      throw new ApiError(404, "Playlist not found or you do not have permission to delete it")
    } 
    return res
    .status(200)
    .json(
      new ApiResponse(200, playlistDelete, "Playlist deleted successfully")
    )

})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if(!playlistId || !name || !description){
      throw new ApiError(400, "Playlist, name and description are required")
    }
    const playlist = await Playlist.findByIdAndUpdate({
      _id: playlistId,
      owner: req.params.userId
    }, {
      name,
      description,
    }, {new: true})
    if(!playlist){
      throw new ApiError(404, "Playlist not found or you do not have permission to update it")
    }
    return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Playlist updated successfully")
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}