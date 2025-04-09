import prisma from "../config/prisma";

import { TryCatch } from "../utils/error";
import { ErrorHandler } from "../utils/error";

/**
 * @description Like a post
 * @route POST /api/v1/posts/:id/like
 */
export const likePost = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new ErrorHandler("Post id is required", 400));
  }

  const post = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }

  const alreadyLiked = await prisma.like.findFirst({
    where: {
      post_id: Number(id),
      user_id: req.user?.id as number,
    },
  });

  if (alreadyLiked) {
    return next(new ErrorHandler("You have already liked this post", 400));
  }

  const like = await prisma.like.create({
    data: {
      post_id: Number(id),
      user_id: req.user?.id as number,
    },
  });

  return res.status(201).json({
    success: true,
    message: "Post liked successfully",
    data: like,
  });
});

/**
 * @description Unlike a post
 * @route DELETE /api/v1/posts/:id/like
 */

export const unlikePost = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new ErrorHandler("Post id is required", 400));
  }

  const post = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }

  const alreadyDisLiked = await prisma.like.findFirst({
    where: {
      post_id: Number(id),
      user_id: req.user?.id as number,
    },
  });

  if (!alreadyDisLiked) {
    return next(new ErrorHandler("You have not liked this post", 400));
  }

  const unlike = await prisma.like.deleteMany({
    where: {
      post_id: Number(id),
      user_id: req.user?.id as number,
    },
  });

  return res.status(200).json({
    success: true,
    message: "Post unliked successfully",
    data: unlike,
  });
});
