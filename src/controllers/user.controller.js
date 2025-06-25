import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/user.model.js';
import { uploadOnImageKit } from '../utils/imagekit.js';
import { apiResponse } from '../utils/apiResponse.js';

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
    throw new ApiError(409, 'user with this email or password exists ');
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

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

export { registerUser };
