import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { apiResponse } from '../utils/apiResponse';
import { Tweet } from '../models/tweet.model';
import mongoose from 'mongoose';

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const userId = req.user._id;

  if (!content) {
    throw new ApiError(400, 'Empty');
  }

  const tweet = await Tweet.create({
    content,
    owner: userId,
  });

  return res.status(200).json(new apiResponse(200, tweet, 'tweet created'));
});
const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.isValidObjectId(userId)) {
    throw new ApiError(404, 'not a valid id');
  }

  const tweet = await Tweet.find({ owner: userId }).sort({ createdAt: -1 });

  return res.status(200).json(new apiResponse(200, tweet, 'All tweets'));
});
const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.isValidObjectId(tweetId)) {
    throw new ApiError(404, 'not a valid id');
  }

  if (!content) {
    throw new ApiError(400, 'content empty');
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(400, 'tweet Not found');
  }

  if (tweet.owner.toString() != userId.toString()) {
    throw new ApiError(403, 'forbidden');
  }

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: { content },
    },
    { new: true }
  );

  return res.status(200).json(new apiResponse(200, updatedTweet, 'tweet updated'));
});
const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const userId = req.user._id;

  if (!mongoose.Types.isValidObjectId(tweetId)) {
    throw new ApiError(404, 'not a valid id');
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(400, 'tweet Not found');
  }

  if (tweet.owner.toString() != userId.toString()) {
    throw new ApiError(403, 'forbidden');
  }

  await Tweet.findByIdAndDelete(tweetId);

  return res.status(200).json(new apiResponse(200, {}, 'tweet deleted'));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
