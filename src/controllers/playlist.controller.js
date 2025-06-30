import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiError';
import { apiResponse } from '../utils/apiResponse';
import { Playlist } from '../models/playlist.model';

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user._id;

  if (!name) {
    throw new ApiError(400, 'name not found');
  }

  const playlist = await Playlist.create({
    name,
    description: description,
    videos: [],
    owner: userId,
  });

  return res.status(200).json(new apiResponse(200, playlist, 'blank playlist created'));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const playlists = await Playlist.find({ owner: userId }).sort({ createdAt: -1 });

  return res.status(200).json(new apiResponse(200, playlists, 'All playlists for user'));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const playlist = await Playlist.findById(playlistId).populate('videos');

  if (!playlist) {
    throw new ApiError(40, 'Playlist not found');
  }

  return res.status(200).json(new apiResponse(200, playlist, 'requested playlist'));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { videoId, playlistId } = req.params;
  const userId = req.user._id;

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, 'playlist not found');
  }

  if (playlist.owner.toString() != userId.toString()) {
    throw new ApiError(403, 'forbidden');
  }

  if (playlist.videos.some((id) => id.toString() === videoId.toString())) {
    throw new ApiError(400, 'already in playlist');
  } else {
    playlist.videos.push(videoId);
  }

  await playlist.save();

  return res.status(200).json(new apiResponse(200, playlist, 'new playlist'));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { videoId, playlistId } = req.params;
  const userId = req.user._id;

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, 'playlist not found');
  }

  if (playlist.owner.toString() != userId.toString()) {
    throw new ApiError(403, 'forbidden');
  }

  const indexOFVideo = playlist.videos.findIndex((id) => id.toString() === videoId.toString());

  if (indexOFVideo === -1) {
    throw new ApiError(400, 'Video not found in playlist');
  }

  playlist.videos.splice(indexOFVideo, 1);

  await playlist.save();

  return res.status(200).json(new apiResponse(200, playlist, 'removed from playlist'));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const userId = req.user._id;

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, 'playlist not found');
  }

  if (playlist.owner.toString() != userId.toString()) {
    throw new ApiError(403, 'forbidden');
  }

  await Playlist.findByIdAndDelete(playlistId);

  return res.status(200).json(new apiResponse(200, {}, 'playlist deleted'));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const userId = req.user._id;

  const { name, description } = req.body;

  if (!name && !description) {
    throw new ApiError(400, 'At least one field is required');
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, 'playlist not found');
  }

  if (playlist.owner.toString() != userId.toString()) {
    throw new ApiError(403, 'forbidden');
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: { name, description },
    },
    { new: true }
  );

  return res.status(200).json(new apiResponse(200, updatedPlaylist, 'playlist updated'));
});

export {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
};
