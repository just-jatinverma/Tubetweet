import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiError';
import { apiResponse } from '../utils/apiResponse';
import { Comment } from '../models/comment.model';
import { ReturnDocument } from 'mongodb';

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(402, 'ID missing');
  }

  const comments = await Comment.find({ video: videoId }).populate(
    'owner',
    'fullName userName avatar'
  );

  return res.status(200).json(new apiResponse(200, comments, 'Comments send successfully'));
});

const addComment = asyncHandler(async (req, res) => {});

const updateComment = asyncHandler(async (req, res) => {});

const deleteComment = asyncHandler(async (req, res) => {});

export { getVideoComments, addComment, updateComment, deleteComment };
