import { Router } from 'express';
import {
  loginUser,
  logOutUser,
  refreshAccessToken,
  registerUser,
  changePassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  watchHistory,
} from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/register').post(
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1,
    },
    {
      name: 'coverImage',
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route('/login').post(loginUser);

router.route('/logout').post(verifyJWT, logOutUser);

router.route('/refresh-token').post(verifyJWT, refreshAccessToken);

router.route('/change-password').post(verifyJWT, changePassword);

router.route('/current-user').get(verifyJWT, getCurrentUser);

router.route('./update-details').patch(verifyJWT, updateAccountDetails);

router.route('./avatar').patch(verifyJWT, upload.single('avatar'), updateUserAvatar);

router.route('./cover-Image').patch(verifyJWT, upload.single('coverImage'), updateUserCoverImage);

router.route('/c/:username').get(verifyJWT, getUserChannelProfile);

router.route('./watch-history').get(verifyJWT, watchHistory);

export default router;
