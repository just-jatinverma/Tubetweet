import { Like } from '../models/like.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Video } from '../models/videos.model.js';
import { Comment } from '../models/comment.model.js';
import { Tweet } from '../models/tweet.model.js';
import mongoose from 'mongoose';

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.isValidObjectId(videoId)) {
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

  return res.status(200).json(new ApiResponse(200, { isLiked }, isLiked ? 'Liked' : 'unLiked'));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(404, 'Invalid Comment Id');
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, 'Comment not found');
  }

  const existingLike = await Like.findOne({ comment: commentId, likedBy: userId });

  let isLiked;

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    isLiked = false;
  } else {
    await Like.create({ comment: commentId, likedBy: userId });
    isLiked = true;
  }

  return res.status(200).json(new ApiResponse(200, { isLiked }, isLiked ? 'Liked' : 'unLiked'));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(404, 'Invalid tweet Id');
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, 'tweet not found');
  }

  const existingLike = await Like.findOne({ tweet: tweetId, likedBy: userId });

  let isLiked;

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    isLiked = false;
  } else {
    await Like.create({ tweet: tweetId, likedBy: userId });
    isLiked = true;
  }

  return res.status(200).json(new ApiResponse(200, { isLiked }, isLiked ? 'Liked' : 'unLiked'));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const likedVideos = await Like.find({ likedBy: userId, video: { $exists: true } }).populate({
    path: 'video',
    populate: { path: 'owner', select: '-password -refreshToken' },
  });

  return res.status(200).json(new ApiResponse(200, likedVideos, 'all liked videos'));
});

export { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos };
