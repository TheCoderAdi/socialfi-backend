import prisma from "../config/prisma";
import { ErrorHandler, TryCatch } from "../utils/error";
import { deleteFile } from "../utils/helper";

/**
 * @desc Get User Profile
 * @route GET /api/v1/users/:id
 */
export const getUserProfile = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new ErrorHandler("User ID is required", 400));
  }

  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
    omit: {
      password_hash: true,
    },
  });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

/**
 * @desc Update User Profile
 * @route PUT /api/v1/users/:id
 */
export const updateProfile = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { username, bio } = req.body ?? {};

  if (Number(id) !== req?.user?.id) {
    return next(new ErrorHandler("You can only update your own profile", 403));
  }

  const data = {
    username: undefined,
    bio: undefined,
    profile_picture_url: "",
  };

  if (username) data.username = username;
  if (bio) data.bio = bio;

  if (req.file) {
    if (req.user?.profile_picture_url) {
      const oldImage = "src/uploads/" + req.user?.profile_picture_url;
      if (oldImage) {
        deleteFile(oldImage);
      }
    }
    data.profile_picture_url = req.file.filename;
  }

  const user = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data,
  });

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});

/**
 * @desc Get User Followers
 * @route GET /api/v1/users/:id/followers
 */
export const getFollowers = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new ErrorHandler("User ID is required", 400));
  }

  const followers = await prisma.follow.findMany({
    where: {
      following_id: Number(id),
    },
    include: {
      follower: {
        omit: {
          password_hash: true,
        },
      },
    },
  });

  return res.status(200).json({
    success: true,
    followers,
  });
});

/**
 * @desc Get User Following
 * @route GET /api/v1/users/:id/following
 */
export const getFollowings = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new ErrorHandler("User ID is required", 400));
  }

  const followings = await prisma.follow.findMany({
    where: {
      follower_id: Number(id),
    },
    include: {
      following: {
        omit: {
          password_hash: true,
        },
      },
    },
  });

  return res.status(200).json({
    success: true,
    followings,
  });
});

/**
 * @desc Follow User
 * @route POST /api/v1/users/:id/follow
 */
export const followUser = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new ErrorHandler("User ID is required", 400));
  }

  if (Number(id) === req.user?.id) {
    return next(new ErrorHandler("You cannot follow yourself", 400));
  }

  const existingFollow = await prisma.follow.findFirst({
    where: {
      follower_id: req.user?.id as number,
      following_id: Number(id),
    },
  });

  if (existingFollow) {
    return next(new ErrorHandler("You are already following this user", 400));
  }

  const follow = await prisma.follow.create({
    data: {
      follower_id: req.user?.id as number,
      following_id: Number(id),
    },
  });

  return res.status(200).json({
    success: true,
    message: "Followed successfully",
    follow,
  });
});

/**
 * @desc Unfollow User
 * @route DELETE /api/v1/users/:id/unfollow
 */
export const unfollowUser = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new ErrorHandler("User ID is required", 400));
  }

  if (Number(id) === req.user?.id) {
    return next(new ErrorHandler("You cannot unfollow yourself", 400));
  }

  const existingFollow = await prisma.follow.findFirst({
    where: {
      follower_id: req.user?.id as number,
      following_id: Number(id),
    },
  });

  if (!existingFollow) {
    return next(new ErrorHandler("You are not following this user", 400));
  }

  const unfollow = await prisma.follow.deleteMany({
    where: {
      follower_id: req.user?.id as number,
      following_id: Number(id),
    },
  });

  return res.status(200).json({
    success: true,
    message: "Unfollowed successfully",
    unfollow,
  });
});
