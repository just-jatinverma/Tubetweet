import mongoose, { isValidObjectId } from 'mongoose';
import { Video } from '../models/video.model.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnImageKit, deleteFromImagekit } from '../utils/imagekit.js';

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!req.files || !req.files.videoFile || !req.files.thumbnail) {
    throw new ApiError(400, 'bad request');
  }

  if (!title || !description) {
    throw new ApiError(400, 'bad request');
  }

  const videoUpload = uploadOnImageKit(req.files.videoFile[0].path);
  const thumbnailUpload = uploadOnImageKit(req.files.thumbnail[0].path);

  if (!videoUpload || !thumbnailUpload) {
    throw new ApiError(400, 'bad request');
  }

  const newVideo = await Video.create();
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, 'bad request');
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(402, 'video missing');
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not allowed to modify video');
  }
  const updatedVideo = await Video.findByIdAndDelete(videoId);

  deleteFromImagekit;

  return res.status(200).json(new ApiResponse(200, updatedVideo, 'videos deleted successfully'));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export { getAllVideos, publishAVideo, getVideoById, updateVideo, deleteVideo, togglePublishStatus };
