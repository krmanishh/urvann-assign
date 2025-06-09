import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asynchandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"



const getAllVideos = asynchandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    const filter = {}
    if(query?.trim()){
      filter.title = { $regex: query, $options: "i" }
    }
    if(userId && isValidObjectId(userId)){
      filter.owner = userId
    }
    const sort = {}
    if(sortBy?.trim() && sortType?.trim()){
      sort[sortBy] = sortType === "asc" ? 1 : -1
    } else {
      sort.createdAt = -1 // default sort by createdAt desc
    } 
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort
    }
    const videos = await Video.paginate(filter, options)
    if(!videos){
      throw new ApiError(404, "Videos not found")
    }
    return res
    .status(200)
    .json(
      new ApiResponse(200, videos, "Videos fetched successfully")
    )
})



const publishAVideo = asynchandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title?.trim() || !description?.trim()) {
    throw new ApiError(404, "Title and description are required");
  }

  console.log("FILES RECEIVED:", req.files);

  if (!req.files?.video || !req.files?.thumbnail) {
    throw new ApiError(404, "Both video and thumbnail files are required");
  }

  const videoFilePath = req.files.video[0].path;
  const thumbnailFilePath = req.files.thumbnail[0].path;

  const videoResult = await uploadOnCloudinary(videoFilePath, "video");
  const thumbnailResult = await uploadOnCloudinary(thumbnailFilePath, "image");

  

  if (!videoResult?.secure_url) {
    throw new ApiError(500, "Failed to upload video");
  }

  if (!thumbnailResult?.secure_url) {
    throw new ApiError(500, "Failed to upload thumbnail");
  }

  const video = await Video.create({
    title,
    description,
    videoFiles: videoResult.secure_url, // ⬅️ Use the URL string only
    thumbnail: thumbnailResult.secure_url, // ⬅️ Use the URL string only
    duration: videoResult.duration, // ⬅️ Mongoose required field
    owner: req.user._id,
  });

  if (!video) {
    throw new ApiError(406, "Failed to create video");
  }

  return res.status(200).json(
    new ApiResponse(200, video, "Video published Successfully")
  );
});


const getVideoById = asynchandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
      throw new ApiError(404, "Video not found")
    }
    const video = await Video.findById(videoId,
      {
        title: 1,
        description: 1, 
        createdAt: 1,
        updatedAt: 1,
        owner: 1
      }
    )
    if(!video){
      throw new ApiError(404, "Can't get specified video")
    }
    return res
    .status(201)
    .json(
      new ApiResponse(201, video, "Video details fetched successfully")
    )
})

const updateVideo = asynchandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    if(!req.file){
      throw new ApiError(404, "Video Not Found")
    }
    const newVideoURL = await uploadOnCloudinary(req.file?.path)

    const updatedVideo = await Video.findByIdAndUpdate(videoId, {
      videoFiles: newVideoURL?.trim()
    }, {new: true})

    if(!updatedVideo){
      throw new ApiError(404, "Video Not found to update")
    }
    return res
    .status(201)
    .json(
      new ApiResponse(201, updatedVideo, "Video updated successfully")
    )

})

const deleteVideo = asynchandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if(!isValidObjectId(videoId)){
      throw new ApiError(404, "Video Not Found To Delete")
    }
    const deletedVideo = await Video.findByIdAndDelete(videoId, {
      videoFiles: 1
    })
    if(!deletedVideo){
      throw new ApiError(400, "Video not deleted")
    }
    return res
    .status(201)
    .json(
      new ApiResponse(201, deletedVideo,  "Video deleted succesfully")
    )
})

const togglePublishStatus = asynchandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
      throw new ApiError(404, "Video Not Found To Delete")
    }
    const video = await Video.findById(videoId)
    if(!video){     
      throw new ApiError(404, "Video Not Found")
    }
    const updatedVideo = await Video.findByIdAndUpdate(videoId, {
      isPublished: !video.isPublished
    }, {new: true})
    if(!updatedVideo){
      throw new ApiError(400, "Video publish status not updated")
    }
    return res
    .status(201)
    .json(
      new ApiResponse(201, updatedVideo, "Video publish status updated successfully")
    )
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}