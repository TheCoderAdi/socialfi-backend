import prisma from "../config/prisma";

import { ErrorHandler, TryCatch } from "../utils/error";

/**
 * @description Add a comment to a post
 * @route POST /api/posts/:id/comments
 */
export const addComment = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { text } = req.body ?? {};

  if (!text) {
    return next(new ErrorHandler("Comment text is required", 400));
  }

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

  const comment = await prisma.comment.create({
    data: {
      text,
      post_id: Number(id),
      user_id: req.user?.id as number,
    },
  });

  return res.status(201).json({
    success: true,
    message: "Comment added successfully",
    data: comment,
  });
});

/**
 * @description Get all comments for a post
 * @route GET /api/posts/:id/comments
 */

export const getComments = TryCatch(async (req, res, next) => {
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

  const comments = await prisma.comment.findMany({
    where: {
      post_id: Number(id),
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });

  return res.status(200).json({
    success: true,
    message: "Comments fetched successfully",
    data: comments,
  });
});
