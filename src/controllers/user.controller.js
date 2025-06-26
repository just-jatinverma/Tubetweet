import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/user.model.js';
import { uploadOnImageKit } from '../utils/imagekit.js';
import { apiResponse } from '../utils/apiResponse.js';
import jwt from 'jsonwebtoken';

const generateAccessTokenandRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, 'something went wrong while generating tokens');
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // take details from user
  // validate the user
  // check the user is already present or not
  // check for images, check for avatar
  // upload it to image kit, avatar
  // crete use object , DB entry
  // remove password snd refresh token
  // check fot user creation
  // check for response

  const { userName, email, fullName, password } = req.body;
  console.log(`userName ${userName} email ${email} name ${fullName} password ${password}`);

  if ([userName, email, fullName, password].some((field) => field?.trim() === '')) {
    throw new ApiError(400, 'all fields are required');
  }

  const existingUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, 'user with this email or username exists ');
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;

  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, 'Avatar is required ');
  }

  const Avatar = await uploadOnImageKit(avatarLocalPath);
  const coverImage = await uploadOnImageKit(coverImageLocalPath);

  if (!Avatar) {
    throw new ApiError(400, 'Avatar is required ');
  }

  const user = await User.create({
    userName,
    email,
    fullName,
    password,
    avatar: Avatar.url,
    coverImage: coverImage?.url || '',
  });

  const createdUser = await User.findById(user._id).select('-password -refreshToken');

  if (!createdUser) {
    throw new ApiError(500, 'something went wrong while registering the user ');
  }

  return res.status(201).json(new apiResponse(200, createdUser, 'user registered successfully'));
});

const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  // username or email
  //find the user
  //password check
  //access and refresh token
  //send cookie
  const { userName, email, password } = req.body;

  if (!userName && !email) {
    throw new ApiError(404, 'username or email is invalid');
  }

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "user don't exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(404, 'incorrect password');
  }

  const { accessToken, refreshToken } = await generateAccessTokenandRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

  const options = {
    httpOnly: true,
    secure: false,
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        'user logged in success fully'
      )
    );
});

const logOutUser = asyncHandler(async (req, res) => {
  await User.findOneAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: false,
  };

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new apiResponse(200, {}, 'User Logged Out successfully'));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, 'unauthorized request');
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, 'refresh token is expired or used');
    }

    const options = {
      httpOnly: true,
      secure: false,
    };

    const { accessToken, newRefreshToken } = await generateAccessTokenandRefreshToken(user._id);

    return res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', newRefreshToken, options)
      .json(
        new apiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          'Access token updated successfully'
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || 'invalid refresh token');
  }
});

export { registerUser, loginUser, logOutUser, refreshAccessToken };
