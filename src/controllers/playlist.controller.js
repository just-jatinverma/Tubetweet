import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiError';
import { apiResponse } from '../utils/apiResponse';
import { Playlist } from '../models/playlist.model';

const createPlaylist = asyncHandler(async (req, res) => {});

const getUserPlaylists = asyncHandler(async (req, res) => {});

const getPlaylistById = asyncHandler(async (req, res) => {});

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
