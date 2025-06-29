import { Like } from '../models/like.model';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiError';
import { apiResponse } from '../utils/apiResponse';
import { Video } from '../models/videos.model';
import mongoose from 'mongoose';

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(404, 'video not found');
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, 'video not found');
  }

  const existingLike = await Like.findOne({ video: videoId, likedBy: userId });

  let isLiked;

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    isLiked = false;
  } else {
    await Like.create({ video: videoId, likedBy: userId });
    isLiked = true;
  }

  return res.status(200).json(new apiResponse(200, { isLiked }, isLiked ? 'Liked' : 'unLiked'));
});

const toggleCommentLike = asyncHandler(async (req, res) => {});

const toggleTweetLike = asyncHandler(async (req, res) => {});

const getLikedVideos = asyncHandler(async (req, res) => {});

export { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos };
