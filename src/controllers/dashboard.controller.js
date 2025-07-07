import mongoose from 'mongoose';
import { Video } from '../models/video.model.js';
import { Subscription } from '../models/subscription.model.js';
import { Like } from '../models/like.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// const getChannelStats = asyncHandler(async (req, res) => {
//   const userId = req.user._id;

//   // Total videos and total views
//   const videoStats = await Video.aggregate([
//     { $match: { owner: userId } },
//     {
//       $group: {
//         _id: null,
//         totalVideos: { $sum: 1 },
//         totalViews: { $sum: '$views' },
//       },
//     },
//   ]);

//   // Total subscribers
//   const totalSubscribers = await Subscription.countDocuments({ channel: userId });

//   // Total likes
//   const totalLikes = await Like.countDocuments({ owner: userId });

//   // Extract stats from aggregation
//   const stats = {
//     totalVideos: videoStats[0]?.totalVideos || 0,
//     totalViews: videoStats[0]?.totalViews || 0,
//     totalSubscribers,
//     totalLikes,
//   };

//   return res.status(200).json(new ApiResponse(200, stats, 'Channel stats fetched successfully'));
// });

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const userId = req.user._id;

  const videos = Video.find({ owner: userId }).sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, videos, 'All videos for user'));
});

export { getChannelStats, getChannelVideos };
