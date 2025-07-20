import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import { Subscription } from '../models/subscriptions.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.isValidObjectId(channelId)) {
    throw new ApiError(404, 'Invalid Id');
  }

  if (channelId === userId.toString()) {
    throw new ApiError(400, 'You cannot subscribe to yourself');
  }
  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, 'Channel not found');
  }

  const subscribed = await Subscription.findOne({ channel: channelId, subscriber: userId });

  let isSubscribed;

  if (subscribed) {
    await Subscription.findByIdAndDelete(subscribed._id);
    isSubscribed = false;
  } else {
    await Subscription.create({ channel: channelId, subscriber: userId });
    isSubscribed = true;
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { isSubscribed }, isSubscribed ? 'Subscribed' : 'Unsubscribed'));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!mongoose.Types.isValidObjectId(channelId)) {
    throw new ApiError(404, 'Invalid Id');
  }

  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, 'Channel not found');
  }

  const subscribers = await Subscription.find({ channel: channelId }).populate('subscriber');

  return res
    .status(200)
    .json(new ApiResponse(200, subscribers, 'subscribers fetched successfully'));
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.isValidObjectId(userId)) {
    throw new ApiError(404, 'Invalid Id');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'Channel not found');
  }

  const subscribedChannels = await Subscription.find({ subscriber: userId }).populate('channel');

  return res
    .status(200)
    .json(new ApiResponse(200, subscribedChannels, 'subscribed channels fetched successfully'));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
