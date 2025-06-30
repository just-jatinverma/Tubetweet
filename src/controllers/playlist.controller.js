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

const addVideoToPlaylist = asyncHandler(async (req, res) => {});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {});

const deletePlaylist = asyncHandler(async (req, res) => {});

const updatePlaylist = asyncHandler(async (req, res) => {});

export {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
};
