import mongoose, { isValidObjectId } from 'mongoose';
import { Video } from '../models/video.model.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnImageKit, deleteFromImagekit } from '../utils/imagekit.js';

// const getAllVideos = asyncHandler(async (req, res) => {
//   const {
//     page = 1,
//     limit = 10,
//     query = '',
//     sortBy = 'createdAt',
//     sortType = 'desc',
//     userId,
//   } = req.query;

//   const matchStage = {};

//   // Text search on title or description
//   if (query) {
//     matchStage.$or = [
//       { title: { $regex: query, $options: 'i' } },
//       { description: { $regex: query, $options: 'i' } },
//     ];
//   }

//   // Filter by user ID (owner)
//   if (userId && isValidObjectId(userId)) {
//     matchStage.owner = new mongoose.Types.ObjectId(userId);
//   }

//   // Determine sort direction
//   const sortDirection = sortType === 'asc' ? 1 : -1;
//   const sortStage = { [sortBy]: sortDirection };

//   // Pagination options
//   const options = {
//     page: parseInt(page),
//     limit: parseInt(limit),
//     sort: sortStage,
//     customLabels: {
//       totalDocs: 'totalVideos',
//       docs: 'videos',
//     },
//   };

//   const aggregateQuery = Video.aggregate([{ $match: matchStage }]);

//   const results = await Video.aggregatePaginate(aggregateQuery, options);

//   return res.status(200).json(new ApiResponse(200, results, 'Videos fetched successfully'));
// });
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

  const newVideo = await Video.create({
    title,
    description,
    videoFile: videoUpload.url,
    videoFileId: videoUpload.fileId,
    thumbnail: thumbnailUpload.url,
    thumbnailId: thumbnailUpload.fileId,
    owner: req.user._id,
  });

  return res.status(200).json(new ApiResponse(200, newVideo, 'video uploaded'));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, 'bad request');
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    { $inc: { views: 1 } },
    { new: true }
  ).populate(owner);

  if (!video) {
    throw new ApiError(400, 'bad request');
  }

  return res.status(200).json(new ApiResponse(200, newVideo, 'video uploaded'));
});

const updateVideo = asyncHandler(async (req, res) => {
  //TODO: update video details li ke title, description, thumbnail
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, 'bad request');
  }

  if (!req.files || !req.files.thumbnail) {
    throw new ApiError(400, 'bad request');
  }

  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, 'bad request');
  }

  const thumbnailUpload = uploadOnImageKit(req.files.thumbnail[0].path);

  if (!thumbnailUpload) {
    throw new ApiError(400, 'bad request');
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: { title, description, thumbnail: thumbnailUpload.url },
    },
    { new: true }
  );

  if (!video) {
    throw new ApiError(400, 'bad request');
  }

  return res.status(200).json(new ApiResponse(200, newVideo, 'video uploaded'));
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

  await deleteFromImagekit(video.thumbnailFileId);
  await deleteFromImagekit(video.videoFileId);

  return res.status(200).json(new ApiResponse(200, updatedVideo, 'videos deleted successfully'));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
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

  video.isPublished = !video.isPublished;

  await video.save();

  return res.status(200).json(new ApiResponse(200, video, 'toggled successfully'));
});

export { getAllVideos, publishAVideo, getVideoById, updateVideo, deleteVideo, togglePublishStatus };
