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

//secure routes

router.use(verifyJWT);

router.route('/logout').post(logOutUser);

router.route('/refresh-token').post(refreshAccessToken);

router.route('/change-password').post(changePassword);

router.route('/current-user').get(getCurrentUser);

router.route('/update-details').patch(updateAccountDetails);

router.route('/avatar').patch(upload.single('avatar'), updateUserAvatar);

router.route('/cover-image').patch(upload.single('coverImage'), updateUserCoverImage);

router.route('/c/:username').get(getUserChannelProfile);

router.route('/watch-history').get(watchHistory);

export default router;
