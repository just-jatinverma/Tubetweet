import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { apiResponse } from '../utils/apiResponse';
import { Comment } from '../models/comment.model';

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

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(402, 'ID missing');
  }

  const { content } = req.body;

  if (!content) {
    throw new ApiError(402, 'content missing');
  }

  const userid = req.user._id;
  if (!userid) {
    throw new ApiError(402, 'User Not fount in db');
  }

  const newComment = await Comment.create({
    content,
    video: videoId,
    owner: userid,
  });

  return res.status(200).json(new apiResponse(200, newComment, 'Comments send successfully'));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(402, 'comment missing');
  }

  const { content } = req.body;

  if (!content) {
    throw new ApiError(402, 'content missing');
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not allowed to modify comment');
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    { $set: { content, wasEdited: true } },
    { new: true }
  );

  return res
    .status(200)
    .json(new apiResponse(200, updatedComment, 'Comments updated successfully'));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(402, 'comment missing');
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not allowed to modify comment');
  }
  const updatedComment = await Comment.findByIdAndDelete(commentId);

  return res
    .status(200)
    .json(new apiResponse(200, updatedComment, 'Comments deleted successfully'));
});

export { getVideoComments, addComment, updateComment, deleteComment };
