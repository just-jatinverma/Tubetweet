import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { apiResponse } from '../utils/apiResponse';
import { Tweet } from '../models/tweet.model';

const createTweet = asyncHandler(async (req, res) => {});
const getUserTweets = asyncHandler(async (req, res) => {});
const updateTweet = asyncHandler(async (req, res) => {});
const deleteTweet = asyncHandler(async (req, res) => {});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
